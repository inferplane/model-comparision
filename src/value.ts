import { blended, matches, priceOf, providerSelected, variants } from './data.ts';
import { zdrOf } from './zdr.ts';
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

export interface ValueOptions {
  region: string;
  modes: Mode[];
  tier: Tier;
  chartX: 'blend' | 'input' | 'output';
  chartY: keyof BenchmarkScores;
  pct: boolean;
  query?: string;
  providers?: string[];
  onlyCache?: boolean;
  onlyZdr?: boolean;
}

const DAY = 86_400_000;
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** AWS card dates only; firstSeen is a catalogue observation date, not a release date. */
export function launchTime(model: Model): number | undefined {
  const value = model.card?.launchDate?.trim();
  if (!value) return undefined;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const english = /^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i.exec(value);
  const year = iso ? Number(iso[1]) : english ? Number(english[3]) : NaN;
  const month = iso ? Number(iso[2]) - 1 : english ? MONTHS.indexOf(english[1].toLowerCase()) : -1;
  const day = iso ? Number(iso[3]) : english ? Number(english[2]) : NaN;
  if (!Number.isFinite(year) || month < 0 || month > 11 || !Number.isFinite(day)) return undefined;
  const time = Date.UTC(year, month, day);
  const date = new Date(time);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day ? time : undefined;
}

export function isRecentModel(model: Model, now = Date.now()): boolean {
  const time = launchTime(model);
  if (time === undefined) return false;
  const age = Math.floor(now / DAY) - Math.floor(time / DAY);
  return age >= 0 && age < 60;
}

export type ExclusionReason = 'provider' | 'zdr' | 'inference' | 'benchmark' | 'price' | 'cache' | 'quality' | 'budget';
export interface ValueExclusion { m: Model; reason: ExclusionReason; score?: number; price?: number; }

/** One actionable primary reason per model, using exactly the same points/constraints as the visible table. */
export function valueExclusions(models: Model[], opts: ValueOptions, maxScore: number, quality: ValueQuality, budget: number): ValueExclusion[] {
  const excluded: ValueExclusion[] = [];
  for (const m of models) {
    if (opts.query && !matches(m, opts.query)) continue;
    if (!providerSelected(opts.providers, m.provider)) { excluded.push({ m, reason: 'provider' }); continue; }
    if (opts.onlyZdr && !zdrOf(m)) { excluded.push({ m, reason: 'zdr' }); continue; }
    if (!variants(m, opts.modes, opts.region).length) { excluded.push({ m, reason: 'inference' }); continue; }
    const score = m.benchmarks?.[opts.chartY];
    if (score === undefined || !Number.isFinite(score) || score < 0 || opts.pct && score > 1) { excluded.push({ m, reason: 'benchmark' }); continue; }
    const priced = collectValuePoints([m], { ...opts, query: '', providers: [], onlyCache: false });
    if (!priced.length) { excluded.push({ m, reason: 'price' }); continue; }
    const cached = opts.onlyCache ? collectValuePoints([m], { ...opts, query: '', providers: [] }) : priced;
    if (!cached.length) { excluded.push({ m, reason: 'cache' }); continue; }
    const scoreOK = filterValuePoints(cached, maxScore, quality, 0);
    if (!scoreOK.length) { excluded.push({ m, reason: 'quality', score: cached[0].y }); continue; }
    if (budget && scoreOK.every((p) => p.x > budget)) excluded.push({ m, reason: 'budget', price: Math.min(...scoreOK.map((p) => p.x)) });
  }
  return excluded;
}

/** Each point is a measured model and one supported price scope; absent scores are never treated as zero. */
export function collectValuePoints(models: Model[], opts: ValueOptions): ValuePoint[] {
  const points: ValuePoint[] = [];
  const both = opts.modes.includes('global') && opts.modes.some((mode) => mode !== 'global');
  for (const m of models) {
    if (opts.query && !matches(m, opts.query) || !providerSelected(opts.providers, m.provider) || opts.onlyZdr && !zdrOf(m)) continue;
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
