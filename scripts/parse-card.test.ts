import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseCard, parseTokens } from './parse-card.ts';

const card = (name: string) => parseCard(name, readFileSync(new URL(`./fixtures/${name}.md`, import.meta.url), 'utf8'));

describe('parseTokens', () => {
  it.each([['1M tokens', 1_000_000], ['131,072 tokens', 131072], ['272K', 272000], ['1,050,000 tokens', 1_050_000], ['10M', 10_000_000]])('%s', (s, n) => {
    expect(parseTokens(s)).toBe(n);
  });
});

describe('GPT-6.1 Sol card (labeled endpoints, icon cells)', () => {
  const c = card('card-gpt-6-1-sol');
  it('reads the details', () => {
    expect(c).toMatchObject({ title: 'GPT-6.1 Sol', vendor: 'OpenAI', contextWindow: 1_000_000, maxOutput: 131072, lifecycle: 'Active' });
    expect(c.modelIds).toEqual(['openai.gpt-6.1-sol']);
  });
  it('puts in-region only on the mantle endpoint in us-east-1', () => {
    expect(c.availability['us-east-1']).toEqual({ runtime: 'gG', mantle: 'i' });
    expect(c.availability['us-east-2']).toEqual({ runtime: 'gG' });
  });
  it('reads geo prefixes and source regions', () => {
    expect(c.geoPrefixes).toEqual(['us']);
    expect(c.geoSources.us).toContain('ca-west-1');
  });
  it('reads short and long context prices with the threshold from the heading', () => {
    const us = c.prices.find((p) => p.label.startsWith('US CRIS') && !p.long)!;
    expect(us).toMatchObject({ scope: 'regional', input: 2.2, output: 11, cacheRead: 0.11, cacheWrite: 2.75, thresholdTokens: 272000 });
    const longGlobal = c.prices.find((p) => p.scope === 'global' && p.long)!;
    expect(longGlobal).toMatchObject({ input: 4, output: 15, thresholdTokens: 272000 });
  });
});

describe('Llama 3.3 70B card (older unlabeled table)', () => {
  const c = card('card-llama-3-3-70b');
  it('has in-region only in us-east-2', () => {
    expect(c.availability['us-east-2']).toEqual({ runtime: 'ig' });
    expect(c.availability['us-east-1']).toEqual({ runtime: 'g' });
  });
  it('keeps the versioned model id', () => {
    expect(c.modelIds).toEqual(['meta.llama3-3-70b-instruct-v1:0']);
  });
});

describe('GPT-6 Sol card (alternate headings, text cells)', () => {
  const c = card('card-gpt-6-sol');
  it('parses "Supported Regions" with Supported/Not supported text', () => {
    expect(c.availability['us-east-1']).toEqual({ runtime: 'gG', mantle: 'i' });
    expect(c.availability['eu-west-1']).toEqual({ runtime: 'G' });
    expect(c.contextWindow).toBe(1_050_000);
  });
});
