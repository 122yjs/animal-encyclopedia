# Graph Report - animal-encyclopedia  (2026-09-13)

## Corpus Check
- 51 files · ~720,149 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 882 nodes · 1863 edges · 95 communities (85 shown, 10 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e0d05fcf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WorldMap
- app.js
- QuizBattleScene
- QuizBuilder.js
- OverworldScene
- OverworldScene.js
- normalizeHttpUrl
- init
- quiz-battle-layout.test.mjs
- build.js
- download-local-images.js
- WorldMapScene
- package.json
- getSelectedMissionAnimalIds
- ProgressStore.js
- hasBadge
- Current Improvement Roadmap
- game_ui
- Sprite Collection
- record-demo.mjs
- enterModalFocus
- AnimalSprites.js
- renderAnimalInfo
- generate-credits.js
- checkGame
- generate-no-question.js
- phase3-contract.test.mjs
- 조개
- manifest.json
- QuizBattleScene.js
- phase2-contract.test.mjs
- phase0-ux-contract.test.mjs
- habitat_categories
- 갈매기
- 개
- 개구리
- 개미
- BootScene
- 게
- Image Credits Page
- 고등어
- extract-legacy-data.mjs
- 고라니
- 고양이
- 공벌레
- 꿀벌
- 나비
- 낙타
- 너구리
- Owl Sprite
- 노루
- 다람쥐
- 다슬기
- 달팽이
- 도루묵도마뱀
- 돌고래
- 돌돔
- 두더지
- 딱따구리
- 메기
- 무당벌레
- 물방개
- 바다거북
- 박새
- 뱀
- 북극곰
- 북극여우
- 붕어
- 사막 딱정벌레
- 사막 뱀
- 사막여우
- 산양
- 소라
- 송사리
- 수달
- 오징어
- 왜가리
- 전복
- 지렁이
- 참새
- 청둥오리
- 토끼
- 펭귄
- 피라미
- 해마
- 해삼
- 호랑이
- phase1-mission-contract.test.mjs
- README.md
- Demo Recorder Skill
- legacy/package.json

## God Nodes (most connected - your core abstractions)
1. `init()` - 50 edges
2. `WorldMap` - 42 edges
3. `QuizBattleScene` - 36 edges
4. `OverworldScene` - 29 edges
5. `createWoodButton()` - 24 edges
6. `createWoodPanel()` - 22 edges
7. `WorldMapScene` - 21 edges
8. `renderAnimalInfo()` - 17 edges
9. `updateProgress()` - 16 edges
10. `renderAnimals()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `battleCopyCases` --calls--> `buildQuestions()`  [EXTRACTED]
  scripts/quiz-battle-layout.test.mjs → src/systems/QuizBuilder.js
- `Current Improvement Roadmap` --links_to--> `Development Rules and Project Structure`  [EXTRACTED]
  docs/ROADMAP.md → AGENTS.md
- `Current Improvement Roadmap` --links_to--> `Changelog`  [EXTRACTED]
  docs/ROADMAP.md → CHANGELOG.md
- `Current Improvement Roadmap` --links_to--> `Project README`  [EXTRACTED]
  docs/ROADMAP.md → README.md
- `battleCopyCases` --calls--> `buildQuickFacts()`  [EXTRACTED]
  scripts/quiz-battle-layout.test.mjs → src/systems/ObservationBuilder.js

## Import Cycles
- None detected.

## Communities (95 total, 10 thin omitted)

### Community 1 - "app.js"
Cohesion: 0.05
Nodes (70): animalIds, animals, appConfig, applyImageFallback(), applyResolvedImage(), buildDistinctiveFeatureQuestion(), buildObservationDetails(), buildQuestions() (+62 more)

### Community 2 - "QuizBattleScene"
Cohesion: 0.13
Nodes (7): DexScene, QuizBattleScene, getQuestionTypeLabel(), createWoodButton(), createWoodPanel(), fitTextToBox(), playEmote()

### Community 3 - "QuizBuilder.js"
Cohesion: 0.12
Nodes (30): buildObservationDetails(), directionParticle(), getHintSection(), hasFinalConsonant(), lifeBrief(), lifestyleExplanation(), subjectParticle(), topicParticle() (+22 more)

### Community 4 - "OverworldScene"
Cohesion: 0.13
Nodes (4): encounterSurface(), OverworldScene, isGateOpen(), createVirtualPad()

### Community 5 - "OverworldScene.js"
Cohesion: 0.30
Nodes (11): gates, MAP_H, MAP_W, PATH_Y, regionAtTile(), regionById, regions, TILE (+3 more)

### Community 6 - "normalizeHttpUrl"
Cohesion: 0.13
Nodes (27): applyQuestionToolMode(), buildQuestionRoomUrlFromCode(), buildShareLink(), canOpenQuestionSettings(), clearQuestionSettings(), getCompactQuestionRoomCode(), getDefaultQuestionUrlPlaceholder(), getQuestionUrlFromPageUrl() (+19 more)

### Community 7 - "init"
Cohesion: 0.15
Nodes (37): activateMissionRegion(), bindMissionPanel(), bindTeacherMissionControls(), bindViewTabs(), closeDetail(), closeReward(), downloadQrImage(), getCollectedProgramCount() (+29 more)

### Community 8 - "quiz-battle-layout.test.mjs"
Cohesion: 0.14
Nodes (26): activateNamedButton(), activateSceneButton(), assertContained(), assertHidden(), assertInCanvas(), battleCopyCases, clickBounds(), DIST (+18 more)

### Community 9 - "build.js"
Cohesion: 0.13
Nodes (21): assertHttpUrl(), buildConfig(), copyStaticDirectory(), copyStaticFiles(), defaultQuestionTool, directoriesToCopy, dist, filesToCopy (+13 more)

### Community 10 - "download-local-images.js"
Cohesion: 0.14
Nodes (20): appPath, detailsDir, download(), downloadLocalImages(), downloadWithFallback(), fs, getExtension(), imagesDir (+12 more)

### Community 12 - "package.json"
Cohesion: 0.10
Nodes (19): dependencies, phaser, devDependencies, playwright-core, vite, name, private, scripts (+11 more)

### Community 13 - "getSelectedMissionAnimalIds"
Cohesion: 0.13
Nodes (27): applyInitialMissionSettings(), decodeCompactMissionAnimalMask(), encodeCompactMissionAnimalMask(), getAnimalsForFilter(), getCompactMissionRegionCode(), getCompactMissionSelectionEntries(), getCurrentMissionPreset(), getDefaultMissionAnimalIds() (+19 more)

### Community 14 - "ProgressStore.js"
Cohesion: 0.24
Nodes (14): REGION_ORDER, awardBadge(), BADGE_KEY, collectAnimal(), isCollected(), readBadgeMap(), readCollected(), resetAll() (+6 more)

### Community 15 - "hasBadge"
Cohesion: 0.16
Nodes (11): totalSpawnCount(), config, game, TitleScene, MAP_POINTS, ORDER_LABELS, badgeCount(), findNewBadgeRegion() (+3 more)

### Community 16 - "Current Improvement Roadmap"
Cohesion: 0.15
Nodes (15): Development Rules and Project Structure, Changelog, 2nd Improvement Plan, 3rd Progress Report, Game Mobile UX Draft, Improvement Plan, UI Redesign V2 Changes, UX Evaluation and Improvement Plan (+7 more)

### Community 17 - "game_ui"
Cohesion: 0.30
Nodes (12): animal_quiz, animal_registration, encyclopedia_master, feedback_visual, final_mission, final_mission_preview, game_ui, image_creator (+4 more)

### Community 18 - "Sprite Collection"
Cohesion: 0.13
Nodes (18): achievement_badge, animal_encyclopedia, capture_functionality, collectible_item, gamification_element, capture_ball, treasure_chest, gem_item (+10 more)

### Community 19 - "record-demo.mjs"
Cohesion: 0.19
Nodes (13): animalIdx, args, __dirname, DIST, findChromium(), main(), MEDIA, MIME (+5 more)

### Community 20 - "enterModalFocus"
Cohesion: 0.10
Nodes (23): clearOnboardingHighlights(), closeGuideModal(), closeQrExpand(), closeSettings(), completeOnboarding(), enterModalFocus(), exitModalFocus(), getFocusableElements() (+15 more)

### Community 21 - "AnimalSprites.js"
Cohesion: 0.17
Nodes (14): ANIMAL_SKINS, BALL_SHAPE, BALL_SKIN, colorFor(), DEFAULTS, ensureAnimalAnimation(), ensureAnimalTexture(), ensureBallTexture() (+6 more)

### Community 22 - "renderAnimalInfo"
Cohesion: 0.13
Nodes (23): answerQuestion(), clearHintHighlight(), escapeAttribute(), escapeHTML(), finishQuiz(), nextQuestion(), readObservationReady(), renderAnimalEnvironmentNote() (+15 more)

### Community 23 - "generate-credits.js"
Cohesion: 0.23
Nodes (12): appPath, buildCreditsHtml(), escapeHTML(), fs, generateCredits(), outputPath, parseAnimals(), parseImageSources() (+4 more)

### Community 24 - "checkGame"
Cohesion: 0.32
Nodes (8): checkGame(), createGameToken(), isGamePlacementCorrect(), moveGameToken(), renderGameBoard(), startNewRound(), updateGameHints(), updateGameScore()

### Community 25 - "generate-no-question.js"
Cohesion: 0.23
Nodes (12): escapeRegExp(), fs, generateNoQuestion(), insertReplacement(), outputPath, path, removeBlocks, removeMarkedBlock() (+4 more)

### Community 26 - "phase3-contract.test.mjs"
Cohesion: 0.20
Nodes (9): generateToTemp(), indexPath, noQuestionPath, readHtml(), removeBlocks, replacementMarkers, rootDir, tempDir (+1 more)

### Community 27 - "조개"
Cohesion: 0.67
Nodes (3): 조개, detail, thumb

### Community 28 - "manifest.json"
Cohesion: 0.20
Nodes (9): 거미, detail, thumb, 부엉이, detail, thumb, 소금쟁이, detail (+1 more)

### Community 29 - "QuizBattleScene.js"
Cohesion: 0.16
Nodes (14): animalById, animals, collectedIdAliases, ENCOUNTER_ANIMAL_IDS, imageSources, localPhotoPath(), makeAnimal(), wikiUrl() (+6 more)

### Community 30 - "phase2-contract.test.mjs"
Cohesion: 0.33
Nodes (5): appPath, countAnimalRecords(), creditsPath, read(), rootDir

### Community 32 - "habitat_categories"
Cohesion: 0.20
Nodes (10): assets_sprites_forest_bg_sprite, assets_sprites_game_icons_sprite, assets_sprites_owl_mascot_sprite, assets_sprites_regions_badges_sprite, forest_background, forest_wildlife, game_ui_icons, habitat_categories (+2 more)

### Community 33 - "갈매기"
Cohesion: 0.67
Nodes (3): 갈매기, detail, thumb

### Community 34 - "개"
Cohesion: 0.67
Nodes (3): 개, detail, thumb

### Community 35 - "개구리"
Cohesion: 0.67
Nodes (3): 개구리, detail, thumb

### Community 36 - "개미"
Cohesion: 0.67
Nodes (3): 개미, detail, thumb

### Community 38 - "게"
Cohesion: 0.67
Nodes (3): 게, detail, thumb

### Community 40 - "고등어"
Cohesion: 0.67
Nodes (3): 고등어, detail, thumb

### Community 41 - "extract-legacy-data.mjs"
Cohesion: 0.17
Nodes (9): aliasesStart, animalsArray, animalsStart, buildStart, hasFinalEnd, imageSourcesCode, imageStart, quizCode (+1 more)

### Community 42 - "고라니"
Cohesion: 0.67
Nodes (3): 고라니, detail, thumb

### Community 43 - "고양이"
Cohesion: 0.67
Nodes (3): 고양이, detail, thumb

### Community 44 - "공벌레"
Cohesion: 0.67
Nodes (3): 공벌레, detail, thumb

### Community 45 - "꿀벌"
Cohesion: 0.67
Nodes (3): 꿀벌, detail, thumb

### Community 46 - "나비"
Cohesion: 0.67
Nodes (3): 나비, detail, thumb

### Community 47 - "낙타"
Cohesion: 0.67
Nodes (3): 낙타, detail, thumb

### Community 48 - "너구리"
Cohesion: 0.67
Nodes (3): 너구리, detail, thumb

### Community 50 - "노루"
Cohesion: 0.67
Nodes (3): 노루, detail, thumb

### Community 51 - "다람쥐"
Cohesion: 0.67
Nodes (3): 다람쥐, detail, thumb

### Community 52 - "다슬기"
Cohesion: 0.67
Nodes (3): 다슬기, detail, thumb

### Community 53 - "달팽이"
Cohesion: 0.67
Nodes (3): 달팽이, detail, thumb

### Community 54 - "도루묵도마뱀"
Cohesion: 0.67
Nodes (3): 도루묵도마뱀, detail, thumb

### Community 55 - "돌고래"
Cohesion: 0.67
Nodes (3): 돌고래, detail, thumb

### Community 56 - "돌돔"
Cohesion: 0.67
Nodes (3): 돌돔, detail, thumb

### Community 57 - "두더지"
Cohesion: 0.67
Nodes (3): 두더지, detail, thumb

### Community 58 - "딱따구리"
Cohesion: 0.67
Nodes (3): 딱따구리, detail, thumb

### Community 59 - "메기"
Cohesion: 0.67
Nodes (3): 메기, detail, thumb

### Community 60 - "무당벌레"
Cohesion: 0.67
Nodes (3): 무당벌레, detail, thumb

### Community 61 - "물방개"
Cohesion: 0.67
Nodes (3): 물방개, detail, thumb

### Community 62 - "바다거북"
Cohesion: 0.67
Nodes (3): 바다거북, detail, thumb

### Community 63 - "박새"
Cohesion: 0.67
Nodes (3): 박새, detail, thumb

### Community 64 - "뱀"
Cohesion: 0.67
Nodes (3): 뱀, detail, thumb

### Community 65 - "북극곰"
Cohesion: 0.67
Nodes (3): 북극곰, detail, thumb

### Community 66 - "북극여우"
Cohesion: 0.67
Nodes (3): 북극여우, detail, thumb

### Community 67 - "붕어"
Cohesion: 0.67
Nodes (3): 붕어, detail, thumb

### Community 68 - "사막 딱정벌레"
Cohesion: 0.67
Nodes (3): 사막 딱정벌레, detail, thumb

### Community 69 - "사막 뱀"
Cohesion: 0.67
Nodes (3): 사막 뱀, detail, thumb

### Community 70 - "사막여우"
Cohesion: 0.67
Nodes (3): 사막여우, detail, thumb

### Community 71 - "산양"
Cohesion: 0.67
Nodes (3): 산양, detail, thumb

### Community 72 - "소라"
Cohesion: 0.67
Nodes (3): 소라, detail, thumb

### Community 73 - "송사리"
Cohesion: 0.67
Nodes (3): 송사리, detail, thumb

### Community 74 - "수달"
Cohesion: 0.67
Nodes (3): 수달, detail, thumb

### Community 75 - "오징어"
Cohesion: 0.67
Nodes (3): 오징어, detail, thumb

### Community 76 - "왜가리"
Cohesion: 0.67
Nodes (3): 왜가리, detail, thumb

### Community 77 - "전복"
Cohesion: 0.67
Nodes (3): 전복, detail, thumb

### Community 78 - "지렁이"
Cohesion: 0.67
Nodes (3): 지렁이, detail, thumb

### Community 79 - "참새"
Cohesion: 0.67
Nodes (3): 참새, detail, thumb

### Community 80 - "청둥오리"
Cohesion: 0.67
Nodes (3): 청둥오리, detail, thumb

### Community 81 - "토끼"
Cohesion: 0.67
Nodes (3): 토끼, detail, thumb

### Community 82 - "펭귄"
Cohesion: 0.67
Nodes (3): 펭귄, detail, thumb

### Community 83 - "피라미"
Cohesion: 0.67
Nodes (3): 피라미, detail, thumb

### Community 84 - "해마"
Cohesion: 0.67
Nodes (3): 해마, detail, thumb

### Community 85 - "해삼"
Cohesion: 0.67
Nodes (3): 해삼, detail, thumb

### Community 86 - "호랑이"
Cohesion: 0.67
Nodes (3): 호랑이, detail, thumb

## Knowledge Gaps
- **255 isolated node(s):** `thumb`, `detail`, `thumb`, `detail`, `thumb` (+250 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WorldMap` connect `WorldMap` to `OverworldScene.js`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `OverworldScene` connect `OverworldScene` to `OverworldScene.js`, `hasBadge`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `QuizBattleScene` connect `QuizBattleScene` to `QuizBattleScene.js`, `hasBadge`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `init()` (e.g. with `checkGame()` and `clearQuestionSettings()`) actually correct?**
  _`init()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `thumb`, `detail`, `thumb` to the rest of the system?**
  _255 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0454728370221328 - nodes in this community are weakly interconnected._
- **Should `QuizBattleScene` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._