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
  }
});
