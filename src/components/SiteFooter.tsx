import Link from 'next/link'
import { OWNER_EMAIL } from '@/lib/site'
import { PrestyjLink } from './links'

export function SiteFooter() {
  return (
    <footer className="mt-24 pb-10">
      <div className="rail glass rounded-[var(--radius-card)] px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-semibold">Nolan Grout</p>
            <p className="mt-2 text-sm text-ink-muted">
              AI business systems and AI agents for enterprise teams.
            </p>
            <p className="mt-3 text-sm">
              <a href={`mailto:${OWNER_EMAIL}`} className="text-action">
                {OWNER_EMAIL}
              </a>
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <Link href="/work" className="text-ink-muted hover:text-ink">
              Work
            </Link>
            <Link href="/writing" className="text-ink-muted hover:text-ink">
              Writing
            </Link>
            <Link href="/demos/portfolio-risk" className="text-ink-muted hover:text-ink">
              Portfolio risk demo
            </Link>
            <Link href="/about" className="text-ink-muted hover:text-ink">
              About
            </Link>
            <Link href="/book" className="text-ink-muted hover:text-ink">
              Book a call
            </Link>
            <Link href="/privacy" className="text-ink-muted hover:text-ink">
              Privacy
            </Link>
            <a href="/feed.xml" className="text-ink-muted hover:text-ink">
              RSS
            </a>
            <a href="/llms.txt" className="text-ink-muted hover:text-ink">
              llms.txt
            </a>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getUTCFullYear()} Nolan Grout</p>
          <PrestyjLink
            campaign="footer"
            className="text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Prestyj: AI voice agents
          </PrestyjLink>
        </div>
      </div>
    </footer>
  )
}
