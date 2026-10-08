import type { PriceEntry, Scope, Tier, TokenKind } from '../src/types.ts';

interface PriceDimension {
  unit: string;
  pricePerUnit: { USD: string };
}
interface Offer {
  priceDimensions: Record<string, PriceDimension>;
}
export interface PriceListFile {
  products: Record<string, { attributes: Record<string, string> }>;
  terms: { OnDemand?: Record<string, Record<string, Offer>> };
}

// Non-text modalities and non-inference SKUs are left out of the token price table.
const NON_TEXT = /image|video|audio|speech|t2i|i2i|count|embedding|provisioned|reserved|customiz|storage/i;

const BFM_PROVIDERS: [RegExp, string][] = [
  [/^claude/i, 'Anthropic'],
  [/^(meta )?llama/i, 'Meta'],
  [/^cohere|^command|^embed/i, 'Cohere'],
  [/^mistral|^pixtral|^magistral|^devstral/i, 'Mistral AI'],
  [/^ai21|^jamba|^jurassic/i, 'AI21 Labs'],
  [/^openai|^gpt/i, 'OpenAI'],
  [/^palmyra|^writer/i, 'Writer'],
  [/^deepseek/i, 'DeepSeek'],
  [/^twelvelabs/i, 'TwelveLabs'],
  [/^stability/i, 'Stability AI'],
];

export function providerFromName(name: string): string | undefined {
  return BFM_PROVIDERS.find(([re]) => re.test(name))?.[1];
}

/** Dollars per 1M tokens from a price dimension; undefined for units that are not per-token. */
export function toUsdPer1M(dim: PriceDimension): number | undefined {
  const usd = Number(dim.pricePerUnit.USD);
  if (!Number.isFinite(usd)) return undefined;
  const unit = dim.unit.toLowerCase();
  if (unit.startsWith('1m')) return usd;
  if (unit.startsWith('1k')) return usd * 1000;
  return undefined;
}

interface Classified {
  tier: Tier;
  scope: Scope;
  kind: TokenKind;
}

function tierOf(s: string): Tier {
  if (/batch/.test(s)) return 'batch';
  if (/priority/.test(s)) return 'priority';
  if (/flex/.test(s)) return 'flex';
  return 'standard';
}

/** AmazonBedrock products describe themselves in `inferenceType`, e.g. "Input tokens global priority". */
export function classifyInferenceType(inferenceType: string): Classified | undefined {
  const s = inferenceType.toLowerCase();
  if (NON_TEXT.test(s.replace(/prompt cache/, ''))) return undefined;
  let kind: TokenKind;
  if (s.includes('cache')) {
    if (s.includes('read')) kind = 'cacheRead';
    else if (s.includes('write')) kind = /1h/.test(s) ? 'cacheWrite1h' : 'cacheWrite';
    else return undefined;
  } else if (s.includes('output')) kind = 'output';
  else if (s.includes('input')) kind = 'input';
  else return undefined;
  return { tier: tierOf(s), scope: /\bglobal\b/.test(s) ? 'global' : 'regional', kind };
}

/** AmazonBedrockFoundationModels products only expose a Marketplace usagetype, e.g. "USE1-MP:USE1_cache_write_tokens_1h_global_standard-Units". */
export function classifyMarketplaceUsage(usagetype: string): Classified | undefined {
  const s = usagetype.replace(/^[A-Z0-9]+-MP:[A-Z0-9]+_/, '').replace(/-Units$/, '').toLowerCase();
  if (NON_TEXT.test(s.replace(/tokencount/, ''))) return undefined;
  const flat = s.replace(/_/g, '');
  let kind: TokenKind;
  if (flat.includes('cacheread')) kind = 'cacheRead';
  else if (flat.includes('cachewrite')) kind = /1h/.test(s) ? 'cacheWrite1h' : 'cacheWrite';
  else if (flat.includes('output')) kind = 'output';
  else if (flat.includes('input')) kind = 'input';
  else return undefined;
  return { tier: tierOf(flat), scope: /global/.test(flat) ? 'global' : 'regional', kind };
}

export function parsePriceList(service: 'AmazonBedrock' | 'AmazonBedrockFoundationModels', file: PriceListFile): PriceEntry[] {
  const out: PriceEntry[] = [];
  const onDemand = file.terms.OnDemand ?? {};
  for (const [sku, product] of Object.entries(file.products)) {
    const a = product.attributes;
    let model: string | undefined;
    let provider: string | undefined;
    let cls: Classified | undefined;
    if (service === 'AmazonBedrock') {
      if (!a.model || !a.inferenceType) continue;
      model = a.model;
      provider = a.provider;
      cls = classifyInferenceType(a.inferenceType);
    } else {
      if (!a.servicename || !a.usagetype.includes('-MP:')) continue;
      model = a.servicename.replace(/\s*\(Amazon Bedrock Edition\)\s*$/i, '');
      provider = providerFromName(model);
      cls = classifyMarketplaceUsage(a.usagetype);
    }
    if (!cls || !a.regionCode) continue;
    for (const offer of Object.values(onDemand[sku] ?? {})) {
      for (const dim of Object.values(offer.priceDimensions)) {
        const usdPer1M = toUsdPer1M(dim);
        if (usdPer1M === undefined) continue;
        out.push({ model, provider, region: a.regionCode, ...cls, usdPer1M: Number(usdPer1M.toPrecision(10)) });
      }
    }
  }
  return out;
}
