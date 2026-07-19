import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quantity } from '../types'

export interface ShoppingListItem {
  id: string
  name: string
  quantity: Quantity
  addedAtIso: string
}

type ShoppingListActions = {
  addItem: (name: string, quantity: Quantity) => ShoppingListItem
  updateItemQuantity: (id: string, quantity: Quantity) => void
  removeItem: (id: string) => void
}

export type ShoppingListStore = { items: ShoppingListItem[] } & ShoppingListActions

const SHOPPING_LIST_STORAGE_KEY = 'shopping-list-v1'

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (name, quantity) => {
        const item: ShoppingListItem = {
          id: crypto.randomUUID(),
          name: name.trim(),
          quantity,
          addedAtIso: new Date().toISOString(),
        }
        set((state) => ({ items: [...state.items, item] }))
        return item
      },

      updateItemQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    { name: SHOPPING_LIST_STORAGE_KEY }
  )
)
