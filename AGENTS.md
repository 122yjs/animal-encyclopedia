# AGENTS.md

## Project

Korean elementary-school animal encyclopedia — static vanilla HTML/CSS/JS site (no framework, no bundler, no npm dependencies beyond Node for the build script).

## Build commands

```bash
npm run build:distribution          # Teacher-facing build (no question link by default)
npm run build:distribution -- --questionUrl="https://..."  # With embedded question link
npm run build:internal               # Personal build, reads config/internal.local.json
```

The build script (`scripts/build.js`) copies `index.html`, `no-question.html`, `styles.css`, `app.js`, and `vendor/` into `dist/`, then writes a generated `dist/app-config.js`. There is no dev server — open `index.html` directly or serve `dist/` statically.

## Two HTML entry points

- `index.html` — full version with question-tool settings UI (source of truth)
- `no-question.html` — stripped version where question tool is completely disabled; auto-generated from `index.html` via `scripts/generate-no-question.js`

## Build-time config

`app-config.js` is overwritten at build time by `scripts/build.js`. The source version in the repo is the default fallback. Never edit `dist/app-config.js` directly.

- `config/internal.local.json` — gitignored; holds a personal MagicSchool question link for internal builds
- `QUESTION_URL` env var or `--questionUrl` CLI flag — injects a question link into distribution builds

## Deployment

Pushing to `main` triggers GitHub Actions (`.github/workflows/deploy-pages.yml`) which runs `build:distribution` and deploys `dist/` to GitHub Pages.

## Key runtime details

- Animal images load from Wikimedia at runtime (no local image assets)
- `app.js` reads `window.APP_CONFIG` at load time to enable/disable the question tool
- Student progress is stored in `localStorage` under `animal-encyclopedia-collected-v1`
- Region badges (adventure progression) are stored under `animal-encyclopedia-badges-v1`; legacy `completedMilestones` region entries are auto-migrated to badges on load
- Question tool URLs are shared via URL query param `?questionUrl=...` at runtime

## Adventure progression (Pokemon-style flow)

- Default landing view is the adventure map (`#mapView`); views are `map` / `catalog` / `game` via `setView`
- Region order comes from `journeyStops` in `app.js`; the story pointer is `getNextMissionFilter()` (first region **without a badge**)
- A region completes in two steps: collect all its animals (quiz flow) → win the region's classification **badge challenge** (`startBadgeChallenge`, game view `challenge` mode with a dynamically picked criterion via `pickChallengeCriterion`)
- The map's quest target is `getActiveQuestRegion()`: a teacher-pinned/current `state.missionRegion` without a badge wins over story order
- When changing mission/badge logic, keep the contract-test strings in `scripts/phase*-contract.test.mjs` intact (e.g. `data-catalog-mode="next-mission"`, reward sprite lines)

## What not to do

- Don't add npm dependencies without understanding this is a zero-dep static site
- Don't commit `config/internal.local.json` (it's gitignored and contains personal links)
- Don't edit `dist/` files directly — they are build artifacts
- Don't assume there are test/lint/typecheck commands — none are configured

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
