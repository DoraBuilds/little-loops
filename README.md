# Little Loops

A routine-tracking app for kids and parents — morning/evening routines, streaks, mood tracking, and rewards.

## Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth) for signed-in household cloud sync, with local storage as the offline/local-only store
- Deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy-pages.yml`)

## Getting started

Requires Node.js.

```sh
# Clone the repository
git clone https://github.com/DoraBuilds/littleloops.git
cd littleloops

# Install dependencies
npm i

# Copy the env template and fill in your Supabase project values
cp .env.example .env

# Start the dev server (http://localhost:5173)
npm run dev
```

See `docs/supabase-setup.md` for how to configure the Supabase project the app connects to.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm test` — run the test suite (Vitest)

## Deployment

Every push to `main` builds and deploys automatically to GitHub Pages via GitHub Actions. `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are supplied to the build as repository secrets.
