# Data schema

https://inferplane.github.io/model-comparision/data/models.json is { generatedAt, models: Model[] }.

Model fields (USD per 1M tokens unless noted):
- id (site slug, not the Bedrock id), name, provider
- modelId: Bedrock model id without a CRIS prefix (from the AWS model card, else models.dev); geoSources[prefix]: source regions of each Geo CRIS profile
- ZDR is not stored: derived from provider and name (OpenAI except gpt-oss, and Claude Fable, are not ZDR by default; rule and AWS source in src/zdr.ts)
- contextWindow, maxOutput (tokens); lifecycle details in card.{lifecycle, launchDate, eolDate}
- pricing[region][scope][tier][kind]: scope is "regional" (In-region and Geo CRIS share it) or "global" (Global CRIS); tier "standard" | "batch" | "priority" | "flex"; kind "input" | "output" | "cacheRead" | "cacheWrite" | "cacheWrite1h"
- longContext: { thresholdTokens, pricing } with the same shape; applies to the whole request once the prompt exceeds the threshold
- availability[region] = { runtime?: flags, mantle?: flags } where flags contain "i" (in-region), "g" (Geo CRIS), "G" (Global CRIS); runtime = bedrock-runtime endpoint, mantle = bedrock-mantle (OpenAI-compatible) endpoint
- availabilityEol[region]: earliest end-of-life date (YYYY-MM-DD) for that region
- benchmarks: Artificial Analysis scores (intelligenceIndex, codingIndex, mathIndex are indices; gpqa, hle, mmluPro, ... are fractions 0-1; outputTokensPerSecond; timeToFirstTokenSeconds)
- benchmarkSource: name and slug of the measured variant; optional url, verifiedAt (YYYY-MM-DD), and kind: "public-page" identify a verified public-page fallback used while the API match is absent. API matches take priority on later rebuilds.
- priceSource: absent = AWS Price List; "model-card" or "mixed" = filled from the AWS model card; "override" = entered manually
- copiedGlobalRegions: regions whose Global CRIS price was copied from the model's other commercial regions
