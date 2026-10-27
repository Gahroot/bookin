import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BookingFlow } from './BookingFlow'

describe('BookingFlow', () => {
  const fetchMock = vi.fn<typeof fetch>()
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    Object.defineProperty(navigator, 'sendBeacon', { value: vi.fn(() => true), configurable: true })
    fetchMock.mockResolvedValue(Response.json({ ok: true }))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it('requires a choice, then posts the lead and shows the calendar', async () => {
    const user = userEvent.setup()
    render(<BookingFlow />)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Choose one option')
    for (const label of [
      'Real estate fund / operator',
      '$5M+',
      'AI agents',
      'Within a month',
      '$25,000+',
    ]) {
      await user.click(screen.getByText(label))
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    await user.click(screen.getByRole('button', { name: 'See available times' }))
    expect(screen.getByText('First name is required')).toBeInTheDocument()
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('Work email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Phone'), '5550100000')
    await user.click(screen.getByRole('button', { name: 'See available times' }))
    expect(await screen.findByTitle(/Schedule a 30-minute call/)).toBeInTheDocument()
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe('/api/lead')
    const body = JSON.parse(typeof init?.body === 'string' ? init.body : '{}') as Record<
      string,
      unknown
    >
    expect(body).toMatchObject({
      firstName: 'Ada',
      businessType: 'real-estate',
      budget: '25k+',
      website: '',
    })
  })
})
