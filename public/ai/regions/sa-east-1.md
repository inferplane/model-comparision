# Amazon Bedrock model comparison: sa-east-1

Generated 2026-10-15 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 98 models that can be invoked from **sa-east-1** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in sa-east-1; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding Index are Artificial Analysis indices (higher is better); tok/s is median output speed. An individual metric can be unpublished even when other measurements exist for a model. Public-page measurement fallbacks include their source and verification date in models.json.
- SciCode (%) is a separate scientific-programming pass rate, not Coding Index. Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.
- Model ID is the bare Bedrock id for In-region calls; Geo CRIS prepends the geography (e.g. us.), Global CRIS prepends global.
- ZDR = zero data retention by default. Not ZDR: OpenAI models other than gpt-oss-120b/20b and GPT OSS Safeguard 120B/20B (ZDR is an option requested through the AWS account team, approved per model version, so a new version needs a new request; without approval the default policy applies) and Claude Fable 5 / 5.1 (all traffic kept up to 30 days; ZDR only for Enterprise Frontier Safeguards customers through 2026-12-31). Source: AWS Bedrock abuse detection page. Every other model keeps its previous policy (ZDR).

## Highest Intelligence Index available in sa-east-1

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

## Cost/performance frontier in sa-east-1

No other model here is both cheaper and higher scoring than these (sorted by price):

