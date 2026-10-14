import { h } from '../dom.ts';
import { matches, MODES, providerSelected, supports, usd, variantRows, type Row } from '../data.ts';
import { leader, METRICS, metricFor, type Metric } from '../metrics.ts';
import { MAX_COMPARE, state, toggleCompare, update } from '../state.ts';
import type { Model } from '../types.ts';
import { emptyState, icon, pageHeading } from '../components/ui.ts';
import { rankModelRows } from '../ranking.ts';
import { codingNotice } from '../components/coding-notice.ts';
import { newBadge } from '../recent.ts';
import { multiSelect } from '../components/multi-select.ts';
import { t } from '../i18n.ts';
import { zdrOf } from '../zdr.ts';

const TABS: [string, string][] = [
  ['intelligence', t('지능', 'Intelligence')], ['coding', 'Coding Index'], ['scicode', 'SciCode'], ['math', t('수학', 'Math')], ['speed', t('속도', 'Speed')], ['ttft', t('지연', 'Latency')], ['price', t('가격', 'Price')], ['context', 'Context'],
];
const OTHER_BENCH = ['gpqa', 'hle', 'mmluPro', 'liveCodeBench', 'aime'];
const TOPS = [10, 20, 40, 0];

/** The three price series keep their slot colors on every row (blue, orange, aqua: the validated first three categorical slots). */
const PRICE_SERIES: [keyof typeof METRICS, string, string][] = [
  ['input', 'Input', 'var(--series-1)'],
  ['output', 'Output', 'var(--series-2)'],
  ['cacheRead', 'Cache read', 'var(--series-3)'],
];

function filtered(models: Model[]): Row[] {
  return variantRows(models, state)
    .filter((r) => !state.query || matches(r.m, state.query))
    .filter((r) => providerSelected(state.providers, r.m.provider))
    .filter((r) => (state.weights === '' ? true : r.m.openWeights === (state.weights === 'open')))
    .filter((r) => (state.reasoning === '' ? true : r.m.reasoning === (state.reasoning === 'yes')));
}

function identity(r: Row, multiScope: boolean): HTMLElement {
  return h('div', { class: 'who' },
    h('a', { href: `#/model/${r.m.id}`, class: 'nm' }, r.m.name),
    h('span', { class: 'sub' },
      r.m.provider,
      newBadge(r.m.id),
      multiScope ? ` · ${r.label}${r.inferred ? '?' : ''}` : null,
      r.m.openWeights ? h('em', { class: 'badge' }, t('오픈 웨이트', 'Open weights')) : null,
      r.m.reasoning ? h('em', { class: 'badge alt' }, t('추론', 'Reasoning')) : null,
      zdrOf(r.m) ? null : h('em', { class: 'badge no-zdr', title: t('Zero Data Retention 미지원', 'Zero data retention not supported') }, t('ZDR 미지원', 'No ZDR')),
      r.m.benchmarkSource?.kind === 'public-page' ? h('a', { class: 'value-source', href: r.m.benchmarkSource.url, title: t(`Artificial Analysis 공개 측정값 · ${r.m.benchmarkSource.name} · 확인일 ${r.m.benchmarkSource.verifiedAt}`, `Artificial Analysis public measurement · ${r.m.benchmarkSource.name} · checked ${r.m.benchmarkSource.verifiedAt}`), rel: 'noopener' }, t('공개 측정값 ↗', 'Public measurement ↗')) : null));
}

const cmpButton = (m: Model) =>
  h('button', { type: 'button', class: 'cmp', 'aria-label': t(`${m.name} 비교 선택`, `Select ${m.name} for comparison`), 'aria-pressed': state.compare.includes(m.id), disabled: !state.compare.includes(m.id) && state.compare.length >= MAX_COMPARE, title: state.compare.includes(m.id) ? t('비교에서 제거', 'Remove from comparison') : state.compare.length >= MAX_COMPARE ? t(`비교는 최대 ${MAX_COMPARE}개`, `Up to ${MAX_COMPARE} models`) : t('비교에 추가', 'Add to comparison'),
    onclick: () => toggleCompare(m.id) }, state.compare.includes(m.id) ? '✓' : '＋');

