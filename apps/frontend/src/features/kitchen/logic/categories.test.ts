import { describe, expect, it } from 'vitest'
import { inferCategory } from './categories'

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
