import { useState, useEffect, useCallback, useRef } from "react"
import type { ComponentType, CSSProperties } from "react"
import { createPortal } from "react-dom"
import { motion } from "motion/react"
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Plus, Check,
  Home, BookOpen, PenLine, Star, Mic, ChevronRight,
  ChevronLeft, RotateCcw, Volume2, Settings, X,
  Trophy, Flame, BarChart2, Lock, Play, Sparkles,
  Bookmark, Heart, Zap, Bell, User, Shield, HelpCircle,
  Type, WifiOff, Loader2, Trash2, Bot, Send, Camera,
  ImagePlus, Upload,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
} from "recharts"

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
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

interface Profile { id: string; name: string; age: number; avatar: string }
interface Story {
  id: string; title: string; theme: string; pages: string[]
  coverColor: string; readTime: string; createdAt: string; curated?: boolean
  emoji: string
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const PINK   = "#FF84BA"
const YELLOW = "#FFDF82"
const BLUE   = "#99C2FF"
const PEACH  = "#FFEFE3"
const PURPLE = "#3D2B4E"
const MUTED  = "#9B6B8A"
const GREEN  = "#7ECBA1"
const ff     = { fontFamily: "'Nunito', sans-serif" } as const
const ffh    = { fontFamily: "'Fredoka', 'Nunito', sans-serif" } as const

// ─── Mock Data ────────────────────────────────────────────────────────────────
const AVATARS = [
  { id: "owl",     emoji: "🦉", bg: PINK   },
  { id: "cat",     emoji: "🐱", bg: BLUE   },
  { id: "bunny",   emoji: "🐰", bg: YELLOW },
  { id: "bear",    emoji: "🐻", bg: PINK   },
  { id: "fox",     emoji: "🦊", bg: BLUE   },
  { id: "dog",     emoji: "🐶", bg: YELLOW },
  { id: "penguin", emoji: "🐧", bg: PINK   },
  { id: "frog",    emoji: "🐸", bg: BLUE   },
]

const THEMES = [
  { id: "animals",    label: "Animals",    emoji: "🐾", color: PINK   },
  { id: "adventure",  label: "Adventure",  emoji: "🗺️", color: YELLOW },
  { id: "friendship", label: "Friendship", emoji: "💝", color: "#FFB3C6" },
  { id: "magic",      label: "Magic",      emoji: "✨", color: "#C4A8E8" },
  { id: "space",      label: "Space",      emoji: "🚀", color: BLUE   },
  { id: "ocean",      label: "Ocean",      emoji: "🌊", color: "#64B5F6" },
  { id: "forest",     label: "Forest",     emoji: "🌿", color: GREEN  },
  { id: "fantasy",    label: "Fantasy",    emoji: "🦄", color: "#F48FB1" },
]

const AI_SUGGESTIONS: Record<string, string[]> = {
  animals:    ["Once there was a fluffy bunny who…", "Deep in the forest, a friendly bear…", "The little elephant wanted to…"],
  adventure:  ["On a sunny morning, I found a treasure map…", "The brave explorer climbed a tall mountain…", "One day, a mysterious door appeared…"],
  friendship: ["Lily and the tiny fairy became best friends when…", "Tom felt lonely until he met…", "Two friends made a promise to always…"],
  magic:      ["The magic wand glowed bright when…", "In the enchanted forest, flowers could…", "A little wizard discovered a spell that…"],
  space:      ["The small rocket zoomed past the stars…", "On a faraway planet, there lived…", "The brave astronaut discovered…"],
  ocean:      ["Under the deep blue sea, a seahorse…", "The little mermaid found a shiny shell…", "Bubbles the fish swam to the surface and…"],
  forest:     ["The talking tree whispered a secret…", "A tiny acorn grew into…", "Rosie the rabbit found a path through…"],
  fantasy:    ["The purple dragon sneezed and…", "A unicorn with rainbow wings…", "In the kingdom of clouds, the princess…"],
}

const CURATED_STORIES: Story[] = [
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

const INIT_USER_STORIES: Story[] = [
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

const VOCAB_WORDS = [
  { word: "Adventure", phonetic: "/ədˈventʃər/", emoji: "🗺️", hint: "A fun and exciting journey" },
  { word: "Brave",     phonetic: "/breɪv/",       emoji: "🦁", hint: "Not afraid to try new things" },
  { word: "Sparkle",   phonetic: "/ˈspɑːrkəl/",   emoji: "✨", hint: "To shine with tiny lights" },
  { word: "Whisper",   phonetic: "/ˈwɪspər/",     emoji: "🤫", hint: "To speak very softly" },
  { word: "Giggle",    phonetic: "/ˈɡɪɡəl/",      emoji: "😄", hint: "A soft, silly laugh" },
  { word: "Curious",   phonetic: "/ˈkjʊəriəs/",   emoji: "🔍", hint: "Wanting to know things" },
]

const VOCAB_CATEGORIES = [
  { id: "stories", label: "From My Stories", emoji: "📖", color: PINK   },
  { id: "animals", label: "Animals",         emoji: "🐾", color: YELLOW },
  { id: "nature",  label: "Nature",          emoji: "🌿", color: GREEN  },
  { id: "colors",  label: "Colors",          emoji: "🎨", color: BLUE   },
]

const BADGES = [
  { id: "first_story", emoji: "📝", label: "First Story!",   earned: true  },
  { id: "reader",      emoji: "📚", label: "Bookworm",       earned: true  },
  { id: "tracer",      emoji: "✏️", label: "Letter Master",  earned: true  },
  { id: "speaker",     emoji: "🎤", label: "Voice Star",     earned: false },
  { id: "streak3",     emoji: "🔥", label: "3-Day Streak",   earned: true  },
  { id: "perfect",     emoji: "⭐", label: "Perfect Score",  earned: false },
  { id: "explorer",    emoji: "🗺️", label: "Explorer",       earned: false },
  { id: "champion",    emoji: "🏆", label: "Champion",       earned: false },
]

const WEEKLY_DATA = [
  { day: "Mon", stories: 1, tracing: 3, vocab: 2 },
  { day: "Tue", stories: 0, tracing: 5, vocab: 4 },
  { day: "Wed", stories: 2, tracing: 2, vocab: 3 },
  { day: "Thu", stories: 1, tracing: 4, vocab: 5 },
  { day: "Fri", stories: 1, tracing: 6, vocab: 2 },
  { day: "Sat", stories: 2, tracing: 3, vocab: 6 },
  { day: "Sun", stories: 0, tracing: 1, vocab: 1 },
]

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const TRACING_PROGRESS: Record<string, number> = {
  A: 3, B: 3, C: 2, D: 1, E: 3, F: 2, G: 0, H: 0,
  I: 3, J: 1, K: 0, L: 2, M: 0, N: 0, O: 3, P: 2,
  Q: 0, R: 1, S: 0, T: 3, U: 2, V: 0, W: 0, X: 0,
  Y: 1, Z: 0,
}

const WORD_TRACING_TOPICS = [
  { id: "animals", label: "Animals", emoji: "Paw", color: PINK, words: ["cat", "dog", "bird", "fish"] },
  { id: "numbers", label: "Numbers", emoji: "123", color: BLUE, words: ["one", "two", "three", "four"] },
  { id: "days", label: "Days", emoji: "Sun", color: YELLOW, words: ["sun", "mon", "tue", "wed"] },
  { id: "places", label: "Places", emoji: "Home", color: GREEN, words: ["home", "park", "school", "room"] },
]

const WORD_TRACING_PROGRESS: Record<string, number> = {
  cat: 3, dog: 2, bird: 0, fish: 0,
  one: 1, two: 0, three: 0, four: 0,
  sun: 3, mon: 1, tue: 0, wed: 0,
  home: 2, park: 0, school: 0, room: 0,
}

const VOWEL_PRACTICE = [
  { vowel: "A", sound: "a as in apple", emoji: "apple", stars: 3 },
  { vowel: "E", sound: "e as in egg", emoji: "egg", stars: 3 },
  { vowel: "I", sound: "i as in igloo", emoji: "ice", stars: 2 },
  { vowel: "O", sound: "o as in octopus", emoji: "octo", stars: 0 },
  { vowel: "U", sound: "u as in umbrella", emoji: "rain", stars: 0 },
]

const DEMO_PROFILES: Profile[] = [
  { id: "1", name: "Mia", age: 6, avatar: "owl" },
  { id: "2", name: "Leo", age: 5, avatar: "bear" },
]

const STORY_QUESTIONS = [
  { q: "Who is the main character in this story?", opts: ["Fluffball the cat", "A big dog", "A little bird", "A turtle"], correct: 0 },
  { q: "What did Fluffball find one day?", opts: ["A fish", "A big red ball", "A new friend", "A piece of yarn"], correct: 1 },
  { q: "How did Fluffball feel at the end?", opts: ["Sad and tired", "Scared", "Very happy", "Hungry"], correct: 2 },
]

const SLIDES = [
  { title: "Create Magical Stories", desc: "Your child can write their own adventures with friendly AI assistance built for little ones.", accent: PINK, Ill: BookIll },
  { title: "Read & Discover",        desc: "Explore age-appropriate stories that spark imagination and build vocabulary.",              accent: BLUE,  Ill: ReadIll },
  { title: "Grow Every Day",         desc: "Fun activities build reading, writing, and pronunciation skills through guided play.",      accent: "#F5A623", Ill: SkillIll },
]

// ─── SVG Art ──────────────────────────────────────────────────────────────────
function OwlMascot({ size = 120 }: { size?: number }) {
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

function BookIll() {
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

function ReadIll() {
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

function SkillIll() {
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
function Blobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20" style={{ background: PINK }}/>
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-15" style={{ background: BLUE }}/>
      <div className="absolute top-1/2 -right-8 w-24 h-24 rounded-full opacity-10" style={{ background: YELLOW }}/>
    </div>
  )
}

function PrimaryBtn({ children, onClick, color = PINK, textColor = "white", disabled = false, className = "" }: {
  children: React.ReactNode; onClick?: () => void; color?: string; textColor?: string; disabled?: boolean; className?: string
}) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${className}`}
      style={{ background: disabled ? "#D0C8D4" : color, color: textColor, ...ff }}>
      {children}
    </button>
  )
}

function OutlineBtn({ children, onClick, color = PINK }: { children: React.ReactNode; onClick?: () => void; color?: string }) {
  return (
    <button onClick={onClick} className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 border-2 bg-white"
      style={{ borderColor: color, color, ...ff }}>
      {children}
    </button>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 font-semibold transition-all active:scale-95" style={{ color: MUTED, ...ff }}>
      <ArrowLeft size={18}/> Back
    </button>
  )
}

function FormInput({ label, type = "text", value, onChange, placeholder, right }: {
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

function PasswordInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <FormInput label={label} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
      right={<button onClick={() => setShow(!show)} style={{ color: MUTED }}>{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button>}
    />
  )
}

function GoogleBtn({ label, onClick }: { label: string; onClick?: () => void }) {
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

function Divider({ text = "or" }: { text?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "rgba(255,132,186,0.2)" }}/>
      <span className="text-sm font-semibold" style={{ color: MUTED, ...ff }}>{text}</span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,132,186,0.2)" }}/>
    </div>
  )
}

function ScreenLink({ text, action, onClick }: { text: string; action: string; onClick: () => void }) {
  return (
    <p className="text-center text-sm" style={{ color: MUTED, ...ff }}>
      {text} <button onClick={onClick} className="font-bold" style={{ color: PINK }}>{action}</button>
    </p>
  )
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────
const NAV_TABS = [
  { id: "home",        label: "Home",     icon: Home    },
  { id: "storyLibrary",label: "Library",  icon: BookOpen },
  { id: "tracingHome", label: "Practice", icon: PenLine  },
  { id: "myProgress",  label: "Progress", icon: Star     },
] as const

type NavTab = typeof NAV_TABS[number]["id"]

function BottomNav({ active, go }: { active: NavTab; go: (s: Screen) => void }) {
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
function StoryCover({ story, onClick, size = "md" }: { story: Story; onClick?: () => void; size?: "sm" | "md" }) {
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
function Ring({ pct, color, size = 60, label }: { pct: number; color: string; size?: number; label: string }) {
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

function ScreenHeader({ title, subtitle, go, backTo = "home" }: { title: string; subtitle?: string; go: (s: Screen) => void; backTo?: Screen }) {
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

function SettingsRow({ icon: Icon, title, subtitle, color = PINK, onClick }: {
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

function ToggleLine({ label, desc, enabled = true }: { label: string; desc: string; enabled?: boolean }) {
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

// ─── ONBOARDING SCREENS ───────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t) }, [onDone])
  return (
    <div className="flex flex-col items-center justify-center h-full relative" style={{ background: PEACH }}>
      <Blobs/>
      <motion.div animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }} className="relative z-10">
        <OwlMascot size={150}/>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10 text-center mt-4">
        <h1 className="text-4xl font-bold" style={{ color: PINK, ...ffh }}>BrightInk Kids</h1>
        <p className="mt-1 text-base" style={{ color: MUTED, ...ff }}>Where little stories grow big</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex gap-2.5 mt-12 relative z-10">
        {[PINK, YELLOW, BLUE].map((c, i) => (
          <motion.div key={c} className="w-3 h-3 rounded-full" style={{ background: c }}
            animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.22, ease: "easeInOut" }}/>
        ))}
      </motion.div>
    </div>
  )
}

function IntroScreen({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0)
  const { title, desc, accent, Ill } = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="flex justify-end px-5 pt-5">
        <button onClick={onDone} className="text-sm font-bold px-3 py-1.5 rounded-full" style={{ color: MUTED, background: "rgba(255,255,255,0.6)", ...ff }}>Skip</button>
      </div>
      <motion.div key={slide} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
        className="flex-1 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full flex items-center justify-center shadow-sm" style={{ background: "rgba(255,255,255,0.55)" }}>
          <Ill/>
        </div>
      </motion.div>
      <div className="mx-4 mb-6 rounded-3xl p-7 shadow-sm" style={{ background: "white" }}>
        <motion.div key={`t${slide}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: accent, ...ffh }}>{title}</h2>
          <p className="text-center text-sm leading-relaxed" style={{ color: MUTED, ...ff }}>{desc}</p>
        </motion.div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <motion.div key={i} animate={{ width: i === slide ? 24 : 8 }} className="h-2 rounded-full"
                style={{ background: i === slide ? accent : "#E0D8E8" }}/>
            ))}
          </div>
          <button onClick={() => isLast ? onDone() : setSlide(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white text-sm shadow-sm active:scale-95"
            style={{ background: accent, ...ff }}>
            {isLast ? "Get Started" : "Next"} <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  )
}

function AuthChoiceScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full relative" style={{ background: PEACH }}>
      <Blobs/>
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
          <OwlMascot size={130}/>
          <h1 className="text-3xl font-bold mt-3 text-center" style={{ color: PINK, ...ffh }}>BrightInk Kids</h1>
          <p className="mt-1 text-sm text-center" style={{ color: MUTED, ...ff }}>A reading & writing adventure for little ones</p>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="px-6 pb-10 flex flex-col gap-3 relative z-10">
        <div className="rounded-3xl p-6 shadow-sm flex flex-col gap-3" style={{ background: "white" }}>
          <p className="text-center font-bold text-base mb-1" style={{ color: PURPLE, ...ff }}>Parent / Guardian Login</p>
          <PrimaryBtn onClick={() => go("signup")}>Create Account <ArrowRight size={18}/></PrimaryBtn>
          <OutlineBtn onClick={() => go("login")}>I Already Have an Account</OutlineBtn>
          <Divider/>
          <GoogleBtn label="Continue with Google"/>
        </div>
        <p className="text-xs text-center px-4" style={{ color: MUTED, ...ff }}>BrightInk Kids collects no personal data from children.</p>
      </motion.div>
    </div>
  )
}

function SignUpScreen({ go }: { go: (s: Screen) => void }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState("")
  const [pass, setPass] = useState(""); const [confirm, setConfirm] = useState("")
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: PEACH }}>
      <div className="px-6 pt-6 pb-2 flex"><BackBtn onClick={() => go("authChoice")}/></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="px-6 pb-10">
        <div className="mb-6"><h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Create Account</h2>
          <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>Set up your parent account to get started</p></div>
        <div className="rounded-3xl p-6 shadow-sm flex flex-col gap-4" style={{ background: "white" }}>
          <FormInput label="Full Name" value={name} onChange={setName} placeholder="Your full name"/>
          <FormInput label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com"/>
          <PasswordInput label="Password" value={pass} onChange={setPass} placeholder="At least 8 characters"/>
          <PasswordInput label="Confirm Password" value={confirm} onChange={setConfirm} placeholder="Repeat your password"/>
          <PrimaryBtn onClick={() => go("createProfile")} disabled={!name || !email || !pass || pass !== confirm}>
            Create Account <ArrowRight size={18}/></PrimaryBtn>
          <Divider/><GoogleBtn label="Sign up with Google"/>
        </div>
        <div className="mt-5"><ScreenLink text="Already have an account?" action="Log In" onClick={() => go("login")}/></div>
      </motion.div>
    </div>
  )
}

