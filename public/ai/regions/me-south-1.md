# Amazon Bedrock model comparison: me-south-1

Generated 2026-10-14 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 56 models that can be invoked from **me-south-1** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in me-south-1; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding Index are Artificial Analysis indices (higher is better); tok/s is median output speed. An individual metric can be unpublished even when other measurements exist for a model. Public-page measurement fallbacks include their source and verification date in models.json.
- SciCode (%) is a separate scientific-programming pass rate, not Coding Index. Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.

## Highest Intelligence Index available in me-south-1

- Claude Opus 5.5 (Anthropic): Intelligence 57.6, cheapest 4:1 blended $7.20 per 1M tokens
- Claude Sonnet 5.5 (Anthropic): Intelligence 56.0, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Fable 5.1 (Anthropic): Intelligence 53.4, cheapest 4:1 blended $18.00 per 1M tokens
- Claude Opus 5 (Anthropic): Intelligence 50.8, cheapest 4:1 blended $9.00 per 1M tokens
- Claude Fable 5 (Anthropic): Intelligence 49.6, cheapest 4:1 blended $18.00 per 1M tokens
- GPT-5.6 Sol (OpenAI): Intelligence 47.0, cheapest 4:1 blended $7.20 per 1M tokens
- Grok 4.6 (xAI): Intelligence 44.3, cheapest 4:1 blended $2.80 per 1M tokens
- Kimi K3 (Moonshot AI): Intelligence 43.6, cheapest 4:1 blended $5.40 per 1M tokens
- Claude Haiku 5.5 (Anthropic): Intelligence 43.4, cheapest 4:1 blended $0.18 per 1M tokens
- GPT-5.6 Terra (OpenAI): Intelligence 42.1, cheapest 4:1 blended $4.00 per 1M tokens
- Claude Opus 4.8 (Anthropic): Intelligence 41.8, cheapest 4:1 blended $9.00 per 1M tokens
- Claude Opus 4.7 (Anthropic): Intelligence 40.7, cheapest 4:1 blended $9.00 per 1M tokens

## Cost/performance frontier in me-south-1

No other model here is both cheaper and higher scoring than these (sorted by price):

- Claude Haiku 5.5 (Anthropic): Intelligence 43.4, cheapest 4:1 blended $0.18 per 1M tokens
- Grok 4.6 (xAI): Intelligence 44.3, cheapest 4:1 blended $2.80 per 1M tokens
- Claude Sonnet 5.5 (Anthropic): Intelligence 56.0, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Opus 5.5 (Anthropic): Intelligence 57.6, cheapest 4:1 blended $7.20 per 1M tokens

## All models

