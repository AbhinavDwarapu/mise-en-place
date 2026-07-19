import { AddRecipeInput } from './add-recipe-input'
import { RecipeList } from './recipe-list'

export function RecipesScreen() {
  return (
    <>
      <RecipeList />
      <AddRecipeInput />
    </>
  )
}
