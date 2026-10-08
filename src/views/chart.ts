import { h, s } from '../dom.ts';
import { blended, matches, priceOf, usd, variants, tokens } from '../data.ts';
import { state, update } from '../state.ts';
import type { BenchmarkScores, Model } from '../types.ts';

interface Metric {
  key: keyof BenchmarkScores;
  label: string;
  /** Fraction scores (0-1) are shown as percent. */
  pct: boolean;
}

const Y_METRICS: Metric[] = [
  { key: 'intelligenceIndex', label: 'Intelligence Index', pct: false },
  { key: 'codingIndex', label: 'Coding Index', pct: false },
  { key: 'mathIndex', label: 'Math Index', pct: false },
  { key: 'gpqa', label: 'GPQA Diamond (%)', pct: true },
  { key: 'mmluPro', label: 'MMLU-Pro (%)', pct: true },
  { key: 'hle', label: "Humanity's Last Exam (%)", pct: true },
  { key: 'liveCodeBench', label: 'LiveCodeBench (%)', pct: true },
  { key: 'scicode', label: 'SciCode (%)', pct: true },
  { key: 'aime', label: 'AIME (%)', pct: true },
];

const X_BASES = {
  blend: { label: '4:1 혼합 (입력 4 : 출력 1)', price: (i?: number, o?: number) => blended(i, o) },
  input: { label: 'Input', price: (i?: number) => i },
  output: { label: 'Output', price: (_i?: number, o?: number) => o },
} as const;

interface Pt {
  m: Model;
  label: string;
  scope: string;
  x: number;
  y: number;
  frontier: boolean;
  hit: boolean;
}

const M = { l: 46, r: 18, t: 14, b: 46 };
const NICE_X = [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];

function collect(models: Model[], metric: Metric): Pt[] {
  const basis = X_BASES[state.chartX];
  const pts: Pt[] = [];
  // With both price scopes on, a model appears twice; tag the Global point so labels and tooltips stay distinguishable.
  const both = state.modes.includes('global') && state.modes.some((x) => x !== 'global');
  for (const m of models) {
    const raw = m.benchmarks?.[metric.key];
    if (raw === undefined) continue;
    for (const v of variants(m, state.modes, state.region)) {
      const x = basis.price(priceOf(m, state.region, v.scope, state.tier, 'input'), priceOf(m, state.region, v.scope, state.tier, 'output'));
      if (x === undefined || x <= 0) continue;
      pts.push({ m, label: both && v.scope === 'global' ? `${m.name} (Global)` : m.name, scope: v.label, x, y: metric.pct ? raw * 100 : raw, frontier: false, hit: !!state.query && matches(m, state.query) });
    }
  }
  // Efficiency frontier: nothing else is both cheaper (or equal) and better.
  pts.sort((a, b) => a.x - b.x || b.y - a.y);
  let best = -Infinity;
  for (const p of pts) {
    if (p.y > best) {
      p.frontier = true;
      best = p.y;
    }
  }
  return pts;
}

const fmtY = (v: number, metric: Metric) => (metric.pct ? `${v.toFixed(1)}%` : v.toFixed(1));

