import { useState, useEffect, useCallback } from 'react'
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
  const [isTypingUsername, setIsTypingUsername] = useState(true)
  const [isTypingPassword, setIsTypingPassword] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const { requestFocusAfterLogin } = useAccessibility()
  
  const fullUsername = 'A.CHARLWOOD'
  const passwordLength = 8
  
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

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
      setTimeout(() => {
        setButtonPressed(true)
        setTimeout(() => {
          triggerComplete()
        }, 100)
      }, 300)
      return
    }

    setIsTypingUsername(true)
    let usernameIndex = 0
    
    const usernameInterval = setInterval(() => {
      if (usernameIndex <= fullUsername.length) {
        setUsername(fullUsername.slice(0, usernameIndex))
        usernameIndex++
      } else {
        clearInterval(usernameInterval)
        setIsTypingUsername(false)
        setIsTypingPassword(true)
        
        setTimeout(() => {
          let dotCount = 0
          const passwordInterval = setInterval(() => {
            if (dotCount <= passwordLength) {
              setPasswordDots(dotCount)
              dotCount++
            } else {
              clearInterval(passwordInterval)
              setIsTypingPassword(false)
              
              setTimeout(() => {
                setButtonPressed(true)
                setTimeout(() => {
                  triggerComplete()
                }, 100)
              }, 150)
            }
          }, 20)
        }, 150)
      }
    }, 30)
  }, [triggerComplete, prefersReducedMotion])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    
    startLoginSequence()
    
    return () => clearInterval(cursorInterval)
  }, [startLoginSequence])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: '#1E293B' }}
    >
      <motion.div
        className="bg-white p-8"
        style={{
          width: '320px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
        initial={{ opacity: 0 }}
        animate={isExiting ? { scale: 1.03, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="p-3 rounded-lg mb-3"
            style={{ backgroundColor: 'rgba(0, 94, 184, 0.08)' }}
          >
            <Shield
              size={28}
              style={{ color: '#005EB8' }}
              strokeWidth={2.5}
            />
          </div>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
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
              fontFamily: 'Inter, sans-serif',
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
        <div className="space-y-5">
          {/* Username Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'Inter, sans-serif',
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
                padding: '10px 12px',
                fontFamily: "'Geist Mono', 'Courier New', monospace",
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                color: '#111827',
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>{username}</span>
              {isTypingUsername && (
                <span
                  style={{
                    opacity: showCursor ? 1 : 0,
                    color: '#005EB8',
                    marginLeft: '1px',
                  }}
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
                fontFamily: 'Inter, sans-serif',
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
                padding: '10px 12px',
                fontFamily: "'Geist Mono', 'Courier New', monospace",
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                color: '#111827',
                letterSpacing: '0.15em',
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>{'\u2022'.repeat(passwordDots)}</span>
              {isTypingPassword && (
                <span
                  style={{
                    opacity: showCursor ? 1 : 0,
                    color: '#005EB8',
                    marginLeft: '2px',
                  }}
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
              padding: '11px 16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              backgroundColor: buttonPressed ? '#004494' : '#005EB8',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 100ms ease-out',
              marginTop: '8px',
            }}
          >
            Log In
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #E5E7EB',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#94A3B8',
              textAlign: 'center',
              lineHeight: '1.4',
            }}
          >
            Secure clinical system login
          </p>
        </div>
      </motion.div>
    </div>
  )
}
