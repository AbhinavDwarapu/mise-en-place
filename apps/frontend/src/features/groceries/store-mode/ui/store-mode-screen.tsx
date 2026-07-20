import { useState } from 'react'
import { inferCategory } from '../../logic/categories'
import { useShoppingListStore } from '../../state/shopping-list-store'
import type { IngredientCategory } from '../../types'
import { groupItemsByAisle, pendingCount } from '../logic/aisles'
import { useStoreSessionStore } from '../state/store-session-store'
import { AisleTabs } from './aisle-tabs'
import { CompleteShopButton } from './complete-shop-button'
import { LoyaltyCardStrip } from './loyalty-card-strip'
import { StoreItemRow } from './store-item-row'

export function StoreModeScreen({ onComplete }: { onComplete: () => void }) {
  const items = useShoppingListStore((state) => state.items)
  const statuses = useStoreSessionStore((state) => state.statuses)
  const [selectedCategory, setSelectedCategory] =
    useState<IngredientCategory | null>(null)

  const aisles = groupItemsByAisle(items, inferCategory)
  const fallbackCategory =
    aisles.find((aisle) => pendingCount(aisle.items, statuses) > 0)?.category ??
    aisles[0]?.category
  const activeCategory = aisles.some(
    (aisle) => aisle.category === selectedCategory
  )
    ? selectedCategory
    : fallbackCategory
  const activeAisle = aisles.find((aisle) => aisle.category === activeCategory)

  return (
    <>
      <header className="px-4 pt-8 pb-3">
        <h1 className="text-3xl font-semibold text-foreground">In-store</h1>
      </header>
      <main className="flex-1 space-y-3 overflow-y-auto">
        <LoyaltyCardStrip />
        {activeAisle ? (
          <>
            <AisleTabs
              aisles={aisles}
              statuses={statuses}
              activeCategory={activeAisle.category}
              onSelect={setSelectedCategory}
            />
            <ul className="space-y-3 px-4 pb-4">
              {activeAisle.items.map((item) => (
                <StoreItemRow
                  key={item.id}
                  item={item}
                  status={statuses[item.id]}
                  onSwapped={(name) => setSelectedCategory(inferCategory(name))}
                />
              ))}
            </ul>
          </>
        ) : (
          <p className="px-4 py-10 text-center text-muted-foreground">
            Nothing to buy — your shopping list is empty.
          </p>
        )}
      </main>
      <footer className="shrink-0 border-t border-border p-4">
        <CompleteShopButton onComplete={onComplete} />
      </footer>
    </>
  )
}
