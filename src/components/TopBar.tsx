import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { CvmisLogo } from './CvmisLogo'

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
      {/* Skip to main content link (only visible on focus) */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '0',
          background: 'var(--accent)',
          color: '#FFFFFF',
          padding: '8px 16px',
          textDecoration: 'none',
          zIndex: 101,
          borderRadius: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: 600,
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = '0'
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = '-40px'
        }}
      >
        Skip to main content
      </a>
      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <CvmisLogo size={24} />
        <span
          className="font-ui hidden sm:inline"
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Headhunt Medical Center
        </span>
        <span
          className="font-ui sm:hidden"
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          HMC
        </span>
        <span
          className="hidden lg:inline"
          style={{
            fontSize: '12px',
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
        className="hidden lg:flex items-center gap-2 cursor-pointer font-ui"
        style={{
          maxWidth: '560px',
          minWidth: '400px',
          height: '46px',
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
          size={17}
          style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
          aria-hidden="true"
        />
        <span
          className="flex-1 text-left"
          style={{
            fontSize: '14px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Search records, experience, skills...
        </span>
        <kbd
          className="font-geist"
          style={{
            fontSize: '11px',
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
      <div
        className="flex items-center gap-2 sm:gap-3 shrink-0"
        aria-label="Active session information"
      >
        <span
          className="hidden sm:inline"
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          A.RECRUITER
        </span>
        <span
          className="font-geist hidden xs:inline"
          style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            background: 'var(--accent-light)',
            padding: '3px 10px',
            borderRadius: '4px',
            border: '1px solid var(--accent-border)',
          }}
        >
          Active Session · {currentTime}
        </span>
        <span
          className="font-geist xs:hidden"
          style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            background: 'var(--accent-light)',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid var(--accent-border)',
          }}
        >
          {currentTime}
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
