import { useState, type ReactNode } from 'react'
import { searchIngredientSources } from '../../logic/ingredient-picker'
import { recipesUsing } from '../../logic/recipe-usage'
import { COUNT_UNIT } from '../../state/kitchen-constants'
import { useKitchenStore } from '../../state/kitchen-store'
import {
  useShoppingListStore,
  type ShoppingListItem,
} from '../../state/shopping-list-store'
import type { Ingredient, RecipeIngredientSource } from '../../types'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

const DEFAULT_QUANTITY = { amount: 1, unit: COUNT_UNIT }

export function AddShoppingListItemInput() {
  const [query, setQuery] = useState('')
  const ingredients = useKitchenStore((state) => state.ingredients)
  const recipes = useKitchenStore((state) => state.recipes)
  const shoppingListItems = useShoppingListStore((state) => state.items)
  const addItem = useShoppingListStore((state) => state.addItem)
  const updateItemQuantity = useShoppingListStore(
    (state) => state.updateItemQuantity
  )

  const results = searchIngredientSources(
    query,
    ingredients,
    shoppingListItems
  )
  const hasResults =
    results.haveMatches.length > 0 ||
    results.onListMatches.length > 0 ||
    results.canCreateNew

  const neededBy = (source: RecipeIngredientSource) =>
    recipesUsing(source, recipes)
      .map((recipe) => recipe.name)
      .join(', ')

  const addFromKitchen = (ingredient: Ingredient) => {
    addItem(ingredient.name, ingredient.quantity)
    setQuery('')
  }

  const addMore = (item: ShoppingListItem) => {
    updateItemQuantity(item.id, {
      ...item.quantity,
      amount: item.quantity.amount + 1,
    })
    setQuery('')
  }

  const createNew = () => {
    const trimmed = query.trim()
    if (trimmed === '') return
    addItem(trimmed, DEFAULT_QUANTITY)
    setQuery('')
  }

  return (
    <section className="space-y-2 p-4">
      <Label htmlFor="shopping-list-search">Add item</Label>
      <Input
        id="shopping-list-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search or add an item…"
      />
      {query.trim() !== '' && hasResults && (
        <ul className="divide-y divide-border rounded-3xl border">
          {results.haveMatches.map((ingredient) => (
            <SearchRow
              key={ingredient.id}
              name={ingredient.name}
              badge={<Badge variant="secondary">In kitchen</Badge>}
              neededBy={neededBy({
                kind: 'kitchen',
                ingredientId: ingredient.id,
              })}
              onSelect={() => addFromKitchen(ingredient)}
            />
          ))}
          {results.onListMatches.map((item) => (
            <SearchRow
              key={item.id}
              name={item.name}
              badge={<Badge variant="outline">On list</Badge>}
              neededBy={neededBy({
                kind: 'shopping-list',
                shoppingListItemId: item.id,
              })}
              onSelect={() => addMore(item)}
            />
          ))}
          {results.canCreateNew && (
            <SearchRow
              name={`"${query.trim()}"`}
              badge={<Badge>Create new</Badge>}
              neededBy=""
              onSelect={createNew}
            />
          )}
        </ul>
      )}
    </section>
  )
}

function SearchRow({
  name,
  badge,
  neededBy,
  onSelect,
}: {
  name: string
  badge: ReactNode
  neededBy: string
  onSelect: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-muted/50 active:bg-muted"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            {name}
          </span>
          {neededBy !== '' && (
            <span className="block truncate text-xs text-muted-foreground">
              Needed by {neededBy}
            </span>
          )}
        </span>
        {badge}
      </button>
    </li>
  )
}
