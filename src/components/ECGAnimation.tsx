import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// =============================================================================
// Types
// =============================================================================

interface ECGAnimationProps {
  onComplete: () => void
  startPosition?: { x: number; y: number } | null
}

interface Point {
  x: number
  y: number
}

interface Beat {
  startTime: number
  widthPx: number
  amplitude: number
  startWX: number
}

interface LetterLayout {
  char: string
  startX: number
  endX: number
  startConnector: number
  endConnector: number
}

interface ConnectorProfile {
  leftInset: number
  rightInset: number
}

// =============================================================================
// Constants
// =============================================================================

const TRACE_SPEED = 350 // pixels per second
const HEAD_SCREEN_RATIO = 0.75 // Head stays at 75% of screen during ECG
const FLAT_GAP_SECONDS = 0.5 // Gap after last beat before text
const HOLD_SECONDS = 0.3 // Hold after text completes
const FLATLINE_DRAW_SECONDS = 0.3 // Time to draw flatline
const FADE_TO_BLACK_SECONDS = 0.2 // Canvas fade out
const BG_TRANSITION_SECONDS = 0.2 // Background color transition

const CONNECTOR_PROFILES: Record<string, ConnectorProfile> = {
  C: { leftInset: 20, rightInset: 8 },
  O: { leftInset: 17, rightInset: 7 },
  D: { leftInset: 0, rightInset: 13 },
  L: { leftInset: 5, rightInset: 0 },
  E: { leftInset: 5, rightInset: 0 },
}

const DEFAULT_PROFILE: ConnectorProfile = { leftInset: 0, rightInset: 0 }

const BASE_LEFT_INSET = 9
const BASE_RIGHT_INSET = 0

// =============================================================================
// Letter Definitions (ECG waveform shapes for each letter)
// =============================================================================

const ECG_LETTERS: Record<string, Point[]> = {
  A: [
    { x: 0, y: 0 }, { x: 0.48, y: 1 }, { x: 0.53, y: 0.42 },
    { x: 0.6, y: 0.42 }, { x: 1, y: 0 },
  ],
  N: [
    { x: 0, y: 0 }, { x: 0.12, y: 1 }, { x: 0.72, y: 0 },
    { x: 0.88, y: 1 }, { x: 1, y: 0 },
  ],
  D: [
    { x: 0, y: 0 }, { x: 0.1, y: 1 }, { x: 0.5, y: 1 },
    { x: 0.85, y: 0.55 }, { x: 1, y: 0 },
  ],
  R: [
    { x: 0, y: 0 }, { x: 0.1, y: 1 }, { x: 0.35, y: 1 },
    { x: 0.5, y: 0.6 }, { x: 0.55, y: 0.45 }, { x: 1, y: 0 },
  ],
  E: [
    { x: 0, y: 0 }, { x: 0.1, y: 1 }, { x: 0.4, y: 1 },
    { x: 0.45, y: 0.5 }, { x: 0.65, y: 0.5 }, { x: 0.7, y: 0 },
    { x: 1, y: 0 },
  ],
  W: [
    { x: 0, y: 0 }, { x: 0.05, y: 1 }, { x: 0.27, y: 0 },
    { x: 0.5, y: 0.65 }, { x: 0.73, y: 0 }, { x: 0.95, y: 1 },
    { x: 1, y: 0 },
  ],
  C: [
    { x: 0, y: 0 }, { x: 0.08, y: 0.6 }, { x: 0.18, y: 1 },
    { x: 0.6, y: 1 }, { x: 0.8, y: 0.5 }, { x: 0.95, y: 0.1 },
    { x: 1, y: 0 },
  ],
  H: [
    { x: 0, y: 0 }, { x: 0.1, y: 1 }, { x: 0.18, y: 0.5 },
    { x: 0.82, y: 0.5 }, { x: 0.9, y: 1 }, { x: 1, y: 0 },
  ],
  L: [
    { x: 0, y: 0 }, { x: 0.12, y: 1 }, { x: 0.3, y: 1 },
    { x: 0.38, y: 0 }, { x: 1, y: 0 },
  ],
  O: [
    { x: 0, y: 0 }, { x: 0.2, y: 0.85 }, { x: 0.35, y: 1 },
    { x: 0.65, y: 1 }, { x: 0.8, y: 0.85 }, { x: 1, y: 0 },
  ],
}

const ECG_TEXT = 'ANDREW CHARLWOOD'

// =============================================================================
// Helper Functions
// =============================================================================

