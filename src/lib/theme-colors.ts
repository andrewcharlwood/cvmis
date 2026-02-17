/** Semantic dot/accent colors used across Card, DetailPanel, KPIs */
export const DOT_COLORS = {
  teal: '#0D6E6E',
  amber: '#D97706',
  green: '#059669',
  alert: '#DC2626',
  purple: '#7C3AED',
} as const

export type DotColorName = keyof typeof DOT_COLORS

/** KPI color variants (subset of DOT_COLORS) */
export const KPI_COLORS: Record<'green' | 'amber' | 'teal', string> = {
  green: DOT_COLORS.green,
  amber: DOT_COLORS.amber,
  teal: DOT_COLORS.teal,
}

/** Project/investigation status colors */
export const PROJECT_STATUS_COLORS: Record<'Complete' | 'Ongoing' | 'Live', string> = {
  Complete: '#059669',
  Ongoing: '#D97706',
  Live: '#0D6E6E',
}

/** Default org color fallback when consultation.orgColor is undefined */
export const DEFAULT_ORG_COLOR = '#0D6E6E'
