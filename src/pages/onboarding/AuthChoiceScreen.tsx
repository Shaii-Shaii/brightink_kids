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


export function AuthChoiceScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full relative" style={{ background: PEACH }}>
      <Blobs/>
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
          <OwlMascot size={130}/>
          <h1 className="text-3xl font-bold mt-3 text-center" style={{ color: PINK, ...ffh }}>BrightInk Kids</h1>
          <p className="mt-1 text-sm text-center" style={{ color: MUTED, ...ff }}>A reading & writing adventure for little ones</p>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="px-6 pb-10 flex flex-col gap-3 relative z-10">
        <div className="rounded-3xl p-6 shadow-sm flex flex-col gap-3" style={{ background: "white" }}>
          <p className="text-center font-bold text-base mb-1" style={{ color: PURPLE, ...ff }}>Parent / Guardian Login</p>
          <PrimaryBtn onClick={() => go("signup")}>Create Account <ArrowRight size={18}/></PrimaryBtn>
          <OutlineBtn onClick={() => go("login")}>I Already Have an Account</OutlineBtn>
          <Divider/>
          <GoogleBtn label="Continue with Google"/>
        </div>
        <p className="text-xs text-center px-4" style={{ color: MUTED, ...ff }}>BrightInk Kids collects no personal data from children.</p>
      </motion.div>
    </div>
  )
}

