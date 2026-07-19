import type { Quantity, Recipe } from '../types'

export function recipesUsing(
  ingredientId: string,
  recipes: Recipe[]
): Recipe[] {
  return recipes.filter((recipe) =>
    recipe.ingredients.some((entry) => entry.ingredientId === ingredientId)
  )
}

export function quantityNeeded(
  recipe: Recipe,
  ingredientId: string
): Quantity | null {
  const entry = recipe.ingredients.find(
    (candidate) => candidate.ingredientId === ingredientId
  )
  return entry?.needed ?? null
}
