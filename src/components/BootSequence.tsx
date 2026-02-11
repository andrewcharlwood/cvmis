import { useEffect, useState, useRef, useCallback } from 'react'
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

// =============================================================================
// Configuration
// =============================================================================

const BOOT_CONFIG: BootConfig = {
  header: 'CLINICAL TERMINAL v3.2.1',
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
    { type: 'ready', text: 'READY — Rendering CV..', style: 'bright' },
  ],
  timing: {
    lineDelay: 220,
    cursorBlinkInterval: 530,
    holdAfterComplete: 400,
    fadeOutDuration: 800,
  },
  colors: {
    bright: '#00ff41',
    dim: '#3a6b45',
    cyan: '#00e5ff',
  },
}

// =============================================================================
// Helper Functions
// =============================================================================

function getCumulativeDelay(lineIndex: number): number {
  return lineIndex * BOOT_CONFIG.timing.lineDelay
}

// =============================================================================
// Line Components
// =============================================================================

function BootLineHeader({ text }: { text: string }) {
  return (
    <div className="font-mono text-sm leading-relaxed">
      <span
        className="font-bold"
        style={{ color: BOOT_CONFIG.colors.bright }}
      >
        {text}
      </span>
    </div>
  )
}

function BootLineStatus({ line }: { line: BootLine }) {
  const color = line.style ? BOOT_CONFIG.colors[line.style] : BOOT_CONFIG.colors.dim
  return (
    <div className="font-mono text-sm leading-relaxed" style={{ color }}>
      {line.text}
    </div>
  )
}

function BootLineSeparator({ line }: { line: BootLine }) {
  const color = line.style ? BOOT_CONFIG.colors[line.style] : BOOT_CONFIG.colors.dim
  return (
    <div className="font-mono text-sm leading-relaxed" style={{ color }}>
      {line.text || '---'}
    </div>
  )
}

function BootLineField({ line }: { line: BootLine }) {
  const valueColor = line.style ? BOOT_CONFIG.colors[line.style] : BOOT_CONFIG.colors.bright
  return (
    <div className="font-mono text-sm leading-relaxed">
      <span style={{ color: BOOT_CONFIG.colors.cyan }}>
        {(line.label || '').padEnd(9)}
      </span>
      <span style={{ color: valueColor }}>{line.value}</span>
    </div>
  )
}

function BootLineModule({ line }: { line: BootLine }) {
  const textColor = line.style ? BOOT_CONFIG.colors[line.style] : BOOT_CONFIG.colors.dim
  return (
    <div className="font-mono text-sm leading-relaxed">
      <span className="font-bold" style={{ color: BOOT_CONFIG.colors.bright }}>
        [OK]
      </span>{' '}
      <span style={{ color: textColor }}>{line.text}</span>
    </div>
  )
}

function BootLineReady({ line }: { line: BootLine }) {
  const color = line.style ? BOOT_CONFIG.colors[line.style] : BOOT_CONFIG.colors.bright
  return (
    <div className="font-mono text-sm leading-relaxed">
      <span className="font-bold" style={{ color }}>
        &gt; {line.text}
        <span className="ecg-seed-dot">.</span>
      </span>
    </div>
  )
}

function BootLineRenderer({ line }: { line: BootLine }) {
  switch (line.type) {
    case 'header':
      return <BootLineHeader text={line.text || ''} />
    case 'status':
      return <BootLineStatus line={line} />
    case 'separator':
      return <BootLineSeparator line={line} />
    case 'field':
      return <BootLineField line={line} />
    case 'module':
      return <BootLineModule line={line} />
    case 'ready':
      return <BootLineReady line={line} />
    default:
      return null
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function BootSequence({ onComplete, onCursorPositionReady }: BootSequenceProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showCursor, setShowCursor] = useState(false)
  const [cursorCaptured, setCursorCaptured] = useState(false)
  const [isMorphing, setIsMorphing] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const reducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  // Calculate total boot time
  const totalBootTime = BOOT_CONFIG.lines.length * BOOT_CONFIG.timing.lineDelay
  const fadeStartTime = totalBootTime + BOOT_CONFIG.timing.holdAfterComplete

  // Capture cursor position when boot completes
  const captureCursorPosition = useCallback(() => {
    if (cursorRef.current && onCursorPositionReady && !cursorCaptured) {
      const rect = cursorRef.current.getBoundingClientRect()
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
      onCursorPositionReady(position)
      setCursorCaptured(true)
    }
  }, [onCursorPositionReady, cursorCaptured])

  // Handle completion sequence
  useEffect(() => {
    if (reducedMotion) {
      // Reduced motion: show everything instantly, then complete
      const timer = setTimeout(onComplete, 500)
      return () => clearTimeout(timer)
    }

    // Show cursor after all lines are rendered
    const cursorTimer = setTimeout(() => {
      setShowCursor(true)
    }, totalBootTime)

    // Capture cursor position and start morph
    const morphTimer = setTimeout(() => {
      captureCursorPosition()
      setIsMorphing(true)
    }, fadeStartTime - 100)

    // Fade out and complete
    const fadeTimer = setTimeout(() => {
      setIsVisible(false)
    }, fadeStartTime)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, fadeStartTime + BOOT_CONFIG.timing.fadeOutDuration)

    return () => {
      clearTimeout(cursorTimer)
      clearTimeout(morphTimer)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete, totalBootTime, fadeStartTime, captureCursorPosition, reducedMotion])

  // Reduced motion: instant render
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-center bg-black p-10 font-mono text-sm overflow-hidden">
        <div className="flex flex-col gap-1 max-w-[640px] transform -translate-y-1/2">
          <BootLineHeader text={BOOT_CONFIG.header} />
          {BOOT_CONFIG.lines.map((line, index) => (
            <BootLineRenderer key={index} line={line} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-center bg-black p-10 font-mono text-sm overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: BOOT_CONFIG.timing.fadeOutDuration / 1000, ease: 'easeOut' }}
        >
          {/* CRT Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
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

          {/* Content */}
          <div className="flex flex-col gap-1 max-w-[640px] transform -translate-y-1/2 relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <BootLineHeader text={BOOT_CONFIG.header} />
            </motion.div>

            {/* Lines */}
            {BOOT_CONFIG.lines.map((line, index) => (
              <motion.div
                key={index}
                className="whitespace-nowrap leading-relaxed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: getCumulativeDelay(index) / 1000,
                  duration: 0.4,
                  ease: 'easeOut',
                }}
              >
                <BootLineRenderer line={line} />
              </motion.div>
            ))}

            {/* Blinking Cursor */}
            {showCursor && (
              <motion.div
                ref={cursorRef}
                className="inline-block ml-1"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isMorphing ? 0 : 1,
                  scaleX: isMorphing ? 0 : 1,
                  width: isMorphing ? 0 : 8,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  height: 16,
                  backgroundColor: BOOT_CONFIG.colors.bright,
                  animation: isMorphing ? undefined : 'blink 530ms infinite',
                }}
              />
            )}
          </div>

          {/* CSS for blink animation */}
          <style>{`
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export type { BootConfig, BootLine, BootLineType }
export { BOOT_CONFIG }
