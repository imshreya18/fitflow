# FitFlow — Frontend UI Prototype

A polished, production-quality frontend prototype for FitFlow, a fitness and wellness app.
**Frontend/UI only** — no backend, database, auth, or real third-party APIs. Everything is powered by mock data in `src/data/mockData.js` so it can be swapped for real API calls later.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (CSS-variable based theme system)
- react-router-dom (routing)
- framer-motion (animations)
- recharts (weekly activity chart)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx              Entry point
  App.jsx                Routes
  index.css              Theme tokens (5 themes) + global styles
  context/
    ThemeContext.jsx      Theme, reduced motion, font scale
    AppStateContext.jsx   Notifications, toasts, music player state
  data/
    mockData.js           Single source of truth for all mock content
  components/
    ui/                   Button, Card, Badge, Input, Switch, Progress
    layout/                AppShell, Sidebar, BottomNavigation, Header
    ...                    WorkoutCard, CourseCard, MusicPlayer, AIMessage, etc.
  pages/
    Landing, Auth, Onboarding, Home, Courses, CourseDetails, Workout,
    Music, Community, Progress, Goals, Streaks, AICoach, Voice,
    Profile, Settings, Notifications
```

## Routes

| Path | Screen |
|---|---|
| `/` | Landing |
| `/auth` | Login / Signup |
| `/onboarding` | 5-step onboarding |
| `/app/home` | Home dashboard |
| `/app/courses` | Course discovery |
| `/app/courses/:id` | Course details |
| `/app/workout` | Focused workout flow |
| `/app/music` | Music for workouts |
| `/app/community` | Interests / community feed |
| `/app/progress` | Progress analytics |
| `/app/goals` | Goal tracker |
| `/app/streaks` | Streak experience |
| `/app/coach` | AI Coach chat |
| `/app/voice` | Voice assistant |
| `/app/profile` | Profile |
| `/app/settings` | Settings (incl. theme selector) |
| `/app/notifications` | Notification center |

## Theming

Five themes (Default, Midnight, Ocean, Sunset, Lavender) are implemented as CSS custom properties in `src/index.css`, toggled via a `data-theme` attribute on `<html>`. Switch themes in **Settings → Appearance**, or programmatically via `useTheme()` from `src/context/ThemeContext.jsx`. Persisted to `localStorage`.

## Connecting a real backend later

Everything that will eventually be backend-powered is isolated:

- **Data**: replace imports from `src/data/mockData.js` with API calls / React Query / SWR.
- **Auth**: `src/pages/Auth.jsx` and `src/pages/Onboarding.jsx` currently just navigate on submit — wire up real auth calls there.
- **AI Coach**: `src/pages/AICoach.jsx` has a local `responses` map — swap for a real model/API call.
- **Voice**: `src/pages/Voice.jsx` simulates listening/processing/speaking states with timeouts — replace with real speech-to-text / text-to-speech / voice-to-voice integration.
- **Video**: `src/components/VideoPlayer.jsx` is a UI shell — wire the play/pause/progress handlers to a real `<video>` element, YouTube embed, or custom player SDK.
- **Music**: `src/components/MusicPlayer.jsx` and `MiniPlayer.jsx` simulate playback — connect to a real audio element or music service SDK.

## Accessibility

Semantic HTML, labeled interactive elements, visible focus states via Tailwind defaults, `prefers-reduced-motion` support (plus a manual toggle in Settings), and a font-size scale control.
