import { describe, expect, it } from 'vitest'
import type { Ingredient, Recipe } from '../types'
import {
  deletionConsequences,
  quantityNeeded,
  recipesUsing,
} from './consequences'
import { daysToMs } from './expiration'

const spinach: Ingredient = {
  id: 'ing-spinach',
  name: 'Baby spinach',
  category: 'produce',
  quantity: { amount: 1, unit: 'bag' },
  expiresAfterMs: daysToMs(5),
  addedAtIso: '2026-07-10T12:00:00.000Z',
  substitutions: ['frozen spinach', 'kale'],
}

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

describe('deletionConsequences', () => {
  it('warns for every recipe that needs the ingredient', () => {
    expect(deletionConsequences(spinach, recipes)).toEqual([
      'Sat. frittata will no longer be possible',
      'Green smoothies will no longer be possible',
      'Possible substitutes: frozen spinach, kale',
    ])
  })

  it('omits the substitute hint when there are none', () => {
    const withoutSubstitutes = { ...spinach, substitutions: [] }
    expect(deletionConsequences(withoutSubstitutes, recipes)).toEqual([
      'Sat. frittata will no longer be possible',
      'Green smoothies will no longer be possible',
    ])
  })

  it('is empty for ingredients no recipe uses', () => {
    const unused = { ...spinach, id: 'ing-unused' }
    expect(deletionConsequences(unused, recipes)).toEqual([])
  })
})
