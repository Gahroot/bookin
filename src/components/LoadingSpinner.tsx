/**
 * LoadingSpinner Component
 *
 * Loading spinner with pulse animation for loading states.
 */

import { type HTMLAttributes } from 'react';
import { ANIMATION_CLASSES } from '../lib/animations';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spin' | 'pulse';
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'spin',
  className = '',
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const animationClass = variant === 'spin' ? ANIMATION_CLASSES.spin : ANIMATION_CLASSES.pulse;

  return (
    <div
      className={`${sizeClasses[size]} ${animationClass} ${className}`.trim()}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <svg
        className="text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
