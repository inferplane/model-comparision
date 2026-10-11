import type { Model, Scope, TokenKind } from '../src/types.ts';

export interface Brief {
  id: string;
  name: string;
  provider: string;
}
export interface PriceChange extends Brief {
  /** How many region/scope/kind prices moved for this model. */
  count: number;
  /** One representative change (us-east-1 when it moved). */
  example: { region: string; scope: Scope; kind: TokenKind; from: number; to: number };
}
export interface AvailabilityChange extends Brief {
  /** e.g. { global: [2, 31] } meaning Global CRIS went from 2 to 31 regions. */
  regionCounts: Record<string, [number, number]>;
}
export interface Changes {
  added: Brief[];
  removed: Brief[];
  priceChanges: PriceChange[];
  availabilityChanges: AvailabilityChange[];
}

const brief = (m: Model): Brief => ({ id: m.id, name: m.name, provider: m.provider });
const KINDS: TokenKind[] = ['input', 'output', 'cacheRead'];

function priceDiff(a: Model, b: Model): PriceChange | undefined {
  let count = 0;
  let example: PriceChange['example'] | undefined;
  for (const [region, scopes] of Object.entries(b.pricing)) {
    for (const scope of ['regional', 'global'] as const) {
      for (const kind of KINDS) {
        const to = scopes[scope]?.standard?.[kind];
        const from = a.pricing[region]?.[scope]?.standard?.[kind];
        // A price appearing where there was none (a new region or SKU) is an addition, not a change.
        if (to === undefined || from === undefined || Math.abs(to - from) < 1e-9) continue;
        count++;
        if (!example || (region === 'us-east-1' && example.region !== 'us-east-1')) example = { region, scope, kind, from, to };
      }
    }
  }
  return count && example ? { ...brief(b), count, example } : undefined;
}

/** Regions where each invocation option is offered, counted over both endpoints. */
function modeCounts(m: Model): Record<string, number> {
  const out = { 'in-region': 0, geo: 0, global: 0 };
  for (const av of Object.values(m.availability ?? {})) {
    const flags = `${av.runtime ?? ''}${av.mantle ?? ''}`;
    if (flags.includes('i')) out['in-region']++;
    if (flags.includes('g')) out.geo++;
    if (flags.includes('G')) out.global++;
  }
  return out;
}

export function computeChanges(prev: Model[], next: Model[]): Changes {
  const before = new Map(prev.map((m) => [m.id, m]));
  const after = new Map(next.map((m) => [m.id, m]));
  const changes: Changes = { added: [], removed: [], priceChanges: [], availabilityChanges: [] };
  for (const m of next) if (!before.has(m.id)) changes.added.push(brief(m));
  for (const m of prev) if (!after.has(m.id)) changes.removed.push(brief(m));
  for (const m of next) {
    const old = before.get(m.id);
    if (!old) continue;
    const price = priceDiff(old, m);
    if (price) changes.priceChanges.push(price);
    const [x, y] = [modeCounts(old), modeCounts(m)];
    const diff = Object.fromEntries(Object.keys(y).filter((k) => x[k] !== y[k]).map((k) => [k, [x[k], y[k]] as [number, number]]));
    // A model without a card on either side has no availability to compare.
    if (old.availability && m.availability && Object.keys(diff).length) changes.availabilityChanges.push({ ...brief(m), regionCounts: diff });
  }
  return changes;
}

export interface Review {
  model: Brief;
  /** What a person has to look at for this new model. */
  todo: string[];
}

/**
 * New models that the automatic matching could not fully cover. `recentIds` are the models the change history recorded as newly added
 * in the last few days; using that instead of `firstSeen` keeps the long tail of legacy models (which never had a card or a
 * benchmark) out, including in a repository's first week when every model's firstSeen is recent.
 */
