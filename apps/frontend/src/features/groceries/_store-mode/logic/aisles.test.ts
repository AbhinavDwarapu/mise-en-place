import { describe, expect, it } from 'vitest'
import { inferCategory } from '../../logic/categories'
import { COUNT_UNIT } from '../../state/kitchen-constants'
import type { ShoppingListItem } from '../../state/shopping-list-store'
import { groupItemsByAisle, pendingCount } from './aisles'

function listItem(id: string, name: string): ShoppingListItem {
  return {
    id,
    name,
    quantity: { amount: 1, unit: COUNT_UNIT },
    addedAtIso: '2026-07-19T12:00:00.000Z',
  }
}

const frozenPeas = listItem('peas', 'Frozen peas')
const milk = listItem('milk', 'Whole milk')
const tomatoes = listItem('tomatoes', 'Tomatoes')
const mysteryPaste = listItem('paste', 'Mystery paste')

describe('groupItemsByAisle', () => {
  it('groups by inferred category in the fixed aisle order', () => {
    const aisles = groupItemsByAisle([frozenPeas, milk, tomatoes], inferCategory)

    expect(aisles).toEqual([
      { category: 'produce', items: [tomatoes] },
      { category: 'dairy', items: [milk] },
      { category: 'frozen', items: [frozenPeas] },
    ])
  })

  it('omits aisles with no items', () => {
    const aisles = groupItemsByAisle([milk], inferCategory)

    expect(aisles.map((aisle) => aisle.category)).toEqual(['dairy'])
  })

  it('puts unrecognised names in the other aisle', () => {
    const aisles = groupItemsByAisle([mysteryPaste], inferCategory)

    expect(aisles).toEqual([{ category: 'other', items: [mysteryPaste] }])
  })

  it('follows the provided lookup over keyword inference', () => {
    const aisles = groupItemsByAisle([mysteryPaste], () => 'pantry')

    expect(aisles).toEqual([{ category: 'pantry', items: [mysteryPaste] }])
  })

  it('returns no aisles for an empty list', () => {
    expect(groupItemsByAisle([], inferCategory)).toEqual([])
  })
})

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
