import type { BenchmarkRecord } from './fetch-benchmarks.ts';

// An effort suffix is a variant; a release number or "turbo" is a different model.
const VARIANT = /^(low|medium|high|xhigh|max|reasoning|non-reasoning|thinking|adaptive|instruct)(-(low|medium|high|xhigh|max|reasoning|non-reasoning|thinking|adaptive|instruct))*$/;
export const benchmarkSlug = (name: string) => name.toLowerCase()
  // Namespace IDs have a letter after the dot. Preserve decimal versions such as "GPT-6.1 Sol".
  .replace(/^[a-z0-9-]+\.(?=[a-z])/, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export function findBenchmark(name: string, records: BenchmarkRecord[], aliases: Record<string, string> = {}): BenchmarkRecord | undefined {
  const bySlug = new Map(records.map((record) => [record.slug, record]));
  const aliased = aliases[name];
  if (aliased) return bySlug.get(aliased);
  const base = benchmarkSlug(name);
  const bases = [base, base.replace(/^(openai|google|meta|writer)-/, '')];
  for (const key of bases) if (bySlug.has(key)) return bySlug.get(key);
  for (const key of bases) {
    const variants = records.filter((record) => record.slug.startsWith(`${key}-`) && VARIANT.test(record.slug.slice(key.length + 1)));
    if (variants.length) return variants.reduce((best, record) => (record.scores.intelligenceIndex ?? -1) > (best.scores.intelligenceIndex ?? -1) ? record : best);
  }
  return undefined;
}
