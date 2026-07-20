import { useKitchenStore } from '../../state/kitchen-store'
import type { Ingredient } from '../../types'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function IngredientNameField({ ingredient }: { ingredient: Ingredient }) {
  const updateIngredient = useKitchenStore((state) => state.updateIngredient)

  return (
    <section className="space-y-2">
      <Label htmlFor="ingredient-name">Name</Label>
      <Input
        id="ingredient-name"
        value={ingredient.name}
        onChange={(event) =>
          updateIngredient(ingredient.id, { name: event.target.value })
        }
      />
    </section>
  )
}
