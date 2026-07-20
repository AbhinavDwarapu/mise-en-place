import { useGroceryStore } from '../../state/grocery-store'
import type { Recipe } from '../../types'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'

export function RecipeNotesField({ recipe }: { recipe: Recipe }) {
  const updateRecipe = useGroceryStore((state) => state.updateRecipe)

  return (
    <section className="space-y-2">
      <Label htmlFor="recipe-notes">Notes</Label>
      <Textarea
        id="recipe-notes"
        value={recipe.notes ?? ''}
        placeholder="Tweaks, timings, who liked it…"
        onChange={(event) =>
          updateRecipe(recipe.id, { notes: event.target.value })
        }
      />
    </section>
  )
}
