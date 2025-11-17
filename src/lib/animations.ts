/**
 * Animation Utilities
 *
 * Type-safe animation utilities and constants for consistent animations
 * across the application.
 */

export const ANIMATION_DURATIONS = {
  subtle: 150,
  micro: 200,
  transition: 400,
  entrance: 500,
  feedback: 600,
  loading: 1500,
} as const;

export const ANIMATION_EASINGS = {
  out: 'ease-out',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
  pulse: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type AnimationEasing = keyof typeof ANIMATION_EASINGS;

/**
 * Get animation duration in milliseconds
 */
export function getAnimationDuration(duration: AnimationDuration): number {
  return ANIMATION_DURATIONS[duration];
}

/**
 * Get animation easing function
 */
export function getAnimationEasing(easing: AnimationEasing): string {
  return ANIMATION_EASINGS[easing];
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get safe animation duration respecting user preferences
 */
export function getSafeAnimationDuration(duration: AnimationDuration): number {
  return prefersReducedMotion() ? 0 : getAnimationDuration(duration);
}

/**
 * Animation class names for common patterns
 */
export const ANIMATION_CLASSES = {
  // Button & Hover
  lift: 'animate-lift',

  // Entrance
  slideUp: 'animate-slide-up',
  slideUpDelay1: 'animate-slide-up-delay-1',
  slideUpDelay2: 'animate-slide-up-delay-2',
  slideUpDelay3: 'animate-slide-up-delay-3',

  // Loading
  pulse: 'animate-pulse',
  pulseSkeleton: 'animate-pulse-skeleton',
  spin: 'animate-spin',

  // Feedback
  ripple: 'animate-ripple',
  rippleContainer: 'ripple-container',

  // Page Transition
  slideExit: 'animate-slide-exit',
  slideEnter: 'animate-slide-enter',

  // Micro-interaction
  toggle: 'animate-toggle',

  // Additional
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  scaleIn: 'animate-scale-in',
} as const;

export type AnimationClass = typeof ANIMATION_CLASSES[keyof typeof ANIMATION_CLASSES];

/**
 * Stagger children animation utility
 */
export function getStaggerDelay(index: number, baseDelay: number = 100): string {
  return `${index * baseDelay}ms`;
}

/**
 * Spring animation config for JS-based animations
 */
export const SPRING_CONFIGS = {
  gentle: {
    tension: 120,
    friction: 14,
  },
  default: {
    tension: 170,
    friction: 26,
  },
  wobbly: {
    tension: 180,
    friction: 12,
  },
  stiff: {
    tension: 210,
    friction: 20,
  },
  slow: {
    tension: 280,
    friction: 60,
  },
  molasses: {
    tension: 280,
    friction: 120,
  },
} as const;

export type SpringConfig = keyof typeof SPRING_CONFIGS;
