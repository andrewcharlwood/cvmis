import { LLM_SYSTEM_PROMPT } from '@/data/llm-prompt'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const LLM_MODEL = 'z-ai/glm-5'
export const LLM_DISPLAY_NAME = 'GLM-5'

export function isLLMAvailable(): boolean {
  return true
}

export function buildSystemPrompt(): string {
  return LLM_SYSTEM_PROMPT
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
  const systemPrompt = buildSystemPrompt()
  const body = buildRequestBody(messages, systemPrompt)

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
