import { h } from '../dom.ts';
import { blended, longPriceOf, matches, priceOf, tokens, usd, variants, type Variant } from '../data.ts';
import { state, update } from '../state.ts';
import type { Model, TokenKind } from '../types.ts';

/** A table row is a model seen through one price scope (regional or global). */
interface Row extends Variant {
  m: Model;
}

interface Col {
  key: string;
  label: string;
  num?: boolean;
  value: (r: Row) => string | number | undefined;
  show?: (r: Row) => string;
  title?: (r: Row) => string | undefined;
}

const p = (kind: TokenKind, tier?: 'batch') => (r: Row) => priceOf(r.m, state.region, r.scope, tier ?? state.tier, kind);
const lc = (kind: TokenKind) => (r: Row) => longPriceOf(r.m, state.region, r.scope, state.tier, kind);

const COLS: Col[] = [
  { key: 'name', label: '모델', value: (r) => r.m.name },
  { key: 'provider', label: '제공사', value: (r) => r.m.provider },
  { key: 'mode', label: '추론', value: (r) => r.label, show: (r) => r.label + (r.inferred ? '?' : ''), title: (r) => (r.inferred ? 'models.dev에 없는 모델이라 가격 존재 여부로 추정한 값입니다.' : undefined) },
  { key: 'ctx', label: 'Context', num: true, value: (r) => r.m.contextWindow, show: (r) => tokens(r.m.contextWindow) },
  { key: 'out', label: 'Max out', num: true, value: (r) => r.m.maxOutput, show: (r) => tokens(r.m.maxOutput) },
  { key: 'ai', label: 'Intelligence', num: true, value: (r) => r.m.benchmarks?.intelligenceIndex, show: (r) => (r.m.benchmarks?.intelligenceIndex === undefined ? '—' : r.m.benchmarks.intelligenceIndex.toFixed(1)), title: () => 'Artificial Analysis Intelligence Index' },
  { key: 'in', label: 'Input', num: true, value: p('input') },
  { key: 'output', label: 'Output', num: true, value: p('output') },
  { key: 'cr', label: 'Cache read', num: true, value: p('cacheRead') },
  { key: 'cw', label: 'Cache write', num: true, value: p('cacheWrite') },
  { key: 'bl', label: '4:1 혼합', num: true, value: (r) => blended(p('input')(r), p('output')(r)) },
  {
    key: 'lc', label: '장문 구간 In / Out', num: true, value: lc('input'),
    show: (r) => {
      const [i, o] = [lc('input')(r), lc('output')(r)];
      if (i === undefined && o === undefined) return '—';
      const t = r.m.longContext?.thresholdTokens;
      return `${t ? `>${tokens(t)} ` : ''}${usd(i)} / ${usd(o)}`;
    },
    title: (r) => (r.m.longContext && r.m.longContext.thresholdTokens === undefined ? '임계값 미확인: 프롬프트가 일정 길이를 넘으면 이 단가가 적용됩니다.' : '프롬프트가 임계값을 넘으면 기본 단가 대신 이 단가가 적용됩니다.'),
  },
  { key: 'bin', label: 'Batch in', num: true, value: p('input', 'batch') },
  { key: 'bout', label: 'Batch out', num: true, value: p('output', 'batch') },
];

function buildRows(models: Model[]): Row[] {
  return models
    .filter((m) => matches(m, state.query) && (!state.provider || m.provider === state.provider))
    .flatMap((m) => variants(m, state.modes).map((v) => ({ m, ...v })))
    .filter((r) => !state.onlyInRegion || r.m.pricing[state.region]?.[r.scope] !== undefined)
    .filter((r) => !state.onlyCache || p('cacheRead')(r) !== undefined);
}

export function renderTable(models: Model[]): HTMLElement {
  const providers = [...new Set(models.map((m) => m.provider))].sort();
  const body = h('tbody');
  const count = h('span', { class: 'count' });

  const draw = () => {
    const col = COLS.find((c) => c.key === state.sort.key) ?? COLS[1];
    const rows = buildRows(models).sort((a, b) => {
      const [x, y] = [col.value(a), col.value(b)];
      // Unknown values always sort last, whichever direction is active.
      if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
      const c = (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * state.sort.dir;
      return c || a.m.name.localeCompare(b.m.name) || a.scope.localeCompare(b.scope);
    });
    count.textContent = `${rows.length}행 · ${new Set(rows.map((r) => r.m.id)).size} / ${models.length} 모델`;
    body.replaceChildren(
      ...rows.map((r) =>
        h('tr', null,
          ...COLS.map((c) => {
            if (c.key === 'name') return h('td', { class: 'name' }, h('a', { href: `#/model/${r.m.id}` }, r.m.name));
            const v = c.value(r);
            const text = c.show ? c.show(r) : typeof v === 'number' ? usd(v) : (v ?? '—');
            return h('td', { class: [c.num ? 'num' : '', v === undefined ? 'na' : '', c.key === 'mode' ? 'mode' : ''].join(' '), title: c.title?.(r) }, String(text));
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
    h('label', null, h('input', { type: 'checkbox', checked: state.onlyInRegion, onchange: (e: Event) => update({ onlyInRegion: (e.target as HTMLInputElement).checked }) }), `${state.region}에 단가가 있는 모델만`),
    h('label', null, h('input', { type: 'checkbox', checked: state.onlyCache, onchange: (e: Event) => update({ onlyCache: (e.target as HTMLInputElement).checked }) }), 'Cache 단가 있는 모델만'),
    h('label', null, '티어 ', h('select', { 'aria-label': '티어', onchange: (e: Event) => update({ tier: (e.target as HTMLSelectElement).value as 'standard' }) },
      ...(['standard', 'priority', 'flex'] as const).map((t) => h('option', { value: t, selected: t === state.tier }, t)))),
    count);

  draw();
  return h('main', null,
    h('p', { class: 'note' }, `USD / 1M tokens · ${state.region}. 선택한 추론 방식을 지원하는 모델만 표시합니다. In-region과 Geo CRIS는 같은 단가표(Geo and In-region)를 쓰므로 한 행으로 합쳐지고, Global CRIS는 별도 행입니다. "—"는 해당 리전·티어에 단가가 없거나 미확인입니다. 지원 방식·Context는 models.dev 기준이며 모델 카드와 다를 수 있습니다.`),
    filters, h('div', { class: 'scroll' }, h('table', null, head, body)));
}
