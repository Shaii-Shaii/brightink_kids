import Dexie, { type EntityTable } from "dexie"
import type { OfflineQueueItem } from "../store/useAppStore"

export interface OfflineStory {
  id: string
  childId: string
  title: string
  theme: string
  content: unknown
  aiFeedback?: unknown
  isCurated: boolean
  createdAt: string
  syncStatus: "synced" | "pending" | "failed"
}

export interface OfflineTracingProgress {
  id: string
  childId: string
  letter: string
  accuracy?: number
  attempts: number
  completedAt?: string
  syncStatus: "synced" | "pending" | "failed"
}

export interface OfflineVocabularyProgress {
  id: string
  childId: string
  word: string
  pronunciationScore?: number
  attempts: number
  lastPracticedAt?: string
  syncStatus: "synced" | "pending" | "failed"
}

export interface OfflineComprehensionResult {
  id: string
  childId: string
  storyId: string
  score?: number
  answers?: unknown
  completedAt: string
  syncStatus: "synced" | "pending" | "failed"
}

export interface OfflineAchievement {
  id: string
  childId: string
  badgeKey: string
  earnedAt: string
  syncStatus: "synced" | "pending" | "failed"
}

export const offlineDb = new Dexie("brightink-kids") as Dexie & {
  offlineQueue: EntityTable<OfflineQueueItem, "id">
  stories: EntityTable<OfflineStory, "id">
  tracingProgress: EntityTable<OfflineTracingProgress, "id">
  vocabularyProgress: EntityTable<OfflineVocabularyProgress, "id">
  comprehensionResults: EntityTable<OfflineComprehensionResult, "id">
  achievements: EntityTable<OfflineAchievement, "id">
}

offlineDb.version(1).stores({
  offlineQueue: "id, type, status, createdAt",
  stories: "id, childId, theme, createdAt, syncStatus",
  tracingProgress: "id, childId, letter, completedAt, syncStatus",
  vocabularyProgress: "id, childId, word, lastPracticedAt, syncStatus",
  comprehensionResults: "id, childId, storyId, completedAt, syncStatus",
  achievements: "id, childId, badgeKey, earnedAt, syncStatus",
})
