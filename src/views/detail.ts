import { h } from '../dom.ts';
import { blended, longPriceOf, MODE_LABEL, MODES, priceOf, supports, tokens, usd } from '../data.ts';
import { MAX_COMPARE, state, toggleCompare } from '../state.ts';
import type { BenchmarkScores, Model, Scope, Tier, TokenKind } from '../types.ts';

const KINDS: [TokenKind, string][] = [['input', 'Input'], ['output', 'Output'], ['cacheRead', 'Cache read'], ['cacheWrite', 'Cache write'], ['cacheWrite1h', 'Cache write 1h']];
const TIERS: Tier[] = ['standard', 'batch', 'priority', 'flex'];
const SCOPES: [Scope, string][] = [['regional', 'In-region / Geo CRIS'], ['global', 'Global CRIS']];
const BENCH: [keyof BenchmarkScores, string, number][] = [
  ['intelligenceIndex', 'Intelligence Index', 100], ['codingIndex', 'Coding Index', 100], ['mathIndex', 'Math Index', 100],
  ['mmluPro', 'MMLU-Pro', 1], ['gpqa', 'GPQA Diamond', 1], ['hle', "Humanity's Last Exam", 1], ['liveCodeBench', 'LiveCodeBench', 1], ['scicode', 'SciCode', 1], ['aime', 'AIME', 1], ['math500', 'MATH-500', 1],
];

