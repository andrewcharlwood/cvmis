import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { investigations } from '@/data/investigations'
import type { Investigation } from '@/types/pmr'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useAccessibility } from '@/contexts/AccessibilityContext'

type InvestigationStatus = 'Complete' | 'Ongoing' | 'Live'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function StatusBadge({ status }: { status: InvestigationStatus }) {
  const styles: Record<InvestigationStatus, { badge: string; dot: string; label: string }> = {
    Complete: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Complete',
    },
    Ongoing: {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Ongoing',
    },
    Live: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Live',
    },
  }

  const { badge, dot, label } = styles[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${badge}`}>
      <span className="relative flex h-1.5 w-1.5">
        {status === 'Live' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dot}`} />
      </span>
      {label}
    </span>
  )
}

interface TreeLineProps {
  label: string
  value: React.ReactNode
  isLast?: boolean
}

function TreeLine({ label, value, isLast = false }: TreeLineProps) {
  return (
    <div className="flex">
      <span className="text-gray-400 select-none">{isLast ? '└─ ' : '├─ '}</span>
      <span className="text-gray-500 shrink-0 min-w-[160px]">{label}:</span>
      <span className="ml-2 flex-1">{value}</span>
    </div>
  )
}

function TreeBranch({ label, children, isLast = false }: { label: string; children: React.ReactNode; isLast?: boolean }) {
  return (
    <div>
      <div className="flex">
        <span className="text-gray-400 select-none">{isLast ? '└─ ' : '├─ '}</span>
        <span className="text-gray-500 shrink-0 min-w-[160px]">{label}:</span>
      </div>
      <div className="ml-[18px]">
        {children}
      </div>
    </div>
  )
}

