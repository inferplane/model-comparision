import { blended, priceOf, type Row } from './data.ts';
import type { Metric } from './metrics.ts';
import type { Tier } from './types.ts';

/** One model occupies one rank. When multiple scopes are selected, use its cheapest known mixed-price scope. */
export function rankModelRows(rows: Row[], metric: Metric, options: { region: string; tier: Tier }): { r: Row; v: number }[] {
  const byModel = new Map<string, { r: Row; v: number; cost: number }>();
  for (const r of rows) {
    const v = metric.value(r);
    if (v === undefined || !Number.isFinite(v)) continue;
    const cost = blended(priceOf(r.m, options.region, r.scope, options.tier, 'input'), priceOf(r.m, options.region, r.scope, options.tier, 'output')) ?? Infinity;
    const previous = byModel.get(r.m.id);
    if (!previous || cost < previous.cost) byModel.set(r.m.id, { r, v, cost });
  }
  return [...byModel.values()].sort((a, b) => (metric.higherBetter ? b.v - a.v : a.v - b.v) || a.r.m.name.localeCompare(b.r.m.name))
    .map(({ r, v }) => ({ r, v }));
}
