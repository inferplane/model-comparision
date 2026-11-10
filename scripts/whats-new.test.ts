import { describe, expect, it } from 'vitest';
import type { Model } from '../src/types.ts';
import { parseFeed, recentBedrockItems, triggersFor, uniqueAnnouncements } from './whats-new.ts';

const item = (guid: string, title: string, date: string, body: string) =>
  `<item><guid isPermaLink="false">${guid}</guid><title>${title}</title><description>&lt;p&gt;${body}&amp;nbsp;&lt;/p&gt;</description><pubDate>${date}</pubDate><link>https://aws.amazon.com/about-aws/whats-new/2026/11/${guid}/</link></item>`;
const feed = `<?xml version="1.0"?><rss><channel><title>Recent Announcements</title>${[
  item('kimi', 'Kimi K3.1 Pro (Highspeed) now available on Amazon Bedrock', 'Fri, 06 Nov 2026 22:47:00 GMT', 'Today, Kimi K3.1 Pro from Moonshot AI is available on Amazon Bedrock'),
  item('s3', 'Amazon S3 Access Points for Amazon FSx', 'Mon, 09 Nov 2026 08:00:00 GMT', 'Access points in more Regions'),
  item('fable', 'Claude Fable 5.2 is now available on AWS', 'Mon, 09 Nov 2026 15:00:00 GMT', 'Visit the Amazon Bedrock console'),
].join('')}</channel></rss>`;

const model = (id: string, scored: boolean): Model => ({ id, name: id, provider: 'X', pricing: {}, regions: [], firstSeen: '2026-11-01', ...(scored ? { benchmarks: { intelligenceIndex: 50 } } : {}) });

describe("What's New feed", () => {
  it('reads items with decoded, tag-free text and ISO dates', () => {
    const [kimi] = parseFeed(feed);
    expect(kimi).toEqual({
      guid: 'kimi',
      title: 'Kimi K3.1 Pro (Highspeed) now available on Amazon Bedrock',
      published: '2026-11-06T22:47:00.000Z',
      link: 'https://aws.amazon.com/about-aws/whats-new/2026/11/kimi/',
      text: 'Today, Kimi K3.1 Pro from Moonshot AI is available on Amazon Bedrock',
    });
  });
  it('keeps only Bedrock items inside the lookback window', () => {
    expect(recentBedrockItems(parseFeed(feed), new Date('2026-11-08T00:00:00Z')).map((i) => i.guid)).toEqual(['fable']);
    expect(recentBedrockItems(parseFeed(feed), new Date('2026-11-01T00:00:00Z')).map((i) => i.guid)).toEqual(['kimi', 'fable']);
  });
});

describe('refresh triggers', () => {
  const models = [model('kimi-k3', true), model('claude-fable-5.2', false)];
  it('triggers for a model missing from the data and for one without benchmarks', () => {
    const triggers = triggersFor([{ guid: 'kimi', name: 'Kimi K3.1 Pro', matchedId: null }, { guid: 'fable', name: 'Claude Fable 5.2', matchedId: 'claude-fable-5.2' }], models);
    expect(triggers.map((t) => [t.announced.name, t.reason])).toEqual([['Kimi K3.1 Pro', 'not in data'], ['Claude Fable 5.2', 'no benchmark']]);
  });
  it('does not trigger for a covered model, and does not trust an id that is not in the data', () => {
    expect(triggersFor([{ guid: 'kimi', name: 'Kimi K3', matchedId: 'kimi-k3' }], models)).toEqual([]);
    expect(triggersFor([{ guid: 'kimi', name: 'Kimi K3.1', matchedId: 'kimi-k3.1' }], models)[0].reason).toBe('not in data');
  });
  it('lists a model announced twice once', () => {
    const fable = (guid: string) => ({ guid, name: 'Claude Fable 5.2', matchedId: 'claude-fable-5.2' });
    expect(uniqueAnnouncements([fable('fable'), fable('fable-govcloud'), { guid: 'kimi', name: 'Kimi K3.1 Pro', matchedId: null }], models).map((a) => a.guid)).toEqual(['fable', 'kimi']);
  });
});
