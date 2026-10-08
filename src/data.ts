import type { Mode, Model, PriceTable, Scope, Tier, TokenKind } from './types.ts';

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
  if (n === undefined) return '미확인';
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(2)}M`;
  return `${Math.round(n / 1000)}K`;
}

export function allRegions(models: Model[]): string[] {
  return [...new Set(models.flatMap((m) => m.regions))].sort();
}

export function matches(m: Model, q: string): boolean {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = `${m.name} ${m.provider} ${m.id}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}
