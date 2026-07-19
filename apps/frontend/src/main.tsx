import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Redirect, Route } from 'react-router-dom'
import '@ionic/react/css/core.css'
import './index.css'
import { KitchenPage } from '@/routes/kitchen-page'

setupIonicReact()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/kitchen" component={KitchenPage} />
          <Redirect exact from="/" to="/kitchen" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </StrictMode>,
)
