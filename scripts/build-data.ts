import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { parse } from 'yaml';
import type { Model, PriceEntry, PriceTable, Scope, Tier, TokenKind } from '../src/types.ts';
import type { BenchmarkRecord } from './fetch-benchmarks.ts';
import type { ContextRecord } from './fetch-context.ts';
import type { CardRecord } from './parse-card.ts';
import { providerFromName } from './parse-pricing.ts';

interface Overrides {
  extraModels?: {
    name: string;
    provider: string;
    source: string;
    pricing: Record<string, Partial<Record<Scope, Partial<Record<'input' | 'output' | 'cacheRead' | 'cacheWrite', number>>>>>;
  }[];
}

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T;
const readYaml = <T>(path: string, fallback: T): T => (existsSync(path) ? ((parse(readFileSync(path, 'utf8')) as T) ?? fallback) : fallback);

const prices = readJson<PriceEntry[]>('data/raw/prices.json');
const contexts = readJson<ContextRecord[]>('data/raw/context.json');
const cards = existsSync('data/raw/cards.json') ? readJson<CardRecord[]>('data/raw/cards.json') : [];
const benchmarks = existsSync('data/raw/benchmarks.json') ? readJson<BenchmarkRecord[]>('data/raw/benchmarks.json') : [];
const overrides = readYaml<Overrides>('data/overrides.yaml', {});
const aliasFile = readYaml<{ aliases?: Record<string, string>; benchmarkAliases?: Record<string, string> }>('data/aliases.yaml', {});
const aliases = aliasFile.aliases ?? {};
const benchmarkAliases = aliasFile.benchmarkAliases ?? {};
const previous = existsSync('public/data/models.json') ? readJson<{ models: Model[] }>('public/data/models.json').models : [];
const firstSeenById = new Map(previous.map((m) => [m.id, m.firstSeen]));
const today = new Date().toISOString().slice(0, 10);

const norm = (s: string) => s.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').replace(/[^a-z0-9.]+/g, '');
// Looser key for naming drift between the Price List and models.dev ("Gemma 3 12B" vs "Gemma 3 12B IT", "Nova 2.0 Lite" vs "Nova 2 Lite").
const NOISE = new Set(['cohere', 'meta', 'nvidia', 'openai', 'deepseek', 'google', 'writer', 'instruct', 'it', 'v1', 'us', 'india']);
const loose = (s: string) =>
  s
    .toLowerCase()
    .replace(/[()\-_:]/g, ' ')
    .replace(/\b(\d+)\.0\b/g, '$1')
    .split(/\s+/)
    .filter((t) => t && !NOISE.has(t))
    .join('')
    .replace(/[^a-z0-9.]/g, '');
// The Price List spells the same vendor several ways ("Kimi AI"/"Moonshot AI", "Minimax AI"/"MiniMax"), so fold them before grouping in the UI.
const CANON: Record<string, string> = { 'kimi ai': 'Moonshot AI', 'moonshot ai': 'Moonshot AI', 'mistral ai': 'Mistral', minimax: 'MiniMax', 'minimax ai': 'MiniMax', nvidia: 'NVIDIA' };
const canonProvider = (p: string) => CANON[p.toLowerCase()] ?? p;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');

const contextByName = new Map<string, ContextRecord>();
const contextById = new Map(contexts.map((c) => [c.bedrockId, c]));
const contextByLoose = new Map<string, ContextRecord>();
for (const c of contexts) {
  if (!contextByName.has(norm(c.name))) contextByName.set(norm(c.name), c);
  if (!contextByLoose.has(loose(c.name))) contextByLoose.set(loose(c.name), c);
}

