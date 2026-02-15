import { useEffect, useState, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface CvmisLogoProps {
  size?: number
  cssHeight?: string
  animated?: boolean
  className?: string
}

// ── Animation timing constants ──────────────────────────────────────
// Rise phase: all pills rise together from below
const RISE_DURATION_MS = 2500           // duration of the upward rise (ms)
const RISE_DURATION_S = RISE_DURATION_MS / 1000
const RISE_OPACITY_DURATION_S = 0.25   // opacity fade-in during rise (s)
const RISE_EASING: [number, number, number, number] = [0.33, 1, 0.68, 1]
const RISE_START_Y = 350               // initial Y offset (viewBox units)

// Fan phase: left and right pills fan outward
const FAN_DELAY_AFTER_RISE_MS = RISE_DURATION_MS - 100    // delay before fan begins (ms from mount)
const FAN_DURATION_S = 1            // duration of fan-out (s)
const FAN_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const FAN_ROTATION_DEG = 55            // rotation angle for fanned pills (±degrees)
const FAN_HORIZONTAL_PX = 10           // horizontal offset for fanned pills (±px)
const FAN_RIGHT_STAGGER_S = 0.0       // stagger delay for right pill (s)

// Total animation = rise delay + fan duration
const TOTAL_ANIMATION_MS = FAN_DELAY_AFTER_RISE_MS + FAN_DURATION_S * 1000

// Overlap blend: multiply blend on fanning capsules (used by US-005)
export const OVERLAY_BLEND_START_PROGRESS = 0.2  // fan progress at which blend fades in
export const OVERLAP_BLEND_MAX_OPACITY = 0.3     // max blend opacity (20%)
export const OVERLAP_BLEND_TRANSITION_DURATION_S = FAN_DURATION_S * (1 - OVERLAY_BLEND_START_PROGRESS)

// Pivot point: bottom-center of the pill stack (in viewBox coords)
const PX = 300
const PY = 275

// Build a CSS transform that rotates around (PX, PY) then offsets by dx
function fanTransform(rotation: number, dx: number): string {
  return [
    `translate(${dx}px, 0px)`,
    `translate(${PX}px, ${PY}px)`,
    `rotate(${rotation}deg)`,
    `translate(${-PX}px, ${-PY}px)`,
  ].join(' ')
}

const IDENTITY_TRANSFORM = fanTransform(0, 0)

export function CvmisLogo({ size, cssHeight, animated = false, className }: CvmisLogoProps) {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<'rising' | 'fanning' | 'done'>(
    animated && !prefersReducedMotion ? 'rising' : 'done'
  )
  const [blendActive, setBlendActive] = useState(!animated || !!prefersReducedMotion)

  // Blend starts at OVERLAY_BLEND_START_PROGRESS through the fan animation
  const blendStartMs = useMemo(
    () => FAN_DELAY_AFTER_RISE_MS + FAN_DURATION_S * 1000 * OVERLAY_BLEND_START_PROGRESS,
    []
  )

  useEffect(() => {
    if (!animated || prefersReducedMotion) return

    const fanTimer = setTimeout(() => setPhase('fanning'), FAN_DELAY_AFTER_RISE_MS)
    const doneTimer = setTimeout(() => setPhase('done'), TOTAL_ANIMATION_MS)
    const blendTimer = setTimeout(() => setBlendActive(true), blendStartMs)

    return () => {
      clearTimeout(fanTimer)
      clearTimeout(doneTimer)
      clearTimeout(blendTimer)
    }
  }, [animated, prefersReducedMotion, blendStartMs])

  const skip = !animated || prefersReducedMotion
  const isFanned = phase === 'fanning' || phase === 'done'
  const fanTarget = isFanned || skip

  const leftTransform = fanTarget ? fanTransform(-FAN_ROTATION_DEG, -FAN_HORIZONTAL_PX) : IDENTITY_TRANSFORM
  const rightTransform = fanTarget ? fanTransform(FAN_ROTATION_DEG, FAN_HORIZONTAL_PX) : IDENTITY_TRANSFORM
  const fanTransition = skip ? 'none' : `transform ${FAN_DURATION_S}s ${FAN_EASING}`
  const fanTransitionDelayed = skip ? 'none' : `transform ${FAN_DURATION_S}s ${FAN_EASING} ${FAN_RIGHT_STAGGER_S}s`

  return (
    <svg
      viewBox="0 0 600 300"
      height={cssHeight ? undefined : size}
      className={className}
      role="img"
      aria-label="CVMIS logo"
      style={{
        overflow: 'visible',
        ...(cssHeight ? { height: cssHeight, width: 'auto' } : {}),
      }}
    >
      <defs>
        <clipPath id="center-pill-clip">
          <rect x="250" y="50" width="100" height="225" rx="50" />
        </clipPath>
      </defs>
      {/* Rise group — all pills rise together from below */}
      <motion.g
        initial={skip ? false : { y: RISE_START_Y, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          y: { duration: RISE_DURATION_S, ease: RISE_EASING },
          opacity: { duration: RISE_OPACITY_DURATION_S },
        }}
      >
        {/* Rx pill — teal, fans left (bottom layer) */}
        <g style={{ transform: leftTransform, transition: fanTransition }}>
          <g transform="translate(250, 50)">
            <rect width="100" height="225" rx="50" fill="#0E7A7D" />
            <g transform="translate(21, 50) scale(0.6)">
              <path
                d="M25 70 V0 H55 C80 0 80 35 55 35 H25 M55 35 L85 70 M53 67 L87 38"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                fill="none"
              />
            </g>
          </g>
        </g>

        {/* Data pill — green, fans right (middle layer) */}
        <g style={{ transform: rightTransform, transition: fanTransitionDelayed }}>
          <g transform="translate(250, 50)">
            <rect width="100" height="225" rx="50" fill="#109E6C" />
            <g transform="translate(22.5, 50) scale(0.5)">
              <rect x="0" y="60" width="20" height="40" fill="white" />
              <rect x="30" y="40" width="20" height="60" fill="white" />
              <rect x="60" y="20" width="20" height="80" fill="white" />
              <rect x="90" y="0" width="20" height="100" fill="white" />
            </g>
          </g>
        </g>

        {/* Code pill — amber, center (top layer, no fan) */}
        <g transform="translate(250, 50)">
          <rect width="100" height="225" rx="50" fill="#E38B16" />
          <g transform="translate(25, 50) scale(0.6)">
            <path
              d="M10 0 L50 30 L10 60"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <line
              x1="55"
              y1="65"
              x2="85"
              y2="65"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Blend overlays — multiply-blend copies of fanning pills, clipped to center pill overlap */}
        <g clipPath="url(#center-pill-clip)">
          <g
            style={{
              transform: leftTransform,
              transition: skip ? 'none' : `${fanTransition}, opacity ${OVERLAP_BLEND_TRANSITION_DURATION_S}s ease-out`,
              mixBlendMode: 'multiply',
              opacity: blendActive ? OVERLAP_BLEND_MAX_OPACITY : 0,
            }}
          >
            <g transform="translate(250, 50)">
              <rect width="100" height="225" rx="50" fill="#0E7A7D" />
            </g>
          </g>
        </g>
        <g clipPath="url(#center-pill-clip)">
          <g
            style={{
              transform: rightTransform,
              transition: skip ? 'none' : `${fanTransitionDelayed}, opacity ${OVERLAP_BLEND_TRANSITION_DURATION_S}s ease-out`,
              mixBlendMode: 'multiply',
              opacity: blendActive ? OVERLAP_BLEND_MAX_OPACITY : 0,
            }}
          >
            <g transform="translate(250, 50)">
              <rect width="100" height="225" rx="50" fill="#109E6C" />
            </g>
          </g>
        </g>
      </motion.g>
    </svg>
  )
}
