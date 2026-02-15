import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { env, pipeline } from '@xenova/transformers'
import { buildEmbeddingTexts } from '@/lib/search'

// Use local model files from public/models/ (same files the browser uses)
env.localModelPath = resolve(import.meta.dirname, '..', 'public', 'models')
env.allowRemoteModels = false

async function main() {
  const items = buildEmbeddingTexts()
  console.log(`Found ${items.length} items to embed.`)

  console.log('Loading all-MiniLM-L6-v2 model...')
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

  const embeddings: Array<{ id: string; embedding: number[] }> = []

  for (const item of items) {
    const output = await extractor(item.text, { pooling: 'mean', normalize: true })
    const vector = Array.from(output.data as Float32Array)
    embeddings.push({ id: item.id, embedding: vector })
    console.log(`  [${embeddings.length}/${items.length}] ${item.id} (${vector.length}d)`)
  }

  const outPath = resolve(import.meta.dirname, '..', 'src', 'data', 'embeddings.json')
  writeFileSync(outPath, JSON.stringify(embeddings, null, 2))
  console.log(`\nWrote ${embeddings.length} embeddings to ${outPath}`)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
