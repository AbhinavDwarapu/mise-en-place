import { IonPage } from '@ionic/react'
import { ShoppingCartIcon } from 'lucide-react'
import { useHistory } from 'react-router-dom'
import { ThisWeekRecipes } from '@/features/groceries/_recipes'
import { ShoppingListScreen } from '@/features/groceries/_shopping-list'
import { Button } from '@/shared/ui/button'

export function HomePage() {
  const history = useHistory()

  return (
    <IonPage>
      <div className="flex h-full w-full flex-col bg-background">
        <header className="flex items-center justify-between px-4 pt-8 pb-3">
          <h1 className="text-3xl font-semibold text-foreground">Home</h1>
          <Button onClick={() => history.push('/store')}>
            <ShoppingCartIcon />
            Start shopping
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto">
          <ThisWeekRecipes />
          <ShoppingListScreen />
        </main>
      </div>
    </IonPage>
  )
}
