import { useState } from 'react'
import { useKitchenStore } from '../state/kitchen-store'
import { AddIngredientInput } from './add-ingredient-input'
import { IngredientDetailSheet } from './ingredient-detail-sheet'
import { IngredientList } from './ingredient-list'

export function KitchenScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const ingredients = useKitchenStore((state) => state.ingredients)
  const selected =
    ingredients.find((ingredient) => ingredient.id === selectedId) ?? null

  return (
    <>
      <IngredientList onSelect={setSelectedId} />
      <AddIngredientInput />
      <IngredientDetailSheet
        ingredient={selected}
        onClose={() => setSelectedId(null)}
      />
    </>
  )
}
