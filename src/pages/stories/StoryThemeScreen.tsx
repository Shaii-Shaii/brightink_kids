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


export function StoryThemeScreen({ go, setTheme }: { go: (s: Screen) => void; setTheme: (t: string) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2 flex"><BackBtn onClick={() => go("home")}/></div>
      <div className="px-5 mb-4">
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Pick a Theme</h2>
        <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>What will your story be about?</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map(t => (
            <motion.button key={t.id} whileTap={{ scale: 0.95 }}
              onClick={() => { setTheme(t.id); go("storyTitle") }}
              className="rounded-3xl p-5 flex flex-col items-center gap-2 shadow-sm active:scale-95"
              style={{ background: "white", border: `2px solid ${t.color}30` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${t.color}25` }}>{t.emoji}</div>
              <p className="font-bold text-base" style={{ color: PURPLE, ...ffh }}>{t.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