function LoginScreen({ go }: { go: (s: Screen) => void }) {
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

function ForgotPasswordScreen({ go }: { go: (s: Screen) => void }) {
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

function ResetPasswordScreen({ go }: { go: (s: Screen) => void }) {
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

function CreateProfileScreen({ go, onAdd }: { go: (s: Screen) => void; onAdd: (p: Profile) => void }) {
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

function ProfileSelectorScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string|null>(profiles[0]?.id ?? null)
  const getAv = (id: string) => AVATARS.find(a => a.id === id) ?? AVATARS[0]
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="px-6 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <OwlMascot size={56}/>
          <div><h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>Who's Reading Today?</h2>
            <p className="text-sm" style={{ color: MUTED, ...ff }}>Choose a profile to continue</p></div>
        </div>
      </motion.div>
      <div className="flex-1 px-6 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-col gap-3 pb-4">
          {profiles.map((p, i) => {
            const av = getAv(p.avatar); const isSelected = selected === p.id
            return (
              <motion.button key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(p.id)}
                className="flex items-center gap-4 p-4 rounded-3xl border-2 transition-all active:scale-[0.98] text-left w-full"
                style={{ background: isSelected ? "#FFF0F8" : "white", borderColor: isSelected ? PINK : "rgba(255,132,186,0.2)", boxShadow: isSelected ? `0 4px 16px ${PINK}30` : "none" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: av.bg }}>{av.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-lg" style={{ color: PURPLE, ...ffh }}>{p.name}</p>
                  <p className="text-sm" style={{ color: MUTED, ...ff }}>Age {p.age} · BrightInk Reader</p>
                  <div className="flex gap-1 mt-1.5">{[0,1,2].map(s => <div key={s} className="w-5 h-1.5 rounded-full" style={{ background: s<2 ? PINK : "#E0D8E8" }}/>)}</div>
                </div>
                {isSelected && <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: PINK }}><Check size={14} color="white" strokeWidth={3}/></div>}
              </motion.button>
            )
          })}
          <button onClick={() => go("createProfile")}
            className="flex items-center gap-4 p-4 rounded-3xl border-2 border-dashed transition-all active:scale-[0.98] w-full"
            style={{ borderColor: "rgba(255,132,186,0.35)", background: "rgba(255,255,255,0.6)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${PINK}20` }}><Plus size={28} style={{ color: PINK }}/></div>
            <div><p className="font-bold text-base" style={{ color: PINK, ...ff }}>Add Another Child</p>
              <p className="text-sm" style={{ color: MUTED, ...ff }}>Create a new profile</p></div>
          </button>
        </motion.div>
      </div>
      <div className="px-6 pb-10 pt-4">
        <PrimaryBtn onClick={() => go("home")} disabled={!selected}>Start Reading! <ArrowRight size={18}/></PrimaryBtn>
        <p className="text-xs text-center mt-3" style={{ color: MUTED, ...ff }}>Manage profiles anytime in Parent Settings</p>
      </div>
    </div>
  )
}

// ─── HOME DASHBOARD ───────────────────────────────────────────────────────────
function HomeScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const child = profiles[0] ?? { name: "Friend", avatar: "owl", age: 6 }
  const av = AVATARS.find(a => a.id === child.avatar) ?? AVATARS[0]
  const actions = [
    { label: "Create\nStory",   emoji: "✏️", color: PINK,   screen: "storyTheme" as Screen,   bg: `${PINK}18`   },
    { label: "Read\nStories",   emoji: "📚", color: BLUE,   screen: "storyLibrary" as Screen,  bg: `${BLUE}22`   },
    { label: "Practice",        emoji: "🔤", color: "#C4A8E8", screen: "tracingHome" as Screen, bg: "#C4A8E820"   },
    { label: "My\nLibrary",     emoji: "⭐", color: YELLOW, screen: "storyLibrary" as Screen,  bg: `${YELLOW}30` },
  ]
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: av.bg }}>{av.emoji}</div>
          <div>
            <p className="text-xs font-semibold" style={{ color: MUTED, ...ff }}>Good morning! 👋</p>
            <h2 className="text-xl font-bold" style={{ color: PURPLE, ...ffh }}>Hi, {child.name}!</h2>
          </div>
        </div>
        <button onClick={() => go("settingsHome")} className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "white" }}>
          <Settings size={18} style={{ color: MUTED }}/>
        </button>
      </div>

      {/* Streak banner */}
      <div className="mx-5 mb-4 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "white" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${YELLOW}40` }}>
          <Flame size={20} style={{ color: "#F5A623" }}/>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>3-Day Streak! Keep going! 🔥</p>
          <p className="text-xs" style={{ color: MUTED, ...ff }}>You're on a roll, {child.name}!</p>
        </div>
        <div className="flex gap-1">{[0,1,2,3,4].map(i=><div key={i} className="w-2 h-2 rounded-full" style={{ background: i<3 ? YELLOW : "#E0D8E8" }}/>)}</div>
      </div>

      {/* 4 action cards */}
      <div className="px-5 grid grid-cols-2 gap-3 flex-1">
        {actions.map(a => (
          <motion.button key={a.label} onClick={() => go(a.screen)} whileTap={{ scale: 0.95 }}
            className="rounded-3xl flex flex-col items-center justify-center gap-2 py-5 shadow-sm"
            style={{ background: a.bg, border: `2px solid ${a.color}18` }}>
            <span style={{ fontSize: 40 }}>{a.emoji}</span>
            <p className="font-bold text-sm text-center leading-tight" style={{ color: a.color, ...ffh, whiteSpace: "pre-line" }}>{a.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Recent */}
      <div className="px-5 py-4">
        <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Continue Reading</p>
        <button onClick={() => go("storyDetail")} className="w-full rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] transition-all" style={{ background: "white" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${YELLOW}60` }}>🐱</div>
          <div className="flex-1 text-left">
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>My Cat Fluffball</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "#F0E0EC" }}>
                <div className="h-full rounded-full" style={{ width: "60%", background: PINK }}/>
              </div>
              <span className="text-xs" style={{ color: MUTED, ...ff }}>60%</span>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: MUTED }}/>
        </button>
      </div>

      <BottomNav active="home" go={go}/>
    </div>
  )
}

// ─── PROFILE SWITCH ───────────────────────────────────────────────────────────
function ProfileSwitchScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const [pinInput, setPinInput] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const getAv = (id: string) => AVATARS.find(a => a.id === id) ?? AVATARS[0]
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-6 pt-6 pb-2 flex"><BackBtn onClick={() => go("home")}/></div>
      {!unlocked ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-sm" style={{ background: "white" }}>
            <Lock size={32} style={{ color: PINK }}/>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: PURPLE, ...ffh }}>Parent Check</h2>
          <p className="text-sm text-center mb-8" style={{ color: MUTED, ...ff }}>Enter your 4-digit PIN to switch profiles</p>
          <div className="flex gap-3 mb-8">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold border-2"
                style={{ borderColor: pinInput.length > i ? PINK : "rgba(255,132,186,0.3)", background: "white", color: PURPLE }}>
                {pinInput.length > i ? "●" : ""}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k, i) => (
              <button key={i} onClick={() => {
                if (k === "⌫") setPinInput(p => p.slice(0,-1))
                else if (k !== "" && pinInput.length < 4) {
                  const next = pinInput + k
                  setPinInput(next)
                  if (next.length === 4) setTimeout(() => setUnlocked(true), 300)
                }
              }}
                className={`h-14 rounded-2xl text-xl font-bold transition-all active:scale-95 ${k === "" ? "invisible" : ""}`}
                style={{ background: "white", color: PURPLE, ...ffh }}>
                {k}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: PURPLE, ...ffh }}>Switch Profile</h2>
          <div className="flex flex-col gap-3">
            {profiles.map(p => {
              const av = getAv(p.avatar)
              return (
                <button key={p.id} onClick={() => go("home")}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-white shadow-sm active:scale-[0.98] transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: av.bg }}>{av.emoji}</div>
                  <div className="flex-1 text-left">
                    <p className="font-bold" style={{ color: PURPLE, ...ffh }}>{p.name}</p>
                    <p className="text-sm" style={{ color: MUTED, ...ff }}>Age {p.age}</p>
                  </div>
                  <ChevronRight size={18} style={{ color: MUTED }}/>
                </button>
              )
            })}
            <button onClick={() => go("createProfile")}
              className="flex items-center gap-4 p-4 rounded-3xl border-2 border-dashed active:scale-[0.98]"
              style={{ borderColor: "rgba(255,132,186,0.35)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${PINK}18` }}><Plus size={24} style={{ color: PINK }}/></div>
              <p className="font-bold" style={{ color: PINK, ...ff }}>Add New Child</p>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── STORY CREATION ───────────────────────────────────────────────────────────
function StoryThemeScreen({ go, setTheme }: { go: (s: Screen) => void; setTheme: (t: string) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2 flex"><BackBtn onClick={() => go("home")}/></div>
      <div className="px-5 mb-4">
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Pick a Theme</h2>
        <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>What will your story be about?</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map(t => (
            <motion.button key={t.id} whileTap={{ scale: 0.95 }}
              onClick={() => { setTheme(t.id); go("storyTitle") }}
              className="rounded-3xl p-5 flex flex-col items-center gap-2 shadow-sm active:scale-95"
              style={{ background: "white", border: `2px solid ${t.color}30` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${t.color}25` }}>{t.emoji}</div>
              <p className="font-bold text-base" style={{ color: PURPLE, ...ffh }}>{t.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StoryTitleScreen({ go, theme, title, onTitleChange }: { go: (s: Screen) => void; theme: string; title: string; onTitleChange: (title: string) => void }) {
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

function StoryWritingScreen({ go, theme, title, pages, onPagesChange }: {
  go: (s: Screen) => void
  theme: string
  title: string
  pages: string[]
  onPagesChange: (pages: string[]) => void
}) {
  const [text, setText] = useState("")
  const [activeSugg, setActiveSugg] = useState<string|null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [picturePromptOpen, setPicturePromptOpen] = useState(false)
  const [photoPanel, setPhotoPanel] = useState<string|null>(null)
  const uploadInputRef = useRef<HTMLInputElement|null>(null)
  const cameraInputRef = useRef<HTMLInputElement|null>(null)
  const [chatMessages, setChatMessages] = useState([
    { from: "bot" as const, text: "Hi! I can help you think of what happens next." },
  ])
  const t = THEMES.find(x => x.id === theme) ?? THEMES[0]
  const suggestions = AI_SUGGESTIONS[theme] ?? AI_SUGGESTIONS.animals
  const askBot = (prompt: string) => {
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt) return
    const idea = theme === "fantasy"
      ? "Maybe your character finds a glowing map and follows it to a friendly castle."
      : theme === "friendship"
        ? "Maybe two friends solve a problem by listening and helping each other."
        : "Maybe your character discovers a small surprise and chooses to be brave."
    setChatMessages(prev => [
      ...prev,
      { from: "kid", text: cleanPrompt },
      { from: "bot", text: idea },
    ])
    setChatInput("")
  }
  const addBotIdeaToStory = () => {
    const lastBotIdea = [...chatMessages].reverse().find(m => m.from === "bot")?.text
    if (lastBotIdea) setText(prev => prev ? `${prev} ${lastBotIdea}` : lastBotIdea)
  }
  const handlePhotoPick = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoPanel(typeof reader.result === "string" ? reader.result : null)
    reader.readAsDataURL(file)
  }
  const addPhotoPrompt = () => {
    const prompt = "In my picture, I see something special. It gave me a new idea."
    setText(prev => prev ? `${prev} ${prompt}` : prompt)
  }
  const currentPageNumber = pages.length + 1
  const commitPage = () => {
    const cleanText = text.trim()
    if (!cleanText) return pages
    const nextPages = [...pages, cleanText]
    onPagesChange(nextPages)
    return nextPages
  }
  const writeAnotherPage = () => {
    commitPage()
    setText("")
    setActiveSugg(null)
    setPhotoPanel(null)
    setPicturePromptOpen(false)
  }
  const checkStory = () => {
    commitPage()
    setPicturePromptOpen(false)
    go("storyFeedback")
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: PEACH }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <BackBtn onClick={() => go("storyTitle")}/>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${t.color}20` }}>
          <span>{t.emoji}</span>
          <span className="text-sm font-bold" style={{ color: t.color, ...ff }}>{t.label}</span>
        </div>
      </div>

      <div className="px-5 mb-3">
        <h2 className="text-xl font-bold" style={{ color: PURPLE, ...ffh }}>{title || "Write Your Story"}</h2>
        <p className="text-xs" style={{ color: MUTED, ...ff }}>Page {currentPageNumber}. Tap an idea or write your own words.</p>
      </div>

      {/* AI suggestion chips */}
      <div className="px-5 mb-3 flex flex-col gap-2">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => { setText(prev => prev ? prev + " " + s : s); setActiveSugg(s) }}
            className="flex items-start gap-2 px-4 py-3 rounded-2xl text-left transition-all active:scale-[0.98]"
            style={{ background: activeSugg===s ? `${t.color}25` : "white", border: `1.5px solid ${activeSugg===s ? t.color : "rgba(255,132,186,0.2)"}` }}>
            <Sparkles size={14} style={{ color: t.color, flexShrink: 0, marginTop: 2 }}/>
            <span className="text-sm leading-snug" style={{ color: PURPLE, ...ff }}>{s}</span>
          </button>
        ))}
      </div>

      {/* Text area */}
      <div className="flex-1 px-5 flex flex-col">
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="Start writing your story here…"
          className="flex-1 w-full p-4 rounded-2xl border-2 outline-none resize-none text-base leading-relaxed"
          style={{ borderColor: "rgba(255,132,186,0.3)", background: "white", color: PURPLE, fontFamily: "'Nunito', sans-serif", minHeight: 140 }}
          onFocus={e => { e.currentTarget.style.borderColor = t.color }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,132,186,0.3)" }}
        />
        <p className="text-xs text-right mt-1 mb-3" style={{ color: MUTED, ...ff }}>{text.split(" ").filter(Boolean).length} words</p>
      </div>

      <div className="px-5 pb-6 flex flex-col gap-2">
        <PrimaryBtn onClick={() => setPicturePromptOpen(true)} color={t.color} disabled={text.trim().length < 10}>
          I Finished This Page <ArrowRight size={18}/>
        </PrimaryBtn>
        {pages.length > 0 && <p className="text-xs text-center" style={{ color: MUTED, ...ff }}>{pages.length} page{pages.length > 1 ? "s" : ""} saved so far</p>}
      </div>

      <motion.button
        onClick={() => setChatOpen(true)}
        whileTap={{ scale: 0.94 }}
        className="absolute right-5 bottom-24 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg opacity-55 hover:opacity-100 focus-visible:opacity-100 active:opacity-100 transition-opacity"
        style={{ background: PINK, color: "white" }}
        aria-label="Open AI writing helper"
      >
        <Bot size={26}/>
      </motion.button>

      {chatOpen && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end" style={{ background: "rgba(61,43,78,0.18)" }}>
          <motion.div initial={{ y: 260 }} animate={{ y: 0 }} className="mx-4 mb-4 rounded-3xl shadow-xl overflow-hidden" style={{ background: PEACH }}>
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: "white" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${PINK}20` }}>
                <Bot size={20} style={{ color: PINK }}/>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>BrightInk Buddy</p>
                <p className="text-xs" style={{ color: MUTED, ...ff }}>Ask for a story idea</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${PINK}12` }}>
                <X size={18} style={{ color: MUTED }}/>
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto px-4 py-3 flex flex-col gap-2">
              {chatMessages.map((m, i) => (
                <div key={i} className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-snug ${m.from === "kid" ? "self-end" : "self-start"}`}
                  style={{ background: m.from === "kid" ? PINK : "white", color: m.from === "kid" ? "white" : PURPLE, ...ff }}>
                  {m.text}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {["What happens next?", "Add a funny twist"].map(q => (
                  <button key={q} onClick={() => askBot(q)} className="rounded-2xl px-3 py-2 text-xs font-bold text-left" style={{ background: "white", color: PINK, ...ff }}>
                    {q}
                  </button>
                ))}
              </div>
              <button onClick={addBotIdeaToStory} className="rounded-2xl px-3 py-2 text-xs font-bold" style={{ background: `${BLUE}25`, color: BLUE, ...ff }}>
                Add last idea to my story
              </button>
            </div>

            <div className="p-3 flex items-center gap-2" style={{ background: "white" }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") askBot(chatInput) }}
                placeholder="Ask for help..."
                className="flex-1 rounded-2xl px-3 py-3 outline-none text-sm"
                style={{ background: PEACH, color: PURPLE, ...ff }}
              />
              <button onClick={() => askBot(chatInput)} className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: PINK }}>
                <Send size={18} color="white"/>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {picturePromptOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-5" style={{ background: "rgba(61,43,78,0.22)" }}>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-3xl p-5 shadow-xl" style={{ background: PEACH }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${PINK}18` }}>
                <ImagePlus size={24} style={{ color: PINK }}/>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold" style={{ color: PURPLE, ...ffh }}>Add a picture?</h3>
                <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>Would you like to add a photo for this page?</p>
              </div>
            </div>

            {photoPanel ? (
              <div className="relative overflow-hidden rounded-2xl mb-3">
                <img src={photoPanel} alt="Story page picture" className="w-full h-40 object-cover"/>
                <button onClick={() => setPhotoPanel(null)} className="absolute top-2 right-2 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)" }}>
                  <X size={16} style={{ color: MUTED }}/>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button onClick={() => uploadInputRef.current?.click()} className="rounded-2xl py-3 flex items-center justify-center gap-2 font-bold text-sm" style={{ background: `${BLUE}20`, color: BLUE, ...ff }}>
                  <Upload size={16}/> Upload
                </button>
                <button onClick={() => cameraInputRef.current?.click()} className="rounded-2xl py-3 flex items-center justify-center gap-2 font-bold text-sm" style={{ background: `${PINK}18`, color: PINK, ...ff }}>
                  <Camera size={16}/> Camera
                </button>
              </div>
            )}

            <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={e => handlePhotoPick(e.target.files?.[0])}/>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handlePhotoPick(e.target.files?.[0])}/>

            <div className="flex flex-col gap-2">
              {photoPanel && (
                <button onClick={addPhotoPrompt} className="w-full rounded-2xl py-3 font-bold text-sm" style={{ background: `${YELLOW}45`, color: PURPLE, ...ff }}>
                  Use picture for an idea
                </button>
              )}
              <PrimaryBtn onClick={checkStory} color={t.color}>Check My Story</PrimaryBtn>
              <OutlineBtn onClick={writeAnotherPage} color={BLUE}>Write Another Page</OutlineBtn>
              <button onClick={() => setPicturePromptOpen(false)} className="w-full py-2 text-sm font-bold" style={{ color: MUTED, ...ff }}>Keep Writing</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function StoryFeedbackScreen({ go, theme, title, pages, onSave }: {
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

function LegacyStorySaveScreen({ go, theme, onSave }: { go: (s: Screen) => void; theme: string; onSave: (s: Story) => void }) {
  const [title, setTitle] = useState("")
  const [coverColor, setCoverColor] = useState(PINK)
  const t = THEMES.find(x => x.id === theme) ?? THEMES[0]
  const colors = [PINK, BLUE, YELLOW, GREEN, "#C4A8E8", "#F48FB1", "#64B5F6", "#FFB347"]
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: PEACH }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-3"><BackBtn onClick={() => go("storyFeedback")}/></div>
      <div className="px-5 mb-4">
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Name Your Story</h2>
        <p className="text-sm mt-1" style={{ color: MUTED, ...ff }}>Give your masterpiece a great title!</p>
      </div>

      {/* Cover preview */}
      <div className="mx-5 mb-4 h-44 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-sm transition-all"
        style={{ background: coverColor }}>
        <span style={{ fontSize: 48 }}>{t.emoji}</span>
        <p className="font-bold text-lg text-white text-center px-4" style={{ ...ffh, textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
          {title || "My Amazing Story"}
        </p>
        <p className="text-white text-xs opacity-80" style={ff}>Written by Mia · {new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <FormInput label="Story Title" value={title} onChange={setTitle} placeholder="e.g. My Brave Adventure"/>
        <div>
          <label className="text-sm font-bold block mb-2" style={{ color: PURPLE, ...ff }}>Cover Color</label>
          <div className="flex gap-2.5 flex-wrap">
            {colors.map(c => (
              <button key={c} onClick={() => setCoverColor(c)}
                className="w-10 h-10 rounded-full transition-all active:scale-95"
                style={{ background: c, outline: coverColor===c ? `3px solid ${PURPLE}` : "none", outlineOffset: 2 }}/>
            ))}
          </div>
        </div>
        <PrimaryBtn color={t.color} disabled={!title.trim()} onClick={() => {
          onSave({ id: Date.now().toString(), title: title.trim(), theme, emoji: t.emoji, coverColor, readTime: "2 min", createdAt: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
            pages: ["Once upon a time…", "The adventure began on a sunny morning.", "And they all lived happily ever after."] })
          go("storySaved")
        }}>
          Save Story 🎉
        </PrimaryBtn>
      </div>
    </div>
  )
}

function StorySavedScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ background: PEACH }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
        <div className="w-36 h-36 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto" style={{ background: "white" }}>
          <span style={{ fontSize: 72 }}>🎉</span>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-3xl font-bold mb-2" style={{ color: PINK, ...ffh }}>Story Saved!</h2>
        <p className="text-base mb-2" style={{ color: PURPLE, ...ff }}>Amazing work, Mia! 🌟</p>
        <p className="text-sm mb-6" style={{ color: MUTED, ...ff }}>Your story is now in your library for everyone to enjoy.</p>

        {/* Badge */}
        <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-2xl mb-8 mx-auto max-w-xs" style={{ background: `${YELLOW}40`, border: `2px solid ${YELLOW}` }}>
          <span style={{ fontSize: 28 }}>🏅</span>
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>Badge Earned!</p>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Story Creator — Keep writing!</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <PrimaryBtn onClick={() => go("storyLibrary")}>Read It Now <BookOpen size={18}/></PrimaryBtn>
          <OutlineBtn onClick={() => go("home")}>Back to Home</OutlineBtn>
        </div>
      </motion.div>

      {/* Confetti dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i} className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{ background: [PINK,YELLOW,BLUE,GREEN][i%4], left: `${10+i*7}%`, top: "5%" }}
          animate={{ y: [0, 300+Math.random()*200], opacity: [1, 0], rotate: Math.random()*360 }}
          transition={{ duration: 1.5+Math.random(), delay: Math.random()*0.5, ease: "easeIn" }}/>
      ))}
    </div>
  )
}

// ─── READING ──────────────────────────────────────────────────────────────────
function StoryLibraryScreen({ stories, go, setCurrentStory }: { stories: Story[]; go: (s: Screen) => void; setCurrentStory: (s: Story) => void }) {
  const [tab, setTab] = useState<"mine"|"curated">("mine")
  const [view, setView] = useState<"grid"|"list">("grid")
  const displayStories = tab === "mine" ? stories.filter(s => !s.curated) : CURATED_STORIES

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Bookshelf 📚</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED, ...ff }}>Your stories and favourite reads</p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-3 flex gap-2">
        {(["mine","curated"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-full font-bold text-sm transition-all"
            style={{ background: tab===t ? PINK : "white", color: tab===t ? "white" : MUTED, ...ff }}>
            {t === "mine" ? "My Stories" : "★ Curated"}
          </button>
        ))}
        <div className="ml-auto flex rounded-full p-1" style={{ background: "white" }}>
          {(["grid","list"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: view === v ? BLUE : "transparent", color: view === v ? "white" : MUTED, ...ff }}>
              {v === "grid" ? "Grid" : "List"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {displayStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <span style={{ fontSize: 56 }}>📝</span>
            <p className="font-bold text-lg" style={{ color: PURPLE, ...ffh }}>No stories yet!</p>
            <p className="text-sm text-center" style={{ color: MUTED, ...ff }}>Tap "Create Story" on the home screen to write your first one.</p>
            <PrimaryBtn onClick={() => go("storyTheme")} className="!w-auto px-6">Write a Story <ArrowRight size={18}/></PrimaryBtn>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {displayStories.map(s => (
              <StoryCover key={s.id} story={s} onClick={() => { setCurrentStory(s); go("storyDetail") }}/>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {displayStories.map(s => (
              <button key={s.id} onClick={() => { setCurrentStory(s); go("storyDetail") }}
                className="rounded-2xl p-3 flex items-center gap-3 text-left shadow-sm active:scale-[0.98] transition-all" style={{ background: "white" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: s.coverColor }}>{s.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate" style={{ color: PURPLE, ...ffh }}>{s.title}</p>
                  <p className="text-xs" style={{ color: MUTED, ...ff }}>{s.readTime} · {s.curated ? "Curated" : "My story"}</p>
                </div>
                <ChevronRight size={16} style={{ color: MUTED }}/>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="storyLibrary" go={go}/>
    </div>
  )
}

function StoryDetailScreen({ story, go }: { story: Story|null; go: (s: Screen) => void }) {
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

function StoryReadingScreen({ story, go }: { story: Story|null; go: (s: Screen) => void }) {
  const s = story ?? CURATED_STORIES[0]
  const [page, setPage] = useState(0)
  const isLast = page === s.pages.length - 1
  const pct = Math.round(((page + 1) / s.pages.length) * 100)

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <BackBtn onClick={() => go("storyDetail")}/>
        <p className="text-sm font-bold" style={{ color: MUTED, ...ff }}>Page {page+1} of {s.pages.length}</p>
        <div/>
      </div>

      {/* Progress bar */}
      <div className="mx-5 mb-4 h-2 rounded-full" style={{ background: "#F0E0EC" }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${pct}%` }} style={{ background: s.coverColor }}/>
      </div>

      {/* Illustration area */}
      <div className="mx-5 mb-4 h-44 rounded-3xl flex items-center justify-center shadow-sm" style={{ background: `${s.coverColor}20` }}>
        <span style={{ fontSize: 80 }}>{s.emoji}</span>
      </div>

      {/* Text */}
      <motion.div key={page} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="flex-1 mx-5 rounded-3xl p-5 shadow-sm flex items-center" style={{ background: "white" }}>
        <p className="text-lg leading-relaxed text-center" style={{ color: PURPLE, ...ffh }}>{s.pages[page]}</p>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0}
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm disabled:opacity-30"
          style={{ background: "white" }}>
          <ChevronLeft size={22} style={{ color: PURPLE }}/>
        </button>

        <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: `${s.coverColor}20` }}>
          <Volume2 size={16} style={{ color: s.coverColor }}/>
          <span className="text-sm font-bold" style={{ color: s.coverColor, ...ff }}>Read aloud</span>
        </button>

        <button onClick={() => isLast ? go("activityIntro") : setPage(p => p+1)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ background: isLast ? s.coverColor : "white" }}>
          <ChevronRight size={22} style={{ color: isLast ? "white" : PURPLE }}/>
        </button>
      </div>
    </div>
  )
}

// ─── LETTER TRACING ───────────────────────────────────────────────────────────
function LegacyTracingHomeScreen({ go, setTracingLetter }: { go: (s: Screen) => void; setTracingLetter: (l: string) => void }) {
  const [mode, setMode] = useState<"upper"|"lower">("upper")
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Letter Tracing ✏️</h2>
        <p className="text-sm mt-0.5 mb-3" style={{ color: MUTED, ...ff }}>Tap a letter to start practising!</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="rounded-3xl p-4 text-left shadow-sm active:scale-[0.98] transition-all" style={{ background: `${BLUE}22`, border: `2px solid ${BLUE}30` }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: "white" }}>
              <PenLine size={22} style={{ color: BLUE }}/>
            </div>
            <p className="font-bold text-base" style={{ color: PURPLE, ...ffh }}>Letter Tracing</p>
            <p className="text-xs mt-1" style={{ color: MUTED, ...ff }}>Trace A-Z with stroke cues.</p>
          </button>
          <button onClick={() => go("vocabHome")} className="rounded-3xl p-4 text-left shadow-sm active:scale-[0.98] transition-all" style={{ background: `${PINK}18`, border: `2px solid ${PINK}30` }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: "white" }}>
              <Mic size={22} style={{ color: PINK }}/>
            </div>
            <p className="font-bold text-base" style={{ color: PURPLE, ...ffh }}>Vocabulary</p>
            <p className="text-xs mt-1" style={{ color: MUTED, ...ff }}>Speak words and get feedback.</p>
          </button>
        </div>
        <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Choose a letter</p>
        <div className="flex gap-2">
          {(["upper","lower"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-full font-bold text-sm"
              style={{ background: mode===m ? BLUE : "white", color: mode===m ? "white" : MUTED, ...ff }}>
              {m==="upper" ? "Uppercase" : "Lowercase"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="grid grid-cols-5 gap-2.5">
          {ALPHABET.map(letter => {
            const prog = TRACING_PROGRESS[letter] ?? 0
            return (
              <button key={letter} onClick={() => { setTracingLetter(mode==="upper" ? letter : letter.toLowerCase()); go("tracingLetter") }}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 shadow-sm"
                style={{ background: prog===3 ? `${GREEN}30` : prog>0 ? `${BLUE}20` : "white", border: `2px solid ${prog===3 ? GREEN : prog>0 ? BLUE : "rgba(255,132,186,0.2)"}` }}>
                <span className="text-xl font-bold" style={{ color: PURPLE, ...ffh }}>{mode==="upper" ? letter : letter.toLowerCase()}</span>
                <div className="flex gap-0.5">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i<prog ? (prog===3 ? GREEN : BLUE) : "#E0D8E8" }}/>)}</div>
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav active="tracingHome" go={go}/>
    </div>
  )
}

function TracingHomeScreen({ go, setTracingLetter, setTracingLevel }: {
  go: (s: Screen) => void
  setTracingLetter: (l: string) => void
  setTracingLevel: (level: 1|2|3) => void
}) {
  const [mode, setMode] = useState<"letters"|"words">("letters")
  const [caseMode, setCaseMode] = useState<"upper"|"lower">("upper")
  const [topic, setTopic] = useState(WORD_TRACING_TOPICS[0].id)
  const currentTopic = WORD_TRACING_TOPICS.find(t => t.id === topic) ?? WORD_TRACING_TOPICS[0]
  const totalStars = ALPHABET.reduce((sum, letter) => sum + Math.min(TRACING_PROGRESS[letter] ?? 0, 3), 0)

  const startTrace = (item: string, stars: number) => {
    setTracingLevel(Math.min(stars + 1, 3) as 1|2|3)
    setTracingLetter(item)
    go("tracingLetter")
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Practice Quest</h2>
            <p className="text-sm mt-0.5" style={{ color: MUTED, ...ff }}>Win stars to open new steps.</p>
          </div>
          <div className="px-3 py-2 rounded-2xl text-center shadow-sm" style={{ background: "white" }}>
            <div className="flex items-center gap-1 justify-center"><Star size={16} fill={YELLOW} stroke={YELLOW}/><span className="font-bold" style={{ color: PURPLE, ...ffh }}>{totalStars}</span></div>
            <p className="text-[10px] font-bold" style={{ color: MUTED, ...ff }}>stars</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { id: "letters" as const, label: "Letters", icon: PenLine, color: BLUE },
            { id: "words" as const, label: "Words", icon: Type, color: GREEN },
            { id: "voice" as const, label: "Voice", icon: Mic, color: PINK },
          ].map(tab => {
            const Icon = tab.icon
            const active = mode === tab.id
            return (
              <button key={tab.id} onClick={() => tab.id === "voice" ? go("vocabHome") : setMode(tab.id)}
                className="rounded-2xl p-3 flex flex-col items-center gap-1 font-bold text-sm shadow-sm active:scale-[0.98]"
                style={{ background: active ? tab.color : "white", color: active ? "white" : MUTED, ...ff }}>
                <Icon size={18}/>
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {mode === "letters" && (
          <>
            <div className="rounded-3xl p-4 mb-4 shadow-sm" style={{ background: "white" }}>
              <p className="font-bold mb-2" style={{ color: PURPLE, ...ffh }}>3 levels for each letter</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[["1", "Watch"], ["2", "Guide"], ["3", "No guide"]].map(([n, label]) => (
                  <div key={n} className="rounded-2xl p-2" style={{ background: `${BLUE}16` }}>
                    <p className="font-bold" style={{ color: BLUE, ...ffh }}>Level {n}</p>
                    <p className="text-[10px]" style={{ color: MUTED, ...ff }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold" style={{ color: MUTED, ...ff }}>Choose a letter</p>
              <div className="flex gap-2">
                {(["upper","lower"] as const).map(m => (
                  <button key={m} onClick={() => setCaseMode(m)}
                    className="px-3 py-1.5 rounded-full font-bold text-xs"
                    style={{ background: caseMode===m ? BLUE : "white", color: caseMode===m ? "white" : MUTED, ...ff }}>
                    {m==="upper" ? "ABC" : "abc"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {ALPHABET.map((letter, index) => {
                const prog = TRACING_PROGRESS[letter] ?? 0
                const unlocked = index === 0 || (TRACING_PROGRESS[ALPHABET[index - 1]] ?? 0) >= 3
                const display = caseMode === "upper" ? letter : letter.toLowerCase()
                return (
                  <button key={letter} disabled={!unlocked} onClick={() => startTrace(display, prog)}
                    className="relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-sm disabled:active:scale-100"
                    style={{ background: unlocked ? (prog===3 ? `${GREEN}30` : prog>0 ? `${BLUE}20` : "white") : "#F1E8F0", border: `2px solid ${prog===3 ? GREEN : prog>0 ? BLUE : "rgba(255,132,186,0.2)"}`, opacity: unlocked ? 1 : 0.72 }}>
                    {!unlocked && <Lock size={16} className="absolute top-2 right-2" style={{ color: MUTED }}/>}
                    <span className="text-xl font-bold" style={{ color: unlocked ? PURPLE : MUTED, ...ffh }}>{display}</span>
                    <div className="flex gap-0.5">{[0,1,2].map(i=><Star key={i} size={10} fill={i<prog ? YELLOW : "none"} stroke={i<prog ? YELLOW : "#D0C8D4"}/>)}</div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {mode === "words" && (
          <>
            <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Pick a topic first</p>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {WORD_TRACING_TOPICS.map(t => (
                <button key={t.id} onClick={() => setTopic(t.id)}
                  className="rounded-2xl p-3 text-left shadow-sm active:scale-[0.98]"
                  style={{ background: topic === t.id ? `${t.color}28` : "white", border: `2px solid ${topic === t.id ? t.color : "transparent"}` }}>
                  <p className="font-bold" style={{ color: PURPLE, ...ffh }}>{t.emoji}</p>
                  <p className="text-sm font-bold" style={{ color: PURPLE, ...ff }}>{t.label}</p>
                </button>
              ))}
            </div>

            <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Trace a word</p>
            <div className="grid grid-cols-2 gap-3">
              {currentTopic.words.map((word, index) => {
                const prog = WORD_TRACING_PROGRESS[word] ?? 0
                const prevWord = currentTopic.words[index - 1]
                const unlocked = index === 0 || (WORD_TRACING_PROGRESS[prevWord] ?? 0) >= 3
                return (
                  <button key={word} disabled={!unlocked} onClick={() => startTrace(word, prog)}
                    className="relative rounded-3xl p-5 min-h-28 text-left shadow-sm disabled:active:scale-100 active:scale-[0.98]"
                    style={{ background: unlocked ? "white" : "#F1E8F0", border: `2px solid ${unlocked ? currentTopic.color : "transparent"}` }}>
                    {!unlocked && <Lock size={18} className="absolute top-3 right-3" style={{ color: MUTED }}/>}
                    <p className="text-2xl font-bold" style={{ color: unlocked ? PURPLE : MUTED, ...ffh }}>{word}</p>
                    <p className="text-xs mt-1" style={{ color: MUTED, ...ff }}>3 tracing levels</p>
                    <div className="flex gap-1 mt-3">{[0,1,2].map(i=><Star key={i} size={14} fill={i<prog ? YELLOW : "none"} stroke={i<prog ? YELLOW : "#D0C8D4"}/>)}</div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav active="tracingHome" go={go}/>
    </div>
  )
}

function LegacyTracingLetterScreen({ letter, go }: { letter: string; go: (s: Screen) => void }) {
  const [tracing, setTracing] = useState(false)
  const [progress, setProgress] = useState(0)
  const isUpper = letter === letter.toUpperCase()
  const dotPositions = isUpper
    ? [{ x: 50, y: 15, n: 1 }, { x: 15, y: 85, n: 2 }, { x: 85, y: 85, n: 3 }, { x: 35, y: 55, n: 4 }, { x: 65, y: 55, n: 5 }]
    : [{ x: 50, y: 10, n: 1 }, { x: 50, y: 90, n: 2 }, { x: 75, y: 25, n: 3 }]

  useEffect(() => {
    if (tracing) {
      let i = 0
      const timer = setInterval(() => {
        i++
        setProgress(i)
        if (i >= dotPositions.length) { clearInterval(timer); setTimeout(() => go("tracingFeedback"), 500) }
      }, 600)
      return () => clearInterval(timer)
    }
  }, [tracing])

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <BackBtn onClick={() => go("tracingHome")}/>
        <div className="px-3 py-1.5 rounded-full font-bold text-sm" style={{ background: `${BLUE}20`, color: BLUE, ...ff }}>
          {isUpper ? "Uppercase" : "Lowercase"}
        </div>
      </div>

      <div className="px-5 mb-2">
        <h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>Trace the letter</h2>
        <p className="text-sm" style={{ color: MUTED, ...ff }}>Follow the numbers and arrows with your finger</p>
      </div>

      {/* Tracing canvas */}
      <div className="flex-1 mx-5 flex flex-col items-center justify-center">
        <div className="w-full max-w-xs aspect-square rounded-3xl flex items-center justify-center relative shadow-sm" style={{ background: "white" }}>
          {/* Dotted guide letter */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <text x="50" y="80" textAnchor="middle" fontSize="85" fontFamily="Fredoka, sans-serif"
              stroke={`${BLUE}40`} strokeWidth="2" fill="none" strokeDasharray="5,4">{letter}</text>
            {/* Animated fill */}
            {tracing && (
              <text x="50" y="80" textAnchor="middle" fontSize="85" fontFamily="Fredoka, sans-serif"
                stroke={PINK} strokeWidth="2.5" fill={`${PINK}15`} strokeDasharray="5,4"
                style={{ clipPath: `inset(0 ${100-(progress/dotPositions.length)*100}% 0 0)` }}>
                {letter}
              </text>
            )}
          </svg>
          {/* Numbered dots */}
          {dotPositions.map(dot => (
            <div key={dot.n} className="absolute w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all"
              style={{
                left: `${dot.x}%`, top: `${dot.y}%`,
                transform: "translate(-50%,-50%)",
                background: progress >= dot.n ? GREEN : BLUE,
                color: "white", ...ff,
                scale: progress === dot.n ? "1.2" : "1",
              }}>
              {dot.n}
            </div>
          ))}
        </div>

        <p className="text-xs mt-3 text-center" style={{ color: MUTED, ...ff }}>
          {tracing ? `Tracing stroke ${Math.min(progress+1, dotPositions.length)} of ${dotPositions.length}…` : "Tap START TRACING and follow the guide!"}
        </p>
      </div>

      <div className="px-5 pb-6">
        {!tracing ? (
          <PrimaryBtn color={BLUE} onClick={() => { setTracing(true); setProgress(0) }}>
            <PenLine size={18}/> Start Tracing
          </PrimaryBtn>
        ) : (
          <div className="h-2 rounded-full" style={{ background: "#E0EEF8" }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${(progress/dotPositions.length)*100}%` }}
              style={{ background: BLUE }}/>
          </div>
        )}
      </div>
    </div>
  )
}

