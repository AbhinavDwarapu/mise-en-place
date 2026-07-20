import { useState } from 'react'
import { recipesUsing, sourceEquals } from '../../logic/recipe-usage'
import { useKitchenStore } from '../../state/kitchen-store'
import { useShoppingListStore } from '../../state/shopping-list-store'
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
  const addRecipeIngredient = useKitchenStore(
    (state) => state.addRecipeIngredient
  )
  const removeRecipeIngredient = useKitchenStore(
    (state) => state.removeRecipeIngredient
  )
  const shoppingListItems = useShoppingListStore((state) => state.items)
  const addShoppingListItem = useShoppingListStore((state) => state.addItem)
  const [open, setOpen] = useState(false)
  const kitchenSource = { kind: 'kitchen' as const, ingredientId: ingredient.id }
  const affected = recipesUsing(kitchenSource, recipes)

  const confirmDelete = () => {
    if (affected.length > 0) {
      const existingListItem = shoppingListItems.find(
        (item) => item.name.toLowerCase() === ingredient.name.toLowerCase()
      )
      const listItem =
        existingListItem ??
        addShoppingListItem(ingredient.name, ingredient.quantity)
      const listSource = {
        kind: 'shopping-list' as const,
        shoppingListItemId: listItem.id,
      }
      for (const recipe of affected) {
        for (const entry of recipe.ingredients) {
          if (sourceEquals(entry.source, kitchenSource)) {
            removeRecipeIngredient(recipe.id, kitchenSource)
            addRecipeIngredient(recipe.id, listSource, entry.needed)
          }
        }
      }
    }
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
