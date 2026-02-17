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
export const SKILL_REST_OPACITY = 0.6
export const SKILL_ACTIVE_OPACITY = 0.9
export const LABEL_REST_OPACITY = 0.6

// Link visual params
export const LINK_BASE_WIDTH = 0.7
export const LINK_STRENGTH_WIDTH_FACTOR = 0
export const LINK_BASE_OPACITY = 0
export const LINK_STRENGTH_OPACITY_FACTOR = 0
export const LINK_REST_OPACITY = 0.12
export const LINK_REST_STRENGTH_FACTOR = 0.08
export const LINK_HIGHLIGHT_BASE_WIDTH = 1
export const LINK_HIGHLIGHT_STRENGTH_WIDTH_FACTOR = 2
export const LINK_BEZIER_VERTICAL_OFFSET = 0.15

// Role node visual params
export const ROLE_STROKE_OPACITY_DEFAULT = 1
export const ROLE_STROKE_OPACITY_ACTIVE = 1
export const ROLE_STROKE_OPACITY_CONNECTED = 0.9
export const ROLE_STROKE_WIDTH_DEFAULT = 1
export const ROLE_STROKE_WIDTH_ACTIVE = 2
export const ROLE_FILL_OPACITY_ACTIVE = 1
export const ROLE_FILL_ACTIVE = '#FFFFFF'

// Skill node visual params
export const SKILL_STROKE_WIDTH = 1
export const SKILL_STROKE_OPACITY = 0.4
export const SKILL_SIZE_ROLE_FACTOR = 0.8
export const SKILL_GLOW_STD_DEVIATION = 2.5
export const SKILL_ACTIVE_STROKE_OPACITY = 0.1

// Skill overlap offsets
export const SKILL_Y_OFFSET_STEP = 25
export const SKILL_Y_OFFSET_STEP_MOBILE = 20
export const SKILL_Y_GLOBAL_OFFSET_RATIO = -0.05
export const SKILL_X_OVERLAP_MAX_RATIO = 1
// Entry animation
export const ENTRY_GUIDE_FADE_MS = 200
export const ENTRY_ROLE_STAGGER_MS = 80
export const ENTRY_ROLE_DURATION_MS = 300
export const ENTRY_SKILL_STAGGER_MS = 30
export const ENTRY_SKILL_DURATION_MS = 250

// Timeline animation
export const ANIM_CHRONOLOGICAL_ENABLED = true
export const ANIM_ENTITY_REVEAL_MS = 2000
export const ANIM_SKILL_REVEAL_MS = 2000
export const ANIM_SKILL_STAGGER_MS = 200
export const ANIM_LINK_DRAW_MS = 600
export const ANIM_LINK_STAGGER_MS = 200
export const ANIM_REINFORCEMENT_MS = 700
export const ANIM_STEP_GAP_MS = 1000
export const ANIM_HOLD_MS = 15000
export const ANIM_RESET_MS = 800
export const ANIM_RESTART_DELAY_MS = 400

export const ANIM_SETTLE_ALPHA = 0.05
export const ANIM_MONTH_STEP_MS = 80

// Domain color map
export const DOMAIN_COLOR_MAP: Record<string, string> = {
  clinical: '#059669',
  technical: '#0D6E6E',
  leadership: '#D97706',
}

// Entities hidden from the constellation (education + early career roles)
export const HIDDEN_ENTITY_IDS = new Set([
  'pre-reg-pharmacist-2015',
  'duty-pharmacy-manager-2016',
  'uea-mpharm-2011',
  'highworth-alevels-2009',
])

// Media queries (evaluated once at module level)
export { prefersReducedMotion } from '@/lib/utils'
export const supportsCoarsePointer = window.matchMedia('(pointer: coarse)').matches
