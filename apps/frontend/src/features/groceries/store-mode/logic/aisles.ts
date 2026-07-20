import { INGREDIENT_CATEGORIES } from '../../state/kitchen-constants'
import type { ShoppingListItem } from '../../state/shopping-list-store'
import type { IngredientCategory } from '../../types'
import type { StoreItemStatus } from '../state/store-session-store'

export interface Aisle {
  category: IngredientCategory
  items: ShoppingListItem[]
}

export function groupItemsByAisle(
  items: ShoppingListItem[],
  categoryFor: (name: string) => IngredientCategory
): Aisle[] {
  return INGREDIENT_CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => categoryFor(item.name) === category),
  })).filter((aisle) => aisle.items.length > 0)
}

export function pendingCount(
  items: ShoppingListItem[],
  statuses: Record<string, StoreItemStatus>
): number {
  return items.filter((item) => statuses[item.id] === undefined).length
}
