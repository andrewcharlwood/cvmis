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
export const LABEL_REST_OPACITY = 0.5

// Link visual params
export const LINK_BASE_WIDTH = 0.5
export const LINK_STRENGTH_WIDTH_FACTOR = 1.5
export const LINK_BASE_OPACITY = 0.04
export const LINK_STRENGTH_OPACITY_FACTOR = 0.06
export const LINK_HIGHLIGHT_BASE_WIDTH = 1
export const LINK_HIGHLIGHT_STRENGTH_WIDTH_FACTOR = 2
export const LINK_BEZIER_VERTICAL_OFFSET = 0.15

// Skill node visual params
export const SKILL_STROKE_WIDTH = 1
export const SKILL_STROKE_OPACITY = 0.4
export const SKILL_SIZE_ROLE_FACTOR = 0.8
export const SKILL_GLOW_STD_DEVIATION = 2.5

// Entry animation
export const ENTRY_GUIDE_FADE_MS = 200
export const ENTRY_ROLE_STAGGER_MS = 80
export const ENTRY_ROLE_DURATION_MS = 300
export const ENTRY_SKILL_STAGGER_MS = 30
export const ENTRY_SKILL_DURATION_MS = 250

// Timeline animation
export const ANIM_ENTITY_REVEAL_MS = 600
export const ANIM_SKILL_REVEAL_MS = 350
export const ANIM_SKILL_STAGGER_MS = 60
export const ANIM_LINK_DRAW_MS = 300
export const ANIM_LINK_STAGGER_MS = 40
export const ANIM_REINFORCEMENT_MS = 350
export const ANIM_STEP_GAP_MS = 400
export const ANIM_HOLD_MS = 3000
export const ANIM_RESET_MS = 400
export const ANIM_RESTART_DELAY_MS = 200
export const ANIM_INTERACTION_RESUME_MS = 800
export const ANIM_SETTLE_ALPHA = 0.05

// Domain color map
export const DOMAIN_COLOR_MAP: Record<string, string> = {
  clinical: '#059669',
  technical: '#0D6E6E',
  leadership: '#D97706',
}

// Media queries (evaluated once at module level)
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const supportsCoarsePointer = window.matchMedia('(pointer: coarse)').matches
