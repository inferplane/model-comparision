export type Tier = 'standard' | 'batch' | 'priority' | 'flex';
export type Scope = 'regional' | 'global';
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
  firstSeen: string;
  benchmarks?: BenchmarkScores;
}
