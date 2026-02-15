import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { CvmisLogo } from './CvmisLogo'
import { useAccessibility } from '../contexts/AccessibilityContext'

// ── Login screen timing & visual constants ──────────────────────────
const BACKDROP_BLUR_PX = 10

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
  const [dotCount, setDotCount] = useState(0)
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
  const dotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
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
        // After dissolve completes (~600ms), remove overlay and reveal dashboard
        addTimeout(() => {
          requestFocusAfterLogin()
          onComplete()
        }, prefersReducedMotion ? 0 : 600)
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

  // Connection transitions to green 500ms after typing completes
  useEffect(() => {
    if (!typingComplete) return
    const timeout = addTimeout(() => {
      setConnectionState('connected')
    }, prefersReducedMotion ? 0 : 500)
    return () => clearTimeout(timeout)
  }, [typingComplete, addTimeout, prefersReducedMotion])

  // Animated trailing dots while connecting
  useEffect(() => {
    if (connectionState === 'connected' || prefersReducedMotion) {
      if (dotIntervalRef.current) clearInterval(dotIntervalRef.current)
      return
    }
    dotIntervalRef.current = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4)
    }, 500)
    return () => {
      if (dotIntervalRef.current) clearInterval(dotIntervalRef.current)
    }
  }, [connectionState, prefersReducedMotion])

  useEffect(() => {
    // Cursor blink: 530ms interval
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    // Delay start to allow card entrance + logo animation to complete
    // Reduced motion: logo shows instantly, so use original 400ms delay
    // Full motion: 400ms card entrance + 1000ms logo animation + 100ms pause = 1500ms
    const startTimeout = addTimeout(() => {
      startLoginSequence()
    }, prefersReducedMotion ? 400 : 1500)

    // Capture ref value for cleanup
    const pendingTimeouts = timeoutRefs.current

    return () => {
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current)
      if (usernameIntervalRef.current) clearInterval(usernameIntervalRef.current)
      if (passwordIntervalRef.current) clearInterval(passwordIntervalRef.current)
      if (dotIntervalRef.current) clearInterval(dotIntervalRef.current)
      clearTimeout(startTimeout)
      pendingTimeouts.forEach(id => clearTimeout(id))
    }
  }, [startLoginSequence, addTimeout, prefersReducedMotion])

  const buttonBg = buttonPressed
    ? 'var(--accent-pressed, #085858)'
    : buttonHovered && canLogin
      ? 'var(--accent-hover, #0A8080)'
      : 'var(--accent, #0D6E6E)'

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 110,
        backgroundColor: 'rgba(240, 245, 244, 0.7)',
        backdropFilter: `blur(${BACKDROP_BLUR_PX}px)`,
        WebkitBackdropFilter: `blur(${BACKDROP_BLUR_PX}px)`,
      }}
      animate={isExiting ? {
        backgroundColor: 'rgba(240, 245, 244, 0)',
        backdropFilter: 'blur(0px)',
        WebkitBackdropFilter: 'blur(0px)',
      } : {}}
      transition={isExiting ? { duration: 0.6, ease: 'easeOut' } : {}}
      role="dialog"
      aria-label="Clinical system login"
      aria-modal="true"
    >
      <motion.div
        style={{
          width: 'clamp(320px, 28vw, 480px)',
          maxWidth: 'calc(100vw - 32px)',
          padding: 'clamp(24px, 2.5vw, 40px)',
          borderRadius: 'var(--radius-card, 8px)',
          border: '1px solid var(--border-light, #E4EDEB)',
          boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(26,43,42,0.12))',
          backgroundColor: 'var(--surface, #FFFFFF)',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isExiting ? { scale: 1.03, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={isExiting ? { duration: 0.4, ease: 'easeOut' } : { duration: 0.2, ease: 'easeOut' }}
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
                border: '3px solid var(--border-light, #E4EDEB)',
                borderTopColor: 'var(--accent, #0D6E6E)',
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
              <div style={{ marginBottom: '12px' }}>
                <CvmisLogo
                  cssHeight="clamp(160px, 18vw, 280px)"
                  animated={true}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 'clamp(16px, 1.4vw, 20px)',
                  fontWeight: 600,
                  color: 'var(--text-secondary, #5B7A78)',
                  letterSpacing: '0.01em',
                }}
              >
                CVMIS
              </span>
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 'clamp(12px, 1vw, 14px)',
                  fontWeight: 400,
                  color: 'var(--text-tertiary, #8DA8A5)',
                  marginTop: '3px',
                }}
              >
                CV Management Information System
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
                    fontSize: 'clamp(12px, 1vw, 14px)',
                    fontWeight: 500,
                    color: 'var(--text-secondary, #5B7A78)',
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
                    fontSize: 'clamp(13px, 1.1vw, 15px)',
                    backgroundColor: activeField === 'username' ? 'var(--surface, #FFFFFF)' : 'var(--bg-dashboard, #F0F5F4)',
                    border: activeField === 'username' ? '1px solid var(--accent, #0D6E6E)' : '1px solid var(--border-light, #E4EDEB)',
                    borderRadius: 'var(--radius-sm, 6px)',
                    color: 'var(--text-primary, #1A2B2A)',
                    minHeight: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background-color 150ms ease-out, border-color 150ms ease-out',
                  }}
                >
                  <span>{username}</span>
                  {activeField === 'username' && (
                    <span
                      style={{ opacity: showCursor ? 1 : 0, color: 'var(--accent, #0D6E6E)' }}
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
                    fontSize: 'clamp(12px, 1vw, 14px)',
                    fontWeight: 500,
                    color: 'var(--text-secondary, #5B7A78)',
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
                    fontSize: 'clamp(13px, 1.1vw, 15px)',
                    backgroundColor: activeField === 'password' ? 'var(--surface, #FFFFFF)' : 'var(--bg-dashboard, #F0F5F4)',
                    border: activeField === 'password' ? '1px solid var(--accent, #0D6E6E)' : '1px solid var(--border-light, #E4EDEB)',
                    borderRadius: 'var(--radius-sm, 6px)',
                    color: 'var(--text-primary, #1A2B2A)',
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
                      style={{ opacity: showCursor ? 1 : 0, color: 'var(--accent, #0D6E6E)' }}
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
                className={`focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus:outline-none${canLogin && !buttonPressed ? ' login-pulse-active' : ''}`}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontFamily: "var(--font-ui)",
                  fontSize: 'clamp(14px, 1.1vw, 16px)',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backgroundColor: buttonBg,
                  border: 'none',
                  borderRadius: 'var(--radius-sm, 6px)',
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
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: connectionState === 'connected' ? 'var(--success, #059669)' : 'var(--alert, #DC2626)',
                    boxShadow: connectionState === 'connected'
                      ? '0 0 6px 1px rgba(5,150,105,0.4)'
                      : '0 0 6px 1px rgba(220,38,38,0.4)',
                    transition: prefersReducedMotion ? 'none' : 'background-color 300ms ease, box-shadow 300ms ease',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
                    fontSize: '12px',
                    color: connectionState === 'connected' ? 'var(--success, #059669)' : 'var(--alert, #DC2626)',
                    transition: prefersReducedMotion ? 'none' : 'color 300ms ease',
                  }}
                >
                  {connectionState === 'connected'
                    ? 'Secure connection established, awaiting login'
                    : `Awaiting secure connection${'.'.repeat(dotCount)}`}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: '22px',
                paddingTop: '18px',
                borderTop: '1px solid var(--border-light, #E4EDEB)',
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: '11px',
                  color: 'var(--text-tertiary, #8DA8A5)',
                  textAlign: 'center',
                }}
              >
                Secure clinical system login
              </p>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
