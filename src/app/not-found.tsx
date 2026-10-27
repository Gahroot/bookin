import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="rail max-w-xl">
      <div className="surface-card rounded-[var(--radius-card)] p-10 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-3xl font-semibold">This page isn’t here</h1>
        <p className="mt-3 text-ink-muted">It may have moved when the site was rebuilt.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/writing" className="btn btn-quiet">
            Writing
          </Link>
          <Link href="/work" className="btn btn-quiet">
            Work
          </Link>
        </div>
      </div>
    </div>
  )
}
