# Amazon Bedrock model comparison: eu-central-1

Generated 2026-10-11 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 84 models that can be invoked from **eu-central-1** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in eu-central-1; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding are Artificial Analysis indices (0-100, higher is better); tok/s is median output speed. Missing for models Artificial Analysis does not cover.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.

## Highest Intelligence Index available in eu-central-1

- Claude Opus 5.5 (Anthropic): Intelligence 57.6, cheapest 4:1 blended $7.20 per 1M tokens
- Claude Sonnet 5.5 (Anthropic): Intelligence 56.0, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Fable 5.1 (Anthropic): Intelligence 53.4, cheapest 4:1 blended $18.00 per 1M tokens
- OpenAI GPT-6 Astra (OpenAI): Intelligence 52.7, cheapest 4:1 blended $18.00 per 1M tokens
- Claude Opus 5 (Anthropic): Intelligence 50.8, cheapest 4:1 blended $9.00 per 1M tokens
- Claude Fable 5 (Anthropic): Intelligence 49.6, cheapest 4:1 blended $18.00 per 1M tokens
- GPT-6 Sol (OpenAI): Intelligence 47.6, cheapest 4:1 blended $3.60 per 1M tokens
- Grok 4.7 (xAI): Intelligence 46.4, cheapest 4:1 blended $2.80 per 1M tokens
- GLM 5.3 (Z AI): Intelligence 44.8, cheapest 4:1 blended $2.40 per 1M tokens
- Grok 4.6 (xAI): Intelligence 44.3, cheapest 4:1 blended $2.80 per 1M tokens
- Kimi K3 (Moonshot AI): Intelligence 43.6, cheapest 4:1 blended $5.40 per 1M tokens
- Claude Haiku 5.5 (Anthropic): Intelligence 43.4, cheapest 4:1 blended $0.18 per 1M tokens

## Cost/performance frontier in eu-central-1

No other model here is both cheaper and higher scoring than these (sorted by price):

- Gemma 4 E2B (Google): Intelligence 7.8, cheapest 4:1 blended $0.0576 per 1M tokens
- gpt-oss-20b (OpenAI): Intelligence 9.0, cheapest 4:1 blended $0.152 per 1M tokens
- GLM 4.7 Flash (Z AI): Intelligence 14.9, cheapest 4:1 blended $0.16 per 1M tokens
- Claude Haiku 5.5 (Anthropic): Intelligence 43.4, cheapest 4:1 blended $0.18 per 1M tokens
- GLM 5.3 (Z AI): Intelligence 44.8, cheapest 4:1 blended $2.40 per 1M tokens
- Grok 4.7 (xAI): Intelligence 46.4, cheapest 4:1 blended $2.80 per 1M tokens
- Claude Sonnet 5.5 (Anthropic): Intelligence 56.0, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Opus 5.5 (Anthropic): Intelligence 57.6, cheapest 4:1 blended $7.20 per 1M tokens

## All models

