import { describe, expect, it } from 'vitest';
import { matches } from './data.ts';
import { collectValuePoints, filterValuePoints, isRecentModel, launchTime, rankValuePoints, valueExclusions } from './value.ts';
import type { Model } from './types.ts';

const model = (id: string, score: number | undefined, price: number): Model => ({
  id, name: id, provider: 'Example', firstSeen: '2026-10-11', regions: ['us-east-1'], modes: ['in-region'],
  pricing: { 'us-east-1': { regional: { standard: { input: price, output: price } } } },
  benchmarks: score === undefined ? undefined : { intelligenceIndex: score },
});
const opts = { region: 'us-east-1', modes: ['in-region' as const], tier: 'standard' as const, chartX: 'blend' as const, chartY: 'intelligenceIndex' as const, pct: false };

describe('cost-performance data', () => {
  it('excludes absent or invalid scores and nonpositive prices instead of producing fabricated rankings', () => {
    const points = collectValuePoints([model('measured', 10, 2), model('missing', undefined, 1), model('nan', NaN, 1), model('negative', -1, 1), model('free', 20, 0), model('bad-price', 20, Infinity)], opts);
    expect(points.map((p) => p.m.id)).toEqual(['measured']);
    expect(points[0].value).toBe(5);
  });
  it('keeps equally priced and equally scored alternatives on the frontier', () => {
    const points = collectValuePoints([model('a', 10, 1), model('b', 10, 1), model('worse-same-price', 9, 1), model('equal-but-dearer', 10, 2), model('better', 20, 2)], opts);
    expect(points.filter((p) => p.frontier).map((p) => p.m.id)).toEqual(['a', 'b', 'better']);
  });
  it('applies provider, tolerant search and cache requirements before ranking', () => {
    const sol = model('gpt-6.1-sol', 52, 3);
    sol.provider = 'OpenAI';
    sol.pricing['us-east-1'].regional!.standard!.cacheRead = 0.1;
    const other = model('other', 50, 2);
    expect(collectValuePoints([sol, other], { ...opts, providers: ['OpenAI'], query: 'gpt-6-1-sol', onlyCache: true }).map((p) => p.m.id)).toEqual(['gpt-6.1-sol']);
    // Two providers keep both vendors' models; an empty list keeps everything.
    expect(collectValuePoints([sol, other], { ...opts, providers: ['OpenAI', 'Example'] }).map((p) => p.m.id).sort()).toEqual([other.id, sol.id].sort());
    expect(collectValuePoints([sol, other], { ...opts, providers: [] })).toHaveLength(collectValuePoints([sol, other], { ...opts, providers: ['OpenAI', 'Example'] }).length);
    expect(collectValuePoints([other], { ...opts, onlyCache: true })).toEqual([]);
  });
  it('ranks value, price and performance as distinct user choices', () => {
    const points = collectValuePoints([model('cheap', 5, 1), model('balanced', 20, 2), model('strong', 50, 10)], opts);
    expect(rankValuePoints(points, 'value')[0].m.id).toBe('balanced');
    expect(rankValuePoints(points, 'price')[0].m.id).toBe('cheap');
    expect(rankValuePoints(points, 'score')[0].m.id).toBe('strong');
  });
  it('holds the regional performance baseline fixed while filtering and uses inclusive budgets', () => {
    const points = collectValuePoints([model('weak', 20, 1), model('fits', 75, 2), model('expensive', 90, 3)], opts);
    expect(filterValuePoints(points, 100, 'strong', 2).map((p) => p.m.id)).toEqual(['fits']);
    expect(filterValuePoints(points, 100, 'best', 2)).toEqual([]);
    expect(filterValuePoints(points, 100, 'all', 0)).toHaveLength(3);
  });
  it('uses the selected regional and global prices separately', () => {
    const m = model('scope-model', 20, 2);
    m.modes = ['in-region', 'global'];
    m.pricing['us-east-1'].global = { standard: { input: 1, output: 1 } };
    const points = collectValuePoints([m], { ...opts, modes: ['in-region', 'global'] });
    expect(points.map((p) => [p.priceScope, p.x, p.value, p.frontier])).toEqual([['global', 1, 20, true], ['regional', 2, 10, false]]);
  });
  it('keeps percentage benchmarks in percentage points and rejects invalid fractions', () => {
    const m = model('fraction', 0.5, 2);
    expect(collectValuePoints([m], { ...opts, pct: true })[0]).toMatchObject({ y: 50, value: 25 });
    expect(collectValuePoints([model('invalid-fraction', 1.5, 2)], { ...opts, pct: true })).toEqual([]);
  });
});

