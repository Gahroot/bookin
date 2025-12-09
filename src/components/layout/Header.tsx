import { Link } from 'react-router'

export default function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          <span className="text-primary">Nolan</span> Grout
        </Link>
      </div>
    </header>
  )
}
