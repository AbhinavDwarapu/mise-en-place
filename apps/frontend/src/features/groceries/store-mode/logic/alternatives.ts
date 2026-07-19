import type { Ingredient } from '../../types'

export function alternativesFor(
  itemName: string,
  ingredients: Ingredient[]
): string[] {
  const normalized = itemName.trim().toLowerCase()
  const match = ingredients.find(
    (ingredient) => ingredient.name.toLowerCase() === normalized
  )
  return match?.substitutions ?? []
}
