import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { allRegions, blended, longPriceOf, MODE_LABEL, MODES, priceOf, supports, tokens, usd } from '../src/data.ts';
import type { Mode, Model, Scope } from '../src/types.ts';

/**
 * Static, JavaScript-free views of the model data for AI agents (Claude, Codex, ...): a markdown comparison per region,
 * an HTML twin, a long-format price CSV, and /llms.txt. The site itself is a client-rendered SPA, which a plain fetch cannot read.
 */
const SITE = (process.env.SITE_URL ?? 'https://inferplane.github.io/model-comparision').replace(/\/$/, '');
const DEFAULT_REGION = 'us-east-1';

const { generatedAt, models } = JSON.parse(await readFile('public/data/models.json', 'utf8')) as { generatedAt: string; models: Model[] };
const date = generatedAt.slice(0, 10);
const regions = allRegions(models).filter((r) => !r.startsWith('us-gov'));
const num = (n: number | undefined, f: (v: number) => string = (v) => v.toFixed(1)) => (n === undefined ? '-' : f(n));
const pair = (a?: number, b?: number) => (a === undefined && b === undefined ? '-' : `${a === undefined ? '-' : usd(a)} / ${b === undefined ? '-' : usd(b)}`);

interface Entry {
  m: Model;
  region: string;
  /** Which of the three invocation options work in this region, with the endpoint note, e.g. "In-region (mantle)". */
  modes: Record<Mode, string | undefined>;
  price: Record<Scope, { input?: number; output?: number; cacheRead?: number; cacheWrite?: number; longIn?: number; longOut?: number }>;
  /** Cheapest 4:1 blended price across the scopes that work here. */
  cheapest?: number;
}

function entryFor(m: Model, region: string): Entry | undefined {
  const modes = {} as Entry['modes'];
  let any = false;
  for (const mode of MODES) {
    const s = supports(m, mode, region);
    modes[mode] = s.ok ? (s.via ? `yes (${s.via} endpoint only)` : s.inferred ? 'yes?' : 'yes') : undefined;
    any ||= s.ok;
  }
  if (!any) return undefined;
  const p = (scope: Scope) => ({
    input: priceOf(m, region, scope, 'standard', 'input'),
    output: priceOf(m, region, scope, 'standard', 'output'),
    cacheRead: priceOf(m, region, scope, 'standard', 'cacheRead'),
    cacheWrite: priceOf(m, region, scope, 'standard', 'cacheWrite'),
    longIn: longPriceOf(m, region, scope, 'standard', 'input'),
    longOut: longPriceOf(m, region, scope, 'standard', 'output'),
  });
  const price = { regional: p('regional'), global: p('global') };
  const usable: Scope[] = [...(modes['in-region'] || modes.geo ? (['regional'] as const) : []), ...(modes.global ? (['global'] as const) : [])];
  const blends = usable.map((s) => blended(price[s].input, price[s].output)).filter((v): v is number => v !== undefined);
  return { m, region, modes, price, cheapest: blends.length ? Math.min(...blends) : undefined };
}

const threshold = (m: Model) => (m.longContext?.thresholdTokens ? `>${tokens(m.longContext.thresholdTokens)}` : m.longContext ? '>?' : '');
const eol = (m: Model, region: string) => m.availabilityEol?.[region] ?? (m.card?.eolDate ? m.card.eolDate : '');
const ptag = (m: Model) => (m.priceSource === 'model-card' ? ' [price: model card]' : m.priceSource === 'override' ? ' [price: manual]' : '');

const COLUMNS = ['Model', 'Provider', 'In-region', 'Geo CRIS', 'Global CRIS', 'Context', 'Max out', 'Intelligence', 'Coding', 'tok/s', 'Regional in/out', 'Regional cache read/write', 'Global in/out', 'Global cache read/write', 'Long-context (regional in/out)', 'EOL'];

function cells(e: Entry): string[] {
  const { m, price: p } = e;
  const long = p.regional.longIn !== undefined || p.regional.longOut !== undefined ? `${threshold(m)} ${pair(p.regional.longIn, p.regional.longOut)}` : p.global.longIn !== undefined ? `${threshold(m)} global ${pair(p.global.longIn, p.global.longOut)}` : '-';
  const b = m.benchmarks;
  return [
    m.name + ptag(m), m.provider,
    e.modes['in-region'] ?? 'no', e.modes.geo ?? 'no', e.modes.global ?? 'no',
    tokens(m.contextWindow), tokens(m.maxOutput),
    num(b?.intelligenceIndex), num(b?.codingIndex), b?.outputTokensPerSecond ? String(Math.round(b.outputTokensPerSecond)) : '-',
    pair(p.regional.input, p.regional.output), pair(p.regional.cacheRead, p.regional.cacheWrite),
    pair(p.global.input, p.global.output), pair(p.global.cacheRead, p.global.cacheWrite),
    long, eol(m, e.region) || '-',
  ];
}

