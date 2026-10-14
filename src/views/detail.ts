import { h } from '../dom.ts';
import { blended, inferenceIds, longPriceOf, MODE_LABEL, MODES, priceOf, supports, tokens, usd } from '../data.ts';
import { MAX_COMPARE, state, toggleCompare } from '../state.ts';
import type { BenchmarkScores, Model, Scope, Tier, TokenKind } from '../types.ts';
import { codingNotice } from '../components/coding-notice.ts';
import { newBadge } from '../recent.ts';
import { copyButton } from '../components/ui.ts';
import { t } from '../i18n.ts';
import { FABLE_PROGRAM_ZDR_UNTIL, fableProgramZdrActive, noZdrReason, zdrOf } from '../zdr.ts';

const KINDS: [TokenKind, string][] = [['input', 'Input'], ['output', 'Output'], ['cacheRead', 'Cache read'], ['cacheWrite', 'Cache write'], ['cacheWrite1h', 'Cache write 1h']];
const TIERS: Tier[] = ['standard', 'batch', 'priority', 'flex'];
const SCOPES: [Scope, string][] = [['regional', 'In-region / Geo CRIS'], ['global', 'Global CRIS']];
const BENCH: [keyof BenchmarkScores, string, number][] = [
  ['intelligenceIndex', 'Intelligence Index', 100], ['codingIndex', 'Coding Index', 100], ['mathIndex', 'Math Index', 100],
  ['mmluPro', 'MMLU-Pro', 1], ['gpqa', 'GPQA Diamond', 1], ['hle', "Humanity's Last Exam", 1], ['liveCodeBench', 'LiveCodeBench', 1], ['scicode', t('SciCode (과학 코딩)', 'SciCode (scientific coding)'), 1], ['aime', 'AIME', 1], ['math500', 'MATH-500', 1],
];

