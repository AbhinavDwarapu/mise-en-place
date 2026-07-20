import { formatQuantity } from '../../logic/quantity'
import { quantityNeeded, recipesUsing } from '../../logic/recipe-usage'
import { useGroceryStore } from '../../state/grocery-store'
import type { GroceryItem } from '../../types'
import { Label } from '@/shared/ui/label'

export function IngredientUsedByList({
  ingredient,
}: {
  ingredient: GroceryItem
}) {
  const recipes = useGroceryStore((state) => state.recipes)
  const usedBy = recipesUsing(ingredient.id, recipes)

  if (usedBy.length === 0) return null

  return (
    <section className="space-y-2">
      <Label>Used by</Label>
      <ul className="divide-y divide-border rounded-3xl border">
        {usedBy.map((recipe) => {
          const needed = quantityNeeded(recipe, ingredient.id)
          return (
            <li key={recipe.id} className="flex items-center gap-2.5 px-3 py-2.5">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: recipe.color }}
              />
              <span className="flex-1 truncate text-sm font-medium text-foreground">
                {recipe.name}
              </span>
              {needed !== null && (
                <span className="text-sm text-muted-foreground">
                  needs {formatQuantity(needed)}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
