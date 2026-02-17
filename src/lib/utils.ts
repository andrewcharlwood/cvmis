export function calculateSkillOffset(level: number, radius: number): number {
  const circumference = 2 * Math.PI * radius
  return circumference * (1 - level / 100)
}

export function formatBootLine(text: string): string {
  return text
}

export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Returns a framer-motion transition that respects prefers-reduced-motion */
export function motionSafeTransition(
  duration: number,
  ease: string = 'easeOut',
  delay: number = 0
): { duration: number; ease?: string; delay?: number } {
  if (prefersReducedMotion) return { duration: 0 }
  return { duration, ease, ...(delay ? { delay } : {}) }
}
