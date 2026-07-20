import { useState } from 'react'
import { useKitchenStore } from '../../state/kitchen-store'
import type { ShoppingListItem } from '../../state/shopping-list-store'
import { useShoppingListStore } from '../../state/shopping-list-store'
import { alternativesFor } from '../logic/alternatives'
import { useStoreSessionStore } from '../state/store-session-store'
import { Button } from '@/shared/ui/button'

export function ItemAlternatives({
  item,
  onSwapped,
}: {
  item: ShoppingListItem
  onSwapped: (name: string) => void
}) {
  const ingredients = useKitchenStore((state) => state.ingredients)
  const renameItem = useShoppingListStore((state) => state.renameItem)
  const swappedFrom = useStoreSessionStore((state) => state.swaps[item.id])
  const recordSwap = useStoreSessionStore((state) => state.recordSwap)
  const clearSwap = useStoreSessionStore((state) => state.clearSwap)
  const [open, setOpen] = useState(false)
  const alternatives = alternativesFor(item.name, ingredients)

  const swapTo = (substitute: string) => {
    recordSwap(item.id, item.name)
    renameItem(item.id, substitute)
    setOpen(false)
    onSwapped(substitute)
  }

  const undoSwap = () => {
    renameItem(item.id, swappedFrom)
    clearSwap(item.id)
    onSwapped(swappedFrom)
  }

  if (!swappedFrom && alternatives.length === 0) {
    return null
  }

  return (
    <div className="space-y-1 pt-0.5">
      {swappedFrom && (
        <button
          type="button"
          onClick={undoSwap}
          aria-label={`Undo swap of ${swappedFrom}`}
          className="block text-left text-sm font-medium text-amber-400"
        >
          Swapped from {swappedFrom} · Undo
        </button>
      )}
      {alternatives.length > 0 &&
        (open ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {alternatives.map((substitute) => (
              <Button
                key={substitute}
                variant="outline"
                size="xs"
                onClick={() => swapTo(substitute)}
              >
                {substitute}
              </Button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="block text-left text-sm font-medium text-amber-400"
          >
            Can't find? Show alternatives
          </button>
        ))}
    </div>
  )
}
