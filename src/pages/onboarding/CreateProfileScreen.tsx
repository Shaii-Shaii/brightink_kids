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


export function CreateProfileScreen({ go, onAdd }: { go: (s: Screen) => void; onAdd: (p: Profile) => void }) {
  const [name, setName] = useState(""); const [age, setAge] = useState<number|null>(null); const [avatar, setAvatar] = useState<string|null>(null)
  const canContinue = name.trim() && age !== null && avatar !== null
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: PEACH }}>
      <div className="px-6 pt-6 pb-2 flex"><BackBtn onClick={() => go("authChoice")}/></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="px-6 pb-10">
        <div className="mb-5"><h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Add Your Child</h2>
          <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>Set up a profile so your child can start their adventure!</p></div>
        <div className="rounded-3xl p-6 shadow-sm flex flex-col gap-5" style={{ background: "white" }}>
          <FormInput label="Child's First Name" value={name} onChange={setName} placeholder="e.g. Mia"/>
          <div>
            <label className="text-sm font-bold block mb-2" style={{ color: PURPLE, ...ff }}>Age</label>
            <div className="flex gap-3">
              {[5,6,7].map(n => (
                <button key={n} onClick={() => setAge(n)} className="flex-1 py-3 rounded-2xl font-bold text-xl transition-all active:scale-95 border-2"
                  style={{ borderColor: age===n ? PINK : "rgba(255,132,186,0.2)", background: age===n ? PINK : "white", color: age===n ? "white" : PURPLE, ...ffh }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-bold block mb-2" style={{ color: PURPLE, ...ff }}>Pick an Avatar</label>
            <div className="grid grid-cols-4 gap-2.5">
              {AVATARS.map(a => (
                <button key={a.id} onClick={() => setAvatar(a.id)}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl transition-all active:scale-95 border-2"
                  style={{ borderColor: avatar===a.id ? PINK : "transparent", background: avatar===a.id ? "#FFF0F8" : `${a.bg}22` }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: a.bg }}>{a.emoji}</div>
                  {avatar===a.id && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: PINK }}><Check size={10} color="white" strokeWidth={3}/></div>}
                </button>
              ))}
            </div>
          </div>
          <PrimaryBtn onClick={() => { onAdd({ id: Date.now().toString(), name: name.trim(), age: age!, avatar: avatar! }); go("profileSelector") }} disabled={!canContinue}>
            Continue <ArrowRight size={18}/>
          </PrimaryBtn>
        </div>
      </motion.div>
    </div>
  )
}

