import { ShoppingCartIcon } from 'lucide-react'
import { useGroceryStore } from '../../state/grocery-store'
import { Button } from '@/shared/ui/button'

export function StartShoppingButton({ onStart }: { onStart: () => void }) {
  const itemCount = useGroceryStore(
    (state) =>
      state.items.filter((item) => item.location === 'shopping-list').length
  )

  return (
    <Button size="lg" className="w-full" onClick={onStart}>
      <ShoppingCartIcon />
      {itemCount === 0
        ? 'Start shopping'
        : `Start shopping · ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
    </Button>
  )
}
