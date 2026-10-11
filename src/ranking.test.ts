import { describe, expect, it } from 'vitest';
import { rankModelRows } from './ranking.ts';
import type { Metric } from './metrics.ts';
import type { Row } from './data.ts';
import type { Model } from './types.ts';

const m: Model = {
  id: 'gpt-6.1-sol', name: 'GPT-6.1 Sol', provider: 'OpenAI', firstSeen: '2026-10-08', regions: ['us-east-1'],
  benchmarks: { intelligenceIndex: 51.8 },
  pricing: { 'us-east-1': { regional: { standard: { input: 2.2, output: 11 } }, global: { standard: { input: 2, output: 10 } } } },
};
const rows: Row[] = [
  { m, scope: 'regional', label: 'Geo CRIS', inferred: false },
  { m, scope: 'global', label: 'Global CRIS', inferred: false },
];
const metric: Metric = { key: 'intelligence', label: 'Intelligence', hint: '', higherBetter: true, value: (r) => r.m.benchmarks?.intelligenceIndex, fmt: String };

describe('model ranking scopes', () => {
  it('keeps a model in only one ranking slot even when Global and regional prices are both selected', () => {
    const ranked = rankModelRows(rows, metric, { region: 'us-east-1', tier: 'standard' });
    expect(ranked).toHaveLength(1);
    expect(ranked[0]).toMatchObject({ v: 51.8, r: { scope: 'global' } });
  });
  it('retains the selected regional scope when Global is not selected', () => {
    expect(rankModelRows(rows.slice(0, 1), metric, { region: 'us-east-1', tier: 'standard' })[0].r.scope).toBe('regional');
  });
  it('does not create ranks from absent or nonfinite scores', () => {
    const absent = { ...rows[0], m: { ...m, benchmarks: undefined } };
    const invalid = { ...rows[0], m: { ...m, benchmarks: { intelligenceIndex: NaN } } };
    expect(rankModelRows([absent, invalid], metric, { region: 'us-east-1', tier: 'standard' })).toEqual([]);
  });
});
