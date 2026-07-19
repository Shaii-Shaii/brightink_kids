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


export function StoryFeedbackScreen({ go, theme, title, pages, onSave }: {
  go: (s: Screen) => void
  theme: string
  title: string
  pages: string[]
  onSave: (s: Story) => void
}) {
  const t = THEMES.find(x => x.id === theme) ?? THEMES[0]
  const [accepted, setAccepted] = useState<Record<number,boolean>>({})
  const storyPages = pages.length ? pages : ["Once upon a time, I made a new story."]
  const suggestions = [
    { type: "spelling", original: "teh", suggestion: "the",    msg: "Looks like a small typo!" },
    { type: "grammar",  original: "she go", suggestion: "she goes", msg: "Let's make this sound smoother." },
    { type: "capital",  original: "i found", suggestion: "I found", msg: "Capital I for yourself!" },
  ]
  const allHandled = suggestions.every((_, i) => accepted[i] !== undefined)
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <BackBtn onClick={() => go("storyWriting")}/>
      </div>
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} style={{ color: t.color }}/>
          <h2 className="text-xl font-bold" style={{ color: PURPLE, ...ffh }}>AI Suggestions</h2>
        </div>
        <p className="text-sm" style={{ color: MUTED, ...ff }}>Here are some friendly fixes to make your story shine! ✨</p>
      </div>

      <div className="flex-1 px-5 overflow-y-auto flex flex-col gap-3 pb-4">
        {suggestions.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-4 shadow-sm" style={{ background: "white" }}>
            <div className="flex items-start gap-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                style={{ background: s.type==="spelling" ? `${PINK}20` : s.type==="grammar" ? `${BLUE}20` : `${YELLOW}40`, color: s.type==="spelling" ? PINK : s.type==="grammar" ? BLUE : "#F5A623" }}>
                {s.type==="spelling" ? "Sp" : s.type==="grammar" ? "Gr" : "Ab"}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>{s.msg}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded-md text-sm line-through" style={{ background: "#FFE0E0", color: "#CC4444" }}>{s.original}</span>
                  <ArrowRight size={12} style={{ color: MUTED }}/>
                  <span className="px-2 py-0.5 rounded-md text-sm font-semibold" style={{ background: "#E0FFE8", color: "#2E8B57" }}>{s.suggestion}</span>
                </div>
              </div>
            </div>
            {accepted[i] === undefined ? (
              <div className="flex gap-2">
                <button onClick={() => setAccepted(prev => ({ ...prev, [i]: true }))}
                  className="flex-1 py-2 rounded-xl text-sm font-bold" style={{ background: GREEN, color: "white", ...ff }}>✓ Accept</button>
                <button onClick={() => setAccepted(prev => ({ ...prev, [i]: false }))}
                  className="flex-1 py-2 rounded-xl text-sm font-bold border-2" style={{ borderColor: "rgba(0,0,0,0.1)", color: MUTED, ...ff }}>✗ Keep Mine</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-1">
                {accepted[i] ? <Check size={16} style={{ color: GREEN }}/> : <X size={16} style={{ color: MUTED }}/>}
                <span className="text-sm" style={{ color: accepted[i] ? GREEN : MUTED, ...ff }}>{accepted[i] ? "Change accepted!" : "Keeping original."}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="px-5 pb-6">
        <PrimaryBtn onClick={() => {
          onSave({
            id: Date.now().toString(),
            title: title.trim() || "My Story",
            theme,
            emoji: t.emoji,
            coverColor: t.color,
            readTime: `${Math.max(1, storyPages.length * 2)} min`,
            createdAt: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
            pages: storyPages,
          })
          go("storySaved")
        }} color={t.color}>
          Save My Story <ArrowRight size={18}/>
        </PrimaryBtn>
      </div>
    </div>
  )
}

