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


export function TracingFeedbackScreen({ letter, level, go, onContinue }: {
  letter: string
  level: 1|2|3
  go: (s: Screen) => void
  onContinue: () => void
}) {
  const isWord = letter.length > 1
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ background: PEACH }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="w-32 h-32 rounded-full flex items-center justify-center mb-5 shadow-md" style={{ background: "white" }}>
        <span style={{ fontSize: isWord ? 34 : 72, fontFamily: "'Fredoka', sans-serif", color: BLUE }}>{letter}</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex justify-center mb-4">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.35, type: "spring" }}>
            <Star size={56} fill={YELLOW} stroke={YELLOW}/>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{ color: PURPLE, ...ffh }}>You won 1 star!</h2>
        <p className="text-sm mb-8" style={{ color: MUTED, ...ff }}>Level {level} done. Get 3 stars to open the next step.</p>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <PrimaryBtn color={BLUE} onClick={onContinue}>
            {level < 3 ? `Go to Level ${level + 1}` : "Back to Quest"} <ArrowRight size={18}/>
          </PrimaryBtn>
          <OutlineBtn color={BLUE} onClick={() => go("tracingLetter")}>
            <RotateCcw size={16}/> Try Again
          </OutlineBtn>
        </div>
      </motion.div>
    </div>
  )
}

// ─── VOCABULARY / SPEECH ──────────────────────────────────────────────────────
