import { CheckIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { daysUntilExpiry } from '../../logic/expiration'
import { useKitchenStore } from '../../state/kitchen-store'
import type { Ingredient } from '../../types'
import { expiringFirst, shortExpiryLabel } from '../logic/expiring-first'
import { IdeaCards } from './idea-cards'
import { cn } from '@/shared/lib/utils'

const VISIBLE_CHIPS = 8

export function IdeasScreen() {
  const ingredients = useKitchenStore((state) => state.ingredients)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)

  const sorted = useMemo(() => expiringFirst(ingredients), [ingredients])
  const selectedNames = useMemo(
    () =>
      sorted
        .filter((ingredient) => selectedIds.includes(ingredient.id))
        .map((ingredient) => ingredient.name),
    [sorted, selectedIds]
  )
  const kitchenNames = useMemo(
    () => sorted.map((ingredient) => ingredient.name),
    [sorted]
  )

  if (ingredients.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-muted-foreground">
        Your kitchen is empty — add ingredients to get recipe ideas.
      </p>
    )
  }

  const visible = showAll ? sorted : sorted.slice(0, VISIBLE_CHIPS)
  const hiddenCount = sorted.length - visible.length

  const toggle = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id]
    )

  return (
    <div className="space-y-4 px-4 pb-6">
      <ul aria-label="Kitchen ingredients" className="flex flex-wrap gap-2">
        {visible.map((ingredient) => (
          <IngredientChip
            key={ingredient.id}
            ingredient={ingredient}
            selected={selectedIds.includes(ingredient.id)}
            onToggle={() => toggle(ingredient.id)}
          />
        ))}
        {hiddenCount > 0 && (
          <li>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-full border border-border px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 active:bg-muted"
            >
              + {hiddenCount} more…
            </button>
          </li>
        )}
      </ul>
      {selectedNames.length > 0 && (
        <IdeaCards selectedNames={selectedNames} kitchenNames={kitchenNames} />
      )}
    </div>
  )
}

function IngredientChip({
  ingredient,
  selected,
  onToggle,
}: {
  ingredient: Ingredient
  selected: boolean
  onToggle: () => void
}) {
  const daysLeft = daysUntilExpiry(ingredient)
  const label = shortExpiryLabel(daysLeft)
  const urgent = daysLeft !== null && daysLeft <= 2

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
          selected
            ? 'border-foreground bg-foreground text-background'
            : 'border-border text-foreground hover:bg-muted/50 active:bg-muted'
        )}
      >
        {selected && <CheckIcon className="size-3.5" />}
        {ingredient.name}
        {label !== null && (
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
              selected && urgent && 'bg-destructive text-white',
              selected && !urgent && 'bg-amber-400 text-amber-950',
              !selected && urgent && 'bg-destructive/10 text-destructive',
              !selected && !urgent && 'bg-amber-500/15 text-amber-700'
            )}
          >
            {label}
          </span>
        )}
      </button>
    </li>
  )
}
