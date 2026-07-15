import type { Session } from "@supabase/supabase-js"
import { create } from "zustand"

export interface ChildProfile {
  id: string
  name: string
  age?: number
  avatar?: string
}

export interface OfflineQueueItem {
  id: string
  type: string
  payload: unknown
  createdAt: string
  retryCount: number
  status: "pending" | "syncing" | "failed"
}

interface AppState {
  currentChildProfile: ChildProfile | null
  session: Session | null
  offlineQueue: OfflineQueueItem[]
  setCurrentChildProfile: (profile: ChildProfile | null) => void
  setSession: (session: Session | null) => void
  enqueueOfflineAction: (item: Omit<OfflineQueueItem, "id" | "createdAt" | "retryCount" | "status">) => void
  updateOfflineQueueItem: (id: string, patch: Partial<OfflineQueueItem>) => void
  removeOfflineQueueItem: (id: string) => void
  clearOfflineQueue: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentChildProfile: null,
  session: null,
  offlineQueue: [],
  setCurrentChildProfile: (profile) => set({ currentChildProfile: profile }),
  setSession: (session) => set({ session }),
  enqueueOfflineAction: (item) =>
    set((state) => ({
      offlineQueue: [
        ...state.offlineQueue,
        {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          retryCount: 0,
          status: "pending",
        },
      ],
    })),
  updateOfflineQueueItem: (id, patch) =>
    set((state) => ({
      offlineQueue: state.offlineQueue.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeOfflineQueueItem: (id) =>
    set((state) => ({
      offlineQueue: state.offlineQueue.filter((item) => item.id !== id),
    })),
  clearOfflineQueue: () => set({ offlineQueue: [] }),
}))
