import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Zap, Clock, TrendingUp, Bot, Settings, Link2, Monitor, Smartphone, Film, MessageCircle, CheckCircle, User, Building2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import QualificationForm, { type QualificationData } from '@/components/QualificationForm'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false)
  const [qualificationData, setQualificationData] = useState<QualificationData | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Responsive height logic for Cal.com embed
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1023px)')
  const embedHeight = isMobile ? 450 : isTablet ? 550 : 600

  // Send lead data to CRM webhook
  const sendToCRM = async (data: QualificationData) => {
    const apiKey = import.meta.env.VITE_CRM_API_KEY
    const webhookUrl = 'https://voice-noob-production.up.railway.app/webhooks/leads/website'

    console.log('=== CRM WEBHOOK DEBUG ===')
    console.log('API Key exists:', !!apiKey)
    console.log('API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING')

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

    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phone,
      notes: notes,
      source: 'website-qualification-form',
    }

    console.log('Payload:', payload)
    console.log('Full URL:', `${webhookUrl}?api_key=${apiKey}`)

    try {
      const response = await fetch(`${webhookUrl}?api_key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)
      const responseText = await response.text()
      console.log('Response body:', responseText)

      if (!response.ok) {
        console.error('CRM webhook failed:', response.status, responseText)
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
    sendToCRM(data)
    setTimeout(() => {
      calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  useEffect(() => {
    if (!showCalendar) return
    const script = document.createElement('script')
    script.src = 'https://cdn.cal.com/cal.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      try { document.body.removeChild(script) } catch { /* ignore */ }
    }
  }, [showCalendar])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section with Qualification Form */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
                {/* Hero Header */}
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                  >
                    <Calendar className="w-4 h-4" />
                    Book a 30-Minute Strategy Call
                  </motion.div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-4">
                    Automate Your <span className="text-primary">Busywork</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Turn 40+ hours of manual work into automated systems. Answer a few questions to see if we're a good fit.
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">$10M+</span>
                      <span className="text-muted-foreground">leads generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">90%</span>
                      <span className="text-muted-foreground">manual work eliminated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">40+</span>
                      <span className="text-muted-foreground">hours saved/month</span>
                    </div>
                  </div>
                </div>

                {/* Qualification Form */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-10">
                  <QualificationForm onComplete={handleQualificationComplete} />
                </div>

                {/* Trust signals */}
                <div className="mt-10 grid sm:grid-cols-3 gap-6 text-center">
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

                {/* Email fallback */}
                <p className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Prefer email?{' '}
                  <a href="mailto:SOLD@NolanGrout.com" className="text-primary hover:underline font-medium">
                    SOLD@NolanGrout.com
                  </a>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Qualified Lead Header */}
                <div className="space-y-4 mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    You're qualified! Pick a time below
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
                    Schedule Your <span className="text-primary">30-Min Call</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Thanks, {qualificationData?.firstName}! Select a time that works for you.
                  </p>
                </div>

                {/* User Summary Card */}
                {qualificationData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 p-4 rounded-xl bg-muted/50 border border-border max-w-2xl mx-auto"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{qualificationData.firstName} {qualificationData.lastName}</span>
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

                {/* Cal.com Embed */}
                <div
                  ref={calendarRef}
                  className="bg-card rounded-xl border border-border shadow-sm overflow-hidden max-w-4xl mx-auto"
                >
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

                {/* Benefits */}
                <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center max-w-3xl mx-auto">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <p className="font-medium">30 Minutes</p>
                    <p className="text-sm text-muted-foreground">Quick, focused</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <p className="font-medium">No Fluff</p>
                    <p className="text-sm text-muted-foreground">Actionable insights</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <p className="font-medium">Direct</p>
                    <p className="text-sm text-muted-foreground">1-on-1 with Nolan</p>
                  </div>
                </div>

                {/* Email fallback */}
                <p className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Questions?{' '}
                  <a href="mailto:SOLD@NolanGrout.com" className="text-primary hover:underline font-medium">
                    SOLD@NolanGrout.com
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* What I Solve - Only show before qualification */}
      {!showCalendar && (
        <>
          <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/40">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
                  What I Solve
                </h2>
                <p className="text-xl text-muted-foreground">
                  Problems you didn't know you could fix
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 mb-4">
                    <Clock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Manual Busywork</h3>
                      <p className="text-muted-foreground">
                        Hours wasted copying data between platforms, updating spreadsheets, sending repetitive messages.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold">→ Automated workflows that run 24/7</p>
                </div>

                <div className="p-8 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 mb-4">
                    <Zap className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Disconnected Systems</h3>
                      <p className="text-muted-foreground">
                        Fragmented tools that don't talk to each other. Data silos. Constant manual syncing.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold">→ Seamlessly integrated tech stack</p>
                </div>

                <div className="p-8 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 mb-4">
                    <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Scaling Headaches</h3>
                      <p className="text-muted-foreground">
                        Growth blocked because operations don't scale. Need to hire but can't afford to yet.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold">→ Systems that grow with you</p>
                </div>

                <div className="p-8 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 mb-4">
                    <Calendar className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Missing Opportunities</h3>
                      <p className="text-muted-foreground">
                        Leads not followed up. Opportunities slipping through the cracks. Messy data.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold">→ Intelligent lead management</p>
                </div>
              </div>
            </div>
          </section>

          {/* What I Build */}
          <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
                  What I Build
                </h2>
                <p className="text-xl text-muted-foreground">
                  Full-stack solutions across any tech stack
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Bot className="w-6 h-6 text-primary" />
                    AI Agents
                  </h3>
                  <p className="text-muted-foreground">
                    Autonomous agents using Claude Agent SDK. Multi-platform access, RAG-powered knowledge, voice/text/image processing.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="w-6 h-6 text-primary" />
                    Automations
                  </h3>
                  <p className="text-muted-foreground">
                    Workflow automation with n8n, webhooks, and custom code. Eliminate manual work at scale. 40+ hours saved/month.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Link2 className="w-6 h-6 text-primary" />
                    Integrations
                  </h3>
                  <p className="text-muted-foreground">
                    Connect any platform. GoHighLevel, Follow Up Boss, KvCore, Stripe, Zapier. Real-time data sync across ecosystems.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Monitor className="w-6 h-6 text-primary" />
                    Full-Stack Apps
                  </h3>
                  <p className="text-muted-foreground">
                    React frontends. Node.js/TypeScript backends. Databases, APIs, auth, payments. SaaS-ready infrastructure.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-primary" />
                    Lead Systems
                  </h3>
                  <p className="text-muted-foreground">
                    End-to-end lead capture, qualification, and nurturing. Generated 150+ leads/month. $10M+ in revenue attributed.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Film className="w-6 h-6 text-primary" />
                    Content
                  </h3>
                  <p className="text-muted-foreground">
                    Video production, copywriting, graphic design. Built YouTube channels to 10k+ subscribers. Full creative pipeline.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/40">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
                  Real Results
                </h2>
                <p className="text-xl text-muted-foreground">
                  From real projects
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-lg border border-border bg-card">
                  <div className="space-y-4">
                    <p className="text-5xl font-black text-primary">40+</p>
                    <h3 className="text-2xl font-bold">Hours Saved Monthly</h3>
                    <p className="text-muted-foreground">
                      Automated data entry, spreadsheet management, and manual synchronization across multiple platforms.
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-lg border border-border bg-card">
                  <div className="space-y-4">
                    <p className="text-5xl font-black text-primary">90%</p>
                    <h3 className="text-2xl font-bold">Manual Work Eliminated</h3>
                    <p className="text-muted-foreground">
                      AI-powered workflows and intelligent automation replaced repetitive tasks completely.
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-lg border border-border bg-card">
                  <div className="space-y-4">
                    <p className="text-5xl font-black text-primary">$10M+</p>
                    <h3 className="text-2xl font-bold">In Leads Generated</h3>
                    <p className="text-muted-foreground">
                      Automated funnel systems with conversion rates improved from 1% to 5% through optimization.
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-lg border border-border bg-card">
                  <div className="space-y-4">
                    <p className="text-5xl font-black text-primary">8+</p>
                    <h3 className="text-2xl font-bold">Platforms Integrated</h3>
                    <p className="text-muted-foreground">
                      Webhook architecture connecting disparate systems with real-time data transformation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}
