import { useState, useEffect, useCallback, useRef } from "react"
import type { ComponentType, CSSProperties, Dispatch, PointerEvent as ReactPointerEvent, SetStateAction } from "react"
import { createPortal } from "react-dom"
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

// ─── Types ────────────────────────────────────────────────────────────────────
export type Screen =
  | "splash" | "intro" | "authChoice" | "signup" | "login"
  | "forgotPassword" | "resetPassword" | "createProfile" | "profileSelector"
  | "home" | "profileSwitch"
  | "storyTheme" | "storyWriting" | "storyFeedback" | "storyTitle" | "storySaved"
  | "storyLibrary" | "storyDetail" | "storyReading"
  | "tracingHome" | "tracingLetter" | "tracingFeedback"
  | "vocabHome" | "vocabPractice" | "vocabFeedback"
  | "activityIntro" | "activityScreen" | "activityResults"
  | "myProgress" | "parentDashboard"
  | "settingsHome" | "accountSettings" | "childProfileSettings" | "manageProfiles"
  | "notificationSettings" | "soundVoiceSettings" | "accessibilitySettings"
  | "privacyDataSettings" | "aboutHelp" | "loadingState" | "errorState" | "emptyState"

export interface Profile { id: string; name: string; age: number; avatar: string }
export interface Story {
  id: string; title: string; theme: string; pages: string[]
  coverColor: string; readTime: string; createdAt: string; curated?: boolean
  emoji: string
}

// ─── Colors ───────────────────────────────────────────────────────────────────
export const PINK   = "#FF84BA"
export const YELLOW = "#FFDF82"
export const BLUE   = "#99C2FF"
export const PEACH  = "#FFEFE3"
export const PURPLE = "#3D2B4E"
export const MUTED  = "#9B6B8A"
export const GREEN  = "#7ECBA1"
export const ff     = { fontFamily: "'Nunito', sans-serif" } as const
export const ffh    = { fontFamily: "'Fredoka', 'Nunito', sans-serif" } as const

// ─── Mock Data ────────────────────────────────────────────────────────────────
export const AVATARS = [
  { id: "owl",     emoji: "🦉", bg: PINK   },
  { id: "cat",     emoji: "🐱", bg: BLUE   },
  { id: "bunny",   emoji: "🐰", bg: YELLOW },
  { id: "bear",    emoji: "🐻", bg: PINK   },
  { id: "fox",     emoji: "🦊", bg: BLUE   },
  { id: "dog",     emoji: "🐶", bg: YELLOW },
  { id: "penguin", emoji: "🐧", bg: PINK   },
  { id: "frog",    emoji: "🐸", bg: BLUE   },
]

export const THEMES = [
  { id: "animals",    label: "Animals",    emoji: "🐾", color: PINK   },
  { id: "adventure",  label: "Adventure",  emoji: "🗺️", color: YELLOW },
  { id: "friendship", label: "Friendship", emoji: "💝", color: "#FFB3C6" },
  { id: "magic",      label: "Magic",      emoji: "✨", color: "#C4A8E8" },
  { id: "space",      label: "Space",      emoji: "🚀", color: BLUE   },
  { id: "ocean",      label: "Ocean",      emoji: "🌊", color: "#64B5F6" },
  { id: "forest",     label: "Forest",     emoji: "🌿", color: GREEN  },
  { id: "fantasy",    label: "Fantasy",    emoji: "🦄", color: "#F48FB1" },
]

export const AI_SUGGESTIONS: Record<string, string[]> = {
  animals:    ["Once there was a fluffy bunny who…", "Deep in the forest, a friendly bear…", "The little elephant wanted to…"],
  adventure:  ["On a sunny morning, I found a treasure map…", "The brave explorer climbed a tall mountain…", "One day, a mysterious door appeared…"],
  friendship: ["Lily and the tiny fairy became best friends when…", "Tom felt lonely until he met…", "Two friends made a promise to always…"],
  magic:      ["The magic wand glowed bright when…", "In the enchanted forest, flowers could…", "A little wizard discovered a spell that…"],
  space:      ["The small rocket zoomed past the stars…", "On a faraway planet, there lived…", "The brave astronaut discovered…"],
  ocean:      ["Under the deep blue sea, a seahorse…", "The little mermaid found a shiny shell…", "Bubbles the fish swam to the surface and…"],
  forest:     ["The talking tree whispered a secret…", "A tiny acorn grew into…", "Rosie the rabbit found a path through…"],
  fantasy:    ["The purple dragon sneezed and…", "A unicorn with rainbow wings…", "In the kingdom of clouds, the princess…"],
}

