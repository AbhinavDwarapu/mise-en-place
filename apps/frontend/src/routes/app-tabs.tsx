import { IonRouterOutlet } from '@ionic/react'
import { BookOpenIcon, RefrigeratorIcon } from 'lucide-react'
import { NavLink, Redirect, Route } from 'react-router-dom'
import { KitchenPage } from './kitchen-page'
import { RecipesPage } from './recipes-page'

const TABS = [
  { to: '/kitchen', label: 'Kitchen', Icon: RefrigeratorIcon },
  { to: '/recipes', label: 'Recipes', Icon: BookOpenIcon },
] as const

export function AppTabs() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        <IonRouterOutlet>
          <Route exact path="/kitchen" component={KitchenPage} />
          <Route exact path="/recipes" component={RecipesPage} />
          <Redirect exact from="/" to="/kitchen" />
        </IonRouterOutlet>
      </div>
      <nav className="flex shrink-0 border-t border-border bg-background">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-xs text-muted-foreground"
            activeClassName="text-foreground"
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
