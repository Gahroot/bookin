import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="space-y-8 text-center max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tighter text-destructive">404</h1>
          <p className="text-2xl font-semibold">Page Not Found</p>
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <Button size="lg" asChild>
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  )
}