export const CURATED_STORIES: Story[] = [
  {
    id: "c1", title: "The Brave Little Turtle", theme: "animals", emoji: "🐢",
    coverColor: BLUE, readTime: "3 min", createdAt: "BrightInk", curated: true,
    pages: [
      "Tilly the turtle lived near a sparkling pond.",
      "One day, Tilly saw a dragonfly stuck in a web. She wanted to help but felt afraid.",
      "\"I am brave,\" she whispered to herself, and she crawled toward the web.",
      "Slowly and carefully, Tilly freed the dragonfly with her tiny claws.",
      "The dragonfly smiled and flew in a happy circle around Tilly.\n\"Thank you, brave friend!\" it said.",
    ],
  },
  {
    id: "c2", title: "Star Adventure", theme: "space", emoji: "🚀",
    coverColor: "#7B68EE", readTime: "4 min", createdAt: "BrightInk", curated: true,
    pages: [
      "Zip was a small robot who lived on a bright red spaceship.",
      "One night, a tiny star fell from the sky and knocked on the spaceship window!",
      "\"Please help me get back home,\" the star said with a twinkle.",
      "Zip set the rocket controls and zoomed through the galaxy.",
      "Together they soared past purple planets and silver moons.",
      "When the star reached home, the whole sky lit up — just for Zip!",
    ],
  },
  {
    id: "c3", title: "The Magic Garden", theme: "magic", emoji: "🌸",
    coverColor: GREEN, readTime: "3 min", createdAt: "BrightInk", curated: true,
    pages: [
      "Behind Grandma's house was a hidden garden where flowers could sing.",
      "Rose, the biggest flower, sang the loudest and the sweetest.",
      "One morning, Rose lost her voice and the garden fell silent.",
      "Little Mia searched all day and found a drop of golden morning dew.",
      "She placed it gently on Rose's petals. The garden filled with music again!",
    ],
  },
]

export const INIT_USER_STORIES: Story[] = [
  {
    id: "u1", title: "My Cat Fluffball", theme: "animals", emoji: "🐱",
    coverColor: YELLOW, readTime: "2 min", createdAt: "Jul 10, 2026",
    pages: [
      "Fluffball is a very fluffy cat with big green eyes.",
      "She loves to play with yarn and chase butterflies.",
      "One day she found a big red ball in the garden!",
      "The ball rolled away fast. Fluffball ran after it as quick as she could.",
      "She caught the ball and purred happily. It was the best day ever!",
    ],
  },
]

export const VOCAB_WORDS = [
  { word: "Adventure", phonetic: "/ədˈventʃər/", emoji: "🗺️", hint: "A fun and exciting journey" },
  { word: "Brave",     phonetic: "/breɪv/",       emoji: "🦁", hint: "Not afraid to try new things" },
  { word: "Sparkle",   phonetic: "/ˈspɑːrkəl/",   emoji: "✨", hint: "To shine with tiny lights" },
  { word: "Whisper",   phonetic: "/ˈwɪspər/",     emoji: "🤫", hint: "To speak very softly" },
  { word: "Giggle",    phonetic: "/ˈɡɪɡəl/",      emoji: "😄", hint: "A soft, silly laugh" },
  { word: "Curious",   phonetic: "/ˈkjʊəriəs/",   emoji: "🔍", hint: "Wanting to know things" },
]

export const VOCAB_CATEGORIES = [
  { id: "stories", label: "From My Stories", emoji: "📖", color: PINK   },
  { id: "animals", label: "Animals",         emoji: "🐾", color: YELLOW },
  { id: "nature",  label: "Nature",          emoji: "🌿", color: GREEN  },
  { id: "colors",  label: "Colors",          emoji: "🎨", color: BLUE   },
]

export const BADGES = [
  { id: "first_story", emoji: "📝", label: "First Story!",   earned: true  },
  { id: "reader",      emoji: "📚", label: "Bookworm",       earned: true  },
  { id: "tracer",      emoji: "✏️", label: "Letter Master",  earned: true  },
  { id: "speaker",     emoji: "🎤", label: "Voice Star",     earned: false },
  { id: "streak3",     emoji: "🔥", label: "3-Day Streak",   earned: true  },
  { id: "perfect",     emoji: "⭐", label: "Perfect Score",  earned: false },
  { id: "explorer",    emoji: "🗺️", label: "Explorer",       earned: false },
  { id: "champion",    emoji: "🏆", label: "Champion",       earned: false },
]

