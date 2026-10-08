import { mkdir, writeFile } from 'node:fs/promises';

interface ModelsDevModel {
  id: string;
  name: string;
  family?: string;
  release_date?: string;
  reasoning?: boolean;
  open_weights?: boolean;
  modalities?: { input: string[]; output: string[] };
  limit?: { context?: number; output?: number };
  cost?: { input?: number; output?: number; cache_read?: number; cache_write?: number; tiers?: { tier?: { type?: string; size?: number } }[] };
}

export interface ContextRecord {
  /** Bedrock model id without the CRIS profile prefix, e.g. "moonshotai.kimi-k3". */
  bedrockId: string;
  name: string;
  family?: string;
  releaseDate?: string;
  reasoning?: boolean;
  openWeights?: boolean;
  inputModalities?: string[];
  context?: number;
  maxOutput?: number;
  /** Which invocation modes have a profile id: bare id = in-region, "global." = Global CRIS, any other prefix = geo CRIS. */
  modes: ('in-region' | 'geo' | 'global')[];
  geoPrefixes: string[];
  /** Prompt size above which the long-context price applies. */
  longContextThreshold?: number;
  /** models.dev's own list prices, kept only to cross-check the Price List. regional = bare id or the us. profile. */
  cost: Partial<Record<'regional' | 'global', { input?: number; output?: number; cacheRead?: number }>>;
}

const CRIS_PREFIX = /^(us|eu|apac|jp|au|ca|in|global|us-gov)\./;

const res = await fetch('https://models.dev/api.json');
if (!res.ok) throw new Error(`models.dev -> ${res.status}`);
const bedrock = ((await res.json()) as { 'amazon-bedrock'?: { models: Record<string, ModelsDevModel> } })['amazon-bedrock'];
if (!bedrock) throw new Error('models.dev has no amazon-bedrock provider');

const byId = new Map<string, ContextRecord>();
for (const m of Object.values(bedrock.models)) {
  const prefix = CRIS_PREFIX.exec(m.id)?.[1];
  const bedrockId = m.id.replace(CRIS_PREFIX, '');
  const mode = prefix === undefined ? 'in-region' : prefix === 'global' ? 'global' : 'geo';
  const threshold = m.cost?.tiers?.find((t) => t.tier?.type === 'context')?.tier?.size;
  let rec = byId.get(bedrockId);
  if (!rec) {
    rec = { bedrockId, name: m.name, modes: [], geoPrefixes: [], cost: {} };
    byId.set(bedrockId, rec);
  }
  if (!rec.modes.includes(mode)) rec.modes.push(mode);
  if (mode === 'geo' && prefix && !rec.geoPrefixes.includes(prefix)) rec.geoPrefixes.push(prefix);
  // The bare id and its CRIS-prefixed variants describe the same model; the bare one wins for descriptive fields.
  if (rec.context === undefined || prefix === undefined) {
    Object.assign(rec, {
      name: m.name,
      family: m.family,
      releaseDate: m.release_date,
      reasoning: m.reasoning,
      openWeights: m.open_weights,
      inputModalities: m.modalities?.input,
      context: m.limit?.context,
      maxOutput: m.limit?.output,
    });
  }
  rec.longContextThreshold ??= threshold;
  const slot = mode === 'global' ? 'global' : prefix === undefined || prefix === 'us' ? 'regional' : undefined;
  // For Claude the bare id lists the global price while the us. profile carries the regional one, so us. wins for the regional slot.
  if (slot && m.cost && (slot === 'global' ? !rec.cost.global : prefix === 'us' || !rec.cost.regional))
    rec.cost[slot] = { input: m.cost.input, output: m.cost.output, cacheRead: m.cost.cache_read };
}
await mkdir('data/raw', { recursive: true });
await writeFile('data/raw/context.json', JSON.stringify([...byId.values()]));
console.log(`models.dev: ${byId.size} Bedrock models with context data`);
