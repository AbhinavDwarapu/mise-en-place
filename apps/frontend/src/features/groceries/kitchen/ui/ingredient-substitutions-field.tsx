import { PlusIcon, SparklesIcon, XIcon } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { fetchSubstituteSuggestions } from '../../boundary/suggestions-api'
import { normalizeIngredientName } from '../../logic/categories'
import { useKitchenStore } from '../../state/kitchen-store'
import { useSubstituteSuggestionsStore } from '../../state/substitute-suggestions-store'
import type { Ingredient } from '../../types'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function IngredientSubstitutionsField({
  ingredient,
}: {
  ingredient: Ingredient
}) {
  const addSubstitution = useKitchenStore((state) => state.addSubstitution)
  const removeSubstitution = useKitchenStore(
    (state) => state.removeSubstitution
  )
  const suggestions =
    useSubstituteSuggestionsStore(
      (state) => state.suggestions[normalizeIngredientName(ingredient.name)]
    ) ?? []
  const setSuggestions = useSubstituteSuggestionsStore(
    (state) => state.setSuggestions
  )
  const [draft, setDraft] = useState('')
  const [suggesting, setSuggesting] = useState(true)
  const [suggestionsFailed, setSuggestionsFailed] = useState(false)

  const remainingSuggestions = suggestions.filter(
    (suggestion) =>
      !ingredient.substitutions.some(
        (existing) => existing.toLowerCase() === suggestion.toLowerCase()
      )
  )

  const requestSuggestions = useCallback(
    (name: string, existing: string[]) =>
      fetchSubstituteSuggestions(name, existing)
        .then((fetched) => {
          setSuggestions(name, fetched)
          setSuggestionsFailed(false)
        })
        .catch(() => setSuggestionsFailed(true))
        .finally(() => setSuggesting(false)),
    [setSuggestions]
  )

  const ingredientName = ingredient.name
  useEffect(() => {
    const existing =
      useKitchenStore
        .getState()
        .ingredients.find((item) => item.name === ingredientName)
        ?.substitutions ?? []
    requestSuggestions(ingredientName, existing)
  }, [ingredientName, requestSuggestions])

  const suggestNow = () => {
    setSuggesting(true)
    setSuggestionsFailed(false)
    requestSuggestions(ingredient.name, ingredient.substitutions)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (draft.trim() === '') return
    addSubstitution(ingredient.id, draft)
    setDraft('')
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="substitute-input">Substitutes</Label>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={suggestNow}
          disabled={suggesting}
        >
          <SparklesIcon />
          {suggesting ? 'Suggesting…' : 'Suggest'}
        </Button>
      </div>
      {ingredient.substitutions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ingredient.substitutions.map((substitute) => (
            <Badge key={substitute} variant="secondary" className="gap-1 pr-1">
              {substitute}
              <button
                type="button"
                aria-label={`Remove ${substitute}`}
                onClick={() => removeSubstitution(ingredient.id, substitute)}
                className="rounded-full p-0.5 hover:bg-foreground/10"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Suggested:</span>
          {remainingSuggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              render={
                <button
                  type="button"
                  onClick={() => addSubstitution(ingredient.id, suggestion)}
                />
              }
              className="cursor-pointer hover:bg-muted"
            >
              <PlusIcon />
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
      {suggestionsFailed && (
        <p className="text-xs text-destructive">Couldn't get suggestions</p>
      )}
      <form onSubmit={submit} className="flex gap-2">
        <Input
          id="substitute-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a substitute…"
          className="flex-1"
        />
        <Button type="submit" variant="secondary" disabled={draft.trim() === ''}>
          Add
        </Button>
      </form>
    </section>
  )
}
