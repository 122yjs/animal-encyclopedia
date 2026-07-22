import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { animalById } from "../src/data/animals.js";
import { regions } from "../src/data/regions.js";
import { buildQuestions } from "../src/systems/QuizBuilder.js";
import { buildQuickFacts } from "../src/systems/ObservationBuilder.js";
import { GENERATED_ANIMAL_ATLASES } from "../src/world/AnimalSprites.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DIST = join(ROOT, "dist");
const MOUNT_PATH = "/animal-game";
const VIEWPORTS = [{ width: 1280, height: 720 }, { width: 1024, height: 768 }, { width: 844, height: 390 }];
const OBSERVATION_AUTO_ADVANCE_TEST_WAIT_MS = 420;

const generatedAnimalIds = GENERATED_ANIMAL_ATLASES.flatMap((atlas) => atlas.animals);
assert.equal(generatedAnimalIds.length, 40, "generated atlases must cover all 40 animals");
assert.equal(new Set(generatedAnimalIds).size, 40, "generated atlas animal ids must be unique");
GENERATED_ANIMAL_ATLASES.forEach((atlas) => {
  assert.ok(existsSync(join(ROOT, "public", atlas.path)), `generated atlas is missing: ${atlas.path}`);
});

assert.match(animalById["호랑이"].point, /줄무늬/, "tiger observation point must describe a visible tiger feature");
Object.values(animalById).forEach((animal) => {
  assert.doesNotMatch(animal.point, /동물 카드/, `${animal.name} observation point must not describe the card UI`);
});
regions.flatMap((region) => region.spawns).forEach((spawn) => {
  const photo = animalById[spawn.id]?.image;
  assert.match(photo || "", /^\.?\/assets\/animals\/photos\/.+\.jpg$/, `${spawn.id} encounter must use a local photo`);
  const relativePhoto = photo.replace(/^\.?\//, "");
  assert.ok(existsSync(join(ROOT, "public", decodeURIComponent(relativePhoto))), `${spawn.id} local photo is missing`);
});

const battleCopyCases = Object.values(animalById).flatMap((animal) => buildQuestions(animal).map((question) => {
  const facts = buildQuickFacts(animal);
  const parts = [];
  if (question.hintKey !== "habitat") parts.push(`사는 곳: ${facts.habitat}`);
  if (question.hintKey !== "lifestyle") parts.push(`움직임: ${facts.movement}`);
  if (question.hintKey !== "appearance" && question.hintKey !== "adaptation") parts.push(`특징: ${facts.feature}`);
  return { question: question.text, facts: parts.join("  ·  ") };
}));
const longestQuestion = battleCopyCases.reduce((longest, item) => item.question.length > longest.length ? item.question : longest, "");
const longestFacts = battleCopyCases.reduce((longest, item) => item.facts.length > longest.length ? item.facts : longest, "");

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    join(process.env.HOME || "", "Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
  ].filter(Boolean);
  for (const candidate of candidates) if (existsSync(candidate)) return candidate;

  const cacheRoots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    join(process.env.HOME || "", ".cache/ms-playwright"),
    join(process.env.HOME || "", "Library/Caches/ms-playwright")
  ].filter(Boolean);
  const wanted = /^(chromium|chrome|chrome-headless-shell|headless_shell|Google Chrome for Testing)$/i;
  const walk = (dir, depth = 0) => {
    if (!dir || depth > 7 || !existsSync(dir)) return null;
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return null; }
    for (const entry of entries) {
      const path = join(dir, entry.name);
      if (entry.isFile() && wanted.test(entry.name) && existsSync(path)) return path;
      if (entry.isDirectory()) {
        const hit = walk(path, depth + 1);
        if (hit) return hit;
      }
    }
    return null;
  };
  for (const root of cacheRoots) {
    const hit = walk(root);
    if (hit) return hit;
  }
  return null;
}

function serveDist() {
  const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
  const server = createServer((req, res) => {
    const requested = decodeURIComponent((req.url || "/").split("?")[0]);
    const mountRoot = requested === MOUNT_PATH || requested === `${MOUNT_PATH}/`;
    if (!mountRoot && !requested.startsWith(`${MOUNT_PATH}/`)) {
      res.statusCode = 404; res.end("Not found"); return;
    }
    const relative = mountRoot ? "/index.html" : requested.slice(MOUNT_PATH.length);
    const file = normalize(join(DIST, relative));
    if (!file.startsWith(`${DIST}/`) || !existsSync(file) || !statSync(file).isFile()) {
      res.statusCode = 404; res.end("Not found"); return;
    }
    res.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    createReadStream(file).pipe(res);
  });
  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolveServer({
      server,
      url: `http://127.0.0.1:${server.address().port}${MOUNT_PATH}/`
    }));
  });
}

async function sceneObjects(page) {
  return page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene");
    if (!scene) return { scene: null, objects: [] };
    const objects = [];
    const visit = (obj, parentVisible = true) => {
      if (!obj) return;
      const visible = parentVisible && obj.visible !== false && (obj.alpha ?? 1) > 0;
      if (obj.name) {
        let bounds = null;
        try { const b = obj.getBounds?.(); if (b) bounds = { x: b.x, y: b.y, width: b.width, height: b.height }; } catch {}
        objects.push({
          name: obj.name,
          visible,
          bounds,
          fontSize: Number.parseFloat(obj.style?.fontSize) || null
        });
      }
      obj.list?.forEach((child) => visit(child, visible));
    };
    scene.children?.list?.forEach((obj) => visit(obj));
    const optionButtons = (scene.optionButtons || []).map((button, index) => {
      let bounds = null;
      try { const b = button.getBounds?.(); if (b) bounds = { x: b.x, y: b.y, width: b.width, height: b.height }; } catch {}
      return { name: button.name || `option-${index}`, visible: button.visible !== false && (button.alpha ?? 1) > 0, bounds };
    });
    return {
      scene: {
        phase: scene.phase,
        observationStage: scene.observationStage,
        observePage: scene.observePage,
        qIndex: scene.qIndex
      },
      objects,
      optionButtons
    };
  });
}

