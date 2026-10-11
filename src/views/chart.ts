import { h, s } from '../dom.ts';
import { tokens, usd } from '../data.ts';
import { MAX_COMPARE, state, toggleCompare, update } from '../state.ts';
import type { BenchmarkScores, Model, Tier } from '../types.ts';
import { emptyState, icon, pageHeading } from '../components/ui.ts';
import { collectValuePoints, filterValuePoints, QUALITY_FLOOR, rankValuePoints, type ValueOrder, type ValuePoint, type ValueQuality } from '../value.ts';

interface Metric { key: keyof BenchmarkScores; label: string; pct: boolean; }
const METRICS: Metric[] = [
  { key: 'intelligenceIndex', label: '종합 지능 · Intelligence Index', pct: false },
  { key: 'codingIndex', label: '코딩 · Coding Index', pct: false },
  { key: 'mathIndex', label: '수학 · Math Index', pct: false },
  { key: 'gpqa', label: 'GPQA Diamond', pct: true },
  { key: 'mmluPro', label: 'MMLU-Pro', pct: true },
  { key: 'hle', label: "Humanity's Last Exam", pct: true },
  { key: 'liveCodeBench', label: 'LiveCodeBench', pct: true },
  { key: 'scicode', label: 'SciCode', pct: true },
  { key: 'aime', label: 'AIME', pct: true },
];
const COST_LABELS = { blend: '혼합 단가 · 입력 4 : 출력 1', input: '입력 단가', output: '출력 단가' };
const QUALITY_LABELS: [ValueQuality, string][] = [
  ['all', '제한 없음'], ['balanced', '최고 점수의 50% 이상'], ['strong', '최고 점수의 75% 이상'], ['best', '최고 점수의 90% 이상'],
];
const ORDER_LABELS: [ValueOrder, string][] = [['value', '가성비 지표 높은 순'], ['price', '단가 낮은 순'], ['score', '성능 점수 높은 순']];
const fmtValue = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 1 });
const fmtScore = (v: number, metric: Metric) => `${v.toFixed(1)}${metric.pct ? '%' : ''}`;
let chartOpen = false;

function compareButton(point: ValuePoint, context: string): HTMLElement {
  const on = state.compare.includes(point.m.id);
  return h('button', { class: 'cmp', type: 'button', 'aria-label': `${point.m.name} ${context} 비교 선택`, 'aria-pressed': on,
    disabled: !on && state.compare.length >= MAX_COMPARE, title: on ? '비교에서 제거' : '비교에 추가', onclick: () => toggleCompare(point.m.id) },
  on ? icon('check') : '＋');
}

function sourceNote(point: ValuePoint): HTMLElement | null {
  const source = point.m.benchmarkSource;
  if (source?.kind !== 'public-page') return null;
  return h('a', { class: 'value-source', href: source.url, rel: 'noopener', title: `${source.name} · 확인일 ${source.verifiedAt}` }, '공개 측정값 보완 ↗');
}

