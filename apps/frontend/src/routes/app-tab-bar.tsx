import { BookOpenIcon, HomeIcon, RefrigeratorIcon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'

const TABS = [
  { to: '/home', label: 'Home', Icon: HomeIcon },
  { to: '/kitchen', label: 'Kitchen', Icon: RefrigeratorIcon },
  { to: '/recipes', label: 'Recipes', Icon: BookOpenIcon },
] as const

export function AppTabBar() {
  const { pathname } = useLocation()

  return (
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
  )
}
