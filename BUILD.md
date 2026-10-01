# Build notes for agents

Drift is intentionally compact but shaped like a real planning app.

## What it demonstrates

- `signal` stores project cards, view mode, assignee filter, activity, and persistence/export status.
- `computed` derives filtered cards, board groups, and planner summary metrics.
- `effect` persists planner snapshots to `localStorage` and falls back to session-only edits if writes are denied.
- `what-framework/router` supplies overview, planner, card detail, activity, build, and fallback routes.
- Static content is authored in `src/data/projects.js`; every concrete `/cards/:id` route is emitted after build for Vura-friendly static hosting.

## State shape

```text
project fixtures -> card/filter/view signals -> computed board/list/detail routes -> activity log
```

The state module validates stored JSON. Corrupt schemas load seed cards rather than crashing. Card movement is available through both drag/drop and explicit move buttons.

## Vura static deployment notes

Drift is a pure Vite/What client app. It emits HTML aliases for routeable cards and a real `404.html`, then leaves manifest synthesis to Vura instead of writing `dist/manifest.json`.

The deploy config follows the shared Vura parser: no unsupported top-level `rewrites`, and catch-all header sources use `(.*)` rather than glob `*`. The relevant platform sources are `vura-platform/packages/shared/src/config/vura-config.ts`, `routing-rules.ts`, and the static synthesis/archive logic in the CLI.

Removing the unused Vura server runtime path keeps the static archive small; the local `createDistArchive()` check packs Drift at about 20.7 KiB.

## Actual issues handled

- Drag/drop alone excludes keyboard and touch workflows, so each card also has Move left/right actions.
- Generated static aliases were required for direct card links; a single SPA shell was not enough for the deployment target.
- Storage can be blocked or full, so persistence errors are caught and explained in the header.
- The homepage originally read like a landing page. The fix was to render a compact live board preview in `src/pages/Home.jsx`, with movement controls visible immediately.
- The board preview and full planner both read `boardGroups`, so the starter demonstrates one global state model across multiple route compositions.

## Problem → fix → proof

- Problem: pointer-only drag/drop is not enough. Fix: `moveCardStep()` powers explicit Move left/right buttons on cards. Proof: Playwright moves a card with a button, then verifies the activity log.
- Problem: direct `/cards/:id` links need to work as static files. Fix: aliases are generated from `src/data/projects.js`. Proof: `npm run build` prints `static aliases OK: 9 routes plus 404` and browser tests open every card.
- Problem: first viewport hid the product. Fix: homepage columns now show task cards before explanatory panels. Proof: screenshot tests capture the card-first homepage after asserting “Cards first.”
- Problem: invalid Vura schema fields and a manual manifest made static starters harder to deploy cleanly. Fix: remove unsupported rewrites, use `(.*)` matchers, and let Vura infer static routing from aliases. Proof: config parsing passes, no manual manifest is built, and the Vura CLI archive is about 20.7 KiB.

## Verification

Expected gates:

```bash
npm ci
npm run test
npm run build
npm run test:browser
```

The browser suite checks board/list switching, drag/drop, keyboard movement buttons, filtering, card details, activity, export, direct card routes, storage-denied fallback, 404, focusability, and mobile rendering.
