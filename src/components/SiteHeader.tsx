import Image from 'next/image'
import Link from 'next/link'
import { BookLink } from './links'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/demos/portfolio-risk', label: 'Demo' },
  { href: '/about', label: 'About' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 pt-3">
      <div className="rail glass flex h-16 items-center gap-3 rounded-full pr-2 pl-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-full font-semibold tracking-tight text-ink no-underline"
        >
          <Image src="/ng.png" alt="" width={32} height={32} className="rounded-full" priority />
          <span className="whitespace-nowrap max-[420px]:sr-only">Nolan Grout</span>
        </Link>
        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted no-underline hover:bg-[var(--glass-hover)] hover:text-ink"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <ThemeToggle />
          <BookLink source="header" className="btn btn-primary hidden sm:inline-flex" />
          <details className="relative md:hidden">
            <summary
              className="glass-control inline-flex size-11 items-center justify-center rounded-full"
              aria-label="Menu"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <nav
              aria-label="Mobile"
              className="glass-strong absolute right-0 mt-3 w-56 rounded-[var(--radius-region)] p-2"
            >
              <ul>
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="block rounded-[var(--radius-control)] px-3 py-3 font-medium text-ink no-underline hover:bg-[var(--glass-hover)]"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-1">
                  <BookLink source="mobile-menu" className="btn btn-primary w-full" />
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
