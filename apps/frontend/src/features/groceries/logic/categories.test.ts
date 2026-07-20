import { describe, expect, it } from 'vitest'
import { categoryFor, inferCategory } from './categories'

describe('inferCategory', () => {
  it('matches known keywords regardless of casing', () => {
    expect(inferCategory('Baby Spinach')).toBe('produce')
    expect(inferCategory('whole milk')).toBe('dairy')
    expect(inferCategory('Ground beef')).toBe('meat')
    expect(inferCategory('Tortillas')).toBe('bakery')
    expect(inferCategory('Spaghetti')).toBe('pantry')
  })

  it('prefers the longest keyword when several match', () => {
    expect(inferCategory('Bell pepper')).toBe('produce')
    expect(inferCategory('Black pepper')).toBe('pantry')
  })

  it('matches the frozen keyword', () => {
    expect(inferCategory('Frozen peas')).toBe('frozen')
  })

  it('falls back to other for unknown names', () => {
    expect(inferCategory('Mystery paste')).toBe('other')
  })
})

describe('categoryFor', () => {
  it('prefers the cached category over keyword inference', () => {
    expect(categoryFor('Mystery paste', { 'mystery paste': 'pantry' })).toBe(
      'pantry'
    )
    expect(categoryFor('Frozen peas', { 'frozen peas': 'produce' })).toBe(
      'produce'
    )
  })

  it('normalises the name before looking it up', () => {
    expect(categoryFor('  Dragon Fruit ', { 'dragon fruit': 'produce' })).toBe(
      'produce'
    )
  })

  it('falls back to keyword inference on a cache miss', () => {
    expect(categoryFor('Whole milk', {})).toBe('dairy')
  })
})
