import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { consultations } from '@/data/consultations'
import type { Consultation, ViewId } from '@/types/pmr'

// ─── Props ──────────────────────────────────────────────────────────────────

interface ConsultationsViewProps {
  onNavigate?: (view: ViewId, itemId?: string) => void
  initialExpandedId?: string
}

export function ConsultationsView({ initialExpandedId }: ConsultationsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(initialExpandedId ?? null)

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-ui font-semibold text-[18px] text-gray-900">
          Consultation Journal
        </h1>
        <span className="font-geist text-[12px] text-gray-500">
          {consultations.length} entries
        </span>
      </div>

      <div className="space-y-3">
        {consultations.map(consultation => (
          <ConsultationEntry
            key={consultation.id}
            consultation={consultation}
            isExpanded={expandedId === consultation.id}
            onToggle={() => handleToggle(consultation.id)}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Consultation Entry ─────────────────────────────────────────────────────

interface ConsultationEntryProps {
  consultation: Consultation
  isExpanded: boolean
  onToggle: () => void
  prefersReducedMotion: boolean
}

function ConsultationEntry({
  consultation,
  isExpanded,
  onToggle,
  prefersReducedMotion,
}: ConsultationEntryProps) {
  const keyCodedEntry = consultation.codedEntries[0]

  return (
    <article
      className="bg-white border border-[#E5E7EB] rounded shadow-pmr overflow-hidden"
      style={{ borderLeftWidth: '3px', borderLeftColor: consultation.orgColor }}
    >
      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-[#EFF6FF] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pmr-nhsblue/40 focus-visible:ring-inset"
        aria-expanded={isExpanded}
        aria-label={`${consultation.role} at ${consultation.organization}, ${consultation.date}`}
      >
        <StatusDot isCurrent={consultation.isCurrent} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-geist text-[13px] text-gray-500">
              {consultation.date}
            </span>
            <span className="text-gray-300">|</span>
            <span
              className="font-ui text-[13px]"
              style={{ color: consultation.orgColor }}
            >
              {consultation.organization}
            </span>
          </div>

          <h3 className="font-ui font-semibold text-[15px] text-gray-900 mt-1">
            {consultation.role}
          </h3>

          {!isExpanded && keyCodedEntry && (
            <p className="font-ui text-[13px] text-gray-500 mt-1 line-clamp-1">
              <span className="font-medium text-gray-400">Key:</span>{' '}
              <span className="font-geist text-[12px] text-gray-400">
                [{keyCodedEntry.code}]
              </span>{' '}
              {keyCodedEntry.description}
            </p>
          )}
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </button>

      {/* Expandable content — height-only animation, NO opacity fade */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: 'easeOut',
            }}
            className="overflow-hidden"
          >
            <ExpandedContent consultation={consultation} />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

// ─── Status Dot ─────────────────────────────────────────────────────────────

interface StatusDotProps {
  isCurrent: boolean
}

function StatusDot({ isCurrent }: StatusDotProps) {
  return (
    <span
      className="flex-shrink-0 mt-1.5"
      aria-label={isCurrent ? 'Current role' : 'Historical role'}
    >
      <span
        className={`block w-2 h-2 rounded-full ${
          isCurrent ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
    </span>
  )
}

// ─── Expanded Content ───────────────────────────────────────────────────────

interface ExpandedContentProps {
  consultation: Consultation
}

function ExpandedContent({ consultation }: ExpandedContentProps) {
  return (
    <div className="px-4 pb-4">
      <div className="pl-5 border-l border-[#E5E7EB] ml-1">
        {/* Duration */}
        <div className="mb-4">
          <span className="font-ui text-[13px] text-gray-500">Duration: </span>
          <span className="font-geist text-[13px] text-gray-700">
            {consultation.duration}
          </span>
        </div>

        {/* HISTORY */}
        <SectionHeader>HISTORY</SectionHeader>
        <p className="font-ui text-[13px] text-gray-700 leading-relaxed mb-4">
          {consultation.history}
        </p>

        {/* EXAMINATION */}
        <SectionHeader>EXAMINATION</SectionHeader>
        <ul className="space-y-1.5 mb-4">
          {consultation.examination.map((item, index) => (
            <li key={index} className="flex gap-2 text-[13px]">
              <span className="text-gray-300 flex-shrink-0">-</span>
              <span className="font-ui text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        {/* PLAN */}
        <SectionHeader>PLAN</SectionHeader>
        <ul className="space-y-1.5 mb-4">
          {consultation.plan.map((item, index) => (
            <li key={index} className="flex gap-2 text-[13px]">
              <span className="text-gray-300 flex-shrink-0">-</span>
              <span className="font-ui text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        {/* CODED ENTRIES */}
        <SectionHeader>CODED ENTRIES</SectionHeader>
        <div className="space-y-1">
          {consultation.codedEntries.map(entry => (
            <CodedEntry
              key={entry.code}
              code={entry.code}
              description={entry.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Section Header ─────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-ui font-semibold text-[12px] uppercase tracking-[0.05em] text-gray-400 mb-2">
      {children}
    </h4>
  )
}

// ─── Coded Entry ────────────────────────────────────────────────────────────

interface CodedEntryProps {
  code: string
  description: string
}

function CodedEntry({ code, description }: CodedEntryProps) {
  return (
    <div className="font-geist text-[12px] text-gray-500">
      [{code}] {description}
    </div>
  )
}
