import embeddingsData from '@/data/embeddings.json'

interface EmbeddingEntry {
  id: string
  embedding: number[]
}

interface SearchResult {
  id: string
  score: number
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let magA = 0
  let magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  return denom === 0 ? 0 : dot / denom
}

export function semanticSearch(
  queryEmbedding: number[],
  embeddings: EmbeddingEntry[],
  threshold = 0.15
): SearchResult[] {
  return embeddings
    .map(entry => ({
      id: entry.id,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
    }))
    .filter(r => r.score >= threshold)
    .sort((a, b) => b.score - a.score)
}

export function loadEmbeddings(): EmbeddingEntry[] {
  return embeddingsData as EmbeddingEntry[]
}
