import { h } from '../dom.ts';
import { matches, usd, variantRows, type Row } from '../data.ts';
import { leader, METRICS, type Metric } from '../metrics.ts';
import { MAX_COMPARE, state, toggleCompare, update } from '../state.ts';
import type { Model } from '../types.ts';

const TABS: [string, string][] = [
  ['intelligence', '지능'], ['coding', '코딩'], ['math', '수학'], ['speed', '속도'], ['ttft', '지연'], ['price', '가격'], ['context', 'Context'],
];
const OTHER_BENCH = ['gpqa', 'hle', 'mmluPro', 'liveCodeBench', 'scicode', 'aime'];
const TOPS = [10, 20, 40, 0];

/** The three price series keep their slot colors on every row (blue, orange, aqua: the validated first three categorical slots). */
const PRICE_SERIES: [keyof typeof METRICS, string, string][] = [
  ['input', 'Input', 'var(--series-1)'],
  ['output', 'Output', 'var(--series-2)'],
  ['cacheRead', 'Cache read', 'var(--series-3)'],
];

function filtered(models: Model[]): Row[] {
  return variantRows(models, state)
    .filter((r) => !state.provider || r.m.provider === state.provider)
    .filter((r) => (state.weights === '' ? true : r.m.openWeights === (state.weights === 'open')))
    .filter((r) => (state.reasoning === '' ? true : r.m.reasoning === (state.reasoning === 'yes')));
}

function identity(r: Row, multiScope: boolean): HTMLElement {
  return h('div', { class: 'who' },
    h('a', { href: `#/model/${r.m.id}`, class: 'nm' }, r.m.name),
    h('span', { class: 'sub' },
      r.m.provider,
      multiScope ? ` · ${r.label}${r.inferred ? '?' : ''}` : null,
      r.m.openWeights ? h('em', { class: 'badge' }, '오픈 웨이트') : null,
      r.m.reasoning ? h('em', { class: 'badge alt' }, '추론') : null));
}

const cmpButton = (m: Model) =>
  h('button', { type: 'button', class: 'cmp', 'aria-pressed': state.compare.includes(m.id), title: state.compare.includes(m.id) ? '비교에서 제거' : state.compare.length >= MAX_COMPARE ? `비교는 최대 ${MAX_COMPARE}개` : '비교에 추가',
    onclick: () => toggleCompare(m.id) }, state.compare.includes(m.id) ? '✓' : '＋');

function singleBars(rows: Row[], metric: Metric): HTMLElement {
  const data = rows.map((r) => ({ r, v: metric.value(r) })).filter((x): x is { r: Row; v: number } => x.v !== undefined)
    .sort((a, b) => (metric.higherBetter ? b.v - a.v : a.v - b.v) || a.r.m.name.localeCompare(b.r.m.name));
  const shown = state.rankTop ? data.slice(0, state.rankTop) : data;
  const max = Math.max(...shown.map((x) => x.v), 0) || 1;
  const multi = new Set(state.modes.map((m) => (m === 'global' ? 'g' : 'r'))).size > 1;
  return h('div', null,
    h('p', { class: 'count-line' }, `${shown.length} of ${data.length} 모델`),
    h('ol', { class: 'rank' }, ...shown.map((x, i) => {
      // Bars stop at 86% so the value label always fits at the tip.
      const w = (x.v / max) * 86;
      return h('li', { class: state.query && matches(x.r.m, state.query) ? 'rk hit' : 'rk' },
        h('span', { class: 'pos' }, String(i + 1)),
        identity(x.r, multi),
        h('div', { class: 'track' }, h('i', { class: 'fill', style: `width:${w}%` }), h('b', { class: 'val', style: `left:calc(${w}% + 8px)` }, metric.fmt(x.v))),
        cmpButton(x.r.m));
    })));
}

