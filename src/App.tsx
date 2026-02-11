import { useState } from 'react'
import type { Phase } from './types'
import { BootSequence } from './components/BootSequence'
import { ECGAnimation } from './components/ECGAnimation'
import { LoginScreen } from './components/LoginScreen'
import { PMRInterface } from './components/PMRInterface'
import { AccessibilityProvider } from './contexts/AccessibilityContext'

function App() {
  const [phase, setPhase] = useState<Phase>('boot')

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-black">
        {phase === 'boot' && (
          <BootSequence onComplete={() => setPhase('ecg')} />
        )}
        
        {phase === 'ecg' && (
          <ECGAnimation onComplete={() => setPhase('login')} />
        )}
        
        {phase === 'login' && (
          <LoginScreen onComplete={() => setPhase('pmr')} />
        )}
        
        {phase === 'pmr' && <PMRInterface />}
      </div>
    </AccessibilityProvider>
  )
}

export default App
