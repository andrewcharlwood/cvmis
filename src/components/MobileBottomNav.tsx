import { ClipboardList, FileText, Pill, AlertTriangle, FlaskConical, FolderOpen, Send } from 'lucide-react'
import type { ViewId } from '../types/pmr'

interface NavItem {
  id: ViewId
  label: string
  shortLabel: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'summary', label: 'Summary', shortLabel: 'Summary', icon: <ClipboardList size={20} /> },
  { id: 'consultations', label: 'Experience', shortLabel: 'Exp', icon: <FileText size={20} /> },
  { id: 'medications', label: 'Skills', shortLabel: 'Skills', icon: <Pill size={20} /> },
  { id: 'problems', label: 'Achievements', shortLabel: 'Achieve', icon: <AlertTriangle size={20} /> },
  { id: 'investigations', label: 'Projects', shortLabel: 'Projects', icon: <FlaskConical size={20} /> },
  { id: 'documents', label: 'Education', shortLabel: 'Edu', icon: <FolderOpen size={20} /> },
  { id: 'referrals', label: 'Contact', shortLabel: 'Contact', icon: <Send size={20} /> },
]

interface MobileBottomNavProps {
  activeView: ViewId
  onViewChange: (view: ViewId) => void
}

export function MobileBottomNav({ activeView, onViewChange }: MobileBottomNavProps) {
  const handleNavClick = (view: ViewId) => {
    onViewChange(view)
    window.location.hash = view
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-pmr-sidebar border-t border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`
                  flex flex-col items-center justify-center
                  w-12 h-14 rounded-lg
                  transition-colors duration-100
                  ${isActive 
                    ? 'text-pmr-nhsblue' 
                    : 'text-white/60 hover:text-white/90'}
                `}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                {item.icon}
                <span className="text-[10px] mt-0.5 font-ui font-medium">
                  {item.shortLabel}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
