# App Store Release Plan (Routine Stars)

Date created: 2026-05-13

This plan covers the minimum work to ship Routine Stars as a real iOS + Android app with cloud accounts that persist across devices, while keeping the current child flow simple.

## Definitions (So Testing Is Unambiguous)

- **Web build**: `vite` app running in a browser tab.
- **Mobile app build**: iOS/Android app wrapper that loads the same web bundle locally (recommended: Capacitor).
- **Account persistence**: a parent can sign in on Device A, then sign in on Device B, and see the same household/children/routines (cloud is the source of truth).

## Milestones (Lean Path)

### M0: Stop The Bleeding (May 13, 2026)

Goal: clicking the emailed sign-in link reliably results in an authenticated session, and the household bootstrap runs (or fails with a clear reason).

Deliverables:
- Supabase client configured for PKCE.
- Callback finalization exchanges code/token into a session.
- Automated tests for client configuration and callback parsing.

### M1: Production Supabase Wiring (May 13–14, 2026)

Goal: production Supabase project is correctly configured so cross-device sign-in actually works.

Checklist:
- Apply migrations in `supabase/migrations/` to the remote Supabase project.
- Ensure `bootstrap_household` RPC exists and `grant execute` to `authenticated` is applied.
- Ensure Auth redirect allow-list includes:
  - `https://<your-domain>/auth/callback`
  - any staging domain callback (optional but recommended)
- Confirm the deployed environment includes:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Manual acceptance tests:
  - Sign up on laptop, create child profile, open on iPad, sign in, verify child profile appears.

### M2: Mobile Packaging (Capacitor) (May 14–17, 2026)

Goal: ship an actual iOS + Android wrapper around the existing web app.

Approach:
- Use Capacitor so we keep one codebase and one UI, and we can still use Supabase from the web layer.

Deliverables:
- Capacitor setup committed (config + scripts).
- `ios/` and `android/` projects generated and building locally.
- Release build instructions written in `docs/mobile-build.md`.

### M3: Deep Links For Email Sign-In (May 17–20, 2026)

Goal: magic links work inside the installed app (not just in Safari/Chrome).

Deliverables:
- iOS Universal Links + Android App Links configured.
- Supabase Auth redirect URLs include the app link domain.
- Mobile-specific callback testing:
  - Open link from Mail app -> should open Routine Stars app -> session established.

### M4: Release Hardening (May 20–22, 2026)

Goal: eliminate “works on my machine” issues and App Review blockers.

Deliverables:
- Privacy policy URL + in-app link (required for App Store).
- Crash/console noise reduced in production builds.
- Offline behavior defined:
  - signed-out child mode still works locally
  - signed-in but offline shows a clear state and does not lose local progress
- QA runbook in `docs/qa-runbook.md`.

### M5: Store Submission (Target: May 23–27, 2026)

Goal: submit to Apple App Store + Google Play.

Deliverables:
- iOS: bundle id, versioning, icons, launch screen, App Store screenshots, TestFlight build.
- Android: applicationId, versioning, icons, Play Console internal testing track.

## Work Breakdown (Engineering)

1. Auth/session: ensure callback finalization is robust across URL shapes.
2. Supabase: remote migration + redirect configuration + RLS verification.
3. Mobile wrapper: Capacitor scaffolding + build pipelines.
4. Deep linking: universal/app links + Supabase redirect alignment.
5. QA & tests: keep unit tests green; add lean integration tests where feasible.

## “Done” Criteria For Accounts

Accounts are “done enough to ship” when:
- Parent can sign up/sign in on two devices and see the same household configuration.
- A failure in household bootstrap shows a recoverable UI (retry/back) and does not corrupt local child mode.
- Sign-out does not erase local child mode on a shared device.

