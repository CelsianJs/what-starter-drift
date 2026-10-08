# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-08
- Primary product surfaces: overview, board/list planner, card detail, activity trail, build notes
- Evidence reviewed: What Framework routing/state examples, current getting-started guidance, and the Vura deploy script pattern used by these starters

## Brand
- Personality: soft, spatial, collaborative, quietly energetic
- Trust signals: clear local persistence, visible activity, reversible reset/export, no remote tracker claims
- Avoid: enterprise Jira cosplay, fake live collaboration, generic kanban skins

## Product goals
- Goals: show shared state across board/list/detail routes, drag/drop and keyboard moves, filters, activity trail, local persistence, export, and generated static aliases
- Non-goals: live multiplayer, notifications, auth, real task sync, databases
- Success signals: users can move cards, filter work, open card details, export JSON, reset local state, and inspect how What patterns fit together

## Information architecture
- Navigation: Home, Planner, Activity, Build Notes
- Routes: `/`, `/planner`, `/cards/:id`, `/activity`, `/build`, `404`
- Hierarchy: summary, board/list controls, cards, detail editor, activity journal, implementation guide

## Visual language
- Color: quiet neutral-lilac canvas, plum controls, subtle lilac lanes and white cards
- Typography: Avenir Next/Segoe UI sans, 32px page headings,16px readable body and14px metadata
- Layout: the planner board is the homepage artifact; columns/list cards must be visible in the first viewport so Drift reads as a working planner rather than a landing page
- Composition: compact copy sits beside or above live cards; board columns carry spatial context with lane headers, counts, short due dates, named disabled edge moves, and movement controls
- Motion: short page/card entrance with reduced-motion fallback

## Accessibility
- Native buttons/selects/inputs, visible focus rings, one `h1` per route, keyboard movement controls in addition to drag/drop, disabled impossible moves, and reduced-motion support.

## Interaction states
- Empty filtered board columns and empty filter results have copy.
- Malformed storage resets to seed cards.
- Storage denied displays session-only copy while keeping edits working.
- Export is a local JSON download only.
- Card detail shows a card-scoped activity slice so updates are visible near the editor, not only on the activity route.

## Implementation constraints
- What Framework 0.13.10, what-compiler 0.13.10, Vite 6.4.3, Vitest 4.1.11, Vura CLI 0.3.0.
- No external assets, runtime network, tracking, auth, or paid service.
- Tests cover unit movement logic, browser flows, direct routes, storage denial, 404, keyboard focus, export, and screenshots.

## Operational refinement

The list derives its cards through an accessor rather than taking a one-time snapshot. Changing the assignee now updates rows while the list remains open. Full-board move buttons name the destination and disable impossible edge moves, matching the home preview. The mobile preview provides a lane-scroll cue and a focusable scrolling container.

Validation contract: Browser tests change Inez → Mara → All without changing view, assert one/two/five rows, and require the first/last lane's impossible moves to be disabled.

## Open questions

- [ ] Choose the final Vura subdomain during deployment.


## Modern interface consistency

The primary workspace, detail views and build guide share a bounded sans-serif hierarchy, natural-case 14px chrome, 44px targets and quiet surfaces. Do not reintroduce poster headings, decorative background grids, heavy shadows or pill-shaped navigation. Brand accents and functional visualizations remain distinct; operational information takes precedence over decoration.
