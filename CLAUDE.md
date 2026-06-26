# ChadWallet Clone

**READ FIRST:** [`_context/CONTEXT.md`](./_context/CONTEXT.md) — the master context (spec,
client ask, screen references, design system, plan, account checklist, and progress log).
Everything you need to continue is there. When the user says **"start"**, read CONTEXT.md,
look at the **Progress log → Next** step, and continue.

Screenshots of the real ChadWallet app to match: `_context/screenshots/`.
Logos: `_context/logos/`. Original spec PDF: `_context/spec-part-1.pdf`.

@AGENTS.md

## Conventions
- **Styling MUST use NativeWind** (className), not StyleSheet. Theme tokens live in
  `tailwind.config.js` (e.g. `bg-bg`, `text-text-secondary`, `bg-primary`).
- Use **Node 22** (`fnm use 22`) before running npm/expo.
- Data fetching via **React Query**; pull-to-refresh must really work.
- Secrets go in `.env` (never commit). See `.env.example`.
