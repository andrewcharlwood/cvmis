import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { problems } from '@/data/problems'
import { consultations } from '@/data/consultations'
import type { Problem, Consultation } from '@/types/pmr'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface ProblemsViewProps {
  onNavigate?: (view: 'consultations', itemId?: string) => void
}

type ProblemStatus = 'Active' | 'In Progress' | 'Resolved'

function TrafficLight({ status }: { status: ProblemStatus }) {
  const colorMap: Record<ProblemStatus, { bg: string; label: string }> = {
    Active: { bg: 'bg-green-500', label: 'Active' },
    'In Progress': { bg: 'bg-amber-500', label: 'In Progress' },
    Resolved: { bg: 'bg-green-500', label: 'Resolved' },
  }

  const { bg, label } = colorMap[status]

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${bg}`}
        aria-label={`Status: ${label}`}
        role="img"
      />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  )
}

function ProblemRow({
  problem,
  isExpanded,
  onToggle,
  onNavigate,
  showOutcome,
}: {
  problem: Problem
  isExpanded: boolean
  onToggle: () => void
  onNavigate?: (view: 'consultations', itemId?: string) => void
  showOutcome: boolean
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined)
  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [isExpanded])

  const linkedConsultations = (problem.linkedConsultations ?? [])
    .map((id) => consultations.find((c) => c.id === id))
    .filter((c): c is Consultation => c !== undefined)

  const handleLinkedClick = (consultationId: string) => {
    if (onNavigate) {
      onNavigate('consultations', consultationId)
    }
  }

  return (
    <>
      <tr
        className={`cursor-pointer hover:bg-blue-50 transition-colors ${
          isExpanded ? 'bg-blue-50' : ''
        }`}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <td className="border border-gray-200 px-3 py-2.5">
          <TrafficLight status={problem.status} />
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <span className="font-mono text-xs text-gray-500">[{problem.code}]</span>
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <span className="text-sm text-gray-900">{problem.description}</span>
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <span className="font-mono text-xs text-gray-500">
            {problem.resolved || problem.since}
          </span>
        </td>
        {showOutcome && (
          <td className="border border-gray-200 px-3 py-2.5">
            {problem.outcome && (
              <span className="text-sm text-gray-700">{problem.outcome}</span>
            )}
          </td>
        )}
        <td className="border border-gray-200 px-3 py-2.5 w-10">
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan={showOutcome ? 6 : 5} className="p-0 border border-gray-200">
          <div
            style={{
              height: isExpanded ? contentHeight : 0,
              overflow: 'hidden',
              transition: prefersReducedMotion ? 'none' : 'height 200ms ease-out',
            }}
          >
            <div ref={contentRef} className="bg-gray-50 p-4">
              <div className="text-sm text-gray-700 leading-relaxed mb-4">
                {problem.narrative}
              </div>
              {linkedConsultations.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Linked Consultations:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {linkedConsultations.map((consultation) => (
                      <button
                        key={consultation.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLinkedClick(consultation.id)
                        }}
                        className="inline-flex items-center gap-1 text-xs text-pmr-nhsblue hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {consultation.organization} — {consultation.role}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}

function MobileProblemCard({
  problem,
  isExpanded,
  onToggle,
  onNavigate,
  showOutcome,
}: {
  problem: Problem
  isExpanded: boolean
  onToggle: () => void
  onNavigate?: (view: 'consultations', itemId?: string) => void
  showOutcome: boolean
}) {
  const linkedConsultations = (problem.linkedConsultations ?? [])
    .map((id) => consultations.find((c) => c.id === id))
    .filter((c): c is Consultation => c !== undefined)

  const handleLinkedClick = (consultationId: string) => {
    if (onNavigate) {
      onNavigate('consultations', consultationId)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TrafficLight status={problem.status} />
              <span className="font-mono text-xs text-gray-500">[{problem.code}]</span>
            </div>
            <h3 className="font-inter font-medium text-sm text-gray-900">
              {problem.description}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
              <span>{showOutcome ? 'Resolved' : 'Since'}: {problem.resolved || problem.since}</span>
              {showOutcome && problem.outcome && (
                <>
                  <span>•</span>
                  <span className="text-gray-700">{problem.outcome}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 mt-1">
            {isExpanded ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-3 text-sm text-gray-700 leading-relaxed">
            {problem.narrative}
          </div>
          {linkedConsultations.length > 0 && (
            <div className="mt-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Linked Consultations:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {linkedConsultations.map((consultation) => (
                  <button
                    key={consultation.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLinkedClick(consultation.id)
                    }}
                    className="inline-flex items-center gap-1 text-xs text-pmr-nhsblue hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {consultation.organization}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ProblemsView({ onNavigate }: ProblemsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { isMobile } = useBreakpoint()

  const activeProblems = problems.filter(
    (p) => p.status === 'Active' || p.status === 'In Progress'
  )
  const resolvedProblems = problems.filter((p) => p.status === 'Resolved')

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h2 className="font-inter font-semibold text-sm uppercase tracking-wider text-gray-500">
            Active Problems
          </h2>
        </div>
        {isMobile ? (
          <div className="p-3 space-y-3 bg-pmr-content">
            {activeProblems.map((problem) => (
              <MobileProblemCard
                key={problem.id}
                problem={problem}
                isExpanded={expandedId === problem.id}
                onToggle={() => handleToggle(problem.id)}
                onNavigate={onNavigate}
                showOutcome={false}
              />
            ))}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-28"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-28"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400"
                >
                  Problem
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-28"
                >
                  Since
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-10"
                >
                  <span className="sr-only">Expand</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {activeProblems.map((problem) => (
                <ProblemRow
                  key={problem.id}
                  problem={problem}
                  isExpanded={expandedId === problem.id}
                  onToggle={() => handleToggle(problem.id)}
                  onNavigate={onNavigate}
                  showOutcome={false}
                />
              ))}
            </tbody>
          </table>
        )}
        {activeProblems.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">No active problems</div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h2 className="font-inter font-semibold text-sm uppercase tracking-wider text-gray-500">
            Resolved Problems
          </h2>
        </div>
        {isMobile ? (
          <div className="p-3 space-y-3 bg-pmr-content">
            {resolvedProblems.map((problem) => (
              <MobileProblemCard
                key={problem.id}
                problem={problem}
                isExpanded={expandedId === problem.id}
                onToggle={() => handleToggle(problem.id)}
                onNavigate={onNavigate}
                showOutcome={true}
              />
            ))}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-28"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-28"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400"
                >
                  Problem
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-28"
                >
                  Resolved
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400"
                >
                  Outcome
                </th>
                <th
                  scope="col"
                  className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-10"
                >
                  <span className="sr-only">Expand</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {resolvedProblems.map((problem) => (
                <ProblemRow
                  key={problem.id}
                  problem={problem}
                  isExpanded={expandedId === problem.id}
                  onToggle={() => handleToggle(problem.id)}
                  onNavigate={onNavigate}
                  showOutcome={true}
                />
              ))}
            </tbody>
          </table>
        )}
        {resolvedProblems.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">No resolved problems</div>
        )}
      </div>
    </div>
  )
}
