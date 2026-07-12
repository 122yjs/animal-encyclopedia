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

test("adventure map keeps the first and master nodes inside its clipped canvas", () => {
  const appJs = read("app.js");
  const stopMatches = [...appJs.matchAll(/\{ id: "([^"]+)", x: (\d+), y: (\d+) \}/g)];
  const stops = Object.fromEntries(stopMatches.map(([, id, x, y]) => [id, { x: Number(x), y: Number(y) }]));

  assert.ok(stops.around, "journeyStops should include the first region");
  assert.ok(stops.master, "journeyStops should include the master destination");
  assert.ok(stops.around.y >= 13, "the first node needs enough top clearance for its label and player marker");
  assert.ok(stops.master.y <= 87, "the master node needs enough bottom clearance for its label");
});

test("adventure map region art stays uncolored until its badge is earned", () => {
  const styles = read("styles.css");
  const unearnedRule = styles.match(/\.map-node:not\(\.map-status-complete\) \.map-node-sprite \{[\s\S]*?\n\}/)?.[0] ?? "";
  const earnedRule = styles.match(/\.map-node\.map-status-complete \.map-node-sprite \{[\s\S]*?\n\}/)?.[0] ?? "";
  const playerRule = styles.match(/\.map-player \{[\s\S]*?\n\}/)?.[0] ?? "";

  assert.ok(
    styles.includes(".map-node:not(.map-status-complete) .map-node-sprite"),
    "every unearned region sprite should share the muted treatment"
  );
  assert.ok(unearnedRule.includes("grayscale(1)"), "unearned region art should be fully grayscale");
  assert.ok(
    styles.includes(".map-node.map-status-complete .map-node-sprite"),
    "earned region sprites should explicitly restore their color"
  );
  assert.ok(earnedRule.includes("filter: none"), "earned region art should restore its original color");
  assert.ok(
    playerRule.includes("translate(55%, -125%)"),
    "the colored player marker should sit beside the current region art instead of covering it"
  );
});

test("map player travels once from a newly earned badge to the next mission", () => {
  const appJs = read("app.js");
  const styles = read("styles.css");

  for (const needle of [
    "let pendingMapTravel = null",
    "pendingMapTravel = { from: regionId, to: getNextMissionFilter() }",
    'state.view === "map" && pendingMapTravel',
    "function animateMapPlayer(fromId, toId)",
    'els.mapPlayer.classList.add("is-traveling")',
    'window.matchMedia("(prefers-reduced-motion: reduce)")'
  ]) {
    assert.ok(appJs.includes(needle), `app.js should include ${needle}`);
  }

  const travelRule = styles.match(/\.map-player\.is-traveling \{[\s\S]*?\n\}/)?.[0] ?? "";
  assert.ok(travelRule.includes("animation: none"), "traveling should pause the idle bob animation");
  assert.ok(travelRule.includes("transition-duration"), "traveling should use a visible one-time transition");

  const nextRegionStart = appJs.indexOf("function goToNextRewardRegion()");
  const nextRegionEnd = appJs.indexOf("function resetProgressFromReward()", nextRegionStart);
  const nextRegionCode = appJs.slice(nextRegionStart, nextRegionEnd);
  assert.ok(nextRegionCode.includes('setView("map")'), "the badge reward action should reveal the map journey");

  const resetStart = appJs.indexOf("function resetProgress(skipConfirm = false)");
  const resetEnd = appJs.indexOf("function readObservationReady", resetStart);
  assert.ok(appJs.slice(resetStart, resetEnd).includes("pendingMapTravel = null"), "reset should discard a queued journey");
});

test("map player also travels when a student jumps to another region from the map", () => {
  const appJs = read("app.js");
  const travelStart = appJs.indexOf("function travelToRegion(regionId)");
  const travelEnd = appJs.indexOf("function requestRegionTravel(regionId)", travelStart);
  const travelCode = appJs.slice(travelStart, travelEnd);

  assert.ok(appJs.includes("function queueMapPlayerTravel(fromRegionId, toRegionId)"), "app.js should queue map travel from map clicks");
  for (const needle of [
    "const fromRegion = getActiveQuestRegion()",
    "queueMapPlayerTravel(fromRegion, regionId)",
    "window.setTimeout(finishTravel, MAP_TRAVEL_DURATION_MS)"
  ]) {
    assert.ok(travelCode.includes(needle), `travelToRegion should include ${needle}`);
  }
});
