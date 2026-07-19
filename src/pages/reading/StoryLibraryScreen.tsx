import { useState, useEffect, useCallback, useRef } from "react"
import type { Dispatch, PointerEvent as ReactPointerEvent, SetStateAction } from "react"
import { motion } from "motion/react"
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Plus, Check,
  Home, BookOpen, PenLine, Star, Mic, ChevronRight,
  ChevronLeft, RotateCcw, Volume2, Settings, X,
  Trophy, Flame, BarChart2, Lock, Play, Sparkles,
  Bookmark, Heart, Zap, Bell, User, Shield, HelpCircle,
  Type, WifiOff, Loader2, Trash2, Bot, Send, Camera,
  ImagePlus, Upload, Eraser,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
} from "recharts"
import {
  AI_SUGGESTIONS,
  ALPHABET,
  AVATARS,
  BADGES,
  BLUE,
  BackBtn,
  Blobs,
  BottomNav,
  Divider,
  FormInput,
  GoogleBtn,
  CURATED_STORIES,
  DEMO_PROFILES,
  GREEN,
  INIT_USER_STORIES,
  LOWER_TRACE_STROKES,
  MUTED,
  OutlineBtn,
  PasswordInput,
  OwlMascot,
  PEACH,
  PINK,
  PURPLE,
  PrimaryBtn,
  Ring,
  ScreenHeader,
  ScreenLink,
  SettingsRow,
  SLIDES,
  STORY_QUESTIONS,
  StoryCover,
  THEMES,
  TRACING_PROGRESS,
  ToggleLine,
  UPPER_TRACE_STROKES,
  VOCAB_CATEGORIES,
  VOCAB_WORDS,
  VOWEL_PRACTICE,
  WEEKLY_DATA,
  WORD_TRACING_PROGRESS,
  WORD_TRACING_TOPICS,
  YELLOW,
  distanceToSegment,
  ff,
  ffh,
  parseDrawPoints,
  parsePathCoords,
  strokeArrowPosition,
} from "@/app/screenSupport"
import type { DrawStroke, Profile, Screen, Story, TraceTool, VocabResult } from "@/app/screenSupport"


export function StoryLibraryScreen({ stories, go, setCurrentStory }: { stories: Story[]; go: (s: Screen) => void; setCurrentStory: (s: Story) => void }) {
  const [tab, setTab] = useState<"mine"|"curated">("mine")
  const [view, setView] = useState<"grid"|"list">("grid")
  const displayStories = tab === "mine" ? stories.filter(s => !s.curated) : CURATED_STORIES

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Bookshelf 📚</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED, ...ff }}>Your stories and favourite reads</p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-3 flex gap-2">
        {(["mine","curated"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-full font-bold text-sm transition-all"
            style={{ background: tab===t ? PINK : "white", color: tab===t ? "white" : MUTED, ...ff }}>
            {t === "mine" ? "My Stories" : "★ Curated"}
          </button>
        ))}
        <div className="ml-auto flex rounded-full p-1" style={{ background: "white" }}>
          {(["grid","list"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: view === v ? BLUE : "transparent", color: view === v ? "white" : MUTED, ...ff }}>
              {v === "grid" ? "Grid" : "List"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {displayStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <span style={{ fontSize: 56 }}>📝</span>
            <p className="font-bold text-lg" style={{ color: PURPLE, ...ffh }}>No stories yet!</p>
            <p className="text-sm text-center" style={{ color: MUTED, ...ff }}>Tap "Create Story" on the home screen to write your first one.</p>
            <PrimaryBtn onClick={() => go("storyTheme")} className="!w-auto px-6">Write a Story <ArrowRight size={18}/></PrimaryBtn>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {displayStories.map(s => (
              <StoryCover key={s.id} story={s} onClick={() => { setCurrentStory(s); go("storyDetail") }}/>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {displayStories.map(s => (
              <button key={s.id} onClick={() => { setCurrentStory(s); go("storyDetail") }}
                className="rounded-2xl p-3 flex items-center gap-3 text-left shadow-sm active:scale-[0.98] transition-all" style={{ background: "white" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: s.coverColor }}>{s.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate" style={{ color: PURPLE, ...ffh }}>{s.title}</p>
                  <p className="text-xs" style={{ color: MUTED, ...ff }}>{s.readTime} · {s.curated ? "Curated" : "My story"}</p>
                </div>
                <ChevronRight size={16} style={{ color: MUTED }}/>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="storyLibrary" go={go}/>
    </div>
  )
}

