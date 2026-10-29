import { describe, expect, it, vi } from 'vitest';
import type { Model } from '../src/types.ts';
import { inferenceIds } from '../src/data.ts';
import { zdrOf } from '../src/zdr.ts';

// Exercise the real builder against the fixed, supplied card, not the live catalog.
// New upstream prices/benchmarks must not break this regression test.
const output = vi.hoisted(() => new Map<string, string>());
vi.mock('node:fs', async (importOriginal) => {
  const fs = await importOriginal<typeof import('node:fs')>();
  return {
    ...fs,
    existsSync: (path: string) => path === 'data/cards',
    readFileSync: (path: string, encoding: 'utf8') => path.startsWith('data/raw/') ? '[]' : fs.readFileSync(path, encoding),
    readdirSync: () => ['model-card-openai-gpt-6-1-terra.md'],
  };
});
vi.mock('node:fs/promises', () => ({
  mkdir: async () => undefined,
  writeFile: async (path: string, contents: string) => { output.set(path, contents); },
}));

describe('GPT-6.1 Terra card fallback', () => {
  it('builds the supplied card with limits, prices, availability and usable profile IDs', async () => {
    await import('./build-data.ts');
    const { models } = JSON.parse(output.get('public/data/models.json')!) as { models: Model[] };
    const m = models.find((m) => m.id === 'gpt-6.1-terra')!;
    expect(m).toBeDefined();
    expect(m).toMatchObject({ name: 'GPT-6.1 Terra', provider: 'OpenAI', modelId: 'openai.gpt-6.1-terra', contextWindow: 1_050_000, maxOutput: 128_000, priceSource: 'model-card', card: { launchDate: 'October 26, 2026', lifecycle: 'Active' } });
    expect(m.card?.eolDate).toBeUndefined(); // "no sooner than" is not an announced EOL
    expect(m.regions).toHaveLength(31);
    expect(m.availability?.['us-east-1']).toEqual({ runtime: 'gG', mantle: 'i' });
    expect(m.availability?.['ca-west-1']).toEqual({ runtime: 'gG' });
    expect(m.availability?.['ap-northeast-2']).toEqual({ runtime: 'G' });
    for (const region of ['me-south-1', 'us-gov-east-1', 'us-gov-west-1']) expect(m.regions).not.toContain(region);
    expect(m.pricing['us-east-1'].regional).toEqual({ standard: { input: 1.1, output: 5.5, cacheRead: 0.055, cacheWrite: 1.375 } });
    expect(m.pricing['ap-northeast-2']).toEqual({ global: { standard: { input: 1, output: 5, cacheRead: 0.05, cacheWrite: 1.25 } } });
    expect(m.longContext?.thresholdTokens).toBe(272_000);
    expect(m.longContext?.pricing['us-east-1'].regional?.standard).toEqual({ input: 2.2, output: 8.25, cacheRead: 0.11, cacheWrite: 2.75 });
    expect(m.longContext?.pricing['ap-northeast-2'].global?.standard).toEqual({ input: 2, output: 7.5, cacheRead: 0.1, cacheWrite: 2.5 });
    expect(inferenceIds(m, 'us-east-1').map((x) => x.id)).toEqual(['openai.gpt-6.1-terra', 'us.openai.gpt-6.1-terra', 'global.openai.gpt-6.1-terra']);
    expect(inferenceIds(m, 'ca-west-1').map((x) => x.id)).toEqual(['us.openai.gpt-6.1-terra', 'global.openai.gpt-6.1-terra']);
    expect(inferenceIds(m, 'ap-northeast-2').map((x) => x.id)).toEqual(['global.openai.gpt-6.1-terra']);
    expect(zdrOf(m)).toBe(false);
    expect(m.benchmarks).toBeUndefined();
  });
});
