import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TopBar } from './TopBar'
import { SubNav } from './SubNav'
import Sidebar from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { DetailPanel } from './DetailPanel'
import { PatientSummaryTile } from './tiles/PatientSummaryTile'
import { LatestResultsTile } from './tiles/LatestResultsTile'
import { CoreSkillsTile } from './tiles/CoreSkillsTile'
import { LastConsultationTile } from './tiles/LastConsultationTile'
import { CareerActivityTile } from './tiles/CareerActivityTile'
import { EducationTile } from './tiles/EducationTile'
import { ProjectsTile } from './tiles/ProjectsTile'
import { useActiveSection } from '@/hooks/useActiveSection'
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

export function DashboardLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const activeSection = useActiveSection()

  const handleSearchClick = () => {
    setCommandPaletteOpen(true)
  }

  const handlePaletteClose = useCallback(() => {
    setCommandPaletteOpen(false)
  }, [])

  const handleSectionClick = useCallback((_sectionId: string) => {
    // Section click is already handled in SubNav component
    // This is just a placeholder for any additional logic needed
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
    }
  }, [])

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
            {/* PatientSummaryTile — full width */}
            <PatientSummaryTile />

            {/* LatestResultsTile — half width (left) */}
            <LatestResultsTile />
            {/* ProjectsTile — half width (right) */}
            <ProjectsTile />

            {/* CoreSkillsTile — full width */}
            <CoreSkillsTile />

            {/* LastConsultationTile — full width */}
            <LastConsultationTile />

            {/* CareerActivityTile — full width */}
            <CareerActivityTile />

            {/* EducationTile — full width */}
            <EducationTile />
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
