import { buildEmbeddingTexts } from '@/lib/search'

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
  const texts = buildEmbeddingTexts()
  const cvContent = texts.map((t) => `[${t.id}] ${t.text}`).join('\n')

  return `You are a helpful assistant on Andy Charlwood's portfolio website.

## Profile Data
Each entry is prefixed with its ID in square brackets.

${cvContent}

## Response Rules
- Answer ONLY from the profile data above. Never invent facts, roles, dates, or achievements.
- Be concise: 2-4 sentences. Professional and friendly tone.
- If the answer isn't in the profile, say so honestly.
- Do not fabricate URLs, email addresses, or contact details.

## Item References
End your response with a single line listing relevant item IDs:
[ITEMS: exp-nhs-nwicb, skill-python]
Only include IDs that directly support your answer. Omit the line if none are relevant.`
}

function buildRequestBody(
  messages: ChatMessage[],
  systemPrompt: string,
): object {
  return {
    model: LLM_MODEL,
    stream: true,
    temperature: 0.7,
    max_tokens: 512,
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
