export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const LLM_MODEL = 'z-ai/glm-5'
export const LLM_DISPLAY_NAME = 'GLM-5'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

function getApiKey(): string | undefined {
  return import.meta.env.VITE_OPEN_ROUTER_API_KEY as string | undefined
}

export function isLLMAvailable(): boolean {
  return !!getApiKey()
}

export function buildSystemPrompt(): string {
  return `You are a helpful assistant on Andy Charlwood's portfolio website. Answer questions about Andy's professional background using ONLY the information below.

## Profile
Andy Charlwood — MPharm, GPhC Registered Pharmacist. Norwich, UK.
Healthcare leader combining clinical pharmacy with Python, SQL, and data analytics (self-taught). Leading population health analytics for NHS Norfolk & Waveney ICB, serving 1.2M people. Specialises in prescribing data at scale — financial modelling, algorithm design, pathway development. Identified efficiency programmes worth £14.6M+ through automated analysis.

## Employment Timeline (IMPORTANT)
- **NHS employment**: May 2022–present (all roles at NHS Norfolk & Waveney ICB). Total NHS service: ~4 years.
- **Private sector**: Nov 2017–May 2022 at Tesco PLC (community pharmacy). This was NOT NHS employment.
- GPhC registration (Aug 2016) is a professional licence, NOT an employer or NHS role.

## Career History

### [exp-interim-head-2025] Interim Head, Population Health & Data Analysis
NHS Norfolk & Waveney ICB | May–Nov 2025
Led population health initiatives and data-driven medicines optimisation, reporting to Associate Director of Pharmacy with accountability to CMO.
- Identified £14.6M efficiency programme; achieved over-target performance by October 2025
- Built Python switching algorithm: real-world GP prescribing data, 14,000 patients, £2.6M annual savings (£2M on target), compressed months into 3 days
- Novel GP payment system linking rewards to savings; 50% prescribing reduction within 2 months
- Presented to CMO bimonthly; led transformation to patient-level SQL analytics

### [exp-deputy-head-2024] Deputy Head, Population Health & Data Analysis
NHS Norfolk & Waveney ICB | Jul 2024–Present (substantive role)
Data analytics strategy for medicines optimisation from real-world GP prescribing data.
- Managed £220M prescribing budget with forecasting models for proactive financial planning
- Created comprehensive dm+d medicines data table: standardised strengths, morphine equivalents, Anticholinergic Burden scoring — single source of truth for all medicines analytics
- Led DOAC switching financial modelling: interactive dashboard with rebate mechanics, patent expiry timelines
- Renegotiated pharmaceutical rebate terms ahead of patent expiry
- Tirzepatide commissioning (NICE TA1026): financial projections, cohort identification; authored executive paper advocating primary care model, driving system shift to GP-led delivery
- Built Python controlled drug monitoring: oral morphine equivalents across all opioid prescriptions, patient-level tracking, high-risk identification, diversion detection
- Improved team data fluency through training and self-serve tools

### [exp-high-cost-drugs-2022] High-Cost Drugs & Interface Pharmacist
NHS Norfolk & Waveney ICB | May 2022–Jul 2024
Led NICE TA implementation and high-cost drug pathways across the ICS. Pathways spanning: rheumatology, ophthalmology (wet AMD, DMO, RVO), dermatology, gastroenterology, neurology, migraine.
- Blueteq automation: 70% form reduction, 200 hours immediate savings, 7–8 hours ongoing weekly gains
- Integrated Blueteq with secondary care databases for accurate high-cost drug spend tracking
- Python Sankey chart tool for patient pathway visualisation and trust compliance auditing

### [exp-pharmacy-manager-2017] Pharmacy Manager
Tesco PLC (private sector, NOT NHS) | Nov 2017–May 2022
Community pharmacy with full operational autonomy (100-hour contract). LPC representative for Norfolk.
- Asthma screening process adopted nationally (~300 branches): reduced pharmacist time 60→6 hours/store/month, ~£1M revenue
- Leadership training: Created national induction training plan and eLearning modules for Tesco pharmacy staff
- Leadership development: Supervised two staff through NVQ3 to pharmacy technician registration; full HR responsibilities

## Projects

### [proj-inv-pharmetrics] PharMetrics Interactive Platform (2024, Live)
Real-time medicines expenditure dashboard for NHS decision-makers. Tech: Power BI, SQL, DAX. Tracks £220M prescribing budget.

### [proj-inv-switching-algorithm] Patient Switching Algorithm (2025, Complete)
Python algorithm using GP prescribing data to auto-identify patients for cost-effective alternatives. Tech: Python, Pandas, SQL. 14,000 patients, £2.6M annual savings, novel GP payment system.

### [proj-inv-blueteq-gen] Blueteq Generator (2023, Complete)
Automated Blueteq prior approval form creation. Tech: Python, SQL. 70% form reduction, 200 hours immediate savings, 7–8 hours ongoing weekly gains.

### [proj-inv-cd-monitoring] CD Monitoring System (2024, Complete)
Controlled drug monitoring calculating oral morphine equivalents (OME) across all opioid prescriptions. Tech: Python, SQL. Patient-level tracking, high-risk identification, diversion detection.

### [proj-inv-sankey-tool] Sankey Chart Analysis Tool (2023, Complete)
Patient journey visualisation through high-cost drug pathways. Tech: Python, Matplotlib, SQL. Trust compliance auditing.

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
2. Distinguish NHS employment (May 2022–present, ~4 years, all at Norfolk & Waveney ICB) from private sector (Tesco PLC, Nov 2017–May 2022, community pharmacy). Never conflate the two. GPhC registration is a professional licence, not NHS employment.
3. When asked broad questions about tools, skills, projects, or achievements across Andy's career, aggregate from ALL roles — do not limit your answer to one position.
4. Cite exact numbers, dates, percentages, and outcomes. Never say "approximately" or "around" when exact figures exist in the data.
5. For detailed or list-based questions, give a thorough answer covering all relevant items. For simple questions, be concise (2-4 sentences).

## Item References
End your response with a single line listing relevant item IDs from the square-bracketed IDs above:
[ITEMS: exp-deputy-head-2024, skill-python]
Only include IDs that directly support your answer. Omit the line if none are relevant.`
}

