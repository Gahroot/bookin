# Animation System - Complete Index

## Quick Links

- [Full Documentation](./ANIMATIONS.md) - Complete guide with examples
- [Quick Reference](./ANIMATION_QUICK_REFERENCE.md) - Cheat sheet
- [Implementation Summary](./src/README_ANIMATIONS.md) - Overview of all files

## Installation

Already installed! The animation system is integrated into your project.

```tsx
// Start using immediately
import { AnimatedButton } from '@/components';
import { useRipple } from '@/hooks';
import { ANIMATION_CLASSES } from '@/lib';
```

## File Locations

```
/home/groot/Documents/agent-girl/bookin/bookin/

Core System:
├── src/styles/animations.css          ← All CSS animations
├── src/lib/animations.ts              ← Utilities & constants
├── src/lib/animationStyles.ts         ← CSS-in-JS helpers
├── src/hooks/useAnimations.ts         ← React hooks
└── src/types/animations.d.ts          ← TypeScript types

Components:
├── src/components/AnimatedButton.tsx
├── src/components/AnimatedCard.tsx
├── src/components/AnimatedToggle.tsx
├── src/components/LoadingSpinner.tsx
├── src/components/SkeletonLoader.tsx
├── src/components/PageTransition.tsx
└── src/components/StaggeredList.tsx

Documentation:
├── ANIMATIONS.md                      ← Complete documentation
├── ANIMATION_QUICK_REFERENCE.md       ← Quick reference
├── ANIMATION_SYSTEM_INDEX.md          ← This file
└── src/README_ANIMATIONS.md           ← Implementation summary

Examples:
└── src/examples/AnimationShowcase.tsx ← Interactive demo
```

## 6 Animation Categories

### 1. Button & Hover (Subtle Lift)
**150ms | ease-out**
```tsx
<button className="animate-lift">Hover me</button>
<AnimatedButton variant="primary">With ripple</AnimatedButton>
```

### 2. Entrance (Slide Up)
**500ms | cubic-bezier(0.16, 1, 0.3, 1)**
```tsx
<div className="animate-slide-up">Appears from bottom</div>
<AnimatedCard>Auto-animates on scroll</AnimatedCard>
<StaggeredList>{items}</StaggeredList>
```

### 3. Loading (Pulse)
**1500ms | cubic-bezier(0.4, 0, 0.6, 1)**
```tsx
<div className="animate-pulse">Pulsing</div>
<LoadingSpinner variant="spin" />
<SkeletonLoader variant="rectangular" />
```

### 4. Feedback (Ripple)
**600ms | cubic-bezier(0.4, 0, 0.2, 1)**
```tsx
const [ripples, handlers] = useRipple();
<button {...handlers}>Click me</button>
```

### 5. Page Transition (Slide Horizontal)
**400ms | cubic-bezier(0.4, 0, 0.2, 1)**
```tsx
<PageTransition>
  <YourPage />
</PageTransition>
```

### 6. Micro-interaction (Toggle)
**200ms | cubic-bezier(0.4, 0, 0.2, 1)**
```tsx
<AnimatedToggle label="Setting" checked={on} onChange={setOn} />
```

## Most Common Use Cases

### 1. Interactive Button
```tsx
import { AnimatedButton } from '@/components';

<AnimatedButton variant="primary" size="md">
  Click me
</AnimatedButton>
```

### 2. Loading State
```tsx
import { LoadingSpinner } from '@/components';

{isLoading ? <LoadingSpinner /> : <Content />}
```

### 3. Skeleton Loading
```tsx
import { SkeletonCard, SkeletonList } from '@/components';

{loading ? <SkeletonCard /> : <ActualCard />}
{loading ? <SkeletonList count={5} /> : <ActualList />}
```

### 4. Animated Card
```tsx
import { AnimatedCard } from '@/components';

<AnimatedCard>
  <h2>Title</h2>
  <p>Content</p>
</AnimatedCard>
```

### 5. Staggered List
```tsx
import { StaggeredList } from '@/components';

<StaggeredList baseDelay={100}>
  {items.map(item => <Item key={item.id} {...item} />)}
</StaggeredList>
```

### 6. Scroll Animation
```tsx
import { useInViewAnimation } from '@/hooks';

const [ref, isInView] = useInViewAnimation();

<section ref={ref} className={isInView ? 'animate-slide-up' : 'opacity-0'}>
  Animates when scrolled into view
</section>
```

### 7. Ripple Effect
```tsx
import { useRipple } from '@/hooks';

const [ripples, handlers] = useRipple();

<button {...handlers} className="relative overflow-hidden">
  Click me
  {ripples.map(r => (
    <span key={r.id} className="ripple-effect" style={{
      left: r.x, top: r.y, width: r.size, height: r.size
    }} />
  ))}
</button>
```

## All CSS Classes

```css
/* Hover Effects */
.animate-lift                 /* 1px lift on hover */

/* Entrance */
.animate-slide-up             /* Slide up from bottom */
.animate-slide-up-delay-1     /* +100ms delay */
.animate-slide-up-delay-2     /* +200ms delay */
.animate-slide-up-delay-3     /* +300ms delay */
.animate-fade-in              /* Fade in */
.animate-scale-in             /* Scale + fade */

/* Loading */
.animate-pulse                /* Scale pulse */
.animate-pulse-skeleton       /* Opacity pulse */
.animate-spin                 /* Spin loader */

/* Transitions */
.animate-slide-exit           /* Exit left */
.animate-slide-enter          /* Enter right */
.animate-fade-out             /* Fade out */

/* Micro */
.animate-toggle               /* Toggle slide */

/* Helpers */
.ripple-container             /* Ripple wrapper */
.ripple-effect                /* Ripple element */
```

