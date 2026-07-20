import type { Quantity, Recipe } from '../types'

export function recipesUsing(itemId: string, recipes: Recipe[]): Recipe[] {
  return recipes.filter((recipe) =>
    recipe.ingredients.some((entry) => entry.itemId === itemId)
  )
}

export function quantityNeeded(recipe: Recipe, itemId: string): Quantity | null {
  const entry = recipe.ingredients.find(
    (candidate) => candidate.itemId === itemId
  )
  return entry?.needed ?? null
}
