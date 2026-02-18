import { ClipboardList, UserRound, Workflow, Wrench } from 'lucide-react'
import { useIsMobileNav } from '@/hooks/useIsMobileNav'

interface MobileBottomNavProps {
  activeSection: string
  onNavigate: (tileId: string) => void
}

const navItems = [
  { id: 'overview', label: 'Overview', tileId: 'mobile-overview', Icon: UserRound },
  { id: 'summary', label: 'Summary', tileId: 'patient-summary', Icon: ClipboardList },
  { id: 'experience', label: 'Experience', tileId: 'section-experience', Icon: Workflow },
  { id: 'skills', label: 'Skills', tileId: 'section-skills', Icon: Wrench },
]

export function MobileBottomNav({ activeSection, onNavigate }: MobileBottomNavProps) {
  const isMobileNav = useIsMobileNav()

  if (!isMobileNav) return null

  return (
    <nav
      aria-label="Mobile navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: 'var(--sidebar-bg)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.map((item) => {
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.tileId)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              width: '44px',
              height: '44px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
              transition: 'color 150ms',
            }}
          >
            <item.Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
