import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MicroTrustBadges from '@/components/MicroTrustBadges'
import TrustSidebar from '@/components/cro/TrustSidebar'
import StickyMobileCTA from '@/components/cro/StickyMobileCTA'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { CheckCircle, Clock, Zap } from 'lucide-react'

export default function Book() {
  const calendarRef = useRef<HTMLDivElement>(null)

  // Responsive height logic for Cal.com embed
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1023px)')
  const embedHeight = isMobile ? 450 : isTablet ? 550 : 600

  useEffect(() => {
    // Load Cal.com script when component mounts
    const script = document.createElement('script')
    script.src = 'https://cdn.cal.com/cal.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      try {
        document.body.removeChild(script)
      } catch {
        // Ignore if script already removed
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section - Compressed to headline only */}
          <div className="space-y-4 mb-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
              Schedule a <span className="text-primary">30-Min Call</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Let's discuss your automation challenges and explore solutions. No commitment, no pressure.
            </p>
          </div>

          {/* Micro Trust Badges */}
          <MicroTrustBadges />

          {/* Main Layout: 2-column on desktop, single column on mobile/tablet */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 mt-8">
            {/* Left Column: Calendar Embed + Mobile Trust Signals */}
            <div className="space-y-8">
              {/* Cal.com Embed - Main Conversion Mechanism */}
              <div
                ref={calendarRef}
                className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
              >
                <div className="cal-embed-wrapper aspect-video sm:aspect-auto">
                  <iframe
                    src="https://cal.com/nolan-grout-nolan-grout-real-estate-y2trgn/30min"
                    width="100%"
                    height={embedHeight}
                    frameBorder="0"
                    title="Schedule a 30-min meeting with Nolan Grout"
                    className="w-full"
                    style={{ minHeight: `${embedHeight}px` }}
                  />
                </div>
              </div>

              {/* Trust Signals - Mobile/Tablet Only */}
              <div className="lg:hidden grid sm:grid-cols-2 gap-8">
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

              {/* Benefits Grid - Mobile/Tablet Reinforcement */}
              <div className="lg:hidden space-y-6 pt-6 border-t border-border">
                <h3 className="text-lg font-bold">Why Book Now?</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">30 Minutes</p>
                      <p className="text-muted-foreground">Quick, focused conversation</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">No Fluff</p>
                      <p className="text-muted-foreground">Actionable insights & strategy</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">Direct</p>
                      <p className="text-muted-foreground">1-on-1 with Nolan directly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Trust Sidebar - Desktop Only */}
            <TrustSidebar />
          </div>

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
      </main>

      <Footer />

      {/* Sticky Mobile CTA - Shows after 300px scroll on mobile */}
      <StickyMobileCTA targetElementId="cal-embed" />
    </div>
  )
}
