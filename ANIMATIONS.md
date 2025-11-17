# Animation System Documentation

Comprehensive animation system with hardware-accelerated, accessible animations.

## Table of Contents

1. [Overview](#overview)
2. [Animation Categories](#animation-categories)
3. [Usage Examples](#usage-examples)
4. [CSS Classes](#css-classes)
5. [React Hooks](#react-hooks)
6. [Components](#components)
7. [Performance](#performance)
8. [Accessibility](#accessibility)

---

## Overview

This animation system provides:

- **Hardware-accelerated animations** (transform, opacity)
- **Accessibility support** (respects prefers-reduced-motion)
- **Reusable utilities** (CSS classes, hooks, components)
- **Type-safe** (TypeScript definitions)
- **Consistent timing** (centralized tokens)

---

## Animation Categories

### 1. Button & Hover - Subtle Lift

**Purpose**: Minimal elevation feedback for interactive elements

**Specs**:
- Duration: 150ms
- Easing: ease-out
- Transform: translateY(-1px)
- Shadow: 0 2px 8px rgba(0,0,0,0.1)

**Usage**:
```tsx
<button className="animate-lift">Click me</button>
```

---

### 2. Entrance - Slide Up

**Purpose**: Elegant reveal for content appearing on screen

**Specs**:
- Duration: 500ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- From: translateY(20px), opacity: 0
- To: translateY(0), opacity: 1

**Usage**:
```tsx
<div className="animate-slide-up">Content</div>

{/* With staggered delays */}
<div className="animate-slide-up-delay-1">Item 1</div>
<div className="animate-slide-up-delay-2">Item 2</div>
<div className="animate-slide-up-delay-3">Item 3</div>
```

---

### 3. Loading - Pulse

**Purpose**: Loading indicators and skeleton screens

**Specs**:
- Duration: 1500ms
- Easing: cubic-bezier(0.4, 0, 0.6, 1)
- Animation: scale(1) → scale(1.05) → scale(1)
- Opacity: 1 → 0.5 → 1
- Infinite: true

**Usage**:
```tsx
<div className="animate-pulse">Loading...</div>
<div className="animate-pulse-skeleton">Skeleton</div>
```

---

### 4. Feedback - Ripple Effect

**Purpose**: Material Design ripple for click feedback

**Specs**:
- Duration: 600ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Animation: scale(0) → scale(4), opacity: 1 → 0

**Usage**:
```tsx
import { useRipple } from '@/hooks';

function MyButton() {
  const [ripples, rippleHandlers] = useRipple();

  return (
    <button {...rippleHandlers}>
      Click me
      {ripples.map((ripple) => (
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
```

---

### 5. Page Transition - Slide Horizontal

**Purpose**: Smooth navigation transitions

**Specs**:
- Duration: 400ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Exit: translateX(0) → translateX(-30%)
- Enter: translateX(100%) → translateX(0)

**Usage**:
```tsx
import { PageTransition } from '@/components';

<PageTransition>
  <YourPageContent />
</PageTransition>
```

---

### 6. Micro-interaction - Toggle Slide

**Purpose**: Smooth toggle switches

**Specs**:
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Animation: translateX(0) → translateX(20px)

**Usage**:
```tsx
import { AnimatedToggle } from '@/components';

<AnimatedToggle label="Dark Mode" checked={isDark} onChange={setIsDark} />
```

---

## Usage Examples

### Basic CSS Classes

```tsx
// Hover lift
<button className="animate-lift">Button</button>

// Entrance animation
<div className="animate-slide-up">Content</div>

// Loading pulse
<div className="animate-pulse">Loading</div>

// Fade animations
<div className="animate-fade-in">Fade in</div>
<div className="animate-fade-out">Fade out</div>

// Scale animation
<div className="animate-scale-in">Scale in</div>
```

### Using Hooks

```tsx
import {
  usePrefersReducedMotion,
  useEntranceAnimation,
  useStaggerAnimation,
  useInViewAnimation,
  useLoadingAnimation,
} from '@/hooks';

// Check reduced motion preference
const prefersReduced = usePrefersReducedMotion();

// Entrance with delay
const isVisible = useEntranceAnimation(300);

// Staggered list
const visibleItems = useStaggerAnimation(5, 100);

// Animate on scroll into view
const [ref, isInView] = useInViewAnimation();

// Loading with minimum duration
const showLoading = useLoadingAnimation(isLoading, 500);
```

### Using Components

```tsx
import {
  AnimatedButton,
  AnimatedCard,
  AnimatedToggle,
  LoadingSpinner,
  SkeletonLoader,
  StaggeredList,
} from '@/components';

// Animated button with ripple
<AnimatedButton variant="primary" size="md" enableRipple>
  Click me
</AnimatedButton>

// Animated card
<AnimatedCard enableHover enableEntrance>
  Card content
</AnimatedCard>

// Toggle switch
<AnimatedToggle
  label="Enable feature"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>

// Loading spinner
<LoadingSpinner size="md" variant="spin" />

// Skeleton loader
<SkeletonLoader variant="rectangular" width="100%" height="200px" />

// Staggered list
<StaggeredList baseDelay={100}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggeredList>
```

---

## CSS Classes

### Animation Classes

| Class | Description | Duration | Easing |
|-------|-------------|----------|--------|
| `animate-lift` | Hover lift effect | 150ms | ease-out |
| `animate-slide-up` | Slide up entrance | 500ms | cubic-bezier(0.16, 1, 0.3, 1) |
| `animate-slide-up-delay-1` | Slide up + 100ms delay | 500ms | cubic-bezier(0.16, 1, 0.3, 1) |
| `animate-slide-up-delay-2` | Slide up + 200ms delay | 500ms | cubic-bezier(0.16, 1, 0.3, 1) |
| `animate-slide-up-delay-3` | Slide up + 300ms delay | 500ms | cubic-bezier(0.16, 1, 0.3, 1) |
| `animate-pulse` | Pulse with scale | 1500ms | cubic-bezier(0.4, 0, 0.6, 1) |
| `animate-pulse-skeleton` | Pulse opacity only | 1500ms | cubic-bezier(0.4, 0, 0.6, 1) |
| `animate-ripple` | Ripple effect | 600ms | cubic-bezier(0.4, 0, 0.2, 1) |
| `animate-slide-exit` | Slide exit transition | 400ms | cubic-bezier(0.4, 0, 0.2, 1) |
| `animate-slide-enter` | Slide enter transition | 400ms | cubic-bezier(0.4, 0, 0.2, 1) |
| `animate-toggle` | Toggle slide | 200ms | cubic-bezier(0.4, 0, 0.2, 1) |
| `animate-fade-in` | Fade in | 500ms | cubic-bezier(0.4, 0, 0.2, 1) |
| `animate-fade-out` | Fade out | 500ms | cubic-bezier(0.4, 0, 0.2, 1) |
| `animate-scale-in` | Scale in | 500ms | cubic-bezier(0.16, 1, 0.3, 1) |
| `animate-spin` | Continuous spin | 1000ms | linear |

### Helper Classes

| Class | Description |
|-------|-------------|
| `ripple-container` | Container for ripple effect |
| `ripple-effect` | Individual ripple element |

---

## React Hooks

### `usePrefersReducedMotion()`

Check if user prefers reduced motion.

```tsx
const prefersReduced = usePrefersReducedMotion();

return (
  <div className={prefersReduced ? '' : 'animate-slide-up'}>
    Content
  </div>
);
```

### `useEntranceAnimation(delay: number)`

Delay content appearance.

```tsx
const isVisible = useEntranceAnimation(500);

return isVisible ? <Content /> : null;
```

### `useStaggerAnimation(itemCount: number, baseDelay: number)`

Stagger animations for multiple items.

```tsx
const visibleItems = useStaggerAnimation(items.length, 100);

return items.map((item, i) => (
  <div
    key={i}
    className={visibleItems.has(i) ? 'animate-slide-up' : 'opacity-0'}
  >
    {item}
  </div>
));
```

### `useRipple()`

Material Design ripple effect.

```tsx
const [ripples, rippleHandlers] = useRipple();

return (
  <button {...rippleHandlers}>
    Click
    {ripples.map(ripple => (
      <span key={ripple.id} className="ripple-effect" {...} />
    ))}
  </button>
);
```

### `useInViewAnimation(options?: IntersectionObserverInit)`

Animate when scrolled into view.

```tsx
const [ref, isInView] = useInViewAnimation({ threshold: 0.5 });

return (
  <div ref={ref} className={isInView ? 'animate-slide-up' : 'opacity-0'}>
    Content
  </div>
);
```

### `useLoadingAnimation(isLoading: boolean, minDuration: number)`

Loading state with minimum duration.

```tsx
const showLoading = useLoadingAnimation(isLoading, 500);

return showLoading ? <LoadingSpinner /> : <Content />;
```

### `usePageTransition(trigger: any)`

Page transition states.

```tsx
const { isExiting, isEntering } = usePageTransition(location);

return (
  <div className={isExiting ? 'animate-slide-exit' : isEntering ? 'animate-slide-enter' : ''}>
    Content
  </div>
);
```

---

## Components

### `<AnimatedButton>`

Button with lift animation and ripple effect.

**Props**:
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `enableRipple`: boolean (default: true)

```tsx
<AnimatedButton variant="primary" size="md">
  Click me
</AnimatedButton>
```

### `<AnimatedCard>`

Card with entrance and hover animations.

**Props**:
- `enableHover`: boolean (default: true)
- `enableEntrance`: boolean (default: true)

```tsx
<AnimatedCard enableHover enableEntrance>
  Card content
</AnimatedCard>
```

### `<AnimatedToggle>`

Toggle switch with slide animation.

**Props**:
- `label`: string
- `checked`: boolean
- `onChange`: (e: ChangeEvent) => void

```tsx
<AnimatedToggle
  label="Dark Mode"
  checked={isDark}
  onChange={(e) => setIsDark(e.target.checked)}
/>
```

### `<LoadingSpinner>`

Spinning loading indicator.

**Props**:
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'spin' | 'pulse'

```tsx
<LoadingSpinner size="md" variant="spin" />
```

### `<SkeletonLoader>`

Skeleton loading placeholder.

**Props**:
- `variant`: 'text' | 'circular' | 'rectangular'
- `width`: string | number
- `height`: string | number

```tsx
<SkeletonLoader variant="rectangular" width="100%" height="200px" />
<SkeletonCard />
<SkeletonList count={5} />
```

### `<PageTransition>`

Page transition wrapper.

```tsx
<PageTransition>
  <YourPageContent />
</PageTransition>
```

### `<StaggeredList>`

List with staggered entrance animations.

**Props**:
- `baseDelay`: number (ms between each item)

```tsx
<StaggeredList baseDelay={100}>
  <Item1 />
  <Item2 />
  <Item3 />
</StaggeredList>
```

---

## Performance

### Hardware Acceleration

All animations use GPU-accelerated properties:
- `transform` (instead of top/left)
- `opacity` (instead of visibility)

### Optimizations Applied

1. **will-change**: Set on hover animations
2. **transform: translateZ(0)**: Force GPU layer
3. **backface-visibility: hidden**: Prevent flicker
4. **Avoid layout thrashing**: No width/height/margin animations

### Best Practices

- Keep durations under 600ms for UI feedback
- Use `transform` and `opacity` only
- Test on lower-end devices
- Monitor frame rate (target: 60fps)

---

## Accessibility

### Respects User Preferences

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Testing

Test reduced motion:

**macOS**: System Preferences → Accessibility → Display → Reduce motion

**Windows**: Settings → Ease of Access → Display → Show animations

**Chrome DevTools**: Rendering → Emulate CSS media feature prefers-reduced-motion

### Manual Check

```tsx
const prefersReduced = usePrefersReducedMotion();

if (prefersReduced) {
  // Skip animations or use instant transitions
}
```

---

## Animation Tokens

### Durations (CSS Custom Properties)

```css
--duration-subtle: 150ms;    /* Quick interactions */
--duration-micro: 200ms;     /* Micro-interactions */
--duration-transition: 400ms; /* Page transitions */
--duration-entrance: 500ms;   /* Entrance animations */
--duration-feedback: 600ms;   /* Feedback animations */
--duration-loading: 1500ms;   /* Loading states */
```

### Easings (CSS Custom Properties)

```css
--ease-out: ease-out;
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
--ease-pulse: cubic-bezier(0.4, 0, 0.6, 1);
```

### TypeScript Constants

```ts
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from '@/lib';

const duration = ANIMATION_DURATIONS.entrance; // 500
const easing = ANIMATION_EASINGS.smooth; // 'cubic-bezier(0.4, 0, 0.2, 1)'
```

---

## File Structure

```
src/
├── styles/
│   └── animations.css          # All CSS animations
├── lib/
│   ├── animations.ts           # Animation utilities
│   └── index.ts                # Lib exports
├── hooks/
│   ├── useAnimations.ts        # Animation hooks
│   └── index.ts                # Hook exports
└── components/
    ├── AnimatedButton.tsx      # Button component
    ├── AnimatedCard.tsx        # Card component
    ├── AnimatedToggle.tsx      # Toggle component
    ├── LoadingSpinner.tsx      # Spinner component
    ├── SkeletonLoader.tsx      # Skeleton component
    ├── PageTransition.tsx      # Transition wrapper
    ├── StaggeredList.tsx       # Staggered list
    └── index.ts                # Component exports
```

---

## Quick Reference

### Import Paths

```tsx
// Components
import { AnimatedButton, AnimatedCard, LoadingSpinner } from '@/components';

// Hooks
import { useRipple, useInViewAnimation, usePrefersReducedMotion } from '@/hooks';

// Utilities
import { ANIMATION_CLASSES, getAnimationDuration } from '@/lib';
```

### Most Common Patterns

```tsx
// 1. Button with hover and ripple
<AnimatedButton>Click</AnimatedButton>

// 2. Card with entrance
<AnimatedCard>Content</AnimatedCard>

// 3. Loading state
{isLoading ? <LoadingSpinner /> : <Content />}

// 4. Skeleton loading
<SkeletonLoader variant="rectangular" />

// 5. Staggered list
<StaggeredList>{items.map(...)}</StaggeredList>

// 6. Scroll-triggered animation
const [ref, isInView] = useInViewAnimation();
<div ref={ref} className={isInView ? 'animate-slide-up' : ''}>...</div>
```

---

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

All animations gracefully degrade in older browsers.
