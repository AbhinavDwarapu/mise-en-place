import type { CategoryGroup } from '../../logic/categories'
import type { ShoppingListItem } from '../../state/shopping-list-store'
import type { StoreItemStatus } from '../state/store-session-store'

export type Aisle = CategoryGroup<ShoppingListItem>

export function pendingCount(
  items: ShoppingListItem[],
  statuses: Record<string, StoreItemStatus>
): number {
  return items.filter((item) => statuses[item.id] === undefined).length
}