function singleBars(rows: Row[], metric: Metric): HTMLElement {
  const data = rankModelRows(rows, metric, state);
  const shown = state.rankTop ? data.slice(0, state.rankTop) : data;
  const max = Math.max(...shown.map((x) => x.v), 0) || 1;
  const multi = new Set(state.modes.map((m) => (m === 'global' ? 'g' : 'r'))).size > 1;
  return h('div', null,
    h('p', { class: 'count-line' }, t(`${shown.length} of ${data.length} 모델`, `${shown.length} of ${data.length} models`)),
    shown.length ? h('ol', { class: 'rank' }, ...shown.map((x, i) => {
      // Bars stop at 86% so the value label always fits at the tip.
      const w = (x.v / max) * 86;
      return h('li', { class: state.query && matches(x.r.m, state.query) ? 'rk hit' : 'rk' },
        h('span', { class: 'pos' }, String(i + 1)),
        identity(x.r, multi),
        h('div', { class: 'track' }, h('i', { class: 'fill', style: `width:${w}%` }), h('b', { class: 'val', style: `left:calc(${w}% + 8px)` }, metric.fmt(x.v))),
        cmpButton(x.r.m));
    })) : emptyState(t('표시할 순위가 없습니다', 'Nothing to rank'), t('검색어와 필터를 조정하거나 다른 평가 지표를 선택해 보세요.', 'Adjust the search and filters, or pick another metric.')));
}

function priceBars(rows: Row[]): HTMLElement {
  const blend = METRICS.blend;
  const data = rankModelRows(rows, blend, state).map(({ r, v }) => ({ r, b: v }));
  const shown = state.rankTop ? data.slice(0, state.rankTop) : data;
  const max = Math.max(...shown.flatMap((x) => PRICE_SERIES.map(([k]) => METRICS[k].value(x.r) ?? 0)), 0) || 1;
  const multi = new Set(state.modes.map((m) => (m === 'global' ? 'g' : 'r'))).size > 1;
  return h('div', null,
    h('div', { class: 'legend-row' }, ...PRICE_SERIES.map(([, l, c]) => h('span', { class: 'lg' }, h('i', { class: 'sw', style: `background:${c}` }), l))),
    h('p', { class: 'count-line' }, t(`${shown.length} of ${data.length} 모델 · 4:1 혼합 단가가 낮은 순`, `${shown.length} of ${data.length} models · cheapest 4:1 blend first`)),
    shown.length ? h('ol', { class: 'rank price' }, ...shown.map((x, i) =>
      h('li', { class: state.query && matches(x.r.m, state.query) ? 'rk hit' : 'rk' },
        h('span', { class: 'pos' }, String(i + 1)),
        identity(x.r, multi),
        h('div', { class: 'multi' }, ...PRICE_SERIES.map(([k, l, c]) => {
          const v = METRICS[k].value(x.r);
          if (v === undefined) return null;
          const w = (v / max) * 82;
          return h('div', { class: 'track thin', title: `${l} ${usd(v)}` }, h('i', { class: 'fill', style: `width:${w}%;background:${c}` }), h('b', { class: 'val', style: `left:calc(${w}% + 8px)` }, usd(v)));
        })),
        cmpButton(x.r.m)))) : emptyState(t('표시할 가격이 없습니다', 'No prices to show'), t('다른 리전이나 추론 방식을 선택해 보세요.', 'Try another region or inference mode.')));
}

function highlights(rows: Row[]): HTMLElement {
  const cards: [string, Metric][] = [[t('지능 최고', 'Most intelligent'), METRICS.intelligence], [t('가장 빠름', 'Fastest'), METRICS.speed], [t('지연 최저', 'Lowest latency'), METRICS.ttft], [t('가장 저렴 (4:1)', 'Cheapest (4:1)'), METRICS.blend], [t('Context 최대', 'Largest context'), METRICS.context]];
  return h('div', { class: 'cards' }, ...cards.map(([title, metric]) => {
    const top = leader(rows, metric);
    return h('div', { class: 'card' },
      h('span', { class: 'ct' }, title),
      top ? h('a', { href: `#/model/${top.row.m.id}`, class: 'cn' }, top.row.m.name) : h('span', { class: 'cn na' }, t('데이터 없음', 'No data')),
      top ? h('b', { class: 'cv' }, metric.fmt(top.value)) : null,
      top ? h('span', { class: 'cs' }, top.row.m.provider) : null);
  }));
}

