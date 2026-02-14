import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { TopBar } from './TopBar'
import { SubNav } from './SubNav'
import Sidebar from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { DetailPanel } from './DetailPanel'
import { CardHeader } from './Card'
import { PatientSummaryTile } from './tiles/PatientSummaryTile'
import { EducationSubsection } from './EducationSubsection'
import { ProjectsTile } from './tiles/ProjectsTile'
import { ParentSection } from './ParentSection'
import CareerConstellation from './CareerConstellation'
import { WorkExperienceSubsection } from './WorkExperienceSubsection'
import { RepeatMedicationsSubsection } from './RepeatMedicationsSubsection'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { consultations } from '@/data/consultations'
import { skills } from '@/data/skills'
import type { PaletteAction } from '@/lib/search'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const topbarVariants = {
  hidden: prefersReducedMotion ? { y: 0, opacity: 1 } : { y: -48, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.2, ease: 'easeOut' },
  },
}

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

function LastConsultationSubsection() {
  const { openPanel } = useDetailPanel()
  const consultation = consultations[0]

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
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-tertiary)',
    marginBottom: '3px',
  }

  const fieldValueStyle: React.CSSProperties = {
    fontSize: '11.5px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <CardHeader dotColor="green" title="LAST CONSULTATION" rightText="Most recent role" />

      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenPanel}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
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
          e.currentTarget.style.backgroundColor = 'rgba(10,128,128,0.04)'
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
          fontSize: '13.5px',
          fontWeight: 600,
          color: 'var(--accent)',
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
              fontSize: '12.5px',
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
                top: '7px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
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
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--accent)',
          background: 'transparent',
          border: 'none',
          padding: '6px 0',
          minHeight: '44px',
          cursor: 'pointer',
          transition: 'color 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--accent-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--accent)'
        }}
        aria-label="View full consultation record"
      >
        <span>View full record</span>
        <ChevronRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export function DashboardLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null)
  const activeSection = useActiveSection()
  const { openPanel } = useDetailPanel()

  const handleSearchClick = () => {
    setCommandPaletteOpen(true)
  }

  const handlePaletteClose = useCallback(() => {
    setCommandPaletteOpen(false)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSectionClick = useCallback((_sectionId: string) => {
    // SubNav handles scrolling internally
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
        const tileEl = document.querySelector(`[data-tile-id="${action.tileId}"]`)
        if (tileEl) {
          tileEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
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
  }, [openPanel])

  return (
    <div
      className="font-ui"
      style={{ background: 'var(--bg-dashboard)', minHeight: '100vh' }}
    >
      {/* TopBar — fixed at top */}
      <motion.div initial="hidden" animate="visible" variants={topbarVariants}>
        <TopBar onSearchClick={handleSearchClick} />
      </motion.div>

      {/* SubNav — sticky below TopBar */}
      <SubNav activeSection={activeSection} onSectionClick={handleSectionClick} />

      {/* Layout below TopBar + SubNav: Sidebar + Main */}
      <div
        style={{
          display: 'flex',
          marginTop: 'calc(var(--topbar-height) + var(--subnav-height))',
          height: 'calc(100vh - var(--topbar-height) - var(--subnav-height))',
        }}
      >
        {/* Sidebar — hidden on mobile/tablet, visible on desktop */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          className="hidden lg:block"
          style={{ flexShrink: 0 }}
        >
          <Sidebar />
        </motion.div>

        {/* Main content — scrollable card grid */}
        <motion.main
          id="main-content"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          aria-label="Dashboard content"
          className="pmr-scrollbar p-4 pb-8 md:p-6 md:pb-10 lg:px-7 lg:pt-6 lg:pb-10"
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <div className="dashboard-grid">
            {/* PatientSummaryTile — full width (includes Latest Results subsection) */}
            <PatientSummaryTile />

            {/* ProjectsTile — half width */}
            <ProjectsTile />

            {/* Patient Pathway — parent section with constellation graph + subsections */}
            <ParentSection title="Patient Pathway" tileId="patient-pathway">
              <CareerConstellation
                onRoleClick={handleRoleClick}
                onSkillClick={handleSkillClick}
                highlightedNodeId={highlightedNodeId}
              />

              {/* Last Consultation subsection */}
              <LastConsultationSubsection />

              {/* Two-column experience/skills grid */}
              <div className="pathway-columns" style={{ marginTop: '24px' }}>
                <WorkExperienceSubsection onNodeHighlight={handleNodeHighlight} />
                <RepeatMedicationsSubsection onNodeHighlight={handleNodeHighlight} />
              </div>

              {/* Education subsection */}
              <EducationSubsection />
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
    </div>
  )
}
