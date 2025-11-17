import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Bookin</h2>
            <Button asChild>
              <Link to="/book" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Book a Call
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="space-y-8 text-center max-w-3xl w-full">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter">
              Welcome to Bookin
            </h1>
            <p className="text-xl text-muted-foreground">
              A modern React application with Vite, Tailwind CSS, shadcn/ui, React Router, and Cal.com scheduling
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">⚡ Fast</h3>
              <p className="text-sm text-muted-foreground">Powered by Vite for instant HMR</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">🎨 Beautiful</h3>
              <p className="text-sm text-muted-foreground">Styled with Tailwind CSS & shadcn/ui</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">📅 Bookable</h3>
              <p className="text-sm text-muted-foreground">Cal.com scheduling integrated</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Button size="lg" asChild>
              <Link to="/book" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule a Meeting
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://shadcn-ui.com" target="_blank" rel="noopener noreferrer">
                shadcn/ui Docs
              </a>
            </Button>
          </div>

          {/* Info Text */}
          <div className="pt-8 space-y-4 text-sm text-muted-foreground">
            <p>
              Start building by editing <code className="bg-muted px-2 py-1 rounded">src/pages/Home.tsx</code>
            </p>
            <p>
              Visit the <Link to="/book" className="text-primary hover:underline">booking page</Link> to see Cal.com integration in action
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Built with Vite, React, Tailwind CSS, shadcn/ui, and Cal.com</p>
        </div>
      </footer>
    </div>
  )
}
