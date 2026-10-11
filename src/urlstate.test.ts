import { describe, expect, it } from 'vitest';
import { METRICS, metricFor } from './metrics.ts';
import { parseParams, RANK_METRICS, sanitizeStored, serializeParams, type UrlState } from './urlstate.ts';

const defaults: UrlState = { query: '', region: 'us-east-1', modes: ['in-region', 'geo'], tier: 'standard', provider: '', onlyCache: false, onlyInRegion: true, sort: { key: 'provider', dir: 1 }, chartY: 'intelligenceIndex', chartX: 'blend', chartQuality: 'balanced', chartBudget: 0, chartOrder: 'value', chartLatest: false, rankMetric: 'intelligence', rankTop: 20, weights: '', reasoning: '', compare: [], expandCols: false };

describe('serializeParams', () => {
  it('leaves the default view with a clean URL', () => {
    expect(serializeParams(defaults, defaults)).toBe('');
  });
  it('writes only what differs', () => {
    const s = { ...defaults, region: 'ap-northeast-2', modes: ['global' as const], query: 'claude opus', compare: ['a', 'b'] };
    expect(serializeParams(s, defaults)).toBe('q=claude+opus&region=ap-northeast-2&modes=global&compare=a%2Cb');
  });
});

describe('parseParams', () => {
  it('preserves cost-performance requirements in shared views', () => {
    const view: UrlState = { ...defaults, chartQuality: 'strong', chartBudget: 1.25, chartOrder: 'price', chartLatest: true };
    expect({ ...defaults, ...parseParams(serializeParams(view, defaults)) }).toEqual(view);
  });
  it('rejects invalid budgets, quality floors and ranking modes', () => {
    for (const budget of ['-1', 'NaN', 'Infinity', '1e9', '1000001', '']) expect(parseParams(`budget=${budget}`)).toEqual({});
    expect(parseParams('quality=constructor&order=toString')).toEqual({});
    expect(parseParams('budget=0.125&quality=all&order=score')).toEqual({ chartBudget: 0.125, chartQuality: 'all', chartOrder: 'score' });
  });
  it('round-trips the full allowed budget range including high-precision values', () => {
    for (const chartBudget of [1_000_000, 0.0000001, 1.123456789]) {
      expect({ ...defaults, ...parseParams(serializeParams({ ...defaults, chartBudget }, defaults)) }.chartBudget).toBe(chartBudget);
    }
  });
  it('round-trips a non-default state', () => {
    const s: UrlState = { ...defaults, query: 'gpt', region: 'eu-west-2', modes: ['in-region', 'global'], tier: 'flex', provider: 'OpenAI', onlyCache: true, onlyInRegion: false, expandCols: true, sort: { key: 'ai', dir: -1 }, weights: 'open', reasoning: 'yes', rankMetric: 'speed', rankTop: 0, chartY: 'codingIndex', chartX: 'output', compare: ['claude-opus-5.5', 'gpt-6.1-sol'] };
    expect({ ...defaults, ...parseParams(serializeParams(s, defaults)) }).toEqual(s);
  });
  it('drops malformed values instead of trusting them', () => {
    expect(parseParams('region=../../etc&modes=nope&tier=free&sort=x&top=999&cx=evil&compare=%3Cscript%3E,ok-id&metric=a b')).toEqual({ compare: ['ok-id'] });
  });
  it('caps the compare list and removes duplicates', () => {
    expect(parseParams('compare=a,a,b,c,d,e,f,g,h').compare).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });
  it('orders modes canonically so the same selection always gives the same link', () => {
    expect(parseParams('modes=global,in-region').modes).toEqual(['in-region', 'global']);
  });
});

describe('prototype keys', () => {
  // These all match the word-shaped regexes but resolve to Object.prototype members when used as a lookup key.
  it.each(['constructor', 'toString', 'hasOwnProperty', 'valueOf', 'isPrototypeOf'])('ignores %s as metric, chart axis, and sort key', (key) => {
    expect(parseParams(`metric=${key}&cy=${key}&sort=${key.toLowerCase().slice(0, 10)}.asc`)).toEqual({});
  });
  it('metricFor never returns a prototype member', () => {
    for (const key of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) expect(metricFor(key).key).toBe('intelligence');
  });
  it('keeps the metric allowlist in sync with the real metric table', () => {
    for (const key of RANK_METRICS) expect(key === 'price' || Object.hasOwn(METRICS, key)).toBe(true);
  });
});

describe('sanitizeStored', () => {
  it('drops bad values saved from an earlier crafted link and keeps good ones', () => {
    const saved = { region: 'eu-west-2', rankMetric: 'constructor', chartY: 'toString', modes: ['geo'], tier: 'evil', compare: ['a', '<x>'], query: 'leak' };
    expect(sanitizeStored(saved, defaults)).toEqual({ ...defaults, region: 'eu-west-2', modes: ['geo'], compare: ['a'] });
  });
  it('survives junk', () => {
    expect(sanitizeStored(null, defaults)).toEqual(defaults);
    expect(sanitizeStored('x', defaults)).toEqual(defaults);
  });
});
