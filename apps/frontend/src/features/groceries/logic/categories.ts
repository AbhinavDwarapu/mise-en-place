import type { IngredientCategory } from '../types'
import {
  CATEGORY_KEYWORDS,
  INGREDIENT_CATEGORIES,
} from '../state/kitchen-constants'

export interface CategoryGroup<T> {
  category: IngredientCategory
  items: T[]
}

export function groupByCategory<T extends { name: string }>(
  items: T[],
  categoryOf: (name: string) => IngredientCategory
): CategoryGroup<T>[] {
  return INGREDIENT_CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => categoryOf(item.name) === category),
  })).filter((group) => group.items.length > 0)
}

export function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase()
}

export function categoryFor(
  name: string,
  cached: Record<string, IngredientCategory>
): IngredientCategory {
  return cached[normalizeIngredientName(name)] ?? inferCategory(name)
}

export function inferCategory(name: string): IngredientCategory {
  const normalized = name.toLowerCase()

  let longestMatch: { category: IngredientCategory; keyword: string } | null =
    null
  const categories = Object.keys(CATEGORY_KEYWORDS) as IngredientCategory[]
  for (const category of categories) {
    for (const keyword of CATEGORY_KEYWORDS[category]) {
      const beatsCurrent =
        longestMatch === null || keyword.length > longestMatch.keyword.length
      if (beatsCurrent && normalized.includes(keyword)) {
        longestMatch = { category, keyword }
      }
    }
  }
  return longestMatch?.category ?? 'other'
}
