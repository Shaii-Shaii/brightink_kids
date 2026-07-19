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


export function StoryTitleScreen({ go, theme, title, onTitleChange }: { go: (s: Screen) => void; theme: string; title: string; onTitleChange: (title: string) => void }) {
  const t = THEMES.find(x => x.id === theme) ?? THEMES[0]
  const friendlyTitles = [
    `My ${t.label} Story`,
    `The Brave ${t.label}`,
    `A Happy ${t.label} Day`,
  ]
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: PEACH }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-3"><BackBtn onClick={() => go("storyTheme")}/></div>
      <div className="px-5 mb-4">
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Name Your Story</h2>
        <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>First, give your story a name.</p>
      </div>

      <div className="mx-5 mb-4 h-44 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-sm" style={{ background: t.color }}>
        <span style={{ fontSize: 52 }}>{t.emoji}</span>
        <p className="font-bold text-xl text-white text-center px-5" style={{ ...ffh, textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
          {title || "My Story"}
        </p>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <FormInput label="Story Name" value={title} onChange={onTitleChange} placeholder="Type a short name"/>
        <div>
          <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Need an idea?</p>
          <div className="flex flex-col gap-2">
            {friendlyTitles.map(name => (
              <button key={name} onClick={() => onTitleChange(name)} className="rounded-2xl px-4 py-3 text-left font-bold text-sm" style={{ background: "white", color: PURPLE, ...ff }}>
                {name}
              </button>
            ))}
          </div>
        </div>
        <PrimaryBtn color={t.color} disabled={!title.trim()} onClick={() => go("storyWriting")}>
          Start Writing <ArrowRight size={18}/>
        </PrimaryBtn>
      </div>
    </div>
  )
}

