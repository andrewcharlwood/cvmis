import { Download, Mail, Linkedin, MoreHorizontal } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { patient } from '@/data/patient'

interface PatientBannerProps {
  isMobile?: boolean
  isTablet?: boolean
  isCondensed?: boolean
}

export function PatientBanner({ isMobile = false, isTablet = false, isCondensed = false }: PatientBannerProps) {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  if (isMobile) {
    return <MobileBanner />
  }

  const shouldCondense = isTablet || isCondensed

  return (
    <header
      className={`
        w-full z-40
        bg-pmr-banner border-b border-slate-600
        shadow-pmr-banner
        transition-all duration-200 ease-out
        ${shouldCondense ? 'h-12' : 'h-20'}
      `}
      role="banner"
    >
      <AnimatePresence mode="wait" initial={false}>
        {shouldCondense ? (
          <motion.div
            key="condensed"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <CondensedBanner />
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <FullBanner />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function MobileBanner() {
  const [showOverflow, setShowOverflow] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowOverflow(false)
    }
  }, [])

  useEffect(() => {
    if (showOverflow) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOverflow, handleClickOutside])

  return (
    <header
      className="w-full z-40 h-12 bg-pmr-banner border-b border-slate-600 shadow-pmr-banner"
      role="banner"
    >
      <div className="h-full px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h1 className="font-ui font-semibold text-white text-sm tracking-tight truncate">
            CHARLWOOD, A (Mr)
          </h1>
          <span className="text-slate-500">|</span>
          <span className="font-geist text-xs text-slate-300">
            {patient.nhsNumber}
          </span>
          <StatusDot status={patient.status} />
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowOverflow(!showOverflow)}
            className="p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Actions menu"
            aria-expanded={showOverflow}
          >
            <MoreHorizontal size={18} />
          </button>
          <AnimatePresence>
            {showOverflow && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-44 bg-white border border-pmr-border rounded shadow-pmr z-50 py-1"
              >
                <a
                  href="/cv.pdf"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-ui text-pmr-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setShowOverflow(false)}
                >
                  <Download size={14} />
                  Download CV
                </a>
                <a
                  href={`mailto:${patient.email}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-ui text-pmr-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setShowOverflow(false)}
                >
                  <Mail size={14} />
                  Email
                </a>
                <a
                  href={`https://${patient.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-ui text-pmr-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setShowOverflow(false)}
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              </motion.div>
            )}
          </AnimatePresence>
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
          {/* Row 1: Name, status, badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-ui font-semibold text-white text-lg tracking-tight">
              {patient.name}
            </h1>
            <div className="flex items-center gap-1.5">
              <StatusDot status={patient.status} />
              <span className="text-slate-400 text-sm font-ui">{patient.status}</span>
            </div>
            {patient.badge && <StatusBadge badge={patient.badge} />}
          </div>

          {/* Row 2: Demographics with pipe separators */}
          <div className="flex items-center gap-4 mt-1 flex-wrap text-sm text-slate-300 font-ui">
            <span>
              <span className="text-slate-500">DOB:</span>{' '}
              <span className="font-geist">{patient.dob}</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">NHS No:</span>{' '}
              <NHSNumberWithTooltip />
            </span>
            <span className="text-slate-500">|</span>
            <span>{patient.address}</span>
          </div>

          {/* Row 3: Contact details */}
          <div className="flex items-center gap-4 mt-1 flex-wrap text-sm text-slate-300 font-ui">
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

        {/* Action buttons */}
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
        <h1 className="font-ui font-semibold text-white text-sm tracking-tight truncate">
          {patient.name}
        </h1>
        <span className="text-slate-500">|</span>
        <span className="flex items-center gap-1 text-sm text-slate-300">
          <span className="text-slate-500 font-ui">NHS No:</span>{' '}
          <NHSNumberWithTooltip condensed />
        </span>
        <span className="text-slate-500">|</span>
        <div className="flex items-center gap-1.5">
          <StatusDot status={patient.status} />
          <span className="text-slate-400 text-xs font-ui">{patient.status}</span>
        </div>
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

/* --- Sub-components --- */

interface NHSNumberWithTooltipProps {
  condensed?: boolean
}

function NHSNumberWithTooltip({ condensed = false }: NHSNumberWithTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 300)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowTooltip(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <span
        className={`font-geist cursor-help border-b border-dotted border-slate-500 ${condensed ? 'text-sm' : ''}`}
        tabIndex={0}
        role="button"
        aria-describedby="nhs-tooltip"
      >
        {patient.nhsNumber}
      </span>
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            id="nhs-tooltip"
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2.5 py-1 bg-slate-800 text-white text-xs font-ui rounded whitespace-nowrap z-50 shadow-lg pointer-events-none"
          >
            {patient.nhsNumberTooltip}
            <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-slate-800 rotate-45" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
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
    <span className="px-2.5 py-0.5 bg-pmr-nhsblue text-white text-xs font-ui font-medium rounded-full">
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
        transition-colors duration-150
        rounded
        font-ui font-medium
        focus:outline-none focus:ring-2 focus:ring-pmr-nhsblue/40 focus:ring-offset-1 focus:ring-offset-pmr-banner
        ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}
      `}
    >
      {icon}
      <span>{label}</span>
    </a>
  )
}
