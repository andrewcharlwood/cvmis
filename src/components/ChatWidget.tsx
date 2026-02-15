import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import {
  sendChatMessage,
  isGeminiAvailable,
  parseItemIds,
  stripItemsSuffix,
  type ChatMessage,
} from '@/lib/gemini'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MAX_HISTORY = 10

const buttonVariants = {
  hidden: prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.3, ease: 'easeOut', delay: 1 },
  },
}

const panelVariants = {
  hidden: prefersReducedMotion
    ? { opacity: 1, scale: 1 }
    : { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.2, ease: 'easeOut' },
  },
  exit: prefersReducedMotion
    ? { opacity: 1, scale: 1 }
    : { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const geminiAvailable = isGeminiAvailable()

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isStreaming) return

    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMessage]

    // Cap history to last MAX_HISTORY messages, strip internal metadata
    const historyForApi = updatedMessages.slice(-MAX_HISTORY).map((msg) => ({
      ...msg,
      content: msg.content.replace(/\n?<!--ITEMS:[^>]*-->/, '').trim(),
    }))

    setMessages(updatedMessages)
    setInputValue('')
    setIsStreaming(true)

    // Add empty assistant message that will be streamed into
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const stream = sendChatMessage(historyForApi)
      let accumulated = ''

      for await (const chunk of stream) {
        accumulated += chunk
        // Update the last (assistant) message with accumulated text
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: accumulated }
          return updated
        })
      }

      // Final cleanup: strip [ITEMS: ...] suffix from display text (keep raw for parsing)
      // We store the clean display text but parse items from the raw accumulated text
      const cleanText = stripItemsSuffix(accumulated)
      const itemIds = parseItemIds(accumulated)
      const finalContent = itemIds.length > 0
        ? `${cleanText}\n<!--ITEMS:${itemIds.join(',')}-->`
        : cleanText

      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: finalContent }
        return updated
      })
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: "Sorry, I couldn't process that. Please try again.",
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }, [inputValue, isStreaming, messages])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Extract display text from message content (strip hidden item metadata)
  const getDisplayText = (content: string) => {
    return content.replace(/\n?<!--ITEMS:[^>]*-->/, '').trim()
  }

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            role="dialog"
            aria-label="Chat with AI about Andy"
            className="fixed z-[90] font-ui
              bottom-0 left-0 right-0 rounded-t-xl
              sm:bottom-[88px] sm:right-6 sm:left-auto sm:rounded-xl"
            style={{
              width: undefined,
              background: 'var(--surface)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transformOrigin: 'bottom right',
            }}
          >
            <style>{`
              @media (min-width: 640px) {
                [data-chat-panel] { width: 380px; max-height: 480px; }
              }
              @media (max-width: 639px) {
                [data-chat-panel] { height: 85vh; max-height: 85vh; }
              }
            `}</style>
            <div
              data-chat-panel
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                maxHeight: '480px',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-light)',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  Ask about Andy
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-light)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              {/* Messages area */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
                className="pmr-scrollbar"
              >
                {!geminiAvailable && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '32px 16px',
                      color: 'var(--text-tertiary)',
                      fontSize: '13px',
                      lineHeight: 1.5,
                    }}
                  >
                    Chat is currently unavailable.
                  </div>
                )}

                {geminiAvailable && messages.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '32px 16px',
                      color: 'var(--text-tertiary)',
                      fontSize: '13px',
                      lineHeight: 1.5,
                    }}
                  >
                    Ask me anything about Andy's experience, skills, or projects.
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: msg.role === 'user'
                          ? '12px 12px 4px 12px'
                          : '12px 12px 12px 4px',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        background: msg.role === 'user'
                          ? 'var(--accent-light)'
                          : 'var(--bg-dashboard)',
                        color: 'var(--text-primary)',
                        border: msg.role === 'user'
                          ? '1px solid var(--accent-border)'
                          : '1px solid var(--border-light)',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {getDisplayText(msg.content)}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isStreaming && messages.length > 0 && messages[messages.length - 1].content === '' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px 12px 12px 4px',
                        background: 'var(--bg-dashboard)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-tertiary)',
                        fontSize: '13px',
                      }}
                    >
                      <Loader2
                        size={14}
                        strokeWidth={2}
                        style={{
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              {geminiAvailable && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px',
                    flexShrink: 0,
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    rows={1}
                    disabled={isStreaming}
                    style={{
                      flex: 1,
                      resize: 'none',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      color: 'var(--text-primary)',
                      background: 'var(--surface)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      maxHeight: '80px',
                      overflowY: 'auto',
                      transition: 'border-color 150ms ease-out',
                      opacity: isStreaming ? 0.6 : 1,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-light)'
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isStreaming}
                    aria-label="Send message"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      background: inputValue.trim() && !isStreaming ? 'var(--accent)' : 'var(--border-light)',
                      color: inputValue.trim() && !isStreaming ? '#FFFFFF' : 'var(--text-tertiary)',
                      cursor: inputValue.trim() && !isStreaming ? 'pointer' : 'default',
                      flexShrink: 0,
                      transition: 'background-color 150ms ease-out, color 150ms ease-out',
                    }}
                  >
                    <Send size={16} strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating chat button */}
      <motion.button
        initial="hidden"
        animate="visible"
        variants={buttonVariants}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed z-[90] cursor-pointer bottom-4 right-4 h-10 w-10 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--accent)',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          transition: 'box-shadow 150ms ease-out, transform 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isOpen ? <X size={20} strokeWidth={2} /> : <MessageCircle size={20} strokeWidth={2} />}
      </motion.button>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
