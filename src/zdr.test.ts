import { describe, expect, it } from 'vitest';
import { zdrOf } from './zdr.ts';

describe('zdrOf', () => {
  it('marks every GPT model and every Fable model as not ZDR-eligible', () => {
    for (const name of ['GPT-6.1 Sol', 'OpenAI GPT-6 Astra', 'gpt-oss-120b', 'GPT OSS Safeguard 20B', 'Daybreak Blue: GPT-5.6 Sol', 'Claude Fable 5', 'Claude Fable 5.1'])
      expect(zdrOf({ name }), name).toBe(false);
  });
  it('treats other models as ZDR-eligible, including names that merely contain the letters', () => {
    for (const name of ['Claude Opus 5.5', 'Claude Sonnet 5.5', 'Nova 2 Pro', 'GLM 5.3', 'ChatGPTish', 'Fabled 1'])
      expect(zdrOf({ name }), name).toBe(true);
  });
});
