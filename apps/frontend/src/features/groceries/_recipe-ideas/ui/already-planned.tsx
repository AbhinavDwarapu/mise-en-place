import { useGroceryStore } from '../../state/grocery-store'
import type { GroceryItem } from '../../types'
import { plannedOverlaps } from '../logic/planned-overlap'
import { Button } from '@/shared/ui/button'

export function AlreadyPlanned({ selected }: { selected: GroceryItem[] }) {
  const recipes = useGroceryStore((state) => state.recipes)
  const updateRecipe = useGroceryStore((state) => state.updateRecipe)
  const overlaps = plannedOverlaps(recipes, selected)

  if (overlaps.length === 0) return null

  return (
    <section className="space-y-2">
      {overlaps.map(({ recipe, ingredientNames }) => (
        <div
          key={recipe.id}
          className="flex items-center gap-3 rounded-2xl border border-border p-3"
        >
          <span
            className="size-10 shrink-0 rounded-xl"
            style={{ backgroundColor: recipe.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              Or: your {recipe.name} already uses{' '}
              {ingredientNames.join(' + ')}
            </p>
            {recipe.cookingThisWeek && (
              <p className="text-xs text-muted-foreground">
                Already planned for this week
              </p>
            )}
          </div>
          {!recipe.cookingThisWeek && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateRecipe(recipe.id, { cookingThisWeek: true })}
            >
              Add to this week
            </Button>
          )}
        </div>
      ))}
    </section>
  )
}