export const WEEKLY_DATA = [
  { day: "Mon", stories: 1, tracing: 3, vocab: 2 },
  { day: "Tue", stories: 0, tracing: 5, vocab: 4 },
  { day: "Wed", stories: 2, tracing: 2, vocab: 3 },
  { day: "Thu", stories: 1, tracing: 4, vocab: 5 },
  { day: "Fri", stories: 1, tracing: 6, vocab: 2 },
  { day: "Sat", stories: 2, tracing: 3, vocab: 6 },
  { day: "Sun", stories: 0, tracing: 1, vocab: 1 },
]

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export const TRACING_PROGRESS: Record<string, number> = {
  A: 3, B: 3, C: 2, D: 1, E: 3, F: 2, G: 0, H: 0,
  I: 3, J: 1, K: 0, L: 2, M: 0, N: 0, O: 3, P: 2,
  Q: 0, R: 1, S: 0, T: 3, U: 2, V: 0, W: 0, X: 0,
  Y: 1, Z: 0,
}

export const WORD_TRACING_TOPICS = [
  { id: "animals", label: "Animals", emoji: "Paw", color: PINK, words: ["cat", "dog", "bird", "fish"] },
  { id: "numbers", label: "Numbers", emoji: "123", color: BLUE, words: ["one", "two", "three", "four"] },
  { id: "days", label: "Days", emoji: "Sun", color: YELLOW, words: ["sun", "mon", "tue", "wed"] },
  { id: "places", label: "Places", emoji: "Home", color: GREEN, words: ["home", "park", "school", "room"] },
]

export const WORD_TRACING_PROGRESS: Record<string, number> = {
  cat: 3, dog: 2, bird: 0, fish: 0,
  one: 1, two: 0, three: 0, four: 0,
  sun: 3, mon: 1, tue: 0, wed: 0,
  home: 2, park: 0, school: 0, room: 0,
}

export const VOWEL_PRACTICE = [
  { vowel: "A", sound: "a as in apple", emoji: "apple", stars: 3 },
  { vowel: "E", sound: "e as in egg", emoji: "egg", stars: 3 },
  { vowel: "I", sound: "i as in igloo", emoji: "ice", stars: 2 },
  { vowel: "O", sound: "o as in octopus", emoji: "octo", stars: 0 },
  { vowel: "U", sound: "u as in umbrella", emoji: "rain", stars: 0 },
]

export type TraceStroke = { d: string; label: [number, number] }
export type DrawStroke = { id: number; d: string }
export type TraceTool = "pen" | "eraser"
export type VocabResult = { correct: boolean; transcript: string; target: string; reason?: string }

export function parseDrawPoints(paths: Array<DrawStroke | string>) {
  return paths.flatMap(path => {
    const d = typeof path === "string" ? path : path.d
    return [...d.matchAll(/[ML]\s+([\d.]+)\s+([\d.]+)/g)].map(match => ({
      x: Number(match[1]),
      y: Number(match[2]),
    }))
  })
}

export function parsePathCoords(d: string) {
  return [...d.matchAll(/([\d.]+)\s+([\d.]+)/g)].map(match => ({
    x: Number(match[1]),
    y: Number(match[2]),
  }))
}

export function distanceToSegment(point: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lenSq = dx * dx + dy * dy || 1
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq))
  const x = a.x + t * dx
  const y = a.y + t * dy
  return Math.hypot(point.x - x, point.y - y)
}

export function strokeArrowPosition(stroke: TraceStroke) {
  const match = stroke.d.match(/M\s*([\d.]+)\s+([\d.]+)\s*(?:[CL]\s*([\d.]+)\s+([\d.]+))?/)
  const x1 = Number(match?.[1] ?? stroke.label[0])
  const y1 = Number(match?.[2] ?? stroke.label[1])
  const x2 = Number(match?.[3] ?? stroke.label[0])
  const y2 = Number(match?.[4] ?? stroke.label[1] + 12)
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
  return { x: stroke.label[0] + 9, y: stroke.label[1] - 2, angle }
}

