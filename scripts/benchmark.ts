import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildEmbeddingTexts } from '@/lib/search'

// Load .env file manually (avoid adding dotenv dependency)
function loadEnvFile(): void {
  const envPath = resolve(import.meta.dirname, '..', '.env')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex)
    const value = trimmed.slice(eqIndex + 1)
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}
loadEnvFile()

// --- Types ---

interface BenchmarkQuestion {
  id: string
  question: string
  expectedAnswer: string
  keyFacts: string[]
}

interface BenchmarkConfig {
  passThreshold: number
  maxScore: number
  questions: BenchmarkQuestion[]
}

interface ScoringResult {
  score: 0 | 1 | 2
  justification: string
}

interface QuestionResult {
  id: string
  question: string
  expectedAnswer: string
  actualAnswer: string
  score: number
  justification: string
}

interface BenchmarkResults {
  iteration: number
  timestamp: string
  model: string
  totalScore: number
  maxPossibleScore: number
  passThreshold: number
  passed: boolean
  hasZeros: boolean
  results: QuestionResult[]
}

// --- Gemini API ---

const GEMINI_MODEL = 'gemini-3-flash-preview'
const GEMINI_API_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`

function getApiKey(): string {
  const key = process.env.VITE_GEMINI_API_KEY
  if (!key) {
    throw new Error('VITE_GEMINI_API_KEY not set. Ensure .env file exists with this key.')
  }
  return key
}

function buildSystemPrompt(): string {
  const texts = buildEmbeddingTexts()
  const cvContent = texts.map((t) => `- ${t.text}`).join('\n')

  return `You are an AI assistant on Andy Charlwood's portfolio website. Answer questions about his experience, skills, projects, and qualifications.

## Andy's Professional Profile

${cvContent}

## Rules
1. Use ONLY the profile above. Never invent roles, dates, or achievements.
2. Be concise (2-4 sentences). Be professional but friendly.
3. If the information isn't in the profile, say so.

## Item References
After your answer, on a NEW line, list relevant portfolio item IDs:
[ITEMS: id1, id2, id3]
- IDs match the profile entries above (exp-*, skill-*, proj-*, ach-*, edu-*, action-*).
- Only include IDs directly relevant to your answer.
- If no items are relevant, omit the [ITEMS: ...] line entirely.`
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callGemini(
  systemPrompt: string,
  userMessage: string,
  temperature = 0.7,
  maxOutputTokens = 512,
): Promise<string> {
  const apiKey = getApiKey()
  const maxRetries = 5

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(
      `${GEMINI_API_BASE}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            { role: 'user', parts: [{ text: userMessage }] },
          ],
          generationConfig: {
            temperature,
            maxOutputTokens,
          },
        }),
      },
    )

    if (response.status === 429 || response.status === 503) {
      const errorBody = await response.text()
      const retryMatch = errorBody.match(/retry in ([\d.]+)s/)
      const waitSeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) + 2 : (attempt + 1) * 15
      const reason = response.status === 429 ? 'Rate limited' : 'Service unavailable'
      console.log(`  ${reason}. Waiting ${waitSeconds}s (attempt ${attempt + 1}/${maxRetries})...`)
      await sleep(waitSeconds * 1000)
      continue
    }

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Gemini API error ${response.status}: ${errorBody}`)
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      throw new Error(`No text in Gemini response: ${JSON.stringify(data)}`)
    }
    return text
  }

  throw new Error('Max retries exceeded for rate limiting')
}

// --- Scoring ---

function extractJson(text: string): string | null {
  // Try parsing directly first
  try {
    JSON.parse(text)
    return text
  } catch { /* not direct JSON, continue extraction */ }

  // Strip markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    return fenceMatch[1].trim()
  }

  // Find first { ... } block
  const braceStart = text.indexOf('{')
  if (braceStart === -1) return null

  // Find matching closing brace
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = braceStart; i < text.length; i++) {
    const ch = text[i]
    if (escaped) { escaped = false; continue }
    if (ch === '\\') { escaped = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{') depth++
    if (ch === '}') { depth--; if (depth === 0) return text.slice(braceStart, i + 1) }
  }

  return null
}

async function scoreAnswer(
  question: string,
  expectedAnswer: string,
  keyFacts: string[],
  actualAnswer: string,
): Promise<ScoringResult> {
  const scoringPrompt = `You are a strict evaluator. Compare an ACTUAL answer to an EXPECTED answer about a person's CV.

Rubric:
- 2 = ACCURATE: Covers key facts correctly. Minor omissions OK if no errors.
- 1 = PARTIAL: Some key facts right but misses important details or is vague.
- 0 = INCORRECT: Contains factual errors, contradicts expected answer, or misses the point.

Key facts for score 2:
${keyFacts.map((f) => `- ${f}`).join('\n')}

IMPORTANT: Respond with ONLY a single-line JSON object. No markdown, no code fences, no extra text.
Example: {"score":2,"justification":"Covers all key facts accurately"}
Keep justification under 30 words.`

  const userMessage = `QUESTION: ${question}

EXPECTED ANSWER: ${expectedAnswer}