function generateHeartbeatPoints(amplitude: number): Point[] {
  const points: Point[] = []
  const steps = 200
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    let y = 0
    if (t >= 0.05 && t < 0.2) {
      y = 0.12 * Math.sin(((t - 0.05) / 0.15) * Math.PI)
    } else if (t >= 0.25 && t < 0.32) {
      y = -0.1 * Math.sin(((t - 0.25) / 0.07) * Math.PI)
    } else if (t >= 0.32 && t < 0.42) {
      y = 1.0 * Math.sin(((t - 0.32) / 0.1) * Math.PI)
    } else if (t >= 0.42 && t < 0.5) {
      y = -0.25 * Math.sin(((t - 0.42) / 0.08) * Math.PI)
    } else if (t >= 0.55 && t < 0.75) {
      y = 0.2 * Math.sin(((t - 0.55) / 0.2) * Math.PI)
    }
    points.push({ x: t, y: y * amplitude })
  }
  return points
}

function interpolateLetterY(points: Point[], t: number): number {
  if (t <= points[0].x) return points[0].y
  if (t >= points[points.length - 1].x) return points[points.length - 1].y
  for (let i = 0; i < points.length - 1; i++) {
    if (t >= points[i].x && t <= points[i + 1].x) {
      const seg = (t - points[i].x) / (points[i + 1].x - points[i].x)
      return points[i].y + (points[i + 1].y - points[i].y) * seg
    }
  }
  return 0
}

function getTextTotalWidth(letterWidth: number, letterGap: number, spaceWidth: number): number {
  const chars = ECG_TEXT.replace(/ /g, '').length
  const spaces = ECG_TEXT.split(' ').length - 1
  return chars * (letterWidth + letterGap) - letterGap + spaces * spaceWidth
}

function layoutText(
  offsetX: number,
  letterWidth: number,
  letterGap: number,
  spaceWidth: number
): LetterLayout[] {
  const layout: LetterLayout[] = []
  let cursor = offsetX

  for (const char of ECG_TEXT) {
    if (char === ' ') {
      cursor += spaceWidth
      continue
    }
    const profile = CONNECTOR_PROFILES[char] ?? DEFAULT_PROFILE
    const startX = cursor
    const endX = cursor + letterWidth
    layout.push({
      char,
      startX,
      endX,
      startConnector: startX + BASE_LEFT_INSET + profile.leftInset,
      endConnector: endX - BASE_RIGHT_INSET - profile.rightInset,
    })
    cursor += letterWidth + letterGap
  }

  return layout
}

// =============================================================================
// Main Component
// =============================================================================

