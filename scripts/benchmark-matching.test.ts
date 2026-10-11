import { describe, expect, it } from 'vitest';
import { findBenchmark } from './benchmark-matching.ts';
import type { BenchmarkRecord } from './fetch-benchmarks.ts';

const record = (slug: string, score = 50): BenchmarkRecord => ({ id: slug, slug, name: slug, creator: 'OpenAI', scores: { intelligenceIndex: score } });

describe('benchmark model identity', () => {
  it.each(['GPT-6.1 Sol', 'gpt-6.1-sol', 'openai.gpt-6.1-sol', 'OpenAI GPT-6.1 Sol'])('matches the decimal model version in %s', (name) => {
    const records = [record('gpt-6-sol', 47.6), record('gpt-6-1-sol', 51.8)];
    expect(findBenchmark(name, records)?.slug).toBe('gpt-6-1-sol');
  });
  it('does not substitute the previous model release or a numbered sibling', () => {
    expect(findBenchmark('GPT-6.1 Sol', [record('gpt-6-sol')])).toBeUndefined();
    expect(findBenchmark('GPT-6 Sol', [record('gpt-6-sol-1')])).toBeUndefined();
  });
  it('prefers the exact measured entry over effort variants', () => {
    expect(findBenchmark('GPT-6.1 Sol', [record('gpt-6-1-sol', 50), record('gpt-6-1-sol-max', 55)])?.slug).toBe('gpt-6-1-sol');
  });
  it('uses the strongest actual effort variant only when an exact entry is absent', () => {
    expect(findBenchmark('GPT-6.1 Sol', [record('gpt-6-1-sol-high', 45), record('gpt-6-1-sol-max', 55), record('gpt-6-1-sol-turbo', 60)])?.slug).toBe('gpt-6-1-sol-max');
  });
});
