import { useEffect, useState, useRef, useCallback } from 'react'

const SECTION_IDS = ['about', 'skills', 'experience', 'education', 'projects', 'contact'] as const

type SectionId = typeof SECTION_IDS[number]

export function useActiveSection(): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>('about')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibleSectionsRef = useRef<Map<string, number>>(new Map())

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const sectionId = entry.target.id
      if (SECTION_IDS.includes(sectionId as SectionId)) {
        if (entry.isIntersecting) {
          visibleSectionsRef.current.set(sectionId, entry.intersectionRatio)
        } else {
          visibleSectionsRef.current.delete(sectionId)
        }
      }
    })

    const visibleEntries = Array.from(visibleSectionsRef.current.entries())
    if (visibleEntries.length > 0) {
      visibleEntries.sort((a, b) => {
        const indexA = SECTION_IDS.indexOf(a[0] as SectionId)
        const indexB = SECTION_IDS.indexOf(b[0] as SectionId)
        return indexA - indexB
      })
      
      const topSection = visibleEntries[0][0] as SectionId
      setActiveSection(topSection)
    }
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    })

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id)
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersect])

  return activeSection
}
