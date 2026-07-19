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


export function SettingsHomeScreen({ go }: { go: (s: Screen) => void }) {
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const parentPin = "2468"
  const handlePinKey = (key: number | "back") => {
    setPinError(false)
    if (key === "back") {
      setPinInput(prev => prev.slice(0, -1))
      return
    }
    if (pinInput.length >= 4) return
    const next = `${pinInput}${key}`
    setPinInput(next)
    if (next.length === 4) {
      if (next === parentPin) {
        setTimeout(() => setUnlocked(true), 180)
      } else {
        setPinError(true)
        setTimeout(() => setPinInput(""), 350)
      }
    }
  }
  if (!unlocked) {
    return (
      <div className="flex flex-col h-full" style={{ background: PEACH }}>
        <ScreenHeader title="Parent Check" subtitle="Settings are for grown-ups" go={go}/>
        <div className="flex-1 px-6 flex flex-col items-center justify-center text-center pb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-sm" style={{ background: "white" }}>
            <Lock size={32} style={{ color: PINK }}/>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: PURPLE, ...ffh }}>Quick parent check</h2>
          <p className="text-sm mb-6" style={{ color: MUTED, ...ff }}>Enter your 4-digit parent PIN.</p>
          <div className="flex gap-3 mb-3" aria-label="PIN entry">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 shadow-sm"
                style={{ background: "white", borderColor: pinError ? "#FF4D4D" : pinInput.length > i ? PINK : "rgba(255,132,186,0.25)" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: pinInput.length > i ? PURPLE : "transparent" }}/>
              </div>
            ))}
          </div>
          <p className="h-5 text-xs font-bold mb-4" style={{ color: pinError ? "#CC4444" : MUTED, ...ff }}>
            {pinError ? "Incorrect PIN. Try again." : "Settings stay locked for children."}
          </p>
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-5">
            {[1,2,3,4,5,6,7,8,9,"",0,"back"].map((key, i) => (
              <button
                key={i}
                onClick={() => key !== "" && handlePinKey(key === "back" ? "back" : Number(key))}
                className={`h-14 rounded-2xl text-xl font-bold transition-all active:scale-95 ${key === "" ? "invisible" : ""}`}
                style={{ background: "white", color: PURPLE, ...ffh }}
              >
                {key === "back" ? "⌫" : key}
              </button>
            ))}
          </div>
          <button onClick={() => go("home")} className="mt-4 text-sm font-bold" style={{ color: MUTED, ...ff }}>Back to Home</button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Settings" subtitle="Parent-gated app controls" go={go}/>
      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-3">
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: `${YELLOW}35`, border: `2px solid ${YELLOW}` }}>
          <Lock size={20} style={{ color: PURPLE }}/>
          <div>
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>Parent area</p>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Unlocked after a quick parent check.</p>
          </div>
        </div>
        <SettingsRow icon={BarChart2} title="Parent Dashboard" subtitle="Detailed learning analytics and recommendations" color={BLUE} onClick={() => go("parentDashboard")}/>
        <SettingsRow icon={User} title="Account Settings" subtitle="Parent email, password, and sign-in methods" onClick={() => go("accountSettings")}/>
        <SettingsRow icon={Star} title="Child Profile Settings" subtitle="Edit the active child's name, age, and avatar" color={YELLOW} onClick={() => go("childProfileSettings")}/>
        <SettingsRow icon={Plus} title="Manage Profiles" subtitle="Add, switch, or remove child profiles" color={GREEN} onClick={() => go("manageProfiles")}/>
        <SettingsRow icon={Bell} title="Notification Settings" subtitle="Daily practice reminders and alerts" color={BLUE} onClick={() => go("notificationSettings")}/>
        <SettingsRow icon={Volume2} title="Sound & Voice Settings" subtitle="Sound effects, narration, and mic sensitivity" onClick={() => go("soundVoiceSettings")}/>
        <SettingsRow icon={Type} title="Accessibility Settings" subtitle="Text size, high contrast, and reader comfort" color={GREEN} onClick={() => go("accessibilitySettings")}/>
        <SettingsRow icon={Shield} title="Privacy & Data Settings" subtitle="Data usage, exports, and delete account options" color={PURPLE} onClick={() => go("privacyDataSettings")}/>
        <SettingsRow icon={HelpCircle} title="About / Help" subtitle="Version, support contact, and FAQs" color={BLUE} onClick={() => go("aboutHelp")}/>
        <div className="pt-2">
          <p className="text-xs font-bold mb-2" style={{ color: MUTED, ...ff }}>Utility states</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Loading", screen: "loadingState" as Screen, icon: Loader2 },
              { label: "Error", screen: "errorState" as Screen, icon: WifiOff },
              { label: "Empty", screen: "emptyState" as Screen, icon: BookOpen },
            ].map(({ label, screen, icon: Icon }) => (
              <button key={label} onClick={() => go(screen)} className="rounded-2xl py-3 flex flex-col items-center gap-1" style={{ background: "white" }}>
                <Icon size={18} style={{ color: PINK }}/>
                <span className="text-xs font-bold" style={{ color: PURPLE, ...ff }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

