import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'

interface LoginScreenProps {
  onComplete: () => void
}

export function LoginScreen({ onComplete }: LoginScreenProps) {
  const [username, setUsername] = useState('')
  const [passwordDots, setPasswordDots] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [activeField, setActiveField] = useState<'username' | 'password' | null>('username')
  const [buttonPressed, setButtonPressed] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const { requestFocusAfterLogin } = useAccessibility()

  const fullUsername = 'A.CHARLWOOD'
  const passwordLength = 8

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // Refs for interval cleanup
  const usernameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const passwordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cursorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const triggerComplete = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      requestFocusAfterLogin()
      onComplete()
    }, prefersReducedMotion ? 0 : 200)
  }, [onComplete, requestFocusAfterLogin, prefersReducedMotion])

  const startLoginSequence = useCallback(() => {
    if (prefersReducedMotion) {
      setUsername(fullUsername)
      setPasswordDots(passwordLength)
      setActiveField(null)
      setTimeout(() => {
        setButtonPressed(true)
        setTimeout(() => {
          triggerComplete()
        }, 100)
      }, 300)
      return
    }

    // Username typing: 30ms per character
    let usernameIndex = 0
    usernameIntervalRef.current = setInterval(() => {
      if (usernameIndex <= fullUsername.length) {
        setUsername(fullUsername.slice(0, usernameIndex))
        usernameIndex++
      } else {
        if (usernameIntervalRef.current) {
          clearInterval(usernameIntervalRef.current)
        }
        setActiveField('password')

        // Password dots: 20ms per dot, after 150ms pause
        setTimeout(() => {
          let dotCount = 0
          passwordIntervalRef.current = setInterval(() => {
            if (dotCount <= passwordLength) {
              setPasswordDots(dotCount)
              dotCount++
            } else {
              if (passwordIntervalRef.current) {
                clearInterval(passwordIntervalRef.current)
              }
              setActiveField(null)

              // Button press: after 150ms pause
              setTimeout(() => {
                setButtonPressed(true)
                setTimeout(() => {
                  triggerComplete()
                }, 200)
              }, 150)
            }
          }, 20)
        }, 150)
      }
    }, 30)
  }, [triggerComplete, prefersReducedMotion])

  useEffect(() => {
    // Cursor blink: 530ms interval
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    // Delay start slightly for card entrance
    const startTimeout = setTimeout(() => {
      startLoginSequence()
    }, 200)

    return () => {
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current)
      if (usernameIntervalRef.current) clearInterval(usernameIntervalRef.current)
      if (passwordIntervalRef.current) clearInterval(passwordIntervalRef.current)
      clearTimeout(startTimeout)
    }
  }, [startLoginSequence])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: '#1E293B' }}
      role="status"
      aria-label="Clinical system login"
    >
      <motion.div
        className="bg-white"
        style={{
          width: '320px',
          padding: '32px',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isExiting ? { scale: 1.03, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Branding Header */}
        <div
          className="flex flex-col items-center"
          style={{ marginBottom: '28px' }}
        >
          <div
            style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 94, 184, 0.07)',
              marginBottom: '10px',
            }}
          >
            <Shield
              size={26}
              style={{ color: '#005EB8' }}
              strokeWidth={2.5}
            />
          </div>
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: '#64748B',
              letterSpacing: '0.01em',
            }}
          >
            CareerRecord PMR
          </span>
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: '#94A3B8',
              marginTop: '2px',
            }}
          >
            Clinical Information System
          </span>
        </div>

        {/* Login Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: '#64748B',
                marginBottom: '6px',
              }}
            >
              Username
            </label>
            <div
              style={{
                width: '100%',
                padding: '9px 11px',
                fontFamily: "'Geist Mono', 'Fira Code', monospace",
                fontSize: '13px',
                backgroundColor: activeField === 'username' ? '#FFFFFF' : '#FAFAFA',
                border: activeField === 'username' ? '1px solid #005EB8' : '1px solid #E5E7EB',
                borderRadius: '4px',
                color: '#111827',
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 150ms ease-out, border-color 150ms ease-out',
              }}
            >
              <span>{username}</span>
              {activeField === 'username' && (
                <span
                  style={{ opacity: showCursor ? 1 : 0, color: '#005EB8' }}
                  aria-hidden="true"
                >
                  |
                </span>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: '#64748B',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div
              style={{
                width: '100%',
                padding: '9px 11px',
                fontFamily: "'Geist Mono', 'Fira Code', monospace",
                fontSize: '13px',
                backgroundColor: activeField === 'password' ? '#FFFFFF' : '#FAFAFA',
                border: activeField === 'password' ? '1px solid #005EB8' : '1px solid #E5E7EB',
                borderRadius: '4px',
                color: '#111827',
                letterSpacing: '0.15em',
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 150ms ease-out, border-color 150ms ease-out',
              }}
            >
              <span>{'\u2022'.repeat(passwordDots)}</span>
              {activeField === 'password' && (
                <span
                  style={{ opacity: showCursor ? 1 : 0, color: '#005EB8' }}
                  aria-hidden="true"
                >
                  |
                </span>
              )}
            </div>
          </div>

          {/* Log In Button */}
          <button
            style={{
              width: '100%',
              padding: '10px 16px',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: buttonPressed ? '#004494' : '#005EB8',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 100ms ease-out',
            }}
          >
            Log In
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '22px',
            paddingTop: '18px',
            borderTop: '1px solid #E5E7EB',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '11px',
              color: '#94A3B8',
              textAlign: 'center',
            }}
          >
            Secure clinical system login
          </p>
        </div>
      </motion.div>
    </div>
  )
}
