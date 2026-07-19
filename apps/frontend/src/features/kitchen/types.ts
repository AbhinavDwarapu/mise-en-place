import type { Quantity } from '@/shared/types'

export type { Quantity }

export type IngredientCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'frozen'
  | 'pantry'
  | 'other'

export interface Ingredient {
  id: string
  name: string
  category: IngredientCategory
  quantity: Quantity
  expiresAfterMs: number | null
  addedAtIso: string
  substitutions: string[]
}

export interface RecipeIngredient {
  ingredientId: string
  needed: Quantity
}

export interface Recipe {
  id: string
  name: string
  color: string
  ingredients: RecipeIngredient[]
}

export interface KitchenData {
  ingredients: Ingredient[]
  recipes: Recipe[]
}
