import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  ClipboardList,
  FileText,
  Pill,
  AlertTriangle,
  FlaskConical,
  FolderOpen,
  Send,
  Search,
  X,
} from 'lucide-react'
import type { ViewId } from '../types/pmr'
import { useAccessibility } from '../contexts/AccessibilityContext'

interface NavItem {
  id: ViewId
  label: string
  icon: React.ReactNode
}

interface ClinicalSidebarProps {
  activeView: ViewId
  onViewChange: (view: ViewId) => void
  isTablet?: boolean
}

const navItems: NavItem[] = [
  { id: 'summary', label: 'Summary', icon: <ClipboardList size={18} /> },
  { id: 'consultations', label: 'Consultations', icon: <FileText size={18} /> },
  { id: 'medications', label: 'Medications', icon: <Pill size={18} /> },
  { id: 'problems', label: 'Problems', icon: <AlertTriangle size={18} /> },
  { id: 'investigations', label: 'Investigations', icon: <FlaskConical size={18} /> },
  { id: 'documents', label: 'Documents', icon: <FolderOpen size={18} /> },
  { id: 'referrals', label: 'Referrals', icon: <Send size={18} /> },
]

function getCurrentTime(): string {
  const now = new Date()
  return now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ClinicalSidebar({ activeView, onViewChange, isTablet = false }: ClinicalSidebarProps) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [hoveredItem, setHoveredItem] = useState<ViewId | null>(null)
  const navButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { focusAfterLoginRef } = useAccessibility()

  const handleNavClick = useCallback(
    (view: ViewId) => {
      onViewChange(view)
      window.location.hash = view
    },
    [onViewChange]
  )

  const handleNavKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (index < navItems.length - 1) {
          setFocusedIndex(index + 1)
          navButtonRefs.current[index + 1]?.focus()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (index > 0) {
          setFocusedIndex(index - 1)
          navButtonRefs.current[index - 1]?.focus()
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        handleNavClick(navItems[index].id)
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        navButtonRefs.current[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(navItems.length - 1)
        navButtonRefs.current[navItems.length - 1]?.focus()
        break
    }
  }, [handleNavClick])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as ViewId
      if (navItems.some(item => item.id === hash)) {
        onViewChange(hash)
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [onViewChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= '1' && e.key <= '7') {
        e.preventDefault()
        const index = parseInt(e.key) - 1
        if (navItems[index]) {
          const view = navItems[index].id
          onViewChange(view)
          window.location.hash = view
        }
      }
      if (e.key === '/' && !isSearchFocused && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        const searchInput = document.getElementById('sidebar-search')
        searchInput?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onViewChange, isSearchFocused])

  useEffect(() => {
    if (navButtonRefs.current[0]) {
      ;(focusAfterLoginRef as React.MutableRefObject<HTMLButtonElement | null>).current = navButtonRefs.current[0]
    }
  }, [focusAfterLoginRef])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      ;(e.target as HTMLInputElement).blur()
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    const searchInput = document.getElementById('sidebar-search')
    searchInput?.focus()
  }

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return navItems.filter(item =>
      item.label.toLowerCase().includes(query)
    )
  }, [searchQuery])

  if (isTablet) {
    return (
      <aside
        role="navigation"
        aria-label="Clinical record navigation"
        className="hidden md:flex lg:hidden flex-col w-14 h-screen sticky top-0 bg-pmr-sidebar text-white"
      >
        <div className="p-2 border-b border-white/10">
          <div className="font-inter font-medium text-[10px] text-white/50 text-center leading-tight">
            PMR
          </div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          <ul role="menu" aria-label="Record sections">
            {navItems.map((item, index) => (
              <li key={item.id} role="none" className="relative">
                {index === 1 && (
                  <div className="mx-2 my-1 border-t border-white/10" role="separator" aria-hidden="true" />
                )}
                <button
                  ref={el => { navButtonRefs.current[index] = el }}
                  type="button"
                  role="menuitem"
                  tabIndex={focusedIndex === null ? (index === 0 ? 0 : -1) : (focusedIndex === index ? 0 : -1)}
                  aria-current={activeView === item.id ? 'page' : undefined}
                  aria-label={item.label}
                  onClick={() => handleNavClick(item.id)}
                  onKeyDown={e => handleNavKeyDown(e, index)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    w-full flex items-center justify-center h-11
                    transition-colors relative
                    ${activeView === item.id
                      ? 'text-white bg-white/12 border-l-[3px] border-pmr-nhsblue'
                      : 'text-white/70 hover:text-white hover:bg-white/8'}
                  `}
                >
                  <span className={activeView === item.id ? 'text-white' : 'text-white/60'}>
                    {item.icon}
                  </span>
                  {hoveredItem === item.id && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 font-inter">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-2 border-t border-white/10">
          <div className="font-inter text-[9px] text-slate-400 text-center leading-relaxed">
            <div>A.C</div>
            <div>{currentTime}</div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside
      role="navigation"
      aria-label="Clinical record navigation"
      className="hidden lg:flex flex-col w-[220px] h-screen sticky top-0 bg-pmr-sidebar text-white"
    >
      <div className="p-4 border-b border-white/10">
        <div className="font-inter font-medium text-[13px] text-white/50 leading-tight">
          CareerRecord PMR
        </div>
        <div className="font-inter text-[11px] text-white/40 mt-0.5">v1.0.0</div>
      </div>

      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
          <input
            id="sidebar-search"
            type="text"
            placeholder="Search record..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={handleSearchKeyDown}
            className="w-full h-9 pl-8 pr-7 bg-white/5 border border-white/10 rounded text-sm font-inter text-white placeholder-white/40 focus:outline-none focus:border-pmr-nhsblue focus:bg-white/10 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          {searchQuery && filteredItems.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-pmr-sidebar border border-white/10 rounded overflow-hidden z-50">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    handleNavClick(item.id)
                    setSearchQuery('')
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/60">{item.icon}</span>
                  <span className="font-inter text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        <ul role="menu" aria-label="Record sections">
          {navItems.map((item, index) => (
            <li key={item.id} role="none">
              {index === 1 && (
                <div className="mx-3 my-1 border-t border-white/10" role="separator" aria-hidden="true" />
              )}
              <button
                ref={el => { navButtonRefs.current[index] = el }}
                type="button"
                role="menuitem"
                tabIndex={focusedIndex === null ? (index === 0 ? 0 : -1) : (focusedIndex === index ? 0 : -1)}
                aria-current={activeView === item.id ? 'page' : undefined}
                onClick={() => handleNavClick(item.id)}
                onKeyDown={e => handleNavKeyDown(e, index)}
                className={`w-full flex items-center gap-3 h-11 px-4 text-left transition-colors ${
                  activeView === item.id
                    ? 'text-white bg-white/12 border-l-[3px] border-pmr-nhsblue font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
              >
                <span className={activeView === item.id ? 'text-white' : 'text-white/60'}>
                  {item.icon}
                </span>
                <span className="font-inter text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="font-inter text-[11px] text-slate-400 leading-relaxed">
          <div>Session: A.CHARLWOOD</div>
          <div>Logged in: {currentTime}</div>
        </div>
      </div>
    </aside>
  )
}
