/**
 * PageTransition Component
 *
 * Wrapper for page transitions with slide horizontal animation.
 */

import { type ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ANIMATION_CLASSES } from '../lib/animations';
import { usePrefersReducedMotion } from '../hooks/useAnimations';

export interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit' | 'idle'>('idle');
  const prefersReduced = usePrefersReducedMotion();

  // Derive the actual display location based on prefersReduced
  const actualDisplayLocation = prefersReduced ? location : displayLocation;

  useEffect(() => {
    // Skip animation logic if reduced motion is preferred
    if (prefersReduced) {
      return;
    }

    if (location.pathname !== displayLocation.pathname) {
      // Use microtask queue to avoid synchronous setState in effect
      queueMicrotask(() => setTransitionStage('exit'));

      const exitTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
      }, 400);

      const enterTimer = setTimeout(() => {
        setTransitionStage('idle');
      }, 800);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(enterTimer);
      };
    }
  }, [location, displayLocation, prefersReduced]);

  const animationClass =
    transitionStage === 'exit'
      ? ANIMATION_CLASSES.slideExit
      : transitionStage === 'enter'
      ? ANIMATION_CLASSES.slideEnter
      : '';

  return (
    <div className={animationClass} key={actualDisplayLocation.pathname}>
      {children}
    </div>
  );
}
