import { BookLink, PrestyjLink } from './links'

export function CtaBand({
  kind = 'book',
  source,
  title,
  body,
}: {
  kind?: 'book' | 'prestyj'
  source: string
  title?: string
  body?: string
}) {
  const isBook = kind === 'book'
  return (
    <section
      data-cta-view={source}
      aria-labelledby={`cta-${source}`}
      className="glass rounded-[var(--radius-card)] px-6 py-10 text-center sm:px-12 sm:py-14"
    >
      <h2 id={`cta-${source}`} className="text-2xl font-semibold sm:text-3xl">
        {title ??
          (isBook
            ? 'Have a system in mind? Let’s scope it.'
            : 'Want AI voice agents answering your phones?')}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-ink-muted">
        {body ??
          (isBook
            ? 'A focused 30-minute call with Nolan. You leave with a clear view of what to build first and what it will take.'
            : 'Prestyj runs voice agents that answer, qualify and book for you, around the clock.')}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {isBook ? (
          <>
            <BookLink source={source} />
            <PrestyjLink campaign={source} />
          </>
        ) : (
          <>
            <PrestyjLink campaign={source} className="btn btn-primary">
              Visit Prestyj
            </PrestyjLink>
            <BookLink source={source} className="btn btn-quiet">
              Or book a call
            </BookLink>
          </>
        )}
      </div>
    </section>
  )
}
