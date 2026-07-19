import { useState } from 'react'
import { useKitchenStore } from '../../state/kitchen-store'
import type { Recipe } from '../../types'
import { RecipeDetailSheet } from './recipe-detail-sheet'

export function ThisWeekRecipes() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const recipes = useKitchenStore((state) => state.recipes)
  const thisWeek = recipes.filter((recipe) => recipe.cookingThisWeek)
  const selected = recipes.find((recipe) => recipe.id === selectedId) ?? null

  return (
    <section className="space-y-2 py-3">
      <h2 className="px-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Cooking this week
      </h2>
      {thisWeek.length === 0 ? (
        <p className="px-4 py-6 text-center text-muted-foreground">
          No recipes planned for this week yet.
        </p>
      ) : (
        <ul className="flex gap-3 overflow-x-auto px-4 pb-2">
          {thisWeek.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={() => setSelectedId(recipe.id)}
            />
          ))}
        </ul>
      )}
      <RecipeDetailSheet
        recipe={selected}
        onClose={() => setSelectedId(null)}
      />
    </section>
  )
}

function RecipeCard({
  recipe,
  onSelect,
}: {
  recipe: Recipe
  onSelect: () => void
}) {
  const ingredientCount = recipe.ingredients.length

  return (
    <li className="shrink-0">
      <button
        type="button"
        onClick={onSelect}
        className="block w-44 overflow-hidden rounded-2xl border border-border text-left transition-colors hover:bg-muted/50 active:bg-muted"
      >
        <div className="h-16" style={{ backgroundColor: recipe.color }} />
        <div className="space-y-0.5 p-2.5">
          <p className="truncate font-medium text-foreground">
            {recipe.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
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
