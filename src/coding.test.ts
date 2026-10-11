import { describe, expect, it } from 'vitest';
import { codingIndexOf, scienceCodingPercent } from './coding.ts';
import { METRICS } from './metrics.ts';
import type { Model } from './types.ts';

const model = (scores?: Model['benchmarks']): Model => ({ id: 'example', name: 'Example', provider: 'Example', pricing: {}, regions: [], firstSeen: '2026-10-11', benchmarks: scores });

describe('independent coding measurements', () => {
  it('does not fabricate a Coding Index from an available SciCode measurement', () => {
    const m = model({ intelligenceIndex: 57.6, scicode: 0.669 });
    expect(codingIndexOf(m)).toBeUndefined();
    expect(scienceCodingPercent(m)).toBeCloseTo(66.9);
    expect(METRICS.coding.value({ m, scope: 'global', label: 'Global CRIS', inferred: false })).toBeUndefined();
  });
  it('preserves a genuinely supplied Coding Index alongside SciCode', () => {
    const m = model({ codingIndex: 71.4, scicode: 0.536 });
    expect(codingIndexOf(m)).toBe(71.4);
    expect(scienceCodingPercent(m)).toBeCloseTo(53.6);
  });
  it('accepts an actual zero score rather than treating it as absent', () => {
    expect(codingIndexOf(model({ codingIndex: 0 }))).toBe(0);
    expect(scienceCodingPercent(model({ scicode: 0 }))).toBe(0);
  });
  it('does not rank missing or invalid values as real measurements', () => {
    expect(codingIndexOf(model())).toBeUndefined();
    expect(codingIndexOf(model({ codingIndex: NaN }))).toBeUndefined();
    expect(codingIndexOf(model({ codingIndex: -1 }))).toBeUndefined();
    expect(scienceCodingPercent(model({ scicode: 1.2 }))).toBeUndefined();
    expect(scienceCodingPercent(model({ scicode: Infinity }))).toBeUndefined();
  });
});
