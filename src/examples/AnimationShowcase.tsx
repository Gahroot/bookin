/**
 * Animation Showcase
 *
 * Demonstrates all available animations in the system.
 * Use this as a reference or testing page.
 */

import { useState } from 'react';
import {
  AnimatedButton,
  AnimatedCard,
  AnimatedToggle,
  LoadingSpinner,
  SkeletonCard,
  SkeletonList,
  StaggeredList,
} from '../components';
import { useRipple, useInViewAnimation } from '../hooks';
import { ANIMATION_CLASSES } from '../lib';

export default function AnimationShowcase() {
  const [isToggled, setIsToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 animate-slide-up">Animation System Showcase</h1>
        <p className="text-muted-foreground animate-slide-up-delay-1">
          Interactive examples of all available animations
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-16">
        {/* Button & Hover - Subtle Lift */}
        <Section title="1. Button & Hover - Subtle Lift">
          <div className="flex flex-wrap gap-4">
            <AnimatedButton variant="primary">Primary Button</AnimatedButton>
            <AnimatedButton variant="secondary">Secondary Button</AnimatedButton>
            <AnimatedButton variant="outline">Outline Button</AnimatedButton>
            <AnimatedButton variant="primary" size="sm">Small</AnimatedButton>
            <AnimatedButton variant="primary" size="md">Medium</AnimatedButton>
            <AnimatedButton variant="primary" size="lg">Large</AnimatedButton>
          </div>
          <CodeBlock>
            {`<AnimatedButton variant="primary">Click me</AnimatedButton>`}
          </CodeBlock>
        </Section>

        {/* Entrance - Slide Up */}
        <Section title="2. Entrance - Slide Up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg animate-slide-up">
              <h3 className="font-semibold">No delay</h3>
              <p className="text-sm text-muted-foreground">animate-slide-up</p>
            </div>
            <div className="p-4 bg-card rounded-lg animate-slide-up-delay-1">
              <h3 className="font-semibold">100ms delay</h3>
              <p className="text-sm text-muted-foreground">animate-slide-up-delay-1</p>
            </div>
            <div className="p-4 bg-card rounded-lg animate-slide-up-delay-2">
              <h3 className="font-semibold">200ms delay</h3>
              <p className="text-sm text-muted-foreground">animate-slide-up-delay-2</p>
            </div>
          </div>
          <CodeBlock>
            {`<div className="animate-slide-up">Content</div>\n<div className="animate-slide-up-delay-1">Delayed</div>`}
          </CodeBlock>
        </Section>

        {/* Loading - Pulse */}
        <Section title="3. Loading - Pulse">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <LoadingSpinner size="sm" variant="spin" />
              <LoadingSpinner size="md" variant="spin" />
              <LoadingSpinner size="lg" variant="spin" />
              <div className="w-12 h-12 bg-primary rounded animate-pulse" />
              <div className="w-12 h-12 bg-secondary rounded animate-pulse-skeleton" />
            </div>
            <div>
              <button
                onClick={() => setShowSkeleton(!showSkeleton)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Toggle Skeleton
              </button>
              <div className="mt-4">
                {showSkeleton ? (
                  <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonList count={3} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full" />
                        <div>
                          <h3 className="font-semibold">Content Loaded</h3>
                          <p className="text-sm text-muted-foreground">Data is now visible</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <CodeBlock>
            {`<LoadingSpinner size="md" variant="spin" />\n<SkeletonLoader variant="rectangular" />`}
          </CodeBlock>
        </Section>

        {/* Feedback - Ripple Effect */}
        <Section title="4. Feedback - Ripple Effect">
          <div className="flex gap-4">
            <RippleDemo />
            <AnimatedButton variant="primary" enableRipple>
              Button with Ripple
            </AnimatedButton>
            <AnimatedButton variant="secondary" enableRipple={false}>
              No Ripple
            </AnimatedButton>
          </div>
          <CodeBlock>
            {`const [ripples, handlers] = useRipple();\n<button {...handlers}>Click me</button>`}
          </CodeBlock>
        </Section>

        {/* Micro-interaction - Toggle Slide */}
        <Section title="5. Micro-interaction - Toggle Slide">
          <div className="space-y-4">
            <AnimatedToggle
              label="Dark Mode"
              checked={isToggled}
              onChange={(e) => setIsToggled(e.target.checked)}
            />
            <AnimatedToggle
              label="Notifications"
              checked={!isToggled}
              onChange={(e) => setIsToggled(!e.target.checked)}
            />
            <p className="text-sm text-muted-foreground">
              Toggle state: {isToggled ? 'On' : 'Off'}
            </p>
          </div>
          <CodeBlock>
            {`<AnimatedToggle label="Feature" checked={on} onChange={setOn} />`}
          </CodeBlock>
        </Section>

        {/* Cards with Hover */}
        <Section title="6. Animated Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedCard enableHover enableEntrance>
              <h3 className="font-semibold text-lg mb-2">Card with Hover</h3>
              <p className="text-muted-foreground">
                Hover over this card to see the subtle lift animation.
              </p>
            </AnimatedCard>
            <AnimatedCard enableHover enableEntrance>
              <h3 className="font-semibold text-lg mb-2">Another Card</h3>
              <p className="text-muted-foreground">
                Entrance animation on scroll and hover effect.
              </p>
            </AnimatedCard>
          </div>
          <CodeBlock>
            {`<AnimatedCard enableHover enableEntrance>\n  Content\n</AnimatedCard>`}
          </CodeBlock>
        </Section>

        {/* Staggered List */}
        <Section title="7. Staggered List">
          <StaggeredList baseDelay={100} className="space-y-3">
            {['First Item', 'Second Item', 'Third Item', 'Fourth Item', 'Fifth Item'].map(
              (text, i) => (
                <div key={i} className="p-4 bg-card rounded-lg">
                  <h4 className="font-medium">{text}</h4>
                  <p className="text-sm text-muted-foreground">
                    Staggered by {i * 100}ms
                  </p>
                </div>
              )
            )}
          </StaggeredList>
          <CodeBlock>
            {`<StaggeredList baseDelay={100}>\n  {items.map(...)}\n</StaggeredList>`}
          </CodeBlock>
        </Section>

        {/* Scroll-triggered Animations */}
        <Section title="8. Scroll-triggered Animation">
          <ScrollTriggerDemo />
          <CodeBlock>
            {`const [ref, isInView] = useInViewAnimation();\n<div ref={ref} className={isInView ? 'animate-slide-up' : ''}>`}
          </CodeBlock>
        </Section>

        {/* Additional Utilities */}
        <Section title="9. Additional Animations">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg animate-fade-in">
              <p className="text-sm text-center">Fade In</p>
            </div>
            <div className="p-4 bg-card rounded-lg animate-scale-in">
              <p className="text-sm text-center">Scale In</p>
            </div>
            <div className="p-4 bg-card rounded-lg animate-spin">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
            <div className="p-4 bg-card rounded-lg">
              <button
                onClick={() => setIsLoading(!isLoading)}
                className={`w-full py-2 rounded ${ANIMATION_CLASSES.lift} bg-primary text-primary-foreground`}
              >
                Lift on Hover
              </button>
            </div>
          </div>
        </Section>
      </main>

      <footer className="max-w-4xl mx-auto pt-8 border-t text-center text-muted-foreground">
        <p>All animations respect prefers-reduced-motion for accessibility</p>
      </footer>
    </div>
  );
}

// Helper Components

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold border-b pb-2">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
      <code>{children}</code>
    </pre>
  );
}

function RippleDemo() {
  const [ripples, rippleHandlers] = useRipple();

  return (
    <button
      {...rippleHandlers}
      className="relative overflow-hidden px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium"
    >
      Click for Ripple
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

function ScrollTriggerDemo() {
  const [ref, isInView] = useInViewAnimation({ threshold: 0.5 });

  return (
    <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`p-6 bg-card rounded-lg shadow-lg transition-all duration-500 ${
          isInView ? 'animate-slide-up' : 'opacity-0'
        }`}
      >
        <h3 className="font-semibold text-lg mb-2">Scroll to animate</h3>
        <p className="text-muted-foreground">
          This animates when 50% is visible in viewport
        </p>
      </div>
    </div>
  );
}
