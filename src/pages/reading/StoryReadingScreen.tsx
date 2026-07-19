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


export function StoryReadingScreen({ story, go }: { story: Story|null; go: (s: Screen) => void }) {
  const s = story ?? CURATED_STORIES[0]
  const [page, setPage] = useState(0)
  const isLast = page === s.pages.length - 1
  const pct = Math.round(((page + 1) / s.pages.length) * 100)

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <BackBtn onClick={() => go("storyDetail")}/>
        <p className="text-sm font-bold" style={{ color: MUTED, ...ff }}>Page {page+1} of {s.pages.length}</p>
        <div/>
      </div>

      {/* Progress bar */}
      <div className="mx-5 mb-4 h-2 rounded-full" style={{ background: "#F0E0EC" }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${pct}%` }} style={{ background: s.coverColor }}/>
      </div>

      {/* Illustration area */}
      <div className="mx-5 mb-4 h-44 rounded-3xl flex items-center justify-center shadow-sm" style={{ background: `${s.coverColor}20` }}>
        <span style={{ fontSize: 80 }}>{s.emoji}</span>
      </div>

      {/* Text */}
      <motion.div key={page} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="flex-1 mx-5 rounded-3xl p-5 shadow-sm flex items-center" style={{ background: "white" }}>
        <p className="text-lg leading-relaxed text-center" style={{ color: PURPLE, ...ffh }}>{s.pages[page]}</p>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0}
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm disabled:opacity-30"
          style={{ background: "white" }}>
          <ChevronLeft size={22} style={{ color: PURPLE }}/>
        </button>

        <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: `${s.coverColor}20` }}>
          <Volume2 size={16} style={{ color: s.coverColor }}/>
          <span className="text-sm font-bold" style={{ color: s.coverColor, ...ff }}>Read aloud</span>
        </button>

        <button onClick={() => isLast ? go("activityIntro") : setPage(p => p+1)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ background: isLast ? s.coverColor : "white" }}>
          <ChevronRight size={22} style={{ color: isLast ? "white" : PURPLE }}/>
        </button>
      </div>
    </div>
  )
}

