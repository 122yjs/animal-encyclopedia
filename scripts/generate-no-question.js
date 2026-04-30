#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const sourcePath = path.join(rootDir, "index.html");
const outputPath = path.join(rootDir, "no-question.html");

const removeBlocks = [
  "sidebar-settings",
  "settings-modal",
  "guide-modal",
  "qr-expand-modal",
  "question-confirm-modal",
  "qrcode-script"
];

const replacements = {
  "open-settings-compat": [
    '      <button id="openSettings" class="settings-button" type="button" hidden aria-hidden="true" style="display:none">교사용 설정</button>'
  ].join("\n"),
  "disabled-question-config": [
    "  <script>",
    "    window.APP_CONFIG = {",
    "      ...(window.APP_CONFIG || {}),",
    "      questionTool: {",
    "        featureEnabled: false,",
    "        enabled: false,",
    '        url: "",',
    '        label: "🐾 더 궁금한 점 물어볼까요?",',
    '        note: "",',
    "        allowTeacherSettings: false,",
    "        hideTeacherSettingsOnSharedPage: true,",
    "        showWhenDisabled: false",
    "      }",
    "    };",
    "  </script>"
  ].join("\n")
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceExactlyOnce(html, pattern, replacement, label) {
  const matches = html.match(pattern);
  if (!matches || matches.length !== 1) {
    throw new Error(`${label} marker matched ${matches ? matches.length : 0} times`);
  }
  return html.replace(pattern, replacement);
}

function removeMarkedBlock(html, name) {
  const start = `<!-- no-question:remove:start ${name} -->`;
  const end = `<!-- no-question:remove:end ${name} -->`;
  const pattern = new RegExp(`\\n?\\s*${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}\\n?`, "g");
  return replaceExactlyOnce(html, pattern, "\n", `remove:${name}`);
}

function insertReplacement(html, name, replacement) {
  const marker = `<!-- no-question:replace ${name} -->`;
  const pattern = new RegExp(`\\s*${escapeRegExp(marker)}\\n?`, "g");
  return replaceExactlyOnce(html, pattern, `\n${replacement}\n`, `replace:${name}`);
}

function generateNoQuestion(options = {}) {
  const input = options.sourcePath || sourcePath;
  const output = options.outputPath || outputPath;
  let html = fs.readFileSync(input, "utf8");

  for (const name of removeBlocks) {
    html = removeMarkedBlock(html, name);
  }

  for (const [name, replacement] of Object.entries(replacements)) {
    html = insertReplacement(html, name, replacement);
  }

  fs.writeFileSync(output, html, "utf8");
  console.log(`Generated ${path.relative(rootDir, output)} from ${path.relative(rootDir, input)}`);
}

if (require.main === module) {
  generateNoQuestion();
}

module.exports = {
  generateNoQuestion
};
