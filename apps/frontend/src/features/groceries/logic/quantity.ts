import type { Quantity } from '../types'
import { COUNT_UNIT } from '../state/grocery-constants'

export function formatQuantity(quantity: Quantity): string {
  if (quantity.unit === COUNT_UNIT) return `×${quantity.amount}`
  return `${quantity.amount} ${quantity.unit}`
}
