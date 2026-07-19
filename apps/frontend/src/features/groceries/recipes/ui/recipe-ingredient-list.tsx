import { XIcon } from 'lucide-react'
import { useKitchenStore } from '../../state/kitchen-store'
import {
  useShoppingListStore,
  type ShoppingListItem,
} from '../../state/shopping-list-store'
import type { Ingredient, Quantity, Recipe, RecipeIngredient } from '../../types'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

function sourceKey(entry: RecipeIngredient): string {
  return entry.source.kind === 'kitchen'
    ? `kitchen:${entry.source.ingredientId}`
    : `shopping-list:${entry.source.shoppingListItemId}`
}

function resolveName(
  entry: RecipeIngredient,
  ingredients: Ingredient[],
  shoppingListItems: ShoppingListItem[]
): string {
  const source = entry.source
  if (source.kind === 'kitchen') {
    const ingredientId = source.ingredientId
    return (
      ingredients.find((ingredient) => ingredient.id === ingredientId)
        ?.name ?? 'Unknown ingredient'
    )
  }
  const shoppingListItemId = source.shoppingListItemId
  return (
    shoppingListItems.find((item) => item.id === shoppingListItemId)?.name ??
    'Unknown item'
  )
}

export function RecipeIngredientList({ recipe }: { recipe: Recipe }) {
  const ingredients = useKitchenStore((state) => state.ingredients)
  const shoppingListItems = useShoppingListStore((state) => state.items)
  const updateQuantity = useKitchenStore(
    (state) => state.updateRecipeIngredientQuantity
  )
  const removeIngredient = useKitchenStore(
    (state) => state.removeRecipeIngredient
  )

  return (
    <section className="space-y-2">
      <Label>Ingredients</Label>
      {recipe.ingredients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ingredients yet.</p>
      ) : (
        <ul className="divide-y divide-border rounded-3xl border">
          {recipe.ingredients.map((entry) => {
            const name = resolveName(entry, ingredients, shoppingListItems)
            return (
              <li key={sourceKey(entry)} className="space-y-2 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {name}
                    </p>
                    <Badge
                      variant={
                        entry.source.kind === 'kitchen' ? 'secondary' : 'outline'
                      }
                    >
                      {entry.source.kind === 'kitchen'
                        ? 'In kitchen'
                        : 'On list'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${name}`}
                    onClick={() => removeIngredient(recipe.id, entry.source)}
                  >
                    <XIcon />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    aria-label={`${name} amount`}
                    type="number"
                    min={0}
                    step="any"
                    className="h-8 w-16 text-center"
                    value={entry.needed.amount}
                    onChange={(event) => {
                      const amount = Number(event.target.value)
                      if (Number.isFinite(amount) && amount >= 0) {
                        const needed: Quantity = { ...entry.needed, amount }
                        updateQuantity(recipe.id, entry.source, needed)
                      }
                    }}
                  />
                  <Input
                    aria-label={`${name} unit`}
                    className="h-8 w-20"
                    value={entry.needed.unit}
                    onChange={(event) => {
                      const needed: Quantity = {
                        ...entry.needed,
                        unit: event.target.value,
                      }
                      updateQuantity(recipe.id, entry.source, needed)
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
