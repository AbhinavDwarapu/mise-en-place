export interface Quantity {
  amount: number
  unit: string
}

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

export type RecipeIngredientSource =
  | { kind: 'kitchen'; ingredientId: string }
  | { kind: 'shopping-list'; shoppingListItemId: string }

export interface RecipeIngredient {
  source: RecipeIngredientSource
  needed: Quantity
}

export interface Recipe {
  id: string
  name: string
  color: string
  servings: number
  cookingThisWeek: boolean
  ingredients: RecipeIngredient[]
}

export interface KitchenData {
  ingredients: Ingredient[]
  recipes: Recipe[]
}
