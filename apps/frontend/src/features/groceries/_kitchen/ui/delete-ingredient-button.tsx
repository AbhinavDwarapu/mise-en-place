import { useState } from 'react'
import { recipesUsing } from '../../logic/recipe-usage'
import { useGroceryStore } from '../../state/grocery-store'
import type { GroceryItem } from '../../types'
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
  ingredient: GroceryItem
  onDeleted: () => void
}) {
  const recipes = useGroceryStore((state) => state.recipes)
  const deleteItem = useGroceryStore((state) => state.deleteItem)
  const moveItem = useGroceryStore((state) => state.moveItem)
  const [open, setOpen] = useState(false)
  const affected = recipesUsing(ingredient.id, recipes)

  const confirmDelete = () => {
    if (affected.length > 0) {
      moveItem(ingredient.id, 'shopping-list')
    } else {
      deleteItem(ingredient.id)
    }
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
              ? 'These recipes will need it from your shopping list instead:'
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
