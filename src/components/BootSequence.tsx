import { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// =============================================================================
// Types
// =============================================================================

type BootLineType = 'header' | 'status' | 'separator' | 'field' | 'module' | 'ready'

type BootLineStyle = 'bright' | 'dim' | 'cyan'

interface BootLine {
  type: BootLineType
  text?: string
  label?: string
  value?: string
  style?: BootLineStyle
}

interface BootConfig {
  header: string
  lines: BootLine[]
  timing: {
    lineDelay: number
    cursorBlinkInterval: number
    holdAfterComplete: number
    fadeOutDuration: number
    cursorShrinkDuration: number
    ecgStartDelay: number
  }
  colors: {
    bright: string
    dim: string
    cyan: string
  }
}

interface BootSequenceProps {
  onComplete: () => void
  onCursorPositionReady?: (position: { x: number; y: number }) => void
}

interface TypedSegment {
  text: string
  color: string
  bold?: boolean
  isSeedDot?: boolean
}

interface TypedLine {
  segments: TypedSegment[]
  totalChars: number
  pauseAfter: number  // ms to pause after this line completes
  speed: number       // ms per character (0 = instant)
}

// =============================================================================
// Configuration
// =============================================================================

// Global speed multiplier for typing animation.
// 1.0 = default (~3.3s typing). Lower = faster, higher = slower.
const TYPING_SPEED = 2

const COLORS = {
  bright: '#00ff41',
  dim: '#3a6b45',
  cyan: '#00e5ff',
}

const BOOT_CONFIG: BootConfig = {
  header: 'CV Management Information System v1.0.0',
  lines: [
    { type: 'status', text: 'Initialising pharmacist profile...', style: 'dim' },
    { type: 'separator', text: '---', style: 'dim' },
    { type: 'field', label: 'SYSTEM', value: 'NHS Norfolk & Waveney ICB', style: 'cyan' },
    { type: 'field', label: 'USER', value: 'Andy Charlwood', style: 'bright' },
    { type: 'field', label: 'ROLE', value: 'Deputy Head of Population Health & Data Analysis', style: 'bright' },
    { type: 'field', label: 'LOCATION', value: 'Norwich, UK', style: 'bright' },
    { type: 'separator', text: '---', style: 'dim' },
    { type: 'status', text: 'Loading modules...', style: 'dim' },
    { type: 'module', text: 'pharmacist_core.sys', style: 'dim' },
    { type: 'module', text: 'population_health.mod', style: 'dim' },
    { type: 'module', text: 'data_analytics.eng', style: 'dim' },
    { type: 'separator', text: '---', style: 'dim' },
    { type: 'ready', text: 'READY \u2014 Rendering CV..', style: 'bright' },
  ],
  timing: {
    lineDelay: 220,
    cursorBlinkInterval: 300,
    holdAfterComplete: 1000,
    fadeOutDuration: 600,
    cursorShrinkDuration: 600,
    ecgStartDelay: 0,
  },
  colors: COLORS,
}

// Apply speed multiplier — instant lines (speed=0) stay instant
function s(ms: number): number {
  return Math.round(ms * TYPING_SPEED)
}

// Build typed lines from BOOT_CONFIG
function buildTypedLines(): TypedLine[] {
  const lines: TypedLine[] = []

  // Header
  const headerText = BOOT_CONFIG.header
  lines.push({
    segments: [{ text: headerText, color: COLORS.bright, bold: true }],
    totalChars: headerText.length,
    pauseAfter: s(40),
    speed: s(18),
  })

  for (const line of BOOT_CONFIG.lines) {
    switch (line.type) {
      case 'status': {
        const text = line.text || ''
        lines.push({
          segments: [{ text, color: COLORS.dim }],
          totalChars: text.length,
          pauseAfter: s(40),
          speed: s(14),
        })
        break
      }
      case 'separator': {
        const text = line.text || '---'
        lines.push({
          segments: [{ text, color: COLORS.dim }],
          totalChars: text.length,
          pauseAfter: s(50),
          speed: 0, // instant
        })
        break
      }
      case 'field': {
        const label = (line.label || '').padEnd(9)
        const value = line.value || ''
        const valueColor = line.style === 'cyan' ? COLORS.cyan : COLORS.bright
        lines.push({
          segments: [
            { text: label, color: COLORS.cyan },
            { text: value, color: valueColor },
          ],
          totalChars: label.length + value.length,
          pauseAfter: s(30),
          speed: s(10),
        })
        break
      }
      case 'module': {
        const prefix = '[OK] '
        const name = line.text || ''
        lines.push({
          segments: [
            { text: '[OK]', color: COLORS.bright, bold: true },
            { text: ' ', color: COLORS.dim },
            { text: name, color: COLORS.dim },
          ],
          totalChars: prefix.length + name.length,
          pauseAfter: s(50),
          speed: 0, // instant — stdout output
        })
        break
      }
      case 'ready': {
        const prefix = '> '
        const body = line.text || ''
        const seedDot = '.'
        lines.push({
          segments: [
            { text: prefix + body, color: COLORS.bright, bold: true },
            { text: seedDot, color: COLORS.bright, bold: true, isSeedDot: true },
          ],
          totalChars: prefix.length + body.length + seedDot.length,
          pauseAfter: 0,
          speed: s(16),
        })
        break
      }
    }
  }

  return lines
}

const TYPED_LINES = buildTypedLines()
const TOTAL_CHARS = TYPED_LINES.reduce((sum, l) => sum + l.totalChars, 0)

// =============================================================================
// Main Component
// =============================================================================

export function BootSequence({ onComplete, onCursorPositionReady }: BootSequenceProps) {
  const [typedCount, setTypedCount] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'fading' | 'done'>('typing')
  const [isVisible, setIsVisible] = useState(true)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const cursorAnchorRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorCapturedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [cursorPos, setCursorPos] = useState<{ left: number; top: number } | null>(null)

  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // Capture cursor position for ECG handoff
  const captureCursorPosition = useCallback(() => {
    if (cursorRef.current && onCursorPositionReady && !cursorCapturedRef.current) {
      const rect = cursorRef.current.getBoundingClientRect()
      onCursorPositionReady({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
      cursorCapturedRef.current = true
    }
  }, [onCursorPositionReady])

  // Typing engine — runs as a self-scheduling setTimeout chain
  useEffect(() => {
    if (reducedMotion || phase !== 'typing') return

    // All characters typed
    if (typedCount >= TOTAL_CHARS) {
      setPhase('holding')
      return
    }

    // Find which line the cursor is on and position within it
    let lineStart = 0
    let lineIdx = 0
    for (let i = 0; i < TYPED_LINES.length; i++) {
      if (lineStart + TYPED_LINES[i].totalChars > typedCount) {
        lineIdx = i
        break
      }
      lineStart += TYPED_LINES[i].totalChars
    }

    const line = TYPED_LINES[lineIdx]
    const posInLine = typedCount - lineStart

    if (posInLine === 0 && line.speed === 0) {
      // Instant line: show all chars at once after a brief pause
      timeoutRef.current = setTimeout(() => {
        setTypedCount(lineStart + line.totalChars)
      }, line.pauseAfter || 10)
    } else if (posInLine === 0 && lineIdx > 0) {
      // Start of a new typed line — apply previous line's pauseAfter
      timeoutRef.current = setTimeout(() => {
        setTypedCount(prev => prev + 1)
      }, TYPED_LINES[lineIdx - 1].pauseAfter)
    } else {
      // Type one character at the line's speed
      timeoutRef.current = setTimeout(() => {
        setTypedCount(prev => prev + 1)
      }, line.speed)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [typedCount, phase, reducedMotion])

  // Hold phase: capture cursor, then start fading
  useEffect(() => {
    if (phase !== 'holding') return

    captureCursorPosition()

    const fadeTimer = setTimeout(() => {
      setPhase('fading')
    }, BOOT_CONFIG.timing.holdAfterComplete)

    return () => clearTimeout(fadeTimer)
  }, [phase, captureCursorPosition])

  // Fade phase: wait for animations to finish, then complete
  useEffect(() => {
    if (phase !== 'fading') return

    const longestFade = Math.max(
      BOOT_CONFIG.timing.fadeOutDuration,
      BOOT_CONFIG.timing.cursorShrinkDuration
    )

    const completeTimer = setTimeout(() => {
      setIsVisible(false)
      setPhase('done')
      onComplete()
    }, longestFade + BOOT_CONFIG.timing.ecgStartDelay)

    return () => clearTimeout(completeTimer)
  }, [phase, onComplete])

  // Reduced motion: skip animation
  useEffect(() => {
    if (!reducedMotion) return
    const timer = setTimeout(onComplete, 500)
    return () => clearTimeout(timer)
  }, [reducedMotion, onComplete])

  // Track cursor anchor position relative to the content container
  useLayoutEffect(() => {
    if (!cursorAnchorRef.current || !containerRef.current || phase === 'done') return
    const anchor = cursorAnchorRef.current.getBoundingClientRect()
    const container = containerRef.current.getBoundingClientRect()
    setCursorPos({
      left: anchor.left - container.left,
      top: anchor.top - container.top,
    })
  }, [typedCount, phase])

  // Render the typed lines up to typedCount
  const renderLines = () => {
    let remaining = typedCount
    const renderedLines: React.ReactNode[] = []
    let cursorPlaced = false

    for (let lineIdx = 0; lineIdx < TYPED_LINES.length; lineIdx++) {
      const line = TYPED_LINES[lineIdx]

      // During typing, render this line if we've started typing into it (or it's the first line with cursor)
      if (phase === 'typing' && remaining <= 0 && lineIdx > 0) break

      const charsForLine = Math.min(Math.max(0, remaining), line.totalChars)
      remaining -= charsForLine

      // Cursor goes on the line currently being typed, or the last line in non-typing phases
      const isCursorLine = phase === 'typing'
        ? !cursorPlaced && (charsForLine < line.totalChars || remaining <= 0)
        : lineIdx === TYPED_LINES.length - 1

      // Render segments
      let charBudget = phase === 'typing' ? charsForLine : line.totalChars
      const spans: React.ReactNode[] = []

      for (let segIdx = 0; segIdx < line.segments.length; segIdx++) {
        const seg = line.segments[segIdx]
        if (charBudget <= 0 && phase === 'typing') break

        const visibleChars = phase === 'typing'
          ? Math.min(charBudget, seg.text.length)
          : seg.text.length
        const visibleText = seg.text.slice(0, visibleChars)
        charBudget -= visibleChars

        if (seg.isSeedDot && visibleChars > 0) {
          spans.push(
            <span
              key={segIdx}
              className={phase === 'holding' ? 'ecg-seed-dot animate-seed-pulse' : 'ecg-seed-dot'}
              style={{ color: seg.color, fontWeight: seg.bold ? 700 : 400 }}
            >
              {visibleText}
            </span>
          )
        } else if (visibleChars > 0) {
          spans.push(
            <span
              key={segIdx}
              style={{ color: seg.color, fontWeight: seg.bold ? 700 : 400 }}
            >
              {visibleText}
            </span>
          )
        }
      }

      // Invisible placeholder to mark cursor position (actual cursor rendered outside fading wrapper)
      if (isCursorLine && phase !== 'done') {
        cursorPlaced = true
        spans.push(
          <span
            key="cursor-anchor"
            ref={cursorAnchorRef}
            className="inline-block align-middle"
            style={{ width: 8, height: 16, marginLeft: 1 }}
          />
        )
      }

      renderedLines.push(
        <div key={lineIdx} className="font-mono text-sm leading-relaxed whitespace-nowrap">
          {spans}
        </div>
      )
    }

    return renderedLines
  }

  // Reduced motion: instant render
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-center bg-black px-5 py-8 sm:p-10 font-mono text-sm overflow-hidden">
        <div className="flex flex-col gap-1 max-w-[640px] transform -translate-y-1/2">
          {(() => {
            // Render all lines fully
            const lines: React.ReactNode[] = []
            for (let lineIdx = 0; lineIdx < TYPED_LINES.length; lineIdx++) {
              const line = TYPED_LINES[lineIdx]
              const spans: React.ReactNode[] = []
              for (let segIdx = 0; segIdx < line.segments.length; segIdx++) {
                const seg = line.segments[segIdx]
                spans.push(
                  <span
                    key={segIdx}
                    className={seg.isSeedDot ? 'ecg-seed-dot' : undefined}
                    style={{ color: seg.color, fontWeight: seg.bold ? 700 : 400 }}
                  >
                    {seg.text}
                  </span>
                )
              }
              lines.push(
                <div key={lineIdx} className="font-mono text-sm leading-relaxed whitespace-nowrap">
                  {spans}
                </div>
              )
            }
            return lines
          })()}
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-center bg-black px-5 py-8 sm:p-10 font-mono text-sm overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0 }}
        >
          {/* CRT Scanlines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: phase === 'fading' || phase === 'done' ? 0 : 1 }}
            transition={{ duration: BOOT_CONFIG.timing.fadeOutDuration / 1000, ease: 'easeOut' }}
            style={{
              background: `repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15) 0px,
                transparent 1px,
                transparent 2px,
                rgba(0, 0, 0, 0.15) 3px
              )`,
            }}
          />

          {/* Content container */}
          <div ref={containerRef} className="flex flex-col gap-1 max-w-[640px] transform -translate-y-1/2 relative z-10">
            {/* Text fades out independently */}
            <motion.div
              animate={{ opacity: phase === 'fading' || phase === 'done' ? 0 : 1 }}
              transition={{ duration: BOOT_CONFIG.timing.fadeOutDuration / 1000, ease: 'easeOut' }}
            >
              {renderLines()}
            </motion.div>

            {/* Cursor rendered outside fading wrapper — shrinks independently */}
            {cursorPos && phase !== 'done' && (
              <span
                ref={cursorRef}
                className="absolute animate-blink"
                style={{
                  left: cursorPos.left,
                  top: cursorPos.top + (phase === 'fading' ? 12 : 0),
                  width: 8,
                  height: phase === 'fading' ? 4 : 16,
                  backgroundColor: COLORS.bright,
                  filter: phase === 'fading' ? 'blur(1px)' : 'none',
                  boxShadow: phase === 'fading' ? '0 0 12px rgba(0,255,65,0.9)' : 'none',
                  transition: phase === 'fading'
                    ? `top ${BOOT_CONFIG.timing.cursorShrinkDuration}ms ease-out, height ${BOOT_CONFIG.timing.cursorShrinkDuration}ms ease-out, filter ${BOOT_CONFIG.timing.cursorShrinkDuration}ms ease-out, box-shadow ${BOOT_CONFIG.timing.cursorShrinkDuration}ms ease-out`
                    : 'none',
                  animationDuration: `${BOOT_CONFIG.timing.cursorBlinkInterval}ms`,
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export type { BootConfig, BootLine, BootLineType }
export { BOOT_CONFIG }
