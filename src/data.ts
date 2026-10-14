import type { Mode, Model, PriceTable, Scope, Tier, TokenKind } from './types.ts';
import { t } from './i18n.ts';

export interface Dataset {
  generatedAt: string;
  models: Model[];
}

export async function loadData(): Promise<Dataset> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/models.json`);
  if (!res.ok) throw new Error(`models.json -> ${res.status}`);
  return res.json();
}

export function priceOf(m: Model, region: string, scope: Scope, tier: Tier, kind: TokenKind): number | undefined {
  return m.pricing[region]?.[scope]?.[tier]?.[kind];
}

export const MODE_LABEL: Record<Mode, string> = { 'in-region': 'In-region', geo: 'Geo CRIS', global: 'Global CRIS' };
export const MODES: Mode[] = ['in-region', 'geo', 'global'];

/** In-region and Geo CRIS share one Price List price ("regional"); Global CRIS has its own. */
export const scopeOf = (mode: Mode): Scope => (mode === 'global' ? 'global' : 'regional');

export function longPriceOf(m: Model, region: string, scope: Scope, tier: Tier, kind: TokenKind): number | undefined {
  return m.longContext?.pricing[region]?.[scope]?.[tier]?.[kind];
}

const hasScope = (table: PriceTable, scope: Scope) => Object.values(table).some((r) => r[scope] !== undefined);

const FLAG: Record<Mode, string> = { 'in-region': 'i', geo: 'g', global: 'G' };

/**
 * Whether the model can be invoked this way from `region`.
 * The AWS model card lists this per region and endpoint (bedrock-runtime / bedrock-mantle), so it is exact;
 * without a card we only know which profile ids models.dev lists, or fall back to "has a price".
 */
export function supports(m: Model, mode: Mode, region: string): { ok: boolean; inferred: boolean; via?: string } {
  if (m.availability) {
    const a = m.availability[region];
    const runtime = !!a?.runtime?.includes(FLAG[mode]);
    const mantle = !!a?.mantle?.includes(FLAG[mode]);
    // Say so when the only route is the bedrock-mantle endpoint (OpenAI-style APIs), since runtime calls will fail.
    return { ok: runtime || mantle, inferred: false, via: !runtime && mantle ? 'mantle' : undefined };
  }
  if (m.modes) return { ok: m.modes.includes(mode), inferred: true };
  return { ok: hasScope(m.pricing, scopeOf(mode)), inferred: true };
}

export interface Variant {
  scope: Scope;
  /** Selected modes this row stands for, e.g. "In-region (mantle) · Geo CRIS". */
  label: string;
  inferred: boolean;
}

/** One row per price scope: in-region and Geo CRIS collapse into a single "regional" row because their price is the same. */
export function variants(m: Model, modes: Mode[], region: string): Variant[] {
  const out: Variant[] = [];
  const regional = modes.filter((x) => x !== 'global').map((x) => ({ x, ...supports(m, x, region) })).filter((x) => x.ok);
  if (regional.length) out.push({ scope: 'regional', label: regional.map((r) => MODE_LABEL[r.x] + (r.via ? ` (${r.via})` : '')).join(' · '), inferred: regional.some((r) => r.inferred) });
  const g = modes.includes('global') ? supports(m, 'global', region) : undefined;
  if (g?.ok) out.push({ scope: 'global', label: MODE_LABEL.global, inferred: g.inferred });
  return out;
}

/** A model seen through one price scope; the unit every ranking, table row, and chart point is built from. */
export interface Row extends Variant {
  m: Model;
}

/** Rows for the current mode selection, limited to scopes that have a price in the chosen region when that filter is on. */
export function variantRows(models: Model[], opts: { region: string; modes: Mode[]; onlyInRegion: boolean }): Row[] {
  return models
    .flatMap((m) => variants(m, opts.modes, opts.region).map((v) => ({ m, ...v })))
    .filter((r) => !opts.onlyInRegion || r.m.pricing[opts.region]?.[r.scope] !== undefined);
}

/** Input:output 4:1 weighted price with no cache, the same convention used for quick cost comparisons. */
export function blended(input?: number, output?: number): number | undefined {
  return input === undefined || output === undefined ? undefined : (input * 4 + output) / 5;
}

export function usd(n?: number): string {
  if (n === undefined) return '—';
  const fixed = n >= 100 ? n.toFixed(0) : String(Number(n.toPrecision(4)));
  // Keep at least two decimals so a column reads $0.60 / $2.50 rather than $0.6 / $2.5.
  return '$' + (fixed.includes('.') ? fixed.replace(/^(\d+)\.(\d)$/, '$1.$20') : n >= 100 ? fixed : fixed + '.00');
}

export function tokens(n?: number): string {
  if (n === undefined) return t('미확인', 'Unknown');
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(2)}M`;
  return `${Math.round(n / 1000)}K`;
}

/** Geo CRIS prefix for `region`: the profile whose source regions include it, else the one prefix the region's name starts with. */
function geoPrefix(m: Model, region: string): string | undefined {
  const bySource = Object.entries(m.geoSources ?? {}).find(([, regions]) => regions.includes(region))?.[0];
  if (bySource) return bySource;
  const named = (m.geoPrefixes ?? []).filter((p) => region.startsWith(`${p}-`));
  return named.length === 1 ? named[0] : m.geoPrefixes?.length === 1 ? m.geoPrefixes[0] : undefined;
}

/** The modelId to pass when invoking from `region`, per supported mode: the bare id in-region, a us./eu./… profile for Geo, global. for Global. */
export function inferenceIds(m: Model, region: string, modes: Mode[] = MODES): { mode: Mode; id: string; via?: string }[] {
  if (!m.modelId) return [];
  const out: { mode: Mode; id: string; via?: string }[] = [];
  for (const mode of modes) {
    const s = supports(m, mode, region);
    if (!s.ok) continue;
    const prefix = mode === 'global' ? 'global' : mode === 'geo' ? geoPrefix(m, region) : '';
    if (prefix === undefined) continue;
    out.push({ mode, id: prefix ? `${prefix}.${m.modelId}` : m.modelId, via: s.via });
  }
  return out;
}

/**
 * The id a table row stands for: Global CRIS rows get the global profile; regional rows prefer the bare in-region id, but a
 * Geo profile over an in-region id that only works on bedrock-mantle, since most callers use bedrock-runtime.
 */
export function rowModelId(r: Row, region: string, modes: Mode[]): string | undefined {
  const ids = inferenceIds(r.m, region, modes.filter((mode) => scopeOf(mode) === r.scope));
  const inRegion = ids.find((x) => x.mode === 'in-region');
  return (inRegion && !inRegion.via ? inRegion : ids.find((x) => x.mode === 'geo') ?? inRegion ?? ids[0])?.id;
}

export function allRegions(models: Model[]): string[] {
  return [...new Set(models.flatMap((m) => m.regions))].sort();
}

/** An empty selection means "all providers". */
export const providerSelected = (providers: readonly string[] | undefined, provider: string): boolean => !providers?.length || providers.includes(provider);

export function matches(m: Model, q: string): boolean {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = `${m.name} ${m.provider} ${m.id}`.toLowerCase();
  const compact = (s: string) => s.replace(/[^\p{L}\p{N}]/gu, '');
  const key = compact(hay);
  return terms.every((t) => hay.includes(t) || !!compact(t) && key.includes(compact(t)));
}
