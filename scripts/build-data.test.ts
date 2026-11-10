import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Model, PriceEntry } from '../src/types.ts';
import type { BenchmarkRecord } from './fetch-benchmarks.ts';

const loader = pathToFileURL(createRequire(import.meta.url).resolve('tsx')).href;
const script = fileURLToPath(new URL('./build-data.ts', import.meta.url));
const oldModel = (id = 'gpt-6.1-sol', modelId = 'openai.gpt-6.1-sol'): Model => ({
  id, modelId, name: 'GPT-6.1 Sol', provider: 'OpenAI', pricing: {}, regions: [],
  firstSeen: '2026-10-08', benchmarks: { intelligenceIndex: 54.6, scicode: 0.542 },
  benchmarkSource: { name: 'GPT-6.1 Sol (Max)', slug: 'gpt-6-1-sol' },
});
const price = (model: string, region = 'us-east-1'): PriceEntry => ({
  model, provider: 'OpenAI', region, scope: 'regional', tier: 'standard', kind: 'input', usdPer1M: 2,
});

describe('model catalog rebuild', () => {
  let dir: string;
  const json = (path: string, value: unknown) => writeFileSync(join(dir, path), JSON.stringify(value));
  const build = (): Model[] => {
    execFileSync(process.execPath, ['--import', loader, script], { cwd: dir, stdio: 'pipe' });
    return JSON.parse(readFileSync(join(dir, 'public/data/models.json'), 'utf8')).models;
  };
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'model-catalog-test-'));
    mkdirSync(join(dir, 'data/raw'), { recursive: true });
    mkdirSync(join(dir, 'public/data'), { recursive: true });
    json('data/raw/prices.json', [price('OpenAI GPT-6.1 Sol')]);
    json('data/raw/context.json', [{
      bedrockId: 'openai.gpt-6.1-sol', name: 'GPT-6.1 Sol', modes: ['in-region'],
      geoPrefixes: [], cost: {}, context: 1000000, maxOutput: 131072,
    }]);
    json('data/raw/benchmarks.json', []);
    json('public/data/models.json', { generatedAt: '2026-11-04T05:16:46.984Z', models: [oldModel()] });
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('merges namespace and display-name prices for the same Bedrock model', () => {
    json('data/raw/prices.json', [
      price('openai.gpt-6.1-sol'),
      { ...price('OpenAI GPT-6.1 Sol'), tier: 'priority', kind: 'output', usdPer1M: 8 },
      price('OpenAI GPT-6.1 Sol', 'us-gov-east-1'),
      { ...price('openai.gpt-6.1-sol'), longContext: true, usdPer1M: 4 },
      { ...price('OpenAI GPT-6.1 Sol'), longContext: true, kind: 'output', usdPer1M: 16 },
    ]);
    const models = build();
    expect(models).toHaveLength(1);
    expect(models[0]).toMatchObject({
      id: 'gpt-6.1-sol', modelId: 'openai.gpt-6.1-sol', firstSeen: '2026-10-08',
      pricing: {
        'us-east-1': { regional: { standard: { input: 2 }, priority: { output: 8 } } },
        'us-gov-east-1': { regional: { standard: { input: 2 } } },
      },
      longContext: { pricing: { 'us-east-1': { regional: { standard: { input: 4, output: 16 } } } } },
    });
  });

  it('keeps the established site URL and discovery date when the source name changes', () => {
    expect(build()[0]).toMatchObject({ id: 'gpt-6.1-sol', firstSeen: '2026-10-08' });
  });

  it('recovers stable identity and measurements from the pre-refresh snapshot after a broken draft', () => {
    json('data/raw/models.prev.json', { generatedAt: '2026-11-04T05:16:46.984Z', models: [oldModel()] });
    json('public/data/models.json', {
      generatedAt: '2026-11-10T06:10:34.361Z',
      models: [{ ...oldModel('openai-gpt-6.1-sol'), firstSeen: '2026-11-10', benchmarks: undefined, benchmarkSource: undefined }],
    });
    expect(build()[0]).toMatchObject({
      id: 'gpt-6.1-sol', firstSeen: '2026-10-08', benchmarks: { intelligenceIndex: 54.6, scicode: 0.542 },
      benchmarkSource: { slug: 'gpt-6-1-sol', snapshotAt: '2026-11-04T05:16:46.984Z' },
    });
  });

  it('retains exact prior measurements and their original snapshot date across repeated rebuilds', () => {
    expect(build()[0]).toMatchObject({
      benchmarks: { intelligenceIndex: 54.6, scicode: 0.542 },
      benchmarkSource: { snapshotAt: '2026-11-04T05:16:46.984Z' },
    });
    const next = build()[0];
    expect(next.benchmarkSource).toMatchObject({ snapshotAt: '2026-11-04T05:16:46.984Z' });
    expect(next.benchmarks?.codingIndex).toBeUndefined();
  });

  it('uses actual API measurements instead of carrying forward a previous score', () => {
    const record: BenchmarkRecord = {
      id: 'sol', name: 'GPT-6.1 Sol (Max)', slug: 'gpt-6-1-sol', creator: 'OpenAI',
      scores: { intelligenceIndex: 56, scicode: 0.55 },
    };
    json('data/raw/benchmarks.json', [record]);
    const m = build()[0];
    expect(m.benchmarks).toEqual({ intelligenceIndex: 56, scicode: 0.55 });
    expect(m.benchmarkSource).toEqual({ name: 'GPT-6.1 Sol (Max)', slug: 'gpt-6-1-sol' });
  });

  it('keeps previous measurements when a matching API record contains no scores', () => {
    json('data/raw/benchmarks.json', [{
      id: 'sol', name: 'GPT-6.1 Sol (Max)', slug: 'gpt-6-1-sol', creator: 'OpenAI', scores: {},
    }]);
    expect(build()[0].benchmarks).toEqual({ intelligenceIndex: 54.6, scicode: 0.542 });
  });

  it('does not transfer a prior release measurement to an unmeasured new version', () => {
    json('data/raw/prices.json', [price('OpenAI GPT-6.2 Sol')]);
    json('data/raw/context.json', [{
      bedrockId: 'openai.gpt-6.2-sol', name: 'GPT-6.2 Sol', modes: ['in-region'], geoPrefixes: [], cost: {},
    }]);
    const m = build()[0];
    expect(m.modelId).toBe('openai.gpt-6.2-sol');
    expect(m.benchmarks).toBeUndefined();
  });

  it('gives distinct models unique site URLs even when punctuation collapses their name slugs', () => {
    json('data/raw/prices.json', [
      { ...price('Cohere Command R'), provider: 'Cohere' },
      { ...price('Cohere Command R+'), provider: 'Cohere', usdPer1M: 3 },
    ]);
    json('data/raw/context.json', [
      { bedrockId: 'cohere.command-r-v1:0', name: 'Cohere Command R', modes: ['in-region'], geoPrefixes: [], cost: {} },
      { bedrockId: 'cohere.command-r-plus-v1:0', name: 'Cohere Command R+', modes: ['in-region'], geoPrefixes: [], cost: {} },
    ]);
    json('public/data/models.json', {
      generatedAt: '2026-11-04T05:16:46.984Z',
      models: [{ ...oldModel('cohere-command-r', 'cohere.command-r-plus-v1:0'), name: 'Cohere Command R+', provider: 'Cohere' }],
    });
    const models = build();
    expect(models).toHaveLength(2);
    expect(new Set(models.map((m) => m.id)).size).toBe(2);
    expect(models.find((m) => m.modelId === 'cohere.command-r-plus-v1:0')?.id).toBe('cohere-command-r');
    expect(models.find((m) => m.modelId === 'cohere.command-r-v1:0')?.pricing['us-east-1'].regional?.standard?.input).toBe(2);
  });

  it('preserves the physical identity when a previous collapsed entry has the wrong display name', () => {
    json('data/raw/prices.json', [
      { ...price('Cohere Command R'), provider: 'Cohere' },
      { ...price('Cohere Command R+'), provider: 'Cohere', usdPer1M: 3 },
    ]);
    json('data/raw/context.json', [
      { bedrockId: 'cohere.command-r-v1:0', name: 'Cohere Command R', modes: ['in-region'], geoPrefixes: [], cost: {} },
      { bedrockId: 'cohere.command-r-plus-v1:0', name: 'Cohere Command R+', modes: ['in-region'], geoPrefixes: [], cost: {} },
    ]);
    json('public/data/models.json', {
      generatedAt: '2026-11-04T05:16:46.984Z',
      models: [{ ...oldModel('cohere-command-r', 'cohere.command-r-plus-v1:0'), name: 'Cohere Command R', provider: 'Cohere' }],
    });
    const models = build();
    expect(models.find((m) => m.modelId === 'cohere.command-r-plus-v1:0')).toMatchObject({
      id: 'cohere-command-r', name: 'Cohere Command R+',
      pricing: { 'us-east-1': { regional: { standard: { input: 3 } } } },
    });
    expect(build().map((m) => [m.id, m.modelId])).toEqual(models.map((m) => [m.id, m.modelId]));
  });

  it('clears an old API cache when credentials are absent so it cannot masquerade as a fresh fetch', () => {
    execFileSync(process.execPath, ['--import', loader, fileURLToPath(new URL('./fetch-benchmarks.ts', import.meta.url))], {
      cwd: dir, stdio: 'pipe', env: { ...process.env, AA_API_KEY: '' },
    });
    expect(() => readFileSync(join(dir, 'data/raw/benchmarks.json'))).toThrow();
  });
});
