import { buildEmbeddingTexts } from '@/lib/search'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const GEMINI_MODEL = 'gemini-3-flash-preview'
export const GEMINI_DISPLAY_NAME = 'Gemini 3 Flash'

const GEMINI_API_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`

function getApiKey(): string | undefined {
  return import.meta.env.VITE_GEMINI_API_KEY as string | undefined
}

export function isGeminiAvailable(): boolean {
  return !!getApiKey()
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

function buildRequestBody(
  messages: ChatMessage[],
  systemPrompt: string,
): object {
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  return {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  }
}

export async function* sendChatMessage(
  messages: ChatMessage[],
): AsyncGenerator<string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const systemPrompt = buildSystemPrompt()
  const body = buildRequestBody(messages, systemPrompt)

  const response = await fetch(
    `${GEMINI_API_BASE}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
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
      // Keep the last potentially incomplete line in the buffer
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue

        const jsonStr = trimmed.slice(5).trim()
        if (!jsonStr || jsonStr === '[DONE]') continue

        try {
          const parsed = JSON.parse(jsonStr)
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
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
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
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
