import { beforeEach, describe, expect, it } from 'vitest'
import { useKitchenStore } from '../../state/kitchen-store'
import { useShoppingListStore } from '../../state/shopping-list-store'
import { addIdeaToThisWeek } from './add-idea'

beforeEach(() => {
  useKitchenStore.setState(useKitchenStore.getInitialState(), true)
  useShoppingListStore.setState(useShoppingListStore.getInitialState(), true)
})

function findRecipe(id: string) {
  return useKitchenStore.getState().recipes.find((recipe) => recipe.id === id)
}

describe('addIdeaToThisWeek', () => {
  it('creates a this-week recipe linked to the matching kitchen ingredients', () => {
    const spinach = useKitchenStore.getState().addIngredient('Spinach')
    const yogurt = useKitchenStore.getState().addIngredient('Yogurt')

    const recipe = addIdeaToThisWeek(
      {
        name: 'Saag-style greens',
        usedIngredients: ['Spinach', 'yogurt'],
        extraIngredients: [],
      },
      '#86efac'
    )

    const stored = findRecipe(recipe.id)
    expect(stored?.name).toBe('Saag-style greens')
    expect(stored?.cookingThisWeek).toBe(true)
    expect(stored?.color).toBe('#86efac')
    expect(stored?.ingredients.map((entry) => entry.source)).toEqual([
      { kind: 'kitchen', ingredientId: spinach.id },
      { kind: 'kitchen', ingredientId: yogurt.id },
    ])
  })

  it('puts extras on the shopping list and links them to the recipe', () => {
    const recipe = addIdeaToThisWeek(
      { name: 'Yogurt flatbreads', usedIngredients: [], extraIngredients: ['flour'] },
      '#fcd34d'
    )

    const flour = useShoppingListStore
      .getState()
      .items.find((item) => item.name === 'flour')
    expect(flour).toBeDefined()
    expect(findRecipe(recipe.id)?.ingredients.map((entry) => entry.source)).toEqual([
      { kind: 'shopping-list', shoppingListItemId: flour?.id },
    ])
  })

  it('reuses a shopping-list item that already has the same name', () => {
    const existing = useShoppingListStore
      .getState()
      .addItem('flour', { amount: 1, unit: 'unit' })

    const recipe = addIdeaToThisWeek(
      { name: 'Flatbreads', usedIngredients: [], extraIngredients: ['Flour'] },
      '#fcd34d'
    )

    const flourItems = useShoppingListStore
      .getState()
      .items.filter((item) => item.name.toLowerCase() === 'flour')
    expect(flourItems).toHaveLength(1)
    expect(findRecipe(recipe.id)?.ingredients.map((entry) => entry.source)).toEqual([
      { kind: 'shopping-list', shoppingListItemId: existing.id },
    ])
  })
})
