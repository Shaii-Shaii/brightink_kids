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


export function PrivacyDataSettingsScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Privacy & Data" subtitle="Parent transparency controls" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <div className="rounded-2xl p-4" style={{ background: "white" }}>
          <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>Data collected</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: MUTED, ...ff }}>Parent account, child first name or nickname, age range, avatar, stories, progress, and achievements.</p>
        </div>
        <PrimaryBtn color={BLUE}>Export Data</PrimaryBtn>
        <button className="w-full py-4 rounded-2xl font-bold text-lg" style={{ background: `${PINK}18`, color: PINK, ...ff }}>Delete Account / Data</button>
      </div>
    </div>
  )
}

