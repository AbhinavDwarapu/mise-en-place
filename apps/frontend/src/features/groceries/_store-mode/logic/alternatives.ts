import type { GroceryItem } from '../../types'

export function alternativesFor(
  itemName: string,
  items: GroceryItem[]
): string[] {
  const normalized = itemName.trim().toLowerCase()
  const match = items.find(
    (item) =>
      item.location === 'kitchen' && item.name.toLowerCase() === normalized
  )
  return match?.substitutions ?? []
}
