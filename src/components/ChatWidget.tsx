import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

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

const PLACEHOLDER_RESPONSE = 'AI chat coming soon — this is a preview of the chat interface.'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

  const handleSubmit = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: PLACEHOLDER_RESPONSE },
    ])
    setInputValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
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
            {/* Use inline style for sm-width via CSS class override */}
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
                {messages.length === 0 && (
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
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
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
                  disabled={!inputValue.trim()}
                  aria-label="Send message"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    background: inputValue.trim() ? 'var(--accent)' : 'var(--border-light)',
                    color: inputValue.trim() ? '#FFFFFF' : 'var(--text-tertiary)',
                    cursor: inputValue.trim() ? 'pointer' : 'default',
                    flexShrink: 0,
                    transition: 'background-color 150ms ease-out, color 150ms ease-out',
                  }}
                >
                  <Send size={16} strokeWidth={2} />
                </button>
              </div>
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
    </>
  )
}
