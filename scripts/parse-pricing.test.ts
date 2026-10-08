import { describe, expect, it } from 'vitest';
import { classifyInferenceType, classifyMarketplaceUsage, parsePriceList, toUsdPer1M } from './parse-pricing.ts';

describe('toUsdPer1M', () => {
  it('scales 1K-token prices to 1M', () => {
    expect(toUsdPer1M({ unit: '1K tokens', pricePerUnit: { USD: '0.0033' } })).toBeCloseTo(3.3);
  });
  it('keeps 1M-token prices and rejects other units', () => {
    expect(toUsdPer1M({ unit: '1M tokens', pricePerUnit: { USD: '5.5' } })).toBe(5.5);
    expect(toUsdPer1M({ unit: 'Hrs', pricePerUnit: { USD: '5.5' } })).toBeUndefined();
  });
});

describe('classifyInferenceType', () => {
  it.each([
    ['Input tokens', { tier: 'standard', scope: 'regional', kind: 'input' }],
    ['input tokens batch', { tier: 'batch', scope: 'regional', kind: 'input' }],
    ['Output tokens global priority', { tier: 'priority', scope: 'global', kind: 'output' }],
    ['Prompt cache read input tokens flex', { tier: 'flex', scope: 'regional', kind: 'cacheRead' }],
    ['Cache write tokens 30m global', { tier: 'standard', scope: 'global', kind: 'cacheWrite' }],
    ['Text Input Tokens', { tier: 'standard', scope: 'regional', kind: 'input' }],
  ])('%s', (s, expected) => {
    expect(classifyInferenceType(s)).toEqual(expected);
  });
  it.each(['Input Image Token Count', 'T2I 1024 Standard', 'Input Audio Token Count Priority'])('skips %s', (s) => {
    expect(classifyInferenceType(s)).toBeUndefined();
  });
});

describe('classifyMarketplaceUsage', () => {
  it.each([
    ['USE1-MP:USE1_cache_write_tokens_1h_global_standard-Units', { tier: 'standard', scope: 'global', kind: 'cacheWrite1h' }],
    ['USE1-MP:USE1_output_tokens_batch-Units', { tier: 'batch', scope: 'regional', kind: 'output' }],
    ['USE1-MP:USE1_InputTokenCount_Global_Batch-Units', { tier: 'batch', scope: 'global', kind: 'input' }],
    ['USE1-MP:USE1_CacheReadInputTokenCount-Units', { tier: 'standard', scope: 'regional', kind: 'cacheRead' }],
    ['USE1-MP:USE1_CacheWrite1hInputTokenCount-Units', { tier: 'standard', scope: 'regional', kind: 'cacheWrite1h' }],
  ])('%s', (s, expected) => {
    expect(classifyMarketplaceUsage(s)).toEqual(expected);
  });
  it.each([
    'USE1-MP:USE1_Reserved_3Month_OutputTPM_Global-Units',
    'USE1-MP:USE1_ProvisionedThroughput_NoCommit_ModelUnits_Usage-Units',
    'USE1-MP:USE1_InputImageCount-Units',
  ])('skips %s', (s) => {
    expect(classifyMarketplaceUsage(s)).toBeUndefined();
  });
});

describe('parsePriceList', () => {
  it('joins products with OnDemand terms and converts units', () => {
    const entries = parsePriceList('AmazonBedrock', {
      products: {
        A: { attributes: { model: 'Kimi K3', provider: 'Moonshot AI', inferenceType: 'Input tokens', regionCode: 'us-east-1', usagetype: 'x' } },
        B: { attributes: { model: 'Kimi K3', inferenceType: 'Input Image Token Count', regionCode: 'us-east-1', usagetype: 'y' } },
      },
      terms: { OnDemand: { A: { o: { priceDimensions: { d: { unit: '1K tokens', pricePerUnit: { USD: '0.0033' } } } } } } },
    });
    expect(entries).toEqual([{ model: 'Kimi K3', provider: 'Moonshot AI', region: 'us-east-1', tier: 'standard', scope: 'regional', kind: 'input', usdPer1M: 3.3 }]);
  });
});
