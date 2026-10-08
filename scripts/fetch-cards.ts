import { mkdir, writeFile } from 'node:fs/promises';
import { parseCard, type CardRecord } from './parse-card.ts';
import { parseRegionPage } from './parse-regions.ts';

const BASE = 'https://docs.aws.amazon.com/bedrock/latest/userguide';

async function get(url: string): Promise<string> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
      if (attempt >= 3) throw new Error(`${res.status}`);
    } catch (e) {
      if (attempt >= 3) throw new Error(`GET ${url}: ${(e as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, 800 * attempt));
  }
}

// The cards index links every model card page; each page is also served as raw markdown at the same path with .md.
const index = await get(`${BASE}/model-cards.html`);
const slugs = [...new Set([...index.matchAll(/model-card-[a-z0-9.-]+(?=\.html)/g)].map((m) => m[0]))];
if (!slugs.length) throw new Error('model-cards index lists no model cards; has the page layout changed?');

const records: CardRecord[] = [];
const failed: string[] = [];
const queue = [...slugs];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let slug = queue.shift(); slug; slug = queue.shift()) {
      try {
        records.push(parseCard(slug, await get(`${BASE}/${slug}.md`)));
      } catch (e) {
        failed.push(`${slug} (${(e as Error).message})`);
      }
    }
  }),
);
records.sort((a, b) => a.slug.localeCompare(b.slug));

// The consolidated "Regional availability by models" page lists every model's per-region options in one uniform table,
// including global availability that scope-style cards leave out. Prefer it; keep the card's own tables as the fallback.
let fromPage = 0;
try {
  const regions = parseRegionPage(await get(`${BASE}/models-region-compatibility.md`));
  for (const r of records) {
    const e = regions[r.slug];
    if (!e) {
      r.availabilitySource = 'card';
      continue;
    }
    r.availability = e.availability;
    r.eol = e.eol;
    r.availabilitySource = 'region-page';
    fromPage++;
  }
} catch (e) {
  console.warn(`regions page unavailable, using per-card availability: ${(e as Error).message}`);
  for (const r of records) r.availabilitySource = 'card';
}
await mkdir('data/raw', { recursive: true });
await writeFile('data/raw/cards.json', JSON.stringify(records));
const withAvail = records.filter((r) => Object.keys(r.availability).length).length;
console.log(`model cards: ${records.length}/${slugs.length} fetched, ${withAvail} with availability (${fromPage} from the regions page)${failed.length ? `, FAILED: ${failed.join('; ')}` : ''}`);
// A few missing cards only degrade the site to models.dev fallbacks, but losing most of them means the page layout changed.
if (failed.length > slugs.length * 0.3) throw new Error('more than 30% of model cards failed to load');
