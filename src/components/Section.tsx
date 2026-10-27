import type { ReactNode } from 'react'

export function Section({
  id,
  eyebrow,
  title,
  intro,
  action,
  children,
}: {
  id: string
  eyebrow?: string
  title: string
  intro?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="rail mt-24 sm:mt-32">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={id} className="mt-2 text-3xl font-semibold sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-3 text-lg text-ink-muted">{intro}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string
  children?: ReactNode
}) {
  return (
    <header className="rail max-w-3xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 text-4xl font-semibold leading-[1.08] sm:text-5xl">{title}</h1>
      {intro && <p className="mt-5 text-lg text-ink-muted sm:text-xl">{intro}</p>}
      {children}
    </header>
  )
}
