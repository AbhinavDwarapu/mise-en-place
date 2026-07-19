import { useState, type FormEvent } from 'react'
import { useShoppingListStore } from '@/shared/state/shopping-list-store'
import { Button } from '@/shared/ui/button'

const DEFAULT_QUANTITY = { amount: 1, unit: 'x' }

export function AddShoppingListItemInput() {
  const addItem = useShoppingListStore((state) => state.addItem)
  const [name, setName] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (name.trim() === '') return
    addItem(name, DEFAULT_QUANTITY)
    setName('')
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 p-4">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Add item…"
        aria-label="Item name"
        className="h-9 flex-1 rounded-4xl border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
      />
      <Button type="submit" disabled={name.trim() === ''}>
        Add
      </Button>
    </form>
  )
}
