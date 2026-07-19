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


export function ProfileSwitchScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const [pinInput, setPinInput] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const getAv = (id: string) => AVATARS.find(a => a.id === id) ?? AVATARS[0]
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-6 pt-6 pb-2 flex"><BackBtn onClick={() => go("home")}/></div>
      {!unlocked ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-sm" style={{ background: "white" }}>
            <Lock size={32} style={{ color: PINK }}/>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: PURPLE, ...ffh }}>Parent Check</h2>
          <p className="text-sm text-center mb-8" style={{ color: MUTED, ...ff }}>Enter your 4-digit PIN to switch profiles</p>
          <div className="flex gap-3 mb-8">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold border-2"
                style={{ borderColor: pinInput.length > i ? PINK : "rgba(255,132,186,0.3)", background: "white", color: PURPLE }}>
                {pinInput.length > i ? "●" : ""}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k, i) => (
              <button key={i} onClick={() => {
                if (k === "⌫") setPinInput(p => p.slice(0,-1))
                else if (k !== "" && pinInput.length < 4) {
                  const next = pinInput + k
                  setPinInput(next)
                  if (next.length === 4) setTimeout(() => setUnlocked(true), 300)
                }
              }}
                className={`h-14 rounded-2xl text-xl font-bold transition-all active:scale-95 ${k === "" ? "invisible" : ""}`}
                style={{ background: "white", color: PURPLE, ...ffh }}>
                {k}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: PURPLE, ...ffh }}>Switch Profile</h2>
          <div className="flex flex-col gap-3">
            {profiles.map(p => {
              const av = getAv(p.avatar)
              return (
                <button key={p.id} onClick={() => go("home")}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-white shadow-sm active:scale-[0.98] transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: av.bg }}>{av.emoji}</div>
                  <div className="flex-1 text-left">
                    <p className="font-bold" style={{ color: PURPLE, ...ffh }}>{p.name}</p>
                    <p className="text-sm" style={{ color: MUTED, ...ff }}>Age {p.age}</p>
                  </div>
                  <ChevronRight size={18} style={{ color: MUTED }}/>
                </button>
              )
            })}
            <button onClick={() => go("createProfile")}
              className="flex items-center gap-4 p-4 rounded-3xl border-2 border-dashed active:scale-[0.98]"
              style={{ borderColor: "rgba(255,132,186,0.35)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${PINK}18` }}><Plus size={24} style={{ color: PINK }}/></div>
              <p className="font-bold" style={{ color: PINK, ...ff }}>Add New Child</p>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

