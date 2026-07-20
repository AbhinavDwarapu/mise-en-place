import { useGroceryStore } from '../../state/grocery-store'
import type { GroceryItem } from '../../types'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function IngredientNameField({ ingredient }: { ingredient: GroceryItem }) {
  const updateItem = useGroceryStore((state) => state.updateItem)

  return (
    <section className="space-y-2">
      <Label htmlFor="ingredient-name">Name</Label>
      <Input
        id="ingredient-name"
        value={ingredient.name}
        onChange={(event) =>
          updateItem(ingredient.id, { name: event.target.value })
        }
      />
    </section>
  )
}
