import { useState } from 'react'
import { recipesUsing } from '../../logic/recipe-usage'
import { useKitchenStore } from '../../state/kitchen-store'
import type { Ingredient } from '../../types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'

export function DeleteIngredientButton({
  ingredient,
  onDeleted,
}: {
  ingredient: Ingredient
  onDeleted: () => void
}) {
  const recipes = useKitchenStore((state) => state.recipes)
  const deleteIngredient = useKitchenStore((state) => state.deleteIngredient)
  const [open, setOpen] = useState(false)
  const affected = recipesUsing(
    { kind: 'kitchen', ingredientId: ingredient.id },
    recipes
  )

  const confirmDelete = () => {
    deleteIngredient(ingredient.id)
    setOpen(false)
    onDeleted()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete ingredient</Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {ingredient.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {affected.length > 0
              ? 'These recipes will no longer be possible:'
              : 'It is removed from your kitchen.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {affected.length > 0 && (
          <div className="space-y-3">
            <ul className="divide-y divide-border rounded-3xl border">
              {affected.map((recipe) => (
                <li
                  key={recipe.id}
                  className="flex items-center gap-2.5 px-3 py-2.5"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: recipe.color }}
                  />
                  <span className="truncate text-sm font-medium text-foreground">
                    {recipe.name}
                  </span>
                </li>
              ))}
            </ul>
            {ingredient.substitutions.length > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                Possible substitutes: {ingredient.substitutions.join(', ')}
              </p>
            )}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirmDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
