import { IonPage } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { StoreModeScreen } from '@/features/groceries/store-mode'

export function StorePage() {
  const history = useHistory()

  return (
    <IonPage>
      <div className="dark flex h-full w-full flex-col bg-background text-foreground">
        <StoreModeScreen onComplete={() => history.push('/home')} />
      </div>
    </IonPage>
  )
}
