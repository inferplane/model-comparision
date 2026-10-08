# Bedrock Model Explorer

Static site (GitHub Pages) that lists every Amazon Bedrock model with per-1M-token prices, context window, cache pricing, and benchmark scores. Search from the header (`/` focuses it); click a model for its detail page.

## Data sources

| Data | Source |
|---|---|
| Prices | AWS Price List API, services `AmazonBedrock` and `AmazonBedrockFoundationModels`, all regions |
| Context window / max output | [models.dev](https://models.dev) `amazon-bedrock` (third party; may differ from the model card) |
| Benchmarks | [Artificial Analysis](https://artificialanalysis.ai/) API (attribution required); needs the `AA_API_KEY` repo secret, skipped without it |
| Gaps | `data/overrides.yaml` for models the Price List does not list yet (each entry names its source) |

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
