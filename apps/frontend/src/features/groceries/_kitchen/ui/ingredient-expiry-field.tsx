import {
  daysToMs,
  daysUntilExpiry,
  expiresAfterMsForDate,
  expiryDateInputValue,
  expiryLabel,
} from '../../logic/expiration'
import { EXPIRY_PRESETS_DAYS } from '../../state/kitchen-constants'
import { useKitchenStore } from '../../state/kitchen-store'
import type { Ingredient } from '../../types'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function IngredientExpiryField({
  ingredient,
}: {
  ingredient: Ingredient
}) {
  const updateIngredient = useKitchenStore((state) => state.updateIngredient)
  const expiryStatus = expiryLabel(daysUntilExpiry(ingredient))

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label>Expires after buying</Label>
        {expiryStatus !== null && (
          <span className="text-xs text-muted-foreground">{expiryStatus}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {EXPIRY_PRESETS_DAYS.map((days) => (
          <Button
            key={days}
            size="sm"
            variant={
              ingredient.expiresAfterMs === daysToMs(days)
                ? 'default'
                : 'outline'
            }
            onClick={() =>
              updateIngredient(ingredient.id, { expiresAfterMs: daysToMs(days) })
            }
          >
            {days}d
          </Button>
        ))}
        <Button
          size="sm"
          variant={ingredient.expiresAfterMs === null ? 'default' : 'outline'}
          onClick={() =>
            updateIngredient(ingredient.id, { expiresAfterMs: null })
          }
        >
          Never
        </Button>
      </div>
      <Input
        type="date"
        aria-label="Expiration date"
        value={expiryDateInputValue(ingredient)}
        onChange={(event) => {
          if (event.target.value === '') return
          updateIngredient(ingredient.id, {
            expiresAfterMs: expiresAfterMsForDate(
              ingredient.addedAtIso,
              event.target.value
            ),
          })
        }}
      />
    </section>
  )
}
