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


export function HomeScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const child = profiles[0] ?? { name: "Friend", avatar: "owl", age: 6 }
  const av = AVATARS.find(a => a.id === child.avatar) ?? AVATARS[0]
  const actions = [
    { label: "Create\nStory",   emoji: "✏️", color: PINK,   screen: "storyTheme" as Screen,   bg: `${PINK}18`   },
    { label: "Read\nStories",   emoji: "📚", color: BLUE,   screen: "storyLibrary" as Screen,  bg: `${BLUE}22`   },
    { label: "Practice",        emoji: "🔤", color: "#C4A8E8", screen: "tracingHome" as Screen, bg: "#C4A8E820"   },
    { label: "My\nLibrary",     emoji: "⭐", color: YELLOW, screen: "storyLibrary" as Screen,  bg: `${YELLOW}30` },
  ]
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: av.bg }}>{av.emoji}</div>
          <div>
            <p className="text-xs font-semibold" style={{ color: MUTED, ...ff }}>Good morning! 👋</p>
            <h2 className="text-xl font-bold" style={{ color: PURPLE, ...ffh }}>Hi, {child.name}!</h2>
          </div>
        </div>
        <button onClick={() => go("settingsHome")} className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "white" }}>
          <Settings size={18} style={{ color: MUTED }}/>
        </button>
      </div>

      {/* Streak banner */}
      <div className="mx-5 mb-4 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "white" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${YELLOW}40` }}>
          <Flame size={20} style={{ color: "#F5A623" }}/>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>3-Day Streak! Keep going! 🔥</p>
          <p className="text-xs" style={{ color: MUTED, ...ff }}>You're on a roll, {child.name}!</p>
        </div>
        <div className="flex gap-1">{[0,1,2,3,4].map(i=><div key={i} className="w-2 h-2 rounded-full" style={{ background: i<3 ? YELLOW : "#E0D8E8" }}/>)}</div>
      </div>

      {/* 4 action cards */}
      <div className="px-5 grid grid-cols-2 gap-3 flex-1">
        {actions.map(a => (
          <motion.button key={a.label} onClick={() => go(a.screen)} whileTap={{ scale: 0.95 }}
            className="rounded-3xl flex flex-col items-center justify-center gap-2 py-5 shadow-sm"
            style={{ background: a.bg, border: `2px solid ${a.color}18` }}>
            <span style={{ fontSize: 40 }}>{a.emoji}</span>
            <p className="font-bold text-sm text-center leading-tight" style={{ color: a.color, ...ffh, whiteSpace: "pre-line" }}>{a.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Recent */}
      <div className="px-5 py-4">
        <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Continue Reading</p>
        <button onClick={() => go("storyDetail")} className="w-full rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] transition-all" style={{ background: "white" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${YELLOW}60` }}>🐱</div>
          <div className="flex-1 text-left">
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>My Cat Fluffball</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "#F0E0EC" }}>
                <div className="h-full rounded-full" style={{ width: "60%", background: PINK }}/>
              </div>
              <span className="text-xs" style={{ color: MUTED, ...ff }}>60%</span>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: MUTED }}/>
        </button>
      </div>

      <BottomNav active="home" go={go}/>
    </div>
  )
}

// ─── PROFILE SWITCH ───────────────────────────────────────────────────────────
