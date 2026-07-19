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


export function ProfileSelectorScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string|null>(profiles[0]?.id ?? null)
  const getAv = (id: string) => AVATARS.find(a => a.id === id) ?? AVATARS[0]
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="px-6 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <OwlMascot size={56}/>
          <div><h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>Who's Reading Today?</h2>
            <p className="text-sm" style={{ color: MUTED, ...ff }}>Choose a profile to continue</p></div>
        </div>
      </motion.div>
      <div className="flex-1 px-6 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-col gap-3 pb-4">
          {profiles.map((p, i) => {
            const av = getAv(p.avatar); const isSelected = selected === p.id
            return (
              <motion.button key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(p.id)}
                className="flex items-center gap-4 p-4 rounded-3xl border-2 transition-all active:scale-[0.98] text-left w-full"
                style={{ background: isSelected ? "#FFF0F8" : "white", borderColor: isSelected ? PINK : "rgba(255,132,186,0.2)", boxShadow: isSelected ? `0 4px 16px ${PINK}30` : "none" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: av.bg }}>{av.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-lg" style={{ color: PURPLE, ...ffh }}>{p.name}</p>
                  <p className="text-sm" style={{ color: MUTED, ...ff }}>Age {p.age} · BrightInk Reader</p>
                  <div className="flex gap-1 mt-1.5">{[0,1,2].map(s => <div key={s} className="w-5 h-1.5 rounded-full" style={{ background: s<2 ? PINK : "#E0D8E8" }}/>)}</div>
                </div>
                {isSelected && <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: PINK }}><Check size={14} color="white" strokeWidth={3}/></div>}
              </motion.button>
            )
          })}
          <button onClick={() => go("createProfile")}
            className="flex items-center gap-4 p-4 rounded-3xl border-2 border-dashed transition-all active:scale-[0.98] w-full"
            style={{ borderColor: "rgba(255,132,186,0.35)", background: "rgba(255,255,255,0.6)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${PINK}20` }}><Plus size={28} style={{ color: PINK }}/></div>
            <div><p className="font-bold text-base" style={{ color: PINK, ...ff }}>Add Another Child</p>
              <p className="text-sm" style={{ color: MUTED, ...ff }}>Create a new profile</p></div>
          </button>
        </motion.div>
      </div>
      <div className="px-6 pb-10 pt-4">
        <PrimaryBtn onClick={() => go("home")} disabled={!selected}>Start Reading! <ArrowRight size={18}/></PrimaryBtn>
        <p className="text-xs text-center mt-3" style={{ color: MUTED, ...ff }}>Manage profiles anytime in Parent Settings</p>
      </div>
    </div>
  )
}

