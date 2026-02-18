import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

interface ReferralFormModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  referringClinician: string
  organisationFrom: string
  presentingComplaint: string
  clinicalDetails: string
  contactEmail: string
}

const INITIAL_FORM: FormData = {
  referringClinician: '',
  organisationFrom: '',
  presentingComplaint: '',
  clinicalDetails: '',
  contactEmail: '',
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ReferralFormModal({ isOpen, onClose }: ReferralFormModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.referringClinician,
          organisation: form.organisationFrom,
          subject: form.presentingComplaint,
          message: form.clinicalDetails,
          email: form.contactEmail,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send referral')
      }

      setStatus('success')
      setTimeout(() => {
        setForm(INITIAL_FORM)
        setStatus('idle')
        onClose()
      }, 2000)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send referral. Please try again.')
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-geist-mono)',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-tertiary, #8DA8A5)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontFamily: 'var(--font-ui)',
    fontSize: '14px',
    color: 'var(--text-primary, #1A2B2A)',
    backgroundColor: 'var(--surface, #FFFFFF)',
    border: '1px solid var(--border, #D1DDD9)',
    borderRadius: 'var(--radius-sm, 6px)',
    outline: 'none',
    transition: 'border-color 150ms ease',
  }

  const readOnlyStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: 'var(--bg-dashboard, #F0F5F4)',
    fontStyle: 'italic',
    color: 'var(--text-secondary, #5B7A78)',
    cursor: 'default',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="referral-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(26, 43, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            key="referral-modal"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              width: '100%',
              maxWidth: '540px',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              backgroundColor: 'var(--surface, #FFFFFF)',
              borderRadius: 'var(--radius-card, 8px)',
              boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(26,43,42,0.12))',
              border: '1px solid var(--border-light, #E4EDEB)',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="referral-form-title"
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '2px solid var(--accent, #0D6E6E)',
                backgroundColor: 'var(--bg-dashboard, #F0F5F4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent, #0D6E6E)',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <h2
                  id="referral-form-title"
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--accent, #0D6E6E)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  Patient Referral Form
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Close referral form"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 'var(--radius-sm, 6px)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary, #5B7A78)',
                  transition: 'background-color 150ms, color 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-light, #E0F2F1)'
                  e.currentTarget.style.color = 'var(--accent, #0D6E6E)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary, #5B7A78)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form body */}
            <form
              onSubmit={handleSubmit}
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              {/* Referring Clinician */}
              <div>
                <label style={labelStyle} htmlFor="referringClinician">
                  Referring Clinician
                </label>
                <input
                  id="referringClinician"
                  type="text"
                  required
                  value={form.referringClinician}
                  onChange={(e) => updateField('referringClinician', e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent, #0D6E6E)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border, #D1DDD9)' }}
                />
              </div>

              {/* Organisation Referred From */}
              <div>
                <label style={labelStyle} htmlFor="organisationFrom">
                  Organisation Referred From
                </label>
                <input
                  id="organisationFrom"
                  type="text"
                  value={form.organisationFrom}
                  onChange={(e) => updateField('organisationFrom', e.target.value)}
                  placeholder="Your organisation"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent, #0D6E6E)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border, #D1DDD9)' }}
                />
              </div>

              {/* Organisation Referred To (read-only) */}
              <div>
                <label style={labelStyle} htmlFor="organisationTo">
                  Organisation Referred To
                </label>
                <input
                  id="organisationTo"
                  type="text"
                  readOnly
                  value="A. Charlwood"
                  style={readOnlyStyle}
                  tabIndex={-1}
                />
              </div>

              {/* Receiving Clinician (read-only) */}
              <div>
                <label style={labelStyle} htmlFor="receivingClinician">
                  Receiving Clinician
                </label>
                <input
                  id="receivingClinician"
                  type="text"
                  readOnly
                  value="Mr A. Charlwood"
                  style={readOnlyStyle}
                  tabIndex={-1}
                />
              </div>

              {/* Presenting Complaint */}
              <div>
                <label style={labelStyle} htmlFor="presentingComplaint">
                  Presenting Complaint
                </label>
                <input
                  id="presentingComplaint"
                  type="text"
                  required
                  value={form.presentingComplaint}
                  onChange={(e) => updateField('presentingComplaint', e.target.value)}
                  placeholder="Subject / reason for referral"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent, #0D6E6E)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border, #D1DDD9)' }}
                />
              </div>

              {/* Clinical Details */}
              <div>
                <label style={labelStyle} htmlFor="clinicalDetails">
                  Clinical Details
                </label>
                <textarea
                  id="clinicalDetails"
                  required
                  value={form.clinicalDetails}
                  onChange={(e) => updateField('clinicalDetails', e.target.value)}
                  placeholder="Your message..."
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '100px',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent, #0D6E6E)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border, #D1DDD9)' }}
                />
              </div>

              {/* Contact Email */}
              <div>
                <label style={labelStyle} htmlFor="contactEmail">
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent, #0D6E6E)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border, #D1DDD9)' }}
                />
              </div>

              {/* Success message */}
              {status === 'success' && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(5, 150, 105, 0.08)',
                    border: '1px solid rgba(5, 150, 105, 0.2)',
                    borderRadius: 'var(--radius-sm, 6px)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    color: 'var(--success, #059669)',
                    textAlign: 'center',
                  }}
                >
                  Referral sent successfully!
                </div>
              )}

              {/* Error message */}
              {status === 'error' && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    borderRadius: 'var(--radius-sm, 6px)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    color: 'var(--alert, #DC2626)',
                    textAlign: 'center',
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backgroundColor: status === 'submitting' || status === 'success'
                    ? 'var(--accent-hover, #0A8080)'
                    : 'var(--accent, #0D6E6E)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm, 6px)',
                  cursor: status === 'submitting' || status === 'success' ? 'default' : 'pointer',
                  opacity: status === 'submitting' ? 0.8 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 150ms, opacity 150ms',
                }}
                onMouseEnter={(e) => {
                  if (status === 'idle' || status === 'error') {
                    e.currentTarget.style.backgroundColor = 'var(--accent-hover, #0A8080)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (status === 'idle' || status === 'error') {
                    e.currentTarget.style.backgroundColor = 'var(--accent, #0D6E6E)'
                  }
                }}
              >
                {status === 'submitting' ? (
                  'Sending referral...'
                ) : status === 'success' ? (
                  'Referral sent!'
                ) : (
                  <>
                    <Send size={16} />
                    Submit Referral
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
