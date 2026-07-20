import { useGroceryStore } from '../../state/grocery-store'
import type { Recipe } from '../../types'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'

export function RecipeThisWeekField({ recipe }: { recipe: Recipe }) {
  const updateRecipe = useGroceryStore((state) => state.updateRecipe)

  return (
    <section className="space-y-2">
      <Label>This week</Label>
      <Button
        type="button"
        variant={recipe.cookingThisWeek ? 'default' : 'outline'}
        onClick={() =>
          updateRecipe(recipe.id, {
            cookingThisWeek: !recipe.cookingThisWeek,
          })
        }
      >
        {recipe.cookingThisWeek ? 'Cooking this week' : 'Add to this week'}
      </Button>
    </section>
  )
}
