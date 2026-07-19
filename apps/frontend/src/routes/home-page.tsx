import { IonPage } from '@ionic/react'
import { ThisWeekRecipes } from '@/features/groceries/recipes'
import { ShoppingListScreen } from '@/features/groceries/shopping-list'

export function HomePage() {
  return (
    <IonPage>
      <div className="flex h-full w-full flex-col bg-background">
        <header className="px-4 pt-8 pb-3">
          <h1 className="text-3xl font-semibold text-foreground">Home</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <ThisWeekRecipes />
          <ShoppingListScreen />
        </main>
      </div>
    </IonPage>
  )
}
