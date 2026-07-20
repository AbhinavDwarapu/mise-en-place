import type { IngredientCategory } from '../types'

const BASE_URL: string =
  import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000'

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`Suggestions request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function fetchSubstituteSuggestions(
  name: string,
  existing: string[]
): Promise<string[]> {
  const { substitutes } = await post<{ substitutes: string[] }>(
    '/suggestions/substitutes',
    { name, existing }
  )
  return substitutes
}

export async function fetchCategories(
  names: string[]
): Promise<Record<string, IngredientCategory>> {
  const { categories } = await post<{
    categories: Record<string, IngredientCategory>
  }>('/suggestions/categories', { names })
  return categories
}
