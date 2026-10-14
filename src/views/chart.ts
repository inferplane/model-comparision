import { h, s } from '../dom.ts';
import { matches, MODES, providerSelected, supports, tokens, usd } from '../data.ts';
import { MAX_COMPARE, state, toggleCompare, update } from '../state.ts';
import type { BenchmarkScores, Model, Tier } from '../types.ts';
import { emptyState, icon, pageHeading } from '../components/ui.ts';
import { codingNotice } from '../components/coding-notice.ts';
import { multiSelect } from '../components/multi-select.ts';
import { locale, t } from '../i18n.ts';
import { collectValuePoints, filterValuePoints, isRecentModel, QUALITY_FLOOR, rankValuePoints, valueExclusions, type ExclusionReason, type ValueOrder, type ValuePoint, type ValueQuality } from '../value.ts';

interface Metric { key: keyof BenchmarkScores; label: string; pct: boolean; }
const METRICS: Metric[] = [
  { key: 'intelligenceIndex', label: t('종합 지능 · Intelligence Index', 'Intelligence Index'), pct: false },
  { key: 'codingIndex', label: t('코딩 · Coding Index', 'Coding Index'), pct: false },
  { key: 'mathIndex', label: t('수학 · Math Index', 'Math Index'), pct: false },
  { key: 'gpqa', label: 'GPQA Diamond', pct: true },
  { key: 'mmluPro', label: 'MMLU-Pro', pct: true },
  { key: 'hle', label: "Humanity's Last Exam", pct: true },
  { key: 'liveCodeBench', label: 'LiveCodeBench', pct: true },
  { key: 'scicode', label: t('코딩 · SciCode (과학 코딩)', 'SciCode (scientific coding)'), pct: true },
  { key: 'aime', label: 'AIME', pct: true },
];
const COST_LABELS = { blend: t('혼합 단가 · 입력 4 : 출력 1', 'Blended · 4 input : 1 output'), input: t('입력 단가', 'Input price'), output: t('출력 단가', 'Output price') };
const QUALITY_LABELS: [ValueQuality, string][] = [
  ['all', t('제한 없음', 'No minimum')], ['balanced', t('최고 점수의 50% 이상', '≥ 50% of the best score')], ['strong', t('최고 점수의 75% 이상', '≥ 75% of the best score')], ['best', t('최고 점수의 90% 이상', '≥ 90% of the best score')],
];
const ORDER_LABELS: [ValueOrder, string][] = [['value', t('가성비 지표 높은 순', 'Best value first')], ['price', t('단가 낮은 순', 'Cheapest first')], ['score', t('성능 점수 높은 순', 'Highest score first')]];
const fmtValue = (v: number) => v.toLocaleString(locale, { maximumFractionDigits: 1 });
const scoreUnit = (metric: Metric) => (metric.pct ? '%p/$' : t('점수/$', 'pts/$'));
const fmtScore = (v: number, metric: Metric) => `${v.toFixed(1)}${metric.pct ? '%' : ''}`;
const fmtThreshold = (v: number, metric: Metric) => `${v.toLocaleString(locale, { maximumFractionDigits: 6 })}${metric.pct ? '%' : ''}`;
let chartOpen = false;
const Y_AXIS = t('Y축 벤치마크', 'Y-axis benchmark');

function compareButton(point: ValuePoint, context: string): HTMLElement {
  const on = state.compare.includes(point.m.id);
  return h('button', { class: 'cmp', type: 'button', 'aria-label': t(`${point.m.name} ${context} 비교 선택`, `Select ${point.m.name} ${context} for comparison`), 'aria-pressed': on,
    disabled: !on && state.compare.length >= MAX_COMPARE, title: on ? t('비교에서 제거', 'Remove from comparison') : t('비교에 추가', 'Add to comparison'), onclick: () => toggleCompare(point.m.id) },
  on ? icon('check') : '＋');
}

function sourceNote(point: ValuePoint): HTMLElement | null {
  const source = point.m.benchmarkSource;
  if (source?.kind !== 'public-page') return null;
  return h('a', { class: 'value-source', href: source.url, rel: 'noopener', title: t(`${source.name} · 확인일 ${source.verifiedAt}`, `${source.name} · checked ${source.verifiedAt}`) }, t('공개 측정값 보완 ↗', 'Public measurement ↗'));
}

