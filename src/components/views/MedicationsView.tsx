import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { medications } from '@/data/medications'
import type { Medication } from '@/types/pmr'

type SortField = 'name' | 'dose' | 'frequency' | 'startYear' | 'status'
type SortDirection = 'asc' | 'desc' | null

interface SortState {
  field: SortField
  direction: SortDirection
}

const categoryTabs = [
  { id: 'Active', label: 'Active Medications', description: 'Technical skills (daily use)' },
  { id: 'Clinical', label: 'Clinical Medications', description: 'Healthcare domain skills' },
  { id: 'PRN', label: 'PRN (As Required)', description: 'Strategic & leadership skills' },
] as const

export function MedicationsView() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Clinical' | 'PRN'>('Active')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [sort, setSort] = useState<SortState>({ field: 'name', direction: null })

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

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
          const freqOrder = { 'Daily': 0, 'Weekly': 1, 'Monthly': 2, 'As needed': 3 }
          comparison = freqOrder[a.frequency] - freqOrder[b.frequency]
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

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field || !sort.direction) {
      return <ArrowUpDown size={12} className="text-gray-400" />
    }
    return sort.direction === 'asc' 
      ? <ArrowUp size={12} className="text-pmr-nhsblue" />
      : <ArrowDown size={12} className="text-pmr-nhsblue" />
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h1 className="font-inter font-semibold text-lg text-gray-900">
            Current Medications
          </h1>
          <p className="font-inter text-sm text-gray-500 mt-1">
            Skills mapped as active medications — proficiency shown as dosage
          </p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex" role="tablist">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id)
                  setExpandedRow(null)
                }}
                className={`
                  flex-1 px-4 py-3 text-left transition-colors duration-100
                  ${activeTab === tab.id 
                    ? 'bg-white border-b-2 border-pmr-nhsblue' 
                    : 'bg-gray-50 hover:bg-gray-100 border-b-2 border-transparent'}
                `}
              >
                <span className={`font-inter font-medium text-sm ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-600'}`}>
                  {tab.label}
                </span>
                <span className="block font-inter text-xs text-gray-500 mt-0.5">
                  {tab.description}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="grid">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th scope="col" className="w-8"></th>
                <th scope="col" className="text-left">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                      Drug Name
                    </span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th scope="col" className="text-left">
                  <button
                    type="button"
                    onClick={() => handleSort('dose')}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                      Dose
                    </span>
                    {getSortIcon('dose')}
                  </button>
                </th>
                <th scope="col" className="text-left">
                  <button
                    type="button"
                    onClick={() => handleSort('frequency')}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                      Frequency
                    </span>
                    {getSortIcon('frequency')}
                  </button>
                </th>
                <th scope="col" className="text-left">
                  <button
                    type="button"
                    onClick={() => handleSort('startYear')}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                      Start
                    </span>
                    {getSortIcon('startYear')}
                  </button>
                </th>
                <th scope="col" className="text-left">
                  <button
                    type="button"
                    onClick={() => handleSort('status')}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                      Status
                    </span>
                    {getSortIcon('status')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMedications.map((med, index) => (
                <MedicationRow
                  key={med.id}
                  medication={med}
                  isExpanded={expandedRow === med.id}
                  isAlternating={index % 2 === 1}
                  onToggle={() => toggleRow(med.id)}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="font-inter text-xs text-gray-500">
            {sortedMedications.length} medications in this category. Click a row to view prescribing history.
          </p>
        </div>
      </div>
    </div>
  )
}

interface MedicationRowProps {
  medication: Medication
  isExpanded: boolean
  isAlternating: boolean
  onToggle: () => void
  prefersReducedMotion: boolean
}

function MedicationRow({ medication, isExpanded, isAlternating, onToggle, prefersReducedMotion }: MedicationRowProps) {
  const statusColors = {
    'Active': 'bg-green-500',
    'Historical': 'bg-gray-400',
  }

  return (
    <>
      <tr
        className={`
          border-b border-gray-200 cursor-pointer transition-colors duration-100
          ${isAlternating ? 'bg-gray-50' : 'bg-white'}
          hover:bg-blue-50
        `}
        onClick={onToggle}
        role="row"
        aria-expanded={isExpanded}
      >
        <td className="w-8 px-2 py-0">
          <button
            type="button"
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
        </td>
        <td className="px-4 py-2.5">
          <span className="font-inter font-medium text-sm text-gray-900">
            {medication.name}
          </span>
        </td>
        <td className="px-4 py-2.5">
          <span className="font-geist text-sm text-gray-700">
            {medication.dose}%
          </span>
        </td>
        <td className="px-4 py-2.5">
          <span className="font-inter text-sm text-gray-700">
            {medication.frequency}
          </span>
        </td>
        <td className="px-4 py-2.5">
          <span className="font-geist text-sm text-gray-700">
            {medication.startYear}
          </span>
        </td>
        <td className="px-4 py-2.5">
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusColors[medication.status]}`} />
            <span className="font-inter text-sm text-gray-600">{medication.status}</span>
          </span>
        </td>
      </tr>
      {isExpanded && (
        <PrescribingHistory
          history={medication.prescribingHistory}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
    </>
  )
}

interface PrescribingHistoryProps {
  history: { year: number; description: string }[]
  prefersReducedMotion: boolean
}

function PrescribingHistory({ history, prefersReducedMotion }: PrescribingHistoryProps) {
  return (
    <tr className="bg-gray-50 border-b border-gray-200">
      <td colSpan={6} className="px-4 py-4">
        <div
          className={`
            pl-8
            ${prefersReducedMotion ? '' : 'animate-fadeIn'}
          `}
        >
          <p className="font-inter font-medium text-xs uppercase tracking-wide text-gray-400 mb-3">
            Prescribing History
          </p>
          <div className="space-y-2">
            {history.map((entry, index) => (
              <div key={index} className="flex gap-4">
                <span className="font-geist font-medium text-sm text-gray-500 w-12 flex-shrink-0">
                  {entry.year}
                </span>
                <span className="font-geist text-sm text-gray-600">
                  {entry.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  )
}
