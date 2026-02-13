import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, Variants } from 'framer-motion'
import { Search, X, ArrowLeft } from 'lucide-react'
import type { ViewId } from '../types/pmr'
import { ClinicalSidebar } from './ClinicalSidebar'
import { PatientBanner } from './PatientBanner'
import { MobileBottomNav } from './MobileBottomNav'
import { Breadcrumb } from './Breadcrumb'
import { SummaryView } from './views/SummaryView'
import { ConsultationsView } from './views/ConsultationsView'
import { MedicationsView } from './views/MedicationsView'
import { ProblemsView } from './views/ProblemsView'
import { InvestigationsView } from './views/InvestigationsView'
import { DocumentsView } from './views/DocumentsView'
import { ReferralsView } from './views/ReferralsView'
import { useAccessibility } from '../contexts/AccessibilityContext'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useScrollCondensation } from '../hooks/useScrollCondensation'

interface PMRInterfaceProps {
  children?: React.ReactNode
}

function PMRContent({ children }: PMRInterfaceProps) {
  const [activeView, setActiveView] = useState<ViewId>(() => {
    const hash = window.location.hash.slice(1) as ViewId
    const validViews: ViewId[] = [
      'summary',
      'consultations',
      'medications',
      'problems',
      'investigations',
      'documents',
      'referrals',
    ]
    return validViews.includes(hash) ? hash : 'summary'
  })
  
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  
  const viewHeadingRef = useRef<HTMLDivElement>(null)
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null)
  const scrollContainerCallbackRef = useCallback((node: HTMLElement | null) => {
    setScrollContainer(node)
  }, [])
  const { requestFocusAfterViewChange, expandedItemId, setExpandedItem } = useAccessibility()
  const { isMobile, isTablet } = useBreakpoint()
  const { isCondensed } = useScrollCondensation({ threshold: 100, scrollContainer })

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  const bannerVariants = useMemo<Variants>(() => ({
    hidden: prefersReducedMotion ? {} : { y: -80, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }
    }
  }), [prefersReducedMotion])

  const sidebarVariants = useMemo<Variants>(() => ({
    hidden: prefersReducedMotion ? {} : { x: -220, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut', delay: 0.05 }
    }
  }), [prefersReducedMotion])

  const contentVariants = useMemo<Variants>(() => ({
    hidden: prefersReducedMotion ? {} : { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3, delay: 0.15 }
    }
  }), [prefersReducedMotion])

  const mobileNavVariants = useMemo<Variants>(() => ({
    hidden: prefersReducedMotion ? {} : { y: 56, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }
    }
  }), [prefersReducedMotion])

  useEffect(() => {
    requestFocusAfterViewChange()
    if (viewHeadingRef.current) {
      viewHeadingRef.current.focus()
    }
  }, [activeView, requestFocusAfterViewChange])

  const handleViewChange = (view: ViewId) => {
    setActiveView(view)
    if (expandedItemId) {
      setExpandedItem(null)
    }
  }

  const handleNavigate = (view: ViewId) => {
    setActiveView(view)
    window.location.hash = view
    if (expandedItemId) {
      setExpandedItem(null)
    }
  }

  const handleBackToSummary = () => {
    handleViewChange('summary')
    window.location.hash = 'summary'
  }

  const renderView = () => {
    switch (activeView) {
      case 'summary':
        return <SummaryView onNavigate={handleNavigate} />
      case 'consultations':
        return <ConsultationsView />
      case 'medications':
        return <MedicationsView />
      case 'problems':
        return <ProblemsView onNavigate={handleNavigate} />
      case 'investigations':
        return <InvestigationsView />
      case 'documents':
        return <DocumentsView />
      case 'referrals':
        return <ReferralsView />
      default:
        return (
          <div className="bg-white border border-gray-200 rounded p-6 shadow-pmr">
            <h1 className="font-ui font-semibold text-lg text-gray-900 capitalize">
              {activeView} View
            </h1>
            <p className="font-ui text-sm text-gray-500 mt-2">
              Content for {activeView} will be implemented in a separate task.
            </p>
          </div>
        )
    }
  }

  const viewLabels: Record<ViewId, string> = {
    summary: 'Summary',
    consultations: 'Experience',
    medications: 'Skills',
    problems: 'Achievements',
    investigations: 'Projects',
    documents: 'Education',
    referrals: 'Contact',
  }

  return (
    <motion.div
      className="flex h-screen overflow-hidden bg-pmr-content"
      initial="hidden"
      animate="visible"
    >
      {/* Fixed sidebar */}
      {!isMobile && (
        <motion.div variants={sidebarVariants} className="flex-shrink-0">
          <ClinicalSidebar
            activeView={activeView}
            onViewChange={handleViewChange}
            isTablet={isTablet}
          />
        </motion.div>
      )}

      {/* Main content column: banner (fixed) + scrollable content */}
      <div className="flex-1 flex flex-col min-w-0">
        <motion.div variants={bannerVariants} className="flex-shrink-0">
          <PatientBanner isMobile={isMobile} isTablet={isTablet} isCondensed={isCondensed} />
        </motion.div>

        <motion.main
          ref={scrollContainerCallbackRef}
          variants={contentVariants}
          aria-label={`${viewLabels[activeView]} view`}
          className={`
            flex-1 overflow-y-auto p-4 md:p-6
            ${isMobile ? 'pb-20' : ''}
          `}
        >
          {isMobile && (
            <MobileSearchBar
              query={mobileSearchQuery}
              onChange={setMobileSearchQuery}
            />
          )}

          <div
            ref={viewHeadingRef}
            tabIndex={-1}
            className="outline-none"
            aria-label={viewLabels[activeView]}
          >
            <h1 className="sr-only">{viewLabels[activeView]}</h1>
          </div>

          {/* Breadcrumb (desktop/tablet only) */}
          {!isMobile && (
            <Breadcrumb
              currentView={activeView}
              expandedItem={
                expandedItemId
                  ? { name: expandedItemId, type: activeView }
                  : undefined
              }
              onNavigateToView={handleNavigate}
              onCollapseItem={() => setExpandedItem(null)}
            />
          )}

          {/* Mobile back button (mobile only) */}
          {isMobile && activeView !== 'summary' && (
            <button
              type="button"
              onClick={handleBackToSummary}
              className="flex items-center gap-1 text-pmr-nhsblue text-sm font-ui font-medium mb-4 hover:underline"
            >
              <ArrowLeft size={14} />
              Back to Summary
            </button>
          )}

          {children || renderView()}
        </motion.main>
      </div>

      {isMobile && (
        <motion.div variants={mobileNavVariants}>
          <MobileBottomNav
            activeView={activeView}
            onViewChange={handleViewChange}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

interface MobileSearchBarProps {
  query: string
  onChange: (query: string) => void
}

function MobileSearchBar({ query, onChange }: MobileSearchBarProps) {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="search"
          aria-label="Search record"
          placeholder="Search record..."
          value={query}
          onChange={e => onChange(e.target.value)}
          className="w-full h-10 pl-10 pr-10 bg-white border border-gray-200 rounded text-sm font-ui text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pmr-nhsblue focus:ring-1 focus:ring-pmr-nhsblue/20 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export function PMRInterface(props: PMRInterfaceProps) {
  return <PMRContent {...props} />
}
