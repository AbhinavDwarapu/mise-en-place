import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expiryFromDays } from '../logic/expiration'
import {
  COUNT_UNIT,
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_RECIPE_COLOR,
  DEFAULT_SERVINGS,
} from './grocery-constants'
import { useGroceryStore } from './grocery-store'

const now = new Date('2026-07-19T12:00:00Z')

beforeEach(() => {
  useGroceryStore.setState(useGroceryStore.getInitialState(), true)
  useGroceryStore.setState({ items: [], recipes: [] })
  vi.useFakeTimers()
  vi.setSystemTime(now)
})

afterEach(() => {
  vi.useRealTimers()
})

function store() {
  return useGroceryStore.getState()
}

function findItem(id: string) {
  return store().items.find((item) => item.id === id)
}

function findRecipe(id: string) {
  return store().recipes.find((recipe) => recipe.id === id)
}

describe('addItem', () => {
  it('fills kitchen defaults from the name alone', () => {
    const item = store().addItem('  Baby spinach ', 'kitchen')

    expect(item.name).toBe('Baby spinach')
    expect(item.location).toBe('kitchen')
    expect(item.quantity).toEqual({ amount: 1, unit: COUNT_UNIT })
    expect(item.expiresAtIso).toBe(
      expiryFromDays(now.toISOString(), DEFAULT_EXPIRY_DAYS.produce!)
    )
    expect(item.addedAtIso).toBe(now.toISOString())
    expect(item.substitutions).toEqual([])
    expect(store().items).toContainEqual(item)
  })

  it('leaves shelf-stable kitchen items without an expiry', () => {
    expect(store().addItem('Olive oil', 'kitchen').expiresAtIso).toBeNull()
    expect(store().addItem('Mystery paste', 'kitchen').expiresAtIso).toBeNull()
  })

  it('never assigns an expiry to shopping-list items', () => {
    const item = store().addItem('Baby spinach', 'shopping-list', {
      amount: 2,
      unit: 'bag',
    })

    expect(item.location).toBe('shopping-list')
    expect(item.expiresAtIso).toBeNull()
    expect(item.quantity).toEqual({ amount: 2, unit: 'bag' })
  })

  it('assigns a unique id per item', () => {
    expect(store().addItem('Pecorino', 'shopping-list').id).not.toBe(
      store().addItem('Pecorino', 'shopping-list').id
    )
  })
})

describe('updateItem', () => {
  it('changes only the given fields', () => {
    const item = store().addItem('Baby spinach', 'kitchen')

    store().updateItem(item.id, {
      quantity: { amount: 2, unit: 'bag' },
      expiresAtIso: '2026-07-22T12:00:00.000Z',
    })

    const updated = findItem(item.id)!
    expect(updated.quantity).toEqual({ amount: 2, unit: 'bag' })
    expect(updated.expiresAtIso).toBe('2026-07-22T12:00:00.000Z')
    expect(updated.name).toBe('Baby spinach')
  })

  it('ignores unknown ids', () => {
    store().addItem('Baby spinach', 'kitchen')
    const before = store().items

    store().updateItem('missing', { name: 'Kale' })

    expect(store().items).toEqual(before)
  })
})

describe('deleteItem', () => {
  it('removes only the given item', () => {
    const spinach = store().addItem('Baby spinach', 'kitchen')
    const milk = store().addItem('Whole milk', 'kitchen')

    store().deleteItem(spinach.id)

    expect(findItem(spinach.id)).toBeUndefined()
    expect(findItem(milk.id)).toEqual(milk)
  })
})

describe('moveItem', () => {
  it('flips a bought item into the kitchen with a fresh expiry, keeping its id', () => {
    const item = store().addItem('Baby spinach', 'shopping-list', {
      amount: 2,
      unit: 'bag',
    })
    const recipe = store().addRecipe('Sat. frittata')
    store().addRecipeIngredient(recipe.id, item.id, { amount: 1, unit: 'bag' })

    vi.setSystemTime(new Date('2026-07-20T09:00:00Z'))
    store().moveItem(item.id, 'kitchen')

    const moved = findItem(item.id)!
    expect(moved.location).toBe('kitchen')
    expect(moved.quantity).toEqual({ amount: 2, unit: 'bag' })
    expect(moved.addedAtIso).toBe('2026-07-20T09:00:00.000Z')
    expect(moved.expiresAtIso).toBe(
      expiryFromDays('2026-07-20T09:00:00.000Z', DEFAULT_EXPIRY_DAYS.produce!)
    )
    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { itemId: item.id, needed: { amount: 1, unit: 'bag' } },
    ])
  })

  it('flips a kitchen item onto the list, clearing its expiry', () => {
    const item = store().addItem('Baby spinach', 'kitchen')

    store().moveItem(item.id, 'shopping-list')

    const moved = findItem(item.id)!
    expect(moved.location).toBe('shopping-list')
    expect(moved.expiresAtIso).toBeNull()
  })

  it('merges into a same-named item at the destination, repointing recipes', () => {
    const inKitchen = store().addItem('Baby spinach', 'kitchen')
    const onList = store().addItem('baby spinach', 'shopping-list')
    const recipe = store().addRecipe('Sat. frittata')
    store().addRecipeIngredient(recipe.id, onList.id, { amount: 1, unit: 'bag' })

    store().moveItem(onList.id, 'kitchen')

    expect(findItem(onList.id)).toBeUndefined()
    expect(findItem(inKitchen.id)).toEqual(inKitchen)
    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { itemId: inKitchen.id, needed: { amount: 1, unit: 'bag' } },
    ])
  })

  it('drops the moved entry when a recipe already uses the merge target', () => {
    const inKitchen = store().addItem('Baby spinach', 'kitchen')
    const onList = store().addItem('Baby spinach', 'shopping-list')
    const recipe = store().addRecipe('Sat. frittata')
    store().addRecipeIngredient(recipe.id, inKitchen.id, {
      amount: 1,
      unit: 'bag',
    })
    store().addRecipeIngredient(recipe.id, onList.id, { amount: 2, unit: 'bag' })

    store().moveItem(onList.id, 'kitchen')

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { itemId: inKitchen.id, needed: { amount: 1, unit: 'bag' } },
    ])
  })

  it('ignores unknown ids and moves to the same location', () => {
    const item = store().addItem('Baby spinach', 'kitchen')
    const before = store().items

    store().moveItem('missing', 'kitchen')
    store().moveItem(item.id, 'kitchen')

    expect(store().items).toEqual(before)
  })
})

