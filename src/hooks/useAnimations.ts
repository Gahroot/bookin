/**
 * Animation Hooks
 *
 * React hooks for handling animations with accessibility support.
 */

import { useEffect, useState, useRef, useCallback, MouseEvent } from 'react';
import { prefersReducedMotion, getSafeAnimationDuration, AnimationDuration } from '../lib/animations';

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
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, i) => i)));
      return;
    }

    const timers: NodeJS.Timeout[] = [];

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
  const [isAnimating, setIsAnimating] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, getSafeAnimationDuration(duration));

    return () => clearTimeout(timer);
  }, [isChecked, duration, reduced]);

  return isAnimating;
}

/**
 * Hook for page transitions
 */
export function usePageTransition(trigger: unknown) {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    setIsExiting(true);

    const exitTimer = setTimeout(() => {
      setIsExiting(false);
      setIsEntering(true);
    }, 400);

    const enterTimer = setTimeout(() => {
      setIsEntering(false);
    }, 800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(enterTimer);
    };
  }, [trigger, reduced]);

  return { isExiting, isEntering };
}

/**
 * Hook for intersection observer animations
 */
export function useInViewAnimation(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

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

  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      setShowLoading(true);
    } else if (startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, minDuration - elapsed);

      const timer = setTimeout(() => {
        setShowLoading(false);
        startTimeRef.current = null;
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration]);

  return showLoading;
}
