import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { inferCategory } from '../logic/categories'
import { expiryFromDays } from '../logic/expiration'
import { sourceEquals } from '../logic/recipe-usage'
import type {
  Ingredient,
  KitchenData,
  Quantity,
  Recipe,
  RecipeIngredientSource,
} from '../types'
import {
  COUNT_UNIT,
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_RECIPE_COLOR,
  DEFAULT_SERVINGS,
  KITCHEN_STORAGE_KEY,
} from './kitchen-constants'
import { defaultKitchenState } from './kitchen-seed'

export type KitchenActions = {
  addIngredient: (name: string) => Ingredient
  updateIngredient: (
    id: string,
    changes: Partial<Omit<Ingredient, 'id'>>
  ) => void
  deleteIngredient: (id: string) => void
  addSubstitution: (id: string, substitute: string) => void
  removeSubstitution: (id: string, substitute: string) => void
  addRecipe: (name: string) => Recipe
  updateRecipe: (id: string, changes: Partial<Omit<Recipe, 'id'>>) => void
  deleteRecipe: (id: string) => void
  addRecipeIngredient: (
    recipeId: string,
    source: RecipeIngredientSource,
    needed: Quantity
  ) => void
  removeRecipeIngredient: (
    recipeId: string,
    source: RecipeIngredientSource
  ) => void
  updateRecipeIngredientQuantity: (
    recipeId: string,
    source: RecipeIngredientSource,
    needed: Quantity
  ) => void
}

export type KitchenStore = KitchenData & KitchenActions

function updateById<T extends { id: string }>(
  items: T[],
  id: string,
  change: (item: T) => T
): T[] {
  return items.map((item) => (item.id === id ? change(item) : item))
}

export const useKitchenStore = create<KitchenStore>()(
  persist(
    (set) => ({
      ...defaultKitchenState,

      addIngredient: (name) => {
        const defaultExpiryDays = DEFAULT_EXPIRY_DAYS[inferCategory(name)]
        const addedAtIso = new Date().toISOString()
        const ingredient: Ingredient = {
          id: crypto.randomUUID(),
          name: name.trim(),
          quantity: { amount: 1, unit: COUNT_UNIT },
          expiresAtIso:
            defaultExpiryDays === null
              ? null
              : expiryFromDays(addedAtIso, defaultExpiryDays),
          addedAtIso,
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

      addRecipe: (name) => {
        const recipe: Recipe = {
          id: crypto.randomUUID(),
          name: name.trim(),
          color: DEFAULT_RECIPE_COLOR,
          servings: DEFAULT_SERVINGS,
          cookingThisWeek: false,
          ingredients: [],
        }
        set((state) => ({ recipes: [...state.recipes, recipe] }))
        return recipe
      },

      updateRecipe: (id, changes) =>
        set((state) => ({
          recipes: updateById(state.recipes, id, (recipe) => ({
            ...recipe,
            ...changes,
          })),
        })),

      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        })),

      addRecipeIngredient: (recipeId, source, needed) =>
        set((state) => ({
          recipes: updateById(state.recipes, recipeId, (recipe) => {
            const alreadyPresent = recipe.ingredients.some((entry) =>
              sourceEquals(entry.source, source)
            )
            if (alreadyPresent) return recipe
            return {
              ...recipe,
              ingredients: [...recipe.ingredients, { source, needed }],
            }
          }),
        })),

      removeRecipeIngredient: (recipeId, source) =>
        set((state) => ({
          recipes: updateById(state.recipes, recipeId, (recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients.filter(
              (entry) => !sourceEquals(entry.source, source)
            ),
          })),
        })),

      updateRecipeIngredientQuantity: (recipeId, source, needed) =>
        set((state) => ({
          recipes: updateById(state.recipes, recipeId, (recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients.map((entry) =>
              sourceEquals(entry.source, source) ? { ...entry, needed } : entry
            ),
          })),
        })),
    }),
    { name: KITCHEN_STORAGE_KEY }
  )
)
