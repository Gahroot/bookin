/**
 * Carbon Graphite Color System
 *
 * Centralized exports for the entire color system.
 * Import from this file for all color-related utilities.
 */

// Types
export type {
  BrandColor,
  SemanticColor,
  ColorState,
  TextColor,
  SurfaceColor,
  UIColor,
  ChartColor,
  ColorVariable,
  ThemeMode,
  FeedbackType,
} from '../types/colors'

export {
  ColorSystem,
  ContrastRequirements,
  FeedbackColors,
  getCSSVariable,
} from '../types/colors'

// Hooks
export {
  getColorValue,
  useThemeMode,
  useSystemTheme,
  useColorValue,
  useThemeToggle,
  useContrastCheck,
  getColorClasses,
  getTextClass,
} from '../hooks/useColors'

// Example Components
export {
  PrimaryButton,
  SecondaryButton,
  DestructiveButton,
  Alert,
  Card,
  TextHierarchy,
  Input,
  Badge,
  ThemeToggle,
  Skeleton,
  Divider,
  ColorSystemDemo,
} from '../components/examples/ColorExamples'

/**
 * Quick access to common color utilities
 */
export const Colors = {
  // Get CSS variable
  get: (color: string) => `var(--${color})`,

  // Common class combinations
  classes: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active',
    success: 'bg-success text-success-foreground hover:bg-success-hover',
    warning: 'bg-warning text-warning-foreground hover:bg-warning-hover',
    info: 'bg-info text-info-foreground hover:bg-info-hover',
    muted: 'bg-muted text-muted-foreground hover:bg-muted-hover',
  },

  // Text classes
  text: {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    tertiary: 'text-text-tertiary',
    disabled: 'text-text-disabled',
    onPrimary: 'text-text-on-primary',
  },

  // Border classes
  border: {
    default: 'border-border',
    strong: 'border-border-strong',
    input: 'border-input',
  },

  // Focus ring
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
} as const

/**
 * Palette information
 */
export const Palette = {
  name: 'Carbon Graphite',
  description: 'Premium dark neutral - sleek minimalist for luxury brands',
  baseColors: {
    primary: '#18181b',
    secondary: '#3f3f46',
    accent: '#71717a',
    background: '#fafafa',
    surface: '#f4f4f5',
  },
  standards: {
    accessibility: 'WCAG AA',
    normalTextContrast: 4.5,
    largeTextContrast: 3.0,
  },
  colorSpace: 'OKLCH',
  themes: ['light', 'dark'],
} as const
