import { recipesUsing } from '../../logic/recipe-usage'
import type { Ingredient, Recipe } from '../../types'

export interface PlannedOverlap {
  recipe: Recipe
  ingredientNames: string[]
}

export function plannedOverlaps(
  recipes: Recipe[],
  selected: Ingredient[]
): PlannedOverlap[] {
  const overlaps = new Map<string, PlannedOverlap>()
  for (const ingredient of selected) {
    const using = recipesUsing(
      { kind: 'kitchen', ingredientId: ingredient.id },
      recipes
    )
    for (const recipe of using) {
      const overlap = overlaps.get(recipe.id) ?? { recipe, ingredientNames: [] }
      overlap.ingredientNames.push(ingredient.name)
      overlaps.set(recipe.id, overlap)
    }
  }
  return [...overlaps.values()]
}
