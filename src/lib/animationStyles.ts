/**
 * Animation Styles
 *
 * CSS-in-JS animation styles for dynamic usage.
 * Use when you need to apply animations programmatically.
 */

import { type CSSProperties } from 'react';
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from './animations';

/**
 * Transition styles for common properties
 */
export const transitionStyles = {
  lift: {
    transition: `transform ${ANIMATION_DURATIONS.subtle}ms ${ANIMATION_EASINGS.out}, box-shadow ${ANIMATION_DURATIONS.subtle}ms ${ANIMATION_EASINGS.out}`,
    willChange: 'transform',
  } as CSSProperties,

  fade: {
    transition: `opacity ${ANIMATION_DURATIONS.entrance}ms ${ANIMATION_EASINGS.smooth}`,
  } as CSSProperties,

  slide: {
    transition: `transform ${ANIMATION_DURATIONS.transition}ms ${ANIMATION_EASINGS.smooth}`,
  } as CSSProperties,

  toggle: {
    transition: `transform ${ANIMATION_DURATIONS.micro}ms ${ANIMATION_EASINGS.smooth}`,
    willChange: 'transform',
  } as CSSProperties,

  all: {
    transition: `all ${ANIMATION_DURATIONS.entrance}ms ${ANIMATION_EASINGS.smooth}`,
  } as CSSProperties,
} as const;

/**
 * Transform states for animations
 */
export const transformStates = {
  initial: {
    slideUp: { transform: 'translateY(20px)', opacity: 0 } as CSSProperties,
    slideDown: { transform: 'translateY(-20px)', opacity: 0 } as CSSProperties,
    slideLeft: { transform: 'translateX(20px)', opacity: 0 } as CSSProperties,
    slideRight: { transform: 'translateX(-20px)', opacity: 0 } as CSSProperties,
    scale: { transform: 'scale(0.95)', opacity: 0 } as CSSProperties,
    fade: { opacity: 0 } as CSSProperties,
  },

  animate: {
    slideUp: { transform: 'translateY(0)', opacity: 1 } as CSSProperties,
    slideDown: { transform: 'translateY(0)', opacity: 1 } as CSSProperties,
    slideLeft: { transform: 'translateX(0)', opacity: 1 } as CSSProperties,
    slideRight: { transform: 'translateX(0)', opacity: 1 } as CSSProperties,
    scale: { transform: 'scale(1)', opacity: 1 } as CSSProperties,
    fade: { opacity: 1 } as CSSProperties,
  },

  exit: {
    slideUp: { transform: 'translateY(-20px)', opacity: 0 } as CSSProperties,
    slideDown: { transform: 'translateY(20px)', opacity: 0 } as CSSProperties,
    slideLeft: { transform: 'translateX(-20px)', opacity: 0 } as CSSProperties,
    slideRight: { transform: 'translateX(20px)', opacity: 0 } as CSSProperties,
    scale: { transform: 'scale(0.95)', opacity: 0 } as CSSProperties,
    fade: { opacity: 0 } as CSSProperties,
  },
} as const;

/**
 * Hover states
 */
export const hoverStates = {
  lift: {
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  } as CSSProperties,

  scale: {
    transform: 'scale(1.05)',
  } as CSSProperties,

  glow: {
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
  } as CSSProperties,
} as const;

/**
 * Active (pressed) states
 */
export const activeStates = {
  lift: {
    transform: 'translateY(0)',
    boxShadow: 'none',
  } as CSSProperties,

  scale: {
    transform: 'scale(0.98)',
  } as CSSProperties,
} as const;

/**
 * Loading states
 */
export const loadingStates = {
  pulse: {
    animation: `pulse ${ANIMATION_DURATIONS.loading}ms ${ANIMATION_EASINGS.pulse} infinite`,
  } as CSSProperties,

  spin: {
    animation: 'spin 1s linear infinite',
  } as CSSProperties,
} as const;

/**
 * Helper function to combine styles
 */
export function combineStyles(...styles: (CSSProperties | undefined)[]): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

/**
 * Helper to create stagger delay
 */
export function createStaggerStyle(index: number, baseDelay: number = 100): CSSProperties {
  return {
    animationDelay: `${index * baseDelay}ms`,
  };
}

/**
 * Helper to create custom transition
 */
export function createTransition(
  property: string | string[],
  duration: number,
  easing: string = ANIMATION_EASINGS.smooth
): CSSProperties {
  const props = Array.isArray(property) ? property : [property];
  return {
    transition: props.map((prop) => `${prop} ${duration}ms ${easing}`).join(', '),
  };
}

/**
 * Hardware acceleration helper
 */
export const hardwareAccelerated: CSSProperties = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
};

/**
 * Presets for common animation combinations
 */
export const animationPresets = {
  fadeSlideUp: {
    ...transitionStyles.all,
    ...transformStates.initial.slideUp,
  },

  fadeScale: {
    ...transitionStyles.all,
    ...transformStates.initial.scale,
  },

  buttonHover: {
    ...transitionStyles.lift,
  },

  cardHover: {
    ...transitionStyles.lift,
  },

  toggle: {
    ...transitionStyles.toggle,
  },
} as const;

/**
 * Utility to get animation style based on state
 */
export function getAnimationStyle(
  variant: keyof typeof transformStates.initial,
  state: 'initial' | 'animate' | 'exit' = 'initial',
  options?: {
    duration?: number;
    easing?: string;
    delay?: number;
  }
): CSSProperties {
  const baseStyle = transformStates[state][variant];
  const duration = options?.duration ?? ANIMATION_DURATIONS.entrance;
  const easing = options?.easing ?? ANIMATION_EASINGS.smooth;

  return {
    ...baseStyle,
    transition: `all ${duration}ms ${easing}`,
    ...(options?.delay && { transitionDelay: `${options.delay}ms` }),
    ...hardwareAccelerated,
  };
}

/**
 * Responsive animation helper - disable on mobile if needed
 */
export function responsiveAnimation(
  styles: CSSProperties,
  disableOnMobile: boolean = false
): CSSProperties {
  if (disableOnMobile && typeof window !== 'undefined' && window.innerWidth < 768) {
    return {};
  }
  return styles;
}

/**
 * Create keyframe animation style
 */
export function createKeyframeAnimation(
  name: string,
  duration: number = ANIMATION_DURATIONS.entrance,
  easing: string = ANIMATION_EASINGS.smooth,
  options?: {
    delay?: number;
    iterationCount?: number | 'infinite';
    fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
  }
): CSSProperties {
  return {
    animation: `${name} ${duration}ms ${easing}`,
    animationDelay: options?.delay ? `${options.delay}ms` : undefined,
    animationIterationCount: options?.iterationCount,
    animationFillMode: options?.fillMode,
    ...hardwareAccelerated,
  };
}
