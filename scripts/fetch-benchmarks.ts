import { mkdir, rm, writeFile } from 'node:fs/promises';
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
  performance?: {
    median_output_tokens_per_second?: number | null;
    median_time_to_first_token_seconds?: number | null;
  };
}

interface AaResponse {
  data: AaModel[];
  pagination: { page: number; total_pages: number; has_more: boolean };
}

const key = process.env.AA_API_KEY;
if (!key) {
  await rm('data/raw/benchmarks.json', { force: true });
  console.log('AA_API_KEY not set: clearing stale benchmark cache; retaining previously sourced measurements during the build');
  process.exit(0);
}

// The legacy /data endpoint was retired on 2026-11-04.
// Free accepts any valid API key. Its 100 requests/day quota covers one call per
// 200-model page; attribution to artificialanalysis.ai is required.
// https://artificialanalysis.ai/data-api/docs/reference
const data: AaModel[] = [];
for (let page = 1; ; page++) {
  const url = new URL('https://artificialanalysis.ai/api/v2/language/models/free');
  url.searchParams.set('page', String(page));
  const res = await fetch(url, { headers: { 'x-api-key': key } });
  if (!res.ok) throw new Error(`Artificial Analysis -> ${res.status} (page ${page})`);
  const body = (await res.json()) as AaResponse;
  const pagination = body?.pagination;
  if (!Array.isArray(body?.data) || !pagination
    || pagination.page !== page || !Number.isInteger(pagination.total_pages)
    || pagination.total_pages < page
    || pagination.has_more !== (page < pagination.total_pages)) {
    throw new Error(`Invalid Artificial Analysis response (page ${page})`);
  }
  data.push(...body.data);
  if (!pagination.has_more) break;
}

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
      outputTokensPerSecond: num(m.performance?.median_output_tokens_per_second),
      timeToFirstTokenSeconds: num(m.performance?.median_time_to_first_token_seconds),
    },
  };
});
await mkdir('data/raw', { recursive: true });
await writeFile('data/raw/benchmarks.json', JSON.stringify(records));
console.log(`Artificial Analysis: ${records.length} models`);
