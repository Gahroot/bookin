/**
 * AnimatedButton Component
 *
 * Example button component with subtle lift animation and ripple effect.
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useRipple } from '../hooks/useAnimations';
import { ANIMATION_CLASSES } from '../lib/animations';

export interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  enableRipple?: boolean;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'primary', size = 'md', enableRipple = true, className = '', ...props }, ref) => {
    const [ripples, rippleHandlers] = useRipple();

    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground',
    };

    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg',
    };

    const baseClasses = [
      'inline-flex items-center justify-center rounded-md font-medium',
      'transition-colors focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      ANIMATION_CLASSES.lift,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ');

    return (
      <button
        ref={ref}
        className={baseClasses}
        {...props}
        {...(enableRipple ? rippleHandlers : {})}
      >
        {children}
        {enableRipple &&
          ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="ripple-effect"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}
      </button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
