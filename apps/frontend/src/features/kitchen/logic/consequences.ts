import type { Ingredient, Quantity, Recipe } from '../types'

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

export function deletionConsequences(
  ingredient: Ingredient,
  recipes: Recipe[]
): string[] {
  const affected = recipesUsing(ingredient.id, recipes)
  const warnings = affected.map(
    (recipe) => `${recipe.name} will no longer be possible`
  )
  if (warnings.length > 0 && ingredient.substitutions.length > 0) {
    warnings.push(`Possible substitutes: ${ingredient.substitutions.join(', ')}`)
  }
  return warnings
}
