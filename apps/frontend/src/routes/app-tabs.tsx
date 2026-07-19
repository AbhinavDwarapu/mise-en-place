import { IonRouterOutlet } from '@ionic/react'
import { BookOpenIcon, HomeIcon, RefrigeratorIcon } from 'lucide-react'
import { NavLink, Redirect, Route, useLocation } from 'react-router-dom'
import { HomePage } from './home-page'
import { KitchenPage } from './kitchen-page'
import { RecipesPage } from './recipes-page'
import { StorePage } from './store-page'
import { cn } from '@/shared/lib/utils'

const TABS = [
  { to: '/home', label: 'Home', Icon: HomeIcon },
  { to: '/kitchen', label: 'Kitchen', Icon: RefrigeratorIcon },
  { to: '/recipes', label: 'Recipes', Icon: BookOpenIcon },
] as const

export function AppTabs() {
  const { pathname } = useLocation()

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        <IonRouterOutlet>
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/kitchen" component={KitchenPage} />
          <Route exact path="/recipes" component={RecipesPage} />
          <Route exact path="/store" component={StorePage} />
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>
      </div>
      <nav
        className={cn(
          'flex shrink-0 border-t border-border bg-background',
          pathname === '/store' && 'hidden'
        )}
      >
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
