import type { Mode, Tier } from './types.ts';

/** The filter state that lives in the URL query string so a view can be shared (region, modes, filters, sort, compare set). */
export interface UrlState {
  query: string;
  region: string;
  modes: Mode[];
  tier: Tier;
  provider: string;
  onlyCache: boolean;
  onlyInRegion: boolean;
  sort: { key: string; dir: 1 | -1 };
  chartY: string;
  chartX: 'blend' | 'input' | 'output';
  rankMetric: string;
  rankTop: number;
  weights: '' | 'open' | 'closed';
  reasoning: '' | 'yes' | 'no';
  compare: string[];
  expandCols: boolean;
}

const MODE_VALUES: Mode[] = ['in-region', 'geo', 'global'];
const TIERS: Tier[] = ['standard', 'batch', 'priority', 'flex'];
const REGION = /^[a-z]{2}(?:-[a-z]+)+-\d$/;
const WORD = /^[A-Za-z0-9]{1,24}$/;
// Keys are looked up in plain objects/arrays elsewhere, so a regex alone is not enough: "constructor" or "toString" match it and
// resolve to Object.prototype members. Accept only keys the app actually defines (a test keeps these in sync with the real tables).
export const RANK_METRICS = ['intelligence', 'coding', 'math', 'speed', 'ttft', 'price', 'context', 'gpqa', 'hle', 'mmluPro', 'liveCodeBench', 'scicode', 'aime'];
export const CHART_Y = ['intelligenceIndex', 'codingIndex', 'mathIndex', 'gpqa', 'mmluPro', 'hle', 'liveCodeBench', 'scicode', 'aime'];
export const SORT_KEYS = ['name', 'provider', 'mode', 'ai', 'coding', 'in', 'output', 'cr', 'cw', 'bl', 'lc', 'speed', 'ttft', 'ctx', 'out', 'bin', 'bout'];
const ID = /^[a-z0-9][a-z0-9._-]{0,59}$/;
export const MAX_COMPARE_IDS = 6;

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Only valid values survive: a shared link is untrusted input. Unknown or malformed params are ignored, never thrown on. */
export function parseParams(search: string): Partial<UrlState> {
  const p = new URLSearchParams(search);
  const out: Partial<UrlState> = {};
  const q = p.get('q');
  if (q) out.query = q.slice(0, 80);
  const region = p.get('region');
  if (region && REGION.test(region)) out.region = region;
  const modes = (p.get('modes') ?? '').split(',').filter((m): m is Mode => (MODE_VALUES as string[]).includes(m));
  if (modes.length) out.modes = MODE_VALUES.filter((m) => modes.includes(m));
  const tier = p.get('tier');
  if (tier && (TIERS as string[]).includes(tier)) out.tier = tier as Tier;
  const provider = p.get('provider');
  if (provider) out.provider = provider.slice(0, 40);
  if (p.get('cache') === '1') out.onlyCache = true;
  if (p.get('priced') === '0') out.onlyInRegion = false;
  if (p.get('cols') === '1') out.expandCols = true;
  const sort = /^([a-z]{1,10})\.(asc|desc)$/.exec(p.get('sort') ?? '');
  if (sort && SORT_KEYS.includes(sort[1])) out.sort = { key: sort[1], dir: sort[2] === 'asc' ? 1 : -1 };
  const weights = p.get('weights');
  if (weights === 'open' || weights === 'closed') out.weights = weights;
  const reasoning = p.get('reasoning');
  if (reasoning === 'yes' || reasoning === 'no') out.reasoning = reasoning;
  const metric = p.get('metric');
  if (metric && WORD.test(metric) && RANK_METRICS.includes(metric)) out.rankMetric = metric;
  const top = Number(p.get('top'));
  if (p.has('top') && Number.isInteger(top) && top >= 0 && top <= 200) out.rankTop = top;
  const cy = p.get('cy');
  if (cy && WORD.test(cy) && CHART_Y.includes(cy)) out.chartY = cy;
  const cx = p.get('cx');
  if (cx === 'blend' || cx === 'input' || cx === 'output') out.chartX = cx;
  const compare = (p.get('compare') ?? '').split(',').filter((id) => ID.test(id));
  if (compare.length) out.compare = [...new Set(compare)].slice(0, MAX_COMPARE_IDS);
  return out;
}

/** Query string for everything that differs from the defaults ("" when nothing does), so default views get clean URLs. */
export function serializeParams(s: UrlState, defaults: UrlState): string {
  const p = new URLSearchParams();
  if (s.query) p.set('q', s.query);
  if (s.region !== defaults.region) p.set('region', s.region);
  if (!same(s.modes, defaults.modes)) p.set('modes', s.modes.join(','));
  if (s.tier !== defaults.tier) p.set('tier', s.tier);
  if (s.provider) p.set('provider', s.provider);
  if (s.onlyCache) p.set('cache', '1');
  if (!s.onlyInRegion) p.set('priced', '0');
  if (s.expandCols) p.set('cols', '1');
  if (!same(s.sort, defaults.sort)) p.set('sort', `${s.sort.key}.${s.sort.dir === 1 ? 'asc' : 'desc'}`);
  if (s.weights) p.set('weights', s.weights);
  if (s.reasoning) p.set('reasoning', s.reasoning);
  if (s.rankMetric !== defaults.rankMetric) p.set('metric', s.rankMetric);
  if (s.rankTop !== defaults.rankTop) p.set('top', String(s.rankTop));
  if (s.chartY !== defaults.chartY) p.set('cy', s.chartY);
  if (s.chartX !== defaults.chartX) p.set('cx', s.chartX);
  if (s.compare.length) p.set('compare', s.compare.join(','));
  return p.toString();
}

/**
 * Re-validate state restored from somewhere other than the URL (localStorage). A crafted link used to be able to write a bad value
 * into saved preferences, which would then break every later visit, so stored values get the same checks as URL values.
 */
export function sanitizeStored(saved: unknown, defaults: UrlState): UrlState {
  if (typeof saved !== 'object' || saved === null) return { ...defaults };
  const merged = { ...defaults, ...(saved as Partial<UrlState>), query: '' };
  try {
    return { ...defaults, ...parseParams(serializeParams(merged, defaults)) };
  } catch {
    return { ...defaults };
  }
}
