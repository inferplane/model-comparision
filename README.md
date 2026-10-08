# Bedrock Model Explorer

Static site (GitHub Pages) that lists every Amazon Bedrock model with per-1M-token prices, context window, cache pricing, and benchmark scores. Search from the header (`/` focuses it); click a model for its detail page.

## Data sources

| Data | Source |
|---|---|
| Prices | AWS Price List API, services `AmazonBedrock` and `AmazonBedrockFoundationModels`, all regions |
| In-region (runtime / mantle) / Geo CRIS / Global CRIS per region, plus per-region EOL | [Regional availability by models](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html): one uniform table per model; preferred over the cards' own tables, which sometimes only give a scope row |
| Context window, max output, lifecycle/EOL, long-context threshold | [AWS Bedrock model cards](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards.html) (one markdown page per model, fetched as `.md`). Cards without a regions-page entry keep their own availability tables |
| Fallback for context / profile ids | [models.dev](https://models.dev) `amazon-bedrock` (third party; used when no card matches, and for the long-context threshold of models without a card) |
| Benchmarks | [Artificial Analysis](https://artificialanalysis.ai/) API (attribution required); needs the `AA_API_KEY` repo secret, skipped without it |
| Prices for models the Price List lacks | The model card's price tables (commercial regions, standard tier), e.g. GPT-6.1 Sol; shown as `priceSource: model-card` |
| Gaps | `data/overrides.yaml` for anything else (each entry names its source) |

Only text-token prices are shown. Image, video, audio, provisioned-throughput and customization SKUs are skipped. The AWS price list has no long-context pricing tiers.

## Commands

```
npm run data      # fetch prices/context/benchmarks and write public/data/models.json
npm run dev       # local dev server
npm run build     # typecheck + production build
npm test          # parser unit tests
```

`npm run data` prints the models without a context or benchmark match. Fix those by adding an entry to `data/aliases.yaml` (`aliases` for context, `benchmarkAliases` for benchmarks).

The workflow `.github/workflows/update-and-deploy.yml` refreshes data daily, commits changes to `public/data/`, and deploys. In the repo settings, set Pages source to "GitHub Actions".

Price List prices vary by region (Nova, and Global CRIS for some models), so a price is never copied from one region to another. Only the model cards' own "Commercial Regions" tables are used to fill regions the Price List lacks, and the detail page says so.
