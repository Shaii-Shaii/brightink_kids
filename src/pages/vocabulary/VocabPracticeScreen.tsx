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


export function VocabPracticeScreen({ word, go, onResult }: {
  word: typeof VOCAB_WORDS[0]|null
  go: (s: Screen) => void
  onResult: (result: VocabResult) => void
}) {
  const w = word ?? VOCAB_WORDS[0]
  const [listening, setListening] = useState(false)
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState("")
  const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null)
  const recognitionRef = useRef<any>(null)

  const normalizeSpeech = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "")
  const checkSpeech = (transcript: string) => {
    const said = normalizeSpeech(transcript)
    const target = normalizeSpeech(w.word)
    if (!target || !said) return false
    if (target.length === 1) return said === target || said.startsWith(target)
    return said.includes(target)
  }

  const handleMic = () => {
    if (listening || done) return
    setMessage("")
    setListening(true)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setListening(false)
      onResult({ correct: false, transcript: "", target: w.word, reason: "Speech check is not available on this browser." })
      setMessage("I could not hear you here. Try Chrome or the mobile app.")
      timerRef.current = setTimeout(() => go("vocabFeedback"), 900)
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 3
    recognition.continuous = false

    recognition.onresult = (event: any) => {
      const alternatives = Array.from(event.results?.[0] ?? []) as Array<{ transcript?: string }>
      const transcript = alternatives.map(alt => alt.transcript ?? "").find(Boolean) ?? ""
      const correct = alternatives.some(alt => checkSpeech(alt.transcript ?? "")) || checkSpeech(transcript)
      onResult({ correct, transcript, target: w.word })
      setListening(false)
      setDone(true)
      timerRef.current = setTimeout(() => go("vocabFeedback"), 450)
    }

    recognition.onerror = () => {
      onResult({ correct: false, transcript: "", target: w.word, reason: "I could not hear the word clearly." })
      setListening(false)
      setMessage("I could not hear it clearly. Try again slowly.")
      timerRef.current = setTimeout(() => go("vocabFeedback"), 900)
    }

    recognition.onend = () => setListening(false)
    recognition.start()
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    recognitionRef.current?.abort?.()
  }, [])

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

        <p className="text-base font-bold mb-5 text-center" style={{ color: PURPLE, ...ff }}>
          {listening ? "Listening… say the word!" : done ? "Got it! ✓" : "Tap the mic and say the word!"}
        </p>

        {message && (
          <p className="text-xs text-center mb-3 -mt-3" style={{ color: PINK, ...ff }}>{message}</p>
        )}

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

