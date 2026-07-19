import { MinusIcon, PlusIcon } from 'lucide-react'
import { COUNT_UNIT } from '../../state/kitchen-constants'
import { useKitchenStore } from '../../state/kitchen-store'
import type { Ingredient, Quantity } from '../../types'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function IngredientQuantityField({
  ingredient,
}: {
  ingredient: Ingredient
}) {
  const updateIngredient = useKitchenStore((state) => state.updateIngredient)

  const updateQuantity = (changes: Partial<Quantity>) =>
    updateIngredient(ingredient.id, {
      quantity: { ...ingredient.quantity, ...changes },
    })

  return (
    <section className="space-y-2">
      <Label htmlFor="ingredient-amount">Quantity</Label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Decrease amount"
          onClick={() =>
            updateQuantity({
              amount: Math.max(1, ingredient.quantity.amount - 1),
            })
          }
        >
          <MinusIcon />
        </Button>
        <Input
          id="ingredient-amount"
          type="number"
          min={0}
          step="any"
          className="w-20 text-center"
          value={ingredient.quantity.amount}
          onChange={(event) => {
            const amount = Number(event.target.value)
            if (Number.isFinite(amount) && amount > 0) {
              updateQuantity({ amount })
            }
          }}
        />
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Increase amount"
          onClick={() =>
            updateQuantity({ amount: ingredient.quantity.amount + 1 })
          }
        >
          <PlusIcon />
        </Button>
        <Input
          aria-label="Unit"
          placeholder="count"
          className="w-24"
          value={
            ingredient.quantity.unit === COUNT_UNIT
              ? ''
              : ingredient.quantity.unit
          }
          onChange={(event) => {
            const unit = event.target.value
            updateQuantity({ unit: unit.trim() === '' ? COUNT_UNIT : unit })
          }}
        />
      </div>
    </section>
  )
}
