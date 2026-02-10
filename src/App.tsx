import { useState } from 'react'
import type { Phase } from './types'
import { BootSequence } from './components/BootSequence'
import { ECGAnimation } from './components/ECGAnimation'
import { FloatingNav } from './components/FloatingNav'
import { Hero } from './components/Hero'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'
import { Education } from './components/Education'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'

function App() {
  const [phase, setPhase] = useState<Phase>('boot')

  return (
    <div className="min-h-screen bg-white">
      {phase === 'boot' && (
        <BootSequence onComplete={() => setPhase('ecg')} />
      )}
      
      {phase === 'ecg' && (
        <ECGAnimation onComplete={() => setPhase('content')} />
      )}
      
      {phase === 'content' && (
        <>
          <FloatingNav />
          <main className="max-w-[1000px] mx-auto px-8">
            <Hero />
            
            <Skills />

            <Experience />

            <Education />

            <Projects />

            <Contact />
          </main>
        </>
      )}
    </div>
  )
}

export default App
