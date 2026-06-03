# Parent Account MVP Scope

## Goal

Introduce parent accounts and cloud sync without breaking the current shared-device child experience.

This phase is about making Little Loops usable across devices and households, not about making children log in or turning the app into a full family-management platform.

## Product Decision

The first account MVP should be:

- parent-only login
- one household per account
- no child login
- one shared device mode after parent setup
- import existing browser-local family data into the logged-in household

## What the Parent Can Do

In the first account MVP, a signed-in parent can:

- create an account
- sign in and sign out
- create their household automatically on first login
- create and edit child profiles
- edit routines, schedules, and home scene
- sync those changes across devices tied to the same account
- import existing local-only setup from the current browser

## What the Child Can Do

Children do not authenticate.

The child experience should stay simple:

- open the app on a shared device
- see child profiles
- select their profile
- complete the routine

No email, password, PIN, or individual child account should be introduced in this phase.

## Household Model

### MVP rule

One parent account creates one household.

That household contains:

- household settings
- child profiles
- routine definitions
- schedules
- daily progress

### Out of scope

- one parent managing multiple households
- co-parent invites
- grandparents/caregivers with separate roles

## First-Run Account UX

### New parent with no local data

1. Parent opens the app.
2. Parent chooses `Create account` or `Sign in`.
3. After successful login, the app creates a household automatically.
4. The parent starts the same profile-and-routine setup flow we already have.

### Parent with existing local data on this device

1. Parent signs in.
2. The app detects local `little_loops_data`.
3. The parent sees a clear import choice:
   - `Import this family setup`
   - `Start fresh instead`
   - do not silently merge
4. If import succeeds:
   - local data is copied into the household
   - cloud becomes the canonical source
   - local data remains temporarily as fallback until sync is confirmed
5. If import fails:
   - local data is preserved
   - the parent sees a retry path

## Import UX Rules

The import prompt should be calm and explicit.

Recommended copy shape:
- headline: `Bring your family setup with you`
- body: `We found routines already saved on this device. You can import them into your account or start fresh.`

### Parent choices

#### Import this family setup

Use this when the existing local device data is the family they want to keep.

#### Start fresh instead

Use this when the account should not use the current browser's saved routines.

#### Not now

Optional, but helpful if the parent wants to explore login first.

Recommendation:
- include `Import` and `Start fresh`
- omit `Not now` in the first version unless testing shows the step feels too abrupt

### Import rules

- preserve child ordering where possible
- preserve avatars and home scene
- preserve schedules exactly
- preserve routine contents exactly
- do not silently replace cloud data with local data
- do not silently replace local data with cloud data

Same-day progress needs an explicit rule.

Recommendation for MVP:
- import profile and routine configuration first
- treat daily completion state as device-local on the day of import
- start cloud-synced daily progress fresh on the next day boundary

That is less magical, but much safer than trying to merge same-day checkmarks across devices in the first account release.

## Shared Device Behavior

After the parent signs in on a shared device:

- the device can stay in a household-ready state
- children should still land in the child home screen, not a login screen
- parent settings remain parent-gated as they are today

This means the authentication layer should primarily affect:
- account entry
- app bootstrap
- sync

It should not interrupt the child routine flow every time the app opens.

If the parent signs out later, the shared device should keep the last synced household available for child use by default. The signed-out state should affect account management, not suddenly strand children behind a login wall.

## Success State

The account MVP is successful if:

- a new parent can sign up and set up children from scratch
- an existing local-only family can import without losing data
- a signed-in parent can use the app on more than one device
- the child flow remains as simple as the current MVP

## Failure States We Must Handle

### Login succeeds, household bootstrap fails

Show:
- clear retry state
- no partial child-facing app load

### Existing local setup is incomplete

If the browser has partial setup data and the parent signs in, the import path should preserve the incomplete state instead of marking the household fully configured by accident.

### Import fails

Show:
- import failed message
- retry option
- start fresh option

Do not delete local data.

### No internet after login

Show:
- clear offline state
- existing local/shared-device experience where possible

The child home screen should still be reachable from the shared device if a household was already synced locally.

## Explicitly Out of Scope

Not in this phase:

- child accounts
- co-parent invites
- multiple households per account
- reward syncing
- admin dashboards
- child progress history analytics
- avatar generation from photos
- silent cross-device merge of same-day task completion
- cloud-backed destructive reset semantics beyond the current local-device actions

## Recommended Build Order

1. Parent account scope approved
2. Local model normalization completed
3. Supabase auth shell added
4. Household schema and RLS added
5. Local-to-cloud import flow added
6. Shared-device signed-in behavior polished

## Final Recommendation

The account MVP should feel like this:

- parents authenticate
- households own the data
- children still just tap their profile and begin

That preserves the best part of the current product while unlocking sync and future growth.
