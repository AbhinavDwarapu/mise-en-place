import { describe, expect, it } from 'vitest'
import { COUNT_UNIT } from '../state/grocery-constants'
import type { GroceryItem } from '../types'
import { searchGroceryItems } from './item-search'

const pecorinoRomano: GroceryItem = {
  id: 'ing-pecorino-romano',
  name: 'Pecorino romano',
  location: 'kitchen',
  quantity: { amount: 80, unit: 'g' },
  expiresAtIso: null,
  addedAtIso: '2026-07-18T09:00:00.000Z',
  substitutions: [],
}

const blackPepper: GroceryItem = {
  id: 'ing-black-pepper',
  name: 'Black pepper',
  location: 'kitchen',
  quantity: { amount: 1, unit: COUNT_UNIT },
  expiresAtIso: null,
  addedAtIso: '2026-07-18T09:00:00.000Z',
  substitutions: [],
}

const goodParmesan: GroceryItem = {
  id: 'sl-good-parmesan',
  name: 'Good parmesan',
  location: 'shopping-list',
  quantity: { amount: 200, unit: 'g' },
  expiresAtIso: null,
  addedAtIso: '2026-07-18T09:00:00.000Z',
  substitutions: [],
}

const items = [pecorinoRomano, blackPepper, goodParmesan]

describe('searchGroceryItems', () => {
  it('returns nothing for a blank query', () => {
    expect(searchGroceryItems('  ', items)).toEqual({
      inKitchen: [],
      onList: [],
      canCreateNew: false,
    })
  })

  it('matches kitchen items case-insensitively by substring', () => {
    const result = searchGroceryItems('pecor', items)

    expect(result.inKitchen).toEqual([pecorinoRomano])
  })

  it('matches shopping-list items case-insensitively by substring', () => {
    const result = searchGroceryItems('PARM', items)

    expect(result.onList).toEqual([goodParmesan])
  })

  it('offers to create new when nothing matches exactly', () => {
    const result = searchGroceryItems('Pecorino', items)

    expect(result.inKitchen).toEqual([pecorinoRomano])
    expect(result.canCreateNew).toBe(true)
  })

  it('does not offer to create new when a kitchen item matches exactly', () => {
    const result = searchGroceryItems('pecorino romano', items)

    expect(result.canCreateNew).toBe(false)
  })

  it('does not offer to create new when a shopping-list item matches exactly', () => {
    const result = searchGroceryItems('good parmesan', items)

    expect(result.canCreateNew).toBe(false)
  })
})
