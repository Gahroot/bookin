/**
 * Animation Library
 *
 * Centralized export of all animation utilities.
 */

export {
  ANIMATION_DURATIONS,
  ANIMATION_EASINGS,
  ANIMATION_CLASSES,
  SPRING_CONFIGS,
  getAnimationDuration,
  getAnimationEasing,
  prefersReducedMotion,
  getSafeAnimationDuration,
  getStaggerDelay,
} from './animations';

export type {
  AnimationDuration,
  AnimationEasing,
  AnimationClass,
  SpringConfig,
} from './animations';

export {
  transitionStyles,
  transformStates,
  hoverStates,
  activeStates,
  loadingStates,
  animationPresets,
  hardwareAccelerated,
  combineStyles,
  createStaggerStyle,
  createTransition,
  getAnimationStyle,
  responsiveAnimation,
  createKeyframeAnimation,
} from './animationStyles';
