import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Sidebar from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { DetailPanel } from './DetailPanel'
import { CardHeader } from './Card'
import { PatientSummaryTile } from './tiles/PatientSummaryTile'
import { ProjectsTile } from './tiles/ProjectsTile'
import { ParentSection } from './ParentSection'
import CareerConstellation from './CareerConstellation'
import { TimelineInterventionsSubsection } from './TimelineInterventionsSubsection'
import { RepeatMedicationsSubsection } from './RepeatMedicationsSubsection'
import { ChatWidget } from './ChatWidget'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { consultations } from '@/data/consultations'
import { skills } from '@/data/skills'
import type { PaletteAction } from '@/lib/search'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const sidebarVariants = {
  hidden: prefersReducedMotion ? { x: 0, opacity: 1 } : { x: -272, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.25, ease: 'easeOut', delay: 0.05 },
  },
}

const contentVariants = {
  hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0 },
  visible: {
    opacity: 1,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.3, delay: 0.15 },
  },
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

interface LastConsultationSubsectionProps {
  highlightedRoleId?: string | null
}

function LastConsultationSubsection({ highlightedRoleId }: LastConsultationSubsectionProps) {
  const { openPanel } = useDetailPanel()
  const consultation = consultations[0]
  const isHighlighted = highlightedRoleId === consultation.id

  const handleOpenPanel = () => {
    openPanel({ type: 'consultation', consultation })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpenPanel()
    }
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  }

  const getEmploymentType = (): string => {
    if (consultation.organization.includes('ICB')) {
      return 'Permanent · Full-time'
    }
    return 'Permanent'
  }

  const getBand = (): string => {
    if (consultation.role.includes('Head')) {
      return '8a'
    }
    return '—'
  }

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-tertiary)',
    marginBottom: '3px',
  }

  const fieldValueStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  }

  return (
    <div
      style={{
        marginTop: '24px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid',
        borderColor: isHighlighted ? hexToRgba(consultation.orgColor ?? '#0D6E6E', 0.2) : 'transparent',
        background: isHighlighted ? hexToRgba(consultation.orgColor ?? '#0D6E6E', 0.03) : 'transparent',
        transition: 'border-color 150ms ease-out, background-color 150ms ease-out',
        padding: '8px',
        margin: '-8px',
      }}
    >
      <CardHeader dotColor="green" title="LAST CONSULTATION" rightText="Most recent role" />

      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenPanel}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '14px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-light)',
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          padding: '8px',
          margin: '-8px -8px 14px -8px',
          transition: 'background-color 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgba(consultation.orgColor ?? '#0D6E6E', 0.04)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        aria-label={`View full details for ${consultation.role}`}
      >
        <div>
          <div style={fieldLabelStyle}>Date</div>
          <div style={fieldValueStyle}>{formatDate(consultation.date)}</div>
        </div>
        <div>
          <div style={fieldLabelStyle}>Organisation</div>
          <div style={fieldValueStyle}>{consultation.organization}</div>
        </div>
        <div>
          <div style={fieldLabelStyle}>Type</div>
          <div style={fieldValueStyle}>{getEmploymentType()}</div>
        </div>
        <div>
          <div style={fieldLabelStyle}>Band</div>
          <div style={fieldValueStyle}>{getBand()}</div>
        </div>
      </div>

      <div
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: consultation.orgColor ?? 'var(--accent)',
          marginBottom: '12px',
        }}
      >
        {consultation.role}
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
          marginBottom: '16px',
        }}
      >
        {consultation.examination.map((bullet, index) => (
          <li
            key={index}
            style={{
              fontSize: '14px',
              color: 'var(--text-primary)',
              paddingLeft: '16px',
              lineHeight: '1.5',
              position: 'relative',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '0',
                top: '8px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: consultation.orgColor ?? 'var(--accent)',
                opacity: 0.5,
              }}
            />
            {bullet}
          </li>
        ))}
      </ul>

      <button
        onClick={handleOpenPanel}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 500,
          color: consultation.orgColor ?? 'var(--accent)',
          background: 'transparent',
          border: 'none',
          padding: '6px 0',
          minHeight: '44px',
          cursor: 'pointer',
          transition: 'opacity 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.7'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        aria-label="View full consultation record"
      >
        <span>View full record</span>
        <ChevronRight size={15} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export function DashboardLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null)
  const [highlightedRoleId, setHighlightedRoleId] = useState<string | null>(null)
  const [chronologyHeight, setChronologyHeight] = useState<number | null>(null)
  const chronologyRef = useRef<HTMLDivElement>(null)
  const activeSection = useActiveSection()
  const { openPanel } = useDetailPanel()

  // Measure the chronology stream height so the constellation graph can match it
  useEffect(() => {
    const el = chronologyRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChronologyHeight(entry.contentRect.height)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handlePaletteClose = useCallback(() => {
    setCommandPaletteOpen(false)
  }, [])

  const handleSearchClick = useCallback(() => {
    setCommandPaletteOpen(true)
  }, [])

  const scrollToSection = useCallback((tileId: string) => {
    const tileEl = document.querySelector(`[data-tile-id="${tileId}"]`)
    if (tileEl) {
      tileEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Constellation graph handlers
  const handleRoleClick = useCallback(
    (roleId: string) => {
      const consultation = consultations.find((c) => c.id === roleId)
      if (consultation) {
        openPanel({ type: 'career-role', consultation })
      }
    },
    [openPanel],
  )

  const handleSkillClick = useCallback(
    (skillId: string) => {
      const skill = skills.find((s) => s.id === skillId)
      if (skill) {
        openPanel({ type: 'skill', skill })
      }
    },
    [openPanel],
  )

  const handleNodeHighlight = useCallback((id: string | null) => {
    setHighlightedNodeId(id)
  }, [])

  const handleNodeHover = useCallback((id: string | null) => {
    setHighlightedRoleId(id)
  }, [])

  // Global Ctrl+K listener to open command palette
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle palette actions (scroll to tile, expand item, open link, download)
  const handlePaletteAction = useCallback((action: PaletteAction) => {
    switch (action.type) {
      case 'scroll': {
        scrollToSection(action.tileId)
        break
      }
      case 'expand': {
        const tileEl = document.querySelector(`[data-tile-id="${action.tileId}"]`)
        if (tileEl) {
          tileEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          // Dispatch a custom event that the tile can listen for to expand the item
          const expandEvent = new CustomEvent('palette-expand', {
            detail: { tileId: action.tileId, itemId: action.itemId },
          })
          document.dispatchEvent(expandEvent)
        }
        break
      }
      case 'link': {
        window.open(action.url, '_blank', 'noopener,noreferrer')
        break
      }
      case 'download': {
        // For now, open the CV file or trigger a download
        // This can be wired to an actual PDF when available
        window.open('/References/CV_v4.md', '_blank')
        break
      }
      case 'panel': {
        openPanel(action.panelContent)
        break
      }
    }
  }, [openPanel, scrollToSection])

  return (
    <div
      className="font-ui"
      style={{ background: 'var(--bg-dashboard)', height: '100vh', overflow: 'hidden' }}
    >
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-48px',
          left: 0,
          background: 'var(--accent)',
          color: '#FFFFFF',
          padding: '8px 16px',
          textDecoration: 'none',
          zIndex: 120,
          borderRadius: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: 600,
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = '0'
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = '-48px'
        }}
      >
        Skip to main content
      </a>

      <div
        style={{
          display: 'flex',
          height: '100%',
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          style={{ flexShrink: 0 }}
        >
          <Sidebar
            activeSection={activeSection}
            onNavigate={scrollToSection}
            onSearchClick={handleSearchClick}
          />
        </motion.div>

        <motion.main
          id="main-content"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          aria-label="Dashboard content"
          className="dashboard-main pmr-scrollbar p-5 pb-10 md:p-7 md:pb-12 lg:px-8 lg:pt-7 lg:pb-12"
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <div className="dashboard-grid">
            {/* PatientSummaryTile — full width (includes Latest Results subsection) */}
            <PatientSummaryTile />

            {/* ProjectsTile — full width */}
            <ProjectsTile />

            {/* Patient Pathway — parent section with constellation graph + subsections */}
            <ParentSection title="Patient Pathway" tileId="patient-pathway">
              <div className="pathway-columns">
                <div ref={chronologyRef} className="chronology-stream" data-tile-id="section-experience">
                  <div
                    style={{
                      marginBottom: '14px',
                      padding: '10px 12px',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-dashboard)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-tertiary)',
                        marginBottom: '4px',
                        fontFamily: 'var(--font-geist-mono)',
                      }}
                    >
                      Clinical Record Stream
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Chronological role and education entries. Select items to inspect full records.
                    </div>
                  </div>

                  <div className="chronology-item">
                    <LastConsultationSubsection highlightedRoleId={highlightedRoleId} />
                  </div>

                  <div className="chronology-item">
                    <TimelineInterventionsSubsection onNodeHighlight={handleNodeHighlight} highlightedRoleId={highlightedRoleId} />
                  </div>
                </div>
                <div className="pathway-graph-sticky">
                  <CareerConstellation
                    onRoleClick={handleRoleClick}
                    onSkillClick={handleSkillClick}
                    onNodeHover={handleNodeHover}
                    highlightedNodeId={highlightedNodeId}
                    containerHeight={chronologyHeight}
                  />
                </div>


              </div>

              <div data-tile-id="section-skills" style={{ marginTop: '22px' }}>
                <RepeatMedicationsSubsection onNodeHighlight={handleNodeHighlight} />
              </div>
            </ParentSection>
          </div>
        </motion.main>
      </div>

      {/* Command palette overlay */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={handlePaletteClose}
        onAction={handlePaletteAction}
      />

      {/* Detail panel */}
      <DetailPanel />

      {/* Floating chat widget */}
      <ChatWidget onAction={handlePaletteAction} />
    </div>
  )
}
