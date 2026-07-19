import { XIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useKitchenStore } from '../state/kitchen-store'
import type { Ingredient } from '../types'

export function IngredientSubstitutionsField({
  ingredient,
}: {
  ingredient: Ingredient
}) {
  const addSubstitution = useKitchenStore((state) => state.addSubstitution)
  const removeSubstitution = useKitchenStore(
    (state) => state.removeSubstitution
  )
  const [draft, setDraft] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (draft.trim() === '') return
    addSubstitution(ingredient.id, draft)
    setDraft('')
  }

  return (
    <section className="space-y-2">
      <Label htmlFor="substitute-input">Substitutes</Label>
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
