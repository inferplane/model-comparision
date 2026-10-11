import { describe, expect, it } from 'vitest';
import { matches } from './data.ts';
import { collectValuePoints, filterValuePoints, rankValuePoints } from './value.ts';
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
    expect(collectValuePoints([sol, other], { ...opts, provider: 'OpenAI', query: 'gpt-6-1-sol', onlyCache: true }).map((p) => p.m.id)).toEqual(['gpt-6.1-sol']);
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