function highlights(points: ValuePoint[], metric: Metric): HTMLElement {
  const options: [string, ValueOrder, string][] = [
    [t('가성비 지표 1위', 'Best value'), 'value', t('성능 점수 ÷ 선택 단가', 'Score ÷ selected price')],
    [t('조건 내 최저 단가', 'Cheapest that qualifies'), 'price', t('필요한 성능을 만족하는 최저 단가', 'Lowest price that meets the minimum score')],
    [t('조건 내 최고 성능', 'Best score that qualifies'), 'score', t('현재 예산과 성능 조건의 최고 점수', 'Highest score within the budget and minimum')],
  ];
  return h('section', { class: 'value-highlights', 'aria-label': t('조건별 모델 후보', 'Candidates by criterion') }, ...options.map(([title, order, hint]) => {
    const point = rankValuePoints(points, order)[0];
    return h('article', { class: `value-highlight${order === 'value' ? ' featured' : ''}` },
      h('div', { class: 'value-highlight-label' }, icon(order === 'value' ? 'chart' : order === 'price' ? 'coins' : 'rank'), title),
      point ? h('a', { class: 'value-highlight-name', href: `#/model/${point.m.id}` }, point.m.name) : h('strong', { class: 'value-highlight-name' }, t('조건에 맞는 모델 없음', 'No model qualifies')),
      point ? h('div', { class: 'value-highlight-stats' },
        h('div', null, h('span', null, t('성능 점수', 'Score')), h('strong', null, fmtScore(point.y, metric))),
        h('div', null, h('span', null, t('단가 / 1M tokens', 'Price / 1M tokens')), h('strong', null, usd(point.x))),
        h('div', null, h('span', null, t('가성비 지표', 'Value')), h('strong', null, fmtValue(point.value), h('small', null, ` ${scoreUnit(metric)}`)))) : null,
      h('p', { class: 'value-card-hint' }, hint),
      point ? h('div', { class: 'value-highlight-foot' }, h('span', null, point.scope), compareButton(point, title)) : null);
  }));
}

