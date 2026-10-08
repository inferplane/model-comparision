import { h } from '../dom.ts';
import { blended, matches, priceOf, tokens, usd } from '../data.ts';
import { state, update } from '../state.ts';
import type { Model } from '../types.ts';

interface Col {
  key: string;
  label: string;
  num?: boolean;
  value: (m: Model) => string | number | undefined;
  show?: (m: Model) => string;
}

const p = (kind: Parameters<typeof priceOf>[4], tier?: Parameters<typeof priceOf>[3]) => (m: Model) => priceOf(m, state.region, state.scope, tier ?? state.tier, kind);

const COLS: Col[] = [
  { key: 'name', label: '모델', value: (m) => m.name },
  { key: 'provider', label: '제공사', value: (m) => m.provider },
  { key: 'ctx', label: 'Context', num: true, value: (m) => m.contextWindow, show: (m) => tokens(m.contextWindow) },
  { key: 'out', label: 'Max out', num: true, value: (m) => m.maxOutput, show: (m) => tokens(m.maxOutput) },
  { key: 'in', label: 'Input', num: true, value: p('input') },
  { key: 'output', label: 'Output', num: true, value: p('output') },
  { key: 'cr', label: 'Cache read', num: true, value: p('cacheRead') },
  { key: 'cw', label: 'Cache write', num: true, value: p('cacheWrite') },
  { key: 'bl', label: '4:1 혼합', num: true, value: (m) => blended(p('input')(m), p('output')(m)) },
  { key: 'bin', label: 'Batch in', num: true, value: p('input', 'batch') },
  { key: 'bout', label: 'Batch out', num: true, value: p('output', 'batch') },
];

export function renderTable(models: Model[]): HTMLElement {
  const providers = [...new Set(models.map((m) => m.provider))].sort();
  const body = h('tbody');
  const count = h('span', { class: 'count' });

  const draw = () => {
    const col = COLS.find((c) => c.key === state.sort.key) ?? COLS[1];
    const rows = models
      .filter((m) => matches(m, state.query))
      .filter((m) => !state.provider || m.provider === state.provider)
      .filter((m) => !state.onlyInRegion || m.regions.includes(state.region))
      .filter((m) => !state.onlyCache || p('cacheRead')(m) !== undefined)
      .sort((a, b) => {
        const [x, y] = [col.value(a), col.value(b)];
        // Unknown values always sort last, whichever direction is active.
        if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
        return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * state.sort.dir || a.name.localeCompare(b.name);
      });
    count.textContent = `${rows.length} / ${models.length} 모델`;
    body.replaceChildren(
      ...rows.map((m) =>
        h('tr', null,
          ...COLS.map((c) => {
            if (c.key === 'name') return h('td', { class: 'name' }, h('a', { href: `#/model/${m.id}` }, m.name));
            const v = c.value(m);
            const text = c.show ? c.show(m) : typeof v === 'number' ? usd(v) : (v ?? '—');
            return h('td', { class: [c.num ? 'num' : '', v === undefined ? 'na' : ''].join(' ') }, String(text));
          })),
      ),
    );
  };

  const head = h('thead', null, h('tr', null, ...COLS.map((c) =>
    h('th', { class: c.num ? 'num' : '', 'aria-sort': state.sort.key === c.key ? (state.sort.dir === 1 ? 'ascending' : 'descending') : 'none' },
      h('button', { type: 'button', onclick: () => update({ sort: { key: c.key, dir: state.sort.key === c.key && state.sort.dir === 1 ? -1 : 1 } }) },
        c.label + (state.sort.key === c.key ? (state.sort.dir === 1 ? ' ▲' : ' ▼') : ''))))));

  const filters = h('div', { class: 'filters' },
    h('select', { 'aria-label': '제공사', onchange: (e: Event) => update({ provider: (e.target as HTMLSelectElement).value }) },
      h('option', { value: '' }, '모든 제공사'), ...providers.map((x) => h('option', { value: x, selected: x === state.provider }, x))),
    h('label', null, h('input', { type: 'checkbox', checked: state.onlyInRegion, onchange: (e: Event) => update({ onlyInRegion: (e.target as HTMLInputElement).checked }) }), `${state.region}에서 제공되는 모델만`),
    h('label', null, h('input', { type: 'checkbox', checked: state.onlyCache, onchange: (e: Event) => update({ onlyCache: (e.target as HTMLInputElement).checked }) }), 'Cache 단가 있는 모델만'),
    h('label', null, '티어 ', h('select', { 'aria-label': '티어', onchange: (e: Event) => update({ tier: (e.target as HTMLSelectElement).value as 'standard' }) },
      ...(['standard', 'priority', 'flex'] as const).map((t) => h('option', { value: t, selected: t === state.tier }, t)))),
    count);

  draw();
  return h('main', null,
    h('p', { class: 'note' }, `USD / 1M tokens · ${state.region} · ${state.scope === 'global' ? 'Global CRIS' : 'In-region / Geo(US) CRIS'}. "—"는 해당 리전·티어에 단가가 없거나 미확인입니다. Context는 models.dev 기준이며 모델 카드와 다를 수 있습니다.`),
    filters, h('div', { class: 'scroll' }, h('table', null, head, body)));
}
