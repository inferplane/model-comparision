import type { Availability } from '../src/types.ts';

/** What one AWS Bedrock model card (docs.aws.amazon.com/bedrock/.../model-card-*.md) tells us. */
export interface CardRecord {
  slug: string;
  title: string;
  vendor: string;
  /** Bedrock model ids from the Programmatic Access table (bare ids, no CRIS prefix). */
  modelIds: string[];
  contextWindow?: number;
  maxOutput?: number;
  lifecycle?: string;
  launchDate?: string;
  eolDate?: string;
  availability: Availability;
  /** Where `availability` came from: the consolidated regions page (complete) or the card's own tables. */
  availabilitySource?: 'region-page' | 'card';
  /** Earliest per-region EOL date from the regions page. */
  eol?: Record<string, string>;
  /** Geo CRIS prefixes (us, eu, jp…) seen in the geo inference ids. */
  geoPrefixes: string[];
  /** Source regions per Geo profile, from the "Geo: US" style tables. */
  geoSources: Record<string, string[]>;
  prices: CardPrice[];
}

export interface CardPrice {
  scope: 'regional' | 'global';
  /** Row label as printed, e.g. "US CRIS (bedrock-runtime)". */
  label: string;
  long: boolean;
  /** Prompt size above which the long-context row applies, from the heading. */
  thresholdTokens?: number;
  input?: number;
  cacheWrite?: number;
  cacheRead?: number;
  output?: number;
}

const YES = 'icon-yes';
// A few cards use alternate section titles and spell availability out as text instead of icons.
const AVAIL = 'Regional Availability|Supported Regions';
const PROG = 'Programmatic Access|Call the model';

/** "1M tokens" / "272K" / "131,072 tokens" / "10M" -> number. */
export function parseTokens(s: string): number | undefined {
  const m = /([\d.,]+)\s*([KkMm])?/.exec(s);
  if (!m) return undefined;
  const n = Number(m[1].replace(/,/g, ''));
  if (!Number.isFinite(n)) return undefined;
  const unit = m[2]?.toLowerCase();
  return Math.round(n * (unit === 'm' ? 1_000_000 : unit === 'k' ? 1_000 : 1));
}

