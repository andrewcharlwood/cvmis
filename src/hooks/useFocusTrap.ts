import { RefObject, useEffect } from 'react'

/**
 * Focus trap hook for modal dialogs and panels
 * Traps Tab/Shift+Tab within the container when active
 * Returns focus to previously focused element when deactivated
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  isActive: boolean
): void {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const previousActiveElement = document.activeElement as HTMLElement

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ]

      const elements = container.querySelectorAll<HTMLElement>(
        selectors.join(', ')
      )

      return Array.from(elements).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
      )
    }

    // Focus first element on mount
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle Tab key to trap focus
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusable = getFocusableElements()
      if (focusable.length === 0) return

      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]
      const activeElement = document.activeElement as HTMLElement

      if (event.shiftKey) {
        // Shift+Tab: moving backwards
        if (activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: moving forwards
        if (activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup: return focus to previous element
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus()
      }
    }
  }, [isActive, containerRef])
}
