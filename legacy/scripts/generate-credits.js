#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const appPath = path.join(rootDir, "app.js");
const outputPath = path.join(rootDir, "credits.html");

function escapeHTML(value) {
  return String(value).replace(/[&<>"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));
}

function wikiUrl(lang, title) {
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`;
}

function parseImageSources(appJs) {
  const match = appJs.match(/const imageSources = \{([\s\S]*?)\n\};/);
  if (!match) throw new Error("Could not find imageSources in app.js");

  const sources = new Map();
  const entryPattern = /\s*"([^"]+)":\s*"([^"]+)"/g;
  let entry;
  while ((entry = entryPattern.exec(match[1])) !== null) {
    sources.set(entry[1], entry[2]);
  }
  return sources;
}

function parseWiki(rawWiki) {
  const trimmed = rawWiki.trim();
  const stringMatch = trimmed.match(/^"([^"]+)"$/);
  if (stringMatch) return { title: stringMatch[1], lang: "ko" };

  const objectMatch = trimmed.match(/^\{\s*title:\s*"([^"]+)",\s*lang:\s*"([^"]+)"\s*\}$/);
  if (objectMatch) return { title: objectMatch[1], lang: objectMatch[2] };

  throw new Error(`Unsupported wiki field: ${rawWiki}`);
}

function parseAnimals(appJs) {
  const animalPattern = /^\s*makeAnimal\("([^"]+)",\s*("[^"]+"|\{\s*title:\s*"[^"]+",\s*lang:\s*"[^"]+"\s*\})/gm;
  const animals = [];
  let match;

  while ((match = animalPattern.exec(appJs)) !== null) {
    animals.push({ name: match[1], wiki: parseWiki(match[2]) });
  }

  if (!animals.length) throw new Error("Could not find animal records in app.js");
  return animals;
}

function buildCreditsHtml(entries) {
  const rows = entries.map(entry => `          <tr>
            <td>${escapeHTML(entry.name)}</td>
            <td><a href="${escapeHTML(entry.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(entry.wikiTitle)}</a></td>
            <td>${entry.imageUrl ? `<a href="${escapeHTML(entry.imageUrl)}" target="_blank" rel="noopener noreferrer">이미지 파일</a>` : "위키 페이지 이미지"}</td>
            <td>저작자/라이선스는 원본 위키백과·위키미디어 공용 페이지에서 확인</td>
          </tr>`).join("\n");

  return `<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>사진 출처 모음 | 부엉이 동물도감 탐험대</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="./styles.css">
  <style>
    body { padding: 24px; background: #f8f3df; color: #2d1b0e; }
    main { max-width: 1040px; margin: 0 auto; background: rgba(255, 252, 238, 0.95); border: 2px solid rgba(110, 70, 33, 0.18); border-radius: 24px; padding: 24px; box-shadow: 0 18px 40px rgba(45, 27, 14, 0.14); }
    h1 { margin-top: 0; color: #0f6f68; }
    .credits-note { font-weight: 800; color: #5d4a38; line-height: 1.7; }
    .credits-table-wrap { overflow-x: auto; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; }
    th, td { padding: 12px; border-bottom: 1px solid rgba(110, 70, 33, 0.18); text-align: left; vertical-align: top; }
    th { background: #e7f5ef; color: #0f6f68; font-weight: 900; }
    td { background: rgba(255, 255, 255, 0.5); }
    a { color: #0f6f68; font-weight: 900; }
    .back-link { display: inline-flex; min-height: 44px; align-items: center; margin-top: 20px; padding: 10px 14px; border: 2px solid #0f6f68; border-radius: 999px; text-decoration: none; }
  </style>
</head>

<body>
  <main>
    <p class="section-kicker">공개 배포 자료</p>
    <h1>사진 출처 모음</h1>
    <p class="credits-note">동물 사진은 위키백과와 위키미디어 공용의 공개 라이선스 자료를 우선 사용합니다. 각 사진의 정확한 저작자/라이선스 정보는 아래 원본 페이지에서 확인할 수 있어요. 외부 페이지는 새 창에서 열립니다.</p>
    <div class="credits-table-wrap">
      <table>
        <thead>
          <tr>
            <th>동물</th>
            <th>출처 페이지</th>
            <th>이미지 주소</th>
            <th>저작자/라이선스</th>
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>
    <a class="back-link" href="./index.html">동물도감으로 돌아가기</a>
  </main>
</body>

</html>
`;
}

function generateCredits(options = {}) {
  const input = options.appPath || appPath;
  const output = options.outputPath || outputPath;
  const appJs = fs.readFileSync(input, "utf8");
  const imageSources = parseImageSources(appJs);
  const animals = parseAnimals(appJs);
  const entries = animals.map(animal => ({
    name: animal.name,
    wikiTitle: animal.wiki.title,
    sourceUrl: wikiUrl(animal.wiki.lang, animal.wiki.title),
    imageUrl: imageSources.get(animal.name) || ""
  }));

  fs.writeFileSync(output, buildCreditsHtml(entries), "utf8");
  console.log(`Generated ${path.relative(rootDir, output)} from ${path.relative(rootDir, input)}`);
}

if (require.main === module) {
  generateCredits();
}

module.exports = {
  generateCredits
};
