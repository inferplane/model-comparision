import { describe, expect, it } from 'vitest';
import { describeAvailability, describePrice, entriesWithin, parseChanges, recentlyAdded, type ChangeEntry } from './changes.ts';

const entry = (date: string, over: Partial<ChangeEntry> = {}): ChangeEntry => ({ date, added: [], removed: [], priceChanges: [], availabilityChanges: [], ...over });
const brief = (id: string) => ({ id, name: id.toUpperCase(), provider: 'Acme' });

describe('entriesWithin', () => {
  const entries = [entry('2026-09-01'), entry('2026-10-05'), entry('2026-10-11'), entry('2026-10-20')];
  it('keeps the window, drops future dates, and sorts newest first', () => {
    expect(entriesWithin(entries, '2026-10-11', 30).map((e) => e.date)).toEqual(['2026-10-11', '2026-10-05']);
  });
  it('includes the boundary day', () => {
    expect(entriesWithin([entry('2026-10-04')], '2026-10-11', 7)).toHaveLength(1);
    expect(entriesWithin([entry('2026-10-03')], '2026-10-11', 7)).toHaveLength(0);
  });
});

describe('recentlyAdded', () => {
  it('maps ids added inside the window to the day they were added', () => {
    const m = recentlyAdded([entry('2026-10-10', { added: [brief('a')] }), entry('2026-09-01', { added: [brief('old')] })], '2026-10-11', 14);
    expect([...m]).toEqual([['a', '2026-10-10']]);
  });
  it('keeps the latest date when a model was added twice', () => {
    const m = recentlyAdded([entry('2026-10-02', { added: [brief('a')] }), entry('2026-10-09', { added: [brief('a')] })], '2026-10-11');
    expect(m.get('a')).toBe('2026-10-09');
  });
});

describe('parseChanges', () => {
  it.each([null, undefined, 'x', 42, [], {}, { entries: 'no' }])('returns an empty history for %j', (raw) => {
    expect(parseChanges(raw).entries).toEqual([]);
  });
  it('drops malformed entries and items but keeps good ones', () => {
    const f = parseChanges({ updatedAt: '2026-10-11T00:00:00Z', entries: [{ date: 'yesterday' }, { date: '2026-10-10', added: [brief('a'), { id: 1 }, null], priceChanges: [{ nope: true }] }, 'junk'] });
    expect(f.updatedAt).toBe('2026-10-11T00:00:00Z');
    expect(f.entries).toHaveLength(1);
    expect(f.entries[0].added.map((m) => m.id)).toEqual(['a']);
    expect(f.entries[0].priceChanges).toEqual([]);
  });
});

describe('descriptions', () => {
  it('formats a price change with the extra count', () => {
    const p = { ...brief('a'), count: 3, example: { region: 'us-east-1', scope: 'regional' as const, kind: 'input' as const, from: 4.4, to: 4 } };
    expect(describePrice(p)).toBe('us-east-1 · In-region · Geo CRIS · Input: $4.40 → $4.00 (외 2건)');
  });
  it('formats availability growth per mode', () => {
    expect(describeAvailability({ ...brief('a'), regionCounts: { global: [2, 31] } })).toBe('Global CRIS 2 → 31개 리전');
  });
});
