# Amazon Bedrock model comparison: us-east-1

Generated 2026-10-13 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 132 models that can be invoked from **us-east-1** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in us-east-1; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding Index are Artificial Analysis indices (higher is better); tok/s is median output speed. An individual metric can be unpublished even when other measurements exist for a model. Public-page measurement fallbacks include their source and verification date in models.json.
- SciCode (%) is a separate scientific-programming pass rate, not Coding Index. Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.

## Highest Intelligence Index available in us-east-1

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

## Cost/performance frontier in us-east-1

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

| Model | Provider | In-region | Geo CRIS | Global CRIS | Context | Max out | Intelligence | Coding Index | SciCode (%) | tok/s | Regional in/out | Regional cache read/write | Global in/out | Global cache read/write | Long-context (regional in/out) | EOL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jamba 1.5 Large | AI21 Labs | yes | no | no | 256K | 4K | 6.0 | - | - | - | $2.00 / $8.00 | - | - | - | - | 2026-11-26 |
| Jamba 1.5 Mini | AI21 Labs | yes | no | no | 256K | 4K | 5.2 | - | - | - | $0.20 / $0.40 | - | - | - | - | 2026-11-26 |
| Jamba-Instruct | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.50 / $0.70 | - | - | - | - | - |
| Jurassic-2 Mid | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $12.50 / $12.50 | - | - | - | - | - |
| Jurassic-2 Ultra | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $18.80 / $18.80 | - | - | - | - | - |
| Nova 2.0 Lite | Amazon | no | yes | yes | 1M | 64K | 8.7 | - | - | 225 | $0.33 / $2.75 | $0.0825 / $0.00 | $0.30 / $2.50 | $0.075 / $0.00 | - | - |
| Nova 2.0 Omni | Amazon | yes? | yes? | yes? | 미확인 | 미확인 | 8.2 | - | - | - | $0.30 / $2.80 | - | $0.30 / $2.50 | - | - | - |
| Nova 2.0 Pro | Amazon | yes? | yes? | yes? | 미확인 | 미확인 | 10.0 | 20.9 | - | 128 | $1.375 / $11.00 | - | $1.25 / $10.00 | - | - | - |
| Nova 2.5 Sonic | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.33 / $2.75 | - | - | - | - | - |
| Nova Lite | Amazon | yes | yes | no | 300K | 10K | 6.7 | - | - | - | $0.06 / $0.24 | $0.015 / $0.00 | - | - | - | No sooner than 12/4/2025 |
| Nova Micro | Amazon | yes | yes | no | 128K | 10K | 5.9 | - | - | 266 | $0.035 / $0.14 | $0.00875 / $0.00 | - | - | - | No sooner than 12/4/2025 |
| Nova Premier | Amazon | no | yes? | no | 1M | 10K | 9.2 | - | - | - | $2.50 / $12.50 | $0.625 / - | - | - | - | - |
| Nova Pro | Amazon | yes | yes | no | 300K | 10K | 7.0 | - | - | - | $0.80 / $3.20 | $0.20 / $0.00 | - | - | - | 2026-09-30 |
| Nova Pro Latency Optimized | Amazon | yes? | yes? | no | 미확인 | 미확인 | 7.0 | - | - | - | $1.00 / $4.00 | - | - | - | - | - |
| Nova Sonic | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.06 / $0.24 | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.33 / $2.75 | - | - | - | - | - |
| Claude | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $8.00 / $24.00 | - | - | - | - | - |
| Claude (100K) | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $22.04 / $65.36 | - | - | - | - | - |
| Claude 2.0 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.5 | 12.9 | - | - | $8.00 / - | - | - | - | - | - |
| Claude 2.1 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.6 | 14.0 | - | - | $8.00 / - | - | - | - | - | - |
| Claude 3 Haiku | Anthropic | yes | yes | no | 200K | 4K | 5.6 | - | - | - | $0.25 / $1.25 | - | - | - | - | 2026-07-30 |
| Claude 3 Opus | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 8.7 | 19.5 | - | - | $15.00 / $75.00 | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.9 | - | - | - | $3.00 / $15.00 | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 8.9 | 15.9 | - | - | $1.00 / $4.00 | $0.10 / $1.25 | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 7.2 | 26.0 | - | - | $3.00 / $15.00 | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 7.9 | 30.2 | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 15.3 | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | - |
| Claude Fable 5 | Anthropic | yes (mantle endpoint only) | yes | yes | 1M | 128K | 49.6 | 76.5 | 61.0 | - | $11.00 / $55.00 | $1.10 / $13.75 | $10.00 / $50.00 | $1.00 / $12.50 | - | - |
| Claude Fable 5.1 | Anthropic | no | yes | yes | 1M | 128K | 53.4 | 81.6 | 63.1 | 67 | $11.00 / $55.00 | $0.275 / $13.75 | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Haiku 4.5 | Anthropic | yes (mantle endpoint only) | yes | yes | 200K | 64K | 15.4 | - | - | - | $1.10 / $5.50 | $0.11 / $1.375 | $1.00 / $5.00 | $0.10 / $1.25 | - | - |
| Claude Haiku 5.5 | Anthropic | no | yes | yes | 1M | 128K | 43.4 | - | 55.0 | 239 | $0.11 / $0.55 | $0.011 / $0.1375 | $0.10 / $0.50 | $0.01 / $0.125 | >100K $0.55 / $2.75 | - |
| Claude Instant | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | $0.80 / $2.40 | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | $3.26 / $11.02 | - | - | - | - | - |
| Claude Mythos 5 | Anthropic | yes (mantle endpoint only) | no | no | 1M | 128K | - | - | - | - | $11.00 / $55.00 | $1.10 / $13.75 | - | - | - | - |
| Claude Mythos 5.1 | Anthropic | no | yes | yes | 1M | 128K | - | - | - | - | $11.00 / $55.00 | $0.275 / $13.75 | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Mythos Preview | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $27.50 / $138 | $2.75 / $34.38 | - | - | - | - |
| Claude Opus 4 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 16.6 | - | - | - | $15.00 / $75.00 | $1.50 / $18.75 | - | - | - | - |
| Claude Opus 4.1 | Anthropic | no | yes | no | 200K | 32K | 18.6 | - | - | - | $15.00 / $75.00 | $1.50 / $18.75 | - | - | - | 2027-01-08 |
| Claude Opus 4.5 | Anthropic | no | yes | yes | 200K | 64K | 23.7 | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.6 | Anthropic | no | yes | yes | 1M | 128K | 26.4 | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.7 | Anthropic | yes (mantle endpoint only) | yes | yes | 1M | 128K | 40.7 | 73.6 | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.8 | Anthropic | yes (mantle endpoint only) | yes | yes | 1M | 128K | 41.8 | 74.3 | 54.4 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5 | Anthropic | yes (mantle endpoint only) | yes | yes | 1M | 128K | 50.8 | 78.0 | 56.4 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5.5 | Anthropic | yes (mantle endpoint only) | yes | yes | 1M | 128K | 57.6 | - | 66.9 | 97 | $4.40 / $22.00 | $0.22 / $5.50 | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| Claude Sonnet 4 | Anthropic | no | yes | yes | 200K | 64K | 16.6 | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | $3.00 / $15.00 | $0.30 / $3.75 | - | 2026-10-14 |
| Claude Sonnet 4.5 | Anthropic | no | yes | yes | 200K | 64K | 19.3 | - | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | 2027-04-08 |
| Claude Sonnet 4.6 | Anthropic | no | yes | yes | 1M | 64K | 24.7 | - | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Claude Sonnet 5 | Anthropic | yes (mantle endpoint only) | yes | yes | 1M | 128K | 38.2 | 71.5 | 54.3 | - | $2.20 / $11.00 | $0.22 / $2.75 | $2.00 / $10.00 | $0.20 / $2.50 | - | - |
| Claude Sonnet 5.5 | Anthropic | no | yes | yes | 1M | 128K | 56.0 | - | 61.0 | 131 | $2.20 / $11.00 | $0.11 / $2.75 | $2.00 / $10.00 | $0.10 / $2.50 | - | - |
| Cohere Command R+ | Cohere | yes | no | no | 128K | 4K | 5.3 | - | - | - | $0.50 / $15.00 | - | - | - | - | 2026-08-19 |
| Cohere Embed 3 Model - English | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.10 / - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.12 / - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.10 / - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $1.00 / $2.00 | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.30 / $0.60 | - | - | - | - | - |
| DeepSeek v3.2 | DeepSeek | yes | no | no | 164K | 8K | 16.0 | - | - | - | $0.62 / $1.85 | - | - | - | - | - |
| R1 | DeepSeek | no | yes | no | 128K | 8K | - | - | - | - | $1.35 / $5.40 | - | - | - | - | March 30, 2027 |
| Gemma 3 12B | Google | yes | no | no | 128K | 8K | 3.8 | 5.8 | 16.4 | - | $0.09 / $0.29 | - | - | - | - | March 30, 2027 |
| Gemma 3 27B | Google | yes | no | no | 128K | 8K | 4.9 | 10.1 | 23.3 | - | $0.23 / $0.38 | - | - | - | - | March 30, 2027 |
| Gemma 3 4B | Google | yes | no | no | 128K | 8K | 4.8 | 2.7 | - | - | $0.04 / $0.08 | - | - | - | - | March 30, 2027 |
| Gemma 4 26B A4B | Google | yes (mantle endpoint only) | no | no | 256K | 33K | 16.7 | 39.3 | 40.0 | 68 | $0.13 / $0.40 | - | - | - | - | - |
| Gemma 4 31B | Google | yes (mantle endpoint only) | no | no | 256K | 33K | 14.7 | 43.4 | 45.5 | 35 | $0.14 / $0.40 | - | - | - | - | - |
| Gemma 4 E2B | Google | yes (mantle endpoint only) | no | no | 128K | 8K | 7.8 | 7.2 | - | - | $0.04 / $0.08 | - | - | - | - | - |
| Llama 3 70B | Meta | yes | no | no | 8K | 8K | 5.5 | - | - | - | $2.65 / $3.50 | - | - | - | - | March 30, 2027 |
| Llama 3 8B | Meta | yes | no | no | 8K | 8K | 4.8 | - | - | - | $0.30 / $0.60 | - | - | - | - | March 30, 2027 |
| Llama 3.1 405B Latency Optimized | Meta | yes? | yes? | no | 미확인 | 미확인 | 7.3 | - | - | - | - | - | - | - | - | - |
| Llama 3.1 70B | Meta | no | yes | no | 128K | 4K | 6.6 | - | - | - | $0.72 / $0.72 | - | - | - | - | March 30, 2027 |
| Llama 3.1 70B Latency Optimized | Meta | yes? | yes? | no | 미확인 | 미확인 | 6.6 | - | - | - | $0.90 / $0.90 | - | - | - | - | - |
| Llama 3.1 8B | Meta | no | yes | no | 128K | 4K | 6.9 | 5.4 | - | - | $0.22 / $0.22 | - | - | - | - | March 30, 2027 |
| Llama 3.2 11B | Meta | no | yes | no | 128K | 4K | 5.4 | - | - | 20 | $0.16 / $0.16 | - | - | - | - | 2026-07-07 |
| Llama 3.2 1B | Meta | no | yes | no | 128K | 4K | 4.8 | - | - | - | $0.10 / $0.10 | - | - | - | - | 2026-07-07 |
| Llama 3.2 3B | Meta | no | yes | no | 128K | 4K | 5.7 | - | - | - | $0.15 / $0.15 | - | - | - | - | 2026-07-07 |
| Llama 3.2 90B | Meta | no | yes | no | 128K | 4K | 6.4 | - | - | - | $0.72 / $0.72 | - | - | - | - | 2026-07-07 |
| Llama 3.3 70B | Meta | no | yes | no | 128K | 4K | 7.7 | 11.9 | - | 95 | $0.72 / $0.72 | - | - | - | - | March 30, 2027 |
| Llama 4 Maverick 17B | Meta | no | yes | no | 1M | 8K | 10.0 | 16.3 | 31.7 | 53 | $0.24 / $0.97 | - | - | - | - | March 30, 2027 |
| Llama 4 Scout 17B | Meta | no | yes | no | 10M | 8K | 8.1 | 8.2 | 21.3 | 85 | $0.17 / $0.66 | - | - | - | - | March 30, 2027 |
| Meta Llama 2 Chat 13B | Meta | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | $0.75 / $1.00 | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | $1.95 / $2.56 | - | - | - | - | - |
| Minimax M2 | MiniMax | yes | no | no | 1M | 8K | 18.6 | - | - | - | $0.30 / $1.20 | - | - | - | - | March 30, 2027 |
| Minimax M2.1 | MiniMax | yes | no | no | 196K | 8K | 20.9 | - | - | - | $0.30 / $1.20 | - | - | - | - | March 30, 2027 |
| MiniMax M2.5 | MiniMax | yes | no | no | 196K | 8K | 22.8 | - | - | - | $0.30 / $1.20 | - | - | - | - | - |
| Devstral | Mistral | yes | no | no | 256K | 32K | 9.0 | - | - | - | $0.40 / $2.00 | - | - | - | - | March 30, 2027 |
| Magistral Small 1.2 | Mistral | yes | no | no | 128K | 40K | 8.6 | 14.7 | - | 79 | $0.50 / $1.50 | - | - | - | - | - |
| Ministral 14B 3.0 | Mistral | yes | no | no | 128K | 8K | 6.0 | 14.4 | 23.8 | 60 | $0.20 / $0.20 | - | - | - | - | - |
| Ministral 3B 3.0 | Mistral | yes | no | no | 128K | 8K | 4.8 | 4.8 | 15.3 | 235 | $0.10 / $0.10 | - | - | - | - | - |
| Ministral 8B 3.0 | Mistral | yes | no | no | 128K | 8K | 5.5 | 9.7 | 20.7 | 100 | $0.15 / $0.15 | - | - | - | - | - |
| Mistral 7B | Mistral | yes | no | no | 32K | 4K | 5.0 | - | - | - | $0.15 / $0.20 | - | - | - | - | March 30, 2027 |
| Mistral Large | Mistral | yes | no | no | 32K | 4K | 5.8 | - | - | - | $4.00 / $12.00 | - | - | - | - | No sooner than 4/3/2025 |
| Mistral Large 2407 | Mistral | yes? | yes? | no | 미확인 | 미확인 | 6.8 | - | - | - | - | - | - | - | - | - |
| Mistral Large 3 | Mistral | yes | no | no | 256K | 32K | 9.3 | 20.1 | 36.6 | - | $0.50 / $1.50 | - | - | - | - | - |
| Mistral Small | Mistral | yes | no | no | 32K | 4K | 5.8 | - | - | - | $1.00 / $3.00 | - | - | - | - | No sooner than 5/24/2025 |
| Mixtral 8x7B | Mistral | yes | no | no | 32K | 4K | 5.1 | - | - | - | $0.45 / $0.70 | - | - | - | - | March 30, 2027 |
| Pixtral Large 25.02 | Mistral | no | yes | no | 128K | 16K | - | - | - | - | $2.00 / $6.00 | - | - | - | - | No sooner than 4/8/2026 |
| Voxtral Mini 1.0 | Mistral | yes | no | no | 32K | 4K | - | - | - | - | $0.04 / $0.04 | - | - | - | - | March 30, 2027 |
| Voxtral Small 1.0 | Mistral | yes | no | no | 32K | 8K | - | - | - | - | $0.10 / $0.30 | - | - | - | - | March 30, 2027 |
| Kimi K2 Thinking | Moonshot AI | yes | no | no | 256K | 16K | 22.0 | - | - | - | $0.60 / $2.50 | - | - | - | - | March 30, 2027 |
| Kimi K2.5 | Moonshot AI | yes | no | no | 256K | 16K | 23.5 | 46.8 | - | - | $0.60 / $3.00 | - | - | - | - | - |
| Kimi K3 | Moonshot AI | no | yes | yes | 1M | 128K | 43.6 | 76.2 | 59.5 | 44 | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Nemotron Nano 3 30B | NVIDIA | yes | no | no | 256K | 8K | 8.9 | 14.4 | 30.6 | 230 | $0.06 / $0.24 | - | - | - | - | - |
| NVIDIA Nemotron 3 Super 120B A12B | NVIDIA | yes | no | no | 256K | 32K | 12.8 | 37.7 | 36.2 | 159 | $0.15 / $0.65 | - | - | - | - | - |
| NVIDIA Nemotron Nano 2 | NVIDIA | yes | no | no | 128K | 8K | - | - | - | - | $0.06 / $0.23 | - | - | - | - | March 30, 2027 |
| NVIDIA Nemotron Nano 2 VL | NVIDIA | yes | no | no | 128K | 8K | 7.5 | - | - | - | $0.20 / $0.60 | - | - | - | - | March 30, 2027 |
| GPT OSS Safeguard 120B | OpenAI | yes | no | no | 128K | 16K | - | - | - | - | $0.15 / $0.60 | - | - | - | - | - |
| GPT OSS Safeguard 20B | OpenAI | yes | no | no | 128K | 16K | - | - | - | - | $0.07 / $0.20 | - | - | - | - | - |
| GPT-5.4 | OpenAI | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 39.0 | 71.1 | - | - | $2.75 / $16.50 | $0.275 / - | - | - | >272K $5.50 / $24.75 | - |
| GPT-5.5 [price: model card] | OpenAI | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 38.4 | 74.9 | 55.8 | - | $5.50 / $33.00 | $0.55 / - | - | - | >272K $11.00 / $49.50 | - |
| GPT-5.6 Luna | OpenAI | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 37.3 | 71.4 | 53.6 | - | $0.22 / $1.32 | $0.022 / $0.275 | $0.20 / $1.20 | $0.02 / $0.25 | >272K $0.44 / $1.98 | - |
| GPT-5.6 Sol [price: model card] | OpenAI | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 47.0 | 77.4 | 57.1 | - | $4.40 / $22.00 | $0.44 / $5.50 | $4.00 / $20.00 | $0.40 / $5.00 | >272K $8.80 / $33.00 | - |
| GPT-5.6 Terra | OpenAI | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 42.1 | 76.7 | 55.0 | 113 | $2.20 / $13.20 | $0.22 / $2.75 | $2.00 / $12.00 | $0.20 / $2.50 | >272K $4.40 / $19.80 | - |
| GPT-6 Luna [price: model card] | OpenAI | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 38.1 | - | 54.6 | 139 | $0.11 / $0.55 | $0.011 / $0.1375 | $0.10 / $0.50 | $0.01 / $0.125 | >272K $0.22 / $0.825 | - |
| GPT-6 Sol [price: model card] | OpenAI | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 47.6 | - | 57.6 | - | $2.20 / $11.00 | $0.22 / $2.75 | $2.00 / $10.00 | $0.20 / $2.50 | >272K $4.40 / $16.50 | - |
| GPT-6.1 Sol [price: model card] | OpenAI | yes (mantle endpoint only) | yes | yes | 1M | 131K | 51.8 | - | 54.2 | 60 | $2.20 / $11.00 | $0.11 / $2.75 | $2.00 / $10.00 | $0.10 / $2.50 | >272K $4.40 / $16.50 | - |
| gpt-oss-120b | OpenAI | yes | no | no | 128K | 16K | 11.6 | 30.4 | 34.0 | 229 | $0.15 / $0.60 | - | - | - | - | - |
| gpt-oss-20b | OpenAI | yes | no | no | 128K | 16K | 9.0 | 20.7 | 38.9 | 274 | $0.07 / $0.30 | - | - | - | - | - |
| OpenAI GPT-6 Astra | OpenAI | yes (mantle endpoint only) | yes | yes | 1.05M | 128K | 52.7 | 76.9 | 56.5 | 60 | $11.00 / $55.00 | $1.10 / $13.75 | $10.00 / $50.00 | $1.00 / $12.50 | >272K $22.00 / $82.50 | - |
| Qwen3 32B | Qwen | yes | no | no | 32K | 8K | 8.6 | 15.3 | 36.0 | - | $0.15 / $0.60 | - | - | - | - | - |
| Qwen3 Coder 30B A3B | Qwen | yes | no | no | 256K | 16K | 9.6 | - | - | - | $0.15 / $0.60 | - | - | - | - | March 30, 2027 |
| Qwen3 Coder Next | Qwen | yes | no | no | 256K | 16K | 9.2 | 36.2 | 36.2 | 86 | $0.50 / $1.20 | - | - | - | - | - |
| Qwen3 VL 235B A22B | Qwen | yes | no | no | 256K | 8K | 13.4 | - | - | - | $0.53 / $2.66 | - | - | - | - | - |
| qwen3-next-80b-a3b | Qwen | yes | no | no | 256K | 8K | 11.2 | 17.4 | - | 166 | $0.14 / $1.20 | - | - | - | - | - |
| TwelveLabs Pegasus 1.2 | TwelveLabs | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - / $7.50 | - | - / $7.50 | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - / $7.50 | - | - / $7.50 | - | - | - |
| Palmyra X4 | Writer | no | yes | no | 128K | 8K | - | - | - | - | $2.50 / $10.00 | - | - | - | - | No sooner than 4/28/2026 |
| Palmyra X5 | Writer | no | yes | no | 128K | 8K | - | - | - | - | $0.60 / $6.00 | - | - | - | - | No sooner than 4/28/2026 |
| Writer Palmyra Vision 7B | Writer | yes | no | no | 4K | 4K | - | - | - | - | $0.15 / $0.60 | - | - | - | - | - |
| Grok 4.3 | xAI | yes (mantle endpoint only) | no | no | 1M | 131K | 24.9 | 42.2 | 48.3 | - | $1.25 / $2.50 | $0.20 / - | - | - | - | - |
| Grok 4.6 | xAI | no | yes | yes | 500K | 500K | 44.3 | 76.8 | 56.5 | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| Grok 4.7 | xAI | no | yes | yes | 500K | 500K | 46.4 | - | 57.4 | 61 | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| GLM 4.7 | Z AI | yes | no | no | 203K | 128K | 22.2 | 45.3 | - | - | $0.60 / $2.20 | - | - | - | - | March 30, 2027 |
| GLM 4.7 Flash | Z AI | yes | no | no | 203K | 128K | 14.9 | - | - | - | $0.07 / $0.40 | - | - | - | - | March 30, 2027 |
| GLM 5 | Z AI | yes | no | no | 200K | 128K | 27.9 | - | - | - | $1.00 / $3.20 | - | - | - | - | - |
| GLM 5.3 [price: manual] | Z AI | no | yes | yes | 1M | 128K | 44.8 | 74.8 | 59.0 | 65 | $1.848 / $5.808 | $0.3432 / $2.31 | $1.68 / $5.28 | $0.312 / $2.10 | - | - |
