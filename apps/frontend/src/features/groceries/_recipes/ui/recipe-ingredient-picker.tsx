import { useState } from 'react'
import { searchGroceryItems } from '../../logic/item-search'
import { COUNT_UNIT } from '../../state/grocery-constants'
import { useGroceryStore } from '../../state/grocery-store'
import type { GroceryItem, Recipe } from '../../types'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

const DEFAULT_QUANTITY = { amount: 1, unit: COUNT_UNIT }

export function RecipeIngredientPicker({ recipe }: { recipe: Recipe }) {
  const [query, setQuery] = useState('')
  const items = useGroceryStore((state) => state.items)
  const addItem = useGroceryStore((state) => state.addItem)
  const addRecipeIngredient = useGroceryStore(
    (state) => state.addRecipeIngredient
  )

  const alreadyInRecipe = (itemId: string) =>
    recipe.ingredients.some((entry) => entry.itemId === itemId)

  const results = searchGroceryItems(query, items)
  const inKitchen = results.inKitchen.filter(
    (item) => !alreadyInRecipe(item.id)
  )
  const onList = results.onList.filter((item) => !alreadyInRecipe(item.id))
  const hasResults =
    inKitchen.length > 0 || onList.length > 0 || results.canCreateNew

  const select = (item: GroceryItem) => {
    addRecipeIngredient(recipe.id, item.id, DEFAULT_QUANTITY)
    setQuery('')
  }

  const createNew = () => {
    const trimmed = query.trim()
    if (trimmed === '') return
    const item = addItem(trimmed, 'shopping-list')
    addRecipeIngredient(recipe.id, item.id, DEFAULT_QUANTITY)
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
          {inKitchen.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => select(item)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-muted/50 active:bg-muted"
              >
                <span className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </span>
                <Badge variant="secondary">In kitchen</Badge>
              </button>
            </li>
          ))}
          {onList.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => select(item)}
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
