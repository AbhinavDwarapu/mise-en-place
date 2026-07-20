import type { GroceryItem } from '../types'

export interface GroceryItemSearchResult {
  inKitchen: GroceryItem[]
  onList: GroceryItem[]
  canCreateNew: boolean
}

export function searchGroceryItems(
  query: string,
  items: GroceryItem[]
): GroceryItemSearchResult {
  const trimmed = query.trim()
  if (trimmed === '') {
    return { inKitchen: [], onList: [], canCreateNew: false }
  }

  const normalized = trimmed.toLowerCase()
  const matches = items.filter((item) =>
    item.name.toLowerCase().includes(normalized)
  )

  return {
    inKitchen: matches.filter((item) => item.location === 'kitchen'),
    onList: matches.filter((item) => item.location === 'shopping-list'),
    canCreateNew: !matches.some(
      (item) => item.name.toLowerCase() === normalized
    ),
  }
}
