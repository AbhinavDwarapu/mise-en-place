import { describe, expect, it } from 'vitest'
import { COUNT_UNIT } from '../../state/grocery-constants'
import type { GroceryItem, GroceryLocation } from '../../types'
import { alternativesFor } from './alternatives'

function item(
  name: string,
  location: GroceryLocation,
  substitutions: string[] = []
): GroceryItem {
  return {
    id: `${location}-${name.toLowerCase()}`,
    name,
    location,
    quantity: { amount: 1, unit: COUNT_UNIT },
    expiresAtIso: null,
    addedAtIso: '2026-07-19T12:00:00.000Z',
    substitutions,
  }
}

const spinach = item('Baby spinach', 'kitchen', ['frozen spinach', 'kale'])
const onions = item('Onions', 'kitchen')

describe('alternativesFor', () => {
  it('returns the substitutions of the same-named kitchen item', () => {
    expect(alternativesFor('Baby spinach', [onions, spinach])).toEqual([
      'frozen spinach',
      'kale',
    ])
  })

  it('matches case-insensitively', () => {
    expect(alternativesFor('  baby SPINACH ', [spinach])).toEqual([
      'frozen spinach',
      'kale',
    ])
  })

  it('is empty when no kitchen item has that name', () => {
    expect(alternativesFor('Cilantro', [spinach, onions])).toEqual([])
  })

  it('ignores same-named items that are only on the shopping list', () => {
    const listSpinach = item('Baby spinach', 'shopping-list', ['chard'])

    expect(alternativesFor('Baby spinach', [listSpinach])).toEqual([])
  })
})
