import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  Download,
  Github,
  Linkedin,
  type LucideIcon,
  Menu,
  Search,
  Send,
  UserRound,
  Workflow,
  Wrench,
  X,
} from 'lucide-react'
import { useIsMobileNav } from '@/hooks/useIsMobileNav'
import { CvmisLogo } from './CvmisLogo'
import { PhoneCaptcha } from './PhoneCaptcha'
import { ReferralFormModal } from './ReferralFormModal'
import { patient } from '@/data/patient'
import { tags } from '@/data/tags'
import { getSidebarCopy } from '@/lib/profile-content'
import type { Tag } from '@/types/pmr'

interface SidebarProps {
  activeSection: string
  onNavigate: (tileId: string) => void
  onSearchClick: () => void
}

interface NavSection {
  id: string
  label: string
  tileId: string
  Icon: LucideIcon
}

const navSections: NavSection[] = [
  { id: 'overview', label: 'Overview / Highlights', tileId: 'patient-summary', Icon: UserRound },
  { id: 'experience', label: 'Experience', tileId: 'section-experience', Icon: Workflow },
  { id: 'skills', label: 'Skills', tileId: 'section-skills', Icon: Wrench },
]

interface SectionTitleProps {
  children: ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-tertiary)',
        marginBottom: '10px',
      }}
    >
      <span>{children}</span>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'var(--border-light)',
        }}
      />
    </div>
  )
}

interface TagPillProps {
  tag: Tag
}

function TagPill({ tag }: TagPillProps) {
  const styles: Record<Tag['colorVariant'], CSSProperties> = {
    teal: {
      background: 'var(--accent-light)',
      color: 'var(--accent)',
      border: '1px solid var(--accent-border)',
    },
    amber: {
      background: 'var(--amber-light)',
      color: 'var(--amber)',
      border: '1px solid var(--amber-border)',
    },
    green: {
      background: 'var(--success-light)',
      color: 'var(--success)',
      border: '1px solid var(--success-border)',
    },
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        fontSize: '12px',
        fontWeight: 500,
        padding: '4px 10px',
        borderRadius: '4px',
        lineHeight: 1.3,
        ...styles[tag.colorVariant],
      }}
    >
      {tag.label}
    </span>
  )
}

