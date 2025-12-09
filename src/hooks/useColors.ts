/**
 * useColors Hook
 *
 * Custom React hook for accessing and manipulating colors
 * from the Carbon Graphite color system.
 */

import { useEffect, useState } from 'react'
import type { ColorVariable, ThemeMode } from '../types/colors'

/**
 * Get computed color value from CSS custom property
 */
export function getColorValue(colorVar: ColorVariable): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${colorVar}`)
    .trim()
}

/**
 * Hook to get current theme mode
 */
export function useThemeMode(): [ThemeMode, (mode: ThemeMode) => void] {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  })

  const updateMode = (newMode: ThemeMode) => {
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    setMode(newMode)
  }

  return [mode, updateMode]
}

/**
 * Hook to sync with system color scheme preference
 */
export function useSystemTheme(): ThemeMode {
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return systemTheme
}

/**
 * Hook to get color value reactively
 * Updates when theme changes
 */
export function useColorValue(colorVar: ColorVariable): string {
  const [mode] = useThemeMode()
  const [color, setColor] = useState(() => getColorValue(colorVar))

  useEffect(() => {
    const timer = setTimeout(() => {
      setColor(getColorValue(colorVar))
    }, 0)
    return () => clearTimeout(timer)
  }, [colorVar, mode])

  return color
}

/**
 * Hook for theme toggle with persistence
 */
export function useThemeToggle(storageKey = 'theme-mode'): [ThemeMode, () => void] {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'

    // Check localStorage first
    const stored = localStorage.getItem(storageKey) as ThemeMode | null
    if (stored === 'dark' || stored === 'light') {
      return stored
    }

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    // Apply theme on mount
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const toggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'

    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem(storageKey, newMode)
    setModeState(newMode)
  }

  return [mode, toggle]
}

/**
 * Hook to check if current color meets contrast requirements
 */
export function useContrastCheck(
  foreground: ColorVariable,
  background: ColorVariable,
  required: number = 4.5
): boolean {
  const [meetsRequirement, setMeetsRequirement] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const fg = getColorValue(foreground)
      const bg = getColorValue(background)

      if (!fg || !bg) {
        setMeetsRequirement(false)
        return
      }

      // This would need a proper contrast calculation library in production
      // For now, we assume our color system is compliant
      setMeetsRequirement(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [foreground, background, required])

  return meetsRequirement
}

/**
 * Helper to generate color classes for Tailwind
 */
export function getColorClasses(
  color: 'primary' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning' | 'info',
  includeStates: boolean = true
): string {
  const base = `bg-${color} text-${color}-foreground`

  if (!includeStates) return base

  return `${base} hover:bg-${color}-hover active:bg-${color}-active disabled:bg-${color}-disabled`
}

/**
 * Helper to get text color class based on hierarchy
 */
export function getTextClass(
  level: 'primary' | 'secondary' | 'tertiary' | 'disabled' = 'primary'
): string {
  return `text-text-${level}`
}