export function renderDetail(models: Model[], id: string): HTMLElement {
  const m = models.find((x) => x.id === id);
  if (!m) return h('main', null, h('p', null, '모델을 찾을 수 없습니다. '), h('a', { href: '#/' }, '← 목록으로'));

  const lc = m.longContext;
  const cacheKinds = KINDS.filter(([k]) => m.regions.some((r) => SCOPES.some(([s]) => TIERS.some((t) => priceOf(m, r, s, t, k) !== undefined || longPriceOf(m, r, s, t, k) !== undefined))));
  const bands: [boolean, string][] = lc ? [[false, '기본'], [true, lc.thresholdTokens ? `>${tokens(lc.thresholdTokens)}` : '장문']] : [[false, '']];
  const matrix = h('table', null,
    h('thead', null, h('tr', null, h('th', null, `${state.region} · 추론 범위 / 티어${lc ? ' / 프롬프트 길이' : ''}`), ...cacheKinds.map(([, l]) => h('th', { class: 'num' }, l)), h('th', { class: 'num' }, '4:1 혼합'))),
    h('tbody', null, ...SCOPES.flatMap(([scope, sl]) => TIERS.flatMap((tier) => bands.map(([long, bl]) => {
      const get = (k: TokenKind) => (long ? longPriceOf(m, state.region, scope, tier, k) : priceOf(m, state.region, scope, tier, k));
      const vals = cacheKinds.map(([k]) => get(k));
      if (vals.every((v) => v === undefined)) return null;
      return h('tr', { class: long ? 'long' : '' }, h('td', null, `${sl} · ${tier}${bl ? ` · ${bl}` : ''}`), ...vals.map((v) => h('td', { class: 'num' + (v === undefined ? ' na' : '') }, usd(v))),
        h('td', { class: 'num' }, usd(blended(get('input'), get('output')))));
    })))));

  const regionRows = m.regions.map((r) => {
    const s = priceOf(m, r, 'regional', 'standard', 'input');
    const g = priceOf(m, r, 'global', 'standard', 'input');
    return h('tr', null, h('td', null, r), h('td', { class: 'num' }, usd(s)), h('td', { class: 'num' }, usd(priceOf(m, r, 'regional', 'standard', 'output'))), h('td', { class: 'num' }, usd(g)), h('td', { class: 'num' }, usd(priceOf(m, r, 'global', 'standard', 'output'))));
  });

  const b = m.benchmarks;
  const bench = b
    ? h('div', { class: 'bars' }, ...BENCH.filter(([k]) => b[k] !== undefined).map(([k, label, scale]) => {
        const v = b[k] as number;
        const peers = models.map((x) => x.benchmarks?.[k]).filter((x): x is number => x !== undefined).sort((a, c) => a - c);
        const pct = peers.length ? Math.round((peers.filter((x) => x <= v).length / peers.length) * 100) : 0;
        const shown = scale === 1 ? `${(v * 100).toFixed(1)}%` : v.toFixed(1);
        return h('div', { class: 'bar' }, h('span', null, label), h('div', { class: 'track', title: `Bedrock 모델 중 상위 ${100 - pct}%` }, h('i', { style: `width:${Math.min(100, v * (scale === 1 ? 100 : 1))}%` })), h('b', null, shown), h('small', null, `p${pct}`));
      }),
      b.outputTokensPerSecond !== undefined ? h('p', { class: 'note' }, `속도 ${b.outputTokensPerSecond.toFixed(0)} tok/s · TTFT ${b.timeToFirstTokenSeconds?.toFixed(2) ?? '—'}s (Artificial Analysis 측정)`) : null)
    : h('p', { class: 'note' }, '이 모델의 벤치마크 데이터가 없습니다. (Artificial Analysis에 매칭되지 않았거나 수집이 꺼져 있음)');

  return h('main', { class: 'detail' },
    h('a', { href: '#/' }, '← 전체 목록'),
    h('h1', null, m.name, h('small', null, m.provider),
      h('button', { type: 'button', class: 'cmp wide', 'aria-pressed': state.compare.includes(m.id), disabled: !state.compare.includes(m.id) && state.compare.length >= MAX_COMPARE, onclick: () => toggleCompare(m.id) },
        state.compare.includes(m.id) ? '✓ 비교에 담김' : '＋ 비교에 추가'),
      m.card ? h('a', { class: 'cardlink', href: m.card.url, rel: 'noopener' }, 'AWS 모델 카드 ↗') : null),
    h('div', { class: 'facts' },
      h('div', null, h('span', null, 'Context window'), h('b', null, tokens(m.contextWindow))),
      h('div', null, h('span', null, 'Max output'), h('b', null, tokens(m.maxOutput))),
      h('div', null, h('span', null, `${state.region}에서 추론 방식`), h('b', { class: 'modes', title: m.availability ? 'AWS 모델 카드 기준' : 'models.dev 기준 추정 (모델 카드 없음)' },
        MODES.map((x) => ({ x, ...supports(m, x, state.region) })).filter((x) => x.ok).map((x) => MODE_LABEL[x.x] + (x.via ? ` (${x.via})` : '')).join(' · ') || '지원 안 함')),
      m.card ? h('div', null, h('span', null, '수명주기'), h('b', { class: 'modes' }, `${m.card.lifecycle ?? '미확인'}${m.card.eolDate ? ` · EOL ${m.card.eolDate}` : ''}`)) : null,
      h('div', null, h('span', null, '제공 리전'), h('b', null, String(m.regions.length))),
      h('div', null, h('span', null, '최초 확인'), h('b', null, m.firstSeen))),
    h('h2', null, '단가 (USD / 1M tokens)'), h('div', { class: 'scroll' }, matrix),
    h('p', { class: 'note' }, lc
      ? `장문 구간: 프롬프트가 ${lc.thresholdTokens ? tokens(lc.thresholdTokens) : '임계값(미확인)'}을 넘으면 해당 요청 전체에 장문 단가가 적용됩니다(AWS 가격표 Long Context SKU${lc.thresholdTokens ? ', 임계값은 models.dev' : ''}).`
      : '이 모델은 AWS 가격표에 길이별 가격 구간(long-context)이 없습니다. 단가는 모든 길이에 동일합니다.'),
    m.priceSource === 'model-card' || m.priceSource === 'mixed'
      ? h('p', { class: 'note' }, m.priceSource === 'model-card'
        ? '이 모델은 AWS Price List에 아직 없어, AWS 모델 카드에 적힌 상용 리전 공통 단가를 지원 리전마다 적용했습니다. 리전별로 실제 청구액이 다르면 모델 카드를 확인하세요.'
        : 'AWS Price List에 단가가 없는 일부 리전(예: GovCloud 외 상용 리전)은 AWS 모델 카드의 상용 리전 공통 단가로 보충했습니다.')
      : null,
    m.geoPrefixes?.length ? h('p', { class: 'note' }, `Geo CRIS 프로파일: ${m.geoPrefixes.map((x) => x + '.').join(', ')}`) : null,
    availabilitySection(m),
    h('h2', null, '리전별 Standard 단가'),
    h('div', { class: 'scroll' }, h('table', null, h('thead', null, h('tr', null, h('th', null, '리전'), h('th', { class: 'num' }, 'In (regional)'), h('th', { class: 'num' }, 'Out (regional)'), h('th', { class: 'num' }, 'In (global)'), h('th', { class: 'num' }, 'Out (global)'))), h('tbody', null, ...regionRows))),
    h('h2', null, '벤치마크'),
    m.benchmarkSource ? h('p', { class: 'note' }, `Artificial Analysis 항목: ${m.benchmarkSource.name} (${m.benchmarkSource.slug}). 같은 모델의 설정(reasoning/effort) 변형이 여럿이면 기본 항목 또는 지능 지수가 가장 높은 변형입니다.`) : null,
    bench,
    h('p', { class: 'note' }, '벤치마크: ', h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, 'Artificial Analysis'), ' · 가격: AWS Price List API · context: ', h('a', { href: 'https://models.dev/', rel: 'noopener' }, 'models.dev')));
}

