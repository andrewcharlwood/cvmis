import { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowLeft } from 'lucide-react'
import type { ViewId } from '../types/pmr'
import { ClinicalSidebar } from './ClinicalSidebar'
import { PatientBanner } from './PatientBanner'
import { MobileBottomNav } from './MobileBottomNav'
import { SummaryView } from './views/SummaryView'
import { ConsultationsView } from './views/ConsultationsView'
import { MedicationsView } from './views/MedicationsView'
import { ProblemsView } from './views/ProblemsView'
import { InvestigationsView } from './views/InvestigationsView'
import { DocumentsView } from './views/DocumentsView'
import { ReferralsView } from './views/ReferralsView'
import { useAccessibility } from '../contexts/AccessibilityContext'
import { useBreakpoint } from '../hooks/useBreakpoint'

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
  const { requestFocusAfterViewChange, expandedItemId, setExpandedItem } = useAccessibility()
  const { isMobile, isTablet } = useBreakpoint()

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
          <div className="bg-white border border-gray-200 rounded p-6">
            <h1 className="font-inter font-semibold text-lg text-gray-900 capitalize">
              {activeView} View
            </h1>
            <p className="font-inter text-sm text-gray-500 mt-2">
              Content for {activeView} will be implemented in a separate task.
            </p>
          </div>
        )
    }
  }

  const viewLabels: Record<ViewId, string> = {
    summary: 'Patient Summary',
    consultations: 'Consultation History',
    medications: 'Current Medications',
    problems: 'Problem List',
    investigations: 'Investigation Results',
    documents: 'Attached Documents',
    referrals: 'Referral Form',
  }

  return (
    <div className="min-h-screen bg-pmr-content">
      <PatientBanner isMobile={isMobile} isTablet={isTablet} />
      <div className="flex">
        {!isMobile && (
          <ClinicalSidebar 
            activeView={activeView} 
            onViewChange={handleViewChange}
            isTablet={isTablet}
          />
        )}
        <main
          role="main"
          aria-label={`${activeView} view`}
          className={`
            flex-1 p-4 md:p-6
            ${isMobile ? 'pb-20' : ''}
            ${isTablet ? 'min-h-[calc(100vh-48px)]' : 'min-h-[calc(100vh-80px)]'}
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
          
          {isMobile && activeView !== 'summary' && (
            <button
              type="button"
              onClick={handleBackToSummary}
              className="flex items-center gap-1 text-pmr-nhsblue text-sm font-inter font-medium mb-4 hover:underline"
            >
              <ArrowLeft size={14} />
              Back to Summary
            </button>
          )}
          
          {children || renderView()}
        </main>
      </div>
      
      {isMobile && (
        <MobileBottomNav 
          activeView={activeView} 
          onViewChange={handleViewChange}
        />
      )}
    </div>
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
          type="text"
          placeholder="Search record..."
          value={query}
          onChange={e => onChange(e.target.value)}
          className="w-full h-10 pl-10 pr-10 bg-white border border-gray-200 rounded text-sm font-inter text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pmr-nhsblue focus:ring-1 focus:ring-pmr-nhsblue/20 transition-colors"
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
