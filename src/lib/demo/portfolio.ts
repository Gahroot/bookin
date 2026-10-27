/**
 * Synthetic real-estate portfolio for the /demos/portfolio-risk demo. Every name, person and
 * number here is invented and generated from a fixed seed, so output is identical on every run.
 */

export interface Asset {
  id: string
  name: string
  market: string
  type: 'Multifamily' | 'Industrial' | 'Office' | 'Retail'
  units: number
  manager: string
  projectManager: string
  /** Months until the senior loan matures. */
  debtMaturityMonths: number
  /** Occupancy change over the last six months, percentage points. */
  occupancyTrend: number
  occupancy: number
  /** Year-to-date opex versus budget, percent (positive = over budget). */
  budgetVariance: number
  /** Share of billed rent more than 30 days delinquent, percent. */
  delinquency: number
  openWorkOrders: number
}

export type Driver = 'debt' | 'occupancy' | 'budget' | 'delinquency' | 'workOrders'

export const DRIVER_LABEL: Record<Driver, string> = {
  debt: 'Debt maturity',
  occupancy: 'Occupancy trend',
  budget: 'Budget variance',
  delinquency: 'Delinquency',
  workOrders: 'Open work orders',
}

const WEIGHTS: Record<Driver, number> = {
  debt: 0.28,
  occupancy: 0.22,
  budget: 0.18,
  delinquency: 0.18,
  workOrders: 0.14,
}

export interface RankedAsset {
  rank: number
  asset: Asset
  score: number
  drivers: { driver: Driver; contribution: number }[]
  reason: string
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIRST = ['Lumen', 'Quill', 'Fable', 'Mirage', 'Parable', 'Sprocket', 'Nimbus', 'Tinsel']
const SECOND = ['Court', 'Yards', 'Commons', 'Works', 'Terrace', 'Exchange', 'Row', 'Point']
const MARKETS = ['Northvale', 'Port Ember', 'Glass Harbor', 'Cedar Mesa', 'Riverford']
const TYPES: Asset['type'][] = ['Multifamily', 'Industrial', 'Office', 'Retail']
const PROJECT_MANAGERS = ['Sam Exemplar', 'Taylor Notreal', 'Drew Synthwell', 'Jamie Proxy']
const MANAGERS = [
  'Avery Placeholder',
  'Jordan Sample',
  'Morgan Fictus',
  'Casey Demo',
  'Riley Mockwell',
  'Quinn Testaro',
]

function pick<T>(list: readonly T[], r: number): T {
  const v = list[Math.floor(r * list.length) % list.length]
  if (v === undefined) throw new Error('empty list')
  return v
}

const round1 = (n: number): number => Math.round(n * 10) / 10

export function generatePortfolio(count = 40, seed = 20261027): Asset[] {
  const rand = mulberry32(seed)
  return Array.from({ length: count }, (_, i): Asset => {
    const type = pick(TYPES, rand())
    return {
      id: `SYN-${String(i + 1).padStart(3, '0')}`,
      name: `${pick(FIRST, rand())} ${pick(SECOND, rand())} (fictional)`,
      market: pick(MARKETS, rand()),
      type,
      units: type === 'Multifamily' ? 80 + Math.floor(rand() * 320) : 4 + Math.floor(rand() * 40),
      manager: pick(MANAGERS, rand()),
      projectManager: pick(PROJECT_MANAGERS, rand()),
      debtMaturityMonths: 2 + Math.floor(rand() * 58),
      occupancyTrend: round1(rand() * 9 - 6),
      occupancy: round1(78 + rand() * 21),
      budgetVariance: round1(rand() * 22 - 7),
      delinquency: round1(rand() * rand() * 12),
      openWorkOrders: Math.floor(rand() * rand() * 60),
    }
  })
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n))

export function driverScores(a: Asset): Record<Driver, number> {
  return {
    debt: clamp01((24 - a.debtMaturityMonths) / 22),
    occupancy: clamp01(-a.occupancyTrend / 6),
    budget: clamp01(a.budgetVariance / 15),
    delinquency: clamp01(a.delinquency / 8),
    workOrders: clamp01(a.openWorkOrders / 40),
  }
}

function describe(driver: Driver, a: Asset): string {
  switch (driver) {
    case 'debt':
      return `loan matures in ${a.debtMaturityMonths} months`
    case 'occupancy':
      return `occupancy down ${Math.abs(a.occupancyTrend).toFixed(1)} pts in six months`
    case 'budget':
      return `opex ${a.budgetVariance.toFixed(1)}% over budget`
    case 'delinquency':
      return `${a.delinquency.toFixed(1)}% of rent 30+ days late`
    case 'workOrders':
      return `${a.openWorkOrders} open work orders`
  }
}

const ORDER: Driver[] = ['debt', 'occupancy', 'budget', 'delinquency', 'workOrders']

export function rankRisk(assets: readonly Asset[], limit = 20): RankedAsset[] {
  return assets
    .map((asset) => {
      const s = driverScores(asset)
      const drivers = ORDER.map((driver) => ({ driver, contribution: s[driver] * WEIGHTS[driver] }))
        .filter((d) => d.contribution > 0)
        .sort(
          (x, y) =>
            y.contribution - x.contribution || ORDER.indexOf(x.driver) - ORDER.indexOf(y.driver)
        )
      const score = Math.round(drivers.reduce((sum, d) => sum + d.contribution, 0) * 100)
      const top = drivers.slice(0, 2).map((d) => describe(d.driver, asset))
      const reason = top.length
        ? `${top.join('; ')}.`.replace(/^./, (c) => c.toUpperCase())
        : 'No material risk drivers.'
      return { asset, score, drivers, reason }
    })
    .sort((x, y) => y.score - x.score || x.asset.id.localeCompare(y.asset.id))
    .slice(0, limit)
    .map((r, i) => ({ ...r, rank: i + 1 }))
}
