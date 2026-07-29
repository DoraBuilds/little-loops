# Little Loops — Claude Instructions

## Git & Deployment

**NEVER run `git reset`, `git checkout --`, or any destructive git command.**
The local working tree is always the source of truth. The remote may be behind.

When deploying:
1. `git add <specific files>` — only stage what you changed
2. `git commit` + `git push origin main`
3. GitHub Actions deploys automatically on push to main

If git is not initialized locally, run:
```
git init
git remote add origin https://github.com/DoraBuilds/little-loops.git
git fetch origin main
```
Then add only the files you changed — do NOT reset to origin.

## Stack
- React + Vite + TypeScript + Tailwind + shadcn/ui
- Supabase (Postgres + Auth) for signed-in household cloud sync; local storage remains the fallback/offline store and is still used for signed-out/local-only sessions
- Deployed to GitHub Pages via `.github/workflows/deploy-pages.yml`
- Dev server: `npm run dev` on port 5173

## Key files
- `src/lib/task-catalog.ts` — icon options, task library
- `src/components/TaskIcon.tsx` — Lucide icon map + `getTaskIconColor`
- `src/components/ParentSettings.tsx` — parent-facing settings UI
- `index.html` — og:image and meta tags