describe('substitutions', () => {
  it('adds trimmed, deduplicated substitutes', () => {
    const item = store().addItem('Fresh dill', 'kitchen')
    const { addSubstitution } = store()

    addSubstitution(item.id, ' dried dill ')
    addSubstitution(item.id, 'dried dill')
    addSubstitution(item.id, '   ')
    addSubstitution(item.id, 'tarragon')

    expect(findItem(item.id)!.substitutions).toEqual(['dried dill', 'tarragon'])
  })

  it('removes a substitute', () => {
    const item = store().addItem('Fresh dill', 'kitchen')
    const { addSubstitution, removeSubstitution } = store()
    addSubstitution(item.id, 'tarragon')

    removeSubstitution(item.id, 'tarragon')

    expect(findItem(item.id)!.substitutions).toEqual([])
  })
})

describe('addRecipe', () => {
  it('fills sensible defaults from the name alone', () => {
    const recipe = store().addRecipe('  Cacio e pepe ')

    expect(recipe.name).toBe('Cacio e pepe')
    expect(recipe.color).toBe(DEFAULT_RECIPE_COLOR)
    expect(recipe.servings).toBe(DEFAULT_SERVINGS)
    expect(recipe.cookingThisWeek).toBe(false)
    expect(recipe.ingredients).toEqual([])
    expect(store().recipes).toContainEqual(recipe)
  })

  it('assigns a unique id per recipe', () => {
    expect(store().addRecipe('Cacio e pepe').id).not.toBe(
      store().addRecipe('Cacio e pepe').id
    )
  })
})

describe('updateRecipe', () => {
  it('changes only the given fields', () => {
    const recipe = store().addRecipe('Cacio e pepe')

    store().updateRecipe(recipe.id, { servings: 4, color: '#123456' })

    const updated = findRecipe(recipe.id)!
    expect(updated.servings).toBe(4)
    expect(updated.color).toBe('#123456')
    expect(updated.name).toBe('Cacio e pepe')
  })

  it('ignores unknown ids', () => {
    store().addRecipe('Cacio e pepe')
    const before = store().recipes

    store().updateRecipe('missing', { name: 'Other' })

    expect(store().recipes).toEqual(before)
  })
})

describe('deleteRecipe', () => {
  it('removes only the given recipe', () => {
    const tacoNight = store().addRecipe('Taco night')
    const frittata = store().addRecipe('Sat. frittata')

    store().deleteRecipe(tacoNight.id)

    expect(findRecipe(tacoNight.id)).toBeUndefined()
    expect(findRecipe(frittata.id)).toEqual(frittata)
  })
})

describe('addRecipeIngredient', () => {
  it('adds a new ingredient to the recipe', () => {
    const recipe = store().addRecipe('Cacio e pepe')

    store().addRecipeIngredient(recipe.id, 'ing-parmesan', {
      amount: 80,
      unit: 'g',
    })

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { itemId: 'ing-parmesan', needed: { amount: 80, unit: 'g' } },
    ])
  })

  it('does not add the same item twice', () => {
    const recipe = store().addRecipe('Cacio e pepe')
    const { addRecipeIngredient } = store()

    addRecipeIngredient(recipe.id, 'ing-parmesan', { amount: 80, unit: 'g' })
    addRecipeIngredient(recipe.id, 'ing-parmesan', { amount: 200, unit: 'g' })

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { itemId: 'ing-parmesan', needed: { amount: 80, unit: 'g' } },
    ])
  })
})

describe('removeRecipeIngredient', () => {
  it('removes only the given item', () => {
    const recipe = store().addRecipe('Cacio e pepe')
    const { addRecipeIngredient, removeRecipeIngredient } = store()
    addRecipeIngredient(recipe.id, 'ing-parmesan', { amount: 80, unit: 'g' })
    addRecipeIngredient(recipe.id, 'ing-pepper', { amount: 1, unit: 'tsp' })

    removeRecipeIngredient(recipe.id, 'ing-parmesan')

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { itemId: 'ing-pepper', needed: { amount: 1, unit: 'tsp' } },
    ])
  })
})

describe('updateRecipeIngredientQuantity', () => {
  it('changes the needed quantity for the given item', () => {
    const recipe = store().addRecipe('Cacio e pepe')
    const { addRecipeIngredient, updateRecipeIngredientQuantity } = store()
    addRecipeIngredient(recipe.id, 'ing-parmesan', { amount: 80, unit: 'g' })

    updateRecipeIngredientQuantity(recipe.id, 'ing-parmesan', {
      amount: 120,
      unit: 'g',
    })

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { itemId: 'ing-parmesan', needed: { amount: 120, unit: 'g' } },
    ])
  })

  it('ignores items the recipe does not have', () => {
    const recipe = store().addRecipe('Cacio e pepe')

    store().updateRecipeIngredientQuantity(recipe.id, 'ing-parmesan', {
      amount: 120,
      unit: 'g',
    })

    expect(findRecipe(recipe.id)!.ingredients).toEqual([])
  })
})
