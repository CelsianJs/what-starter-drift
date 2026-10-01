# Drift

Drift is a complete What Framework starter for a local project planner. It demonstrates board and list views, native drag/drop, keyboard move controls, assignee and due-date metadata, activity history, JSON export, routeable card details, storage fallbacks, and a Vura-ready static build.

## Prerequisites

- Node.js 22.x
- npm 10+ (bundled with current Node 22 releases)
- After `npm ci`, install Playwright Chromium for browser verification: `npx playwright install chromium`
- Vura Platform credentials for deployment

## Run it

```bash
npm ci
npm run dev
```

Try these flows:

- Move a card with drag/drop on `/planner`.
- Use Move left/right buttons for keyboard/touch-friendly movement.
- Switch to List view, filter by assignee, and open `/cards/:id`.
- Export the planner JSON locally and reset the board.
- Visit `/build` for the agent-readable implementation notes.

## Build and test

```bash
npm run test
npm run build
npm run test:browser
```

`npm run verify` runs all three. Browser tests save screenshots under `test-results/screenshots`.
On minimal Linux CI images that do not already include browser system libraries, use `npx playwright install --with-deps chromium` instead.

## Reset local state

```js
localStorage.removeItem('what-starter-drift-v1')
```

The Planner page also includes a reset action.

## Deploy on Vura

```bash
npm ci
npx vura-platform login
npx vura-platform projects
npm run deploy:vura
```

Use `npm run deploy:vura:prod` for a production upload. Planned public repo: `CelsianJs/what-starter-drift`.

## Source map for agents

- `src/state/board.js` — signals, computed board/list state, movement actions, activity, export, schema validation, and guarded persistence.
- `src/data/projects.js` — synthetic cards, columns, assignees, and sort helpers.
- `src/routes.js` — route table and metadata.
- `src/pages/Build.jsx` — public implementation notes.
- `scripts/static-aliases.mjs` — generated card aliases, titles, and a real `404.html` for Vura static synthesis.

See [BUILD.md](./BUILD.md) and `/build` for the longer implementation guide.
