import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RiskDemo } from './RiskDemo'

describe('RiskDemo', () => {
  it('reveals 20 ranked rows and fires demo_run', async () => {
    const beacon = vi.fn<(url: string, body?: BodyInit | null) => boolean>(() => true)
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true })
    render(<RiskDemo />)
    expect(screen.getByText('Synthetic data')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Rank my top 20/ }))
    expect(screen.getAllByRole('row')).toHaveLength(21)
    const blob = beacon.mock.calls[0]?.[1]
    expect(blob instanceof Blob ? await blob.text() : '').toContain('"demo_run"')
  })
})
