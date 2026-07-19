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


export function AccountSettingsScreen({ go }: { go: (s: Screen) => void }) {
  const [name, setName] = useState("Parent Guardian")
  const [email, setEmail] = useState("parent@example.com")
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Account" subtitle="Parent sign-in details" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <FormInput label="Full Name" value={name} onChange={(v) => { setName(v); setSaved(false) }} placeholder="Parent name"/>
        <FormInput label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setSaved(false) }} placeholder="parent@example.com"/>
        {saved && <p className="text-sm font-bold text-center" style={{ color: GREEN, ...ff }}>Account details saved.</p>}
        <PrimaryBtn onClick={() => setSaved(true)} disabled={!name.trim() || !email.trim()}>Save Account</PrimaryBtn>
        <PrimaryBtn onClick={() => go("resetPassword")}>Change Password</PrimaryBtn>
        <GoogleBtn label="Connect Google Sign-In"/>
      </div>
    </div>
  )
}

