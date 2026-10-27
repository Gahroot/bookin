import { describe, expect, it } from 'vitest'
import { ATTR_KEY, readAttribution, recordTouch } from './attribution'

function memory(): Storage {
  const m = new Map<string, string>()
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => {
      m.set(k, v)
    },
    removeItem: (k) => {
      m.delete(k)
    },
    clear: () => {
      m.clear()
    },
    key: () => null,
    get length() {
      return m.size
    },
  }
}

const t1 = new Date('2026-10-01T00:00:00Z')
const t2 = new Date('2026-10-05T00:00:00Z')

describe('attribution', () => {
  it('records direct first touch then keeps it while last touch updates', () => {
    const s = memory()
    const a = recordTouch(s, 'https://nolangrout.com/', '', t1)
    expect(a.first.source).toBe('(direct)')
    const b = recordTouch(
      s,
      'https://nolangrout.com/writing/x?utm_source=linkedin&utm_medium=social&utm_campaign=launch',
      '',
      t2
    )
    expect(b.first.source).toBe('(direct)')
    expect(b.last).toMatchObject({ source: 'linkedin', medium: 'social', landing: '/writing/x' })
    expect(readAttribution(s)).toEqual(b)
  })

  it('internal navigation does not overwrite the last touch', () => {
    const s = memory()
    recordTouch(s, 'https://nolangrout.com/', 'https://www.google.com/', t1)
    const b = recordTouch(s, 'https://nolangrout.com/book', 'https://nolangrout.com/', t2)
    expect(b.last.source).toBe('www.google.com')
    expect(b.last.medium).toBe('referral')
  })

  it('ignores corrupt storage', () => {
    const s = memory()
    s.setItem(ATTR_KEY, '{bad')
    expect(readAttribution(s)).toBeNull()
  })
})
