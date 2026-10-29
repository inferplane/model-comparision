# Amazon Bedrock model comparison: ap-east-1

Generated 2026-10-29 from the AWS Price List, AWS Bedrock model cards, and Artificial Analysis. Interactive version: https://inferplane.github.io/model-comparision/ . This file lists the 35 models that can be invoked from **ap-east-1** by at least one method. Other regions: https://inferplane.github.io/model-comparision/ai/ . Per-region prices for every model: https://inferplane.github.io/model-comparision/ai/prices.csv . Full data: https://inferplane.github.io/model-comparision/data/models.json .

## How to read this

- Prices are USD per 1M tokens, Standard tier, text tokens only. "-" means not available or not published, not zero.
- Three ways to invoke a model: **In-region** (requests stay in ap-east-1; "mantle endpoint only" means only the OpenAI-compatible bedrock-mantle endpoint works, not bedrock-runtime), **Geo CRIS** (cross-Region inference inside a geography such as US or EU), **Global CRIS** (routed to any commercial Region).
- "Regional" price = In-region and Geo CRIS (AWS prices them the same here). "Global" price = Global CRIS, usually about 10% cheaper.
- "yes?" means availability is inferred (no AWS model card matched), not confirmed.
- Long-context: when a prompt exceeds the threshold (e.g. >272K tokens) the whole request is billed at the long-context price instead.
- Intelligence / Coding Index are Artificial Analysis indices (higher is better); tok/s is median output speed. An individual metric can be unpublished even when other measurements exist for a model. Public-page measurement fallbacks include their source and verification date in models.json.
- SciCode (%) is a separate scientific-programming pass rate, not Coding Index. Missing Coding Index values remain unavailable in this connected dataset and are never inferred from SciCode.
- In-region and Geo prices differ by Region; Global CRIS prices are the same in every commercial Region (except Amazon Nova).
- 4:1 blended price = (4 x input + output) / 5, ignoring caching.
- Model ID is the bare Bedrock id for In-region calls; Geo CRIS prepends the geography (e.g. us.), Global CRIS prepends global.
- ZDR = zero data retention by default. Not ZDR: OpenAI models other than gpt-oss-120b/20b and GPT OSS Safeguard 120B/20B (ZDR is an option requested through the AWS account team, approved per model version, so a new version needs a new request; without approval the default policy applies) and Claude Fable 5 / 5.1 (all traffic kept up to 30 days; ZDR only for Enterprise Frontier Safeguards customers through 2026-12-31). Source: AWS Bedrock abuse detection page. Every other model keeps its previous policy (ZDR).

## Highest Intelligence Index available in ap-east-1

(no benchmark data)

## Cost/performance frontier in ap-east-1

No other model here is both cheaper and higher scoring than these (sorted by price):

(no benchmark data)

## All models

| Model | Provider | Model ID | ZDR | In-region | Geo CRIS | Global CRIS | Context | Max out | Intelligence | Coding Index | SciCode (%) | tok/s | Regional in/out | Regional cache read/write | Global in/out | Global cache read/write | Long-context (regional in/out) | EOL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jamba-Instruct | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Mid | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Jurassic-2 Ultra | AI21 Labs | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova 2.0 Omni | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova 2.0 Pro | Amazon | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | 140 | - | - | - | - | - | - |
| Nova Premier | Amazon | amazon.nova-premier-v1:0 | yes | no | yes? | no | 1M | 10K | - | - | - | - | - | - | - | - | - | - |
| Nova Pro Latency Optimized | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Sonic | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Nova Sonic 2.0 | Amazon | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 2.0 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 2.1 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3 Opus | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Haiku | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3.5 Sonnet v2 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude 3.7 Sonnet | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Instant | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Instant (100K) | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Mythos Preview | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Claude Opus 4 | Anthropic | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed 3 Model - English | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed 4 Model | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Embed Model 3 - Multilingual | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Cohere Generate Model - Command-Light | Cohere | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Llama 3.1 405B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Llama 3.1 70B Latency Optimized | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 13B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Meta Llama 2 Chat 70B | Meta | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| Mistral Large 2407 | Mistral | - | yes | yes? | yes? | no | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| TwelveLabs Pegasus 1.2 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
| TwelveLabs Pegasus 1.5 | TwelveLabs | - | yes | yes? | yes? | yes? | 미확인 | 미확인 | - | - | - | - | - | - | - | - | - | - |
