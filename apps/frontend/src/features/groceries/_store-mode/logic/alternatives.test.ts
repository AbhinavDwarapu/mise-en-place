import { describe, expect, it } from 'vitest'
import { COUNT_UNIT } from '../../state/kitchen-constants'
import type { Ingredient } from '../../types'
import { alternativesFor } from './alternatives'

function ingredient(name: string, substitutions: string[] = []): Ingredient {
  return {
    id: name.toLowerCase(),
    name,
    quantity: { amount: 1, unit: COUNT_UNIT },
    expiresAtIso: null,
    addedAtIso: '2026-07-19T12:00:00.000Z',
    substitutions,
  }
}

const spinach = ingredient('Baby spinach', ['frozen spinach', 'kale'])
const onions = ingredient('Onions')

describe('alternativesFor', () => {
  it('returns the substitutions of the same-named kitchen ingredient', () => {
    expect(alternativesFor('Baby spinach', [onions, spinach])).toEqual([
      'frozen spinach',
      'kale',
    ])
  })

  it('matches names case-insensitively and ignores surrounding spaces', () => {
    expect(alternativesFor('  baby SPINACH ', [spinach])).toEqual([
      'frozen spinach',
      'kale',
    ])
  })

  it('returns nothing when no kitchen ingredient has that name', () => {
    expect(alternativesFor('Cilantro', [spinach])).toEqual([])
  })

  it('returns nothing when the matching ingredient has no substitutions', () => {
    expect(alternativesFor('Onions', [onions])).toEqual([])
  })
})