function named(snapshot, name) {
  const hits = snapshot.objects.filter((obj) => obj.name === name && obj.visible);
  assert.equal(hits.length, 1, `expected exactly one visible named object '${name}', found ${hits.length}`);
  assert.ok(hits[0].bounds, `named object '${name}' has no bounds`);
  return hits[0];
}

function assertHidden(snapshot, name) {
  const hits = snapshot.objects.filter((obj) => obj.name === name);
  assert.equal(hits.length, 1, `expected exactly one named object '${name}', found ${hits.length}`);
  assert.equal(hits[0].visible, false, `expected '${name}' to be hidden`);
}

function overlaps(a, b, padding = 0) {
  return a.x < b.x + b.width - padding && a.x + a.width > b.x + padding && a.y < b.y + b.height - padding && a.y + a.height > b.y + padding;
}

function assertInCanvas(obj, label) {
  const b = obj.bounds;
  assert.ok(b.x >= 0 && b.y >= 0 && b.x + b.width <= 640 && b.y + b.height <= 360, `${label} must stay inside 640x360 canvas: ${JSON.stringify(b)}`);
}

function assertContained(inner, outer, label, padding = 0) {
  assert.ok(inner.x >= outer.x + padding, `${label} must keep left padding inside its panel`);
  assert.ok(inner.y >= outer.y + padding, `${label} must keep top padding inside its panel`);
  assert.ok(inner.x + inner.width <= outer.x + outer.width - padding, `${label} must keep right padding inside its panel`);
  assert.ok(inner.y + inner.height <= outer.y + outer.height - padding, `${label} must keep bottom padding inside its panel`);
}

async function activateNamedButton(page, name) {
  await page.evaluate((targetName) => {
    const scene = window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene");
    const target = scene?.children?.getByName(targetName);
    if (!target?.buttonBg) throw new Error(`named Phaser button '${targetName}' is missing`);
    target.buttonBg.emit("pointerdown");
    target.buttonBg.emit("pointerup");
  }, name);
}

async function activateSceneButton(page, sceneKey, name) {
  await page.evaluate(({ sceneKey: key, targetName }) => {
    const scene = window.__ANIMAL_GAME__?.scene?.getScene(key);
    const target = scene?.children?.getByName(targetName);
    if (!target?.buttonBg) throw new Error(`named Phaser button '${targetName}' is missing from ${key}`);
    target.buttonBg.emit("pointerdown");
    target.buttonBg.emit("pointerup");
  }, { sceneKey, targetName: name });
}

async function pressSceneButton(page, sceneKey, name, { touch = false } = {}) {
  if (!touch) {
    await activateSceneButton(page, sceneKey, name);
    return;
  }
  const bounds = await page.evaluate(({ sceneKey: key, targetName }) => {
    const scene = window.__ANIMAL_GAME__?.scene?.getScene(key);
    const target = scene?.children?.getByName(targetName);
    if (!target?.buttonBg) throw new Error(`named Phaser button '${targetName}' is missing from ${key}`);
    const value = target.buttonBg.getBounds();
    return { x: value.x, y: value.y, width: value.width, height: value.height };
  }, { sceneKey, targetName: name });
  await clickBounds(page, bounds, { touch: true });
}

async function clickBounds(page, bounds, { touch = false } = {}) {
  const rect = await page.locator("canvas").boundingBox();
  assert.ok(rect, "game canvas is missing");
  const x = rect.x + (bounds.x + bounds.width / 2) * rect.width / 640;
  const y = rect.y + (bounds.y + bounds.height / 2) * rect.height / 360;
  if (touch) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
}

async function exerciseTouchMovement(page) {
  const before = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("OverworldScene");
    const button = scene.input._list.find((object) => object.type === "Arc" && object.x > 0 && object.parentContainer?.x === 84);
    if (!button) return null;
    const bounds = button.getBounds();
    return {
      playerX: scene.player.x,
      fillColor: button.fillColor,
      bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }
    };
  });
  assert.ok(before, "mobile right-direction button is missing");

  const canvas = await page.locator("canvas").boundingBox();
  assert.ok(canvas, "game canvas is missing");
  const x = canvas.x + (before.bounds.x + before.bounds.width / 2) * canvas.width / 640;
  const y = canvas.y + (before.bounds.y + before.bounds.height / 2) * canvas.height / 360;
  const client = await page.context().newCDPSession(page);

  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y, radiusX: 12, radiusY: 12, force: 1, id: 1 }]
  });
  await page.waitForTimeout(300);
  const during = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("OverworldScene");
    const button = scene.input._list.find((object) => object.type === "Arc" && object.x > 0 && object.parentContainer?.x === 84);
    return {
      playerX: scene.player.x,
      pad: scene.pad.getVector(),
      fillColor: button.fillColor
    };
  });
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForTimeout(80);
  const after = await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("OverworldScene").pad.getVector());

  assert.equal(during.pad.x, 1, "holding the mobile right button must activate the pad vector");
  assert.ok(during.playerX > before.playerX + 8, `touch hold must move the player right: ${before.playerX} -> ${during.playerX}`);
  assert.notEqual(during.fillColor, before.fillColor, "pressed mobile direction must show immediate visual feedback");
  assert.deepEqual(after, { x: 0, y: 0 }, "releasing touch must stop mobile movement");
}

async function waitForScene(page, predicate, message, timeout = 5000, argument = null) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await page.evaluate(predicate, argument)) return;
    await page.waitForTimeout(100);
  }
  if (await page.evaluate(predicate, argument)) return;
  const diagnostics = await page.evaluate(() => window.__ANIMAL_GAME__?.scene?.scenes?.map((scene) => ({
    key: scene.scene.key,
    status: scene.sys.settings.status,
    playerActive: scene.player?.active ?? null,
    worldMapPrimaryActive: scene.children?.getByName?.("world-map-primary")?.active ?? null,
    titlePrimaryActive: scene.children?.getByName?.("title-primary")?.active ?? null,
    dexBackActive: scene.children?.getByName?.("dex-back-button")?.active ?? null
  })) || []);
  throw new Error(`${message}; scene diagnostics: ${JSON.stringify(diagnostics)}`);
}