export function renderRank(models: Model[]): HTMLElement {
  const rows = filtered(models);
  const isPrice = state.rankMetric === 'price';
  const metric = metricFor(state.rankMetric);
  const known = models.filter((m) => (!state.query || matches(m, state.query)) && providerSelected(state.providers, m.provider)
    && (!state.weights || m.openWeights === (state.weights === 'open')) && (!state.reasoning || m.reasoning === (state.reasoning === 'yes')));
  const eligibleIds = new Set(rows.map((r) => r.m.id));
  const unavailable = known.filter((m) => !eligibleIds.has(m.id));
  const scoredIds = new Set(rows.filter((r) => (isPrice ? METRICS.blend : metric).value(r) !== undefined).map((r) => r.m.id));
  const unscored = [...new Map(rows.filter((r) => !scoredIds.has(r.m.id)).map((r) => [r.m.id, r.m])).values()];
  const globalAvailable = !state.modes.includes('global') && unavailable.some((m) => supports(m, 'global', state.region).ok);
  const providers = [...new Set(models.map((m) => m.provider))].sort();
  const sel = (label: string, opts: [string, string][], value: string, on: (v: string) => void) =>
    h('label', null, label, ' ', h('select', { 'aria-label': label, onchange: (e: Event) => on((e.target as HTMLSelectElement).value) }, ...opts.map(([v, t]) => h('option', { value: v, selected: v === value }, t))));

  const tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': t('순위 평가 지표', 'Ranking metric') },
    ...TABS.map(([k, l]) => h('button', { id: `rank-tab-${k}`, type: 'button', role: 'tab', tabindex: state.rankMetric === k ? 0 : -1, 'aria-label': t(`${l} 순위 보기`, `Rank by ${l}`), 'aria-controls': 'rank-panel', 'aria-selected': state.rankMetric === k, onclick: () => update({ rankMetric: k }),
      onkeydown: (e: KeyboardEvent) => {
        const i = TABS.findIndex(([key]) => key === k);
        const next = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : -1;
        if (next < 0) return;
        e.preventDefault();
        update({ rankMetric: TABS[next][0] });
        document.getElementById(`rank-tab-${TABS[next][0]}`)?.focus({ preventScroll: true });
      },
    }, l)),
    h('select', { class: 'tab-select', 'aria-label': t('기타 벤치마크', 'Other benchmarks'), onchange: (e: Event) => { const v = (e.target as HTMLSelectElement).value; if (v) update({ rankMetric: v }); } },
      h('option', { value: '' }, t('기타 벤치마크…', 'Other benchmarks…')),
      ...OTHER_BENCH.map((k) => h('option', { value: k, selected: state.rankMetric === k }, METRICS[k].label))));

  const filters = h('div', { class: 'filters' },
    multiSelect({ id: 'providers', label: t('제공사', 'Provider'), allLabel: t('제공사 전체', 'All providers'), options: providers, selected: state.providers, onChange: (next) => update({ providers: next }) }),
    sel(t('가중치', 'Weights'), [['', t('전체', 'All')], ['open', t('오픈 웨이트', 'Open weights')], ['closed', t('독점', 'Proprietary')]], state.weights, (v) => update({ weights: v as 'open' })),
    sel(t('추론', 'Reasoning'), [['', t('전체', 'All')], ['yes', t('추론 모델', 'Reasoning')], ['no', t('비추론', 'Non-reasoning')]], state.reasoning, (v) => update({ reasoning: v as 'yes' })),
    sel(t('표시', 'Show'), TOPS.map((n): [string, string] => [String(n), n ? t(`상위 ${n}`, `Top ${n}`) : t('전체', 'All')]), String(state.rankTop), (v) => update({ rankTop: Number(v) })));
  const coverage = unscored.length || unavailable.length ? h('details', { class: 'rank-coverage', open: !!state.query },
    h('summary', null, icon('info'), t(`순위에 안 보이는 모델이 있나요? ${unscored.length}개는 ${isPrice ? '단가' : '측정값'} 미확인 · ${unavailable.length}개는 리전·추론 조건에서 제외`,
      `Missing a model? ${unscored.length} have no ${isPrice ? 'price' : 'measurement'} · ${unavailable.length} are excluded by region or inference mode`)),
    unscored.length ? h('div', { class: 'coverage-group' }, h('strong', null, t(`${isPrice ? '단가' : metric.label} 미확인`, `No ${isPrice ? 'price' : metric.label}`)),
      h('p', null, t('값이 없는 모델은 순위를 매기지 않습니다. 다른 지표나 모델 상세에서 확인해 보세요.', 'Models without a value are not ranked. Check another metric or the model page.')),
      h('div', { class: 'coverage-models' }, ...unscored.map((m) => h('a', { href: `#/model/${m.id}` }, m.name)))) : null,
    unavailable.length ? h('div', { class: 'coverage-group' }, h('strong', null, t('현재 리전·추론 방식에서 제외', 'Excluded by region or inference mode')),
      h('p', null, t(`${state.region}에서 선택한 추론 방식과 단가 조건을 만족하지 않습니다.`, `Not available in ${state.region} with the selected inference modes and price filter.`), globalAvailable ? t(' Global CRIS로 호출 가능한 모델이 있습니다.', ' Some can be called through Global CRIS.') : ''),
      globalAvailable ? h('button', { type: 'button', class: 'button secondary', onclick: () => update({ modes: MODES.filter((mode) => mode === 'global' || state.modes.includes(mode)) }) }, t('Global CRIS 포함해서 보기', 'Include Global CRIS')) : null,
      h('div', { class: 'coverage-models' }, ...unavailable.map((m) => h('a', { href: `#/model/${m.id}` }, m.name)))) : null) : null;

  return h('main', null,
    pageHeading('MODEL LEADERBOARD', t('기준을 바꾸면, 최고의 모델도 달라집니다', 'Change the metric, change the winner'), t('지능부터 속도와 가격까지, 서비스에 중요한 지표로 모델의 순위를 확인하세요.', 'Rank models by what matters to you, from intelligence to speed and price.')),
    h('p', { class: 'note' }, `${state.region} · ${state.tier} · ${t('선택한 추론 방식 기준. 벤치마크·속도: ', 'selected inference modes. Benchmarks and speed: ')}`, h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, 'Artificial Analysis'), t('. 가중치·추론 구분은 models.dev 기준입니다. 막대는 0에서 시작합니다.', '. Weights and reasoning flags come from models.dev. Bars start at 0.')),
    highlights(rows), tabs,
    h('p', { class: 'note' }, isPrice ? t('USD / 1M tokens. 막대 색은 Input · Output · Cache read입니다.', 'USD / 1M tokens. Bar colors are Input · Output · Cache read.') : metric.hint),
    filters,
    state.rankMetric === 'coding' ? codingNotice(rows.map((r) => r.m),
      h('button', { class: 'button secondary', type: 'button', 'aria-label': t('SciCode 측정값으로 비교하기', 'Compare on SciCode instead'), onclick: () => {
        update({ rankMetric: 'scicode' });
        document.getElementById('rank-tab-scicode')?.focus({ preventScroll: true });
      } }, t('SciCode 측정값으로 비교하기', 'Compare on SciCode instead'))) : null,
    h('p', { class: 'rank-limit-note' }, t(`${state.rankTop ? `상위 ${state.rankTop}개 모델` : '전체 모델'}을 표시합니다. 모델당 한 행이며, 여러 추론 범위를 선택하면 확인된 혼합 단가가 가장 낮은 범위를 사용합니다. `, `Showing ${state.rankTop ? `the top ${state.rankTop} models` : 'all models'}. One row per model; with several inference scopes selected, the scope with the lowest known blended price is used. `),
      state.rankTop ? h('button', { type: 'button', class: 'text-button', onclick: () => update({ rankTop: 0 }) }, t('전체 순위 보기', 'Show the full ranking')) : null),
    h('div', { id: 'rank-panel', role: 'tabpanel', 'aria-labelledby': TABS.some(([key]) => key === state.rankMetric) ? `rank-tab-${state.rankMetric}` : undefined, 'aria-label': TABS.some(([key]) => key === state.rankMetric) ? undefined : t(`${metric.label} 순위`, `${metric.label} ranking`) }, isPrice ? priceBars(rows) : singleBars(rows, metric)),
    coverage,
    state.compare.length ? h('p', { class: 'note' }, h('a', { href: '#/compare' }, t(`선택한 ${state.compare.length}개 모델 비교하기 →`, `Compare ${state.compare.length} selected models →`))) : null);
}
