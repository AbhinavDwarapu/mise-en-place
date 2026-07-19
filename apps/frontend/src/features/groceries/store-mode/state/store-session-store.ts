import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StoreItemStatus = 'checked' | 'skipped'

type StoreSessionActions = {
  toggleChecked: (itemId: string) => void
  toggleSkipped: (itemId: string) => void
  recordSwap: (itemId: string, originalName: string) => void
  clearSwap: (itemId: string) => void
  clear: () => void
}

export type StoreSessionStore = {
  statuses: Record<string, StoreItemStatus>
  swaps: Record<string, string>
} & StoreSessionActions

const STORE_SESSION_STORAGE_KEY = 'store-session-v1'

function toggleStatus(
  statuses: Record<string, StoreItemStatus>,
  itemId: string,
  status: StoreItemStatus
): Record<string, StoreItemStatus> {
  const next = { ...statuses }
  if (next[itemId] === status) {
    delete next[itemId]
  } else {
    next[itemId] = status
  }
  return next
}

export const useStoreSessionStore = create<StoreSessionStore>()(
  persist(
    (set) => ({
      statuses: {},
      swaps: {},

      toggleChecked: (itemId) =>
        set((state) => ({
          statuses: toggleStatus(state.statuses, itemId, 'checked'),
        })),

      toggleSkipped: (itemId) =>
        set((state) => ({
          statuses: toggleStatus(state.statuses, itemId, 'skipped'),
        })),

      recordSwap: (itemId, originalName) =>
        set((state) =>
          itemId in state.swaps
            ? state
            : { swaps: { ...state.swaps, [itemId]: originalName } }
        ),

      clearSwap: (itemId) =>
        set((state) => {
          const swaps = { ...state.swaps }
          delete swaps[itemId]
          return { swaps }
        }),

      clear: () => set({ statuses: {}, swaps: {} }),
    }),
    { name: STORE_SESSION_STORAGE_KEY }
  )
)
