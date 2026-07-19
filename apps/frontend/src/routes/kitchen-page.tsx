import { IonPage } from '@ionic/react'
import { KitchenScreen } from '@/features/kitchen'

export function KitchenPage() {
  return (
    <IonPage>
      <div className="flex h-full w-full flex-col bg-background">
        <header className="px-4 pt-8 pb-3">
          <h1 className="text-3xl font-semibold text-foreground">Kitchen</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <KitchenScreen />
        </main>
      </div>
    </IonPage>
  )
}
