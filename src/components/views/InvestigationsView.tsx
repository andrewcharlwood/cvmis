import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Circle } from 'lucide-react'
import { investigations } from '@/data/investigations'
import type { Investigation } from '@/types/pmr'

type InvestigationStatus = 'Complete' | 'Ongoing' | 'Live'

function StatusBadge({ status }: { status: InvestigationStatus }) {
  if (status === 'Live') {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <Circle className="relative inline-flex rounded-full h-2 w-2 bg-green-500 fill-green-500" />
        </span>
        <span className="text-xs text-gray-600">Live</span>
      </div>
    )
  }

  const colorMap: Record<Exclude<InvestigationStatus, 'Live'>, { bg: string; label: string }> = {
    Complete: { bg: 'bg-green-500', label: 'Complete' },
    Ongoing: { bg: 'bg-amber-500', label: 'Ongoing' },
  }

  const { bg, label } = colorMap[status as Exclude<InvestigationStatus, 'Live'>]

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${bg}`}
        aria-label={`Status: ${status}`}
        role="img"
      />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  )
}

function InvestigationRow({
  investigation,
  isExpanded,
  onToggle,
}: {
  investigation: Investigation
  isExpanded: boolean
  onToggle: () => void
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
          <span className="text-sm text-gray-900">{investigation.name}</span>
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <span className="font-mono text-xs text-gray-500">{investigation.requestedYear}</span>
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <StatusBadge status={investigation.status} />
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <span className="text-sm text-gray-700">{investigation.resultSummary}</span>
        </td>
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
        <td colSpan={5} className="p-0 border border-gray-200">
          <div
            style={{
              height: isExpanded ? contentHeight : 0,
              overflow: 'hidden',
              transition: prefersReducedMotion ? 'none' : 'height 200ms ease-out',
            }}
          >
            <div ref={contentRef} className="bg-gray-50 p-4">
              <div className="font-mono text-sm text-gray-700 leading-relaxed space-y-1">
                <div className="flex">
                  <span className="text-gray-400 w-40 shrink-0">Date Requested:</span>
                  <span>{investigation.requestedYear}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-40 shrink-0">Date Reported:</span>
                  <span>{investigation.reportedYear ?? 'Pending'}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-40 shrink-0">Status:</span>
                  <span>
                    {investigation.status}
                    {investigation.status === 'Live' && investigation.externalUrl && (
                      <> — Live at {investigation.externalUrl.replace('https://', '')}</>
                    )}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-40 shrink-0">Requesting Clinician:</span>
                  <span>{investigation.requestingClinician}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-40 shrink-0">Methodology:</span>
                  <span className="flex-1">{investigation.methodology}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-40 shrink-0">Results:</span>
                  <ul className="flex-1 space-y-1">
                    {investigation.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gray-300 mt-1">-</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-40 shrink-0">Tech Stack:</span>
                  <span>{investigation.techStack.join(', ')}</span>
                </div>
              </div>
              {investigation.externalUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={investigation.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-nhsblue text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    View Results
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}

export function InvestigationsView() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <h2 className="font-inter font-semibold text-sm uppercase tracking-wider text-gray-500">
          Investigation Results
        </h2>
        <p className="font-inter text-xs text-gray-400 mt-1">
          Projects presented as diagnostic investigations — tests that were ordered, performed, and returned results.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th
                scope="col"
                className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400"
              >
                Test Name
              </th>
              <th
                scope="col"
                className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-24"
              >
                Requested
              </th>
              <th
                scope="col"
                className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-28"
              >
                Status
              </th>
              <th
                scope="col"
                className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400"
              >
                Result
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
            {investigations.map((investigation) => (
              <InvestigationRow
                key={investigation.id}
                investigation={investigation}
                isExpanded={expandedId === investigation.id}
                onToggle={() => handleToggle(investigation.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {investigations.length === 0 && (
        <div className="p-4 text-sm text-gray-500 text-center">No investigation results</div>
      )}
    </div>
  )
}
