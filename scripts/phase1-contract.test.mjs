import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  index: await readFile(new URL("../index.html", import.meta.url), "utf8"),
  noQuestion: await readFile(new URL("../no-question.html", import.meta.url), "utf8"),
  app: await readFile(new URL("../app.js", import.meta.url), "utf8"),
  styles: await readFile(new URL("../styles.css", import.meta.url), "utf8")
};

test("teacher entry point configures today's regional mission in the settings panel", () => {
  assert.match(files.index, /id="missionRegionSelect"/, "teacher settings should choose a region");
  assert.match(files.index, /id="missionAnimalOptions"/, "teacher settings should choose animals");
  assert.match(files.index, /id="classReset"/, "teacher settings should include classroom reset");
  assert.doesNotMatch(files.noQuestion, /id="missionRegionSelect"/, "student entry point should not expose teacher controls");
});

test("app treats today's class as a regional mission configured by URL", () => {
  assert.match(files.app, /const defaultMissionSelections\s*=/, "app should define regional mission defaults");
  assert.match(files.app, /getMissionRegionFromPageUrl/, "app should read ?set= regional mission links");
  assert.match(files.app, /getMissionAnimalIdsFromPageUrl/, "app should read selected mission animals");
  assert.match(files.app, /state\.missionSelections/, "state should track animal choices for every regional mission");
  assert.match(files.app, /state\.missionAnimalIds/, "state should track teacher-selected mission animals");
  assert.doesNotMatch(files.app, /state\.lessonMode/, "today's class should not be a second mission mode");
  assert.doesNotMatch(files.app, /오늘 수업 모드/, "student-facing copy should not expose a separate lesson mode");
});

test("overall progress and waiting states follow configured regional missions", () => {
  assert.match(files.app, /getProgramAnimals/, "overall encyclopedia progress should use selected regional mission animals");
  assert.match(files.app, /getProgramTotal/, "overall total should be derived from selected mission animals");
  assert.match(files.app, /대기중/, "future regions should use a waiting state label");
  assert.doesNotMatch(files.app, /label: "예고"/, "future mission copy should not use preview wording");
});

test("animal details keep quick facts in a collapsed observation summary", () => {
  assert.match(files.app, /quickFacts:/, "animals should expose quickFacts");
  assert.doesNotMatch(files.app, /renderHintPanel/, "detail modal should avoid a separate hint panel");
  assert.match(files.app, /quiz-retry-hint-guide/, "wrong-answer hints should be integrated into retry flow");
  assert.match(files.app, /renderObservationSummary/, "detail modal should keep quick facts in a collapsed summary");
  assert.match(files.app, /<details class="observation-summary"/, "quick facts should be collapsed by default");
  assert.match(files.app, /관찰 요약/, "collapsed quick facts should avoid the overloaded hint label");
  assert.doesNotMatch(files.app, /open class="observation-summary"/, "observation summary should not start expanded");
  assert.match(files.app, /showHintAndScroll/, "wrong-answer hints should be delivered via article highlight scroll");
});

test("quiz registration button follows the explanation and observation summary", () => {
  assert.match(
    files.app,
    /<div class="encyclopedia-article"[\s\S]*\$\{renderObservationSummary\(animal\)\}[\s\S]*<div class="detail-quiz-anchor">[\s\S]*\$\{quizAction\}/,
    "quiz action should appear after the explanation and collapsed observation summary"
  );
});

test("quiz observation checks disappear after first completion per animal", () => {
  assert.match(files.app, /renderObservationChecklist/, "detail modal should render observation checklist");
  assert.match(files.app, /data-observation-check/, "checklist should have checkboxes");
  assert.match(files.app, /updateQuizStartGate/, "quiz button should be gated by checks");
  assert.match(files.app, /observationReadyKey/, "completed observation checks should persist");
  assert.match(files.app, /saveObservationReady/, "app should remember completed observation checks");
  assert.match(files.app, /readObservationReady/, "app should skip checks already completed once");
});

test("styles cover teacher mission settings, hints, and observation checklist", () => {
  for (const className of [".mission-setting-panel", ".mission-animal-options", ".quick-facts", ".observation-summary", ".quiz-retry-hint-guide", ".observation-checklist"]) {
    assert.match(files.styles, new RegExp(className.replace(".", "\\.")), `${className} should be styled`);
  }
});

test("detail modal stays above mobile progress controls", () => {
  assert.match(files.styles, /\.sticky-progress\s*\{[\s\S]*?z-index:\s*50;/, "sticky progress should keep its mobile layer");
  assert.match(files.styles, /\.detail-modal\s*\{[\s\S]*?z-index:\s*70;/, "detail modal should sit above sticky progress controls");
  assert.match(files.styles, /\.detail-sheet \.close-detail\s*\{[\s\S]*?z-index:\s*80;/, "detail close button should remain visible above modal content");
  assert.match(files.styles, /\.detail-sheet \.close-detail\s*\{[\s\S]*?align-self:\s*flex-start;/, "detail close button should sit on the left away from mobile progress controls");
  assert.doesNotMatch(files.styles, /\.detail-sheet \.close-detail\s*\{[\s\S]*?align-self:\s*flex-end;/, "detail close button should not compete with the right-side progress controls");
});
