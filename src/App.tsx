import { useState, useEffect } from 'react'
import type { Phase } from './types'
import { BootSequence } from './components/BootSequence'
import { LoginScreen } from './components/LoginScreen'
import { DashboardLayout } from './components/DashboardLayout'
import { AccessibilityProvider } from './contexts/AccessibilityContext'
import { DetailPanelProvider } from './contexts/DetailPanelContext'
import { initModel } from './lib/embedding-model'

function SkipButton({ onSkip }: { onSkip: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <button
      onClick={onSkip}
      aria-label="Skip intro animation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-1.5 text-xs tracking-widest uppercase font-mono border rounded transition-all duration-700 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      style={{
        color: '#555',
        borderColor: '#333',
        backgroundColor: 'rgba(255,255,255,0.03)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#888'
        e.currentTarget.style.borderColor = '#555'
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#555'
        e.currentTarget.style.borderColor = '#333'
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
      }}
    >
      Skip
    </button>
  )
}

function App() {
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window !== 'undefined') {
      const visitedAt = sessionStorage.getItem('portfolio-visited')
      if (visitedAt && Date.now() - Number(visitedAt) < 60 * 60 * 1000) {
        return 'pmr'
      }
      sessionStorage.removeItem('portfolio-visited')
    }
    return 'boot'
  })

  useEffect(() => {
    initModel()
  }, [])

  useEffect(() => {
    if (phase === 'pmr') {
      sessionStorage.setItem('portfolio-visited', String(Date.now()))
    }
  }, [phase])

  const skipToDashboard = () => setPhase('pmr')

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-black">
        {/* Screen reader announcement for PMR phase */}
        {phase === 'pmr' && (
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            Patient Record for Charlwood, Andrew. Summary view.
          </div>
        )}

        {phase === 'boot' && (
          <BootSequence
            onComplete={() => setPhase('login')}
          />
        )}

        {(phase === 'login' || phase === 'pmr') && (
          <DetailPanelProvider>
            <DashboardLayout />
          </DetailPanelProvider>
        )}

        {phase === 'login' && (
          <LoginScreen onComplete={() => setPhase('pmr')} />
        )}

        {(phase === 'boot' || phase === 'login') && (
          <SkipButton onSkip={skipToDashboard} />
        )}
      </div>
    </AccessibilityProvider>
  )
}

export default App
