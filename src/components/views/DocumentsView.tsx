import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, FileText, Award, GraduationCap, FlaskConical } from 'lucide-react'
import { documents } from '@/data/documents'
import type { Document, DocumentType } from '@/types/pmr'

function DocumentTypeIcon({ type }: { type: DocumentType }) {
  const iconMap: Record<DocumentType, React.ReactNode> = {
    Certificate: <FileText className="w-4 h-4 text-gray-500" />,
    Registration: <Award className="w-4 h-4 text-gray-500" />,
    Results: <GraduationCap className="w-4 h-4 text-gray-500" />,
    Research: <FlaskConical className="w-4 h-4 text-gray-500" />,
  }

  return (
    <div className="flex items-center justify-center">
      {iconMap[type]}
    </div>
  )
}

function DocumentRow({
  document,
  isExpanded,
  onToggle,
}: {
  document: Document
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
        <td className="border border-gray-200 px-3 py-2.5 w-12">
          <DocumentTypeIcon type={document.type} />
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <span className="text-sm text-gray-900">{document.title}</span>
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <span className="font-mono text-xs text-gray-500">{document.date}</span>
        </td>
        <td className="border border-gray-200 px-3 py-2.5">
          <span className="text-sm text-gray-700">{document.source}</span>
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
                  <span className="text-gray-400 w-40 shrink-0">Type:</span>
                  <span>{document.type}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-40 shrink-0">Date Awarded:</span>
                  <span>{document.date}</span>
                </div>
                {document.institution && (
                  <div className="flex">
                    <span className="text-gray-400 w-40 shrink-0">Institution:</span>
                    <span>{document.institution}</span>
                  </div>
                )}
                {document.classification && (
                  <div className="flex">
                    <span className="text-gray-400 w-40 shrink-0">Classification:</span>
                    <span>{document.classification}</span>
                  </div>
                )}
                {document.duration && (
                  <div className="flex">
                    <span className="text-gray-400 w-40 shrink-0">Duration:</span>
                    <span>{document.duration}</span>
                  </div>
                )}
                {document.researchDetail && (
                  <div className="flex">
                    <span className="text-gray-400 w-40 shrink-0">Research:</span>
                    <span className="flex-1">
                      {document.researchDetail}
                      {document.researchGrade && (
                        <><br />Grade: {document.researchGrade}</>
                      )}
                    </span>
                  </div>
                )}
                {document.notes && (
                  <div className="flex">
                    <span className="text-gray-400 w-40 shrink-0">Notes:</span>
                    <span className="flex-1 text-gray-600">{document.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}

export function DocumentsView() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <h2 className="font-inter font-semibold text-sm uppercase tracking-wider text-gray-500">
          Attached Documents
        </h2>
        <p className="font-inter text-xs text-gray-400 mt-1">
          Education and certifications presented as attached documents in the patient record.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th
                scope="col"
                className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-12"
              >
                Type
              </th>
              <th
                scope="col"
                className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400"
              >
                Document
              </th>
              <th
                scope="col"
                className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-20"
              >
                Date
              </th>
              <th
                scope="col"
                className="border border-gray-200 px-3 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 w-32"
              >
                Source
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
            {documents.map((document) => (
              <DocumentRow
                key={document.id}
                document={document}
                isExpanded={expandedId === document.id}
                onToggle={() => handleToggle(document.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {documents.length === 0 && (
        <div className="p-4 text-sm text-gray-500 text-center">No documents attached</div>
      )}
    </div>
  )
}
