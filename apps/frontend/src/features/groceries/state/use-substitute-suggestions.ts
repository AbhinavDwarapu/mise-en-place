import { useCallback, useEffect, useState } from 'react'
import { fetchSubstituteSuggestions } from '../boundary/suggestions-api'
import { normalizeIngredientName } from '../logic/categories'
import type { Ingredient } from '../types'

export type SubstituteSuggestions = {
  suggestions: string[]
  status: 'loading' | 'ready' | 'failed'
  refresh: () => void
}

const cache = new Map<string, string[]>()

export function clearSubstituteSuggestionsCache() {
  cache.clear()
}

export function useSubstituteSuggestions(
  ingredient: Ingredient
): SubstituteSuggestions {
  const cacheKey = normalizeIngredientName(ingredient.name)
  const [suggestions, setSuggestions] = useState(
    () => cache.get(cacheKey) ?? []
  )
  const [status, setStatus] = useState<SubstituteSuggestions['status']>(
    cache.has(cacheKey) ? 'ready' : 'loading'
  )

  const { name, substitutions } = ingredient
  const request = useCallback(
    () =>
      fetchSubstituteSuggestions(name, substitutions)
        .then((fetched) => {
          cache.set(cacheKey, fetched)
          setSuggestions(fetched)
          setStatus('ready')
        })
        .catch(() => setStatus('failed')),
    [cacheKey, name, substitutions]
  )

  useEffect(() => {
    if (cache.has(cacheKey)) return
    request()
  }, [cacheKey, request])

  const refresh = () => {
    setStatus('loading')
    request()
  }

  return { suggestions, status, refresh }
}
