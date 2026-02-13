import { useState } from 'react'
import { Send, Mail, Phone, MapPin, ExternalLink, Loader2, CheckCircle } from 'lucide-react'
import { patient } from '@/data/patient'

type Priority = 'urgent' | 'routine' | 'two-week-wait'
type ContactMethod = 'email' | 'phone' | 'linkedin'

interface FormData {
  priority: Priority
  referrerName: string
  referrerEmail: string
  referrerOrg: string
  reason: string
  contactMethod: ContactMethod
}

interface FormErrors {
  referrerName?: string
  referrerEmail?: string
}

const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

function generateRefNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  return `REF-${year}-${month}${day}-${seq}`
}

function PriorityOption({
  value,
  label,
  selected,
  tooltip,
  onSelect,
}: {
  value: Priority
  label: string
  selected: boolean
  tooltip: string
  onSelect: () => void
}) {
  const dotColors: Record<Priority, string> = {
    urgent: 'bg-red-500',
    routine: 'bg-pmr-nhsblue',
    'two-week-wait': 'bg-amber-500',
  }

  const labelColors: Record<Priority, string> = {
    urgent: 'text-red-600',
    routine: 'text-pmr-nhsblue',
    'two-week-wait': 'text-amber-600',
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer group relative">
      <input
        type="radio"
        name="priority"
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? 'border-current' : 'border-gray-300'
        }`}
      >
        {selected && <span className={`w-2 h-2 rounded-full ${dotColors[value]}`} />}
      </span>
      <span className={`font-ui text-sm font-medium ${labelColors[value]}`}>{label}</span>
      <span
        className="absolute left-0 bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs font-ui rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
        role="tooltip"
      >
        {tooltip}
      </span>
    </label>
  )
}

function ContactMethodOption({
  value,
  label,
  selected,
  onSelect,
}: {
  value: ContactMethod
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="contactMethod"
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? 'border-pmr-nhsblue' : 'border-gray-300'
        }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-pmr-nhsblue" />}
      </span>
      <span className="font-ui text-sm text-gray-700">{label}</span>
    </label>
  )
}

function FormField({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string
  id: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-ui font-medium text-[13px] text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="font-ui text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

function DirectContactTable() {
  const contactMethods = [
    {
      label: 'Email',
      value: patient.email,
      href: `mailto:${patient.email}`,
      action: 'Send Email',
      icon: Mail,
    },
    {
      label: 'Phone',
      value: patient.phone,
      href: `tel:${patient.phone}`,
      action: 'Call',
      icon: Phone,
    },
    {
      label: 'LinkedIn',
      value: patient.linkedin,
      href: `https://${patient.linkedin}`,
      action: 'View Profile',
      icon: ExternalLink,
      external: true,
    },
    {
      label: 'Location',
      value: 'Norwich, UK',
      href: null,
      action: null,
      icon: MapPin,
    },
  ]

  return (
    <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr">
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-3">
        <h3 className="font-ui font-semibold text-sm uppercase tracking-wider text-gray-500">
          Direct Contact
        </h3>
      </div>
      <div className="divide-y divide-[#E5E7EB]">
        {contactMethods.map((method) => (
          <div key={method.label} className="flex items-center justify-between px-4 py-3 hover:bg-[#EFF6FF] transition-colors">
            <div className="flex items-center gap-3">
              <method.icon className="w-4 h-4 text-gray-400" />
              <span className="font-ui text-sm text-gray-500 w-20">{method.label}</span>
              {method.href ? (
                <a
                  href={method.href}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noopener noreferrer' : undefined}
                  className="font-geist text-sm text-pmr-nhsblue hover:underline focus-visible:ring-2 focus-visible:ring-pmr-nhsblue/40 focus-visible:outline-none rounded"
                >
                  {method.value}
                </a>
              ) : (
                <span className="font-geist text-sm text-gray-900">{method.value}</span>
              )}
            </div>
            {method.href && (
              <a
                href={method.href}
                target={method.external ? '_blank' : undefined}
                rel={method.external ? 'noopener noreferrer' : undefined}
                className="font-ui text-xs text-pmr-nhsblue hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-pmr-nhsblue/40 focus-visible:outline-none rounded"
              >
                {method.action}
                {method.external && <ExternalLink className="w-3 h-3" />}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReferralsView() {
  const [formData, setFormData] = useState<FormData>({
    priority: 'routine',
    referrerName: '',
    referrerEmail: '',
    referrerOrg: '',
    reason: '',
    contactMethod: 'email',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [refNumber, setRefNumber] = useState('')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.referrerName.trim()) {
      newErrors.referrerName = 'Referrer name is required'
    }
    if (!formData.referrerEmail.trim()) {
      newErrors.referrerEmail = 'Referrer email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.referrerEmail)) {
      newErrors.referrerEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setRefNumber(generateRefNumber())
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleReset = () => {
    setFormData({
      priority: 'routine',
      referrerName: '',
      referrerEmail: '',
      referrerOrg: '',
      reason: '',
      contactMethod: 'email',
    })
    setErrors({})
    setIsSuccess(false)
    setRefNumber('')
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr">
          <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-3">
            <h2 className="font-ui font-semibold text-sm uppercase tracking-wider text-gray-500">
              New Referral
            </h2>
          </div>
          <div className="p-8 text-center">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 ${
                prefersReducedMotion ? '' : 'animate-[fadeIn_200ms_ease-out]'
              }`}
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-ui font-semibold text-lg text-gray-900 mb-2">
              Referral sent successfully
            </h3>
            <p className="font-geist text-sm text-gray-500 mb-1">Reference: {refNumber}</p>
            <p className="font-ui text-sm text-gray-500 mb-6">
              Expected response time: 24-48 hours
            </p>
            <button
              onClick={handleReset}
              className="font-ui font-medium text-sm px-4 py-2 bg-pmr-nhsblue text-white rounded hover:bg-[#004D9F] transition-colors focus-visible:ring-2 focus-visible:ring-pmr-nhsblue/40 focus-visible:outline-none"
            >
              Send Another Referral
            </button>
          </div>
        </div>
        <DirectContactTable />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E7EB] rounded shadow-pmr">
        <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-3">
          <h2 className="font-ui font-semibold text-sm uppercase tracking-wider text-gray-500">
            New Referral
          </h2>
          <p className="font-ui text-xs text-gray-400 mt-1">
            Contact Andy using a clinical referral form format.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="block font-ui font-medium text-[13px] text-gray-600">
                Referring to
              </span>
              <span className="font-ui text-sm text-gray-900">{patient.name}</span>
            </div>
            <div className="space-y-1">
              <span className="block font-ui font-medium text-[13px] text-gray-600">
                NHS Number
              </span>
              <span className="font-geist text-sm text-gray-900">{patient.nhsNumber}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block font-ui font-medium text-[13px] text-gray-600">
              Priority
            </span>
            <div className="flex gap-6">
              <PriorityOption
                value="urgent"
                label="Urgent"
                selected={formData.priority === 'urgent'}
                tooltip="All enquiries are welcome, urgent or not."
                onSelect={() => setFormData({ ...formData, priority: 'urgent' })}
              />
              <PriorityOption
                value="routine"
                label="Routine"
                selected={formData.priority === 'routine'}
                tooltip="Standard response timeframe."
                onSelect={() => setFormData({ ...formData, priority: 'routine' })}
              />
              <PriorityOption
                value="two-week-wait"
                label="Two-Week Wait"
                selected={formData.priority === 'two-week-wait'}
                tooltip="NHS cancer referral pathway — this isn't that, but the spirit of promptness applies."
                onSelect={() => setFormData({ ...formData, priority: 'two-week-wait' })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Referrer Name"
              id="referrerName"
              required
              error={errors.referrerName}
            >
              <input
                type="text"
                id="referrerName"
                value={formData.referrerName}
                onChange={(e) => setFormData({ ...formData, referrerName: e.target.value })}
                className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm font-ui text-gray-900 placeholder-gray-400 focus:border-pmr-nhsblue focus:ring-2 focus:ring-pmr-nhsblue/15 focus:outline-none transition-all duration-200"
                placeholder="Your name"
              />
            </FormField>
            <FormField
              label="Referrer Email"
              id="referrerEmail"
              required
              error={errors.referrerEmail}
            >
              <input
                type="email"
                id="referrerEmail"
                value={formData.referrerEmail}
                onChange={(e) => setFormData({ ...formData, referrerEmail: e.target.value })}
                className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm font-ui text-gray-900 placeholder-gray-400 focus:border-pmr-nhsblue focus:ring-2 focus:ring-pmr-nhsblue/15 focus:outline-none transition-all duration-200"
                placeholder="your.email@example.com"
              />
            </FormField>
          </div>

          <FormField label="Referrer Organisation" id="referrerOrg">
            <input
              type="text"
              id="referrerOrg"
              value={formData.referrerOrg}
              onChange={(e) => setFormData({ ...formData, referrerOrg: e.target.value })}
              className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm font-ui text-gray-900 placeholder-gray-400 focus:border-pmr-nhsblue focus:ring-2 focus:ring-pmr-nhsblue/15 focus:outline-none transition-all duration-200"
              placeholder="Organisation name (optional)"
            />
          </FormField>

          <FormField label="Reason for Referral" id="reason">
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              className="w-full border border-[#D1D5DB] rounded px-3 py-2 text-sm font-ui text-gray-900 placeholder-gray-400 focus:border-pmr-nhsblue focus:ring-2 focus:ring-pmr-nhsblue/15 focus:outline-none transition-all duration-200 resize-y"
              placeholder="Describe the opportunity or reason for contact..."
            />
          </FormField>

          <div className="space-y-2">
            <span className="block font-ui font-medium text-[13px] text-gray-600">
              Contact Method
            </span>
            <div className="flex gap-6">
              <ContactMethodOption
                value="email"
                label="Email"
                selected={formData.contactMethod === 'email'}
                onSelect={() => setFormData({ ...formData, contactMethod: 'email' })}
              />
              <ContactMethodOption
                value="phone"
                label="Phone"
                selected={formData.contactMethod === 'phone'}
                onSelect={() => setFormData({ ...formData, contactMethod: 'phone' })}
              />
              <ContactMethodOption
                value="linkedin"
                label="LinkedIn"
                selected={formData.contactMethod === 'linkedin'}
                onSelect={() => setFormData({ ...formData, contactMethod: 'linkedin' })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={handleReset}
              className="font-ui font-medium text-sm px-4 py-2 border border-[#D1D5DB] text-gray-700 rounded hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-pmr-nhsblue/40 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="font-ui font-medium text-sm px-6 py-2 bg-pmr-nhsblue text-white rounded hover:bg-[#004D9F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-pmr-nhsblue/40 focus-visible:outline-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Referral
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <DirectContactTable />
    </div>
  )
}
