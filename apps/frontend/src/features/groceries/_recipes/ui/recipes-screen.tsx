import { useState } from 'react'
import { useGroceryStore } from '../../state/grocery-store'
import { AddRecipeInput } from './add-recipe-input'
import { RecipeDetailSheet } from './recipe-detail-sheet'
import { RecipeList } from './recipe-list'

export function RecipesScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const recipes = useGroceryStore((state) => state.recipes)
  const selected = recipes.find((recipe) => recipe.id === selectedId) ?? null

  return (
    <>
      <RecipeList onSelect={setSelectedId} />
      <AddRecipeInput />
      <RecipeDetailSheet
        recipe={selected}
        onClose={() => setSelectedId(null)}
      />
    </>
  )
}
