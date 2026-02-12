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
  baselineY: number
}

// =============================================================================
// Constants
// =============================================================================

const TRACE_SPEED = 350 // pixels per second
const HEAD_SCREEN_RATIO = 0.75 // Head stays at 75% of screen during ECG
const FLAT_GAP_SECONDS = 0.5 // Gap after last beat before text
const HOLD_SECONDS = 2 // Hold after text completes, before flatline/transition
const FLATLINE_DRAW_SECONDS = 0.3 // Time to draw flatline
const FADE_TO_BLACK_SECONDS = 0.2 // Canvas fade out
const BG_TRANSITION_SECONDS = 0.2 // Background color transition

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

    // P wave: gentle rounded bump
    if (t >= 0.02 && t < 0.14) {
      y = 0.06 * Math.sin(((t - 0.02) / 0.12) * Math.PI)
    }
    // PR segment flat (0.14–0.24)
    // Q wave: small sharp dip
    else if (t >= 0.24 && t < 0.28) {
      y = -0.08 * Math.sin(((t - 0.24) / 0.04) * Math.PI)
    }
    // R wave: tall sharp spike
    else if (t >= 0.28 && t < 0.36) {
      y = 1.0 * Math.sin(((t - 0.28) / 0.08) * Math.PI)
    }
    // S wave: dip below baseline
    else if (t >= 0.36 && t < 0.42) {
      y = -0.2 * Math.sin(((t - 0.36) / 0.06) * Math.PI)
    }
    // ST segment flat (0.42–0.54)
    // T wave: broad rounded bump
    else if (t >= 0.54 && t < 0.78) {
      y = 0.15 * Math.sin(((t - 0.54) / 0.24) * Math.PI)
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
  spaceWidth: number,
  baselineY: number,
  rowGap: number,
  maxRowWidth: number
): LetterLayout[] {
  const words = ECG_TEXT.split(' ')
  const layout: LetterLayout[] = []
  let cursor = offsetX
  let currentBaselineY = baselineY
  let rowWidth = 0

  for (let w = 0; w < words.length; w++) {
    const word = words[w]
    const wordWidth = word.length * (letterWidth + letterGap) - letterGap

    if (w > 0) {
      const withSpace = rowWidth + spaceWidth + wordWidth
      if (maxRowWidth > 0 && withSpace > maxRowWidth) {
        // Wrap to next row
        cursor += spaceWidth
        currentBaselineY += rowGap
        rowWidth = 0
      } else {
        cursor += spaceWidth
        rowWidth += spaceWidth
      }
    }

    for (const char of word) {
      layout.push({
        char,
        startX: cursor,
        endX: cursor + letterWidth,
        baselineY: currentBaselineY,
      })
      cursor += letterWidth + letterGap
      rowWidth += letterWidth + letterGap
    }
    rowWidth -= letterGap
  }

  return layout
}

/** Measure where each character's rendered stroke crosses the baseline.
 *  Returns left/right ratios (0–1) within the character cell. */
