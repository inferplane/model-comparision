# Bedrock Model Explorer

Static site (GitHub Pages) that lists every Amazon Bedrock model with per-1M-token prices, context window, cache pricing, and benchmark scores. Search from the header (`/` focuses it); click a model for its detail page.

The UI is in Korean and English: the KO/EN button in the header switches and remembers the choice (`localStorage` `bme-lang`); a first visit follows the browser language. Strings are written in place as `t('한국어', 'English')` (`src/i18n.ts`).

**ZDR** (zero data retention): per the AWS [abuse detection](https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html) page, OpenAI models other than gpt-oss-120b/20b and GPT OSS Safeguard (ZDR is an option requested through the AWS account team and approved per model version, so a new version needs a new request) and Claude Fable 5/5.1 (ZDR only for Enterprise Frontier Safeguards customers through 2026-12-31) retain data up to 30 days; every other model keeps its previous policy (ZDR). The rule is in `src/zdr.ts` (provider + name), so a new OpenAI or Fable model is covered automatically; edit it when AWS changes the page. It shows as a table column with a "ZDR only" filter, on the detail page, in compare, as a badge in the rankings, and in the AI exports.

**Model ID**: `modelId` is the Bedrock id from the model card's Programmatic Access table (models.dev as fallback), and `geoSources` maps each Geo CRIS prefix to its source regions. Each table row has a copy button for the id that works for that row from the selected region (`global.` for Global CRIS rows; the bare id for in-region, or the `us.`/`eu.`… profile when in-region is bedrock-mantle only). The detail page lists every id for the region, each with its own copy button.

## Data sources

