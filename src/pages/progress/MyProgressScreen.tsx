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


export function MyProgressScreen({ go }: { go: (s: Screen) => void }) {
  const child = DEMO_PROFILES[0]
  const av = AVATARS.find(a => a.id === child.avatar) ?? AVATARS[0]

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: av.bg }}>{av.emoji}</div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>{child.name}'s Progress</h2>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Keep up the great work! ⭐</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-4">
        {/* Streak & stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[{ emoji: "🔥", label: "Day Streak", val: "3" }, { emoji: "📖", label: "Stories Read", val: "12" }, { emoji: "✏️", label: "Letters Traced", val: "18" }].map(s => (
            <div key={s.label} className="rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm" style={{ background: "white" }}>
              <span style={{ fontSize: 24 }}>{s.emoji}</span>
              <p className="font-bold text-xl" style={{ color: PURPLE, ...ffh }}>{s.val}</p>
              <p className="text-xs text-center" style={{ color: MUTED, ...ff }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-3" style={{ color: PURPLE, ...ff }}>My Badges</p>
          <div className="grid grid-cols-4 gap-2">
            {BADGES.map(b => (
              <div key={b.id} className="flex flex-col items-center gap-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${!b.earned ? "opacity-35 grayscale" : ""}`}
                  style={{ background: b.earned ? `${YELLOW}40` : "#F0E8F8" }}>
                  <span>{b.emoji}</span>
                </div>
                <p className="text-xs text-center leading-tight" style={{ color: b.earned ? PURPLE : MUTED, ...ff }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills overview */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-4" style={{ color: PURPLE, ...ff }}>Skill Progress</p>
          <div className="flex justify-around">
            <Ring pct={72} color={PINK}   label="Reading"/>
            <Ring pct={58} color={BLUE}   label="Writing"/>
            <Ring pct={85} color={GREEN}  label="Tracing"/>
            <Ring pct={45} color={YELLOW} label="Vocab"/>
          </div>
        </div>

        {/* Simple bar chart */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-1" style={{ color: PURPLE, ...ff }}>This Week's Activity</p>
          <p className="text-xs mb-3" style={{ color: MUTED, ...ff }}>Stories · Tracing · Vocab</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={WEEKLY_DATA} barGap={2} barSize={6}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: MUTED, fontFamily: "Nunito" }} axisLine={false} tickLine={false}/>
              <Bar id="prog-stories" dataKey="stories" fill={PINK} radius={[3,3,0,0]}/>
              <Bar id="prog-tracing" dataKey="tracing" fill={BLUE} radius={[3,3,0,0]}/>
              <Bar id="prog-vocab"   dataKey="vocab"   fill={GREEN} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <BottomNav active="myProgress" go={go}/>
    </div>
  )
}

