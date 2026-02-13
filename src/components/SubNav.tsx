interface NavSection {
  id: string
  label: string
  tileId: string  // data-tile-id to scroll to
}

interface SubNavProps {
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

const sections: NavSection[] = [
  { id: 'overview', label: 'Overview', tileId: 'patient-summary' },
  { id: 'skills', label: 'Skills', tileId: 'core-skills' },
  { id: 'experience', label: 'Experience', tileId: 'career-activity' },
  { id: 'projects', label: 'Projects', tileId: 'projects' },
  { id: 'education', label: 'Education', tileId: 'education' },
]

export function SubNav({ activeSection, onSectionClick }: SubNavProps) {
  const handleSectionClick = (section: NavSection) => {
    // Scroll to the tile
    const tileEl = document.querySelector(`[data-tile-id="${section.tileId}"]`)
    if (tileEl) {
      tileEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Notify parent of section change
    onSectionClick(section.id)
  }

  return (
    <nav
      aria-label="Section navigation"
      style={{
        position: 'sticky',
        top: 'var(--topbar-height)',
        zIndex: 99,
        height: 'var(--subnav-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id

        return (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section)}
            aria-current={isActive ? 'true' : undefined}
            style={{
              position: 'relative',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              padding: '0 0 2px 0',
              cursor: 'pointer',
              transition: 'color 200ms ease-out',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {section.label}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--accent)',
                  transition: 'all 200ms ease-out',
                }}
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
