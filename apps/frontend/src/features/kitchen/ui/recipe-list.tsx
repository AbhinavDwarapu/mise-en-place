import { useKitchenStore } from '../state/kitchen-store'
import type { Recipe } from '../types'

export function RecipeList() {
  const recipes = useKitchenStore((state) => state.recipes)

  if (recipes.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-muted-foreground">
        No recipes yet. Add your first recipe below.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {recipes.map((recipe) => (
        <RecipeRow key={recipe.id} recipe={recipe} />
      ))}
    </ul>
  )
}

function RecipeRow({ recipe }: { recipe: Recipe }) {
  const ingredientCount = recipe.ingredients.length

  return (
    <li className="flex items-center gap-2.5 px-4 py-3">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: recipe.color }}
      />
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{recipe.name}</p>
        <p className="text-sm text-muted-foreground">
          Serves {recipe.servings} ·{' '}
          {ingredientCount === 1
            ? '1 ingredient'
            : `${ingredientCount} ingredients`}
        </p>
      </div>
    </li>
  )
}
