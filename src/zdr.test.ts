import { describe, expect, it } from 'vitest';
import { fableProgramZdrActive, noZdrReason, zdrOf } from './zdr.ts';

const openai = (name: string) => ({ name, provider: 'OpenAI' });

describe('zdrOf', () => {
  it('marks OpenAI models other than the open-weight gpt-oss family as not ZDR by default', () => {
    for (const name of ['GPT-6.1 Sol', 'OpenAI GPT-6 Astra', 'Daybreak Blue: GPT-5.6 Sol', 'Daybreak Red: GPT-5.6 Cyber', 'GPT-5.4'])
      expect(noZdrReason(openai(name)), name).toBe('openai');
  });
  it('keeps gpt-oss and GPT OSS Safeguard ZDR-eligible', () => {
    for (const name of ['gpt-oss-120b', 'gpt-oss-20b', 'GPT OSS Safeguard 120B', 'GPT OSS Safeguard 20B'])
      expect(zdrOf(openai(name)), name).toBe(true);
  });
  it('marks Claude Fable 5 and 5.1 as not ZDR by default', () => {
    for (const name of ['Claude Fable 5', 'Claude Fable 5.1'])
      expect(noZdrReason({ name, provider: 'Anthropic' }), name).toBe('fable');
  });
  it('treats every other model as ZDR-eligible, whatever its name contains', () => {
    for (const [name, provider] of [['Claude Opus 5.5', 'Anthropic'], ['Nova 2 Pro', 'Amazon'], ['GLM 5.3', 'Z AI'], ['ChatGPTish', 'Other'], ['Fabled 1', 'Other'], ['GPT-clone', 'Qwen']])
      expect(zdrOf({ name, provider }), name).toBe(true);
  });
  it('ends the Fable program ZDR after 2026-12-31', () => {
    expect(fableProgramZdrActive(new Date('2026-10-14T00:00:00Z'))).toBe(true);
    expect(fableProgramZdrActive(new Date('2026-12-31T23:59:59Z'))).toBe(true);
    expect(fableProgramZdrActive(new Date('2027-01-01T00:00:00Z'))).toBe(false);
  });
});