ACTUAL ANSWER: ${actualAnswer}`

  const rawResponse = await callGemini(scoringPrompt, userMessage, 0, 512)

  // Extract JSON — handle code fences, preamble text, multiline responses
  const extracted = extractJson(rawResponse)
  if (!extracted) {
    console.warn(`  Warning: Could not extract JSON from scoring response: ${rawResponse.slice(0, 200)}`)
    return { score: 0, justification: `Failed to parse scoring response` }
  }

  try {
    const parsed = JSON.parse(extracted) as ScoringResult
    if (![0, 1, 2].includes(parsed.score)) {
      console.warn(`  Warning: Invalid score value: ${parsed.score}`)
      return { score: 0, justification: `Invalid score value: ${parsed.score}` }
    }
    return parsed
  } catch {
    console.warn(`  Warning: Invalid JSON: ${extracted.slice(0, 150)}`)
    return { score: 0, justification: `Invalid JSON in response` }
  }
}

// --- Iteration Management ---

function getNextIteration(resultsDir: string): number {
  if (!existsSync(resultsDir)) return 0

  const files = readdirSync(resultsDir).filter((f) => f.startsWith('iteration-') && f.endsWith('.json'))
  if (files.length === 0) return 0

  const iterations = files.map((f) => {
    const match = f.match(/iteration-(\d+)\.json/)
    return match ? parseInt(match[1], 10) : -1
  })
  return Math.max(...iterations) + 1
}

// --- Console Output ---

function printSummary(results: BenchmarkResults): void {
  console.log('\n' + '='.repeat(80))
  console.log(`BENCHMARK RESULTS — Iteration ${results.iteration}`)
  console.log(`Model: ${results.model} | ${results.timestamp}`)
  console.log('='.repeat(80))

  // Table header
  console.log(
    'ID'.padEnd(6) +
    'Score'.padEnd(8) +
    'Question'.padEnd(50) +
    'Justification'
  )
  console.log('-'.repeat(80))

  for (const r of results.results) {
    const scoreLabel = r.score === 2 ? '2 ✓' : r.score === 1 ? '1 ~' : '0 ✗'
    const questionTruncated = r.question.length > 47 ? r.question.slice(0, 44) + '...' : r.question
    const justTruncated = r.justification.length > 60 ? r.justification.slice(0, 57) + '...' : r.justification
    console.log(
      r.id.padEnd(6) +
      scoreLabel.padEnd(8) +
      questionTruncated.padEnd(50) +
      justTruncated
    )
  }

  console.log('-'.repeat(80))
  console.log(
    `TOTAL: ${results.totalScore}/${results.maxPossibleScore}` +
    ` | Threshold: ${results.passThreshold}/${results.maxPossibleScore}` +
    ` | Has zeros: ${results.hasZeros ? 'YES' : 'No'}` +
    ` | ${results.passed ? 'PASSED ✓' : 'FAILED ✗'}`
  )
  console.log('='.repeat(80))
}

// --- Main ---

async function main() {
  const scriptDir = import.meta.dirname
  const configPath = resolve(scriptDir, 'benchmark-config.json')
  const resultsDir = resolve(scriptDir, 'benchmark-results')

  // Load config
  const config: BenchmarkConfig = JSON.parse(readFileSync(configPath, 'utf-8'))
  console.log(`Loaded ${config.questions.length} benchmark questions.`)

  // Determine iteration number
  const iteration = getNextIteration(resultsDir)
  console.log(`Running iteration ${iteration}...`)

  // Build system prompt (same as production)
  const systemPrompt = buildSystemPrompt()
  console.log(`System prompt built (${systemPrompt.length} chars).`)

  // Run each question
  const questionResults: QuestionResult[] = []

  for (const q of config.questions) {
    console.log(`\n[${q.id}] ${q.question}`)

    // Get answer from Gemini
    console.log('  Getting answer...')
    const actualAnswer = await callGemini(systemPrompt, q.question)
    console.log(`  Answer: ${actualAnswer.slice(0, 100)}...`)

    // Score the answer
    console.log('  Scoring...')
    const { score, justification } = await scoreAnswer(
      q.question,
      q.expectedAnswer,
      q.keyFacts,
      actualAnswer,
    )
    console.log(`  Score: ${score}/2 — ${justification}`)

    questionResults.push({
      id: q.id,
      question: q.question,
      expectedAnswer: q.expectedAnswer,
      actualAnswer,
      score,
      justification,
    })
  }

  // Calculate totals
  const totalScore = questionResults.reduce((sum, r) => sum + r.score, 0)
  const hasZeros = questionResults.some((r) => r.score === 0)
  const passed = totalScore >= config.passThreshold && !hasZeros

  const results: BenchmarkResults = {
    iteration,
    timestamp: new Date().toISOString(),
    model: GEMINI_MODEL,
    totalScore,
    maxPossibleScore: config.maxScore,
    passThreshold: config.passThreshold,
    passed,
    hasZeros,
    results: questionResults,
  }

  // Save results
  mkdirSync(resultsDir, { recursive: true })
  const resultsPath = resolve(resultsDir, `iteration-${iteration}.json`)
  writeFileSync(resultsPath, JSON.stringify(results, null, 2))
  console.log(`\nResults saved to ${resultsPath}`)

  // Print summary table
  printSummary(results)

  // Exit with appropriate code
  process.exit(passed ? 0 : 1)
}

main().catch((err) => {
  console.error('Benchmark failed:', err)
  process.exit(2)
})
