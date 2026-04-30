import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function read(fileName) {
  return fs.readFileSync(path.join(rootDir, fileName), "utf8");
}

test("entry pages warn students before opening external source links", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(fileName);
    assert.ok(html.includes("사진 출처를 볼까요?"), `${fileName} should show a source confirmation title`);
    assert.ok(html.includes("새 창"), `${fileName} should mention the new window before leaving`);
    assert.ok(html.includes("도감으로 돌아오려면 새 창을 닫으면 됩니다"), `${fileName} should explain how to return`);
    assert.ok(html.includes("도감에 있을래요"), `${fileName} should offer a stay-in-app option`);
  }
});

test("reset control is worded for shared classroom tablets", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(fileName);
    assert.ok(html.includes("수업 기록 초기화"), `${fileName} should use teacher-friendly reset label`);
  }

  const appJs = read("app.js");
  assert.ok(appJs.includes("공용 태블릿"));
  assert.ok(appJs.includes("다음 반 수업을 위해"));
});

test("sidebar lede is ready for dynamic total count text", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(fileName);
    assert.ok(html.includes('class="sidebar-lede"'), `${fileName} should keep the sidebar lede anchor`);
    assert.equal(html.includes("54마리의 카드를 모아보세요"), false, `${fileName} should not hardcode 54 cards`);
  }

  const appJs = read("app.js");
  assert.ok(appJs.includes("function updateSidebarLede()"));
  assert.ok(appJs.includes("els.sidebarLede.textContent = `동물을 관찰하고 퀴즈 배지를 모아 ${getProgramTotal()}마리의 카드를 완성해 보세요!"));
});

test("observation checks appear under individual explanation items before quiz start", () => {
  const appJs = read("app.js");
  const articleIndex = appJs.indexOf('<div class="encyclopedia-article" id="animalArticle">');
  const firstCheckIndex = appJs.indexOf('${renderObservationCheckItem(animal, isCollected, "appearance", "생김새를 봤어요")}');
  const secondCheckIndex = appJs.indexOf('${renderObservationCheckItem(animal, isCollected, "lifestyle", "움직이는 방법을 봤어요")}');
  const thirdCheckIndex = appJs.indexOf('${renderObservationCheckItem(animal, isCollected, "habitat", "사는 곳을 봤어요")}');
  const quizAnchorIndex = appJs.indexOf('<div class="detail-quiz-anchor">');

  assert.ok(articleIndex > -1, "animal detail should render the explanation article");
  assert.ok(firstCheckIndex > -1, "animal detail should render the appearance observation check");
  assert.ok(secondCheckIndex > -1, "animal detail should render the movement observation check");
  assert.ok(thirdCheckIndex > -1, "animal detail should render the habitat observation check");
  assert.ok(quizAnchorIndex > -1, "animal detail should render the quiz start area");
  assert.ok(articleIndex < firstCheckIndex, "checks should appear inside the explanation flow");
  assert.ok(firstCheckIndex < secondCheckIndex, "checks should follow each relevant explanation item");
  assert.ok(secondCheckIndex < thirdCheckIndex, "checks should stay separated instead of grouped");
  assert.ok(thirdCheckIndex < quizAnchorIndex, "quiz start should remain below the observation checks");
});
