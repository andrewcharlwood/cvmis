import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface CvmisLogoProps {
  size?: number
  cssHeight?: string
  animated?: boolean
  className?: string
}

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
const FAN_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export function CvmisLogo({ size, cssHeight, animated = false, className }: CvmisLogoProps) {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<'rising' | 'fanning' | 'done'>(
    animated && !prefersReducedMotion ? 'rising' : 'done'
  )

  useEffect(() => {
    if (!animated || prefersReducedMotion) return

    const fanTimer = setTimeout(() => setPhase('fanning'), 500)
    const doneTimer = setTimeout(() => setPhase('done'), 1000)

    return () => {
      clearTimeout(fanTimer)
      clearTimeout(doneTimer)
    }
  }, [animated, prefersReducedMotion])

  const skip = !animated || prefersReducedMotion
  const isFanned = phase === 'fanning' || phase === 'done'
  const fanTarget = isFanned || skip

  const leftTransform = fanTarget ? fanTransform(-50, -16) : IDENTITY_TRANSFORM
  const rightTransform = fanTarget ? fanTransform(50, 16) : IDENTITY_TRANSFORM
  const fanTransition = skip ? 'none' : `transform 0.6s ${FAN_EASING}`
  const fanTransitionDelayed = skip ? 'none' : `transform 0.6s ${FAN_EASING} 0.03s`

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
      {/* Rise group — all pills rise together from below */}
      <motion.g
        initial={skip ? false : { y: 350, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          y: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
          opacity: { duration: 0.25 },
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
      </motion.g>
    </svg>
  )
}
