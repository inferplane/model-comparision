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

describe('user-supplied GPT-6.1 Terra card excerpt', () => {
  const c = parseCard('model-card-openai-gpt-6-1-terra', readFileSync(new URL('../data/cards/model-card-openai-gpt-6-1-terra.md', import.meta.url), 'utf8'));
  it('retains all six short/long-context price rows and exact limits', () => {
    expect(c).toMatchObject({ title: 'GPT-6.1 Terra', vendor: 'OpenAI', modelIds: ['openai.gpt-6.1-terra'], contextWindow: 1_050_000, maxOutput: 128_000, launchDate: 'October 26, 2026', eolDate: 'N/A' });
    expect(c.prices).toHaveLength(6);
    expect(c.prices.every((p) => p.thresholdTokens === 272_000)).toBe(true);
    expect(c.prices.find((p) => p.label === 'Geo CRIS' && !p.long)).toMatchObject({ input: 1.1, output: 5.5, cacheWrite: 1.375, cacheRead: 0.055 });
    expect(c.prices.find((p) => p.scope === 'global' && p.long)).toMatchObject({ input: 2, output: 7.5, cacheWrite: 2.5, cacheRead: 0.1 });
  });
  it('keeps the explicit US geo sources and excludes unsupported regions', () => {
    expect(c.geoSources).toEqual({ us: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'ca-central-1', 'ca-west-1'] });
    expect(Object.keys(c.availability)).toHaveLength(31);
    expect(c.availability['ap-southeast-6']).toEqual({ runtime: 'G' });
    expect(c.availability['mx-central-1']).toEqual({ runtime: 'G' });
    expect(c.availability['af-south-1']).toEqual({ runtime: 'G' });
    expect(c.availability['me-south-1']).toBeUndefined();
  });
});
