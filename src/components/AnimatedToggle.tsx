/**
 * AnimatedToggle Component
 *
 * Toggle switch with smooth slide animation.
 */

import { type InputHTMLAttributes, forwardRef } from 'react';
import { ANIMATION_CLASSES } from '../lib/animations';

export interface AnimatedToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const AnimatedToggle = forwardRef<HTMLInputElement, AnimatedToggleProps>(
  ({ label, className = '', checked, ...props }, ref) => {
    return (
      <label className={`inline-flex items-center cursor-pointer ${className}`.trim()}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            {...props}
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 rounded-full peer peer-checked:bg-primary transition-colors duration-200" />
          <div
            className={`absolute left-[2px] top-[2px] bg-background w-5 h-5 rounded-full ${ANIMATION_CLASSES.toggle} ${
              checked ? 'checked' : ''
            }`.trim()}
          />
        </div>
        {label && <span className="ml-3 text-sm font-medium">{label}</span>}
      </label>
    );
  }
);

AnimatedToggle.displayName = 'AnimatedToggle';

export default AnimatedToggle;
