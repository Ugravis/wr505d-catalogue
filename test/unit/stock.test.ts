import { describe, expect, it } from 'vitest'
import { getStockLabel, getStockStatus } from '../../shared/stock'
import { hasStatusCode } from '../../shared/errors'

describe('getStockStatus', () => {
  it('flags an empty stock as out', () => {
    expect(getStockStatus(0)).toEqual({ kind: 'out' })
  })

  it('treats negative stock as out', () => {
    expect(getStockStatus(-1)).toEqual({ kind: 'out' })
  })

  it('flags 1 to 4 items as low', () => {
    expect(getStockStatus(1)).toEqual({ kind: 'low', remaining: 1 })
    expect(getStockStatus(4)).toEqual({ kind: 'low', remaining: 4 })
  })

  it('treats 5 items or more as in stock', () => {
    expect(getStockStatus(5)).toEqual({ kind: 'in' })
    expect(getStockStatus(120)).toEqual({ kind: 'in' })
  })
})

describe('getStockLabel', () => {
  it('labels each status', () => {
    expect(getStockLabel(getStockStatus(0))).toBe('Rupture de stock')
    expect(getStockLabel(getStockStatus(3))).toBe('Plus que 3 en stock')
    expect(getStockLabel(getStockStatus(50))).toBe('En stock')
  })
})

describe('hasStatusCode', () => {
  it('matches an error carrying the expected statusCode', () => {
    expect(hasStatusCode({ statusCode: 404 }, 404)).toBe(true)
  })

  it('rejects other codes and non-objects', () => {
    expect(hasStatusCode({ statusCode: 500 }, 404)).toBe(false)
    expect(hasStatusCode(null, 404)).toBe(false)
    expect(hasStatusCode('404', 404)).toBe(false)
    expect(hasStatusCode(new Error('x'), 404)).toBe(false)
  })
})
