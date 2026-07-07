# Guarded Release Simulator — prototype hand-off

A clickable prototype of the post-signup **Home / get-started** experience for
LaunchDarkly trials. It centers on a 30-second **guarded-release simulation**,
then per-product setup roadmaps. Built to evaluate Home designs + the sim, not
to ship as-is.

## Status: prototype, not a gonfalon branch
- Standalone **Vite + React + TypeScript** app. It is **not** wired into
  gonfalon and does not use gonfalon's build, routing, or packages.
- The Launchpad look comes from `@launchpad-ui/tokens` (CSS variables) plus the
  icon sprite, with **hand-built** token-styled components (`DsButton`, chips,
  etc.) in `dsblocks.tsx`, because `@launchpad-ui/components` (React Aria) cannot
  bundle in a standalone Vite app. Porting into gonfalon means swapping these
  for the real components.
- **CTAs and checklist steps are intentionally inert** (no navigation / side
  effects). Sidebar and top bar are visual chrome, not working nav.

## Run / build
```
npm install
npm run dev      # http://localhost:5173
npm run build    # static dist/
```

## Routes
Real client-side routes (react-router, BrowserRouter):
- `/home/spec` — THE home page: split pane v2 with the change spec applied (single trial surface, four tiles, create-first roadmaps with inline create step, every CTA wired to a stub of its real gonfalon destination). Reads `?firstAction=` (welcome-survey preselect) and `?product=`/`?step=` (selection restore when returning from a stub).
- `/welcome` — one-question welcome survey mock, incl. the Guarded release option and its Marketo payload annotation; Continue routes into `/home/spec`, AgentControl routes away to its own interstitial.
- `/dest/:page` — stub wireframes of the real destinations (flag targeting, create metric, SDK setup, integrations, triggers, sessions, new alert, observe, experiment design), each showing the real route + navigator helper, with Back-to-Home.
- everything else (including the old concept URLs `/home/split`, `/home/unified`, `/home/active`, `/home/split-v2`, `/home/experiment`) redirects to `/home/spec`.

The earlier review concepts 1-5 were removed on 2026-07-06 once the direction
settled; they live in git history (`HomeDSSplit.tsx`, `HomeV2SplitActive.tsx`,
`HomeDSSplitV2`/`HomeDSExperiment` in `HomeV2.tsx`) if a comparison is ever
needed. The bottom switcher is a review tool (Survey vs Home), not part of the
real product. basename comes from Vite's `base`; GitHub Pages deep
links/refreshes work via a `404.html` copy of `index.html`.

Live deploy: https://natdaalleykat.github.io/guarded-release-sim/ (redeploy
with `npm run deploy`).

## Where this maps in gonfalon
The real get-started / onboarding flow lives in:
- `packages/get-started/` — step taxonomy + gating
  (`src/types.ts`: `Create flag | Install SDK | Enable feature`,
  `src/useShouldShowOnboarding.ts`)
- `static/ld/components/GettingStarted/QuickstartGuide/` — the real
  Create-flag → Install-SDK → Enable-feature steps

This prototype's Home would land as a variant of that surface. The roadmap step
copy in `src/data/home.ts` maps onto those quickstart steps; the simulation is a
new standalone modal.

## Code map
- `src/App.tsx` — routes + the Home shell (sidebar, top bar, active concept, switcher, sim modal)
- `src/product/HomeDSSplit.tsx` — concepts 1 & 2 (Launchpad split pane; `unified` prop)
- `src/product/HomeV2SplitActive.tsx` — concept 3 (active right pane)
- `src/product/HomeV2.tsx` — concepts 4 & 5 (split pane v2 + experiment-led; inline create panes)
- `src/product/dsblocks.tsx` — Launchpad-token building blocks (icon, button, picker, hero)
- `src/product/blocks.tsx` — custom-styled blocks used by concept 3
- `src/product/Sidebar.tsx`, `TopBar.tsx` — chrome
- `src/data/home.ts` — products + per-product setup roadmaps (required vs nice-to-have)
- `src/data/product.ts`, `src/data/content.ts` — simulation copy + config
- `src/sim/` — the guarded-release simulation (wizard, run view, chart, sample checkout app)
- `src/components/icons.tsx`, `navicons.tsx` — icons

## What's accurate
Roadmap required-vs-optional steps and copy were verified against gonfalon
source + launchdarkly.com/docs: context kinds auto-register on first evaluation
(no setup step); a guarded rollout requires one metric (click/page-view need no
code); auto-rollback is opt-in per metric (notify is always on); observability
is an SDK plugin; the AI Configs (AgentControl) playground covers the LLM cost
during the trial. See the header comment in `src/data/home.ts`.

## Concepts 4 & 5 — feasibility notes
These explore an ideal "create something satisfying first, wire up the SDK later" flow, squared against what gonfalon actually does:
- **Inline boolean-flag creation** (concept 4, step 1) is real: the Quickstart's first step makes a boolean flag from one field with no code, and the real order is create → install SDK → toggle. The "create" in the prototype is a gesture (no real resource is made).
- **Flag-type pills** map to real flag templates (release / kill-switch / experiment / migration) plus documented use cases (config / entitlement).
- **The experiment scaffold** (concept 5, step 1) mirrors the shipped "Better button copy" templated experiment (gated behind `enableExperimentationGetStarted`): one click scaffolds a flag (Buy now / Get started), a `button-clicked` conversion metric, a "Test users" rule, and a frequentist 50/50 experiment. The real gate afterward is a **live SDK** — Start stays hidden until LD detects SDK traffic. Caveats: frequentist-only, uses a custom `track('button-clicked')` event (not auto click-tracking), and the in-product Launch step is still being built (`packages/experiments/src/templated/` + `empty-state/useCreateFrontendTemplatedExperiment.ts`).
- **Observability and AI Configs are unchanged** in v2 — they are SDK/create-first by nature, so there's no satisfying "create" to lead with.

## Known non-functional / mocked
- All CTAs, checklist step clicks, sidebar nav, search, and the Create button are inert.
- Concept 3's live-connect detector and SDK key are mocked.
- The simulation is a scripted animation — no real SDK, flags, or metrics.
