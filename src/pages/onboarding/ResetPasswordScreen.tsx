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


export function ResetPasswordScreen({ go }: { go: (s: Screen) => void }) {
  const [pass, setPass] = useState(""); const [confirm, setConfirm] = useState(""); const [done, setDone] = useState(false)
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-6 pt-6 pb-2 flex"><BackBtn onClick={() => go("forgotPassword")}/></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 flex flex-col justify-center pb-10">
        {!done ? (
          <>
            <div className="mb-6"><h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>New Password</h2>
              <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>Choose a strong new password.</p></div>
            <div className="rounded-3xl p-6 shadow-sm flex flex-col gap-4" style={{ background: "white" }}>
              <PasswordInput label="New Password" value={pass} onChange={setPass} placeholder="At least 8 characters"/>
              <PasswordInput label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Repeat new password"/>
              {pass && confirm && pass !== confirm && <p className="text-xs text-red-500" style={ff}>Passwords do not match</p>}
              <PrimaryBtn onClick={() => setDone(true)} disabled={!pass || pass !== confirm}>Update Password</PrimaryBtn>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: PINK }}>
              <Check size={36} color="white" strokeWidth={3}/>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: PURPLE, ...ffh }}>Password Updated!</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: MUTED, ...ff }}>Your password has been successfully changed.</p>
            <PrimaryBtn onClick={() => go("login")}>Back to Login <ArrowRight size={18}/></PrimaryBtn>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

