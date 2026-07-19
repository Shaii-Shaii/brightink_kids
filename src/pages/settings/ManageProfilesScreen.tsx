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


export function ManageProfilesScreen({ profiles, go, onRemove }: { profiles: Profile[]; go: (s: Screen) => void; onRemove: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Profiles" subtitle="Family child profile management" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        {profiles.map(p => {
          const av = AVATARS.find(a => a.id === p.avatar) ?? AVATARS[0]
          return (
            <div key={p.id} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "white" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: av.bg }}>{av.emoji}</div>
              <div className="flex-1">
                <p className="font-bold" style={{ color: PURPLE, ...ffh }}>{p.name}</p>
                <p className="text-xs" style={{ color: MUTED, ...ff }}>Age {p.age}</p>
              </div>
              <button
                onClick={() => onRemove(p.id)}
                disabled={profiles.length <= 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40"
                style={{ background: `${PINK}15` }}
              >
                <Trash2 size={16} style={{ color: PINK }}/>
              </button>
            </div>
          )
        })}
        <PrimaryBtn onClick={() => go("createProfile")} color={BLUE}>Add Child Profile <Plus size={18}/></PrimaryBtn>
      </div>
    </div>
  )
}

