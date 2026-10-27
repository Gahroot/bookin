'use client'

import { useId, useState, type ReactNode } from 'react'

/**
 * Filters server-rendered children without re-rendering them: each item carries
 * data-item and data-tags="a b"; the active tag hides the rest through an injected rule.
 */
export function TagFilter({
  label,
  options,
  children,
}: {
  label: string
  options: { value: string; label: string }[]
  children: ReactNode
}) {
  const [active, setActive] = useState('all')
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const safe = options.find((o) => o.value === active)?.value
  return (
    <div>
      {options.length > 1 && (
        <div role="group" aria-label={label} className="mb-6 flex flex-wrap gap-2">
          {[{ value: 'all', label: 'All' }, ...options].map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={active === o.value}
              onClick={() => {
                setActive(o.value)
              }}
              className={
                active === o.value
                  ? 'btn btn-primary min-h-10 px-4 text-sm'
                  : 'btn btn-quiet min-h-10 px-4 text-sm'
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
      {safe && <style>{`#f${id} [data-item]:not([data-tags~="${safe}"]){display:none}`}</style>}
      <div id={`f${id}`} aria-live="polite">
        {children}
      </div>
    </div>
  )
}
