import { useGroceryStore } from '../../state/grocery-store'
import { useStoreSessionStore } from '../state/store-session-store'
import { Button } from '@/shared/ui/button'

export function CompleteShopButton({ onComplete }: { onComplete: () => void }) {
  const items = useGroceryStore((state) => state.items)
  const moveItem = useGroceryStore((state) => state.moveItem)
  const statuses = useStoreSessionStore((state) => state.statuses)
  const clearSession = useStoreSessionStore((state) => state.clear)

  const completeShop = () => {
    const checkedItems = items.filter(
      (item) =>
        item.location === 'shopping-list' && statuses[item.id] === 'checked'
    )
    for (const item of checkedItems) {
      moveItem(item.id, 'kitchen')
    }
    clearSession()
    onComplete()
  }

  return (
    <Button className="w-full" size="lg" onClick={completeShop}>
      Complete shop
    </Button>
  )
}
