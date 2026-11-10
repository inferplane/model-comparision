import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
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
  it('matches the November 2026 additions with the checked-in aliases', () => {
    const { benchmarkAliases } = parse(readFileSync('data/aliases.yaml', 'utf8')) as { benchmarkAliases: Record<string, string> };
    const records = [record('kimi-k3', 40), record('kimi-k3-1-pro', 46.5), record('claude-fable-5-1', 53.4), record('claude-fable-5-2', 64.6)];
    // AA calls it "Kimi K3.1 Pro"; "pro" is a product name, not an effort variant, so only the alias links it.
    expect(findBenchmark('Kimi K3.1', records)).toBeUndefined();
    expect(findBenchmark('Kimi K3.1', records, benchmarkAliases)?.slug).toBe('kimi-k3-1-pro');
    expect(findBenchmark('Claude Fable 5.2', records, benchmarkAliases)?.slug).toBe('claude-fable-5-2');
  });
});