function TracingLetterScreen({ letter, level, go }: { letter: string; level: 1|2|3; go: (s: Screen) => void }) {
  const [tracing, setTracing] = useState(false)
  const [progress, setProgress] = useState(0)
  const isWord = letter.length > 1
  const isUpper = !isWord && letter === letter.toUpperCase()
  const dotPositions = isUpper
    ? [{ x: 50, y: 15, n: 1 }, { x: 15, y: 85, n: 2 }, { x: 85, y: 85, n: 3 }, { x: 35, y: 55, n: 4 }, { x: 65, y: 55, n: 5 }]
    : isWord
      ? [{ x: 18, y: 60, n: 1 }, { x: 38, y: 60, n: 2 }, { x: 58, y: 60, n: 3 }, { x: 78, y: 60, n: 4 }]
      : [{ x: 50, y: 10, n: 1 }, { x: 50, y: 90, n: 2 }, { x: 75, y: 25, n: 3 }]

  useEffect(() => {
    if (tracing) {
      let i = 0
      const timer = setInterval(() => {
        i++
        setProgress(i)
        if (i >= dotPositions.length) { clearInterval(timer); setTimeout(() => go("tracingFeedback"), 500) }
      }, level === 1 ? 520 : 640)
      return () => clearInterval(timer)
    }
  }, [tracing, level])

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <BackBtn onClick={() => go("tracingHome")}/>
        <div className="px-3 py-1.5 rounded-full font-bold text-sm" style={{ background: `${BLUE}20`, color: BLUE, ...ff }}>
          Level {level}
        </div>
      </div>

      <div className="px-5 mb-2">
        <h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>{isWord ? "Trace the word" : "Trace the letter"}</h2>
        <p className="text-sm" style={{ color: MUTED, ...ff }}>
          {level === 1 ? "Watch the pink line, then try it." : level === 2 ? "Follow the guide with your finger." : "Try it all by yourself."}
        </p>
      </div>

      <div className="flex-1 mx-5 flex flex-col items-center justify-center">
        <div className="w-full max-w-xs aspect-square rounded-3xl flex items-center justify-center relative shadow-sm overflow-hidden" style={{ background: "white" }}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {level < 3 && (
              <text x="50" y={isWord ? "62" : "80"} textAnchor="middle" fontSize={isWord ? "28" : "85"} fontFamily="Fredoka, sans-serif"
                stroke={`${BLUE}40`} strokeWidth={isWord ? "1.2" : "2"} fill="none" strokeDasharray="5,4">{letter}</text>
            )}
            {(tracing || level === 1) && (
              <text x="50" y={isWord ? "62" : "80"} textAnchor="middle" fontSize={isWord ? "28" : "85"} fontFamily="Fredoka, sans-serif"
                stroke={PINK} strokeWidth={isWord ? "1.5" : "2.5"} fill={`${PINK}15`} strokeDasharray="5,4"
                style={{ clipPath: `inset(0 ${100-(progress/dotPositions.length)*100}% 0 0)` }}>
                {letter}
              </text>
            )}
          </svg>

          {level < 3 && dotPositions.map(dot => (
            <div key={dot.n} className="absolute w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all"
              style={{
                left: `${dot.x}%`, top: `${dot.y}%`,
                transform: "translate(-50%,-50%)",
                background: progress >= dot.n ? GREEN : BLUE,
                color: "white", ...ff,
                scale: progress === dot.n ? "1.2" : "1",
              }}>
              {level === 1 ? dot.n : ""}
            </div>
          ))}

          {level === 3 && (
            <p className={`${isWord ? "text-4xl" : "text-7xl"} font-bold opacity-20`} style={{ color: PURPLE, ...ffh }}>{letter}</p>
          )}
        </div>

        <p className="text-xs mt-3 text-center" style={{ color: MUTED, ...ff }}>
          {tracing ? `Tracing step ${Math.min(progress+1, dotPositions.length)} of ${dotPositions.length}` : level === 3 ? "Tap START and write it from memory." : "Tap START and follow the guide."}
        </p>
      </div>

      <div className="px-5 pb-6">
        {!tracing ? (
          <PrimaryBtn color={BLUE} onClick={() => { setTracing(true); setProgress(0) }}>
            <PenLine size={18}/> Start
          </PrimaryBtn>
        ) : (
          <div className="h-2 rounded-full" style={{ background: "#E0EEF8" }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${(progress/dotPositions.length)*100}%` }} style={{ background: BLUE }}/>
          </div>
        )}
      </div>
    </div>
  )
}

function TracingFeedbackScreen({ letter, level, go }: { letter: string; level: 1|2|3; go: (s: Screen) => void }) {
  const isWord = letter.length > 1
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ background: PEACH }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="w-32 h-32 rounded-full flex items-center justify-center mb-5 shadow-md" style={{ background: "white" }}>
        <span style={{ fontSize: isWord ? 34 : 72, fontFamily: "'Fredoka', sans-serif", color: BLUE }}>{letter}</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex justify-center mb-4">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.35, type: "spring" }}>
            <Star size={56} fill={YELLOW} stroke={YELLOW}/>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{ color: PURPLE, ...ffh }}>You won 1 star!</h2>
        <p className="text-sm mb-8" style={{ color: MUTED, ...ff }}>Level {level} done. Get 3 stars to open the next step.</p>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <PrimaryBtn color={BLUE} onClick={() => go("tracingHome")}>
            Back to Quest <ArrowRight size={18}/>
          </PrimaryBtn>
          <OutlineBtn color={BLUE} onClick={() => go("tracingLetter")}>
            <RotateCcw size={16}/> Try Again
          </OutlineBtn>
        </div>
      </motion.div>
    </div>
  )
}

// ─── VOCABULARY / SPEECH ──────────────────────────────────────────────────────
function LegacyVocabHomeScreen({ go, setCurrentWord }: { go: (s: Screen) => void; setCurrentWord: (w: typeof VOCAB_WORDS[0]) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Word Practice 🎤</h2>
        <p className="text-sm mt-0.5 mb-4" style={{ color: MUTED, ...ff }}>Speak words out loud and level up your vocabulary!</p>
      </div>

      {/* Categories */}
      <div className="px-5 mb-4">
        <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Categories</p>
        <div className="grid grid-cols-2 gap-2.5">
          {VOCAB_CATEGORIES.map(c => (
            <button key={c.id} onClick={() => { setCurrentWord(VOCAB_WORDS[0]); go("vocabPractice") }}
              className="rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-95 transition-all"
              style={{ background: "white", border: `2px solid ${c.color}25` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${c.color}25` }}>{c.emoji}</div>
              <p className="font-bold text-sm text-left" style={{ color: PURPLE, ...ff }}>{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent words */}
      <div className="px-5 flex-1">
        <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>Practice Now</p>
        <div className="flex flex-col gap-2">
          {VOCAB_WORDS.slice(0, 4).map(w => (
            <button key={w.word} onClick={() => { setCurrentWord(w); go("vocabPractice") }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-sm active:scale-[0.98] transition-all">
              <span style={{ fontSize: 28 }}>{w.emoji}</span>
              <div className="flex-1 text-left">
                <p className="font-bold" style={{ color: PURPLE, ...ffh }}>{w.word}</p>
                <p className="text-xs" style={{ color: MUTED, ...ff }}>{w.phonetic}</p>
              </div>
              <Mic size={16} style={{ color: PINK }}/>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="tracingHome" go={go}/>
    </div>
  )
}

function VocabHomeScreen({ go, setCurrentWord }: { go: (s: Screen) => void; setCurrentWord: (w: typeof VOCAB_WORDS[0]) => void }) {
  const vowelStars = VOWEL_PRACTICE.reduce((sum, v) => sum + Math.min(v.stars, 3), 0)
  const vowelsDone = VOWEL_PRACTICE.every(v => v.stars >= 3)

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <BackBtn onClick={() => go("tracingHome")}/>
          <div className="px-3 py-2 rounded-2xl flex items-center gap-1 shadow-sm" style={{ background: "white" }}>
            <Star size={16} fill={YELLOW} stroke={YELLOW}/>
            <span className="font-bold" style={{ color: PURPLE, ...ffh }}>{vowelStars}/15</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold" style={{ color: PURPLE, ...ffh }}>Voice Quest</h2>
        <p className="text-sm mt-0.5 mb-4" style={{ color: MUTED, ...ff }}>Read vowels first. Then read words.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <div className="rounded-3xl p-4 mb-4 shadow-sm" style={{ background: "white" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${PINK}18` }}>
              <Volume2 size={22} style={{ color: PINK }}/>
            </div>
            <div>
              <p className="font-bold" style={{ color: PURPLE, ...ffh }}>Step 1: Vowel Reading</p>
              <p className="text-xs" style={{ color: MUTED, ...ff }}>Earn 3 stars for each vowel.</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {VOWEL_PRACTICE.map((v, index) => {
              const unlocked = index === 0 || VOWEL_PRACTICE[index - 1].stars >= 3
              return (
                <button key={v.vowel} disabled={!unlocked} onClick={() => {
                  setCurrentWord({ word: v.vowel, phonetic: v.sound, emoji: v.emoji, hint: "Say the vowel sound." })
                  go("vocabPractice")
                }}
                  className="relative rounded-2xl py-3 flex flex-col items-center gap-1 shadow-sm disabled:active:scale-100 active:scale-95"
                  style={{ background: unlocked ? `${PINK}12` : "#F1E8F0", opacity: unlocked ? 1 : 0.72 }}>
                  {!unlocked && <Lock size={13} className="absolute top-1.5 right-1.5" style={{ color: MUTED }}/>}
                  <span className="text-2xl font-bold" style={{ color: unlocked ? PURPLE : MUTED, ...ffh }}>{v.vowel}</span>
                  <div className="flex gap-0.5">{[0,1,2].map(i=><Star key={i} size={9} fill={i<v.stars ? YELLOW : "none"} stroke={i<v.stars ? YELLOW : "#D0C8D4"}/>)}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl p-4 mb-4 shadow-sm" style={{ background: vowelsDone ? "white" : "#F1E8F0" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: vowelsDone ? `${BLUE}20` : "white" }}>
              {vowelsDone ? <Mic size={22} style={{ color: BLUE }}/> : <Lock size={22} style={{ color: MUTED }}/>}
            </div>
            <div>
              <p className="font-bold" style={{ color: vowelsDone ? PURPLE : MUTED, ...ffh }}>Step 2: Word Reading</p>
              <p className="text-xs" style={{ color: MUTED, ...ff }}>{vowelsDone ? "Now read full words." : "Get 3 stars on all vowels to open this."}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {VOCAB_WORDS.slice(0, 4).map((w, index) => (
              <button key={w.word} disabled={!vowelsDone} onClick={() => { setCurrentWord(w); go("vocabPractice") }}
                className="flex items-center gap-3 p-3 rounded-2xl shadow-sm disabled:active:scale-100 active:scale-[0.98]"
                style={{ background: vowelsDone ? "white" : "rgba(255,255,255,0.55)" }}>
                <span style={{ fontSize: 28 }}>{w.emoji}</span>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold truncate" style={{ color: vowelsDone ? PURPLE : MUTED, ...ffh }}>{w.word}</p>
                  <p className="text-xs truncate" style={{ color: MUTED, ...ff }}>{index + 1} star to win</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm font-bold mb-2" style={{ color: MUTED, ...ff }}>More word groups</p>
        <div className="grid grid-cols-2 gap-2.5">
          {VOCAB_CATEGORIES.map(c => (
            <button key={c.id} disabled={!vowelsDone} onClick={() => { setCurrentWord(VOCAB_WORDS[0]); go("vocabPractice") }}
              className="rounded-2xl p-4 flex items-center gap-3 shadow-sm disabled:active:scale-100 active:scale-95"
              style={{ background: vowelsDone ? "white" : "#F1E8F0", border: `2px solid ${vowelsDone ? `${c.color}25` : "transparent"}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${c.color}25` }}>{vowelsDone ? c.emoji : <Lock size={18} style={{ color: MUTED }}/>}</div>
              <p className="font-bold text-sm text-left" style={{ color: vowelsDone ? PURPLE : MUTED, ...ff }}>{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="tracingHome" go={go}/>
    </div>
  )
}

function VocabPracticeScreen({ word, go }: { word: typeof VOCAB_WORDS[0]|null; go: (s: Screen) => void }) {
  const w = word ?? VOCAB_WORDS[0]
  const [listening, setListening] = useState(false)
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null)

  const handleMic = () => {
    if (listening || done) return
    setListening(true)
    timerRef.current = setTimeout(() => { setListening(false); setDone(true); setTimeout(() => go("vocabFeedback"), 400) }, 2000)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <BackBtn onClick={() => go("vocabHome")}/>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5">
        {/* Word card */}
        <div className="w-full rounded-3xl p-6 flex flex-col items-center gap-3 mb-6 shadow-sm" style={{ background: "white" }}>
          <span style={{ fontSize: 72 }}>{w.emoji}</span>
          <h2 className="text-4xl font-bold" style={{ color: PURPLE, ...ffh }}>{w.word}</h2>
          <p className="text-base" style={{ color: BLUE, ...ff }}>{w.phonetic}</p>
          <p className="text-sm text-center px-4" style={{ color: MUTED, ...ff }}>{w.hint}</p>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full mt-1" style={{ background: `${BLUE}20` }}>
            <Volume2 size={16} style={{ color: BLUE }}/><span className="text-sm font-bold" style={{ color: BLUE, ...ff }}>Listen</span>
          </button>
        </div>

        <p className="text-base font-bold mb-5" style={{ color: PURPLE, ...ff }}>
          {listening ? "Listening… say the word!" : done ? "Got it! ✓" : "Tap the mic and say the word!"}
        </p>

        {/* Mic button */}
        <motion.button onClick={handleMic}
          animate={listening ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
          style={{ background: listening ? "#FF4D4D" : done ? GREEN : PINK }}>
          <Mic size={36} color="white"/>
        </motion.button>

        {listening && (
          <div className="flex gap-1.5 mt-4">
            {[0,1,2,3,4].map(i=>(
              <motion.div key={i} className="w-1.5 rounded-full" style={{ background: PINK }}
                animate={{ height: [8, 24+i*4, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: i*0.1 }}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function VocabFeedbackScreen({ word, go }: { word: typeof VOCAB_WORDS[0]|null; go: (s: Screen) => void }) {
  const w = word ?? VOCAB_WORDS[0]
  const [correct] = useState(Math.random() > 0.3)
  const nextWord = VOCAB_WORDS[Math.floor(Math.random() * VOCAB_WORDS.length)]
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ background: PEACH }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="w-28 h-28 rounded-full flex items-center justify-center mb-5 shadow-md"
        style={{ background: correct ? GREEN : PINK }}>
        <span style={{ fontSize: 56 }}>{correct ? "🎉" : "🤗"}</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-3xl font-bold mb-1" style={{ color: PURPLE, ...ffh }}>{correct ? "Excellent!" : "Good Try!"}</h2>
        <p className="text-sm mb-1" style={{ color: MUTED, ...ff }}>
          {correct ? `You said "${w.word}" perfectly!` : `Almost! Try saying "${w.word}" again.`}
        </p>
        <p className="text-xs mb-8" style={{ color: BLUE, ...ff }}>{w.phonetic}</p>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <PrimaryBtn color={correct ? GREEN : PINK} onClick={() => go("vocabPractice")}>
            {correct ? "Next Word" : "Try Again"} <ArrowRight size={18}/>
          </PrimaryBtn>
          <OutlineBtn onClick={() => go("vocabHome")}>Back to Practice</OutlineBtn>
        </div>
      </motion.div>
    </div>
  )
}

// ─── COMPREHENSION ACTIVITIES ─────────────────────────────────────────────────
function ActivityIntroScreen({ story, go }: { story: Story|null; go: (s: Screen) => void }) {
  const s = story ?? CURATED_STORIES[0]
  return (
    <div className="flex flex-col items-center justify-center h-full px-6" style={{ background: PEACH }}>
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="w-32 h-32 rounded-3xl flex items-center justify-center mb-5 shadow-md mx-auto" style={{ background: s.coverColor }}>
          <span style={{ fontSize: 64 }}>{s.emoji}</span>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: PURPLE, ...ffh }}>
          Let's see what you remember! 🧠
        </h2>
        <p className="text-sm text-center mb-2" style={{ color: MUTED, ...ff }}>
          You just read <strong style={{ color: PURPLE }}>{s.title}</strong>. Answer a few fun questions!
        </p>
        <div className="flex justify-center gap-4 mb-8">
          {[{ icon: "❓", label: "3 Questions" }, { icon: "⭐", label: "Earn Stars" }, { icon: "🏅", label: "Get Badges" }].map(x => (
            <div key={x.label} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "white" }}>{x.icon}</div>
              <span className="text-xs font-bold" style={{ color: MUTED, ...ff }}>{x.label}</span>
            </div>
          ))}
        </div>
        <PrimaryBtn color={s.coverColor} onClick={() => go("activityScreen")}>
          Start Activity! <ArrowRight size={18}/>
        </PrimaryBtn>
        <button onClick={() => go("home")} className="w-full mt-3 text-sm font-bold py-2" style={{ color: MUTED, ...ff }}>
          Skip for now
        </button>
      </motion.div>
    </div>
  )
}

function ActivityScreen({ story, go, onComplete }: { story: Story|null; go: (s: Screen) => void; onComplete: (scores: boolean[]) => void }) {
  const s = story ?? CURATED_STORIES[0]
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number|null>(null)
  const [answered, setAnswered] = useState(false)
  const [scores, setScores] = useState<boolean[]>([])
  const q = STORY_QUESTIONS[qIdx]

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    const correct = i === q.correct
    setTimeout(() => {
      const nextScores = [...scores, correct]
      setScores(nextScores)
      if (qIdx < STORY_QUESTIONS.length - 1) {
        setQIdx(n => n+1); setSelected(null); setAnswered(false)
      } else {
        onComplete(nextScores)
        go("activityResults")
      }
    }, 900)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold" style={{ color: MUTED, ...ff }}>Question {qIdx+1} of {STORY_QUESTIONS.length}</p>
          <div className="flex gap-1">
            {STORY_QUESTIONS.map((_,i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: i<qIdx ? GREEN : i===qIdx ? s?.coverColor ?? PINK : "#E0D8E8" }}/>)}
          </div>
        </div>
        <div className="h-2 rounded-full" style={{ background: "#F0E0EC" }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${((qIdx+1)/STORY_QUESTIONS.length)*100}%` }} style={{ background: s?.coverColor ?? PINK }}/>
        </div>
      </div>

      {/* Question */}
      <motion.div key={qIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mx-5 mb-5 rounded-3xl p-5 shadow-sm" style={{ background: "white" }}>
        <p className="text-lg font-bold text-center" style={{ color: PURPLE, ...ffh }}>{q.q}</p>
      </motion.div>

      {/* Options */}
      <div className="flex-1 px-5 flex flex-col gap-2.5">
        {q.opts.map((opt, i) => {
          let bg = "white"
          let border = "rgba(255,132,186,0.2)"
          let color = PURPLE
          if (answered && selected === i) {
            bg = i === q.correct ? `${GREEN}25` : "#FFE0E0"
            border = i === q.correct ? GREEN : "#FF4D4D"
            color = i === q.correct ? "#2E8B57" : "#CC4444"
          } else if (answered && i === q.correct) {
            bg = `${GREEN}15`; border = GREEN; color = "#2E8B57"
          }
          return (
            <motion.button key={i} onClick={() => handleSelect(i)}
              whileTap={{ scale: 0.97 }}
              className="w-full p-4 rounded-2xl text-left flex items-center gap-3 border-2 transition-all"
              style={{ background: bg, borderColor: border }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: `${border}30`, color, ...ff }}>
                {answered && selected===i ? (i===q.correct ? "✓" : "✗") : String.fromCharCode(65+i)}
              </div>
              <span className="font-semibold text-sm" style={{ color, ...ff }}>{opt}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function ActivityResultsScreen({ scores, story, go }: { scores: boolean[]; story: Story|null; go: (s: Screen) => void }) {
  const correct = scores.filter(Boolean).length || 2
  const total = STORY_QUESTIONS.length
  const stars = correct === total ? 3 : correct >= 2 ? 2 : 1
  const msgs = ["Keep practising — you're learning!", "Well done! You're getting smarter every day!", "Perfect score! You're a reading champion! 🏆"]

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" style={{ background: PEACH }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 12 }}
        className="w-32 h-32 rounded-full flex items-center justify-center mb-5 shadow-lg mx-auto" style={{ background: "white" }}>
        <span style={{ fontSize: 64 }}>🏆</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {/* Stars */}
        <div className="flex justify-center gap-2 mb-3">
          {[0,1,2].map(i => (
            <motion.div key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4+i*0.2, type: "spring" }}>
              <Star size={40} fill={i<stars ? YELLOW : "none"} stroke={i<stars ? YELLOW : "#D0C8D4"}/>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-1" style={{ color: PURPLE, ...ffh }}>
          {correct}/{total} Correct!
        </h2>
        <p className="text-sm mb-5" style={{ color: MUTED, ...ff }}>{msgs[stars-1]}</p>

        {/* Badge */}
        <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-2xl mb-6 mx-auto max-w-xs" style={{ background: `${YELLOW}35`, border: `2px solid ${YELLOW}` }}>
          <span style={{ fontSize: 28 }}>🧠</span>
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>Badge Earned!</p>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Story Explorer · Keep reading!</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <PrimaryBtn onClick={() => go("storyLibrary")}>Read Another Story <BookOpen size={18}/></PrimaryBtn>
          <OutlineBtn onClick={() => go("home")}>Back to Home</OutlineBtn>
        </div>
      </motion.div>

      {[...Array(8)].map((_, i) => (
        <motion.div key={i} className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{ background: [PINK,YELLOW,BLUE,GREEN][i%4], left: `${8+i*11}%`, top: "3%" }}
          animate={{ y: [0, 280+i*20], opacity: [1, 0], rotate: Math.random()*360 }}
          transition={{ duration: 1.8, delay: i*0.1, ease: "easeIn" }}/>
      ))}
    </div>
  )
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function MyProgressScreen({ go }: { go: (s: Screen) => void }) {
  const child = DEMO_PROFILES[0]
  const av = AVATARS.find(a => a.id === child.avatar) ?? AVATARS[0]

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: av.bg }}>{av.emoji}</div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>{child.name}'s Progress</h2>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Keep up the great work! ⭐</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-4">
        {/* Streak & stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[{ emoji: "🔥", label: "Day Streak", val: "3" }, { emoji: "📖", label: "Stories Read", val: "12" }, { emoji: "✏️", label: "Letters Traced", val: "18" }].map(s => (
            <div key={s.label} className="rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm" style={{ background: "white" }}>
              <span style={{ fontSize: 24 }}>{s.emoji}</span>
              <p className="font-bold text-xl" style={{ color: PURPLE, ...ffh }}>{s.val}</p>
              <p className="text-xs text-center" style={{ color: MUTED, ...ff }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-3" style={{ color: PURPLE, ...ff }}>My Badges</p>
          <div className="grid grid-cols-4 gap-2">
            {BADGES.map(b => (
              <div key={b.id} className="flex flex-col items-center gap-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${!b.earned ? "opacity-35 grayscale" : ""}`}
                  style={{ background: b.earned ? `${YELLOW}40` : "#F0E8F8" }}>
                  <span>{b.emoji}</span>
                </div>
                <p className="text-xs text-center leading-tight" style={{ color: b.earned ? PURPLE : MUTED, ...ff }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills overview */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-4" style={{ color: PURPLE, ...ff }}>Skill Progress</p>
          <div className="flex justify-around">
            <Ring pct={72} color={PINK}   label="Reading"/>
            <Ring pct={58} color={BLUE}   label="Writing"/>
            <Ring pct={85} color={GREEN}  label="Tracing"/>
            <Ring pct={45} color={YELLOW} label="Vocab"/>
          </div>
        </div>

        {/* Simple bar chart */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-1" style={{ color: PURPLE, ...ff }}>This Week's Activity</p>
          <p className="text-xs mb-3" style={{ color: MUTED, ...ff }}>Stories · Tracing · Vocab</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={WEEKLY_DATA} barGap={2} barSize={6}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: MUTED, fontFamily: "Nunito" }} axisLine={false} tickLine={false}/>
              <Bar id="prog-stories" dataKey="stories" fill={PINK} radius={[3,3,0,0]}/>
              <Bar id="prog-tracing" dataKey="tracing" fill={BLUE} radius={[3,3,0,0]}/>
              <Bar id="prog-vocab"   dataKey="vocab"   fill={GREEN} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <BottomNav active="myProgress" go={go}/>
    </div>
  )
}

function ParentDashboardScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
  const child = profiles[0] ?? DEMO_PROFILES[0]
  const av = AVATARS.find(a => a.id === child.avatar) ?? AVATARS[0]

  const lineData = [
    { week: "W1", reading: 60, tracing: 70, vocab: 40 },
    { week: "W2", reading: 65, tracing: 78, vocab: 45 },
    { week: "W3", reading: 68, tracing: 82, vocab: 52 },
    { week: "W4", reading: 72, tracing: 85, vocab: 58 },
  ]

  const stats = [
    { label: "Stories Written",       val: "7",   emoji: "📝", color: PINK   },
    { label: "Stories Read",           val: "12",  emoji: "📚", color: BLUE   },
    { label: "Letters Traced",         val: "18",  emoji: "✏️", color: GREEN  },
    { label: "Vocab Words Practiced",  val: "34",  emoji: "🗣️", color: YELLOW },
    { label: "Comprehension Avg.",     val: "81%", emoji: "🧠", color: "#C4A8E8" },
    { label: "Total Time (this week)", val: "4h",  emoji: "⏱",  color: "#F48FB1" },
  ]

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>Parent Dashboard</h2>
          <p className="text-xs" style={{ color: MUTED, ...ff }}>Analytics & Progress Overview</p>
        </div>
        <button onClick={() => go("home")} className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "white" }}>
          <X size={18} style={{ color: MUTED }}/>
        </button>
      </div>

      {/* Child selector */}
      <div className="px-5 mb-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "white" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: av.bg }}>{av.emoji}</div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>{child.name}, Age {child.age}</p>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Active learner · Last seen today</p>
          </div>
          <button onClick={() => go("profileSwitch")} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: `${PINK}15`, color: PINK, ...ff }}>Switch</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-4">
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm" style={{ background: "white" }}>
              <span style={{ fontSize: 20 }}>{s.emoji}</span>
              <p className="font-bold text-lg" style={{ color: s.color, ...ffh }}>{s.val}</p>
              <p className="text-xs text-center leading-tight" style={{ color: MUTED, ...ff }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Skill rings */}
        <div className="rounded-3xl p-5 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-4" style={{ color: PURPLE, ...ff }}>Skill Mastery</p>
          <div className="flex justify-around">
            <Ring pct={72} color={PINK}   size={68} label="Reading"/>
            <Ring pct={58} color={BLUE}   size={68} label="Writing"/>
            <Ring pct={85} color={GREEN}  size={68} label="Tracing"/>
            <Ring pct={45} color={YELLOW} size={68} label="Vocabulary"/>
          </div>
        </div>

        {/* Progress over time */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-1" style={{ color: PURPLE, ...ff }}>Progress Over 4 Weeks</p>
          <div className="flex gap-4 mb-3">
            {[{ label: "Reading", color: PINK }, { label: "Tracing", color: BLUE }, { label: "Vocab", color: GREEN }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full" style={{ background: l.color }}/>
                <span className="text-xs" style={{ color: MUTED, ...ff }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E0EC"/>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: MUTED, fontFamily: "Nunito" }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontFamily: "Nunito" }}/>
              <Line id="line-reading" type="monotone" dataKey="reading" stroke={PINK} strokeWidth={2.5} dot={{ fill: PINK, r: 4 }}/>
              <Line id="line-tracing" type="monotone" dataKey="tracing" stroke={BLUE} strokeWidth={2.5} dot={{ fill: BLUE, r: 4 }}/>
              <Line id="line-vocab"   type="monotone" dataKey="vocab"   stroke={GREEN} strokeWidth={2.5} dot={{ fill: GREEN, r: 4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly activity */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-3" style={{ color: PURPLE, ...ff }}>Daily Activity This Week</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={WEEKLY_DATA} barGap={2} barSize={7}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: MUTED, fontFamily: "Nunito" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontFamily: "Nunito" }}/>
              <Bar id="dash-stories" dataKey="stories" name="Stories" fill={PINK}   radius={[3,3,0,0]}/>
              <Bar id="dash-tracing" dataKey="tracing" name="Tracing" fill={BLUE}   radius={[3,3,0,0]}/>
              <Bar id="dash-vocab"   dataKey="vocab"   name="Vocab"   fill={GREEN}  radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        <div className="rounded-3xl p-4 shadow-sm" style={{ background: "white" }}>
          <p className="font-bold mb-3" style={{ color: PURPLE, ...ff }}>💡 AI Recommendations</p>
          {[
            { icon: "🎤", text: `${child.name} needs more vocabulary practice — try 5 words today!`, color: PINK   },
            { icon: "📖", text: "Great reading streak! Try a longer story this week.",               color: BLUE   },
            { icon: "✏️", text: "Letters G–K haven't been practised yet. Start tracing them!",      color: GREEN  },
          ].map((r, i) => (
            <div key={i} className="flex gap-3 mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ background: `${r.color}20` }}>{r.icon}</div>
              <p className="text-sm leading-snug" style={{ color: MUTED, ...ff }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function SettingsHomeScreen({ go }: { go: (s: Screen) => void }) {
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

function AccountSettingsScreen({ go }: { go: (s: Screen) => void }) {
  const [name, setName] = useState("Parent Guardian")
  const [email, setEmail] = useState("parent@example.com")
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Account" subtitle="Parent sign-in details" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <FormInput label="Full Name" value={name} onChange={(v) => { setName(v); setSaved(false) }} placeholder="Parent name"/>
        <FormInput label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setSaved(false) }} placeholder="parent@example.com"/>
        {saved && <p className="text-sm font-bold text-center" style={{ color: GREEN, ...ff }}>Account details saved.</p>}
        <PrimaryBtn onClick={() => setSaved(true)} disabled={!name.trim() || !email.trim()}>Save Account</PrimaryBtn>
        <PrimaryBtn onClick={() => go("resetPassword")}>Change Password</PrimaryBtn>
        <GoogleBtn label="Connect Google Sign-In"/>
      </div>
    </div>
  )
}

function ChildProfileSettingsScreen({ profiles, go }: { profiles: Profile[]; go: (s: Screen) => void }) {
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

function ManageProfilesScreen({ profiles, go, onRemove }: { profiles: Profile[]; go: (s: Screen) => void; onRemove: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Profiles" subtitle="Family child profile management" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        {profiles.map(p => {
          const av = AVATARS.find(a => a.id === p.avatar) ?? AVATARS[0]
          return (
            <div key={p.id} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "white" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: av.bg }}>{av.emoji}</div>
              <div className="flex-1">
                <p className="font-bold" style={{ color: PURPLE, ...ffh }}>{p.name}</p>
                <p className="text-xs" style={{ color: MUTED, ...ff }}>Age {p.age}</p>
              </div>
              <button
                onClick={() => onRemove(p.id)}
                disabled={profiles.length <= 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40"
                style={{ background: `${PINK}15` }}
              >
                <Trash2 size={16} style={{ color: PINK }}/>
              </button>
            </div>
          )
        })}
        <PrimaryBtn onClick={() => go("createProfile")} color={BLUE}>Add Child Profile <Plus size={18}/></PrimaryBtn>
      </div>
    </div>
  )
}

function NotificationSettingsScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Notifications" subtitle="Practice reminders" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <ToggleLine label="Daily practice reminder" desc="Gentle reminder after school."/>
        <ToggleLine label="Weekly progress summary" desc="Parent overview every Sunday."/>
        <ToggleLine label="Badge celebrations" desc="Notify when a child earns a badge." enabled={false}/>
      </div>
    </div>
  )
}

function SoundVoiceSettingsScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Sound & Voice" subtitle="Audio and microphone controls" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <ToggleLine label="Sound effects" desc="Play small success and navigation sounds."/>
        <ToggleLine label="Narration voice" desc="Read instructions aloud for early readers."/>
        <div className="rounded-2xl p-4" style={{ background: "white" }}>
          <p className="font-bold text-sm mb-3" style={{ color: PURPLE, ...ffh }}>Mic sensitivity</p>
          <div className="h-3 rounded-full" style={{ background: "#F0E0EC" }}>
            <div className="h-full rounded-full" style={{ width: "65%", background: PINK }}/>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccessibilitySettingsScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Accessibility" subtitle="Reader comfort options" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <ToggleLine label="Larger text" desc="Increase story and instruction text size."/>
        <ToggleLine label="High contrast mode" desc="Use stronger text and button contrast." enabled={false}/>
        <ToggleLine label="Reduced motion" desc="Limit celebration and transition animation." enabled={false}/>
      </div>
    </div>
  )
}

function PrivacyDataSettingsScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="Privacy & Data" subtitle="Parent transparency controls" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <div className="rounded-2xl p-4" style={{ background: "white" }}>
          <p className="font-bold text-sm" style={{ color: PURPLE, ...ffh }}>Data collected</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: MUTED, ...ff }}>Parent account, child first name or nickname, age range, avatar, stories, progress, and achievements.</p>
        </div>
        <PrimaryBtn color={BLUE}>Export Data</PrimaryBtn>
        <button className="w-full py-4 rounded-2xl font-bold text-lg" style={{ background: `${PINK}18`, color: PINK, ...ff }}>Delete Account / Data</button>
      </div>
    </div>
  )
}

function AboutHelpScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <ScreenHeader title="About / Help" subtitle="Support and app info" go={go} backTo="settingsHome"/>
      <div className="flex-1 px-5 pb-6 flex flex-col gap-3">
        <div className="rounded-3xl p-5 text-center" style={{ background: "white" }}>
          <OwlMascot size={84}/>
          <h3 className="text-2xl font-bold mt-2" style={{ color: PINK, ...ffh }}>BrightInk Kids</h3>
          <p className="text-sm" style={{ color: MUTED, ...ff }}>Version 0.0.1</p>
        </div>
        {["Contact support", "FAQ", "Privacy policy", "Terms for parents"].map(item => (
          <div key={item} className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "white" }}>
            <p className="font-bold text-sm" style={{ color: PURPLE, ...ff }}>{item}</p>
            <ChevronRight size={16} style={{ color: MUTED }}/>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingStateScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-6 text-center" style={{ background: PEACH }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }} className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: "white" }}>
        <Loader2 size={34} style={{ color: PINK }}/>
      </motion.div>
      <h2 className="text-3xl font-bold mb-2" style={{ color: PURPLE, ...ffh }}>Creating magic...</h2>
      <p className="text-sm mb-6" style={{ color: MUTED, ...ff }}>This state covers AI response delays and sync work.</p>
      <OutlineBtn onClick={() => go("settingsHome")}>Back to Settings</OutlineBtn>
    </div>
  )
}

function ErrorStateScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-6 text-center" style={{ background: PEACH }}>
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: "white" }}>
        <WifiOff size={34} style={{ color: PINK }}/>
      </div>
      <h2 className="text-3xl font-bold mb-2" style={{ color: PURPLE, ...ffh }}>No internet</h2>
      <p className="text-sm mb-6" style={{ color: MUTED, ...ff }}>Saved activities stay in the offline queue and sync when connection returns.</p>
      <PrimaryBtn onClick={() => go("settingsHome")}>Try Again</PrimaryBtn>
    </div>
  )
}

function EmptyStateScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-6 text-center" style={{ background: PEACH }}>
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: "white" }}>
        <BookOpen size={34} style={{ color: BLUE }}/>
      </div>
      <h2 className="text-3xl font-bold mb-2" style={{ color: PURPLE, ...ffh }}>No stories yet</h2>
      <p className="text-sm mb-6" style={{ color: MUTED, ...ff }}>Start with a prompt and save the first story to the child's library.</p>
      <PrimaryBtn onClick={() => go("storyTheme")}>Create First Story <PenLine size={18}/></PrimaryBtn>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [profiles, setProfiles] = useState<Profile[]>(DEMO_PROFILES)
  const [userStories, setUserStories] = useState<Story[]>(INIT_USER_STORIES)
  const [selectedStory, setSelectedStory] = useState<Story|null>(null)
  const [selectedTheme, setSelectedTheme] = useState("animals")
  const [storyDraftTitle, setStoryDraftTitle] = useState("")
  const [storyDraftPages, setStoryDraftPages] = useState<string[]>([])
  const [selectedLetter, setSelectedLetter] = useState("A")
  const [selectedTracingLevel, setSelectedTracingLevel] = useState<1|2|3>(1)
  const [selectedWord, setSelectedWord] = useState<typeof VOCAB_WORDS[0]|null>(null)
  const [activityScores, setActivityScores] = useState<boolean[]>([])

  const go = useCallback((s: Screen) => setScreen(s), [])

  const addProfile = useCallback((p: Profile) => setProfiles(prev => [...prev, p]), [])
  const removeProfile = useCallback((id: string) => setProfiles(prev => prev.length <= 1 ? prev : prev.filter(p => p.id !== id)), [])
  const addStory   = useCallback((s: Story)   => setUserStories(prev => [s, ...prev]), [])
  const startStoryTheme = useCallback((theme: string) => {
    setSelectedTheme(theme)
    setStoryDraftTitle("")
    setStoryDraftPages([])
  }, [])

  const allStories = [...userStories, ...CURATED_STORIES]

  const renderScreen = () => {
    switch (screen) {
      // Onboarding
      case "splash":          return <SplashScreen onDone={() => go("intro")}/>
      case "intro":           return <IntroScreen onDone={() => go("authChoice")}/>
      case "authChoice":      return <AuthChoiceScreen go={go}/>
      case "signup":          return <SignUpScreen go={go}/>
      case "login":           return <LoginScreen go={go}/>
      case "forgotPassword":  return <ForgotPasswordScreen go={go}/>
      case "resetPassword":   return <ResetPasswordScreen go={go}/>
      case "createProfile":   return <CreateProfileScreen go={go} onAdd={addProfile}/>
      case "profileSelector": return <ProfileSelectorScreen profiles={profiles} go={go}/>
      // Home
      case "home":            return <HomeScreen profiles={profiles} go={go}/>
      case "profileSwitch":   return <ProfileSwitchScreen profiles={profiles} go={go}/>
      // Story creation
      case "storyTheme":    return <StoryThemeScreen go={go} setTheme={startStoryTheme}/>
      case "storyWriting":  return <StoryWritingScreen go={go} theme={selectedTheme} title={storyDraftTitle} pages={storyDraftPages} onPagesChange={setStoryDraftPages}/>
      case "storyFeedback": return <StoryFeedbackScreen go={go} theme={selectedTheme} title={storyDraftTitle} pages={storyDraftPages} onSave={addStory}/>
      case "storyTitle":    return <StoryTitleScreen go={go} theme={selectedTheme} title={storyDraftTitle} onTitleChange={setStoryDraftTitle}/>
      case "storySaved":    return <StorySavedScreen go={go}/>
      // Reading
      case "storyLibrary": return <StoryLibraryScreen stories={allStories} go={go} setCurrentStory={setSelectedStory}/>
      case "storyDetail":  return <StoryDetailScreen story={selectedStory} go={go}/>
      case "storyReading": return <StoryReadingScreen story={selectedStory} go={go}/>
      // Tracing
      case "tracingHome":    return <TracingHomeScreen go={go} setTracingLetter={setSelectedLetter} setTracingLevel={setSelectedTracingLevel}/>
      case "tracingLetter":  return <TracingLetterScreen letter={selectedLetter} level={selectedTracingLevel} go={go}/>
      case "tracingFeedback":return <TracingFeedbackScreen letter={selectedLetter} level={selectedTracingLevel} go={go}/>
      // Vocab
      case "vocabHome":     return <VocabHomeScreen go={go} setCurrentWord={setSelectedWord}/>
      case "vocabPractice": return <VocabPracticeScreen word={selectedWord} go={go}/>
      case "vocabFeedback": return <VocabFeedbackScreen word={selectedWord} go={go}/>
      // Activities
      case "activityIntro":   return <ActivityIntroScreen story={selectedStory} go={go}/>
      case "activityScreen":  return <ActivityScreen story={selectedStory} go={go} onComplete={setActivityScores}/>
      case "activityResults": return <ActivityResultsScreen scores={activityScores} story={selectedStory} go={go}/>
      // Progress
      case "myProgress":      return <MyProgressScreen go={go}/>
      case "parentDashboard": return <ParentDashboardScreen profiles={profiles} go={go}/>
      // Settings
      case "settingsHome": return <SettingsHomeScreen go={go}/>
      case "accountSettings": return <AccountSettingsScreen go={go}/>
      case "childProfileSettings": return <ChildProfileSettingsScreen profiles={profiles} go={go}/>
      case "manageProfiles": return <ManageProfilesScreen profiles={profiles} go={go} onRemove={removeProfile}/>
      case "notificationSettings": return <NotificationSettingsScreen go={go}/>
      case "soundVoiceSettings": return <SoundVoiceSettingsScreen go={go}/>
      case "accessibilitySettings": return <AccessibilitySettingsScreen go={go}/>
      case "privacyDataSettings": return <PrivacyDataSettingsScreen go={go}/>
      case "aboutHelp": return <AboutHelpScreen go={go}/>
      // Supporting states
      case "loadingState": return <LoadingStateScreen go={go}/>
      case "errorState": return <ErrorStateScreen go={go}/>
      case "emptyState": return <EmptyStateScreen go={go}/>
    }
  }

  return (
    <div className="w-full h-[100dvh] overflow-hidden" style={{ background: PEACH }}>
      <div className="relative overflow-hidden w-full h-full">
        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }} className="h-full">
          {renderScreen()}
        </motion.div>
      </div>
    </div>
  )
}
