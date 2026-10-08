import { mkdir, writeFile } from 'node:fs/promises';
import type { BenchmarkScores } from '../src/types.ts';

export interface BenchmarkRecord {
  id: string;
  name: string;
  slug: string;
  creator: string;
  scores: BenchmarkScores;
}

interface AaModel {
  id: string;
  name: string;
  slug: string;
  model_creator?: { name?: string };
  evaluations?: Record<string, number | null | undefined>;
  median_output_tokens_per_second?: number | null;
  median_time_to_first_token_seconds?: number | null;
}

const key = process.env.AA_API_KEY;
if (!key) {
  console.log('AA_API_KEY not set: skipping benchmarks (the site renders without them)');
  process.exit(0);
}

// Documented limit is 1,000 requests/day and attribution to artificialanalysis.ai is required; one call per data build is well inside it.
const res = await fetch('https://artificialanalysis.ai/api/v2/data/llms/models', { headers: { 'x-api-key': key } });
if (!res.ok) throw new Error(`Artificial Analysis -> ${res.status}`);
const { data } = (await res.json()) as { data: AaModel[] };

const num = (v: number | null | undefined) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const records: BenchmarkRecord[] = data.map((m) => {
  const e = m.evaluations ?? {};
  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    creator: m.model_creator?.name ?? '',
    scores: {
      intelligenceIndex: num(e.artificial_analysis_intelligence_index),
      codingIndex: num(e.artificial_analysis_coding_index),
      mathIndex: num(e.artificial_analysis_math_index),
      mmluPro: num(e.mmlu_pro),
      gpqa: num(e.gpqa),
      hle: num(e.hle),
      liveCodeBench: num(e.livecodebench),
      scicode: num(e.scicode),
      math500: num(e.math_500),
      aime: num(e.aime),
      outputTokensPerSecond: num(m.median_output_tokens_per_second),
      timeToFirstTokenSeconds: num(m.median_time_to_first_token_seconds),
    },
  };
});
await mkdir('data/raw', { recursive: true });
await writeFile('data/raw/benchmarks.json', JSON.stringify(records));
console.log(`Artificial Analysis: ${records.length} models`);
