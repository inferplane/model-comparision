<!-- Source: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-openai-gpt-6-1-terra.html
     User-supplied on 2026-10-29; not independently fetched (network approval unavailable).
     Data-relevant excerpt: repeated copies, API examples and descriptive sections omitted.
     Availability icon cells normalized to Supported / Not supported; all region rows retained.
     A freshly fetched card takes precedence over this fallback. -->
# GPT-6.1 Terra

## ![OpenAI logo.](https://docs.aws.amazon.com/bedrock/latest/userguide/images/models/openai.png) OpenAI — GPT-6.1 Terra

## Model Details
+ **Model launch date:** October 26, 2026
+ **EOL no sooner than:** October 26, 2027
+ **Model EOL date:** N/A
+ **Model lifecycle:** Active
+ **Context window:** 1,050,000 tokens
+ **Max output tokens:** 128,000

## Pricing
All prices are in USD per 1 million tokens for the Standard tier.
Commercial In-Region prices include a 10% fee over OpenAI rates. You do not need to add this fee.
Priority and Flex tiers are not supported for this model.

### Commercial Regions — short context (272K input tokens or fewer)

| **Inference option** | **Input** | **Input — 30-minute cache write** | **Input — cache read** | **Output** |
| --- | --- | --- | --- | --- |
| In-Region | $1.10 | $1.375 | $0.055 | $5.50 |
| Geo CRIS | $1.10 | $1.375 | $0.055 | $5.50 |
| Global CRIS | $1.00 | $1.25 | $0.05 | $5.00 |

### Commercial Regions — long context (more than 272K input tokens)

| **Inference option** | **Input** | **Input — 30-minute cache write** | **Input — cache read** | **Output** |
| --- | --- | --- | --- | --- |
| In-Region | $2.20 | $2.75 | $0.11 | $8.25 |
| Geo CRIS | $2.20 | $2.75 | $0.11 | $8.25 |
| Global CRIS | $2.00 | $2.50 | $0.10 | $7.50 |

## Programmatic Access

| **Endpoint** | **Model ID** | **In-Region endpoint URL** | **Geo inference ID** | **Global inference ID** |
| --- | --- | --- | --- | --- |
| bedrock-mantle | openai.gpt-6.1-terra | https://bedrock-mantle.{region}.api.aws/openai/v1 | Not supported | Not supported |
| bedrock-runtime | openai.gpt-6.1-terra | Not supported | us.openai.gpt-6.1-terra | global.openai.gpt-6.1-terra |

## Regional Availability

**Availability using the `bedrock-mantle` endpoint**

| **Region** | **In-Region** | **Geo** | **Global** |
| --- | --- | --- | --- |
| us-east-1 (N. Virginia) | Supported | Not supported | Not supported |
| us-east-2 (Ohio) | Not supported | Not supported | Not supported |
| us-west-2 (Oregon) | Not supported | Not supported | Not supported |
| us-gov-west-1 (GovCloud West) | Not supported | Not supported | Not supported |
| us-gov-east-1 (GovCloud East) | Not supported | Not supported | Not supported |

**Availability using the `bedrock-runtime` endpoint**

| **Region** | **In-Region** | **Geo** | **Global** |
| --- | --- | --- | --- |
| us-east-1 | Not supported | Supported | Supported |
| us-east-2 | Not supported | Supported | Supported |
| us-west-1 | Not supported | Supported | Supported |
| us-west-2 | Not supported | Supported | Supported |
| ca-central-1 | Not supported | Supported | Supported |
| ca-west-1 | Not supported | Supported | Supported |
| eu-central-1 | Not supported | Not supported | Supported |
| eu-central-2 | Not supported | Not supported | Supported |
| eu-north-1 | Not supported | Not supported | Supported |
| eu-south-1 | Not supported | Not supported | Supported |
| eu-south-2 | Not supported | Not supported | Supported |
| eu-west-1 | Not supported | Not supported | Supported |
| eu-west-2 | Not supported | Not supported | Supported |
| eu-west-3 | Not supported | Not supported | Supported |
| ap-east-2 | Not supported | Not supported | Supported |
| ap-northeast-1 | Not supported | Not supported | Supported |
| ap-northeast-2 | Not supported | Not supported | Supported |
| ap-northeast-3 | Not supported | Not supported | Supported |
| ap-south-1 | Not supported | Not supported | Supported |
| ap-south-2 | Not supported | Not supported | Supported |
| ap-southeast-1 | Not supported | Not supported | Supported |
| ap-southeast-2 | Not supported | Not supported | Supported |
| ap-southeast-3 | Not supported | Not supported | Supported |
| ap-southeast-4 | Not supported | Not supported | Supported |
| ap-southeast-5 | Not supported | Not supported | Supported |
| ap-southeast-6 | Not supported | Not supported | Supported |
| ap-southeast-7 | Not supported | Not supported | Supported |
| il-central-1 | Not supported | Not supported | Supported |
| mx-central-1 | Not supported | Not supported | Supported |
| me-south-1 | Not supported | Not supported | Not supported |
| af-south-1 | Not supported | Not supported | Supported |
| sa-east-1 | Not supported | Not supported | Supported |

**Geo: US**

Geo inference ID: `us.openai.gpt-6.1-terra`

| **Source Region** | **Destination Regions** |
| --- | --- |
| us-east-1 | us-east-1, us-east-2, us-west-2 |
| us-east-2 | us-east-1, us-east-2, us-west-2 |
| us-west-1 | us-east-1, us-east-2, us-west-1, us-west-2 |
| us-west-2 | us-east-1, us-east-2, us-west-2 |
| ca-central-1 | ca-central-1, us-east-1, us-east-2, us-west-2 |
| ca-west-1 | ca-west-1, us-east-1, us-east-2, us-west-2 |
