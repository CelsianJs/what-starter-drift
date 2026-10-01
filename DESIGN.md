# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-01
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
- Color: lilac canvas, peach warmth, plum controls, white cards
- Typography: heavy system headings and plain readable body text
- Layout: the planner board is the homepage artifact; columns/list cards must be visible in the first viewport so Drift reads as a working planner rather than a landing page
- Composition: compact copy sits beside or above live cards; board columns carry spatial context with lane headers, counts, and movement controls
- Motion: short page/card entrance with reduced-motion fallback

## Accessibility
- Native buttons/selects/inputs, visible focus rings, one `h1` per route, keyboard movement controls in addition to drag/drop, and reduced-motion support.

## Interaction states
- Empty filtered board columns and empty filter results have copy.
- Malformed storage resets to seed cards.
- Storage denied displays session-only copy while keeping edits working.
- Export is a local JSON download only.

## Implementation constraints
- What Framework 0.13.10, what-compiler 0.13.10, Vite 6.4.3, Vitest 4.1.11, Vura CLI 0.3.0.
- No external assets, runtime network, tracking, auth, or paid service.
- Tests cover unit movement logic, browser flows, direct routes, storage denial, 404, keyboard focus, export, and screenshots.

## Open questions
- [ ] Choose the final Vura subdomain during deployment.
