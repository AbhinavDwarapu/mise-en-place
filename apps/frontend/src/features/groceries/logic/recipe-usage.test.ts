import { describe, expect, it } from 'vitest'
import { COUNT_UNIT } from '../state/grocery-constants'
import type { Recipe } from '../types'
import { quantityNeeded, recipesUsing } from './recipe-usage'

const frittata: Recipe = {
  id: 'rec-frittata',
  name: 'Sat. frittata',
  color: '#e8a33d',
  servings: 2,
  cookingThisWeek: false,
  ingredients: [
    { itemId: 'ing-spinach', needed: { amount: 1, unit: 'bag' } },
    { itemId: 'ing-eggs', needed: { amount: 6, unit: COUNT_UNIT } },
  ],
}

const smoothies: Recipe = {
  id: 'rec-smoothies',
  name: 'Green smoothies',
  color: '#4caf50',
  servings: 2,
  cookingThisWeek: false,
  ingredients: [{ itemId: 'ing-spinach', needed: { amount: 0.5, unit: 'bag' } }],
}

const tacos: Recipe = {
  id: 'rec-tacos',
  name: 'Taco night',
  color: '#e05252',
  servings: 4,
  cookingThisWeek: true,
  ingredients: [{ itemId: 'ing-beef', needed: { amount: 1, unit: 'lb' } }],
}

const recipes = [frittata, smoothies, tacos]

describe('recipesUsing', () => {
  it('returns only the recipes that need the item', () => {
    expect(recipesUsing('ing-spinach', recipes)).toEqual([frittata, smoothies])
  })

  it('is empty for items no recipe uses', () => {
    expect(recipesUsing('ing-unused', recipes)).toEqual([])
  })
})

describe('quantityNeeded', () => {
  it('finds how much of the item the recipe needs', () => {
    expect(quantityNeeded(frittata, 'ing-spinach')).toEqual({
      amount: 1,
      unit: 'bag',
    })
  })

  it('is null when the recipe does not use the item', () => {
    expect(quantityNeeded(tacos, 'ing-spinach')).toBeNull()
  })
})
