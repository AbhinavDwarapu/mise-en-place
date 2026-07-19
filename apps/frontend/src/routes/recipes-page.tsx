import { IonPage } from '@ionic/react'
import { RecipesScreen } from '@/features/kitchen'

export function RecipesPage() {
  return (
    <IonPage>
      <div className="flex h-full w-full flex-col bg-background">
        <header className="px-4 pt-8 pb-3">
          <h1 className="text-3xl font-semibold text-foreground">Recipes</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <RecipesScreen />
        </main>
      </div>
    </IonPage>
  )
}
