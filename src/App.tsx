import { useState, useCallback } from 'react'
import type { Phase } from './types'
import { BootSequence } from './components/BootSequence'
import { ECGAnimation } from './components/ECGAnimation'
import { LoginScreen } from './components/LoginScreen'
import { PMRInterface } from './components/PMRInterface'
import { AccessibilityProvider } from './contexts/AccessibilityContext'

function App() {
  const [phase, setPhase] = useState<Phase>('boot')
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null)

  const handleBootComplete = useCallback(() => {
    setPhase('ecg')
  }, [])

  const handleCursorPositionReady = useCallback((position: { x: number; y: number }) => {
    setCursorPosition(position)
  }, [])

  const handleECGComplete = useCallback(() => {
    setPhase('login')
  }, [])

  const handleLoginComplete = useCallback(() => {
    setPhase('pmr')
  }, [])

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-black">
        {phase === 'boot' && (
          <BootSequence 
            onComplete={handleBootComplete} 
            onCursorPositionReady={handleCursorPositionReady}
          />
        )}
        
        {phase === 'ecg' && (
          <ECGAnimation 
            onComplete={handleECGComplete} 
            startPosition={cursorPosition}
          />
        )}
        
        {phase === 'login' && (
          <LoginScreen onComplete={handleLoginComplete} />
        )}
        
        {phase === 'pmr' && <PMRInterface />}
      </div>
    </AccessibilityProvider>
  )
}

export default App