- Gemma 3 4B (Google): Intelligence 4.8, cheapest 4:1 blended $0.06 per 1M tokens
- Nemotron Nano 3 30B (NVIDIA): Intelligence 8.9, cheapest 4:1 blended $0.114 per 1M tokens
- gpt-oss-20b (OpenAI): Intelligence 9.0, cheapest 4:1 blended $0.136 per 1M tokens
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
| Nova 2.0 Omni | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | 8.2 | - | - | - | - | - | - | - | - | - |
| Nova 2.0 Pro | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | 10.0 | 20.9 | - | 125 | - | - | - | - | - | - |
| Nova 2.5 Sonic | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Premier | Amazon | amazon.nova-premier-v1:0 | yes | no | yes? | no | 1M | 10K | 9.2 | - | - | - | - | - | - | - | - | - |
| Nova Pro Latency Optimized | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.0 | - | - | - | - | - | - | - | - | - |
| Nova Sonic | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 2.0 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.5 | 12.9 | - | - | - | - | - | - | - | - |
| Claude 2.1 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.6 | 14.0 | - | - | - | - | - | - | - | - |
| Claude 3 Haiku | Anthropic | anthropic.claude-3-haiku-20240307-v1:0 | yes | yes | no | no | 200K | 4K | 5.6 | - | - | - | $0.25 / $1.25 | - | - | - | - | 2026-07-30 |
| Claude 3 Opus | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 8.7 | 19.5 | - | - | - | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.9 | - | - | - | $3.00 / $15.00 | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 8.9 | 15.9 | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.2 | 26.0 | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.9 | 30.2 | - | - | - | - | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 15.3 | - | - | - | - | - | - | - | - | - |
| Claude Fable 5 | Anthropic | anthropic.claude-fable-5 | no | no | no | yes | 1M | 128K | 49.6 | 76.5 | 61.0 | - | - | - | $10.00 / $50.00 | $1.00 / $12.50 | - | - |
| Claude Fable 5.1 | Anthropic | anthropic.claude-fable-5-1 | no | no | no | yes | 1M | 128K | 53.4 | 81.6 | 63.1 | 66 | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Haiku 4.5 | Anthropic | anthropic.claude-haiku-4-5 | yes | no | no | yes | 200K | 64K | 15.4 | - | - | - | - | - | $1.00 / $5.00 | $0.10 / $1.25 | - | - |
| Claude Haiku 5.5 | Anthropic | anthropic.claude-haiku-5-5 | yes | no | no | yes | 1M | 128K | 43.4 | - | 55.0 | 241 | - | - | $0.10 / $0.50 | $0.01 / $0.125 | >100K global $0.50 / $2.50 | - |
| Claude Instant | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.0 | 7.8 | - | - | - | - | - | - | - | - |
| Claude Mythos 5.1 | Anthropic | anthropic.claude-mythos-5-1 | yes | no | no | yes | 1M | 128K | - | - | - | - | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Mythos Preview | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Opus 4 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | 16.6 | - | - | - | - | - | - | - | - | - |
| Claude Opus 4.5 | Anthropic | anthropic.claude-opus-4-5-20251101-v1:0 | yes | no | no | yes | 200K | 64K | 23.7 | - | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.6 | Anthropic | anthropic.claude-opus-4-6-v1 | yes | no | no | yes | 1M | 128K | 26.4 | - | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.7 | Anthropic | anthropic.claude-opus-4-7 | yes | no | no | yes | 1M | 128K | 40.7 | 73.6 | - | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.8 | Anthropic | anthropic.claude-opus-4-8 | yes | no | no | yes | 1M | 128K | 41.8 | 74.3 | 54.4 | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5 | Anthropic | anthropic.claude-opus-5 | yes | no | no | yes | 1M | 128K | 50.8 | 78.0 | 56.4 | - | - | - | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5.5 | Anthropic | anthropic.claude-opus-5-5 | yes | no | no | yes | 1M | 128K | 57.6 | - | 66.9 | 96 | - | - | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| Claude Sonnet 4.5 | Anthropic | anthropic.claude-sonnet-4-5-20250929-v1:0 | yes | no | no | yes | 200K | 64K | 19.3 | - | - | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | 2027-04-08 |
| Claude Sonnet 4.6 | Anthropic | anthropic.claude-sonnet-4-6 | yes | no | no | yes | 1M | 64K | 24.7 | - | - | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Claude Sonnet 5 | Anthropic | anthropic.claude-sonnet-5 | yes | no | no | yes | 1M | 128K | 38.2 | 71.5 | 54.3 | - | - | - | $2.00 / $10.00 | $0.20 / $2.50 | - | - |
| Claude Sonnet 5.5 | Anthropic | anthropic.claude-sonnet-5-5 | yes | no | no | yes | 1M | 128K | 56.0 | - | 61.0 | 138 | - | - | $2.00 / $10.00 | $0.10 / $2.50 | - | - |
| Cohere Embed 3 Model - English | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.10 / - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.12 / - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.10 / - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| DeepSeek v3.2 | DeepSeek | deepseek.v3.2 | yes | yes | no | no | 164K | 8K | 16.0 | - | - | - | $0.74 / $2.22 | - | - | - | - | - |
| Gemma 3 12B | Google | google.gemma-3-12b-it | yes | yes | no | no | 128K | 8K | 3.8 | 5.8 | 16.4 | - | $0.11 / $0.35 | - | - | - | - | March 30, 2027 |
| Gemma 3 27B | Google | google.gemma-3-27b-it | yes | yes | no | no | 128K | 8K | 4.9 | 10.1 | 23.3 | - | $0.28 / $0.46 | - | - | - | - | March 30, 2027 |
| Gemma 3 4B | Google | google.gemma-3-4b-it | yes | yes | no | no | 128K | 8K | 4.8 | 2.7 | - | - | $0.05 / $0.10 | - | - | - | - | March 30, 2027 |
| Llama 3.1 405B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 7.3 | - | - | - | - | - | - | - | - | - |
| Llama 3.1 70B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 6.6 | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 13B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | 5.3 | - | - | - | - | - | - | - | - | - |
| Minimax M2 | MiniMax | minimax.minimax-m2 | yes | yes | no | no | 1M | 8K | 18.6 | - | - | - | $0.36 / $1.45 | - | - | - | - | March 30, 2027 |
| Minimax M2.1 | MiniMax | minimax.minimax-m2.1 | yes | yes | no | no | 196K | 8K | 20.9 | - | - | - | $0.36 / $1.44 | - | - | - | - | March 30, 2027 |
| MiniMax M2.5 | MiniMax | minimax.minimax-m2.5 | yes | yes | no | no | 196K | 8K | 22.8 | - | - | - | $0.36 / $1.44 | - | - | - | - | - |
| Devstral | Mistral | mistral.devstral-2-123b | yes | yes | no | no | 256K | 32K | 9.0 | - | - | - | $0.48 / $2.40 | - | - | - | - | March 30, 2027 |
| Magistral Small 1.2 | Mistral | mistral.magistral-small-2509 | yes | yes | no | no | 128K | 40K | 8.6 | 14.7 | - | 80 | $0.61 / $1.82 | - | - | - | - | - |
| Ministral 14B 3.0 | Mistral | mistral.ministral-3-14b-instruct | yes | yes | no | no | 128K | 8K | 6.0 | 14.4 | 23.8 | 65 | $0.24 / $0.24 | - | - | - | - | - |
| Ministral 3B 3.0 | Mistral | mistral.ministral-3-3b-instruct | yes | yes | no | no | 128K | 8K | 4.8 | 4.8 | 15.3 | 240 | $0.12 / $0.12 | - | - | - | - | - |
| Ministral 8B 3.0 | Mistral | mistral.ministral-3-8b-instruct | yes | yes | no | no | 128K | 8K | 5.5 | 9.7 | 20.7 | 99 | $0.18 / $0.18 | - | - | - | - | - |
| Mistral 7B | Mistral | mistral.mistral-7b-instruct-v0:2 | yes | yes | no | no | 32K | 4K | 5.0 | - | - | - | $0.25 / $0.34 | - | - | - | - | March 30, 2027 |
| Mistral Large | Mistral | mistral.mistral-large-2402-v1:0 | yes | yes | no | no | 32K | 4K | 5.8 | - | - | - | $6.70 / $20.20 | - | - | - | - | No sooner than 4/3/2025 |
| Mistral Large 2407 | Mistral | - | yes | yes? | yes? | no | 미확인 | 미확인 | 6.8 | - | - | - | - | - | - | - | - | - |
| Mistral Large 3 | Mistral | mistral.mistral-large-3-675b-instruct | yes | yes | no | no | 256K | 32K | 9.3 | 20.1 | 36.6 | - | $0.61 / $1.82 | - | - | - | - | - |
| Mixtral 8x7B | Mistral | mistral.mixtral-8x7b-instruct-v0:1 | yes | yes | no | no | 32K | 4K | 5.1 | - | - | - | $0.76 / $1.18 | - | - | - | - | March 30, 2027 |
| Voxtral Mini 1.0 | Mistral | mistral.voxtral-mini-3b-2507 | yes | yes | no | no | 32K | 4K | - | - | - | - | $0.05 / $0.05 | - | - | - | - | March 30, 2027 |
| Voxtral Small 1.0 | Mistral | mistral.voxtral-small-24b-2507 | yes | yes | no | no | 32K | 8K | - | - | - | - | $0.12 / $0.36 | - | - | - | - | March 30, 2027 |
| Kimi K2 Thinking | Moonshot AI | moonshot.kimi-k2-thinking | yes | yes | no | no | 256K | 16K | 22.0 | - | - | - | $0.73 / $3.03 | - | - | - | - | March 30, 2027 |
| Kimi K2.5 | Moonshot AI | moonshotai.kimi-k2.5 | yes | yes | no | no | 256K | 16K | 23.5 | 46.8 | - | - | $0.72 / $3.60 | - | - | - | - | - |
| Kimi K3 | Moonshot AI | moonshotai.kimi-k3 | yes | no | no | yes | 1M | 128K | 43.6 | 76.2 | 59.5 | 42 | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Nemotron Nano 3 30B | NVIDIA | nvidia.nemotron-nano-3-30b | yes | yes | no | no | 256K | 8K | 8.9 | 14.4 | 30.6 | 229 | $0.07 / $0.29 | - | - | - | - | - |
| NVIDIA Nemotron 3 Super 120B A12B | NVIDIA | nvidia.nemotron-super-3-120b | yes | yes | no | no | 256K | 32K | 12.8 | 37.7 | 36.2 | 143 | $0.18 / $0.78 | - | - | - | - | - |
| NVIDIA Nemotron Nano 2 | NVIDIA | nvidia.nemotron-nano-9b-v2 | yes | yes | no | no | 128K | 8K | - | - | - | - | $0.07 / $0.28 | - | - | - | - | March 30, 2027 |
| NVIDIA Nemotron Nano 2 VL | NVIDIA | nvidia.nemotron-nano-12b-v2 | yes | yes | no | no | 128K | 8K | 7.5 | - | - | - | $0.24 / $0.73 | - | - | - | - | March 30, 2027 |
| GPT OSS Safeguard 120B | OpenAI | openai.gpt-oss-safeguard-120b | yes | yes | no | no | 128K | 16K | - | - | - | - | $0.18 / $0.73 | - | - | - | - | - |
| GPT OSS Safeguard 20B | OpenAI | openai.gpt-oss-safeguard-20b | yes | yes | no | no | 128K | 16K | - | - | - | - | $0.08 / $0.24 | - | - | - | - | - |
| GPT-5.6 Luna | OpenAI | openai.gpt-5.6-luna | no | no | no | yes | 1.05M | 128K | 37.3 | 71.4 | 53.6 | - | - | - | $0.20 / $1.20 | $0.02 / $0.25 | >272K global $0.40 / $1.80 | - |
| GPT-5.6 Sol [price: model card] | OpenAI | openai.gpt-5.6-sol | no | no | no | yes | 1.05M | 128K | 47.0 | 77.4 | 57.1 | - | - | - | $4.00 / $20.00 | $0.40 / $5.00 | >272K global $8.00 / $30.00 | - |
| GPT-5.6 Terra | OpenAI | openai.gpt-5.6-terra | no | no | no | yes | 1.05M | 128K | 42.1 | 76.7 | 55.0 | 106 | - | - | $2.00 / $12.00 | $0.20 / $2.50 | >272K global $4.00 / $18.00 | - |
| GPT-6 Luna [price: model card] | OpenAI | openai.gpt-6-luna | no | no | no | yes | 1.05M | 128K | 38.1 | - | 54.6 | 123 | - | - | $0.10 / $0.50 | $0.01 / $0.125 | >272K global $0.20 / $0.75 | - |
| GPT-6 Sol [price: model card] | OpenAI | openai.gpt-6-sol | no | no | no | yes | 1.05M | 128K | 47.6 | - | 57.6 | - | - | - | $2.00 / $10.00 | $0.20 / $2.50 | >272K global $4.00 / $15.00 | - |
| GPT-6.1 Sol [price: model card] | OpenAI | openai.gpt-6.1-sol | no | no | no | yes | 1M | 131K | 51.8 | - | 54.2 | 51 | - | - | $2.00 / $10.00 | $0.10 / $2.50 | >272K global $4.00 / $15.00 | - |
| gpt-oss-120b | OpenAI | openai.gpt-oss-120b | yes | yes | no | no | 128K | 16K | 11.6 | 30.4 | 34.0 | 214 | $0.18 / $0.73 | - | - | - | - | - |
| gpt-oss-20b | OpenAI | openai.gpt-oss-20b-1:0 | yes | yes | no | no | 128K | 16K | 9.0 | 20.7 | 38.9 | 225 | $0.08 / $0.36 | - | - | - | - | - |
| OpenAI GPT-6 Astra | OpenAI | openai.gpt-6-astra | no | no | no | yes | 1.05M | 128K | 52.7 | 76.9 | 56.5 | 46 | - | - | $10.00 / $50.00 | $1.00 / $12.50 | >272K global $20.00 / $75.00 | - |
| Qwen3 32B | Qwen | qwen.qwen3-32b-v1:0 | yes | yes | no | no | 32K | 8K | 7.3 | - | - | - | $0.18 / $0.73 | - | - | - | - | - |
| Qwen3 Coder 30B A3B | Qwen | qwen.qwen3-coder-30b-a3b-v1:0 | yes | yes | no | no | 256K | 16K | 9.6 | - | - | - | $0.18 / $0.73 | - | - | - | - | March 30, 2027 |
| Qwen3 VL 235B A22B | Qwen | qwen.qwen3-vl-235b-a22b | yes | yes | no | no | 256K | 8K | 13.4 | - | - | - | $0.64 / $3.22 | - | - | - | - | - |
| qwen3-next-80b-a3b | Qwen | qwen.qwen3-next-80b-a3b | yes | yes | no | no | 256K | 8K | 11.2 | 17.4 | - | 171 | $0.168 / $1.44 | - | - | - | - | - |
| TwelveLabs Pegasus 1.2 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - / $7.50 | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - / $7.50 | - | - | - |
| Grok 4.6 | xAI | xai.grok-4.6 | yes | no | no | yes | 500K | 500K | 44.3 | 76.8 | 56.5 | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| Grok 4.7 | xAI | xai.grok-4.7 | yes | no | no | yes | 500K | 500K | 46.4 | - | 57.4 | 71 | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| GLM 4.7 | Z AI | zai.glm-4.7 | yes | yes | no | no | 203K | 128K | 22.2 | 45.3 | - | - | $0.72 / $2.64 | - | - | - | - | March 30, 2027 |
| GLM 4.7 Flash | Z AI | zai.glm-4.7-flash | yes | yes | no | no | 203K | 128K | 14.9 | - | - | - | $0.08 / $0.48 | - | - | - | - | March 30, 2027 |
| GLM 5 | Z AI | zai.glm-5 | yes | yes | no | no | 200K | 128K | 27.9 | - | - | - | $1.20 / $3.84 | - | - | - | - | - |
| GLM 5.3 [price: manual] | Z AI | zai.glm-5.3 | yes | no | no | yes | 1M | 128K | 44.8 | 74.8 | 59.0 | 70 | - | - | $1.68 / $5.28 | $0.312 / $2.10 | - | - |
