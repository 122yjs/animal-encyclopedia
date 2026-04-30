import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function read(fileName) {
  return fs.readFileSync(path.join(rootDir, fileName), "utf8");
}

test("teacher settings include regional mission animal selection controls", () => {
  const html = read("index.html");

  for (const needle of [
    "지역 미션 설정",
    "첫 실행: 지역별 동물 범위 설정",
    "지역별로 학생들이 볼 동물을 먼저 고르세요",
    'id="missionRegionSelect"',
    'id="missionAnimalOptions"',
    'id="missionAnimalCount"'
  ]) {
    assert.ok(html.includes(needle), `index.html should include ${needle}`);
  }
});

test("first teacher launch opens the regional range setup workflow", () => {
  const appJs = read("app.js");

  for (const needle of [
    "function openFirstRunTeacherWorkflow()",
    "openFirstRunTeacherWorkflow();",
    "window.setTimeout(openSettings, 500)"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }
});

test("runtime preserves teacher-selected mission parameters in student share links", () => {
  const appJs = read("app.js");

  for (const needle of [
    "defaultMissionSelections",
    "applyInitialMissionSettings",
    "getMissionRegionFromPageUrl",
    "getMissionAnimalIdsFromPageUrl",
    'current.searchParams.set("set", state.missionRegion)',
    'current.searchParams.set("animals", state.missionAnimalIds.join(","))',
    "writeMissionSelectionParams(current.searchParams)"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }
});

test("student entry remains generated without teacher mission controls", () => {
  const html = read("no-question.html");

  for (const needle of [
    "지역 미션 설정",
    "오늘 학생들이 볼 동물을 고르세요",
    'id="missionRegionSelect"',
    'id="missionAnimalOptions"',
    'id="missionAnimalCount"'
  ]) {
    assert.equal(html.includes(needle), false, `no-question.html should not include ${needle}`);
  }
});

test("detail modal keeps collapsed observation summary before quiz actions", () => {
  const appJs = read("app.js");
  const styles = read("styles.css");

  for (const needle of [
    "renderObservationSummary(animal)",
    '<details class="observation-summary">',
    "<summary>관찰 요약 열기</summary>",
    "renderQuickFacts(animal, \"관찰 요약\")"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }

  assert.ok(styles.includes(".observation-summary"));
  assert.ok(styles.includes(".observation-summary summary"));
  assert.ok(appJs.includes("quickFacts: {"));
});

test("quiz start is gated by observation checklist before first collection", () => {
  const appJs = read("app.js");
  const styles = read("styles.css");

  for (const needle of [
    "observationReadyKey",
    "observationReady: new Set(readStoredIds(observationReadyKey, animalIds))",
    "renderObservationChecklist(animal, isCollected)",
    "data-observation-check",
    "updateQuizStartGate",
    "관찰 체크 3개를 먼저 해요",
    "saveObservationReady(animalId)",
    "safeRemoveStorage(observationReadyKey)"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }

  assert.ok(styles.includes(".observation-checklist"));
  assert.ok(styles.includes(".observation-checklist input"));
});

test("regional mission completion advances to the next mission and resets stale filters", () => {
  const appJs = read("app.js");

  for (const needle of [
    "function activateMissionRegion(regionId, options = {})",
    "state.missionRegion = mission.id",
    "state.missionAnimalIds = getSelectedMissionAnimalIds(mission.id)",
    "state.query = \"\"",
    "state.selectedAnimal = null",
    "if (els.searchInput) els.searchInput.value = \"\"",
    "const nextMissionId = getNextMissionFilter()",
    "activateMissionRegion(nextMissionId, { shouldRender: false, updateUrl: true })",
    "data-catalog-mode=\"next-mission\""
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }
});

test("manual sidebar mission navigation shows each teacher-selected regional set", () => {
  const appJs = read("app.js");

  for (const needle of [
    "activateMissionRegion(filter.id, { shouldRender: true, updateUrl: true })",
    "state.missionAnimalIds = getSelectedMissionAnimalIds(mission.id)",
    "const missionIds = state.catalogMode === \"mission\" ? new Set(getSelectedMissionAnimalIds(state.missionRegion)) : null"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }
});

test("mission panel exposes readable state classes for current, completed, and next missions", () => {
  const appJs = read("app.js");
  const styles = read("styles.css");

  for (const needle of [
    "mission-board status-current",
    "mission-board status-complete",
    "mission-board status-next",
    "mission-secondary-action"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }

  for (const needle of [
    ".mission-board.status-current",
    ".mission-board.status-complete",
    ".mission-board.status-next",
    ".mission-secondary-action"
  ]) {
    assert.ok(styles.includes(needle), `styles.css should include ${needle}`);
  }
});

test("sidebar active and completed mission labels keep readable contrast", () => {
  const styles = read("styles.css");

  for (const needle of [
    ".filter-button.stage-complete.active",
    ".filter-button.stage-complete.active .filter-progress-badge",
    ".filter-button.stage-complete.active .stage-status"
  ]) {
    assert.ok(styles.includes(needle), `styles.css should include ${needle}`);
  }
});