/** The chart is a secondary, optional exploration surface; the ranked numbers are visible first. */
function scatter(points: ValuePoint[], metric: Metric): HTMLElement {
  const host = h('div', { class: 'plot' });
  const tip = h('div', { class: 'tip', hidden: true, role: 'status' });
  host.append(tip);
  const margins = { l: 50, r: 20, t: 28, b: 54 };
  const draw = () => {
    host.querySelector('svg')?.remove();
    host.querySelector('.empty-state')?.remove();
    tip.hidden = true;
    if (!points.length) return host.append(emptyState(t('차트에 표시할 후보가 없습니다', 'No candidates to plot'), t('최소 성능이나 최대 단가 조건을 조정해 보세요.', 'Adjust the minimum score or maximum price.')));
    const styles = getComputedStyle(host);
    const insetX = parseFloat(styles.paddingLeft);
    const insetY = parseFloat(styles.paddingTop);
    const width = Math.max(240, host.clientWidth - insetX - parseFloat(styles.paddingRight));
    const height = width < 560 ? 390 : 410;
    const innerWidth = width - margins.l - margins.r;
    const innerHeight = height - margins.t - margins.b;
    const minPrice = Math.min(...points.map((p) => p.x)) * 0.8;
    const maxPrice = Math.max(...points.map((p) => p.x)) * 1.25;
    const maxScore = Math.max(10, Math.ceil(Math.max(...points.map((p) => p.y)) * 1.08 / 10) * 10);
    const lx = (v: number) => margins.l + (Math.log(v) - Math.log(minPrice)) / (Math.log(maxPrice) - Math.log(minPrice)) * innerWidth;
    const ly = (v: number) => margins.t + innerHeight - v / maxScore * innerHeight;
    const svg = s('svg', { class: 'scatter', viewBox: `0 0 ${width} ${height}`, width, height, role: 'group',
      'aria-label': t(`${points.length}개 후보의 성능과 단가. 왼쪽 위일수록 저렴하고 점수가 높습니다.`, `Score and price of ${points.length} candidates. Top left is cheaper and scores higher.`) });
    const step = maxScore > 60 ? 20 : 10;
    for (let score = 0; score <= maxScore; score += step) svg.append(
      s('line', { x1: margins.l, x2: width - margins.r, y1: ly(score), y2: ly(score), class: 'grid' }),
      s('text', { x: margins.l - 10, y: ly(score) + 4, class: 'tick', 'text-anchor': 'end' }, String(score)));
    const ticks = [0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    let lastTick = -Infinity;
    for (const price of ticks.filter((v) => v >= minPrice && v <= maxPrice)) {
      if (lx(price) - lastTick < 42) continue;
      lastTick = lx(price);
      svg.append(s('line', { x1: lx(price), x2: lx(price), y1: margins.t, y2: margins.t + innerHeight, class: 'grid' }),
        s('text', { x: lx(price), y: height - 32, class: 'tick', 'text-anchor': 'middle' }, usd(price)));
    }
    svg.append(s('text', { x: margins.l, y: 16, class: 'axis-title' }, t('↑ 성능 점수', '↑ Score')),
      s('text', { x: margins.l + innerWidth / 2, y: height - 10, class: 'axis-title', 'text-anchor': 'middle' }, t('단가 ($ / 1M tokens, 로그 눈금) →', 'Price ($ / 1M tokens, log scale) →')));
    const frontier = points.filter((p) => p.frontier).sort((a, b) => a.x - b.x);
    const line = [...new Map(frontier.map((p) => [p.x, p])).values()];
    if (line.length > 1) svg.append(s('polyline', { class: 'frontier-line', points: line.flatMap((p, i) => i ? [`${lx(p.x)},${ly(line[i - 1].y)}`, `${lx(p.x)},${ly(p.y)}`] : [`${lx(p.x)},${ly(p.y)}`]).join(' ') }));
    const dots = new Map<ValuePoint, SVGElement>();
    let active: ValuePoint | undefined;
    const show = (point?: ValuePoint) => {
      if (active) dots.get(active)?.classList.remove('active');
      active = point;
      if (!point) { tip.hidden = true; return; }
      dots.get(point)?.classList.add('active');
      tip.replaceChildren(h('div', { class: 'tip-name' }, point.label),
        h('div', { class: 'tip-val' }, `${fmtValue(point.value)} ${scoreUnit(metric)}`),
        h('div', { class: 'tip-row' }, t(`점수 ${fmtScore(point.y, metric)} · 단가 ${usd(point.x)}`, `Score ${fmtScore(point.y, metric)} · price ${usd(point.x)}`)),
        h('div', { class: 'tip-row' }, point.scope),
        h('div', { class: 'tip-row' }, `Context ${tokens(point.m.contextWindow)}${point.frontier ? t(' · 효율적 후보', ' · efficient') : ''}`));
      tip.hidden = false;
      const x = lx(point.x), y = ly(point.y);
      tip.style.left = `${insetX + Math.max(0, Math.min(x > width * 0.6 ? x - tip.offsetWidth - 12 : x + 12, width - tip.offsetWidth))}px`;
      tip.style.top = `${insetY + Math.max(0, Math.min(y - 20, height - tip.offsetHeight - 4))}px`;
    };
    for (const point of [...points].sort((a, b) => Number(a.frontier) - Number(b.frontier))) {
      const dot = s('circle', { cx: lx(point.x), cy: ly(point.y), r: point.frontier ? 6 : 4.5,
        class: `dot${point.frontier ? ' frontier' : ''}`, tabindex: 0, role: 'button',
        'aria-label': t(`${point.label} 상세 보기, 성능 ${fmtScore(point.y, metric)}, 단가 ${usd(point.x)}, 가성비 ${fmtValue(point.value)}`, `Open ${point.label}, score ${fmtScore(point.y, metric)}, price ${usd(point.x)}, value ${fmtValue(point.value)}`) });
      dot.addEventListener('focus', () => show(point));
      dot.addEventListener('blur', () => show());
      dot.addEventListener('keydown', (e: Event) => {
        const key = (e as KeyboardEvent).key;
        if (key === 'Enter' || key === ' ') { e.preventDefault(); location.hash = `#/model/${point.m.id}`; }
        else if (key === 'Escape') show();
      });
      dots.set(point, dot);
      svg.append(dot);
    }
    const used: [number, number, number, number][] = [];
    for (const point of frontier) {
      const name = point.label.length > 26 ? `${point.label.slice(0, 25)}…` : point.label;
      const labelWidth = name.length * 6.3;
      const x = lx(point.x) + 10, y = ly(point.y) - 10;
      const box: [number, number, number, number] = [x, y - 11, x + labelWidth, y + 3];
      if (box[2] > width - 4 || box[1] < margins.t || used.some((o) => !(box[2] < o[0] || box[0] > o[2] || box[3] < o[1] || box[1] > o[3]))) continue;
      used.push(box);
      svg.append(s('text', { x, y, class: 'dlabel' }, name));
    }
    const near = (event: MouseEvent | PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const x = (event.clientX - rect.left) * width / rect.width, y = (event.clientY - rect.top) * height / rect.height;
      let match: ValuePoint | undefined, distance = 32 ** 2;
      for (const point of points) {
        const d = (lx(point.x) - x) ** 2 + (ly(point.y) - y) ** 2;
        if (d < distance) { distance = d; match = point; }
      }
      return match;
    };
    const overlay = s('rect', { x: margins.l, y: margins.t, width: innerWidth, height: innerHeight, fill: 'transparent', class: 'hitlayer', 'aria-hidden': 'true' });
    overlay.addEventListener('pointermove', (event) => show(near(event)));
    overlay.addEventListener('pointerleave', () => show());
    overlay.addEventListener('click', (event) => {
      const point = near(event);
      if (point) location.hash = `#/model/${point.m.id}`;
    });
    svg.append(overlay);
    host.prepend(svg);
  };
  const observer = new ResizeObserver(() => {
    if (!host.isConnected) { observer.disconnect(); return; }
    draw();
  });
  const details = h('details', { class: 'value-chart', open: chartOpen },
    h('summary', null, icon('chart'), h('span', null, t('차트로 전체 후보 탐색', 'Explore every candidate on a chart')), h('small', null, t('왼쪽 위 = 더 저렴하고 더 높은 점수', 'Top left = cheaper and higher score'))),
    h('div', { class: 'value-chart-legend' }, h('span', null, h('i', { class: 'swatch frontier' }), t('효율적 후보', 'Efficient')),
      h('span', null, h('i', { class: 'swatch' }), t('그 외 후보', 'Other')), h('span', null, t('점 선택 → 모델 상세', 'Select a dot → model page'))),
    host);
  details.addEventListener('toggle', () => {
    chartOpen = details.open;
    if (details.open) observer.observe(host);
    else { observer.unobserve(host); tip.hidden = true; }
  });
  queueMicrotask(() => { if (details.open) observer.observe(host); });
  return details;
}

export function renderChart(models: Model[]): HTMLElement {
  const available = METRICS.filter((metric) => models.some((m) => m.benchmarks?.[metric.key] !== undefined));
  const metric = available.find((m) => m.key === state.chartY) ?? available[0];
  if (!metric) return h('main', null, pageHeading('PERFORMANCE & COST', t('성능 대비 비용', 'Cost vs. performance'), t('필요한 성능을 만족하는 모델의 단가를 비교하세요.', 'Compare prices among models that meet the score you need.')),
    emptyState(t('벤치마크를 준비하고 있습니다', 'Benchmarks are on the way'), t('아직 비교할 측정 데이터가 없습니다.', 'There is no measurement data to compare yet.'), h('a', { class: 'button secondary', href: '#/' }, t('모델 탐색하기', 'Explore models'))));

  const options = { ...state, chartY: metric.key, pct: metric.pct };
  const today = Date.now();
  const catalogue = state.chartLatest ? models.filter((m) => isRecentModel(m, today)) : models;
  // Performance floors use the same region/modes/tier baseline even when search, provider or budget changes.
  const market = collectValuePoints(models, { ...options, query: '', providers: [], onlyCache: false, onlyZdr: false });
  const maxScore = Math.max(0, ...market.map((p) => p.y));
  const all = collectValuePoints(catalogue, options);
  const points = filterValuePoints(all, maxScore, state.chartQuality, state.chartBudget);
  const ranked = rankValuePoints(points, state.chartOrder);
  const unit = scoreUnit(metric);
  const providers = [...new Set(models.map((m) => m.provider))].sort();
  const reset = () => update({ chartQuality: 'all', chartBudget: 0, providers: [], query: '', onlyCache: false, onlyZdr: false, tier: 'standard' });
  const latest = () => update({ chartLatest: true, chartY: 'intelligenceIndex', chartX: 'blend', modes: [...MODES], chartQuality: 'all', chartBudget: 0, providers: [], query: '', onlyCache: false, onlyZdr: false, tier: 'standard', chartOrder: 'value' });
  const select = (label: string, aria: string, values: [string, string][], selected: string, onChange: (value: string) => void) =>
    h('label', null, h('span', null, label), h('select', { 'aria-label': aria, onchange: (event: Event) => onChange((event.target as HTMLSelectElement).value) },
      ...values.map(([value, text]) => h('option', { value, selected: value === selected }, text))));
  const controls = h('section', { class: 'value-controls', 'aria-label': t('가성비 비교 조건', 'Value comparison criteria') },
    h('div', { class: 'value-preset-row' },
      h('button', { type: 'button', class: 'button primary', 'aria-label': t('최신 모델 보기', 'Show latest models'), onclick: latest }, icon('layers'), t('최신 모델 보기', 'Show latest models')),
      h('span', null, t('최근 60일 출시 · 종합 지능 · 혼합 단가 · 일반 티어 · 전체 추론 방식 · 제공사·검색·캐시·성능·단가 조건 해제', 'Launched in the last 60 days · Intelligence Index · blended price · standard tier · all inference modes · provider, search, caching, score and price filters cleared'))),
    h('div', { class: 'value-control-row' },
      select(t('성능 지표', 'Score metric'), Y_AXIS, available.map((m) => [m.key, m.label]), metric.key, (chartY) => update({ chartY })),
      select(t('비용 기준', 'Cost basis'), t('X축 단가 기준', 'X-axis price basis'), Object.entries(COST_LABELS), state.chartX, (chartX) => update({ chartX: chartX as typeof state.chartX })),
      h('div', { class: 'value-field' }, h('span', null, t('제공사', 'Provider')), multiSelect({ id: 'providers', label: t('제공사', 'Provider'), allLabel: t('모든 제공사', 'All providers'), options: providers, selected: state.providers, onChange: (next) => update({ providers: next }) })),
      select(t('티어', 'Tier'), t('티어', 'Tier'), ['standard', 'priority', 'flex'].map((t) => [t, t]), state.tier, (tier) => update({ tier: tier as Tier }))),
    h('div', { class: 'value-control-row requirements' },
      select(t('최소 성능', 'Minimum score'), t('최소 성능', 'Minimum score'), QUALITY_LABELS, state.chartQuality, (chartQuality) => update({ chartQuality: chartQuality as ValueQuality })),
      h('label', null, h('span', null, t('최대 단가 · $ / 1M tokens', 'Maximum price · $ / 1M tokens')),
        h('input', { type: 'number', min: 0, max: 1_000_000, step: 'any', placeholder: t('제한 없음', 'No limit'), 'aria-label': t('최대 단가', 'Maximum price'), value: state.chartBudget || '', onchange: (event: Event) => {
          const input = event.target as HTMLInputElement;
          if (input.validity.valid) update({ chartBudget: Number(input.value) || 0 });
        } })),
      h('label', { class: 'value-cache-filter' }, h('input', { type: 'checkbox', 'aria-label': t('ZDR 지원 모델만', 'Only models with ZDR'), checked: state.onlyZdr, onchange: (event: Event) => update({ onlyZdr: (event.target as HTMLInputElement).checked }) }), t('ZDR 지원 모델만', 'ZDR only')),
      h('label', { class: 'value-cache-filter' }, h('input', { type: 'checkbox', 'aria-label': t('캐시 지원 모델만', 'Only models with caching'), checked: state.onlyCache, onchange: (event: Event) => update({ onlyCache: (event.target as HTMLInputElement).checked }) }), t('캐시 지원 모델만', 'Caching only')),
      h('button', { type: 'button', class: 'text-button', onclick: reset }, icon('reset'), t('조건 해제', 'Clear criteria'))),
    h('p', { class: 'value-criteria-note' }, `${state.region} · ${state.tier} · ${COST_LABELS[state.chartX]} · `,
      state.chartQuality === 'all' ? t('성능 제한 없음', 'no minimum score') : t(`리전 최고 점수 ${fmtScore(maxScore, metric)}의 ${QUALITY_FLOOR[state.chartQuality] * 100}% 이상 (${fmtThreshold(maxScore * QUALITY_FLOOR[state.chartQuality], metric)} 이상)`, `≥ ${QUALITY_FLOOR[state.chartQuality] * 100}% of the region's best score ${fmtScore(maxScore, metric)} (≥ ${fmtThreshold(maxScore * QUALITY_FLOOR[state.chartQuality], metric)})`),
      state.chartBudget ? t(` · 최대 ${usd(state.chartBudget)}`, ` · max ${usd(state.chartBudget)}`) : '', t(` · ${new Set(points.map((p) => p.m.id)).size}개 모델 / ${points.length}개 단가`, ` · ${new Set(points.map((p) => p.m.id)).size} models / ${points.length} prices`)),
    h('label', { class: 'value-latest-filter' }, h('input', { type: 'checkbox', 'aria-label': t('최근 60일 출시 모델만', 'Only models launched in the last 60 days'), checked: state.chartLatest, onchange: (event: Event) => update({ chartLatest: (event.target as HTMLInputElement).checked }) }), t('출시일이 확인된 최근 60일 모델만', 'Only models with a known launch date in the last 60 days')));

  const excluded = valueExclusions(catalogue, options, maxScore, state.chartQuality, state.chartBudget);
  const enableGlobal = () => update({ modes: MODES.filter((mode) => mode === 'global' || state.modes.includes(mode)) });
  const definitions: [ExclusionReason, string, string, (() => void) | undefined, string][] = [
    ['provider', t('제공사 조건', 'Provider filter'), t(`${state.providers.join(', ') || '선택한 제공사'} 외 모델입니다.`, `Not from ${state.providers.join(', ') || 'the selected providers'}.`), () => update({ providers: [] }), t('모든 제공사 보기', 'Show all providers')],
    ['zdr', t('ZDR 조건', 'ZDR filter'), t('기본적으로 Zero Data Retention을 지원하지 않는 모델입니다.', 'Not zero-data-retention by default.'), () => update({ onlyZdr: false }), t('ZDR 조건 해제', 'Clear the ZDR filter')],
    ['inference', t('리전·추론 방식', 'Region and inference mode'), t(`${state.region}에서 선택한 추론 방식으로 표시할 수 없습니다.`, `Not available in ${state.region} with the selected inference modes.`),
      excluded.some((e) => e.reason === 'inference' && supports(e.m, 'global', state.region).ok) && !state.modes.includes('global') ? enableGlobal : undefined, t('Global CRIS 포함해서 보기', 'Include Global CRIS')],
    ['benchmark', t('선택 지표 측정값 없음', 'No score for this metric'), t(`${metric.label} 측정값이 없어 가성비를 계산하지 않습니다.`, `No ${metric.label} measurement, so no value is calculated.`),
      metric.key !== 'intelligenceIndex' ? () => update({ chartY: 'intelligenceIndex' }) : undefined, t('종합 지능 기준으로 보기', 'Use Intelligence Index')],
    ['price', t('선택 단가 미확인', 'No price'), t('선택한 리전·티어·비용 기준에서 계산 가능한 단가가 없습니다.', 'No usable price for the selected region, tier and cost basis.'),
      state.tier !== 'standard' ? () => update({ tier: 'standard' }) : undefined, t('일반 티어로 보기', 'Use the standard tier')],
    ['cache', t('캐시 조건', 'Caching filter'), t('선택한 범위의 캐시 단가가 확인되지 않았습니다.', 'No cache price for the selected scope.'), () => update({ onlyCache: false }), t('캐시 조건 해제', 'Clear the caching filter')],
    ['quality', t('최소 성능 조건', 'Minimum score'), t(`점수가 최소 기준 ${fmtThreshold(maxScore * QUALITY_FLOOR[state.chartQuality], metric)}에 못 미칩니다.`, `Scores below the minimum of ${fmtThreshold(maxScore * QUALITY_FLOOR[state.chartQuality], metric)}.`), () => update({ chartQuality: 'all' }), t('성능 조건 해제', 'Clear the minimum score')],
    ['budget', t('최대 단가 조건', 'Maximum price'), t(`선택한 추론 범위의 단가가 상한 ${usd(state.chartBudget)}을 넘습니다.`, `Costs more than the ${usd(state.chartBudget)} limit in the selected scopes.`), () => update({ chartBudget: 0 }), t('단가 상한 해제', 'Clear the price limit')],
  ];
  const coverage = excluded.length ? h('details', { class: 'rank-coverage value-coverage', open: !!state.query || !points.length },
    h('summary', null, icon('info'), t(`찾는 모델이 안 보이나요? ${excluded.length}개 모델의 제외 이유와 해결 방법`, `Missing a model? Why ${excluded.length} models are excluded, and how to include them`)),
    ...definitions.map(([reason, title, description, action, actionLabel]) => {
      const group = excluded.filter((e) => e.reason === reason);
      if (!group.length) return null;
      return h('div', { class: 'coverage-group', 'data-reason': reason }, h('strong', null, t(`${title} · ${group.length}개`, `${title} · ${group.length}`)),
        h('p', null, description),
        action ? h('button', { class: 'button secondary', type: 'button', 'aria-label': actionLabel, onclick: action }, actionLabel) : null,
        h('div', { class: 'coverage-models' }, ...group.map((e) => h('a', { href: `#/model/${e.m.id}` },
          e.m.name, e.score === undefined ? '' : ` · ${fmtScore(e.score, metric)}`, e.price === undefined ? '' : ` · ${usd(e.price)}`))));
    })) : null;

  const maxValue = Math.max(0, ...points.map((p) => p.value)) || 1;
  const table = h('div', { class: 'scroll value-table-scroll', tabindex: 0, 'aria-label': t('가성비 순위 표', 'Value ranking table') }, h('table', { class: 'value-table' },
    h('caption', { class: 'sr-only' }, t(`${metric.label} 점수와 ${COST_LABELS[state.chartX]}의 가성비 비교`, `Value of ${metric.label} score against ${COST_LABELS[state.chartX]}`)),
    h('thead', null, h('tr', null, h('th', { scope: 'col' }, t('모델', 'Model')),
      h('th', { scope: 'col', class: 'num' }, t('성능 점수 ↑', 'Score ↑')), h('th', { scope: 'col', class: 'num' }, t('단가 ↓', 'Price ↓')),
      h('th', { scope: 'col', class: 'num' }, t(`가성비 지표 (${unit}) ↑`, `Value (${unit}) ↑`)), h('th', { scope: 'col' }, t('비교', 'Compare')))),
    h('tbody', null, ...ranked.map((point, index) => h('tr', { class: state.compare.includes(point.m.id) ? 'selected' : '', 'data-model-id': point.m.id, 'data-score': point.y, 'data-price': point.x, 'data-value': point.value },
      h('td', { class: 'value-identity' }, h('div', { class: 'value-model' }, h('span', { class: 'value-position' }, String(index + 1)),
        h('div', null, h('a', { class: 'value-model-name', href: `#/model/${point.m.id}` }, point.m.name),
          h('div', { class: 'value-model-meta' }, point.m.provider, ' · ', point.scope),
          h('div', { class: 'value-model-badges' }, point.frontier ? h('span', { class: 'badge', title: t('현재 검색·제공사·추론 조건에서 더 저렴하면서 점수가 같거나 높은 모델이 없는 후보입니다.', 'No cheaper model scores the same or higher under the current search, provider and inference filters.') }, t('효율적 후보', 'Efficient')) : null, sourceNote(point))))),
      h('td', { class: 'num value-score', 'data-label': t('성능 점수', 'Score') }, h('strong', null, fmtScore(point.y, metric)),
        h('small', null, t(`최고 점수의 ${maxScore ? Math.round(point.y / maxScore * 100) : 0}%`, `${maxScore ? Math.round(point.y / maxScore * 100) : 0}% of best`))),
      h('td', { class: 'num value-price', 'data-label': t('단가 / 1M tokens', 'Price / 1M tokens') }, h('strong', null, usd(point.x))),
      h('td', { class: 'num value-efficiency', 'data-label': t(`가성비 (${unit})`, `Value (${unit})`) }, h('div', { class: 'value-meter' },
        h('i', { style: `width:${point.value / maxValue * 100}%` }), h('strong', null, fmtValue(point.value)))),
      h('td', { class: 'value-compare' }, compareButton(point, point.scope)))))));

  return h('main', { class: 'value-page' },
    pageHeading('PERFORMANCE & COST', t('필요한 성능은 지키고, 비용은 낮추세요', 'Keep the performance you need, pay less'), t('최소 성능과 예산을 정하면, 조건에 맞는 모델을 가성비 순으로 바로 볼 수 있습니다.', 'Set a minimum score and a budget to see qualifying models ranked by value.')),
    controls,
    metric.key === 'codingIndex' ? codingNotice(catalogue.filter((m) => (!state.query || matches(m, state.query)) && providerSelected(state.providers, m.provider)),
      h('button', { class: 'button secondary', type: 'button', 'aria-label': t('SciCode 측정값으로 비교하기', 'Compare on SciCode instead'), onclick: () => {
        update({ chartY: 'scicode' });
        document.querySelector<HTMLSelectElement>(`[aria-label="${Y_AXIS}"]`)?.focus({ preventScroll: true });
      } }, t('SciCode 측정값으로 비교하기', 'Compare on SciCode instead'))) : null,
    coverage, highlights(points, metric),
    h('section', { class: 'value-results', 'aria-label': t('가성비 후보 순위', 'Value ranking') },
      h('div', { class: 'value-results-heading' }, h('div', null, h('h2', null, t('가성비 후보 순위', 'Value ranking')),
        h('p', null, t(`가성비 지표 = 성능 점수 ÷ 단가 (${unit}). 같은 지표·단가 기준 안에서 비교하는 참고값입니다.`, `Value = score ÷ price (${unit}). A reference for comparing within the same metric and price basis.`))),
      select(t('정렬', 'Sort'), t('가성비 정렬', 'Sort value ranking'), ORDER_LABELS, state.chartOrder, (chartOrder) => update({ chartOrder: chartOrder as ValueOrder }))),
      ranked.length ? table : emptyState(t('조건을 만족하는 모델이 없습니다', 'No model meets the criteria'), t('최소 성능을 낮추거나 최대 단가를 높여보세요. 리전과 추론 방식도 확인할 수 있습니다.', 'Lower the minimum score or raise the maximum price. Check the region and inference modes too.'),
        h('button', { class: 'button secondary', type: 'button', onclick: reset }, t('조건 해제', 'Clear criteria')))),
    scatter(points, metric),
    h('details', { class: 'data-guide value-guide' }, h('summary', null, icon('info'), t('계산 기준과 데이터 범위', 'How this is calculated')),
      h('p', null, t('단가는 USD / 1M tokens이며, 혼합 단가는 입력 4 : 출력 1 비율입니다. 캐시 할인과 장문 할증은 이 참고 지표에 포함하지 않습니다. 가성비 지표는 선택한 벤치마크의 점수를 단가로 나눈 값입니다. 실제 업무 품질은 별도 평가와 함께 확인하세요. 점수나 선택 리전·티어의 단가가 없는 모델은 순위를 계산하지 않습니다. “효율적 후보”는 현재 검색·제공사·추론 조건에서 가격과 점수를 동시에 개선하는 대안이 없는 후보입니다.',
        'Prices are USD / 1M tokens; the blended price is 4 input : 1 output. Cache discounts and long-context surcharges are not included. Value is the selected benchmark score divided by the price; check real task quality with your own evaluation. Models without a score or a price for the selected region and tier are not ranked. “Efficient” means no alternative under the current search, provider and inference filters is both cheaper and better.')),
      h('p', null, t('벤치마크: ', 'Benchmarks: '), h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, 'Artificial Analysis'), t('. 공개 페이지로 보완한 값은 모델별 출처와 확인일을 표시합니다.', '. Values filled from public pages show their source and check date.'))));
}
