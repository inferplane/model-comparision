import { h } from '../dom.ts';
import { matches, MODES, supports, usd, variantRows, type Row } from '../data.ts';
import { leader, METRICS, metricFor, type Metric } from '../metrics.ts';
import { MAX_COMPARE, state, toggleCompare, update } from '../state.ts';
import type { Model } from '../types.ts';
import { emptyState, icon, pageHeading } from '../components/ui.ts';
import { rankModelRows } from '../ranking.ts';
import { codingNotice } from '../components/coding-notice.ts';
import { newBadge } from '../recent.ts';

const TABS: [string, string][] = [
  ['intelligence', '지능'], ['coding', 'Coding Index'], ['scicode', 'SciCode'], ['math', '수학'], ['speed', '속도'], ['ttft', '지연'], ['price', '가격'], ['context', 'Context'],
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
    .filter((r) => !state.provider || r.m.provider === state.provider)
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
      r.m.openWeights ? h('em', { class: 'badge' }, '오픈 웨이트') : null,
      r.m.reasoning ? h('em', { class: 'badge alt' }, '추론') : null,
      r.m.benchmarkSource?.kind === 'public-page' ? h('a', { class: 'value-source', href: r.m.benchmarkSource.url, title: `Artificial Analysis 공개 측정값 · ${r.m.benchmarkSource.name} · 확인일 ${r.m.benchmarkSource.verifiedAt}`, rel: 'noopener' }, '공개 측정값 ↗') : null));
}

const cmpButton = (m: Model) =>
  h('button', { type: 'button', class: 'cmp', 'aria-label': `${m.name} 비교 선택`, 'aria-pressed': state.compare.includes(m.id), disabled: !state.compare.includes(m.id) && state.compare.length >= MAX_COMPARE, title: state.compare.includes(m.id) ? '비교에서 제거' : state.compare.length >= MAX_COMPARE ? `비교는 최대 ${MAX_COMPARE}개` : '비교에 추가',
    onclick: () => toggleCompare(m.id) }, state.compare.includes(m.id) ? '✓' : '＋');

function singleBars(rows: Row[], metric: Metric): HTMLElement {
  const data = rankModelRows(rows, metric, state);
  const shown = state.rankTop ? data.slice(0, state.rankTop) : data;
  const max = Math.max(...shown.map((x) => x.v), 0) || 1;
  const multi = new Set(state.modes.map((m) => (m === 'global' ? 'g' : 'r'))).size > 1;
  return h('div', null,
    h('p', { class: 'count-line' }, `${shown.length} of ${data.length} 모델`),
    shown.length ? h('ol', { class: 'rank' }, ...shown.map((x, i) => {
      // Bars stop at 86% so the value label always fits at the tip.
      const w = (x.v / max) * 86;
      return h('li', { class: state.query && matches(x.r.m, state.query) ? 'rk hit' : 'rk' },
        h('span', { class: 'pos' }, String(i + 1)),
        identity(x.r, multi),
        h('div', { class: 'track' }, h('i', { class: 'fill', style: `width:${w}%` }), h('b', { class: 'val', style: `left:calc(${w}% + 8px)` }, metric.fmt(x.v))),
        cmpButton(x.r.m));
    })) : emptyState('표시할 순위가 없습니다', '검색어와 필터를 조정하거나 다른 평가 지표를 선택해 보세요.'));
}

