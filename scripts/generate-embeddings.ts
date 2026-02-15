import { pipeline } from '@xenova/transformers'

async function main() {
  console.log('Loading all-MiniLM-L6-v2 model...')
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

  const testString = 'This is a test string for embedding generation.'
  console.log(`Embedding test string: "${testString}"`)

  const output = await extractor(testString, { pooling: 'mean', normalize: true })
  const vector = Array.from(output.data as Float32Array)

  console.log(`Vector length: ${vector.length}`)
  console.log('Done.')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
