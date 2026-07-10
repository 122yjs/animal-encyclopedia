# AGENTS.md

## Project

Korean elementary-school animal encyclopedia — **Phaser 3 collectathon RPG** (Vite + npm). Vertical slice: walk the overworld, quiz-battle animals, register in the dex.

Legacy static HTML/JS (teacher QR, no-question) lives under `legacy/` and is out of scope for `feature/phaser-collectathon-rpg`.

## Build commands

```bash
npm install
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview dist/
```

Legacy teacher builds (optional, from `legacy/`):

```bash
npm run build:distribution
npm run build:internal
```

## Key runtime details

- Entry: `index.html` → `src/main.js` (Phaser, 640×360 FIT, 5 scenes: Boot/Title/Overworld/QuizBattle/Dex)
- Animal data / quiz: `src/data/animals.js`, `src/systems/QuizBuilder.js` (ported from legacy `app.js`)
- Regions & spawns: `src/data/regions.js` — 5 regions × 8 spawns on one 120×34-tile world; gates between regions unlock via badges
- Terrain: `src/world/WorldMap.js` bakes tiles into one RenderTexture (RT `draw`/`stamp` ignores tint — ice zone uses a translucent `fill` overlay instead)
- Mini pixel sprites (overworld markers, dex silhouettes, dex-ball): generated at runtime from pixel maps in `src/world/AnimalSprites.js` — original art, no license constraints
- Battle flow: observe (3 checks) → turn-based quiz (hearts 3 / gauge 3) → dex-ball throw catch sequence; retreat on 0 hearts is penalty-free
- Encounter zones start un-armed and arm only after the player moves >58px away — prevents instant re-battle when fleeing back onto a marker
- Progress: `localStorage` keys `animal-encyclopedia-collected-v1` (collection), `animal-encyclopedia-region-clear-v1` (badges)
- Sprout Lands assets: `public/assets/sprout-lands/` — credit **Cup Nooble** in README / credits.html
- Animal portraits: Wikimedia URLs at runtime

## What not to do

- Don't add heavy npm deps beyond Phaser/Vite without need
- Don't commit `config/internal.local.json`
- Don't edit the plan file under `.cursor/plans/`
- Don't touch `feature/adventure-map-progression` work in this branch
- Teacher QR / no-question / settings are out of scope here

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
