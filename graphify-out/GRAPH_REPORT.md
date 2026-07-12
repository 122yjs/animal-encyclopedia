# Graph Report - animal-encyclopedia  (2026-07-12)

## Corpus Check
- 13 files · ~497,196 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 556 nodes · 1263 edges · 26 communities detected
- Extraction: 96% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea31d16a`
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
- [[_COMMUNITY_Community 32|Community 32]]

## God Nodes (most connected - your core abstractions)
1. `init()` - 24 edges
2. `init()` - 21 edges
3. `updateProgress()` - 16 edges
4. `renderMissionPanel()` - 15 edges
5. `Current Improvement Roadmap` - 15 edges
6. `playSound()` - 14 edges
7. `normalizeHttpUrl()` - 14 edges
8. `activateMissionRegion()` - 13 edges
9. `getProgramTotal()` - 13 edges
10. `renderAnimalInfo()` - 13 edges

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

## Communities (33 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (76): activateMissionRegion(), applyInitialMissionSettings(), areAllBadgesEarned(), awardRegionBadge(), bindAdventureMap(), bindMissionPanel(), bindTeacherMissionControls(), bindViewTabs() (+68 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (61): activateMissionRegion(), applyInitialMissionSettings(), applyQuestionToolMode(), bindMissionPanel(), bindTeacherMissionControls(), bindViewTabs(), canOpenQuestionSettings(), debounce() (+53 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (21): getCompactMissionSelectionEntries(), getFeatureComparisonText(), getFeatureDistractorScore(), getFocusableElements(), getMeaningfulTokenOverlap(), getMeaningfulTokens(), handleModalKeydown(), makeAnimal() (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (40): answerQuestion(), buildDistinctiveFeatureQuestion(), buildObservationDetails(), buildQuestions(), buildSpecialEnvironmentQuestion(), clearHintHighlight(), escapeAttribute(), escapeHTML() (+32 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (22): assertHttpUrl(), buildConfig(), copyStaticDirectory(), copyStaticFiles(), hasLocalImageAssets(), main(), parseArgs(), readJson() (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (20): checkGame(), ensureAudioContext(), moveGameToken(), playSound(), renderGameBoard(), updateGameScore(), closeQuiz(), createInitialBoards() (+12 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (27): applyQuestionToolMode(), buildQuestionRoomUrlFromCode(), buildShareLink(), canOpenQuestionSettings(), clearQuestionSettings(), getCompactMissionRegionCode(), getCompactQuestionRoomCode(), getDefaultQuestionUrlPlaceholder() (+19 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (25): clearOnboardingHighlights(), closeGuideModal(), closeQrExpand(), closeSettings(), completeOnboarding(), enterModalFocus(), exitModalFocus(), hasSeenSettingsModal() (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (20): buildShareLink(), clearQuestionSettings(), getQuestionUrlFromPageUrl(), getShareLinkCopy(), getShareLinkTargetPath(), hasCustomMissionSelections(), hydrateQuestionToolConfig(), isSharedStudentView() (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (19): 2nd Improvement Plan, 3rd Progress Report, Development Rules and Project Structure, Changelog, Demo Recorder Skill, Game Mobile UX Draft, Graphify Instructions, Improvement Plan (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.3
Nodes (18): animal_card, animal_collection, animal_quiz, animal_registration, completion_star, encyclopedia_master, feedback_visual, final_mission (+10 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (18): achievement_badge, animal_encyclopedia, capture_functionality, collectible_item, gamification_element, capture_ball, treasure_chest, gem_item (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (16): clearOnboardingHighlights(), closeGuideModal(), closeQrExpand(), closeReward(), closeSettings(), completeOnboarding(), enterModalFocus(), exitModalFocus() (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.15
Nodes (15): buildObservationDetails(), escapeAttribute(), lifeBrief(), lifestyleExplanation(), readObservationReady(), renderAnimalEnvironmentNote(), renderAnimalInfo(), renderAnimalRegionBadges() (+7 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (15): buildDistinctiveFeatureQuestion(), buildQuestions(), buildSpecialEnvironmentQuestion(), getHabitatDistractors(), getMovementKey(), hasFinalConsonant(), makeDistinctiveFeatureOptions(), makeHabitatOptions() (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (15): decodeCompactMissionAnimalMask(), encodeCompactMissionAnimalMask(), getDefaultMissionAnimalIds(), getMissionAnimalIdsFromPageUrl(), getMissionAnimalsParam(), getMissionCandidateAnimals(), getMissionRegionFromCompactCode(), getMissionRegionFromPageUrl() (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (13): applyImageFallback(), createGameToken(), createImagePlaceholder(), dedupeSources(), escapeSvgText(), getImageSources(), getLocalImagePath(), isGamePlacementCorrect() (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.29
Nodes (11): download(), downloadLocalImages(), downloadWithFallback(), getExtension(), lookupWikipediaImage(), parseAnimals(), parseImageSources(), parseWiki() (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.2
Nodes (12): answerQuestion(), clearHintHighlight(), closeDetail(), escapeHTML(), finishQuiz(), nextQuestion(), renderFeedback(), renderObservationSummary() (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (11): applyImageFallback(), createGameToken(), createImagePlaceholder(), dedupeSources(), escapeSvgText(), getImageSources(), getLocalImagePath(), isGamePlacementCorrect() (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.2
Nodes (10): forest_background, forest_bg_sprite, forest_wildlife, game_icons_sprite, game_ui_icons, habitat_categories, owl_character, owl_mascot_sprite (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.6
Nodes (5): findChromium(), main(), prepareFinalCatch(), quietClick(), startServer()

### Community 22 - "Community 22"
Cohesion: 0.4
Nodes (5): getFeatureComparisonText(), getFeatureDistractorScore(), getMeaningfulTokenOverlap(), getMeaningfulTokens(), makeDistinctiveFeatureOption()

### Community 24 - "Community 24"
Cohesion: 0.5
Nodes (4): Image Credits Page, React Version Entry Point, Main HTML Entry Point, No-Question Student Version

## Knowledge Gaps
- **18 isolated node(s):** `No-Question Student Version`, `Image Credits Page`, `React Version Entry Point`, `Integrated Development Plan`, `Game Mobile UX Draft` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `playSound()` connect `Community 5` to `Community 1`, `Community 2`, `Community 12`, `Community 16`, `Community 18`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `No-Question Student Version`, `Image Credits Page`, `React Version Entry Point` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._