export function ECGAnimation({ onComplete, startPosition }: ECGAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const startTsRef = useRef<number | null>(null)
  const bgTransitionedRef = useRef(false)
  const completedRef = useRef(false)

  const lineColor = '#00ff41'
  const loginBgColor = '#1E293B'

  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const finishAnimation = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    onComplete()
  }, [onComplete])

  useEffect(() => {
    // Reduced motion: skip to end immediately
    if (reducedMotion) {
      const timer = setTimeout(finishAnimation, 100)
      return () => clearTimeout(timer)
    }

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Setup canvas dimensions
    const vw = window.innerWidth
    const vh = window.innerHeight
    const dpr = window.devicePixelRatio || 1

    canvas.width = vw * dpr
    canvas.height = vh * dpr
    ctx.scale(dpr, dpr)

    // Scale factors based on viewport
    const scale = Math.min(1.2, Math.max(0.35, vw / 1400))
    const LETTER_W = 72 * scale
    const LETTER_G = 10 * scale
    const SPACE_W = 30 * scale

    // Layout parameters
    const baselineY = vh * 0.5
    const ecgMaxDefl = vh * 0.25
    const textMaxDefl = vh * 0.08

    // Calculate start offset from cursor position if provided
    const startOffsetX = startPosition ? startPosition.x : 0

    // Build beats with cursor offset
    const beats: Beat[] = [
      { startTime: 0.6, widthPx: 60 * scale, amplitude: 0.3, startWX: 0 },
      { startTime: 1.4, widthPx: 80 * scale, amplitude: 0.55, startWX: 0 },
      { startTime: 2.3, widthPx: 120 * scale, amplitude: 0.85, startWX: 0 },
      { startTime: 3.2, widthPx: 140 * scale, amplitude: 1.0, startWX: 0 },
    ]

    // Apply start offset to all beats
    beats.forEach((b) => {
      b.startWX = b.startTime * TRACE_SPEED + startOffsetX
    })

    // Calculate text layout
    const lastBeat = beats[beats.length - 1]
    const lastBeatEndWX = lastBeat.startWX + lastBeat.widthPx
    const textStartWX = lastBeatEndWX + FLAT_GAP_SECONDS * TRACE_SPEED
    const totalTextW = getTextTotalWidth(LETTER_W, LETTER_G, SPACE_W)
    const textEndWX = textStartWX + totalTextW
    const textLayout = layoutText(textStartWX, LETTER_W, LETTER_G, SPACE_W)

    // Calculate timing phases
    const textEndTime = textEndWX / TRACE_SPEED
    const holdEndTime = textEndTime + HOLD_SECONDS
    const flatlineEndTime = holdEndTime + FLATLINE_DRAW_SECONDS
    const fadeEndTime = flatlineEndTime + FADE_TO_BLACK_SECONDS
    const bgTransitionEndTime = fadeEndTime + BG_TRANSITION_SECONDS
    const exitEndTime = bgTransitionEndTime

    // Final head position (centered text end)
    const finalHeadSX = (vw - totalTextW) / 2 + totalTextW

    // Get Y at a given world X position
    const getYAtX = (wx: number): number => {
      // Check beats
      for (const b of beats) {
        if (wx >= b.startWX && wx <= b.startWX + b.widthPx) {
          const prog = (wx - b.startWX) / b.widthPx
          const pts = generateHeartbeatPoints(b.amplitude)
          const idx = Math.min(Math.floor(prog * (pts.length - 1)), pts.length - 1)
          return baselineY - pts[idx].y * ecgMaxDefl
        }
      }

      // Check text letters
      for (const item of textLayout) {
        if (wx >= item.startX && wx <= item.endX) {
          const t = (wx - item.startX) / (item.endX - item.startX)
          const ld = ECG_LETTERS[item.char]
          if (ld) return baselineY - interpolateLetterY(ld, t) * textMaxDefl
        }
      }

      return baselineY
    }

    // Offscreen canvas for pre-rendering text
    const textCanvas = document.createElement('canvas')
    textCanvas.width = vw * dpr
    textCanvas.height = vh * dpr
    const textCtx = textCanvas.getContext('2d')
    if (textCtx) {
      textCtx.scale(dpr, dpr)
      textCtx.font = `bold ${Math.round(textMaxDefl / 0.715)}px Arial, Helvetica, sans-serif`
      textCtx.textAlign = 'center'
      textCtx.textBaseline = 'alphabetic'
      textCtx.strokeStyle = lineColor
      textCtx.lineWidth = 1.5 * scale

      // Pre-render all letters
      for (const item of textLayout) {
        const centerX = (item.startX + item.endX) / 2
        textCtx.strokeText(item.char, centerX, baselineY)
      }

      // Draw connector lines
      for (let i = 0; i < textLayout.length - 1; i++) {
        const curr = textLayout[i]
        const next = textLayout[i + 1]
        textCtx.beginPath()
        textCtx.moveTo(curr.endConnector, baselineY)
        textCtx.lineTo(next.startConnector, baselineY)
        textCtx.stroke()
      }
    }

    // Animation loop
    const animate = (timestamp: number) => {
      if (!startTsRef.current) startTsRef.current = timestamp
      const elapsed = (timestamp - startTsRef.current) / 1000

      // Check for animation completion
      if (elapsed >= exitEndTime) {
        finishAnimation()
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, vw, vh)

      // Calculate current head position
      let headWX = elapsed * TRACE_SPEED + startOffsetX
      const isFlatlinePhase = elapsed >= holdEndTime && elapsed < flatlineEndTime
      const isFadePhase = elapsed >= flatlineEndTime && elapsed < fadeEndTime
      const isBgTransitionPhase = elapsed >= fadeEndTime

      if (elapsed >= textEndTime) {
        headWX = textEndWX
      }

      // Calculate viewport and head screen position
      let headSX: number
      let viewOff: number
      const headSXEcg = HEAD_SCREEN_RATIO * vw

      if (headWX <= textStartWX) {
        viewOff = Math.max(0, headWX - headSXEcg)
        headSX = headWX - viewOff
      } else if (headWX >= textEndWX || elapsed >= textEndTime) {
        viewOff = textEndWX - finalHeadSX
        headSX = headWX - viewOff
      } else {
        const p = (headWX - textStartWX) / (textEndWX - textStartWX)
        headSX = headSXEcg + p * (finalHeadSX - headSXEcg)
        viewOff = headWX - headSX
      }

      // Calculate fade alpha
      let fadeAlpha = 1
      if (isFadePhase) {
        fadeAlpha = Math.max(0, 1 - (elapsed - flatlineEndTime) / FADE_TO_BLACK_SECONDS)
      } else if (isBgTransitionPhase) {
        fadeAlpha = 0
      }

      // Background color transition
      if (!bgTransitionedRef.current && elapsed >= flatlineEndTime) {
        bgTransitionedRef.current = true
        container.style.transition = `background ${BG_TRANSITION_SECONDS * 1000}ms ease-out`
        container.style.background = loginBgColor
      }

      ctx.save()
      ctx.globalAlpha = fadeAlpha

      // Draw ECG trace (beats only, up to text start)
      const traceStart = Math.max(0, Math.floor(viewOff))
      const traceEnd = Math.min(
        Math.ceil(elapsed >= textEndTime ? textEndWX : headWX),
        Math.ceil(viewOff + vw)
      )

      if (traceEnd > traceStart) {
        // Outer glow layer
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.25)'
        ctx.lineWidth = 6 * scale
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.shadowColor = lineColor
        ctx.shadowBlur = 14 * scale

        for (let wx = traceStart; wx <= traceEnd; wx++) {
          const sx = wx - viewOff
          const sy = getYAtX(wx)
          if (wx === traceStart) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.stroke()

        // Main trace layer
        ctx.beginPath()
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 2 * scale
        ctx.shadowBlur = 4 * scale

        for (let wx = traceStart; wx <= traceEnd; wx++) {
          const sx = wx - viewOff
          const sy = getYAtX(wx)
          if (wx === traceStart) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.stroke()
      }

      // Draw flatline after text
      if (isFlatlinePhase || (elapsed >= holdEndTime && elapsed < textEndTime)) {
        const flatlineProgress = isFlatlinePhase
          ? (elapsed - holdEndTime) / FLATLINE_DRAW_SECONDS
          : 1
        const flatlineEndSX = finalHeadSX + flatlineProgress * (vw - finalHeadSX + 50)
        ctx.beginPath()
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 2 * scale
        ctx.shadowBlur = 8 * scale
        ctx.shadowColor = lineColor
        ctx.moveTo(finalHeadSX, baselineY)
        ctx.lineTo(flatlineEndSX, baselineY)
        ctx.stroke()
      }

      // Mask-based text reveal
      const isTextPhase = headWX > textStartWX
      const isTextDone = elapsed >= textEndTime

      if (isTextPhase && textCtx) {
        // Create clipping region based on trace head position
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, isTextDone ? vw : headSX + 20 * scale, vh)
        ctx.clip()

        // Draw pre-rendered text through the clip
        ctx.drawImage(textCanvas, -viewOff, 0)

        // Apply neon glow to text
        ctx.globalCompositeOperation = 'source-over'
        ctx.shadowColor = lineColor
        ctx.shadowBlur = 8 * scale

        ctx.restore()
      }

      // Draw dot/head
      ctx.globalAlpha = fadeAlpha
      ctx.shadowBlur = 0

      if (headSX >= -20 && headSX <= vw + 20 && elapsed < flatlineEndTime) {
        const headY = isFlatlinePhase ? baselineY : getYAtX(headWX)

        // Glow gradient
        const grad = ctx.createRadialGradient(headSX, headY, 0, headSX, headY, 20 * scale)
        grad.addColorStop(0, 'rgba(255,255,255,0.8)')
        grad.addColorStop(0.3, 'rgba(0,255,65,0.6)')
        grad.addColorStop(1, 'rgba(0,255,65,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(headSX, headY, 20 * scale, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = lineColor
        ctx.beginPath()
        ctx.arc(headSX, headY, 3 * scale, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      // Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      for (let sly = 0; sly < vh; sly += 4) {
        ctx.fillRect(0, sly + 2, vw, 2)
      }

      // Vignette
      const vig = ctx.createRadialGradient(vw / 2, vh / 2, vh * 0.3, vw / 2, vh / 2, vh * 0.85)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.4)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, vw, vh)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [startPosition, finishAnimation, reducedMotion])

  // Reduced motion fallback
  if (reducedMotion) {
    return (
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-50 bg-[#1E293B]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-50 bg-black"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </motion.div>
    </AnimatePresence>
  )
}

export type { ECGAnimationProps }
