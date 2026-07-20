import { describe, expect, it } from 'vitest'
import type { Ingredient } from '../types'
import {
  daysUntilExpiry,
  expiresAt,
  expiryDateInputValue,
  expiryFromDateInput,
  expiryFromDays,
  expiryLabel,
} from './expiration'

const spinach: Ingredient = {
  id: 'ing-1',
  name: 'Baby spinach',
  quantity: { amount: 1, unit: 'bag' },
  expiresAtIso: '2026-07-15T12:00:00.000Z',
  addedAtIso: '2026-07-10T12:00:00.000Z',
  substitutions: [],
}

const salt: Ingredient = {
  ...spinach,
  id: 'ing-2',
  name: 'Salt',
  expiresAtIso: null,
}

describe('expiryFromDays', () => {
  it('lands the given number of days after the start instant', () => {
    expect(expiryFromDays(spinach.addedAtIso, 5)).toBe(
      '2026-07-15T12:00:00.000Z'
    )
  })
})

describe('expiresAt', () => {
  it('reads the stored expiry instant', () => {
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

describe('expiryDateInputValue', () => {
  it('formats the expiry date for a date input', () => {
    expect(expiryDateInputValue(spinach)).toBe('2026-07-15')
  })

  it('is empty for ingredients that do not expire', () => {
    expect(expiryDateInputValue(salt)).toBe('')
  })
})

describe('expiryFromDateInput', () => {
  it('round-trips a chosen expiry date back through expiryDateInputValue', () => {
    const expiresAtIso = expiryFromDateInput('2026-08-01')
    expect(expiryDateInputValue({ ...spinach, expiresAtIso })).toBe(
      '2026-08-01'
    )
  })
})
