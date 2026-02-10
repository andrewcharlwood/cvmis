import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ECGAnimationProps {
  onComplete: () => void
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
  centerX: number
}

const ECG_LETTERS: Record<string, Point[]> = {
  A: [{x:0,y:0},{x:0.48,y:1},{x:0.53,y:0.42},{x:0.6,y:0.42},{x:1,y:0}],
  N: [{x:0,y:0},{x:0.12,y:1},{x:0.72,y:0},{x:0.88,y:1},{x:1,y:0}],
  D: [{x:0,y:0},{x:0.1,y:1},{x:0.5,y:1},{x:0.85,y:0.55},{x:1,y:0}],
  R: [{x:0,y:0},{x:0.1,y:1},{x:0.35,y:1},{x:0.5,y:0.6},{x:0.55,y:0.45},{x:1,y:0}],
  E: [{x:0,y:0},{x:0.1,y:1},{x:0.4,y:1},{x:0.45,y:0.5},{x:0.65,y:0.5},{x:0.7,y:0},{x:1,y:0}],
  W: [{x:0,y:0},{x:0.05,y:1},{x:0.27,y:0},{x:0.5,y:0.65},{x:0.73,y:0},{x:0.95,y:1},{x:1,y:0}],
  C: [{x:0,y:0},{x:0.08,y:0.6},{x:0.18,y:1},{x:0.6,y:1},{x:0.8,y:0.5},{x:0.95,y:0.1},{x:1,y:0}],
  H: [{x:0,y:0},{x:0.1,y:1},{x:0.18,y:0.5},{x:0.82,y:0.5},{x:0.9,y:1},{x:1,y:0}],
  L: [{x:0,y:0},{x:0.12,y:1},{x:0.3,y:1},{x:0.38,y:0},{x:1,y:0}],
  O: [{x:0,y:0},{x:0.2,y:0.85},{x:0.35,y:1},{x:0.65,y:1},{x:0.8,y:0.85},{x:1,y:0}],
}

const ECG_TEXT = 'ANDREW CHARLWOOD'

