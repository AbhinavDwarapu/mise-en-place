import type { ShoppingListItem } from './shopping-list-store'
import { COUNT_UNIT } from './kitchen-constants'

export const defaultShoppingListItems: ShoppingListItem[] = [
  {
    id: 'sl-cilantro',
    name: 'Cilantro',
    quantity: { amount: 1, unit: 'bunch' },
    addedAtIso: '2026-07-19T18:00:00.000Z',
  },
  {
    id: 'sl-jalapenos',
    name: 'Jalapenos',
    quantity: { amount: 4, unit: COUNT_UNIT },
    addedAtIso: '2026-07-19T18:00:00.000Z',
  },
  {
    id: 'sl-feta-cheese',
    name: 'Feta cheese',
    quantity: { amount: 1, unit: 'block' },
    addedAtIso: '2026-07-19T18:05:00.000Z',
  },
  {
    id: 'sl-chicken-thighs',
    name: 'Chicken thighs',
    quantity: { amount: 1.5, unit: 'lb' },
    addedAtIso: '2026-07-20T08:00:00.000Z',
  },
  {
    id: 'sl-sourdough-bread',
    name: 'Sourdough bread',
    quantity: { amount: 1, unit: 'loaf' },
    addedAtIso: '2026-07-20T08:10:00.000Z',
  },
  {
    id: 'sl-frozen-waffles',
    name: 'Frozen waffles',
    quantity: { amount: 1, unit: 'box' },
    addedAtIso: '2026-07-20T08:15:00.000Z',
  },
  {
    id: 'sl-ground-cumin',
    name: 'Ground cumin',
    quantity: { amount: 1, unit: 'jar' },
    addedAtIso: '2026-07-20T08:20:00.000Z',
  },
  {
    id: 'sl-paper-towels',
    name: 'Paper towels',
    quantity: { amount: 2, unit: COUNT_UNIT },
    addedAtIso: '2026-07-20T08:25:00.000Z',
  },
]
