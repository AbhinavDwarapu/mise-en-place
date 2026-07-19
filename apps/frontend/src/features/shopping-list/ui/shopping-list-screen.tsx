import { AddShoppingListItemInput } from './add-shopping-list-item-input'
import { ShoppingList } from './shopping-list'

export function ShoppingListScreen() {
  return (
    <>
      <ShoppingList />
      <AddShoppingListItemInput />
    </>
  )
}