function InvestigationRow({
  investigation,
  isExpanded,
  onToggle,
  index,
}: {
  investigation: Investigation
  isExpanded: boolean
  onToggle: () => void
  index: number
}) {
  const statusBorderColor: Record<InvestigationStatus, string> = {
    Complete: '#10B981',
    Ongoing: '#F59E0B',
    Live: '#10B981',
  }

  return (
    <>
      <tr
        className={`cursor-pointer transition-colors h-[40px] ${
          isExpanded ? 'bg-[#EFF6FF]' : index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'
        } hover:bg-[#EFF6FF]`}
        onClick={onToggle}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`${investigation.name} — ${investigation.status}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <td className="border-b border-r border-[#E5E7EB] px-3 py-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
            <span className="font-ui text-[14px] text-gray-900">{investigation.name}</span>
          </div>
        </td>
        <td className="border-b border-r border-[#E5E7EB] px-3 py-2">
          <span className="font-geist text-[13px] text-gray-500">{investigation.requestedYear}</span>
        </td>
        <td className="border-b border-r border-[#E5E7EB] px-3 py-2">
          <StatusBadge status={investigation.status} />
        </td>
        <td className="border-b border-[#E5E7EB] px-3 py-2">
          <span className="font-ui text-[13px] text-gray-700">{investigation.resultSummary}</span>
        </td>
      </tr>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.tr
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
          >
            <td colSpan={4} className="p-0 border-b border-[#E5E7EB]">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  className="bg-[#F9FAFB] p-4 border-l-4"
                  style={{ borderLeftColor: statusBorderColor[investigation.status] }}
                >
                  <div className="font-geist text-[12px] text-gray-700 leading-relaxed space-y-0.5">
                    <TreeLine label="Date Requested" value={String(investigation.requestedYear)} />
                    <TreeLine label="Date Reported" value={investigation.reportedYear ? String(investigation.reportedYear) : 'Pending'} />
                    <TreeLine
                      label="Status"
                      value={
                        <>
                          {investigation.status}
                          {investigation.status === 'Live' && investigation.externalUrl && (
                            <> — Live at {investigation.externalUrl.replace('https://', '')}</>
                          )}
                        </>
                      }
                    />
                    <TreeLine label="Requesting Clinician" value={investigation.requestingClinician} />
                    <TreeLine label="Methodology" value={investigation.methodology} />
                    <TreeBranch label="Results">
                      {investigation.results.map((result, idx) => (
                        <div key={idx} className="flex">
                          <span className="text-gray-400 select-none">{idx === investigation.results.length - 1 ? '└─ ' : '├─ '}</span>
                          <span>{result}</span>
                        </div>
                      ))}
                    </TreeBranch>
                    <TreeLine label="Tech Stack" value={investigation.techStack.join(', ')} isLast={!investigation.externalUrl} />
                    {investigation.externalUrl && (
                      <div className="flex items-center pt-2">
                        <span className="text-gray-400 select-none">└─ </span>
                        <a
                          href={investigation.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#005EB8] text-white text-[12px] font-medium rounded hover:bg-[#004D9F] transition-colors focus-visible:ring-2 focus-visible:ring-[#005EB8]/40 focus-visible:outline-none"
                        >
                          View Results
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  )
}

function MobileInvestigationCard({
  investigation,
  isExpanded,
  onToggle,
}: {
  investigation: Investigation
  isExpanded: boolean
  onToggle: () => void
}) {
  const statusBorderColor: Record<InvestigationStatus, string> = {
    Complete: '#10B981',
    Ongoing: '#F59E0B',
    Live: '#10B981',
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 text-left focus-visible:ring-2 focus-visible:ring-[#005EB8]/40 focus-visible:ring-inset focus-visible:outline-none"
        aria-expanded={isExpanded}
        aria-label={`${investigation.name} — ${investigation.status}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-ui font-medium text-[14px] text-gray-900">
              {investigation.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="font-geist text-[12px] text-gray-500">{investigation.requestedYear}</span>
              <StatusBadge status={investigation.status} />
            </div>
            <p className="font-ui text-[12px] text-gray-700 mt-2 line-clamp-2">
              {investigation.resultSummary}
            </p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown size={16} className="text-gray-400" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-4 pb-4 border-t border-[#E5E7EB] border-l-4"
              style={{ borderLeftColor: statusBorderColor[investigation.status] }}
            >
              <div className="pt-3 font-geist text-[12px] text-gray-700 leading-relaxed space-y-0.5">
                <TreeLine label="Date Requested" value={String(investigation.requestedYear)} />
                <TreeLine label="Date Reported" value={investigation.reportedYear ? String(investigation.reportedYear) : 'Pending'} />
                <TreeLine
                  label="Status"
                  value={
                    <>
                      {investigation.status}
                      {investigation.status === 'Live' && investigation.externalUrl && (
                        <> — Live at {investigation.externalUrl.replace('https://', '')}</>
                      )}
                    </>
                  }
                />
                <TreeLine label="Clinician" value={investigation.requestingClinician} />
                <TreeLine label="Methodology" value={investigation.methodology} />
                <TreeBranch label="Results">
                  {investigation.results.map((result, idx) => (
                    <div key={idx} className="flex">
                      <span className="text-gray-400 select-none">{idx === investigation.results.length - 1 ? '└─ ' : '├─ '}</span>
                      <span>{result}</span>
                    </div>
                  ))}
                </TreeBranch>
                <TreeLine label="Tech Stack" value={investigation.techStack.join(', ')} isLast={!investigation.externalUrl} />
              </div>
              {investigation.externalUrl && (
                <div className="mt-3">
                  <a
                    href={investigation.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#005EB8] text-white text-[12px] font-medium rounded hover:bg-[#004D9F] transition-colors focus-visible:ring-2 focus-visible:ring-[#005EB8]/40 focus-visible:outline-none"
                  >
                    View Results
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function InvestigationsView() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { isMobile } = useBreakpoint()
  const { setExpandedItem } = useAccessibility()

  const handleToggle = useCallback((id: string, name: string) => {
    const newId = expandedId === id ? null : id
    setExpandedId(newId)
    setExpandedItem(newId ? name : null)
  }, [expandedId, setExpandedItem])

  return (
    <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr overflow-hidden">
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-3">
        <h2 className="font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-500">
          Investigation Results
        </h2>
        <p className="font-ui text-[12px] text-gray-400 mt-1">
          {investigations.length} investigation{investigations.length !== 1 ? 's' : ''} on record. Click a row to view full results.
        </p>
      </div>
      {isMobile ? (
        <div className="p-3 space-y-3 bg-[#F5F7FA]">
          {investigations.map((investigation) => (
            <MobileInvestigationCard
              key={investigation.id}
              investigation={investigation}
              isExpanded={expandedId === investigation.id}
              onToggle={() => handleToggle(investigation.id, investigation.name)}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB]">
                <th
                  scope="col"
                  className="border-b border-r border-[#E5E7EB] px-3 py-2 text-left font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-400"
                >
                  Test Name
                </th>
                <th
                  scope="col"
                  className="border-b border-r border-[#E5E7EB] px-3 py-2 text-left font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-400 w-24"
                >
                  Requested
                </th>
                <th
                  scope="col"
                  className="border-b border-r border-[#E5E7EB] px-3 py-2 text-left font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-400 w-28"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="border-b border-[#E5E7EB] px-3 py-2 text-left font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-400"
                >
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {investigations.map((investigation, index) => (
                <InvestigationRow
                  key={investigation.id}
                  investigation={investigation}
                  isExpanded={expandedId === investigation.id}
                  onToggle={() => handleToggle(investigation.id, investigation.name)}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
