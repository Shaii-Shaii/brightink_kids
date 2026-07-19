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


export function ActivityScreen({ story, go, onComplete }: { story: Story|null; go: (s: Screen) => void; onComplete: (scores: boolean[]) => void }) {
  const s = story ?? CURATED_STORIES[0]
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number|null>(null)
  const [answered, setAnswered] = useState(false)
  const [scores, setScores] = useState<boolean[]>([])
  const q = STORY_QUESTIONS[qIdx]

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    const correct = i === q.correct
    setTimeout(() => {
      const nextScores = [...scores, correct]
      setScores(nextScores)
      if (qIdx < STORY_QUESTIONS.length - 1) {
        setQIdx(n => n+1); setSelected(null); setAnswered(false)
      } else {
        onComplete(nextScores)
        go("activityResults")
      }
    }, 900)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold" style={{ color: MUTED, ...ff }}>Question {qIdx+1} of {STORY_QUESTIONS.length}</p>
          <div className="flex gap-1">
            {STORY_QUESTIONS.map((_,i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: i<qIdx ? GREEN : i===qIdx ? s?.coverColor ?? PINK : "#E0D8E8" }}/>)}
          </div>
        </div>
        <div className="h-2 rounded-full" style={{ background: "#F0E0EC" }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${((qIdx+1)/STORY_QUESTIONS.length)*100}%` }} style={{ background: s?.coverColor ?? PINK }}/>
        </div>
      </div>

      {/* Question */}
      <motion.div key={qIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mx-5 mb-5 rounded-3xl p-5 shadow-sm" style={{ background: "white" }}>
        <p className="text-lg font-bold text-center" style={{ color: PURPLE, ...ffh }}>{q.q}</p>
      </motion.div>

      {/* Options */}
      <div className="flex-1 px-5 flex flex-col gap-2.5">
        {q.opts.map((opt, i) => {
          let bg = "white"
          let border = "rgba(255,132,186,0.2)"
          let color = PURPLE
          if (answered && selected === i) {
            bg = i === q.correct ? `${GREEN}25` : "#FFE0E0"
            border = i === q.correct ? GREEN : "#FF4D4D"
            color = i === q.correct ? "#2E8B57" : "#CC4444"
          } else if (answered && i === q.correct) {
            bg = `${GREEN}15`; border = GREEN; color = "#2E8B57"
          }
          return (
            <motion.button key={i} onClick={() => handleSelect(i)}
              whileTap={{ scale: 0.97 }}
              className="w-full p-4 rounded-2xl text-left flex items-center gap-3 border-2 transition-all"
              style={{ background: bg, borderColor: border }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: `${border}30`, color, ...ff }}>
                {answered && selected===i ? (i===q.correct ? "✓" : "✗") : String.fromCharCode(65+i)}
              </div>
              <span className="font-semibold text-sm" style={{ color, ...ff }}>{opt}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

