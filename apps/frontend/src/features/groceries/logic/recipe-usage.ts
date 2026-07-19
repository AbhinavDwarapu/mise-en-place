import type { Quantity, Recipe, RecipeIngredientSource } from '../types'

export function sourceEquals(
  a: RecipeIngredientSource,
  b: RecipeIngredientSource
): boolean {
  switch (a.kind) {
    case 'kitchen':
      return b.kind === 'kitchen' && a.ingredientId === b.ingredientId
    case 'shopping-list':
      return (
        b.kind === 'shopping-list' &&
        a.shoppingListItemId === b.shoppingListItemId
      )
  }
}

export function recipesUsing(
  source: RecipeIngredientSource,
  recipes: Recipe[]
): Recipe[] {
  return recipes.filter((recipe) =>
    recipe.ingredients.some((entry) => sourceEquals(entry.source, source))
  )
}

export function quantityNeeded(
  recipe: Recipe,
  source: RecipeIngredientSource
): Quantity | null {
  const entry = recipe.ingredients.find((candidate) =>
    sourceEquals(candidate.source, source)
  )
  return entry?.needed ?? null
}
