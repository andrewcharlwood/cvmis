// Sizing
export const MIN_HEIGHT = 400
export const MOBILE_FALLBACK_HEIGHT = 520
export const ROLE_WIDTH = 104
export const ROLE_HEIGHT = 32
export const ROLE_RX = 16
export const SKILL_RADIUS_DEFAULT = 7
export const SKILL_RADIUS_ACTIVE = 11
export const MOBILE_ROLE_WIDTH = 80
export const MOBILE_SKILL_RADIUS_DEFAULT = 6
export const MOBILE_SKILL_RADIUS_ACTIVE = 9
export const MOBILE_LABEL_MAX_LEN = 10

// Animation / opacity
export const HIGHLIGHT_DIM_OPACITY = 0.15
export const SKILL_REST_OPACITY = 0.35
export const SKILL_ACTIVE_OPACITY = 0.9
export const LINK_REST_OPACITY = 0.15
export const LABEL_REST_OPACITY = 0.5

// Domain color map
export const DOMAIN_COLOR_MAP: Record<string, string> = {
  clinical: '#059669',
  technical: '#0D6E6E',
  leadership: '#D97706',
}

// Media queries (evaluated once at module level)
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const supportsCoarsePointer = window.matchMedia('(pointer: coarse)').matches
