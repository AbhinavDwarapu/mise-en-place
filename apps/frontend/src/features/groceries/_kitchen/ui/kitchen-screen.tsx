import { useState } from 'react'
import { useGroceryStore } from '../../state/grocery-store'
import { AddIngredientInput } from './add-ingredient-input'
import { IngredientDetailSheet } from './ingredient-detail-sheet'
import { IngredientList } from './ingredient-list'

export function KitchenScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const items = useGroceryStore((state) => state.items)
  const selected = items.find((item) => item.id === selectedId) ?? null

  return (
    <>
      <AddIngredientInput />
      <IngredientList onSelect={setSelectedId} />
      <IngredientDetailSheet
        ingredient={selected}
        onClose={() => setSelectedId(null)}
      />
    </>
  )
}
