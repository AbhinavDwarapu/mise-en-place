import { describe, expect, it } from 'vitest'
import type { GroceryItem, Recipe } from '../../types'
import { plannedOverlaps } from './planned-overlap'

function ingredient(id: string, name: string): GroceryItem {
  return {
    id,
    name,
    location: 'kitchen',
    quantity: { amount: 1, unit: 'x' },
    expiresAtIso: null,
    addedAtIso: '2026-07-10T12:00:00.000Z',
    substitutions: [],
  }
}

function recipe(id: string, name: string, itemIds: string[]): Recipe {
  return {
    id,
    name,
    color: '#94a3b8',
    servings: 2,
    cookingThisWeek: false,
    ingredients: itemIds.map((itemId) => ({
      itemId,
      needed: { amount: 1, unit: 'unit' },
    })),
  }
}

describe('plannedOverlaps', () => {
  it('groups matching recipes with the selected ingredients they use', () => {
    const spinach = ingredient('ing-spinach', 'Spinach')
    const yogurt = ingredient('ing-yogurt', 'Yogurt')
    const frittata = recipe('rec-frittata', 'Sat. frittata', [
      'ing-spinach',
      'ing-yogurt',
    ])
    const smoothies = recipe('rec-smoothies', 'Green smoothies', ['ing-yogurt'])
    const tacos = recipe('rec-tacos', 'Taco night', ['ing-beef'])

    const overlaps = plannedOverlaps(
      [frittata, smoothies, tacos],
      [spinach, yogurt]
    )

    expect(overlaps).toEqual([
      { recipe: frittata, ingredientNames: ['Spinach', 'Yogurt'] },
      { recipe: smoothies, ingredientNames: ['Yogurt'] },
    ])
  })

  it('is empty when no recipe uses a selected ingredient', () => {
    const spinach = ingredient('ing-spinach', 'Spinach')
    const tacos = recipe('rec-tacos', 'Taco night', ['ing-beef'])

    expect(plannedOverlaps([tacos], [spinach])).toEqual([])
  })
})
