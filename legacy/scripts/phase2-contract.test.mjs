import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const rootDir = process.cwd();
const creditsPath = path.join(rootDir, "credits.html");
const appPath = path.join(rootDir, "app.js");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function countAnimalRecords() {
  const appJs = read(appPath);
  return (appJs.match(/makeAnimal\(/g) || []).length - 1;
}

test("credits.html provides a centralized photo credits page", () => {
  const html = read(creditsPath);

  assert.ok(html.includes("사진 출처 모음"));
  assert.ok(html.includes("위키백과"));
  assert.ok(html.includes("위키미디어 공용"));
  assert.ok(html.includes("저작자/라이선스"));
  assert.ok(html.includes("동물도감으로 돌아가기"));
  assert.ok(html.includes("target=\"_blank\""));
  assert.ok(html.includes("rel=\"noopener noreferrer\""));

  const rowCount = (html.match(/<tr>/g) || []).length - 1;
  assert.equal(rowCount, countAnimalRecords());
});

test("credits generator can recreate credits.html without touching repo output", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "animal-credits-"));
  const tempOutputPath = path.join(tempDir, "credits.html");

  try {
    const generatorModule = await import("./generate-credits.js");
    const { generateCredits } = generatorModule.default || generatorModule;

    generateCredits({ outputPath: tempOutputPath });

    assert.equal(read(tempOutputPath), read(creditsPath));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("entry pages link to the centralized photo credits page", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(path.join(rootDir, fileName));
    assert.ok(html.includes("href=\"./credits.html\""), `${fileName} should link to credits.html`);
    assert.ok(html.includes("사진 출처 모음"), `${fileName} should label the credits link clearly`);
  }
});

test("runtime supports manifest-based local image paths before remote fallbacks", () => {
  const appJs = read(appPath);

  assert.ok(appJs.includes("paths: config.localImages?.paths || {}"));
  assert.ok(appJs.includes("appConfig.localImages?.paths?.[animal.id]?.[size]"));
  assert.ok(appJs.includes("return configuredPath || `./images/${directory}/${encodeURIComponent(animal.id)}.jpg`;"));
});

test("build config includes local image manifest paths when present", () => {
  const buildJs = read(path.join(rootDir, "scripts/build.js"));

  assert.ok(buildJs.includes("readLocalImageManifest"));
  assert.ok(buildJs.includes('path.join(root, "images", "manifest.json")'));
  assert.ok(buildJs.includes("paths: localImageManifest"));
});

test("build copies static directories file-by-file for stable local image builds", () => {
  const buildJs = read(path.join(rootDir, "scripts/build.js"));

  assert.ok(buildJs.includes("function copyStaticDirectory(source, destination)"));
  assert.ok(buildJs.includes("fs.copyFileSync(sourcePath, destinationPath)"));
  assert.equal(buildJs.includes("fs.cpSync(source"), false);
});

test("local image download script writes thumbs, details, and manifest", () => {
  const script = read(path.join(rootDir, "scripts/download-local-images.js"));

  assert.ok(script.includes("images/thumbs"));
  assert.ok(script.includes("images/details"));
  assert.ok(script.includes("manifest.json"));
  assert.ok(script.includes("fetch("));
  assert.ok(script.includes("width: 200"));
  assert.ok(script.includes("width: 600"));
});

test("local image manifest covers every animal with thumb and detail paths", () => {
  const manifestPath = path.join(rootDir, "images/manifest.json");
  const manifest = JSON.parse(read(manifestPath));

  assert.equal(Object.keys(manifest).length, countAnimalRecords());
  for (const [animalName, paths] of Object.entries(manifest)) {
    assert.ok(paths.thumb, `${animalName} should have a thumb image path`);
    assert.ok(paths.detail, `${animalName} should have a detail image path`);
    assert.ok(paths.detail.includes("/details/"), `${animalName} detail image should use the detail bundle`);
    assert.notEqual(paths.thumb, paths.detail, `${animalName} thumb/detail paths should not be duplicated`);
    const thumbPath = path.join(rootDir, decodeURIComponent(paths.thumb.replace(/^\.\//, "")));
    const detailPath = path.join(rootDir, decodeURIComponent(paths.detail.replace(/^\.\//, "")));
    assert.ok(fs.existsSync(thumbPath), `${animalName} thumb image should exist`);
    assert.ok(fs.existsSync(detailPath), `${animalName} detail image should exist`);
  }
});

test("entry pages include share preview metadata without runtime CDN scripts", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(path.join(rootDir, fileName));

    assert.ok(html.includes('<meta name="description"'));
    assert.ok(html.includes('<meta property="og:title"'));
    assert.ok(html.includes('<meta property="og:description"'));
    assert.ok(html.includes('<meta property="og:image"'));
    assert.ok(html.includes('<meta name="twitter:card" content="summary"'));
    assert.ok(html.includes('<meta name="theme-color"'));
    assert.ok(html.includes('rel="icon" href="data:image/svg+xml'));
    assert.equal(html.includes("@tailwindcss/browser"), false, `${fileName} should not depend on Tailwind CDN at runtime`);
    assert.equal(html.includes("NanumSquareRound"), false, `${fileName} should avoid the extra font CDN`);
  }
});

test("styles keep a simple Korean font stack and reduced-motion fallback", () => {
  const styles = read(path.join(rootDir, "styles.css"));

  assert.ok(styles.includes('"Pretendard Variable", "Pretendard", "Noto Sans KR"'));
  assert.equal(styles.includes("NanumSquareRound"), false);
  assert.ok(styles.includes("@media (prefers-reduced-motion: reduce)"));
  assert.ok(styles.includes("transition: none !important;"));
});

test("modal focus uses an inert fallback for older tablets", () => {
  const appJs = read(appPath);

  assert.ok(appJs.includes("function setModalBackgroundDisabled"));
  assert.ok(appJs.includes('"inert" in element'));
  assert.ok(appJs.includes('element.setAttribute("aria-hidden", "true")'));
  assert.ok(appJs.includes("dataset.inertFallback"));
  assert.equal(appJs.includes("appLayout.inert = true"), false);
});

test("local image bundle stays classroom-friendly in size", () => {
  const imageDir = path.join(rootDir, "images");
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  walk(imageDir);

  const totalBytes = files.reduce((sum, filePath) => sum + fs.statSync(filePath).size, 0);
  const largestBytes = Math.max(...files.map(filePath => fs.statSync(filePath).size));

  assert.ok(files.length > 0, "local image bundle should contain optimized classroom images");
  assert.ok(totalBytes < 6 * 1024 * 1024, `local image bundle should stay under 6MB, got ${totalBytes}`);
  assert.ok(largestBytes < 250 * 1024, `largest image should stay under 250KB, got ${largestBytes}`);
});