function highlights(points: ValuePoint[], metric: Metric): HTMLElement {
  const options: [string, ValueOrder, string][] = [
    ['가성비 지표 1위', 'value', '성능 점수 ÷ 선택 단가'],
    ['조건 내 최저 단가', 'price', '필요한 성능을 만족하는 최저 단가'],
    ['조건 내 최고 성능', 'score', '현재 예산과 성능 조건의 최고 점수'],
  ];
  return h('section', { class: 'value-highlights', 'aria-label': '조건별 모델 후보' }, ...options.map(([title, order, hint]) => {
    const point = rankValuePoints(points, order)[0];
    return h('article', { class: `value-highlight${order === 'value' ? ' featured' : ''}` },
      h('div', { class: 'value-highlight-label' }, icon(order === 'value' ? 'chart' : order === 'price' ? 'coins' : 'rank'), title),
      point ? h('a', { class: 'value-highlight-name', href: `#/model/${point.m.id}` }, point.m.name) : h('strong', { class: 'value-highlight-name' }, '조건에 맞는 모델 없음'),
      point ? h('div', { class: 'value-highlight-stats' },
        h('div', null, h('span', null, '성능 점수'), h('strong', null, fmtScore(point.y, metric))),
        h('div', null, h('span', null, '단가 / 1M tokens'), h('strong', null, usd(point.x))),
        h('div', null, h('span', null, '가성비 지표'), h('strong', null, fmtValue(point.value), h('small', null, metric.pct ? ' %p/$' : ' 점수/$')))) : null,
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
    if (!points.length) return host.append(emptyState('차트에 표시할 후보가 없습니다', '최소 성능이나 최대 단가 조건을 조정해 보세요.'));
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
      'aria-label': `${points.length}개 후보의 성능과 단가. 왼쪽 위일수록 저렴하고 점수가 높습니다.` });
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
    svg.append(s('text', { x: margins.l, y: 16, class: 'axis-title' }, '↑ 성능 점수'),
      s('text', { x: margins.l + innerWidth / 2, y: height - 10, class: 'axis-title', 'text-anchor': 'middle' }, '단가 ($ / 1M tokens, 로그 눈금) →'));
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
        h('div', { class: 'tip-val' }, `${fmtValue(point.value)} ${metric.pct ? '%p/$' : '점수/$'}`),
        h('div', { class: 'tip-row' }, `점수 ${fmtScore(point.y, metric)} · 단가 ${usd(point.x)}`),
        h('div', { class: 'tip-row' }, point.scope),
        h('div', { class: 'tip-row' }, `Context ${tokens(point.m.contextWindow)}${point.frontier ? ' · 효율적 후보' : ''}`));
      tip.hidden = false;
      const x = lx(point.x), y = ly(point.y);
      tip.style.left = `${insetX + Math.max(0, Math.min(x > width * 0.6 ? x - tip.offsetWidth - 12 : x + 12, width - tip.offsetWidth))}px`;
      tip.style.top = `${insetY + Math.max(0, Math.min(y - 20, height - tip.offsetHeight - 4))}px`;
    };
    for (const point of [...points].sort((a, b) => Number(a.frontier) - Number(b.frontier))) {
      const dot = s('circle', { cx: lx(point.x), cy: ly(point.y), r: point.frontier ? 6 : 4.5,
        class: `dot${point.frontier ? ' frontier' : ''}`, tabindex: 0, role: 'button',
        'aria-label': `${point.label} 상세 보기, 성능 ${fmtScore(point.y, metric)}, 단가 ${usd(point.x)}, 가성비 ${fmtValue(point.value)}` });
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
    h('summary', null, icon('chart'), h('span', null, '차트로 전체 후보 탐색'), h('small', null, '왼쪽 위 = 더 저렴하고 더 높은 점수')),
    h('div', { class: 'value-chart-legend' }, h('span', null, h('i', { class: 'swatch frontier' }), '효율적 후보'),
      h('span', null, h('i', { class: 'swatch' }), '그 외 후보'), h('span', null, '점 선택 → 모델 상세')),
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
  if (!metric) return h('main', null, pageHeading('PERFORMANCE & COST', '성능 대비 비용', '필요한 성능을 만족하는 모델의 단가를 비교하세요.'),
    emptyState('벤치마크를 준비하고 있습니다', '아직 비교할 측정 데이터가 없습니다.', h('a', { class: 'button secondary', href: '#/' }, '모델 탐색하기')));

  const options = { ...state, chartY: metric.key, pct: metric.pct };
  // Performance floors use the same region/modes/tier baseline even when search, provider or budget changes.
  const market = collectValuePoints(models, { ...options, query: '', provider: '', onlyCache: false });
  const maxScore = Math.max(0, ...market.map((p) => p.y));
  const all = collectValuePoints(models, options);
  const points = filterValuePoints(all, maxScore, state.chartQuality, state.chartBudget);
  const ranked = rankValuePoints(points, state.chartOrder);
  const unit = metric.pct ? '%p/$' : '점수/$';
  const providers = [...new Set(models.map((m) => m.provider))].sort();
  const reset = () => update({ chartQuality: 'all', chartBudget: 0, provider: '', query: '', onlyCache: false, tier: 'standard' });
  const select = (label: string, aria: string, values: [string, string][], selected: string, onChange: (value: string) => void) =>
    h('label', null, h('span', null, label), h('select', { 'aria-label': aria, onchange: (event: Event) => onChange((event.target as HTMLSelectElement).value) },
      ...values.map(([value, text]) => h('option', { value, selected: value === selected }, text))));
  const controls = h('section', { class: 'value-controls', 'aria-label': '가성비 비교 조건' },
    h('div', { class: 'value-control-row' },
      select('성능 지표', 'Y축 벤치마크', available.map((m) => [m.key, m.label]), metric.key, (chartY) => update({ chartY })),
      select('비용 기준', 'X축 단가 기준', Object.entries(COST_LABELS), state.chartX, (chartX) => update({ chartX: chartX as typeof state.chartX })),
      select('제공사', '제공사', [['', '모든 제공사'], ...providers.map((p): [string, string] => [p, p])], state.provider, (provider) => update({ provider })),
      select('티어', '티어', ['standard', 'priority', 'flex'].map((t) => [t, t]), state.tier, (tier) => update({ tier: tier as Tier }))),
    h('div', { class: 'value-control-row requirements' },
      select('최소 성능', '최소 성능', QUALITY_LABELS, state.chartQuality, (chartQuality) => update({ chartQuality: chartQuality as ValueQuality })),
      h('label', null, h('span', null, '최대 단가 · $ / 1M tokens'),
        h('input', { type: 'number', min: 0, max: 1_000_000, step: 'any', placeholder: '제한 없음', 'aria-label': '최대 단가', value: state.chartBudget || '', onchange: (event: Event) => {
          const input = event.target as HTMLInputElement;
          if (input.validity.valid) update({ chartBudget: Number(input.value) || 0 });
        } })),
      h('label', { class: 'value-cache-filter' }, h('input', { type: 'checkbox', 'aria-label': '캐시 지원 모델만', checked: state.onlyCache, onchange: (event: Event) => update({ onlyCache: (event.target as HTMLInputElement).checked }) }), '캐시 지원 모델만'),
      h('button', { type: 'button', class: 'text-button', onclick: reset }, icon('reset'), '조건 해제')),
    h('p', { class: 'value-criteria-note' }, `${state.region} · ${state.tier} · ${COST_LABELS[state.chartX]} · `,
      state.chartQuality === 'all' ? '성능 제한 없음' : `리전 최고 점수 ${fmtScore(maxScore, metric)}의 ${QUALITY_FLOOR[state.chartQuality] * 100}% 이상 (${fmtScore(maxScore * QUALITY_FLOOR[state.chartQuality], metric)} 이상)`,
      state.chartBudget ? ` · 최대 ${usd(state.chartBudget)}` : '', ` · ${new Set(points.map((p) => p.m.id)).size}개 모델 / ${points.length}개 단가`));

  const maxValue = Math.max(0, ...points.map((p) => p.value)) || 1;
  const table = h('div', { class: 'scroll value-table-scroll', tabindex: 0, 'aria-label': '가성비 순위 표' }, h('table', { class: 'value-table' },
    h('caption', { class: 'sr-only' }, `${metric.label} 점수와 ${COST_LABELS[state.chartX]}의 가성비 비교`),
    h('thead', null, h('tr', null, h('th', { scope: 'col' }, '모델'),
      h('th', { scope: 'col', class: 'num' }, '성능 점수 ↑'), h('th', { scope: 'col', class: 'num' }, '단가 ↓'),
      h('th', { scope: 'col', class: 'num' }, `가성비 지표 (${unit}) ↑`), h('th', { scope: 'col' }, '비교'))),
    h('tbody', null, ...ranked.map((point, index) => h('tr', { class: state.compare.includes(point.m.id) ? 'selected' : '', 'data-model-id': point.m.id, 'data-score': point.y, 'data-price': point.x, 'data-value': point.value },
      h('td', { class: 'value-identity' }, h('div', { class: 'value-model' }, h('span', { class: 'value-position' }, String(index + 1)),
        h('div', null, h('a', { class: 'value-model-name', href: `#/model/${point.m.id}` }, point.m.name),
          h('div', { class: 'value-model-meta' }, point.m.provider, ' · ', point.scope),
          h('div', { class: 'value-model-badges' }, point.frontier ? h('span', { class: 'badge', title: '현재 검색·제공사·추론 조건에서 더 저렴하면서 점수가 같거나 높은 모델이 없는 후보입니다.' }, '효율적 후보') : null, sourceNote(point))))),
      h('td', { class: 'num value-score', 'data-label': '성능 점수' }, h('strong', null, fmtScore(point.y, metric)),
        h('small', null, `최고 점수의 ${maxScore ? Math.round(point.y / maxScore * 100) : 0}%`)),
      h('td', { class: 'num value-price', 'data-label': '단가 / 1M tokens' }, h('strong', null, usd(point.x))),
      h('td', { class: 'num value-efficiency', 'data-label': `가성비 (${unit})` }, h('div', { class: 'value-meter' },
        h('i', { style: `width:${point.value / maxValue * 100}%` }), h('strong', null, fmtValue(point.value)))),
      h('td', { class: 'value-compare' }, compareButton(point, point.scope)))))));

  return h('main', { class: 'value-page' },
    pageHeading('PERFORMANCE & COST', '필요한 성능은 지키고, 비용은 낮추세요', '최소 성능과 예산을 정하면, 조건에 맞는 모델을 가성비 순으로 바로 볼 수 있습니다.'),
    controls, highlights(points, metric),
    h('section', { class: 'value-results', 'aria-label': '가성비 후보 순위' },
      h('div', { class: 'value-results-heading' }, h('div', null, h('h2', null, '가성비 후보 순위'),
        h('p', null, `가성비 지표 = 성능 점수 ÷ 단가 (${unit}). 같은 지표·단가 기준 안에서 비교하는 참고값입니다.`)),
      select('정렬', '가성비 정렬', ORDER_LABELS, state.chartOrder, (chartOrder) => update({ chartOrder: chartOrder as ValueOrder }))),
      ranked.length ? table : emptyState('조건을 만족하는 모델이 없습니다', '최소 성능을 낮추거나 최대 단가를 높여보세요. 리전과 추론 방식도 확인할 수 있습니다.',
        h('button', { class: 'button secondary', type: 'button', onclick: reset }, '조건 해제'))),
    scatter(points, metric),
    h('details', { class: 'data-guide value-guide' }, h('summary', null, icon('info'), '계산 기준과 데이터 범위'),
      h('p', null, '단가는 USD / 1M tokens이며, 혼합 단가는 입력 4 : 출력 1 비율입니다. 캐시 할인과 장문 할증은 이 참고 지표에 포함하지 않습니다. 가성비 지표는 선택한 벤치마크의 점수를 단가로 나눈 값입니다. 실제 업무 품질은 별도 평가와 함께 확인하세요. 점수나 선택 리전·티어의 단가가 없는 모델은 순위를 계산하지 않습니다. “효율적 후보”는 현재 검색·제공사·추론 조건에서 가격과 점수를 동시에 개선하는 대안이 없는 후보입니다.'),
      h('p', null, '벤치마크: ', h('a', { href: 'https://artificialanalysis.ai/', rel: 'noopener' }, 'Artificial Analysis'), '. 공개 페이지로 보완한 값은 모델별 출처와 확인일을 표시합니다.')));
}
