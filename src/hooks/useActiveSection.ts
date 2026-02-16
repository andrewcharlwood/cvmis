import { useState, useEffect } from 'react'

const sectionTileMap: Record<string, string> = {
  'patient-summary': 'overview',
  'projects': 'projects',
  'section-experience': 'experience',
  'section-education': 'education',
  'section-skills': 'skills',
}

/**
 * Hook to track which section is currently visible using IntersectionObserver.
 * Observes tiles by their data-tile-id attribute inside main scroll content.
 *
 * @returns The currently active section ID
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState<string>('overview')

  useEffect(() => {
    const tiles = Array.from(
      document.querySelectorAll('[data-tile-id]')
    ) as HTMLElement[]
    const root = document.getElementById('main-content')

    if (tiles.length === 0 || !root) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length === 0) return

        const mostVisible = visibleEntries.reduce((prev, current) =>
          current.intersectionRatio > prev.intersectionRatio ? current : prev
        )

        const tileId = mostVisible.target.getAttribute('data-tile-id')
        if (tileId && sectionTileMap[tileId]) {
          setActiveSection(sectionTileMap[tileId])
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        root,
        rootMargin: '-12% 0px -60% 0px',
      }
    )

    tiles.forEach((tile) => observer.observe(tile))

    return () => {
      tiles.forEach((tile) => observer.unobserve(tile))
      observer.disconnect()
    }
  }, [])

  return activeSection
}