## All React Hooks

```tsx
// Accessibility
usePrefersReducedMotion()           // Check user preference

// Entrance
useEntranceAnimation(delay)         // Delayed appearance
useStaggerAnimation(count, delay)   // Stagger list items
useInViewAnimation(options)         // Scroll trigger

// Interaction
useRipple()                         // Material ripple
useToggleAnimation(checked, dur)    // Toggle animation

// Loading
useLoadingAnimation(loading, min)   // Min duration loader

// Navigation
usePageTransition(trigger)          // Page transitions
```

## All Components

```tsx
// Interactive
<AnimatedButton variant="primary|secondary|outline" size="sm|md|lg" />
<AnimatedCard enableHover enableEntrance />
<AnimatedToggle label="..." checked={bool} onChange={fn} />

// Loading
<LoadingSpinner size="sm|md|lg" variant="spin|pulse" />
<SkeletonLoader variant="text|circular|rectangular" width height />
<SkeletonCard />
<SkeletonList count={number} />

// Layout
<PageTransition><Page /></PageTransition>
<StaggeredList baseDelay={100}>{children}</StaggeredList>
```

## Animation Tokens

### Durations (ms)
```ts
ANIMATION_DURATIONS.subtle      // 150
ANIMATION_DURATIONS.micro       // 200
ANIMATION_DURATIONS.transition  // 400
ANIMATION_DURATIONS.entrance    // 500
ANIMATION_DURATIONS.feedback    // 600
ANIMATION_DURATIONS.loading     // 1500
```

### Easings
```ts
ANIMATION_EASINGS.out           // ease-out
ANIMATION_EASINGS.smooth        // cubic-bezier(0.4, 0, 0.2, 1)
ANIMATION_EASINGS.entrance      // cubic-bezier(0.16, 1, 0.3, 1)
ANIMATION_EASINGS.pulse         // cubic-bezier(0.4, 0, 0.6, 1)
```

## CSS-in-JS Styles

```tsx
import {
  transitionStyles,
  transformStates,
  hoverStates,
  activeStates,
  getAnimationStyle,
  combineStyles,
} from '@/lib';

// Transition presets
<div style={transitionStyles.lift}>Hover me</div>

// Transform states
<div style={transformStates.initial.slideUp}>Hidden</div>
<div style={transformStates.animate.slideUp}>Visible</div>

// Hover/Active states
<button style={{ ...hoverStates.lift }}>Button</button>

// Dynamic animation
<div style={getAnimationStyle('slideUp', 'animate', { duration: 500 })}>
  Animated
</div>

// Combine multiple styles
<div style={combineStyles(
  transitionStyles.fade,
  hoverStates.scale,
  { padding: '1rem' }
)}>
  Combined
</div>
```

## Performance Checklist

- ✅ Hardware-accelerated (transform, opacity only)
- ✅ GPU layers enabled (translateZ, backface-visibility)
- ✅ No layout thrashing (no width/height animations)
- ✅ 60fps target
- ✅ Optimized for mobile

## Accessibility Checklist

- ✅ Respects prefers-reduced-motion
- ✅ All hooks check reduced motion
- ✅ All components support reduced motion
- ✅ Animations near-instant when reduced motion enabled
- ✅ Focus states preserved
- ✅ ARIA labels on loading states

## Testing

### View Demo Page
```tsx
import AnimationShowcase from '@/examples/AnimationShowcase';

// Add to your router
<Route path="/animations" element={<AnimationShowcase />} />
```

### Test Reduced Motion
- **macOS**: System Preferences → Accessibility → Display → Reduce motion
- **Windows**: Settings → Ease of Access → Display → Show animations
- **DevTools**: Rendering → prefers-reduced-motion: reduce

### Performance Testing
```tsx
// Check in DevTools
// 1. Performance tab → Record interaction
// 2. Check for 60fps
// 3. Look for layout thrashing (should be none)
// 4. Verify GPU acceleration (green bars in layers)
```

## Customization

### Change Durations
Edit `/home/groot/Documents/agent-girl/bookin/bookin/src/styles/animations.css`:
```css
@theme {
  --duration-subtle: 150ms;    /* Your value */
  --duration-entrance: 500ms;  /* Your value */
}
```

### Change Easings
```css
@theme {
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);  /* Your easing */
}
```

### Add New Animation
```css
@keyframes my-animation {
  from { /* start state */ }
  to { /* end state */ }
}

.animate-my-custom {
  animation: my-animation 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Support

- **Documentation**: See `ANIMATIONS.md`
- **Quick Reference**: See `ANIMATION_QUICK_REFERENCE.md`
- **Implementation**: See `src/README_ANIMATIONS.md`
- **Examples**: See `src/examples/AnimationShowcase.tsx`

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| Mobile  | ✅ Full |

## Summary

**Implementation Status**: ✅ Complete

- 18 files created
- 6 animation categories
- 15+ CSS classes
- 8 React hooks
- 7 components
- Full TypeScript support
- Complete documentation
- Interactive demo
- Production-ready

**Ready to use!** Import and start animating.
