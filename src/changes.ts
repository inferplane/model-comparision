import { MODE_LABEL, usd } from './data.ts';
import type { Mode, Scope, TokenKind } from './types.ts';

/** Shapes of public/data/changes.json, written by scripts/diff-data.ts (see scripts/data-changes.ts). */
export interface Brief {
  id: string;
  name: string;
  provider: string;
}
export interface PriceChange extends Brief {
  count: number;
  example: { region: string; scope: Scope; kind: TokenKind; from: number; to: number };
}
export interface AvailabilityChange extends Brief {
  regionCounts: Partial<Record<Mode, [number, number]>>;
}
export interface ChangeEntry {
  date: string;
  added: Brief[];
  removed: Brief[];
  priceChanges: PriceChange[];
  availabilityChanges: AvailabilityChange[];
}
export interface ChangesFile {
  updatedAt: string;
  entries: ChangeEntry[];
}

export const NO_CHANGES: ChangesFile = { updatedAt: '', entries: [] };

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const list = <T>(v: unknown, ok: (x: unknown) => x is T): T[] => (Array.isArray(v) ? v.filter(ok) : []);
const isBrief = (x: unknown): x is Brief => isObj(x) && typeof x.id === 'string' && typeof x.name === 'string' && typeof x.provider === 'string';
const isPrice = (x: unknown): x is PriceChange => isBrief(x) && typeof (x as unknown as PriceChange).count === 'number' && isObj((x as unknown as PriceChange).example);
const isAvail = (x: unknown): x is AvailabilityChange => isBrief(x) && isObj((x as unknown as AvailabilityChange).regionCounts);

/** The file is fetched from the network, so treat it as untrusted: anything malformed is dropped instead of breaking the page. */
export function parseChanges(raw: unknown): ChangesFile {
  if (!isObj(raw) || !Array.isArray(raw.entries)) return NO_CHANGES;
  const entries: ChangeEntry[] = [];
  for (const e of raw.entries) {
    if (!isObj(e) || typeof e.date !== 'string' || !DATE.test(e.date)) continue;
    entries.push({ date: e.date, added: list(e.added, isBrief), removed: list(e.removed, isBrief), priceChanges: list(e.priceChanges, isPrice), availabilityChanges: list(e.availabilityChanges, isAvail) });
  }
  return { updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '', entries };
}

const cutoff = (today: string, days: number) => new Date(Date.parse(today) - days * 86_400_000).toISOString().slice(0, 10);

/** Entries from the last `days` days (inclusive of today), newest first. */
export function entriesWithin(entries: ChangeEntry[], today: string, days: number): ChangeEntry[] {
  const from = cutoff(today, days);
  return entries.filter((e) => e.date >= from && e.date <= today).sort((a, b) => b.date.localeCompare(a.date));
}

/** model id -> the day this site first saw it added, for models added within `days` days. */
export function recentlyAdded(entries: ChangeEntry[], today: string, days = 14): Map<string, string> {
  const out = new Map<string, string>();
  // Newest first, so a model added twice keeps its latest date.
  for (const e of entriesWithin(entries, today, days)) for (const m of e.added) if (!out.has(m.id)) out.set(m.id, e.date);
  return out;
}

const SCOPE_LABEL: Record<Scope, string> = { regional: 'In-region · Geo CRIS', global: 'Global CRIS' };
const KIND_LABEL: Partial<Record<TokenKind, string>> = { input: 'Input', output: 'Output', cacheRead: 'Cache read', cacheWrite: 'Cache write' };

export function describePrice(p: PriceChange): string {
  const { region, scope, kind, from, to } = p.example;
  return `${region} · ${SCOPE_LABEL[scope]} · ${KIND_LABEL[kind] ?? kind}: ${usd(from)} → ${usd(to)}${p.count > 1 ? ` (외 ${p.count - 1}건)` : ''}`;
}

export function describeAvailability(a: AvailabilityChange): string {
  return (Object.entries(a.regionCounts) as [Mode, [number, number]][]).map(([mode, [from, to]]) => `${MODE_LABEL[mode] ?? mode} ${from} → ${to}개 리전`).join(', ');
}
