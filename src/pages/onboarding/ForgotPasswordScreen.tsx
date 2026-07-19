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


export function ForgotPasswordScreen({ go }: { go: (s: Screen) => void }) {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false)
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-6 pt-6 pb-2 flex"><BackBtn onClick={() => go("login")}/></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 flex flex-col justify-center pb-10">
        {!sent ? (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm" style={{ background: "white" }}><span style={{ fontSize: 32 }}>🔑</span></div>
              <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Reset Password</h2>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: MUTED, ...ff }}>Enter your email and we'll send you a reset link.</p>
            </div>
            <div className="rounded-3xl p-6 shadow-sm flex flex-col gap-4" style={{ background: "white" }}>
              <FormInput label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com"/>
              <PrimaryBtn onClick={() => setSent(true)} disabled={!email}>Send Reset Link <ArrowRight size={18}/></PrimaryBtn>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-sm" style={{ background: "white" }}><span style={{ fontSize: 40 }}>📬</span></div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: PURPLE, ...ffh }}>Check Your Email!</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: MUTED, ...ff }}>We sent a reset link to <strong style={{ color: PURPLE }}>{email}</strong>.</p>
            <PrimaryBtn onClick={() => go("resetPassword")}>I've Got the Link <ArrowRight size={18}/></PrimaryBtn>
            <button onClick={() => go("login")} className="mt-4 text-sm font-bold" style={{ color: MUTED, ...ff }}>Back to Login</button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

