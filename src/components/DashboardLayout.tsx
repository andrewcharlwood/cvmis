import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import { MobileBottomNav } from './MobileBottomNav'
import { CommandPalette } from './CommandPalette'
import { DetailPanel } from './DetailPanel'
import { PatientSummaryTile } from './tiles/PatientSummaryTile'
import { ParentSection } from './ParentSection'
import CareerConstellation from './constellation/CareerConstellation'
import { TimelineInterventionsSubsection } from './TimelineInterventionsSubsection'
import { RepeatMedicationsSubsection } from './RepeatMedicationsSubsection'
import { LastConsultationCard } from './LastConsultationCard'
import { ChatWidget } from './ChatWidget'
import { MobileOverviewHeader } from './MobileOverviewHeader'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useIsMobileNav } from '@/hooks/useIsMobileNav'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { timelineConsultations, timelineEntities } from '@/data/timeline'
import { skills } from '@/data/skills'
import { constellationNodes } from '@/data/constellation'
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
  const isMobileNav = useIsMobileNav()
  const chronologyRef = useRef<HTMLDivElement>(null)
  const patientSummaryRef = useRef<HTMLDivElement>(null)
  const constellationWrapperRef = useRef<HTMLDivElement>(null)
  const activeSection = useActiveSection()
  const { openPanel } = useDetailPanel()
  const careerConsultationsById = useMemo(
    () => new Map(timelineConsultations.map((consultation) => [consultation.id, consultation])),
    [],
  )

  // Global focus mode: tracks which entity (skill or role) is being hovered across all components
  const [globalFocusId, setGlobalFocusId] = useState<string | null>(null)

  // Build lookup maps for resolving relationships between skills and roles
  const nodeTypeById = useMemo(
    () => new Map(constellationNodes.map(n => [n.id, n.type])),
    [],
  )
  const skillToRoles = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const entity of timelineEntities) {
      for (const skillId of entity.skills) {
        if (!map.has(skillId)) map.set(skillId, new Set())
        map.get(skillId)!.add(entity.id)
      }
    }
    return map
  }, [])
  const roleToSkills = useMemo(
    () => new Map(timelineEntities.map(e => [e.id, new Set(e.skills)])),
    [],
  )

  // Derive the set of all IDs related to the focused entity
  const focusRelatedIds = useMemo(() => {
    if (!globalFocusId) return null
    const related = new Set<string>()
    related.add(globalFocusId)
    const nodeType = nodeTypeById.get(globalFocusId)
    if (nodeType === 'skill') {
      // Skill focused: related roles are those containing this skill
      const roles = skillToRoles.get(globalFocusId)
      if (roles) roles.forEach(r => related.add(r))
    } else {
      // Role/education focused: related skills are that entity's skills
      const entitySkills = roleToSkills.get(globalFocusId)
      if (entitySkills) entitySkills.forEach(s => related.add(s))
    }
    return related
  }, [globalFocusId, nodeTypeById, skillToRoles, roleToSkills])

  // Signal constellation animation readiness:
  // Desktop (>=768): when patient summary scrolls out of view (graph is side-by-side)
  // Mobile (<768): when the constellation itself scrolls into view (single-column layout)
  useEffect(() => {
    const isMobile = window.innerWidth < 768

    if (isMobile) {
      const el = constellationWrapperRef.current
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setConstellationReady(true)
        },
        { threshold: 0.1 },
      )
      observer.observe(el)
      return () => observer.disconnect()
    } else {
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
    }
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
    setGlobalFocusId(id)
  }, [])

  const handleNodeHover = useCallback((id: string | null) => {
    const nodeType = id ? nodeTypeById.get(id) : null
    setHighlightedRoleId(nodeType !== 'skill' ? id : null)
    setGlobalFocusId(id)
  }, [nodeTypeById])

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
        {!isMobileNav && (
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
        )}

        <motion.main
          id="main-content"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          aria-label="Dashboard content"
          className="dashboard-main pmr-scrollbar p-3 xs:p-5 pb-10 md:p-7 md:pb-12 lg:px-8 lg:pt-7 lg:pb-12"
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: isMobileNav ? 'calc(56px + env(safe-area-inset-bottom) + 16px)' : undefined,
          }}
        >
          {isMobileNav && <MobileOverviewHeader onSearchClick={handleSearchClick} />}
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
                    <LastConsultationCard highlightedRoleId={highlightedRoleId} focusRelatedIds={focusRelatedIds} />
                  </div>

                  <div className="chronology-item">
                    <TimelineInterventionsSubsection onNodeHighlight={handleNodeHighlight} highlightedRoleId={highlightedRoleId} focusRelatedIds={focusRelatedIds} />
                  </div>
                </div>
                <div ref={constellationWrapperRef} className="pathway-graph-sticky">
                  <CareerConstellation
                    onRoleClick={handleRoleClick}
                    onSkillClick={handleSkillClick}
                    onNodeHover={handleNodeHover}
                    highlightedNodeId={highlightedNodeId}
                    containerHeight={chronologyHeight}
                    animationReady={constellationReady}
                    globalFocusActive={globalFocusId !== null}
                  />
                </div>


              </div>

              <div data-tile-id="section-skills" style={{ marginTop: '22px' }}>
                <RepeatMedicationsSubsection onNodeHighlight={handleNodeHighlight} focusRelatedIds={focusRelatedIds} />
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

      {/* Mobile bottom navigation */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
    </div>
  )
}
