import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { medications } from '@/data/medications'
import type { Medication } from '@/types/pmr'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useAccessibility } from '@/contexts/AccessibilityContext'

type SortField = 'name' | 'dose' | 'frequency' | 'startYear' | 'status'
type SortDirection = 'asc' | 'desc' | null

interface SortState {
  field: SortField
  direction: SortDirection
}

type CategoryId = 'Active' | 'Clinical' | 'PRN'

const categoryTabs: { id: CategoryId; label: string; shortLabel: string }[] = [
  { id: 'Active', label: 'Active Medications', shortLabel: 'Active' },
  { id: 'Clinical', label: 'Clinical Medications', shortLabel: 'Clinical' },
  { id: 'PRN', label: 'PRN (As Required)', shortLabel: 'PRN' },
]

const categoryCounts: Record<CategoryId, number> = {
  Active: medications.filter(m => m.category === 'Active').length,
  Clinical: medications.filter(m => m.category === 'Clinical').length,
  PRN: medications.filter(m => m.category === 'PRN').length,
}

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

export function MedicationsView() {
  const [activeTab, setActiveTab] = useState<CategoryId>('Active')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [sort, setSort] = useState<SortState>({ field: 'name', direction: null })
  const { isMobile } = useBreakpoint()
  const { setExpandedItem } = useAccessibility()

  const filteredMedications = useMemo(() => {
    return medications.filter(med => med.category === activeTab)
  }, [activeTab])

  const sortedMedications = useMemo(() => {
    if (!sort.direction) return filteredMedications

    return [...filteredMedications].sort((a, b) => {
      let comparison = 0
      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'dose':
          comparison = a.dose - b.dose
          break
        case 'frequency': {
          const freqOrder: Record<string, number> = { 'Daily': 0, 'Weekly': 1, 'Monthly': 2, 'As needed': 3 }
          comparison = (freqOrder[a.frequency] ?? 4) - (freqOrder[b.frequency] ?? 4)
          break
        }
        case 'startYear':
          comparison = a.startYear - b.startYear
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
      }
      return sort.direction === 'asc' ? comparison : -comparison
    })
  }, [filteredMedications, sort])

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      if (sort.direction === 'asc') {
        setSort({ field, direction: 'desc' })
      } else if (sort.direction === 'desc') {
        setSort({ field, direction: null })
      } else {
        setSort({ field, direction: 'asc' })
      }
    } else {
      setSort({ field, direction: 'asc' })
    }
  }

  const toggleRow = (id: string, name: string) => {
    const nextExpanded = expandedRow === id ? null : id
    setExpandedRow(nextExpanded)
    setExpandedItem(nextExpanded ? name : null)
  }

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sort.field !== field || !sort.direction) {
      return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
    }
    return sort.direction === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-[#005EB8]" />
      : <ChevronDown className="w-3.5 h-3.5 text-[#005EB8]" />
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <h1 className="font-ui font-semibold text-[15px] text-gray-900">
            Current Medications
          </h1>
          <p className="font-ui text-[13px] text-gray-500 mt-0.5">
            Skills mapped as active medications — proficiency shown as dosage
          </p>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-[#E5E7EB]">
          <nav className="flex" role="tablist" aria-label="Medication categories">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id)
                  setExpandedRow(null)
                  setExpandedItem(null)
                }}
                className={`
                  flex-1 px-4 py-2.5 transition-colors duration-100 text-left
                  border-b-2
                  ${activeTab === tab.id
                    ? 'bg-white border-[#005EB8]'
                    : 'bg-[#F9FAFB] border-transparent text-gray-600 hover:bg-white'}
                `}
              >
                <span className="flex items-center gap-2">
                  <span className={`font-ui font-medium text-[14px] ${activeTab === tab.id ? 'text-[#005EB8]' : 'text-gray-600'}`}>
                    {isMobile ? tab.shortLabel : tab.label}
                  </span>
                  <span
                    className={`
                      inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-ui font-medium
                      ${activeTab === tab.id
                        ? 'bg-[#005EB8]/10 text-[#005EB8]'
                        : 'bg-gray-200 text-gray-500'}
                    `}
                  >
                    {categoryCounts[tab.id]}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Panel */}
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {isMobile ? (
            <MobileMedicationList
              medications={sortedMedications}
              expandedRow={expandedRow}
              onToggle={toggleRow}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" role="grid">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {(['name', 'dose', 'frequency', 'startYear', 'status'] as SortField[]).map((field) => {
                      const labels: Record<SortField, string> = {
                        name: 'Drug Name',
                        dose: 'Dose',
                        frequency: 'Frequency',
                        startYear: 'Start',
                        status: 'Status',
                      }
                      return (
                        <th key={field} scope="col" className="text-left border-r border-[#E5E7EB] last:border-r-0">
                          <button
                            type="button"
                            onClick={() => handleSort(field)}
                            className="w-full px-4 h-[40px] flex items-center gap-2 hover:bg-[#EFF6FF] transition-colors duration-100"
                          >
                            <span className="font-ui font-semibold text-[13px] uppercase tracking-[0.03em] text-gray-400">
                              {labels[field]}
                            </span>
                            <SortIndicator field={field} />
                          </button>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedMedications.map((med, index) => (
                    <MedicationRow
                      key={med.id}
                      medication={med}
                      isExpanded={expandedRow === med.id}
                      isEven={index % 2 === 1}
                      onToggle={() => toggleRow(med.id, med.name)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
          <p className="font-ui text-[12px] text-gray-500">
            {sortedMedications.length} medications in this category. {isMobile ? 'Tap' : 'Click'} a row to view prescribing history.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile Card Layout ───────────────────────────────────────────── */

interface MobileMedicationListProps {
  medications: Medication[]
  expandedRow: string | null
  onToggle: (id: string, name: string) => void
}

function MobileMedicationList({ medications, expandedRow, onToggle }: MobileMedicationListProps) {
  return (
    <div className="divide-y divide-[#E5E7EB]">
      {medications.map((med) => {
        const isExpanded = expandedRow === med.id
        return (
          <div key={med.id} className="bg-white">
            <button
              type="button"
              onClick={() => onToggle(med.id, med.name)}
              className="w-full p-4 text-left hover:bg-[#EFF6FF] transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[#005EB8]/40 focus-visible:ring-inset"
              aria-expanded={isExpanded}
              aria-label={`${med.name}, ${med.dose}% proficiency, ${med.frequency}, since ${med.startYear}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-ui font-medium text-[14px] text-gray-900">
                    {med.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 font-ui text-[12px] text-gray-500">
                    <span className="font-geist">{med.dose}%</span>
                    <span className="text-gray-300">·</span>
                    <span>{med.frequency}</span>
                    <span className="text-gray-300">·</span>
                    <span className="font-geist">Since {med.startYear}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusDot status={med.status} />
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  >
                    <ChevronDown size={16} className="text-gray-400" />
                  </motion.div>
                </div>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <PrescribingHistory history={med.prescribingHistory} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Desktop Table Row ────────────────────────────────────────────── */

interface MedicationRowProps {
  medication: Medication
  isExpanded: boolean
  isEven: boolean
  onToggle: () => void
}

function MedicationRow({ medication, isExpanded, isEven, onToggle }: MedicationRowProps) {
  return (
    <>
      <tr
        className={`
          h-[40px] border-b border-[#E5E7EB] cursor-pointer transition-colors duration-100
          ${isEven ? 'bg-[#F9FAFB]' : 'bg-white'}
          hover:bg-[#EFF6FF]
        `}
        onClick={onToggle}
        role="row"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <td className="px-4 py-2 border-r border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronDown size={14} className="text-gray-400" />
            </motion.div>
            <span className="font-ui font-medium text-[14px] text-gray-900">
              {medication.name}
            </span>
          </div>
        </td>
        <td className="px-4 py-2 border-r border-[#E5E7EB]">
          <span className="font-geist text-[13px] text-gray-700">
            {medication.dose}%
          </span>
        </td>
        <td className="px-4 py-2 border-r border-[#E5E7EB]">
          <span className="font-ui text-[13px] text-gray-700">
            {medication.frequency}
          </span>
        </td>
        <td className="px-4 py-2 border-r border-[#E5E7EB]">
          <span className="font-geist text-[13px] text-gray-700">
            {medication.startYear}
          </span>
        </td>
        <td className="px-4 py-2">
          <StatusDot status={medication.status} />
        </td>
      </tr>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.tr
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <td colSpan={5} className="p-0">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <PrescribingHistory history={medication.prescribingHistory} />
                </div>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Status Dot ───────────────────────────────────────────────────── */

function StatusDot({ status }: { status: 'Active' | 'Historical' }) {
  const color = status === 'Active' ? 'bg-[#22C55E]' : 'bg-gray-400'
  return (
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} aria-hidden="true" />
      <span className="font-ui text-[13px] text-gray-700">{status}</span>
    </div>
  )
}

/* ─── Prescribing History (shared) ─────────────────────────────────── */

interface PrescribingHistoryProps {
  history: { year: number; description: string }[]
}

function PrescribingHistory({ history }: PrescribingHistoryProps) {
  return (
    <div className="pl-6">
      <p className="font-ui font-semibold text-[12px] uppercase tracking-[0.05em] text-gray-400 mb-3">
        Prescribing History
      </p>
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[18px] top-1 bottom-1 w-px bg-[#E5E7EB]" aria-hidden="true" />
        <div className="space-y-2">
          {history.map((entry, index) => (
            <div key={index} className="flex gap-4 relative">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 mt-1.5">
                <span className="block w-2 h-2 rounded-full bg-[#005EB8] ring-2 ring-white" aria-hidden="true" />
              </div>
              <span className="font-geist font-semibold text-[12px] text-gray-600 w-10 flex-shrink-0 pt-[1px]">
                {entry.year}
              </span>
              <span className="font-geist text-[12px] text-gray-500 pt-[1px]">
                {entry.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
