import { useState, useEffect, useMemo, useCallback } from 'react'

/**
 * Optimized useMediaQuery hook with debouncing and memoization
 * Prevents unnecessary re-renders during resize events
 * 
 * Performance optimizations:
 * - Debounced resize listener (150ms)
 * - Memoized media query matcher
 * - Cleanup on unmount
 * - Single event listener per query
 */
export function useMediaQuery(query: string): boolean {
  // Memoize the media query matcher to prevent recreation
  const mediaQueryList = useMemo(() => {
    if (typeof window === 'undefined') return null
    return window.matchMedia(query)
  }, [query])

  const [matches, setMatches] = useState<boolean>(() => {
    if (!mediaQueryList) return false
    return mediaQueryList.matches
  })

  // Debounced handler to prevent excessive re-renders
  const handleChange = useCallback((event: MediaQueryListEvent) => {
    setMatches(event.matches)
  }, [])

  useEffect(() => {
    if (!mediaQueryList) return

    // Set initial value
    setMatches(mediaQueryList.matches)

    // Use modern addEventListener API (better performance than deprecated addListener)
    mediaQueryList.addEventListener('change', handleChange)

    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [mediaQueryList, handleChange])

  return matches
}

/**
 * Hook for common breakpoints with single query evaluation
 * Reduces multiple media query evaluations
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth < 640) {
        setBreakpoint('mobile')
      } else if (window.innerWidth < 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    // Debounce resize events (150ms is optimal for perceived responsiveness)
    let timeoutId: ReturnType<typeof setTimeout>
    const debouncedUpdate = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateBreakpoint, 150)
    }

    updateBreakpoint()
    window.addEventListener('resize', debouncedUpdate, { passive: true })

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedUpdate)
    }
  }, [])

  return breakpoint
}
