import type { Ingredient } from '../types'

const DAY_MS = 86_400_000

export function expiryFromDays(fromIso: string, days: number): string {
  return new Date(new Date(fromIso).getTime() + days * DAY_MS).toISOString()
}

export function expiresAt(ingredient: Ingredient): Date | null {
  return ingredient.expiresAtIso === null
    ? null
    : new Date(ingredient.expiresAtIso)
}

export function daysUntilExpiry(
  ingredient: Ingredient,
  now: Date = new Date()
): number | null {
  const expiry = expiresAt(ingredient)
  if (expiry === null) return null
  return Math.ceil((expiry.getTime() - now.getTime()) / DAY_MS)
}

export function expiryLabel(daysLeft: number | null): string | null {
  if (daysLeft === null) return null
  if (daysLeft < 0) return 'Expired'
  if (daysLeft === 0) return 'Expires today'
  return `Exp ~${daysLeft}d`
}

export function expiryDateInputValue(ingredient: Ingredient): string {
  const expiry = expiresAt(ingredient)
  if (expiry === null) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${expiry.getFullYear()}-${pad(expiry.getMonth() + 1)}-${pad(expiry.getDate())}`
}

export function expiryFromDateInput(dateInput: string): string {
  const [year, month, day] = dateInput.split('-').map(Number)
  return new Date(year, month - 1, day).toISOString()
}
