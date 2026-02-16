import type { ConstellationNode } from '@/types/pmr'

export interface SimNode extends ConstellationNode {
  x: number
  y: number
  vx: number
  vy: number
  fx?: number | null
  fy?: number | null
  homeX: number
  homeY: number
}

export interface SimLink {
  source: SimNode | string
  target: SimNode | string
  strength: number
}

export interface LayoutParams {
  width: number
  height: number
  scaleFactor: number
  isMobile: boolean
  rw: number
  rh: number
  rrx: number
  srDefault: number
  srActive: number
  topPadding: number
  bottomPadding: number
  sidePadding: number
  timelineX: number
  sf: number
}

export interface ConstellationCallbacks {
  onRoleClick: (id: string) => void
  onSkillClick: (id: string) => void
  onNodeHover?: (id: string | null) => void
}

export type AnimationState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'HOLDING' | 'RESETTING'

export interface AnimationStep {
  entityId: string
  startYear: number
  startMonth: number // 0-indexed (0 = January)
  skillIds: string[]
  newSkillIds: string[]
  reinforcedSkillIds: string[]
  linkPairs: Array<{ source: string; target: string }>
}
