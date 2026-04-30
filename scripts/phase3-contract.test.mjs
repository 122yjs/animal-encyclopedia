import test, { after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const rootDir = process.cwd();
const indexPath = path.join(rootDir, "index.html");
const noQuestionPath = path.join(rootDir, "no-question.html");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "phase3-no-question-"));
const tempOutputPath = path.join(tempDir, "no-question.html");

const removeBlocks = [
  "sidebar-settings",
  "settings-modal",
  "guide-modal",
  "qr-expand-modal",
  "question-confirm-modal",
  "qrcode-script"
];

const replacementMarkers = [
  "open-settings-compat",
  "disabled-question-config"
];

after(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

function readHtml(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

async function generateToTemp() {
  const generatorModule = await import("./generate-no-question.js");
  const { generateNoQuestion } = generatorModule.default || generatorModule;

  generateNoQuestion({
    sourcePath: indexPath,
    outputPath: tempOutputPath
  });

  return readHtml(tempOutputPath);
}

test("no-question.html matches generated output without writing repo files", async () => {
  const beforeHtml = readHtml(noQuestionPath);
  const generatedHtml = await generateToTemp();
  const afterHtml = readHtml(noQuestionPath);

  assert.equal(afterHtml, beforeHtml, "generator test must not modify repo no-question.html");
  assert.equal(generatedHtml, beforeHtml);
});

test("generated no-question.html removes question-room UI and QR wiring", async () => {
  const generatedHtml = await generateToTemp();
  const excludedNeedles = [
    "MagicSchool",
    "settings-modal",
    "guide-modal",
    "qr-expand-modal",
    "question-confirm-modal",
    "vendor/qrcode.js",
    "data-question-url"
  ];

  for (const needle of excludedNeedles) {
    assert.equal(
      generatedHtml.includes(needle),
      false,
      `generated no-question.html should not include ${needle}`
    );
  }
});

test("generated no-question.html keeps student-only question config and shared anchors", async () => {
  const generatedHtml = await generateToTemp();
  const requiredNeedles = [
    "window.APP_CONFIG = {",
    "questionTool: {",
    "featureEnabled: true",
    "enabled: false",
    "allowTeacherSettings: false",
    "hideTeacherSettingsOnSharedPage: true",
    "showWhenDisabled: false",
    'id="catalogView"',
    'id="gameView"',
    'id="detailModal"',
    'id="sourceConfirmModal"',
    'id="onboardingModal"',
    'id="rewardModal"',
    '<script src="./app.js?v=20260430-teacher-share"></script>'
  ];

  for (const needle of requiredNeedles) {
    assert.ok(
      generatedHtml.includes(needle),
      `generated no-question.html should include ${needle}`
    );
  }
});

test("index.html has each no-question generator marker exactly once", () => {
  const indexHtml = readHtml(indexPath);

  for (const blockName of removeBlocks) {
    assert.equal(
      countOccurrences(indexHtml, `<!-- no-question:remove:start ${blockName} -->`),
      1,
      `${blockName} remove start marker should appear exactly once`
    );
    assert.equal(
      countOccurrences(indexHtml, `<!-- no-question:remove:end ${blockName} -->`),
      1,
      `${blockName} remove end marker should appear exactly once`
    );
  }

  for (const markerName of replacementMarkers) {
    assert.equal(
      countOccurrences(indexHtml, `<!-- no-question:replace ${markerName} -->`),
      1,
      `${markerName} replacement marker should appear exactly once`
    );
  }
});
