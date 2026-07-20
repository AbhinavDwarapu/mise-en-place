import { useState } from 'react'
import { useGroceryStore } from '../../state/grocery-store'
import type { Recipe } from '../../types'
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

export function DeleteRecipeButton({
  recipe,
  onDeleted,
}: {
  recipe: Recipe
  onDeleted: () => void
}) {
  const deleteRecipe = useGroceryStore((state) => state.deleteRecipe)
  const [open, setOpen] = useState(false)

  const confirmDelete = () => {
    deleteRecipe(recipe.id)
    setOpen(false)
    onDeleted()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete recipe</Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {recipe.name}?</AlertDialogTitle>
          <AlertDialogDescription>This can&rsquo;t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
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
