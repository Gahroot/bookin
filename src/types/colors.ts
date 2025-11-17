/**
 * Carbon Graphite Color System Types
 *
 * Type definitions for the color system to ensure type safety
 * and better IDE autocomplete support.
 */

/**
 * Base brand colors from the Carbon Graphite palette
 */
export type BrandColor =
  | 'brand-primary'
  | 'brand-secondary'
  | 'brand-accent'

/**
 * Semantic colors with state variants
 */
export type SemanticColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'muted'

/**
 * State variants for interactive colors
 */
export type ColorState =
  | 'default'
  | 'hover'
  | 'active'
  | 'disabled'

/**
 * Text hierarchy colors
 */
export type TextColor =
  | 'text-primary'
  | 'text-secondary'
  | 'text-tertiary'
  | 'text-disabled'
  | 'text-on-primary'

/**
 * Background and surface colors
 */
export type SurfaceColor =
  | 'background'
  | 'foreground'
  | 'surface'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'

/**
 * UI element colors
 */
export type UIColor =
  | 'border'
  | 'border-strong'
  | 'input'
  | 'ring'
  | 'ring-offset'

/**
 * Chart colors
 */
export type ChartColor =
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5'

/**
 * All available CSS custom properties in the color system
 */
export type ColorVariable =
  | BrandColor
  | SemanticColor
  | TextColor
  | SurfaceColor
  | UIColor
  | ChartColor
  | `${SemanticColor}-foreground`
  | `${SemanticColor}-hover`
  | `${SemanticColor}-active`
  | `${SemanticColor}-disabled`
  | `muted-foreground`
  | `muted-hover`

/**
 * Theme modes
 */
export type ThemeMode = 'light' | 'dark'

/**
 * Helper to get CSS variable name
 */
export const getCSSVariable = (color: ColorVariable): string => {
  return `var(--${color})`
}

/**
 * Color system configuration
 */
export const ColorSystem = {
  palette: 'Carbon Graphite',
  description: 'Premium dark neutral - sleek minimalist for luxury brands',
  baseColors: {
    primary: '#18181b',
    secondary: '#3f3f46',
    accent: '#71717a',
    background: '#fafafa',
    surface: '#f4f4f5',
  },
  accessibility: {
    standard: 'WCAG AA',
    normalText: 4.5,
    largeText: 3.0,
  },
} as const

/**
 * Contrast ratio requirements
 */
export const ContrastRequirements = {
  AA: {
    normalText: 4.5,
    largeText: 3.0,
  },
  AAA: {
    normalText: 7.0,
    largeText: 4.5,
  },
} as const

/**
 * Feedback color mapping
 */
export const FeedbackColors = {
  error: 'destructive',
  delete: 'destructive',
  success: 'success',
  confirm: 'success',
  warning: 'warning',
  caution: 'warning',
  info: 'info',
  note: 'info',
} as const

export type FeedbackType = keyof typeof FeedbackColors
