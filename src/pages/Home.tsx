import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Calendar, Zap, Clock, TrendingUp, Mail, Bot, Settings, Link2, Monitor, Smartphone, Film, MessageCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-background via-background to-muted/30 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter">
                Automate Your
                <br />
                <span className="text-primary">Busywork</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl">
                Turn 40+ hours of manual work into automated systems. AI-powered workflows that scale with you.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-8 pt-12">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold text-primary">$10M+</p>
                <p className="text-sm text-muted-foreground">in leads generated</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold text-primary">90%</p>
                <p className="text-sm text-muted-foreground">manual work eliminated</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold text-primary">40+</p>
                <p className="text-sm text-muted-foreground">hours saved/month</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="text-lg">
                <Link to="/book" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book a 30-Min Call
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:SOLD@NolanGrout.com" className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Me
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
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
            {/* Problem 1 */}
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

            {/* Problem 2 */}
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

            {/* Problem 3 */}
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

            {/* Problem 4 */}
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

      {/* Capabilities */}
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

      {/* Results Section */}
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

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter">
              Ready to automate?
            </h2>
            <p className="text-xl text-muted-foreground">
              Schedule a 30-minute consultation. No fluff, just solutions.
            </p>
          </div>

          <Button size="lg" asChild className="text-lg inline-flex">
            <Link to="/book" className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book a Call Now
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Or email{' '}
            <a href="mailto:SOLD@NolanGrout.com" className="text-primary hover:underline">
              SOLD@NolanGrout.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