const section = (md: string, title: string): string => new RegExp(`^## (?:${title})[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'mi').exec(md)?.[1] ?? '';

function rows(table: string): string[][] {
  return table
    .split('\n')
    .filter((l) => l.startsWith('|'))
    .map((l) => l.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim()))
    .filter((cells) => !cells.every((c) => /^-+$/.test(c)));
}

/** First markdown table at or after `from`. */
function tableAfter(md: string, from: number): string {
  const rest = md.slice(from);
  const start = rest.search(/^\|/m);
  if (start < 0) return '';
  const lines: string[] = [];
  for (const l of rest.slice(start).split('\n')) {
    if (!l.startsWith('|')) break;
    lines.push(l);
  }
  return lines.join('\n');
}

const flag = (cell: string) => cell.includes(YES) || /^supported$/i.test(cell);

function parseAvailability(md: string, geoSources: Record<string, string[]>): Availability {
  const sec = section(md, AVAIL);
  const out: Availability = {};
  const geoRegions = [...new Set(Object.values(geoSources).flat())];
  // Older cards have a single unlabeled table (bedrock-runtime); newer ones label one table per endpoint.
  const labeled = /`bedrock-(?:runtime|mantle)` endpoint\*\*/.test(sec);
  for (const [endpoint, key] of [['bedrock-runtime', 'runtime'], ['bedrock-mantle', 'mantle']] as const) {
    const at = labeled ? sec.search(new RegExp('`' + endpoint + '` endpoint\\*\\*')) : key === 'runtime' ? 0 : -1;
    if (at < 0) continue;
    const t = rows(tableAfter(sec, at));
    const header = t[0]?.map((c) => c.replace(/\*/g, '').toLowerCase()) ?? [];
    const find = (re: RegExp) => header.findIndex((h) => re.test(h));
    const [iIn, iGeo, iGlobal] = [find(/in-region/), find(/geo/), find(/global/)];
    for (const cells of t.slice(1)) {
      const flags = (iIn >= 0 && flag(cells[iIn]) ? 'i' : '') + (iGeo >= 0 && flag(cells[iGeo]) ? 'g' : '') + (iGlobal >= 0 && flag(cells[iGlobal]) ? 'G' : '');
      if (/region/.test(header[0] ?? '')) {
        const region = /^([a-z]{2}(?:-[a-z]+)+-\d)/.exec(cells[0])?.[1];
        if (region && flags) (out[region] ??= {})[key] = flags;
      } else if (flags) {
        // A "Scope" row ("US geographic and global inference") is not per region; spread it over the geo source regions.
        for (const region of geoRegions) {
          const have = out[region]?.[key] ?? '';
          (out[region] ??= {})[key] = [...new Set((have + flags).split(''))].join('');
        }
      }
    }
  }
  return out;
}

function parseGeoSources(md: string): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  const re = /\*\*Geo: ([^*]+)\*\*\s*\n+Geo [Ii]nference ID: `([^`]+)`/g;
  for (let m = re.exec(md); m; m = re.exec(md)) {
    const prefix = m[2].split('.')[0];
    const table = rows(tableAfter(md, m.index + m[0].length));
    out[prefix] = table.slice(1).map((c) => /^([a-z]{2}(?:-[a-z]+)+-\d)/.exec(c[0])?.[1]).filter((r): r is string => !!r);
  }
  return out;
}

const money = (s: string | undefined) => {
  const m = s && /\$\s*([\d.,]+)/.exec(s);
  return m ? Number(m[1].replace(/,/g, '')) : undefined;
};

function parsePrices(md: string): CardPrice[] {
  const sec = section(md, 'Pricing');
  const out: CardPrice[] = [];
  const parts = sec.split(/^### /m).slice(1);
  for (const part of parts) {
    const heading = part.split('\n')[0];
    // Only the standard commercial tables feed the site; GovCloud and non-standard tiers (Ultrafast…) are separate offers.
    if (/GovCloud|Ultrafast|Priority|Flex/i.test(heading) || !/Commercial/i.test(heading)) continue;
    const long = /more than/i.test(heading);
    const thresholdTokens = parseTokens(/(?:more than|or fewer)/i.test(heading) ? (/([\d.,]+\s*[KM])\s*input/i.exec(heading)?.[1] ?? '') : '');
    const t = rows(tableAfter(part, 0));
    const header = t[0]?.map((c) => c.replace(/\*/g, '').toLowerCase()) ?? [];
    const col = (re: RegExp) => header.findIndex((h) => re.test(h));
    const [cIn, cW, cR, cOut] = [col(/^input$/), col(/cache write/), col(/cache read/), col(/^output$/)];
    for (const cells of t.slice(1)) {
      out.push({
        scope: /global/i.test(cells[0]) ? 'global' : 'regional',
        label: cells[0],
        long,
        thresholdTokens,
        input: money(cells[cIn]),
        cacheWrite: money(cells[cW]),
        cacheRead: money(cells[cR]),
        output: money(cells[cOut]),
      });
    }
  }
  return out;
}

export function parseCard(slug: string, md: string): CardRecord {
  const details = section(md, 'Model [Dd]etails');
  const line = (label: string) => new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n]+)`, 'i').exec(details)?.[1].trim();
  const header = /^## !\[[^\]]*\]\([^)]*\)\s*(.+?)\s+—\s+(.+)$/m.exec(md);
  const geoSources = parseGeoSources(md);

  // Programmatic Access: bare model ids and geo profile ids.
  const prog = section(md, PROG);
  const modelIds: string[] = [];
  const geoPrefixes = new Set(Object.keys(geoSources));
  for (const cells of rows(tableAfter(prog, 0)).slice(1)) {
    const id = /[a-z0-9-]+\.[a-z0-9.:_-]+/i.exec(cells[1] ?? '')?.[0];
    if (id && !modelIds.includes(id)) modelIds.push(id);
    for (const g of (cells[3] ?? '').matchAll(/`?\b([a-z]{2,6})\.[a-z0-9-]+\.[a-z0-9.:_-]+/gi)) geoPrefixes.add(g[1]);
  }

  return {
    slug,
    title: (/^# (.+)$/m.exec(md)?.[1].trim() ?? slug).replace(/\\(.)/g, '$1'), // markdown escapes such as "Command R\+"
    vendor: header?.[1] ?? '',
    modelIds,
    contextWindow: parseTokens(line('Context window') ?? ''),
    maxOutput: parseTokens(line('Max output tokens') ?? ''),
    lifecycle: line('Model lifecycle'),
    launchDate: line('Model launch date'),
    eolDate: line('Model EOL date'),
    availability: parseAvailability(md, geoSources),
    geoPrefixes: [...geoPrefixes],
    geoSources,
    prices: parsePrices(md),
  };
}
