import { describe, expect, it } from 'vitest'
import { COUNT_UNIT } from '../../state/kitchen-constants'
import type { ShoppingListItem } from '../../state/shopping-list-store'
import { pendingCount } from './aisles'

function listItem(id: string, name: string): ShoppingListItem {
  return {
    id,
    name,
    quantity: { amount: 1, unit: COUNT_UNIT },
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
