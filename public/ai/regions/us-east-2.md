# Amazon Bedrock model comparison: us-east-2

Generated 2026-10-25 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 126 models that can be invoked from **us-east-2** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in us-east-2; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding Index are Artificial Analysis indices (higher is better); tok/s is median output speed. An individual metric can be unpublished even when other measurements exist for a model. Public-page measurement fallbacks include their source and verification date in models.json.
- SciCode (%) is a separate scientific-programming pass rate, not Coding Index. Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.
- Model ID is the bare Bedrock id for In-region calls; Geo CRIS prepends the geography (e.g. us.), Global CRIS prepends global.
- ZDR = zero data retention by default. Not ZDR: OpenAI models other than gpt-oss-120b/20b and GPT OSS Safeguard 120B/20B (ZDR is an option requested through the AWS account team, approved per model version, so a new version needs a new request; without approval the default policy applies) and Claude Fable 5 / 5.1 (all traffic kept up to 30 days; ZDR only for Enterprise Frontier Safeguards customers through 2026-12-31). Source: AWS Bedrock abuse detection page. Every other model keeps its previous policy (ZDR).

## Highest Intelligence Index available in us-east-2

- Claude Opus 5.5 (Anthropic): Intelligence 57.6, cheapest 4:1 blended $7.20 per 1M tokens
- Claude Sonnet 5.5 (Anthropic): Intelligence 56.0, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Fable 5.1 (Anthropic): Intelligence 53.4, cheapest 4:1 blended $18.00 per 1M tokens
- OpenAI GPT-6 Astra (OpenAI): Intelligence 52.7, cheapest 4:1 blended $18.00 per 1M tokens
- GPT-6.1 Sol (OpenAI): Intelligence 51.8, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Opus 5 (Anthropic): Intelligence 50.8, cheapest 4:1 blended $9.00 per 1M tokens
- Claude Fable 5 (Anthropic): Intelligence 49.6, cheapest 4:1 blended $18.00 per 1M tokens
- GPT-6 Sol (OpenAI): Intelligence 47.6, cheapest 4:1 blended $3.60 per 1M tokens
- GPT-5.6 Sol (OpenAI): Intelligence 47.0, cheapest 4:1 blended $7.20 per 1M tokens
- Grok 4.7 (xAI): Intelligence 46.4, cheapest 4:1 blended $2.80 per 1M tokens
- GLM 5.3 (Z AI): Intelligence 44.8, cheapest 4:1 blended $2.40 per 1M tokens
- Grok 4.6 (xAI): Intelligence 44.3, cheapest 4:1 blended $2.80 per 1M tokens

## Cost/performance frontier in us-east-2

No other model here is both cheaper and higher scoring than these (sorted by price):

- Gemma 4 E2B (Google): Intelligence 7.8, cheapest 4:1 blended $0.048 per 1M tokens
- Nemotron Nano 3 30B (NVIDIA): Intelligence 8.9, cheapest 4:1 blended $0.096 per 1M tokens
- gpt-oss-20b (OpenAI): Intelligence 9.0, cheapest 4:1 blended $0.116 per 1M tokens
- GLM 4.7 Flash (Z AI): Intelligence 14.9, cheapest 4:1 blended $0.136 per 1M tokens
- Claude Haiku 5.5 (Anthropic): Intelligence 43.4, cheapest 4:1 blended $0.18 per 1M tokens
- GLM 5.3 (Z AI): Intelligence 44.8, cheapest 4:1 blended $2.40 per 1M tokens
- Grok 4.7 (xAI): Intelligence 46.4, cheapest 4:1 blended $2.80 per 1M tokens
- Claude Sonnet 5.5 (Anthropic): Intelligence 56.0, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Opus 5.5 (Anthropic): Intelligence 57.6, cheapest 4:1 blended $7.20 per 1M tokens

## All models

