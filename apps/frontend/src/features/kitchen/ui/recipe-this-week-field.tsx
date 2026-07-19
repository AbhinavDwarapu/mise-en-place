import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { useKitchenStore } from '../state/kitchen-store'
import type { Recipe } from '../types'

export function RecipeThisWeekField({ recipe }: { recipe: Recipe }) {
  const updateRecipe = useKitchenStore((state) => state.updateRecipe)

  return (
    <section className="space-y-2">
      <Label htmlFor="recipe-this-week">This week</Label>
      <Button
        id="recipe-this-week"
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