| Model | Provider | In-region | Geo CRIS | Global CRIS | Context | Max out | Intelligence | Coding | tok/s | Regional in/out | Regional cache read/write | Global in/out | Global cache read/write | Long-context (regional in/out) | EOL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jamba-Instruct | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Mid | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Ultra | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Nova 2.0 Lite | Amazon | no | yes | yes | 1M | 64K | 8.7 | - | 222 | $0.429 / $3.597 | $0.1072 / $0.00 | $0.39 / $3.27 | $0.0975 / $0.00 | - | - |
| Nova 2.0 Omni | Amazon | yes? | yes? | yes? | 미확인 | 미확인 | 8.2 | - | - | - | - | $0.40 / $3.30 | - | - | - |
| Nova 2.0 Pro | Amazon | yes? | yes? | yes? | 미확인 | 미확인 | 10.0 | 20.9 | 124 | - | - | $1.63 / $13.08 | - | - | - |
| Nova 2.5 Sonic | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Nova Lite | Amazon | no | yes | no | 300K | 10K | 6.7 | - | - | $0.078 / $0.312 | $0.0195 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Micro | Amazon | no | yes | no | 128K | 10K | 5.9 | - | 248 | $0.046 / $0.184 | $0.0115 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Premier | Amazon | no | yes? | no | 1M | 10K | 9.2 | - | - | - | - | - | - | - | - |
| Nova Pro | Amazon | no | yes | no | 300K | 10K | 7.0 | - | - | $1.05 / $4.20 | $0.2625 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Pro Latency Optimized | Amazon | yes? | yes? | no | 미확인 | 미확인 | 7.0 | - | - | - | - | - | - | - | - |
| Nova Sonic | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Claude | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | $8.00 / $24.00 | - | - | - | - | - |
| Claude (100K) | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Claude 2.0 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.5 | 12.9 | - | - | - | - | - | - | - |
| Claude 2.1 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.6 | 14.0 | - | - | - | - | - | - | - |
| Claude 3 Haiku | Anthropic | yes | yes | no | 200K | 4K | 5.6 | - | - | $0.25 / $1.25 | - | - | - | - | 2026-07-30 |
| Claude 3 Opus | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 8.7 | 19.5 | - | - | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.9 | - | - | $3.00 / $15.00 | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 8.9 | 15.9 | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 7.2 | 26.0 | - | $3.00 / $15.00 | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 7.9 | 30.2 | - | - | - | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 15.3 | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | - |
| Claude Fable 5 | Anthropic | no | no | yes | 1M | 128K | 49.6 | 76.5 | - | $11.00 / $55.00 | $1.10 / $13.75 | $10.00 / $50.00 | $1.00 / $12.50 | - | - |
| Claude Fable 5.1 | Anthropic | no | no | yes | 1M | 128K | 53.4 | 81.6 | 70 | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Haiku 4.5 | Anthropic | no | yes | yes | 200K | 64K | 15.4 | - | 89 | $1.10 / $5.50 | $0.11 / $1.375 | $1.00 / $5.00 | $0.10 / $1.25 | - | - |
| Claude Haiku 5.5 | Anthropic | no | yes | yes | 1M | 128K | 43.4 | - | 237 | $0.11 / $0.55 | $0.011 / $0.1375 | $0.10 / $0.50 | $0.01 / $0.125 | >100K $0.55 / $2.75 | - |
| Claude Instant | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | $0.80 / $2.40 | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - |
| Claude Mythos 5.1 | Anthropic | no | no | yes | 1M | 128K | - | - | - | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Mythos Preview | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Claude Opus 4 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 16.6 | - | - | - | - | - | - | - | - |
| Claude Opus 4.5 | Anthropic | no | yes | yes | 200K | 64K | 23.7 | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.6 | Anthropic | no | yes | yes | 1M | 128K | 26.4 | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.7 | Anthropic | no | yes | yes | 1M | 128K | 40.7 | 73.6 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.8 | Anthropic | no | yes | yes | 1M | 128K | 41.8 | 74.3 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5 | Anthropic | no | yes | yes | 1M | 128K | 50.8 | 78.0 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5.5 | Anthropic | no | yes | yes | 1M | 128K | 57.6 | - | 97 | $4.40 / $22.00 | $0.22 / $5.50 | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| Claude Sonnet 4 | Anthropic | no | yes | no | 200K | 64K | 16.6 | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | 2026-10-14 |
| Claude Sonnet 4.5 | Anthropic | no | yes | yes | 200K | 64K | 19.3 | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | 2027-04-08 |
| Claude Sonnet 4.6 | Anthropic | no | yes | yes | 1M | 64K | 24.7 | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Claude Sonnet 5 | Anthropic | no | yes | yes | 1M | 128K | 38.2 | 71.5 | - | $2.20 / $11.00 | $0.22 / $2.75 | $2.00 / $10.00 | $0.20 / $2.50 | - | - |
| Claude Sonnet 5.5 | Anthropic | no | yes | yes | 1M | 128K | 56.0 | - | 137 | $2.20 / $11.00 | $0.11 / $2.75 | $2.00 / $10.00 | $0.10 / $2.50 | - | - |
| Cohere Embed 3 Model - English | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | $0.10 / - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | $0.12 / - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | $0.10 / - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - |
| Gemma 4 26B A4B | Google | yes (mantle endpoint only) | no | no | 256K | 33K | 16.7 | 39.3 | 61 | $0.156 / $0.48 | - | - | - | - | - |
| Gemma 4 31B | Google | yes (mantle endpoint only) | no | no | 256K | 33K | 14.7 | 43.4 | 35 | $0.168 / $0.48 | - | - | - | - | - |
| Gemma 4 E2B | Google | yes (mantle endpoint only) | no | no | 128K | 8K | 7.8 | 7.2 | - | $0.048 / $0.096 | - | - | - | - | - |
| Llama 3.1 405B Latency Optimized | Meta | yes? | yes? | no | 미확인 | 미확인 | 7.3 | - | - | - | - | - | - | - | - |
| Llama 3.1 70B Latency Optimized | Meta | yes? | yes? | no | 미확인 | 미확인 | 6.6 | - | - | - | - | - | - | - | - |
| Llama 3.2 1B | Meta | no | yes | no | 128K | 4K | 4.8 | - | - | $0.13 / $0.13 | - | - | - | - | 2026-07-07 |
| Llama 3.2 3B | Meta | no | yes | no | 128K | 4K | 5.7 | - | - | $0.19 / $0.19 | - | - | - | - | 2026-07-07 |
| Meta Llama 2 Chat 13B | Meta | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - |
| Minimax M2.1 | MiniMax | yes | no | no | 196K | 8K | 20.9 | - | - | $0.36 / $1.44 | - | - | - | - | March 30, 2027 |
| MiniMax M2.5 | MiniMax | yes | no | no | 196K | 8K | 22.8 | - | - | $0.36 / $1.44 | - | - | - | - | - |
| Devstral | Mistral | yes | no | no | 256K | 32K | 9.0 | - | - | $0.48 / $2.40 | - | - | - | - | March 30, 2027 |
| Mistral Large 2407 | Mistral | yes? | yes? | no | 미확인 | 미확인 | 6.8 | - | - | - | - | - | - | - | - |
| Pixtral Large 25.02 | Mistral | no | yes | no | 128K | 16K | - | - | - | $2.00 / $6.00 | - | - | - | - | No sooner than 4/8/2026 |
| Kimi K3 | Moonshot AI | no | no | yes | 1M | 128K | 43.6 | 76.2 | 39 | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| NVIDIA Nemotron 3 Super 120B A12B | NVIDIA | yes | no | no | 256K | 32K | 12.8 | 37.7 | 150 | $0.18 / $0.78 | - | - | - | - | - |
| GPT-5.6 Luna | OpenAI | no | no | yes | 1.05M | 128K | 37.3 | 71.4 | - | - | - | $0.20 / $1.20 | $0.02 / $0.25 | >272K global $0.40 / $1.80 | - |
| GPT-5.6 Sol [price: model card] | OpenAI | no | no | yes | 1.05M | 128K | - | - | - | - | - | $4.00 / $20.00 | $0.40 / $5.00 | >272K global $8.00 / $30.00 | - |
| GPT-5.6 Terra | OpenAI | no | no | yes | 1.05M | 128K | 42.1 | 76.7 | 117 | - | - | $2.00 / $12.00 | $0.20 / $2.50 | >272K global $4.00 / $18.00 | - |
| GPT-6 Luna [price: model card] | OpenAI | no | no | yes | 1.05M | 128K | 38.1 | - | 138 | - | - | $0.10 / $0.50 | $0.01 / $0.125 | >272K global $0.20 / $0.75 | - |
| GPT-6 Sol [price: model card] | OpenAI | no | no | yes | 1.05M | 128K | 47.6 | - | - | - | - | $2.00 / $10.00 | $0.20 / $2.50 | >272K global $4.00 / $15.00 | - |
| GPT-6.1 Sol [price: model card] | OpenAI | no | no | yes | 1M | 131K | - | - | - | - | - | $2.00 / $10.00 | $0.10 / $2.50 | >272K global $4.00 / $15.00 | - |
| gpt-oss-120b | OpenAI | yes | no | no | 128K | 16K | 11.6 | 30.4 | 217 | $0.20 / $0.79 | - | - | - | - | - |
| gpt-oss-20b | OpenAI | yes | no | no | 128K | 16K | 9.0 | 20.7 | 211 | $0.09 / $0.40 | - | - | - | - | - |
| OpenAI GPT-6 Astra | OpenAI | no | no | yes | 1.05M | 128K | 52.7 | 76.9 | 51 | - | - | $10.00 / $50.00 | $1.00 / $12.50 | >272K global $20.00 / $75.00 | - |
| Qwen3 235B A22B 2507 | Qwen | yes | no | no | 256K | 8K | 12.0 | - | - | $0.29 / $1.16 | - | - | - | - | - |
| Qwen3 32B | Qwen | yes | no | no | 32K | 8K | 8.6 | 15.3 | - | $0.20 / $0.79 | - | - | - | - | - |
| Qwen3 Coder 30B A3B | Qwen | yes | no | no | 256K | 16K | 9.6 | - | - | $0.20 / $0.79 | - | - | - | - | March 30, 2027 |
| TwelveLabs Pegasus 1.2 | TwelveLabs | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - / $7.50 | - | - / $7.50 | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - / $7.50 | - | - | - |
| Grok 4.6 | xAI | no | no | yes | 500K | 500K | 44.3 | 76.8 | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| Grok 4.7 | xAI | no | no | yes | 500K | 500K | 46.4 | - | 74 | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| GLM 4.7 Flash | Z AI | yes | no | no | 203K | 4K | 14.9 | - | - | $0.08 / $0.48 | - | - | - | - | March 30, 2027 |
| GLM 5.3 [price: manual] | Z AI | no | no | yes | 1M | 128K | 44.8 | 74.8 | 60 | - | - | $1.68 / $5.28 | $0.312 / $2.10 | - | - |
