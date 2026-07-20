import type { ShoppingListItem } from './shopping-list-store'
import { COUNT_UNIT } from './kitchen-constants'

export const defaultShoppingListItems: ShoppingListItem[] = [
  {
    id: 'sl-cilantro',
    name: 'Cilantro',
    quantity: { amount: 1, unit: 'bunch' },
  },
  {
    id: 'sl-jalapenos',
    name: 'Jalapenos',
    quantity: { amount: 4, unit: COUNT_UNIT },
  },
  {
    id: 'sl-feta-cheese',
    name: 'Feta cheese',
    quantity: { amount: 1, unit: 'block' },
  },
  {
    id: 'sl-chicken-thighs',
    name: 'Chicken thighs',
    quantity: { amount: 1.5, unit: 'lb' },
  },
  {
    id: 'sl-sourdough-bread',
    name: 'Sourdough bread',
    quantity: { amount: 1, unit: 'loaf' },
  },
  {
    id: 'sl-frozen-waffles',
    name: 'Frozen waffles',
    quantity: { amount: 1, unit: 'box' },
  },
  {
    id: 'sl-ground-cumin',
    name: 'Ground cumin',
    quantity: { amount: 1, unit: 'jar' },
  },
  {
    id: 'sl-paper-towels',
    name: 'Paper towels',
    quantity: { amount: 2, unit: COUNT_UNIT },
  },
]
