import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react'

interface AccessibilityContextValue {
  expandedItemId: string | null
  setExpandedItem: (id: string | null) => void
  requestFocusAfterLogin: () => void
  focusAfterLoginRef: React.RefObject<HTMLButtonElement | null>
  focusAfterViewChangeRef: React.RefObject<HTMLHeadingElement | null>
  requestFocusAfterViewChange: () => void
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)
  const focusAfterLoginRef = useRef<HTMLButtonElement | null>(null)
  const focusAfterViewChangeRef = useRef<HTMLHeadingElement | null>(null)
  const [shouldFocusAfterLogin, setShouldFocusAfterLogin] = useState(false)
  const [shouldFocusAfterViewChange, setShouldFocusAfterViewChange] = useState(false)

  const setExpandedItem = useCallback((id: string | null) => {
    setExpandedItemId(id)
  }, [])

  const requestFocusAfterLogin = useCallback(() => {
    setShouldFocusAfterLogin(true)
  }, [])

  const requestFocusAfterViewChange = useCallback(() => {
    setShouldFocusAfterViewChange(true)
  }, [])

  useEffect(() => {
    if (shouldFocusAfterLogin && focusAfterLoginRef.current) {
      focusAfterLoginRef.current.focus()
      setShouldFocusAfterLogin(false)
    }
  }, [shouldFocusAfterLogin])

  useEffect(() => {
    if (shouldFocusAfterViewChange && focusAfterViewChangeRef.current) {
      focusAfterViewChangeRef.current.focus()
      setShouldFocusAfterViewChange(false)
    }
  }, [shouldFocusAfterViewChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedItemId) {
        setExpandedItemId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expandedItemId])

  return (
    <AccessibilityContext.Provider
      value={{
        expandedItemId,
        setExpandedItem,
        requestFocusAfterLogin,
        focusAfterLoginRef,
        focusAfterViewChangeRef,
        requestFocusAfterViewChange,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}