| Model | Provider | Model ID | ZDR | In-region | Geo CRIS | Global CRIS | Context | Max out | Intelligence | Coding Index | SciCode (%) | tok/s | Regional in/out | Regional cache read/write | Global in/out | Global cache read/write | Long-context (regional in/out) | EOL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jamba-Instruct | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Mid | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Ultra | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova 2.0 Lite | Amazon | amazon.nova-2-lite-v1:0 | yes | no | yes | yes | 1M | 64K | 8.7 | - | - | 216 | $0.33 / $2.75 | $0.0825 / $0.00 | $0.30 / $2.50 | $0.075 / $0.00 | - | - |
| Nova 2.0 Omni | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | 8.2 | - | - | - | $0.30 / $2.80 | - | $0.30 / $2.50 | - | - | - |
| Nova 2.0 Pro | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | 10.0 | 20.9 | - | 130 | $1.375 / $11.00 | - | $1.25 / $10.00 | - | - | - |
| Nova Lite | Amazon | amazon.nova-lite-v1:0 | yes | yes | yes | no | 300K | 10K | 6.7 | - | - | - | $0.06 / $0.24 | $0.015 / $0.00 | - | - | - | No sooner than 12/4/2025 |
| Nova Micro | Amazon | amazon.nova-micro-v1:0 | yes | no | yes | no | 128K | 10K | 5.9 | - | - | 254 | $0.035 / $0.14 | $0.00875 / $0.00 | - | - | - | No sooner than 12/4/2025 |
| Nova Premier | Amazon | amazon.nova-premier-v1:0 | yes | no | yes? | no | 1M | 10K | 9.2 | - | - | - | $2.50 / $12.50 | $0.625 / - | - | - | - | - |
| Nova Pro | Amazon | amazon.nova-pro-v1:0 | yes | no | yes | no | 300K | 10K | 7.0 | - | - | - | $0.80 / $3.20 | $0.20 / $0.00 | - | - | - | No sooner than 12/4/2025 |
| Nova Pro Latency Optimized | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.0 | - | - | - | $1.00 / $4.00 | - | - | - | - | - |
| Nova Sonic | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 2.0 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.5 | 12.9 | - | - | - | - | - | - | - | - |
| Claude 2.1 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.6 | 14.0 | - | - | - | - | - | - | - | - |
| Claude 3 Haiku | Anthropic | anthropic.claude-3-haiku-20240307-v1:0 | yes | no | yes | no | 200K | 4K | 5.6 | - | - | - | $0.25 / $1.25 | - | - | - | - | 2026-07-30 |
| Claude 3 Opus | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 8.7 | 19.5 | - | - | - | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.9 | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 8.9 | 15.9 | - | - | $0.80 / $5.00 | $0.08 / $1.00 | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.2 | 26.0 | - | - | $3.00 / $15.00 | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.9 | 30.2 | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 15.3 | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | - |
| Claude Fable 5 | Anthropic | anthropic.claude-fable-5 | no | no | yes | yes | 1M | 128K | 49.6 | 76.5 | 61.0 | - | $11.00 / $55.00 | $1.10 / $13.75 | $10.00 / $50.00 | $1.00 / $12.50 | - | - |
| Claude Fable 5.1 | Anthropic | anthropic.claude-fable-5-1 | no | no | yes | yes | 1M | 128K | 53.4 | 81.6 | 63.1 | 69 | $11.00 / $55.00 | $0.275 / $13.75 | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Haiku 4.5 | Anthropic | anthropic.claude-haiku-4-5 | yes | yes (mantle endpoint only) | yes | yes | 200K | 64K | 15.4 | - | - | - | $1.10 / $5.50 | $0.11 / $1.375 | $1.00 / $5.00 | $0.10 / $1.25 | - | - |
| Claude Haiku 5.5 | Anthropic | anthropic.claude-haiku-5-5 | yes | no | yes | yes | 1M | 128K | 43.4 | - | 55.0 | 241 | $0.11 / $0.55 | $0.011 / $0.1375 | $0.10 / $0.50 | $0.01 / $0.125 | >100K $0.55 / $2.75 | - |
| Claude Instant | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - | - |
| Claude Mythos 5.1 | Anthropic | anthropic.claude-mythos-5-1 | yes | no | yes | yes | 1M | 128K | - | - | - | - | $11.00 / $55.00 | $0.275 / $13.75 | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Mythos Preview | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Opus 4 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 16.6 | - | - | - | $15.00 / $75.00 | $1.50 / $18.75 | - | - | - | - |
| Claude Opus 4.1 | Anthropic | anthropic.claude-opus-4-1-20250805-v1:0 | yes | no | yes | no | 200K | 32K | 18.6 | - | - | - | $15.00 / $75.00 | $1.50 / $18.75 | - | - | - | 2027-01-08 |
| Claude Opus 4.5 | Anthropic | anthropic.claude-opus-4-5-20251101-v1:0 | yes | no | yes | yes | 200K | 64K | 23.7 | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.6 | Anthropic | anthropic.claude-opus-4-6-v1 | yes | no | yes | yes | 1M | 128K | 26.4 | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.7 | Anthropic | anthropic.claude-opus-4-7 | yes | no | yes | yes | 1M | 128K | 40.7 | 73.6 | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.8 | Anthropic | anthropic.claude-opus-4-8 | yes | no | yes | yes | 1M | 128K | 41.8 | 74.3 | 54.4 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5 | Anthropic | anthropic.claude-opus-5 | yes | no | yes | yes | 1M | 128K | 50.8 | 78.0 | 56.4 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5.5 | Anthropic | anthropic.claude-opus-5-5 | yes | no | yes | yes | 1M | 128K | 57.6 | - | 66.9 | 96 | $4.40 / $22.00 | $0.22 / $5.50 | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| Claude Sonnet 4 | Anthropic | anthropic.claude-sonnet-4-20250514-v1:0 | yes | no | yes | yes | 200K | 64K | 16.6 | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | $3.00 / $15.00 | $0.30 / $3.75 | - | 2026-10-14 |
| Claude Sonnet 4.5 | Anthropic | anthropic.claude-sonnet-4-5-20250929-v1:0 | yes | no | yes | yes | 200K | 64K | 19.3 | - | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | 2027-04-08 |
| Claude Sonnet 4.6 | Anthropic | anthropic.claude-sonnet-4-6 | yes | no | yes | yes | 1M | 64K | 24.7 | - | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Claude Sonnet 5 | Anthropic | anthropic.claude-sonnet-5 | yes | no | yes | yes | 1M | 128K | 38.2 | 71.5 | 54.3 | - | $2.20 / $11.00 | $0.22 / $2.75 | $2.00 / $10.00 | $0.20 / $2.50 | - | - |
| Claude Sonnet 5.5 | Anthropic | anthropic.claude-sonnet-5-5 | yes | no | yes | yes | 1M | 128K | 56.0 | - | 61.0 | 137 | $2.20 / $11.00 | $0.11 / $2.75 | $2.00 / $10.00 | $0.10 / $2.50 | - | - |
| Cohere Embed 3 Model - English | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.12 / - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| DeepSeek V3.1 | DeepSeek | deepseek.v3-v1:0 | yes | yes | no | no | 128K | 8K | 13.7 | - | - | - | $0.58 / $1.68 | - | - | - | - | March 30, 2027 |
| DeepSeek v3.2 | DeepSeek | deepseek.v3.2 | yes | yes | no | no | 164K | 8K | 16.0 | - | - | - | $0.62 / $1.85 | - | - | - | - | - |
| R1 | DeepSeek | deepseek.r1-v1:0 | yes | no | yes | no | 128K | 8K | - | - | - | - | $1.35 / $5.40 | - | - | - | - | March 30, 2027 |
| Gemma 3 12B | Google | google.gemma-3-12b-it | yes | yes | no | no | 128K | 8K | 3.8 | 5.8 | 16.4 | - | $0.09 / $0.29 | - | - | - | - | March 30, 2027 |
| Gemma 3 27B | Google | google.gemma-3-27b-it | yes | yes | no | no | 128K | 8K | 4.9 | 10.1 | 23.3 | - | $0.23 / $0.38 | - | - | - | - | March 30, 2027 |
| Gemma 3 4B | Google | google.gemma-3-4b-it | yes | yes | no | no | 128K | 8K | 4.8 | 2.7 | - | - | $0.04 / $0.08 | - | - | - | - | March 30, 2027 |
| Gemma 4 26B A4B | Google | google.gemma-4-26b-a4b | yes | yes (mantle endpoint only) | no | no | 256K | 33K | 16.7 | 39.3 | 40.0 | 95 | $0.13 / $0.40 | - | - | - | - | - |
| Gemma 4 31B | Google | google.gemma-4-31b | yes | yes (mantle endpoint only) | no | no | 256K | 33K | 14.7 | 43.4 | 45.5 | 36 | $0.14 / $0.40 | - | - | - | - | - |
| Gemma 4 E2B | Google | google.gemma-4-e2b | yes | yes (mantle endpoint only) | no | no | 128K | 8K | 7.8 | 7.2 | - | - | $0.04 / $0.08 | - | - | - | - | - |
| Llama 3.1 405B | Meta | meta.llama3-1-405b-instruct-v1:0 | yes | no | yes | no | 128K | 4K | 7.3 | - | - | - | $2.40 / $2.40 | - | - | - | - | 2026-07-07 |
| Llama 3.1 405B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.3 | - | - | - | $3.00 / $3.00 | - | - | - | - | - |
| Llama 3.1 70B | Meta | meta.llama3-1-70b-instruct-v1:0 | yes | no | yes | no | 128K | 4K | 6.6 | - | - | - | $0.72 / $0.72 | - | - | - | - | March 30, 2027 |
| Llama 3.1 70B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 6.6 | - | - | - | $0.90 / $0.90 | - | - | - | - | - |
| Llama 3.1 8B | Meta | meta.llama3-1-8b-instruct-v1:0 | yes | no | yes | no | 128K | 4K | 6.9 | 5.4 | - | - | $0.22 / $0.22 | - | - | - | - | March 30, 2027 |
| Llama 3.2 11B | Meta | meta.llama3-2-11b-instruct-v1:0 | yes | no | yes | no | 128K | 4K | 5.4 | - | - | 27 | $0.16 / $0.16 | - | - | - | - | 2026-07-07 |
| Llama 3.2 1B | Meta | meta.llama3-2-1b-instruct-v1:0 | yes | no | yes | no | 128K | 4K | 4.8 | - | - | - | $0.10 / $0.10 | - | - | - | - | 2026-07-07 |
| Llama 3.2 3B | Meta | meta.llama3-2-3b-instruct-v1:0 | yes | no | yes | no | 128K | 4K | 5.7 | - | - | - | $0.15 / $0.15 | - | - | - | - | 2026-07-07 |
| Llama 3.2 90B | Meta | meta.llama3-2-90b-instruct-v1:0 | yes | no | yes | no | 128K | 4K | 6.4 | - | - | - | $0.72 / $0.72 | - | - | - | - | 2026-07-07 |
| Llama 3.3 70B | Meta | meta.llama3-3-70b-instruct-v1:0 | yes | yes | yes | no | 128K | 4K | 7.7 | 11.9 | - | 95 | $0.72 / $0.72 | - | - | - | - | March 30, 2027 |
| Llama 4 Maverick 17B | Meta | meta.llama4-maverick-17b-instruct-v1:0 | yes | no | yes | no | 1M | 8K | 9.3 | 16.3 | 31.7 | 57 | $0.24 / $0.97 | - | - | - | - | March 30, 2027 |
| Llama 4 Scout 17B | Meta | meta.llama4-scout-17b-instruct-v1:0 | yes | no | yes | no | 10M | 8K | 6.5 | 8.2 | 21.3 | 122 | $0.17 / $0.66 | - | - | - | - | March 30, 2027 |
| Meta Llama 2 Chat 13B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - | - |
| Minimax M2 | MiniMax | minimax.minimax-m2 | yes | yes | no | no | 1M | 8K | 18.6 | - | - | - | $0.30 / $1.20 | - | - | - | - | March 30, 2027 |
| Minimax M2.1 | MiniMax | minimax.minimax-m2.1 | yes | yes | no | no | 196K | 8K | 20.9 | - | - | - | $0.30 / $1.20 | - | - | - | - | March 30, 2027 |
| MiniMax M2.5 | MiniMax | minimax.minimax-m2.5 | yes | yes | no | no | 196K | 8K | 22.8 | - | - | - | $0.30 / $1.20 | - | - | - | - | - |
| Devstral | Mistral | mistral.devstral-2-123b | yes | yes | no | no | 256K | 32K | 9.0 | - | - | - | $0.40 / $2.00 | - | - | - | - | March 30, 2027 |
| Magistral Small 1.2 | Mistral | mistral.magistral-small-2509 | yes | yes | no | no | 128K | 40K | 8.6 | 14.7 | - | 101 | $0.50 / $1.50 | - | - | - | - | - |
| Ministral 14B 3.0 | Mistral | mistral.ministral-3-14b-instruct | yes | yes | no | no | 128K | 8K | 6.0 | 14.4 | 23.8 | 87 | $0.20 / $0.20 | - | - | - | - | - |
| Ministral 3B 3.0 | Mistral | mistral.ministral-3-3b-instruct | yes | yes | no | no | 128K | 8K | 4.8 | 4.8 | 15.3 | 226 | $0.10 / $0.10 | - | - | - | - | - |
| Ministral 8B 3.0 | Mistral | mistral.ministral-3-8b-instruct | yes | yes | no | no | 128K | 8K | 5.5 | 9.7 | 20.7 | 132 | $0.15 / $0.15 | - | - | - | - | - |
| Mistral Large 2407 | Mistral | - | yes | yes? | yes? | no | 미확인 | 미확인 | 6.8 | - | - | - | - | - | - | - | - | - |
| Mistral Large 3 | Mistral | mistral.mistral-large-3-675b-instruct | yes | yes | no | no | 256K | 32K | 9.3 | 20.1 | 36.6 | - | $0.50 / $1.50 | - | - | - | - | - |
| Pixtral Large 25.02 | Mistral | mistral.pixtral-large-2502-v1:0 | yes | no | yes | no | 128K | 16K | - | - | - | - | $2.00 / $6.00 | - | - | - | - | No sooner than 4/8/2026 |
| Voxtral Mini 1.0 | Mistral | mistral.voxtral-mini-3b-2507 | yes | yes | no | no | 32K | 4K | - | - | - | - | $0.04 / $0.04 | - | - | - | - | March 30, 2027 |
| Voxtral Small 1.0 | Mistral | mistral.voxtral-small-24b-2507 | yes | yes | no | no | 32K | 8K | - | - | - | - | $0.10 / $0.30 | - | - | - | - | March 30, 2027 |
| Kimi K2 Thinking | Moonshot AI | moonshot.kimi-k2-thinking | yes | yes | no | no | 256K | 16K | 22.0 | - | - | - | $0.60 / $2.50 | - | - | - | - | March 30, 2027 |
| Kimi K2.5 | Moonshot AI | moonshotai.kimi-k2.5 | yes | yes | no | no | 256K | 16K | 23.5 | 46.8 | - | - | $0.60 / $3.00 | - | - | - | - | - |
| Kimi K3 | Moonshot AI | moonshotai.kimi-k3 | yes | no | yes | yes | 1M | 128K | 43.6 | 76.2 | 59.5 | 39 | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Nemotron Nano 3 30B | NVIDIA | nvidia.nemotron-nano-3-30b | yes | yes | no | no | 256K | 8K | 8.9 | 14.4 | 30.6 | 235 | $0.06 / $0.24 | - | - | - | - | - |
| NVIDIA Nemotron 3 Super 120B A12B | NVIDIA | nvidia.nemotron-super-3-120b | yes | yes | no | no | 256K | 32K | 12.8 | 37.7 | 36.2 | - | $0.15 / $0.65 | - | - | - | - | - |
| NVIDIA Nemotron Nano 2 | NVIDIA | nvidia.nemotron-nano-9b-v2 | yes | yes | no | no | 128K | 8K | - | - | - | - | $0.06 / $0.23 | - | - | - | - | March 30, 2027 |
| NVIDIA Nemotron Nano 2 VL | NVIDIA | nvidia.nemotron-nano-12b-v2 | yes | yes | no | no | 128K | 8K | 7.5 | - | - | - | $0.20 / $0.60 | - | - | - | - | March 30, 2027 |
| Daybreak Blue: GPT-5.6 Sol [price: model card] | OpenAI | openai.gpt-daybreak-blue-5.6-sol | no | yes | no | no | 1.05M | 미확인 | - | - | - | - | $4.40 / $22.00 | $0.44 / $5.50 | - | - | >272K $8.80 / $33.00 | - |
| Daybreak Red: GPT-5.6 Cyber [price: model card] | OpenAI | openai.gpt-5.6-cyber | no | yes | no | no | 1.05M | 미확인 | - | - | - | - | $13.75 / $82.50 | $1.375 / $17.19 | - | - | - | - |
| GPT OSS Safeguard 120B | OpenAI | openai.gpt-oss-safeguard-120b | yes | yes | no | no | 128K | 16K | - | - | - | - | $0.15 / $0.60 | - | - | - | - | - |
| GPT OSS Safeguard 20B | OpenAI | openai.gpt-oss-safeguard-20b | yes | yes | no | no | 128K | 16K | - | - | - | - | $0.07 / $0.20 | - | - | - | - | - |
| GPT-5.4 | OpenAI | openai.gpt-5.4 | no | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 39.0 | 71.1 | - | - | $2.75 / $16.50 | $0.275 / - | - | - | >272K $5.50 / $24.75 | - |
| GPT-5.5 [price: model card] | OpenAI | openai.gpt-5.5 | no | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 38.4 | 74.9 | 55.8 | - | $5.50 / $33.00 | $0.55 / - | - | - | >272K $11.00 / $49.50 | - |
| GPT-5.6 Luna | OpenAI | openai.gpt-5.6-luna | no | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 37.3 | 71.4 | 53.6 | - | $0.22 / $1.32 | $0.022 / $0.275 | $0.20 / $1.20 | $0.02 / $0.25 | >272K $0.44 / $1.98 | - |
| GPT-5.6 Sol [price: model card] | OpenAI | openai.gpt-5.6-sol | no | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 47.0 | 77.4 | 57.1 | - | $4.40 / $22.00 | $0.44 / $5.50 | $4.00 / $20.00 | $0.40 / $5.00 | >272K $8.80 / $33.00 | - |
| GPT-5.6 Terra | OpenAI | openai.gpt-5.6-terra | no | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 42.1 | 76.7 | 55.0 | 116 | $2.20 / $13.20 | $0.22 / $2.75 | $2.00 / $12.00 | $0.20 / $2.50 | >272K $4.40 / $19.80 | - |
| GPT-6 Luna [price: model card] | OpenAI | openai.gpt-6-luna | no | no | yes | yes | 1.05M | 128K | 38.1 | - | 54.6 | 131 | $0.11 / $0.55 | $0.011 / $0.1375 | $0.10 / $0.50 | $0.01 / $0.125 | >272K $0.22 / $0.825 | - |
| GPT-6 Sol [price: model card] | OpenAI | openai.gpt-6-sol | no | no | yes | yes | 1.05M | 128K | 47.6 | - | 57.6 | - | $2.20 / $11.00 | $0.22 / $2.75 | $2.00 / $10.00 | $0.20 / $2.50 | >272K $4.40 / $16.50 | - |
| GPT-6.1 Sol [price: model card] | OpenAI | openai.gpt-6.1-sol | no | no | yes | yes | 1M | 131K | 51.8 | - | 54.2 | 55 | $2.20 / $11.00 | $0.11 / $2.75 | $2.00 / $10.00 | $0.10 / $2.50 | >272K $4.40 / $16.50 | - |
| gpt-oss-120b | OpenAI | openai.gpt-oss-120b-1:0 | yes | yes | no | no | 128K | 16K | 11.6 | 30.4 | 34.0 | 212 | $0.15 / $0.60 | - | - | - | - | - |
| gpt-oss-20b | OpenAI | openai.gpt-oss-20b-1:0 | yes | yes | no | no | 128K | 16K | 9.0 | 20.7 | 38.9 | 172 | $0.07 / $0.30 | - | - | - | - | - |
| OpenAI GPT-6 Astra | OpenAI | openai.gpt-6-astra | no | no | yes | yes | 1.05M | 128K | 52.7 | 76.9 | 56.5 | 59 | $11.00 / $55.00 | $1.10 / $13.75 | $10.00 / $50.00 | $1.00 / $12.50 | >272K $22.00 / $82.50 | - |
| Qwen3 235B A22B 2507 | Qwen | qwen.qwen3-235b-a22b-2507-v1:0 | yes | yes | no | no | 256K | 8K | 12.0 | - | - | - | $0.22 / $0.88 | - | - | - | - | - |
| Qwen3 32B | Qwen | qwen.qwen3-32b-v1:0 | yes | yes | no | no | 32K | 8K | 7.3 | - | - | - | $0.15 / $0.60 | - | - | - | - | - |
| Qwen3 Coder 30B A3B | Qwen | qwen.qwen3-coder-30b-a3b-v1:0 | yes | yes | no | no | 256K | 16K | 9.6 | - | - | - | $0.15 / $0.60 | - | - | - | - | March 30, 2027 |
| Qwen3 Coder 480B A35B | Qwen | qwen.qwen3-coder-480b-a35b-v1:0 | yes | yes | no | no | 256K | 16K | 11.9 | - | - | - | $0.45 / $1.80 | - | - | - | - | March 30, 2027 |
| Qwen3 VL 235B A22B | Qwen | qwen.qwen3-vl-235b-a22b | yes | yes | no | no | 256K | 8K | 13.4 | - | - | - | $0.53 / $2.66 | - | - | - | - | - |
| qwen3-next-80b-a3b | Qwen | qwen.qwen3-next-80b-a3b | yes | yes | no | no | 256K | 8K | 11.2 | 17.4 | - | - | $0.14 / $1.20 | - | - | - | - | - |
| TwelveLabs Pegasus 1.2 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - / $7.50 | - | - / $7.50 | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - / $7.50 | - | - / $7.50 | - | - | - |
| Palmyra X4 | Writer | writer.palmyra-x4-v1:0 | yes | no | yes | no | 128K | 8K | - | - | - | - | $2.50 / $10.00 | - | - | - | - | March 9, 2027 |
| Palmyra X5 | Writer | writer.palmyra-x5-v1:0 | yes | no | yes | no | 128K | 8K | - | - | - | - | $0.60 / $6.00 | - | - | - | - | March 21, 2027 |
| Writer Palmyra Vision 7B | Writer | writer.palmyra-vision-7b | yes | yes | no | no | 4K | 4K | - | - | - | - | $0.15 / $0.60 | - | - | - | - | - |
| Grok 4.3 | xAI | xai.grok-4.3 | yes | yes (mantle endpoint only) | no | no | 1M | 131K | 24.9 | 42.2 | 48.3 | - | $1.25 / $2.50 | $0.20 / - | - | - | - | - |
| Grok 4.6 | xAI | xai.grok-4.6 | yes | no | yes | yes | 500K | 500K | 44.3 | 76.8 | 56.5 | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| Grok 4.7 | xAI | xai.grok-4.7 | yes | no | yes | yes | 524K | 524288M | 46.4 | - | 57.4 | 78 | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| GLM 4.7 | Z AI | zai.glm-4.7 | yes | yes | no | no | 203K | 128K | 22.2 | 45.3 | - | - | $0.60 / $2.20 | - | - | - | - | March 30, 2027 |
| GLM 4.7 Flash | Z AI | zai.glm-4.7-flash | yes | yes | no | no | 203K | 128K | 14.9 | - | - | - | $0.07 / $0.40 | - | - | - | - | March 30, 2027 |
| GLM 5 | Z AI | zai.glm-5 | yes | yes | no | no | 200K | 128K | 27.9 | - | - | - | $1.00 / $3.20 | - | - | - | - | - |
| GLM 5.3 [price: manual] | Z AI | zai.glm-5.3 | yes | no | yes | yes | 1M | 128K | 44.8 | 74.8 | 59.0 | 77 | - | - | $1.68 / $5.28 | $0.312 / $2.10 | - | - |
