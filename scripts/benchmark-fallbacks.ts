import type { BenchmarkScores, Model } from '../src/types.ts';

export interface BenchmarkFallback {
  modelId: string;
  name: string;
  slug: string;
  source: string;
  verifiedAt: string;
  scores: BenchmarkScores;
}

/** Verified pages fill API gaps and refresh historical snapshots. Fresh API values always take priority. */
export function applyBenchmarkFallbacks(models: Iterable<Model>, fallbacks: BenchmarkFallback[]): string[] {
  const byId = new Map(fallbacks.map((entry) => [entry.modelId, entry]));
  const applied: string[] = [];
  for (const model of models) {
    const fallback = byId.get(model.id);
    if (!fallback || (model.benchmarkSource && model.benchmarkSource.slug !== fallback.slug)) continue;
    if (!/^https:\/\/artificialanalysis\.ai\/models\/[a-z0-9-]+$/.test(fallback.source) || !/^\d{4}-\d{2}-\d{2}$/.test(fallback.verifiedAt)) throw new Error(`Invalid benchmark fallback source: ${model.id}`);
    const scores = Object.entries(fallback.scores).filter(([key, value]) => typeof value === 'number' && Number.isFinite(value) && value >= 0 &&
      (!['outputTokensPerSecond', 'timeToFirstTokenSeconds'].includes(key) || value > 0)) as [keyof BenchmarkScores, number][];
    if (!scores.length) continue;
    const source = { name: fallback.name, slug: fallback.slug, url: fallback.source, verifiedAt: fallback.verifiedAt, kind: 'public-page' as const };
    if (!model.benchmarks) {
      model.benchmarks = Object.fromEntries(scores);
      model.benchmarkSource = source;
      applied.push(model.name);
      continue;
    }
    let changed = false;
    for (const [key, value] of scores) {
      const existing = model.benchmarks[key];
      const existingSource = model.benchmarkSources?.[key] ?? model.benchmarkSource;
      const older = existingSource?.snapshotAt ? existingSource.snapshotAt.slice(0, 10) <= fallback.verifiedAt :
        existingSource?.kind === 'public-page' && !!existingSource.verifiedAt && existingSource.verifiedAt < fallback.verifiedAt;
      const absent = existing === undefined || !Number.isFinite(existing) ||
        (['outputTokensPerSecond', 'timeToFirstTokenSeconds'].includes(key) && existing <= 0);
      if (!absent && !older) continue;
      model.benchmarks[key] = value;
      (model.benchmarkSources ??= {})[key] = source;
      changed = true;
    }
    if (changed) applied.push(model.name);
  }
  return applied;
}
