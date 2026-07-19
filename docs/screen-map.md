# Screen Map

Use this file as the guide for where each screen belongs. `src/app/App.tsx` owns navigation and app-level state; `src/pages/*` owns the actual screen UI.

## `src/pages/onboarding`

- `SplashScreen.tsx` - app logo or mascot and loading animation.
- `IntroScreen.tsx` - parent-facing welcome slides.
- `AuthChoiceScreen.tsx` - sign up vs login choice.
- `SignUpScreen.tsx` - parent email/password or social sign-up.
- `LoginScreen.tsx` - parent login.
- `ForgotPasswordScreen.tsx` - password recovery request.
- `ResetPasswordScreen.tsx` - password reset form.
- `CreateProfileScreen.tsx` - child name, age, and avatar setup.
- `ProfileSelectorScreen.tsx` - multiple child profile selector.

## `src/pages/home`

- `HomeScreen.tsx` - child dashboard and main feature hub.
- `ProfileSwitchScreen.tsx` - parent-gated profile switching.

## `src/pages/stories`

- `StoryThemeScreen.tsx` - story topic or prompt selection.
- `StoryWritingScreen.tsx` - writing input and AI sentence starters.
- `StoryFeedbackScreen.tsx` - gentle grammar and spelling feedback.
- `StoryTitleScreen.tsx` - title entry and save confirmation.
- `StorySavedScreen.tsx` - celebration after saving.

## `src/pages/reading`

- `StoryLibraryScreen.tsx` - bookshelf of created and curated stories.
- `StoryDetailScreen.tsx` - story cover, title, and preview.
- `StoryReadingScreen.tsx` - page-by-page reading view.

## `src/pages/tracing`

- `TracingHomeScreen.tsx` - A-Z and practice selection.
- `TracingLetterScreen.tsx` - tracing canvas and stroke direction cues.
- `TracingFeedbackScreen.tsx` - retry/success feedback.

## `src/pages/vocabulary`

- `VocabHomeScreen.tsx` - word or category selection.
- `VocabPracticeScreen.tsx` - word image and microphone practice.
- `VocabFeedbackScreen.tsx` - pronunciation result and retry flow.

## `src/pages/comprehension`

- `ActivityIntroScreen.tsx` - post-story transition.
- `ActivityScreen.tsx` - reusable question/answer activity.
- `ActivityResultsScreen.tsx` - score summary, stars, and badges.

## `src/pages/progress`

- `MyProgressScreen.tsx` - child badges, streaks, and completed activity summary.
- `ParentDashboardScreen.tsx` - parent analytics and progress charts.

## `src/pages/settings`

- `SettingsHomeScreen.tsx` - parent-gated settings entry.
- `AccountSettingsScreen.tsx` - parent account details.
- `ChildProfileSettingsScreen.tsx` - child profile details.
- `ManageProfilesScreen.tsx` - add/remove child profiles.
- `NotificationSettingsScreen.tsx` - reminders and practice alerts.
- `SoundVoiceSettingsScreen.tsx` - sound and microphone settings.
- `AccessibilitySettingsScreen.tsx` - text size, contrast, and motion settings.
- `PrivacyDataSettingsScreen.tsx` - data transparency, export, and deletion.
- `AboutHelpScreen.tsx` - app version, support, FAQ, policies.

## `src/pages/utility`

- `LoadingStateScreen.tsx` - AI delay and sync loading states.
- `ErrorStateScreen.tsx` - no internet and recoverable errors.
- `EmptyStateScreen.tsx` - prompts for empty stories or progress.

## UI/UX Organization

- Keep navigation decisions in `src/app`.
- Keep repeated screen chrome, buttons, cards, modals, and form controls in `src/components`.
- Keep feature-only components beside their screen in the relevant `src/pages/*` folder.
- Keep children-facing screens visually simple, high contrast, and icon-led.
- Keep parent-facing screens denser and more data-oriented, especially settings and dashboard screens.
