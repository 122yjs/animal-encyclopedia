import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function read(fileName) {
  return fs.readFileSync(path.join(rootDir, fileName), "utf8");
}

function readPngSize(fileName) {
  const buffer = fs.readFileSync(path.join(rootDir, fileName));
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
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
  const firstCheckIndex = appJs.indexOf('${renderObservationCheckItem(animal, isCollected, "appearance", "몸의 특징을 봤어요")}');
  const secondCheckIndex = appJs.indexOf('${renderObservationCheckItem(animal, isCollected, "movement", "움직이는 방법을 봤어요")}');
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

test("large UI moments use extracted transparent sprites instead of whole sprite sheets", () => {
  const appJs = read("app.js");
  const styles = read("styles.css");
  const requiredAssets = [
    "assets/sprites/extracted/owl-wave.png",
    "assets/sprites/extracted/owl-search.png",
    "assets/sprites/extracted/owl-cheer.png",
    "assets/sprites/extracted/owl-think.png",
    "assets/sprites/extracted/icon-chest.png",
    "assets/sprites/extracted/icon-gem.png",
    "assets/sprites/extracted/icon-shield.png",
    "assets/sprites/extracted/icon-star.png",
    "assets/sprites/extracted/region-around.png",
    "assets/sprites/extracted/region-forest.png",
    "assets/sprites/extracted/region-sea.png",
    "assets/sprites/extracted/region-special.png",
    "assets/sprites/extracted/region-water.png"
  ];

  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(fileName);
    assert.ok(html.includes("./assets/sprites/extracted/owl-wave.png"), `${fileName} should use one extracted owl pose`);
    assert.equal(
      html.includes('<img src="./assets/sprites/owl-mascot.png" alt="부엉이 가이드"'),
      false,
      `${fileName} should not show the whole owl sprite sheet in the header`
    );
  }

  for (const asset of requiredAssets) {
    assert.ok(fs.existsSync(path.join(rootDir, asset)), `${asset} should exist`);
    assert.ok(appJs.includes(asset) || read("index.html").includes(asset), `${asset} should be referenced by the UI`);
  }

  for (const asset of [
    "assets/sprites/extracted/region-around.png",
    "assets/sprites/extracted/region-forest.png",
    "assets/sprites/extracted/region-sea.png",
    "assets/sprites/extracted/region-special.png",
    "assets/sprites/extracted/region-water.png"
  ]) {
    assert.deepEqual(readPngSize(asset), { width: 288, height: 288 }, `${asset} should keep the full round badge frame`);
  }

  assert.ok(styles.includes(".onboarding-owl"));
  assert.ok(styles.includes(".feedback-mark"));
  assert.ok(styles.includes(".region-reward-hero"));
  assert.ok(styles.includes(".region-star-row"));
  assert.ok(styles.includes(".region-star-icon"));
  assert.ok(styles.includes(".region-star-context"));
  assert.ok(styles.includes(".master-reward-chest"));
  assert.ok(styles.includes(".reward-meaning-badges"));
  assert.equal(appJs.includes("icon-catch-ball.png"), false, "quiz catch ball should use the original CSS ball");
  assert.ok(styles.includes(".catch-ball::before"));
  assert.ok(styles.includes(".catch-ball-button"));
  assert.equal(appJs.includes("region-reward-shield"), false, "region reward should not show a detached shield badge");
  assert.ok(appJs.includes('renderUiSprite(uiSprites.icons.chest, "", "master-reward-chest-sprite")'));
  assert.ok(appJs.includes('renderUiSprite(uiSprites.icons.star, "", "reward-meaning-icon")'));
  assert.ok(appJs.includes('renderUiSprite(uiSprites.icons.gem, "", "reward-meaning-icon")'));
  assert.equal(appJs.includes("icon-leaf.png"), false, "leaf should not be a macguffin reward without state");
  assert.ok(appJs.includes("function getCompletedRegionCount()"));
  assert.ok(appJs.includes("function renderCompletionStars(completed, total, className)"));
  assert.ok(read("index.html").includes('id="stickyStarStatus"'));
  assert.ok(read("index.html").includes('id="completionStarStatus"'));
  assert.ok(styles.includes(".sticky-star-status"));
  assert.ok(styles.includes(".completion-star-status"));
  assert.equal(appJs.includes("icon-check.png"), false, "quiz feedback should not use the cropped check sprite image");
  assert.equal(appJs.includes("icon-x.png"), false, "quiz feedback should not use the cropped x sprite image");
  assert.ok(appJs.includes("feedback-mark-good"));
  assert.ok(appJs.includes("feedback-mark-retry"));
  assert.ok(appJs.includes('renderUiSprite(uiSprites.owl.cheer, "", "reward-owl-cheer region-reward-owl")'));
  assert.ok(appJs.includes('renderUiSprite(uiSprites.icons.star, "", "region-star-icon")'));
  assert.ok(appJs.includes("완성별이 1개 추가됐어요"));
  assert.equal(appJs.includes("<strong>x50</strong>"), false, "star should not look like a spendable reward currency");
  assert.equal(appJs.includes("<strong>x1</strong>"), false, "leaf should not look like a spendable reward currency");
  assert.equal(appJs.includes("filter-icon\"><img"), false, "small filter controls should not use pasted sheet crops");
});

test("uncollected cards keep readable text while only dimming photos", () => {
  const styles = read("styles.css");

  assert.equal(styles.includes(".animal-card:not(.collected) {\n  background: var(--game-dark-panel)"), false);
  assert.equal(styles.includes(".animal-card:not(.collected) h3"), false);
  assert.equal(styles.includes(".animal-card:not(.collected) .card-tags span"), false);
  assert.ok(styles.includes(".animal-card:not(.collected) .card-photo-frame"));
  assert.ok(styles.includes(".animal-card:not(.collected) img"));
});

test("uncollected card photos keep recognizable silhouettes with question context", () => {
  const styles = read("styles.css");
  const questionOverlayRule = styles.match(/\.animal-card:not\(\.collected\) \.card-photo-frame::after \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.equal(styles.includes("brightness(0.15)"), false);
  assert.equal(questionOverlayRule.includes("display: none"), false);
  assert.ok(styles.includes('content: "?"'));
  assert.ok(styles.includes("brightness(0.42)"));
  assert.ok(styles.includes("blur(3px)"));
  assert.ok(styles.includes("card-photo-frame::after"));
});
