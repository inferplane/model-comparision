# Amazon Bedrock model comparison: ap-east-2

Generated 2026-11-13 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 68 models that can be invoked from **ap-east-2** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in ap-east-2; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding Index are Artificial Analysis indices (higher is better); tok/s is median output speed. An individual metric can be unpublished even when other measurements exist for a model. Verified public metrics lists fields supplemented or refreshed from the same variant's public page, with source and verification date; these override that field's retained snapshot date. Fresh API values take priority. Field-level provenance is also available in models.json.
- Retained benchmark snapshot gives the date of previously sourced measurements kept when no new matching API measurement was available for this build. These are historical measurements; an actual API measurement replaces them. "-" means no retained snapshot.
- SciCode (%) is a separate scientific-programming pass rate, not Coding Index. Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.
- Model ID is the bare Bedrock id for In-region calls; Geo CRIS prepends the geography (e.g. us.), Global CRIS prepends global.
- ZDR = zero data retention by default. Not ZDR: OpenAI models other than gpt-oss-120b/20b and GPT OSS Safeguard 120B/20B (ZDR is an option requested through the AWS account team, approved per model version, so a new version needs a new request; without approval the default policy applies) and Claude Fable 5 / 5.1 (all traffic kept up to 30 days; ZDR only for Enterprise Frontier Safeguards customers through 2026-12-31). Source: AWS Bedrock abuse detection page. Every other model keeps its previous policy (ZDR).

## Highest Intelligence Index available in ap-east-2

- Claude Fable 5.2 (Anthropic): Intelligence 64.6, cheapest 4:1 blended $14.40 per 1M tokens
- Claude Opus 5.5 (Anthropic): Intelligence 59.1, cheapest 4:1 blended $7.20 per 1M tokens
- OpenAI GPT-6 Astra (OpenAI): Intelligence 56.9, cheapest 4:1 blended $18.00 per 1M tokens
- OpenAI GPT-6.1 Sol (OpenAI): Intelligence 54.6, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Sonnet 5.5 (Anthropic): Intelligence 54.5, cheapest 4:1 blended $3.60 per 1M tokens
- OpenAI GPT-6.1 Terra (OpenAI): Intelligence 51.3, cheapest 4:1 blended $1.80 per 1M tokens
- Claude Fable 5.1 (Anthropic): Intelligence 49.2, cheapest 4:1 blended $18.00 per 1M tokens
- Kimi K3.1 (Moonshot AI): Intelligence 46.5, cheapest 4:1 blended $7.20 per 1M tokens
- Claude Opus 5 (Anthropic): Intelligence 44.2, cheapest 4:1 blended $9.00 per 1M tokens
- OpenAI GPT-6 Sol (OpenAI): Intelligence 44.2, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Haiku 5.5 (Anthropic): Intelligence 36.5, cheapest 4:1 blended $0.18 per 1M tokens
- Grok 4.7 (xAI): Intelligence 35.5, cheapest 4:1 blended $2.80 per 1M tokens

## Cost/performance frontier in ap-east-2

No other model here is both cheaper and higher scoring than these (sorted by price):

- Claude Haiku 5.5 (Anthropic): Intelligence 36.5, cheapest 4:1 blended $0.18 per 1M tokens
- OpenAI GPT-6.1 Terra (OpenAI): Intelligence 51.3, cheapest 4:1 blended $1.80 per 1M tokens
- OpenAI GPT-6.1 Sol (OpenAI): Intelligence 54.6, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Opus 5.5 (Anthropic): Intelligence 59.1, cheapest 4:1 blended $7.20 per 1M tokens
- Claude Fable 5.2 (Anthropic): Intelligence 64.6, cheapest 4:1 blended $14.40 per 1M tokens

## All models

