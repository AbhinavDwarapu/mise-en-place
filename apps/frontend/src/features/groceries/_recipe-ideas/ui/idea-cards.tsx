import { PlusIcon } from 'lucide-react'
import type { RecipeIdea } from '../../boundary/suggestions-api'
import { useRecipeIdeas } from '../state/use-recipe-ideas'
import { Button } from '@/shared/ui/button'

const IDEA_COLORS = ['#86efac', '#93c5fd', '#fcd34d', '#f9a8d4']

export function IdeaCards({
  selectedNames,
  kitchenNames,
}: {
  selectedNames: string[]
  kitchenNames: string[]
}) {
  const { ideas, status, refresh } = useRecipeIdeas(selectedNames, kitchenNames)

  return (
    <section className="space-y-2">
      <h2 className="truncate text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Ideas with {selectedNames.join(' + ')}
      </h2>
      {status === 'loading' && (
        <p className="py-6 text-center text-muted-foreground">
          Thinking of ideas…
        </p>
      )}
      {status === 'failed' && (
        <div className="space-y-2 py-4 text-center">
          <p className="text-muted-foreground">Couldn’t get ideas right now.</p>
          <Button variant="outline" size="sm" onClick={refresh}>
            Try again
          </Button>
        </div>
      )}
      {status === 'ready' &&
        (ideas.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">
            No ideas this time — try different ingredients.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 pb-2">
            {ideas.map((idea, index) => (
              <IdeaCard
                key={idea.name}
                idea={idea}
                color={IDEA_COLORS[index % IDEA_COLORS.length]}
              />
            ))}
          </ul>
        ))}
    </section>
  )
}

function IdeaCard({ idea, color }: { idea: RecipeIdea; color: string }) {
  const extras = idea.extraIngredients

  return (
    <li>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border">
        <div className="h-20" style={{ backgroundColor: color }} />
        <div className="space-y-2 p-3">
          <div className="space-y-0.5">
            <p className="truncate font-medium text-foreground">{idea.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {extras.length === 0 ? (
                `uses ${idea.usedIngredients.length} from your kitchen`
              ) : (
                <>
                  + {extras.join(', ')} ·{' '}
                  <span className="text-destructive">
                    {extras.length} to buy
                  </span>
                </>
              )}
            </p>
          </div>
          <Button size="sm" className="w-full" disabled>
            <PlusIcon />
            Add to recipes
          </Button>
        </div>
      </div>
    </li>
  )
}
