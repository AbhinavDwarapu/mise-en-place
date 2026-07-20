import { MinusIcon, PlusIcon } from 'lucide-react'
import { useKitchenStore } from '../../state/kitchen-store'
import type { Recipe } from '../../types'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function RecipeServingsField({ recipe }: { recipe: Recipe }) {
  const updateRecipe = useKitchenStore((state) => state.updateRecipe)

  const setServings = (servings: number) =>
    updateRecipe(recipe.id, { servings })

  return (
    <section className="space-y-2">
      <Label htmlFor="recipe-servings">Servings</Label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Decrease servings"
          onClick={() => setServings(Math.max(1, recipe.servings - 1))}
        >
          <MinusIcon />
        </Button>
        <Input
          id="recipe-servings"
          type="number"
          min={1}
          step="1"
          className="w-20 text-center"
          value={recipe.servings}
          onChange={(event) => {
            const servings = Number(event.target.value)
            if (Number.isFinite(servings) && servings > 0) {
              setServings(servings)
            }
          }}
        />
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Increase servings"
          onClick={() => setServings(recipe.servings + 1)}
        >
          <PlusIcon />
        </Button>
      </div>
    </section>
  )
}
