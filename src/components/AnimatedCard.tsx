/**
 * AnimatedCard Component
 *
 * Example card component with entrance animation and hover effects.
 */

import { type HTMLAttributes, forwardRef } from 'react';
import { useInViewAnimation } from '../hooks/useAnimations';
import { ANIMATION_CLASSES } from '../lib/animations';

export interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  enableHover?: boolean;
  enableEntrance?: boolean;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, enableHover = true, enableEntrance = true, className = '', ...props }, forwardedRef) => {
    const [inViewRef, isInView] = useInViewAnimation();

    const baseClasses = [
      'rounded-lg border bg-card text-card-foreground shadow-sm p-6',
      enableHover && ANIMATION_CLASSES.lift,
      enableEntrance && isInView && ANIMATION_CLASSES.slideUp,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={(node) => {
          if (enableEntrance) {
            (inViewRef as any).current = node;
          }
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        className={baseClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export default AnimatedCard;
