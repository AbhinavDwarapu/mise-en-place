import { sourceEquals } from '../../logic/recipe-usage'
import { useKitchenStore } from '../../state/kitchen-store'
import { useShoppingListStore } from '../../state/shopping-list-store'
import { useStoreSessionStore } from '../state/store-session-store'
import { Button } from '@/shared/ui/button'

export function CompleteShopButton({ onComplete }: { onComplete: () => void }) {
  const items = useShoppingListStore((state) => state.items)
  const removeItem = useShoppingListStore((state) => state.removeItem)
  const statuses = useStoreSessionStore((state) => state.statuses)
  const clearSession = useStoreSessionStore((state) => state.clear)

  const moveIntoKitchen = (item: (typeof items)[number]) => {
    const {
      ingredients,
      recipes,
      addIngredient,
      updateIngredient,
      addRecipeIngredient,
      removeRecipeIngredient,
    } = useKitchenStore.getState()

    const existing = ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === item.name.toLowerCase()
    )
    const ingredient = existing ?? addIngredient(item.name)
    if (!existing) {
      updateIngredient(ingredient.id, { quantity: item.quantity })
    }

    const listSource = {
      kind: 'shopping-list' as const,
      shoppingListItemId: item.id,
    }
    const kitchenSource = {
      kind: 'kitchen' as const,
      ingredientId: ingredient.id,
    }
    for (const recipe of recipes) {
      for (const entry of recipe.ingredients) {
        if (sourceEquals(entry.source, listSource)) {
          removeRecipeIngredient(recipe.id, listSource)
          addRecipeIngredient(recipe.id, kitchenSource, entry.needed)
        }
      }
    }
  }

  const completeShop = () => {
    const checkedItems = items.filter(
      (item) => statuses[item.id] === 'checked'
    )
    for (const item of checkedItems) {
      moveIntoKitchen(item)
      removeItem(item.id)
    }
    clearSession()
    onComplete()
  }

  return (
    <Button className="w-full" size="lg" onClick={completeShop}>
      Complete shop
    </Button>
  )
}
