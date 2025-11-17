import { Link } from 'react-router'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="tel:248-225-9677" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                248-225-9677
              </a>
              <a href="mailto:SOLD@NolanGrout.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                SOLD@NolanGrout.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Auburn Hills, MI
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/book" className="block hover:text-primary transition-colors">
                Book a Call
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Specialties</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>AI Agent Development</p>
              <p>Workflow Automation</p>
              <p>Systems Integration</p>
              <p>Full-Stack Development</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>AI Automation Engineer | Full-Stack Developer | Systems Integration Specialist</p>
          <p className="mt-2">Built with React, Vite, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