const models = new Map<string, Model>();
function modelFor(name: string, provider?: string): Model {
  const id = slug(name);
  let m = models.get(id);
  if (!m) {
    m = {
      id,
      name,
      provider: canonProvider(provider ?? providerFromName(name) ?? (/^(nova|titan)/i.test(name) ? 'Amazon' : 'Other')),
      pricing: {},
      regions: [],
      firstSeen: firstSeenById.get(id) ?? today,
    };
    models.set(id, m);
  } else if (provider && m.provider === 'Other') m.provider = canonProvider(provider);
  return m;
}
function setPrice(table: PriceTable, region: string, scope: Scope, tier: Tier, kind: TokenKind, usd: number) {
  const byScope = (table[region] ??= {});
  const byTier = (byScope[scope] ??= {});
  (byTier[tier] ??= {})[kind] ??= usd;
}

for (const p of prices) {
  const m = modelFor(p.model, p.provider);
  // Long-context SKUs replace the base price above the threshold, so they live in their own table instead of colliding with the base price.
  const table = p.longContext ? ((m.longContext ??= { pricing: {} }).pricing) : m.pricing;
  setPrice(table, p.region, p.scope, p.tier, p.kind, p.usdPer1M);
}
for (const x of overrides.extraModels ?? []) {
  const m = modelFor(x.name, x.provider);
  for (const [region, scopes] of Object.entries(x.pricing))
    for (const [scope, kinds] of Object.entries(scopes))
      for (const [kind, usd] of Object.entries(kinds)) setPrice(m.pricing, region, scope as Scope, 'standard', kind as TokenKind, usd);
}

// ---- AWS model cards: exact per-region availability, context, lifecycle, and prices for models the Price List does not list yet.
const cardsById = new Map<string, CardRecord>();
for (const c of cards) for (const id of c.modelIds) cardsById.set(id.toLowerCase(), c);
const cardsByTitle = new Map(cards.map((c) => [loose(c.title), c]));
const ctxFor = (m: Model) => aliases[m.name] ? contextById.get(aliases[m.name]) : contextByName.get(norm(m.name)) || contextByLoose.get(loose(m.name)) || contextById.get(m.name);
function cardFor(m: Model, ctx?: ContextRecord): CardRecord | undefined {
  // Ids are unambiguous; fall back to the title only when no id matches.
  return cardsById.get((ctx?.bedrockId ?? '').toLowerCase()) || cardsById.get((aliases[m.name] ?? '').toLowerCase()) || cardsById.get(m.name.toLowerCase()) || cardsByTitle.get(loose(m.name));
}
const cardOf = new Map<Model, CardRecord>();
const usedCards = new Set<CardRecord>();
for (const m of models.values()) {
  const c = cardFor(m, ctxFor(m));
  if (c) {
    cardOf.set(m, c);
    usedCards.add(c);
  }
}

/** A model the Price List lacks: build it from the card's commercial price tables (standard tier, text tokens). */
function modelFromCard(c: CardRecord): Model | undefined {
  const base = c.prices.filter((x) => !x.long && x.input !== undefined && x.output !== undefined);
  if (!base.length) return undefined;
  const m = modelFor(c.title, c.vendor);
  m.priceSource = 'model-card';
  const pick = (scope: 'regional' | 'global', long: boolean) => c.prices.find((x) => x.scope === scope && x.long === long);
  for (const [region, av] of Object.entries(c.availability)) {
    if (region.startsWith('us-gov')) continue; // GovCloud has its own price list
    const flags = (av.runtime ?? '') + (av.mantle ?? '');
    const scopes: ['regional' | 'global', boolean][] = [['regional', /[ig]/.test(flags)], ['global', flags.includes('G')]];
    for (const [scope, on] of scopes) {
      if (!on) continue;
      for (const long of [false, true]) {
        const row = pick(scope, long);
        if (!row) continue;
        const table = long ? (m.longContext ??= { pricing: {}, thresholdTokens: row.thresholdTokens }).pricing : m.pricing;
        for (const [kind, v] of [['input', row.input], ['output', row.output], ['cacheRead', row.cacheRead], ['cacheWrite', row.cacheWrite]] as const) {
          if (v !== undefined) setPrice(table, region, scope, 'standard', kind, v);
        }
      }
    }
  }
  return m;
}
const unusedCards = cards.filter((c) => !usedCards.has(c));
const addedFromCards: string[] = [];
for (const c of unusedCards) {
  const m = modelFromCard(c);
  if (m) {
    cardOf.set(m, c);
    usedCards.add(c);
    addedFromCards.push(c.title);
  }
}

