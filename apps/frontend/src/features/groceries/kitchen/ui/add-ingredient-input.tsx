import { useState, type FormEvent } from 'react'
import { fetchCategories } from '../../boundary/suggestions-api'
import { useCategoryCacheStore } from '../../state/category-cache-store'
import { useKitchenStore } from '../../state/kitchen-store'
import { Button } from '@/shared/ui/button'

export function AddIngredientInput() {
  const addIngredient = useKitchenStore((state) => state.addIngredient)
  const updateIngredient = useKitchenStore((state) => state.updateIngredient)
  const setCategories = useCategoryCacheStore((state) => state.setCategories)
  const [name, setName] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (name.trim() === '') return
    const ingredient = addIngredient(name)
    setName('')
    fetchCategories([ingredient.name])
      .then((categories) => {
        setCategories(categories)
        const category = categories[ingredient.name]
        if (category === undefined) return
        const current = useKitchenStore
          .getState()
          .ingredients.find((existing) => existing.id === ingredient.id)
        if (current?.category === ingredient.category) {
          updateIngredient(ingredient.id, { category })
        }
      })
      .catch(() => {})
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
