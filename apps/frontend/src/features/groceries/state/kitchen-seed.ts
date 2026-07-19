import type { KitchenData } from '../types'
import { COUNT_UNIT } from './kitchen-constants'

export const defaultKitchenState: KitchenData = {
  ingredients: [
    {
      id: 'ing-ground-beef',
      name: 'Ground beef',
      category: 'meat',
      quantity: { amount: 1, unit: 'lb' },
      expiresAfterMs: 259200000,
      addedAtIso: '2026-07-18T09:00:00.000Z',
      substitutions: [],
    },
    {
      id: 'ing-roma-tomatoes',
      name: 'Roma tomatoes',
      category: 'produce',
      quantity: { amount: 6, unit: COUNT_UNIT },
      expiresAfterMs: 432000000,
      addedAtIso: '2026-07-17T09:00:00.000Z',
      substitutions: [],
    },
    {
      id: 'ing-baby-spinach',
      name: 'Baby spinach',
      category: 'produce',
      quantity: { amount: 1, unit: 'bag' },
      expiresAfterMs: 432000000,
      addedAtIso: '2026-07-19T09:00:00.000Z',
      substitutions: ['frozen spinach', 'kale'],
    },
    {
      id: 'ing-tortillas',
      name: 'Tortillas',
      category: 'bakery',
      quantity: { amount: 12, unit: COUNT_UNIT },
      expiresAfterMs: 345600000,
      addedAtIso: '2026-07-18T09:00:00.000Z',
      substitutions: [],
    },
    {
      id: 'ing-sour-cream',
      name: 'Sour cream',
      category: 'dairy',
      quantity: { amount: 1, unit: 'tub' },
      expiresAfterMs: 604800000,
      addedAtIso: '2026-07-16T09:00:00.000Z',
      substitutions: [],
    },
    {
      id: 'ing-eggs',
      name: 'Eggs',
      category: 'dairy',
      quantity: { amount: 6, unit: COUNT_UNIT },
      expiresAfterMs: 604800000,
      addedAtIso: '2026-07-17T09:00:00.000Z',
      substitutions: [],
    },
  ],
  recipes: [
    {
      id: 'rec-taco-night',
      name: 'Taco night',
      color: '#e05252',
      servings: 4,
      cookingThisWeek: true,
      ingredients: [
        {
          source: { kind: 'kitchen', ingredientId: 'ing-ground-beef' },
          needed: { amount: 1, unit: 'lb' },
        },
        {
          source: { kind: 'kitchen', ingredientId: 'ing-roma-tomatoes' },
          needed: { amount: 6, unit: COUNT_UNIT },
        },
        {
          source: { kind: 'kitchen', ingredientId: 'ing-tortillas' },
          needed: { amount: 12, unit: COUNT_UNIT },
        },
        {
          source: { kind: 'kitchen', ingredientId: 'ing-sour-cream' },
          needed: { amount: 1, unit: 'tub' },
        },
      ],
    },
    {
      id: 'rec-sat-frittata',
      name: 'Sat. frittata',
      color: '#e8a33d',
      servings: 2,
      cookingThisWeek: true,
      ingredients: [
        {
          source: { kind: 'kitchen', ingredientId: 'ing-baby-spinach' },
          needed: { amount: 1, unit: 'bag' },
        },
        {
          source: { kind: 'kitchen', ingredientId: 'ing-eggs' },
          needed: { amount: 6, unit: COUNT_UNIT },
        },
      ],
    },
    {
      id: 'rec-green-smoothies',
      name: 'Green smoothies',
      color: '#4caf50',
      servings: 2,
      cookingThisWeek: false,
      ingredients: [
        {
          source: { kind: 'kitchen', ingredientId: 'ing-baby-spinach' },
          needed: { amount: 0.5, unit: 'bag' },
        },
      ],
    },
  ],
}
