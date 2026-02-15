import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface CvmisLogoProps {
  size?: number
  cssHeight?: string
  animated?: boolean
  className?: string
}

export function CvmisLogo({ size, cssHeight, animated = false, className }: CvmisLogoProps) {
  const prefersReducedMotion = useReducedMotion()
  const [animationPhase, setAnimationPhase] = useState<'rise' | 'fan' | 'done'>(
    animated && !prefersReducedMotion ? 'rise' : 'done'
  )

  useEffect(() => {
    if (!animated || prefersReducedMotion) return

    const riseTimer = setTimeout(() => setAnimationPhase('fan'), 500)
    const fanTimer = setTimeout(() => setAnimationPhase('done'), 1000)

    return () => {
      clearTimeout(riseTimer)
      clearTimeout(fanTimer)
    }
  }, [animated, prefersReducedMotion])

  const skipAnimation = !animated || prefersReducedMotion
  const showAll = animationPhase === 'fan' || animationPhase === 'done'

  // The original SVG viewBox is 600pt x 506pt with an internal transform of
  // scale(0.05, -0.05) translate(0, 506). We keep the original coordinate
  // system and let the outer viewBox handle scaling.
  return (
    <svg
      viewBox="0 0 600 506"
      height={cssHeight ? undefined : size}
      className={className}
      role="img"
      aria-label="CVMIS logo"
      style={{ overflow: 'visible', ...(cssHeight ? { height: cssHeight, width: 'auto' } : {}) }}
    >
      <g transform="translate(0,506) scale(0.05,-0.05)" stroke="none">
        {/* Capsule: Rx (Pharmacy) - Left — teal, tilts left in fan */}
        <motion.g
          id="capsule-rx"
          fill="#0b7979"
          initial={skipAnimation ? false : { opacity: 0 }}
          animate={
            skipAnimation
              ? { opacity: 1, rotate: 0, x: 0, y: 0 }
              : showAll
                ? { opacity: 1, rotate: 0, x: 0, y: 0 }
                : { opacity: 0 }
          }
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: '2500px 3000px' }}
        >
          <path d="M2060 6850 c-914 -249 -1279 -1334 -697 -2071 47 -60 198 -225 336 -366 138 -141 256 -265 262 -275 6 -10 150 -160 320 -333 300 -306 1129 -1163 1490 -1542 549 -575 1246 -700 1772 -318 l86 62 -105 35 c-506 172 -872 557 -1036 1089 l-55 179 -11 1003 -12 1003 -550 567 c-780 805 -801 822 -1095 932 -172 65 -531 82 -705 35z m610 -1228 c80 -45 128 -177 97 -261 l-23 -59 99 -21 c147 -31 144 -33 131 87 -10 101 -7 111 54 170 86 83 87 82 102 -73 24 -254 8 -234 213 -270 99 -18 187 -38 194 -45 22 -23 -136 -153 -173 -143 -19 6 -71 16 -115 23 l-82 12 9 -122 c9 -117 6 -126 -57 -191 -80 -83 -99 -74 -99 47 0 52 -6 141 -13 198 l-12 104 -137 31 c-180 41 -244 39 -288 -9 -41 -45 -37 -52 98 -195 l81 -85 -66 -65 -66 -65 -189 200 c-105 110 -232 248 -283 307 l-93 106 159 150 c236 222 314 251 459 169z" />
          <path d="M2395 5412 c-112 -103 -113 -108 -37 -180 65 -63 93 -57 185 41 73 77 81 140 26 196 -47 46 -70 39 -174 -57z" />
        </motion.g>

        {/* Capsule: Terminal (Code) - Centre — amber, stays upright */}
        <motion.g
          id="capsule-terminal"
          fill="#d97706"
          initial={skipAnimation ? false : { opacity: 0 }}
          animate={
            skipAnimation
              ? { opacity: 1, rotate: 0, x: 0, y: 0 }
              : showAll
                ? { opacity: 1, rotate: 0, x: 0, y: 0 }
                : { opacity: 0 }
          }
          transition={{ duration: 0.5, ease: 'easeOut', delay: skipAnimation ? 0 : 0.05 }}
          style={{ transformOrigin: '5500px 5000px' }}
        >
          <path d="M5740 8362 c-476 -105 -891 -512 -1015 -997 -45 -173 -54 -3865 -11 -4070 50 -233 182 -483 355 -671 185 -201 701 -447 777 -371 11 11 -100 221 -119 267 -19 46 -18 106 -37 200 -66 317 -11 705 143 1010 120 237 111 226 917 1060 255 264 493 513 528 554 l65 74 -8 916 c-9 1115 -24 1196 -286 1542 -286 377 -851 587 -1309 486z m31 -1595 c115 -118 209 -223 209 -236 0 -12 -97 -118 -215 -236 l-215 -215 -55 48 c-75 64 -76 62 103 244 l159 162 -159 158 c-175 174 -176 176 -115 242 62 65 57 68 288 -167z m825 -613 l-6 -64 -295 -6 -295 -5 0 75 0 76 301 -6 301 -6 -6 -64z" />
        </motion.g>

        {/* Capsule: Data (Analytics) - Right — green, the "rising" capsule */}
        <motion.g
          id="capsule-data"
          fill="#059669"
          initial={
            skipAnimation
              ? false
              : { opacity: 0, scale: 0, y: 2000 }
          }
          animate={
            skipAnimation
              ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
              : animationPhase === 'rise'
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 1, scale: 1, y: 0, rotate: 0 }
          }
          transition={{
            duration: 0.5,
            ease: 'easeOut',
            delay: skipAnimation ? 0 : (animationPhase === 'fan' ? 0.1 : 0),
          }}
          style={{ transformOrigin: '9000px 3000px' }}
        >
          <path d="M9380 6850 c-351 -63 -390 -94 -1322 -1027 -1753 -1757 -1929 -1943 -2039 -2162 -455 -906 300 -1962 1305 -1822 381 53 567 178 1165 785 2249 2284 2186 2217 2302 2468 432 933 -380 1945 -1411 1758z m35 -1254 l83 -86 -325 -325 -325 -325 -89 91 -89 91 319 319 c369 370 320 342 426 235z m-502 -59 c88 -86 90 -81 -108 -280 l-175 -176 -86 85 -85 84 175 174 c201 201 192 197 279 113z m1036 -132 c11 -8 47 -44 79 -80 l60 -65 -409 -409 -409 -409 -86 84 -86 84 405 405 c223 224 410 406 416 406 5 0 19 -7 30 -16z m-460 -164 l79 -81 -254 -254 -254 -254 -81 79 c-99 97 -115 63 168 349 276 279 243 263 342 161z" />
        </motion.g>
      </g>
    </svg>
  )
}
