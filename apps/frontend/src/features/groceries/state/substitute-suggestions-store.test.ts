import { beforeEach, describe, expect, it } from 'vitest'
import { useSubstituteSuggestionsStore } from './substitute-suggestions-store'

beforeEach(() => {
  localStorage.clear()
  useSubstituteSuggestionsStore.setState(
    useSubstituteSuggestionsStore.getInitialState(),
    true
  )
})

describe('substitute suggestions store', () => {
  it('stores suggestions under the normalised ingredient name', () => {
    useSubstituteSuggestionsStore
      .getState()
      .setSuggestions('  Baby Spinach ', ['kale', 'chard'])

    expect(useSubstituteSuggestionsStore.getState().suggestions).toEqual({
      'baby spinach': ['kale', 'chard'],
    })
  })

  it('replaces earlier suggestions for the same ingredient', () => {
    const { setSuggestions } = useSubstituteSuggestionsStore.getState()

    setSuggestions('milk', ['oat milk'])
    setSuggestions('milk', ['soy milk', 'almond milk'])

    expect(useSubstituteSuggestionsStore.getState().suggestions.milk).toEqual([
      'soy milk',
      'almond milk',
    ])
  })

  it('keeps suggestions for other ingredients', () => {
    const { setSuggestions } = useSubstituteSuggestionsStore.getState()

    setSuggestions('milk', ['oat milk'])
    setSuggestions('butter', ['margarine'])

    expect(useSubstituteSuggestionsStore.getState().suggestions).toEqual({
      milk: ['oat milk'],
      butter: ['margarine'],
    })
  })
})
