import { useState, useEffect, useCallback, useRef } from 'react'

const sectionTileMap: Record<string, string> = {
  'patient-summary': 'overview',
  'section-experience': 'experience',
  'section-skills': 'skills',
}

const SCROLL_BOTTOM_THRESHOLD = 40

/**
 * Hook to track which section is currently visible using IntersectionObserver.
 * Observes tiles by their data-tile-id attribute inside main scroll content.
 * Includes a scroll-position safety net: when scrolled to the very top,
 * activates 'overview'; when scrolled to the very bottom, activates the
 * last mapped section ('skills').
 *
 * @returns The currently active section ID
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const scrollOverrideRef = useRef<string | null>(null)

  const updateFromScroll = useCallback((root: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = root
    const atBottom = scrollHeight - scrollTop - clientHeight <= SCROLL_BOTTOM_THRESHOLD
    const atTop = scrollTop <= SCROLL_BOTTOM_THRESHOLD

    if (atTop) {
      scrollOverrideRef.current = 'overview'
      setActiveSection('overview')
    } else if (atBottom) {
      scrollOverrideRef.current = 'skills'
      setActiveSection('skills')
    } else {
      scrollOverrideRef.current = null
    }
  }, [])

  useEffect(() => {
    const tiles = Array.from(
      document.querySelectorAll('[data-tile-id]')
    ) as HTMLElement[]
    const root = document.getElementById('main-content')

    if (tiles.length === 0 || !root) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollOverrideRef.current) return

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

    const handleScroll = () => updateFromScroll(root)
    root.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      tiles.forEach((tile) => observer.unobserve(tile))
      observer.disconnect()
      root.removeEventListener('scroll', handleScroll)
    }
  }, [updateFromScroll])

  return activeSection
}
