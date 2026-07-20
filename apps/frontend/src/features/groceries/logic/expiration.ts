import type { GroceryItem } from '../types'

const DAY_MS = 86_400_000

export function expiryFromDays(fromIso: string, days: number): string {
  return new Date(new Date(fromIso).getTime() + days * DAY_MS).toISOString()
}

export function expiresAt(item: GroceryItem): Date | null {
  return item.expiresAtIso === null
    ? null
    : new Date(item.expiresAtIso)
}

export function daysUntilExpiry(
  item: GroceryItem,
  now: Date = new Date()
): number | null {
  const expiry = expiresAt(item)
  if (expiry === null) return null
  return Math.ceil((expiry.getTime() - now.getTime()) / DAY_MS)
}

export function expiryLabel(daysLeft: number | null): string | null {
  if (daysLeft === null) return null
  if (daysLeft < 0) return 'Expired'
  if (daysLeft === 0) return 'Expires today'
  return `Exp ~${daysLeft}d`
}

export function expiryDateInputValue(item: GroceryItem): string {
  const expiry = expiresAt(item)
  if (expiry === null) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${expiry.getFullYear()}-${pad(expiry.getMonth() + 1)}-${pad(expiry.getDate())}`
}

export function expiryFromDateInput(dateInput: string): string {
  const [year, month, day] = dateInput.split('-').map(Number)
  return new Date(year, month - 1, day).toISOString()
}
