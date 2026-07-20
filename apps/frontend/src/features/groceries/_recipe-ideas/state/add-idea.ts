import type { RecipeIdea } from '../../boundary/suggestions-api'
import { COUNT_UNIT } from '../../state/grocery-constants'
import { useGroceryStore } from '../../state/grocery-store'
import type { Recipe } from '../../types'

const DEFAULT_QUANTITY = { amount: 1, unit: COUNT_UNIT }

export function addIdeaToThisWeek(idea: RecipeIdea, color: string): Recipe {
  const store = useGroceryStore.getState()

  const recipe = store.addRecipe(idea.name)
  store.updateRecipe(recipe.id, { cookingThisWeek: true, color })

  for (const name of idea.usedIngredients) {
    const inKitchen = store.items.find(
      (item) =>
        item.location === 'kitchen' &&
        item.name.toLowerCase() === name.toLowerCase()
    )
    if (inKitchen !== undefined) {
      store.addRecipeIngredient(recipe.id, inKitchen.id, DEFAULT_QUANTITY)
    }
  }

  for (const name of idea.extraIngredients) {
    const onList = store.items.find(
      (item) =>
        item.location === 'shopping-list' &&
        item.name.toLowerCase() === name.toLowerCase()
    )
    const item = onList ?? store.addItem(name, 'shopping-list')
    store.addRecipeIngredient(recipe.id, item.id, DEFAULT_QUANTITY)
  }

  return recipe
}
