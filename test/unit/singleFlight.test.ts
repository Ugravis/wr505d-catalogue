import { describe, expect, it, vi } from 'vitest'
import { singleFlight } from '../../app/utils/singleFlight'

describe('singleFlight', () => {
  it('calls the wrapped function only once for concurrent calls', async () => {
    const fn = vi.fn(() => Promise.resolve('result'))
    const run = singleFlight(fn)

    const [a, b, c] = await Promise.all([run(), run(), run()])

    expect(fn).toHaveBeenCalledTimes(1)
    expect([a, b, c]).toEqual(['result', 'result', 'result'])
  })

  it('calls the wrapped function again after the previous call resolved', async () => {
    const fn = vi.fn(() => Promise.resolve('result'))
    const run = singleFlight(fn)

    await run()
    await run()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('calls the wrapped function again after the previous call rejected', async () => {
    const fn = vi.fn(() => Promise.reject(new Error('boom')))
    const run = singleFlight(fn)

    await expect(run()).rejects.toThrow('boom')
    await expect(run()).rejects.toThrow('boom')

    expect(fn).toHaveBeenCalledTimes(2)
  })
})
