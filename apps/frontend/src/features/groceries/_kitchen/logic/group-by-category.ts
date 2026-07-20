import { INGREDIENT_CATEGORIES } from '../../state/kitchen-constants'
import type { Ingredient, IngredientCategory } from '../../types'

export interface IngredientGroup {
  category: IngredientCategory
  ingredients: Ingredient[]
}

export function groupIngredientsByCategory(
  ingredients: Ingredient[]
): IngredientGroup[] {
  return INGREDIENT_CATEGORIES.map((category) => ({
    category,
    ingredients: ingredients.filter(
      (ingredient) => ingredient.category === category
    ),
  })).filter((group) => group.ingredients.length > 0)
}