const unmatched: string[] = [];
const contextDiffs: string[] = [];
for (const m of models.values()) {
  m.regions = Object.keys(m.pricing).sort();
  const ctx = ctxFor(m);
  const card = cardOf.get(m);
  if (ctx) {
    m.contextWindow = ctx.context;
    m.maxOutput = ctx.maxOutput;
    m.openWeights = ctx.openWeights;
    m.reasoning = ctx.reasoning;
    m.modes = ctx.modes;
    m.geoPrefixes = ctx.geoPrefixes;
    if (m.longContext) m.longContext.thresholdTokens ??= ctx.longContextThreshold;
  } else if (!card) unmatched.push(m.name);
  if (card) {
    // The model card is the authority for limits and availability; models.dev stays as the fallback.
    if (card.contextWindow && m.contextWindow && card.contextWindow !== m.contextWindow) contextDiffs.push(`${m.name}: card=${card.contextWindow} models.dev=${m.contextWindow}`);
    m.contextWindow = card.contextWindow ?? m.contextWindow;
    m.maxOutput = card.maxOutput ?? m.maxOutput;
    if (Object.keys(card.availability).length) m.availability = card.availability;
    if (card.geoPrefixes.length) m.geoPrefixes = card.geoPrefixes;
    const longRow = card.prices.find((x) => x.long && x.thresholdTokens);
    if (m.longContext && longRow) m.longContext.thresholdTokens = longRow.thresholdTokens;
    m.card = { url: `https://docs.aws.amazon.com/bedrock/latest/userguide/${card.slug}.html`, lifecycle: card.lifecycle, launchDate: card.launchDate, eolDate: /\d{4}/.test(card.eolDate ?? '') ? card.eolDate : undefined };
  }
}

// Artificial Analysis slugs are kebab-case and list effort/reasoning variants of one model separately ("kimi-k3", "kimi-k3-low", "claude-opus-5-xhigh").
// Only these suffixes count as variants: "glm-5-turbo" or "claude-opus-5-5" are different models and must not match "glm-5" / "claude-opus-5".
const VARIANT = /^(low|medium|high|xhigh|max|reasoning|non-reasoning|thinking|adaptive|instruct)(-(low|medium|high|xhigh|max|reasoning|non-reasoning|thinking|adaptive|instruct))*$/;
const aaSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/^[a-z0-9-]+\./, '') // raw ids such as "openai.gpt-5.6-terra"
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const benchmarkBySlug = new Map(benchmarks.map((b) => [b.slug, b]));

function findBenchmark(name: string): BenchmarkRecord | undefined {
  const aliased = benchmarkAliases[name];
  if (aliased) return benchmarkBySlug.get(aliased);
  const base = aaSlug(name);
  const bases = [base, base.replace(/^(openai|google|meta|writer)-/, '')];
  for (const b of bases) if (benchmarkBySlug.has(b)) return benchmarkBySlug.get(b);
  // No default entry: take the strongest variant of the same model.
  for (const b of bases) {
    const variants = benchmarks.filter((x) => x.slug.startsWith(b + '-') && VARIANT.test(x.slug.slice(b.length + 1)));
    if (variants.length) return variants.reduce((best, x) => ((x.scores.intelligenceIndex ?? -1) > (best.scores.intelligenceIndex ?? -1) ? x : best));
  }
  return undefined;
}
const noBenchmark: string[] = [];
const tokensOf = (s: string) => new Set(s.toLowerCase().replace(/[()\-_:]/g, ' ').split(/\s+/).filter((t) => t && !NOISE.has(t)));
// For an unmatched model, the closest Artificial Analysis names by token overlap, so aliases can be written without seeing the raw feed.
function nearestBenchmarks(name: string): string {
  const a = tokensOf(name);
  return benchmarks
    .map((b) => {
      const t = tokensOf(b.name);
      const shared = [...a].filter((x) => t.has(x)).length;
      return { b, score: shared / (a.size + t.size - shared) };
    })
    .filter((x) => x.score >= 0.4)
    .sort((x, y) => y.score - x.score)
    .slice(0, 2)
    .map((x) => `${x.b.slug}`)
    .join(' | ');
}
if (benchmarks.length) {
  for (const m of models.values()) {
    const b = findBenchmark(m.name);
    if (b) {
      m.benchmarks = b.scores;
      m.benchmarkSource = { name: b.name, slug: b.slug };
    } else noBenchmark.push(`${m.name} -> ${nearestBenchmarks(m.name) || '?'}`);
  }
}

