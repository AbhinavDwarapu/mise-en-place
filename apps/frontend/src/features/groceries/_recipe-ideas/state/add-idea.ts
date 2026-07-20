import type { RecipeIdea } from '../../boundary/suggestions-api'
import { COUNT_UNIT } from '../../state/kitchen-constants'
import { useKitchenStore } from '../../state/kitchen-store'
import { useShoppingListStore } from '../../state/shopping-list-store'
import type { Recipe } from '../../types'

const DEFAULT_QUANTITY = { amount: 1, unit: COUNT_UNIT }

export function addIdeaToThisWeek(idea: RecipeIdea, color: string): Recipe {
  const kitchen = useKitchenStore.getState()
  const shoppingList = useShoppingListStore.getState()

  const recipe = kitchen.addRecipe(idea.name)
  kitchen.updateRecipe(recipe.id, { cookingThisWeek: true, color })

  for (const name of idea.usedIngredients) {
    const ingredient = kitchen.ingredients.find(
      (entry) => entry.name.toLowerCase() === name.toLowerCase()
    )
    if (ingredient !== undefined) {
      kitchen.addRecipeIngredient(
        recipe.id,
        { kind: 'kitchen', ingredientId: ingredient.id },
        DEFAULT_QUANTITY
      )
    }
  }

  for (const name of idea.extraIngredients) {
    const existing = shoppingList.items.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    )
    const item = existing ?? shoppingList.addItem(name, DEFAULT_QUANTITY)
    kitchen.addRecipeIngredient(
      recipe.id,
      { kind: 'shopping-list', shoppingListItemId: item.id },
      DEFAULT_QUANTITY
    )
  }

  return recipe
}
