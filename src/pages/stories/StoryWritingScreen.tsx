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

type ChatMessage = {
  from: "bot" | "kid"
  text: string
}

export function StoryWritingScreen({ go, theme, title, pages, onPagesChange }: {
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold" style={{ color: PURPLE, ...ffh }}>{title || "Write Your Story"}</h2>
            <p className="text-xs" style={{ color: MUTED, ...ff }}>Page {currentPageNumber}. Tap an idea or write your own words.</p>
          </div>
          <button
            onClick={() => setText("")}
            disabled={!text}
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm disabled:opacity-40"
            style={{ background: "white", color: MUTED }}
            aria-label="Erase writing"
          >
            <Eraser size={19}/>
          </button>
        </div>
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

