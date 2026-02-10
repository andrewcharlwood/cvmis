import { useState } from 'react'
import type { Phase } from './types'
import { BootSequence } from './components/BootSequence'
import { ECGAnimation } from './components/ECGAnimation'
import { FloatingNav } from './components/FloatingNav'

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
            <section id="about" className="min-h-screen flex flex-col justify-center items-center text-center py-20">
              <h1 className="font-primary font-bold text-5xl text-heading">Andy Charlwood</h1>
              <p className="text-muted mt-2">Deputy Head of Population Health &amp; Data Analysis</p>
              <span className="inline-block mt-2 px-4 py-1 border border-teal rounded-full text-xs text-teal font-medium">
                Norwich, UK
              </span>
              <p className="mt-6 max-w-[560px] text-text">
                GPhC Registered Pharmacist specialising in medicines optimisation, population health analytics, and NHS efficiency programmes.
              </p>
            </section>
            
            <section id="skills" className="py-20">
              <h2 className="font-primary text-2xl font-bold text-heading text-center mb-8">
                Skills
              </h2>
              <p className="text-muted text-center">Skills section will be built in Task 7</p>
            </section>

            <section id="experience" className="py-20">
              <h2 className="font-primary text-2xl font-bold text-heading text-center mb-8">
                Experience
              </h2>
              <p className="text-muted text-center">Experience section will be built in Task 8</p>
            </section>

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
