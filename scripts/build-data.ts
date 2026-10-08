import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { parse } from 'yaml';
import type { Model, PriceEntry, Scope, Tier, TokenKind } from '../src/types.ts';
import type { BenchmarkRecord } from './fetch-benchmarks.ts';
import type { ContextRecord } from './fetch-context.ts';
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
const NOISE = new Set(['meta', 'nvidia', 'openai', 'deepseek', 'google', 'writer', 'instruct', 'it', 'v1', 'us', 'india']);
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
function setPrice(m: Model, region: string, scope: Scope, tier: Tier, kind: TokenKind, usd: number) {
  const byScope = (m.pricing[region] ??= {});
  const byTier = (byScope[scope] ??= {});
  (byTier[tier] ??= {})[kind] ??= usd;
}

for (const p of prices) {
  const m = modelFor(p.model, p.provider);
  setPrice(m, p.region, p.scope, p.tier, p.kind, p.usdPer1M);
}
for (const x of overrides.extraModels ?? []) {
  const m = modelFor(x.name, x.provider);
  for (const [region, scopes] of Object.entries(x.pricing))
    for (const [scope, kinds] of Object.entries(scopes))
      for (const [kind, usd] of Object.entries(kinds)) setPrice(m, region, scope as Scope, 'standard', kind as TokenKind, usd);
}

const unmatched: string[] = [];
for (const m of models.values()) {
  m.regions = Object.keys(m.pricing).sort();
  const aliased = aliases[m.name];
  // Some Price List names are raw Bedrock ids ("google.gemma-4-e2b"), so try the id lookup too.
  const ctx =
    (aliased && contextById.get(aliased)) || contextByName.get(norm(m.name)) || contextByLoose.get(loose(m.name)) || contextById.get(m.name);
  if (ctx) {
    m.contextWindow = ctx.context;
    m.maxOutput = ctx.maxOutput;
  } else unmatched.push(m.name);
}

// Artificial Analysis lists reasoning/non-reasoning variants separately; when several share a name, keep the highest intelligence index.
const benchmarkByLoose = new Map<string, BenchmarkRecord>();
for (const b of benchmarks) {
  const k = loose(b.name);
  const prev = benchmarkByLoose.get(k);
  if (!prev || (b.scores.intelligenceIndex ?? -1) > (prev.scores.intelligenceIndex ?? -1)) benchmarkByLoose.set(k, b);
}
const benchmarkBySlug = new Map(benchmarks.map((b) => [b.slug, b]));
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
    const b = (benchmarkAliases[m.name] && benchmarkBySlug.get(benchmarkAliases[m.name])) || benchmarkByLoose.get(loose(m.name));
    if (b) m.benchmarks = b.scores;
    else noBenchmark.push(`${m.name} -> ${nearestBenchmarks(m.name) || '?'}`);
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
  `no context match (${unmatched.length}): ${unmatched.join(', ')}`,
  benchmarks.length ? `no benchmark match (${noBenchmark.length}), model -> closest AA slugs:\n  ${noBenchmark.join('\n  ')}` : 'benchmarks: skipped (no AA_API_KEY)',
].join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '```\n' + report + '\n```\n');
