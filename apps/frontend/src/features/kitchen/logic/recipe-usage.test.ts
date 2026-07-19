import { describe, expect, it } from 'vitest'
import type { Recipe } from '../types'
import { quantityNeeded, recipesUsing } from './recipe-usage'

const frittata: Recipe = {
  id: 'rec-frittata',
  name: 'Sat. frittata',
  color: '#e8a33d',
  ingredients: [
    { ingredientId: 'ing-spinach', needed: { amount: 1, unit: 'bag' } },
    { ingredientId: 'ing-eggs', needed: { amount: 6, unit: 'x' } },
  ],
}

const smoothies: Recipe = {
  id: 'rec-smoothies',
  name: 'Green smoothies',
  color: '#4caf50',
  ingredients: [
    { ingredientId: 'ing-spinach', needed: { amount: 0.5, unit: 'bag' } },
  ],
}

const tacos: Recipe = {
  id: 'rec-tacos',
  name: 'Taco night',
  color: '#e05252',
  ingredients: [
    { ingredientId: 'ing-beef', needed: { amount: 1, unit: 'lb' } },
  ],
}

const recipes = [frittata, smoothies, tacos]

describe('recipesUsing', () => {
  it('returns only the recipes that need the ingredient', () => {
    expect(recipesUsing('ing-spinach', recipes)).toEqual([frittata, smoothies])
  })

  it('is empty for ingredients no recipe uses', () => {
    expect(recipesUsing('ing-unused', recipes)).toEqual([])
  })
})

describe('quantityNeeded', () => {
  it('finds how much of the ingredient the recipe needs', () => {
    expect(quantityNeeded(frittata, 'ing-spinach')).toEqual({
      amount: 1,
      unit: 'bag',
    })
  })

  it('is null when the recipe does not use the ingredient', () => {
    expect(quantityNeeded(tacos, 'ing-spinach')).toBeNull()
  })
})
