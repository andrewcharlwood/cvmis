import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  Search,
  User,
  Activity,
  Monitor,
  Award,
  GraduationCap,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  buildPaletteData,
  buildSearchIndex,
  groupBySection,
} from '@/lib/search'
import type { PaletteItem, PaletteAction, IconColorVariant } from '@/lib/search'
import { isModelReady, embedQuery } from '@/lib/embedding-model'
import { semanticSearch, loadEmbeddings } from '@/lib/semantic-search'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onAction?: (action: PaletteAction) => void
}

// Icon mapping by type
const iconByType: Record<string, LucideIcon> = {
  role: User,
  skill: Activity,
  project: Monitor,
  achievement: Award,
  edu: GraduationCap,
  action: Zap,
}

// Color variant → CSS variable mapping for icon containers
const iconColorStyles: Record<IconColorVariant, { background: string; color: string }> = {
  teal: { background: 'var(--accent-light)', color: 'var(--accent)' },
  green: { background: 'var(--success-light)', color: 'var(--success)' },
  amber: { background: 'var(--amber-light)', color: 'var(--amber)' },
  purple: { background: 'rgba(124,58,237,0.08)', color: '#7C3AED' },
}

export function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Build data and search index once
  const paletteData = useMemo(() => buildPaletteData(), [])
  const searchIndex = useMemo(() => buildSearchIndex(paletteData), [paletteData])

  // Preload embeddings and build lookup map
  const embeddings = useMemo(() => loadEmbeddings(), [])
  const paletteMap = useMemo(() => {
    const map = new Map<string, PaletteItem>()
    for (const item of paletteData) map.set(item.id, item)
    return map
  }, [paletteData])

  // Semantic search results (async, debounced)
  const [semanticResults, setSemanticResults] = useState<PaletteItem[] | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const trimmed = query.trim()

    // Clear semantic results when query is empty
    if (!trimmed) {
      setSemanticResults(null)
      return
    }

    // Only use semantic search when model is ready
    if (!isModelReady()) {
      setSemanticResults(null)
      return
    }

    // Debounce ~200ms
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const queryVec = await embedQuery(trimmed)
        const results = semanticSearch(queryVec, embeddings)
        const items = results
          .map(r => paletteMap.get(r.id))
          .filter((item): item is PaletteItem => item !== undefined)
        setSemanticResults(items)
      } catch {
        // Fall back to Fuse.js on any error
        setSemanticResults(null)
      }
    }, 200)

    return () => clearTimeout(debounceRef.current)
  }, [query, embeddings, paletteMap])

  // Compute visible items: semantic search when available, Fuse.js fallback
  const visibleItems = useMemo(() => {
    if (!query.trim()) {
      return paletteData
    }
    if (semanticResults !== null) {
      return semanticResults
    }
    return searchIndex.search(query).map(result => result.item)
  }, [query, paletteData, searchIndex, semanticResults])

  // Group visible items by section
  const groupedResults = useMemo(() => groupBySection(visibleItems), [visibleItems])

  // Flat list for keyboard navigation
  const flatItems = useMemo(() => {
    const flat: PaletteItem[] = []
    for (const group of groupedResults) {
      for (const item of group.items) {
        flat.push(item)
      }
    }
    return flat
  }, [groupedResults])

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(-1)
      setSemanticResults(null)
      // Focus input on next frame
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isOpen])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  // Global Ctrl+K listener
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          // Parent controls isOpen, so we need onAction or an onOpen callback
          // For now, the parent will handle Ctrl+K via its own listener
        }
      }
    }
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isOpen])

  // Execute action for a palette item
  const executeAction = useCallback((item: PaletteItem) => {
    onClose()
    if (onAction) {
      onAction(item.action)
    } else {
      // Fallback: handle link and download actions directly
      const { action } = item
      if (action.type === 'link') {
        window.open(action.url, '_blank', 'noopener,noreferrer')
      }
    }
  }, [onClose, onAction])

  // Keyboard navigation within the palette
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        setSelectedIndex(prev => {
          const next = prev + 1
          return next >= flatItems.length ? 0 : next
        })
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        setSelectedIndex(prev => {
          const next = prev - 1
          return next < 0 ? flatItems.length - 1 : next
        })
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
          executeAction(flatItems[selectedIndex])
        }
        break
      }
      case 'Escape': {
        e.preventDefault()
        onClose()
        break
      }
    }
  }, [flatItems, selectedIndex, executeAction, onClose])

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedIndex < 0 || !resultsRef.current) return
    const selectedEl = resultsRef.current.querySelector(`[data-palette-index="${selectedIndex}"]`)
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  // Click on overlay (outside modal) to close
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }, [onClose])

  if (!isOpen) return null

  // Track flat index across groups
  let flatIndex = 0

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,43,42,0.45)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '8px',
        paddingTop: 'max(8px, 10vh)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: prefersReducedMotion ? 'none' : 'palette-overlay-in 0.2s ease-out forwards',
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Palette modal */}
      <div
        className="w-full max-w-[calc(100vw-16px)] md:max-w-[calc(100vw-32px)] md:w-[580px]"
        style={{
          maxHeight: 'calc(100vh - 24vh)',
          background: 'var(--surface)',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(26,43,42,0.2), 0 0 0 1px rgba(26,43,42,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: prefersReducedMotion ? 'none' : 'palette-modal-in 0.2s cubic-bezier(0.4,0,0.2,1) forwards',
        }}
      >
        {/* Search input row */}
        <div
          className="px-3 py-3 md:px-[18px] md:py-[14px]"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <Search
            size={18}
            style={{ color: 'var(--accent)', flexShrink: 0 }}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search records, experience, skills..."
            autoComplete="off"
            className="font-ui"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '15px',
              color: 'var(--text-primary)',
            }}
            aria-label="Search"
            aria-activedescendant={
              selectedIndex >= 0 ? `palette-item-${flatItems[selectedIndex]?.id}` : undefined
            }
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-autocomplete="list"
          />
          <kbd
            className="font-geist"
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              background: 'var(--bg-dashboard)',
              border: '1px solid var(--border)',
              padding: '2px 7px',
              borderRadius: '4px',
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div
          id="palette-results"
          ref={resultsRef}
          role="listbox"
          aria-label="Search results"
          className="pmr-scrollbar p-2 md:p-[8px]"
          style={{
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {flatItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 16px',
                color: 'var(--text-tertiary)',
                fontSize: '13px',
              }}
            >
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            groupedResults.map((group) => {
              const sectionItems = group.items.map((item) => {
                const currentIndex = flatIndex
                flatIndex++
                const isSelected = currentIndex === selectedIndex
                const IconComponent = iconByType[item.iconType]
                const colorStyle = iconColorStyles[item.iconVariant]

                return (
                  <div
                    key={item.id}
                    id={`palette-item-${item.id}`}
                    role="option"
                    aria-selected={isSelected}
                    data-palette-index={currentIndex}
                    onClick={() => executeAction(item)}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 10px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      background: isSelected ? 'var(--accent-light)' : 'transparent',
                      outline: isSelected ? '1.5px solid var(--accent-border)' : 'none',
                    }}
                  >
                    {/* Icon container */}
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: colorStyle.background,
                        color: colorStyle.color,
                      }}
                    >
                      {IconComponent && <IconComponent size={14} />}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500 }}>{item.title}</div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          marginTop: '1px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                )
              })

              return (
                <div key={group.section}>
                  {/* Section label */}
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-tertiary)',
                      padding: '8px 10px 5px',
                    }}
                  >
                    {group.section}
                  </div>
                  {sectionItems}
                </div>
              )
            })
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div
          className="hidden md:flex px-3 py-2 md:px-[18px] md:py-[10px]"
          style={{
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px solid var(--border-light)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
          }}
        >
          <span>
            <Kbd>\u2191</Kbd> <Kbd>\u2193</Kbd> Navigate
          </span>
          <span>
            <Kbd>Enter</Kbd> Select
          </span>
          <span>
            <Kbd>Esc</Kbd> Close
          </span>
        </div>
      </div>
    </div>
  )
}

// Small kbd element for the footer
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="font-geist"
      style={{
        fontSize: '10px',
        background: 'var(--bg-dashboard)',
        border: '1px solid var(--border)',
        padding: '1px 5px',
        borderRadius: '3px',
        color: 'var(--text-secondary)',
      }}
    >
      {children}
    </kbd>
  )
}
