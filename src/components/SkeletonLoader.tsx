/**
 * SkeletonLoader Component
 *
 * Skeleton loading placeholder with pulse animation.
 */

import { HTMLAttributes } from 'react';
import { ANIMATION_CLASSES } from '../lib/animations';

export interface SkeletonLoaderProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function SkeletonLoader({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...props
}: SkeletonLoaderProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const defaultSizes = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '2.5rem', height: '2.5rem' },
    rectangular: { width: '100%', height: '8rem' },
  };

  const combinedStyle = {
    width: width ?? defaultSizes[variant].width,
    height: height ?? defaultSizes[variant].height,
    ...style,
  };

  return (
    <div
      className={`bg-muted ${variantClasses[variant]} ${ANIMATION_CLASSES.pulseSkeleton} ${className}`.trim()}
      style={combinedStyle}
      {...props}
    />
  );
}

/**
 * Skeleton Group for common loading patterns
 */
export function SkeletonCard() {
  return (
    <div className="space-y-3 p-4">
      <SkeletonLoader variant="circular" width="3rem" height="3rem" />
      <div className="space-y-2">
        <SkeletonLoader variant="text" height="1.25rem" />
        <SkeletonLoader variant="text" width="80%" />
        <SkeletonLoader variant="text" width="60%" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <SkeletonLoader variant="circular" width="2.5rem" height="2.5rem" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" height="1rem" />
            <SkeletonLoader variant="text" width="70%" height="0.875rem" />
          </div>
        </div>
      ))}
    </div>
  );
}
