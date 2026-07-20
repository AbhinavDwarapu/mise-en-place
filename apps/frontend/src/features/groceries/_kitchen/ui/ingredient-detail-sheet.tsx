import { categoryFor } from '../../logic/categories'
import { useCategoryCacheStore } from '../../state/category-cache-store'
import type { Ingredient } from '../../types'
import { Button } from '@/shared/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import { DeleteIngredientButton } from './delete-ingredient-button'
import { IngredientCategoryField } from './ingredient-category-field'
import { IngredientExpiryField } from './ingredient-expiry-field'
import { IngredientNameField } from './ingredient-name-field'
import { IngredientQuantityField } from './ingredient-quantity-field'
import { IngredientSubstitutionsField } from './ingredient-substitutions-field'
import { IngredientUsedByList } from './ingredient-used-by-list'

interface IngredientDetailSheetProps {
  ingredient: Ingredient | null
  onClose: () => void
}

export function IngredientDetailSheet({
  ingredient,
  onClose,
}: IngredientDetailSheetProps) {
  const categories = useCategoryCacheStore((state) => state.categories)

  return (
    <Drawer
      open={ingredient !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      showSwipeHandle
    >
      <DrawerContent>
        {ingredient !== null && (
          <>
            <DrawerHeader>
              <DrawerTitle>{ingredient.name}</DrawerTitle>
              <DrawerDescription className="capitalize">
                {categoryFor(ingredient.name, categories)}
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-6 overflow-y-auto px-4 pb-2">
              <IngredientNameField ingredient={ingredient} />
              <IngredientCategoryField ingredient={ingredient} />
              <IngredientQuantityField ingredient={ingredient} />
              <IngredientExpiryField ingredient={ingredient} />
              <IngredientUsedByList ingredient={ingredient} />
              <IngredientSubstitutionsField ingredient={ingredient} />
            </div>

            <DrawerFooter className="flex-row *:flex-1">
              <DeleteIngredientButton
                ingredient={ingredient}
                onDeleted={onClose}
              />
              <Button onClick={onClose}>Done</Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
