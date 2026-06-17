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
- `/home/split` — concept 1, split pane (roadmap left, learning pane right)
- `/home/unified` — concept 2, unified (flags + guarded releases as one product)
- `/home/active` — concept 3, active right pane (real SDK key, snippet, live-connect mock)
- anything else redirects to `/home/split`

The bottom "Home concept" switcher navigates between these. It is a review tool,
not part of the real product. basename comes from Vite's `base`; GitHub Pages
deep links/refreshes work via a `404.html` copy of `index.html`.

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

## Known non-functional / mocked
- All CTAs, checklist step clicks, sidebar nav, search, and the Create button are inert.
- Concept 3's live-connect detector and SDK key are mocked.
- The simulation is a scripted animation — no real SDK, flags, or metrics.
