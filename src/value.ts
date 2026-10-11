import { blended, matches, priceOf, variants } from './data.ts';
import type { BenchmarkScores, Mode, Model, Scope, Tier } from './types.ts';

export type ValueOrder = 'value' | 'price' | 'score';
export type ValueQuality = 'all' | 'balanced' | 'strong' | 'best';
export const QUALITY_FLOOR: Record<ValueQuality, number> = { all: 0, balanced: 0.5, strong: 0.75, best: 0.9 };

export interface ValuePoint {
  id: string;
  m: Model;
  label: string;
  scope: string;
  priceScope: Scope;
  x: number;
  y: number;
  value: number;
  frontier: boolean;
}

interface ValueOptions {
  region: string;
  modes: Mode[];
  tier: Tier;
  chartX: 'blend' | 'input' | 'output';
  chartY: keyof BenchmarkScores;
  pct: boolean;
  query?: string;
  provider?: string;
  onlyCache?: boolean;
}

/** Each point is a measured model and one supported price scope; absent scores are never treated as zero. */
export function collectValuePoints(models: Model[], opts: ValueOptions): ValuePoint[] {
  const points: ValuePoint[] = [];
  const both = opts.modes.includes('global') && opts.modes.some((mode) => mode !== 'global');
  for (const m of models) {
    if (opts.query && !matches(m, opts.query) || opts.provider && m.provider !== opts.provider) continue;
    const raw = m.benchmarks?.[opts.chartY];
    if (raw === undefined || !Number.isFinite(raw) || raw < 0 || opts.pct && raw > 1) continue;
    for (const v of variants(m, opts.modes, opts.region)) {
      if (opts.onlyCache && priceOf(m, opts.region, v.scope, opts.tier, 'cacheRead') === undefined) continue;
      const input = priceOf(m, opts.region, v.scope, opts.tier, 'input');
      const output = priceOf(m, opts.region, v.scope, opts.tier, 'output');
      const x = opts.chartX === 'input' ? input : opts.chartX === 'output' ? output : blended(input, output);
      const y = opts.pct ? raw * 100 : raw;
      if (x === undefined || !Number.isFinite(x) || x <= 0 || !Number.isFinite(y / x)) continue;
      points.push({ id: `${m.id}:${v.scope}`, m, label: both && v.scope === 'global' ? `${m.name} (Global)` : m.name, scope: v.label, priceScope: v.scope, x, y, value: y / x, frontier: false });
    }
  }
  return markFrontier(points);
}

/** Equal-price/equal-score models remain tied: neither strictly improves on the other. */
export function markFrontier(points: ValuePoint[]): ValuePoint[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || b.y - a.y || a.id.localeCompare(b.id));
  let bestCheaper = -Infinity;
  for (let start = 0; start < sorted.length;) {
    let end = start + 1;
    while (end < sorted.length && sorted[end].x === sorted[start].x) end++;
    const bestAtPrice = sorted[start].y;
    for (let i = start; i < end; i++) sorted[i] = { ...sorted[i], frontier: sorted[i].y === bestAtPrice && sorted[i].y > bestCheaper };
    bestCheaper = Math.max(bestCheaper, bestAtPrice);
    start = end;
  }
  return sorted;
}

export function rankValuePoints(points: ValuePoint[], order: ValueOrder): ValuePoint[] {
  return [...points].sort((a, b) =>
    (order === 'price' ? a.x - b.x || b.y - a.y : order === 'score' ? b.y - a.y || a.x - b.x : b.value - a.value || b.y - a.y || a.x - b.x)
    || a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
}

export function filterValuePoints(points: ValuePoint[], maxScore: number, quality: ValueQuality, budget: number): ValuePoint[] {
  return points.filter((p) => p.y >= maxScore * QUALITY_FLOOR[quality] && (!budget || p.x <= budget));
}