| Data | Source |
|---|---|
| Prices | AWS Price List API, services `AmazonBedrock` and `AmazonBedrockFoundationModels`, all regions |
| In-region (runtime / mantle) / Geo CRIS / Global CRIS per region, plus per-region EOL | [Regional availability by models](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html): one uniform table per model; preferred over the cards' own tables, which sometimes only give a scope row |
| Context window, max output, lifecycle/EOL, long-context threshold | [AWS Bedrock model cards](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards.html) (one markdown page per model, fetched as `.md`). Cards without a regions-page entry keep their own availability tables |
| Fallback for context / profile ids | [models.dev](https://models.dev) `amazon-bedrock` (third party; used when no card matches, and for the long-context threshold of models without a card) |
| Benchmarks | [Artificial Analysis](https://artificialanalysis.ai/) API (attribution required); needs the `AA_API_KEY` repo secret, skipped without it |
| Benchmark API gaps | `data/benchmark-fallbacks.yaml`: verified Artificial Analysis public-page measurements with source URL and confirmation date. Applied only when the normal API match is absent; API measurements take priority |
| Prices for models the Price List lacks | The model card's price tables (commercial regions, standard tier), e.g. GPT-6.1 Sol; shown as `priceSource: model-card` |
| Gaps | `data/overrides.yaml` for anything else (each entry names its source) |

Only text-token prices are shown. Image, video, audio, provisioned-throughput and customization SKUs are skipped. The AWS price list has no long-context pricing tiers.

Coding Index and SciCode are separate measurements. A latest model can have Intelligence Index and SciCode measurements while its Coding Index is not provided by the connected source. The UI and AI exports label that gap explicitly; no composite score is inferred from individual benchmarks. SciCode remains a scientific-programming pass-rate percentage with its own tab, comparison panel and detailed column.

## Commands

```
npm run data      # fetch prices/context/benchmarks and write public/data/models.json
npm run dev       # local dev server
npm run build     # typecheck + production build
npm test          # parser unit tests
```

`npm run data` prints the models without a context or benchmark match. Fix those by adding an entry to `data/aliases.yaml` (`aliases` for context, `benchmarkAliases` for benchmarks).

The workflow `.github/workflows/update-and-deploy.yml` refreshes data daily, commits changes to `public/data/`, and deploys. In the repo settings, set Pages source to "GitHub Actions".

In-region and Geo CRIS prices differ by region (59 models), so they are never copied between regions. Global CRIS prices are identical in every commercial region except for Amazon Nova (GovCloud is priced separately), so a known Global price is applied to every commercial region the regions page lists Global CRIS for. Regions the Price List lacks are otherwise filled only from the model cards' own "Commercial Regions" tables, and the detail page says so.

## For AI agents

The site is a client-rendered app, so a plain fetch of `/` returns an empty shell. `npm run data` also writes static files agents can read: `/llms.txt` (entry point), `/ai/models.md` and `/ai/index.html` (comparison for us-east-1), `/ai/regions/<region>.md` (same for every other Region), `/ai/prices.csv` (price per model/Region/scope), `/ai/schema.md`, and `/data/models.json`. They are generated by `scripts/build-ai.ts` with the same availability and price logic as the site (`src/data.ts`).

## Shareable views

Filters live in the URL query string and the page (table, ranking, chart, compare, model) in the hash, e.g.
`/?region=ap-northeast-2&modes=geo,global&q=claude&provider=Anthropic#/rank`. The 🔗 button copies the current link. Defaults are omitted; a link with any parameter ignores the viewer's saved preferences so it reproduces the same view. Parameters: `region`, `modes` (`in-region,geo,global`), `q`, `provider=<name>` (repeat it to select several), `tier`, `cache=1`, `zdr=1` (ZDR only), `priced=0`, `cols=1`, `sort=<column>.<asc|desc>`, `weights` (`open|closed`), `reasoning` (`yes|no`), `metric` and `top` (ranking), `cy` and `cx` (chart axes), `compare=<id>,<id>` (up to 6). Invalid values are ignored. Parsing and serialising live in `src/urlstate.ts`.

The cost-performance view starts with a numerical ranking and candidates for highest score per dollar, lowest price and highest score. `quality=all|balanced|strong|best` sets the minimum score to 0/50/75/90% of the best measured score for the selected region, modes and tier. The default is `balanced`; the baseline stays fixed while search, provider or budget changes. `budget=<USD per 1M tokens>` sets an inclusive maximum unit price, and `order=value|price|score` controls ranking. The optional scatterplot remains available below the table. Score divided by unit price is a comparison aid within the selected benchmark, not a prediction of task success.

`latest=1` restricts cost-performance candidates to models with an AWS card launch date within the last 60 UTC calendar days; missing launch dates and future releases are excluded. `firstSeen` is never treated as a release date. The “최신 모델 보기” preset keeps the region and selects all inference modes, standard-tier mixed pricing and Intelligence Index, while clearing provider/search/cache/performance/budget filters. Excluded models are grouped with explicit reasons and actions so a Global-only model, a missing benchmark or a saved budget does not look like a data omission.

## Daily pipeline

`.github/workflows/update-and-deploy.yml` runs every day (and on every push, or manually), refreshes the data, commits it, and deploys.

- **New models are picked up automatically** from the AWS Price List, the model cards, and the regions page. `scripts/diff-data.ts` compares the new data with the previous run and records new/removed models and price/availability changes in `public/data/changes.json` and `public/ai/changes.md`; the commit message summarises them (e.g. `data: +2 models (GPT-6.2 Sol, …), 3 price changes`).
- **The site shows it:** the "변경 내역" view (`#/changes`) lists the last 30 days from `changes.json`, and models added in the last 14 days carry a NEW badge in the table, ranking and detail page. NEW means "first seen by this site's daily check", not AWS's launch date.
- **A standing issue "신규 Bedrock 모델 매칭 확인 필요"** (label `data-review`) lists models added in the last 7 days that still lack a model card, context window, price, or benchmark match, and which `data/aliases.yaml` entry to add. It updates daily and closes itself when nothing is left.
- **Sanity guard:** if 10+ models (≥10%) vanish or prices move on ≥50% of models in one run, the run stops before committing, leaving the previous deployment in place. Check the run summary, then re-run with "allow_big_change" ticked (Actions → Run workflow) if the change is real.
- **A failed scheduled/manual run opens an issue** (label `data-refresh-failed`); the next successful run closes it. The site keeps serving the last good data meanwhile.
