import { mkdir, writeFile } from 'node:fs/promises';
import type { PriceEntry } from '../src/types.ts';
import { parsePriceList, type PriceListFile } from './parse-pricing.ts';

const HOST = 'https://pricing.us-east-1.amazonaws.com';
const SERVICES = ['AmazonBedrock', 'AmazonBedrockFoundationModels'] as const;

async function getJson<T>(path: string): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(HOST + path);
    if (res.ok) return (await res.json()) as T;
    if (attempt >= 3) throw new Error(`GET ${path} -> ${res.status}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
}

async function fetchService(service: (typeof SERVICES)[number]): Promise<PriceEntry[]> {
  const index = await getJson<{ regions: Record<string, { currentVersionUrl: string }> }>(
    `/offers/v1.0/aws/${service}/current/region_index.json`,
  );
  const regions = Object.values(index.regions);
  const entries: PriceEntry[] = [];
  // Region files are 0.5-1.5MB each; a small pool keeps memory flat and avoids hammering the endpoint.
  const queue = [...regions];
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let r = queue.shift(); r; r = queue.shift()) {
        const file = await getJson<PriceListFile>(r.currentVersionUrl);
        entries.push(...parsePriceList(service, file));
      }
    }),
  );
  console.log(`${service}: ${regions.length} regions, ${entries.length} price entries`);
  return entries;
}

const all = (await Promise.all(SERVICES.map(fetchService))).flat();
await mkdir('data/raw', { recursive: true });
await writeFile('data/raw/prices.json', JSON.stringify(all));
