import { useGroceryStore } from '../../state/grocery-store'
import type { Recipe } from '../../types'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function RecipeNameField({ recipe }: { recipe: Recipe }) {
  const updateRecipe = useGroceryStore((state) => state.updateRecipe)

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