async function exerciseAdventureNavigation(page, { touch = false } = {}) {
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("TitleScene")?.children?.getByName("title-primary")?.active === true,
    "title entry scene did not become active",
    15000
  );

  const title = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("TitleScene");
    const read = (name) => {
      const object = scene.children.getByName(name);
      const value = object?.getBounds?.();
      return object && value ? {
        bounds: { x: value.x, y: value.y, width: value.width, height: value.height },
        fontSize: Number.parseFloat(object.style?.fontSize) || null
      } : null;
    };
    return {
      primary: scene.children.getByName("title-primary")?.active === true,
      dex: scene.children.getByName("title-dex")?.active === true,
      panel: read("title-panel"),
      heading: read("title-heading")
    };
  });
  assert.ok(title.primary, "title start action is missing");
  assert.ok(title.dex, "title dex action is missing");
  assert.ok(title.panel && title.heading, "title panel copy contract is missing");
  assertContained(title.heading.bounds, title.panel.bounds, "title heading", 13);
  assert.ok(title.heading.fontSize >= 22, "title heading must keep the 22px readability floor");

  await activateSceneButton(page, "TitleScene", "title-dex");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("DexScene")?.children?.getByName("dex-back-button")?.active === true,
    "title dex button did not open DexScene"
  );
  assert.equal(
    await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("DexScene").from),
    "TitleScene",
    "DexScene must remember that it opened from the title"
  );
  await activateSceneButton(page, "DexScene", "dex-back-button");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("TitleScene")?.children?.getByName("title-primary")?.active === true,
    "dex back button did not return to the title"
  );

  await activateSceneButton(page, "TitleScene", "title-primary");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.children?.getByName("world-map-primary")?.active === true,
    "title start action did not open the world map"
  );

  const worldMap = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("WorldMapScene");
    const named = (name) => {
      const object = scene.children.getByName(name);
      let bounds = null;
      try { const b = object?.getBounds?.(); if (b) bounds = { x: b.x, y: b.y, width: b.width, height: b.height }; } catch {}
      return object ? { visible: object.visible !== false, bounds } : null;
    };
    return {
      selectedRegionId: scene.selectedRegionId,
      map: named("world-map"),
      primary: named("world-map-primary"),
      dex: named("world-map-dex"),
      playerMarker: named("world-map-player"),
      regionButtons: scene.regionButtons.map((button) => ({
        name: button.name,
        enabled: button.buttonBg.input?.enabled !== false,
        regionId: button.regionId,
        unlocked: button.unlocked
      }))
    };
  });
  assert.equal(worldMap.selectedRegionId, "around", "fresh progress must select the first region");
  assert.ok(worldMap.map?.visible, "world map must be the first interactive screen");
  assert.ok(worldMap.primary?.visible && worldMap.primary.bounds, "world map primary action is missing");
  assert.ok(worldMap.dex?.visible && worldMap.dex.bounds, "world map dex action is missing");
  assert.equal(worldMap.regionButtons.length, 5, "world map must show five region nodes");
  assert.equal(worldMap.regionButtons.filter((button) => button.enabled).length, 5, "locked region nodes must remain selectable");
  assert.equal(worldMap.regionButtons.filter((button) => button.unlocked).length, 1, "only the first region should be unlocked on fresh progress");
  assert.ok(worldMap.playerMarker?.visible, "world map selection must have a visible player sprite");
  assertInCanvas(worldMap.primary, "world-map-primary");
  assertInCanvas(worldMap.dex, "world-map-dex");

  const dynamicButtonCopy = await page.evaluate(() => {
    const button = window.__ANIMAL_GAME__.scene.getScene("WorldMapScene").children.getByName("world-map-primary");
    const original = button.buttonText.text;
    const bounds = (object) => {
      const value = object.getBounds();
      return { x: value.x, y: value.y, width: value.width, height: value.height };
    };
    button.setText("잠금 지역의 탐험 순서를 바꾸고 이 지역으로 먼저 이동하기");
    const long = { text: bounds(button.buttonText), panel: bounds(button.buttonBg), fontSize: Number.parseFloat(button.buttonText.style.fontSize) };
    button.setText("탐험");
    const shortFontSize = Number.parseFloat(button.buttonText.style.fontSize);
    button.setText(original);
    return { long, shortFontSize };
  });
  assertContained(dynamicButtonCopy.long.text, dynamicButtonCopy.long.panel, "dynamic world-map button copy", 6);
  assert.ok(dynamicButtonCopy.long.fontSize >= 9, "dynamic button copy must keep the 9px readability floor");
  assert.equal(dynamicButtonCopy.shortFontSize, 16, "shorter button copy must restore its preferred font size");

  await pressSceneButton(page, "WorldMapScene", "world-map-region-land", { touch });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.selectedRegionId === "land",
    "locked land region was not selected"
  );
  const landSelection = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("WorldMapScene");
    return {
      markerX: scene.children.getByName("world-map-player")?.x,
      primaryLabel: scene.children.getByName("world-map-primary")?.buttonText?.text
    };
  });
  assert.equal(landSelection.markerX, 192, "player marker must move to the selected land region");
  assert.match(landSelection.primaryLabel, /먼저 탐험/, "locked selection must expose an early-exploration action");

  await pressSceneButton(page, "WorldMapScene", "world-map-region-land", { touch });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.selectedRegionId === "around",
    "selecting the locked region twice did not restore the current mission selection"
  );

  await pressSceneButton(page, "WorldMapScene", "world-map-region-land", { touch });
  await pressSceneButton(page, "WorldMapScene", "world-map-primary", { touch });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.children?.getByName("world-map-order-dialog")?.visible === true,
    "locked region did not open the order-change dialog"
  );
  assert.equal(
    await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("WorldMapScene").orderDialogTargetId),
    "land",
    "order-change dialog must target the selected locked region"
  );
  await pressSceneButton(page, "WorldMapScene", "world-map-order-keep", { touch });
  await waitForScene(
    page,
    () => {
      const scene = window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene");
      return scene?.selectedRegionId === "around" && !scene.children?.getByName("world-map-order-dialog");
    },
    "keeping the current order did not restore the mission selection"
  );

  await pressSceneButton(page, "WorldMapScene", "world-map-region-land", { touch });
  await pressSceneButton(page, "WorldMapScene", "world-map-primary", { touch });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.children?.getByName("world-map-order-dialog")?.visible === true,
    "second locked-region selection did not reopen the order-change dialog"
  );
  await pressSceneButton(page, "WorldMapScene", "world-map-order-confirm", { touch });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("OverworldScene")?.player?.active === true,
    "order-change confirmation did not enter the locked region",
    15000
  );
  const earlyRegion = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("OverworldScene");
    const markers = scene.children.list.filter((object) => object.name?.startsWith("animal-marker-"));
    return {
      regionId: scene.currentRegionId,
      playerX: scene.player.x,
      markerCount: markers.length,
      animatedCount: markers.filter((marker) => marker.animalBody?.anims?.isPlaying).length,
      generatedCount: markers.filter((marker) => marker.animalBody?.texture?.key?.startsWith("mini-")).length
    };
  });
  assert.equal(earlyRegion.regionId, "land", "early exploration must start inside the selected land region");
  assert.ok(earlyRegion.playerX >= 25 * 32, `early exploration player must start inside land bounds, got x=${earlyRegion.playerX}`);
  assert.equal(earlyRegion.markerCount, 40, "overworld must create one marker for every animal");
  assert.equal(earlyRegion.generatedCount, 40, "every overworld marker must use a generated animal texture");
  assert.equal(earlyRegion.animatedCount, 40, "every overworld animal must play its two-frame marker animation");

  const wanderStart = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("OverworldScene");
    const snapshot = (id, preferWater = null) => {
      const marker = scene.children.getByName(`animal-marker-${id}`);
      if (!marker?.encounterZone) throw new Error(`${id} encounter marker is missing its moving zone`);
      const step = marker.wanderTiles
        .map((current) => {
          const adjacent = marker.wanderTiles.filter((tile) => (
            Math.abs(tile.tx - current.tx) + Math.abs(tile.ty - current.ty) === 1
          ));
          const target = adjacent.find((tile) => preferWater === null || tile.water === preferWater);
          return target ? { current, target } : null;
        })
        .find(Boolean);
      if (!step) throw new Error(`${id} has no adjacent wander step for the requested surface`);
      const { current, target } = step;
      marker.wanderTimer?.remove(false);
      scene.tweens.killTweensOf(marker);
      const currentCenter = scene.world.tileCenter(current.tx, current.ty);
      marker.setPosition(currentCenter.x, currentCenter.y);
      marker.currentWanderTile = current;
      scene.syncEncounterZone(marker);
      const before = {
        id,
        surface: marker.wanderSurface,
        x: marker.x,
        y: marker.y,
        target,
        ringAttached: marker.pulseRing?.parentContainer === marker,
        zoneWidth: marker.encounterZone.width
      };
      const tween = scene.moveEncounterMarker(marker, target, { duration: 90, scheduleNext: false });
      if (!tween) throw new Error(`${id} forced wander tween was not created`);
      tween.seek(tween.totalDuration, tween.totalDuration, true);
      marker.currentWanderTile = target;
      scene.syncEncounterZone(marker);
      return before;
    };

    const markers = scene.children.list.filter((object) => object.name?.startsWith("animal-marker-"));
    const land = snapshot("고양이", false);
    const water = snapshot("붕어", true);
    const shore = snapshot("개구리", true);
    return {
      movingCount: markers.filter((marker) => marker.encounterZone && marker.wanderTiles?.length > 0).length,
      waterStartsOnWater: markers
        .filter((marker) => marker.wanderSurface === "water")
        .every((marker) => scene.world.isShoreWaterTile(marker.currentWanderTile.tx, marker.currentWanderTile.ty)),
      waterRoutesStayBlocked: markers
        .filter((marker) => marker.wanderSurface !== "land")
        .every((marker) => marker.wanderTiles
          .filter((tile) => tile.water)
          .every((tile) => scene.world.isBlockedPx(tile.tx * 32 + 16, tile.ty * 32 + 16))),
      land,
      water,
      shore
    };
  });
  assert.equal(wanderStart.movingCount, 40, "every uncaught encounter target must have a wander route and moving hit zone");
  assert.ok(wanderStart.waterStartsOnWater, "water-only animals must start on reachable shore-water tiles");
  assert.ok(wanderStart.waterRoutesStayBlocked, "water encounter routes must remain blocked to the player");
  assert.ok(wanderStart.land.ringAttached && wanderStart.water.ringAttached && wanderStart.shore.ringAttached, "pulse rings must travel inside their animal marker");
  assert.equal(wanderStart.land.surface, "land", "cat must use the land wander profile");
  assert.equal(wanderStart.water.surface, "water", "fish must use the water wander profile");
  assert.equal(wanderStart.shore.surface, "shore", "frog must use the mixed shore wander profile");
  assert.ok(wanderStart.water.target.water && wanderStart.shore.target.water, "aquatic and shore profiles must expose real water movement");
  assert.ok(wanderStart.water.zoneWidth >= 60, "shore-water encounters must remain reachable from land");

  const wanderEnd = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("OverworldScene");
    return ["고양이", "붕어", "개구리"].map((id) => {
      const marker = scene.children.getByName(`animal-marker-${id}`);
      const zone = marker.encounterZone;
      return {
        id,
        x: marker.x,
        y: marker.y,
        zoneDistance: Math.hypot(marker.x - zone.x, marker.y - zone.y),
        onWater: scene.world.isWaterTile(marker.currentWanderTile.tx, marker.currentWanderTile.ty)
      };
    });
  });
  [wanderStart.land, wanderStart.water, wanderStart.shore].forEach((before) => {
    const after = wanderEnd.find((item) => item.id === before.id);
    assert.ok(Math.hypot(after.x - before.x, after.y - before.y) >= 31, `${before.id} must actually move to a neighbouring tile`);
    assert.ok(after.zoneDistance < 0.5, `${before.id} encounter zone must follow the visible marker`);
  });
  assert.ok(wanderEnd.find((item) => item.id === "붕어").onWater, "fish movement must stay on water");
  assert.ok(wanderEnd.find((item) => item.id === "개구리").onWater, "shore animals must be able to enter water");

  await activateSceneButton(page, "OverworldScene", "overworld-map");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.children?.getByName("world-map-primary")?.active === true,
    "early exploration did not return to the world map"
  );
  assert.equal(
    await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("WorldMapScene").selectedRegionId),
    "land",
    "world map must remember the region returned from early exploration"
  );
  await pressSceneButton(page, "WorldMapScene", "world-map-region-around", { touch });

  await activateSceneButton(page, "WorldMapScene", "world-map-dex");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("DexScene")?.children?.getByName("dex-back-button")?.active === true,
    "world-map dex button did not open DexScene"
  );
  assert.equal(
    await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("DexScene").from),
    "WorldMapScene",
    "DexScene must remember that it opened from the world map"
  );

  await activateSceneButton(page, "DexScene", "dex-back-button");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.children?.getByName("world-map-primary")?.active === true,
    "dex back button did not return to the world map"
  );

  await page.evaluate(() => {
    localStorage.setItem("animal-encyclopedia-collected-v1", JSON.stringify(["고양이"]));
  });
  await activateSceneButton(page, "WorldMapScene", "world-map-dex");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("DexScene")?.children?.getByName("dex-card-고양이")?.buttonBg?.input?.enabled === true,
    "collected animal card did not become interactive"
  );
  await activateSceneButton(page, "DexScene", "dex-card-고양이");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("DexScene")?.children?.getByName("dex-detail")?.visible === true,
    "collected animal detail did not open"
  );
  const detail = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("DexScene");
    return {
      animalId: scene.detailAnimalId,
      uncollectedInteractive: scene.children.getByName("dex-card-개")?.buttonBg?.input?.enabled === true,
      closeVisible: scene.children.getByName("dex-detail-close")?.visible === true
    };
  });
  assert.equal(detail.animalId, "고양이", "dex detail must show the selected collected animal");
  assert.equal(detail.uncollectedInteractive, false, "uncollected animal cards must not open details");
  assert.ok(detail.closeVisible, "dex detail close action is missing");
  await activateSceneButton(page, "DexScene", "dex-detail-close");
  await waitForScene(
    page,
    () => !window.__ANIMAL_GAME__?.scene?.getScene("DexScene")?.children?.getByName("dex-detail"),
    "dex detail did not close"
  );
  await activateSceneButton(page, "DexScene", "dex-back-button");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.children?.getByName("world-map-primary")?.active === true,
    "dex back button did not return to the world map after detail viewing"
  );
  await page.evaluate(() => localStorage.removeItem("animal-encyclopedia-collected-v1"));

  await activateSceneButton(page, "WorldMapScene", "world-map-primary");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("OverworldScene")?.player?.active === true,
    "world-map primary action did not start the adventure",
    8000
  );
  const overworld = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("OverworldScene");
    const buttonInfo = (name) => {
      const object = scene.children.getByName(name);
      let bounds = null;
      try { const b = object?.getBounds?.(); if (b) bounds = { x: b.x, y: b.y, width: b.width, height: b.height }; } catch {}
      return object ? { visible: object.visible !== false, bounds } : null;
    };
    return {
      player: {
        scaleX: scene.player.scaleX,
        displayWidth: scene.player.displayWidth,
        displayHeight: scene.player.displayHeight
      },
      map: buttonInfo("overworld-map"),
      dex: buttonInfo("overworld-dex")
    };
  });
  assert.ok(overworld.player.scaleX >= 1.65, `overworld player scale must be enlarged, got ${overworld.player.scaleX}`);
  assert.ok(overworld.player.displayHeight >= 78, `overworld player must be visually prominent, got ${overworld.player.displayHeight}`);
  assertInCanvas(overworld.map, "overworld-map");
  assertInCanvas(overworld.dex, "overworld-dex");
  assert.ok(!overlaps(overworld.map.bounds, overworld.dex.bounds), "overworld map and dex buttons must not overlap");

  if (touch) await exerciseTouchMovement(page);

  if (touch) await clickBounds(page, overworld.dex.bounds, { touch: true });
  else await activateSceneButton(page, "OverworldScene", "overworld-dex");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("DexScene")?.children?.getByName("dex-back-button")?.active === true,
    "overworld dex button did not open DexScene"
  );
  assert.equal(
    await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("DexScene").from),
    "OverworldScene",
    "DexScene must remember that it opened from the adventure"
  );

  await activateSceneButton(page, "DexScene", "dex-back-button");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("OverworldScene")?.player?.active === true,
    "dex back button did not return to the adventure",
    15000
  );
  if (touch) await clickBounds(page, overworld.map.bounds, { touch: true });
  else await activateSceneButton(page, "OverworldScene", "overworld-map");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("WorldMapScene")?.children?.getByName("world-map-primary")?.active === true,
    "overworld map button did not return to the world map"
  );
}

