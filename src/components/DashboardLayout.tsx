import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { DetailPanel } from './DetailPanel'
import { PatientSummaryTile } from './tiles/PatientSummaryTile'
import { ParentSection } from './ParentSection'
import CareerConstellation from './constellation/CareerConstellation'
import { TimelineInterventionsSubsection } from './TimelineInterventionsSubsection'
import { RepeatMedicationsSubsection } from './RepeatMedicationsSubsection'
import { LastConsultationCard } from './LastConsultationCard'
import { ChatWidget } from './ChatWidget'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { timelineConsultations } from '@/data/timeline'
import { skills } from '@/data/skills'
import type { PaletteAction } from '@/lib/search'
import { prefersReducedMotion, motionSafeTransition } from '@/lib/utils'

const sidebarVariants = {
  hidden: prefersReducedMotion ? { x: 0, opacity: 1 } : { x: -272, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: motionSafeTransition(0.25, 'easeOut', 0.05),
  },
}

const contentVariants = {
  hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0 },
  visible: {
    opacity: 1,
    transition: motionSafeTransition(0.3, 'easeOut', 0.15),
  },
}

export function DashboardLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null)
  const [highlightedRoleId, setHighlightedRoleId] = useState<string | null>(null)
  const [chronologyHeight, setChronologyHeight] = useState<number | null>(null)
  const [constellationReady, setConstellationReady] = useState(false)
  const chronologyRef = useRef<HTMLDivElement>(null)
  const patientSummaryRef = useRef<HTMLDivElement>(null)
  const activeSection = useActiveSection()
  const { openPanel } = useDetailPanel()
  const careerConsultationsById = useMemo(
    () => new Map(timelineConsultations.map((consultation) => [consultation.id, consultation])),
    [],
  )

  // Signal constellation animation readiness when patient summary scrolls out of view
  useEffect(() => {
    const el = patientSummaryRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setConstellationReady(true)
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
      const consultation = careerConsultationsById.get(roleId)
      if (consultation) {
        openPanel({ type: 'career-role', consultation })
      }
    },
    [careerConsultationsById, openPanel],
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
          style={{ flexShrink: 0, height: '100%' }}
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
            <div ref={patientSummaryRef}>
              <PatientSummaryTile />
            </div>

            {/* Patient Pathway — parent section with constellation graph + subsections */}
            <ParentSection title="Patient Pathway" tileId="patient-pathway">
              <div className="pathway-columns">
                <div ref={chronologyRef} className="chronology-stream" data-tile-id="section-experience">


                  <div className="chronology-item">
                    <LastConsultationCard highlightedRoleId={highlightedRoleId} />
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
                    animationReady={constellationReady}
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
