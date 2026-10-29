# Amazon Bedrock model comparison: eu-south-1

Generated 2026-10-29 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 95 models that can be invoked from **eu-south-1** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in eu-south-1; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding Index are Artificial Analysis indices (higher is better); tok/s is median output speed. An individual metric can be unpublished even when other measurements exist for a model. Public-page measurement fallbacks include their source and verification date in models.json.
- SciCode (%) is a separate scientific-programming pass rate, not Coding Index. Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.
- Model ID is the bare Bedrock id for In-region calls; Geo CRIS prepends the geography (e.g. us.), Global CRIS prepends global.
- ZDR = zero data retention by default. Not ZDR: OpenAI models other than gpt-oss-120b/20b and GPT OSS Safeguard 120B/20B (ZDR is an option requested through the AWS account team, approved per model version, so a new version needs a new request; without approval the default policy applies) and Claude Fable 5 / 5.1 (all traffic kept up to 30 days; ZDR only for Enterprise Frontier Safeguards customers through 2026-12-31). Source: AWS Bedrock abuse detection page. Every other model keeps its previous policy (ZDR).

## Highest Intelligence Index available in eu-south-1

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

## Cost/performance frontier in eu-south-1

No other model here is both cheaper and higher scoring than these (sorted by price):

- Gemma 3 4B (Google): Intelligence 4.8, cheapest 4:1 blended $0.058 per 1M tokens
- Nova Micro (Amazon): Intelligence 5.9, cheapest 4:1 blended $0.0896 per 1M tokens
- Nemotron Nano 3 30B (NVIDIA): Intelligence 8.9, cheapest 4:1 blended $0.112 per 1M tokens
- gpt-oss-20b (OpenAI): Intelligence 9.0, cheapest 4:1 blended $0.152 per 1M tokens
- GLM 4.7 Flash (Z AI): Intelligence 14.9, cheapest 4:1 blended $0.16 per 1M tokens
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
| Nova 2.0 Lite | Amazon | - | yes | no | yes | yes | 1M | 64K | 8.7 | - | - | 222 | $0.528 / $4.411 | $0.132 / $0.00 | $0.481 / $4.10 | $0.0825 / $0.00 | - | - |
| Nova 2.0 Omni | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | 8.2 | - | - | - | - | - | $0.50 / $4.00 | - | - | - |
| Nova 2.0 Pro | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | 10.0 | 20.9 | - | 126 | - | - | $2.01 / $16.05 | - | - | - |
| Nova 2.5 Sonic | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Lite | Amazon | - | yes | no | yes | no | 300K | 10K | 6.7 | - | - | - | $0.096 / $0.384 | $0.024 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Micro | Amazon | - | yes | no | yes | no | 128K | 10K | 5.9 | - | - | 257 | $0.056 / $0.224 | $0.014 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Premier | Amazon | - | yes | no | yes? | no | 1M | 10K | 9.2 | - | - | - | - | - | - | - | - | - |
| Nova Pro | Amazon | - | yes | no | yes | no | 300K | 10K | 7.0 | - | - | - | $1.28 / $5.21 | $0.32 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Pro Latency Optimized | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.0 | - | - | - | - | - | - | - | - | - |
| Nova Sonic | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 2.0 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.5 | 12.9 | - | - | - | - | - | - | - | - |
| Claude 2.1 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.6 | 14.0 | - | - | - | - | - | - | - | - |
| Claude 3 Opus | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 8.7 | 19.5 | - | - | - | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.9 | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 8.9 | 15.9 | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.2 | 26.0 | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.9 | 30.2 | - | - | $3.00 / $15.00 | - | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 15.3 | - | - | - | - | - | - | - | - | - |
| Claude Fable 5 | Anthropic | - | no | no | no | yes | 1M | 128K | 49.6 | 76.5 | 61.0 | - | $11.00 / $55.00 | $1.10 / $13.75 | $10.00 / $50.00 | $1.00 / $12.50 | - | - |
| Claude Fable 5.1 | Anthropic | - | no | no | no | yes | 1M | 128K | 53.4 | 81.6 | 63.1 | 65 | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Haiku 4.5 | Anthropic | - | yes | no | yes | yes | 200K | 64K | 15.4 | - | - | - | $1.10 / $5.50 | $0.11 / $1.375 | $1.00 / $5.00 | $0.10 / $1.25 | - | - |
| Claude Haiku 5.5 | Anthropic | - | yes | no | yes | yes | 1M | 128K | 43.4 | - | 55.0 | 239 | $0.11 / $0.55 | $0.011 / $0.1375 | $0.10 / $0.50 | $0.01 / $0.125 | >100K $0.55 / $2.75 | - |
| Claude Instant | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - | - |
| Claude Mythos 5.1 | Anthropic | - | yes | no | no | yes | 1M | 128K | - | - | - | - | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Mythos Preview | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Opus 4 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 16.6 | - | - | - | - | - | - | - | - | - |
| Claude Opus 4.5 | Anthropic | - | yes | no | yes | yes | 200K | 64K | 23.7 | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.6 | Anthropic | - | yes | no | yes | yes | 1M | 128K | 26.4 | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.7 | Anthropic | - | yes | no | yes | yes | 1M | 128K | 40.7 | 73.6 | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.8 | Anthropic | - | yes | no | yes | yes | 1M | 128K | 41.8 | 74.3 | 54.4 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5 | Anthropic | - | yes | no | yes | yes | 1M | 128K | 50.8 | 78.0 | 56.4 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5.5 | Anthropic | - | yes | no | yes | yes | 1M | 128K | 57.6 | - | 66.9 | 96 | $4.40 / $22.00 | $0.22 / $5.50 | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| Claude Sonnet 4 | Anthropic | - | yes | no | yes | no | 200K | 64K | 16.6 | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | 2026-10-14 |
| Claude Sonnet 4.5 | Anthropic | - | yes | no | yes | yes | 200K | 64K | 19.3 | - | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | 2027-04-08 |
| Claude Sonnet 4.6 | Anthropic | - | yes | no | yes | yes | 1M | 64K | 24.7 | - | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Claude Sonnet 5 | Anthropic | - | yes | no | yes | yes | 1M | 128K | 38.2 | 71.5 | 54.3 | - | $2.20 / $11.00 | $0.22 / $2.75 | $2.00 / $10.00 | $0.20 / $2.50 | - | - |
| Claude Sonnet 5.5 | Anthropic | - | yes | no | yes | yes | 1M | 128K | 56.0 | - | 61.0 | 133 | $2.20 / $11.00 | $0.11 / $2.75 | $2.00 / $10.00 | $0.10 / $2.50 | - | - |
| Cohere Embed 3 Model - English | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.12 / - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Gemma 3 12B | Google | - | yes | yes | no | no | 128K | 8K | 3.8 | 5.8 | 16.4 | - | $0.11 / $0.34 | - | - | - | - | March 30, 2027 |
| Gemma 3 27B | Google | - | yes | yes | no | no | 128K | 8K | 4.9 | 10.1 | 23.3 | - | $0.27 / $0.45 | - | - | - | - | March 30, 2027 |
| Gemma 3 4B | Google | - | yes | yes | no | no | 128K | 8K | 4.8 | 2.7 | - | - | $0.05 / $0.09 | - | - | - | - | March 30, 2027 |
| Llama 3.1 405B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.3 | - | - | - | - | - | - | - | - | - |
| Llama 3.1 70B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 6.6 | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 13B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - | - |
| Minimax M2 | MiniMax | - | yes | yes | no | no | 1M | 8K | 18.6 | - | - | - | $0.35 / $1.41 | - | - | - | - | March 30, 2027 |
| Minimax M2.1 | MiniMax | - | yes | yes | no | no | 196K | 8K | 20.9 | - | - | - | $0.36 / $1.44 | - | - | - | - | March 30, 2027 |
| MiniMax M2.5 | MiniMax | - | yes | yes | no | no | 196K | 8K | 22.8 | - | - | - | $0.36 / $1.44 | - | - | - | - | - |
| Devstral | Mistral | - | yes | yes | no | no | 256K | 32K | 9.0 | - | - | - | $0.48 / $2.40 | - | - | - | - | March 30, 2027 |
| Magistral Small 1.2 | Mistral | - | yes | yes | no | no | 128K | 40K | 8.6 | 14.7 | - | 79 | $0.59 / $1.76 | - | - | - | - | - |
| Ministral 14B 3.0 | Mistral | - | yes | yes | no | no | 128K | 8K | 6.0 | 14.4 | 23.8 | 63 | $0.23 / $0.23 | - | - | - | - | - |
| Ministral 3B 3.0 | Mistral | - | yes | yes | no | no | 128K | 8K | 4.8 | 4.8 | 15.3 | 241 | $0.12 / $0.12 | - | - | - | - | - |
| Ministral 8B 3.0 | Mistral | - | yes | yes | no | no | 128K | 8K | 5.5 | 9.7 | 20.7 | 114 | $0.18 / $0.18 | - | - | - | - | - |
| Mistral Large 2407 | Mistral | - | yes | yes? | yes? | no | 미확인 | 미확인 | 6.8 | - | - | - | - | - | - | - | - | - |
| Voxtral Mini 1.0 | Mistral | - | yes | yes | no | no | 32K | 4K | - | - | - | - | $0.05 / $0.05 | - | - | - | - | March 30, 2027 |
| Voxtral Small 1.0 | Mistral | - | yes | yes | no | no | 32K | 8K | - | - | - | - | $0.12 / $0.35 | - | - | - | - | March 30, 2027 |
| Kimi K3 | Moonshot AI | - | yes | no | no | yes | 1M | 128K | 43.6 | 76.2 | 59.5 | 47 | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Nemotron Nano 3 30B | NVIDIA | - | yes | yes | no | no | 256K | 8K | 8.9 | 14.4 | 30.6 | 229 | $0.07 / $0.28 | - | - | - | - | - |
| NVIDIA Nemotron 3 Super 120B A12B | NVIDIA | - | yes | yes | no | no | 256K | 32K | 12.8 | 37.7 | 36.2 | 152 | $0.18 / $0.78 | - | - | - | - | - |
| NVIDIA Nemotron Nano 2 | NVIDIA | - | yes | yes | no | no | 128K | 8K | - | - | - | - | $0.07 / $0.27 | - | - | - | - | March 30, 2027 |
| NVIDIA Nemotron Nano 2 VL | NVIDIA | - | yes | yes | no | no | 128K | 8K | 7.5 | - | - | - | $0.23 / $0.70 | - | - | - | - | March 30, 2027 |
| GPT OSS Safeguard 120B | OpenAI | - | yes | yes | no | no | 128K | 16K | - | - | - | - | $0.18 / $0.70 | - | - | - | - | - |
| GPT OSS Safeguard 20B | OpenAI | - | yes | yes | no | no | 128K | 16K | - | - | - | - | $0.08 / $0.23 | - | - | - | - | - |
| GPT-5.6 Luna | OpenAI | - | no | no | no | yes | 1.05M | 128K | 37.3 | 71.4 | 53.6 | - | - | - | $0.20 / $1.20 | $0.02 / $0.25 | >272K global $0.40 / $1.80 | - |
| GPT-5.6 Sol [price: model card] | OpenAI | - | no | no | no | yes | 1.05M | 128K | 47.0 | 77.4 | 57.1 | - | - | - | $4.00 / $20.00 | $0.40 / $5.00 | >272K global $8.00 / $30.00 | - |
| GPT-5.6 Terra | OpenAI | - | no | no | no | yes | 1.05M | 128K | 42.1 | 76.7 | 55.0 | 106 | - | - | $2.00 / $12.00 | $0.20 / $2.50 | >272K global $4.00 / $18.00 | - |
| GPT-6 Luna [price: model card] | OpenAI | - | no | no | no | yes | 1.05M | 128K | 38.1 | - | 54.6 | 128 | - | - | $0.10 / $0.50 | $0.01 / $0.125 | >272K global $0.20 / $0.75 | - |
| GPT-6 Sol [price: model card] | OpenAI | - | no | no | no | yes | 1.05M | 128K | 47.6 | - | 57.6 | - | - | - | $2.00 / $10.00 | $0.20 / $2.50 | >272K global $4.00 / $15.00 | - |
| GPT-6.1 Sol [price: model card] | OpenAI | - | no | no | no | yes | 1M | 131K | 51.8 | - | 54.2 | 56 | - | - | $2.00 / $10.00 | $0.10 / $2.50 | >272K global $4.00 / $15.00 | - |
| GPT-6.1 Terra [price: model card] | OpenAI | openai.gpt-6.1-terra | no | no | no | yes | 1.05M | 128K | - | - | - | - | - | - | $1.00 / $5.00 | $0.05 / $1.25 | >272K global $2.00 / $7.50 | - |
| gpt-oss-120b | OpenAI | - | yes | yes | no | no | 128K | 16K | 11.6 | 30.4 | 34.0 | 221 | $0.20 / $0.79 | - | - | - | - | - |
| gpt-oss-20b | OpenAI | - | yes | yes | no | no | 128K | 16K | 9.0 | 20.7 | 38.9 | 250 | $0.09 / $0.40 | - | - | - | - | - |
| OpenAI GPT-6 Astra | OpenAI | - | no | no | no | yes | 1.05M | 128K | 52.7 | 76.9 | 56.5 | 53 | - | - | $10.00 / $50.00 | $1.00 / $12.50 | >272K global $20.00 / $75.00 | - |
| Qwen3 235B A22B 2507 | Qwen | - | yes | yes | no | no | 256K | 8K | 12.0 | - | - | - | $0.29 / $1.16 | - | - | - | - | - |
| Qwen3 32B | Qwen | - | yes | yes | no | no | 32K | 8K | 8.6 | 15.3 | 36.0 | - | $0.20 / $0.79 | - | - | - | - | - |
| Qwen3 Coder 30B A3B | Qwen | - | yes | yes | no | no | 256K | 16K | 9.6 | - | - | - | $0.20 / $0.79 | - | - | - | - | March 30, 2027 |
| Qwen3 Next 80B A3B | Qwen | - | yes | yes | no | no | 256K | 8K | 11.2 | 17.4 | - | 174 | $0.168 / $1.44 | - | - | - | - | - |
| Qwen3 VL 235B A22B | Qwen | - | yes | yes | no | no | 256K | 8K | 13.4 | - | - | - | $0.62 / $3.12 | - | - | - | - | - |
| TwelveLabs Pegasus 1.2 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - / $7.50 | - | - / $7.50 | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - / $7.50 | - | - | - |
| Grok 4.6 | xAI | - | yes | no | no | yes | 500K | 500K | 44.3 | 76.8 | 56.5 | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| Grok 4.7 | xAI | - | yes | no | no | yes | 500K | 500K | 46.4 | - | 57.4 | 63 | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| GLM 4.7 Flash | Z AI | - | yes | yes | no | no | 203K | 128K | 14.9 | - | - | - | $0.08 / $0.48 | - | - | - | - | March 30, 2027 |
| GLM 5.3 [price: manual] | Z AI | - | yes | no | no | yes | 1M | 128K | 44.8 | 74.8 | 59.0 | 69 | - | - | $1.68 / $5.28 | $0.312 / $2.10 | - | - |