function generateHeartbeatPoints(amplitude: number): Point[] {
  const points: Point[] = []
  const steps = 200
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    let y = 0
    if (t >= 0.05 && t < 0.2) { y = 0.12 * Math.sin(((t - 0.05) / 0.15) * Math.PI) }
    else if (t >= 0.25 && t < 0.32) { y = -0.1 * Math.sin(((t - 0.25) / 0.07) * Math.PI) }
    else if (t >= 0.32 && t < 0.42) { y = 1.0 * Math.sin(((t - 0.32) / 0.1) * Math.PI) }
    else if (t >= 0.42 && t < 0.5) { y = -0.25 * Math.sin(((t - 0.42) / 0.08) * Math.PI) }
    else if (t >= 0.55 && t < 0.75) { y = 0.2 * Math.sin(((t - 0.55) / 0.2) * Math.PI) }
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

function ecgGetTextWidth(lw: number, lg: number, sw: number): number {
  const chars = ECG_TEXT.replace(/ /g, '').length
  const spaces = ECG_TEXT.split(' ').length - 1
  return chars * (lw + lg) - lg + spaces * sw
}

function ecgLayoutText(offsetX: number, lw: number, lg: number, sw: number): LetterLayout[] {
  const layout: LetterLayout[] = []
  let cursor = offsetX
  for (let i = 0; i < ECG_TEXT.length; i++) {
    const ch = ECG_TEXT[i]
    if (ch === ' ') { cursor += sw; continue }
    layout.push({ char: ch, startX: cursor, endX: cursor + lw, centerX: cursor + lw / 2 })
    cursor += lw + lg
  }
  return layout
}

export function ECGAnimation({ onComplete }: ECGAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const startTsRef = useRef<number | null>(null)
  const bgTransitionedRef = useRef(false)
  const completedRef = useRef(false)

  const finishAnimation = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const dpr = window.devicePixelRatio || 1

    canvas.width = vw * dpr
    canvas.height = vh * dpr
    ctx.scale(dpr, dpr)

    const scale = Math.min(1.2, Math.max(0.35, vw / 1400))
    const LETTER_W = 72 * scale
    const LETTER_G = 10 * scale
    const SPACE_W = 30 * scale
    const TRACE_SPEED = 450 * scale
    const FLAT_GAP = 0.4
    const HOLD_TIME = 0.75
    const EXIT_TIME = 0.8
    const baselineY = vh * 0.5
    const ecgMaxDefl = vh * 0.25
    const textMaxDefl = vh * 0.08
    const lineColor = '#00ff41'

    const beats: Beat[] = [
      { startTime: 0.5, widthPx: 60 * scale, amplitude: 0.3, startWX: 0 },
      { startTime: 1.2, widthPx: 90 * scale, amplitude: 0.55, startWX: 0 },
      { startTime: 2.0, widthPx: 120 * scale, amplitude: 0.85, startWX: 0 },
      { startTime: 2.8, widthPx: 140 * scale, amplitude: 1.0, startWX: 0 },
    ]
    beats.forEach((b) => { b.startWX = b.startTime * TRACE_SPEED })

    const lastBeat = beats[beats.length - 1]
    const lastBeatEndWX = lastBeat.startWX + lastBeat.widthPx
    const textStartWX = lastBeatEndWX + FLAT_GAP * TRACE_SPEED
    const totalTextW = ecgGetTextWidth(LETTER_W, LETTER_G, SPACE_W)
    const textEndWX = textStartWX + totalTextW
    const textLayout = ecgLayoutText(textStartWX, LETTER_W, LETTER_G, SPACE_W)
    const fontSize = Math.round(textMaxDefl / 0.715)

    const headScreenRatio = 0.75
    const finalHeadSX = (vw - totalTextW) / 2 + totalTextW
    const textEndTime = textEndWX / TRACE_SPEED
    const holdEndTime = textEndTime + HOLD_TIME
    const exitEndTime = holdEndTime + EXIT_TIME

    const getYAtX = (wx: number): number => {
      for (let i = 0; i < beats.length; i++) {
        const b = beats[i]
        if (wx >= b.startWX && wx <= b.startWX + b.widthPx) {
          const prog = (wx - b.startWX) / b.widthPx
          const pts = generateHeartbeatPoints(b.amplitude)
          const idx = Math.min(Math.floor(prog * (pts.length - 1)), pts.length - 1)
          return baselineY - pts[idx].y * ecgMaxDefl
        }
      }
      for (let j = 0; j < textLayout.length; j++) {
        const item = textLayout[j]
        if (wx >= item.startX && wx <= item.endX) {
          const t = (wx - item.startX) / (item.endX - item.startX)
          const ld = ECG_LETTERS[item.char]
          if (ld) return baselineY - interpolateLetterY(ld, t) * textMaxDefl
        }
      }
      return baselineY
    }

    const animate = (timestamp: number) => {
      if (!startTsRef.current) startTsRef.current = timestamp
      const elapsed = (timestamp - startTsRef.current) / 1000

      if (elapsed >= exitEndTime) {
        finishAnimation()
        return
      }

      ctx.clearRect(0, 0, vw, vh)

      let headWX = elapsed * TRACE_SPEED
      const isExitPhase = elapsed >= holdEndTime

      if (isExitPhase) {
        headWX = textEndWX + (elapsed - holdEndTime) * TRACE_SPEED * 1.5
      }

      let headSX: number
      let viewOff: number
      const headSXEcg = headScreenRatio * vw

      if (headWX <= textStartWX) {
        viewOff = Math.max(0, headWX - headSXEcg)
        headSX = headWX - viewOff
      } else if (headWX >= textEndWX || isExitPhase) {
        viewOff = textEndWX - finalHeadSX
        headSX = headWX - viewOff
      } else {
        const p = (headWX - textStartWX) / (textEndWX - textStartWX)
        headSX = headSXEcg + p * (finalHeadSX - headSXEcg)
        viewOff = headWX - headSX
      }

      const fadeAlpha = isExitPhase ? Math.max(0, 1 - (elapsed - holdEndTime) / EXIT_TIME) : 1

      if (!bgTransitionedRef.current && elapsed >= textEndTime - 0.3) {
        bgTransitionedRef.current = true
        container.style.transition = 'background 1200ms ease-out'
        container.style.background = '#FFFFFF'
      }

      ctx.save()
      ctx.globalAlpha = fadeAlpha

      const traceStart = Math.max(0, Math.floor(viewOff))
      const traceEnd = Math.min(Math.ceil(isExitPhase ? textEndWX : headWX), Math.ceil(viewOff + vw))

      if (traceEnd > traceStart) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.25)'
        ctx.lineWidth = 6
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.shadowColor = lineColor
        ctx.shadowBlur = 14
        for (let wx = traceStart; wx <= traceEnd; wx++) {
          const sx = wx - viewOff
          const sy = getYAtX(wx)
          if (wx === traceStart) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.stroke()

        ctx.beginPath()
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 2
        ctx.shadowBlur = 4
        for (let wx = traceStart; wx <= traceEnd; wx++) {
          const sx = wx - viewOff
          const sy = getYAtX(wx)
          if (wx === traceStart) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.stroke()
      }

      if (isExitPhase) {
        const exitStartSX = textEndWX - viewOff
        const exitEndSX = headWX - viewOff
        ctx.beginPath()
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 2
        ctx.shadowBlur = 8
        ctx.moveTo(exitStartSX, baselineY)
        ctx.lineTo(exitEndSX, baselineY)
        ctx.stroke()
      }

      ctx.shadowColor = lineColor
      ctx.shadowBlur = 8
      ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.lineWidth = 1.5 * scale
      ctx.strokeStyle = lineColor

      for (let k = 0; k < textLayout.length; k++) {
        const item = textLayout[k]
        const letterProgress = (headWX - item.startX) / (item.endX - item.startX)
        if (letterProgress > 0.3) {
          const alpha = Math.min(1, (letterProgress - 0.3) * 1.43)
          ctx.globalAlpha = fadeAlpha * alpha
          const lsx = item.centerX - viewOff
          ctx.strokeText(item.char, lsx, baselineY)
        }
      }

      ctx.globalAlpha = fadeAlpha
      ctx.shadowBlur = 0
      if (headSX >= -20 && headSX <= vw + 20) {
        const headY = isExitPhase ? baselineY : getYAtX(headWX)
        const grad = ctx.createRadialGradient(headSX, headY, 0, headSX, headY, 20 * scale)
        grad.addColorStop(0, 'rgba(255,255,255,0.8)')
        grad.addColorStop(0.3, 'rgba(0,255,65,0.6)')
        grad.addColorStop(1, 'rgba(0,255,65,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(headSX, headY, 20 * scale, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = lineColor
        ctx.beginPath()
        ctx.arc(headSX, headY, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      for (let sly = 0; sly < vh; sly += 4) {
        ctx.fillRect(0, sly + 2, vw, 2)
      }

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
  }, [finishAnimation])

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
