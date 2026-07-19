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


export function StoryDetailScreen({ story, go }: { story: Story|null; go: (s: Screen) => void }) {
  const s = story ?? CURATED_STORIES[0]
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2 flex"><BackBtn onClick={() => go("storyLibrary")}/></div>

      {/* Large cover */}
      <div className="mx-5 mb-5 h-52 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-md"
        style={{ background: s.coverColor }}>
        <span style={{ fontSize: 60 }}>{s.emoji}</span>
        <p className="font-bold text-xl text-white text-center px-6" style={{ ...ffh, textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>{s.title}</p>
      </div>

      <div className="px-5 flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${s.coverColor}25`, color: s.coverColor, ...ff }}>
            {THEMES.find(t => t.id === s.theme)?.emoji} {THEMES.find(t => t.id === s.theme)?.label}
          </div>
          <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "#F0E8F8", color: MUTED, ...ff }}>⏱ {s.readTime}</div>
          {s.curated && <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${YELLOW}50`, color: "#B8860B", ...ff }}>★ Curated</div>}
        </div>

        <p className="text-sm leading-relaxed mb-5" style={{ color: MUTED, ...ff }}>
          {s.pages[0]}...
        </p>

        <div className="flex items-center gap-2 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i<4 ? YELLOW : "none"} stroke={i<4 ? YELLOW : MUTED}/>)}
          <span className="text-xs" style={{ color: MUTED, ...ff }}>4.0 · {s.pages.length} pages</span>
        </div>
      </div>

      <div className="px-5 pb-6 flex flex-col gap-3">
        <PrimaryBtn color={s.coverColor} onClick={() => go("storyReading")}>
          <Play size={18}/> Start Reading
        </PrimaryBtn>
        <div className="flex gap-3">
          <OutlineBtn color={s.coverColor} onClick={() => {}}>
            <Bookmark size={16}/> Save
          </OutlineBtn>
          <OutlineBtn color={s.coverColor} onClick={() => {}}>
            <Heart size={16}/> Like
          </OutlineBtn>
        </div>
      </div>
    </div>
  )
}

