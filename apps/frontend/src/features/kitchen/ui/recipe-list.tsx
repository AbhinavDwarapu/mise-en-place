import { useKitchenStore } from '../state/kitchen-store'
import type { Recipe } from '../types'

export function RecipeList({
  onSelect,
}: {
  onSelect: (id: string) => void
}) {
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
        <RecipeRow
          key={recipe.id}
          recipe={recipe}
          onSelect={() => onSelect(recipe.id)}
        />
      ))}
    </ul>
  )
}

function RecipeRow({
  recipe,
  onSelect,
}: {
  recipe: Recipe
  onSelect: () => void
}) {
  const ingredientCount = recipe.ingredients.length

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
      >
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: recipe.color }}
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">
            {recipe.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Serves {recipe.servings} ·{' '}
            {ingredientCount === 1
              ? '1 ingredient'
              : `${ingredientCount} ingredients`}
          </p>
        </div>
      </button>
    </li>
  )
}
