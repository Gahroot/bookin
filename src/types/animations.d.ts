/**
 * Animation Type Definitions
 *
 * TypeScript type definitions for the animation system.
 */

export type AnimationDuration = 'subtle' | 'micro' | 'transition' | 'entrance' | 'feedback' | 'loading';
export type AnimationEasing = 'out' | 'smooth' | 'entrance' | 'pulse';
export type SpringConfig = 'gentle' | 'default' | 'wobbly' | 'stiff' | 'slow' | 'molasses';

export type AnimationClass =
  | 'animate-lift'
  | 'animate-slide-up'
  | 'animate-slide-up-delay-1'
  | 'animate-slide-up-delay-2'
  | 'animate-slide-up-delay-3'
  | 'animate-pulse'
  | 'animate-pulse-skeleton'
  | 'animate-ripple'
  | 'animate-slide-exit'
  | 'animate-slide-enter'
  | 'animate-toggle'
  | 'animate-fade-in'
  | 'animate-fade-out'
  | 'animate-scale-in'
  | 'animate-spin';

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
  iterationCount?: number | 'infinite';
}

export interface RippleData {
  x: number;
  y: number;
  size: number;
  id: number;
}

export interface SpringPhysics {
  tension: number;
  friction: number;
}

declare module 'react' {
  interface CSSProperties {
    '--duration-subtle'?: string;
    '--duration-micro'?: string;
    '--duration-transition'?: string;
    '--duration-entrance'?: string;
    '--duration-feedback'?: string;
    '--duration-loading'?: string;
    '--ease-out'?: string;
    '--ease-smooth'?: string;
    '--ease-entrance'?: string;
    '--ease-pulse'?: string;
    '--lift-subtle'?: string;
    '--slide-entrance'?: string;
    '--slide-exit'?: string;
    '--slide-enter'?: string;
    '--toggle-distance'?: string;
    '--shadow-lift'?: string;
  }
}
