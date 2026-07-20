import { categoryFor } from '../../logic/categories'
import { useCategoryCacheStore } from '../../state/category-cache-store'
import { INGREDIENT_CATEGORIES } from '../../state/grocery-constants'
import type { GroceryItem, IngredientCategory } from '../../types'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

export function IngredientCategoryField({
  ingredient,
}: {
  ingredient: GroceryItem
}) {
  const categories = useCategoryCacheStore((state) => state.categories)
  const setCategories = useCategoryCacheStore((state) => state.setCategories)

  return (
    <section className="space-y-2">
      <Label htmlFor="ingredient-category">Category</Label>
      <Select
        value={categoryFor(ingredient.name, categories)}
        onValueChange={(value) =>
          setCategories({ [ingredient.name]: value as IngredientCategory })
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
