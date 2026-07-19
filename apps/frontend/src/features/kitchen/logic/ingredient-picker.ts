import type { ShoppingListItem } from '@/shared/state/shopping-list-store'
import type { Ingredient } from '../types'

export interface IngredientSearchResult {
  haveMatches: Ingredient[]
  onListMatches: ShoppingListItem[]
  canCreateNew: boolean
}

export function searchIngredientSources(
  query: string,
  ingredients: Ingredient[],
  shoppingListItems: ShoppingListItem[]
): IngredientSearchResult {
  const trimmed = query.trim()
  if (trimmed === '') {
    return { haveMatches: [], onListMatches: [], canCreateNew: false }
  }

  const normalized = trimmed.toLowerCase()
  const haveMatches = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(normalized)
  )
  const onListMatches = shoppingListItems.filter((item) =>
    item.name.toLowerCase().includes(normalized)
  )
  const hasExactMatch =
    haveMatches.some(
      (ingredient) => ingredient.name.toLowerCase() === normalized
    ) ||
    onListMatches.some((item) => item.name.toLowerCase() === normalized)

  return {
    haveMatches,
    onListMatches,
    canCreateNew: !hasExactMatch,
  }
}