async function exerciseCombatLifecycle(page) {
  await page.evaluate(() => {
    window.__ANIMAL_GAME__.scene.start("QuizBattleScene", {
      animalId: "고양이",
      regionId: "around",
      returnPos: { x: 8 * 32 + 16, y: 19 * 32 + 16 }
    });
  });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.observationStage === "overview",
    "flee regression encounter did not reach overview",
    8000
  );
  await activateSceneButton(page, "QuizBattleScene", "battle-flee");
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("OverworldScene")?.player?.active === true,
    "flee action did not return to the overworld",
    8000
  );

  const fleeSetup = await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("OverworldScene");
    const marker = scene.children.getByName("animal-marker-고양이");
    const origin = { x: scene.player.x, y: scene.player.y };
    const farAnimalTile = [...marker.wanderTiles].sort((a, b) => {
      const centerA = scene.world.tileCenter(a.tx, a.ty);
      const centerB = scene.world.tileCenter(b.tx, b.ty);
      return Math.hypot(centerB.x - origin.x, centerB.y - origin.y)
        - Math.hypot(centerA.x - origin.x, centerA.y - origin.y);
    })[0];
    marker.wanderTimer?.remove(false);
    scene.tweens.killTweensOf(marker);
    const farCenter = scene.world.tileCenter(farAnimalTile.tx, farAnimalTile.ty);
    marker.setPosition(farCenter.x, farCenter.y);
    marker.currentWanderTile = farAnimalTile;
    scene.syncEncounterZone(marker);
    return { origin, animalTile: farAnimalTile };
  });
  await page.waitForTimeout(1500);
  const stationaryFlee = await page.evaluate(() => {
    const game = window.__ANIMAL_GAME__;
    const scene = game.scene.getScene("OverworldScene");
    const marker = scene.children.getByName("animal-marker-고양이");
    return {
      overworldActive: scene.scene.isActive(),
      battleActive: game.scene.getScene("QuizBattleScene").scene.isActive(),
      armed: marker.encounterZone.getData("armed"),
      player: { x: scene.player.x, y: scene.player.y },
      marker: { x: marker.x, y: marker.y }
    };
  });
  assert.ok(stationaryFlee.overworldActive && !stationaryFlee.battleActive, "stationary flee must stay in the overworld");
  assert.equal(stationaryFlee.armed, false, "moving animal must not re-arm while the player stays at the fled encounter point");
  assert.ok(
    Math.hypot(stationaryFlee.marker.x - stationaryFlee.player.x, stationaryFlee.marker.y - stationaryFlee.player.y) > 58,
    `flee regression must place the animal far enough to reproduce the former auto-arm bug: ${JSON.stringify(stationaryFlee)}`
  );

  await page.evaluate(({ origin, animalTile }) => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("OverworldScene");
    const marker = scene.children.getByName("animal-marker-고양이");
    const animalCenter = scene.world.tileCenter(animalTile.tx, animalTile.ty);
    const playerTile = [...marker.wanderTiles]
      .map((tile) => ({ tile, center: scene.world.tileCenter(tile.tx, tile.ty) }))
      .filter(({ center }) => Math.hypot(center.x - origin.x, center.y - origin.y) > 72)
      .sort((a, b) => (
        Math.hypot(b.center.x - animalCenter.x, b.center.y - animalCenter.y)
        - Math.hypot(a.center.x - animalCenter.x, a.center.y - animalCenter.y)
      ))[0];
    if (!playerTile) throw new Error("cat wander area has no safe re-arm tile");
    scene.player.setPosition(playerTile.center.x, playerTile.center.y);
  }, fleeSetup);
  await waitForScene(
    page,
    () => {
      const scene = window.__ANIMAL_GAME__?.scene?.getScene("OverworldScene");
      return scene?.children?.getByName("animal-marker-고양이")?.encounterZone?.getData("armed") === true;
    },
    "fled encounter did not re-arm after the player actually left",
    3000
  );

  await page.evaluate(() => {
    window.__ANIMAL_GAME__.scene.getScene("OverworldScene").scene.start("QuizBattleScene", { animalId: "개" });
  });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.phase === "observe",
    "second encounter did not reach observation phase",
    8000
  );
  assert.equal(
    await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene").ballThrown),
    false,
    "ballThrown must reset for every encounter"
  );

  await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene");
    scene.observeChecks = { appearance: true, lifestyle: true, habitat: true };
    scene.observePage = 2;
    scene.startBattle();
  });

  const questionCount = await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene").questions.length);
  for (let index = 0; index < questionCount; index += 1) {
    await page.evaluate(() => {
      const scene = window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene");
      scene.onAnswer(scene.questions[scene.qIndex].correct);
    });
    if (index < questionCount - 1) {
      await waitForScene(
        page,
        (expectedIndex) => {
          const scene = window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene");
          return scene?.phase === "battle" && scene.qIndex === expectedIndex && scene.busy === false;
        },
        `correct answer ${index + 1} did not advance to the next question`,
        4000,
        index + 1
      );
    }
  }
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.phase === "victory",
    "correct-answer sequence did not reach victory",
    5000
  );
  await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene").throwBall());
  await page.waitForFunction(
    () => window.localStorage.getItem("animal-encyclopedia-collected-v1")?.includes("개"),
    null,
    { timeout: 8000 }
  );

  await page.evaluate(() => {
    window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene").scene.restart({ animalId: "고양이" });
  });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.phase === "observe",
    "post-capture encounter did not restart cleanly",
    8000
  );
  assert.equal(
    await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene").ballThrown),
    false,
    "ballThrown remained true after a completed capture"
  );

  await page.evaluate(() => {
    const scene = window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene");
    scene.observeChecks = { appearance: true, lifestyle: true, habitat: true };
    scene.observePage = 2;
    scene.startBattle();
    scene.playerHearts = 1;
    const question = scene.questions[0];
    scene.onAnswer(question.options.find((answer) => answer !== question.correct));
  });
  await waitForScene(
    page,
    () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.phase === "retreat",
    "zero-heart sequence did not reach retreat",
    5000
  );
  const retreat = await sceneObjects(page);
  assertHidden(retreat, "player-status");
  assertHidden(retreat, "enemy-status");
  named(retreat, "battle-player");
}

