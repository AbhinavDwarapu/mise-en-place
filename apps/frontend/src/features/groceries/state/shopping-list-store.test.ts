import { beforeEach, describe, expect, it } from 'vitest'
import { COUNT_UNIT } from './kitchen-constants'
import { useShoppingListStore } from './shopping-list-store'

beforeEach(() => {
  useShoppingListStore.setState({ items: [] })
})

function addItem(name: string, quantity = { amount: 1, unit: COUNT_UNIT }) {
  return useShoppingListStore.getState().addItem(name, quantity)
}

function findItem(id: string) {
  return useShoppingListStore.getState().items.find((item) => item.id === id)
}

describe('addItem', () => {
  it('trims the name and keeps the given quantity', () => {
    const item = addItem('  Pecorino ', { amount: 200, unit: 'g' })

    expect(item.name).toBe('Pecorino')
    expect(item.quantity).toEqual({ amount: 200, unit: 'g' })
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

describe('renameItem', () => {
  it('renames only the targeted item, keeping its id and quantity', () => {
    const spinach = addItem('Baby spinach', { amount: 1, unit: 'bag' })
    const spaghetti = addItem('Spaghetti')

    useShoppingListStore.getState().renameItem(spinach.id, 'Kale')

    expect(findItem(spinach.id)).toEqual({ ...spinach, name: 'Kale' })
    expect(findItem(spaghetti.id)).toEqual(spaghetti)
  })

  it('trims the new name', () => {
    const spinach = addItem('Baby spinach')

    useShoppingListStore.getState().renameItem(spinach.id, '  Kale ')

    expect(findItem(spinach.id)?.name).toBe('Kale')
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
