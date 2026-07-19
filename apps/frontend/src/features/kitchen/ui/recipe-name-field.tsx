import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useKitchenStore } from '../state/kitchen-store'
import type { Recipe } from '../types'

export function RecipeNameField({ recipe }: { recipe: Recipe }) {
  const updateRecipe = useKitchenStore((state) => state.updateRecipe)

  return (
    <section className="space-y-2">
      <Label htmlFor="recipe-name">Name</Label>
      <Input
        id="recipe-name"
        value={recipe.name}
        onChange={(event) =>
          updateRecipe(recipe.id, { name: event.target.value })
        }
      />
    </section>
  )
}
