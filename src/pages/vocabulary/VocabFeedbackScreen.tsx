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


export function VocabFeedbackScreen({ word, go, result }: {
  word: typeof VOCAB_WORDS[0]|null
  go: (s: Screen) => void
  result: VocabResult | null
}) {
  const w = word ?? VOCAB_WORDS[0]
  const correct = result?.correct ?? false
  const transcript = result?.transcript?.trim()
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ background: PEACH }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="w-28 h-28 rounded-full flex items-center justify-center mb-5 shadow-md"
        style={{ background: correct ? GREEN : PINK }}>
        <span style={{ fontSize: 56 }}>{correct ? "🎉" : "🤗"}</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-3xl font-bold mb-1" style={{ color: PURPLE, ...ffh }}>{correct ? "Excellent!" : "Good Try!"}</h2>
        <p className="text-sm mb-1" style={{ color: MUTED, ...ff }}>
          {correct ? `You said "${w.word}" perfectly!` : `Almost! Try saying "${w.word}" again.`}
        </p>
        {transcript && <p className="text-xs mb-1" style={{ color: MUTED, ...ff }}>I heard: "{transcript}"</p>}
        {result?.reason && <p className="text-xs mb-1" style={{ color: PINK, ...ff }}>{result.reason}</p>}
        <p className="text-xs mb-8" style={{ color: BLUE, ...ff }}>{w.phonetic}</p>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <PrimaryBtn color={correct ? GREEN : PINK} onClick={() => go("vocabPractice")}>
            {correct ? "Next Word" : "Try Again"} <ArrowRight size={18}/>
          </PrimaryBtn>
          <OutlineBtn onClick={() => go("vocabHome")}>Back to Practice</OutlineBtn>
        </div>
      </motion.div>
    </div>
  )
}

