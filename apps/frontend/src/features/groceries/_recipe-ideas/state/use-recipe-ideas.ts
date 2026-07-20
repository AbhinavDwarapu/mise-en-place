import { useEffect, useState } from 'react'
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

export function useRecipeIdeas(
  selected: string[],
  kitchen: string[]
): RecipeIdeas {
  const cacheKey = [...selected].sort().join('|')
  const [, bumpVersion] = useState(0)
  const [failedKey, setFailedKey] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (cache.has(cacheKey)) return
    let cancelled = false
    fetchRecipeIdeas(selected, kitchen)
      .then((fetched) => {
        cache.set(cacheKey, fetched)
        if (!cancelled) bumpVersion((version) => version + 1)
      })
      .catch(() => {
        if (!cancelled) setFailedKey(cacheKey)
      })
    return () => {
      cancelled = true
    }
  }, [cacheKey, attempt, selected, kitchen])

  const cached = cache.get(cacheKey)
  const status =
    cached !== undefined
      ? 'ready'
      : failedKey === cacheKey
        ? 'failed'
        : 'loading'

  const refresh = () => {
    setFailedKey(null)
    setAttempt((current) => current + 1)
  }

  return { ideas: cached ?? [], status, refresh }
}
