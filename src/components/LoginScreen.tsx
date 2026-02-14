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
  const [activeField, setActiveField] = useState<'username' | 'password' | 'done' | null>('username')
  const [buttonPressed, setButtonPressed] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected'>('connecting')
  const { requestFocusAfterLogin } = useAccessibility()

  const fullUsername = 'a.recruiter'
  const passwordLength = 8

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // Refs for interval/timeout cleanup
  const usernameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const passwordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cursorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])
  const loginButtonRef = useRef<HTMLButtonElement>(null)

  const addTimeout = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay)
    timeoutRefs.current.push(id)
    return id
  }, [])

  const canLogin = typingComplete && connectionState === 'connected'

  const handleLogin = useCallback(() => {
    if (!canLogin || isExiting || isLoading) return
    setButtonPressed(true)
    addTimeout(() => {
      setIsLoading(true)
      addTimeout(() => {
        setIsExiting(true)
        addTimeout(() => {
          requestFocusAfterLogin()
          onComplete()
        }, prefersReducedMotion ? 0 : 200)
      }, prefersReducedMotion ? 0 : 600)
    }, 100)
  }, [canLogin, isExiting, isLoading, onComplete, requestFocusAfterLogin, prefersReducedMotion, addTimeout])

  const startLoginSequence = useCallback(() => {
    if (prefersReducedMotion) {
      setUsername(fullUsername)
      setPasswordDots(passwordLength)
      setActiveField('done')
      setTypingComplete(true)
      // Button is immediately available for user to click
      return
    }

    // Username typing: 80ms per character
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

        // Password dots: 60ms per dot, after 300ms pause
        addTimeout(() => {
          let dotCount = 0
          passwordIntervalRef.current = setInterval(() => {
            if (dotCount <= passwordLength) {
              setPasswordDots(dotCount)
              dotCount++
            } else {
              if (passwordIntervalRef.current) {
                clearInterval(passwordIntervalRef.current)
              }
              setActiveField('done')
              setTypingComplete(true)
              // Button becomes interactive — user clicks to proceed
            }
          }, 60)
        }, 300)
      }
    }, 80)
  }, [prefersReducedMotion, addTimeout])

  // Focus the login button when login becomes available for keyboard accessibility
  useEffect(() => {
    if (canLogin && loginButtonRef.current) {
      loginButtonRef.current.focus()
    }
  }, [canLogin])

  useEffect(() => {
    // Cursor blink: 530ms interval
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    // Connection status: transitions to connected after ~2000ms
    const connectionTimeout = addTimeout(() => {
      setConnectionState('connected')
    }, 2000)

    // Delay start slightly for card entrance animation
    const startTimeout = addTimeout(() => {
      startLoginSequence()
    }, 400)

    // Capture ref value for cleanup
    const pendingTimeouts = timeoutRefs.current

    return () => {
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current)
      if (usernameIntervalRef.current) clearInterval(usernameIntervalRef.current)
      if (passwordIntervalRef.current) clearInterval(passwordIntervalRef.current)
      clearTimeout(startTimeout)
      clearTimeout(connectionTimeout)
      pendingTimeouts.forEach(id => clearTimeout(id))
    }
  }, [startLoginSequence, addTimeout])

  const buttonBg = buttonPressed
    ? '#085858'
    : buttonHovered && canLogin
      ? '#0A8080'
      : '#0D6E6E'

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: '#1A2B2A' }}
      role="dialog"
      aria-label="Clinical system login"
      aria-modal="true"
    >
      <motion.div
        className="bg-white"
        style={{
          width: '320px',
          padding: '32px',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isExiting ? { scale: 1.03, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 0',
              gap: '16px',
            }}
          >
            <div
              className="login-spinner"
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #E5E7EB',
                borderTopColor: '#0D6E6E',
                borderRadius: '50%',
              }}
              role="status"
              aria-label="Loading clinical records"
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: '12px',
                color: 'var(--text-secondary, #5B7A78)',
              }}
            >
              Loading clinical records...
            </span>
          </div>
        ) : (
          <>
            {/* Branding Header */}
            <div
              className="flex flex-col items-center"
              style={{ marginBottom: '28px' }}
            >
              <div
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(13, 110, 110, 0.08)',
                  marginBottom: '10px',
                }}
              >
                <Shield
                  size={26}
                  style={{ color: '#0D6E6E' }}
                  strokeWidth={2.5}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-ui)",
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
                  fontFamily: "var(--font-ui)",
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
                    fontFamily: "var(--font-ui)",
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
                    border: activeField === 'username' ? '1px solid #0D6E6E' : '1px solid #E5E7EB',
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
                      style={{ opacity: showCursor ? 1 : 0, color: '#0D6E6E' }}
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
                    fontFamily: "var(--font-ui)",
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
                    border: activeField === 'password' ? '1px solid #0D6E6E' : '1px solid #E5E7EB',
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
                      style={{ opacity: showCursor ? 1 : 0, color: '#0D6E6E' }}
                      aria-hidden="true"
                    >
                      |
                    </span>
                  )}
                </div>
              </div>

              {/* Log In Button — user clicks to proceed */}
              <button
                ref={loginButtonRef}
                onClick={handleLogin}
                disabled={!canLogin}
                onMouseEnter={() => setButtonHovered(true)}
                onMouseLeave={() => setButtonHovered(false)}
                className="focus-visible:ring-2 focus-visible:ring-[#0D6E6E]/40 focus-visible:ring-offset-2 focus:outline-none"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontFamily: "var(--font-ui)",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backgroundColor: buttonBg,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: canLogin ? 'pointer' : 'default',
                  opacity: canLogin ? 1 : 0.6,
                  transition: 'background-color 150ms, opacity 300ms',
                }}
              >
                Log In
              </button>

              {/* Connection Status Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: connectionState === 'connected' ? '#059669' : '#DC2626',
                    transition: prefersReducedMotion ? 'none' : 'background-color 300ms ease',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
                    fontSize: '10px',
                    color: connectionState === 'connected' ? '#059669' : '#8DA8A5',
                    transition: prefersReducedMotion ? 'none' : 'color 300ms ease',
                  }}
                >
                  {connectionState === 'connected'
                    ? 'Secure connection established'
                    : 'Awaiting secure connection...'}
                </span>
              </div>
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
                  fontFamily: "var(--font-ui)",
                  fontSize: '11px',
                  color: '#94A3B8',
                  textAlign: 'center',
                }}
              >
                Secure clinical system login
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
