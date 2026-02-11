import { useState } from 'react'
import type { ViewId } from '../types/pmr'
import { ClinicalSidebar } from './ClinicalSidebar'
import { PatientBanner } from './PatientBanner'
import { SummaryView } from './views/SummaryView'
import { ConsultationsView } from './views/ConsultationsView'
import { MedicationsView } from './views/MedicationsView'
import { ProblemsView } from './views/ProblemsView'

interface PMRInterfaceProps {
  children?: React.ReactNode
}

export function PMRInterface({ children }: PMRInterfaceProps) {
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

  const handleViewChange = (view: ViewId) => {
    setActiveView(view)
  }

  const handleNavigate = (view: ViewId, itemId?: string) => {
    void itemId
    setActiveView(view)
    window.location.hash = view
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
          {children || renderView()}
        </main>
      </div>
    </div>
  )
}
