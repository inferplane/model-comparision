

# GPT-6 Sol
<a name="model-card-openai-gpt-6-sol"></a>

## ![OpenAI logo.](https://docs.aws.amazon.com/bedrock/latest/userguide/images/models/openai.png) OpenAI — GPT-6 Sol
<a name="model-card-openai-gpt-6-sol-header"></a>

## Model details
<a name="model-card-openai-gpt-6-sol-details"></a>

GPT-6 Sol is designed for demanding development work. It can build features, debug and refactor code, and review code. It supports multi-step work across tools and apps. It accepts text and images and returns text, including code.
+ **Model launch date:** September 22, 2026
+ **EOL no sooner than:** September 22, 2027
+ **Legacy period:** at least 6 months
+ **Model lifecycle policy:** [Model lifecycle](model-lifecycle.md)
+ **Model EOL date:** N/A
+ **End User License Agreements and Terms of Use:** [View](https://aws.amazon.com/legal/bedrock/third-party-models/)
+ **Model lifecycle:** Active
+ **Context window:** 1,050,000 tokens
+ **Max output tokens:** 128,000
+ **Knowledge cutoff:** April 20, 2026
+ **Marketplace product ID:** `prod-zpwu74hhojefo`


| **Input modalities** | **Output modalities** | 
| --- | --- | 
| ![Not supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Audio | ![Not supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Embedding | 
| ![Supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) Image | ![Not supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Image | 
| ![Not supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Speech | ![Not supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Speech | 
| ![Supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) Text | ![Supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) Text | 
| ![Not supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Video | ![Not supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Video | 

## Pricing
<a name="model-card-openai-gpt-6-sol-pricing"></a>

All prices are in USD per 1 million tokens for the Standard tier.

Mantle in-Region and US geographic cross-Region inference include a 10% premium. The base rates are OpenAI first-party Standard rates. Global cross-Region inference uses those rates with no premium. The prices below already include any premium.

Priority and Flex tiers are not supported for these inference options.

### Commercial Regions — short context (272K input tokens or fewer)
<a name="model-card-openai-gpt-6-sol-pricing-commercial-short"></a>


| **Inference option** | **Input** | **Input — cache write** | **Input — cache read** | **Output** | 
| --- | --- | --- | --- | --- | 
| Mantle in-Region | $2.20 | $2.75 | $0.22 | $11.00 | 
| US Geo CRIS | $2.20 | $2.75 | $0.22 | $11.00 | 
| Global CRIS | $2.00 | $2.50 | $0.20 | $10.00 | 

### Commercial Regions — long context (more than 272K input tokens)
<a name="model-card-openai-gpt-6-sol-pricing-commercial-long"></a>


| **Inference option** | **Input** | **Input — cache write** | **Input — cache read** | **Output** | 
| --- | --- | --- | --- | --- | 
| Mantle in-Region | $4.40 | $5.50 | $0.44 | $16.50 | 
| US Geo CRIS | $4.40 | $5.50 | $0.44 | $16.50 | 
| Global CRIS | $4.00 | $5.00 | $0.40 | $15.00 | 

Long-context rates apply to the full request when input exceeds 272,000 tokens.

**Note**  
Prices are subject to change. For current prices, see [Amazon Bedrock pricing](https://aws.amazon.com/bedrock/pricing/).

## Call the model
<a name="model-card-openai-gpt-6-sol-programmatic-access"></a>

Use these model IDs and endpoint URLs to call the model. See [APIs supported](apis.html) and [Endpoints supported](endpoints.html).


| **Endpoint** | **Model ID** | **In-Region endpoint URL** | **Geo inference ID** | **Global inference ID** | 
| --- | --- | --- | --- | --- | 
| bedrock-runtime | openai.gpt-6-sol | Not supported | us.openai.gpt-6-sol | global.openai.gpt-6-sol | 
| bedrock-mantle | openai.gpt-6-sol | https://bedrock-mantle.{region}.api.aws/openai/v1 | Not supported | Not supported | 

On `bedrock-runtime`:
+ Use this base URL: `https://bedrock-runtime.{region}.amazonaws.com/openai/v1`.
+ Set the model ID to `us.openai.gpt-6-sol` or `global.openai.gpt-6-sol`.
+ Choose a profile that is available in your source Region.
+ You cannot use the base model ID for in-Region calls on this endpoint.

On `bedrock-mantle`, use `openai.gpt-6-sol` with the `/openai/v1` base path. Use the US East (N. Virginia) (`us-east-1`) Region for this model on this endpoint.

## Supported Regions
<a name="model-card-openai-gpt-6-sol-regional-availability"></a>

Each endpoint supports a different set of Regions. See [Regional availability by models](models-region-compatibility.md).

**The `bedrock-mantle` endpoint**


| **Region** | **In-Region** | **Geo** | **Global** | 
| --- | --- | --- | --- | 
| us-east-1 (US East (N. Virginia)) | Supported | Not supported | Not supported | 

**The `bedrock-runtime` endpoint**


| **Source Region** | **In-Region** | **US Geo CRIS** | **Global CRIS** | 
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
| af-south-1 | Not supported | Not supported | Supported | 
| sa-east-1 | Not supported | Not supported | Supported | 
| mx-central-1 | Not supported | Not supported | Supported | 

***Geo inference details***

The destination Regions available to a geographic inference profile depend on the source Region. To retrieve the current routing configuration, call [GetInferenceProfile](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_GetInferenceProfile.html) from the source Region.

**Geo: US**

Geo inference ID: `us.openai.gpt-6-sol`


| **Source Region** | **Destination Regions** | 
| --- | --- | 
| us-east-1 (N. Virginia) | us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 
| us-east-2 (Ohio) | us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 
| us-west-1 (N. California) | us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-1 (N. California), us-west-2 (Oregon) | 
| us-west-2 (Oregon) | us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 
| ca-central-1 (Canada) | ca-central-1 (Canada), us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 
| ca-west-1 (Calgary) | ca-west-1 (Calgary), us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 

