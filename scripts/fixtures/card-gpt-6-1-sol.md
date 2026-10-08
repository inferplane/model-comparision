

# GPT-6.1 Sol
<a name="model-card-openai-gpt-6-1-sol"></a>

## ![OpenAI logo.](https://docs.aws.amazon.com/bedrock/latest/userguide/images/models/openai.png) OpenAI — GPT-6.1 Sol
<a name="model-card-openai-gpt-6-1-sol-header"></a>

## Model Details
<a name="model-card-openai-gpt-6-1-sol-details"></a>

OpenAI GPT-6.1 Sol brings advanced capabilities to workloads where both performance and cost matter. GPT-6.1 Sol helps agents investigate codebases and iterate on solutions. Agents can also use it to understand complex documents and complete business and computer use workflows across multiple steps.
+  **Model launch date:** September 29, 2026
+  **Model lifecycle policy:** [OpenAI model deprecation notice periods](https://developers.openai.com/api/docs/deprecations#model-deprecation-notice-periods). This model follows OpenAI first-party lifecycle terms, with at least 6 months of deprecation notice for generally available models, unless safety or compliance concerns require a faster timeline.
+  **Model EOL date:** Not announced.
+  **End User License Agreements and Terms of Use:** [OpenAI models on Amazon Bedrock terms](https://aws.amazon.com/legal/bedrock/third-party-models/#amsc13--xttmgl) 
+  **Model lifecycle:** Active
+  **Context window:** 1M tokens
+  **Max output tokens:** 131,072 tokens
+  **Marketplace product ID:** `prod-qco655ut2vn54` 


| **Input Modalities** | **Output Modalities** | 
| --- | --- | 
| ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Audio | ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Embedding | 
| ![supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) Image | ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Image | 
| ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Speech | ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Speech | 
| ![supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) Text | ![supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) Text | 
| ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Video | ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) Video | 

## Pricing
<a name="model-card-openai-gpt-6-1-sol-pricing"></a>

All prices are in USD per 1 million tokens for the Standard tier. Global CRIS rates match [OpenAI first-party Standard pricing](https://developers.openai.com/api/docs/pricing).

Commercial In-Region and US geographic cross-Region inference (US CRIS) prices include a 10% premium over the global base rates. You do not need to add this premium.

GPT-6.1 Sol supports both implicit and explicit prompt caching. Cache-write tokens are billed at 1.25× the uncached input-token rate, and cache-read tokens are billed at 0.05× the uncached input-token rate. For configuration and API support, see [Prompt caching](#model-card-openai-gpt-6-1-sol-prompt-caching).

Long-context rates apply to the full request when input exceeds 272,000 tokens.

*Priority and Flex tiers are not supported for this model.*

### Commercial Regions — short context (272K input tokens or fewer)
<a name="model-card-openai-gpt-6-1-sol-pricing-short"></a>


| **Inference option** | **Input** | **Input — cache write** | **Input — cache read** | **Output** | 
| --- | --- | --- | --- | --- | 
| Regional (bedrock-mantle in US East (N. Virginia)) | $2.20 | $2.75 | $0.11 | $11.00 | 
| US CRIS (bedrock-runtime) | $2.20 | $2.75 | $0.11 | $11.00 | 
| Global CRIS (bedrock-runtime) | $2.00 | $2.50 | $0.10 | $10.00 | 

### Commercial Regions — long context (more than 272K input tokens)
<a name="model-card-openai-gpt-6-1-sol-pricing-long"></a>


| **Inference option** | **Input** | **Input — cache write** | **Input — cache read** | **Output** | 
| --- | --- | --- | --- | --- | 
| Regional (bedrock-mantle in US East (N. Virginia)) | $4.40 | $5.50 | $0.22 | $16.50 | 
| US CRIS (bedrock-runtime) | $4.40 | $5.50 | $0.22 | $16.50 | 
| Global CRIS (bedrock-runtime) | $4.00 | $5.00 | $0.20 | $15.00 | 

## Programmatic Access
<a name="model-card-openai-gpt-6-1-sol-programmatic-access"></a>

To call this model from code, use the following model IDs and endpoint URLs. For more information, see [APIs supported by Amazon Bedrock](apis.md) and [Endpoints supported by Amazon Bedrock](endpoints.md).


| **Endpoint** | **Model ID** | **In-Region endpoint URL** | **Geo inference ID** | **Global inference ID** | 
| --- | --- | --- | --- | --- | 
| bedrock-mantle | openai.gpt-6.1-sol | https://bedrock-mantle.us-east-1.api.aws/openai/v1 | Not supported | Not supported | 
| bedrock-runtime | openai.gpt-6.1-sol | Not supported | us.openai.gpt-6.1-sol | global.openai.gpt-6.1-sol | 

*For in-Region access, use `bedrock-mantle` in `us-east-1` (N. Virginia). On `bedrock-runtime`, use `us.openai.gpt-6.1-sol` for US geographic cross-Region inference or `global.openai.gpt-6.1-sol` for global cross-Region inference. Direct in-Region invocation is not supported on `bedrock-runtime`. Use a source Region enabled for the profile you choose; see [Route model inference requests across AWS Regions with cross-Region inference](cross-region-inference.md).*

## Regional Availability
<a name="model-card-openai-gpt-6-1-sol-regional-availability"></a>

***Regional availability at a glance***

Mantle access is available in `us-east-1` (N. Virginia). Runtime access supports both US geographic and global inference profiles. For more information, see [Regional availability by models](models-region-compatibility.md).

**Availability using the `bedrock-mantle` endpoint**


| **Region** | **In-Region** | **Geo** | **Global** | 
| --- | --- | --- | --- | 
| us-east-1 (N. Virginia) | ![supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) | ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) | ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) | 

**Availability using the `bedrock-runtime` endpoint**


| **Scope** | **In-Region** | **Geo** | **Global** | 
| --- | --- | --- | --- | 
| US geographic and global inference | ![not-supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-no.png) | ![supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) | ![supported](https://docs.aws.amazon.com/bedrock/latest/userguide/images/icons/icon-yes.png) | 

***Geo inference details***

The destination Regions available to a geographic inference profile depend on the source Region. To retrieve the current routing configuration, call [GetInferenceProfile](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_GetInferenceProfile.html) from the source Region.

**Geo: US**

Geo inference ID: `us.openai.gpt-6.1-sol`


| **Source Region** | **Destination Regions** | 
| --- | --- | 
| us-east-1 (N. Virginia) | us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 
| us-east-2 (Ohio) | us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 
| us-west-1 (N. California) | us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-1 (N. California), us-west-2 (Oregon) | 
| us-west-2 (Oregon) | us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 
| ca-central-1 (Canada) | ca-central-1 (Canada), us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 
| ca-west-1 (Calgary) | ca-west-1 (Calgary), us-east-1 (N. Virginia), us-east-2 (Ohio), us-west-2 (Oregon) | 

