import { h } from '../dom.ts';
import { blended, longPriceOf, matches, priceOf, tokens, usd, variantRows, type Row } from '../data.ts';
import { METRICS } from '../metrics.ts';
import { MAX_COMPARE, state, toggleCompare, update } from '../state.ts';
import type { Model, TokenKind } from '../types.ts';
import { emptyState, icon, pageHeading, type IconName } from '../components/ui.ts';

interface Col {
  key: string;
  /** Header band this column sits under. */
  group: string;
  /** Draw an in-cell bar scaled to the largest value among the visible rows. */
  bar?: boolean;
  /** Hidden until "열 더 보기" is on, so the default table fits a normal screen. */
  more?: boolean;
  label: string;
  num?: boolean;
  value: (r: Row) => string | number | undefined;
  show?: (r: Row) => string;
  title?: (r: Row) => string | undefined;
  /** Small muted line above the value. */
  note?: (r: Row) => string | undefined;
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
  { key: 'coding', more: true, group: '성능 (Artificial Analysis)', label: 'Coding', num: true, bar: true, value: metric('coding'), show: fmt('coding') },
  { key: 'in', group: '단가 (USD / 1M tokens)', label: 'Input', num: true, value: p('input') },
  { key: 'output', group: '단가 (USD / 1M tokens)', label: 'Output', num: true, value: p('output') },
  { key: 'cr', group: '단가 (USD / 1M tokens)', label: 'Cache read', num: true, value: p('cacheRead') },
  { key: 'cw', more: true, group: '단가 (USD / 1M tokens)', label: 'Cache write', num: true, value: p('cacheWrite') },
  { key: 'bl', group: '단가 (USD / 1M tokens)', label: '4:1 혼합', num: true, value: (r) => blended(p('input')(r), p('output')(r)) },
  {
    key: 'lc', more: true, group: '장문', label: 'In / Out', num: true, value: lc('input'),
    show: (r) => {
      const [i, o] = [lc('input')(r), lc('output')(r)];
      if (i === undefined && o === undefined) return '—';
      return `${usd(i)} / ${usd(o)}`;
    },
    note: (r) => (r.m.longContext?.thresholdTokens ? `>${tokens(r.m.longContext.thresholdTokens)}` : r.m.longContext ? '임계값 미확인' : undefined),
    title: (r) => (r.m.longContext && r.m.longContext.thresholdTokens === undefined ? '임계값 미확인: 프롬프트가 일정 길이를 넘으면 이 단가가 적용됩니다.' : '프롬프트가 임계값을 넘으면 기본 단가 대신 이 단가가 적용됩니다.'),
  },
  { key: 'speed', group: '속도', label: 'tok/s', num: true, bar: true, value: metric('speed'), show: (r) => (METRICS.speed.value(r) === undefined ? '—' : Math.round(METRICS.speed.value(r)!).toLocaleString()), title: () => 'Artificial Analysis 출력 속도 중앙값' },
  { key: 'ttft', more: true, group: '속도', label: 'TTFT', num: true, value: metric('ttft'), show: fmt('ttft'), title: () => '첫 토큰까지 시간. reasoning 모델은 추론 시간이 포함될 수 있습니다.' },
  { key: 'ctx', group: '규모', label: 'Context', num: true, bar: true, value: (r) => r.m.contextWindow, show: (r) => tokens(r.m.contextWindow) },
  { key: 'out', more: true, group: '규모', label: 'Max out', num: true, value: (r) => r.m.maxOutput, show: (r) => tokens(r.m.maxOutput) },
  { key: 'bin', more: true, group: 'Batch', label: 'In', num: true, value: p('input', 'batch') },
  { key: 'bout', more: true, group: 'Batch', label: 'Out', num: true, value: p('output', 'batch') },
];

function buildRows(models: Model[]): Row[] {
  return variantRows(models.filter((m) => matches(m, state.query) && (!state.provider || m.provider === state.provider)), state)
    .filter((r) => !state.onlyCache || p('cacheRead')(r) !== undefined);
}

