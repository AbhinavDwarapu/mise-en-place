import { useEffect } from 'react'
import { fetchCategories } from '../boundary/suggestions-api'
import { categoryFor, normalizeIngredientName } from '../logic/categories'
import type { IngredientCategory } from '../types'
import { useCategoryCacheStore } from './category-cache-store'

export function useLlmCategories(
  names: string[]
): (name: string) => IngredientCategory {
  const categories = useCategoryCacheStore((state) => state.categories)

  const namesKey = [...new Set(names.map(normalizeIngredientName))]
    .sort()
    .join('\n')

  useEffect(() => {
    const { categories: cached, setCategories } =
      useCategoryCacheStore.getState()
    const missing = namesKey
      .split('\n')
      .filter((name) => name !== '' && cached[name] === undefined)
    if (missing.length === 0) return
    fetchCategories(missing)
      .then(setCategories)
      .catch(() => {})
  }, [namesKey])

  return (name) => categoryFor(name, categories)
}
