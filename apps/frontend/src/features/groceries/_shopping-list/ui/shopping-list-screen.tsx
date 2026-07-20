import { AddShoppingListItemInput } from './add-shopping-list-item-input'
import { ShoppingList } from './shopping-list'

export function ShoppingListScreen() {
  return (
    <section className="py-3">
      <h2 className="px-4 pb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Shopping list
      </h2>
      <AddShoppingListItemInput />
      <ShoppingList />
    </section>
  )
}
