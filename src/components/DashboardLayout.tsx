import { useState } from 'react'
import { motion } from 'framer-motion'
import { TopBar } from './TopBar'
import Sidebar from './Sidebar'

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
  const [, setCommandPaletteOpen] = useState(false)

  const handleSearchClick = () => {
    setCommandPaletteOpen(true)
  }

  return (
    <div
      className="font-ui"
      style={{ background: 'var(--bg-dashboard)', minHeight: '100vh' }}
    >
      {/* TopBar — fixed at top */}
      <motion.div initial="hidden" animate="visible" variants={topbarVariants}>
        <TopBar onSearchClick={handleSearchClick} />
      </motion.div>

      {/* Layout below TopBar: Sidebar + Main */}
      <div
        style={{
          display: 'flex',
          marginTop: 'var(--topbar-height)',
          height: 'calc(100vh - var(--topbar-height))',
        }}
      >
        {/* Sidebar — fixed left */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          style={{ flexShrink: 0 }}
        >
          <Sidebar />
        </motion.div>

        {/* Main content — scrollable card grid */}
        <motion.main
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          aria-label="Dashboard content"
          className="pmr-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px 40px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
            className="dashboard-grid"
          >
            {/* Tiles will be added in Tasks 8-15 */}
            {/* PatientSummaryTile — full width */}
            {/* LatestResultsTile — half width (left) */}
            {/* CoreSkillsTile — half width (right) */}
            {/* LastConsultationTile — full width */}
            {/* CareerActivityTile — full width */}
            {/* EducationTile — full width */}
            {/* ProjectsTile — full width */}
          </div>
        </motion.main>
      </div>

      {/* Command palette will be rendered here (Task 18) */}
    </div>
  )
}
