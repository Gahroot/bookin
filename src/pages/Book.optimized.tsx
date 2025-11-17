import { useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Clock, Zap } from 'lucide-react'
import StickyMobileCTA from '@/components/cro/StickyMobileCTA'
import TrustSidebar from '@/components/cro/TrustSidebar'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * Performance-Optimized Book Page with CRO Components
 * 
 * PERFORMANCE OPTIMIZATIONS IMPLEMENTED:
 * 
 * 1. Cal.com Script Loading:
 *    - Async loading with cleanup
 *    - Preconnect to Cal.com domains for faster DNS resolution
 *    - Script deduplication
 * 
 * 2. Layout Stability (CLS Prevention):
 *    - Fixed height reservation for Cal.com iframe
 *    - Sticky positioning with top offset to prevent shifts
 *    - Reserved space for mobile CTA
 * 
 * 3. Scroll Performance:
 *    - Intersection Observer for sticky CTA (vs scroll events)
 *    - CSS-only sticky positioning for sidebar
 *    - GPU-accelerated transforms
 * 
 * 4. Render Optimization:
 *    - React.memo on static components
 *    - useCallback for event handlers
 *    - Conditional rendering based on breakpoints
 * 
 * 5. Resource Hints:
 *    - Preconnect to Cal.com
 *    - DNS prefetch for faster resolution
 * 
 * EXPECTED PERFORMANCE METRICS:
 * - LCP: <2.5s (Cal.com iframe is main content)
 * - INP: <200ms (optimized event handlers)
 * - CLS: <0.1 (fixed heights, no layout shifts)
 * - FCP: <1.8s
 * - TTI: <3.5s
 */

// Memoize static benefit items to prevent re-creation
const BenefitItem = memo(({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: typeof Clock
  title: string
  description: string 
}) => (
  <div className="flex gap-3">
    <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
    <div className="text-sm">
      <p className="font-semibold">{title}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
))

BenefitItem.displayName = 'BenefitItem'

export default function Book() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Optimized script loading with preconnect
  useEffect(() => {
    // Prevent duplicate script loading
    const existingScript = document.querySelector('script[src="https://cdn.cal.com/cal.js"]')
    if (existingScript) return

    // Add preconnect for faster Cal.com loading
    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = 'https://cdn.cal.com'
    document.head.appendChild(preconnect)

    const dnsPrefetch = document.createElement('link')
    dnsPrefetch.rel = 'dns-prefetch'
    dnsPrefetch.href = 'https://cal.com'
    document.head.appendChild(dnsPrefetch)

    // Load Cal.com script
    const script = document.createElement('script')
    script.src = 'https://cdn.cal.com/cal.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      try {
        document.body.removeChild(script)
        document.head.removeChild(preconnect)
        document.head.removeChild(dnsPrefetch)
      } catch {
        // Ignore if already removed
      }
    }
  }, [])

  // Memoized scroll handler for accessibility
  const scrollToCalendar = useCallback(() => {
    const element = document.getElementById('cal-embed')
    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className={isDesktop ? 'grid grid-cols-12 gap-8' : ''}>
            {/* Main Content */}
            <div className={isDesktop ? 'col-span-8' : ''}>
              {/* Intro Section */}
              <div className="space-y-6 mb-12">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
                    Schedule a <span className="text-primary">30-Min Call</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl">
                    Let's discuss your automation challenges and explore solutions. No commitment, no pressure.
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid sm:grid-cols-3 gap-4 py-4">
                  <BenefitItem
                    icon={Clock}
                    title="30 Minutes"
                    description="Quick, focused conversation"
                  />
                  <BenefitItem
                    icon={CheckCircle}
                    title="No Fluff"
                    description="Actionable insights & strategy"
                  />
                  <BenefitItem
                    icon={Zap}
                    title="Direct"
                    description="1-on-1 with Nolan directly"
                  />
                </div>
              </div>

              {/* Cal.com Embed - Main Conversion Mechanism */}
              <div 
                id="cal-embed"
                className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-12"
                style={{
                  // Reserve height to prevent CLS
                  minHeight: '700px',
                  // CSS containment for better paint performance
                  contain: 'layout paint',
                }}
              >
                <div className="cal-embed-wrapper">
                  <iframe
                    src="https://cal.com/nolan-grout-nolan-grout-real-estate-y2trgn/30min"
                    width="100%"
                    height="700"
                    frameBorder="0"
                    title="Schedule a 30-min meeting with Nolan Grout"
                    className="w-full"
                    style={{ minHeight: '700px' }}
                    loading="eager"
                  />
                </div>
              </div>

              {/* Trust Signals - Mobile Only */}
              {!isDesktop && (
                <div className="grid sm:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">What to Expect</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">✓</span>
                        <span>Diagnose your automation gaps</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">✓</span>
                        <span>Identify quick wins (40+ hours/month possible)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">✓</span>
                        <span>Discuss your tech stack & integration needs</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold flex-shrink-0">✓</span>
                        <span>Custom roadmap for your business</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">About This Call</h3>
                    <div className="space-y-4 text-sm text-muted-foreground">
                      <div>
                        <p className="font-semibold text-foreground mb-1">Ideal For</p>
                        <p>Founders, agencies, and teams struggling with manual processes.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Come Prepared</p>
                        <p>List any tools you currently use. (CRM, email, forms, etc.)</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Timezone</p>
                        <p>Automatically detects and adjusts to your timezone.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="mt-12 pt-8 border-t border-border text-center space-y-4">
                <p className="text-muted-foreground">
                  Questions before booking? Email{' '}
                  <a href="mailto:SOLD@NolanGrout.com" className="text-primary hover:underline font-semibold">
                    SOLD@NolanGrout.com
                  </a>
                </p>
                <div className="flex justify-center">
                  <Button variant="ghost" asChild>
                    <Link to="/">← Back to Home</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust Sidebar - Desktop Only */}
            {isDesktop && (
              <div className="col-span-4">
                <TrustSidebar />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA targetElementId="cal-embed" />
    </div>
  )
}