export function renderDetail(models: Model[], id: string): HTMLElement {
  const m = models.find((x) => x.id === id);
  if (!m) return h('main', null, h('p', null, t('모델을 찾을 수 없습니다. ', 'Model not found. ')), h('a', { href: '#/' }, t('← 목록으로', '← Back to the list')));

  const lc = m.longContext;
  const cacheKinds = KINDS.filter(([k]) => m.regions.some((r) => SCOPES.some(([s]) => TIERS.some((t) => priceOf(m, r, s, t, k) !== undefined || longPriceOf(m, r, s, t, k) !== undefined))));
  const bands: [boolean, string][] = lc ? [[false, t('기본', 'Base')], [true, lc.thresholdTokens ? `>${tokens(lc.thresholdTokens)}` : t('장문', 'Long')]] : [[false, '']];
  const matrix = h('table', null,
    h('thead', null, h('tr', null, h('th', null, `${state.region} · ${t('추론 범위 / 티어', 'Scope / tier')}${lc ? t(' / 프롬프트 길이', ' / prompt length') : ''}`), ...cacheKinds.map(([, l]) => h('th', { class: 'num' }, l)), h('th', { class: 'num' }, t('4:1 혼합', '4:1 blend')))),
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
        return h('div', { class: 'bar' }, h('span', null, label), h('div', { class: 'track', title: t(`Bedrock 모델 중 상위 ${100 - pct}%`, `Top ${100 - pct}% of Bedrock models`) }, h('i', { style: `width:${Math.min(100, v * (scale === 1 ? 100 : 1))}%` })), h('b', null, shown), h('small', null, `p${pct}`));
      }),
      b.outputTokensPerSecond !== undefined ? h('p', { class: 'note' }, t(`속도 ${b.outputTokensPerSecond.toFixed(0)} tok/s · TTFT ${b.timeToFirstTokenSeconds?.toFixed(2) ?? '—'}s (Artificial Analysis 측정)`, `Speed ${b.outputTokensPerSecond.toFixed(0)} tok/s · TTFT ${b.timeToFirstTokenSeconds?.toFixed(2) ?? '—'}s (measured by Artificial Analysis)`)) : null)
    : h('p', { class: 'note' }, t('이 모델의 벤치마크 데이터가 없습니다. (Artificial Analysis에 매칭되지 않았거나 수집이 꺼져 있음)', 'No benchmark data for this model (no Artificial Analysis match, or collection is off).'));

  const zdr = zdrOf(m);
  const noZdr = noZdrReason(m);
  return h('main', { class: 'detail' },
    h('a', { href: '#/' }, t('← 전체 목록', '← All models')),
    h('h1', null, m.name, h('small', null, m.provider), newBadge(m.id),
      h('button', { type: 'button', class: 'cmp wide', 'aria-label': t(`${m.name} 비교 선택`, `Select ${m.name} for comparison`), 'aria-pressed': state.compare.includes(m.id), disabled: !state.compare.includes(m.id) && state.compare.length >= MAX_COMPARE, onclick: () => toggleCompare(m.id) },
        state.compare.includes(m.id) ? t('✓ 비교에 담김', '✓ In comparison') : t('＋ 비교에 추가', '＋ Add to comparison')),
      m.card ? h('a', { class: 'cardlink', href: m.card.url, rel: 'noopener' }, t('AWS 모델 카드 ↗', 'AWS model card ↗')) : null),
    modelIdSection(m),
    h('div', { class: 'facts' },
      h('div', null, h('span', null, 'Context window'), h('b', null, tokens(m.contextWindow))),
      h('div', null, h('span', null, 'Max output'), h('b', null, tokens(m.maxOutput))),
      h('div', null, h('span', null, t(`${state.region}에서 추론 방식`, `Inference modes in ${state.region}`)), h('b', { class: 'modes', title: m.availability ? t('AWS 모델 카드 기준', 'Per the AWS model card') : t('models.dev 기준 추정 (모델 카드 없음)', 'Inferred from models.dev (no model card)') },
        MODES.map((x) => ({ x, ...supports(m, x, state.region) })).filter((x) => x.ok).map((x) => MODE_LABEL[x.x] + (x.via ? ` (${x.via})` : '')).join(' · ') || t('지원 안 함', 'Not supported'))),
      m.card ? h('div', null, h('span', null, t('수명주기', 'Lifecycle')), h('b', { class: 'modes' }, `${m.card.lifecycle ?? t('미확인', 'Unknown')}${m.card.eolDate ? ` · EOL ${m.card.eolDate}` : ''}`)) : null,
      h('div', null, h('span', null, 'ZDR'), h('b', { class: `zdr${zdr ? ' on' : ' off'}`, title: noZdr === 'openai' ? t('ZDR은 AWS 계정팀에 요청해 승인받는 옵션입니다. 승인은 모델 버전별이라 새 버전(예: GPT-5.6)은 다시 요청해야 하며, 승인 전에는 기본 정책(분류기에 걸린 트래픽 최대 30일 보관)이 적용됩니다.', 'ZDR is an option you request through your AWS account team. Approval is per model version, so a new version (e.g. GPT-5.6) needs a new request; until approved, the default policy applies (classifier-flagged traffic kept up to 30 days).')
          : noZdr === 'fable' ? (fableProgramZdrActive()
            ? t(`모든 트래픽을 최대 30일 보관합니다. Enterprise Frontier Safeguards 대상 고객만 ${FABLE_PROGRAM_ZDR_UNTIL}까지 ZDR을 받습니다. (AWS abuse detection 문서)`, `All traffic is kept up to 30 days. ZDR applies only to Enterprise Frontier Safeguards customers through ${FABLE_PROGRAM_ZDR_UNTIL}. (AWS abuse detection page)`)
            : t(`모든 트래픽을 최대 30일 보관합니다. Enterprise Frontier Safeguards의 ZDR은 ${FABLE_PROGRAM_ZDR_UNTIL}에 종료되었습니다. (AWS abuse detection 문서)`, `All traffic is kept up to 30 days. The Enterprise Frontier Safeguards ZDR ended on ${FABLE_PROGRAM_ZDR_UNTIL}. (AWS abuse detection page)`))
          : t('Zero Data Retention: 요청·응답 데이터를 보관하지 않는 처리', 'Zero data retention: prompts and responses are not stored') },
        zdr ? t('✓ 지원', '✓ Supported') : noZdr === 'openai' ? t('✕ 기본 미지원 (요청 시 가능)', '✕ Not by default (on request)') : t('✕ 미지원', '✕ Not supported'))),
      h('div', null, h('span', null, t('제공 리전', 'Regions')), h('b', null, String(m.regions.length))),
      h('div', null, h('span', null, t('최초 확인', 'First seen')), h('b', null, m.firstSeen))),
    h('h2', null, t('단가 (USD / 1M tokens)', 'Prices (USD / 1M tokens)')), h('div', { class: 'scroll' }, matrix),
    h('p', { class: 'note' }, lc
      ? t(`장문 구간: 프롬프트가 ${lc.thresholdTokens ? tokens(lc.thresholdTokens) : '임계값(미확인)'}을 넘으면 해당 요청 전체에 장문 단가가 적용됩니다(AWS 가격표 Long Context SKU${lc.thresholdTokens ? ', 임계값은 models.dev' : ''}).`,
        `Long context: once a prompt exceeds ${lc.thresholdTokens ? tokens(lc.thresholdTokens) : 'the threshold (unknown)'}, the whole request is billed at the long-context price (AWS Price List Long Context SKU${lc.thresholdTokens ? '; threshold from models.dev' : ''}).`)
      : t('이 모델은 AWS 가격표에 길이별 가격 구간(long-context)이 없습니다. 단가는 모든 길이에 동일합니다.', 'The AWS Price List has no long-context tier for this model; the price is the same at every length.')),
    m.priceSource === 'model-card' || m.priceSource === 'mixed'
      ? h('p', { class: 'note' }, m.priceSource === 'model-card'
        ? t('이 모델은 AWS Price List에 아직 없어, AWS 모델 카드에 적힌 상용 리전 공통 단가를 지원 리전마다 적용했습니다. 리전별로 실제 청구액이 다르면 모델 카드를 확인하세요.', 'This model is not in the AWS Price List yet, so the commercial-region price from its AWS model card is applied to every supported region. Check the model card if billing differs by region.')
        : t('AWS Price List에 단가가 없는 일부 리전(예: GovCloud 외 상용 리전)은 AWS 모델 카드의 상용 리전 공통 단가로 보충했습니다.', 'Regions the AWS Price List has no price for (e.g. commercial regions outside GovCloud) are filled from the commercial-region price on the AWS model card.'))
      : null,
    m.copiedGlobalRegions?.length
      ? h('p', { class: 'note' }, t(`Global CRIS 단가는 상용 리전에서 모두 같아서(Amazon Nova 제외), 단가가 확인된 리전의 값을 ${m.copiedGlobalRegions.length}개 리전에도 적용했습니다. In-region·Geo CRIS 단가는 리전마다 달라 복사하지 않았습니다.`, `Global CRIS is priced the same in every commercial region (except Amazon Nova), so the known price is applied to ${m.copiedGlobalRegions.length} more regions. In-region and Geo CRIS prices differ by region and are not copied.`))
      : null,
    m.geoPrefixes?.length ? h('p', { class: 'note' }, `${t('Geo CRIS 프로파일', 'Geo CRIS profiles')}: ${m.geoPrefixes.map((x) => x + '.').join(', ')}`) : null,
    availabilitySection(m),
    h('h2', null, t('리전별 Standard 단가', 'Standard prices by region')),
    h('div', { class: 'scroll' }, h('table', null, h('thead', null, h('tr', null, h('th', null, t('리전', 'Region')), h('th', { class: 'num' }, 'In (regional)'), h('th', { class: 'num' }, 'Out (regional)'), h('th', { class: 'num' }, 'In (global)'), h('th', { class: 'num' }, 'Out (global)'))), h('tbody', null, ...regionRows))),
    h('h2', null, t('벤치마크', 'Benchmarks')),
    m.benchmarkSource ? h('p', { class: 'note' }, t('Artificial Analysis 항목: ', 'Artificial Analysis entry: '),
      h('a', { href: m.benchmarkSource.url ?? `https://artificialanalysis.ai/models/${m.benchmarkSource.slug}`, rel: 'noopener' }, m.benchmarkSource.name),
      m.benchmarkSource.kind === 'public-page' ? t(` · 공개 페이지 측정값으로 보완 · 확인일 ${m.benchmarkSource.verifiedAt}`, ` · filled from public-page measurements · checked ${m.benchmarkSource.verifiedAt}`) : t('. 같은 모델의 설정 변형이 여럿이면 기본 항목 또는 지능 지수가 가장 높은 변형입니다.', '. When a model has several setting variants, this is the default entry or the one with the highest Intelligence Index.')) : null,
    codingNotice([m]), bench,
    h('p', { class: 'note' }, t('벤치마크: ', 'Benchmarks: '), h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, 'Artificial Analysis'), t(' · 가격: AWS Price List API · context: ', ' · prices: AWS Price List API · context: '), h('a', { href: 'https://models.dev/', rel: 'noopener' }, 'models.dev')));
}

