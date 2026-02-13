import { ChevronRight } from 'lucide-react'
import type { ViewId } from '../types/pmr'

interface BreadcrumbProps {
  currentView: ViewId
  expandedItem?: {
    name: string
    type: string
  }
  onNavigateToView?: (view: ViewId) => void
  onCollapseItem?: () => void
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

export function Breadcrumb({
  currentView,
  expandedItem,
  onNavigateToView,
  onCollapseItem,
}: BreadcrumbProps) {
  const handleNavigateToPatientRecord = () => {
    if (onNavigateToView) {
      onNavigateToView('summary')
    }
  }

  const handleNavigateToCurrentView = () => {
    if (onCollapseItem) {
      onCollapseItem()
    }
  }

  return (
    <nav
      className="flex items-center gap-2 mb-6"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2">
        {/* Patient Record (root) */}
        <li>
          <button
            type="button"
            onClick={handleNavigateToPatientRecord}
            className="text-[13px] font-ui font-normal text-gray-400 hover:text-pmr-nhsblue transition-colors"
          >
            Patient Record
          </button>
        </li>

        <li>
          <ChevronRight size={14} className="text-gray-300" />
        </li>

        {/* Current view */}
        <li>
          {expandedItem ? (
            <button
              type="button"
              onClick={handleNavigateToCurrentView}
              className="text-[13px] font-ui font-normal text-gray-400 hover:text-pmr-nhsblue transition-colors"
            >
              {viewLabels[currentView]}
            </button>
          ) : (
            <span className="text-[13px] font-ui font-normal text-gray-600">
              {viewLabels[currentView]}
            </span>
          )}
        </li>

        {/* Expanded item (if any) */}
        {expandedItem && (
          <>
            <li>
              <ChevronRight size={14} className="text-gray-300" />
            </li>
            <li>
              <span className="text-[13px] font-ui font-normal text-gray-600">
                {expandedItem.name}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}