function entriesFor(region: string): Entry[] {
  return models.map((m) => entryFor(m, region)).filter((e): e is Entry => !!e).sort((a, b) => a.m.provider.localeCompare(b.m.provider) || a.m.name.localeCompare(b.m.name));
}

/** Models no other model beats on both price and Intelligence Index (the cost/performance frontier). */
function frontier(entries: Entry[]): Entry[] {
  const pts = entries.filter((e) => e.cheapest !== undefined && e.m.benchmarks?.intelligenceIndex !== undefined).sort((a, b) => a.cheapest! - b.cheapest! || b.m.benchmarks!.intelligenceIndex! - a.m.benchmarks!.intelligenceIndex!);
  const out: Entry[] = [];
  let best = -Infinity;
  for (const e of pts) if (e.m.benchmarks!.intelligenceIndex! > best) { out.push(e); best = e.m.benchmarks!.intelligenceIndex!; }
  return out;
}

const mdRow = (c: string[]) => `| ${c.join(' | ')} |`;

function regionMarkdown(region: string): string {
  const entries = entriesFor(region);
  const top = [...entries].filter((e) => e.m.benchmarks?.intelligenceIndex !== undefined).sort((a, b) => b.m.benchmarks!.intelligenceIndex! - a.m.benchmarks!.intelligenceIndex!).slice(0, 12);
  const front = frontier(entries);
  const line = (e: Entry) => `- ${e.m.name} (${e.m.provider}): Intelligence ${num(e.m.benchmarks?.intelligenceIndex)}, cheapest 4:1 blended ${e.cheapest === undefined ? '-' : usd(e.cheapest)} per 1M tokens`;
  return `# Amazon Bedrock model comparison: ${region}

Generated ${date} from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: ${SITE}/ . This file lists the ${entries.length} models that can be invoked from **${region}** by at least one method. Other regions: ${SITE}/ai/ . Per-region prices for every model: ${SITE}/ai/prices.csv . Full data: ${SITE}/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in ${region}; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding are Artificial Analysis indices (higher is better); tok/s is median output speed. Missing for models Artificial Analysis does not cover. Public-page measurement fallbacks include their source and verification date in models.json.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.

## Highest Intelligence Index available in ${region}

${top.map(line).join('\n') || '(no benchmark data)'}

## Cost/performance frontier in ${region}

No other model here is both cheaper and higher scoring than these (sorted by price):

${front.map(line).join('\n') || '(no benchmark data)'}

## All models

${mdRow(COLUMNS)}
${mdRow(COLUMNS.map(() => '---'))}
${entries.map((e) => mdRow(cells(e))).join('\n')}
`;
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
}

