import { daysUntilExpiry } from '../../logic/expiration'
import type { Ingredient } from '../../types'

const EXPIRING_SOON_DAYS = 7
const NEVER_EXPIRES = Number.MAX_SAFE_INTEGER

export function expiringFirst(
  ingredients: Ingredient[],
  now: Date = new Date()
): Ingredient[] {
  return [...ingredients].sort(
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
