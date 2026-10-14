import { describe, expect, it } from 'vitest';
import { inferenceIds, rowModelId } from './data.ts';
import type { Model } from './types.ts';

const model = (over: Partial<Model>): Model => ({ id: 'x', name: 'X', provider: 'P', pricing: {}, regions: [], firstSeen: '2026-01-01', ...over });

describe('inferenceIds', () => {
  const gpt = model({
    modelId: 'openai.gpt-6.1-sol',
    availability: { 'us-east-1': { runtime: 'gG', mantle: 'i' }, 'us-west-2': { runtime: 'gG' }, 'eu-west-1': { runtime: 'G' } },
    geoSources: { us: ['us-east-1', 'us-east-2', 'us-west-2'] },
    geoPrefixes: ['us'],
  });
  it('gives the bare id in-region, the geo profile of the region, and the global profile', () => {
    expect(inferenceIds(gpt, 'us-east-1')).toEqual([
      { mode: 'in-region', id: 'openai.gpt-6.1-sol', via: 'mantle' },
      { mode: 'geo', id: 'us.openai.gpt-6.1-sol', via: undefined },
      { mode: 'global', id: 'global.openai.gpt-6.1-sol', via: undefined },
    ]);
    expect(inferenceIds(gpt, 'eu-west-1').map((x) => x.id)).toEqual(['global.openai.gpt-6.1-sol']);
  });
  it('picks the geo profile by the region name when the card lists no source regions', () => {
    const m = model({ modelId: 'a.b', availability: { 'eu-west-1': { runtime: 'g' }, 'us-east-1': { runtime: 'g' } }, geoPrefixes: ['us', 'eu'] });
    expect(inferenceIds(m, 'eu-west-1').map((x) => x.id)).toEqual(['eu.a.b']);
    expect(inferenceIds(m, 'us-east-1').map((x) => x.id)).toEqual(['us.a.b']);
  });
  it('leaves out a geo id it cannot place rather than guessing', () => {
    const m = model({ modelId: 'a.b', availability: { 'ap-northeast-1': { runtime: 'g' } }, geoPrefixes: ['jp', 'apac'] });
    expect(inferenceIds(m, 'ap-northeast-1')).toEqual([]);
  });
  it('does not offer the only geo prefix for a region outside its geography', () => {
    const m = model({ modelId: 'a.b', availability: { 'ap-northeast-1': { runtime: 'g' }, 'us-east-1': { runtime: 'g' } }, geoPrefixes: ['us'] });
    expect(inferenceIds(m, 'ap-northeast-1')).toEqual([]);
    expect(inferenceIds(m, 'us-east-1').map((x) => x.id)).toEqual(['us.a.b']);
  });
  it('places a single apac, jp or gov prefix by the region family', () => {
    const apac = model({ modelId: 'a.b', availability: { 'ap-southeast-1': { runtime: 'g' } }, geoPrefixes: ['apac'] });
    expect(inferenceIds(apac, 'ap-southeast-1').map((x) => x.id)).toEqual(['apac.a.b']);
    const gov = model({ modelId: 'a.b', availability: { 'us-gov-west-1': { runtime: 'g' } }, geoPrefixes: ['gov'] });
    expect(inferenceIds(gov, 'us-gov-west-1').map((x) => x.id)).toEqual(['gov.a.b']);
  });
  it('has nothing to offer without a model id', () => {
    expect(inferenceIds(model({ availability: { 'us-east-1': { runtime: 'i' } } }), 'us-east-1')).toEqual([]);
  });
});

describe('rowModelId', () => {
  const m = model({ modelId: 'a.b', availability: { 'us-east-1': { runtime: 'igG' } }, geoPrefixes: ['us'] });
  it('prefers the bare id for a regional row and the global profile for a Global row', () => {
    expect(rowModelId({ m, scope: 'regional', label: '', inferred: false }, 'us-east-1', ['in-region', 'geo', 'global'])).toBe('a.b');
    expect(rowModelId({ m, scope: 'regional', label: '', inferred: false }, 'us-east-1', ['geo'])).toBe('us.a.b');
    expect(rowModelId({ m, scope: 'global', label: '', inferred: false }, 'us-east-1', ['in-region', 'global'])).toBe('global.a.b');
  });
  it('prefers the Geo profile when in-region works only on bedrock-mantle', () => {
    const mantle = model({ modelId: 'a.b', availability: { 'us-east-1': { runtime: 'g', mantle: 'i' } }, geoPrefixes: ['us'] });
    expect(rowModelId({ m: mantle, scope: 'regional', label: '', inferred: false }, 'us-east-1', ['in-region', 'geo'])).toBe('us.a.b');
    expect(rowModelId({ m: mantle, scope: 'regional', label: '', inferred: false }, 'us-east-1', ['in-region'])).toBe('a.b');
  });
});
