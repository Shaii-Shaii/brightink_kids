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


export function TracingHomeScreen({ go, setTracingLetter, setTracingLevel, letterProgress, wordProgress, availableStars, setAvailableStars, manualUnlocks, setManualUnlocks }: {
  go: (s: Screen) => void
  setTracingLetter: (l: string) => void
  setTracingLevel: (level: 1|2|3) => void
  letterProgress: Record<string, number>
  wordProgress: Record<string, number>
  availableStars: number
  setAvailableStars: Dispatch<SetStateAction<number>>
  manualUnlocks: string[]
  setManualUnlocks: Dispatch<SetStateAction<string[]>>
}) {
  const [mode, setMode] = useState<"letters"|"words">("letters")
  const [caseMode, setCaseMode] = useState<"upper"|"lower">("upper")
  const [topic, setTopic] = useState(WORD_TRACING_TOPICS[0].id)
  const [unlockTarget, setUnlockTarget] = useState<{
    key: string
    item: string
    stars: number
    label: string
    color: string
  } | null>(null)
  const currentTopic = WORD_TRACING_TOPICS.find(t => t.id === topic) ?? WORD_TRACING_TOPICS[0]
  const startTrace = (item: string, stars: number) => {
    setTracingLevel((stars >= 3 ? 1 : Math.min(stars + 1, 3)) as 1|2|3)
    setTracingLetter(item)
    go("tracingLetter")
  }
  const askUnlock = (target: typeof unlockTarget) => setUnlockTarget(target)
  const confirmUnlock = () => {
    if (!unlockTarget || availableStars < 3) return
    setAvailableStars(stars => stars - 3)
    setManualUnlocks(prev => prev.includes(unlockTarget.key) ? prev : [...prev, unlockTarget.key])
    startTrace(unlockTarget.item, unlockTarget.stars)
    setUnlockTarget(null)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Practice Quest</h2>
            <p className="text-sm mt-0.5" style={{ color: MUTED, ...ff }}>Win stars to open new steps.</p>
          </div>
          <div className="px-3 py-2 rounded-2xl text-center shadow-sm" style={{ background: "white" }}>
            <div className="flex items-center gap-1 justify-center"><Star size={16} fill={YELLOW} stroke={YELLOW}/><span className="font-bold" style={{ color: PURPLE, ...ffh }}>{availableStars}</span></div>
            <p className="text-[10px] font-bold" style={{ color: MUTED, ...ff }}>available</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { id: "letters" as const, label: "Letters", icon: PenLine, color: BLUE },
            { id: "words" as const, label: "Words", icon: Type, color: GREEN },
            { id: "voice" as const, label: "Voice", icon: Mic, color: PINK },
          ].map(tab => {
            const Icon = tab.icon
            const active = mode === tab.id
            return (
              <button key={tab.id} onClick={() => tab.id === "voice" ? go("vocabHome") : setMode(tab.id)}
                className="rounded-2xl p-3 flex flex-col items-center gap-1 font-bold text-sm shadow-sm active:scale-[0.98]"
                style={{ background: active ? tab.color : "white", color: active ? "white" : MUTED, ...ff }}>
                <Icon size={18}/>
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {mode === "letters" && (
          <>
            <div className="mb-4">
              <p className="font-bold mb-2 px-1" style={{ color: PURPLE, ...ffh }}>3 levels for each letter</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[["1", "Watch"], ["2", "Guide"], ["3", "No guide"]].map(([n, label]) => (
                  <div key={n} className="rounded-2xl p-2" style={{ background: `${BLUE}16` }}>
                    <p className="font-bold" style={{ color: BLUE, ...ffh }}>Level {n}</p>
                    <p className="text-[10px]" style={{ color: MUTED, ...ff }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold" style={{ color: MUTED, ...ff }}>Choose a letter</p>
              <div className="flex gap-2">
                {(["upper","lower"] as const).map(m => (
                  <button key={m} onClick={() => setCaseMode(m)}
                    className="px-3 py-1.5 rounded-full font-bold text-xs"
                    style={{ background: caseMode===m ? BLUE : "white", color: caseMode===m ? "white" : MUTED, ...ff }}>
                    {m==="upper" ? "ABC" : "abc"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {ALPHABET.map((letter, index) => {
                const prog = letterProgress[letter] ?? 0
                const key = `letter:${letter}`
                const unlocked = index === 0 || (letterProgress[ALPHABET[index - 1]] ?? 0) >= 3 || manualUnlocks.includes(key)
                const display = caseMode === "upper" ? letter : letter.toLowerCase()
                return (
                  <button key={letter} onClick={() => unlocked ? startTrace(display, prog) : askUnlock({ key, item: display, stars: prog, label: `Letter ${display}`, color: BLUE })}
                    className="relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
                    style={{ background: unlocked ? (prog===3 ? `${GREEN}30` : prog>0 ? `${BLUE}20` : "white") : "#F1E8F0", border: `2px solid ${prog===3 ? GREEN : prog>0 ? BLUE : "rgba(255,132,186,0.2)"}`, opacity: unlocked ? 1 : 0.72 }}>
                    {!unlocked && <Lock size={16} className="absolute top-2 right-2" style={{ color: MUTED }}/>}
                    <span className="text-xl font-bold" style={{ color: unlocked ? PURPLE : MUTED, ...ffh }}>{display}</span>
                    <div className="flex gap-0.5">{[0,1,2].map(i=><Star key={i} size={10} fill={i<prog ? YELLOW : "none"} stroke={i<prog ? YELLOW : "#D0C8D4"}/>)}</div>
                    {!unlocked && <p className="text-[9px] font-bold" style={{ color: MUTED, ...ff }}>3 stars</p>}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {mode === "words" && (
          <>
            <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Pick a topic first</p>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {WORD_TRACING_TOPICS.map(t => (
                <button key={t.id} onClick={() => setTopic(t.id)}
                  className="rounded-2xl p-3 text-left shadow-sm active:scale-[0.98]"
                  style={{ background: topic === t.id ? `${t.color}28` : "white", border: `2px solid ${topic === t.id ? t.color : "transparent"}` }}>
                  <p className="font-bold" style={{ color: PURPLE, ...ffh }}>{t.emoji}</p>
                  <p className="text-sm font-bold" style={{ color: PURPLE, ...ff }}>{t.label}</p>
                </button>
              ))}
            </div>

            <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Trace a word</p>
            <div className="grid grid-cols-2 gap-3">
              {currentTopic.words.map((word, index) => {
                const prog = wordProgress[word] ?? 0
                const prevWord = currentTopic.words[index - 1]
                const key = `word:${word}`
                const unlocked = index === 0 || (wordProgress[prevWord] ?? 0) >= 3 || manualUnlocks.includes(key)
                return (
                  <button key={word} onClick={() => unlocked ? startTrace(word, prog) : askUnlock({ key, item: word, stars: prog, label: `"${word}"`, color: currentTopic.color })}
                    className="relative rounded-3xl p-5 min-h-28 text-left shadow-sm active:scale-[0.98]"
                    style={{ background: unlocked ? "white" : "#F1E8F0", border: `2px solid ${unlocked ? currentTopic.color : "transparent"}` }}>
                    {!unlocked && <Lock size={18} className="absolute top-3 right-3" style={{ color: MUTED }}/>}
                    <p className="text-2xl font-bold" style={{ color: unlocked ? PURPLE : MUTED, ...ffh }}>{word}</p>
                    <p className="text-xs mt-1" style={{ color: MUTED, ...ff }}>{unlocked ? "3 tracing levels" : "3 stars to unlock"}</p>
                    <div className="flex gap-1 mt-3">{[0,1,2].map(i=><Star key={i} size={14} fill={i<prog ? YELLOW : "none"} stroke={i<prog ? YELLOW : "#D0C8D4"}/>)}</div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {unlockTarget && (
        <div className="fixed inset-0 z-[2147483646] flex items-center justify-center px-5" style={{ background: "rgba(61,43,78,0.22)" }}>
          <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-3xl p-5 shadow-xl" style={{ background: PEACH }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${unlockTarget.color}22` }}>
              <Lock size={26} style={{ color: unlockTarget.color }}/>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: PURPLE, ...ffh }}>Unlock this level?</h3>
            <p className="text-sm mb-4" style={{ color: MUTED, ...ff }}>
              Would you like to unlock {unlockTarget.label}? You have {availableStars} available stars. It costs 3 stars.
            </p>
            <div className="rounded-2xl p-3 mb-4 flex items-center justify-between" style={{ background: "white" }}>
              <span className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>Your stars</span>
              <div className="flex items-center gap-1"><Star size={18} fill={YELLOW} stroke={YELLOW}/><span className="font-bold" style={{ color: PURPLE, ...ffh }}>{availableStars}</span></div>
            </div>
            <PrimaryBtn color={unlockTarget.color} disabled={availableStars < 3} onClick={confirmUnlock}>
              Use 3 Stars
            </PrimaryBtn>
            <button onClick={() => setUnlockTarget(null)} className="w-full py-3 text-sm font-bold" style={{ color: MUTED, ...ff }}>
              Not Now
            </button>
          </motion.div>
        </div>
      )}

      <BottomNav active="tracingHome" go={go}/>
    </div>
  )
}

