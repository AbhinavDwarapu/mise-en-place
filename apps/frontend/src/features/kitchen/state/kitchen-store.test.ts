import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { daysToMs } from '../logic/expiration'
import { DEFAULT_EXPIRY_DAYS } from './constants'
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

describe('addIngredient', () => {
  it('fills sensible defaults from the name alone', () => {
    const ingredient = addIngredient('  Baby spinach ')

    expect(ingredient.name).toBe('Baby spinach')
    expect(ingredient.category).toBe('produce')
    expect(ingredient.quantity).toEqual({ amount: 1, unit: 'x' })
    expect(ingredient.expiresAfterMs).toBe(
      daysToMs(DEFAULT_EXPIRY_DAYS.produce!)
    )
    expect(ingredient.addedAtIso).toBe(now.toISOString())
    expect(ingredient.substitutions).toEqual([])
    expect(useKitchenStore.getState().ingredients).toEqual([ingredient])
  })

  it('assigns a unique id per ingredient', () => {
    expect(addIngredient('Baby spinach').id).not.toBe(
      addIngredient('Baby spinach').id
    )
  })

  it('leaves shelf-stable categories without an expiry', () => {
    expect(addIngredient('Olive oil').expiresAfterMs).toBeNull()
    expect(addIngredient('Mystery paste').expiresAfterMs).toBeNull()
  })
})

describe('updateIngredient', () => {
  it('changes only the given fields', () => {
    const ingredient = addIngredient('Baby spinach')

    useKitchenStore.getState().updateIngredient(ingredient.id, {
      quantity: { amount: 2, unit: 'bag' },
      expiresAfterMs: daysToMs(3),
    })

    const updated = useKitchenStore.getState().ingredients[0]!
    expect(updated.quantity).toEqual({ amount: 2, unit: 'bag' })
    expect(updated.expiresAfterMs).toBe(daysToMs(3))
    expect(updated.name).toBe('Baby spinach')
  })

  it('ignores unknown ids', () => {
    const ingredient = addIngredient('Baby spinach')
    useKitchenStore.getState().updateIngredient('missing', { name: 'Kale' })
    expect(useKitchenStore.getState().ingredients).toEqual([ingredient])
  })
})

describe('deleteIngredient', () => {
  it('removes the ingredient', () => {
    const spinach = addIngredient('Baby spinach')
    const milk = addIngredient('Whole milk')

    useKitchenStore.getState().deleteIngredient(spinach.id)

    expect(useKitchenStore.getState().ingredients).toEqual([milk])
  })
})

describe('substitutions', () => {
  it('adds trimmed, deduplicated substitutes', () => {
    const ingredient = addIngredient('Baby spinach')
    const { addSubstitution } = useKitchenStore.getState()

    addSubstitution(ingredient.id, ' frozen spinach ')
    addSubstitution(ingredient.id, 'frozen spinach')
    addSubstitution(ingredient.id, '   ')
    addSubstitution(ingredient.id, 'kale')

    expect(useKitchenStore.getState().ingredients[0]!.substitutions).toEqual([
      'frozen spinach',
      'kale',
    ])
  })

  it('removes a substitute', () => {
    const ingredient = addIngredient('Baby spinach')
    const { addSubstitution, removeSubstitution } = useKitchenStore.getState()
    addSubstitution(ingredient.id, 'kale')

    removeSubstitution(ingredient.id, 'kale')

    expect(useKitchenStore.getState().ingredients[0]!.substitutions).toEqual([])
  })
})
