const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const filesToCopy = ["index.html", "no-question.html", "styles.css", "app.js"];
const directoriesToCopy = ["vendor"];

const defaultQuestionTool = {
  featureEnabled: true,
  enabled: false,
  url: "",
  label: "더 궁금한 점 물어보기",
  note: "선생님이 준비한 질문 도구가 있으면 함께 이용해 보세요.",
  allowTeacherSettings: true,
  hideTeacherSettingsOnSharedPage: true,
  showWhenDisabled: true
};
const linkedQuestionToolNote = "새 창에서 질문 도우미가 열려요.";

const internalConfigPath = path.join(root, "config", "internal.local.json");

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) continue;

    const equalsIndex = current.indexOf("=");
    if (equalsIndex !== -1) {
      const rawKey = current.slice(2, equalsIndex);
      const rawValue = current.slice(equalsIndex + 1);
      args[rawKey] = rawValue;
    } else {
      const rawKey = current.slice(2);
      const next = argv[index + 1];
      args[rawKey] = next && !next.startsWith("--") ? next : true;
      if (args[rawKey] === next) index += 1;
    }
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertHttpUrl(url, label) {
  if (!url) return "";

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} is not a valid URL: ${url}`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${label} must start with http:// or https://`);
  }

  return parsed.toString();
}

function buildConfig(args) {
  const mode = args.mode || "distribution";
  const questionUrl = args.questionUrl || process.env.QUESTION_URL || "";
  let config = { questionTool: { ...defaultQuestionTool } };

  if (mode === "internal") {
    if (fs.existsSync(internalConfigPath)) {
      config = readJson(internalConfigPath);
    } else if (!questionUrl) {
      throw new Error("Internal builds need config/internal.local.json or QUESTION_URL.");
    }
  } else if (mode !== "distribution") {
    throw new Error(`Unknown build mode: ${mode}`);
  }

  config.questionTool = {
    ...defaultQuestionTool,
    ...(config.questionTool || {})
  };

  if (questionUrl) {
    config.questionTool.enabled = true;
    config.questionTool.url = questionUrl;
    if (!config.questionTool.note || config.questionTool.note === defaultQuestionTool.note) {
      config.questionTool.note = linkedQuestionToolNote;
    }
  }

  if (args.label) config.questionTool.label = args.label;
  if (args.note) config.questionTool.note = args.note;

  config.questionTool.url = assertHttpUrl(config.questionTool.url, "questionTool.url");
  config.questionTool.enabled = Boolean(config.questionTool.enabled && config.questionTool.url);

  return config;
}

function writeAppConfig(config) {
  const output = `window.APP_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
  fs.writeFileSync(path.join(dist, "app-config.js"), output, "utf8");
}

function copyStaticFiles() {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });

  for (const file of filesToCopy) {
    fs.copyFileSync(path.join(root, file), path.join(dist, file));
  }

  for (const directory of directoriesToCopy) {
    fs.cpSync(path.join(root, directory), path.join(dist, directory), { recursive: true });
  }

  fs.writeFileSync(
    path.join(dist, "README.txt"),
    "이 폴더의 index.html을 열거나 정적 호스팅에 올려 학생용 동물도감을 사용할 수 있습니다.\n",
    "utf8"
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = buildConfig(args);
  copyStaticFiles();
  writeAppConfig(config);

  const status = config.questionTool.enabled ? "enabled" : "disabled";
  console.log(`Built ${args.mode || "distribution"} app in dist. Question tool: ${status}.`);
}

main();
