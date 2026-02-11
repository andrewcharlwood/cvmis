import { useState, useEffect, useCallback } from 'react'
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
  const { requestFocusAfterLogin } = useAccessibility()
  
  const fullUsername = 'A.CHARLWOOD'
  const passwordLength = 8
  
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  const startLoginSequence = useCallback(() => {
    if (prefersReducedMotion) {
      setUsername(fullUsername)
      setPasswordDots(passwordLength)
      setTimeout(() => {
        setButtonPressed(true)
        setTimeout(() => {
          requestFocusAfterLogin()
          onComplete()
        }, 200)
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
                  requestFocusAfterLogin()
                  onComplete()
                }, 200)
              }, 150)
            }
          }, 20)
        }, 150)
      }
    }, 30)
  }, [onComplete, prefersReducedMotion, requestFocusAfterLogin])

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
      <div 
        className="bg-white rounded-xl shadow-lg p-8"
        style={{ 
          width: '320px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex flex-col items-center mb-6">
          <div 
            className="p-3 rounded-lg mb-4"
            style={{ backgroundColor: 'rgba(0, 94, 184, 0.1)' }}
          >
            <Shield 
              size={32} 
              style={{ color: '#005EB8' }}
              strokeWidth={2}
            />
          </div>
          <span 
            className="text-sm font-medium"
            style={{ color: '#6B7280' }}
          >
            CareerRecord PMR
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: '#6B7280' }}
            >
              Username
            </label>
            <div 
              className="w-full px-3 py-2.5 rounded text-sm"
              style={{ 
                fontFamily: "'Fira Code', monospace",
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                color: '#111827',
              }}
            >
              <span>{username}</span>
              {isTypingUsername && (
                <span 
                  style={{ 
                    opacity: showCursor ? 1 : 0,
                    color: '#005EB8',
                  }}
                >
                  |
                </span>
              )}
            </div>
          </div>

          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: '#6B7280' }}
            >
              Password
            </label>
            <div 
              className="w-full px-3 py-2.5 rounded text-sm"
              style={{ 
                fontFamily: "'Fira Code', monospace",
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                color: '#111827',
                letterSpacing: '0.1em',
              }}
            >
              <span>{'\u2022'.repeat(passwordDots)}</span>
              {isTypingPassword && (
                <span 
                  style={{ 
                    opacity: showCursor ? 1 : 0,
                    color: '#005EB8',
                  }}
                >
                  |
                </span>
              )}
            </div>
          </div>

          <button
            className="w-full py-2.5 rounded text-sm font-semibold text-white transition-all duration-100"
            style={{ 
              backgroundColor: buttonPressed ? '#004494' : '#005EB8',
              borderRadius: '4px',
              transform: buttonPressed ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            Log In
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p 
            className="text-xs text-center"
            style={{ color: '#9CA3AF' }}
          >
            Secure clinical system login
          </p>
        </div>
      </div>
    </div>
  )
}
