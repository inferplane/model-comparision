export type Tier = 'standard' | 'batch' | 'priority' | 'flex';
export type Scope = 'regional' | 'global';
/** How a model is invoked: in its own region, via a geography-scoped CRIS profile (us./eu./jp.…), or via the global CRIS profile. */
export type Mode = 'in-region' | 'geo' | 'global';
export type TokenKind = 'input' | 'output' | 'cacheRead' | 'cacheWrite' | 'cacheWrite1h';

/** One normalized text-token price, always USD per 1M tokens. */
export interface PriceEntry {
  model: string;
  provider?: string;
  region: string;
  tier: Tier;
  scope: Scope;
  kind: TokenKind;
  usdPer1M: number;
  /** Price applies once the prompt exceeds the model's long-context threshold. */
  longContext?: boolean;
}

/** pricing[region][scope][tier][kind] = USD per 1M tokens */
export type PriceTable = Record<string, Partial<Record<Scope, Partial<Record<Tier, Partial<Record<TokenKind, number>>>>>>>;

export interface BenchmarkScores {
  intelligenceIndex?: number;
  codingIndex?: number;
  mathIndex?: number;
  mmluPro?: number;
  gpqa?: number;
  hle?: number;
  liveCodeBench?: number;
  scicode?: number;
  math500?: number;
  aime?: number;
  outputTokensPerSecond?: number;
  timeToFirstTokenSeconds?: number;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  maxOutput?: number;
  pricing: PriceTable;
  regions: string[];
  /** Invocation modes seen in models.dev profile ids; undefined when models.dev does not list the model. */
  modes?: Mode[];
  geoPrefixes?: string[];
  /** Prices that replace the base prices above the threshold (Price List `long_ctx` SKUs). */
  longContext?: { thresholdTokens?: number; pricing: PriceTable };
  firstSeen: string;
  benchmarks?: BenchmarkScores;
  /** The Artificial Analysis entry the scores came from; AA lists reasoning/effort variants separately, so this says which one. */
  benchmarkSource?: { name: string; slug: string };
}
