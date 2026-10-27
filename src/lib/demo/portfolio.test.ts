import { describe, expect, it } from 'vitest'
import { generatePortfolio, rankRisk } from './portfolio'

describe('synthetic portfolio', () => {
  it('is deterministic and clearly fictional', () => {
    const a = generatePortfolio()
    expect(a).toHaveLength(40)
    expect(generatePortfolio()).toEqual(a)
    expect(a.every((x) => x.name.endsWith('(fictional)'))).toBe(true)
  })

  it('ranks the top 20 by descending score with reasons', () => {
    const r = rankRisk(generatePortfolio())
    expect(r).toHaveLength(20)
    expect(r[0]?.rank).toBe(1)
    for (let i = 1; i < r.length; i++) {
      expect((r[i - 1]?.score ?? 0) >= (r[i]?.score ?? 0)).toBe(true)
    }
    expect(
      r.every(
        (x) =>
          x.reason.length > 0 && x.asset.manager.length > 0 && x.asset.projectManager.length > 0
      )
    ).toBe(true)
  })
})