| Model | Provider | Model ID | ZDR | In-region | Geo CRIS | Global CRIS | Context | Max out | Intelligence | Coding Index | SciCode (%) | tok/s | Retained benchmark snapshot | Verified public metrics | Regional in/out | Regional cache read/write | Global in/out | Global cache read/write | Long-context (regional in/out) | EOL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jamba-Instruct | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Mid | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Ultra | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Nova 2.0 Lite | Amazon | amazon.nova-2-lite-v1:0 | yes | no | no | yes | 1M | 64K | - | - | - | 168 | - | - | - | - | $0.36 / $3.01 | $0.09 / $0.00 | - | - |
| Nova 2.0 Omni | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | 8.2 | - | - | - | 2026-11-10 | - | - | - | $0.40 / $3.00 | - | - | - |
| Nova 2.0 Pro | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | 118 | - | - | - | - | $1.51 / $12.50 | - | - | - |
| Nova Premier | Amazon | amazon.nova-premier-v1:0 | yes | no | yes? | no | 1M | 10K | 9.2 | - | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Nova Pro | Amazon | amazon.nova-pro-v1:0 | yes | no | yes | no | 300K | 10K | - | - | - | 128 | - | - | - | - | - | - | - | No sooner than 12/4/2025 |
| Nova Pro Latency Optimized | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | 128 | - | - | - | - | - | - | - | - |
| Nova Sonic | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Claude | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Claude (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Claude 2.0 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.5 | 12.9 | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude 2.1 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.6 | 14.0 | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude 3 Opus | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 8.7 | 19.5 | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.9 | - | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 8.9 | 15.9 | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.2 | 26.0 | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.9 | 30.2 | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 15.3 | - | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude Fable 5 | Anthropic | anthropic.claude-fable-5 | no | no | no | yes | 1M | 128K | - | - | - | 66 | - | - | - | - | $10.00 / $50.00 | $1.00 / $12.50 | - | - |
| Claude Fable 5.1 | Anthropic | anthropic.claude-fable-5-1 | no | no | no | yes | 1M | 128K | 49.2 | - | - | 68 | - | - | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Fable 5.2 | Anthropic | anthropic.claude-fable-5-2 | no | no | no | yes | 1M | 128K | 64.6 | - | - | 92 | - | - | - | - | $8.00 / $40.00 | $0.20 / $10.00 | - | - |
| Claude Haiku 4.5 | Anthropic | anthropic.claude-haiku-4-5 | yes | no | no | yes | 200K | 64K | - | - | - | 87 | - | - | - | - | $1.00 / $5.00 | $0.10 / $1.25 | - | - |
| Claude Haiku 5.5 | Anthropic | anthropic.claude-haiku-5-5 | yes | no | no | yes | 1M | 128K | 36.5 | - | - | 232 | - | - | - | - | $0.10 / $0.50 | $0.01 / $0.125 | >100K global $0.50 / $2.50 | - |
| Claude Instant | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude Mythos 5.1 | Anthropic | anthropic.claude-mythos-5-1 | yes | no | no | yes | 1M | 128K | - | - | - | - | - | - | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Mythos 5.2 | Anthropic | anthropic.claude-mythos-5-2 | yes | no | no | yes | 1M | 128K | - | - | - | - | - | - | - | - | $8.00 / $40.00 | $0.20 / $10.00 | - | - |
| Claude Mythos Preview | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Claude Opus 4 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 16.6 | - | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Claude Opus 4.5 | Anthropic | anthropic.claude-opus-4-5-20251101-v1:0 | yes | no | no | yes | 200K | 64K | - | - | - | 49 | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.6 | Anthropic | anthropic.claude-opus-4-6-v1 | yes | no | no | yes | 1M | 128K | - | - | - | 40 | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.7 | Anthropic | anthropic.claude-opus-4-7 | yes | no | no | yes | 1M | 128K | - | - | - | 53 | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.8 | Anthropic | anthropic.claude-opus-4-8 | yes | no | no | yes | 1M | 128K | - | - | - | 63 | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5 | Anthropic | anthropic.claude-opus-5 | yes | no | no | yes | 1M | 128K | 44.2 | - | 56.4 | 54 | - | gpqa, hle, scicode: 2026-11-10 (https://artificialanalysis.ai/models/claude-opus-5) | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5.5 | Anthropic | anthropic.claude-opus-5-5 | yes | no | no | yes | 1M | 128K | 59.1 | - | - | 98 | - | - | - | - | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| Claude Sonnet 4 | Anthropic | anthropic.claude-sonnet-4-20250514-v1:0 | yes | no | yes | no | 200K | 64K | 16.6 | - | - | - | 2026-11-10 | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | 2026-10-14 |
| Claude Sonnet 4.5 | Anthropic | anthropic.claude-sonnet-4-5-20250929-v1:0 | yes | no | no | yes | 200K | 64K | - | - | - | 42 | - | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | 2027-04-08 |
| Claude Sonnet 4.6 | Anthropic | anthropic.claude-sonnet-4-6 | yes | no | no | yes | 1M | 64K | - | - | - | 46 | - | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Claude Sonnet 5 | Anthropic | anthropic.claude-sonnet-5 | yes | no | no | yes | 1M | 128K | - | - | - | 80 | - | - | - | - | $2.00 / $10.00 | $0.20 / $2.50 | - | - |
| Claude Sonnet 5.5 | Anthropic | anthropic.claude-sonnet-5-5 | yes | no | no | yes | 1M | 128K | 54.5 | - | - | 132 | - | - | - | - | $2.00 / $10.00 | $0.10 / $2.50 | - | - |
| Cohere Embed 3 Model - English | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - | - | - |
| Llama 3.1 405B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.3 | - | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Llama 3.1 70B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | 16 | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 13B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Mistral Large 2407 | Mistral | - | yes | yes? | yes? | no | 미확인 | 미확인 | 6.8 | - | - | - | 2026-11-10 | - | - | - | - | - | - | - |
| Kimi K3 | Moonshot AI | moonshotai.kimi-k3 | yes | no | no | yes | 1M | 128K | - | - | - | 50 | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Kimi K3.1 [price: manual] | Moonshot AI | moonshotai.kimi-k3.1 | yes | no | no | yes | 1M | 1.05M | 46.5 | - | - | 30 | - | - | - | - | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| GPT-5.6 Luna | OpenAI | openai.gpt-5.6-luna | no | no | no | yes | 1.05M | 128K | 23.8 | - | - | 121 | - | - | - | - | $0.20 / $1.20 | $0.02 / $0.25 | >272K global $0.40 / $1.80 | - |
| GPT-5.6 Terra | OpenAI | openai.gpt-5.6-terra | no | no | no | yes | 1.05M | 128K | 32.3 | - | - | 126 | - | - | - | - | $2.00 / $12.00 | $0.20 / $2.50 | >272K global $4.00 / $18.00 | - |
| OpenAI GPT-5.6 Sol | OpenAI | openai.gpt-5.6-sol | no | no | no | yes | 1.05M | 128K | - | - | - | 127 | - | - | - | - | $4.00 / $20.00 | $0.40 / $5.00 | >272K global $8.00 / $30.00 | - |
| OpenAI GPT-6 Astra | OpenAI | openai.gpt-6-astra | no | no | no | yes | 1.05M | 128K | 56.9 | - | - | 46 | - | - | - | - | $10.00 / $50.00 | $1.00 / $12.50 | >272K global $20.00 / $75.00 | - |
| OpenAI GPT-6 Luna | OpenAI | openai.gpt-6-luna | no | no | no | yes | 1.05M | 128K | 27.9 | - | - | 133 | - | - | - | - | $0.10 / $0.50 | $0.01 / $0.125 | >272K global $0.20 / $0.75 | - |
| OpenAI GPT-6 Sol | OpenAI | openai.gpt-6-sol | no | no | no | yes | 1.05M | 128K | 44.2 | - | - | 137 | - | - | - | - | $2.00 / $10.00 | $0.20 / $2.50 | >272K global $4.00 / $15.00 | - |
| OpenAI GPT-6.1 Sol | OpenAI | openai.gpt-6.1-sol | no | no | no | yes | 1M | 131K | 54.6 | - | 54.2 | 64 | - | hle, scicode: 2026-10-11 (https://artificialanalysis.ai/models/gpt-6-1-sol) | - | - | $2.00 / $10.00 | $0.10 / $2.50 | >272K global $4.00 / $15.00 | - |
| OpenAI GPT-6.1 Terra | OpenAI | openai.gpt-6.1-terra | no | no | no | yes | 1.05M | 128K | 51.3 | - | - | 85 | - | - | - | - | $1.00 / $5.00 | $0.05 / $1.25 | >272K global $2.00 / $7.50 | - |
| TwelveLabs Pegasus 1.2 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - / $7.50 | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - / $7.50 | - | - | - |
| Grok 4.6 | xAI | xai.grok-4.6 | yes | no | no | yes | 500K | 500K | - | - | - | 78 | - | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| Grok 4.7 | xAI | xai.grok-4.7 | yes | no | no | yes | 524K | 524288M | 35.5 | - | - | 73 | - | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| GLM 5.3 [price: manual] | Z AI | zai.glm-5.3 | yes | no | no | yes | 1M | 128K | 31.7 | - | - | 79 | - | - | - | - | $1.68 / $5.28 | $0.312 / $2.10 | - | - |
