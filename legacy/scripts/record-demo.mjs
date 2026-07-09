#!/usr/bin/env node
/**
 * 동물도감 마지막 포켓볼 포획 장면 데모 녹화
 *
 * 사용법:
 *   npm run record:demo
 *   npm run record:demo -- --animal 고양이
 *   npm run record:demo -- --out my-demo
 *
 * 특징:
 *   - 마지막 "결과 보기" 클릭부터 포획 장면만 짧게 녹화
 *   - README에 바로 포함할 수 있는 tracked 파일로 저장
 *   - 추가 npm 의존성 없음
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
const MEDIA = join(__dirname, '..', 'docs', 'media');
const PORT = 8799;
const VIEWPORT = { width: 1280, height: 820 };

const args = process.argv.slice(2);
const animalIdx = args.indexOf('--animal');
const outIdx = args.indexOf('--out');
const animalName = animalIdx >= 0 ? args[animalIdx + 1] : null;
const outName = outIdx >= 0 ? args[outIdx + 1] : 'pokeball-catch';

// ── Chromium 자동 탐색 ──
function findChromium() {
  const cacheDir = join(process.env.HOME || '', 'Library', 'Caches', 'ms-playwright');
  if (!existsSync(cacheDir)) return null;
  const entries = readdirSync(cacheDir).filter(e => e.startsWith('chromium-'));
  entries.sort().reverse();
  for (const entry of entries) {
    const candidates = [
      join(cacheDir, entry, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
      join(cacheDir, entry, 'chrome-mac', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
      join(cacheDir, entry, 'chrome-linux', 'chrome'),
    ];
    for (const p of candidates) { if (existsSync(p)) return p; }
  }
  return null;
}

// ── 정적 서버 ──
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

async function quietClick(page, selector, options = {}) {
  await page.waitForSelector(selector, { timeout: options.timeout || 10000 });
  await page.locator(selector).first().click({ force: true, delay: options.delay || 50 });
}

async function prepareFinalCatch(page, animalSelector) {
  await quietClick(page, animalSelector);
  await page.waitForTimeout(900);

  await quietClick(page, '[data-start-quiz]');
  await page.waitForTimeout(700);

  for (let index = 0; index < 2; index += 1) {
    await quietClick(page, '.answer-button');
    await page.waitForTimeout(250);
    await quietClick(page, '.next-button');
    await page.waitForTimeout(350);
  }

  await quietClick(page, '.answer-button');
  await page.waitForTimeout(250);
  await page.waitForSelector('.next-button', { timeout: 5000 });
}

// ── shuffle 고정 (런타임 주입 — 소스코드 변형 없음) ──
const fixShuffleScript = `if (typeof window.shuffle === 'function') { window.shuffle = function(arr) { return arr; }; }`;

// ── 메인 ──
async function main() {
  console.log('[record] 동물도감 데모 녹화 시작');

  const execPath = findChromium();
  if (!execPath) { console.error('[record] Chromium 없음. 실행: npx playwright install chromium'); process.exit(1); }
  console.log(`[record] Chromium: ${execPath}`);

  if (!existsSync(join(DIST, 'index.html'))) { console.error('[record] dist/ 없음. 실행: npm run build:distribution'); process.exit(1); }

  const server = await startServer();
  console.log(`[record] 서버: http://localhost:${PORT}`);

  const browser = await chromium.launch({ executablePath: execPath, headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.animal-card', { timeout: 10000 });
  console.log(`[record] 페이지 준비 완료${animalName ? ` (대상: ${animalName})` : ''}`);

  // shuffle 고정 주입
  await page.evaluate(fixShuffleScript);

  const cardSelector = animalName
    ? `.animal-card:has(h3:text-is("${animalName}"))`
    : '.animal-card';
  await prepareFinalCatch(page, cardSelector);
  console.log('[record] 마지막 포획 직전까지 준비 완료');

  if (!existsSync(MEDIA)) mkdirSync(MEDIA, { recursive: true });
  const outputPath = join(MEDIA, `${outName}.webm`);

  await page.screencast.start({ path: outputPath, size: VIEWPORT });
  await page.screencast.showActions();
  await page.waitForTimeout(300);

  console.log('[record] 결과 보기 클릭');
  await page.locator('.next-button').first().click({ force: true, delay: 120 });
  await page.waitForSelector('.catch-overlay.active', { timeout: 5000 });
  await page.waitForSelector('.catch-overlay.is-success', { timeout: 5000 });
  console.log('[record] 포획 애니메이션 재생 완료');

  await page.waitForSelector('text=도감 등록 성공', { timeout: 5000 });
  await page.waitForTimeout(900);

  await page.screencast.stop();
  console.log(`[record] 완료: ${outputPath}`);

  await browser.close();
  server.close();
}

main().catch(e => { console.error('[record] 오류:', e); process.exit(1); });
