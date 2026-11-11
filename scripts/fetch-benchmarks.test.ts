import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const loader = pathToFileURL(createRequire(import.meta.url).resolve('tsx')).href;
const script = fileURLToPath(new URL('./fetch-benchmarks.ts', import.meta.url));
const model = {
  id: 'opus', name: 'Claude Opus 5 (Max)', slug: 'claude-opus-5',
  model_creator: { name: 'Anthropic' },
  evaluations: { artificial_analysis_intelligence_index: 44.2, artificial_analysis_coding_index: null },
  performance: { median_output_tokens_per_second: 80.6, median_time_to_first_token_seconds: 52.5 },
};
const page = (number: number, models: unknown[], more = false) => ({
  tier: 'free', intelligence_index_version: 5,
  pagination: { page: number, page_size: 200, total_pages: more ? number + 1 : number, has_more: more },
  data: models,
});

describe('benchmark API migration', () => {
  let dir: string;
  const run = (responses: { body: unknown; status?: number }[]) => {
    // Substitute only the remote API; execute the real command and its file writes.
    const fixture = join(dir, 'api-fixture.mjs');
    writeFileSync(fixture, `
      const responses = ${JSON.stringify(responses)};
      globalThis.fetch = async (input, options) => {
        const url = new URL(input);
        if (url.origin !== 'https://artificialanalysis.ai'
          || url.pathname !== '/api/v2/language/models/free') {
          return Response.json({ error: 'Gone' }, { status: 410 });
        }
        if (options?.headers?.['x-api-key'] !== 'test-key') {
          return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const number = Number(url.searchParams.get('page') ?? '1');
        const response = responses[number - 1];
        if (!response) throw new Error('Unexpected API page ' + number);
        return Response.json(response.body, { status: response.status ?? 200 });
      };
    `);
    return spawnSync(process.execPath, ['--import', loader, '--import', pathToFileURL(fixture).href, script], {
      cwd: dir, encoding: 'utf8', env: { ...process.env, AA_API_KEY: 'test-key' },
    });
  };
  const records = () => JSON.parse(readFileSync(join(dir, 'data/raw/benchmarks.json'), 'utf8'));
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'benchmark-fetch-test-'));
    mkdirSync(join(dir, 'data/raw'), { recursive: true });
    writeFileSync(join(dir, 'data/raw/benchmarks.json'), '[{"id":"previous"}]');
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('fetches every Free API page and reads nested median performance', () => {
    const result = run([
      { body: page(1, [model], true) },
      { body: page(2, [{ ...model, id: 'sol', slug: 'gpt-6-1-sol' }]) },
    ]);
    expect(result.status, result.stderr).toBe(0);
    expect(records()).toEqual([
      { id: 'opus', name: 'Claude Opus 5 (Max)', slug: 'claude-opus-5', creator: 'Anthropic',
        scores: { intelligenceIndex: 44.2, outputTokensPerSecond: 80.6, timeToFirstTokenSeconds: 52.5 } },
      { id: 'sol', name: 'Claude Opus 5 (Max)', slug: 'gpt-6-1-sol', creator: 'Anthropic',
        scores: { intelligenceIndex: 44.2, outputTokensPerSecond: 80.6, timeToFirstTokenSeconds: 52.5 } },
    ]);
  });

  it('keeps unreported and null metrics absent while preserving a measured zero score', () => {
    const result = run([{ body: page(1, [{
      ...model, evaluations: { artificial_analysis_intelligence_index: 0, gpqa: null },
      performance: { median_output_tokens_per_second: null },
    }]) }]);
    expect(result.status, result.stderr).toBe(0);
    expect(records()[0].scores).toEqual({ intelligenceIndex: 0 });
  });

  it('does not publish a partial cache if a later page fails', () => {
    const result = run([
      { body: page(1, [model], true) },
      { body: { error: 'Unavailable' }, status: 503 },
    ]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Artificial Analysis -> 503');
    expect(records()).toEqual([{ id: 'previous' }]);
  });

  it('rejects a successful response without the documented pagination envelope', () => {
    const result = run([{ body: { data: [model] } }]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Invalid Artificial Analysis response');
    expect(records()).toEqual([{ id: 'previous' }]);
  });

  it('rejects inconsistent pagination instead of silently omitting later models', () => {
    const result = run([{ body: {
      ...page(1, [model], true), pagination: { page: 1, total_pages: 1, has_more: true },
    } }]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Invalid Artificial Analysis response');
    expect(records()).toEqual([{ id: 'previous' }]);
  });
});
