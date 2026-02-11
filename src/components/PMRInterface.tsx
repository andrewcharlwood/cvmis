import { useState } from 'react'
import type { ViewId } from '../types/pmr'
import { ClinicalSidebar } from './ClinicalSidebar'
import { PatientBanner } from './PatientBanner'

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

  return (
    <div className="min-h-screen bg-pmr-content">
      <PatientBanner />
      <div className="flex">
        <ClinicalSidebar activeView={activeView} onViewChange={handleViewChange} />
        <main
          role="main"
          className="flex-1 min-h-[calc(100vh-80px)] p-6"
        >
          {children ? (
            children
          ) : (
            <div className="bg-white border border-gray-200 rounded p-6">
              <h1 className="font-inter font-semibold text-lg text-gray-900 capitalize">
                {activeView} View
              </h1>
              <p className="font-inter text-sm text-gray-500 mt-2">
                Content for {activeView} will be implemented in a separate task.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
