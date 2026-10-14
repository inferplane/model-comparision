import { h } from '../dom.ts';
import { blended, longPriceOf, matches, priceOf, providerSelected, rowModelId, tokens, usd, variantRows, type Row } from '../data.ts';
import { METRICS } from '../metrics.ts';
import { MAX_COMPARE, state, toggleCompare, update } from '../state.ts';
import type { Model, TokenKind } from '../types.ts';
import { copyButton, emptyState, icon, pageHeading, type IconName } from '../components/ui.ts';
import { codingNotice } from '../components/coding-notice.ts';
import { newBadge } from '../recent.ts';
import { multiSelect } from '../components/multi-select.ts';
import { locale, t } from '../i18n.ts';
import { zdrOf } from '../zdr.ts';

interface Col {
  key: string;
  /** Header band this column sits under. */
  group: string;
  /** Draw an in-cell bar scaled to the largest value among the visible rows. */
  bar?: boolean;
  /** Hidden until "상세 열 보기" is on, so the default table fits a normal screen. */
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

const MODEL = t('모델', 'Model');
const PERF = t('성능 (Artificial Analysis)', 'Performance (Artificial Analysis)');
const PRICE = t('단가 (USD / 1M tokens)', 'Price (USD / 1M tokens)');
const SPEED = t('속도', 'Speed');
const SIZE = t('규모', 'Limits');
const ZDR_TITLE = t('Zero Data Retention: 요청·응답 데이터를 보관하지 않는 처리 지원 여부', 'Zero data retention: whether prompts and responses can be processed without being stored');

const COLS: Col[] = [
  { key: 'name', group: MODEL, label: MODEL, value: (r) => r.m.name },
  { key: 'provider', group: MODEL, label: t('제공사', 'Provider'), value: (r) => r.m.provider },
  { key: 'zdr', group: MODEL, label: 'ZDR', value: (r) => Number(zdrOf(r.m)), title: () => ZDR_TITLE },
  { key: 'mode', group: MODEL, label: t('추론', 'Mode'), value: (r) => r.label, show: (r) => r.label + (r.inferred ? '?' : ''), title: (r) => (r.inferred ? t('models.dev에 없는 모델이라 가격 존재 여부로 추정한 값입니다.', 'Not listed on models.dev, so inferred from which prices exist.') : undefined) },
  { key: 'ai', group: PERF, label: 'Intelligence', num: true, bar: true, value: metric('intelligence'), show: fmt('intelligence'), title: () => 'Artificial Analysis Intelligence Index' },
  { key: 'coding', more: true, group: PERF, label: 'Coding Index', num: true, bar: true, value: metric('coding'), show: (r) => METRICS.coding.value(r) === undefined ? t('미제공', 'N/A') : fmt('coding')(r), title: () => METRICS.coding.hint },
  { key: 'scicode', more: true, group: PERF, label: 'SciCode (%)', num: true, bar: true, value: metric('scicode'), show: fmt('scicode'), title: () => METRICS.scicode.hint },
  { key: 'in', group: PRICE, label: 'Input', num: true, value: p('input') },
  { key: 'output', group: PRICE, label: 'Output', num: true, value: p('output') },
  { key: 'cr', group: PRICE, label: 'Cache read', num: true, value: p('cacheRead') },
  { key: 'cw', more: true, group: PRICE, label: 'Cache write', num: true, value: p('cacheWrite') },
  { key: 'bl', group: PRICE, label: t('4:1 혼합', '4:1 blend'), num: true, value: (r) => blended(p('input')(r), p('output')(r)) },
  {
    key: 'lc', more: true, group: t('장문', 'Long context'), label: 'In / Out', num: true, value: lc('input'),
    show: (r) => {
      const [i, o] = [lc('input')(r), lc('output')(r)];
      if (i === undefined && o === undefined) return '—';
      return `${usd(i)} / ${usd(o)}`;
    },
    note: (r) => (r.m.longContext?.thresholdTokens ? `>${tokens(r.m.longContext.thresholdTokens)}` : r.m.longContext ? t('임계값 미확인', 'Threshold unknown') : undefined),
    title: (r) => (r.m.longContext && r.m.longContext.thresholdTokens === undefined ? t('임계값 미확인: 프롬프트가 일정 길이를 넘으면 이 단가가 적용됩니다.', 'Threshold unknown: this price applies once a prompt exceeds a certain length.') : t('프롬프트가 임계값을 넘으면 기본 단가 대신 이 단가가 적용됩니다.', 'Replaces the base price once a prompt exceeds the threshold.')),
  },
  { key: 'speed', group: SPEED, label: 'tok/s', num: true, bar: true, value: metric('speed'), show: (r) => (METRICS.speed.value(r) === undefined ? '—' : Math.round(METRICS.speed.value(r)!).toLocaleString(locale)), title: () => t('Artificial Analysis 출력 속도 중앙값', 'Artificial Analysis median output speed') },
  { key: 'ttft', more: true, group: SPEED, label: 'TTFT', num: true, value: metric('ttft'), show: fmt('ttft'), title: () => t('첫 토큰까지 시간. reasoning 모델은 추론 시간이 포함될 수 있습니다.', 'Time to first token. May include thinking time for reasoning models.') },
  { key: 'ctx', group: SIZE, label: 'Context', num: true, bar: true, value: (r) => r.m.contextWindow, show: (r) => tokens(r.m.contextWindow) },
  { key: 'out', more: true, group: SIZE, label: 'Max out', num: true, value: (r) => r.m.maxOutput, show: (r) => tokens(r.m.maxOutput) },
  { key: 'bin', more: true, group: 'Batch', label: 'In', num: true, value: p('input', 'batch') },
  { key: 'bout', more: true, group: 'Batch', label: 'Out', num: true, value: p('output', 'batch') },
];

function buildRows(models: Model[]): Row[] {
  return variantRows(models.filter((m) => matches(m, state.query) && providerSelected(state.providers, m.provider)), state)
    .filter((r) => !state.onlyCache || p('cacheRead')(r) !== undefined)
    .filter((r) => !state.onlyZdr || zdrOf(r.m));
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
  const reset = () => update({ query: '', providers: [], onlyCache: false, onlyZdr: false, onlyInRegion: true, tier: 'standard' });
  const hasFilters = !!state.query || state.providers.length > 0 || state.onlyCache || state.onlyZdr || !state.onlyInRegion || state.tier !== 'standard';

  const draw = () => {
    const col = COLS.find((c) => c.key === state.sort.key) ?? COLS[1];
    const rows = filtered.sort((a, b) => {
      const [x, y] = [col.value(a), col.value(b)];
      // Unknown values always sort last, whichever direction is active.
      if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
      const c = (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * state.sort.dir;
      return c || a.m.name.localeCompare(b.m.name) || a.scope.localeCompare(b.scope);
    });
    count.textContent = t(`${visibleModels.length}개 모델 · ${rows.length}개 단가`, `${visibleModels.length} models · ${rows.length} price rows`);
    // In-cell bars share one scale per column, taken from the rows currently shown.
    const barMax = new Map(cols.filter((c) => c.bar).map((c) => [c.key, Math.max(...rows.map((r) => Number(c.value(r) ?? 0)), 0) || 1]));
    body.replaceChildren(
      ...rows.map((r) =>
        h('tr', { class: state.compare.includes(r.m.id) ? 'selected' : undefined },
          ...cols.map((c) => {
            if (c.key === 'name') {
              const on = state.compare.includes(r.m.id);
              const modelId = rowModelId(r, state.region, state.modes);
              return h('td', { class: 'name' },
                h('div', { class: 'model-cell' },
                  h('button', { type: 'button', class: 'cmp mini-btn', 'aria-label': t(`${r.m.name} 비교 선택`, `Select ${r.m.name} for comparison`), 'aria-pressed': on, disabled: !on && state.compare.length >= MAX_COMPARE, title: on ? t('비교에서 제거', 'Remove from comparison') : state.compare.length >= MAX_COMPARE ? t(`비교는 최대 ${MAX_COMPARE}개`, `Up to ${MAX_COMPARE} models`) : t('비교에 추가', 'Add to comparison'), onclick: () => toggleCompare(r.m.id) }, on ? icon('check') : '＋'),
                  h('a', { href: `#/model/${r.m.id}` }, r.m.name), newBadge(r.m.id),
                  // A model with In-region and Global rows gets one button per row, so the label names the scope too.
                  modelId ? copyButton(modelId, t(`${r.m.name} ${r.label} 모델 ID 복사`, `Copy ${r.m.name} ${r.label} model ID`)) : null));
            }
            if (c.key === 'provider') return h('td', null, h('span', { class: 'provider-tag' }, r.m.provider));
            if (c.key === 'zdr') {
              const on = zdrOf(r.m);
              return h('td', { class: `zdr${on ? ' on' : ' off'}`, title: on ? t('ZDR 지원', 'ZDR supported') : t('ZDR 미지원', 'ZDR not supported') },
                h('span', { 'aria-hidden': 'true' }, on ? '✓' : '✕'), h('span', { class: 'sr-only' }, on ? t('지원', 'Supported') : t('미지원', 'Not supported')));
            }
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
      emptyState(t('조건에 맞는 모델이 없습니다', 'No models match'), t('검색어를 바꾸거나 필터를 초기화해 보세요. 리전과 추론 방식도 확인할 수 있습니다.', 'Try another search or reset the filters. Check the region and inference modes too.'),
        h('button', { type: 'button', class: 'button secondary', onclick: reset }, icon('reset'), t('필터 초기화', 'Reset filters'))))));
  };

  // Header bands: consecutive columns of the same group share one spanning cell, like a leaderboard's grouped header.
  const bands: { group: string; span: number }[] = [];
  for (const c of cols) {
    const last = bands[bands.length - 1];
    if (last?.group === c.group) last.span++;
    else bands.push({ group: c.group, span: 1 });
  }
  const head = h('thead', null,
    h('tr', { class: 'bands' }, ...bands.map((b, i) => h('th', { colspan: b.span, class: `band${i % 2 ? ' alt' : ''}` }, b.group === MODEL ? '' : b.group))),
    h('tr', null, ...cols.map((c) =>
      h('th', { scope: 'col', class: c.num ? 'num' : '', title: c.key === 'zdr' ? ZDR_TITLE : undefined, 'aria-sort': state.sort.key === c.key ? (state.sort.dir === 1 ? 'ascending' : 'descending') : 'none' },
        h('button', { type: 'button', 'aria-label': t(`${c.label} 정렬`, `Sort by ${c.label}`), onclick: () => update({ sort: { key: c.key, dir: state.sort.key === c.key && state.sort.dir === 1 ? -1 : 1 } }) },
          c.label + (state.sort.key === c.key ? (state.sort.dir === 1 ? ' ▲' : ' ▼') : ''))))));

  const filters = h('div', { class: 'filters table-filters' },
    h('span', { class: 'filter-label' }, icon('filter'), t('필터', 'Filters')),
    multiSelect({ id: 'providers', label: t('제공사', 'Provider'), allLabel: t('모든 제공사', 'All providers'), options: providers, selected: state.providers, onChange: (next) => update({ providers: next }) }),
    h('label', null, t('티어 ', 'Tier '), h('select', { 'aria-label': t('티어', 'Tier'), onchange: (e: Event) => update({ tier: (e.target as HTMLSelectElement).value as 'standard' }) },
      ...(['standard', 'priority', 'flex'] as const).map((t) => h('option', { value: t, selected: t === state.tier }, t)))),
    h('label', null, h('input', { type: 'checkbox', 'aria-label': t('선택 리전 단가 있는 모델만', 'Only models priced in the selected region'), checked: state.onlyInRegion, onchange: (e: Event) => update({ onlyInRegion: (e.target as HTMLInputElement).checked }) }), t('리전 단가 있는 모델만', 'Priced in region only')),
    h('label', null, h('input', { type: 'checkbox', 'aria-label': t('캐시 지원 모델만', 'Only models with caching'), checked: state.onlyCache, onchange: (e: Event) => update({ onlyCache: (e.target as HTMLInputElement).checked }) }), t('캐시 지원 모델만', 'Caching only')),
    h('label', { title: ZDR_TITLE }, h('input', { type: 'checkbox', 'aria-label': t('ZDR 지원 모델만', 'Only models with ZDR'), checked: state.onlyZdr, onchange: (e: Event) => update({ onlyZdr: (e.target as HTMLInputElement).checked }) }), t('ZDR 지원 모델만', 'ZDR only')),
    hasFilters ? h('button', { class: 'text-button reset-filters', type: 'button', onclick: reset }, icon('reset'), t('초기화', 'Reset')) : null);

  const activeFilters = h('div', { class: 'active-filters' },
    state.query ? h('button', { class: 'filter-pill', type: 'button', onclick: () => update({ query: '' }), 'aria-label': t('검색어 필터 제거', 'Remove search filter') }, `${t('검색', 'Search')}: ${state.query}`, icon('close')) : null,
    ...state.providers.map((p) => h('button', { class: 'filter-pill', type: 'button', onclick: () => update({ providers: state.providers.filter((x) => x !== p) }), 'aria-label': t(`제공사 ${p} 필터 제거`, `Remove provider filter ${p}`) }, p, icon('close'))),
    state.onlyCache ? h('button', { class: 'filter-pill', type: 'button', onclick: () => update({ onlyCache: false }), 'aria-label': t('캐시 필터 제거', 'Remove caching filter') }, t('캐시 지원', 'Caching'), icon('close')) : null,
    state.onlyZdr ? h('button', { class: 'filter-pill', type: 'button', onclick: () => update({ onlyZdr: false }), 'aria-label': t('ZDR 필터 제거', 'Remove ZDR filter') }, t('ZDR 지원', 'ZDR'), icon('close')) : null);
  const stats: [IconName, string, string, string][] = [
    ['layers', t('탐색 가능한 모델', 'Models'), String(visibleModels.length), t(`전체 ${models.length}개 중 현재 조건`, `Matching, of ${models.length} total`)],
    ['globe', t('모델 제공사', 'Providers'), String(new Set(visibleModels.map((m) => m.provider)).size), t('현재 조건에서 선택 가능한 제공사', 'Providers with matching models')],
    ['coins', t('최저 혼합 단가', 'Lowest blended price'), prices.length ? usd(Math.min(...prices)) : '—', t('입력 4 : 출력 1 · USD / 1M tokens', '4 input : 1 output · USD / 1M tokens')],
    ['context', t('최대 컨텍스트', 'Largest context'), contexts.length ? tokens(Math.max(...contexts)) : '—', t('현재 조건의 최대 입력 컨텍스트', 'Largest input context among matches')],
  ];
  const summary = h('section', { class: 'overview', 'aria-label': t('모델 현황', 'Overview') },
    ...stats.map(([glyph, label, value, hint]) => h('div', { class: 'overview-card' },
      h('div', { class: 'overview-label' }, label, icon(glyph)),
      h('strong', { class: 'overview-value' }, value), h('span', { class: 'overview-hint' }, hint))));
  const compareToolbar = h('div', { class: `table-toolbar${selectedCount ? ' has-selection' : ''}`, 'aria-label': t('표에서 선택한 모델 비교', 'Compare models selected in the table') },
    h('div', { class: 'table-selection-summary' }, icon('compare'),
      h('strong', null, selectedCount ? t(`${selectedCount}개 모델 선택됨`, `${selectedCount} selected`) : t('비교할 모델을 선택하세요', 'Select models to compare')),
      h('span', { class: 'selection-limit' }, t(`최대 ${MAX_COMPARE}개`, `Up to ${MAX_COMPARE}`))),
    h('div', { class: 'table-selection-actions' },
      h('button', { class: 'text-button', type: 'button', 'aria-label': t('비교 모델 선택 모두 해제', 'Clear the comparison selection'), disabled: !selectedCount, onclick: () => update({ compare: [] }) }, t('선택 해제', 'Clear')),
      h('button', { class: 'button primary', type: 'button', 'aria-label': t('선택한 모델 비교하기', 'Compare selected models'), disabled: !selectedCount, onclick: () => { location.hash = '#/compare'; } },
        `${t('비교하기', 'Compare')}${selectedCount ? ` (${selectedCount})` : ''}`, icon('arrow'))));

  draw();
  return h('main', { class: 'explorer' },
    pageHeading('AMAZON BEDROCK', t('내 서비스에 맞는 모델을 찾아보세요', 'Find the right model for your workload'), t('가격, 성능, 속도를 한눈에 살펴보고 더 나은 모델을 선택하세요.', 'See price, performance and speed side by side, and pick a better model.')),
    summary,
    h('section', { class: 'table-section', 'aria-label': t('모델 탐색', 'Explore models') },
      h('div', { class: 'section-heading' }, h('div', { class: 'section-title' }, h('h2', null, t('모든 모델', 'All models')), count),
        h('label', { class: 'columns-toggle' }, h('input', { type: 'checkbox', 'aria-label': t('상세 열 보기', 'Show more columns'), checked: state.expandCols, onchange: (e: Event) => update({ expandCols: (e.target as HTMLInputElement).checked }) }), t('상세 열 보기', 'More columns'))),
      filters, activeFilters.childElementCount ? activeFilters : null,
      compareToolbar,
      state.expandCols ? codingNotice(visibleModels) : null,
      h('div', { class: 'table-hint' }, h('span', null, t('＋로 비교할 모델을 선택하세요. 모델 이름을 누르면 상세 정보를 볼 수 있습니다. 복사 버튼은 해당 행의 모델 ID를 복사합니다.', 'Use ＋ to pick models to compare. Click a name for details; the copy button copies that row\'s model ID.')), h('span', { class: 'unit-label' }, 'USD / 1M tokens')),
      h('div', { class: 'scroll', tabindex: 0, 'aria-label': t('모델 가격 및 성능 비교 표', 'Model price and performance table') }, h('table', null, h('caption', { class: 'sr-only' }, t(`${state.region} 리전의 모델별 가격 및 성능`, `Model prices and performance in ${state.region}`)), head, body)),
      h('details', { class: 'data-guide' }, h('summary', null, icon('info'), t('가격과 데이터 읽는 방법', 'How to read the prices and data')),
        h('p', null, t('선택한 추론 방식을 지원하는 모델만 표시합니다. In-region과 Geo CRIS는 같은 단가표를 사용하므로 한 행으로 합치고, Global CRIS는 별도 행으로 표시합니다. “—”는 해당 리전·티어의 단가 또는 측정값이 없거나 미확인이라는 뜻입니다. 혼합 단가는 캐시 없이 입력 4 : 출력 1 비율입니다. 리전별 지원 방식은 AWS 모델 카드를 우선하며, 카드가 없으면 models.dev와 가격 정보를 사용해 추정합니다. Context는 모델 카드 및 models.dev 기준입니다. ZDR은 Zero Data Retention 지원 여부이며, 현재 GPT 계열과 Fable 모델은 지원하지 않습니다.', 'Only models that support the selected inference modes are shown. In-region and Geo CRIS share one price list, so they are merged into one row; Global CRIS gets its own row. “—” means no price or measurement for that region and tier, or that it is unknown. The blended price is 4 input : 1 output without caching. Per-region support comes from the AWS model cards first, and is inferred from models.dev and prices when there is no card. Context is per the model cards and models.dev. ZDR is zero data retention support; GPT and Fable models currently do not offer it.')))));
}
