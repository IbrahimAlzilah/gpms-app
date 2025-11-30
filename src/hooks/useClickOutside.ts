/**
 * Hook to detect clicks outside an element
 */

import { useEffect, RefObject } from 'react'

/**
 * Options for useClickOutside hook
 */
export interface UseClickOutsideOptions {
  /**
   * Whether the hook is enabled
   */
  enabled?: boolean
  /**
   * Additional elements to exclude from outside detection
   */
  excludeRefs?: RefObject<HTMLElement>[]
}

/**
 * Hook to detect clicks outside a referenced element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options: UseClickOutsideOptions = {}
): void {
  const { enabled = true, excludeRefs = [] } = options

  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      // Check if click is inside the main ref
      if (ref.current && ref.current.contains(target)) {
        return
      }

      // Check if click is inside any excluded refs
      if (excludeRefs.some((excludeRef) => excludeRef.current?.contains(target))) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref, handler, enabled, excludeRefs])
}

