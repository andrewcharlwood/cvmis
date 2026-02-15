import { buildEmbeddingTexts } from '@/lib/search'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash'

function getApiKey(): string | undefined {
  return import.meta.env.VITE_GEMINI_API_KEY as string | undefined
}

export function isGeminiAvailable(): boolean {
  return !!getApiKey()
}

function buildSystemPrompt(): string {
  const texts = buildEmbeddingTexts()
  const cvContent = texts.map((t) => `- ${t.text}`).join('\n')

  return `You are an AI assistant embedded in Andy Charlwood's professional portfolio website. Your role is to answer questions about Andy's professional experience, skills, projects, and qualifications accurately and concisely.

Here is Andy's complete professional profile:

${cvContent}

Instructions:
- Answer questions based ONLY on the information above. Do not invent roles, dates, or achievements.
- Be concise — 2-4 sentences for most answers.
- Be professional but friendly in tone.
- If asked something not covered by the profile data, say you don't have that information.
- At the end of your response, on a new line, include relevant portfolio item IDs in this format: [ITEMS: id1, id2, id3]
- Only include item IDs that are directly relevant to your answer. The available IDs are the ones listed above (e.g., exp-*, skill-*, proj-*, ach-*, edu-*, action-*).
- If no items are particularly relevant, omit the [ITEMS: ...] line entirely.`
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
