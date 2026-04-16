#!/usr/bin/env node
/**
 * 동물도감 포켓볼 수집 애니메이션 데모 녹화
 *
 * 사용법:
 *   npm run record:demo
 *   npm run record:demo -- --animal 고양이
 *   npm run record:demo -- --out my-demo
 *
 * 최초 1회: npx playwright install chromium
 */
import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(fileURLToPath(import.meta.url), '..');
const DIST = join(__dirname, '..', 'dist');
const VIDEOS = join(__dirname, '..', 'videos');
const PORT = 8799;
const VIEWPORT = { width: 1280, height: 820 };

const args = process.argv.slice(2);
const animalIdx = args.indexOf('--animal');
const outIdx = args.indexOf('--out');
const animalName = animalIdx >= 0 ? args[animalIdx + 1] : null;
const outName = outIdx >= 0 ? args[outIdx + 1] : 'pokeball-catch';

function findChromium() {
  const cacheDir = join(process.env.HOME || '', 'Library', 'Caches', 'ms-playwright');
  if (!existsSync(cacheDir)) return null;
  const entries = readdirSync(cacheDir).filter(e => e.startsWith('chromium-'));
  entries.sort().reverse();
  for (const entry of entries) {
    const candidates = [
      join(cacheDir, entry, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
      join(cacheDir, entry, 'chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
      join(cacheDir, entry, 'chrome-linux/chrome'),
    ];
    for (const p of candidates) {
      if (existsSync(p)) return p;
    }
  }
  return null;
}

const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
function startServer() {
  return new Promise(resolve => {
    const server = createServer((req, res) => {
      const url = req.url.split('?')[0];
      const file = join(DIST, url === '/' ? '/index.html' : url);
      if (!existsSync(file)) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(readFileSync(file));
    });
    server.listen(PORT, () => resolve(server));
  });
}

// shuffle 고정 (런타임 주입) — 퀴즈 정답이 항상 첫 번째에 오도록
const fixShuffleScript = `if (typeof window.shuffle === 'function') { window.shuffle = function(arr) { return arr; }; }`;

// 포획 완료 감지용 MutationObserver 주입
const watchDoneScript = `
  window.__catchDone = false;
  var origFinish = window.finishQuiz;
  if (typeof origFinish === 'function') {
    window.finishQuiz = function() {
      window.__catchDone = true;
      origFinish.apply(this, arguments);
    };
  }
`;

async function main() {
  console.log('[record] 동물도감 데모 녹화 시작');

  const execPath = findChromium();
  if (!execPath) {
    console.error('[record] Chromium 없음. 실행: npx playwright install chromium');
    process.exit(1);
  }
  console.log(`[record] Chromium: ${execPath}`);

  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('[record] dist/ 없음. 실행: npm run build:distribution');
    process.exit(1);
  }

  const server = await startServer();
  console.log(`[record] 서버: http://localhost:${PORT}`);

  const browser = await chromium.launch({ executablePath: execPath, headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.animal-card', { timeout: 10000 });
  console.log(`[record] 페이지 준비 완료${animalName ? ` (대상: ${animalName})` : ''}`);

  // 런타임 패치 주입 (shuffle 고정 + finishQuiz 가로채기)
  await page.evaluate(fixShuffleScript + watchDoneScript);
  console.log('[record] 런타임 패치 완료');

  if (!existsSync(VIDEOS)) mkdirSync(VIDEOS, { recursive: true });
  const outputPath = join(VIDEOS, `${outName}.webm`);

  // ── 🎬 녹화 시작 ──
  await page.screencast.start({ path: outputPath, size: VIEWPORT });

  // 챕터: 오프닝
  await page.screencast.showChapter('동물도감 포켓볼 수집', { duration: 2500 });
  await page.waitForTimeout(2800);

  // 🖱️ 액션 오버레이 켜기
  await page.screencast.showActions();

  // Step 1: 동물 카드 클릭
  const cardSelector = animalName
    ? `.animal-card:has(h3:text-is("${animalName}"))`
    : '.animal-card';
  await page.locator(cardSelector).first().click({ delay: 200 });
  console.log('[record] 카드 클릭');
  await page.waitForTimeout(1500);

  // Step 2: 퀴즈 시작 버튼 클릭 (모달 안이라 force 필요)
  await page.waitForSelector('[data-start-quiz]', { timeout: 10000 });
  await page.locator('[data-start-quiz]').click({ force: true, delay: 200 });
  console.log('[record] 퀴즈 시작');
  await page.waitForTimeout(1000);

  // Step 3: 퀴즈 3문제 정답 클릭
  for (let i = 0; i < 3; i++) {
    await page.waitForSelector('.answer-button', { timeout: 10000 });
    await page.locator('.answer-button').first().click({ force: true, delay: 150 });
    console.log(`[record] 퀴즈 ${i + 1}/3 정답`);
    await page.waitForTimeout(800);

    if (i < 2) {
      await page.waitForSelector('.next-button', { timeout: 10000 });
      await page.locator('.next-button').click({ force: true, delay: 150 });
      await page.waitForTimeout(800);
    }
  }

  // 🖱️ 액션 오버레이 끄기 (포획 애니메이션은 깔끔하게)
  await page.screencast.hideActions();

  // 포획 애니메이션 대기
  console.log('[record] 포획 애니메이션 재생 중...');
  await page.waitForTimeout(3200);

  // 챕터: 도감 등록 완료
  await page.screencast.showChapter('도감 등록 완료!', { duration: 2500 });
  await page.waitForTimeout(3000);

  // 🎬 녹화 종료
  await page.screencast.stop();
  console.log(`[record] 완료: ${outputPath}`);

  await browser.close();
  server.close();
}

main().catch(e => { console.error('[record] 오류:', e); process.exit(1); });
