# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — Preview production build
- `node scripts/generate-plan.js` — Regenerate `src/data/reading-plan.json` from `src/data/bible-books.json` (run once, output is committed)

## Architecture

React 18 + Vite SPA with Supabase (PostgreSQL + Auth) backend. Tailwind CSS 4 with custom navy/gold theme defined in `src/index.css` via `@theme`. React Router v7 handles routing in `App.jsx`.

### Dual-Mode Operation

The app runs in two modes based on whether `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`:

- **Supabase mode:** Real auth, Postgres storage, real-time subscriptions on `reading_progress`
- **Demo mode:** Falls back to `localStorage` keys (`iogc365_demo_user`, `iogc365_progress`, `iogc365_quizzes`, `iogc365_quiz_results`). Demo users get admin role automatically.

The `supabaseConfigured` boolean exported from `src/lib/supabase.js` controls this. Every hook (`useReadingProgress`, `useQuizzes`, `useAllUsersProgress`) branches on it internally.

### Reading Plan Data Pipeline

`scripts/generate-plan.js` distributes 1,189 KJV Bible chapters across 313 reading days (Mon–Sat, Apr 1 2026 – Mar 31 2027, Sundays off). First 250 days get 4 chapters, remaining 63 get 3. Output is static JSON at `src/data/reading-plan.json` — all calendar/dashboard views consume this directly, no DB queries for the schedule.

### Auth & Authorization

- `AuthContext` wraps the app; `ProtectedRoute` guards routes with optional `adminOnly` prop
- Admin role is set manually in the Supabase `profiles` table (`role: 'admin'`)
- Supabase trigger `handle_new_user()` auto-creates a `profiles` row on signup
- RLS policies enforce per-user data isolation; all authenticated users can read all profiles (needed for admin dashboard)

### Key Patterns

- **Optimistic UI:** `toggleDay()` updates state immediately, reverts on Supabase error
- **Streak calculation:** Based on consecutive *reading plan days*, not calendar days (see `progressHelpers.js`)
- **Chapter formatting:** `formatChapters()`/`formatChaptersShort()` group consecutive chapters from the same book (e.g., "Gen 1-4" not "Gen 1, Gen 2, Gen 3, Gen 4")
- **Quiz questions:** Stored as JSONB array with shape `{text, options: string[4], correctIndex, explanation}`
- **Print support:** `PrintablePlanPage` uses CSS `@media print` rules; `.no-print` class hides elements when printing

### Database Schema

Four tables defined in `supabase/migrations/001_initial_schema.sql`: `profiles`, `reading_progress` (unique on user_id + reading_date), `quizzes`, `quiz_results`. All have RLS enabled.
