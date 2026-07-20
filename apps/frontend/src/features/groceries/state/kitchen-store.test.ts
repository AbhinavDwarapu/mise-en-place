import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expiryFromDays } from '../logic/expiration'
import {
  COUNT_UNIT,
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_RECIPE_COLOR,
  DEFAULT_SERVINGS,
} from './kitchen-constants'
import { useKitchenStore } from './kitchen-store'

const now = new Date('2026-07-19T12:00:00Z')

beforeEach(() => {
  useKitchenStore.setState(useKitchenStore.getInitialState(), true)
  vi.useFakeTimers()
  vi.setSystemTime(now)
})

afterEach(() => {
  vi.useRealTimers()
})

function addIngredient(name: string) {
  return useKitchenStore.getState().addIngredient(name)
}

function findIngredient(id: string) {
  return useKitchenStore
    .getState()
    .ingredients.find((ingredient) => ingredient.id === id)
}

function addRecipe(name: string) {
  return useKitchenStore.getState().addRecipe(name)
}

function findRecipe(id: string) {
  return useKitchenStore.getState().recipes.find((recipe) => recipe.id === id)
}

describe('addIngredient', () => {
  it('fills sensible defaults from the name alone', () => {
    const ingredient = addIngredient('  Baby spinach ')

    expect(ingredient.name).toBe('Baby spinach')
    expect(ingredient.quantity).toEqual({ amount: 1, unit: COUNT_UNIT })
    expect(ingredient.expiresAtIso).toBe(
      expiryFromDays(now.toISOString(), DEFAULT_EXPIRY_DAYS.produce!)
    )
    expect(ingredient.addedAtIso).toBe(now.toISOString())
    expect(ingredient.substitutions).toEqual([])
    expect(useKitchenStore.getState().ingredients).toContainEqual(ingredient)
  })

  it('assigns a unique id per ingredient', () => {
    expect(addIngredient('Baby spinach').id).not.toBe(
      addIngredient('Baby spinach').id
    )
  })

  it('leaves shelf-stable categories without an expiry', () => {
    expect(addIngredient('Olive oil').expiresAtIso).toBeNull()
    expect(addIngredient('Mystery paste').expiresAtIso).toBeNull()
  })
})

describe('updateIngredient', () => {
  it('changes only the given fields', () => {
    const ingredient = addIngredient('Baby spinach')

    useKitchenStore.getState().updateIngredient(ingredient.id, {
      quantity: { amount: 2, unit: 'bag' },
      expiresAtIso: '2026-07-22T12:00:00.000Z',
    })

    const updated = findIngredient(ingredient.id)!
    expect(updated.quantity).toEqual({ amount: 2, unit: 'bag' })
    expect(updated.expiresAtIso).toBe('2026-07-22T12:00:00.000Z')
    expect(updated.name).toBe('Baby spinach')
  })

  it('ignores unknown ids', () => {
    addIngredient('Baby spinach')
    const before = useKitchenStore.getState().ingredients

    useKitchenStore.getState().updateIngredient('missing', { name: 'Kale' })

    expect(useKitchenStore.getState().ingredients).toEqual(before)
  })
})

describe('deleteIngredient', () => {
  it('removes only the given ingredient', () => {
    const spinach = addIngredient('Baby spinach')
    const milk = addIngredient('Whole milk')

    useKitchenStore.getState().deleteIngredient(spinach.id)

    expect(findIngredient(spinach.id)).toBeUndefined()
    expect(findIngredient(milk.id)).toEqual(milk)
  })
})

describe('substitutions', () => {
  it('adds trimmed, deduplicated substitutes', () => {
    const ingredient = addIngredient('Fresh dill')
    const { addSubstitution } = useKitchenStore.getState()

    addSubstitution(ingredient.id, ' dried dill ')
    addSubstitution(ingredient.id, 'dried dill')
    addSubstitution(ingredient.id, '   ')
    addSubstitution(ingredient.id, 'tarragon')

    expect(findIngredient(ingredient.id)!.substitutions).toEqual([
      'dried dill',
      'tarragon',
    ])
  })

  it('removes a substitute', () => {
    const ingredient = addIngredient('Fresh dill')
    const { addSubstitution, removeSubstitution } = useKitchenStore.getState()
    addSubstitution(ingredient.id, 'tarragon')

    removeSubstitution(ingredient.id, 'tarragon')

    expect(findIngredient(ingredient.id)!.substitutions).toEqual([])
  })
})

