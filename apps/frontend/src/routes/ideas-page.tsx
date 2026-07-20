import { IonPage } from '@ionic/react'
import { IdeasScreen } from '@/features/groceries/_recipe-ideas'

export function IdeasPage() {
  return (
    <IonPage>
      <div className="flex h-full w-full flex-col bg-background">
        <header className="px-4 pt-8 pb-3">
          <h1 className="text-3xl font-semibold text-foreground">
            What should we use?
          </h1>
          <p className="pt-1 text-sm text-muted-foreground">
            Pick from the kitchen — expiring first
          </p>
        </header>
        <main className="flex-1 overflow-y-auto">
          <IdeasScreen />
        </main>
      </div>
    </IonPage>
  )
}
