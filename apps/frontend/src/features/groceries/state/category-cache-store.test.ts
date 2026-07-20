import { beforeEach, describe, expect, it } from 'vitest'
import { useCategoryCacheStore } from './category-cache-store'

beforeEach(() => {
  localStorage.clear()
  useCategoryCacheStore.setState(
    useCategoryCacheStore.getInitialState(),
    true
  )
})

describe('category cache store', () => {
  it('stores categories under normalised names', () => {
    useCategoryCacheStore
      .getState()
      .setCategories({ '  Dragon Fruit ': 'produce' })

    expect(useCategoryCacheStore.getState().categories['dragon fruit']).toBe(
      'produce'
    )
  })

  it('merges new answers over existing ones', () => {
    const { setCategories } = useCategoryCacheStore.getState()

    setCategories({ halloumi: 'other' })
    setCategories({ halloumi: 'dairy', 'oat milk': 'dairy' })

    const { categories } = useCategoryCacheStore.getState()
    expect(categories.halloumi).toBe('dairy')
    expect(categories['oat milk']).toBe('dairy')
  })

  it('starts seeded with the demo kitchen categories keywords would miss', () => {
    const { categories } = useCategoryCacheStore.getState()

    expect(categories['coffee beans']).toBe('other')
    expect(categories['vanilla ice cream']).toBe('frozen')
    expect(categories['frozen mixed berries']).toBe('frozen')
  })
})
