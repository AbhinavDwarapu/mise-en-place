import { describe, expect, it } from 'vitest'
import type { Ingredient } from '../types'
import { daysToMs, daysUntilExpiry, expiresAt, expiryLabel } from './expiration'

const spinach: Ingredient = {
  id: 'ing-1',
  name: 'Baby spinach',
  category: 'produce',
  quantity: { amount: 1, unit: 'bag' },
  expiresAfterMs: daysToMs(5),
  addedAtIso: '2026-07-10T12:00:00.000Z',
  substitutions: [],
}

const salt: Ingredient = {
  ...spinach,
  id: 'ing-2',
  name: 'Salt',
  category: 'pantry',
  expiresAfterMs: null,
}

describe('expiresAt', () => {
  it('adds the expiry window to the added date', () => {
    expect(expiresAt(spinach)).toEqual(new Date('2026-07-15T12:00:00.000Z'))
  })

  it('is null for ingredients that do not expire', () => {
    expect(expiresAt(salt)).toBeNull()
  })
})

describe('daysUntilExpiry', () => {
  it('counts remaining days, rounding partial days up', () => {
    expect(daysUntilExpiry(spinach, new Date('2026-07-12T12:00:00Z'))).toBe(3)
    expect(daysUntilExpiry(spinach, new Date('2026-07-12T18:00:00Z'))).toBe(3)
  })

  it('reaches zero on the expiry date and goes negative after', () => {
    expect(daysUntilExpiry(spinach, new Date('2026-07-15T12:00:00Z'))).toBe(0)
    expect(daysUntilExpiry(spinach, new Date('2026-07-16T13:00:00Z'))).toBe(-1)
  })

  it('is null for ingredients that do not expire', () => {
    expect(daysUntilExpiry(salt, new Date('2026-07-12T12:00:00Z'))).toBeNull()
  })
})

describe('expiryLabel', () => {
  it('describes each expiry state', () => {
    expect(expiryLabel(5)).toBe('Exp ~5d')
    expect(expiryLabel(0)).toBe('Expires today')
    expect(expiryLabel(-1)).toBe('Expired')
    expect(expiryLabel(null)).toBeNull()
  })
})
