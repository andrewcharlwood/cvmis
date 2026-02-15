import {
  User,
  Activity,
  Monitor,
  Award,
  GraduationCap,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { IconColorVariant } from '@/lib/search'

export const iconByType: Record<string, LucideIcon> = {
  role: User,
  skill: Activity,
  project: Monitor,
  achievement: Award,
  edu: GraduationCap,
  action: Zap,
}

export const iconColorStyles: Record<IconColorVariant, { background: string; color: string }> = {
  teal: { background: 'var(--accent-light)', color: 'var(--accent)' },
  green: { background: 'var(--success-light)', color: 'var(--success)' },
  amber: { background: 'var(--amber-light)', color: 'var(--amber)' },
  purple: { background: 'rgba(124,58,237,0.08)', color: '#7C3AED' },
}
