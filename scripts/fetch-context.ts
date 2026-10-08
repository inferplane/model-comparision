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
}

const CRIS_PREFIX = /^(us|eu|apac|jp|au|ca|in|global|us-gov)\./;

const res = await fetch('https://models.dev/api.json');
if (!res.ok) throw new Error(`models.dev -> ${res.status}`);
const bedrock = ((await res.json()) as { 'amazon-bedrock'?: { models: Record<string, ModelsDevModel> } })['amazon-bedrock'];
if (!bedrock) throw new Error('models.dev has no amazon-bedrock provider');

const byId = new Map<string, ContextRecord>();
for (const m of Object.values(bedrock.models)) {
  const bedrockId = m.id.replace(CRIS_PREFIX, '');
  const prev = byId.get(bedrockId);
  // The bare id and its CRIS-prefixed variants describe the same model; keep the bare one when present.
  if (prev && CRIS_PREFIX.test(m.id)) continue;
  byId.set(bedrockId, {
    bedrockId,
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
await mkdir('data/raw', { recursive: true });
await writeFile('data/raw/context.json', JSON.stringify([...byId.values()]));
console.log(`models.dev: ${byId.size} Bedrock models with context data`);
