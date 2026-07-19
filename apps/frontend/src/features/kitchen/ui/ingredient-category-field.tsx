import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { INGREDIENT_CATEGORIES } from '../state/constants'
import { useKitchenStore } from '../state/kitchen-store'
import type { Ingredient, IngredientCategory } from '../types'

export function IngredientCategoryField({
  ingredient,
}: {
  ingredient: Ingredient
}) {
  const updateIngredient = useKitchenStore((state) => state.updateIngredient)

  return (
    <section className="space-y-2">
      <Label htmlFor="ingredient-category">Category</Label>
      <Select
        value={ingredient.category}
        onValueChange={(value) =>
          updateIngredient(ingredient.id, {
            category: value as IngredientCategory,
          })
        }
      >
        <SelectTrigger id="ingredient-category" className="w-full">
          <SelectValue className="capitalize" />
        </SelectTrigger>
        <SelectContent>
          {INGREDIENT_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category} className="capitalize">
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  )
}
