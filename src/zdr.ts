import type { Model } from './types.ts';

/**
 * Models that Bedrock does not offer zero data retention (ZDR) for. Every other model is treated as ZDR-eligible.
 * Matched by name so a newly launched GPT or Fable model is covered without a data change; edit this list when AWS changes it.
 */
const NO_ZDR: RegExp[] = [/\bgpt\b/i, /\bfable\b/i];

export const zdrOf = (m: Pick<Model, 'name'>): boolean => !NO_ZDR.some((re) => re.test(m.name));
