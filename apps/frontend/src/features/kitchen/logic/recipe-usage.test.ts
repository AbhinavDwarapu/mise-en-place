import { describe, expect, it } from 'vitest'
import type { Recipe } from '../types'
import { quantityNeeded, recipesUsing, sourceEquals } from './recipe-usage'

const frittata: Recipe = {
  id: 'rec-frittata',
  name: 'Sat. frittata',
  color: '#e8a33d',
  servings: 2,
  cookingThisWeek: false,
  ingredients: [
    {
      source: { kind: 'kitchen', ingredientId: 'ing-spinach' },
      needed: { amount: 1, unit: 'bag' },
    },
    {
      source: { kind: 'kitchen', ingredientId: 'ing-eggs' },
      needed: { amount: 6, unit: 'x' },
    },
  ],
}

const smoothies: Recipe = {
  id: 'rec-smoothies',
  name: 'Green smoothies',
  color: '#4caf50',
  servings: 2,
  cookingThisWeek: false,
  ingredients: [
    {
      source: { kind: 'kitchen', ingredientId: 'ing-spinach' },
      needed: { amount: 0.5, unit: 'bag' },
    },
  ],
}

const tacos: Recipe = {
  id: 'rec-tacos',
  name: 'Taco night',
  color: '#e05252',
  servings: 4,
  cookingThisWeek: true,
  ingredients: [
    {
      source: { kind: 'kitchen', ingredientId: 'ing-beef' },
      needed: { amount: 1, unit: 'lb' },
    },
  ],
}

const cacioEPepe: Recipe = {
  id: 'rec-cacio-e-pepe',
  name: 'Cacio e pepe',
  color: '#4a90d9',
  servings: 2,
  cookingThisWeek: false,
  ingredients: [
    {
      source: { kind: 'shopping-list', shoppingListItemId: 'sl-pecorino' },
      needed: { amount: 80, unit: 'g' },
    },
  ],
}

const recipes = [frittata, smoothies, tacos, cacioEPepe]
const spinach = { kind: 'kitchen' as const, ingredientId: 'ing-spinach' }
const pecorino = {
  kind: 'shopping-list' as const,
  shoppingListItemId: 'sl-pecorino',
}

describe('recipesUsing', () => {
  it('returns only the recipes that need the ingredient', () => {
    expect(recipesUsing(spinach, recipes)).toEqual([frittata, smoothies])
  })

  it('is empty for ingredients no recipe uses', () => {
    expect(
      recipesUsing({ kind: 'kitchen', ingredientId: 'ing-unused' }, recipes)
    ).toEqual([])
  })

  it('matches shopping-list sources too', () => {
    expect(recipesUsing(pecorino, recipes)).toEqual([cacioEPepe])
  })
})

describe('quantityNeeded', () => {
  it('finds how much of the ingredient the recipe needs', () => {
    expect(quantityNeeded(frittata, spinach)).toEqual({
      amount: 1,
      unit: 'bag',
    })
  })

  it('is null when the recipe does not use the ingredient', () => {
    expect(quantityNeeded(tacos, spinach)).toBeNull()
  })
})

describe('sourceEquals', () => {
  it('is true for matching kitchen sources', () => {
    expect(
      sourceEquals(
        { kind: 'kitchen', ingredientId: 'ing-spinach' },
        { kind: 'kitchen', ingredientId: 'ing-spinach' }
      )
    ).toBe(true)
  })

  it('is true for matching shopping-list sources', () => {
    expect(sourceEquals(pecorino, pecorino)).toBe(true)
  })

  it('is false across different kinds even with the same id', () => {
    expect(
      sourceEquals(
        { kind: 'kitchen', ingredientId: 'same-id' },
        { kind: 'shopping-list', shoppingListItemId: 'same-id' }
      )
    ).toBe(false)
  })

  it('is false for different ids of the same kind', () => {
    expect(
      sourceEquals(
        { kind: 'kitchen', ingredientId: 'ing-a' },
        { kind: 'kitchen', ingredientId: 'ing-b' }
      )
    ).toBe(false)
  })
})