export default function Sidebar({ activeSection, onNavigate, onSearchClick }: SidebarProps) {
  const sidebarCopy = getSidebarCopy()
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const isMobileNav = useIsMobileNav()
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)
  const [showReferralForm, setShowReferralForm] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const updateDesktopState = (event: MediaQueryListEvent | MediaQueryList) => {
      const desktopMode = event.matches
      setIsDesktop(desktopMode)
      if (desktopMode) {
        setIsMobileExpanded(false)
      }
    }

    updateDesktopState(mediaQuery)

    const listener = (event: MediaQueryListEvent) => updateDesktopState(event)
    mediaQuery.addEventListener('change', listener)

    return () => {
      mediaQuery.removeEventListener('change', listener)
    }
  }, [])

  const isExpanded = isDesktop || isMobileExpanded

  const handleNavActivate = (tileId: string) => {
    onNavigate(tileId)
    if (!isDesktop) {
      setIsMobileExpanded(false)
    }
  }

  if (isMobileNav) return null

  return (
    <>
      {!isDesktop && isMobileExpanded && (
        <button
          type="button"
          aria-label="Close sidebar navigation"
          onClick={() => setIsMobileExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26,43,42,0.28)',
            border: 'none',
            zIndex: 108,
            cursor: 'pointer',
          }}
        />
      )}

      <aside
        id="sidebar-panel"
        aria-label="Sidebar"
        style={{
          position: isDesktop ? 'relative' : 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          height: isDesktop ? '100%' : undefined,
          width: isExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-rail-width)',
          minWidth: isExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-rail-width)',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border)',
          overflowY: isExpanded ? 'auto' : 'hidden',
          overflowX: 'hidden',
          padding: isExpanded ? '6px 16px' : '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transition: 'width 180ms ease-out, min-width 180ms ease-out, padding 180ms ease-out',
          zIndex: isDesktop ? 'auto' : 110,
        }}
        className={isExpanded ? 'pmr-scrollbar' : undefined}
      >
        {!isDesktop && (
          <button
            type="button"
            aria-label={isExpanded ? 'Collapse sidebar navigation' : 'Expand sidebar navigation'}
            aria-expanded={isExpanded}
            aria-controls="sidebar-panel"
            onClick={() => setIsMobileExpanded((prev) => !prev)}
            className="sidebar-control"
            style={{
              width: '100%',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: isExpanded ? 'space-between' : 'center',
              gap: '8px',
              border: '1px solid var(--border-light)',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              padding: isExpanded ? '0 12px' : '0',
              cursor: 'pointer',
            }}
          >
            {isExpanded && <span style={{ fontSize: '12px', fontWeight: 600 }}>{sidebarCopy.menuLabel}</span>}
            {isExpanded ? <X size={17} strokeWidth={2.4} /> : <Menu size={18} strokeWidth={2.4} />}
          </button>
        )}

        {isExpanded && (
          <section style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                gap: '6px',
                marginBottom: '4px',
                width: '100%',
              }}
            >
              <CvmisLogo cssHeight="48px" />
                          <button
              type="button"
              onClick={onSearchClick}
              className="sidebar-control"
              aria-label={sidebarCopy.searchAriaLabel}
              style={{
                width: '100%',
                minHeight: '44px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 10px',
                cursor: 'pointer',
              }}
            >
              <Search size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} aria-hidden="true" />
              <span style={{ flex: 1, textAlign: 'left', fontSize: '13px' }}>
                {sidebarCopy.searchLabel}
              </span>
              <kbd
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
                {sidebarCopy.searchShortcut}
              </kbd>
            </button>

            </div>



            <SectionTitle>{sidebarCopy.sectionTitle}</SectionTitle>

            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #0A8080)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(13,110,110,0.25)',
                marginBottom: '12px',
              }}
            >
              AC
            </div>

            <div
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              CHARLWOOD, Andrew
            </div>

            <div
              style={{
                fontSize: '13px',
                fontFamily: 'Geist Mono, monospace',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                marginTop: '2px',
              }}
            >
              {sidebarCopy.roleTitle}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '8px',
                marginTop: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  padding: '4px 0',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{sidebarCopy.gphcLabel}</span>
                <span
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: '12px',
                    letterSpacing: '0.12em',
                  }}
                >
                  {patient.nhsNumber.replace(/\s/g, '')}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  padding: '4px 0',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{sidebarCopy.educationLabel}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right' }}>
                  {patient.qualification}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  padding: '4px 0',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{sidebarCopy.locationLabel}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right' }}>
                  {patient.address}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  padding: '4px 0',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{sidebarCopy.phoneLabel}</span>
                <PhoneCaptcha phone={patient.phone} />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  padding: '4px 0',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{sidebarCopy.emailLabel}</span>
                <a
                  href={`mailto:${patient.email}`}
                  style={{
                    color: 'var(--accent)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    textAlign: 'right',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {patient.email}
                </a>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  padding: '4px 0',
                }}
              >
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{sidebarCopy.registeredLabel}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right' }}>
                  {patient.registrationYear}
                </span>
              </div>
            </div>
            <a
              href="/References/CV_v4.md"
              target="_blank"
              rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: '1px solid var(--accent-border)',
                    background: 'var(--surface)',
                    color: 'var(--accent)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    //fontFamily: 'var(--font-geist-mono)',
                    letterSpacing: '0.03em',
                    transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              
              <Download size={14} />
              Download CV
            </a>
          </section>
        )}

        <section>
          {isExpanded && <SectionTitle>{sidebarCopy.navigationTitle}</SectionTitle>}
          <nav aria-label="Sidebar navigation" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navSections.map((section) => {
              const isActive = activeSection === section.id
              const Icon = section.Icon

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavActivate(section.tileId)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={!isExpanded ? section.label : undefined}
                  className="sidebar-control"
                  style={{
                    minHeight: '44px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--accent-border)' : 'transparent',
                    background: isActive ? 'var(--accent-light)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isExpanded ? 'flex-start' : 'center',
                    gap: '10px',
                    padding: isExpanded ? '0 10px' : '0',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease-out, color 150ms ease-out, border-color 150ms ease-out',
                  }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                  {isExpanded && (
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {section.label}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </section>

        {isExpanded && (
          <>
            <section style={{ paddingTop: '4px' }}>
              <SectionTitle>Contact</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                
                <button
                  type="button"
                  onClick={() => setShowReferralForm(true)}
                  className="sidebar-control"
                  style={{
                    width: '100%',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: '1px solid var(--accent-border)',
                    background: 'var(--surface)',
                    color: 'var(--accent)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    //fontFamily: 'var(--font-geist-mono)',
                    letterSpacing: '0.03em',
                    transition: 'border-color 150ms, color 150ms',
                  }}
                >
                  <Send size={14} />
                  Contact patient
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <a
                    href="https://linkedin.com/in/andycharlwood"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-control"
                    style={{
                      flex: 1,
                      minHeight: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      border: '1px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'border-color 150ms, color 150ms',
                    }}
                  >
                    <Linkedin size={14} />
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/andycharlwood"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-control"
                    style={{
                      flex: 1,
                      minHeight: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      border: '1px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'border-color 150ms, color 150ms',
                    }}
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                </div>
              </div>
            </section>

            <section style={{ paddingTop: '8px' }}>
              <SectionTitle>{sidebarCopy.tagsTitle}</SectionTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {tags.map((tag) => (
                  <TagPill key={tag.label} tag={tag} />
                ))}
              </div>
            </section>
          </>
        )}
      </aside>
      <ReferralFormModal isOpen={showReferralForm} onClose={() => setShowReferralForm(false)} />
    </>
  )
}
