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


export function SoundVoiceSettingsScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Sound & Voice" subtitle="Audio and microphone controls" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <ToggleLine label="Sound effects" desc="Play small success and navigation sounds."/>
        <ToggleLine label="Narration voice" desc="Read instructions aloud for early readers."/>
        <div className="rounded-2xl p-4" style={{ background: "white" }}>
          <p className="font-bold text-sm mb-3" style={{ color: PURPLE, ...ffh }}>Mic sensitivity</p>
          <div className="h-3 rounded-full" style={{ background: "#F0E0EC" }}>
            <div className="h-full rounded-full" style={{ width: "65%", background: PINK }}/>
          </div>
        </div>
      </div>
    </div>
  )
}

