import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { inferCategory } from '../logic/categories'
import { daysToMs } from '../logic/expiration'
import type { Ingredient, KitchenData } from '../types'
import { COUNT_UNIT, DEFAULT_EXPIRY_DAYS, KITCHEN_STORAGE_KEY } from './constants'
import { defaultKitchenState } from './seed'

export type KitchenActions = {
  addIngredient: (name: string) => Ingredient
  updateIngredient: (
    id: string,
    changes: Partial<Omit<Ingredient, 'id'>>
  ) => void
  deleteIngredient: (id: string) => void
  addSubstitution: (id: string, substitute: string) => void
  removeSubstitution: (id: string, substitute: string) => void
}

export type KitchenStore = KitchenData & KitchenActions

function updateById(
  ingredients: Ingredient[],
  id: string,
  change: (ingredient: Ingredient) => Ingredient
): Ingredient[] {
  return ingredients.map((ingredient) =>
    ingredient.id === id ? change(ingredient) : ingredient
  )
}

export const useKitchenStore = create<KitchenStore>()(
  persist(
    (set) => ({
      ...defaultKitchenState,

      addIngredient: (name) => {
        const category = inferCategory(name)
        const defaultExpiryDays = DEFAULT_EXPIRY_DAYS[category]
        const ingredient: Ingredient = {
          id: crypto.randomUUID(),
          name: name.trim(),
          category,
          quantity: { amount: 1, unit: COUNT_UNIT },
          expiresAfterMs:
            defaultExpiryDays === null ? null : daysToMs(defaultExpiryDays),
          addedAtIso: new Date().toISOString(),
          substitutions: [],
        }
        set((state) => ({ ingredients: [...state.ingredients, ingredient] }))
        return ingredient
      },

      updateIngredient: (id, changes) =>
        set((state) => ({
          ingredients: updateById(state.ingredients, id, (ingredient) => ({
            ...ingredient,
            ...changes,
          })),
        })),

      deleteIngredient: (id) =>
        set((state) => ({
          ingredients: state.ingredients.filter(
            (ingredient) => ingredient.id !== id
          ),
        })),

      addSubstitution: (id, substitute) =>
        set((state) => ({
          ingredients: updateById(state.ingredients, id, (ingredient) => {
            const trimmed = substitute.trim()
            if (trimmed === '' || ingredient.substitutions.includes(trimmed)) {
              return ingredient
            }
            return {
              ...ingredient,
              substitutions: [...ingredient.substitutions, trimmed],
            }
          }),
        })),

      removeSubstitution: (id, substitute) =>
        set((state) => ({
          ingredients: updateById(state.ingredients, id, (ingredient) => ({
            ...ingredient,
            substitutions: ingredient.substitutions.filter(
              (existing) => existing !== substitute
            ),
          })),
        })),
    }),
    { name: KITCHEN_STORAGE_KEY }
  )
)
