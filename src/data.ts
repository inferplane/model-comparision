import type { Model, Scope, Tier, TokenKind } from './types.ts';

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
