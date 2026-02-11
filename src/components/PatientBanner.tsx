import { Download, Mail, Linkedin, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { patient } from '@/data/patient'
import { useScrollCondensation } from '@/hooks/useScrollCondensation'

interface PatientBannerProps {
  isMobile?: boolean
  isTablet?: boolean
}

export function PatientBanner({ isMobile = false, isTablet = false }: PatientBannerProps) {
  const { isCondensed, sentinelRef } = useScrollCondensation({ threshold: 100 })

  if (isMobile) {
    return (
      <>
        <div
          ref={sentinelRef}
          className="h-0 w-full absolute top-0"
          aria-hidden="true"
        />
        <MobileBanner />
      </>
    )
  }

  const shouldCondense = isTablet || isCondensed

  return (
    <>
      <div
        ref={sentinelRef}
        className="h-0 w-full absolute top-0"
        aria-hidden="true"
      />
      <header
        className={`
          sticky top-0 z-40 w-full
          bg-pmr-banner border-b border-slate-600
          transition-all duration-200 ease-out
          ${shouldCondense ? 'h-12' : 'h-20'}
        `}
        role="banner"
      >
        {shouldCondense ? (
          <CondensedBanner />
        ) : (
          <FullBanner />
        )}
      </header>
    </>
  )
}

function MobileBanner() {
  const [showOverflow, setShowOverflow] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 w-full h-12 bg-pmr-banner border-b border-slate-600"
      role="banner"
    >
      <div className="h-full px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h1 className="font-inter font-semibold text-white text-sm tracking-tight truncate">
            CHARLWOOD, A (Mr)
          </h1>
          <span className="text-slate-500">|</span>
          <span className="font-geist text-xs text-slate-300">
            221 181 0
          </span>
          <StatusDot status="Active" />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOverflow(!showOverflow)}
            className="p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Actions menu"
            aria-expanded={showOverflow}
          >
            <MoreHorizontal size={18} />
          </button>
          {showOverflow && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowOverflow(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
                <a
                  href="/cv.pdf"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowOverflow(false)}
                >
                  <Download size={14} />
                  Download CV
                </a>
                <a
                  href={`mailto:${patient.email}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowOverflow(false)}
                >
                  <Mail size={14} />
                  Email
                </a>
                <a
                  href={`https://${patient.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowOverflow(false)}
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function FullBanner() {
  return (
    <div className="h-full px-4 lg:px-6 flex flex-col justify-center">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-inter font-semibold text-white text-lg tracking-tight">
              {patient.name}
            </h1>
            <StatusDot status={patient.status} />
            <span className="text-slate-400 text-sm">{patient.status}</span>
            <StatusBadge badge={patient.badge} />
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap text-sm text-slate-300">
            <span>
              <span className="text-slate-500">DOB:</span> {patient.dob}
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">NHS No:</span>{' '}
              <span className="font-geist" title={patient.nhsNumberTooltip}>
                {patient.nhsNumber}
              </span>
            </span>
            <span className="text-slate-500">|</span>
            <span>{patient.address}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap text-sm text-slate-300">
            <a
              href={`tel:${patient.phone}`}
              className="hover:text-white transition-colors"
            >
              {patient.phone}
            </a>
            <span className="text-slate-500">|</span>
            <a
              href={`mailto:${patient.email}`}
              className="hover:text-white transition-colors"
            >
              {patient.email}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ActionButton
            icon={<Download size={14} />}
            label="Download CV"
            href="/cv.pdf"
          />
          <ActionButton
            icon={<Mail size={14} />}
            label="Email"
            href={`mailto:${patient.email}`}
          />
          <ActionButton
            icon={<Linkedin size={14} />}
            label="LinkedIn"
            href={`https://${patient.linkedin}`}
            external
          />
        </div>
      </div>
    </div>
  )
}

function CondensedBanner() {
  return (
    <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="font-inter font-semibold text-white text-sm tracking-tight truncate">
          {patient.name}
        </h1>
        <span className="text-slate-500">|</span>
        <span className="flex items-center gap-1 text-sm text-slate-300">
          <span className="text-slate-500">NHS No:</span>{' '}
          <span className="font-geist" title={patient.nhsNumberTooltip}>
            {patient.nhsNumber}
          </span>
        </span>
        <span className="text-slate-500">|</span>
        <StatusDot status={patient.status} />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <ActionButton
          icon={<Download size={14} />}
          label="Download CV"
          href="/cv.pdf"
          compact
        />
        <ActionButton
          icon={<Mail size={14} />}
          label="Email"
          href={`mailto:${patient.email}`}
          compact
        />
      </div>
    </div>
  )
}

interface StatusDotProps {
  status: string
}

function StatusDot({ status }: StatusDotProps) {
  const colorClass = status === 'Active' ? 'bg-pmr-green' : 'bg-slate-400'
  return (
    <span
      className={`w-2 h-2 rounded-full ${colorClass} flex-shrink-0`}
      aria-label={`Status: ${status}`}
    />
  )
}

interface StatusBadgeProps {
  badge: string
}

function StatusBadge({ badge }: StatusBadgeProps) {
  return (
    <span className="px-2 py-0.5 bg-pmr-nhsblue text-white text-xs font-medium rounded-sm">
      {badge}
    </span>
  )
}

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  href: string
  external?: boolean
  compact?: boolean
}

function ActionButton({ icon, label, href, external, compact }: ActionButtonProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`
        inline-flex items-center gap-1.5
        border border-pmr-nhsblue text-pmr-nhsblue
        hover:bg-pmr-nhsblue hover:text-white
        transition-colors duration-100
        rounded
        ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}
        font-inter font-medium
      `}
    >
      {icon}
      <span>{label}</span>
    </a>
  )
}