describe('model search spelling', () => {
  const sol = { ...model('gpt-6.1-sol', 52, 3), name: 'GPT-6.1 Sol', provider: 'OpenAI' };
  it('matches dotted versions, website slugs and human names', () => {
    for (const q of ['gpt-6-1-sol', 'gpt-6.1-sol', 'GPT 6.1 Sol', 'OpenAI sol']) expect(matches(sol, q)).toBe(true);
  });
  it('does not match a different version or punctuation-only terms as arbitrary models', () => {
    expect(matches(sol, 'gpt-5-1-sol')).toBe(false);
    expect(matches(sol, '!!!')).toBe(false);
  });
});

describe('verified recent launches', () => {
  const now = Date.UTC(2026, 9, 11, 23, 59);
  const launched = (date?: string): Model => ({ ...model('recent', 52, 3), card: date ? { url: 'https://example.com/card', launchDate: date } : undefined });
  it('recognizes actual AWS English and ISO dates without relying on locale parsing', () => {
    expect(launchTime(launched('September 28, 2026'))).toBe(Date.UTC(2026, 8, 28));
    expect(launchTime(launched('2026-10-07'))).toBe(Date.UTC(2026, 9, 7));
  });
  it('keeps exactly 60 UTC calendar days and excludes future dates', () => {
    expect(isRecentModel(launched('2026-08-13'), now)).toBe(true);
    expect(isRecentModel(launched('2026-08-12'), now)).toBe(false);
    expect(isRecentModel(launched('2026-10-11'), now)).toBe(true);
    expect(isRecentModel(launched('2026-10-12'), now)).toBe(false);
  });
  it('does not turn a newly observed old model or an invalid date into a recent release', () => {
    expect(isRecentModel(launched(), now)).toBe(false);
    expect(isRecentModel(launched('June 1, 2025'), now)).toBe(false);
    expect(launchTime(launched('February 31, 2026'))).toBeUndefined();
    expect(launchTime(launched('unknown'))).toBeUndefined();
  });
});

describe('why a model is excluded', () => {
  it('separates region/mode exclusions from missing scores and pricing', () => {
    const global = model('sonnet-5.5', 56, 3);
    global.availability = { 'us-east-1': { runtime: 'G' } };
    const missing = model('unmeasured', undefined, 2);
    const unpriced = model('no-price', 50, 2);
    unpriced.pricing = {};
    expect(valueExclusions([global, missing, unpriced], opts, 60, 'all', 0).map((e) => [e.m.id, e.reason])).toEqual([
      ['sonnet-5.5', 'inference'], ['unmeasured', 'benchmark'], ['no-price', 'price'],
    ]);
  });
  it('explains provider and cache requirements without replacing actual data', () => {
    const vendor = { ...model('other-provider', 52, 3), provider: 'Other' };
    const noCache = model('no-cache', 52, 3);
    expect(valueExclusions([vendor, noCache], { ...opts, providers: ['Example'], onlyCache: true }, 60, 'all', 0).map((e) => e.reason)).toEqual(['provider', 'cache']);
  });
  it('identifies performance and unit-price requirements separately', () => {
    const low = model('gpt-6-luna', 38.1, 0.18);
    const expensive = model('grok-4.7', 46.4, 3.08);
    expect(valueExclusions([low, expensive], opts, 57.6, 'strong', 3).map((e) => [e.m.id, e.reason])).toEqual([
      ['gpt-6-luna', 'quality'], ['grok-4.7', 'budget'],
    ]);
  });
  it('uses the exact threshold rather than a rounded display value at the boundary', () => {
    const sol = model('gpt-6.1-sol', 51.8, 3.6);
    expect(valueExclusions([sol], opts, 57.6, 'best', 0)[0]).toMatchObject({ reason: 'quality', score: 51.8 });
  });
  it('does not say a model is excluded when any selected price scope meets the budget', () => {
    const grok = model('grok-4.7', 46.4, 3.08);
    grok.modes = ['in-region', 'global'];
    grok.pricing['us-east-1'].global = { standard: { input: 2.8, output: 2.8 } };
    expect(valueExclusions([grok], { ...opts, modes: ['in-region', 'global'] }, 60, 'all', 3)).toEqual([]);
  });
});
