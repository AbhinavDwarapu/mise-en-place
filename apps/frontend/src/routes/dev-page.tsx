import { IonPage } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { useGroceryStore } from '@/features/groceries'
import { useStoreSessionStore } from '@/features/groceries/_store-mode'
import { defaultCategoryCache } from '@/features/groceries/state/category-cache-seed'
import { useCategoryCacheStore } from '@/features/groceries/state/category-cache-store'
import { scenarioAGroceryState } from '@/features/groceries/state/dev-seed'
import { defaultGroceryState } from '@/features/groceries/state/grocery-seed'
import type { GroceryData, IngredientCategory } from '@/features/groceries/types'
import { Button } from '@/shared/ui/button'

function seedDemoData(
  groceryData: GroceryData,
  categories: Record<string, IngredientCategory>
) {
  useGroceryStore.setState(groceryData)
  useCategoryCacheStore.setState({ categories })
  useStoreSessionStore.getState().clear()
}

export function DevPage() {
  const history = useHistory()

  function seedScenarioA() {
    seedDemoData(scenarioAGroceryState, {})
    history.push('/home')
  }

  function seedScenarioB() {
    seedDemoData(defaultGroceryState, defaultCategoryCache)
    history.push('/home')
  }

  return (
    <IonPage>
      <div className="flex h-full w-full flex-col bg-background">
        <header className="px-4 pt-8 pb-3">
          <h1 className="text-3xl font-semibold text-foreground">
            Seed demo data
          </h1>
        </header>
        <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-4">
          <Button size="lg" className="w-full" onClick={seedScenarioA}>
            Scenario A — Just a shopping list
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full"
            onClick={seedScenarioB}
          >
            Scenario B — Full demo (kitchen, recipes, ideas)
          </Button>
        </main>
      </div>
    </IonPage>
  )
}
