import { describe, expect, it } from 'vitest'
import type { Ingredient } from '../../types'
import { groupIngredientsByCategory } from './group-by-category'

function ingredient(id: string, category: Ingredient['category']): Ingredient {
  return {
    id,
    name: id,
    category,
    quantity: { amount: 1, unit: 'unit' },
    expiresAtIso: null,
    addedAtIso: '2026-07-19T12:00:00.000Z',
    substitutions: [],
  }
}

const spinach = ingredient('spinach', 'produce')
const milk = ingredient('milk', 'dairy')
const peas = ingredient('peas', 'frozen')

describe('groupIngredientsByCategory', () => {
  it('groups by category in the fixed category order', () => {
    const groups = groupIngredientsByCategory([peas, milk, spinach])

    expect(groups).toEqual([
      { category: 'produce', ingredients: [spinach] },
      { category: 'dairy', ingredients: [milk] },
      { category: 'frozen', ingredients: [peas] },
    ])
  })

  it('omits categories with no ingredients', () => {
    const groups = groupIngredientsByCategory([milk])

    expect(groups.map((group) => group.category)).toEqual(['dairy'])
  })

  it('keeps ingredients within a category in their original order', () => {
    const secondSpinach = ingredient('spinach-2', 'produce')
    const groups = groupIngredientsByCategory([secondSpinach, spinach])

    expect(groups).toEqual([
      { category: 'produce', ingredients: [secondSpinach, spinach] },
    ])
  })

  it('returns no groups for an empty list', () => {
    expect(groupIngredientsByCategory([])).toEqual([])
  })
})