export const LOWER_TRACE_STROKES: Record<string, TraceStroke[]> = {
  A: [{ d: "M62 36 C34 36 30 74 55 74 C77 74 78 36 58 36", label: [56, 34] }, { d: "M78 36 L78 74", label: [82, 38] }],
  B: [{ d: "M36 18 L36 74", label: [30, 20] }, { d: "M36 42 C78 28 82 76 36 70", label: [52, 40] }],
  C: [{ d: "M74 42 C56 28 28 42 32 62 C36 82 64 80 74 66", label: [70, 40] }],
  D: [{ d: "M72 18 L72 74", label: [76, 20] }, { d: "M72 40 C36 28 28 76 72 70", label: [60, 38] }],
  E: [{ d: "M74 44 C54 28 28 40 32 60 C36 78 64 80 76 66", label: [70, 42] }, { d: "M34 58 L74 58", label: [38, 55] }],
  F: [{ d: "M62 18 C42 18 42 34 42 42 L42 76", label: [58, 16] }, { d: "M30 42 L62 42", label: [30, 39] }],
  G: [{ d: "M74 42 C56 28 28 42 32 62 C36 82 66 78 74 62 L74 84 C74 96 50 96 44 86", label: [70, 40] }],
  H: [{ d: "M34 18 L34 74", label: [28, 20] }, { d: "M34 46 C58 28 72 40 72 74", label: [48, 42] }],
  I: [{ d: "M50 38 L50 74", label: [54, 40] }],
  J: [{ d: "M58 38 L58 82 C58 98 36 98 34 84", label: [62, 40] }],
  K: [{ d: "M34 18 L34 74", label: [28, 20] }, { d: "M70 40 L36 58", label: [66, 38] }, { d: "M44 56 L74 74", label: [56, 62] }],
  L: [{ d: "M50 18 L50 74", label: [54, 20] }],
  M: [{ d: "M24 44 L24 74", label: [20, 42] }, { d: "M24 48 C36 34 48 34 48 74", label: [34, 42] }, { d: "M48 48 C60 34 74 34 74 74", label: [58, 42] }],
  N: [{ d: "M30 44 L30 74", label: [26, 42] }, { d: "M30 48 C56 30 72 42 72 74", label: [48, 42] }],
  O: [{ d: "M50 36 C24 36 24 76 50 76 C76 76 76 36 50 36", label: [58, 34] }],
  P: [{ d: "M32 42 L32 88", label: [26, 44] }, { d: "M32 42 C72 30 80 70 32 66", label: [52, 40] }],
  Q: [{ d: "M52 36 C26 36 26 76 52 76 C78 76 78 36 52 36", label: [60, 34] }, { d: "M72 62 L72 90", label: [76, 64] }],
  R: [{ d: "M34 44 L34 74", label: [30, 42] }, { d: "M34 50 C44 36 58 36 66 46", label: [48, 42] }],
  S: [{ d: "M72 42 C52 30 30 38 34 54 C38 66 70 58 72 70 C74 84 42 84 30 72", label: [68, 40] }],
  T: [{ d: "M50 24 L50 74", label: [54, 26] }, { d: "M34 42 L66 42", label: [34, 39] }],
  U: [{ d: "M30 42 L30 62 C30 82 70 82 70 62 L70 42", label: [26, 44] }],
  V: [{ d: "M28 42 L50 74", label: [24, 44] }, { d: "M72 42 L50 74", label: [68, 44] }],
  W: [{ d: "M22 42 L34 74", label: [18, 44] }, { d: "M46 42 L34 74", label: [42, 44] }, { d: "M46 42 L58 74", label: [50, 44] }, { d: "M82 42 L58 74", label: [78, 44] }],
  X: [{ d: "M30 42 L70 74", label: [26, 44] }, { d: "M70 42 L30 74", label: [66, 44] }],
  Y: [{ d: "M28 42 L50 74", label: [24, 44] }, { d: "M72 42 L42 92", label: [68, 44] }],
  Z: [{ d: "M30 42 L72 42 L30 74 L74 74", label: [28, 39] }],
}

