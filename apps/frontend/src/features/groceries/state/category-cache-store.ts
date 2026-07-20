import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeIngredientName } from '../logic/categories'
import type { IngredientCategory } from '../types'

type CategoryCacheStore = {
  categories: Record<string, IngredientCategory>
  setCategories: (categories: Record<string, IngredientCategory>) => void
}

const CATEGORY_CACHE_STORAGE_KEY = 'category-cache-v1'

export const useCategoryCacheStore = create<CategoryCacheStore>()(
  persist(
    (set) => ({
      categories: {},

      setCategories: (categories) =>
        set((state) => ({
          categories: Object.entries(categories).reduce(
            (merged, [name, category]) => ({
              ...merged,
              [normalizeIngredientName(name)]: category,
            }),
            state.categories
          ),
        })),
    }),
    { name: CATEGORY_CACHE_STORAGE_KEY }
  )
)
