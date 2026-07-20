import { XIcon } from 'lucide-react'
import { COUNT_UNIT } from '../../state/grocery-constants'
import { useGroceryStore } from '../../state/grocery-store'
import type { Quantity, Recipe } from '../../types'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function RecipeIngredientList({ recipe }: { recipe: Recipe }) {
  const items = useGroceryStore((state) => state.items)
  const updateQuantity = useGroceryStore(
    (state) => state.updateRecipeIngredientQuantity
  )
  const removeIngredient = useGroceryStore(
    (state) => state.removeRecipeIngredient
  )

  return (
    <section className="space-y-2">
      <Label>Ingredients</Label>
      {recipe.ingredients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ingredients yet.</p>
      ) : (
        <ul className="divide-y divide-border rounded-3xl border">
          {recipe.ingredients.map((entry) => {
            const item = items.find((candidate) => candidate.id === entry.itemId)
            const name = item?.name ?? 'Unknown item'
            const inKitchen = item?.location === 'kitchen'
            return (
              <li key={entry.itemId} className="space-y-2 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {name}
                    </p>
                    <Badge variant={inKitchen ? 'secondary' : 'outline'}>
                      {inKitchen ? 'In kitchen' : 'On list'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${name}`}
                    onClick={() => removeIngredient(recipe.id, entry.itemId)}
                  >
                    <XIcon />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    aria-label={`${name} amount`}
                    type="number"
                    min={0}
                    step="any"
                    className="h-8 w-16 text-center"
                    value={entry.needed.amount}
                    onChange={(event) => {
                      const amount = Number(event.target.value)
                      if (Number.isFinite(amount) && amount >= 0) {
                        const needed: Quantity = { ...entry.needed, amount }
                        updateQuantity(recipe.id, entry.itemId, needed)
                      }
                    }}
                  />
                  <Input
                    aria-label={`${name} unit`}
                    placeholder={COUNT_UNIT}
                    className="h-8 w-20"
                    value={
                      entry.needed.unit === COUNT_UNIT ? '' : entry.needed.unit
                    }
                    onChange={(event) => {
                      const unit = event.target.value
                      const needed: Quantity = {
                        ...entry.needed,
                        unit: unit.trim() === '' ? COUNT_UNIT : unit,
                      }
                      updateQuantity(recipe.id, entry.itemId, needed)
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