export const UPPER_TRACE_STROKES: Record<string, TraceStroke[]> = {
  A: [{ d: "M30 76 L50 20", label: [26, 74] }, { d: "M70 76 L50 20", label: [66, 74] }, { d: "M38 56 L62 56", label: [39, 52] }],
  B: [{ d: "M32 20 L32 76", label: [26, 22] }, { d: "M32 20 C74 18 74 48 32 48", label: [50, 18] }, { d: "M32 48 C78 48 78 78 32 76", label: [50, 48] }],
  C: [{ d: "M76 32 C62 16 28 24 28 50 C28 78 62 84 76 66", label: [72, 30] }],
  D: [{ d: "M32 20 L32 76", label: [26, 22] }, { d: "M32 20 C78 22 80 74 32 76", label: [52, 20] }],
  E: [{ d: "M72 20 L32 20 L32 76 L72 76", label: [70, 16] }, { d: "M32 48 L64 48", label: [36, 44] }],
  F: [{ d: "M32 76 L32 20 L72 20", label: [26, 74] }, { d: "M32 48 L64 48", label: [36, 44] }],
  G: [{ d: "M76 34 C62 16 28 24 28 52 C28 78 60 84 76 66 L76 54 L58 54", label: [72, 32] }],
  H: [{ d: "M30 20 L30 76", label: [24, 22] }, { d: "M70 20 L70 76", label: [74, 22] }, { d: "M30 48 L70 48", label: [34, 44] }],
  I: [{ d: "M50 20 L50 76", label: [54, 22] }],
  J: [{ d: "M68 20 L68 62 C68 86 30 86 30 62", label: [72, 22] }],
  K: [{ d: "M32 20 L32 76", label: [26, 22] }, { d: "M72 20 L34 50", label: [68, 22] }, { d: "M42 48 L76 76", label: [48, 48] }],
  L: [{ d: "M32 20 L32 76 L72 76", label: [26, 22] }],
  M: [{ d: "M24 76 L24 20 L50 54 L76 20 L76 76", label: [20, 74] }],
  N: [{ d: "M28 76 L28 20 L72 76 L72 20", label: [24, 74] }],
  O: [{ d: "M50 20 C22 20 22 76 50 76 C78 76 78 20 50 20", label: [58, 18] }],
  P: [{ d: "M32 76 L32 20", label: [26, 74] }, { d: "M32 20 C74 18 78 54 32 54", label: [52, 18] }],
  Q: [{ d: "M50 20 C22 20 22 76 50 76 C78 76 78 20 50 20", label: [58, 18] }, { d: "M58 62 L76 80", label: [62, 64] }],
  R: [{ d: "M32 76 L32 20", label: [26, 74] }, { d: "M32 20 C74 18 78 54 32 54", label: [52, 18] }, { d: "M46 54 L76 76", label: [50, 56] }],
  S: [{ d: "M74 30 C54 14 28 24 34 44 C40 62 76 52 72 70 C68 88 38 82 28 70", label: [70, 28] }],
  T: [{ d: "M24 20 L76 20", label: [24, 16] }, { d: "M50 20 L50 76", label: [54, 22] }],
  U: [{ d: "M28 20 L28 58 C28 84 72 84 72 58 L72 20", label: [24, 22] }],
  V: [{ d: "M26 20 L50 76", label: [22, 22] }, { d: "M74 20 L50 76", label: [70, 22] }],
  W: [{ d: "M18 20 L32 76", label: [14, 22] }, { d: "M46 20 L32 76", label: [42, 22] }, { d: "M46 20 L60 76", label: [50, 22] }, { d: "M84 20 L60 76", label: [80, 22] }],
  X: [{ d: "M28 20 L72 76", label: [24, 22] }, { d: "M72 20 L28 76", label: [68, 22] }],
  Y: [{ d: "M28 20 L50 48", label: [24, 22] }, { d: "M72 20 L50 48 L50 76", label: [68, 22] }],
  Z: [{ d: "M28 20 L72 20 L28 76 L74 76", label: [26, 16] }],
}

export const DEMO_PROFILES: Profile[] = [
  { id: "1", name: "Mia", age: 6, avatar: "owl" },
  { id: "2", name: "Leo", age: 5, avatar: "bear" },
]

export const STORY_QUESTIONS = [
  { q: "Who is the main character in this story?", opts: ["Fluffball the cat", "A big dog", "A little bird", "A turtle"], correct: 0 },
  { q: "What did Fluffball find one day?", opts: ["A fish", "A big red ball", "A new friend", "A piece of yarn"], correct: 1 },
  { q: "How did Fluffball feel at the end?", opts: ["Sad and tired", "Scared", "Very happy", "Hungry"], correct: 2 },
]

export const SLIDES = [
  { title: "Create Magical Stories", desc: "Your child can write their own adventures with friendly AI assistance built for little ones.", accent: PINK, Ill: BookIll },
  { title: "Read & Discover",        desc: "Explore age-appropriate stories that spark imagination and build vocabulary.",              accent: BLUE,  Ill: ReadIll },
  { title: "Grow Every Day",         desc: "Fun activities build reading, writing, and pronunciation skills through guided play.",      accent: "#F5A623", Ill: SkillIll },
]

