import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'
import { patient } from '@/data/patient'
import { consultations } from '@/data/consultations'
import { problems } from '@/data/problems'
import { medications } from '@/data/medications'
import type { ViewId, Problem, Medication, Consultation } from '@/types/pmr'

// ─── Alert state machine ────────────────────────────────────────────────────
type AlertState = 'visible' | 'acknowledging' | 'dismissed'

// ─── Props ──────────────────────────────────────────────────────────────────
interface SummaryViewProps {
  onNavigate?: (view: ViewId, itemId?: string) => void
}

export function SummaryView({ onNavigate }: SummaryViewProps) {
  const [alertState, setAlertState] = useState<AlertState>('visible')

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const handleAcknowledge = useCallback(() => {
    if (prefersReducedMotion) {
      setAlertState('dismissed')
      return
    }
    setAlertState('acknowledging')
    // Icon crossfade (200ms) + hold beat (200ms) = 400ms before collapse
    const timer = setTimeout(() => {
      setAlertState('dismissed')
    }, 400)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion])

  const activeProblems = problems.filter(
    (p) => p.status === 'Active' || p.status === 'In Progress'
  )
  const topMedications = medications
    .filter((m) => m.category === 'Active')
    .slice(0, 5)
  const lastConsultation = consultations[0]

  return (
    <div className="space-y-6">
      {/* Clinical Alert */}
      <AnimatePresence>
        {alertState !== 'dismissed' && (
          <ClinicalAlert
            state={alertState}
            onAcknowledge={handleAcknowledge}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>

      {/* Summary cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Demographics — full width */}
        <DemographicsCard />

        {/* Card 2: Active Problems — left column */}
        <ActiveProblemsCard
          problems={activeProblems}
          onNavigate={onNavigate}
        />

        {/* Card 3: Current Medications Quick View — right column */}
        <QuickMedsCard
          medications={topMedications}
          onNavigate={onNavigate}
        />

        {/* Card 4: Last Consultation — full width */}
        <LastConsultationCard
          consultation={lastConsultation}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  )
}

// ─── Clinical Alert ─────────────────────────────────────────────────────────

interface ClinicalAlertProps {
  state: AlertState
  onAcknowledge: () => void
  prefersReducedMotion: boolean
}

function ClinicalAlert({
  state,
  onAcknowledge,
  prefersReducedMotion,
}: ClinicalAlertProps) {
  const isAcknowledging = state === 'acknowledging'

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={
        prefersReducedMotion
          ? { y: 0, opacity: 1 }
          : { y: '-100%', opacity: 0 }
      }
      animate={{ y: 0, opacity: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : { height: 0, opacity: 0, marginBottom: 0 }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : state === 'acknowledging'
            ? { duration: 0.2, ease: 'easeOut' }
            : { type: 'spring', stiffness: 300, damping: 25 }
      }
      className="overflow-hidden"
    >
      <div
        className="flex items-start gap-3 p-4 rounded border-l-4"
        style={{
          backgroundColor: '#FEF3C7',
          borderLeftColor: '#F59E0B',
        }}
      >
        {/* Icon area — crossfade between AlertTriangle and CheckCircle */}
        <div className="flex-shrink-0 mt-0.5 relative w-5 h-5">
          <AnimatePresence mode="wait">
            {isAcknowledging ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CheckCircle size={20} className="text-green-600" />
              </motion.span>
            ) : (
              <motion.span
                key="warning"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <AlertTriangle size={20} className="text-amber-600" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="font-ui font-medium text-sm" style={{ color: '#92400E' }}>
            <span className="font-semibold">ALERT:</span> This patient has
            identified{' '}
            <span className="font-semibold">£14.6M</span> in prescribing
            efficiency savings across Norfolk &amp; Waveney ICS.
          </p>
        </div>

        {/* Acknowledge button */}
        <button
          type="button"
          onClick={onAcknowledge}
          disabled={isAcknowledging}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-ui font-medium border rounded transition-colors duration-100 hover:bg-[#F59E0B] hover:text-white disabled:opacity-50"
          style={{
            borderColor: '#F59E0B',
            color: isAcknowledging ? '#16A34A' : '#92400E',
          }}
        >
          {isAcknowledging ? 'Acknowledged' : 'Acknowledge'}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Shared Card Components ─────────────────────────────────────────────────

function CardHeader({ title }: { title: string }) {
  return (
    <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-3">
      <h2 className="font-ui font-semibold text-sm uppercase tracking-wide text-gray-500">
        {title}
      </h2>
    </div>
  )
}

// ─── Demographics Card ──────────────────────────────────────────────────────

function DemographicsCard() {
  return (
    <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded shadow-pmr">
      <CardHeader title="Patient Demographics" />
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <DemographicsRow label="Name" value={patient.displayName} />
          <DemographicsRow
            label="Status"
            value={
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>{patient.status}</span>
              </span>
            }
          />
          <DemographicsRow label="DOB" value={patient.dob} mono />
          <DemographicsRow label="Location" value={patient.address} />
          <DemographicsRow
            label="Registration"
            value={
              <span>
                <span className="text-gray-500">GPhC</span>{' '}
                <span className="font-geist text-[13px]">
                  {patient.nhsNumber.replace(/ /g, '')}
                </span>
              </span>
            }
          />
          <DemographicsRow label="Since" value={patient.registrationYear} mono />
          <DemographicsRow
            label="Qualification"
            value={patient.qualification}
          />
          <DemographicsRow label="University" value={patient.university} />
        </div>
      </div>
    </div>
  )
}

interface DemographicsRowProps {
  label: string
  value: React.ReactNode
  mono?: boolean
}

function DemographicsRow({ label, value, mono }: DemographicsRowProps) {
  return (
    <div className="flex items-start gap-4 py-1">
      <span className="font-ui font-medium text-[13px] text-gray-500 min-w-[100px] text-right flex-shrink-0">
        {label}:
      </span>
      <span
        className={`text-sm text-gray-900 ${mono ? 'font-geist' : 'font-ui'}`}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Active Problems Card ───────────────────────────────────────────────────

interface ActiveProblemsCardProps {
  problems: Problem[]
  onNavigate?: (view: ViewId, itemId?: string) => void
}

function ActiveProblemsCard({ problems, onNavigate }: ActiveProblemsCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr">
      <CardHeader title="Active Problems" />
      <div className="divide-y divide-gray-100">
        {problems.map((problem) => (
          <button
            key={problem.id}
            type="button"
            onClick={() => onNavigate?.('problems', problem.id)}
            className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-[#EFF6FF] transition-colors duration-100"
          >
            <TrafficLight status={problem.status} />
            <div className="flex-1 min-w-0">
              <p className="font-ui font-medium text-sm text-gray-900 line-clamp-2">
                {problem.description}
              </p>
              {problem.since && (
                <p className="font-geist text-xs text-gray-500 mt-1">
                  {problem.since}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Traffic Light (always with text label — guardrail) ─────────────────────

interface TrafficLightProps {
  status: 'Active' | 'In Progress' | 'Resolved'
}

function TrafficLight({ status }: TrafficLightProps) {
  const config: Record<
    TrafficLightProps['status'],
    { dotClass: string; label: string }
  > = {
    Active: { dotClass: 'bg-green-500', label: 'Active' },
    'In Progress': { dotClass: 'bg-amber-500', label: 'In Progress' },
    Resolved: { dotClass: 'bg-green-500', label: 'Resolved' },
  }
  const { dotClass, label } = config[status]

  return (
    <span className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
      <span
        className={`w-2 h-2 rounded-full ${dotClass}`}
        aria-hidden="true"
      />
      <span className="font-ui text-xs text-gray-500">{label}</span>
    </span>
  )
}

// ─── Quick Medications Card ─────────────────────────────────────────────────

interface QuickMedsCardProps {
  medications: Medication[]
  onNavigate?: (view: ViewId) => void
}

function QuickMedsCard({ medications, onNavigate }: QuickMedsCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr">
      <CardHeader title="Current Medications (Quick View)" />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th
                scope="col"
                className="px-4 py-2 text-left font-ui font-semibold text-xs uppercase tracking-wider text-gray-400"
              >
                Drug
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left font-ui font-semibold text-xs uppercase tracking-wider text-gray-400"
              >
                Dose
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left font-ui font-semibold text-xs uppercase tracking-wider text-gray-400"
              >
                Freq
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left font-ui font-semibold text-xs uppercase tracking-wider text-gray-400"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med, index) => (
              <tr
                key={med.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'
                } hover:bg-[#EFF6FF] transition-colors duration-100`}
                style={{ height: '40px' }}
              >
                <td className="px-4 py-2 font-ui text-sm text-gray-900">
                  {med.name}
                </td>
                <td className="px-4 py-2 font-geist text-[13px] text-gray-700">
                  {med.dose}%
                </td>
                <td className="px-4 py-2 font-ui text-sm text-gray-700">
                  {med.frequency}
                </td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                    <span className="font-ui text-xs text-gray-600">
                      {med.status}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-[#E5E7EB]">
        <button
          type="button"
          onClick={() => onNavigate?.('medications')}
          className="flex items-center gap-1 font-ui text-sm text-pmr-nhsblue hover:underline"
        >
          View Full List
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Last Consultation Card ─────────────────────────────────────────────────

interface LastConsultationCardProps {
  consultation: Consultation
  onNavigate?: (view: ViewId, itemId?: string) => void
}

function LastConsultationCard({
  consultation,
  onNavigate,
}: LastConsultationCardProps) {
  return (
    <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded shadow-pmr">
      <CardHeader title="Last Consultation" />
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <span className="font-geist text-[12px]">
                {consultation.date}
              </span>
              <span className="text-gray-300">|</span>
              <span className="font-ui text-pmr-nhsblue">
                {consultation.organization}
              </span>
            </div>
            <h3 className="font-ui font-semibold text-[15px] text-gray-900 mb-2">
              {consultation.role}
            </h3>
            <p className="font-ui text-sm text-gray-600 leading-relaxed line-clamp-3">
              {consultation.history}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('consultations', consultation.id)}
            className="flex-shrink-0 flex items-center gap-1 font-ui text-sm text-pmr-nhsblue hover:underline"
          >
            View Full Record
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