export function renderTable(models: Model[]): HTMLElement {
  const cols = COLS.filter((c) => !c.more || state.expandCols);
  const providers = [...new Set(models.map((m) => m.provider))].sort();
  const body = h('tbody');
  const count = h('span', { class: 'count', role: 'status' });
  const filtered = buildRows(models);
  const visibleModels = [...new Map(filtered.map((r) => [r.m.id, r.m])).values()];
  const prices = filtered.map((r) => blended(p('input')(r), p('output')(r))).filter((v): v is number => v !== undefined);
  const contexts = visibleModels.map((m) => m.contextWindow).filter((v): v is number => v !== undefined);
  const selectedCount = models.filter((m) => state.compare.includes(m.id)).length;
  const reset = () => update({ query: '', provider: '', onlyCache: false, onlyInRegion: true, tier: 'standard' });
  const hasFilters = !!state.query || !!state.provider || state.onlyCache || !state.onlyInRegion || state.tier !== 'standard';

  const draw = () => {
    const col = COLS.find((c) => c.key === state.sort.key) ?? COLS[1];
    const rows = filtered.sort((a, b) => {
      const [x, y] = [col.value(a), col.value(b)];
      // Unknown values always sort last, whichever direction is active.
      if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
      const c = (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * state.sort.dir;
      return c || a.m.name.localeCompare(b.m.name) || a.scope.localeCompare(b.scope);
    });
    count.textContent = `${visibleModels.length}개 모델 · ${rows.length}개 단가`;
    // In-cell bars share one scale per column, taken from the rows currently shown.
    const barMax = new Map(cols.filter((c) => c.bar).map((c) => [c.key, Math.max(...rows.map((r) => Number(c.value(r) ?? 0)), 0) || 1]));
    body.replaceChildren(
      ...rows.map((r) =>
        h('tr', { class: state.compare.includes(r.m.id) ? 'selected' : undefined },
          ...cols.map((c) => {
            if (c.key === 'name') {
              const on = state.compare.includes(r.m.id);
              return h('td', { class: 'name' },
                h('div', { class: 'model-cell' },
                  h('button', { type: 'button', class: 'cmp mini-btn', 'aria-label': `${r.m.name} 비교 선택`, 'aria-pressed': on, disabled: !on && state.compare.length >= MAX_COMPARE, title: on ? '비교에서 제거' : state.compare.length >= MAX_COMPARE ? `비교는 최대 ${MAX_COMPARE}개` : '비교에 추가', onclick: () => toggleCompare(r.m.id) }, on ? icon('check') : '＋'),
                  h('a', { href: `#/model/${r.m.id}` }, r.m.name)));
            }
            if (c.key === 'provider') return h('td', null, h('span', { class: 'provider-tag' }, r.m.provider));
            const v = c.value(r);
            const text = c.show ? c.show(r) : typeof v === 'number' ? usd(v) : (v ?? '—');
            if (c.bar && typeof v === 'number') {
              return h('td', { class: 'num barcell', title: c.title?.(r) }, h('div', { class: 'cb' }, h('i', { style: `width:${(v / barMax.get(c.key)!) * 100}%` }), h('span', null, String(text))));
            }
            const note = c.note?.(r);
            return h('td', { class: [c.num ? 'num' : '', v === undefined ? 'na' : '', c.key === 'mode' ? 'mode' : ''].join(' '), title: c.title?.(r) }, note ? h('small', { class: 'cnote' }, note) : null, String(text));
          })),
      ),
    );
    if (!rows.length) body.append(h('tr', null, h('td', { colspan: cols.length },
      emptyState('조건에 맞는 모델이 없습니다', '검색어를 바꾸거나 필터를 초기화해 보세요. 리전과 추론 방식도 확인할 수 있습니다.',
        h('button', { type: 'button', class: 'button secondary', onclick: reset }, icon('reset'), '필터 초기화')))));
  };

  // Header bands: consecutive columns of the same group share one spanning cell, like a leaderboard's grouped header.
  const bands: { group: string; span: number }[] = [];
  for (const c of cols) {
    const last = bands[bands.length - 1];
    if (last?.group === c.group) last.span++;
    else bands.push({ group: c.group, span: 1 });
  }
  const head = h('thead', null,
    h('tr', { class: 'bands' }, ...bands.map((b, i) => h('th', { colspan: b.span, class: `band${i % 2 ? ' alt' : ''}` }, b.group === '모델' ? '' : b.group))),
    h('tr', null, ...cols.map((c) =>
      h('th', { scope: 'col', class: c.num ? 'num' : '', 'aria-sort': state.sort.key === c.key ? (state.sort.dir === 1 ? 'ascending' : 'descending') : 'none' },
        h('button', { type: 'button', 'aria-label': `${c.label} 정렬`, onclick: () => update({ sort: { key: c.key, dir: state.sort.key === c.key && state.sort.dir === 1 ? -1 : 1 } }) },
          c.label + (state.sort.key === c.key ? (state.sort.dir === 1 ? ' ▲' : ' ▼') : ''))))));

  const filters = h('div', { class: 'filters table-filters' },
    h('span', { class: 'filter-label' }, icon('filter'), '필터'),
    h('select', { 'aria-label': '제공사', onchange: (e: Event) => update({ provider: (e.target as HTMLSelectElement).value }) },
      h('option', { value: '' }, '모든 제공사'), ...providers.map((x) => h('option', { value: x, selected: x === state.provider }, x))),
    h('label', null, '티어 ', h('select', { 'aria-label': '티어', onchange: (e: Event) => update({ tier: (e.target as HTMLSelectElement).value as 'standard' }) },
      ...(['standard', 'priority', 'flex'] as const).map((t) => h('option', { value: t, selected: t === state.tier }, t)))),
    h('label', null, h('input', { type: 'checkbox', 'aria-label': '선택 리전 단가 있는 모델만', checked: state.onlyInRegion, onchange: (e: Event) => update({ onlyInRegion: (e.target as HTMLInputElement).checked }) }), '리전 단가 있는 모델만'),
    h('label', null, h('input', { type: 'checkbox', 'aria-label': '캐시 지원 모델만', checked: state.onlyCache, onchange: (e: Event) => update({ onlyCache: (e.target as HTMLInputElement).checked }) }), '캐시 지원 모델만'),
    hasFilters ? h('button', { class: 'text-button reset-filters', type: 'button', onclick: reset }, icon('reset'), '초기화') : null);

  const activeFilters = h('div', { class: 'active-filters' },
    state.query ? h('button', { class: 'filter-pill', type: 'button', onclick: () => update({ query: '' }), 'aria-label': '검색어 필터 제거' }, `검색: ${state.query}`, icon('close')) : null,
    state.provider ? h('button', { class: 'filter-pill', type: 'button', onclick: () => update({ provider: '' }), 'aria-label': '제공사 필터 제거' }, state.provider, icon('close')) : null,
    state.onlyCache ? h('button', { class: 'filter-pill', type: 'button', onclick: () => update({ onlyCache: false }), 'aria-label': '캐시 필터 제거' }, '캐시 지원', icon('close')) : null);
  const stats: [IconName, string, string, string][] = [
    ['layers', '탐색 가능한 모델', String(visibleModels.length), `전체 ${models.length}개 중 현재 조건`],
    ['globe', '모델 제공사', String(new Set(visibleModels.map((m) => m.provider)).size), '현재 조건에서 선택 가능한 제공사'],
    ['coins', '최저 혼합 단가', prices.length ? usd(Math.min(...prices)) : '—', '입력 4 : 출력 1 · USD / 1M tokens'],
    ['context', '최대 컨텍스트', contexts.length ? tokens(Math.max(...contexts)) : '—', '현재 조건의 최대 입력 컨텍스트'],
  ];
  const summary = h('section', { class: 'overview', 'aria-label': '모델 현황' },
    ...stats.map(([glyph, label, value, hint]) => h('div', { class: 'overview-card' },
      h('div', { class: 'overview-label' }, label, icon(glyph)),
      h('strong', { class: 'overview-value' }, value), h('span', { class: 'overview-hint' }, hint))));
  const compareToolbar = h('div', { class: `table-toolbar${selectedCount ? ' has-selection' : ''}`, 'aria-label': '표에서 선택한 모델 비교' },
    h('div', { class: 'table-selection-summary' }, icon('compare'),
      h('strong', null, selectedCount ? `${selectedCount}개 모델 선택됨` : '비교할 모델을 선택하세요'),
      h('span', { class: 'selection-limit' }, `최대 ${MAX_COMPARE}개`)),
    h('div', { class: 'table-selection-actions' },
      h('button', { class: 'text-button', type: 'button', 'aria-label': '비교 모델 선택 모두 해제', disabled: !selectedCount, onclick: () => update({ compare: [] }) }, '선택 해제'),
      h('button', { class: 'button primary', type: 'button', 'aria-label': '선택한 모델 비교하기', disabled: !selectedCount, onclick: () => { location.hash = '#/compare'; } },
        `비교하기${selectedCount ? ` (${selectedCount})` : ''}`, icon('arrow'))));

  draw();
  return h('main', { class: 'explorer' },
    pageHeading('AMAZON BEDROCK', '내 서비스에 맞는 모델을 찾아보세요', '가격, 성능, 속도를 한눈에 살펴보고 더 나은 모델을 선택하세요.'),
    summary,
    h('section', { class: 'table-section', 'aria-label': '모델 탐색' },
      h('div', { class: 'section-heading' }, h('div', { class: 'section-title' }, h('h2', null, '모든 모델'), count),
        h('label', { class: 'columns-toggle' }, h('input', { type: 'checkbox', 'aria-label': '상세 열 보기', checked: state.expandCols, onchange: (e: Event) => update({ expandCols: (e.target as HTMLInputElement).checked }) }), '상세 열 보기')),
      filters, activeFilters.childElementCount ? activeFilters : null,
      compareToolbar,
      h('div', { class: 'table-hint' }, h('span', null, '＋로 비교할 모델을 선택하세요. 모델 이름을 누르면 상세 정보를 볼 수 있습니다.'), h('span', { class: 'unit-label' }, 'USD / 1M tokens')),
      h('div', { class: 'scroll', tabindex: 0, 'aria-label': '모델 가격 및 성능 비교 표' }, h('table', null, h('caption', { class: 'sr-only' }, `${state.region} 리전의 모델별 가격 및 성능`), head, body)),
      h('details', { class: 'data-guide' }, h('summary', null, icon('info'), '가격과 데이터 읽는 방법'),
        h('p', null, `선택한 추론 방식을 지원하는 모델만 표시합니다. In-region과 Geo CRIS는 같은 단가표를 사용하므로 한 행으로 합치고, Global CRIS는 별도 행으로 표시합니다. “—”는 해당 리전·티어의 단가 또는 측정값이 없거나 미확인이라는 뜻입니다. 혼합 단가는 캐시 없이 입력 4 : 출력 1 비율입니다. 리전별 지원 방식은 AWS 모델 카드를 우선하며, 카드가 없으면 models.dev와 가격 정보를 사용해 추정합니다. Context는 모델 카드 및 models.dev 기준입니다.`))));
}
