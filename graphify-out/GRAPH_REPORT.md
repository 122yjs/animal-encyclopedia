# Graph Report - animal-encyclopedia  (2026-07-22)

## Corpus Check
- 31 files · ~719,422 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 804 nodes · 1856 edges · 42 communities detected
- Extraction: 93% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e13b2ba5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 49|Community 49]]

## God Nodes (most connected - your core abstractions)
1. `WorldMap` - 41 edges
2. `QuizBattleScene` - 35 edges
3. `OverworldScene` - 28 edges
4. `init()` - 21 edges
5. `createWoodPanel()` - 21 edges
6. `init()` - 21 edges
7. `createWoodButton()` - 20 edges
8. `WorldMapScene` - 20 edges
9. `TitleScene` - 16 edges
10. `Current Improvement Roadmap` - 15 edges

## Surprising Connections (you probably didn't know these)
- `openQuiz()` --calls--> `playSound()`  [INFERRED]
  gamified-animal-encyclopedia-webapp/src/App.tsx → app.js
- `handleQuizAnswer()` --calls--> `playSound()`  [INFERRED]
  gamified-animal-encyclopedia-webapp/src/App.tsx → app.js
- `handleSelectRegion()` --calls--> `playSound()`  [INFERRED]
  gamified-animal-encyclopedia-webapp/src/App.tsx → app.js
- `handleSelectAnimal()` --calls--> `playSound()`  [INFERRED]
  gamified-animal-encyclopedia-webapp/src/App.tsx → app.js
- `chromePath()` --calls--> `walk()`  [INFERRED]
  scripts/quiz-battle-layout.test.mjs → legacy/scripts/phase2-contract.test.mjs

