/**
 * Animation Hooks
 *
 * React hooks for handling animations with accessibility support.
 */

import { useEffect, useState, useRef, useCallback, type MouseEvent } from 'react';
import { prefersReducedMotion, getSafeAnimationDuration, type AnimationDuration } from '../lib/animations';

/**
 * Hook to check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReduced(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}

/**
 * Hook for entrance animations
 */
export function useEntranceAnimation(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const safeDelay = reduced ? 0 : delay;
    const timer = setTimeout(() => setIsVisible(true), safeDelay);
    return () => clearTimeout(timer);
  }, [delay, reduced]);

  return isVisible;
}

/**
 * Hook for staggered list animations
 */
export function useStaggerAnimation(itemCount: number, baseDelay: number = 100) {
  const reduced = usePrefersReducedMotion();

  // Initialize with all items visible if reduced motion is preferred
  const [visibleItems, setVisibleItems] = useState<Set<number>>(() =>
    reduced ? new Set(Array.from({ length: itemCount }, (_, i) => i)) : new Set()
  );

  useEffect(() => {
    // If reduced motion, ensure all items are visible immediately
    if (reduced) {
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, i) => i)));
      return;
    }

    // Reset visible items when dependencies change
    setVisibleItems(new Set());
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, i]));
      }, i * baseDelay);
      timers.push(timer);
    }

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [itemCount, baseDelay, reduced]);

  return visibleItems;
}

/**
 * Hook for ripple effect on click
 */
export interface RippleHandlers {
  onMouseDown: (event: MouseEvent<HTMLElement>) => void;
  style: { position: 'relative'; overflow: 'hidden' };
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export function useRipple(): [Ripple[], RippleHandlers] {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const reduced = usePrefersReducedMotion();

  const createRipple = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (reduced) return;

      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple: Ripple = {
        x,
        y,
        size,
        id: nextId.current++,
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    },
    [reduced]
  );

  const handlers: RippleHandlers = {
    onMouseDown: createRipple,
    style: { position: 'relative', overflow: 'hidden' },
  };

  return [ripples, handlers];
}

/**
 * Hook for toggle animations
 */
export function useToggleAnimation(isChecked: boolean, duration: AnimationDuration = 'micro') {
  const reduced = usePrefersReducedMotion();
  const [animationKey, setAnimationKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reduced) {
      return;
    }

    // Trigger new animation by incrementing key asynchronously
    const startTimer = setTimeout(() => {
      setAnimationKey((prev) => prev + 1);
    }, 0);

    // Schedule end of animation
    timeoutRef.current = setTimeout(() => {
      setAnimationKey((prev) => prev + 1);
    }, getSafeAnimationDuration(duration));

    return () => {
      clearTimeout(startTimer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isChecked, duration, reduced]);

  // Derive animation state from key changes
  const isAnimating = !reduced && animationKey % 2 === 1;
  return isAnimating;
}

/**
 * Hook for page transitions
 */
export function usePageTransition(trigger: unknown) {
  const reduced = usePrefersReducedMotion();
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reduced) {
      return;
    }

    // Start with exiting phase asynchronously
    const startTimer = setTimeout(() => {
      setTransitionPhase('exiting');
    }, 0);

    // Schedule entrance after exit completes
    exitTimerRef.current = setTimeout(() => {
      setTransitionPhase('entering');
    }, 400);

    // Schedule completion
    enterTimerRef.current = setTimeout(() => {
      setTransitionPhase('idle');
    }, 800);

    return () => {
      clearTimeout(startTimer);
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
      if (enterTimerRef.current) {
        clearTimeout(enterTimerRef.current);
      }
    };
  }, [trigger, reduced]);

  return {
    isExiting: transitionPhase === 'exiting',
    isEntering: transitionPhase === 'entering',
  };
}

/**
 * Hook for intersection observer animations
 */
export function useInViewAnimation(options?: IntersectionObserverInit) {
  const reduced = usePrefersReducedMotion();
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If reduced motion, mark as in view asynchronously
    if (reduced) {
      const timer = setTimeout(() => {
        setIsInView(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options, reduced]);

  return [ref, isInView] as const;
}

/**
 * Hook for loading animations with automatic cleanup
 */
export function useLoadingAnimation(isLoading: boolean, minDuration: number = 300) {
  const [showLoading, setShowLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isLoading) {
      // Record start time and schedule showing loading asynchronously
      startTimeRef.current = Date.now();

      timeoutRef.current = setTimeout(() => {
        setShowLoading(true);
      }, 0);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    // isLoading is false
    if (startTimeRef.current === null) {
      // Never started loading, nothing to do
      return;
    }

    // Loading finished, ensure minimum duration is met
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, minDuration - elapsed);

    timeoutRef.current = setTimeout(() => {
      setShowLoading(false);
      startTimeRef.current = null;
    }, remaining);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, minDuration]);

  return showLoading;
}
