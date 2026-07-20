import { CheckIcon } from 'lucide-react'
import type { IngredientCategory } from '../../types'
import type { Aisle } from '../logic/aisles'
import { pendingCount } from '../logic/aisles'
import type { StoreItemStatus } from '../state/store-session-store'
import { cn } from '@/shared/lib/utils'

export function AisleTabs({
  aisles,
  statuses,
  activeCategory,
  onSelect,
}: {
  aisles: Aisle[]
  statuses: Record<string, StoreItemStatus>
  activeCategory: IngredientCategory
  onSelect: (category: IngredientCategory) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1">
      {aisles.map((aisle) => {
        const pending = pendingCount(aisle.items, statuses)
        const active = aisle.category === activeCategory

        return (
          <button
            key={aisle.category}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(aisle.category)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-4xl px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {pending === 0 && <CheckIcon className="size-4" />}
            <span className="capitalize">
              {pending > 0 ? `${aisle.category} · ${pending}` : aisle.category}
            </span>
          </button>
        )
      })}
    </div>
  )
}
