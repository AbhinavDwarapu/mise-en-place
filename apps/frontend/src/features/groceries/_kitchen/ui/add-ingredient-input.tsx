import { useState, type FormEvent } from 'react'
import { useGroceryStore } from '../../state/grocery-store'
import { Button } from '@/shared/ui/button'

export function AddIngredientInput() {
  const addItem = useGroceryStore((state) => state.addItem)
  const [name, setName] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (name.trim() === '') return
    addItem(name, 'kitchen')
    setName('')
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 p-4">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Add ingredient…"
        aria-label="Ingredient name"
        className="h-9 flex-1 rounded-4xl border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
      />
      <Button type="submit" disabled={name.trim() === ''}>
        Add
      </Button>
    </form>
  )
}