function regionHtml(region: string, md: string): string {
  const entries = entriesFor(region);
  const body = entries.map((e) => `<tr>${cells(e).map((c, i) => `<${i ? 'td' : 'th scope="row"'}>${esc(c)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bedrock model comparison (${region})</title>
<meta name="description" content="Static, machine-readable comparison of Amazon Bedrock models: prices, context windows, in-region/geo/global availability, benchmarks.">
<link rel="alternate" type="text/markdown" href="${SITE}/ai/${region === DEFAULT_REGION ? 'models.md' : `regions/${region}.md`}">
<style>body{font:14px/1.5 system-ui,sans-serif;margin:16px;max-width:none}table{border-collapse:collapse;font-size:12.5px}th,td{border:1px solid #ccc;padding:3px 8px;text-align:left;white-space:nowrap}thead th{background:#f3f3f3}</style>
</head>
<body>
<h1>Amazon Bedrock model comparison: ${region}</h1>
<p>Generated ${date}. Plain-text version for AI agents: <a href="${SITE}/ai/${region === DEFAULT_REGION ? 'models.md' : `regions/${region}.md`}">markdown</a>. Index of all files: <a href="${SITE}/llms.txt">llms.txt</a>. Interactive site: <a href="${SITE}/">${SITE}/</a>.</p>
<h2>How to read this</h2>
<ul>${md.split('## How to read this')[1].split('## Highest')[0].trim().split('\n').filter((l) => l.startsWith('- ')).map((l) => `<li>${esc(l.slice(2)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>
<h2>All models</h2>
<table>
<thead><tr>${COLUMNS.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
<tbody>
${body}
</tbody>
</table>
</body>
</html>
`;
}

function pricesCsv(): string {
  const head = 'model,provider,region,scope,input,output,cache_read,cache_write,long_context_threshold_tokens,long_input,long_output,modes_available';
  const rows: string[] = [];
  for (const m of models) {
    for (const region of regions) {
      for (const scope of ['regional', 'global'] as const) {
        const input = priceOf(m, region, scope, 'standard', 'input');
        const output = priceOf(m, region, scope, 'standard', 'output');
        if (input === undefined && output === undefined) continue;
        const ok = MODES.filter((mode) => supports(m, mode, region).ok && (mode === 'global') === (scope === 'global'));
        // The Price List sometimes prices Regions where AWS says the model cannot be invoked; leave those out.
        if (!ok.length) continue;
        const f = (v?: number) => (v === undefined ? '' : String(v));
        rows.push([JSON.stringify(m.name), m.provider, region, scope, f(input), f(output), f(priceOf(m, region, scope, 'standard', 'cacheRead')), f(priceOf(m, region, scope, 'standard', 'cacheWrite')), f(m.longContext?.thresholdTokens), f(longPriceOf(m, region, scope, 'standard', 'input')), f(longPriceOf(m, region, scope, 'standard', 'output')), ok.map((x) => MODE_LABEL[x]).join('+')].join(','));
      }
    }
  }
  return `${head}\n${rows.join('\n')}\n`;
}

const schema = `# Data schema

${SITE}/data/models.json is { generatedAt, models: Model[] }.

Model fields (USD per 1M tokens unless noted):
- id, name, provider
- contextWindow, maxOutput (tokens); lifecycle details in card.{lifecycle, launchDate, eolDate}
- pricing[region][scope][tier][kind]: scope is "regional" (In-region and Geo CRIS share it) or "global" (Global CRIS); tier "standard" | "batch" | "priority" | "flex"; kind "input" | "output" | "cacheRead" | "cacheWrite" | "cacheWrite1h"
- longContext: { thresholdTokens, pricing } with the same shape; applies to the whole request once the prompt exceeds the threshold
- availability[region] = { runtime?: flags, mantle?: flags } where flags contain "i" (in-region), "g" (Geo CRIS), "G" (Global CRIS); runtime = bedrock-runtime endpoint, mantle = bedrock-mantle (OpenAI-compatible) endpoint
- availabilityEol[region]: earliest end-of-life date (YYYY-MM-DD) for that region
- benchmarks: Artificial Analysis scores (intelligenceIndex, codingIndex, mathIndex are indices; gpqa, hle, mmluPro, ... are fractions 0-1; outputTokensPerSecond; timeToFirstTokenSeconds)
- benchmarkSource: name and slug of the measured variant; optional url, verifiedAt (YYYY-MM-DD), and kind: "public-page" identify a verified public-page fallback used while the API match is absent. API matches take priority on later rebuilds.
- priceSource: absent = AWS Price List; "model-card" or "mixed" = filled from the AWS model card; "override" = entered manually
- copiedGlobalRegions: regions whose Global CRIS price was copied from the model's other commercial regions
`;

const regionList = regions.filter((r) => entriesFor(r).length);
const llms = `# Amazon Bedrock model comparison

> Prices (USD per 1M tokens), context windows, cache pricing, in-region / Geo CRIS / Global CRIS availability per Region, EOL dates, and Artificial Analysis benchmark scores for every Amazon Bedrock model. Rebuilt daily from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Last generated ${date}. The interactive site (${SITE}/) is a JavaScript app; use these static files instead.

## Start here

- [Comparison for ${DEFAULT_REGION} (markdown)](${SITE}/ai/models.md): all models invocable from ${DEFAULT_REGION}, with prices, limits, availability, benchmarks, plus top-by-intelligence and cost/performance frontier lists
- [Comparison for ${DEFAULT_REGION} (HTML)](${SITE}/ai/): the same table as plain HTML

## Other Regions

${regionList.map((r) => `- [${r}](${SITE}/ai/regions/${r}.md)`).join('\n')}

## Raw data

- [prices.csv](${SITE}/ai/prices.csv): one row per model, Region, and price scope (regional/global): input, output, cache, long-context prices
- [models.json](${SITE}/data/models.json): everything above in structured form
- [schema.md](${SITE}/ai/schema.md): field reference for models.json
${existsSync('public/ai/changes.md') ? `- [changes.md](${SITE}/ai/changes.md): what changed recently (new/removed models, price and availability changes), newest first\n` : ''}
## Notes

- "-" means unavailable or unpublished, never zero.
- In-region and Geo CRIS share one price per Region; Global CRIS has its own and is the same in all commercial Regions.
- Sources: AWS Price List API, AWS Bedrock model cards and "Regional availability by models", models.dev (fallback), artificialanalysis.ai (benchmarks, attribution required).
`;

await mkdir('public/ai/regions', { recursive: true });
const defaultMd = regionMarkdown(DEFAULT_REGION);
await writeFile('public/ai/models.md', defaultMd);
await writeFile('public/ai/index.html', regionHtml(DEFAULT_REGION, defaultMd));
for (const r of regionList) {
  if (r === DEFAULT_REGION) continue;
  const md = regionMarkdown(r);
  await writeFile(`public/ai/regions/${r}.md`, md);
}
await writeFile('public/ai/prices.csv', pricesCsv());
await writeFile('public/ai/schema.md', schema);
await writeFile('public/llms.txt', llms);
console.log(`AI files: ${regionList.length} regions, ${entriesFor(DEFAULT_REGION).length} models in ${DEFAULT_REGION}`);
