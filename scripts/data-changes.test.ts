import { describe, expect, it } from 'vitest';
import { changesMarkdown, commitMessage, computeChanges, needsReview, sanityGuard } from './data-changes.ts';
import type { Model } from '../src/types.ts';

const model = (id: string, over: Partial<Model> = {}): Model => ({ id, name: id.toUpperCase(), provider: 'Acme', pricing: {}, regions: [], firstSeen: '2026-01-01', ...over });
const priced = (input: number, output = input * 5): Model['pricing'] => ({ 'us-east-1': { regional: { standard: { input, output } } } });

describe('computeChanges', () => {
  it('finds added and removed models', () => {
    const c = computeChanges([model('a'), model('b')], [model('b'), model('c')]);
    expect(c.added.map((m) => m.id)).toEqual(['c']);
    expect(c.removed.map((m) => m.id)).toEqual(['a']);
  });
  it('reports a price move once per model, preferring us-east-1, and ignores new prices', () => {
    const prev = model('a', { pricing: { ...priced(1), 'eu-west-1': { regional: { standard: { input: 1.1, output: 5.5 } } } } });
    const next = model('a', { pricing: { ...priced(2), 'eu-west-1': { regional: { standard: { input: 1.1, output: 5.5 } } }, 'ap-south-1': { regional: { standard: { input: 9, output: 9 } } } } });
    const [p] = computeChanges([prev], [next]).priceChanges;
    expect(p.count).toBe(2); // input and output in us-east-1; the new ap-south-1 price is not a change
    expect(p.example).toMatchObject({ region: 'us-east-1', kind: 'input', from: 1, to: 2 });
  });
  it('does not flag unchanged data', () => {
    const m = model('a', { pricing: priced(1) });
    expect(computeChanges([m], [structuredClone(m)])).toEqual({ added: [], removed: [], priceChanges: [], availabilityChanges: [] });
  });
  it('reports availability growth per mode', () => {
    const av = (g: number) => Object.fromEntries(Array.from({ length: g }, (_, i) => [`r-${i}-1`, { runtime: 'G' }]));
    const [a] = computeChanges([model('a', { availability: av(2) })], [model('a', { availability: av(31) })]).availabilityChanges;
    expect(a.regionCounts).toEqual({ global: [2, 31] });
  });
});

describe('needsReview', () => {
  it('lists only models the history recorded as new, and says what is missing', () => {
    const fresh = model('new', { pricing: priced(1) });
    const legacy = model('legacy', { firstSeen: '2026-10-11' }); // recent firstSeen alone must not count (first week of a repo)
    const [r] = needsReview([fresh, legacy], new Set(['new']));
    expect(r.model.id).toBe('new');
    expect(r.todo.join(' ')).toMatch(/모델 카드/);
    expect(r.todo.join(' ')).toMatch(/context/);
    expect(needsReview([fresh, legacy], new Set(['new'])).length).toBe(1);
  });
  it('skips the benchmark note when no benchmarks exist at all', () => {
    const [r] = needsReview([model('new', { pricing: priced(1) })], new Set(['new']), false);
    expect(r.todo.join(' ')).not.toMatch(/벤치마크/);
  });
  it('says nothing about a fully covered new model', () => {
    const ok = model('new', { pricing: priced(1), card: { url: 'x' }, contextWindow: 1000, benchmarks: {} });
    expect(needsReview([ok], new Set(['new']))).toEqual([]);
  });
});

describe('sanityGuard', () => {
  const many = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `m${i}`, name: `M${i}`, provider: 'x' }));
  it('blocks a run that loses a tenth of the catalogue', () => {
    expect(sanityGuard({ added: [], removed: many(15), priceChanges: [], availabilityChanges: [] }, 100).ok).toBe(false);
  });
  it('blocks a price wave across half the models', () => {
    const wave = many(60).map((b) => ({ ...b, count: 1, example: { region: 'us-east-1', scope: 'regional' as const, kind: 'input' as const, from: 1, to: 2 } }));
    expect(sanityGuard({ added: [], removed: [], priceChanges: wave, availabilityChanges: [] }, 100).ok).toBe(false);
  });
  it('lets normal churn through, and small catalogues too', () => {
    expect(sanityGuard({ added: many(3), removed: many(2), priceChanges: [], availabilityChanges: [] }, 130).ok).toBe(true);
    expect(sanityGuard({ added: [], removed: many(5), priceChanges: [], availabilityChanges: [] }, 8).ok).toBe(true);
  });
});

describe('messages', () => {
  it('summarises a run in the commit message', () => {
    const c = computeChanges([model('a')], [model('a'), model('b'), model('c')]);
    expect(commitMessage(c)).toBe('data: +2 models (B, C)');
    expect(commitMessage({ added: [], removed: [], priceChanges: [], availabilityChanges: [] })).toBe('data: refresh Bedrock prices');
  });
  it('renders markdown', () => {
    expect(changesMarkdown(computeChanges([model('a')], [model('a'), model('b')]), '2026-10-11')).toContain('### New models (1)\n- B (Acme)');
  });
});
