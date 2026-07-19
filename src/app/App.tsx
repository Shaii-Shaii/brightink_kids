import { useCallback, useState } from "react"
import { motion } from "motion/react"
import {
  CURATED_STORIES,
  DEMO_PROFILES,
  INIT_USER_STORIES,
  PEACH,
  TRACING_PROGRESS,
  VOCAB_WORDS,
  VOWEL_PRACTICE,
  WORD_TRACING_PROGRESS,
} from "@/app/screenSupport"
import type { Profile, Screen, Story, VocabResult } from "@/app/screenSupport"
import {
  AuthChoiceScreen,
  CreateProfileScreen,
  ForgotPasswordScreen,
  IntroScreen,
  LoginScreen,
  ProfileSelectorScreen,
  ResetPasswordScreen,
  SignUpScreen,
  SplashScreen,
} from "@/pages/onboarding"
import { HomeScreen, ProfileSwitchScreen } from "@/pages/home"
import {
  StoryFeedbackScreen,
  StorySavedScreen,
  StoryThemeScreen,
  StoryTitleScreen,
  StoryWritingScreen,
} from "@/pages/stories"
import { StoryDetailScreen, StoryLibraryScreen, StoryReadingScreen } from "@/pages/reading"
import { TracingFeedbackScreen, TracingHomeScreen, TracingLetterScreen } from "@/pages/tracing"
import { VocabFeedbackScreen, VocabHomeScreen, VocabPracticeScreen } from "@/pages/vocabulary"
import { ActivityIntroScreen, ActivityResultsScreen, ActivityScreen } from "@/pages/comprehension"
import { MyProgressScreen, ParentDashboardScreen } from "@/pages/progress"
import {
  AboutHelpScreen,
  AccessibilitySettingsScreen,
  AccountSettingsScreen,
  ChildProfileSettingsScreen,
  ManageProfilesScreen,
  NotificationSettingsScreen,
  PrivacyDataSettingsScreen,
  SettingsHomeScreen,
  SoundVoiceSettingsScreen,
} from "@/pages/settings"
import { EmptyStateScreen, ErrorStateScreen, LoadingStateScreen } from "@/pages/utility"

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
  const [practiceStars, setPracticeStars] = useState(3)
  const [manualPracticeUnlocks, setManualPracticeUnlocks] = useState<string[]>([])
  const [letterProgress, setLetterProgress] = useState<Record<string, number>>(() => ({ ...TRACING_PROGRESS }))
  const [wordTracingProgress, setWordTracingProgress] = useState<Record<string, number>>(() => ({ ...WORD_TRACING_PROGRESS }))
  const [vowelProgress, setVowelProgress] = useState<Record<string, number>>(() =>
    Object.fromEntries(VOWEL_PRACTICE.map(v => [v.vowel, v.stars]))
  )
  const [vocabProgress, setVocabProgress] = useState<Record<string, number>>({})
  const [vocabResult, setVocabResult] = useState<VocabResult | null>(null)
  const [activityScores, setActivityScores] = useState<boolean[]>([])

  const go = useCallback((s: Screen) => setScreen(s), [])

  const addProfile = useCallback((p: Profile) => setProfiles(prev => [...prev, p]), [])
  const removeProfile = useCallback((id: string) => setProfiles(prev => prev.length <= 1 ? prev : prev.filter(p => p.id !== id)), [])
  const addStory = useCallback((s: Story) => setUserStories(prev => [s, ...prev]), [])
  const startStoryTheme = useCallback((theme: string) => {
    setSelectedTheme(theme)
    setStoryDraftTitle("")
    setStoryDraftPages([])
  }, [])
  const continueTracing = useCallback(() => {
    if (selectedTracingLevel < 3) {
      setSelectedTracingLevel(level => (level + 1) as 1|2|3)
      setScreen("tracingLetter")
    } else {
      setScreen("tracingHome")
    }
  }, [selectedTracingLevel])
  const markTracingLevelComplete = useCallback((item: string, level: 1|2|3) => {
    const isWordTrace = item.length > 1
    const key = isWordTrace ? item.toLowerCase() : item.toUpperCase()
    if (isWordTrace) {
      if ((wordTracingProgress[key] ?? 0) >= level) return
      setWordTracingProgress(prev => ({ ...prev, [key]: Math.max(prev[key] ?? 0, level) }))
    } else {
      if ((letterProgress[key] ?? 0) >= level) return
      setLetterProgress(prev => ({ ...prev, [key]: Math.max(prev[key] ?? 0, level) }))
    }
    setPracticeStars(stars => stars + 1)
  }, [letterProgress, wordTracingProgress])
  const handleVocabResult = useCallback((result: VocabResult) => {
    setVocabResult(result)
    if (!result.correct) return
    const target = result.target
    const upperTarget = target.toUpperCase()
    const isVowel = target.length === 1 && "AEIOU".includes(upperTarget)
    if (isVowel) {
      if ((vowelProgress[upperTarget] ?? 0) >= 3) return
      setVowelProgress(prev => ({ ...prev, [upperTarget]: Math.min((prev[upperTarget] ?? 0) + 1, 3) }))
    } else {
      if ((vocabProgress[target] ?? 0) >= 3) return
      setVocabProgress(prev => ({ ...prev, [target]: Math.min((prev[target] ?? 0) + 1, 3) }))
    }
    setPracticeStars(stars => stars + 1)
  }, [vocabProgress, vowelProgress])

  const allStories = [...userStories, ...CURATED_STORIES]

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <SplashScreen onDone={() => go("intro")}/>
      case "intro": return <IntroScreen onDone={() => go("authChoice")}/>
      case "authChoice": return <AuthChoiceScreen go={go}/>
      case "signup": return <SignUpScreen go={go}/>
      case "login": return <LoginScreen go={go}/>
      case "forgotPassword": return <ForgotPasswordScreen go={go}/>
      case "resetPassword": return <ResetPasswordScreen go={go}/>
      case "createProfile": return <CreateProfileScreen go={go} onAdd={addProfile}/>
      case "profileSelector": return <ProfileSelectorScreen profiles={profiles} go={go}/>
      case "home": return <HomeScreen profiles={profiles} go={go}/>
      case "profileSwitch": return <ProfileSwitchScreen profiles={profiles} go={go}/>
      case "storyTheme": return <StoryThemeScreen go={go} setTheme={startStoryTheme}/>
      case "storyWriting": return <StoryWritingScreen go={go} theme={selectedTheme} title={storyDraftTitle} pages={storyDraftPages} onPagesChange={setStoryDraftPages}/>
      case "storyFeedback": return <StoryFeedbackScreen go={go} theme={selectedTheme} title={storyDraftTitle} pages={storyDraftPages} onSave={addStory}/>
      case "storyTitle": return <StoryTitleScreen go={go} theme={selectedTheme} title={storyDraftTitle} onTitleChange={setStoryDraftTitle}/>
      case "storySaved": return <StorySavedScreen go={go}/>
      case "storyLibrary": return <StoryLibraryScreen stories={allStories} go={go} setCurrentStory={setSelectedStory}/>
      case "storyDetail": return <StoryDetailScreen story={selectedStory} go={go}/>
      case "storyReading": return <StoryReadingScreen story={selectedStory} go={go}/>
      case "tracingHome": return <TracingHomeScreen go={go} setTracingLetter={setSelectedLetter} setTracingLevel={setSelectedTracingLevel} letterProgress={letterProgress} wordProgress={wordTracingProgress} availableStars={practiceStars} setAvailableStars={setPracticeStars} manualUnlocks={manualPracticeUnlocks} setManualUnlocks={setManualPracticeUnlocks}/>
      case "tracingLetter": return <TracingLetterScreen letter={selectedLetter} level={selectedTracingLevel} go={go} onValidTrace={markTracingLevelComplete}/>
      case "tracingFeedback": return <TracingFeedbackScreen letter={selectedLetter} level={selectedTracingLevel} go={go} onContinue={continueTracing}/>
      case "vocabHome": return <VocabHomeScreen go={go} setCurrentWord={setSelectedWord} vowelProgress={vowelProgress} vocabProgress={vocabProgress}/>
      case "vocabPractice": return <VocabPracticeScreen word={selectedWord} go={go} onResult={handleVocabResult}/>
      case "vocabFeedback": return <VocabFeedbackScreen word={selectedWord} go={go} result={vocabResult}/>
      case "activityIntro": return <ActivityIntroScreen story={selectedStory} go={go}/>
      case "activityScreen": return <ActivityScreen story={selectedStory} go={go} onComplete={setActivityScores}/>
      case "activityResults": return <ActivityResultsScreen scores={activityScores} story={selectedStory} go={go}/>
      case "myProgress": return <MyProgressScreen go={go}/>
      case "parentDashboard": return <ParentDashboardScreen profiles={profiles} go={go}/>
      case "settingsHome": return <SettingsHomeScreen go={go}/>
      case "accountSettings": return <AccountSettingsScreen go={go}/>
      case "childProfileSettings": return <ChildProfileSettingsScreen profiles={profiles} go={go}/>
      case "manageProfiles": return <ManageProfilesScreen profiles={profiles} go={go} onRemove={removeProfile}/>
      case "notificationSettings": return <NotificationSettingsScreen go={go}/>
      case "soundVoiceSettings": return <SoundVoiceSettingsScreen go={go}/>
      case "accessibilitySettings": return <AccessibilitySettingsScreen go={go}/>
      case "privacyDataSettings": return <PrivacyDataSettingsScreen go={go}/>
      case "aboutHelp": return <AboutHelpScreen go={go}/>
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
