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


export function ActivityIntroScreen({ story, go }: { story: Story|null; go: (s: Screen) => void }) {
  const s = story ?? CURATED_STORIES[0]
  return (
    <div className="flex flex-col items-center justify-center h-full px-6" style={{ background: PEACH }}>
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="w-32 h-32 rounded-3xl flex items-center justify-center mb-5 shadow-md mx-auto" style={{ background: s.coverColor }}>
          <span style={{ fontSize: 64 }}>{s.emoji}</span>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: PURPLE, ...ffh }}>
          Let's see what you remember! 🧠
        </h2>
        <p className="text-sm text-center mb-2" style={{ color: MUTED, ...ff }}>
          You just read <strong style={{ color: PURPLE }}>{s.title}</strong>. Answer a few fun questions!
        </p>
        <div className="flex justify-center gap-4 mb-8">
          {[{ icon: "❓", label: "3 Questions" }, { icon: "⭐", label: "Earn Stars" }, { icon: "🏅", label: "Get Badges" }].map(x => (
            <div key={x.label} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "white" }}>{x.icon}</div>
              <span className="text-xs font-bold" style={{ color: MUTED, ...ff }}>{x.label}</span>
            </div>
          ))}
        </div>
        <PrimaryBtn color={s.coverColor} onClick={() => go("activityScreen")}>
          Start Activity! <ArrowRight size={18}/>
        </PrimaryBtn>
        <button onClick={() => go("home")} className="w-full mt-3 text-sm font-bold py-2" style={{ color: MUTED, ...ff }}>
          Skip for now
        </button>
      </motion.div>
    </div>
  )
}

