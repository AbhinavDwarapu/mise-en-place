import { describe, expect, it } from 'vitest'
import { daysToMs } from '../../logic/expiration'
import type { Ingredient } from '../../types'
import { expiringFirst, shortExpiryLabel } from './expiring-first'

const now = new Date('2026-07-10T12:00:00.000Z')

function ingredient(name: string, expiresInDays: number | null): Ingredient {
  return {
    id: name,
    name,
    category: 'produce',
    quantity: { amount: 1, unit: 'x' },
    expiresAfterMs: expiresInDays === null ? null : daysToMs(expiresInDays),
    addedAtIso: now.toISOString(),
    substitutions: [],
  }
}

describe('expiringFirst', () => {
  it('sorts soonest expiry first with non-expiring ingredients last', () => {
    const sorted = expiringFirst(
      [
        ingredient('salt', null),
        ingredient('yogurt', 4),
        ingredient('spinach', 2),
      ],
      now
    )

    expect(sorted.map((entry) => entry.name)).toEqual([
      'spinach',
      'yogurt',
      'salt',
    ])
  })

  it('keeps the original order between equal expiries', () => {
    const sorted = expiringFirst(
      [ingredient('milk', 3), ingredient('cream', 3)],
      now
    )

    expect(sorted.map((entry) => entry.name)).toEqual(['milk', 'cream'])
  })
})

describe('shortExpiryLabel', () => {
  it('labels expiries within a week and hides the rest', () => {
    expect(shortExpiryLabel(2)).toBe('2d')
    expect(shortExpiryLabel(0)).toBe('today')
    expect(shortExpiryLabel(-1)).toBe('exp')
    expect(shortExpiryLabel(8)).toBeNull()
    expect(shortExpiryLabel(null)).toBeNull()
  })
})
