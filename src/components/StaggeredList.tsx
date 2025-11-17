/**
 * StaggeredList Component
 *
 * List with staggered entrance animations for children.
 */

import { Children, type ReactNode, cloneElement, isValidElement } from 'react';
import { useStaggerAnimation } from '../hooks/useAnimations';
import { ANIMATION_CLASSES } from '../lib/animations';

export interface StaggeredListProps {
  children: ReactNode;
  baseDelay?: number;
  className?: string;
}

export default function StaggeredList({ children, baseDelay = 100, className = '' }: StaggeredListProps) {
  const childArray = Children.toArray(children);
  const visibleItems = useStaggerAnimation(childArray.length, baseDelay);

  return (
    <div className={className}>
      {childArray.map((child, index) => {
        const isVisible = visibleItems.has(index);

        if (isValidElement(child)) {
          return cloneElement(child as any, {
            key: child.key ?? index,
            className: `${(child.props as any).className || ''} ${
              isVisible ? ANIMATION_CLASSES.slideUp : 'opacity-0'
            }`.trim(),
            style: {
              ...(child.props as any).style,
              animationDelay: isVisible ? `${index * baseDelay}ms` : undefined,
            },
          });
        }

        return (
          <div
            key={index}
            className={isVisible ? ANIMATION_CLASSES.slideUp : 'opacity-0'}
            style={{ animationDelay: isVisible ? `${index * baseDelay}ms` : undefined }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
