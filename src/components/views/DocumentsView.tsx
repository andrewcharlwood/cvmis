import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, FileText, Award, GraduationCap, FlaskConical } from 'lucide-react'
import { documents } from '@/data/documents'
import type { Document, DocumentType } from '@/types/pmr'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useAccessibility } from '@/contexts/AccessibilityContext'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const documentIcons: Record<DocumentType, React.FC<{ className?: string }>> = {
  Certificate: FileText,
  Registration: Award,
  Results: GraduationCap,
  Research: FlaskConical,
}

function DocumentTypeIcon({ type }: { type: DocumentType }) {
  const Icon = documentIcons[type]
  return (
    <div className="flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
  )
}

const documentBorderColors: Record<DocumentType, string> = {
  Certificate: '#005EB8',
  Registration: '#10B981',
  Results: '#6366F1',
  Research: '#8B5CF6',
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

function DocumentRow({
  document: doc,
  isExpanded,
  onToggle,
  index,
}: {
  document: Document
  isExpanded: boolean
  onToggle: () => void
  index: number
}) {
  const fields: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'Type', value: doc.type },
    { label: 'Date Awarded', value: doc.date },
  ]

  if (doc.institution) fields.push({ label: 'Institution', value: doc.institution })
  if (doc.classification) fields.push({ label: 'Classification', value: doc.classification })
  if (doc.duration) fields.push({ label: 'Duration', value: doc.duration })
  if (doc.researchDetail) {
    fields.push({
      label: 'Research',
      value: (
        <>
          {doc.researchDetail}
          {doc.researchGrade && (
            <>
              <br />
              <span className="text-gray-500">Grade: {doc.researchGrade}</span>
            </>
          )}
        </>
      ),
    })
  }
  if (doc.notes) fields.push({ label: 'Notes', value: <span className="text-gray-600">{doc.notes}</span> })

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
        aria-label={`${doc.title} — ${doc.type}, ${doc.date}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <td className="border-b border-r border-[#E5E7EB] px-3 py-2 w-12">
          <DocumentTypeIcon type={doc.type} />
        </td>
        <td className="border-b border-r border-[#E5E7EB] px-3 py-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
            <span className="font-ui text-[14px] text-gray-900">{doc.title}</span>
          </div>
        </td>
        <td className="border-b border-r border-[#E5E7EB] px-3 py-2">
          <span className="font-geist text-[13px] text-gray-500">{doc.date}</span>
        </td>
        <td className="border-b border-[#E5E7EB] px-3 py-2">
          <span className="font-ui text-[13px] text-gray-700">{doc.source}</span>
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
                  style={{ borderLeftColor: documentBorderColors[doc.type] }}
                >
                  <div className="font-geist text-[12px] text-gray-700 leading-relaxed space-y-0.5">
                    {fields.map((field, idx) => (
                      <TreeLine
                        key={field.label}
                        label={field.label}
                        value={field.value}
                        isLast={idx === fields.length - 1}
                      />
                    ))}
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

function MobileDocumentCard({
  document: doc,
  isExpanded,
  onToggle,
}: {
  document: Document
  isExpanded: boolean
  onToggle: () => void
}) {
  const fields: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'Type', value: doc.type },
    { label: 'Date Awarded', value: doc.date },
  ]

  if (doc.institution) fields.push({ label: 'Institution', value: doc.institution })
  if (doc.classification) fields.push({ label: 'Classification', value: doc.classification })
  if (doc.duration) fields.push({ label: 'Duration', value: doc.duration })
  if (doc.researchDetail) {
    fields.push({
      label: 'Research',
      value: (
        <>
          {doc.researchDetail}
          {doc.researchGrade && (
            <>
              <br />
              <span className="text-gray-500">Grade: {doc.researchGrade}</span>
            </>
          )}
        </>
      ),
    })
  }
  if (doc.notes) fields.push({ label: 'Notes', value: <span className="text-gray-600">{doc.notes}</span> })

  return (
    <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 text-left focus-visible:ring-2 focus-visible:ring-[#005EB8]/40 focus-visible:ring-inset focus-visible:outline-none"
        aria-expanded={isExpanded}
        aria-label={`${doc.title} — ${doc.type}, ${doc.date}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <DocumentTypeIcon type={doc.type} />
              <span className="font-ui text-[12px] text-gray-500">{doc.type}</span>
            </div>
            <h3 className="font-ui font-medium text-[14px] text-gray-900">
              {doc.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="font-geist text-[12px] text-gray-500">{doc.date}</span>
              <span className="text-gray-300">•</span>
              <span className="font-ui text-[12px] text-gray-500">{doc.source}</span>
            </div>
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
              style={{ borderLeftColor: documentBorderColors[doc.type] }}
            >
              <div className="pt-3 font-geist text-[12px] text-gray-700 leading-relaxed space-y-0.5">
                {fields.map((field, idx) => (
                  <TreeLine
                    key={field.label}
                    label={field.label}
                    value={field.value}
                    isLast={idx === fields.length - 1}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DocumentsView() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { isMobile } = useBreakpoint()
  const { setExpandedItem } = useAccessibility()

  const handleToggle = useCallback((id: string, title: string) => {
    const newId = expandedId === id ? null : id
    setExpandedId(newId)
    setExpandedItem(newId ? title : null)
  }, [expandedId, setExpandedItem])

  return (
    <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr overflow-hidden">
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-3">
        <h2 className="font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-500">
          Attached Documents
        </h2>
        <p className="font-ui text-[12px] text-gray-400 mt-1">
          {documents.length} document{documents.length !== 1 ? 's' : ''} attached. Click a row to view details.
        </p>
      </div>
      {isMobile ? (
        <div className="p-3 space-y-3 bg-[#F5F7FA]">
          {documents.map((doc) => (
            <MobileDocumentCard
              key={doc.id}
              document={doc}
              isExpanded={expandedId === doc.id}
              onToggle={() => handleToggle(doc.id, doc.title)}
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
                  className="border-b border-r border-[#E5E7EB] px-3 py-2 text-left font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-400 w-12"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="border-b border-r border-[#E5E7EB] px-3 py-2 text-left font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-400"
                >
                  Document
                </th>
                <th
                  scope="col"
                  className="border-b border-r border-[#E5E7EB] px-3 py-2 text-left font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-400 w-20"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="border-b border-[#E5E7EB] px-3 py-2 text-left font-ui font-semibold text-[13px] uppercase tracking-[0.05em] text-gray-400 w-32"
                >
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <DocumentRow
                  key={doc.id}
                  document={doc}
                  isExpanded={expandedId === doc.id}
                  onToggle={() => handleToggle(doc.id, doc.title)}
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
