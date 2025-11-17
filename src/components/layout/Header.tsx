import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Nolan</span> Grout
          </Link>
          <Button asChild>
            <Link to="/book" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Book a Call
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
