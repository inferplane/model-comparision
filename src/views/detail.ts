import { h } from '../dom.ts';
import { blended, priceOf, tokens, usd } from '../data.ts';
import { state } from '../state.ts';
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

  const cacheKinds = KINDS.filter(([k]) => m.regions.some((r) => SCOPES.some(([s]) => TIERS.some((t) => priceOf(m, r, s, t, k) !== undefined))));
  const matrix = h('table', null,
    h('thead', null, h('tr', null, h('th', null, `${state.region} · 추론 범위 / 티어`), ...cacheKinds.map(([, l]) => h('th', { class: 'num' }, l)), h('th', { class: 'num' }, '4:1 혼합'))),
    h('tbody', null, ...SCOPES.flatMap(([scope, sl]) => TIERS.map((tier) => {
      const vals = cacheKinds.map(([k]) => priceOf(m, state.region, scope, tier, k));
      if (vals.every((v) => v === undefined)) return null;
      return h('tr', null, h('td', null, `${sl} · ${tier}`), ...vals.map((v) => h('td', { class: 'num' + (v === undefined ? ' na' : '') }, usd(v))),
        h('td', { class: 'num' }, usd(blended(priceOf(m, state.region, scope, tier, 'input'), priceOf(m, state.region, scope, tier, 'output')))));
    }))));

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
    h('h1', null, m.name, h('small', null, m.provider)),
    h('div', { class: 'facts' },
      h('div', null, h('span', null, 'Context window'), h('b', null, tokens(m.contextWindow))),
      h('div', null, h('span', null, 'Max output'), h('b', null, tokens(m.maxOutput))),
      h('div', null, h('span', null, '제공 리전'), h('b', null, String(m.regions.length))),
      h('div', null, h('span', null, '최초 확인'), h('b', null, m.firstSeen))),
    h('h2', null, '단가 (USD / 1M tokens)'), h('div', { class: 'scroll' }, matrix),
    h('p', { class: 'note' }, '길이별 가격 구간(long-context tier)은 AWS 가격표에 없습니다. 단가는 모든 길이에 동일합니다.'),
    h('h2', null, '리전별 Standard 단가'),
    h('div', { class: 'scroll' }, h('table', null, h('thead', null, h('tr', null, h('th', null, '리전'), h('th', { class: 'num' }, 'In (regional)'), h('th', { class: 'num' }, 'Out (regional)'), h('th', { class: 'num' }, 'In (global)'), h('th', { class: 'num' }, 'Out (global)'))), h('tbody', null, ...regionRows))),
    h('h2', null, '벤치마크'), bench,
    h('p', { class: 'note' }, '벤치마크: ', h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, 'Artificial Analysis'), ' · 가격: AWS Price List API · context: ', h('a', { href: 'https://models.dev/', rel: 'noopener' }, 'models.dev')));
}
