import { daysUntilExpiry, expiryLabel } from '../logic/expiration'
import { formatQuantity } from '../logic/quantity'
import { useKitchenStore } from '../state/kitchen-store'
import type { Ingredient } from '../types'

export function IngredientList() {
  const ingredients = useKitchenStore((state) => state.ingredients)

  if (ingredients.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-muted-foreground">
        Your kitchen is empty. Add your first ingredient below.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {ingredients.map((ingredient) => (
        <IngredientRow key={ingredient.id} ingredient={ingredient} />
      ))}
    </ul>
  )
}

function IngredientRow({ ingredient }: { ingredient: Ingredient }) {
  const label = expiryLabel(daysUntilExpiry(ingredient))

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">
          {ingredient.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatQuantity(ingredient.quantity)}
        </p>
      </div>
      {label !== null && <ExpiryChip label={label} />}
    </li>
  )
}

function ExpiryChip({ label }: { label: string }) {
  const urgent = label === 'Expired' || label === 'Expires today'
  return (
    <span
      className={
        urgent
          ? 'rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-destructive'
          : 'rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-amber-700'
      }
    >
      {label}
    </span>
  )
}
