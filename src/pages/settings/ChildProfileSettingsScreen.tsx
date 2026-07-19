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


export function ChildProfileSettingsScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const child = profiles[0] ?? DEMO_PROFILES[0]
  const [name, setName] = useState(child.name)
  const [age, setAge] = useState(child.age)
  const [avatar, setAvatar] = useState(child.avatar)
  const [saved, setSaved] = useState(false)
  const av = AVATARS.find(a => a.id === avatar) ?? AVATARS[0]
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Child Profile" subtitle="No sensitive child data required" go={go} backTo="settingsHome"/>
      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-4">
        <div className="rounded-3xl p-5 flex items-center gap-4" style={{ background: "white" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: av.bg }}>{av.emoji}</div>
          <div>
            <p className="font-bold text-xl" style={{ color: PURPLE, ...ffh }}>{name || "Child"}</p>
            <p className="text-sm" style={{ color: MUTED, ...ff }}>Age {age} learning profile</p>
          </div>
        </div>
        <FormInput label="Child's First Name" value={name} onChange={(v) => { setName(v); setSaved(false) }} placeholder="Child name"/>
        <div>
          <p className="text-sm font-bold mb-2" style={{ color: PURPLE, ...ff }}>Age Group</p>
          <div className="flex gap-2">
            {[5,6,7].map(n => (
              <button key={n} onClick={() => { setAge(n); setSaved(false) }} className="flex-1 py-3 rounded-2xl font-bold border-2"
                style={{ borderColor: age === n ? PINK : "rgba(255,132,186,0.2)", background: age === n ? PINK : "white", color: age === n ? "white" : PURPLE, ...ffh }}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {AVATARS.map(a => (
            <button key={a.id} onClick={() => { setAvatar(a.id); setSaved(false) }} className="aspect-square rounded-2xl text-2xl border-2" style={{ background: a.bg, borderColor: avatar === a.id ? PURPLE : "transparent" }}>{a.emoji}</button>
          ))}
        </div>
        {saved && <p className="text-sm font-bold text-center" style={{ color: GREEN, ...ff }}>Profile settings saved.</p>}
        <PrimaryBtn onClick={() => setSaved(true)} disabled={!name.trim()}>Save Profile</PrimaryBtn>
      </div>
    </div>
  )
}

