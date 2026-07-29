# Animal Characters gallery (archived 2026-07-29)

`AnimalCharacters.tsx` — a fully-built, hand-illustrated animal-picker
gallery (custom SVG characters, `AnimalCard`, `AnimalGallery`) from an
earlier avatar system. Superseded by the mascot system introduced in the
"Cozy Pastel redesign" (commit f0285a6) and unreferenced anywhere in the
app since.

Not deleted — kept in case it's wanted for a future UI pass. This
directory is outside `src/`, so it's excluded from the build, type
checking, and lint (`archive` is in `eslint.config.js`'s `ignores`) —
it's inert, just sitting in git history for reference.

To bring it back into the app: move the file back under `src/components/`,
remove `archive` from `eslint.config.js`'s ignores if this is the last
archived thing, and wire it up wherever it's needed.
