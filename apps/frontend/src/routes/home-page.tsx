import { IonPage } from '@ionic/react'
import { ShoppingCartIcon, SparklesIcon } from 'lucide-react'
import { useHistory } from 'react-router-dom'
import { useShoppingListStore } from '@/features/groceries'
import { ThisWeekRecipes } from '@/features/groceries/_recipes'
import { ShoppingListScreen } from '@/features/groceries/_shopping-list'
import { Button } from '@/shared/ui/button'

export function HomePage() {
  const history = useHistory()
  const itemCount = useShoppingListStore((state) => state.items.length)

  return (
    <IonPage>
      <div className="flex h-full w-full flex-col bg-background">
        <header className="px-4 pt-8 pb-3">
          <h1 className="text-3xl font-semibold text-foreground">Home</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => history.push('/ideas')}
            className="mx-4 mt-2 flex w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
              <SparklesIcon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-foreground">
                What should we use?
              </span>
              <span className="block truncate text-sm text-muted-foreground">
                Recipe ideas from ingredients expiring soon
              </span>
            </span>
          </button>
          <ThisWeekRecipes />
          <ShoppingListScreen />
        </main>
        <footer className="shrink-0 border-t border-border bg-background p-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => history.push('/store')}
          >
            <ShoppingCartIcon />
            {itemCount === 0
              ? 'Start shopping'
              : `Start shopping · ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          </Button>
        </footer>
      </div>
    </IonPage>
  )
}