// Cross-check the Price List against models.dev's list prices (us-east-1 vs bare/us. ids). A mismatch means a parsing bug or a stale source.
const mismatches: string[] = [];
for (const m of models.values()) {
  const ctx = contextByName.get(norm(m.name)) || contextByLoose.get(loose(m.name));
  if (!ctx) continue;
  for (const scope of ['regional', 'global'] as const) {
    const theirs = ctx.cost[scope];
    const ours = m.pricing['us-east-1']?.[scope]?.standard;
    if (!theirs || !ours) continue;
    for (const [kind, t] of [['input', theirs.input], ['output', theirs.output], ['cacheRead', theirs.cacheRead]] as const) {
      const o = ours[kind];
      if (t !== undefined && o !== undefined && Math.abs(o - t) / t > 0.01) mismatches.push(`${m.name} ${scope} ${kind}: aws=${o} models.dev=${t}`);
    }
  }
}

// Some Price List entries are named by raw Bedrock id ("google.gemma-4-e2b"); show models.dev's display name instead (the id/slug stays as is).
const taken = new Set([...models.values()].map((m) => m.name));
for (const m of models.values()) {
  if (!/^[a-z0-9-]+\.[a-z0-9]/i.test(m.name) || /\s/.test(m.name)) continue;
  const ctx = contextById.get(m.name);
  const pretty = ctx?.name.replace(/\s+IT$/, '');
  if (pretty && !taken.has(pretty)) {
    taken.add(pretty);
    m.name = pretty;
  }
}

// Embedding/image/speech models have no token prices in the table; keep only models with at least one text-token price.
const out = [...models.values()].filter((m) => m.regions.length > 0).sort((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name));
await mkdir('public/data', { recursive: true });
await writeFile('public/data/models.json', JSON.stringify({ generatedAt: new Date().toISOString(), models: out }));

const withCtx = out.filter((m) => m.contextWindow).length;
const withCache = out.filter((m) => m.regions.some((r) => Object.values(m.pricing[r]).some((s) => s?.standard?.cacheRead !== undefined))).length;
const report = [
  `models: ${out.length}, with context: ${withCtx}, with cache read price: ${withCache}`,
  `model cards: ${cards.length} loaded, ${cardOf.size} models matched, ${addedFromCards.length} models added from cards (${addedFromCards.join(', ')}); cards unused: ${cards.filter((c) => !usedCards.has(c)).map((c) => c.title).join(', ') || 'none'}`,
  `card vs models.dev context differences (${contextDiffs.length}): ${contextDiffs.join('; ')}`,
  `no context match (${unmatched.length}): ${unmatched.join(', ')}`,
  `price cross-check vs models.dev (${mismatches.length} mismatches)${mismatches.length ? ':\n  ' + mismatches.join('\n  ') : ''}`,
  benchmarks.length ? `no benchmark match (${noBenchmark.length}), model -> closest AA slugs:\n  ${noBenchmark.join('\n  ')}` : 'benchmarks: skipped (no AA_API_KEY)',
].join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '```\n' + report + '\n```\n');
