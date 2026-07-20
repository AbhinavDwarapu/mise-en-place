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

export type GroceryLocation = 'kitchen' | 'shopping-list'

export interface GroceryItem {
  id: string
  name: string
  location: GroceryLocation
  quantity: Quantity
  expiresAtIso: string | null
  addedAtIso: string
  substitutions: string[]
}

export interface RecipeIngredient {
  itemId: string
  needed: Quantity
}

export interface Recipe {
  id: string
  name: string
  color: string
  servings: number
  cookingThisWeek: boolean
  ingredients: RecipeIngredient[]
  notes?: string
}

export interface GroceryData {
  items: GroceryItem[]
  recipes: Recipe[]
}