function priceBars(rows: Row[]): HTMLElement {
  const blend = METRICS.blend;
  const data = rankModelRows(rows, blend, state).map(({ r, v }) => ({ r, b: v }));
  const shown = state.rankTop ? data.slice(0, state.rankTop) : data;
  const max = Math.max(...shown.flatMap((x) => PRICE_SERIES.map(([k]) => METRICS[k].value(x.r) ?? 0)), 0) || 1;
  const multi = new Set(state.modes.map((m) => (m === 'global' ? 'g' : 'r'))).size > 1;
  return h('div', null,
    h('div', { class: 'legend-row' }, ...PRICE_SERIES.map(([, l, c]) => h('span', { class: 'lg' }, h('i', { class: 'sw', style: `background:${c}` }), l))),
    h('p', { class: 'count-line' }, `${shown.length} of ${data.length} 모델 · 4:1 혼합 단가가 낮은 순`),
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
        cmpButton(x.r.m)))) : emptyState('표시할 가격이 없습니다', '다른 리전이나 추론 방식을 선택해 보세요.'));
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
  const metric = metricFor(state.rankMetric);
  const known = models.filter((m) => (!state.query || matches(m, state.query)) && (!state.provider || m.provider === state.provider)
    && (!state.weights || m.openWeights === (state.weights === 'open')) && (!state.reasoning || m.reasoning === (state.reasoning === 'yes')));
  const eligibleIds = new Set(rows.map((r) => r.m.id));
  const unavailable = known.filter((m) => !eligibleIds.has(m.id));
  const scoredIds = new Set(rows.filter((r) => (isPrice ? METRICS.blend : metric).value(r) !== undefined).map((r) => r.m.id));
  const unscored = [...new Map(rows.filter((r) => !scoredIds.has(r.m.id)).map((r) => [r.m.id, r.m])).values()];
  const globalAvailable = !state.modes.includes('global') && unavailable.some((m) => supports(m, 'global', state.region).ok);
  const providers = [...new Set(models.map((m) => m.provider))].sort();
  const sel = (label: string, opts: [string, string][], value: string, on: (v: string) => void) =>
    h('label', null, label, ' ', h('select', { 'aria-label': label, onchange: (e: Event) => on((e.target as HTMLSelectElement).value) }, ...opts.map(([v, t]) => h('option', { value: v, selected: v === value }, t))));

  const tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': '순위 평가 지표' },
    ...TABS.map(([k, l]) => h('button', { id: `rank-tab-${k}`, type: 'button', role: 'tab', tabindex: state.rankMetric === k ? 0 : -1, 'aria-label': `${l} 순위 보기`, 'aria-controls': 'rank-panel', 'aria-selected': state.rankMetric === k, onclick: () => update({ rankMetric: k }),
      onkeydown: (e: KeyboardEvent) => {
        const i = TABS.findIndex(([key]) => key === k);
        const next = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : -1;
        if (next < 0) return;
        e.preventDefault();
        update({ rankMetric: TABS[next][0] });
        document.getElementById(`rank-tab-${TABS[next][0]}`)?.focus({ preventScroll: true });
      },
    }, l)),
    h('select', { class: 'tab-select', 'aria-label': '기타 벤치마크', onchange: (e: Event) => { const v = (e.target as HTMLSelectElement).value; if (v) update({ rankMetric: v }); } },
      h('option', { value: '' }, '기타 벤치마크…'),
      ...OTHER_BENCH.map((k) => h('option', { value: k, selected: state.rankMetric === k }, METRICS[k].label))));

  const filters = h('div', { class: 'filters' },
    sel('제공사', [['', '전체'], ...providers.map((p): [string, string] => [p, p])], state.provider, (v) => update({ provider: v })),
    sel('가중치', [['', '전체'], ['open', '오픈 웨이트'], ['closed', '독점']], state.weights, (v) => update({ weights: v as 'open' })),
    sel('추론', [['', '전체'], ['yes', '추론 모델'], ['no', '비추론']], state.reasoning, (v) => update({ reasoning: v as 'yes' })),
    sel('표시', TOPS.map((n): [string, string] => [String(n), n ? `상위 ${n}` : '전체']), String(state.rankTop), (v) => update({ rankTop: Number(v) })));
  const coverage = unscored.length || unavailable.length ? h('details', { class: 'rank-coverage', open: !!state.query },
    h('summary', null, icon('info'), `순위에 안 보이는 모델이 있나요? ${unscored.length}개는 ${isPrice ? '단가' : '측정값'} 미확인 · ${unavailable.length}개는 리전·추론 조건에서 제외`),
    unscored.length ? h('div', { class: 'coverage-group' }, h('strong', null, `${isPrice ? '단가' : metric.label} 미확인`),
      h('p', null, '값이 없는 모델은 순위를 매기지 않습니다. 다른 지표나 모델 상세에서 확인해 보세요.'),
      h('div', { class: 'coverage-models' }, ...unscored.map((m) => h('a', { href: `#/model/${m.id}` }, m.name)))) : null,
    unavailable.length ? h('div', { class: 'coverage-group' }, h('strong', null, '현재 리전·추론 방식에서 제외'),
      h('p', null, `${state.region}에서 선택한 추론 방식과 단가 조건을 만족하지 않습니다.`, globalAvailable ? ' Global CRIS로 호출 가능한 모델이 있습니다.' : ''),
      globalAvailable ? h('button', { type: 'button', class: 'button secondary', onclick: () => update({ modes: MODES.filter((mode) => mode === 'global' || state.modes.includes(mode)) }) }, 'Global CRIS 포함해서 보기') : null,
      h('div', { class: 'coverage-models' }, ...unavailable.map((m) => h('a', { href: `#/model/${m.id}` }, m.name)))) : null) : null;

  return h('main', null,
    pageHeading('MODEL LEADERBOARD', '기준을 바꾸면, 최고의 모델도 달라집니다', '지능부터 속도와 가격까지, 서비스에 중요한 지표로 모델의 순위를 확인하세요.'),
    h('p', { class: 'note' }, `${state.region} · ${state.tier} · 선택한 추론 방식 기준. 벤치마크·속도: `, h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, 'Artificial Analysis'), '. 가중치·추론 구분은 models.dev 기준입니다. 막대는 0에서 시작합니다.'),
    highlights(rows), tabs,
    h('p', { class: 'note' }, isPrice ? 'USD / 1M tokens. 막대 색은 Input · Output · Cache read입니다.' : metric.hint),
    filters,
    state.rankMetric === 'coding' ? codingNotice(rows.map((r) => r.m),
      h('button', { class: 'button secondary', type: 'button', 'aria-label': 'SciCode 측정값으로 비교하기', onclick: () => {
        update({ rankMetric: 'scicode' });
        document.getElementById('rank-tab-scicode')?.focus({ preventScroll: true });
      } }, 'SciCode 측정값으로 비교하기')) : null,
    h('p', { class: 'rank-limit-note' }, `${state.rankTop ? `상위 ${state.rankTop}개 모델` : '전체 모델'}을 표시합니다. 모델당 한 행이며, 여러 추론 범위를 선택하면 확인된 혼합 단가가 가장 낮은 범위를 사용합니다. `,
      state.rankTop ? h('button', { type: 'button', class: 'text-button', onclick: () => update({ rankTop: 0 }) }, '전체 순위 보기') : null),
    h('div', { id: 'rank-panel', role: 'tabpanel', 'aria-labelledby': TABS.some(([key]) => key === state.rankMetric) ? `rank-tab-${state.rankMetric}` : undefined, 'aria-label': TABS.some(([key]) => key === state.rankMetric) ? undefined : `${metric.label} 순위` }, isPrice ? priceBars(rows) : singleBars(rows, metric)),
    coverage,
    state.compare.length ? h('p', { class: 'note' }, h('a', { href: '#/compare' }, `선택한 ${state.compare.length}개 모델 비교하기 →`)) : null);
}