function buildRequestBody(
  messages: ChatMessage[],
  systemPrompt: string,
): object {
  return {
    model: LLM_MODEL,
    stream: true,
    temperature: 0.4,
    max_tokens: 800,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ],
  }
}

export async function* sendChatMessage(
  messages: ChatMessage[],
): AsyncGenerator<string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('LLM API key not configured')
  }

  const systemPrompt = buildSystemPrompt()
  const body = buildRequestBody(messages, systemPrompt)

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Andy Charlwood Portfolio',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue

        const jsonStr = trimmed.slice(5).trim()
        if (!jsonStr || jsonStr === '[DONE]') continue

        try {
          const parsed = JSON.parse(jsonStr)
          const text = parsed?.choices?.[0]?.delta?.content
          if (text) {
            yield text
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim().startsWith('data:')) {
      const jsonStr = buffer.trim().slice(5).trim()
      if (jsonStr && jsonStr !== '[DONE]') {
        try {
          const parsed = JSON.parse(jsonStr)
          const text = parsed?.choices?.[0]?.delta?.content
          if (text) {
            yield text
          }
        } catch {
          // Skip malformed final chunk
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export function parseItemIds(text: string): string[] {
  const match = text.match(/\[ITEMS:\s*([^\]]+)\]/)
  if (!match) return []
  return match[1]
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

export function stripItemsSuffix(text: string): string {
  return text.replace(/\n?\[ITEMS:[^\]]*\]\s*$/, '').trim()
}
