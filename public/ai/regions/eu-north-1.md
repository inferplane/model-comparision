# Amazon Bedrock model comparison: eu-north-1

Generated 2026-10-29 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 87 models that can be invoked from **eu-north-1** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in eu-north-1; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding Index are Artificial Analysis indices (higher is better); tok/s is median output speed. An individual metric can be unpublished even when other measurements exist for a model. Public-page measurement fallbacks include their source and verification date in models.json.
- SciCode (%) is a separate scientific-programming pass rate, not Coding Index. Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.
- Model ID is the bare Bedrock id for In-region calls; Geo CRIS prepends the geography (e.g. us.), Global CRIS prepends global.
- ZDR = zero data retention by default. Not ZDR: OpenAI models other than gpt-oss-120b/20b and GPT OSS Safeguard 120B/20B (ZDR is an option requested through the AWS account team, approved per model version, so a new version needs a new request; without approval the default policy applies) and Claude Fable 5 / 5.1 (all traffic kept up to 30 days; ZDR only for Enterprise Frontier Safeguards customers through 2026-12-31). Source: AWS Bedrock abuse detection page. Every other model keeps its previous policy (ZDR).

## Highest Intelligence Index available in eu-north-1

- Claude Opus 5.5 (Anthropic): Intelligence 58.4, cheapest 4:1 blended $7.20 per 1M tokens
- OpenAI GPT-6 Astra (OpenAI): Intelligence 56.9, cheapest 4:1 blended $18.00 per 1M tokens
- GPT-6.1 Sol (OpenAI): Intelligence 54.5, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Sonnet 5.5 (Anthropic): Intelligence 54.2, cheapest 4:1 blended $3.60 per 1M tokens
- GPT-6.1 Terra (OpenAI): Intelligence 51.0, cheapest 4:1 blended $1.80 per 1M tokens
- Claude Fable 5.1 (Anthropic): Intelligence 49.0, cheapest 4:1 blended $18.00 per 1M tokens
- Claude Haiku 5.5 (Anthropic): Intelligence 36.2, cheapest 4:1 blended $0.18 per 1M tokens
- Grok 4.7 (xAI): Intelligence 34.3, cheapest 4:1 blended $2.80 per 1M tokens
- GLM 5.3 (Z AI): Intelligence 31.7, cheapest 4:1 blended $2.40 per 1M tokens
- GPT-6 Luna (OpenAI): Intelligence 27.8, cheapest 4:1 blended $0.18 per 1M tokens

## Cost/performance frontier in eu-north-1

No other model here is both cheaper and higher scoring than these (sorted by price):

- Claude Haiku 5.5 (Anthropic): Intelligence 36.2, cheapest 4:1 blended $0.18 per 1M tokens
- GPT-6.1 Terra (OpenAI): Intelligence 51.0, cheapest 4:1 blended $1.80 per 1M tokens
- GPT-6.1 Sol (OpenAI): Intelligence 54.5, cheapest 4:1 blended $3.60 per 1M tokens
- Claude Opus 5.5 (Anthropic): Intelligence 58.4, cheapest 4:1 blended $7.20 per 1M tokens

## All models

