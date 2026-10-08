import { h } from '../dom.ts';
import { matches, variantRows, type Row } from '../data.ts';
import { METRICS, type Metric } from '../metrics.ts';
import { MAX_COMPARE, state, toggleCompare } from '../state.ts';
import type { Model } from '../types.ts';

const GROUPS: [string, string[]][] = [
  ['종합 성능', ['intelligence', 'coding', 'math']],
  ['개별 벤치마크', ['gpqa', 'hle', 'mmluPro', 'liveCodeBench', 'scicode', 'aime']],
  ['속도', ['speed', 'ttft']],
  ['단가 (USD / 1M)', ['input', 'output', 'blend', 'cacheRead', 'longInput']],
  ['Context', ['context']],
];

/** Series color follows the model's slot in the selection, not its rank in any one chart. */
const color = (i: number) => `var(--series-${i + 1})`;

export function renderCompare(models: Model[]): HTMLElement {
  const byId = new Map(models.map((m) => [m.id, m]));
  const picked = state.compare.map((id) => byId.get(id)).filter((m): m is Model => !!m);
  const all = variantRows(picked, state);
  // Rows keep the model's slot color; a model with two price scopes gets two bars in the same color.
  const cols = picked.flatMap((m, i) => all.filter((r) => r.m.id === m.id).map((r) => ({ r, c: color(i) })));
  const multi = new Set(all.map((r) => r.scope)).size > 1;
  const nameOf = (r: Row) => (multi ? `${r.m.name} · ${r.label}` : r.m.name);

  const chips = h('div', { class: 'chips-row' }, ...picked.map((m, i) =>
    h('span', { class: 'pick' }, h('i', { class: 'sw', style: `background:${color(i)}` }), h('a', { href: `#/model/${m.id}` }, m.name),
      h('button', { type: 'button', 'aria-label': `${m.name} 제거`, onclick: () => toggleCompare(m.id) }, '×'))));

  const results = h('ul', { class: 'suggest static', hidden: true });
  const input = h('input', { type: 'search', placeholder: state.compare.length >= MAX_COMPARE ? `최대 ${MAX_COMPARE}개까지` : '비교할 모델 검색…', 'aria-label': '비교할 모델 검색', disabled: state.compare.length >= MAX_COMPARE });
  input.addEventListener('input', () => {
    const q = input.value.trim();
    const hits = q ? models.filter((m) => !state.compare.includes(m.id) && matches(m, q)).slice(0, 8) : [];
    results.replaceChildren(...hits.map((m) => h('li', null, h('button', { type: 'button', onclick: () => toggleCompare(m.id) }, h('strong', null, m.name), h('span', null, m.provider)))));
    results.hidden = hits.length === 0;
  });
  const adder = h('div', { class: 'adder' }, input, results);

  if (!picked.length) {
    return h('main', null, h('h1', { class: 'chart-title' }, '모델 비교'),
      h('p', { class: 'note' }, '비교할 모델을 최대 6개까지 고르세요. 순위·표·상세 화면의 ＋ 버튼으로도 추가할 수 있습니다.'), adder);
  }

  const panel = (metric: Metric) => {
    const vals = cols.map((x) => ({ ...x, v: metric.value(x.r) }));
    if (vals.every((x) => x.v === undefined)) return null;
    const max = Math.max(...vals.map((x) => x.v ?? 0), 0) || 1;
    const best = vals.filter((x) => x.v !== undefined).reduce<number | undefined>((b, x) => (b === undefined || (metric.higherBetter ? x.v! > b : x.v! < b) ? x.v : b), undefined);
    return h('section', { class: 'panel' },
      h('h3', null, metric.label), h('p', { class: 'note' }, metric.hint),
      h('ul', { class: 'mini' }, ...vals.map((x) => {
        const w = x.v === undefined ? 0 : (x.v / max) * 64;
        return h('li', null,
          h('span', { class: 'mn' }, nameOf(x.r)),
          h('div', { class: 'track' },
            x.v === undefined ? h('b', { class: 'val na', style: 'left:0' }, '데이터 없음') : h('i', { class: 'fill', style: `width:${w}%;background:${x.c}` }),
            x.v === undefined ? null : h('b', { class: `val${x.v === best ? ' best' : ''}`, style: `left:calc(${w}% + 8px)` }, metric.fmt(x.v))));
      })));
  };

  const groups = GROUPS.map(([title, keys]) => {
    const panels = keys.map((k) => panel(METRICS[k])).filter(Boolean) as HTMLElement[];
    return panels.length ? h('div', { class: 'group' }, h('h2', null, title), h('div', { class: 'panels' }, ...panels)) : null;
  });

  const metricsAll = GROUPS.flatMap(([, ks]) => ks).map((k) => METRICS[k]);
  const table = h('details', { class: 'twin', open: true },
    h('summary', null, '표로 보기'),
    h('div', { class: 'scroll' }, h('table', null,
      h('thead', null, h('tr', null, h('th', null, '지표'), ...cols.map((x) => h('th', { class: 'num' }, h('i', { class: 'sw', style: `background:${x.c}` }), nameOf(x.r))))),
      h('tbody', null, ...metricsAll.map((metric) => {
        const vs = cols.map((x) => metric.value(x.r));
        if (vs.every((v) => v === undefined)) return null;
        const defined = vs.filter((v): v is number => v !== undefined);
        const best = metric.higherBetter ? Math.max(...defined) : Math.min(...defined);
        return h('tr', null, h('td', null, metric.label), ...vs.map((v) => h('td', { class: `num${v === undefined ? ' na' : v === best && defined.length > 1 ? ' best' : ''}` }, v === undefined ? '—' : metric.fmt(v))));
      })))));

  return h('main', null,
    h('h1', { class: 'chart-title' }, '모델 비교'),
    h('p', { class: 'note' }, `${state.region} · ${state.tier}. 모델마다 고정된 색을 쓰며, 굵은 값이 그 지표의 최고입니다. 단가는 선택한 추론 방식 기준입니다.`),
    chips, adder, ...groups, table);
}
