/** Each GPT OSS card lists a versioned Bedrock Runtime ID and a bare Mantle ID for the same model. */
export function gptOssCatalogId(modelId?: string): string | undefined {
  return modelId?.toLowerCase().match(/^(openai\.gpt-oss-(?:20b|120b))(?:-1:0)?$/)?.[1];
}
