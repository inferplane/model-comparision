import type { Model } from './types.ts';

/**
 * Why a model is not zero-data-retention (ZDR) by default, per the AWS "Amazon Bedrock abuse detection" page
 * (https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html). That page lists the only models
 * Bedrock retains data for; every other model keeps its previous policy, which is ZDR.
 *  - openai: every OpenAI model except gpt-oss-120b/20b and GPT OSS Safeguard 120B/20B is not ZDR by default; ZDR is
 *    available to eligible customers through their AWS account team, approved per model version (not carried to new versions).
 *  - fable: Claude Fable 5 / 5.1 retain all traffic up to 30 days; ZDR applies only to Enterprise Frontier
 *    Safeguards customers, through 2026-12-31.
 */
export type NoZdrReason = 'openai' | 'fable';

const OPEN_WEIGHT_OPENAI = /\bgpt[- ]oss\b/i;

export const noZdrReason = (m: Pick<Model, 'name' | 'provider'>): NoZdrReason | undefined => {
  if (m.provider === 'OpenAI' && !OPEN_WEIGHT_OPENAI.test(m.name)) return 'openai';
  if (m.provider === 'Anthropic' && /\bfable\b/i.test(m.name)) return 'fable';
  return undefined;
};

export const zdrOf = (m: Pick<Model, 'name' | 'provider'>): boolean => noZdrReason(m) === undefined;

/** Last day of the Enterprise Frontier Safeguards ZDR for Claude Fable 5 / 5.1 (abuse-detection page); all traffic is retained afterwards. */
export const FABLE_PROGRAM_ZDR_UNTIL = '2026-12-31';

export const fableProgramZdrActive = (now: Date = new Date()): boolean => now.toISOString().slice(0, 10) <= FABLE_PROGRAM_ZDR_UNTIL;
