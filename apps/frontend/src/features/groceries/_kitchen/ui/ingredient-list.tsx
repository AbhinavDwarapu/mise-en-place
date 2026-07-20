import { groupByCategory } from '../../logic/categories'
import { daysUntilExpiry, expiryLabel } from '../../logic/expiration'
import { formatQuantity } from '../../logic/quantity'
import { useGroceryStore } from '../../state/grocery-store'
import { useLlmCategories } from '../../state/use-llm-categories'
import type { GroceryItem } from '../../types'

export function IngredientList({
  onSelect,
}: {
  onSelect: (id: string) => void
}) {
  const items = useGroceryStore((state) => state.items)
  const ingredients = items.filter((item) => item.location === 'kitchen')
  const categoryFor = useLlmCategories(
    ingredients.map((ingredient) => ingredient.name)
  )

  if (ingredients.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-muted-foreground">
        Your kitchen is empty. Add your first ingredient below.
      </p>
    )
  }

  const groups = groupByCategory(ingredients, categoryFor)

  return (
    <div>
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="px-4 pt-3 pb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {group.category}
          </h2>
          <ul className="divide-y divide-border">
            {group.items.map((ingredient) => (
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
  ingredient: GroceryItem
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
