import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MicroTrustBadges from '@/components/MicroTrustBadges'
import TrustSidebar from '@/components/cro/TrustSidebar'
import StickyMobileCTA from '@/components/cro/StickyMobileCTA'
import QualificationForm, { type QualificationData } from '@/components/QualificationForm'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { CheckCircle, Clock, Zap, User, Building2, Calendar } from 'lucide-react'

export default function Book() {
  const calendarRef = useRef<HTMLDivElement>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [qualificationData, setQualificationData] = useState<QualificationData | null>(null)

  // Responsive height logic for Cal.com embed
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1023px)')
  const embedHeight = isMobile ? 450 : isTablet ? 550 : 600

  // Send lead data to CRM webhook
  const sendToCRM = async (data: QualificationData) => {
    const apiKey = import.meta.env.VITE_CRM_API_KEY
    const webhookUrl = 'https://voice-noob-production.up.railway.app/api/v1/webhooks/leads/website'

    // Build notes from qualification data
    const notes = [
      `Business Type: ${data.businessType}`,
      `Revenue: ${data.revenue}`,
      `Project Type: ${data.projectType}`,
      `Timeline: ${data.timeline}`,
      `Budget: ${data.budget}`,
      data.companyName ? `Company: ${data.companyName}` : '',
      data.projectDetails ? `Project Details: ${data.projectDetails}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    try {
      const response = await fetch(`${webhookUrl}?api_key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phone,
          notes: notes,
          source: 'website-qualification-form',
        }),
      })

      if (!response.ok) {
        console.error('CRM webhook failed:', response.status)
      } else {
        console.log('Lead sent to CRM successfully')
      }
    } catch (error) {
      console.error('CRM webhook error:', error)
    }
  }

  const handleQualificationComplete = (data: QualificationData) => {
    setQualificationData(data)
    setShowCalendar(true)

    // Send to CRM in background (non-blocking)
    sendToCRM(data)

    // Scroll to calendar
    setTimeout(() => {
      calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  useEffect(() => {
    if (!showCalendar) return

    // Load Cal.com script when calendar is shown
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
  }, [showCalendar])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!showCalendar ? (
              <motion.div
                key="qualification"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Hero Section */}
                <div className="space-y-4 mb-12 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    Book a 30-Minute Strategy Call
                  </motion.div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
                    Let's See If We're a <span className="text-primary">Good Fit</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Answer a few quick questions so we can prepare for a productive conversation.
                  </p>
                </div>

                {/* Qualification Form */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-10">
                  <QualificationForm onComplete={handleQualificationComplete} />
                </div>

                {/* Trust signals below form */}
                <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-medium">30 Minutes</p>
                    <p className="text-sm text-muted-foreground">Quick, focused conversation</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-medium">No Fluff</p>
                    <p className="text-sm text-muted-foreground">Actionable insights & strategy</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-medium">Direct Access</p>
                    <p className="text-sm text-muted-foreground">1-on-1 with Nolan directly</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Qualified Lead Header */}
                <div className="space-y-4 mb-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    You're qualified! Pick a time below
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
                    Schedule Your <span className="text-primary">30-Min Call</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                    Thanks, {qualificationData?.firstName}! Select a time that works for you.
                  </p>
                </div>

                {/* User Summary Card */}
                {qualificationData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {qualificationData.firstName} {qualificationData.lastName}
                        </span>
                      </div>
                      {qualificationData.companyName && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span>{qualificationData.companyName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {qualificationData.projectType.replace('-', ' ')}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Full-Width Calendar Section */}
                <div className="space-y-12">
                  {/* Cal.com Embed */}
                  <div
                    ref={calendarRef}
                    id="cal-embed"
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

                  {/* Micro Trust Badges */}
                  <MicroTrustBadges />

                  {/* Trust Signals Below Calendar */}
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold">What to Expect</h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="text-primary font-bold flex-shrink-0">1</span>
                          <span>Diagnose your automation gaps</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary font-bold flex-shrink-0">2</span>
                          <span>Identify quick wins (40+ hours/month possible)</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary font-bold flex-shrink-0">3</span>
                          <span>Discuss your tech stack & integration needs</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary font-bold flex-shrink-0">4</span>
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

                  {/* Benefits Grid */}
                  <div className="space-y-6 pt-6 border-t border-border">
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

                  {/* Trust Sidebar - Full Width Below */}
                  <TrustSidebar />
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 pt-8 border-t border-border text-center space-y-4">
                  <p className="text-muted-foreground">
                    Questions before booking? Email{' '}
                    <a
                      href="mailto:SOLD@NolanGrout.com"
                      className="text-primary hover:underline font-semibold"
                    >
                      SOLD@NolanGrout.com
                    </a>
                  </p>
                  <div className="flex justify-center">
                    <Button variant="ghost" asChild>
                      <Link to="/">Back to Home</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      {/* Sticky Mobile CTA - Shows after scroll on mobile (only when calendar is visible) */}
      {showCalendar && <StickyMobileCTA targetElementId="cal-embed" />}
    </div>
  )
}
