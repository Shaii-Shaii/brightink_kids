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


export function StorySavedScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ background: PEACH }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
        <div className="w-36 h-36 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto" style={{ background: "white" }}>
          <span style={{ fontSize: 72 }}>🎉</span>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-3xl font-bold mb-2" style={{ color: PINK, ...ffh }}>Story Saved!</h2>
        <p className="text-base mb-2" style={{ color: PURPLE, ...ff }}>Amazing work, Mia! 🌟</p>
        <p className="text-sm mb-6" style={{ color: MUTED, ...ff }}>Your story is now in your library for everyone to enjoy.</p>

        {/* Badge */}
        <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-2xl mb-8 mx-auto max-w-xs" style={{ background: `${YELLOW}40`, border: `2px solid ${YELLOW}` }}>
          <span style={{ fontSize: 28 }}>🏅</span>
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>Badge Earned!</p>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Story Creator — Keep writing!</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <PrimaryBtn onClick={() => go("storyLibrary")}>Read It Now <BookOpen size={18}/></PrimaryBtn>
          <OutlineBtn onClick={() => go("home")}>Back to Home</OutlineBtn>
        </div>
      </motion.div>

      {/* Confetti dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i} className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{ background: [PINK,YELLOW,BLUE,GREEN][i%4], left: `${10+i*7}%`, top: "5%" }}
          animate={{ y: [0, 300+Math.random()*200], opacity: [1, 0], rotate: Math.random()*360 }}
          transition={{ duration: 1.5+Math.random(), delay: Math.random()*0.5, ease: "easeIn" }}/>
      ))}
    </div>
  )
}

