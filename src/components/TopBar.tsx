import { useState, useEffect } from 'react'
import { Home, Search } from 'lucide-react'

interface TopBarProps {
  onSearchClick?: () => void
}

export function TopBar({ onSearchClick }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()))
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 flex items-center justify-between font-ui"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 20px',
        zIndex: 100,
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <Home
          size={18}
          style={{ color: 'var(--accent)' }}
          aria-hidden="true"
        />
        <span
          className="font-ui"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Headhunt Medical Center
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 400,
            color: 'var(--text-tertiary)',
            marginLeft: '2px',
          }}
        >
          Remote
        </span>
      </div>

      {/* Search bar (center) — triggers command palette, no inline search */}
      <button
        type="button"
        onClick={onSearchClick}
        className="hidden md:flex items-center gap-2 cursor-pointer font-ui"
        style={{
          maxWidth: '560px',
          minWidth: '400px',
          height: '42px',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: '0 14px',
          background: 'var(--surface)',
          transition: 'border-color 150ms, box-shadow 150ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-border)'
        }}
        onMouseLeave={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = 'var(--border)'
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,110,110,0.12)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        aria-label="Search records, experience, skills. Press Control plus K"
      >
        <Search
          size={16}
          style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
          aria-hidden="true"
        />
        <span
          className="flex-1 text-left"
          style={{
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Search records, experience, skills...
        </span>
        <kbd
          className="font-geist"
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            background: 'var(--bg-dashboard)',
            border: '1px solid var(--border)',
            padding: '2px 6px',
            borderRadius: '4px',
            lineHeight: 1,
          }}
        >
          Ctrl+K
        </kbd>
      </button>

      {/* Session info (right) */}
      <div className="flex items-center gap-3 shrink-0">
        <span
          className="hidden sm:inline"
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Dr. A.CHARLWOOD
        </span>
        <span
          className="font-geist"
          style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            background: 'var(--accent-light)',
            padding: '3px 10px',
            borderRadius: '4px',
            border: '1px solid var(--accent-border)',
          }}
        >
          Active Session · {currentTime}
        </span>
      </div>
    </header>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