export function needsReview(models: Model[], recentIds: Set<string>, benchmarksExist = true): Review[] {
  const out: Review[] = [];
  for (const m of models) {
    if (!recentIds.has(m.id)) continue;
    const todo: string[] = [];
    const commercialPrice = Object.keys(m.pricing).some((r) => !r.startsWith('us-gov'));
    if (!commercialPrice) todo.push('상용 리전 가격이 없음 (Price List에 아직 없고 모델 카드에도 가격 표가 없음)');
    if (!m.card) todo.push('AWS 모델 카드와 매칭되지 않음 → data/aliases.yaml `aliases`에 모델 ID 추가');
    if (!m.contextWindow) todo.push('context window 미확인');
    if (benchmarksExist && !m.benchmarks) todo.push('벤치마크 미매칭 (Artificial Analysis에 없을 수도 있음) → data/aliases.yaml `benchmarkAliases` 확인');
    if (todo.length) out.push({ model: brief(m), todo });
  }
  return out;
}

export interface Guard {
  ok: boolean;
  reason?: string;
}

/**
 * Stop a run whose data moved too much at once. A removed catalogue or a price wave across most models is far more likely a broken
 * upstream page or a parser regression than a real change, and publishing it would replace good data with bad.
 */
export function sanityGuard(c: Changes, previousCount: number): Guard {
  if (previousCount < 20) return { ok: true };
  const gone = c.removed.length;
  if (gone >= 10 && gone / previousCount >= 0.1) return { ok: false, reason: `${gone} of ${previousCount} models disappeared` };
  if (c.priceChanges.length / previousCount >= 0.5) return { ok: false, reason: `prices changed for ${c.priceChanges.length} of ${previousCount} models` };
  return { ok: true };
}

const usd = (n: number) => `$${Number(n.toPrecision(4))}`;

/** One-line commit message, e.g. "data: +2 models (GPT-6.2 Sol, Foo), 3 price changes". */
export function commitMessage(c: Changes): string {
  const parts: string[] = [];
  if (c.added.length) parts.push(`+${c.added.length} model${c.added.length > 1 ? 's' : ''} (${c.added.slice(0, 3).map((m) => m.name).join(', ')}${c.added.length > 3 ? ', …' : ''})`);
  if (c.removed.length) parts.push(`-${c.removed.length} (${c.removed.slice(0, 3).map((m) => m.name).join(', ')}${c.removed.length > 3 ? ', …' : ''})`);
  if (c.priceChanges.length) parts.push(`${c.priceChanges.length} price change${c.priceChanges.length > 1 ? 's' : ''}`);
  if (c.availabilityChanges.length) parts.push(`${c.availabilityChanges.length} availability change${c.availabilityChanges.length > 1 ? 's' : ''}`);
  return `data: ${parts.length ? parts.join(', ') : 'refresh Bedrock prices'}`;
}

export function changesMarkdown(c: Changes, date: string, limit = 25): string {
  const list = <T>(items: T[], f: (x: T) => string) => `${items.slice(0, limit).map((x) => `- ${f(x)}`).join('\n')}${items.length > limit ? `\n- … and ${items.length - limit} more` : ''}`;
  const sections: string[] = [];
  if (c.added.length) sections.push(`### New models (${c.added.length})\n${list(c.added, (m) => `${m.name} (${m.provider})`)}`);
  if (c.removed.length) sections.push(`### Removed models (${c.removed.length})\n${list(c.removed, (m) => `${m.name} (${m.provider})`)}`);
  if (c.priceChanges.length) sections.push(`### Price changes (${c.priceChanges.length} models)\n${list(c.priceChanges, (p) => `${p.name}: ${p.example.region} ${p.example.scope} ${p.example.kind} ${usd(p.example.from)} → ${usd(p.example.to)}${p.count > 1 ? ` (+${p.count - 1} more prices)` : ''}`)}`);
  if (c.availabilityChanges.length) sections.push(`### Availability changes (${c.availabilityChanges.length} models)\n${list(c.availabilityChanges, (a) => `${a.name}: ${Object.entries(a.regionCounts).map(([k, [x, y]]) => `${k} regions ${x} → ${y}`).join(', ')}`)}`);
  return `## ${date}\n\n${sections.length ? sections.join('\n\n') : 'No changes.'}\n`;
}