const yes = (on: boolean) => h('td', { class: `ck${on ? ' on' : ''}` }, on ? '✓' : '—');

/** Per-region invocation options straight from the AWS model card, split by endpoint. */
function availabilitySection(m: Model): HTMLElement | null {
  if (!m.availability) return h('p', { class: 'note' }, 'AWS 모델 카드를 찾지 못해 리전별 가용성을 표시할 수 없습니다. 추론 방식은 models.dev 기준 추정입니다.');
  const regions = Object.keys(m.availability).sort((a, b) => Number(a.startsWith('us-gov')) - Number(b.startsWith('us-gov')) || Number(b === state.region) - Number(a === state.region) || a.localeCompare(b));
  const has = (r: string, ep: 'runtime' | 'mantle', f: string) => !!m.availability![r][ep]?.includes(f);
  return h('div', null,
    h('h2', null, '리전별 추론 방식 (AWS 모델 카드)'),
    h('p', { class: 'note' }, 'In-region은 해당 리전에서 바로 호출, Geo/Global CRIS는 프로파일 ID로 호출합니다. bedrock-mantle은 OpenAI 호환 API 엔드포인트이며, runtime과 지원 리전이 다를 수 있습니다.'),
    h('div', { class: 'scroll' }, h('table', { class: 'avail' },
      h('thead', null, h('tr', null, h('th', null, '리전'), h('th', null, 'In-region (runtime)'), h('th', null, 'In-region (mantle)'), h('th', null, 'Geo CRIS'), h('th', null, 'Global CRIS'), m.availabilityEol ? h('th', null, 'EOL') : null)),
      h('tbody', null, ...regions.map((r) => h('tr', { class: r === state.region ? 'sel' : '' }, h('td', null, r),
        yes(has(r, 'runtime', 'i')), yes(has(r, 'mantle', 'i')), yes(has(r, 'runtime', 'g') || has(r, 'mantle', 'g')), yes(has(r, 'runtime', 'G') || has(r, 'mantle', 'G')), m.availabilityEol ? h('td', { class: 'ck eol' }, m.availabilityEol[r] ?? '') : null))))));
}
