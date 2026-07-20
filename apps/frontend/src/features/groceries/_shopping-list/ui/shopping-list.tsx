import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { COUNT_UNIT } from '../../state/kitchen-constants'
import {
  useShoppingListStore,
  type ShoppingListItem,
} from '../../state/shopping-list-store'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

export function ShoppingList() {
  const items = useShoppingListStore((state) => state.items)

  if (items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-muted-foreground">
        Your shopping list is empty. Add your first item above.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <ShoppingListRow key={item.id} item={item} />
      ))}
    </ul>
  )
}

function ShoppingListRow({ item }: { item: ShoppingListItem }) {
  const updateItemQuantity = useShoppingListStore(
    (state) => state.updateItemQuantity
  )
  const removeItem = useShoppingListStore((state) => state.removeItem)

  const setAmount = (amount: number) =>
    updateItemQuantity(item.id, { ...item.quantity, amount })

  const setUnit = (unit: string) =>
    updateItemQuantity(item.id, {
      ...item.quantity,
      unit: unit.trim() === '' ? COUNT_UNIT : unit,
    })

  return (
    <li className="flex items-center justify-between gap-2 px-4 py-3">
      <p className="min-w-0 truncate font-medium text-foreground">
        {item.name}
      </p>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Decrease ${item.name} amount`}
          onClick={() => setAmount(Math.max(1, item.quantity.amount - 1))}
        >
          <MinusIcon />
        </Button>
        <span className="w-6 text-center text-sm text-foreground">
          {item.quantity.amount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Increase ${item.name} amount`}
          onClick={() => setAmount(item.quantity.amount + 1)}
        >
          <PlusIcon />
        </Button>
        <Input
          aria-label={`${item.name} unit`}
          placeholder={COUNT_UNIT}
          className="h-8 w-14 px-2 text-center text-sm"
          value={item.quantity.unit === COUNT_UNIT ? '' : item.quantity.unit}
          onChange={(event) => setUnit(event.target.value)}
        />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${item.name}`}
          onClick={() => removeItem(item.id)}
        >
          <XIcon />
        </Button>
      </div>
    </li>
  )
}
