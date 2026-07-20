import { daysUntilExpiry } from '../../logic/expiration'
import type { GroceryItem } from '../../types'

const EXPIRING_SOON_DAYS = 7
const NEVER_EXPIRES = Number.MAX_SAFE_INTEGER

export function expiringFirst(
  items: GroceryItem[],
  now: Date = new Date()
): GroceryItem[] {
  return [...items].sort(
    (a, b) =>
      (daysUntilExpiry(a, now) ?? NEVER_EXPIRES) -
      (daysUntilExpiry(b, now) ?? NEVER_EXPIRES)
  )
}

export function shortExpiryLabel(daysLeft: number | null): string | null {
  if (daysLeft === null || daysLeft > EXPIRING_SOON_DAYS) return null
  if (daysLeft < 0) return 'exp'
  if (daysLeft === 0) return 'today'
  return `${daysLeft}d`
}
