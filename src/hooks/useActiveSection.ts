import { useState, useEffect } from 'react'

// Map tile IDs to section IDs for SubNav
const sectionTileMap: Record<string, string> = {
  'patient-summary': 'overview',
  'core-skills': 'skills',
  'career-activity': 'experience',
  'projects': 'projects',
  'education': 'education',
}

/**
 * Hook to track which section is currently visible using IntersectionObserver.
 * Observes tiles by their data-tile-id attribute and maps them to section IDs.
 *
 * @returns The currently active section ID
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState<string>('overview')

  useEffect(() => {
    // Find all tiles with data-tile-id attribute
    const tiles = Array.from(
      document.querySelectorAll('[data-tile-id]')
    ) as HTMLElement[]

    if (tiles.length === 0) return

    // IntersectionObserver to track which tile is visible
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length === 0) return

        // Get the most visible tile (highest intersection ratio)
        const mostVisible = visibleEntries.reduce((prev, current) =>
          current.intersectionRatio > prev.intersectionRatio ? current : prev
        )

        // Get the tile ID and map to section ID
        const tileId = mostVisible.target.getAttribute('data-tile-id')
        if (tileId && sectionTileMap[tileId]) {
          setActiveSection(sectionTileMap[tileId])
        }
      },
      {
        // Trigger when tile is 25% visible
        threshold: [0, 0.25, 0.5, 0.75, 1],
        // Use viewport as root, with some margin for better UX
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    // Observe all tiles
    tiles.forEach((tile) => observer.observe(tile))

    // Cleanup
    return () => {
      tiles.forEach((tile) => observer.unobserve(tile))
    }
  }, [])

  return activeSection
}
