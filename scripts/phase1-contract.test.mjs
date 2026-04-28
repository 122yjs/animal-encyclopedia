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

test("animal details show quick facts before long article", () => {
  assert.match(files.app, /quickFacts:/, "animals should expose quickFacts");
  assert.match(files.app, /renderQuickFacts/, "detail modal should render quick facts");
  assert.match(files.app, /class="quick-facts"/, "quick facts should have a stable class");
});

test("quiz starts only after observation checks", () => {
  assert.match(files.app, /renderObservationChecklist/, "detail modal should render observation checklist");
  assert.match(files.app, /data-observation-check/, "checklist should have checkboxes");
  assert.match(files.app, /updateQuizStartGate/, "quiz button should be gated by checks");
});

test("styles cover teacher mission settings, quick facts, and observation checklist", () => {
  for (const className of [".mission-setting-panel", ".mission-animal-options", ".quick-facts", ".observation-checklist"]) {
    assert.match(files.styles, new RegExp(className.replace(".", "\\.")), `${className} should be styled`);
  }
});
