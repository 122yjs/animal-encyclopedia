# Graph Report - .  (2026-05-04)

## Corpus Check
- Large corpus: 173 files · ~558,492 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 336 nodes · 667 edges · 22 communities detected
- Extraction: 92% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.82)
- Token cost: 35,931 input · 5,127 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Main App UI Logic|Main App UI Logic]]
- [[_COMMUNITY_Gamified Webapp & Game|Gamified Webapp & Game]]
- [[_COMMUNITY_Core App Functions|Core App Functions]]
- [[_COMMUNITY_Share Link & Question Tool|Share Link & Question Tool]]
- [[_COMMUNITY_Build System|Build System]]
- [[_COMMUNITY_Development Docs & Plans|Development Docs & Plans]]
- [[_COMMUNITY_Animal UI Components|Animal UI Components]]
- [[_COMMUNITY_Gamification & Icons|Gamification & Icons]]
- [[_COMMUNITY_Question Generation|Question Generation]]
- [[_COMMUNITY_Content Rendering|Content Rendering]]
- [[_COMMUNITY_Mission Settings|Mission Settings]]
- [[_COMMUNITY_Image Download Script|Image Download Script]]
- [[_COMMUNITY_Image Handling|Image Handling]]
- [[_COMMUNITY_Quiz Flow|Quiz Flow]]
- [[_COMMUNITY_Onboarding & Storage|Onboarding & Storage]]
- [[_COMMUNITY_Modal Management|Modal Management]]
- [[_COMMUNITY_No-Question Gen & Tests|No-Question Gen & Tests]]
- [[_COMMUNITY_Game Sprites|Game Sprites]]
- [[_COMMUNITY_Demo Recording|Demo Recording]]
- [[_COMMUNITY_Phase 2 Tests|Phase 2 Tests]]
- [[_COMMUNITY_HTML Entry Points|HTML Entry Points]]
- [[_COMMUNITY_Owl Sprite|Owl Sprite]]

