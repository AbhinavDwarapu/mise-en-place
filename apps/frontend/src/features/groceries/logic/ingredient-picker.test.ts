import { describe, expect, it } from 'vitest'
import { COUNT_UNIT } from '../state/kitchen-constants'
import type { ShoppingListItem } from '../state/shopping-list-store'
import type { Ingredient } from '../types'
import { searchIngredientSources } from './ingredient-picker'

const pecorinoRomano: Ingredient = {
  id: 'ing-pecorino-romano',
  name: 'Pecorino romano',
  category: 'dairy',
  quantity: { amount: 80, unit: 'g' },
  expiresAfterMs: null,
  addedAtIso: '2026-07-18T09:00:00.000Z',
  substitutions: [],
}

const blackPepper: Ingredient = {
  id: 'ing-black-pepper',
  name: 'Black pepper',
  category: 'pantry',
  quantity: { amount: 1, unit: COUNT_UNIT },
  expiresAfterMs: null,
  addedAtIso: '2026-07-18T09:00:00.000Z',
  substitutions: [],
}

const ingredients = [pecorinoRomano, blackPepper]

const goodParmesan: ShoppingListItem = {
  id: 'sl-good-parmesan',
  name: 'Good parmesan',
  quantity: { amount: 200, unit: 'g' },
  addedAtIso: '2026-07-18T09:00:00.000Z',
}

const shoppingListItems = [goodParmesan]

describe('searchIngredientSources', () => {
  it('returns nothing for a blank query', () => {
    expect(searchIngredientSources('  ', ingredients, shoppingListItems)).toEqual({
      haveMatches: [],
      onListMatches: [],
      canCreateNew: false,
    })
  })

  it('matches kitchen ingredients case-insensitively by substring', () => {
    const result = searchIngredientSources('pecor', ingredients, shoppingListItems)

    expect(result.haveMatches).toEqual([pecorinoRomano])
  })

  it('matches shopping-list items case-insensitively by substring', () => {
    const result = searchIngredientSources('PARM', ingredients, shoppingListItems)

    expect(result.onListMatches).toEqual([goodParmesan])
  })

  it('offers to create new when nothing matches exactly', () => {
    const result = searchIngredientSources('Pecorino', ingredients, shoppingListItems)

    expect(result.haveMatches).toEqual([pecorinoRomano])
    expect(result.canCreateNew).toBe(true)
  })

  it('does not offer to create new when a kitchen ingredient matches exactly', () => {
    const result = searchIngredientSources(
      'pecorino romano',
      ingredients,
      shoppingListItems
    )

    expect(result.canCreateNew).toBe(false)
  })

  it('does not offer to create new when a shopping-list item matches exactly', () => {
    const result = searchIngredientSources(
      'good parmesan',
      ingredients,
      shoppingListItems
    )

    expect(result.canCreateNew).toBe(false)
  })
})
