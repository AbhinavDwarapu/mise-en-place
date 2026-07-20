import { recipesUsing } from '../../logic/recipe-usage'
import type { GroceryItem, Recipe } from '../../types'

export interface PlannedOverlap {
  recipe: Recipe
  ingredientNames: string[]
}

export function plannedOverlaps(
  recipes: Recipe[],
  selected: GroceryItem[]
): PlannedOverlap[] {
  const overlaps = new Map<string, PlannedOverlap>()
  for (const item of selected) {
    for (const recipe of recipesUsing(item.id, recipes)) {
      const overlap = overlaps.get(recipe.id) ?? { recipe, ingredientNames: [] }
      overlap.ingredientNames.push(item.name)
      overlaps.set(recipe.id, overlap)
    }
  }
  return [...overlaps.values()]
}