// ─── SVG Art ──────────────────────────────────────────────────────────────────
export function OwlMascot({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.17)} viewBox="0 0 120 140" fill="none">
      <ellipse cx="42" cy="22" rx="9" ry="13" fill={PINK} transform="rotate(-15 42 22)" />
      <ellipse cx="78" cy="22" rx="9" ry="13" fill={PINK} transform="rotate(15 78 22)" />
      <ellipse cx="60" cy="100" rx="34" ry="35" fill={PINK} />
      <ellipse cx="27" cy="104" rx="13" ry="21" fill="#E8609A" transform="rotate(-12 27 104)" />
      <ellipse cx="93" cy="104" rx="13" ry="21" fill="#E8609A" transform="rotate(12 93 104)" />
      <circle cx="60" cy="54" r="31" fill={PINK} />
      <ellipse cx="60" cy="56" rx="21" ry="19" fill="#FFF2F8" />
      <circle cx="50" cy="50" r="10.5" fill="white" />
      <circle cx="70" cy="50" r="10.5" fill="white" />
      <circle cx="51" cy="50" r="6.5" fill={PURPLE} />
      <circle cx="71" cy="50" r="6.5" fill={PURPLE} />
      <circle cx="53" cy="47" r="2.2" fill="white" />
      <circle cx="73" cy="47" r="2.2" fill="white" />
      <polygon points="60,60 53,68 67,68" fill={YELLOW} />
      <ellipse cx="60" cy="103" rx="21" ry="23" fill="#FFF2F8" />
      <rect x="37" y="108" width="46" height="25" rx="5" fill={BLUE} />
      <line x1="60" y1="108" x2="60" y2="133" stroke="white" strokeWidth="2" />
      <rect x="40" y="113" width="15" height="2" rx="1" fill="white" opacity="0.75" />
      <rect x="40" y="118" width="11" height="2" rx="1" fill="white" opacity="0.75" />
      <rect x="40" y="123" width="13" height="2" rx="1" fill="white" opacity="0.75" />
      <rect x="63" y="113" width="15" height="2" rx="1" fill="white" opacity="0.75" />
      <rect x="63" y="118" width="11" height="2" rx="1" fill="white" opacity="0.75" />
      <rect x="63" y="123" width="13" height="2" rx="1" fill="white" opacity="0.75" />
      <ellipse cx="46" cy="133" rx="8.5" ry="5" fill={YELLOW} />
      <ellipse cx="74" cy="133" rx="8.5" ry="5" fill={YELLOW} />
      <circle cx="8" cy="42" r="3" fill={YELLOW} opacity="0.9" />
      <circle cx="112" cy="35" r="2.5" fill={BLUE} opacity="0.9" />
      <circle cx="12" cy="68" r="2" fill={PINK} opacity="0.7" />
      <circle cx="108" cy="62" r="3" fill={YELLOW} opacity="0.7" />
    </svg>
  )
}

export function BookIll() {
  return (
    <svg width="200" height="175" viewBox="0 0 200 175" fill="none">
      <rect x="18" y="45" width="76" height="100" rx="9" fill={BLUE} />
      <rect x="106" y="45" width="76" height="100" rx="9" fill={YELLOW} />
      <rect x="90" y="40" width="20" height="110" rx="5" fill={PINK} />
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="28" y={68 + i*13} width={42+(i%2)*(-8)} height="4" rx="2" fill="white" opacity="0.65" />
      ))}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="115" y={68 + i*13} width={40+(i%2)*(-6)} height="4" rx="2" fill="white" opacity="0.65" />
      ))}
      <g transform="rotate(35 172 28)"><rect x="162" y="8" width="10" height="50" rx="3" fill={PINK}/><polygon points="162,58 172,58 167,70" fill={YELLOW}/><rect x="162" y="8" width="10" height="7" rx="3" fill="#E8609A"/></g>
      <circle cx="26" cy="28" r="7" fill={YELLOW}/>
      <line x1="26" y1="20" x2="26" y2="36" stroke={YELLOW} strokeWidth="2.5"/>
      <line x1="18" y1="28" x2="34" y2="28" stroke={YELLOW} strokeWidth="2.5"/>
      <circle cx="178" cy="24" r="5" fill={PINK}/>
      <circle cx="190" cy="100" r="5" fill={YELLOW} opacity="0.75"/>
    </svg>
  )
}

export function ReadIll() {
  return (
    <svg width="200" height="175" viewBox="0 0 200 175" fill="none">
      <circle cx="35" cy="38" r="22" fill={PINK}/>
      <text x="24" y="47" fontSize="20" fontWeight="bold" fill="white" fontFamily="Fredoka, sans-serif">A</text>
      <circle cx="165" cy="45" r="22" fill={BLUE}/>
      <text x="154" y="54" fontSize="20" fontWeight="bold" fill="white" fontFamily="Fredoka, sans-serif">B</text>
      <circle cx="100" cy="16" r="18" fill={YELLOW}/>
      <text x="90" y="25" fontSize="18" fontWeight="bold" fill={PURPLE} fontFamily="Fredoka, sans-serif">C</text>
      <rect x="38" y="88" width="124" height="72" rx="12" fill="white"/>
      <rect x="38" y="88" width="124" height="24" rx="12" fill={PINK}/>
      <rect x="38" y="100" width="124" height="12" fill={PINK}/>
      <line x1="100" y1="88" x2="100" y2="160" stroke="#F0D0E0" strokeWidth="2"/>
      {[0,1,2].map(i => (<rect key={i} x="48" y={120+i*12} width={38-i*5} height="4" rx="2" fill="#EEE"/>))}
      {[0,1,2].map(i => (<rect key={i} x="110" y={120+i*12} width={36-i*4} height="4" rx="2" fill="#EEE"/>))}
      <circle cx="14" cy="80" r="4" fill={YELLOW} opacity="0.8"/>
      <circle cx="188" cy="92" r="4" fill={PINK} opacity="0.8"/>
    </svg>
  )
}

