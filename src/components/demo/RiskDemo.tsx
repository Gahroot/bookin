'use client'

import { useMemo, useState } from 'react'
import { track } from '@/lib/analytics/track'
import { DRIVER_LABEL, generatePortfolio, rankRisk } from '@/lib/demo/portfolio'

export const PROMPT =
  'Tell me the top 20 assets I should be worried about, why, and who manages them.'

export function RiskDemo() {
  const [ran, setRan] = useState(false)
  const ranked = useMemo(() => rankRisk(generatePortfolio()), [])

  return (
    <div>
      <div className="surface-card rounded-[var(--radius-card)] p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink-muted">
            ChatGPT · connected to portfolio MCP (read-only)
          </p>
          <span className="rounded-full border border-attention bg-surface px-2.5 py-1 text-xs font-semibold text-ink">
            Synthetic data
          </span>
        </div>
        <div className="mt-5 flex justify-end">
          <p className="glass max-w-xl rounded-[var(--radius-region)] rounded-br-md px-4 py-3">
            {PROMPT}
          </p>
        </div>
        {!ran && (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setRan(true)
                track('demo_run', { source: 'portfolio-risk' })
              }}
            >
              Rank my top 20 riskiest assets
            </button>
          </div>
        )}
        <div aria-live="polite">
          {ran && (
            <div className="mt-6">
              <p className="text-ink-muted">
                Called <code className="font-mono text-sm">rank_portfolio_risk</code> over 40
                synthetic assets. Score = weighted debt maturity, occupancy trend, budget variance,
                delinquency and open work orders. Here are the 20 to look at first:
              </p>
              <table className="mt-5 w-full text-left text-sm max-md:block">
                <caption className="sr-only">Top 20 riskiest synthetic assets</caption>
                <thead className="max-md:hidden">
                  <tr className="border-b border-line text-ink-muted">
                    <th scope="col" className="py-2 pr-3 font-medium">
                      #
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Asset
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Risk
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Top drivers
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Why
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Asset manager
                    </th>
                    <th scope="col" className="py-2 font-medium">
                      Project manager
                    </th>
                  </tr>
                </thead>
                <tbody className="max-md:block max-md:space-y-3">
                  {ranked.map((r) => (
                    <tr
                      key={r.asset.id}
                      className="border-b border-line align-top max-md:grid max-md:grid-cols-2 max-md:gap-x-3 max-md:gap-y-1 max-md:rounded-[var(--radius-panel)] max-md:border max-md:bg-surface-muted max-md:p-4"
                    >
                      <td className="py-3 pr-3 font-semibold text-action max-md:py-0">{r.rank}</td>
                      <th
                        scope="row"
                        className="py-3 pr-3 font-semibold max-md:col-span-2 max-md:row-start-2 max-md:py-0"
                      >
                        {r.asset.name}
                        <span className="block text-xs font-normal text-ink-muted">
                          {r.asset.type} · {r.asset.market}
                        </span>
                      </th>
                      <td className="py-3 pr-3 tabular-nums max-md:row-start-1 max-md:py-0 max-md:text-right">
                        <span className="md:hidden text-ink-muted">Risk </span>
                        <strong>{r.score}</strong>
                      </td>
                      <td className="py-3 pr-3 max-md:col-span-2 max-md:py-0">
                        {r.drivers
                          .slice(0, 2)
                          .map((d) => DRIVER_LABEL[d.driver])
                          .join(', ')}
                      </td>
                      <td className="py-3 pr-3 text-ink-muted max-md:col-span-2 max-md:py-0">
                        {r.reason}
                      </td>
                      <td className="py-3 pr-3 max-md:py-0">
                        <span className="md:hidden text-xs text-ink-muted block">
                          Asset manager
                        </span>
                        {r.asset.manager}
                      </td>
                      <td className="py-3 max-md:py-0">
                        <span className="md:hidden text-xs text-ink-muted block">
                          Project manager
                        </span>
                        {r.asset.projectManager}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
