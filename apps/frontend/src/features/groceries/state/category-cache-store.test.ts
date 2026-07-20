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

    expect(useCategoryCacheStore.getState().categories).toEqual({
      'dragon fruit': 'produce',
    })
  })

  it('merges new answers over existing ones', () => {
    const { setCategories } = useCategoryCacheStore.getState()

    setCategories({ halloumi: 'other' })
    setCategories({ halloumi: 'dairy', 'oat milk': 'dairy' })

    expect(useCategoryCacheStore.getState().categories).toEqual({
      halloumi: 'dairy',
      'oat milk': 'dairy',
    })
  })
})
