import { useState, useEffect, useRef } from 'react'
import type { ViewId } from '../types/pmr'
import { ClinicalSidebar } from './ClinicalSidebar'
import { PatientBanner } from './PatientBanner'
import { SummaryView } from './views/SummaryView'
import { ConsultationsView } from './views/ConsultationsView'
import { MedicationsView } from './views/MedicationsView'
import { ProblemsView } from './views/ProblemsView'
import { InvestigationsView } from './views/InvestigationsView'
import { DocumentsView } from './views/DocumentsView'
import { ReferralsView } from './views/ReferralsView'
import { useAccessibility } from '../contexts/AccessibilityContext'

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
  
  const viewHeadingRef = useRef<HTMLDivElement>(null)
  const { requestFocusAfterViewChange, expandedItemId, setExpandedItem } = useAccessibility()

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
      <PatientBanner />
      <div className="flex">
        <ClinicalSidebar activeView={activeView} onViewChange={handleViewChange} />
        <main
          role="main"
          aria-label={`${activeView} view`}
          className="flex-1 min-h-[calc(100vh-80px)] p-6"
        >
          <div
            ref={viewHeadingRef}
            tabIndex={-1}
            className="outline-none"
            aria-label={viewLabels[activeView]}
          >
            <h1 className="sr-only">{viewLabels[activeView]}</h1>
          </div>
          {children || renderView()}
        </main>
      </div>
    </div>
  )
}

export function PMRInterface(props: PMRInterfaceProps) {
  return <PMRContent {...props} />
}