| Model | Provider | In-region | Geo CRIS | Global CRIS | Context | Max out | Intelligence | Coding Index | SciCode (%) | tok/s | Regional in/out | Regional cache read/write | Global in/out | Global cache read/write | Long-context (regional in/out) | EOL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jamba-Instruct | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Mid | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Ultra | AI21 Labs | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova 2.0 Omni | Amazon | yes? | yes? | yes? | 미확인 | 미확인 | 8.2 | - | - | - | - | - | $0.30 / $2.70 | - | - | - |
| Nova 2.0 Pro | Amazon | yes? | yes? | yes? | 미확인 | 미확인 | 10.0 | 20.9 | - | 126 | - | - | - | - | - | - |
| Nova 2.5 Sonic | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Premier | Amazon | no | yes? | no | 1M | 10K | 9.2 | - | - | - | - | - | - | - | - | - |
| Nova Pro Latency Optimized | Amazon | yes? | yes? | no | 미확인 | 미확인 | 7.0 | - | - | - | - | - | - | - | - | - |
| Nova Sonic | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude (100K) | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 2.0 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.5 | 12.9 | - | - | - | - | - | - | - | - |
| Claude 2.1 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.6 | 14.0 | - | - | - | - | - | - | - | - |
| Claude 3 Opus | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 8.7 | 19.5 | - | - | - | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.9 | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 8.9 | 15.9 | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 7.2 | 26.0 | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 7.9 | 30.2 | - | - | - | - | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 15.3 | - | - | - | - | - | - | - | - | - |
| Claude Fable 5 | Anthropic | no | no | yes | 1M | 128K | 49.6 | 76.5 | 61.0 | - | - | - | $10.00 / $50.00 | $1.00 / $12.50 | - | - |
| Claude Fable 5.1 | Anthropic | no | no | yes | 1M | 128K | 53.4 | 81.6 | 63.1 | 65 | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Haiku 4.5 | Anthropic | no | no | yes | 200K | 64K | 15.4 | - | - | - | - | - | $1.00 / $5.00 | $0.10 / $1.25 | - | - |
| Claude Haiku 5.5 | Anthropic | no | no | yes | 1M | 128K | 43.4 | - | 55.0 | 239 | - | - | $0.10 / $0.50 | $0.01 / $0.125 | >100K global $0.50 / $2.50 | - |
| Claude Instant | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - | - |
| Claude Mythos 5.1 | Anthropic | no | no | yes | 1M | 128K | - | - | - | - | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Mythos Preview | Anthropic | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Opus 4 | Anthropic | yes? | yes? | no | 미확인 | 미확인 | 16.6 | - | - | - | - | - | - | - | - | - |
| Claude Opus 4.5 | Anthropic | no | no | yes | 200K | 64K | 23.7 | - | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.6 | Anthropic | no | no | yes | 1M | 128K | 26.4 | - | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.7 | Anthropic | no | no | yes | 1M | 128K | 40.7 | 73.6 | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.8 | Anthropic | no | no | yes | 1M | 128K | 41.8 | 74.3 | 54.4 | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5 | Anthropic | no | no | yes | 1M | 128K | 50.8 | 78.0 | 56.4 | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5.5 | Anthropic | no | no | yes | 1M | 128K | 57.6 | - | 66.9 | 96 | - | - | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| Claude Sonnet 4.5 | Anthropic | no | no | yes | 200K | 64K | 19.3 | - | - | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | 2027-04-08 |
| Claude Sonnet 4.6 | Anthropic | no | no | yes | 1M | 64K | 24.7 | - | - | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Claude Sonnet 5 | Anthropic | no | no | yes | 1M | 128K | 38.2 | 71.5 | 54.3 | - | - | - | $2.00 / $10.00 | $0.20 / $2.50 | - | - |
| Claude Sonnet 5.5 | Anthropic | no | no | yes | 1M | 128K | 56.0 | - | 61.0 | 133 | - | - | $2.00 / $10.00 | $0.10 / $2.50 | - | - |
| Cohere Embed 3 Model - English | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Llama 3.1 405B Latency Optimized | Meta | yes? | yes? | no | 미확인 | 미확인 | 7.3 | - | - | - | - | - | - | - | - | - |
| Llama 3.1 70B Latency Optimized | Meta | yes? | yes? | no | 미확인 | 미확인 | 6.6 | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 13B | Meta | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - | - |
| Mistral Large 2407 | Mistral | yes? | yes? | no | 미확인 | 미확인 | 6.8 | - | - | - | - | - | - | - | - | - |
| Kimi K3 | Moonshot AI | no | no | yes | 1M | 128K | 43.6 | 76.2 | 59.5 | 47 | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| GPT-5.6 Luna | OpenAI | no | no | yes | 1.05M | 128K | 37.3 | 71.4 | 53.6 | - | - | - | $0.20 / $1.20 | $0.02 / $0.25 | >272K global $0.40 / $1.80 | - |
| GPT-5.6 Sol [price: model card] | OpenAI | no | no | yes | 1.05M | 128K | 47.0 | 77.4 | 57.1 | - | - | - | $4.00 / $20.00 | $0.40 / $5.00 | >272K global $8.00 / $30.00 | - |
| GPT-5.6 Terra | OpenAI | no | no | yes | 1.05M | 128K | 42.1 | 76.7 | 55.0 | 106 | - | - | $2.00 / $12.00 | $0.20 / $2.50 | >272K global $4.00 / $18.00 | - |
| TwelveLabs Pegasus 1.2 | TwelveLabs | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - / $7.50 | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - / $7.50 | - | - | - |
| Grok 4.6 | xAI | no | no | yes | 500K | 500K | 44.3 | 76.8 | 56.5 | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
