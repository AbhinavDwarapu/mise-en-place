import { describe, expect, it } from 'vitest'
import { COUNT_UNIT } from '../../state/grocery-constants'
import type { GroceryItem } from '../../types'
import { pendingCount } from './aisles'

function listItem(id: string, name: string): GroceryItem {
  return {
    id,
    name,
    location: 'shopping-list',
    quantity: { amount: 1, unit: COUNT_UNIT },
    expiresAtIso: null,
    addedAtIso: '2026-07-19T12:00:00.000Z',
    substitutions: [],
  }
}

const frozenPeas = listItem('peas', 'Frozen peas')
const milk = listItem('milk', 'Whole milk')
const tomatoes = listItem('tomatoes', 'Tomatoes')

describe('pendingCount', () => {
  it('counts only items without a status', () => {
    const count = pendingCount([frozenPeas, milk, tomatoes], {
      [milk.id]: 'checked',
      [tomatoes.id]: 'skipped',
    })

    expect(count).toBe(1)
  })

  it('ignores statuses for items no longer on the list', () => {
    expect(pendingCount([milk], { 'stale-id': 'checked' })).toBe(1)
  })
})