describe('addRecipe', () => {
  it('fills sensible defaults from the name alone', () => {
    const recipe = addRecipe('  Cacio e pepe ')

    expect(recipe.name).toBe('Cacio e pepe')
    expect(recipe.color).toBe(DEFAULT_RECIPE_COLOR)
    expect(recipe.servings).toBe(DEFAULT_SERVINGS)
    expect(recipe.cookingThisWeek).toBe(false)
    expect(recipe.ingredients).toEqual([])
    expect(useKitchenStore.getState().recipes).toContainEqual(recipe)
  })

  it('assigns a unique id per recipe', () => {
    expect(addRecipe('Cacio e pepe').id).not.toBe(
      addRecipe('Cacio e pepe').id
    )
  })
})

describe('updateRecipe', () => {
  it('changes only the given fields', () => {
    const recipe = addRecipe('Cacio e pepe')

    useKitchenStore.getState().updateRecipe(recipe.id, {
      servings: 4,
      color: '#123456',
    })

    const updated = findRecipe(recipe.id)!
    expect(updated.servings).toBe(4)
    expect(updated.color).toBe('#123456')
    expect(updated.name).toBe('Cacio e pepe')
  })

  it('ignores unknown ids', () => {
    addRecipe('Cacio e pepe')
    const before = useKitchenStore.getState().recipes

    useKitchenStore.getState().updateRecipe('missing', { name: 'Other' })

    expect(useKitchenStore.getState().recipes).toEqual(before)
  })
})

describe('deleteRecipe', () => {
  it('removes only the given recipe', () => {
    const tacoNight = addRecipe('Taco night')
    const frittata = addRecipe('Sat. frittata')

    useKitchenStore.getState().deleteRecipe(tacoNight.id)

    expect(findRecipe(tacoNight.id)).toBeUndefined()
    expect(findRecipe(frittata.id)).toEqual(frittata)
  })
})

describe('addRecipeIngredient', () => {
  it('adds a new ingredient to the recipe', () => {
    const recipe = addRecipe('Cacio e pepe')
    const source = { kind: 'kitchen' as const, ingredientId: 'ing-parmesan' }

    useKitchenStore
      .getState()
      .addRecipeIngredient(recipe.id, source, { amount: 80, unit: 'g' })

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { source, needed: { amount: 80, unit: 'g' } },
    ])
  })

  it('does not add the same source twice', () => {
    const recipe = addRecipe('Cacio e pepe')
    const { addRecipeIngredient } = useKitchenStore.getState()
    const source = { kind: 'kitchen' as const, ingredientId: 'ing-parmesan' }

    addRecipeIngredient(recipe.id, source, { amount: 80, unit: 'g' })
    addRecipeIngredient(recipe.id, source, { amount: 200, unit: 'g' })

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { source, needed: { amount: 80, unit: 'g' } },
    ])
  })
})

describe('removeRecipeIngredient', () => {
  it('removes only the given source', () => {
    const recipe = addRecipe('Cacio e pepe')
    const { addRecipeIngredient, removeRecipeIngredient } =
      useKitchenStore.getState()
    const parmesan = { kind: 'kitchen' as const, ingredientId: 'ing-parmesan' }
    const pepper = { kind: 'kitchen' as const, ingredientId: 'ing-pepper' }
    addRecipeIngredient(recipe.id, parmesan, { amount: 80, unit: 'g' })
    addRecipeIngredient(recipe.id, pepper, { amount: 1, unit: 'tsp' })

    removeRecipeIngredient(recipe.id, parmesan)

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { source: pepper, needed: { amount: 1, unit: 'tsp' } },
    ])
  })
})

describe('updateRecipeIngredientQuantity', () => {
  it('changes the needed quantity for the given source', () => {
    const recipe = addRecipe('Cacio e pepe')
    const { addRecipeIngredient, updateRecipeIngredientQuantity } =
      useKitchenStore.getState()
    const parmesan = { kind: 'kitchen' as const, ingredientId: 'ing-parmesan' }
    addRecipeIngredient(recipe.id, parmesan, { amount: 80, unit: 'g' })

    updateRecipeIngredientQuantity(recipe.id, parmesan, {
      amount: 120,
      unit: 'g',
    })

    expect(findRecipe(recipe.id)!.ingredients).toEqual([
      { source: parmesan, needed: { amount: 120, unit: 'g' } },
    ])
  })

  it('ignores sources the recipe does not have', () => {
    const recipe = addRecipe('Cacio e pepe')
    const { updateRecipeIngredientQuantity } = useKitchenStore.getState()
    const parmesan = { kind: 'kitchen' as const, ingredientId: 'ing-parmesan' }

    updateRecipeIngredientQuantity(recipe.id, parmesan, {
      amount: 120,
      unit: 'g',
    })

    expect(findRecipe(recipe.id)!.ingredients).toEqual([])
  })
})
