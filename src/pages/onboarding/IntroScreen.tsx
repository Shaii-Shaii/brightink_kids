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


export function IntroScreen({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0)
  const { title, desc, accent, Ill } = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="flex justify-end px-5 pt-5">
        <button onClick={onDone} className="text-sm font-bold px-3 py-1.5 rounded-full" style={{ color: MUTED, background: "rgba(255,255,255,0.6)", ...ff }}>Skip</button>
      </div>
      <motion.div key={slide} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
        className="flex-1 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full flex items-center justify-center shadow-sm" style={{ background: "rgba(255,255,255,0.55)" }}>
          <Ill/>
        </div>
      </motion.div>
      <div className="mx-4 mb-6 rounded-3xl p-7 shadow-sm" style={{ background: "white" }}>
        <motion.div key={`t${slide}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: accent, ...ffh }}>{title}</h2>
          <p className="text-center text-sm leading-relaxed" style={{ color: MUTED, ...ff }}>{desc}</p>
        </motion.div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <motion.div key={i} animate={{ width: i === slide ? 24 : 8 }} className="h-2 rounded-full"
                style={{ background: i === slide ? accent : "#E0D8E8" }}/>
            ))}
          </div>
          <button onClick={() => isLast ? onDone() : setSlide(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white text-sm shadow-sm active:scale-95"
            style={{ background: accent, ...ff }}>
            {isLast ? "Get Started" : "Next"} <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  )
}

