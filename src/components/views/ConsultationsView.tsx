import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { consultations } from '@/data/consultations'
import type { Consultation, ViewId } from '@/types/pmr'

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
        <h1 className="font-inter font-semibold text-lg text-gray-900">
          Consultation History
        </h1>
        <span className="font-geist text-xs text-gray-500">
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
  const contentRef = useRef<HTMLDivElement>(null)
  const expandedContentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(isExpanded ? undefined : 0)

  useEffect(() => {
    if (prefersReducedMotion) {
      setHeight(isExpanded ? undefined : 0)
      return
    }

    if (isExpanded) {
      const timer = setTimeout(() => {
        setHeight(undefined)
      }, 200)
      return () => clearTimeout(timer)
    }
    setHeight(0)
  }, [isExpanded, prefersReducedMotion])

  useEffect(() => {
    if (isExpanded && expandedContentRef.current) {
      expandedContentRef.current.focus()
    }
  }, [isExpanded])

  const keyCodedEntry = consultation.codedEntries[0]

  return (
    <div
      className="bg-white border border-gray-200 rounded overflow-hidden"
      style={{ borderLeftWidth: '3px', borderLeftColor: consultation.orgColor }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors duration-100"
        aria-expanded={isExpanded}
      >
        <StatusDot isCurrent={consultation.isCurrent} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-geist text-sm text-gray-500">{consultation.date}</span>
            <span className="text-gray-300">|</span>
            <span
              className="font-inter text-sm"
              style={{ color: consultation.orgColor }}
            >
              {consultation.organization}
            </span>
          </div>
          <h3 className="font-inter font-semibold text-base text-gray-900 mt-1">
            {consultation.role}
          </h3>
          {!isExpanded && keyCodedEntry && (
            <p className="font-inter text-sm text-gray-500 mt-1 line-clamp-1">
              <span className="text-gray-400">Key:</span>{' '}
              <span className="font-geist text-xs text-gray-400">
                [{keyCodedEntry.code}]
              </span>{' '}
              {keyCodedEntry.description}
            </p>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`
            flex-shrink-0 text-gray-400 transition-transform duration-200 mt-1
            ${isExpanded ? 'rotate-180' : ''}
          `}
        />
      </button>

      <div
        ref={contentRef}
        style={{
          height: height !== undefined ? `${height}px` : 'auto',
          transition: prefersReducedMotion ? 'none' : 'height 200ms ease-out',
          overflow: 'hidden',
        }}
      >
        {isExpanded && (
          <ExpandedContent
            consultation={consultation}
            prefersReducedMotion={prefersReducedMotion}
            contentRef={expandedContentRef}
          />
        )}
      </div>
    </div>
  )
}

interface StatusDotProps {
  isCurrent: boolean
}

function StatusDot({ isCurrent }: StatusDotProps) {
  return (
    <span className="flex-shrink-0 mt-1.5">
      <span
        className={`
          block w-2 h-2 rounded-full
          ${isCurrent ? 'bg-green-500' : 'bg-gray-400'}
        `}
        aria-label={isCurrent ? 'Current role' : 'Historical role'}
      />
    </span>
  )
}

interface ExpandedContentProps {
  consultation: Consultation
  prefersReducedMotion: boolean
  contentRef: React.RefObject<HTMLDivElement>
}

function ExpandedContent({ consultation, prefersReducedMotion, contentRef }: ExpandedContentProps) {
  const opacity = prefersReducedMotion ? 1 : undefined
  const transition = prefersReducedMotion ? 'none' : 'opacity 150ms ease-out'

  return (
    <div
      ref={contentRef}
      tabIndex={-1}
      className="px-4 pb-4 outline-none"
      style={{ opacity, transition }}
    >
      <div className="pl-5 border-l border-gray-200 ml-1">
        <div className="mb-4">
          <span className="font-inter text-sm text-gray-500">Duration: </span>
          <span className="font-geist text-sm text-gray-700">{consultation.duration}</span>
        </div>

        <SectionHeader>HISTORY</SectionHeader>
        <p className="font-inter text-sm text-gray-700 leading-relaxed mb-4">
          {consultation.history}
        </p>

        <SectionHeader>EXAMINATION</SectionHeader>
        <ul className="space-y-1.5 mb-4">
          {consultation.examination.map((item, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="text-gray-300 flex-shrink-0">-</span>
              <span className="font-inter text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <SectionHeader>PLAN</SectionHeader>
        <ul className="space-y-1.5 mb-4">
          {consultation.plan.map((item, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="text-gray-300 flex-shrink-0">-</span>
              <span className="font-inter text-gray-700">{item}</span>
            </li>
          ))}
        </ul>

        <SectionHeader>CODED ENTRIES</SectionHeader>
        <div className="space-y-1">
          {consultation.codedEntries.map(entry => (
            <CodedEntry key={entry.code} code={entry.code} description={entry.description} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-inter font-semibold text-xs uppercase tracking-wider text-gray-400 mb-2">
      {children}
    </h4>
  )
}

interface CodedEntryProps {
  code: string
  description: string
}

function CodedEntry({ code, description }: CodedEntryProps) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="font-geist text-xs text-gray-400 flex-shrink-0">
        [{code}]
      </span>
      <span className="font-inter text-gray-600">{description}</span>
    </div>
  )
}
