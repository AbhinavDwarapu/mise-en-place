import { useEffect } from 'react'
import { fetchCategories } from '../boundary/suggestions-api'
import { categoryFor, normalizeIngredientName } from '../logic/categories'
import type { IngredientCategory } from '../types'
import { useCategoryCacheStore } from './category-cache-store'

export function useLlmCategories(
  names: string[]
): (name: string) => IngredientCategory {
  const categories = useCategoryCacheStore((state) => state.categories)
  const setCategories = useCategoryCacheStore((state) => state.setCategories)

  const missingKey = JSON.stringify(
    [
      ...new Set(
        names
          .map(normalizeIngredientName)
          .filter((name) => name !== '' && categories[name] === undefined)
      ),
    ].sort()
  )

  useEffect(() => {
    const missing = JSON.parse(missingKey) as string[]
    if (missing.length === 0) return
    fetchCategories(missing)
      .then(setCategories)
      .catch(() => {})
  }, [missingKey, setCategories])

  return (name) => categoryFor(name, categories)
}