function priceBars(rows: Row[]): HTMLElement {
  const blend = METRICS.blend;
  const data = rows.map((r) => ({ r, b: blend.value(r) })).filter((x): x is { r: Row; b: number } => x.b !== undefined).sort((a, b) => a.b - b.b || a.r.m.name.localeCompare(b.r.m.name));
  const shown = state.rankTop ? data.slice(0, state.rankTop) : data;
  const max = Math.max(...shown.flatMap((x) => PRICE_SERIES.map(([k]) => METRICS[k].value(x.r) ?? 0)), 0) || 1;
  const multi = new Set(state.modes.map((m) => (m === 'global' ? 'g' : 'r'))).size > 1;
  return h('div', null,
    h('div', { class: 'legend-row' }, ...PRICE_SERIES.map(([, l, c]) => h('span', { class: 'lg' }, h('i', { class: 'sw', style: `background:${c}` }), l))),
    h('p', { class: 'count-line' }, `${shown.length} of ${data.length} 모델 · 4:1 혼합 단가가 낮은 순`),
    h('ol', { class: 'rank price' }, ...shown.map((x, i) =>
      h('li', { class: state.query && matches(x.r.m, state.query) ? 'rk hit' : 'rk' },
        h('span', { class: 'pos' }, String(i + 1)),
        identity(x.r, multi),
        h('div', { class: 'multi' }, ...PRICE_SERIES.map(([k, l, c]) => {
          const v = METRICS[k].value(x.r);
          if (v === undefined) return null;
          const w = (v / max) * 82;
          return h('div', { class: 'track thin', title: `${l} ${usd(v)}` }, h('i', { class: 'fill', style: `width:${w}%;background:${c}` }), h('b', { class: 'val', style: `left:calc(${w}% + 8px)` }, usd(v)));
        })),
        cmpButton(x.r.m)))));
}

function highlights(rows: Row[]): HTMLElement {
  const cards: [string, Metric][] = [['지능 최고', METRICS.intelligence], ['가장 빠름', METRICS.speed], ['지연 최저', METRICS.ttft], ['가장 저렴 (4:1)', METRICS.blend], ['Context 최대', METRICS.context]];
  return h('div', { class: 'cards' }, ...cards.map(([title, metric]) => {
    const top = leader(rows, metric);
    return h('div', { class: 'card' },
      h('span', { class: 'ct' }, title),
      top ? h('a', { href: `#/model/${top.row.m.id}`, class: 'cn' }, top.row.m.name) : h('span', { class: 'cn na' }, '데이터 없음'),
      top ? h('b', { class: 'cv' }, metric.fmt(top.value)) : null,
      top ? h('span', { class: 'cs' }, top.row.m.provider) : null);
  }));
}

export function renderRank(models: Model[]): HTMLElement {
  const rows = filtered(models);
  const isPrice = state.rankMetric === 'price';
  const metric = METRICS[state.rankMetric] ?? METRICS.intelligence;
  const providers = [...new Set(models.map((m) => m.provider))].sort();
  const sel = (label: string, opts: [string, string][], value: string, on: (v: string) => void) =>
    h('label', null, label, ' ', h('select', { 'aria-label': label, onchange: (e: Event) => on((e.target as HTMLSelectElement).value) }, ...opts.map(([v, t]) => h('option', { value: v, selected: v === value }, t))));

  const tabs = h('div', { class: 'tabs', role: 'tablist' },
    ...TABS.map(([k, l]) => h('button', { type: 'button', role: 'tab', 'aria-selected': state.rankMetric === k, onclick: () => update({ rankMetric: k }) }, l)),
    h('select', { class: 'tab-select', 'aria-label': '기타 벤치마크', onchange: (e: Event) => { const v = (e.target as HTMLSelectElement).value; if (v) update({ rankMetric: v }); } },
      h('option', { value: '' }, '기타 벤치마크…'),
      ...OTHER_BENCH.map((k) => h('option', { value: k, selected: state.rankMetric === k }, METRICS[k].label))));

  const filters = h('div', { class: 'filters' },
    sel('제공사', [['', '전체'], ...providers.map((p): [string, string] => [p, p])], state.provider, (v) => update({ provider: v })),
    sel('가중치', [['', '전체'], ['open', '오픈 웨이트'], ['closed', '독점']], state.weights, (v) => update({ weights: v as 'open' })),
    sel('추론', [['', '전체'], ['yes', '추론 모델'], ['no', '비추론']], state.reasoning, (v) => update({ reasoning: v as 'yes' })),
    sel('표시', TOPS.map((n): [string, string] => [String(n), n ? `상위 ${n}` : '전체']), String(state.rankTop), (v) => update({ rankTop: Number(v) })));

  return h('main', null,
    h('h1', { class: 'chart-title' }, '모델 순위'),
    h('p', { class: 'note' }, `${state.region} · ${state.tier} · 선택한 추론 방식 기준. 벤치마크·속도: Artificial Analysis (${' '}`, h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, 'artificialanalysis.ai'), '). 가중치·추론 구분은 models.dev에 있는 모델만 필터됩니다. 막대는 0에서 시작합니다.'),
    highlights(rows), tabs,
    h('p', { class: 'note' }, isPrice ? 'USD / 1M tokens. 막대 색은 Input · Output · Cache read입니다.' : metric.hint),
    filters,
    isPrice ? priceBars(rows) : singleBars(rows, metric),
    state.compare.length ? h('p', { class: 'note' }, h('a', { href: '#/compare' }, `선택한 ${state.compare.length}개 모델 비교하기 →`)) : null);
}