| Model | Provider | Model ID | ZDR | In-region | Geo CRIS | Global CRIS | Context | Max out | Intelligence | Coding Index | SciCode (%) | tok/s | Regional in/out | Regional cache read/write | Global in/out | Global cache read/write | Long-context (regional in/out) | EOL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jamba-Instruct | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Mid | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Ultra | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova 2.0 Lite | Amazon | amazon.nova-2-lite-v1:0 | yes | no | yes | yes | 1M | 64K | - | - | - | 220 | $0.363 / $2.992 | $0.09075 / $0.00 | $0.33 / $2.72 | $0.0825 / $0.00 | - | - |
| Nova 2.0 Omni | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | $0.30 / $2.70 | - | - | - |
| Nova 2.0 Pro | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | 140 | - | - | $1.36 / $10.87 | - | - | - |
| Nova 2.5 Sonic | Amazon | amazon.nova-2-5-sonic | yes | yes | no | no | 256K | 64K | - | - | - | - | $0.363 / $2.992 | - | - | - | - | - |
| Nova Lite | Amazon | amazon.nova-lite-v1:0 | yes | yes | yes | no | 300K | 10K | - | - | - | - | $0.065 / $0.26 | $0.01625 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Micro | Amazon | amazon.nova-micro-v1:0 | yes | no | yes | no | 128K | 10K | - | - | - | 260 | $0.038 / $0.152 | $0.0095 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Premier | Amazon | amazon.nova-premier-v1:0 | yes | no | yes? | no | 1M | 10K | - | - | - | - | - | - | - | - | - | - |
| Nova Pro | Amazon | amazon.nova-pro-v1:0 | yes | no | yes | no | 300K | 10K | - | - | - | - | $0.87 / $3.48 | $0.2175 / - | - | - | - | No sooner than 12/4/2025 |
| Nova Pro Latency Optimized | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Sonic | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.065 / $0.26 | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.363 / $2.992 | - | - | - | - | - |
| Claude | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 2.0 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 2.1 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3 Haiku | Anthropic | anthropic.claude-3-haiku-20240307-v1:0 | yes | no | yes | no | 200K | 4K | - | - | - | - | - | - | - | - | - | 2026-07-30 |
| Claude 3 Opus | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $3.00 / $15.00 | - | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | - |
| Claude Fable 5 | Anthropic | anthropic.claude-fable-5 | no | no | no | yes | 1M | 128K | - | - | 61.0 | - | $11.00 / $55.00 | $1.10 / $13.75 | $10.00 / $50.00 | $1.00 / $12.50 | - | - |
| Claude Fable 5.1 | Anthropic | anthropic.claude-fable-5-1 | no | no | no | yes | 1M | 128K | 49.0 | - | 63.1 | 67 | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Haiku 4.5 | Anthropic | anthropic.claude-haiku-4-5 | yes | yes (mantle endpoint only) | yes | yes | 200K | 64K | - | - | - | - | $1.10 / $5.50 | $0.11 / $1.375 | $1.00 / $5.00 | $0.10 / $1.25 | - | - |
| Claude Haiku 5.5 | Anthropic | anthropic.claude-haiku-5-5 | yes | no | yes | yes | 1M | 128K | 36.2 | - | 55.0 | 235 | $0.11 / $0.55 | $0.011 / $0.1375 | $0.10 / $0.50 | $0.01 / $0.125 | >100K $0.55 / $2.75 | - |
| Claude Instant | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Mythos 5.1 | Anthropic | anthropic.claude-mythos-5-1 | yes | no | no | yes | 1M | 128K | - | - | - | - | - | - | $10.00 / $50.00 | $0.25 / $12.50 | - | - |
| Claude Mythos Preview | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Opus 4 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Opus 4.5 | Anthropic | anthropic.claude-opus-4-5-20251101-v1:0 | yes | no | yes | yes | 200K | 64K | - | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.6 | Anthropic | anthropic.claude-opus-4-6-v1 | yes | no | yes | yes | 1M | 128K | - | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.7 | Anthropic | anthropic.claude-opus-4-7 | yes | yes (mantle endpoint only) | yes | yes | 1M | 128K | - | - | - | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 4.8 | Anthropic | anthropic.claude-opus-4-8 | yes | yes (mantle endpoint only) | yes | yes | 1M | 128K | - | - | 54.4 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5 | Anthropic | anthropic.claude-opus-5 | yes | yes (mantle endpoint only) | yes | yes | 1M | 128K | - | - | 56.4 | - | $5.50 / $27.50 | $0.55 / $6.875 | $5.00 / $25.00 | $0.50 / $6.25 | - | - |
| Claude Opus 5.5 | Anthropic | anthropic.claude-opus-5-5 | yes | no | yes | yes | 1M | 128K | 58.4 | - | 66.9 | 96 | $4.40 / $22.00 | $0.22 / $5.50 | $4.00 / $20.00 | $0.20 / $5.00 | - | - |
| Claude Sonnet 4 | Anthropic | anthropic.claude-sonnet-4-20250514-v1:0 | yes | no | yes | no | 200K | 64K | - | - | - | - | $3.00 / $15.00 | $0.30 / $3.75 | - | - | - | 2026-10-14 |
| Claude Sonnet 4.5 | Anthropic | anthropic.claude-sonnet-4-5-20250929-v1:0 | yes | no | yes | yes | 200K | 64K | - | - | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | 2027-04-08 |
| Claude Sonnet 4.6 | Anthropic | anthropic.claude-sonnet-4-6 | yes | no | yes | yes | 1M | 64K | - | - | - | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| Claude Sonnet 5 | Anthropic | anthropic.claude-sonnet-5 | yes | yes (mantle endpoint only) | yes | yes | 1M | 128K | - | - | 54.3 | - | $2.20 / $11.00 | $0.22 / $2.75 | $2.00 / $10.00 | $0.20 / $2.50 | - | - |
| Claude Sonnet 5.5 | Anthropic | anthropic.claude-sonnet-5-5 | yes | no | yes | yes | 1M | 128K | 54.2 | - | 61.0 | 136 | $2.20 / $11.00 | $0.11 / $2.75 | $2.00 / $10.00 | $0.10 / $2.50 | - | - |
| Cohere Embed 3 Model - English | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | $0.12 / - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| DeepSeek V3.1 | DeepSeek | deepseek.v3-v1:0 | yes | yes | no | no | 128K | 8K | - | - | - | - | $0.58 / $1.68 | - | - | - | - | March 30, 2027 |
| DeepSeek v3.2 | DeepSeek | deepseek.v3.2 | yes | yes | no | no | 164K | 8K | - | - | - | - | $0.74 / $2.22 | - | - | - | - | - |
| Llama 3.1 405B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Llama 3.1 70B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 13B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Minimax M2.1 | MiniMax | minimax.minimax-m2.1 | yes | yes | no | no | 196K | 8K | - | - | - | - | $0.36 / $1.44 | - | - | - | - | March 30, 2027 |
| MiniMax M2.5 | MiniMax | minimax.minimax-m2.5 | yes | yes | no | no | 196K | 8K | - | - | - | - | $0.36 / $1.44 | - | - | - | - | - |
| Devstral | Mistral | mistral.devstral-2-123b | yes | yes | no | no | 256K | 32K | - | - | - | - | $0.48 / $2.40 | - | - | - | - | March 30, 2027 |
| Mistral Large 2407 | Mistral | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Pixtral Large 25.02 | Mistral | mistral.pixtral-large-2502-v1:0 | yes | no | yes | no | 128K | 16K | - | - | - | - | $2.00 / $6.00 | - | - | - | - | No sooner than 4/8/2026 |
| Kimi K2 Thinking | Moonshot AI | moonshot.kimi-k2-thinking | yes | yes | no | no | 256K | 16K | - | - | - | - | $0.72 / $3.00 | - | - | - | - | March 30, 2027 |
| Kimi K2.5 | Moonshot AI | moonshotai.kimi-k2.5 | yes | yes | no | no | 256K | 16K | - | - | - | - | $0.72 / $3.60 | - | - | - | - | - |
| Kimi K3 | Moonshot AI | moonshotai.kimi-k3 | yes | no | no | yes | 1M | 128K | - | - | 59.5 | - | $3.30 / $16.50 | $0.33 / $4.125 | $3.00 / $15.00 | $0.30 / $3.75 | - | - |
| NVIDIA Nemotron 3 Super 120B A12B | NVIDIA | nvidia.nemotron-super-3-120b | yes | yes | no | no | 256K | 32K | - | - | 36.2 | - | $0.18 / $0.78 | - | - | - | - | - |
| GPT-5.6 Luna | OpenAI | openai.gpt-5.6-luna | no | no | no | yes | 1.05M | 128K | - | - | 53.6 | - | - | - | $0.20 / $1.20 | $0.02 / $0.25 | >272K global $0.40 / $1.80 | - |
| GPT-5.6 Sol [price: model card] | OpenAI | openai.gpt-5.6-sol | no | no | no | yes | 1.05M | 128K | - | - | 57.1 | - | - | - | $4.00 / $20.00 | $0.40 / $5.00 | >272K global $8.00 / $30.00 | - |
| GPT-5.6 Terra | OpenAI | openai.gpt-5.6-terra | no | no | no | yes | 1.05M | 128K | - | - | 55.0 | 109 | - | - | $2.00 / $12.00 | $0.20 / $2.50 | >272K global $4.00 / $18.00 | - |
| GPT-6 Luna [price: model card] | OpenAI | openai.gpt-6-luna | no | no | no | yes | 1.05M | 128K | 27.8 | - | 54.6 | 113 | - | - | $0.10 / $0.50 | $0.01 / $0.125 | >272K global $0.20 / $0.75 | - |
| GPT-6 Sol [price: model card] | OpenAI | openai.gpt-6-sol | no | no | no | yes | 1.05M | 128K | - | - | 57.6 | - | - | - | $2.00 / $10.00 | $0.20 / $2.50 | >272K global $4.00 / $15.00 | - |
| GPT-6.1 Sol [price: model card] | OpenAI | openai.gpt-6.1-sol | no | no | no | yes | 1M | 131K | 54.5 | - | 54.2 | 80 | - | - | $2.00 / $10.00 | $0.10 / $2.50 | >272K global $4.00 / $15.00 | - |
| GPT-6.1 Terra [price: model card] | OpenAI | openai.gpt-6.1-terra | no | no | no | yes | 1.05M | 128K | 51.0 | - | 55.1 | 91 | - | - | $1.00 / $5.00 | $0.05 / $1.25 | >272K global $2.00 / $7.50 | - |
| gpt-oss-120b | OpenAI | openai.gpt-oss-120b-1:0 | yes | yes | no | no | 128K | 16K | - | - | 34.0 | 199 | $0.15 / $0.60 | - | - | - | - | - |
| gpt-oss-20b | OpenAI | openai.gpt-oss-20b | yes | yes | no | no | 128K | 16K | - | - | 38.9 | 152 | $0.07 / $0.30 | - | - | - | - | - |
| OpenAI GPT-6 Astra | OpenAI | openai.gpt-6-astra | no | no | no | yes | 1.05M | 128K | 56.9 | - | 56.5 | 65 | - | - | $10.00 / $50.00 | $1.00 / $12.50 | >272K global $20.00 / $75.00 | - |
| Qwen3 235B A22B 2507 | Qwen | qwen.qwen3-235b-a22b-2507-v1:0 | yes | yes | no | no | 256K | 8K | - | - | - | - | $0.22 / $0.88 | - | - | - | - | - |
| Qwen3 32B | Qwen | qwen.qwen3-32b-v1:0 | yes | yes | no | no | 32K | 8K | - | - | - | - | $0.15 / $0.60 | - | - | - | - | - |
| Qwen3 Coder 30B A3B | Qwen | qwen.qwen3-coder-30b-a3b-v1:0 | yes | yes | no | no | 256K | 16K | - | - | - | - | $0.15 / $0.60 | - | - | - | - | March 30, 2027 |
| Qwen3 Coder 480B A35B | Qwen | qwen.qwen3-coder-480b-a35b-v1:0 | yes | yes | no | no | 256K | 16K | - | - | - | - | $0.45 / $1.80 | - | - | - | - | March 30, 2027 |
| TwelveLabs Pegasus 1.2 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - / $7.50 | - | - / $7.50 | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - / $7.50 | - | - | - |
| Grok 4.6 | xAI | xai.grok-4.6 | yes | no | no | yes | 500K | 500K | - | - | 56.5 | - | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| Grok 4.7 | xAI | xai.grok-4.7 | yes | no | no | yes | 524K | 524288M | 34.3 | - | 57.4 | 80 | $2.20 / $6.60 | $0.55 / - | $2.00 / $6.00 | $0.50 / - | - | - |
| GLM 4.7 | Z AI | zai.glm-4.7 | yes | yes | no | no | 203K | 128K | - | - | - | - | $0.72 / $2.64 | - | - | - | - | March 30, 2027 |
| GLM 4.7 Flash | Z AI | zai.glm-4.7-flash | yes | yes | no | no | 203K | 128K | - | - | - | - | $0.08 / $0.48 | - | - | - | - | March 30, 2027 |
| GLM 5 | Z AI | zai.glm-5 | yes | yes | no | no | 200K | 128K | - | - | - | - | $1.20 / $3.84 | - | - | - | - | - |
| GLM 5.3 [price: manual] | Z AI | zai.glm-5.3 | yes | no | no | yes | 1M | 128K | 31.7 | - | 59.0 | 75 | - | - | $1.68 / $5.28 | $0.312 / $2.10 | - | - |
