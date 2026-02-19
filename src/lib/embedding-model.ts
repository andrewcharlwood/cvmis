let extractor: import('@xenova/transformers').FeatureExtractionPipeline | null = null
let loading = false

export async function initModel(): Promise<void> {
  if (extractor || loading) return
  loading = true
  try {
    const { env, pipeline } = await import('@xenova/transformers')
    env.localModelPath = '/models/'
    env.allowRemoteModels = false
    env.useBrowserCache = false
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2') as import('@xenova/transformers').FeatureExtractionPipeline
  } catch {
    // Silently swallow — model unavailable, semantic search won't activate
  } finally {
    loading = false
  }
}

export async function embedQuery(text: string): Promise<number[]> {
  if (!extractor) throw new Error('Model not loaded')
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data as Float32Array)
}

export function isModelReady(): boolean {
  return extractor !== null
}
