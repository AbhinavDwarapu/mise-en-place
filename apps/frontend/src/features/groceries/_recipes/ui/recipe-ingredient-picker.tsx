import { useState } from 'react'
import { searchIngredientSources } from '../../logic/ingredient-picker'
import { sourceEquals } from '../../logic/recipe-usage'
import { COUNT_UNIT } from '../../state/kitchen-constants'
import { useKitchenStore } from '../../state/kitchen-store'
import {
  useShoppingListStore,
  type ShoppingListItem,
} from '../../state/shopping-list-store'
import type {
  Ingredient,
  Recipe,
  RecipeIngredientSource,
} from '../../types'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

const DEFAULT_QUANTITY = { amount: 1, unit: COUNT_UNIT }

export function RecipeIngredientPicker({ recipe }: { recipe: Recipe }) {
  const [query, setQuery] = useState('')
  const ingredients = useKitchenStore((state) => state.ingredients)
  const shoppingListItems = useShoppingListStore((state) => state.items)
  const addShoppingListItem = useShoppingListStore((state) => state.addItem)
  const addRecipeIngredient = useKitchenStore(
    (state) => state.addRecipeIngredient
  )

  const alreadyInRecipe = (source: RecipeIngredientSource) =>
    recipe.ingredients.some((entry) => sourceEquals(entry.source, source))

  const results = searchIngredientSources(query, ingredients, shoppingListItems)
  const haveMatches = results.haveMatches.filter(
    (ingredient) =>
      !alreadyInRecipe({ kind: 'kitchen', ingredientId: ingredient.id })
  )
  const onListMatches = results.onListMatches.filter(
    (item) =>
      !alreadyInRecipe({ kind: 'shopping-list', shoppingListItemId: item.id })
  )
  const hasResults =
    haveMatches.length > 0 || onListMatches.length > 0 || results.canCreateNew

  const selectKitchen = (ingredient: Ingredient) => {
    addRecipeIngredient(
      recipe.id,
      { kind: 'kitchen', ingredientId: ingredient.id },
      DEFAULT_QUANTITY
    )
    setQuery('')
  }

  const selectShoppingList = (item: ShoppingListItem) => {
    addRecipeIngredient(
      recipe.id,
      { kind: 'shopping-list', shoppingListItemId: item.id },
      DEFAULT_QUANTITY
    )
    setQuery('')
  }

  const createNew = () => {
    const trimmed = query.trim()
    if (trimmed === '') return
    const item = addShoppingListItem(trimmed, DEFAULT_QUANTITY)
    addRecipeIngredient(
      recipe.id,
      { kind: 'shopping-list', shoppingListItemId: item.id },
      DEFAULT_QUANTITY
    )
    setQuery('')
  }

  return (
    <section className="space-y-2">
      <Label htmlFor="recipe-ingredient-search">Add ingredient</Label>
      <Input
        id="recipe-ingredient-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search or add an ingredient…"
      />
      {query.trim() !== '' && hasResults && (
        <ul className="divide-y divide-border rounded-3xl border">
          {haveMatches.map((ingredient) => (
            <li key={ingredient.id}>
              <button
                type="button"
                onClick={() => selectKitchen(ingredient)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-muted/50 active:bg-muted"
              >
                <span className="truncate text-sm font-medium text-foreground">
                  {ingredient.name}
                </span>
                <Badge variant="secondary">In kitchen</Badge>
              </button>
            </li>
          ))}
          {onListMatches.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => selectShoppingList(item)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-muted/50 active:bg-muted"
              >
                <span className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </span>
                <Badge variant="outline">On list</Badge>
              </button>
            </li>
          ))}
          {results.canCreateNew && (
            <li>
              <button
                type="button"
                onClick={createNew}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-muted/50 active:bg-muted"
              >
                <span className="truncate text-sm font-medium text-foreground">
                  &ldquo;{query.trim()}&rdquo;
                </span>
                <Badge>Create new</Badge>
              </button>
            </li>
          )}
        </ul>
      )}
    </section>
  )
}
