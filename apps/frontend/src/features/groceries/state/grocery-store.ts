import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { inferCategory } from '../logic/categories'
import { expiryFromDays } from '../logic/expiration'
import type {
  GroceryData,
  GroceryItem,
  GroceryLocation,
  Quantity,
  Recipe,
} from '../types'
import {
  COUNT_UNIT,
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_RECIPE_COLOR,
  DEFAULT_SERVINGS,
  GROCERIES_STORAGE_KEY,
} from './grocery-constants'
import { defaultGroceryState } from './grocery-seed'

export type GroceryActions = {
  addItem: (
    name: string,
    location: GroceryLocation,
    quantity?: Quantity
  ) => GroceryItem
  updateItem: (id: string, changes: Partial<Omit<GroceryItem, 'id'>>) => void
  deleteItem: (id: string) => void
  moveItem: (id: string, to: GroceryLocation) => void
  addSubstitution: (id: string, substitute: string) => void
  removeSubstitution: (id: string, substitute: string) => void
  addRecipe: (name: string) => Recipe
  updateRecipe: (id: string, changes: Partial<Omit<Recipe, 'id'>>) => void
  deleteRecipe: (id: string) => void
  addRecipeIngredient: (
    recipeId: string,
    itemId: string,
    needed: Quantity
  ) => void
  removeRecipeIngredient: (recipeId: string, itemId: string) => void
  updateRecipeIngredientQuantity: (
    recipeId: string,
    itemId: string,
    needed: Quantity
  ) => void
}

export type GroceryStore = GroceryData & GroceryActions

function updateById<T extends { id: string }>(
  items: T[],
  id: string,
  change: (item: T) => T
): T[] {
  return items.map((item) => (item.id === id ? change(item) : item))
}

function kitchenExpiry(name: string, addedAtIso: string): string | null {
  const defaultExpiryDays = DEFAULT_EXPIRY_DAYS[inferCategory(name)]
  return defaultExpiryDays === null
    ? null
    : expiryFromDays(addedAtIso, defaultExpiryDays)
}

function repointRecipes(
  recipes: Recipe[],
  fromItemId: string,
  toItemId: string
): Recipe[] {
  return recipes.map((recipe) => {
    const hasTarget = recipe.ingredients.some(
      (entry) => entry.itemId === toItemId
    )
    return {
      ...recipe,
      ingredients: recipe.ingredients.flatMap((entry) => {
        if (entry.itemId !== fromItemId) return [entry]
        return hasTarget ? [] : [{ ...entry, itemId: toItemId }]
      }),
    }
  })
}

export const useGroceryStore = create<GroceryStore>()(
  persist(
    (set) => ({
      ...defaultGroceryState,

      addItem: (name, location, quantity = { amount: 1, unit: COUNT_UNIT }) => {
        const addedAtIso = new Date().toISOString()
        const item: GroceryItem = {
          id: crypto.randomUUID(),
          name: name.trim(),
          location,
          quantity,
          expiresAtIso:
            location === 'kitchen' ? kitchenExpiry(name, addedAtIso) : null,
          addedAtIso,
          substitutions: [],
        }
        set((state) => ({ items: [...state.items, item] }))
        return item
      },

      updateItem: (id, changes) =>
        set((state) => ({
          items: updateById(state.items, id, (item) => ({
            ...item,
            ...changes,
          })),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      moveItem: (id, to) =>
        set((state) => {
          const item = state.items.find((entry) => entry.id === id)
          if (item === undefined || item.location === to) return state
          const twin = state.items.find(
            (entry) =>
              entry.location === to &&
              entry.name.toLowerCase() === item.name.toLowerCase()
          )
          if (twin !== undefined) {
            return {
              items: state.items.filter((entry) => entry.id !== id),
              recipes: repointRecipes(state.recipes, id, twin.id),
            }
          }
          const addedAtIso = new Date().toISOString()
          const moved: GroceryItem = {
            ...item,
            location: to,
            addedAtIso,
            expiresAtIso:
              to === 'kitchen' ? kitchenExpiry(item.name, addedAtIso) : null,
          }
          return {
            items: updateById(state.items, id, () => moved),
          }
        }),

      addSubstitution: (id, substitute) =>
        set((state) => ({
          items: updateById(state.items, id, (item) => {
            const trimmed = substitute.trim()
            if (trimmed === '' || item.substitutions.includes(trimmed)) {
              return item
            }
            return {
              ...item,
              substitutions: [...item.substitutions, trimmed],
            }
          }),
        })),

      removeSubstitution: (id, substitute) =>
        set((state) => ({
          items: updateById(state.items, id, (item) => ({
            ...item,
            substitutions: item.substitutions.filter(
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

      addRecipeIngredient: (recipeId, itemId, needed) =>
        set((state) => ({
          recipes: updateById(state.recipes, recipeId, (recipe) => {
            const alreadyPresent = recipe.ingredients.some(
              (entry) => entry.itemId === itemId
            )
            if (alreadyPresent) return recipe
            return {
              ...recipe,
              ingredients: [...recipe.ingredients, { itemId, needed }],
            }
          }),
        })),

      removeRecipeIngredient: (recipeId, itemId) =>
        set((state) => ({
          recipes: updateById(state.recipes, recipeId, (recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients.filter(
              (entry) => entry.itemId !== itemId
            ),
          })),
        })),

      updateRecipeIngredientQuantity: (recipeId, itemId, needed) =>
        set((state) => ({
          recipes: updateById(state.recipes, recipeId, (recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients.map((entry) =>
              entry.itemId === itemId ? { ...entry, needed } : entry
            ),
          })),
        })),
    }),
    { name: GROCERIES_STORAGE_KEY }
  )
)
