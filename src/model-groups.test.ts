import { describe, expect, it } from 'vitest';
import { groupModelRows, groupSortValue } from './model-groups.ts';
import type { Row } from './data.ts';
import type { Model } from './types.ts';

const model = (id: string): Model => ({ id, name: id, provider: 'Anthropic', pricing: {}, regions: [], firstSeen: '2026-10-08', benchmarks: { intelligenceIndex: 44.2 } });
const row = (m: Model, scope: Row['scope']): Row => ({ m, scope, label: scope, inferred: false });

describe('one explorer row per model', () => {
  it('keeps both prices under one model even when incoming scopes are separated by another model', () => {
    const opus = model('claude-opus-5');
    const other = model('other');
    const groups = groupModelRows([row(opus, 'regional'), row(other, 'global'), row(opus, 'global')]);
    expect(groups.map((group) => group.m.id)).toEqual(['claude-opus-5', 'other']);
    expect(groups[0].rows.map((variant) => variant.scope)).toEqual(['regional', 'global']);
    expect(groupSortValue(groups[0], (variant) => variant.m.benchmarks?.intelligenceIndex)).toBe(44.2);
    expect(groupSortValue(groups[0], (variant) => variant.m.provider)).toBe('Anthropic');
  });

  it('sorts models by their lowest selected price, retaining zero and treating missing prices as unknown', () => {
    const m = model('opus');
    const group = groupModelRows([row(m, 'regional'), row(m, 'global')])[0];
    expect(groupSortValue(group, (variant) => variant.scope === 'regional' ? 5.5 : 5)).toBe(5);
    expect(groupSortValue(group, (variant) => variant.scope === 'regional' ? undefined : 0)).toBe(0);
    expect(groupSortValue(group, () => undefined)).toBeUndefined();
  });

  it('does not reintroduce scopes removed by region, mode, or caching filters', () => {
    const group = groupModelRows([row(model('opus'), 'global')])[0];
    expect(group.rows).toHaveLength(1);
    expect(group.rows[0].scope).toBe('global');
  });
});
