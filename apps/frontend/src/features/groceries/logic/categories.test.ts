import { describe, expect, it } from 'vitest'
import { categoryFor, groupByCategory, inferCategory } from './categories'

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

describe('groupByCategory', () => {
  const frozenPeas = { name: 'Frozen peas' }
  const milk = { name: 'Whole milk' }
  const tomatoes = { name: 'Tomatoes' }
  const mysteryPaste = { name: 'Mystery paste' }

  it('groups by the looked-up category in the fixed category order', () => {
    const groups = groupByCategory([frozenPeas, milk, tomatoes], inferCategory)

    expect(groups).toEqual([
      { category: 'produce', items: [tomatoes] },
      { category: 'dairy', items: [milk] },
      { category: 'frozen', items: [frozenPeas] },
    ])
  })

  it('omits categories with no items', () => {
    const groups = groupByCategory([milk], inferCategory)

    expect(groups.map((group) => group.category)).toEqual(['dairy'])
  })

  it('puts unrecognised names in other', () => {
    expect(groupByCategory([mysteryPaste], inferCategory)).toEqual([
      { category: 'other', items: [mysteryPaste] },
    ])
  })

  it('follows the provided lookup over keyword inference', () => {
    expect(groupByCategory([mysteryPaste], () => 'pantry')).toEqual([
      { category: 'pantry', items: [mysteryPaste] },
    ])
  })

  it('returns no groups for an empty list', () => {
    expect(groupByCategory([], inferCategory)).toEqual([])
  })
})
