import { h } from '../dom.ts';
import { blended, longPriceOf, matches, priceOf, tokens, usd, variantRows, type Row } from '../data.ts';
import { METRICS } from '../metrics.ts';
import { MAX_COMPARE, state, toggleCompare, update } from '../state.ts';
import type { Model, TokenKind } from '../types.ts';

interface Col {
  key: string;
  /** Header band this column sits under. */
  group: string;
  /** Draw an in-cell bar scaled to the largest value among the visible rows. */
  bar?: boolean;
  label: string;
  num?: boolean;
  value: (r: Row) => string | number | undefined;
  show?: (r: Row) => string;
  title?: (r: Row) => string | undefined;
}

const p = (kind: TokenKind, tier?: 'batch') => (r: Row) => priceOf(r.m, state.region, r.scope, tier ?? state.tier, kind);
const lc = (kind: TokenKind) => (r: Row) => longPriceOf(r.m, state.region, r.scope, state.tier, kind);

const metric = (key: string) => (r: Row) => METRICS[key].value(r);
const fmt = (key: string) => (r: Row) => {
  const v = METRICS[key].value(r);
  return v === undefined ? '—' : METRICS[key].fmt(v);
};

const COLS: Col[] = [
  { key: 'name', group: '모델', label: '모델', value: (r) => r.m.name },
  { key: 'provider', group: '모델', label: '제공사', value: (r) => r.m.provider },
  { key: 'mode', group: '모델', label: '추론', value: (r) => r.label, show: (r) => r.label + (r.inferred ? '?' : ''), title: (r) => (r.inferred ? 'models.dev에 없는 모델이라 가격 존재 여부로 추정한 값입니다.' : undefined) },
  { key: 'ai', group: '성능 (Artificial Analysis)', label: 'Intelligence', num: true, bar: true, value: metric('intelligence'), show: fmt('intelligence'), title: () => 'Artificial Analysis Intelligence Index' },
  { key: 'coding', group: '성능 (Artificial Analysis)', label: 'Coding', num: true, bar: true, value: metric('coding'), show: fmt('coding') },
  { key: 'in', group: '단가 (USD / 1M tokens)', label: 'Input', num: true, value: p('input') },
  { key: 'output', group: '단가 (USD / 1M tokens)', label: 'Output', num: true, value: p('output') },
  { key: 'cr', group: '단가 (USD / 1M tokens)', label: 'Cache read', num: true, value: p('cacheRead') },
  { key: 'cw', group: '단가 (USD / 1M tokens)', label: 'Cache write', num: true, value: p('cacheWrite') },
  { key: 'bl', group: '단가 (USD / 1M tokens)', label: '4:1 혼합', num: true, value: (r) => blended(p('input')(r), p('output')(r)) },
  {
    key: 'lc', group: '장문', label: 'In / Out', num: true, value: lc('input'),
    show: (r) => {
      const [i, o] = [lc('input')(r), lc('output')(r)];
      if (i === undefined && o === undefined) return '—';
      const t = r.m.longContext?.thresholdTokens;
      return `${t ? `>${tokens(t)} ` : ''}${usd(i)} / ${usd(o)}`;
    },
    title: (r) => (r.m.longContext && r.m.longContext.thresholdTokens === undefined ? '임계값 미확인: 프롬프트가 일정 길이를 넘으면 이 단가가 적용됩니다.' : '프롬프트가 임계값을 넘으면 기본 단가 대신 이 단가가 적용됩니다.'),
  },
  { key: 'speed', group: '속도', label: 'tok/s', num: true, bar: true, value: metric('speed'), show: (r) => (METRICS.speed.value(r) === undefined ? '—' : Math.round(METRICS.speed.value(r)!).toLocaleString()), title: () => 'Artificial Analysis 출력 속도 중앙값' },
  { key: 'ttft', group: '속도', label: 'TTFT', num: true, value: metric('ttft'), show: fmt('ttft'), title: () => '첫 토큰까지 시간. reasoning 모델은 추론 시간이 포함될 수 있습니다.' },
  { key: 'ctx', group: '규모', label: 'Context', num: true, bar: true, value: (r) => r.m.contextWindow, show: (r) => tokens(r.m.contextWindow) },
  { key: 'out', group: '규모', label: 'Max out', num: true, value: (r) => r.m.maxOutput, show: (r) => tokens(r.m.maxOutput) },
  { key: 'bin', group: 'Batch', label: 'In', num: true, value: p('input', 'batch') },
  { key: 'bout', group: 'Batch', label: 'Out', num: true, value: p('output', 'batch') },
];

function buildRows(models: Model[]): Row[] {
  return variantRows(models.filter((m) => matches(m, state.query) && (!state.provider || m.provider === state.provider)), state)
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
    // In-cell bars share one scale per column, taken from the rows currently shown.
    const barMax = new Map(COLS.filter((c) => c.bar).map((c) => [c.key, Math.max(...rows.map((r) => Number(c.value(r) ?? 0)), 0) || 1]));
    body.replaceChildren(
      ...rows.map((r) =>
        h('tr', null,
          ...COLS.map((c) => {
            if (c.key === 'name') {
              const on = state.compare.includes(r.m.id);
              return h('td', { class: 'name' },
                h('button', { type: 'button', class: 'cmp mini-btn', 'aria-pressed': on, title: on ? '비교에서 제거' : state.compare.length >= MAX_COMPARE ? `비교는 최대 ${MAX_COMPARE}개` : '비교에 추가', onclick: () => toggleCompare(r.m.id) }, on ? '✓' : '＋'),
                h('a', { href: `#/model/${r.m.id}` }, r.m.name));
            }
            const v = c.value(r);
            const text = c.show ? c.show(r) : typeof v === 'number' ? usd(v) : (v ?? '—');
            if (c.bar && typeof v === 'number') {
              return h('td', { class: 'num barcell', title: c.title?.(r) }, h('div', { class: 'cb' }, h('i', { style: `width:${(v / barMax.get(c.key)!) * 100}%` }), h('span', null, String(text))));
            }
            return h('td', { class: [c.num ? 'num' : '', v === undefined ? 'na' : '', c.key === 'mode' ? 'mode' : ''].join(' '), title: c.title?.(r) }, String(text));
          })),
      ),
    );
  };

  // Header bands: consecutive columns of the same group share one spanning cell, like a leaderboard's grouped header.
  const bands: { group: string; span: number }[] = [];
  for (const c of COLS) {
    const last = bands[bands.length - 1];
    if (last?.group === c.group) last.span++;
    else bands.push({ group: c.group, span: 1 });
  }
  const head = h('thead', null,
    h('tr', { class: 'bands' }, ...bands.map((b, i) => h('th', { colspan: b.span, class: `band${i % 2 ? ' alt' : ''}` }, b.group === '모델' ? '' : b.group))),
    h('tr', null, ...COLS.map((c) =>
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
