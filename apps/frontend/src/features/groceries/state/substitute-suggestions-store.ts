import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizeIngredientName } from '../logic/categories'

type SubstituteSuggestionsStore = {
  suggestions: Record<string, string[]>
  setSuggestions: (name: string, suggestions: string[]) => void
}

const SUBSTITUTE_SUGGESTIONS_STORAGE_KEY = 'substitute-suggestions-v1'

export const useSubstituteSuggestionsStore =
  create<SubstituteSuggestionsStore>()(
    persist(
      (set) => ({
        suggestions: {},

        setSuggestions: (name, suggestions) =>
          set((state) => ({
            suggestions: {
              ...state.suggestions,
              [normalizeIngredientName(name)]: suggestions,
            },
          })),
      }),
      { name: SUBSTITUTE_SUGGESTIONS_STORAGE_KEY }
    )
  )
