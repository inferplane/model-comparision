import type { BenchmarkScores, Model } from '../src/types.ts';

export interface BenchmarkFallback {
  modelId: string;
  name: string;
  slug: string;
  source: string;
  verifiedAt: string;
  scores: BenchmarkScores;
}

/** Public-page measurements fill a missing API match only; API measurements always take priority. */
export function applyBenchmarkFallbacks(models: Iterable<Model>, fallbacks: BenchmarkFallback[]): string[] {
  const byId = new Map(fallbacks.map((entry) => [entry.modelId, entry]));
  const applied: string[] = [];
  for (const model of models) {
    const fallback = byId.get(model.id);
    if (model.benchmarks || !fallback) continue;
    if (!/^https:\/\/artificialanalysis\.ai\/models\/[a-z0-9-]+$/.test(fallback.source) || !/^\d{4}-\d{2}-\d{2}$/.test(fallback.verifiedAt)) throw new Error(`Invalid benchmark fallback source: ${model.id}`);
    const scores = Object.entries(fallback.scores).filter(([, value]) => typeof value === 'number' && Number.isFinite(value) && value >= 0);
    if (!scores.length) continue;
    model.benchmarks = Object.fromEntries(scores);
    model.benchmarkSource = { name: fallback.name, slug: fallback.slug, url: fallback.source, verifiedAt: fallback.verifiedAt, kind: 'public-page' };
    applied.push(model.name);
  }
  return applied;
}