export function renderChart(models: Model[]): HTMLElement {
  const available = Y_METRICS.filter((mt) => models.filter((m) => m.benchmarks?.[mt.key] !== undefined).length >= 3);
  const metric = available.find((mt) => mt.key === state.chartY) ?? available[0];
  if (!metric) return h('main', null, h('p', { class: 'note' }, '벤치마크 데이터가 아직 없습니다. 데이터 빌드에 AA_API_KEY가 설정되어야 차트가 표시됩니다.'));

  const pts = collect(models, metric);
  const host = h('div', { class: 'plot' });
  const tip = h('div', { class: 'tip', hidden: true, role: 'status' });
  host.append(tip);

  const frontierPts = pts.filter((p) => p.frontier);
  const summary = `${metric.label} 대 ${X_BASES[state.chartX].label} 단가 산점도. 모델 ${pts.length}개, 효율 프런티어 ${frontierPts.length}개.`;

  function draw() {
    host.querySelector('svg')?.remove();
    host.querySelectorAll('.note').forEach((n) => n.remove());
    const W = Math.max(320, host.clientWidth || 900);
    const H = W < 560 ? 400 : 520;
    const iw = W - M.l - M.r;
    const ih = H - M.t - M.b;
    if (!pts.length) {
      host.append(h('p', { class: 'note' }, '선택한 설정에서 가격과 벤치마크가 모두 있는 모델이 없습니다.'));
      return;
    }
    const xs = pts.map((p) => p.x);
    const [xmin, xmax] = [Math.min(...xs) * 0.8, Math.max(...xs) * 1.25];
    const ys = pts.map((p) => p.y);
    const pad = (Math.max(...ys) - Math.min(...ys)) * 0.08 || 5;
    const ymin = Math.max(0, Math.floor((Math.min(...ys) - pad) / 5) * 5);
    const ymax = Math.min(100, Math.ceil((Math.max(...ys) + pad) / 5) * 5);
    const lx = (v: number) => M.l + ((Math.log(v) - Math.log(xmin)) / (Math.log(xmax) - Math.log(xmin))) * iw;
    const ly = (v: number) => M.t + ih - ((v - ymin) / (ymax - ymin)) * ih;

    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': summary, class: 'scatter' });
    // Grid + ticks: hairline, solid, one step off the surface.
    const yStep = ymax - ymin > 50 ? 20 : ymax - ymin > 25 ? 10 : 5;
    for (let v = Math.ceil(ymin / yStep) * yStep; v <= ymax; v += yStep) {
      svg.append(s('line', { x1: M.l, x2: W - M.r, y1: ly(v), y2: ly(v), class: 'grid' }), s('text', { x: M.l - 8, y: ly(v) + 4, class: 'tick', 'text-anchor': 'end' }, String(v)));
    }
    for (const v of NICE_X.filter((t) => t >= xmin && t <= xmax)) {
      svg.append(s('line', { x1: lx(v), x2: lx(v), y1: M.t, y2: M.t + ih, class: 'grid' }), s('text', { x: lx(v), y: M.t + ih + 16, class: 'tick', 'text-anchor': 'middle' }, `$${v}`));
    }
    svg.append(
      s('line', { x1: M.l, x2: W - M.r, y1: M.t + ih, y2: M.t + ih, class: 'axis' }),
      s('text', { x: M.l + iw / 2, y: H - 8, class: 'axis-title', 'text-anchor': 'middle' }, `USD / 1M tokens, ${X_BASES[state.chartX].label} (로그 스케일) →`),
      s('text', { x: M.l, y: 10, class: 'axis-title' }, `↑ ${metric.label}`),
    );

    // "Most attractive" quadrant: at or below the median price and in the top quarter of scores. The score median alone would span almost the whole chart because most models score low.
    const quantile = (v: number[], q: number) => [...v].sort((a, b) => a - b)[Math.min(v.length - 1, Math.floor(v.length * q))];
    const [qx, qy] = [lx(quantile(xs, 0.5)), ly(quantile(ys, 0.75))];
    svg.append(
      s('rect', { x: M.l, y: M.t, width: Math.max(0, qx - M.l), height: Math.max(0, qy - M.t), class: 'quad' }),
      s('text', { x: M.l + 8, y: M.t + 16, class: 'quad-label' }, '가성비 구간 (가격 중앙값 이하 · 점수 상위 25%)'),
    );

    // Frontier line first so dots sit on top of it.
    // Staircase: at any price the best reachable score is the last frontier point to the left, so step right first, then up.
    if (frontierPts.length > 1) {
      const path = frontierPts.map((p, i) => (i === 0 ? `${lx(p.x)},${ly(p.y)}` : `${lx(p.x)},${ly(frontierPts[i - 1].y)} ${lx(p.x)},${ly(p.y)}`));
      svg.append(s('polyline', { points: path.join(' '), class: 'frontier-line' }));
    }
    const dots = new Map<Pt, SVGElement>();
    const ordered = [...pts].sort((a, b) => Number(a.frontier) - Number(b.frontier));
    for (const p of ordered) {
      const dot = s('circle', { cx: lx(p.x), cy: ly(p.y), r: p.frontier ? 5 : 4, class: `dot${p.frontier ? ' frontier' : ''}${p.hit ? ' hit' : ''}` });
      dots.set(p, dot);
      svg.append(dot);
    }

    // Direct labels: the frontier (and search hits) only, skipping any that would collide.
    const boxes: [number, number, number, number][] = [];
    const free = (b: [number, number, number, number]) => b[0] >= 0 && b[2] <= W && b[1] >= 0 && boxes.every((o) => b[2] < o[0] || b[0] > o[2] || b[3] < o[1] || b[1] > o[3]);
    for (const p of [...pts.filter((q) => q.hit), ...frontierPts.filter((q) => !q.hit).sort((a, b) => b.y - a.y)]) {
      const w = p.label.length * 6.4 + 4;
      const [cx, cy] = [lx(p.x), ly(p.y)];
      const spots: [number, number, 'start' | 'end'][] = [[cx + 9, cy - 8, 'start'], [cx - 9, cy - 8, 'end'], [cx + 9, cy + 14, 'start'], [cx - 9, cy + 14, 'end']];
      for (const [tx, ty, anchor] of spots) {
        const box: [number, number, number, number] = anchor === 'start' ? [tx, ty - 11, tx + w, ty + 3] : [tx - w, ty - 11, tx, ty + 3];
        if (!free(box)) continue;
        boxes.push(box);
        svg.append(s('text', { x: tx, y: ty, class: 'dlabel', 'text-anchor': anchor }, p.label));
        break;
      }
    }

    // Nearest-point hit layer: the pointer only has to be closest, not dead-center on an 8px dot.
    let active: Pt | undefined;
    const show = (p: Pt | undefined) => {
      if (active) dots.get(active)?.classList.remove('active');
      active = p;
      if (!p) {
        tip.hidden = true;
        return;
      }
      dots.get(p)?.classList.add('active');
      const [cx, cy] = [lx(p.x), ly(p.y)];
      tip.replaceChildren(
        h('div', { class: 'tip-val' }, fmtY(p.y, metric)),
        h('div', { class: 'tip-name' }, `${p.m.name} · ${p.m.provider}`),
        h('div', { class: 'tip-row' }, `${p.scope}`),
        h('div', { class: 'tip-row' }, `${X_BASES[state.chartX].label}: ${usd(p.x)} / 1M`),
        h('div', { class: 'tip-row' }, `Context ${tokens(p.m.contextWindow)}${p.frontier ? ' · 효율 프런티어' : ''}`),
      );
      tip.hidden = false;
      // Flip to the left/up side near the right/bottom edge so the tooltip stays inside the plot.
      tip.style.left = `${cx > W * 0.6 ? cx - tip.offsetWidth - 12 : cx + 12}px`;
      tip.style.top = `${Math.max(0, Math.min(cy - 20, H - tip.offsetHeight - 4))}px`;
    };
    const overlay = s('rect', { x: M.l, y: M.t, width: iw, height: ih, fill: 'transparent', class: 'hitlayer' });
    overlay.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const [px, py] = [e.clientX - r.left, e.clientY - r.top];
      let near: Pt | undefined;
      let d = 28 * 28;
      for (const p of pts) {
        const dd = (lx(p.x) - px) ** 2 + (ly(p.y) - py) ** 2;
        if (dd < d) [d, near] = [dd, p];
      }
      show(near);
    });
    overlay.addEventListener('pointerleave', () => show(undefined));
    overlay.addEventListener('click', () => active && (location.hash = `#/model/${active.m.id}`));
    svg.append(overlay);
    host.prepend(svg);
  }

  const ro = new ResizeObserver(() => {
    if (!host.isConnected) return ro.disconnect();
    draw();
  });
  queueMicrotask(() => ro.observe(host));

  const controls = h('div', { class: 'filters' },
    h('label', null, 'Y축 ', h('select', { 'aria-label': 'Y축 벤치마크', onchange: (e: Event) => update({ chartY: (e.target as HTMLSelectElement).value }) },
      ...available.map((mt) => h('option', { value: mt.key, selected: mt.key === metric.key }, mt.label)))),
    h('label', null, 'X축 단가 ', h('select', { 'aria-label': 'X축 단가 기준', onchange: (e: Event) => update({ chartX: (e.target as HTMLSelectElement).value as 'blend' }) },
      ...(Object.keys(X_BASES) as (keyof typeof X_BASES)[]).map((k) => h('option', { value: k, selected: k === state.chartX }, X_BASES[k].label)))),
    h('span', { class: 'legend' },
      h('i', { class: 'swatch frontier' }), '효율 프런티어',
      h('i', { class: 'swatch' }), '그 외'),
    h('span', { class: 'count' }, `${pts.length}개 점 (${new Set(pts.map((p) => p.m.id)).size}개 모델)`));

  const rows = [...pts].sort((a, b) => b.y - a.y || a.x - b.x);
  const table = h('details', { class: 'twin' },
    h('summary', null, '표로 보기'),
    h('div', { class: 'scroll' }, h('table', null,
      h('thead', null, h('tr', null, h('th', null, '모델'), h('th', null, '추론'), h('th', { class: 'num' }, metric.label), h('th', { class: 'num' }, 'USD / 1M'), h('th', null, ''))),
      h('tbody', null, ...rows.map((p) => h('tr', null,
        h('td', { class: 'name' }, h('a', { href: `#/model/${p.m.id}` }, p.m.name)),
        h('td', { class: 'mode' }, p.scope),
        h('td', { class: 'num' }, fmtY(p.y, metric)),
        h('td', { class: 'num' }, usd(p.x)),
        h('td', null, p.frontier ? '효율 프런티어' : '')))))));

  return h('main', null,
    h('h1', { class: 'chart-title' }, '성능 대비 비용'),
    h('p', { class: 'note' }, `${state.region} · ${state.tier}. 왼쪽 위일수록 싸고 성능이 높습니다. 효율 프런티어는 "더 싸면서 더 높은 점수를 내는 모델이 없는" 모델이며, 선택한 추론 방식이 바뀌면 함께 바뀝니다. 벤치마크: Artificial Analysis(설정 변형이 여럿이면 기본 항목 또는 최고 변형). 점을 클릭하면 상세로 이동합니다.`),
    controls, host, table);
}
