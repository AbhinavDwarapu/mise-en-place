import { IonPage } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { IdeasEntryLink } from '@/features/groceries/_recipe-ideas'
import { ThisWeekRecipes } from '@/features/groceries/_recipes'
import { ShoppingListScreen } from '@/features/groceries/_shopping-list'
import { StartShoppingButton } from '@/features/groceries/_store-mode'

export function HomePage() {
  const history = useHistory()

  return (
    <IonPage>
      <div className="flex h-full w-full flex-col bg-background">
        <header className="px-4 pt-8 pb-3">
          <h1 className="text-3xl font-semibold text-foreground">Home</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <IdeasEntryLink />
          <ThisWeekRecipes />
          <ShoppingListScreen />
        </main>
        <footer className="shrink-0 border-t border-border bg-background p-4">
          <StartShoppingButton onStart={() => history.push('/store')} />
        </footer>
      </div>
    </IonPage>
  )
}
