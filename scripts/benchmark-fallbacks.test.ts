import { describe, expect, it } from 'vitest';
import { applyBenchmarkFallbacks, type BenchmarkFallback } from './benchmark-fallbacks.ts';
import type { Model } from '../src/types.ts';

const fallback: BenchmarkFallback = {
  modelId: 'gpt-6.1-sol', name: 'GPT-6.1 Sol (Max)', slug: 'gpt-6-1-sol',
  source: 'https://artificialanalysis.ai/models/gpt-6-1-sol', verifiedAt: '2026-10-11',
  scores: { intelligenceIndex: 51.8332597011541, outputTokensPerSecond: 62.6513581758851 },
};
const sol = (): Model => ({ id: 'gpt-6.1-sol', name: 'GPT-6.1 Sol', provider: 'OpenAI', pricing: {}, regions: [], firstSeen: '2026-10-08' });

describe('public-page benchmark fallbacks', () => {
  it('restores a missing measurement with exact source and verification date without inferring missing metrics', () => {
    const m = sol();
    expect(applyBenchmarkFallbacks([m], [fallback])).toEqual(['GPT-6.1 Sol']);
    expect(m.benchmarks?.intelligenceIndex).toBe(51.8332597011541);
    expect(m.benchmarks?.codingIndex).toBeUndefined();
    expect(m.benchmarkSource).toMatchObject({ url: fallback.source, verifiedAt: fallback.verifiedAt, kind: 'public-page' });
  });
  it('preserves API measurements and their source when they become available', () => {
    const m = { ...sol(), benchmarks: { intelligenceIndex: 55 }, benchmarkSource: { name: 'API measurement', slug: 'gpt-6-1-sol' } };
    expect(applyBenchmarkFallbacks([m], [fallback])).toEqual(['GPT-6.1 Sol']);
    expect(m.benchmarks.intelligenceIndex).toBe(55);
    expect(m.benchmarkSource.name).toBe('API measurement');
  });
  it('fills missing fields in a partial API record for the same measured variant', () => {
    const m: Model = { ...sol(), benchmarks: { hle: 0.53 }, benchmarkSource: { name: fallback.name, slug: fallback.slug } };
    expect(applyBenchmarkFallbacks([m], [fallback])).toEqual(['GPT-6.1 Sol']);
    expect(m.benchmarks).toMatchObject({ hle: 0.53, intelligenceIndex: fallback.scores.intelligenceIndex });
    expect(m.benchmarkSource?.kind).toBeUndefined();
    expect(m.benchmarkSources?.intelligenceIndex).toMatchObject({ url: fallback.source, verifiedAt: fallback.verifiedAt });
  });
  it('refreshes historical fields with a newer verified page and preserves provenance for fields the page does not publish', () => {
    const m: Model = { ...sol(), benchmarks: { intelligenceIndex: 50, codingIndex: 78, outputTokensPerSecond: 0 },
      benchmarkSource: { name: fallback.name, slug: fallback.slug, snapshotAt: '2026-10-10T00:00:00Z' } };
    applyBenchmarkFallbacks([m], [fallback]);
    expect(m.benchmarks).toMatchObject({ intelligenceIndex: fallback.scores.intelligenceIndex, codingIndex: 78, outputTokensPerSecond: fallback.scores.outputTokensPerSecond });
    expect(m.benchmarkSource?.snapshotAt).toBe('2026-10-10T00:00:00Z');
    expect(m.benchmarkSources?.intelligenceIndex?.kind).toBe('public-page');
    expect(m.benchmarkSources?.codingIndex).toBeUndefined();
  });
  it('does not combine scores from different effort variants', () => {
    const m: Model = { ...sol(), benchmarks: { hle: 0.4 }, benchmarkSource: { name: 'GPT-6.1 Sol (Low)', slug: 'gpt-6-1-sol-low' } };
    expect(applyBenchmarkFallbacks([m], [fallback])).toEqual([]);
    expect(m.benchmarks?.intelligenceIndex).toBeUndefined();
  });
  it('does not replace a newer retained snapshot with an older public page', () => {
    const m: Model = { ...sol(), benchmarks: { intelligenceIndex: 58 },
      benchmarkSource: { name: fallback.name, slug: fallback.slug, snapshotAt: '2026-10-12T00:00:00Z' } };
    applyBenchmarkFallbacks([m], [fallback]);
    expect(m.benchmarks?.intelligenceIndex).toBe(58);
  });
  it('does not manufacture unrelated models or invalid scores', () => {
    const other = { ...sol(), id: 'other' };
    expect(applyBenchmarkFallbacks([other], [fallback])).toEqual([]);
    const m = sol();
    expect(applyBenchmarkFallbacks([m], [{ ...fallback, scores: { intelligenceIndex: NaN, outputTokensPerSecond: Infinity } }])).toEqual([]);
    expect(m.benchmarks).toBeUndefined();
  });
  it('rejects unsupported source URLs instead of disguising vendor claims as measurements', () => {
    expect(() => applyBenchmarkFallbacks([sol()], [{ ...fallback, source: 'https://example.com/' }])).toThrow('Invalid benchmark fallback source');
  });
});