## God Nodes (most connected - your core abstractions)
1. `init()` - 21 edges
2. `Current Improvement Roadmap` - 15 edges
3. `renderAnimalInfo()` - 13 edges
4. `playSound()` - 13 edges
5. `game_ui` - 13 edges
6. `activateMissionRegion()` - 12 edges
7. `renderMissionPanel()` - 11 edges
8. `updateProgress()` - 11 edges
9. `renderShareLinkPanel()` - 10 edges
10. `resetProgress()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `openQuiz()` --calls--> `playSound()`  [INFERRED]
  gamified-animal-encyclopedia-webapp/src/App.tsx → app.js
- `handleQuizAnswer()` --calls--> `playSound()`  [INFERRED]
  gamified-animal-encyclopedia-webapp/src/App.tsx → app.js
- `handleSelectRegion()` --calls--> `playSound()`  [INFERRED]
  gamified-animal-encyclopedia-webapp/src/App.tsx → app.js
- `handleSelectAnimal()` --calls--> `playSound()`  [INFERRED]
  gamified-animal-encyclopedia-webapp/src/App.tsx → app.js
- `Main HTML Entry Point` --generates--> `No-Question Student Version`  [INFERRED]
  index.html → no-question.html

## Communities (29 total, 2 thin omitted)

### Community 0 - "Main App UI Logic"
Cohesion: 0.09
Nodes (44): activateMissionRegion(), applyQuestionToolMode(), bindMissionPanel(), bindTeacherMissionControls(), bindViewTabs(), canOpenQuestionSettings(), closeReward(), debounce() (+36 more)

### Community 1 - "Gamified Webapp & Game"
Cohesion: 0.09
Nodes (20): checkGame(), ensureAudioContext(), moveGameToken(), playSound(), renderGameBoard(), updateGameScore(), closeQuiz(), createInitialBoards() (+12 more)

### Community 2 - "Core App Functions"
Cohesion: 0.12
Nodes (14): buildObservationDetails(), getFeatureComparisonText(), getFeatureDistractorScore(), getFocusableElements(), getMeaningfulTokenOverlap(), getMeaningfulTokens(), handleModalKeydown(), lifeBrief() (+6 more)

### Community 3 - "Share Link & Question Tool"
Cohesion: 0.15
Nodes (20): buildShareLink(), clearQuestionSettings(), getQuestionUrlFromPageUrl(), getShareLinkCopy(), getShareLinkTargetPath(), hasCustomMissionSelections(), hydrateQuestionToolConfig(), isSharedStudentView() (+12 more)

### Community 4 - "Build System"
Cohesion: 0.19
Nodes (15): assertHttpUrl(), buildConfig(), copyStaticDirectory(), copyStaticFiles(), hasLocalImageAssets(), main(), parseArgs(), readJson() (+7 more)

### Community 5 - "Development Docs & Plans"
Cohesion: 0.13
Nodes (19): 2nd Improvement Plan, 3rd Progress Report, Development Rules and Project Structure, Changelog, Demo Recorder Skill, Game Mobile UX Draft, Graphify Instructions, Improvement Plan (+11 more)

### Community 6 - "Animal UI Components"
Cohesion: 0.3
Nodes (18): animal_card, animal_collection, animal_quiz, animal_registration, completion_star, encyclopedia_master, feedback_visual, final_mission (+10 more)

### Community 7 - "Gamification & Icons"
Cohesion: 0.13
Nodes (18): achievement_badge, animal_encyclopedia, capture_functionality, collectible_item, gamification_element, capture_ball, treasure_chest, gem_item (+10 more)

### Community 8 - "Question Generation"
Cohesion: 0.2
Nodes (14): buildDistinctiveFeatureQuestion(), buildQuestions(), buildSpecialEnvironmentQuestion(), getHabitatDistractors(), getMovementKey(), hasFinalConsonant(), makeDistinctiveFeatureOptions(), makeHabitatOptions() (+6 more)

### Community 9 - "Content Rendering"
Cohesion: 0.18
Nodes (13): escapeAttribute(), escapeHTML(), readObservationReady(), renderAnimalEnvironmentNote(), renderAnimalInfo(), renderAnimalRegionBadges(), renderCollectedAction(), renderObservationCheckItem() (+5 more)

### Community 10 - "Mission Settings"
Cohesion: 0.22
Nodes (13): applyInitialMissionSettings(), getCurrentMissionPreset(), getDefaultMissionAnimalIds(), getMissionAnimalIdsFromPageUrl(), getMissionAnimalsParam(), getMissionCandidateAnimals(), getMissionPreset(), getMissionRegionFromPageUrl() (+5 more)

### Community 11 - "Image Download Script"
Cohesion: 0.29
Nodes (11): download(), downloadLocalImages(), downloadWithFallback(), getExtension(), lookupWikipediaImage(), parseAnimals(), parseImageSources(), parseWiki() (+3 more)

### Community 12 - "Image Handling"
Cohesion: 0.2
Nodes (12): applyImageFallback(), createGameToken(), createImagePlaceholder(), dedupeSources(), escapeSvgText(), getImageSources(), getLocalImagePath(), isGamePlacementCorrect() (+4 more)

### Community 13 - "Quiz Flow"
Cohesion: 0.21
Nodes (12): answerQuestion(), clearHintHighlight(), finishQuiz(), nextQuestion(), renderFeedback(), renderObservationSummary(), renderQuickFacts(), renderQuiz() (+4 more)

### Community 14 - "Onboarding & Storage"
Cohesion: 0.2
Nodes (11): clearOnboardingHighlights(), completeOnboarding(), nextOnboardingStep(), openOnboarding(), renderOnboarding(), safeRemoveStorage(), safeSetStorage(), saveCollected() (+3 more)

### Community 15 - "Modal Management"
Cohesion: 0.2
Nodes (10): closeDetail(), closeGuideModal(), closeQrExpand(), closeSettings(), enterModalFocus(), exitModalFocus(), markSettingsModalSeen(), openGuideModal() (+2 more)

### Community 16 - "No-Question Gen & Tests"
Cohesion: 0.36
Nodes (7): escapeRegExp(), generateNoQuestion(), insertReplacement(), removeMarkedBlock(), replaceExactlyOnce(), generateToTemp(), readHtml()

### Community 17 - "Game Sprites"
Cohesion: 0.2
Nodes (10): forest_background, forest_bg_sprite, forest_wildlife, game_icons_sprite, game_ui_icons, habitat_categories, owl_character, owl_mascot_sprite (+2 more)

### Community 18 - "Demo Recording"
Cohesion: 0.6
Nodes (5): findChromium(), main(), prepareFinalCatch(), quietClick(), startServer()

### Community 20 - "HTML Entry Points"
Cohesion: 0.5
Nodes (4): Image Credits Page, React Version Entry Point, Main HTML Entry Point, No-Question Student Version

## Knowledge Gaps
- **18 isolated node(s):** `No-Question Student Version`, `Image Credits Page`, `React Version Entry Point`, `Integrated Development Plan`, `Game Mobile UX Draft` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `playSound()` connect `Gamified Webapp & Game` to `Main App UI Logic`, `Core App Functions`, `Image Handling`, `Quiz Flow`, `Onboarding & Storage`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `playSound()` (e.g. with `openQuiz()` and `handleQuizAnswer()`) actually correct?**
  _`playSound()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `No-Question Student Version`, `Image Credits Page`, `React Version Entry Point` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Main App UI Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Gamified Webapp & Game` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Core App Functions` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Development Docs & Plans` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._