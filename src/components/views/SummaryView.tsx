import { useState, useEffect } from 'react'
import { AlertTriangle, Check, ChevronRight } from 'lucide-react'
import { patient } from '@/data/patient'
import { consultations } from '@/data/consultations'
import { problems } from '@/data/problems'
import { medications } from '@/data/medications'
import type { ViewId } from '@/types/pmr'

interface SummaryViewProps {
  onNavigate?: (view: ViewId, itemId?: string) => void
}

export function SummaryView({ onNavigate }: SummaryViewProps) {
  const [alertDismissed, setAlertDismissed] = useState(false)
  const [alertAnimating, setAlertAnimating] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertVisible(true)
    }, prefersReducedMotion ? 0 : 300)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion])

  const handleDismissAlert = () => {
    setAlertAnimating(true)
    setTimeout(() => {
      setAlertDismissed(true)
    }, prefersReducedMotion ? 0 : 400)
  }

  const activeProblems = problems.filter(p => p.status === 'Active' || p.status === 'In Progress')
  const topMedications = medications.filter(m => m.category === 'Active').slice(0, 5)
  const lastConsultation = consultations[0]

  return (
    <div className="space-y-6">
      {!alertDismissed && (
        <ClinicalAlert
          visible={alertVisible}
          animating={alertAnimating}
          onDismiss={handleDismissAlert}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemographicsCard />
        <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveProblemsCard
            problems={activeProblems}
            onNavigate={onNavigate}
          />
          <QuickMedsCard
            medications={topMedications}
            onNavigate={onNavigate}
          />
        </div>
        <LastConsultationCard
          consultation={lastConsultation}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  )
}

interface ClinicalAlertProps {
  visible: boolean
  animating: boolean
  onDismiss: () => void
  prefersReducedMotion: boolean
}

function ClinicalAlert({ visible, animating, onDismiss, prefersReducedMotion }: ClinicalAlertProps) {
  const [showCheck, setShowCheck] = useState(false)

  const handleClick = () => {
    if (!prefersReducedMotion) {
      setShowCheck(true)
      setTimeout(onDismiss, 200)
    } else {
      onDismiss()
    }
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        overflow-hidden transition-all duration-200 ease-out
        ${visible && !animating ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}
        ${prefersReducedMotion ? '!max-h-24 !opacity-100' : ''}
      `}
    >
      <div
        className="flex items-start gap-3 p-4 rounded border-l-4"
        style={{
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
        }}
      >
        <div className="flex-shrink-0 mt-0.5 relative w-5 h-5">
          <AlertTriangle
            size={20}
            className={`
              text-amber-600 transition-opacity duration-200
              ${showCheck ? 'opacity-0' : 'opacity-100'}
            `}
          />
          <Check
            size={20}
            className={`
              text-green-600 absolute inset-0 transition-opacity duration-200
              ${showCheck ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-inter font-medium text-sm" style={{ color: '#92400E' }}>
            <span className="font-semibold">ALERT:</span> This patient has identified <span className="font-semibold">£14.6M</span> in prescribing efficiency savings across Norfolk & Waveney ICS.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium border rounded transition-colors duration-100"
          style={{
            borderColor: '#F59E0B',
            color: '#92400E',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F59E0B'
            e.currentTarget.style.color = '#FFFFFF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#92400E'
          }}
        >
          Acknowledge
        </button>
      </div>
    </div>
  )
}

function DemographicsCard() {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-inter font-semibold text-sm uppercase tracking-wide text-gray-500">
          Patient Demographics
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <DemographicsRow label="Name" value={patient.displayName} />
          <DemographicsRow
            label="Status"
            value={
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pmr-green" />
                <span>{patient.status}</span>
              </span>
            }
          />
          <DemographicsRow label="DOB" value={patient.dob} />
          <DemographicsRow label="Location" value={patient.address} />
          <DemographicsRow
            label="Registration"
            value={
              <span>
                <span className="text-gray-500">GPhC</span>{' '}
                <span className="font-geist text-sm">{patient.nhsNumber.replace(/ /g, '')}</span>
              </span>
            }
          />
          <DemographicsRow label="Since" value={patient.registrationYear} />
          <DemographicsRow label="Qualification" value={patient.qualification} />
          <DemographicsRow label="University" value={patient.university} />
        </div>
      </div>
    </div>
  )
}

interface DemographicsRowProps {
  label: string
  value: React.ReactNode
}

function DemographicsRow({ label, value }: DemographicsRowProps) {
  return (
    <div className="flex items-start gap-4">
      <span className="font-inter font-medium text-sm text-gray-500 min-w-[100px] text-right flex-shrink-0">
        {label}:
      </span>
      <span className="font-inter text-sm text-gray-900">{value}</span>
    </div>
  )
}

interface ActiveProblemsCardProps {
  problems: typeof problems
  onNavigate?: (view: ViewId, itemId?: string) => void
}

function ActiveProblemsCard({ problems, onNavigate }: ActiveProblemsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-inter font-semibold text-sm uppercase tracking-wide text-gray-500">
          Active Problems
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {problems.map((problem) => (
          <button
            key={problem.id}
            type="button"
            onClick={() => onNavigate?.('problems', problem.id)}
            className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors"
          >
            <TrafficLight status={problem.status} />
            <div className="flex-1 min-w-0">
              <p className="font-inter font-medium text-sm text-gray-900 line-clamp-2">
                {problem.description}
              </p>
              {problem.since && (
                <p className="font-geist text-xs text-gray-500 mt-1">{problem.since}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

interface TrafficLightProps {
  status: 'Active' | 'In Progress' | 'Resolved'
}

function TrafficLight({ status }: TrafficLightProps) {
  const colors = {
    'Active': { bg: 'bg-green-500', label: 'Active' },
    'In Progress': { bg: 'bg-amber-500', label: 'In Progress' },
    'Resolved': { bg: 'bg-green-500', label: 'Resolved' },
  }
  const color = colors[status]

  return (
    <span className="flex items-center gap-2 flex-shrink-0 mt-0.5">
      <span className={`w-2 h-2 rounded-full ${color.bg}`} />
    </span>
  )
}

interface QuickMedsCardProps {
  medications: typeof medications
  onNavigate?: (view: ViewId) => void
}

function QuickMedsCard({ medications, onNavigate }: QuickMedsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-inter font-semibold text-sm uppercase tracking-wide text-gray-500">
          Current Medications (Quick View)
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th scope="col" className="px-4 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                Drug
              </th>
              <th scope="col" className="px-4 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                Dose
              </th>
              <th scope="col" className="px-4 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                Freq
              </th>
              <th scope="col" className="px-4 py-2 text-left font-inter font-semibold text-xs uppercase tracking-wide text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med, index) => (
              <tr
                key={med.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-4 py-2 font-inter text-sm text-gray-900">
                  {med.name}
                </td>
                <td className="px-4 py-2 font-geist text-sm text-gray-700">
                  {med.dose}%
                </td>
                <td className="px-4 py-2 font-inter text-sm text-gray-700">
                  {med.frequency}
                </td>
                <td className="px-4 py-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pmr-green" />
                    <span className="font-inter text-xs text-gray-600">{med.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onNavigate?.('medications')}
          className="flex items-center gap-1 font-inter text-sm text-pmr-nhsblue hover:underline"
        >
          View Full List
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

interface LastConsultationCardProps {
  consultation: typeof consultations[0]
  onNavigate?: (view: ViewId, itemId?: string) => void
}

function LastConsultationCard({ consultation, onNavigate }: LastConsultationCardProps) {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-inter font-semibold text-sm uppercase tracking-wide text-gray-500">
          Last Consultation
        </h2>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <span className="font-geist">{consultation.date}</span>
              <span>|</span>
              <span className="text-pmr-nhsblue">{consultation.organization}</span>
            </div>
            <h3 className="font-inter font-semibold text-base text-gray-900 mb-2">
              {consultation.role}
            </h3>
            <p className="font-inter text-sm text-gray-600 line-clamp-3">
              {consultation.history}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('consultations', consultation.id)}
            className="flex-shrink-0 flex items-center gap-1 font-inter text-sm text-pmr-nhsblue hover:underline"
          >
            View Full Record
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
