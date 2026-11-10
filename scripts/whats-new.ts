import type { Model } from '../src/types.ts';

export interface FeedItem {
  guid: string;
  title: string;
  published: string;
  link: string;
  text: string;
}

/** One model an announcement says is now on Bedrock, as Haiku read it; `matchedId` is its guess at our model id. */
export interface AnnouncedModel {
  guid: string;
  name: string;
  provider?: string;
  matchedId?: string | null;
}

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
const tag = (xml: string, name: string) => decode(xml.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? '').trim();

/** The What's New RSS feed (about two weeks of items). Descriptions are HTML; only their text is kept. */
export function parseFeed(xml: string): FeedItem[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
    guid: tag(item, 'guid'),
    title: tag(item, 'title'),
    published: new Date(tag(item, 'pubDate')).toISOString(),
    link: tag(item, 'link'),
    // The description is HTML escaped inside XML, so its own entities ("&nbsp;") are still there after the XML decode.
    text: decode(tag(item, 'description').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(),
  }));
}

/** Bedrock items published after `since`. Most of the feed is other services, so this keeps the Haiku prompt small. */
export const recentBedrockItems = (items: FeedItem[], since: Date) =>
  items.filter((i) => new Date(i.published) >= since && /bedrock/i.test(`${i.title} ${i.text}`));

export interface Trigger {
  announced: AnnouncedModel;
  reason: 'not in data' | 'no benchmark';
  model?: Model;
}

/** A model announced twice (commercial and GovCloud launches) is kept once, keyed by its verified id or else its name. */
export function uniqueAnnouncements(announced: AnnouncedModel[], models: Model[]): AnnouncedModel[] {
  const ids = new Set(models.map((m) => m.id));
  const seen = new Set<string>();
  return announced.filter((a) => {
    const key = (a.matchedId && ids.has(a.matchedId) ? a.matchedId : a.name).toLowerCase();
    return !seen.has(key) && !!seen.add(key);
  });
}

/**
 * Which announced models the data refresh could still improve: not in models.json yet, or listed without benchmark scores.
 * Haiku's match is only trusted when the id exists, so a hallucinated id counts as "not in data" and still triggers.
 */
export function triggersFor(announced: AnnouncedModel[], models: Model[]): Trigger[] {
  const byId = new Map(models.map((m) => [m.id, m]));
  return announced.flatMap((a): Trigger[] => {
    const model = a.matchedId ? byId.get(a.matchedId) : undefined;
    if (!model) return [{ announced: a, reason: 'not in data' }];
    return model.benchmarks ? [] : [{ announced: a, reason: 'no benchmark', model }];
  });
}
