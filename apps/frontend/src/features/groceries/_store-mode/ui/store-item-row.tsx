import { CheckIcon } from 'lucide-react'
import { formatQuantity } from '../../logic/quantity'
import type { GroceryItem } from '../../types'
import type { StoreItemStatus } from '../state/store-session-store'
import { useStoreSessionStore } from '../state/store-session-store'
import { ItemAlternatives } from './item-alternatives'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

export function StoreItemRow({
  item,
  status,
  onSwapped,
}: {
  item: GroceryItem
  status: StoreItemStatus | undefined
  onSwapped: (name: string) => void
}) {
  const toggleChecked = useStoreSessionStore((state) => state.toggleChecked)
  const toggleSkipped = useStoreSessionStore((state) => state.toggleSkipped)
  const checked = status === 'checked'
  const skipped = status === 'skipped'

  return (
    <li
      className={cn(
        'flex items-center gap-4 rounded-2xl bg-card p-4',
        skipped && 'opacity-50'
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={item.name}
        onClick={() => toggleChecked(item.id)}
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl border-2 transition-colors',
          checked
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-transparent'
        )}
      >
        {checked && <CheckIcon className="size-7" />}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-lg font-semibold text-foreground',
            checked && 'text-muted-foreground line-through'
          )}
        >
          {item.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatQuantity(item.quantity)}
          {skipped && ' · skipped'}
        </p>
        {!checked && <ItemAlternatives item={item} onSwapped={onSwapped} />}
      </div>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Skip ${item.name}`}
        onClick={() => toggleSkipped(item.id)}
      >
        {skipped ? 'Skipped' : 'Skip'}
      </Button>
    </li>
  )
}
