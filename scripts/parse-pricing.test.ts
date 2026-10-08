import { describe, expect, it } from 'vitest';
import { classifyInferenceType, classifyMarketplaceUsage, parsePriceList, toUsdPer1M } from './parse-pricing.ts';

describe('toUsdPer1M', () => {
  it('scales 1K-token prices to 1M', () => {
    expect(toUsdPer1M({ unit: '1K tokens', pricePerUnit: { USD: '0.0033' } })).toBeCloseTo(3.3);
  });
  it('keeps 1M-token prices and rejects other units', () => {
    expect(toUsdPer1M({ unit: '1M tokens', pricePerUnit: { USD: '5.5' } })).toBe(5.5);
    expect(toUsdPer1M({ unit: 'Hrs', pricePerUnit: { USD: '5.5' } })).toBeUndefined();
    expect(toUsdPer1M({ unit: 'Units', pricePerUnit: { USD: '0.6875' } })).toBeUndefined();
    expect(toUsdPer1M({ unit: 'Units', pricePerUnit: { USD: '0.6875' } }, true)).toBe(0.6875);
  });
});

describe('classifyInferenceType', () => {
  it.each([
    ['Input tokens', { tier: 'standard', scope: 'regional', kind: 'input', longContext: false }],
    ['input tokens batch', { tier: 'batch', scope: 'regional', kind: 'input', longContext: false }],
    ['Output tokens global priority', { tier: 'priority', scope: 'global', kind: 'output', longContext: false }],
    ['Prompt cache read input tokens flex', { tier: 'flex', scope: 'regional', kind: 'cacheRead', longContext: false }],
    ['Cache write tokens 30m global', { tier: 'standard', scope: 'global', kind: 'cacheWrite', longContext: false }],
    ['Text Input Tokens', { tier: 'standard', scope: 'regional', kind: 'input', longContext: false }],
  ])('%s', (s, expected) => {
    expect(classifyInferenceType(s)).toEqual(expected);
  });
  it.each(['Input Image Token Count', 'T2I 1024 Standard', 'Input Audio Token Count Priority'])('skips %s', (s) => {
    expect(classifyInferenceType(s)).toBeUndefined();
  });
});

describe('classifyInferenceType with usagetype', () => {
  it('reads batch/flex/priority from the usagetype suffix when inferenceType omits it', () => {
    expect(classifyInferenceType('Input tokens', 'USE1-gpt-oss-120b-input-tokens-batch')?.tier).toBe('batch');
    expect(classifyInferenceType('Output tokens', 'USE1-GPT-OSS-Safeguard-20B-output-tokens-batch')?.tier).toBe('batch');
    expect(classifyInferenceType('Input tokens', 'USE1-gpt-oss-120b-input-tokens')?.tier).toBe('standard');
  });
});

describe('classifyInferenceType edge cases', () => {
  it('skips custom-model SKUs', () => {
    expect(classifyInferenceType('Output tokens', 'USE1-Nova2.0Lite-output-tokens-custom-model')).toBeUndefined();
    expect(classifyInferenceType('Prompt cache read input tokens', 'USE1-Nova2.0Lite-cache-read-input-token-count-custom-model')).toBeUndefined();
  });
  it('classifies SKUs without an inferenceType from the usagetype', () => {
    expect(classifyInferenceType('', 'USE1-Nova2.0Lite-cache-read-input-token-count-cross-region-global')).toEqual({ tier: 'standard', scope: 'global', kind: 'cacheRead', longContext: false });
  });
  it('still skips non-token SKUs that lack an inferenceType', () => {
    for (const u of ['USE1-Nova2.0Lite-nova-grounding', 'USE1-Nova2.0Lite-RFT-Training-Hours', 'USE1-Nova2.0Lite-ProvisionedThroughput-NoCommit-ModelUnits', 'USE1-Nova2.0Lite-Customization-Storage'])
      expect(classifyInferenceType('', u)).toBeUndefined();
  });
});

describe('classifyMarketplaceUsage', () => {
  it.each([
    ['USE1-MP:USE1_cache_write_tokens_1h_global_standard-Units', { tier: 'standard', scope: 'global', kind: 'cacheWrite1h', longContext: false }],
    ['USE1-MP:USE1_input_tokens_long_ctx_global_standard-Units', { tier: 'standard', scope: 'global', kind: 'input', longContext: true }],
    ['USE1-MP:USE1_cache_write_tokens_1h_long_ctx_standard-Units', { tier: 'standard', scope: 'regional', kind: 'cacheWrite1h', longContext: true }],
    ['USE1-MP:USE1_output_tokens_batch-Units', { tier: 'batch', scope: 'regional', kind: 'output', longContext: false }],
    ['USE1-MP:USE1_InputTokenCount_Global_Batch-Units', { tier: 'batch', scope: 'global', kind: 'input', longContext: false }],
    ['USE1-MP:USE1_CacheReadInputTokenCount-Units', { tier: 'standard', scope: 'regional', kind: 'cacheRead', longContext: false }],
    ['USE1-MP:USE1_CacheWrite1hInputTokenCount-Units', { tier: 'standard', scope: 'regional', kind: 'cacheWrite1h', longContext: false }],
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
  it('keeps long-context SKUs apart from the base price', () => {
    const dim = (usd: string) => ({ priceDimensions: { d: { unit: '1M tokens', pricePerUnit: { USD: usd } } } });
    const entries = parsePriceList('AmazonBedrockFoundationModels', {
      products: {
        A: { attributes: { servicename: 'OpenAI GPT-6 Astra (Amazon Bedrock Edition)', usagetype: 'USE1-MP:USE1_input_tokens_standard-Units', regionCode: 'us-east-1' } },
        B: { attributes: { servicename: 'OpenAI GPT-6 Astra (Amazon Bedrock Edition)', usagetype: 'USE1-MP:USE1_input_tokens_long_ctx_standard-Units', regionCode: 'us-east-1' } },
      },
      terms: { OnDemand: { A: { o: dim('11') }, B: { o: dim('22') } } },
    });
    expect(entries.map((e) => [e.longContext ?? false, e.usdPer1M])).toEqual([[false, 11], [true, 22]]);
  });
});
