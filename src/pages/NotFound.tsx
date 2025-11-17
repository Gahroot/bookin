import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-muted-foreground">
              404
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
              Page not found
            </h2>
            <p className="text-xl text-muted-foreground">
              Looks like this page doesn't exist. Let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/">← Go Home</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/book">Book a Call</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
