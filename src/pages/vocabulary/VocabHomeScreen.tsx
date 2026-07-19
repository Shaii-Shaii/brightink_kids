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


export function VocabHomeScreen({ go, setCurrentWord, vowelProgress, vocabProgress }: {
  go: (s: Screen) => void
  setCurrentWord: (w: typeof VOCAB_WORDS[0]) => void
  vowelProgress: Record<string, number>
  vocabProgress: Record<string, number>
}) {
  const vowelStars = VOWEL_PRACTICE.reduce((sum, v) => sum + Math.min(vowelProgress[v.vowel] ?? 0, 3), 0)
  const vowelsDone = VOWEL_PRACTICE.every(v => (vowelProgress[v.vowel] ?? 0) >= 3)

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <BackBtn onClick={() => go("tracingHome")}/>
          <div className="px-3 py-2 rounded-2xl flex items-center gap-1 shadow-sm" style={{ background: "white" }}>
            <Star size={16} fill={YELLOW} stroke={YELLOW}/>
            <span className="font-bold" style={{ color: PURPLE, ...ffh }}>{vowelStars}/15</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Voice Quest</h2>
        <p className="text-sm mt-0.5 mb-4" style={{ color: MUTED, ...ff }}>Read vowels first. Then read words.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <div className="rounded-3xl p-4 mb-4 shadow-sm" style={{ background: "white" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${PINK}18` }}>
              <Volume2 size={22} style={{ color: PINK }}/>
            </div>
            <div>
              <p className="font-bold" style={{ color: PURPLE, ...ffh }}>Step 1: Vowel Reading</p>
              <p className="text-xs" style={{ color: MUTED, ...ff }}>Earn 3 stars for each vowel.</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {VOWEL_PRACTICE.map((v, index) => {
              const stars = vowelProgress[v.vowel] ?? 0
              const unlocked = index === 0 || (vowelProgress[VOWEL_PRACTICE[index - 1].vowel] ?? 0) >= 3
              return (
                <button key={v.vowel} disabled={!unlocked} onClick={() => {
                  setCurrentWord({ word: v.vowel, phonetic: v.sound, emoji: v.emoji, hint: "Say the vowel sound." })
                  go("vocabPractice")
                }}
                  className="relative rounded-2xl py-3 flex flex-col items-center gap-1 shadow-sm disabled:active:scale-100 active:scale-95"
                  style={{ background: unlocked ? `${PINK}12` : "#F1E8F0", opacity: unlocked ? 1 : 0.72 }}>
                  {!unlocked && <Lock size={13} className="absolute top-1.5 right-1.5" style={{ color: MUTED }}/>}
                  <span className="text-2xl font-bold" style={{ color: unlocked ? PURPLE : MUTED, ...ffh }}>{v.vowel}</span>
                  <div className="flex gap-0.5">{[0,1,2].map(i=><Star key={i} size={9} fill={i<stars ? YELLOW : "none"} stroke={i<stars ? YELLOW : "#D0C8D4"}/>)}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl p-4 mb-4 shadow-sm" style={{ background: vowelsDone ? "white" : "#F1E8F0" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: vowelsDone ? `${BLUE}20` : "white" }}>
              {vowelsDone ? <Mic size={22} style={{ color: BLUE }}/> : <Lock size={22} style={{ color: MUTED }}/>}
            </div>
            <div>
              <p className="font-bold" style={{ color: vowelsDone ? PURPLE : MUTED, ...ffh }}>Step 2: Word Reading</p>
              <p className="text-xs" style={{ color: MUTED, ...ff }}>{vowelsDone ? "Now read full words." : "Get 3 stars on all vowels to open this."}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {VOCAB_WORDS.slice(0, 4).map((w, index) => (
              <button key={w.word} disabled={!vowelsDone} onClick={() => { setCurrentWord(w); go("vocabPractice") }}
                className="flex items-center gap-3 p-3 rounded-2xl shadow-sm disabled:active:scale-100 active:scale-[0.98]"
                style={{ background: vowelsDone ? "white" : "rgba(255,255,255,0.55)" }}>
                <span style={{ fontSize: 28 }}>{w.emoji}</span>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold truncate" style={{ color: vowelsDone ? PURPLE : MUTED, ...ffh }}>{w.word}</p>
                  <p className="text-xs truncate" style={{ color: MUTED, ...ff }}>{Math.min(vocabProgress[w.word] ?? 0, 3)}/3 voice stars</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>More word groups</p>
        <div className="grid grid-cols-2 gap-2.5">
          {VOCAB_CATEGORIES.map(c => (
            <button key={c.id} disabled={!vowelsDone} onClick={() => { setCurrentWord(VOCAB_WORDS[0]); go("vocabPractice") }}
              className="rounded-2xl p-4 flex items-center gap-3 shadow-sm disabled:active:scale-100 active:scale-95"
              style={{ background: vowelsDone ? "white" : "#F1E8F0", border: `2px solid ${vowelsDone ? `${c.color}25` : "transparent"}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${c.color}25` }}>{vowelsDone ? c.emoji : <Lock size={18} style={{ color: MUTED }}/>}</div>
              <p className="font-bold text-sm text-left" style={{ color: vowelsDone ? PURPLE : MUTED, ...ff }}>{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="tracingHome" go={go}/>
    </div>
  )
}

