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


export function TracingLetterScreen({ letter, level, go, onValidTrace }: {
  letter: string
  level: 1|2|3
  go: (s: Screen) => void
  onValidTrace: (item: string, level: 1|2|3) => void
}) {
  const [tracing, setTracing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [drawing, setDrawing] = useState(false)
  const [drawPaths, setDrawPaths] = useState<DrawStroke[]>([])
  const [currentPath, setCurrentPath] = useState("")
  const currentPathRef = useRef("")
  const strokeIdRef = useRef(0)
  const [traceTool, setTraceTool] = useState<TraceTool>("pen")
  const [validationError, setValidationError] = useState(false)
  const isWord = letter.length > 1
  const isUpper = !isWord && letter === letter.toUpperCase()
  const strokes = !isWord ? (isUpper ? UPPER_TRACE_STROKES : LOWER_TRACE_STROKES)[letter.toUpperCase()] ?? [] : []
  const wordSteps = isWord ? letter.split("").map((_, i) => ({ x: 16 + i * (68 / Math.max(letter.length - 1, 1)), y: 62, n: i + 1 })) : []
  const totalSteps = Math.max(strokes.length || wordSteps.length, 1)
  const traceFont = isWord ? "'Nunito', sans-serif" : "'Comic Sans MS', 'Comic Neue', 'Fredoka', sans-serif"
  const textY = isWord ? 62 : isUpper ? 74 : 72
  const textSize = isWord ? 28 : isUpper ? 72 : 74
  const clipWidth = Math.min(100, (progress / totalSteps) * 100)

  useEffect(() => {
    if (tracing && level === 1) {
      let i = 0
      const timer = setInterval(() => {
        i++
        setProgress(i)
        if (i >= totalSteps) clearInterval(timer)
      }, level === 1 ? 520 : 640)
      return () => clearInterval(timer)
    }
  }, [tracing, level, totalSteps])

  const pointerPoint = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    return { x, y, text: `${x.toFixed(1)} ${y.toFixed(1)}` }
  }
  const eraseNear = (x: number, y: number) => {
    const radius = 8
    setDrawPaths(paths => paths.filter(path => {
      const points = [...path.d.matchAll(/[ML]\s+([\d.]+)\s+([\d.]+)/g)].map(match => ({
        x: Number(match[1]),
        y: Number(match[2]),
      }))
      return !points.some(point => Math.hypot(point.x - x, point.y - y) <= radius)
    }))
  }
  const startDrawing = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!tracing) return
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      // Some embedded mobile webviews are strict about pointer capture. Drawing still works without it.
    }
    const point = pointerPoint(e)
    if (traceTool === "eraser") {
      eraseNear(point.x, point.y)
      return
    }
    setDrawing(true)
    const path = `M ${point.text}`
    currentPathRef.current = path
    setCurrentPath(path)
  }
  const moveDrawing = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!tracing) return
    const point = pointerPoint(e)
    if (traceTool === "eraser") {
      eraseNear(point.x, point.y)
      return
    }
    if (!drawing) return
    const nextPath = `${currentPathRef.current} L ${point.text}`
    currentPathRef.current = nextPath
    setCurrentPath(nextPath)
  }
  const endDrawing = () => {
    if (!drawing) return
    setDrawing(false)
    if (currentPathRef.current.includes(" L ")) {
      strokeIdRef.current += 1
      const nextStroke = { id: strokeIdRef.current, d: currentPathRef.current }
      setDrawPaths(paths => [...paths, nextStroke])
    }
    currentPathRef.current = ""
    setCurrentPath("")
  }
  const validateDrawing = (extraPath = currentPathRef.current || currentPath) => {
    const paths = extraPath ? [...drawPaths, extraPath] : drawPaths
    const points = parseDrawPoints(paths)
    if (points.length < 8) return false

    const minX = Math.min(...points.map(p => p.x))
    const maxX = Math.max(...points.map(p => p.x))
    const minY = Math.min(...points.map(p => p.y))
    const maxY = Math.max(...points.map(p => p.y))
    if ((maxX - minX) < 10 || (maxY - minY) < 16) return false

    const strokeCount = paths.length
    const inBox = (x1: number, y1: number, x2: number, y2: number) =>
      points.filter(point => point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2).length / points.length
    const hasZone = (x1: number, y1: number, x2: number, y2: number, ratio = 0.08) => inBox(x1, y1, x2, y2) >= ratio
    const upperLetter = letter.toUpperCase()

    if (isWord) {
      const expectedLeft = 18
      const expectedRight = 82
      const center = (minX + maxX) / 2
      return center > expectedLeft && center < expectedRight && minY < 72 && maxY > 44
    }

    const guideStrokes = strokes.length ? strokes : (isUpper ? UPPER_TRACE_STROKES.A : LOWER_TRACE_STROKES.A)
    const guideSegments = guideStrokes.flatMap(stroke => {
      const coords = parsePathCoords(stroke.d)
      return coords.slice(0, -1).map((point, i) => [point, coords[i + 1]] as const)
    })
    const nearGuide = points.filter(point =>
      guideSegments.some(([a, b]) => distanceToSegment(point, a, b) <= 13)
    ).length
    const guideRatio = nearGuide / points.length

    if (letter.toUpperCase() === "I") {
      const centerLinePoints = points.filter(point => point.y > 25 && point.y < 72 && Math.abs(point.x - 50) <= 8)
      const ySpread = centerLinePoints.length ? Math.max(...centerLinePoints.map(p => p.y)) - Math.min(...centerLinePoints.map(p => p.y)) : 0
      return centerLinePoints.length >= 5 && ySpread >= 30
    }

    const guidePoints = guideStrokes.flatMap(stroke => [stroke.label, ...parsePathCoords(stroke.d).map(p => [p.x, p.y] as [number, number])])
    const covered = guidePoints.filter(([x, y]) =>
      points.some(point => Math.hypot(point.x - x, point.y - y) <= 16)
    ).length
    const guideCoverage = covered / Math.max(guidePoints.length, 1)

    const shapeChecks: Record<string, () => boolean> = {
      A: () => hasZone(24, 58, 40, 82) && hasZone(60, 58, 76, 82) && hasZone(38, 45, 64, 62),
      B: () => hasZone(25, 18, 42, 80) && hasZone(42, 18, 78, 50) && hasZone(42, 46, 80, 80),
      C: () => {
        const leftArc = hasZone(20, 28, 46, 74, 0.18)
        const topArc = hasZone(34, 14, 78, 42, 0.12)
        const bottomArc = hasZone(34, 60, 78, 86, 0.12)
        const rightMiddle = inBox(58, 38, 82, 62)
        return leftArc && topArc && bottomArc && rightMiddle < 0.22 && strokeCount <= 2
      },
      D: () => hasZone(25, 18, 42, 80) && hasZone(46, 24, 82, 72) && strokeCount <= 3,
      E: () => hasZone(25, 18, 44, 80) && hasZone(40, 14, 78, 30) && hasZone(38, 42, 70, 56) && hasZone(40, 68, 78, 82),
      F: () => hasZone(25, 18, 44, 80) && hasZone(40, 14, 78, 30) && hasZone(38, 42, 70, 56) && !hasZone(46, 66, 80, 82, 0.1),
      G: () => hasZone(20, 28, 46, 74, 0.15) && hasZone(56, 50, 82, 68, 0.08),
      H: () => hasZone(24, 18, 42, 80) && hasZone(58, 18, 76, 80) && hasZone(34, 42, 66, 58),
      I: () => {
        const centerLinePoints = points.filter(point => point.y > 25 && point.y < 72 && Math.abs(point.x - 50) <= 8)
        const ySpread = centerLinePoints.length ? Math.max(...centerLinePoints.map(p => p.y)) - Math.min(...centerLinePoints.map(p => p.y)) : 0
        return centerLinePoints.length >= 5 && ySpread >= 30 && (maxX - minX) < 28
      },
      J: () => hasZone(58, 18, 76, 66) && hasZone(28, 58, 68, 86),
      K: () => hasZone(24, 18, 42, 80) && hasZone(42, 18, 78, 54) && hasZone(42, 48, 82, 82),
      L: () => hasZone(24, 18, 42, 80) && hasZone(36, 66, 78, 84),
      M: () => hasZone(18, 18, 36, 82) && hasZone(64, 18, 82, 82) && hasZone(34, 28, 66, 62),
      N: () => hasZone(20, 18, 38, 82) && hasZone(62, 18, 80, 82) && hasZone(34, 28, 66, 72),
      O: () => hasZone(22, 24, 42, 74) && hasZone(58, 24, 78, 74) && hasZone(36, 16, 66, 36) && hasZone(36, 64, 66, 84),
      P: () => hasZone(24, 18, 42, 82) && hasZone(42, 18, 80, 56) && !hasZone(46, 58, 82, 84, 0.12),
      Q: () => hasZone(22, 24, 42, 74) && hasZone(58, 24, 78, 74) && hasZone(56, 58, 84, 86),
      R: () => hasZone(24, 18, 42, 82) && hasZone(42, 18, 80, 56) && hasZone(44, 54, 82, 84),
      S: () => hasZone(34, 16, 78, 44) && hasZone(22, 38, 78, 62) && hasZone(22, 58, 66, 86),
      T: () => hasZone(24, 14, 78, 32) && hasZone(42, 20, 60, 82),
      U: () => hasZone(22, 18, 40, 66) && hasZone(60, 18, 78, 66) && hasZone(34, 58, 66, 86),
      V: () => hasZone(20, 18, 42, 60) && hasZone(58, 18, 80, 60) && hasZone(38, 58, 62, 84),
      W: () => hasZone(14, 18, 30, 70) && hasZone(72, 18, 88, 70) && hasZone(28, 50, 64, 84),
      X: () => hasZone(24, 18, 44, 44) && hasZone(56, 18, 76, 44) && hasZone(24, 56, 44, 82) && hasZone(56, 56, 76, 82),
      Y: () => hasZone(24, 18, 48, 52) && hasZone(52, 18, 76, 52) && hasZone(42, 48, 60, 82),
      Z: () => hasZone(24, 14, 78, 32) && hasZone(24, 66, 80, 84) && hasZone(34, 30, 70, 70),
    }

    const shapePass = shapeChecks[upperLetter]?.() ?? true
    return shapePass && guideRatio >= 0.32 && guideCoverage >= 0.4
  }
  const finishTracing = () => {
    const activePath = currentPathRef.current || currentPath
    if (activePath?.includes(" L ")) {
      strokeIdRef.current += 1
      setDrawPaths(paths => [...paths, { id: strokeIdRef.current, d: activePath }])
    }
    const valid = validateDrawing(activePath)
    setDrawing(false)
    currentPathRef.current = ""
    setCurrentPath("")
    if (!valid) {
      setValidationError(true)
      return
    }
    onValidTrace(letter, level)
    go("tracingFeedback")
  }
  const restartTracing = () => {
    setDrawPaths([])
    setCurrentPath("")
    currentPathRef.current = ""
    setProgress(0)
    setTraceTool("pen")
    setValidationError(false)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PEACH }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <BackBtn onClick={() => go("tracingHome")}/>
        <div className="px-3 py-1.5 rounded-full font-bold text-sm" style={{ background: `${BLUE}20`, color: BLUE, ...ff }}>
          Stage {level}
        </div>
      </div>

      <div className="px-5 mb-2">
        <h2 className="text-2xl font-bold" style={{ color: PURPLE, ...ffh }}>{isWord ? `Trace "${letter}"` : `Trace ${letter}`}</h2>
        <p className="text-sm" style={{ color: MUTED, ...ff }}>
          {level === 1 ? "Watch the pink line, then try it." : level === 2 ? "Follow the guide with your finger." : "Try it all by yourself."}
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { id: 1, label: "Arrows" },
            { id: 2, label: "Guide" },
            { id: 3, label: "Blank" },
          ].map(stage => (
            <div key={stage.id} className="rounded-2xl py-2 text-center"
              style={{ background: level === stage.id ? BLUE : "white", border: `1.5px solid ${level === stage.id ? BLUE : "rgba(153,194,255,0.28)"}` }}>
              <p className="text-xs font-bold" style={{ color: level === stage.id ? "white" : BLUE, ...ffh }}>Stage {stage.id}</p>
              <p className="text-[10px]" style={{ color: level === stage.id ? "white" : MUTED, ...ff }}>{stage.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 mx-5 flex flex-col items-center justify-center">
        {tracing && (
          <div className="flex gap-2 mb-3">
            {[
              { id: "pen" as const, label: "Draw", icon: PenLine },
              { id: "eraser" as const, label: "Erase", icon: Eraser },
            ].map(tool => {
              const Icon = tool.icon
              const active = traceTool === tool.id
              return (
                <button key={tool.id} onClick={() => { endDrawing(); setTraceTool(tool.id) }}
                  className="h-11 px-4 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-sm"
                  style={{ background: active ? BLUE : "white", color: active ? "white" : MUTED, ...ff }}>
                  <Icon size={18}/>
                  {tool.label}
                </button>
              )
            })}
          </div>
        )}
        <div
          className="w-full max-w-xs aspect-square rounded-3xl flex items-center justify-center relative shadow-sm overflow-hidden touch-none select-none"
          style={{ background: "white" }}
          onPointerDown={startDrawing}
          onPointerMove={moveDrawing}
          onPointerUp={endDrawing}
          onPointerCancel={endDrawing}
          onPointerLeave={endDrawing}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <line x1="15" y1="20" x2="85" y2="20" stroke="#D8D1DC" strokeWidth="0.8"/>
            <line x1="15" y1="48" x2="85" y2="48" stroke="#D8D1DC" strokeWidth="0.8" strokeDasharray="4 4"/>
            <line x1="15" y1="76" x2="85" y2="76" stroke="#D8D1DC" strokeWidth="0.8"/>

            {level < 3 && (
              <>
                <text x="50" y={textY} textAnchor="middle" fontSize={textSize} fontFamily={traceFont}
                  stroke={`${BLUE}45`} strokeWidth={isWord ? "1.2" : "1.6"} fill="none" strokeDasharray="4,4">{letter}</text>
                <text x="50" y={textY} textAnchor="middle" fontSize={textSize} fontFamily={traceFont}
                  stroke={PINK} strokeWidth={isWord ? "1.4" : "2"} fill="none" strokeDasharray="4,4"
                  opacity={tracing ? 1 : 0}
                  style={{ clipPath: `inset(0 ${100-clipWidth}% 0 0)` }}>
                  {letter}
                </text>
              </>
            )}

            {!isWord && level < 3 && strokes.map((stroke, i) => {
              const done = progress > i
              const active = tracing && progress === i
              return (
                <g key={`${letter}-${i}`}>
                  {level === 1 && (
                    <g>
                      <circle cx={stroke.label[0]} cy={stroke.label[1]} r="5" fill={done || active ? PINK : "white"} stroke={done || active ? PINK : BLUE} strokeWidth="1.5"/>
                      <text x={stroke.label[0]} y={stroke.label[1] + 3} textAnchor="middle" fontSize="7" fontWeight="700" fill={done || active ? "white" : BLUE}>{i + 1}</text>
                      {(() => {
                        const arrow = strokeArrowPosition(stroke)
                        return (
                          <g transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}>
                            <path d="M-4 0 L5 0" stroke={done || active ? PINK : BLUE} strokeWidth="2" strokeLinecap="round"/>
                            <path d="M1 -4 L5 0 L1 4" fill="none" stroke={done || active ? PINK : BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </g>
                        )
                      })()}
                    </g>
                  )}
                </g>
              )
            })}

            {isWord && level < 3 && wordSteps.map((step, i) => (
              <g key={`${letter}-${i}`}>
                <circle cx={step.x} cy={step.y} r="4.5" fill={progress > i ? PINK : "white"} stroke={progress > i ? PINK : BLUE} strokeWidth="1.4"/>
                {level === 1 && <text x={step.x} y={step.y + 2.8} textAnchor="middle" fontSize="6.5" fontWeight="700" fill={progress > i ? "white" : BLUE}>{step.n}</text>}
                {level === 1 && (
                  <g transform={`translate(${step.x + 8} ${step.y - 1})`}>
                    <path d="M-4 0 L5 0" stroke={progress > i ? PINK : BLUE} strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 -4 L5 0 L1 4" fill="none" stroke={progress > i ? PINK : BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                )}
              </g>
            ))}

            {drawPaths.map(path => (
              <path key={path.id} d={path.d} fill="none" stroke={PURPLE} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
            ))}
            {currentPath && <path d={currentPath} fill="none" stroke={PURPLE} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>}
          </svg>

          {level === 3 && drawPaths.length === 0 && !currentPath && (
            <span className="pointer-events-none text-xs font-bold opacity-50" style={{ color: MUTED, ...ff }}>Draw here</span>
          )}
        </div>

        <p className="text-xs mt-3 text-center" style={{ color: MUTED, ...ff }}>
          {!tracing ? (level === 3 ? "Tap START, then draw the letter." : "Tap START, then trace with your finger.") : traceTool === "eraser" ? "Rub over a line to erase it." : drawPaths.length ? "Nice drawing. Tap Done when finished." : "Draw on the board with your finger."}
        </p>
      </div>

      <div className="px-5 pb-6">
        {!tracing ? (
          <PrimaryBtn color={BLUE} onClick={() => { setTracing(true); setProgress(0); setDrawPaths([]); setCurrentPath(""); currentPathRef.current = ""; setTraceTool("pen") }}>
            <PenLine size={18}/> Start
          </PrimaryBtn>
        ) : (
          <div className="flex flex-col gap-3">
            <PrimaryBtn color={BLUE} disabled={drawPaths.length === 0 && !currentPath} onClick={finishTracing}>
              Done <Check size={18}/>
            </PrimaryBtn>
            <button onClick={restartTracing} className="w-full py-2 text-sm font-bold" style={{ color: MUTED, ...ff }}>
              Clear and try again
            </button>
            {level === 1 && (
              <div className="h-2 rounded-full" style={{ background: "#E0EEF8" }}>
                <motion.div className="h-full rounded-full" animate={{ width: `${(progress/totalSteps)*100}%` }} style={{ background: BLUE }}/>
              </div>
            )}
          </div>
        )}
      </div>

      {validationError && (
        <div className="fixed inset-0 z-[2147483646] flex items-center justify-center px-5" style={{ background: "rgba(61,43,78,0.22)" }}>
          <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-3xl p-5 text-center shadow-xl" style={{ background: PEACH }}>
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ background: `${PINK}18` }}>
              <RotateCcw size={28} style={{ color: PINK }}/>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: PURPLE, ...ffh }}>Try again</h3>
            <p className="text-sm mb-5" style={{ color: MUTED, ...ff }}>
              Follow the letter guide more closely to win the star.
            </p>
            <PrimaryBtn color={PINK} onClick={restartTracing}>
              Restart Level
            </PrimaryBtn>
          </motion.div>
        </div>
      )}
    </div>
  )
}

