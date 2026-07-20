import { useState, type ReactNode } from 'react'
import { searchGroceryItems } from '../../logic/item-search'
import { recipesUsing } from '../../logic/recipe-usage'
import { useGroceryStore } from '../../state/grocery-store'
import type { GroceryItem } from '../../types'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'

export function AddShoppingListItemInput() {
  const [query, setQuery] = useState('')
  const items = useGroceryStore((state) => state.items)
  const recipes = useGroceryStore((state) => state.recipes)
  const addItem = useGroceryStore((state) => state.addItem)
  const updateItem = useGroceryStore((state) => state.updateItem)

  const results = searchGroceryItems(query, items)
  const hasResults =
    results.inKitchen.length > 0 ||
    results.onList.length > 0 ||
    results.canCreateNew

  const neededBy = (itemId: string) =>
    recipesUsing(itemId, recipes)
      .map((recipe) => recipe.name)
      .join(', ')

  const addFromKitchen = (ingredient: GroceryItem) => {
    addItem(ingredient.name, 'shopping-list', ingredient.quantity)
    setQuery('')
  }

  const addMore = (item: GroceryItem) => {
    updateItem(item.id, {
      quantity: { ...item.quantity, amount: item.quantity.amount + 1 },
    })
    setQuery('')
  }

  const createNew = () => {
    const trimmed = query.trim()
    if (trimmed === '') return
    addItem(trimmed, 'shopping-list')
    setQuery('')
  }

  return (
    <section className="space-y-2 px-4 pb-3">
      <Input
        aria-label="Add item"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search or add an item…"
      />
      {query.trim() !== '' && hasResults && (
        <ul className="divide-y divide-border rounded-3xl border">
          {results.inKitchen.map((ingredient) => (
            <SearchRow
              key={ingredient.id}
              name={ingredient.name}
              badge={<Badge variant="secondary">In kitchen</Badge>}
              neededBy={neededBy(ingredient.id)}
              onSelect={() => addFromKitchen(ingredient)}
            />
          ))}
          {results.onList.map((item) => (
            <SearchRow
              key={item.id}
              name={item.name}
              badge={<Badge variant="outline">On list</Badge>}
              neededBy={neededBy(item.id)}
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
