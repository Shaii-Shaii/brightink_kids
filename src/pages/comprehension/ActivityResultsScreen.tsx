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


export function ActivityResultsScreen({ scores, story, go }: { scores: boolean[]; story: Story|null; go: (s: Screen) => void }) {
  const correct = scores.filter(Boolean).length || 2
  const total = STORY_QUESTIONS.length
  const stars = correct === total ? 3 : correct >= 2 ? 2 : 1
  const msgs = ["Keep practising — you're learning!", "Well done! You're getting smarter every day!", "Perfect score! You're a reading champion! 🏆"]

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ background: PEACH }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 12 }}
        className="w-32 h-32 rounded-full flex items-center justify-center mb-5 shadow-lg mx-auto" style={{ background: "white" }}>
        <span style={{ fontSize: 64 }}>🏆</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {/* Stars */}
        <div className="flex justify-center gap-2 mb-3">
          {[0,1,2].map(i => (
            <motion.div key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4+i*0.2, type: "spring" }}>
              <Star size={40} fill={i<stars ? YELLOW : "none"} stroke={i<stars ? YELLOW : "#D0C8D4"}/>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-1" style={{ color: PURPLE, ...ffh }}>
          {correct}/{total} Correct!
        </h2>
        <p className="text-sm mb-5" style={{ color: MUTED, ...ff }}>{msgs[stars-1]}</p>

        {/* Badge */}
        <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-2xl mb-6 mx-auto max-w-xs" style={{ background: `${YELLOW}35`, border: `2px solid ${YELLOW}` }}>
          <span style={{ fontSize: 28 }}>🧠</span>
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>Badge Earned!</p>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Story Explorer · Keep reading!</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <PrimaryBtn onClick={() => go("storyLibrary")}>Read Another Story <BookOpen size={18}/></PrimaryBtn>
          <OutlineBtn onClick={() => go("home")}>Back to Home</OutlineBtn>
        </div>
      </motion.div>

      {[...Array(8)].map((_, i) => (
        <motion.div key={i} className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{ background: [PINK,YELLOW,BLUE,GREEN][i%4], left: `${8+i*11}%`, top: "3%" }}
          animate={{ y: [0, 280+i*20], opacity: [1, 0], rotate: Math.random()*360 }}
          transition={{ duration: 1.8, delay: i*0.1, ease: "easeIn" }}/>
      ))}
    </div>
  )
}