export function SkillIll() {
  return (
    <svg width="200" height="175" viewBox="0 0 200 175" fill="none">
      <rect x="78" y="128" width="44" height="12" rx="4" fill={YELLOW}/>
      <rect x="86" y="116" width="28" height="16" rx="2" fill={YELLOW}/>
      <path d="M48 50 C48 32 66 22 100 22 C134 22 152 32 152 50 C152 92 134 108 100 114 C66 108 48 92 48 50Z" fill={YELLOW}/>
      <path d="M48 53 C32 53 22 68 28 84 C34 100 48 94 48 84 L48 53Z" fill={YELLOW}/>
      <path d="M152 53 C168 53 178 68 172 84 C166 100 152 94 152 84 L152 53Z" fill={YELLOW}/>
      <polygon points="100,44 104,58 118,58 108,66 111,80 100,72 89,80 92,66 82,58 96,58" fill="white" opacity="0.9"/>
      <circle cx="25" cy="35" r="18" fill={PINK}/>
      <text x="16" y="44" fontSize="15" fill="white">★</text>
      <circle cx="175" cy="35" r="18" fill={BLUE}/>
      <text x="166" y="44" fontSize="15" fill="white">★</text>
      <circle cx="25" cy="125" r="13" fill={BLUE} opacity="0.7"/>
      <circle cx="175" cy="125" r="13" fill={PINK} opacity="0.7"/>
      <circle cx="152" cy="148" r="5" fill={YELLOW} opacity="0.8"/>
      <circle cx="52" cy="152" r="5" fill={PINK} opacity="0.8"/>
    </svg>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
export function Blobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20" style={{ background: PINK }}/>
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-15" style={{ background: BLUE }}/>
      <div className="absolute top-1/2 -right-8 w-24 h-24 rounded-full opacity-10" style={{ background: YELLOW }}/>
    </div>
  )
}

export function PrimaryBtn({ children, onClick, color = PINK, textColor = "white", disabled = false, className = "" }: {
  children: React.ReactNode; onClick?: () => void; color?: string; textColor?: string; disabled?: boolean; className?: string
}) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${className}`}
      style={{ background: disabled ? "#D0C8D4" : color, color: textColor, ...ff }}>
      {children}
    </button>
  )
}

export function OutlineBtn({ children, onClick, color = PINK }: { children: React.ReactNode; onClick?: () => void; color?: string }) {
  return (
    <button onClick={onClick} className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 border-2 bg-white"
      style={{ borderColor: color, color, ...ff }}>
      {children}
    </button>
  )
}

export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 font-semibold transition-all active:scale-95" style={{ color: MUTED, ...ff }}>
      <ArrowLeft size={18}/> Back
    </button>
  )
}

export function FormInput({ label, type = "text", value, onChange, placeholder, right }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; right?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold" style={{ color: PURPLE, ...ff }}>{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all text-base"
          style={{ borderColor: "rgba(255,132,186,0.3)", background: "white", color: PURPLE, fontFamily: "'Nunito', sans-serif" }}
          onFocus={e => { e.currentTarget.style.borderColor = PINK }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,132,186,0.3)" }}
        />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  )
}

export function PasswordInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <FormInput label={label} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
      right={<button onClick={() => setShow(!show)} style={{ color: MUTED }}>{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button>}
    />
  )
}

export function GoogleBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full py-3.5 rounded-2xl border-2 font-bold text-base flex items-center justify-center gap-3 bg-white transition-all active:scale-95"
      style={{ borderColor: "rgba(0,0,0,0.1)", color: "#555", ...ff }}>
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {label}
    </button>
  )
}

export function Divider({ text = "or" }: { text?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "rgba(255,132,186,0.2)" }}/>
      <span className="text-sm font-semibold" style={{ color: MUTED, ...ff }}>{text}</span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,132,186,0.2)" }}/>
    </div>
  )
}

export function ScreenLink({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
  return (
    <p className="text-center text-sm" style={{ color: MUTED, ...ff }}>
      {text} <button onClick={onClick} className="font-bold" style={{ color: PINK }}>{action}</button>
    </p>
  )
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────
export const NAV_TABS = [
  { id: "home",        label: "Home",     icon: Home    },
  { id: "storyLibrary",label: "Library",  icon: BookOpen },
  { id: "tracingHome", label: "Practice", icon: PenLine  },
  { id: "myProgress",  label: "Progress", icon: Star     },
] as const

export type NavTab = typeof NAV_TABS[number]["id"]

export function BottomNav({ active, go }: { active: NavTab; go: (s: Screen) => void }) {
  const nav = (
    <div
      className="fixed inset-x-0 bottom-0 z-[2147483647] flex items-center border-t shadow-[0_-8px_24px_rgba(61,43,78,0.08)]"
      style={{
        background: "white",
        borderColor: "rgba(255,132,186,0.15)",
        paddingBottom: "env(safe-area-inset-bottom)",
        transform: "translateZ(0)",
        pointerEvents: "auto",
      }}
    >
      {NAV_TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => go(id as Screen)} className="flex-1 flex flex-col items-center gap-1 py-3 transition-all active:scale-95">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${isActive ? "shadow-sm" : ""}`}
              style={{ background: isActive ? PINK : "transparent" }}>
              <Icon size={18} color={isActive ? "white" : MUTED}/>
            </div>
            <span className="text-xs font-bold" style={{ color: isActive ? PINK : MUTED, ...ff }}>{label}</span>
          </button>
        )
      })}
    </div>
  )

  return createPortal(nav, document.body)
}

