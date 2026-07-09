/**
 * legacy/app.js → src/data/animals.js, src/systems/QuizBuilder.js 추출 스크립트
 */
import fs from "fs";

const src = fs.readFileSync("legacy/app.js", "utf8");

function findLineStart(marker) {
  const idx = src.indexOf(marker);
  if (idx < 0) throw new Error(`마커 없음: ${marker}`);
  return idx;
}

function sliceUntilNextConstOrFunction(startIdx, endMarker) {
  const end = src.indexOf(endMarker, startIdx + 1);
  if (end < 0) throw new Error(`끝 마커 없음: ${endMarker}`);
  return src.slice(startIdx, end).trimEnd();
}

// --- animals.js ---
const imageStart = findLineStart("const imageSources = {");
const animalsStart = findLineStart("const animals = [");
// imageSources 블록: animals 직전까지 (닫는 }; 포함)
const imageSourcesCode = src.slice(imageStart, animalsStart).trimEnd();

const aliasesStart = findLineStart("const collectedIdAliases = {");
// animals 배열: collectedIdAliases 직전까지
const animalsArray = src.slice(animalsStart, aliasesStart).trimEnd();

const makeAnimalFn = `
function wikiUrl(lang, title) {
  return \`https://\${lang}.wikipedia.org/wiki/\${encodeURIComponent(title).replace(/%20/g, "_")}\`;
}

/** 동물 한 마리 데이터를 만드는 공장 함수 */
function makeAnimal(name, wiki, categories, habitat, move, body, point, relation, flags, page) {
  const wikiInfo = typeof wiki === "string" ? { title: wiki, lang: "ko" } : wiki;
  return {
    id: name,
    name,
    wikiTitle: wikiInfo.title,
    wikiLang: wikiInfo.lang,
    categories,
    habitat,
    move,
    body,
    quickFacts: {
      habitat,
      movement: move,
      feature: body.slice(0, 2).join(", ")
    },
    point,
    relation,
    page,
    image: imageSources[name],
    source: wikiUrl(wikiInfo.lang, wikiInfo.title),
    ...flags
  };
}
`;

const animalsModule = `// 레거시 app.js에서 이식한 동물 데이터 (교육용 도감)
// 이미지 URL은 Wikimedia, 설명은 초등 과학 수업용입니다.

${imageSourcesCode}

${makeAnimalFn}

${animalsArray.replace("const animals =", "export const animals =")}

export const collectedIdAliases = {
  "오색딱따구리": "딱따구리",
  "황제펭귄": "펭귄",
  "칠게": "게"
};

export const animalById = Object.fromEntries(animals.map((a) => [a.id, a]));

/** 지역(카테고리)에 속한 동물만 골라 줍니다 */
export function getAnimalsByCategory(categoryId) {
  return animals.filter((animal) => animal.categories.includes(categoryId));
}
`;

fs.writeFileSync("src/data/animals.js", animalsModule);
console.log("wrote src/data/animals.js", animalsModule.length);

// --- QuizBuilder.js ---
// buildQuestions부터 hasFinalConsonant 함수 끝까지
const buildStart = findLineStart("function buildQuestions(animal) {");
const hasFinalEnd = src.indexOf("function renderQuiz()", buildStart);
if (hasFinalEnd < 0) throw new Error("buildQuestions 뒤의 renderQuiz를 찾지 못함");

let quizCode = src.slice(buildStart, hasFinalEnd).trimEnd();
quizCode = quizCode.replace(
  "function buildQuestions(animal) {",
  "export function buildQuestions(animal) {"
);

const quizModule = `// 레거시 buildQuestions 계열을 Phaser용으로 이식한 퀴즈 빌더
import { animals } from "../data/animals.js";

/** 배열 순서를 섞습니다 (퀴즈 보기 섞기용) */
function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

${quizCode}
`;

fs.writeFileSync("src/systems/QuizBuilder.js", quizModule);
console.log("wrote src/systems/QuizBuilder.js", quizModule.length);
console.log("추출 완료");