## Communities (50 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (31): regionAtTile(), totalSpawnCount(), encounterSurface(), OverworldScene, TitleScene, directionParticle(), awardBadge(), badgeCount() (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (38): buildDistinctiveFeatureQuestion(), buildObservationDetails(), buildQuestions(), buildSpecialEnvironmentQuestion(), checkGame(), getCompactMissionSelectionEntries(), getFeatureComparisonText(), getFeatureDistractorScore() (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (10): QuizBattleScene, buildQuickFacts(), getHintSection(), getQuestionTypeLabel(), createHeartRow(), createTextButton(), createWoodButton(), createWoodPanel() (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (34): buildDistinctiveFeatureQuestion(), buildObservationDetails(), buildQuestions(), buildSpecialEnvironmentQuestion(), checkGame(), getFeatureComparisonText(), getFeatureDistractorScore(), getFocusableElements() (+26 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (25): assertHttpUrl(), buildConfig(), copyStaticDirectory(), copyStaticFiles(), hasLocalImageAssets(), main(), parseArgs(), readJson() (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (28): applyQuestionToolMode(), buildQuestionRoomUrlFromCode(), buildShareLink(), canOpenQuestionSettings(), clearQuestionSettings(), getCompactMissionRegionCode(), getCompactQuestionRoomCode(), getDefaultQuestionUrlPlaceholder() (+20 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (25): activateMissionRegion(), bindMissionPanel(), bindTeacherMissionControls(), bindViewTabs(), closeReward(), debounce(), getCompletedRegionCount(), getExplorerLevel() (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.19
Nodes (21): countAnimalRecords(), read(), walk(), activateNamedButton(), activateSceneButton(), assertContained(), assertHidden(), assertInCanvas() (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (16): ensureAudioContext(), playSound(), closeQuiz(), createInitialBoards(), createQuizQuestions(), finishQuiz(), handleClassificationDrop(), handleQuizAnswer() (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (22): buildObservationDetails(), hasFinalConsonant(), lifeBrief(), lifestyleExplanation(), subjectParticle(), topicParticle(), withParticle(), buildDistinctiveFeatureQuestion() (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (23): activateMissionRegion(), bindMissionPanel(), bindTeacherMissionControls(), bindViewTabs(), closeReward(), debounce(), getCompletedRegionCount(), getNextMissionFilter() (+15 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (23): clearOnboardingHighlights(), closeDetail(), closeGuideModal(), closeQrExpand(), completeOnboarding(), enterModalFocus(), exitModalFocus(), getCollectedProgramCount() (+15 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (19): applyInitialMissionSettings(), decodeCompactMissionAnimalMask(), encodeCompactMissionAnimalMask(), getCurrentMissionPreset(), getDefaultMissionAnimalIds(), getMissionAnimalIdsFromPageUrl(), getMissionAnimalsParam(), getMissionCandidateAnimals() (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (19): buildShareLink(), clearQuestionSettings(), getQuestionUrlFromPageUrl(), getShareLinkCopy(), getShareLinkTargetPath(), hasCustomMissionSelections(), hydrateQuestionToolConfig(), normalizeAppConfig() (+11 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (19): 2nd Improvement Plan, 3rd Progress Report, Development Rules and Project Structure, Changelog, Demo Recorder Skill, Game Mobile UX Draft, Graphify Instructions, Improvement Plan (+11 more)

### Community 17 - "Community 17"
Cohesion: 0.3
Nodes (18): animal_card, animal_collection, animal_quiz, animal_registration, completion_star, encyclopedia_master, feedback_visual, final_mission (+10 more)

### Community 18 - "Community 18"
Cohesion: 0.13
Nodes (18): achievement_badge, animal_encyclopedia, capture_functionality, collectible_item, gamification_element, capture_ball, treasure_chest, gem_item (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.18
Nodes (16): applyInitialMissionSettings(), getAnimalsForFilter(), getCurrentMissionPreset(), getDefaultMissionAnimalIds(), getMissionAnimalIdsFromPageUrl(), getMissionAnimalsParam(), getMissionCandidateAnimals(), getMissionPreset() (+8 more)

### Community 20 - "Community 20"
Cohesion: 0.16
Nodes (14): clearOnboardingHighlights(), closeDetail(), closeGuideModal(), closeQrExpand(), completeOnboarding(), enterModalFocus(), exitModalFocus(), nextOnboardingStep() (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.38
Nodes (12): download(), downloadLocalImages(), downloadWithFallback(), getExtension(), lookupWikipediaImage(), parseAnimals(), parseArgs(), parseImageSources() (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (13): escapeAttribute(), escapeHTML(), readObservationReady(), renderAnimalEnvironmentNote(), renderAnimalInfo(), renderAnimalRegionBadges(), renderCollectedAction(), renderObservationCheckItem() (+5 more)

### Community 23 - "Community 23"
Cohesion: 0.26
Nodes (13): getAnimalsForFilter(), getCollectedProgramCount(), getCompletedMilestones(), getFilterProgress(), getProgramAnimals(), getProgramTotal(), getStageStatus(), renderMasterReward() (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.2
Nodes (12): applyImageFallback(), createGameToken(), createImagePlaceholder(), dedupeSources(), escapeSvgText(), getImageSources(), getLocalImagePath(), isGamePlacementCorrect() (+4 more)

### Community 25 - "Community 25"
Cohesion: 0.23
Nodes (12): answerQuestion(), clearHintHighlight(), ensureAudioContext(), finishQuiz(), nextQuestion(), playSound(), renderFeedback(), renderQuiz() (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.21
Nodes (12): answerQuestion(), clearHintHighlight(), finishQuiz(), nextQuestion(), renderFeedback(), renderObservationSummary(), renderQuickFacts(), renderQuiz() (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.2
Nodes (12): applyImageFallback(), createGameToken(), createImagePlaceholder(), dedupeSources(), escapeSvgText(), getImageSources(), getLocalImagePath(), isGamePlacementCorrect() (+4 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (11): closeSettings(), markSettingsModalSeen(), safeRemoveStorage(), safeSetStorage(), saveCollected(), saveObservationReady(), saveQuestionToolUrl(), showToast() (+3 more)

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (11): escapeAttribute(), escapeHTML(), readObservationReady(), renderAnimalEnvironmentNote(), renderAnimalInfo(), renderAnimalRegionBadges(), renderCollectedAction(), renderObservationCheckItem() (+3 more)

### Community 31 - "Community 31"
Cohesion: 0.2
Nodes (10): closeSettings(), markSettingsModalSeen(), safeRemoveStorage(), safeSetStorage(), saveCollected(), saveObservationReady(), showToast(), toggleSound() (+2 more)

### Community 32 - "Community 32"
Cohesion: 0.2
Nodes (10): forest_background, forest_bg_sprite, forest_wildlife, game_icons_sprite, game_ui_icons, habitat_categories, owl_character, owl_mascot_sprite (+2 more)

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (5): findChromium(), main(), prepareFinalCatch(), quietClick(), startServer()

### Community 35 - "Community 35"
Cohesion: 0.29
Nodes (7): applyQuestionToolMode(), canOpenQuestionSettings(), hasSeenSettingsModal(), isSharedStudentView(), openFirstRunTeacherWorkflow(), openSettings(), renderTeacherMissionPanel()

### Community 36 - "Community 36"
Cohesion: 0.6
Nodes (3): localPhotoPath(), makeAnimal(), wikiUrl()

### Community 39 - "Community 39"
Cohesion: 0.5
Nodes (4): Image Credits Page, React Version Entry Point, Main HTML Entry Point, No-Question Student Version

## Knowledge Gaps
- **18 isolated node(s):** `No-Question Student Version`, `Image Credits Page`, `React Version Entry Point`, `Integrated Development Plan`, `Game Mobile UX Draft` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buildQuestions()` connect `Community 10` to `Community 8`, `Community 2`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `playSound()` connect `Community 9` to `Community 3`, `Community 12`, `Community 26`, `Community 27`, `Community 31`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `createWoodPanel()` connect `Community 2` to `Community 0`, `Community 14`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `createWoodPanel()` (e.g. with `.buildStage()` and `.createStatusCard()`) actually correct?**
  _`createWoodPanel()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `No-Question Student Version`, `Image Credits Page`, `React Version Entry Point` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._