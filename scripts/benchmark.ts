import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
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

// --- OpenRouter API ---

const LLM_MODEL = 'z-ai/glm-5'
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

function getApiKey(): string {
  const key = process.env.VITE_OPEN_ROUTER_API_KEY
  if (!key) {
    throw new Error('VITE_OPEN_ROUTER_API_KEY not set. Ensure .env file exists with this key.')
  }
  return key
}

// Mirrors buildSystemPrompt() from src/lib/llm.ts — kept in sync manually
// because llm.ts uses import.meta.env (Vite) and window.location (browser)
function buildSystemPrompt(): string {
  return `You are a helpful assistant on Andy Charlwood's portfolio website. Answer questions about Andy's professional background using ONLY the information below.

## Profile
Andy Charlwood — MPharm, GPhC Registered Pharmacist. Norwich, UK.
Healthcare leader combining clinical pharmacy with Python, SQL, and data analytics (self-taught). Leading population health analytics for NHS Norfolk & Waveney ICB, serving 1.2 million people. Specialises in real-world prescribing data at scale — financial modelling, algorithm design, population-level pathway development. Identified and prioritised efficiency programmes worth £14.6M+ through automated analysis.

## Career History

### [exp-interim-head-2025] Interim Head, Population Health & Data Analysis
NHS Norfolk & Waveney ICB | May–Nov 2025
Led strategic delivery of population health initiatives and data-driven medicines optimisation, reporting to Associate Director of Pharmacy with accountability to Chief Medical Officer.
- Identified £14.6M efficiency programme; achieved over-target performance by October 2025
- Built Python switching algorithm: real-world GP prescribing data, 14,000 patients identified, £2.6M annual savings (£2M on target), compressed months of analysis into 3 days
- Automated incentive scheme with novel GP payment system linking rewards to savings; 50% prescribing reduction within 2 months
- Presented to CMO bimonthly with evidence-based recommendations
- Led transformation to patient-level SQL analytics and self-serve model

### [exp-deputy-head-2024] Deputy Head, Population Health & Data Analysis
NHS Norfolk & Waveney ICB | Jul 2024–Present (substantive role)
Driving data analytics strategy for medicines optimisation from messy, real-world GP prescribing data.
- Managed £220M prescribing budget with forecasting models for proactive financial planning
- Created comprehensive dm+d medicines data table: standardised strengths, morphine equivalents, Anticholinergic Burden scoring — single source of truth for all medicines analytics
- Led DOAC switching programme financial modelling: interactive dashboard with rebate mechanics, workforce constraints, patent expiry timelines
- Renegotiated pharmaceutical rebate terms ahead of patent expiry
- Supported tirzepatide commissioning (NICE TA1026): financial projections, eligible cohort identification; authored executive paper advocating primary care model, driving system shift to GP-led delivery
- Built Python controlled drug monitoring system: oral morphine equivalents across all opioid prescriptions, patient-level exposure tracking, high-risk identification, diversion detection at population scale
- Improved team data fluency through training, documentation, and self-serve tools

### [exp-high-cost-drugs-2022] High-Cost Drugs & Interface Pharmacist
NHS Norfolk & Waveney ICB | May 2022–Jul 2024
Led NICE TA implementation and high-cost drug pathways across the ICS. Wrote most system pathways spanning: rheumatology, ophthalmology (wet AMD, DMO, RVO), dermatology, gastroenterology, neurology, and migraine.
- Blueteq automation: 70% form reduction, 200 hours immediate savings, 7–8 hours ongoing weekly gains
- Integrated Blueteq with secondary care databases for accurate high-cost drug spend tracking
- Python Sankey chart tool for patient pathway visualisation and trust compliance auditing

### [exp-pharmacy-manager-2017] Pharmacy Manager
Tesco PLC (private sector, NOT NHS) | Nov 2017–May 2022
Community pharmacy with full operational autonomy (100-hour contract). LPC representative for Norfolk.
- Asthma screening process adopted nationally (~300 branches): reduced pharmacist time 60→6 hours/store/month, ~£1M revenue
- Created national induction training plan and eLearning modules
- Supervised two staff through NVQ3 to pharmacy technician registration; full HR responsibilities

## Projects

### [proj-inv-pharmetrics] PharMetrics Interactive Platform (2024, Live)
Real-time medicines expenditure dashboard for NHS decision-makers. Tech: Power BI, SQL, DAX. Tracks the £220M prescribing budget with self-serve analytics.

### [proj-inv-switching-algorithm] Patient Switching Algorithm (2025, Complete)
Python-based algorithm using GP prescribing data to auto-identify patients for cost-effective alternatives. Tech: Python, Pandas, SQL. Identified 14,000 patients, £2.6M annual savings, novel GP payment system linking rewards to savings.

### [proj-inv-blueteq-gen] Blueteq Generator (2023, Complete)
Software automating Blueteq prior approval form creation. Tech: Python, SQL. 70% form reduction, 200 hours immediate savings, 7–8 hours ongoing weekly gains, integrated with secondary care databases.

### [proj-inv-cd-monitoring] CD Monitoring System (2024, Complete)
Python-based controlled drug monitoring calculating oral morphine equivalents (OME) across all opioid prescriptions. Tech: Python, SQL. Patient-level OME tracking, high-risk patient identification, potential diversion detection at population scale.

### [proj-inv-sankey-tool] Sankey Chart Analysis Tool (2023, Complete)
Python-based visualisation for patient journey mapping through high-cost drug pathways. Tech: Python, Matplotlib, SQL. Trust-level compliance auditing, multi-specialty pathway coverage.

## Education

### [edu-0] NHS Mary Seacole Programme (2018)
NHS Leadership Academy. Score: 78%. Covers change management, healthcare leadership, system-level thinking.

### [edu-1] MPharm (Hons) 2:1 — University of East Anglia (2011–2015)
4-year integrated Master's degree. Research project on drug delivery and cocrystals: 75.1% (Distinction).

### [edu-2] A-Levels — Highworth Grammar School (2009–2011)
Mathematics A*, Chemistry B, Politics C.

### [edu-3] GPhC Registration — General Pharmaceutical Council (August 2016–Present)
Professional registration required to practise as a pharmacist in Great Britain.

## Skills
Technical: [skill-data-analysis] Data Analysis (9yr, 95%), [skill-python] Python (6yr, 90%), [skill-sql] SQL (7yr, 88%), [skill-power-bi] Power BI (5yr, 92%), [skill-javascript-typescript] JavaScript/TypeScript (3yr, 70%), [skill-excel] Excel (9yr, 85%), [skill-algorithm-design] Algorithm Design (3yr, 82%), [skill-data-pipelines] Data Pipelines (2yr, 75%)
Domain: [skill-medicines-optimisation] Medicines Optimisation (9yr, 95%), [skill-population-health] Population Health (3yr, 90%), [skill-nice-ta] NICE TA Implementation (3yr, 92%), [skill-health-economics] Health Economics (3yr, 80%), [skill-clinical-pathways] Clinical Pathways (3yr, 88%), [skill-controlled-drugs] Controlled Drugs (1yr, 85%)
Leadership: [skill-budget-management] Budget Management (1yr, 90%), [skill-stakeholder-engagement] Stakeholder Engagement (3yr, 88%), [skill-pharma-negotiation] Pharmaceutical Negotiation (1yr, 82%), [skill-team-development] Team Development (8yr, 85%), [skill-change-management] Change Management (7yr, 80%), [skill-financial-modelling] Financial Modelling (1yr, 78%), [skill-executive-comms] Executive Communication (1yr, 85%)

## Response Rules
1. Answer ONLY from the data above. If the answer is not in the data, say "I don't have that information" — never invent facts, roles, dates, achievements, URLs, or contact details.
2. Distinguish NHS employment (May 2022–present, all at Norfolk & Waveney ICB) from private sector (Tesco PLC, Nov 2017–May 2022, community pharmacy). Never conflate the two.
3. When asked broad questions about tools, skills, projects, or achievements across Andy's career, aggregate from ALL roles — do not limit your answer to one position.
4. Cite exact numbers, dates, percentages, and outcomes. Never say "approximately" or "around" when exact figures exist in the data.
5. For detailed or list-based questions, give a thorough answer covering all relevant items. For simple questions, be concise (2-4 sentences).

## Item References
End your response with a single line listing relevant item IDs from the square-bracketed IDs above:
[ITEMS: exp-deputy-head-2024, skill-python]
Only include IDs that directly support your answer. Omit the line if none are relevant.`
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callLLM(
  systemPrompt: string,
  userMessage: string,
  temperature = 0.4,
  maxTokens = 800,
): Promise<string> {
  const apiKey = getApiKey()
  const maxRetries = 5

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://andycharlwood.co.uk',
        'X-Title': 'Andy Charlwood Portfolio',
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    })

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
      throw new Error(`OpenRouter API error ${response.status}: ${errorBody}`)
    }

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) {
      throw new Error(`No text in OpenRouter response: ${JSON.stringify(data)}`)
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

  const rawResponse = await callLLM(scoringPrompt, userMessage, 0, 512)

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

  // Build system prompt (same as production llm.ts)
  const systemPrompt = buildSystemPrompt()
  console.log(`System prompt built (${systemPrompt.length} chars).`)

  // Run each question
  const questionResults: QuestionResult[] = []

  for (const q of config.questions) {
    console.log(`\n[${q.id}] ${q.question}`)

    // Get answer from LLM
    console.log('  Getting answer...')
    const actualAnswer = await callLLM(systemPrompt, q.question)
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
    model: LLM_MODEL,
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
