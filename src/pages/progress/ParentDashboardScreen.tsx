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


export function ParentDashboardScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const child = profiles[0] ?? DEMO_PROFILES[0]
  const av = AVATARS.find(a => a.id === child.avatar) ?? AVATARS[0]

  const lineData = [
    { week: "W1", reading: 60, tracing: 70, vocab: 40 },
    { week: "W2", reading: 65, tracing: 78, vocab: 45 },
    { week: "W3", reading: 68, tracing: 82, vocab: 52 },
    { week: "W4", reading: 72, tracing: 85, vocab: 58 },
  ]

  const stats = [
    { label: "Stories Written",       val: "7",   emoji: "📝", color: PINK   },
    { label: "Stories Read",           val: "12",  emoji: "📚", color: BLUE   },
    { label: "Letters Traced",         val: "18",  emoji: "✏️", color: GREEN  },
    { label: "Vocab Words Practiced",  val: "34",  emoji: "🗣️", color: YELLOW },
    { label: "Comprehension Avg.",     val: "81%", emoji: "🧠", color: "#C4A8E8" },
    { label: "Total Time (this week)", val: "4h",  emoji: "⏱",  color: "#F48FB1" },
  ]

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>Parent Dashboard</h2>
          <p className="text-xs" style={{ color: MUTED, ...ff }}>Analytics & Progress Overview</p>
        </div>
        <button onClick={() => go("home")} className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "white" }}>
          <X size={18} style={{ color: MUTED }}/>
        </button>
      </div>

      {/* Child selector */}
      <div className="px-5 mb-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "white" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: av.bg }}>{av.emoji}</div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>{child.name}, Age {child.age}</p>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Active learner · Last seen today</p>
          </div>
          <button onClick={() => go("profileSwitch")} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: `${PINK}15`, color: PINK, ...ff }}>Switch</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-4">
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm" style={{ background: "white" }}>
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              <p className="font-bold text-lg" style={{ color: s.color, ...ffh }}>{s.val}</p>
              <p className="text-xs text-center leading-tight" style={{ color: MUTED, ...ff }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Skill rings */}
        <div className="rounded-3xl p-5 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-4" style={{ color: PURPLE, ...ff }}>Skill Mastery</p>
          <div className="flex justify-around">
            <Ring pct={72} color={PINK}   size={68} label="Reading"/>
            <Ring pct={58} color={BLUE}   size={68} label="Writing"/>
            <Ring pct={85} color={GREEN}  size={68} label="Tracing"/>
            <Ring pct={45} color={YELLOW} size={68} label="Vocabulary"/>
          </div>
        </div>

        {/* Progress over time */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-1" style={{ color: PURPLE, ...ff }}>Progress Over 4 Weeks</p>
          <div className="flex gap-4 mb-3">
            {[{ label: "Reading", color: PINK }, { label: "Tracing", color: BLUE }, { label: "Vocab", color: GREEN }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full" style={{ background: l.color }}/>
                <span className="text-xs" style={{ color: MUTED, ...ff }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E0EC"/>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: MUTED, fontFamily: "Nunito" }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontFamily: "Nunito" }}/>
              <Line id="line-reading" type="monotone" dataKey="reading" stroke={PINK} strokeWidth={2.5} dot={{ fill: PINK, r: 4 }}/>
              <Line id="line-tracing" type="monotone" dataKey="tracing" stroke={BLUE} strokeWidth={2.5} dot={{ fill: BLUE, r: 4 }}/>
              <Line id="line-vocab"   type="monotone" dataKey="vocab"   stroke={GREEN} strokeWidth={2.5} dot={{ fill: GREEN, r: 4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly activity */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-3" style={{ color: PURPLE, ...ff }}>Daily Activity This Week</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={WEEKLY_DATA} barGap={2} barSize={7}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: MUTED, fontFamily: "Nunito" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontFamily: "Nunito" }}/>
              <Bar id="dash-stories" dataKey="stories" name="Stories" fill={PINK}   radius={[3,3,0,0]}/>
              <Bar id="dash-tracing" dataKey="tracing" name="Tracing" fill={BLUE}   radius={[3,3,0,0]}/>
              <Bar id="dash-vocab"   dataKey="vocab"   name="Vocab"   fill={GREEN}  radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-3" style={{ color: PURPLE, ...ff }}>💡 AI Recommendations</p>
          {[
            { icon: "🎤", text: `${child.name} needs more vocabulary practice — try 5 words today!`, color: PINK   },
            { icon: "📖", text: "Great reading streak! Try a longer story this week.",               color: BLUE   },
            { icon: "✏️", text: "Letters G–K haven't been practised yet. Start tracing them!",      color: GREEN  },
          ].map((r, i) => (
            <div key={i} className="flex gap-3 mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ background: `${r.color}20` }}>{r.icon}</div>
              <p className="text-sm leading-snug" style={{ color: MUTED, ...ff }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

