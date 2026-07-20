import { daysUntilExpiry, expiryLabel } from '../../logic/expiration'
import { formatQuantity } from '../../logic/quantity'
import { useKitchenStore } from '../../state/kitchen-store'
import type { Ingredient } from '../../types'
import { groupIngredientsByCategory } from '../logic/group-by-category'

export function IngredientList({
  onSelect,
}: {
  onSelect: (id: string) => void
}) {
  const ingredients = useKitchenStore((state) => state.ingredients)

  if (ingredients.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-muted-foreground">
        Your kitchen is empty. Add your first ingredient below.
      </p>
    )
  }

  const groups = groupIngredientsByCategory(ingredients)

  return (
    <div>
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="px-4 pt-3 pb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {group.category}
          </h2>
          <ul className="divide-y divide-border">
            {group.ingredients.map((ingredient) => (
              <IngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                onSelect={() => onSelect(ingredient.id)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function IngredientRow({
  ingredient,
  onSelect,
}: {
  ingredient: Ingredient
  onSelect: () => void
}) {
  const label = expiryLabel(daysUntilExpiry(ingredient))

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
      >
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">
            {ingredient.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatQuantity(ingredient.quantity)}
          </p>
        </div>
        {label !== null && <ExpiryChip label={label} />}
      </button>
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
