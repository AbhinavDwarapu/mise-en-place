import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route } from 'react-router-dom'
import '@ionic/react/css/core.css'
import './index.css'
import App from './App.tsx'

setupIonicReact()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={App} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </StrictMode>,
)
