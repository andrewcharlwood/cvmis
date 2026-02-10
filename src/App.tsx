import { useState } from 'react'
import type { Phase } from './types'
import { BootSequence } from './components/BootSequence'
import { ECGAnimation } from './components/ECGAnimation'
import { FloatingNav } from './components/FloatingNav'
import { Hero } from './components/Hero'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'

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

            <section id="education" className="py-20">
              <h2 className="font-primary text-2xl font-bold text-heading text-center mb-8">
                Education
              </h2>
              <p className="text-muted text-center">Education section will be built in Task 9</p>
            </section>

            <section id="projects" className="py-20">
              <h2 className="font-primary text-2xl font-bold text-heading text-center mb-8">
                Projects
              </h2>
              <p className="text-muted text-center">Projects section will be built in Task 9</p>
            </section>

            <section id="contact" className="py-20">
              <h2 className="font-primary text-2xl font-bold text-heading text-center mb-8">
                Contact
              </h2>
              <p className="text-muted text-center">Contact section will be built in Task 9</p>
            </section>
          </main>
        </>
      )}
    </div>
  )
}

export default App
