import { describe, expect, it } from 'vitest';
import { parseParams, serializeParams, type UrlState } from './urlstate.ts';

const defaults: UrlState = { query: '', region: 'us-east-1', modes: ['in-region', 'geo'], tier: 'standard', provider: '', onlyCache: false, onlyInRegion: true, sort: { key: 'provider', dir: 1 }, chartY: 'intelligenceIndex', chartX: 'blend', rankMetric: 'intelligence', rankTop: 20, weights: '', reasoning: '', compare: [], expandCols: false };

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
