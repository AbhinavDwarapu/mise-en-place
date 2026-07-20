import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import type { Ingredient } from '../types'

dayjs.extend(duration)

export function daysToMs(days: number): number {
  return dayjs.duration(days, 'day').asMilliseconds()
}

export function expiresAt(ingredient: Ingredient): Date | null {
  if (ingredient.expiresAfterMs === null) return null
  return dayjs(ingredient.addedAtIso)
    .add(ingredient.expiresAfterMs, 'millisecond')
    .toDate()
}

export function daysUntilExpiry(
  ingredient: Ingredient,
  now: Date = new Date()
): number | null {
  const expiry = expiresAt(ingredient)
  if (expiry === null) return null
  return Math.ceil(dayjs(expiry).diff(now, 'day', true))
}

export function expiryLabel(daysLeft: number | null): string | null {
  if (daysLeft === null) return null
  if (daysLeft < 0) return 'Expired'
  if (daysLeft === 0) return 'Expires today'
  return `Exp ~${daysLeft}d`
}

export function expiryDateInputValue(ingredient: Ingredient): string {
  const expiry = expiresAt(ingredient)
  return expiry === null ? '' : dayjs(expiry).format('YYYY-MM-DD')
}

export function expiresAfterMsForDate(
  addedAtIso: string,
  expiryDateInput: string
): number {
  return dayjs(expiryDateInput).diff(dayjs(addedAtIso), 'millisecond')
}
