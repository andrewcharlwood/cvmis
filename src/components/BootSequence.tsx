import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BootLine {
  html: string
  delay: number
}

const bootLines: BootLine[] = [
  { html: '<span class="text-[#00ff41] font-bold">CLINICAL TERMINAL v3.2.1</span>', delay: 0 },
  { html: '<span class="text-[#3a6b45]">Initialising pharmacist profile...</span>', delay: 220 },
  { html: '<span class="text-[#3a6b45]">---</span>', delay: 220 },
  { html: '<span class="text-[#00e5ff]">SYSTEM   </span><span class="text-[#00ff41]">NHS Norfolk &amp; Waveney ICB</span>', delay: 220 },
  { html: '<span class="text-[#00e5ff]">USER     </span><span class="text-[#00ff41]">Andy Charlwood</span>', delay: 220 },
  { html: '<span class="text-[#00e5ff]">ROLE     </span><span class="text-[#00ff41]">Deputy Head of Population Health &amp; Data Analysis</span>', delay: 220 },
  { html: '<span class="text-[#00e5ff]">LOCATION </span><span class="text-[#00ff41]">Norwich, UK</span>', delay: 220 },
  { html: '<span class="text-[#3a6b45]">---</span>', delay: 220 },
  { html: '<span class="text-[#3a6b45]">Loading modules...</span>', delay: 220 },
  { html: '<span class="text-[#00ff41] font-bold">[OK]</span> <span class="text-[#3a6b45]">pharmacist_core.sys</span>', delay: 220 },
  { html: '<span class="text-[#00ff41] font-bold">[OK]</span> <span class="text-[#3a6b45]">population_health.mod</span>', delay: 220 },
  { html: '<span class="text-[#00ff41] font-bold">[OK]</span> <span class="text-[#3a6b45]">data_analytics.eng</span>', delay: 220 },
  { html: '<span class="text-[#3a6b45]">---</span>', delay: 220 },
  { html: '<span class="text-[#00ff41] font-bold">&gt; READY — Rendering CV..<span class="ecg-seed-dot" id="ecg-seed-dot">.</span></span>', delay: 220 },
]

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lineDelays, setLineDelays] = useState<number[]>([])
  
  useEffect(() => {
    const delays: number[] = []
    let totalDelay = 0
    bootLines.forEach((line) => {
      delays.push(totalDelay)
      totalDelay += line.delay
    })
    setLineDelays(delays)
    
    const totalBootTime = totalDelay
    const fadeStartTime = totalBootTime + 400
    
    const fadeTimer = setTimeout(() => {
      setIsVisible(false)
    }, fadeStartTime)
    
    const completeTimer = setTimeout(() => {
      onComplete()
    }, fadeStartTime + 800)
    
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-center bg-black p-10 font-mono text-sm overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-1 max-w-[640px]">
            {bootLines.map((line, index) => (
              <motion.div
                key={index}
                className="whitespace-nowrap leading-relaxed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: lineDelays[index] / 1000,
                  duration: 0.4,
                  ease: 'easeOut',
                }}
                dangerouslySetInnerHTML={{ __html: line.html }}
              />
            ))}
            <motion.div
              className="inline-block w-2 h-4 bg-[#00ff41] ml-1 animate-blink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: lineDelays[lineDelays.length - 1] / 1000 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
