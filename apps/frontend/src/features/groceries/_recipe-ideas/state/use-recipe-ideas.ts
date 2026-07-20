import { useCallback, useEffect, useState } from 'react'
import {
  fetchRecipeIdeas,
  type RecipeIdea,
} from '../../boundary/suggestions-api'

export type RecipeIdeas = {
  ideas: RecipeIdea[]
  status: 'loading' | 'ready' | 'failed'
  refresh: () => void
}

const cache = new Map<string, RecipeIdea[]>()

export function clearRecipeIdeasCache() {
  cache.clear()
}

export function recipeIdeasKey(selected: string[]): string {
  return [...selected].sort().join('|')
}

export function useRecipeIdeas(
  selected: string[],
  kitchen: string[]
): RecipeIdeas {
  const cacheKey = recipeIdeasKey(selected)
  const [ideas, setIdeas] = useState(() => cache.get(cacheKey) ?? [])
  const [status, setStatus] = useState<RecipeIdeas['status']>(
    cache.has(cacheKey) ? 'ready' : 'loading'
  )

  const request = useCallback(
    () =>
      fetchRecipeIdeas(selected, kitchen)
        .then((fetched) => {
          cache.set(cacheKey, fetched)
          setIdeas(fetched)
          setStatus('ready')
        })
        .catch(() => setStatus('failed')),
    [cacheKey, selected, kitchen]
  )

  useEffect(() => {
    if (cache.has(cacheKey)) return
    request()
  }, [cacheKey, request])

  const refresh = () => {
    setStatus('loading')
    request()
  }

  return { ideas, status, refresh }
}
