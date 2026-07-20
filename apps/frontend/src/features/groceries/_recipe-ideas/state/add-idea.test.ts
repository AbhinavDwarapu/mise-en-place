import { beforeEach, describe, expect, it } from 'vitest'
import { useGroceryStore } from '../../state/grocery-store'
import { addIdeaToThisWeek } from './add-idea'

beforeEach(() => {
  useGroceryStore.setState(useGroceryStore.getInitialState(), true)
})

function findRecipe(id: string) {
  return useGroceryStore.getState().recipes.find((recipe) => recipe.id === id)
}

function listItems() {
  return useGroceryStore
    .getState()
    .items.filter((item) => item.location === 'shopping-list')
}

describe('addIdeaToThisWeek', () => {
  it('creates a this-week recipe linked to the matching kitchen items', () => {
    const spinach = useGroceryStore.getState().addItem('Spinach', 'kitchen')
    const yogurt = useGroceryStore.getState().addItem('Yogurt', 'kitchen')

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
    expect(stored?.ingredients.map((entry) => entry.itemId)).toEqual([
      spinach.id,
      yogurt.id,
    ])
  })

  it('puts extras on the shopping list and links them to the recipe', () => {
    const recipe = addIdeaToThisWeek(
      {
        name: 'Yogurt flatbreads',
        usedIngredients: [],
        extraIngredients: ['flour'],
      },
      '#fcd34d'
    )

    const flour = listItems().find((item) => item.name === 'flour')
    expect(flour).toBeDefined()
    expect(findRecipe(recipe.id)?.ingredients.map((entry) => entry.itemId)).toEqual(
      [flour?.id]
    )
  })

  it('reuses a shopping-list item that already has the same name', () => {
    const existing = useGroceryStore
      .getState()
      .addItem('flour', 'shopping-list')

    const recipe = addIdeaToThisWeek(
      { name: 'Flatbreads', usedIngredients: [], extraIngredients: ['Flour'] },
      '#fcd34d'
    )

    const flourItems = listItems().filter(
      (item) => item.name.toLowerCase() === 'flour'
    )
    expect(flourItems).toHaveLength(1)
    expect(findRecipe(recipe.id)?.ingredients.map((entry) => entry.itemId)).toEqual(
      [existing.id]
    )
  })
})
