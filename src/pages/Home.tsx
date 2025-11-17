import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="space-y-8 text-center max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter">Welcome to Bookin</h1>
          <p className="text-xl text-muted-foreground">
            A modern React application with Vite, Tailwind CSS, shadcn/ui, and React Router
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-semibold mb-2">⚡ Fast</h3>
            <p className="text-sm text-muted-foreground">Powered by Vite for instant HMR</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-semibold mb-2">🎨 Beautiful</h3>
            <p className="text-sm text-muted-foreground">Styled with Tailwind CSS & shadcn/ui</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-semibold mb-2">🧭 Routable</h3>
            <p className="text-sm text-muted-foreground">Navigation with React Router v7</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://shadcn-ui.com" target="_blank" rel="noopener noreferrer">
              shadcn/ui Docs
            </a>
          </Button>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          <p>Start building by editing <code className="bg-muted px-2 py-1 rounded">src/pages/Home.tsx</code></p>
        </div>
      </div>
    </div>
  )
}
