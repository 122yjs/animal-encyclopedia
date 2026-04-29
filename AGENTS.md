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
- Question tool URLs are shared via URL query param `?questionUrl=...` at runtime

## What not to do

- Don't add npm dependencies without understanding this is a zero-dep static site
- Don't commit `config/internal.local.json` (it's gitignored and contains personal links)
- Don't edit `dist/` files directly — they are build artifacts
- Don't assume there are test/lint/typecheck commands — none are configured