async function exerciseViewport(browser, viewport, baseUrl) {
  const touch = viewport.width <= 1024;
  const context = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch });
  const page = await context.newPage();
  const tag = `${viewport.width}x${viewport.height}`;
  const externalRequests = [];
  const localOrigin = new URL(baseUrl).origin;
  const shouldBlockLocalPhoto = viewport.width === 844;
  const shouldTestAutoAdvanceCancellation = viewport.width === 1280;
  console.log(`[battle-ui] ${tag} started`);
  try {
    await page.route("**/*", (route) => {
      const url = route.request().url();
      const requestUrl = new URL(url);
      if ((requestUrl.protocol === "http:" || requestUrl.protocol === "https:") && requestUrl.origin !== localOrigin) {
        externalRequests.push(url);
        return route.abort();
      }
      if (shouldBlockLocalPhoto && url.includes("/assets/animals/photos/")) return route.abort();
      return route.continue();
    });
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  } catch (error) {
    throw new Error(`${tag}: could not open local dist server: ${error.message}`);
  }
  try {
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForScene(page, () => Boolean(window.__ANIMAL_GAME__), "window.__ANIMAL_GAME__ did not initialize");
    await waitForScene(
      page,
      () => window.__ANIMAL_GAME__?.scene?.getScene("TitleScene")?.children?.getByName("title-primary")?.active === true,
      "title scene did not become ready before the cold encounter check",
      15000
    );
    await page.evaluate(() => {
      window.__BATTLE_UI_ENCOUNTER_STARTED_AT__ = performance.now();
      window.__ANIMAL_GAME__.scene.getScene("TitleScene").scene.start("QuizBattleScene", { animalId: "호랑이" });
    });
    await waitForScene(
      page,
      (expectPhoto) => {
        const scene = window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene");
        const photoReady = scene?.overviewPhotoHolder?.list?.some((child) => (
          child.name === (expectPhoto ? "overview-photo" : "overview-photo-fallback")
        ));
        return scene?.phase === "observe" && scene.observationStage === "overview" && photoReady;
      },
      "cold encounter did not reach a ready observation overview",
      8000,
      !shouldBlockLocalPhoto
    );
    const overviewReadyMs = await page.evaluate(() => (
      performance.now() - window.__BATTLE_UI_ENCOUNTER_STARTED_AT__
    ));
    assert.ok(overviewReadyMs < 1200, `cold encounter overview must be ready within 1.2s, got ${overviewReadyMs}ms`);
    await page.evaluate(() => window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene").scene.start("TitleScene"));
    await waitForScene(
      page,
      () => window.__ANIMAL_GAME__?.scene?.getScene("TitleScene")?.children?.getByName("title-primary")?.active === true,
      "cold encounter check did not return to the title"
    );

    await exerciseAdventureNavigation(page, { touch });
    await page.evaluate(() => {
      window.__ANIMAL_GAME__.scene.getScene("WorldMapScene").scene.start("QuizBattleScene", { animalId: "호랑이" });
    });
    await waitForScene(
      page,
      () => {
        const scene = window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene");
        return scene?.phase === "observe"
          && scene.observationStage === "overview"
          && scene.children?.getByName("overview-panel")?.visible === true;
      },
      "QuizBattleScene did not reach the full-photo overview",
      8000
    );

    const overview = await sceneObjects(page);
    const overviewPanel = named(overview, "overview-panel");
    const overviewFrame = named(overview, "overview-photo-frame");
    const overviewAction = named(overview, "primary-action");
    assertHidden(overview, "enemy-card");
    assertHidden(overview, "battle-player");
    assertHidden(overview, "player-status");
    assertHidden(overview, "enemy-status");
    assertInCanvas(overviewPanel, "overview-panel");
    assertContained(overviewFrame.bounds, overviewPanel.bounds, "overview photo frame", 12);
    assertContained(overviewAction.bounds, overviewPanel.bounds, "overview primary action", 2);
    assert.equal(externalRequests.length, 0, "the game must not make external requests at runtime");

    if (shouldBlockLocalPhoto) {
      const overviewFallback = named(overview, "overview-photo-fallback");
      assertContained(overviewFallback.bounds, overviewFrame.bounds, "overview pixel fallback", 6);
    } else {
      await waitForScene(
        page,
        () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.overviewPhotoHolder?.list
          ?.some((child) => child.name === "overview-photo"),
        "local overview photo did not render",
        3000
      );
      const loadedOverview = await sceneObjects(page);
      const overviewPhoto = named(loadedOverview, "overview-photo");
      assertContained(overviewPhoto.bounds, overviewFrame.bounds, "uncropped local overview photo", 6);
      assert.equal(
        await page.locator("canvas").evaluate((canvas) => getComputedStyle(canvas).imageRendering),
        "auto",
        "overview must smooth the real photo instead of pixel-scaling it"
      );
    }

    await activateNamedButton(page, "primary-action");
    await waitForScene(
      page,
      () => {
        const scene = window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene");
        return scene?.phase === "observe" && scene.observationStage === "details" && scene.observePage === 0;
      },
      "overview action did not enter feature observation"
    );
    assert.notEqual(
      await page.locator("canvas").evaluate((canvas) => getComputedStyle(canvas).imageRendering),
      "auto",
      "feature observation must restore the pixel-art canvas filter"
    );

    if (shouldTestAutoAdvanceCancellation) {
      await activateNamedButton(page, "primary-action");
      await activateSceneButton(page, "QuizBattleScene", "observe-previous");
      await page.waitForTimeout(OBSERVATION_AUTO_ADVANCE_TEST_WAIT_MS);
      const cancelledAdvance = await page.evaluate(() => {
        const scene = window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene");
        return {
          stage: scene.observationStage,
          page: scene.observePage,
          pending: scene.observationAdvancePending
        };
      });
      assert.deepEqual(
        cancelledAdvance,
        { stage: "overview", page: 0, pending: false },
        "returning to the full photo must cancel pending auto-advance"
      );
      await page.evaluate(() => {
        window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene").observeChecks.appearance = false;
      });
      await activateNamedButton(page, "primary-action");
      await waitForScene(
        page,
        () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.observationStage === "details",
        "overview did not reopen feature observation after cancellation"
      );
    }

    for (let pageIndex = 0; pageIndex < 3; pageIndex += 1) {
      const snapshot = await sceneObjects(page);
      const card = named(snapshot, "enemy-card");
      const panel = named(snapshot, "observe-panel");
      const action = named(snapshot, "primary-action");
      assertInCanvas(card, "enemy-card"); assertInCanvas(panel, "observe-panel");
      assert.ok(!overlaps(card.bounds, panel.bounds), "enemy-card and observe-panel must not overlap");
      assertHidden(snapshot, "battle-player");
      assertHidden(snapshot, "player-status");
      assertHidden(snapshot, "enemy-status");
      assertInCanvas(action, "primary-action");
      await activateNamedButton(page, "primary-action");
      if (pageIndex < 2) {
        await waitForScene(
          page,
          (expectedPage) => {
            const scene = window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene");
            return scene?.observationStage === "details" && scene.observePage === expectedPage;
          },
          `checking observation page ${pageIndex + 1} did not auto-advance`,
          5000,
          pageIndex + 1
        );
      } else {
        await waitForScene(
          page,
          () => {
            const scene = window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene");
            return scene?.phase === "observe"
              && Object.values(scene.observeChecks).every(Boolean)
              && scene.children?.getByName("primary-action")?.buttonText?.text?.includes("퀴즈 배틀");
          },
          "last observation check did not expose the battle action"
        );
        await activateNamedButton(page, "primary-action");
      }
    }
    await waitForScene(page, () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.phase === "battle", "battle phase did not render");
    const battle = await sceneObjects(page);
    const hud = [
      named(battle, "enemy-card"),
      named(battle, "battle-player"),
      named(battle, "player-status"),
      named(battle, "enemy-status"),
      named(battle, "question-panel")
    ];
    hud.forEach((o) => assertInCanvas(o, o.name));
    for (let i = 0; i < hud.length; i += 1) for (let j = i + 1; j < hud.length; j += 1) assert.ok(!overlaps(hud[i].bounds, hud[j].bounds), `${hud[i].name} and ${hud[j].name} must not overlap`);
    const questionPanel = named(battle, "question-panel");
    const factCopy = named(battle, "fact-copy");
    const questionCopy = named(battle, "question-copy");
    assertContained(factCopy.bounds, questionPanel.bounds, "fact-copy", 10);
    assertContained(questionCopy.bounds, questionPanel.bounds, "question-copy", 10);
    assert.ok(!overlaps(factCopy.bounds, questionCopy.bounds), "fact and question copy must not overlap");

    await page.evaluate(({ question, facts }) => {
      const scene = window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene");
      scene.__layoutTestQuestion = scene.questions[0].text;
      scene.__layoutTestBuildSafeFacts = scene.buildSafeFacts;
      scene.questions[0].text = question;
      scene.buildSafeFacts = () => facts;
      scene.showQuestion();
    }, { question: longestQuestion, facts: longestFacts });
    const longestCopy = await sceneObjects(page);
    const longestPanel = named(longestCopy, "question-panel");
    const longestFactCopy = named(longestCopy, "fact-copy");
    const longestQuestionCopy = named(longestCopy, "question-copy");
    assertContained(longestFactCopy.bounds, longestPanel.bounds, "longest fact-copy", 8);
    assertContained(longestQuestionCopy.bounds, longestPanel.bounds, "longest question-copy", 8);
    assert.ok(!overlaps(longestFactCopy.bounds, longestQuestionCopy.bounds), "longest fact and question copy must not overlap");
    assert.ok(longestFactCopy.fontSize >= 8 && longestQuestionCopy.fontSize >= 8, "battle copy must keep the 8px readability floor");
    await page.evaluate(() => {
      const scene = window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene");
      scene.questions[0].text = scene.__layoutTestQuestion;
      scene.buildSafeFacts = scene.__layoutTestBuildSafeFacts;
      delete scene.__layoutTestQuestion;
      delete scene.__layoutTestBuildSafeFacts;
      scene.showQuestion();
    });
    const restoredBattle = await sceneObjects(page);
    const restoredQuestionPanel = named(restoredBattle, "question-panel");
    assertContained(named(restoredBattle, "fact-copy").bounds, restoredQuestionPanel.bounds, "restored fact-copy", 10);
    assertContained(named(restoredBattle, "question-copy").bounds, restoredQuestionPanel.bounds, "restored question-copy", 10);
    const options = restoredBattle.optionButtons.filter((o) => o.visible && o.bounds);
    assert.equal(options.length, 3, `expected three visible answer buttons, found ${options.length}`);
    const canvas = await page.locator("canvas").boundingBox();
    for (const option of options) {
      assert.ok(option.bounds.x >= 0 && option.bounds.y >= 0 && option.bounds.x + option.bounds.width <= 640 && option.bounds.y + option.bounds.height <= 360, `${option.name} must stay inside 640x360 canvas`);
      assert.equal(option.bounds.height, 42, `${option.name} must be 42 logical px high`);
      assert.ok(option.bounds.height * canvas.height / 360 >= 44, `${option.name} must be at least 44 CSS px high`);
    }
    const wrong = await page.evaluate(() => { const s = window.__ANIMAL_GAME__.scene.getScene("QuizBattleScene"); return s.questions[0].options.findIndex((answer) => answer !== s.questions[0].correct); });
    await clickBounds(page, options[wrong]?.bounds || options[0].bounds, { touch });
    await waitForScene(page, () => window.__ANIMAL_GAME__?.scene?.getScene("QuizBattleScene")?.phase === "hint", "hint phase did not render after wrong answer", 4000);
    const hint = named(await sceneObjects(page), "hint-panel");
    assertInCanvas(hint, "hint-panel");
    for (const o of ["enemy-card", "battle-player", "player-status", "enemy-status"]) { const other = (await sceneObjects(page)).objects.find((x) => x.name === o && x.visible); if (other) assert.ok(!overlaps(hint.bounds, other.bounds), `hint-panel and ${o} must not overlap`); }
    if (viewport.width === 1280) await exerciseCombatLifecycle(page);
    assert.equal(externalRequests.length, 0, "the complete game flow must stay on the local origin");
    console.log(`[battle-ui] ${tag} passed`);
  } catch (error) {
    const path = join(tmpdir(), `quiz-battle-layout-${tag}-${Date.now()}.png`);
    await page.screenshot({ path, fullPage: true }).catch(() => {});
    throw new Error(`${tag}: ${error.message}; diagnostic screenshot: ${path}`, { cause: error });
  } finally { await context.close(); }
}

const executablePath = chromePath();
if (!executablePath) {
  const configured = process.env.CHROME_PATH ? ` CHROME_PATH was set to '${process.env.CHROME_PATH}' but does not point to an executable.` : "";
  throw new Error(`Chromium/Chrome not found.${configured} Set CHROME_PATH to a Chromium executable or install a Playwright browser.`);
}
const { server, url } = await serveDist();
try {
  const browser = await chromium.launch({ executablePath, headless: true });
  try { for (const viewport of VIEWPORTS) await exerciseViewport(browser, viewport, url); }
  finally { await browser.close(); }
  console.log(`Quiz battle layout checks passed at ${VIEWPORTS.map((v) => `${v.width}x${v.height}`).join(" and ")}.`);
} finally { await new Promise((resolveClose) => server.close(resolveClose)); }
