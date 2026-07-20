import type { GroceryData } from '../types'

export const scenarioAGroceryState: GroceryData = {
  items: [
    {
      id: 'dev-milk',
      name: 'Milk',
      location: 'shopping-list',
      quantity: { amount: 1, unit: 'gallon' },
      expiresAtIso: null,
      addedAtIso: '2026-07-20T08:00:00.000Z',
      substitutions: [],
    },
  ],
  recipes: [],
}