// ─── Story Cover Card ─────────────────────────────────────────────────────────
export function StoryCover({ story, onClick, size = "md" }: { story: Story; onClick?: () => void; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-28" : "h-40"
  return (
    <button onClick={onClick} className={`flex flex-col rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-all w-full`}>
      <div className={`${h} w-full flex flex-col items-center justify-center gap-1 relative`} style={{ background: story.coverColor }}>
        <span style={{ fontSize: size === "sm" ? 32 : 40 }}>{story.emoji}</span>
        {story.curated && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.9)", color: story.coverColor, ...ff }}>
            ★ Pick
          </div>
        )}
      </div>
      <div className="bg-white px-3 py-2 text-left">
        <p className="font-bold text-sm truncate" style={{ color: PURPLE, ...ffh }}>{story.title}</p>
        <p className="text-xs" style={{ color: MUTED, ...ff }}>{story.readTime}</p>
      </div>
    </button>
  )
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
export function Ring({ pct, color, size = 60, label }: { pct: number; color: string; size?: number; label: string }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0E0EC" strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct/100)}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill={PURPLE} fontFamily="Nunito, sans-serif">{pct}%</text>
      </svg>
      <span className="text-xs font-semibold text-center" style={{ color: MUTED, ...ff, maxWidth: 60 }}>{label}</span>
    </div>
  )
}

export function ScreenHeader({ title, subtitle, go, backTo = "home" }: { title: string; subtitle?: string; go: (s: Screen) => void; backTo?: Screen }) {
  return (
    <div className="px-5 pt-6 pb-4 grid grid-cols-[44px_1fr_44px] items-center">
      <button
        onClick={() => go(backTo)}
        aria-label="Go back"
        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95"
        style={{ background: "rgba(255,255,255,0.7)", color: MUTED }}
      >
        <ArrowLeft size={20}/>
      </button>
      <div className="min-w-0 text-center px-2">
        <h2 className="text-xl font-bold leading-tight truncate" style={{ color: PURPLE, ...ffh }}>{title}</h2>
        {subtitle && <p className="text-xs leading-tight mt-0.5 truncate" style={{ color: MUTED, ...ff }}>{subtitle}</p>}
      </div>
      <div aria-hidden/>
    </div>
  )
}

export function SettingsRow({ icon: Icon, title, subtitle, color = PINK, onClick }: {
  icon: ComponentType<{ size?: number; style?: CSSProperties }>
  title: string
  subtitle: string
  color?: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-all shadow-sm" style={{ background: "white" }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
        <Icon size={20} style={{ color }}/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>{title}</p>
        <p className="text-xs leading-snug" style={{ color: MUTED, ...ff }}>{subtitle}</p>
      </div>
      <ChevronRight size={16} style={{ color: MUTED }}/>
    </button>
  )
}

export function ToggleLine({ label, desc, enabled = true }: { label: string; desc: string; enabled?: boolean }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "white" }}>
      <div className="flex-1">
        <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>{label}</p>
        <p className="text-xs" style={{ color: MUTED, ...ff }}>{desc}</p>
      </div>
      <div className="w-12 h-7 rounded-full p-1" style={{ background: enabled ? PINK : "#DDD3E3" }}>
        <div className="w-5 h-5 rounded-full bg-white shadow-sm" style={{ marginLeft: enabled ? 20 : 0 }}/>
      </div>
    </div>
  )
}

