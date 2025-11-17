/**
 * Design System Library
 *
 * Centralized export of all design system utilities.
 */

// Animation exports
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

// Icon exports
export {
  iconMap,
  getIcon,
  defaultIconProps,
  iconSizes,
} from './lucide-icons';

export type {
  IconName,
  IconSize,
} from './lucide-icons';
