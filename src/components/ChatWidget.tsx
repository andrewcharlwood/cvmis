import { useState, useRef, useEffect, useCallback, useMemo, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import {
  sendChatMessage,
  isLLMAvailable,
  parseItemIds,
  stripItemsSuffix,
  LLM_DISPLAY_NAME,
  type ChatMessage,
} from '@/lib/llm'
import { buildPaletteData } from '@/lib/search'
import type { PaletteItem, PaletteAction } from '@/lib/search'
import { iconByType, iconColorStyles } from '@/lib/palette-icons'
import { prefersReducedMotion, motionSafeTransition } from '@/lib/utils'
import { useIsMobileNav } from '@/hooks/useIsMobileNav'

const MAX_HISTORY = 10

const SUGGESTED_QUESTIONS = [
  "What's his NHS experience?",
  'Tell me about his data skills',
  'What projects has he built?',
]

const buttonVariants = {
  hidden: prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionSafeTransition(0.3, 'easeOut', 1),
  },
}

const panelVariants = {
  hidden: prefersReducedMotion
    ? { opacity: 1, scale: 1 }
    : { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: motionSafeTransition(0.2),
  },
  exit: prefersReducedMotion
    ? { opacity: 1, scale: 1 }
    : { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
}

interface ChatWidgetProps {
  onAction?: (action: PaletteAction) => void
}

export function ChatWidget({ onAction }: ChatWidgetProps) {
  const isMobileNav = useIsMobileNav()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const llmAvailable = isLLMAvailable()

  // Nudge bubble: show once after 12s if user hasn't opened chat yet
  const [showNudge, setShowNudge] = useState(false)
  const hasInteracted = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted.current) setShowNudge(true)
    }, 5_000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showNudge) return
    const dismiss = () => {
      hasInteracted.current = true
      setShowNudge(false)
    }
    window.addEventListener('click', dismiss, { once: true })
    return () => window.removeEventListener('click', dismiss)
  }, [showNudge])

  // Build palette map for looking up items by ID
  const paletteMap = useMemo(() => {
    const items = buildPaletteData()
    const map = new Map<string, PaletteItem>()
    for (const item of items) map.set(item.id, item)
    return map
  }, [])

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

  const handleSubmit = useCallback(async (overrideText?: string) => {
    const trimmed = (overrideText ?? inputValue).trim()
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

  // Extract item IDs from the <!--ITEMS:...--> HTML comment in message content
  const getMessageItemIds = (content: string): string[] => {
    const match = content.match(/<!--ITEMS:([^>]*)-->/)
    if (!match) return []
    return match[1].split(',').map((id) => id.trim()).filter(Boolean)
  }

  // Resolve item IDs to PaletteItems
  const getMessageItems = (content: string): PaletteItem[] => {
    return getMessageItemIds(content)
      .map((id) => paletteMap.get(id))
      .filter((item): item is PaletteItem => item !== undefined)
  }

  // Handle clicking an item card — route through onAction
  const handleItemClick = useCallback((item: PaletteItem) => {
    if (onAction) {
      onAction(item.action)
    } else {
      if (item.action.type === 'link') {
        window.open(item.action.url, '_blank', 'noopener,noreferrer')
      }
    }
  }, [onAction])

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
            data-chat-panel
            className="fixed z-[90] font-ui
              inset-0 rounded-none max-md:z-[101]
              md:inset-auto md:bottom-[88px] md:right-6 md:rounded-xl lg:bottom-[100px] xl:bottom-[112px]"
            style={{
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
              @media (min-width: 768px) {
                [data-chat-panel] { width: clamp(380px, 30vw, 500px); height: calc(66vh); }
              }
              @media (max-width: 767px) {
                [data-chat-panel] {
                  height: 100dvh;
                  max-height: 100dvh;
                  padding-top: env(safe-area-inset-top, 0px);
                  padding-bottom: env(safe-area-inset-bottom, 0px);
                  padding-left: env(safe-area-inset-left, 0px);
                  padding-right: env(safe-area-inset-right, 0px);
                }
              }
            `}</style>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                minHeight: 0,
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
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Ask about Andy
                  </span>
                  <span
                    className="font-geist"
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {LLM_DISPLAY_NAME}
                  </span>
                </div>
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
                {!llmAvailable && (
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

                {llmAvailable && messages.length === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Welcome bubble — styled as assistant message */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div
                        style={{
                          maxWidth: '85%',
                          padding: '10px 14px',
                          borderRadius: '12px 12px 12px 4px',
                          fontSize: '13px',
                          lineHeight: 1.5,
                          background: 'var(--bg-dashboard)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-light)',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        Hey! I'm here to help you learn more about Andy. What would you like to know?
                      </div>
                    </div>

                    {/* Suggested question chips */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        paddingLeft: '4px',
                      }}
                    >
                      {SUGGESTED_QUESTIONS.map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSubmit(question)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            border: '1px solid var(--accent-border)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            fontSize: '12.5px',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            transition: 'background-color 150ms ease-out, color 150ms ease-out',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--accent-light)'
                            e.currentTarget.style.color = 'var(--accent)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'var(--text-secondary)'
                          }}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => {
                  const referencedItems = msg.role === 'assistant' ? getMessageItems(msg.content) : []

                  return (
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
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ padding: '10px 14px', whiteSpace: msg.role === 'user' ? 'pre-wrap' : undefined }}>
                          {msg.role === 'assistant' ? (
                            <div className="chat-markdown">
                              <ReactMarkdown>{getDisplayText(msg.content)}</ReactMarkdown>
                            </div>
                          ) : (
                            getDisplayText(msg.content)
                          )}
                        </div>

                        {referencedItems.length > 0 && (() => {
                          const isExpanded = expandedItems.has(i)
                          const visibleItems = isExpanded ? referencedItems : referencedItems.slice(0, 3)
                          const hasMore = referencedItems.length > 3

                          return (
                            <div
                              style={{
                                borderTop: '1px solid var(--border-light)',
                                padding: '6px 8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                              }}
                            >
                              {visibleItems.map((item) => {
                                const IconComponent = iconByType[item.iconType]
                                const colorStyle = iconColorStyles[item.iconVariant]

                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      padding: '6px 8px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: 'transparent',
                                      cursor: 'pointer',
                                      width: '100%',
                                      textAlign: 'left',
                                      transition: 'background-color 100ms ease-out',
                                      fontSize: '12px',
                                      fontFamily: 'inherit',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = 'var(--accent-light)'
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        background: colorStyle.background,
                                        color: colorStyle.color,
                                      }}
                                    >
                                      {IconComponent && <IconComponent size={12} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div
                                        style={{
                                          fontWeight: 500,
                                          color: 'var(--text-primary)',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                        }}
                                      >
                                        {item.title}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '11px',
                                          color: 'var(--text-tertiary)',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          marginTop: '-1px',
                                        }}
                                      >
                                        {item.subtitle}
                                      </div>
                                    </div>
                                  </button>
                                )
                              })}
                              {hasMore && !isExpanded && (
                                <button
                                  onClick={() => setExpandedItems((prev) => new Set(prev).add(i))}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '11.5px',
                                    fontFamily: 'inherit',
                                    color: 'var(--accent)',
                                    textAlign: 'left',
                                    transition: 'background-color 100ms ease-out',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--accent-light)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                  }}
                                >
                                  See {referencedItems.length - 3} more related items
                                </button>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  )
                })}

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
              {llmAvailable && (
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
                    onClick={() => handleSubmit()}
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

      {/* Floating chat button — hidden on mobile when panel is open */}
      <motion.button
        initial="hidden"
        animate="visible"
        variants={buttonVariants}
        onClick={() => {
          hasInteracted.current = true
          setShowNudge(false)
          setIsOpen((prev) => !prev)
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className={`fixed z-[101] cursor-pointer flex items-center justify-center bottom-4 right-4 h-12 w-12 md:bottom-6 md:right-6 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-[4.5rem] xl:w-[4.5rem]${isOpen ? ' max-md:!hidden' : ''}`}
        style={{
          bottom: isMobileNav ? 'calc(56px + env(safe-area-inset-bottom) + 16px)' : undefined,
          borderRadius: '50%',
          border: 'none',
          background: 'var(--accent)',
          opacity: 0.85,
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          animation: prefersReducedMotion ? 'none' : 'chat-pulse 3s ease-in-out infinite',
          transition: 'box-shadow 150ms ease-out, transform 150ms ease-out, opacity 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.animation = 'none'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.opacity = '0.85'
          e.currentTarget.style.animation = prefersReducedMotion ? 'none' : 'chat-pulse 3s ease-in-out infinite'
        }}
      >
        {isOpen ? (
          <>
            <X size={22} strokeWidth={2} className="lg:hidden" />
            <X size={26} strokeWidth={2} className="hidden lg:block xl:hidden" />
            <X size={30} strokeWidth={2} className="hidden xl:block" />
          </>
        ) : (
          <>
            <MessageCircle size={22} strokeWidth={2} className="lg:hidden" />
            <MessageCircle size={26} strokeWidth={2} className="hidden lg:block xl:hidden" />
            <MessageCircle size={30} strokeWidth={2} className="hidden xl:block" />
          </>
        )}
      </motion.button>

      {/* Nudge bubble */}
      <AnimatePresence>
        {showNudge && !isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: motionSafeTransition(0.25, 'easeOut') }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            className="fixed z-[101] right-4 md:right-6 pointer-events-none"
            style={{
              /* Position above button: button-bottom + button-height + gap */
              bottom: isMobileNav
                ? 'calc(56px + env(safe-area-inset-bottom) + 72px)'
                : undefined,
            }}
          >
            {/* Mobile: above 48px button at bottom-4 */}
            <div
              className="md:hidden px-3 py-2 rounded-xl text-xs font-medium max-w-[200px]"
              style={{
                position: 'fixed',
                bottom: isMobileNav ? undefined : 'calc(16px + 48px + 10px)',
                right: '16px',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              Hey! I can help you learn more about Andy.
            </div>
            {/* md: above 56px button at bottom-6 */}
            <div
              className="hidden md:block lg:hidden px-3.5 py-2.5 rounded-xl text-sm font-medium max-w-[240px]"
              style={{
                position: 'fixed',
                bottom: 'calc(24px + 56px + 10px)',
                right: '24px',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              Hey! I can help you learn more about Andy.
            </div>
            {/* lg: above 64px button */}
            <div
              className="hidden lg:block xl:hidden px-4 py-3 rounded-xl text-base font-medium max-w-[280px]"
              style={{
                position: 'fixed',
                bottom: 'calc(24px + 64px + 12px)',
                right: '24px',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              Hey! I can help you learn more about Andy.
            </div>
            {/* xl: above 72px button */}
            <div
              className="hidden xl:block px-5 py-3 rounded-2xl text-base font-medium max-w-[300px]"
              style={{
                position: 'fixed',
                bottom: 'calc(24px + 72px + 14px)',
                right: '24px',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              Hey! I can help you learn more about Andy.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes chat-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.06); opacity: 0.85; }
        }
      `}</style>
    </>
  )
}
