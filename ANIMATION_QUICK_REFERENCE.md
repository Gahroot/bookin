# Animation System - Quick Reference

## CSS Classes

```tsx
// Hover Effects
className="animate-lift"              // Subtle 1px lift on hover

// Entrance Animations
className="animate-slide-up"          // Slide up from bottom
className="animate-slide-up-delay-1"  // +100ms delay
className="animate-slide-up-delay-2"  // +200ms delay
className="animate-slide-up-delay-3"  // +300ms delay
className="animate-fade-in"           // Fade in
className="animate-scale-in"          // Scale + fade in

// Loading States
className="animate-pulse"             // Scale pulse
className="animate-pulse-skeleton"    // Opacity pulse
className="animate-spin"              // Continuous spin

// Transitions
className="animate-slide-exit"        // Exit left
className="animate-slide-enter"       // Enter from right

// Micro-interactions
className="animate-toggle"            // Toggle slide (20px)
```

## Components

```tsx
import {
  AnimatedButton,
  AnimatedCard,
  AnimatedToggle,
  LoadingSpinner,
  SkeletonLoader,
  PageTransition,
  StaggeredList,
} from '@/components';

// Button with ripple
<AnimatedButton variant="primary">Click</AnimatedButton>

// Card with entrance
<AnimatedCard>Content</AnimatedCard>

// Toggle switch
<AnimatedToggle label="Dark Mode" checked={on} onChange={setOn} />

// Loading
<LoadingSpinner size="md" />
<SkeletonLoader variant="rectangular" />

// Page wrapper
<PageTransition><Page /></PageTransition>

// Staggered list
<StaggeredList>{items}</StaggeredList>
```

## Hooks

```tsx
import {
  useRipple,
  useInViewAnimation,
  usePrefersReducedMotion,
  useStaggerAnimation,
  useLoadingAnimation,
} from '@/hooks';

// Ripple effect
const [ripples, handlers] = useRipple();
<button {...handlers}>{ripples.map(...)}</button>

// Scroll trigger
const [ref, isInView] = useInViewAnimation();
<div ref={ref} className={isInView ? 'animate-slide-up' : ''} />

// Check reduced motion
const prefersReduced = usePrefersReducedMotion();

// Stagger list items
const visible = useStaggerAnimation(count, delay);

// Loading with min duration
const loading = useLoadingAnimation(isLoading, 500);
```

## Animation Tokens

```tsx
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from '@/lib';

ANIMATION_DURATIONS.subtle      // 150ms
ANIMATION_DURATIONS.micro       // 200ms
ANIMATION_DURATIONS.transition  // 400ms
ANIMATION_DURATIONS.entrance    // 500ms
ANIMATION_DURATIONS.feedback    // 600ms
ANIMATION_DURATIONS.loading     // 1500ms

ANIMATION_EASINGS.out           // ease-out
ANIMATION_EASINGS.smooth        // cubic-bezier(0.4, 0, 0.2, 1)
ANIMATION_EASINGS.entrance      // cubic-bezier(0.16, 1, 0.3, 1)
ANIMATION_EASINGS.pulse         // cubic-bezier(0.4, 0, 0.6, 1)
```

## Performance Tips

- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `margin`, `padding`
- Keep durations under 600ms for interactions
- Test on lower-end devices
- All animations auto-disable with `prefers-reduced-motion`

## Common Patterns

```tsx
// 1. Button with hover and ripple
<AnimatedButton>Action</AnimatedButton>

// 2. Card grid with entrance
<div className="grid gap-4">
  <AnimatedCard>Card 1</AnimatedCard>
  <AnimatedCard>Card 2</AnimatedCard>
</div>

// 3. Loading state
{loading ? <LoadingSpinner /> : <Content />}

// 4. Staggered list
<StaggeredList>
  {items.map(item => <Item key={item.id} {...item} />)}
</StaggeredList>

// 5. Scroll-triggered
const [ref, inView] = useInViewAnimation();
<section ref={ref} className={inView ? 'animate-slide-up' : 'opacity-0'}>
  Content
</section>
```

## File Locations

```
src/
├── styles/animations.css       # All CSS animations
├── lib/animations.ts           # Utilities & constants
├── hooks/useAnimations.ts      # React hooks
├── components/
│   ├── AnimatedButton.tsx
│   ├── AnimatedCard.tsx
│   ├── AnimatedToggle.tsx
│   ├── LoadingSpinner.tsx
│   ├── SkeletonLoader.tsx
│   ├── PageTransition.tsx
│   └── StaggeredList.tsx
└── examples/
    └── AnimationShowcase.tsx   # Demo page
```

## Import Shortcuts

```tsx
// Everything you need
import { AnimatedButton, LoadingSpinner } from '@/components';
import { useRipple, useInViewAnimation } from '@/hooks';
import { ANIMATION_CLASSES } from '@/lib';
```
