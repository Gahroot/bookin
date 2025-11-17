import { useEffect } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export default function Book() {
  useEffect(() => {
    // Load Cal.com script when component mounts
    const script = document.createElement('script')
    script.src = 'https://cdn.cal.com/cal.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup if needed
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
              Bookin
            </Link>
            <Button variant="ghost" asChild>
              <Link to="/">Back Home</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
              Schedule a Consultation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book a 30-minute meeting with our team. Select a time that works best for you.
            </p>
          </div>

          {/* Cal.com Embed Container */}
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="cal-embed-wrapper">
              <iframe
                src="https://cal.com/nolan-grout-nolan-grout-real-estate-y2trgn/30min"
                width="100%"
                height="700"
                frameBorder="0"
                title="Schedule a meeting with us"
                className="w-full"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wide">Duration</h3>
              <p className="text-muted-foreground">30 minutes</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wide">Timezone</h3>
              <p className="text-muted-foreground">Your local time</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wide">Confirmation</h3>
              <p className="text-muted-foreground">Instant email confirmation</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="bg-muted/50 rounded-lg border border-border p-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Have questions? Reach out to us directly or schedule a call above.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="outline" asChild>
                <a href="mailto:contact@bookin.app">Send Email</a>
              </Button>
              <Button asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
