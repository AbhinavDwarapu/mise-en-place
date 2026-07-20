import type { CategoryGroup } from '../../logic/categories'
import type { GroceryItem } from '../../types'
import type { StoreItemStatus } from '../state/store-session-store'

export type Aisle = CategoryGroup<GroceryItem>

export function pendingCount(
  items: GroceryItem[],
  statuses: Record<string, StoreItemStatus>
): number {
  return items.filter((item) => statuses[item.id] === undefined).length
}
