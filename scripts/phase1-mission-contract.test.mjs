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

test("teacher-facing settings copy uses teacher settings wording", () => {
  const html = read("index.html");
  const generator = read("scripts/generate-no-question.js");

  assert.ok(html.includes("⚙️ 교사용 설정"));
  assert.ok(html.includes("AI 질문방 설정"));
  assert.equal(html.includes("⚙️ 질문방 설정"), false);
  assert.ok(generator.includes("교사용 설정"));
  assert.equal(generator.includes("질문방 설정"), false);
});

test("regional animal settings appear before optional AI question settings", () => {
  const html = read("index.html");
  const missionIndex = html.indexOf("지역 미션 설정");
  const aiIndex = html.indexOf("AI 질문방 설정");

  assert.ok(missionIndex > -1, "index.html should include regional mission settings");
  assert.ok(aiIndex > -1, "index.html should include AI question settings");
  assert.ok(missionIndex < aiIndex, "regional mission settings should appear before AI question settings");
  assert.ok(html.includes("수업에 쓸 지역별 동물 범위와 AI 질문방 연결 여부를 정하세요."));
  assert.ok(html.includes("AI 질문방은 선택 사항입니다."));
  assert.ok(html.includes("AI 질문방 사용 안 함"));
  assert.ok(html.includes("AI 질문방 연결하기"));
  assert.ok(html.includes('id="connectQuestionUrl"'));
  assert.ok(html.includes('aria-pressed="true"'));
});

test("first teacher launch opens the regional range setup workflow", () => {
  const appJs = read("app.js");

  for (const needle of [
    "function openFirstRunTeacherWorkflow()",
    "openFirstRunTeacherWorkflow();",
    'const settingsSeenKey = "animal-encyclopedia-settings-seen-v2"',
    "window.setTimeout(openSettings, 500)"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }
});

test("student share links branch by question room and regional animal settings", () => {
  const appJs = read("app.js");

  for (const needle of [
    "function getShareLinkTargetPath(questionUrl)",
    "function getShareLinkCopy(questionUrl)",
    "function updateQuestionChoiceButtons(hasQuestionRoom)",
    'return "no-question.html"',
    "function hasCustomMissionSelections()",
    "function shouldIncludeMissionSelectionsInShareLink()",
    "const includeMissionSelections = shouldIncludeMissionSelectionsInShareLink()",
    "if (includeMissionSelections)",
    "if (safeUrl) current.searchParams.set(\"questionUrl\", safeUrl)",
    "const hasQuestionRoom = Boolean(normalizeHttpUrl(questionUrl))",
    "기본 학생용 링크/QR",
    "설정 반영 링크/QR",
    "바로 배포용 기본 QR",
    "no-question 기본 링크"
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

test("all-mission title uses teacher-selected total instead of fixed 54", () => {
  const appJs = read("app.js");
  assert.ok(appJs.includes("`전체 ${getProgramTotal()}마리 도감`"));
  assert.equal(appJs.includes("전체 54마리 도감"), false);
  assert.ok(appJs.includes("${getCollectedProgramCount()} / ${getProgramTotal()}"));
  assert.equal(appJs.includes("54 / 54"), false);
});

test("student entry remains generated without teacher mission controls", () => {
  const html = read("no-question.html");

  assert.ok(html.includes("featureEnabled: true"), "no-question.html should allow questionUrl links");
  assert.ok(html.includes("allowTeacherSettings: false"), "no-question.html should hide teacher settings");
  assert.ok(html.includes("showWhenDisabled: false"), "no-question.html should stay quiet without questionUrl");

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

test("quiz modal keeps collapsed observation summary directly under the question", () => {
  const appJs = read("app.js");
  const styles = read("styles.css");

  for (const needle of [
    "renderObservationSummary(quiz.animal)",
    '<details class="observation-summary">',
    "<summary>관찰 요약 열기</summary>",
    "renderQuickFacts(animal, \"관찰 요약\")"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }

  const questionIndex = appJs.indexOf("<h3>${question.text}</h3>");
  const summaryIndex = appJs.indexOf("${renderObservationSummary(quiz.animal)}");
  const optionsIndex = appJs.indexOf('<div class="quiz-options">');
  assert.ok(questionIndex > -1, "quiz should render the question text");
  assert.ok(summaryIndex > -1, "quiz should render the observation summary");
  assert.ok(optionsIndex > -1, "quiz should render answer options");
  assert.ok(questionIndex < summaryIndex, "observation summary should sit directly after the question");
  assert.ok(summaryIndex < optionsIndex, "answer options should follow the optional summary");

  assert.ok(styles.includes(".observation-summary"));
  assert.ok(styles.includes(".observation-summary summary"));
  assert.ok(appJs.includes("quickFacts: {"));
});

test("quiz start is gated by separated observation checks before first collection", () => {
  const appJs = read("app.js");
  const styles = read("styles.css");

  for (const needle of [
    "observationReadyKey",
    "observationReady: new Set(readStoredIds(observationReadyKey, animalIds))",
    "renderObservationCheckItem(animal, isCollected",
    "data-observation-check",
    "observation-checkitem",
    "updateQuizStartGate",
    "관찰 체크 3개를 먼저 해요",
    "saveObservationReady(animalId)",
    "safeRemoveStorage(observationReadyKey)"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }

  assert.ok(styles.includes(".observation-checkitem"));
  assert.ok(styles.includes(".observation-checkitem input"));
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

test("mission panel tells students the current step and next action", () => {
  const appJs = read("app.js");

  for (const needle of [
    "const nextActionLabel",
    "지금 할 일",
    "카드를 눌러 관찰하고 체크한 뒤 퀴즈를 풀어요.",
    "다음 미션으로 넘어갈 수 있어요.",
    "mission-next-step"
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }

  const styles = read("styles.css");
  assert.ok(styles.includes(".mission-next-step"));
});

test("teacher settings emphasizes share link and five-minute class checklist", () => {
  const html = read("index.html");

  for (const needle of [
    "학생에게는 맨 아래의 학생용 링크나 QR만 보내면 됩니다.",
    "수업 전 5분 확인",
    "동물 범위를 바꿀 지역이 있는지 확인",
    "AI 질문방을 쓸지 안 쓸지 선택",
    "학생용 링크/QR을 복사하거나 저장"
  ]) {
    assert.ok(html.includes(needle), `index.html should include ${needle}`);
  }
});

test("student copy uses app-owned quiz language instead of monster ball wording", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(fileName);
    assert.equal(html.includes("몬스터볼"), false, `${fileName} should avoid monster ball wording`);
    assert.equal(html.includes("포켓 콜렉션"), false, `${fileName} should avoid pocket collection wording`);
    assert.ok(html.includes("탐험 카드 모으기"));
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