function measureCharBaselineEdges(
  font: string,
  lineWidth: number,
  charWidth: number
): Map<string, { leftRatio: number; rightRatio: number }> {
  const padding = Math.ceil(charWidth)
  const width = Math.ceil(charWidth + padding * 2)
  const height = Math.ceil(charWidth * 3)
  const baseline = Math.ceil(height * 0.6)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  const centerX = width / 2
  const halfChar = charWidth / 2
  const uniqueChars = [...new Set(ECG_TEXT.replace(/ /g, ''))]
  const results = new Map<string, { leftRatio: number; rightRatio: number }>()

  for (const char of uniqueChars) {
    ctx.clearRect(0, 0, width, height)
    ctx.font = font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = lineWidth
    ctx.strokeText(char, centerX, baseline)

    // Scan ±2 rows around baseline for stroke pixels
    const y0 = Math.max(0, baseline - 2)
    const scanH = 5
    const data = ctx.getImageData(0, y0, width, scanH).data

    let minX = width
    let maxX = 0
    for (let r = 0; r < scanH; r++) {
      for (let x = 0; x < width; x++) {
        if (data[(r * width + x) * 4 + 3] > 10) {
          if (x < minX) minX = x
          if (x > maxX) maxX = x
        }
      }
    }

    const leftEdge = centerX - halfChar
    if (minX <= maxX) {
      results.set(char, {
        leftRatio: Math.max(0, (minX - leftEdge) / charWidth),
        rightRatio: Math.min(1, (maxX - leftEdge) / charWidth),
      })
    } else {
      // Fallback: full width
      results.set(char, { leftRatio: 0, rightRatio: 1 })
    }
  }

  return results
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
    const scale = Math.min(1.2, Math.max(0.45, vw / 1200))
    const LETTER_W = 72 * scale
    const LETTER_G = 10 * scale
    const SPACE_W = 30 * scale

    // Layout parameters
    const baselineY = vh * 0.5
    const ecgMaxDefl = vh * 0.25
    // Cap text deflection to letter width so font doesn't overflow cells on mobile
    const textMaxDefl = Math.min(vh * 0.08, LETTER_W * 1.15)

    // Calculate start offset from cursor position if provided
    const startOffsetX = startPosition ? startPosition.x : 0

    // Build beats with cursor offset
    const beats: Beat[] = [
      { startTime: 0.6, widthPx: 150 * scale, amplitude: 0.3, startWX: 0 },
      { startTime: 1.4, widthPx: 190 * scale, amplitude: 0.55, startWX: 0 },
      { startTime: 2.3, widthPx: 230 * scale, amplitude: 0.85, startWX: 0 },
      { startTime: 3.2, widthPx: 270 * scale, amplitude: 1.0, startWX: 0 },
    ]

    // Apply start offset to all beats
    beats.forEach((b) => {
      b.startWX = b.startTime * TRACE_SPEED + startOffsetX
    })

    // Calculate text layout — single line, viewport scrolls through
    const lastBeat = beats[beats.length - 1]
    const lastBeatEndWX = lastBeat.startWX + lastBeat.widthPx
    const textStartWX = lastBeatEndWX + FLAT_GAP_SECONDS * TRACE_SPEED
    const totalTextW = getTextTotalWidth(LETTER_W, LETTER_G, SPACE_W)
    const textEndWX = textStartWX + totalTextW
    const textLayout = layoutText(
      textStartWX, LETTER_W, LETTER_G, SPACE_W,
      baselineY, 0, Infinity
    )

    // Calculate timing phases
    const textEndTime = (textEndWX - startOffsetX) / TRACE_SPEED
    const holdEndTime = textEndTime 
    const flatlineEndTime = textEndTime + FLATLINE_DRAW_SECONDS
    const fadeStartTime = flatlineEndTime + HOLD_SECONDS
    const fadeEndTime = fadeStartTime + FADE_TO_BLACK_SECONDS
    const bgTransitionEndTime = fadeEndTime + BG_TRANSITION_SECONDS
    const exitEndTime = bgTransitionEndTime

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

    // Text rendering properties (drawn directly each frame — avoids offscreen canvas DPR/size issues on mobile)
    const textFont = `bold ${Math.round(textMaxDefl / 0.715)}px Arial, Helvetica, sans-serif`
    const textLineWidth = 2 * scale
    // Measure where each character's stroke crosses the baseline (for connector lines)
    const charEdges = measureCharBaselineEdges(textFont, textLineWidth, LETTER_W)

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
      const isFlatlinePhase = elapsed >= holdEndTime && elapsed < fadeStartTime
      const isFadePhase = elapsed >= fadeStartTime && elapsed < fadeEndTime
      const isBgTransitionPhase = elapsed >= fadeEndTime

      if (elapsed >= textEndTime) {
        headWX = textEndWX
      }

      // Calculate viewport and head screen position
      let headSX: number
      let viewOff: number
      const headSXEcg = HEAD_SCREEN_RATIO * vw
      
      // Simple continuous scrolling - viewport follows head when it exceeds 75% of screen
      viewOff = Math.max(0, headWX - headSXEcg)
      headSX = headWX - viewOff

      // Calculate fade alpha
      let fadeAlpha = 1
      if (isFadePhase) {
        fadeAlpha = Math.max(0, 1 - (elapsed - flatlineEndTime) / FADE_TO_BLACK_SECONDS)
      } else if (isBgTransitionPhase) {
        fadeAlpha = 0
      }

      // Background color transition — delayed until after HOLD
      if (!bgTransitionedRef.current && elapsed >= fadeStartTime) {
        bgTransitionedRef.current = true
        container.style.transition = `background ${BG_TRANSITION_SECONDS * 1000}ms ease-out`
        container.style.background = loginBgColor
      }

      ctx.save()
      ctx.globalAlpha = fadeAlpha

      // Draw ECG trace - always draw from start for continuity
      // Performance is fine since we're only drawing ~1000 pixels per frame
      const traceStart = Math.floor(startOffsetX)
      const traceEnd = Math.min(
        Math.ceil(elapsed >= textEndTime ? textEndWX : headWX),
        Math.ceil(viewOff + vw),
        Math.ceil(textStartWX) // Stop trace before text — only the dot draws through letters
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

      // Draw flatline after text — during flatline draw phase and fade phase
      if (isFlatlinePhase || isFadePhase) {
        const flatlineProgress = Math.min(1, (elapsed - holdEndTime) / FLATLINE_DRAW_SECONDS)
        // Use actual head screen position, not finalHeadSX
        const flatlineStartSX = headSX
        const flatlineEndSX = flatlineStartSX + flatlineProgress * (vw - flatlineStartSX + 50)
        ctx.beginPath()
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 2 * scale
        ctx.shadowBlur = 8 * scale
        ctx.shadowColor = lineColor
        ctx.moveTo(flatlineStartSX, baselineY)
        ctx.lineTo(flatlineEndSX, baselineY)
        ctx.stroke()
      }

      // Text reveal — draw letters directly each frame
      const isTextPhase = headWX > textStartWX
      const isTextDone = elapsed >= textEndTime

      if (isTextPhase) {
        ctx.save()

        // Clip for progressive reveal
        const revealX = isTextDone ? vw : (headWX - viewOff)
        ctx.beginPath()
        ctx.rect(0, 0, revealX, vh)
        ctx.clip()

        // Common text properties
        ctx.font = textFont
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        // Pass 1: Outer glow layer (matches trace glow)
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.25)'
        ctx.lineWidth = 6 * scale
        ctx.shadowColor = lineColor
        ctx.shadowBlur = 14 * scale

        for (const item of textLayout) {
          const screenX = (item.startX + item.endX) / 2 - viewOff
          if (screenX + LETTER_W < 0 || screenX - LETTER_W > vw) continue
          ctx.strokeText(item.char, screenX, baselineY)
        }
        for (let i = 0; i < textLayout.length - 1; i++) {
          const curr = textLayout[i]
          const next = textLayout[i + 1]
          const currEdge = charEdges.get(curr.char)
          const nextEdge = charEdges.get(next.char)
          if (!currEdge || !nextEdge) continue
          const fromX = curr.startX + currEdge.rightRatio * LETTER_W - viewOff
          const toX = next.startX + nextEdge.leftRatio * LETTER_W - viewOff
          if (toX < 0 || fromX > vw) continue
          ctx.beginPath()
          ctx.moveTo(fromX, baselineY)
          ctx.lineTo(toX, baselineY)
          ctx.stroke()
        }

        // Connect last character's right stroke edge to cell edge (glow layer)
        {
          const lastChar = textLayout[textLayout.length - 1]
          const lastEdge = charEdges.get(lastChar.char)
          if (lastEdge) {
            const fromX = lastChar.startX + lastEdge.rightRatio * LETTER_W - viewOff
            const toX = lastChar.endX - viewOff
            if (fromX < vw && toX > 0) {
              ctx.beginPath()
              ctx.moveTo(fromX, baselineY)
              ctx.lineTo(toX, baselineY)
              ctx.stroke()
            }
          }
        }

        // Pass 2: Main line layer (matches trace line)
        ctx.strokeStyle = lineColor
        ctx.lineWidth = textLineWidth
        ctx.shadowBlur = 4 * scale

        for (const item of textLayout) {
          const screenX = (item.startX + item.endX) / 2 - viewOff
          if (screenX + LETTER_W < 0 || screenX - LETTER_W > vw) continue
          ctx.strokeText(item.char, screenX, baselineY)
        }
        for (let i = 0; i < textLayout.length - 1; i++) {
          const curr = textLayout[i]
          const next = textLayout[i + 1]
          const currEdge = charEdges.get(curr.char)
          const nextEdge = charEdges.get(next.char)
          if (!currEdge || !nextEdge) continue
          const fromX = curr.startX + currEdge.rightRatio * LETTER_W - viewOff
          const toX = next.startX + nextEdge.leftRatio * LETTER_W - viewOff
          if (toX < 0 || fromX > vw) continue
          ctx.beginPath()
          ctx.moveTo(fromX, baselineY)
          ctx.lineTo(toX, baselineY)
          ctx.stroke()
        }

        // Connect last character's right stroke edge to its cell edge (bridges gap to flatline)
        const lastChar = textLayout[textLayout.length - 1]
        const lastEdge = charEdges.get(lastChar.char)
        if (lastEdge) {
          const fromX = lastChar.startX + lastEdge.rightRatio * LETTER_W - viewOff
          const toX = lastChar.endX - viewOff
          if (fromX < vw && toX > 0) {
            ctx.beginPath()
            ctx.moveTo(fromX, baselineY)
            ctx.lineTo(toX, baselineY)
            ctx.stroke()
          }
        }

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
