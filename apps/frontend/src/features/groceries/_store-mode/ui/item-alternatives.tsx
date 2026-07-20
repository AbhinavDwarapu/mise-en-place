import { useState } from 'react'
import { useGroceryStore } from '../../state/grocery-store'
import type { GroceryItem } from '../../types'
import { alternativesFor } from '../logic/alternatives'
import { useStoreSessionStore } from '../state/store-session-store'
import { Button } from '@/shared/ui/button'

export function ItemAlternatives({
  item,
  onSwapped,
}: {
  item: GroceryItem
  onSwapped: (name: string) => void
}) {
  const items = useGroceryStore((state) => state.items)
  const updateItem = useGroceryStore((state) => state.updateItem)
  const swappedFrom = useStoreSessionStore((state) => state.swaps[item.id])
  const recordSwap = useStoreSessionStore((state) => state.recordSwap)
  const clearSwap = useStoreSessionStore((state) => state.clearSwap)
  const [open, setOpen] = useState(false)
  const alternatives = alternativesFor(item.name, items)

  const swapTo = (substitute: string) => {
    recordSwap(item.id, item.name)
    updateItem(item.id, { name: substitute })
    setOpen(false)
    onSwapped(substitute)
  }

  const undoSwap = () => {
    updateItem(item.id, { name: swappedFrom })
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
