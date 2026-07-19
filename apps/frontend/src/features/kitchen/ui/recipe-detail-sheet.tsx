import { Button } from '@/shared/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import type { Recipe } from '../types'
import { DeleteRecipeButton } from './delete-recipe-button'
import { RecipeIngredientList } from './recipe-ingredient-list'
import { RecipeIngredientPicker } from './recipe-ingredient-picker'
import { RecipeNameField } from './recipe-name-field'
import { RecipeServingsField } from './recipe-servings-field'
import { RecipeThisWeekField } from './recipe-this-week-field'

interface RecipeDetailSheetProps {
  recipe: Recipe | null
  onClose: () => void
}

export function RecipeDetailSheet({
  recipe,
  onClose,
}: RecipeDetailSheetProps) {
  return (
    <Drawer
      open={recipe !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      showSwipeHandle
    >
      <DrawerContent>
        {recipe !== null && (
          <>
            <DrawerHeader>
              <DrawerTitle>{recipe.name}</DrawerTitle>
              <DrawerDescription>
                {recipe.ingredients.length === 1
                  ? '1 ingredient'
                  : `${recipe.ingredients.length} ingredients`}
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-6 overflow-y-auto px-4 pb-2">
              <RecipeNameField recipe={recipe} />
              <RecipeServingsField recipe={recipe} />
              <RecipeThisWeekField recipe={recipe} />
              <RecipeIngredientList recipe={recipe} />
              <RecipeIngredientPicker recipe={recipe} />
            </div>

            <DrawerFooter className="flex-row *:flex-1">
              <DeleteRecipeButton recipe={recipe} onDeleted={onClose} />
              <Button onClick={onClose}>Done</Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
