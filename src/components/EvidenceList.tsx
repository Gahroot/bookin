import { formatDate, type Claim, type Evidence } from '@/lib/content'

export function EvidenceItem({ e }: { e: Evidence }) {
  return (
    <li
      id={`evidence-${e.id}`}
      className="scroll-mt-28 rounded-[var(--radius-panel)] bg-surface-muted px-4 py-3"
    >
      <span className="mr-2 text-xs font-semibold text-action">{e.id}</span>
      {e.public && e.url ? (
        <a
          href={e.url}
          rel="noopener"
          target="_blank"
          className="font-medium text-ink underline underline-offset-4"
        >
          {e.title}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <span className="font-medium">{e.title}</span>
      )}
      <span className="block text-sm text-ink-muted">
        {e.public ? (
          <>Public evidence{e.date ? `, ${formatDate(e.date)}` : ''}</>
        ) : (
          <>Private build record, verified {e.date ? formatDate(e.date) : 'by the author'}</>
        )}
      </span>
    </li>
  )
}

/** Claims with their cited evidence, then the full evidence register. */
export function EvidenceSection({
  claims,
  evidence,
  headingId = 'evidence',
}: {
  claims: { text: string; evidence: string[]; kind?: Claim['kind'] }[]
  evidence: Evidence[]
  headingId?: string
}) {
  if (claims.length === 0 && evidence.length === 0) return null
  return (
    <section
      aria-labelledby={headingId}
      className="surface-card mt-14 rounded-[var(--radius-card)] p-6 sm:p-8"
    >
      <h2 id={headingId} className="text-2xl font-semibold">
        Evidence
      </h2>
      <p className="mt-2 text-ink-muted">
        Every outcome and capability claimed here is tied to a record. Public records link out;
        private build records were verified on the date shown and are not published.
      </p>
      {claims.length > 0 && (
        <ul className="mt-6 space-y-4">
          {claims.map((c) => (
            <li key={c.text} className="border-l-2 border-action pl-4">
              <p>{c.text}</p>
              <p className="mt-1 text-sm text-ink-muted">
                Evidence:{' '}
                {c.evidence.map((id, i) => (
                  <span key={id}>
                    {i > 0 && ', '}
                    <a
                      href={`#evidence-${id}`}
                      className="text-action underline underline-offset-2"
                    >
                      {id}
                    </a>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      )}
      {evidence.length > 0 && (
        <ol className="mt-6 space-y-2" aria-label="Evidence records">
          {evidence.map((e) => (
            <EvidenceItem key={e.id} e={e} />
          ))}
        </ol>
      )}
    </section>
  )
}
