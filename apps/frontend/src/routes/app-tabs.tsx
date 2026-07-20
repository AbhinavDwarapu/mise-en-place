import { IonRouterOutlet } from '@ionic/react'
import { Redirect, Route } from 'react-router-dom'
import { AppTabBar } from './app-tab-bar'
import { DevPage } from './dev-page'
import { HomePage } from './home-page'
import { IdeasPage } from './ideas-page'
import { KitchenPage } from './kitchen-page'
import { RecipesPage } from './recipes-page'
import { StorePage } from './store-page'

export function AppTabs() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        <IonRouterOutlet>
          <Route exact path="/dev" component={DevPage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/ideas" component={IdeasPage} />
          <Route exact path="/kitchen" component={KitchenPage} />
          <Route exact path="/recipes" component={RecipesPage} />
          <Route exact path="/store" component={StorePage} />
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>
      </div>
      <AppTabBar />
    </div>
  )
}