/** Every id that works from the selected region, each with its own copy button; the bare id alone when none apply here. */
function modelIdSection(m: Model): HTMLElement | null {
  if (!m.modelId) return null;
  const ids = inferenceIds(m, state.region);
  const rows = ids.length ? ids.map((x) => ({ label: MODE_LABEL[x.mode] + (x.via ? ` (${x.via})` : ''), id: x.id })) : [{ label: t('기본 ID', 'Base ID'), id: m.modelId }];
  return h('section', { class: 'model-ids', 'aria-label': t('모델 ID', 'Model ID') },
    h('span', { class: 'model-ids-title' }, t(`모델 ID · ${state.region}`, `Model ID · ${state.region}`)),
    h('ul', null, ...rows.map((r) => h('li', null, h('span', { class: 'model-id-mode' }, r.label), h('code', null, r.id),
      copyButton(r.id, t(`${r.label} 모델 ID 복사`, `Copy ${r.label} model ID`))))));
}

const yes = (on: boolean) => h('td', { class: `ck${on ? ' on' : ''}` }, on ? '✓' : '—');

/** Per-region invocation options straight from the AWS model card, split by endpoint. */
function availabilitySection(m: Model): HTMLElement | null {
  if (!m.availability) return h('p', { class: 'note' }, t('AWS 모델 카드를 찾지 못해 리전별 가용성을 표시할 수 없습니다. 추론 방식은 models.dev 기준 추정입니다.', 'No AWS model card was found, so per-region availability cannot be shown. Inference modes are inferred from models.dev.'));
  const regions = Object.keys(m.availability).sort((a, b) => Number(a.startsWith('us-gov')) - Number(b.startsWith('us-gov')) || Number(b === state.region) - Number(a === state.region) || a.localeCompare(b));
  const has = (r: string, ep: 'runtime' | 'mantle', f: string) => !!m.availability![r][ep]?.includes(f);
  return h('div', null,
    h('h2', null, t('리전별 추론 방식 (AWS 모델 카드)', 'Inference modes by region (AWS model card)')),
    h('p', { class: 'note' }, t('In-region은 해당 리전에서 바로 호출, Geo/Global CRIS는 프로파일 ID로 호출합니다. bedrock-mantle은 OpenAI 호환 API 엔드포인트이며, runtime과 지원 리전이 다를 수 있습니다.', 'In-region calls the model directly in that region; Geo and Global CRIS call it through a profile ID. bedrock-mantle is the OpenAI-compatible endpoint and may cover different regions than bedrock-runtime.')),
    h('div', { class: 'scroll' }, h('table', { class: 'avail' },
      h('thead', null, h('tr', null, h('th', null, t('리전', 'Region')), h('th', null, 'In-region (runtime)'), h('th', null, 'In-region (mantle)'), h('th', null, 'Geo CRIS'), h('th', null, 'Global CRIS'), m.availabilityEol ? h('th', null, 'EOL') : null)),
      h('tbody', null, ...regions.map((r) => h('tr', { class: r === state.region ? 'sel' : '' }, h('td', null, r),
        yes(has(r, 'runtime', 'i')), yes(has(r, 'mantle', 'i')), yes(has(r, 'runtime', 'g') || has(r, 'mantle', 'g')), yes(has(r, 'runtime', 'G') || has(r, 'mantle', 'G')), m.availabilityEol ? h('td', { class: 'ck eol' }, m.availabilityEol[r] ?? '') : null))))));
}
