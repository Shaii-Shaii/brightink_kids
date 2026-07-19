# Project Structure

This project is a React web app built with Vite and packaged for mobile with Capacitor. Keep the web app organized under `src`; keep Capacitor native projects at the root.

## Main Folders

| Path | Purpose | Edit here when |
| --- | --- | --- |
| `src/app` | App shell, routing/screen composition, app providers | Updating high-level navigation and app bootstrapping |
| `src/api` | Backend connections and generated API types | Working on Supabase clients, API clients, or backend contracts |
| `src/pages` | Feature-grouped screens | Adding or changing full app screens |
| `src/components` | Reusable React components | Creating shared UI used by multiple screens |
| `src/components/ui` | shadcn/Radix-style primitives | Updating buttons, dialogs, inputs, tabs, and other base UI |
| `src/components/figma` | Figma-export helper components | Adjusting generated Figma support components |
| `src/context` | React context providers | Adding global providers that are not Zustand stores |
| `src/data` | Static app content and mock data | Editing story templates, starter words, badges, and demo content |
| `src/hooks` | Reusable custom hooks | Extracting shared screen behavior or browser/native APIs |
| `src/services` | Frontend business logic and local persistence | Working on offline DB, sync, speech, scoring, or AI workflow helpers |
| `src/store` | App-wide client state | Updating Zustand stores and global state types |
| `src/utils` | Small pure helper functions | Adding formatting, validation, math, or parsing helpers |
| `src/styles` | Global CSS, Tailwind entry, fonts, theme tokens | Changing app-wide styling or theme values |
| `src/assets` | Images and imported static assets | Adding app images, icons, audio, or generated assets |
| `supabase` | Supabase schema and database artifacts | Changing backend database schema |
| `android` | Capacitor Android native project | Changing Android permissions, Gradle config, app icons, or native code |
| `ios` | Capacitor iOS native project | Changing iOS permissions, Xcode config, app icons, or native code |
| `docs` | Project notes and developer documentation | Adding guidance for future developers |

## Root Files

| File | Purpose |
| --- | --- |
| `package.json` | Scripts and JavaScript dependencies |
| `vite.config.ts` | Vite plugins, aliases, and asset handling |
| `capacitor.config.json` | Capacitor app id, name, and web build folder |
| `index.html` | Web app HTML entry |
| `postcss.config.mjs` | CSS processing config |

## Conventions

- Use the `@` alias for imports from `src` when a relative path becomes hard to read.
- Put reusable UI in `src/components`; keep one-off screen UI close to its feature folder in `src/pages`.
- Put backend clients and generated backend types in `src/api`.
- Put browser storage, sync helpers, speech helpers, and scoring helpers in `src/services`.
- Put shared application state in `src/store`.
- Do not move `android`, `ios`, or `supabase` into `src`; external tooling expects those folders at the project root.

## Screen Organization

`src/app/App.tsx` now coordinates app state and decides which screen to render. Screen implementations live in the matching `src/pages/*/screens.tsx` feature module, and each screen also has its own entry file such as `src/pages/onboarding/SplashScreen.tsx` for direct imports.

Use `docs/screen-map.md` for the exact destination of each screen.
