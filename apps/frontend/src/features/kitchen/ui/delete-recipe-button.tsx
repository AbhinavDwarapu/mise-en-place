import { useState } from 'react'
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
import { useKitchenStore } from '../state/kitchen-store'
import type { Recipe } from '../types'

export function DeleteRecipeButton({
  recipe,
  onDeleted,
}: {
  recipe: Recipe
  onDeleted: () => void
}) {
  const deleteRecipe = useKitchenStore((state) => state.deleteRecipe)
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
