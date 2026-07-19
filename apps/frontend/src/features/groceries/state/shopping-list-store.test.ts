import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useShoppingListStore } from './shopping-list-store'

const now = new Date('2026-07-19T12:00:00Z')

beforeEach(() => {
  useShoppingListStore.setState(useShoppingListStore.getInitialState(), true)
  vi.useFakeTimers()
  vi.setSystemTime(now)
})

afterEach(() => {
  vi.useRealTimers()
})

function addItem(name: string, quantity = { amount: 1, unit: 'x' }) {
  return useShoppingListStore.getState().addItem(name, quantity)
}

function findItem(id: string) {
  return useShoppingListStore.getState().items.find((item) => item.id === id)
}

describe('addItem', () => {
  it('trims the name and stamps when it was added', () => {
    const item = addItem('  Pecorino ', { amount: 200, unit: 'g' })

    expect(item.name).toBe('Pecorino')
    expect(item.quantity).toEqual({ amount: 200, unit: 'g' })
    expect(item.addedAtIso).toBe(now.toISOString())
    expect(useShoppingListStore.getState().items).toContainEqual(item)
  })

  it('assigns a unique id per item', () => {
    expect(addItem('Pecorino').id).not.toBe(addItem('Pecorino').id)
  })
})

describe('updateItemQuantity', () => {
  it('updates only the targeted item', () => {
    const pecorino = addItem('Pecorino', { amount: 80, unit: 'g' })
    const spaghetti = addItem('Spaghetti')

    useShoppingListStore
      .getState()
      .updateItemQuantity(pecorino.id, { amount: 120, unit: 'g' })

    expect(findItem(pecorino.id)?.quantity).toEqual({ amount: 120, unit: 'g' })
    expect(findItem(spaghetti.id)).toEqual(spaghetti)
  })
})

describe('removeItem', () => {
  it('removes only the given item', () => {
    const pecorino = addItem('Pecorino')
    const spaghetti = addItem('Spaghetti')

    useShoppingListStore.getState().removeItem(pecorino.id)

    expect(findItem(pecorino.id)).toBeUndefined()
    expect(findItem(spaghetti.id)).toEqual(spaghetti)
  })
})
