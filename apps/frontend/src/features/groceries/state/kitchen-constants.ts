import type { IngredientCategory } from '../types'

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  'produce',
  'dairy',
  'meat',
  'bakery',
  'frozen',
  'pantry',
  'other',
]

export const CATEGORY_KEYWORDS: Record<IngredientCategory, string[]> = {
  produce: [
    'spinach',
    'tomato',
    'lettuce',
    'kale',
    'onion',
    'garlic',
    'cilantro',
    'basil',
    'carrot',
    'potato',
    'apple',
    'banana',
    'lemon',
    'lime',
    'avocado',
    'broccoli',
    'cucumber',
    'mushroom',
    'bell pepper',
    'ginger',
    'berries',
  ],
  dairy: [
    'milk',
    'cheese',
    'yogurt',
    'butter',
    'cream',
    'parmesan',
    'pecorino',
    'mozzarella',
    'egg',
  ],
  meat: [
    'beef',
    'chicken',
    'pork',
    'bacon',
    'sausage',
    'salmon',
    'fish',
    'turkey',
    'ham',
    'shrimp',
  ],
  bakery: ['bread', 'tortilla', 'bagel', 'baguette', 'bun'],
  frozen: ['frozen'],
  pantry: [
    'pasta',
    'spaghetti',
    'rice',
    'flour',
    'sugar',
    'salt',
    'pepper',
    'oil',
    'vinegar',
    'beans',
    'lentils',
    'stock',
    'sauce',
    'noodle',
  ],
  other: [],
}

export const DEFAULT_EXPIRY_DAYS: Record<IngredientCategory, number | null> = {
  produce: 5,
  dairy: 7,
  meat: 3,
  bakery: 4,
  frozen: 90,
  pantry: null,
  other: null,
}

export const EXPIRY_PRESETS_DAYS = [3, 5, 7, 14]

export const COUNT_UNIT = 'unit'

export const KITCHEN_STORAGE_KEY = 'kitchen-v1'

export const DEFAULT_RECIPE_COLOR = '#94a3b8'

export const DEFAULT_SERVINGS = 2
