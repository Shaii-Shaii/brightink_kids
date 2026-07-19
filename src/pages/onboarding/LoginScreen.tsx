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


export function LoginScreen({ go }: { go: (s: Screen) => void }) {
  const [email, setEmail] = useState(""); const [pass, setPass] = useState("")
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: PEACH }}>
      <div className="px-6 pt-6 pb-2 flex"><BackBtn onClick={() => go("authChoice")}/></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="px-6 pb-10">
        <div className="mb-6 flex items-end gap-3">
          <div><h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Welcome Back!</h2>
            <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>Log in to continue the adventure</p></div>
          <OwlMascot size={64}/>
        </div>
        <div className="rounded-3xl p-6 shadow-sm flex flex-col gap-4" style={{ background: "white" }}>
          <FormInput label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com"/>
          <PasswordInput label="Password" value={pass} onChange={setPass} placeholder="Your password"/>
          <div className="flex justify-end -mt-1">
            <button onClick={() => go("forgotPassword")} className="text-sm font-bold" style={{ color: PINK, ...ff }}>Forgot Password?</button>
          </div>
          <PrimaryBtn onClick={() => go("profileSelector")} disabled={!email || !pass}>Log In <ArrowRight size={18}/></PrimaryBtn>
          <Divider/><GoogleBtn label="Log in with Google"/>
        </div>
        <div className="mt-5"><ScreenLink text="New to BrightInk?" action="Create Account" onClick={() => go("signup")}/></div>
      </motion.div>
    </div>
  )
}

