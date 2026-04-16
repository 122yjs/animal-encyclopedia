#!/usr/bin/env node
/**
 * 동물도감 포켓볼 수집 애니메이션 데모 녹화
 *
 * 사용법:
 *   npm run record:demo
 *   npm run record:demo -- --animal 고양이
 *   npm run record:demo -- --out my-demo
 *
 * 특징:
 *   - 부드러운 커서 이동 (SVG 커서 + page.mouse.move Bezier 보간)
 *   - 클릭 리플 효과 (webreel 스타일)
 *   - 챕터 오버레이
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
const VIDEOS = join(__dirname, '..', 'videos');
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

// ── SVG 커서 + 리플 주입 (webreel 스타일) ──
// page.mouse.move가 mousemove 이벤트를 발생시키지만,
// headless screencast는 DOM 오버레이를 캡처하지 못할 수 있음.
// 대안: Playwright 내장 showActions()로 클릭 시각화 + page.mouse.move로 커서 궤적 생성
async function injectCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById('demo-cursor')) return;

    // 커서 요소 — headless에서는 보이지 않을 수 있으나
    // page.mouse.move가 mousemove 이벤트를 발생시키면 이동이 캡처됨
    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3L22 14L13 15.5L9.5 24L5 3Z" fill="white" stroke="#333" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;
    cursor.style.cssText = `
      position: fixed; z-index: 999999; pointer-events: none;
      width: 28px; height: 28px; top: -100px; left: -100px;
      transition: left 0.06s linear, top 0.06s linear;
      filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.3));
    `;
    document.body.appendChild(cursor);

    // 클릭 리플 효과
    const ripple = document.createElement('div');
    ripple.id = 'demo-ripple';
    ripple.style.cssText = `
      position: fixed; z-index: 999998; pointer-events: none;
      width: 30px; height: 30px; border-radius: 50%;
      background: radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%);
      transform: translate(-50%, -50%) scale(0); opacity: 0;
      top: 0; left: 0;
    `;
    document.body.appendChild(ripple);

    // mousemove 추적 — page.mouse.move가 보내는 이벤트로 업데이트
    document.addEventListener('mousemove', e => {
      cursor.style.left = (e.clientX - 2) + 'px';
      cursor.style.top = (e.clientY - 2) + 'px';
    });

    // click 리플 — locator.click()이 실제 mouseup/mousedown 이벤트 발생
    document.addEventListener('click', e => {
      ripple.style.transition = 'none';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.opacity = '1';

      requestAnimationFrame(() => {
        ripple.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
        ripple.style.transform = 'translate(-50%, -50%) scale(3)';
        ripple.style.opacity = '0';
      });
    });
  });
}

// ── 부드러운 커서 이동 + 클릭 ──
// 커서 이동: page.mouse.move (부드러운 Bezier 보간)
// 실제 클릭: locator.click({ force: true }) (모달 내부도 우회)
async function moveAndClick(page, selector, options = {}) {
  const { delay = 120, steps = 30, label = '' } = options;

  // 요소 대기
  await page.waitForSelector(selector, { timeout: options.timeout || 10000 });

  // 바운딩 박스 구하기
  const element = await page.locator(selector).first();
  const box = await element.boundingBox();
  if (!box) throw new Error(`요소를 찾을 수 없음: ${selector}`);

  // 요소 내 랜덤 오프셋 (항상 정확히 중앙이 아닌 자연스러운 위치)
  const margin = 0.25;
  const offsetX = box.width * (margin + Math.random() * (1 - 2 * margin));
  const offsetY = box.height * (margin + Math.random() * (1 - 2 * margin));
  const targetX = box.x + offsetX;
  const targetY = box.y + offsetY;

  // 부드러운 커서 이동 (SVG 커서 오버레이가 mousemove 이벤트로 따라옴)
  await page.mouse.move(targetX, targetY, { steps });
  await page.waitForTimeout(80);

  // 클릭 — force:true로 모달 내부 요소도 확실히 클릭
  await element.click({ force: true, delay });
  if (label) console.log(`[record] ${label}`);
}

// ── 커서 없이 조용히 클릭 (애니메이션 구간용) ──
async function quietClick(page, selector, options = {}) {
  await page.waitForSelector(selector, { timeout: options.timeout || 10000 });
  await page.locator(selector).first().click({ force: true, delay: options.delay || 50 });
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

  // 🖱️ SVG 커서 + Playwright 액션 오버레이 (이중 보장)
  await injectCursor(page);
  await page.screencast.showActions();
  console.log('[record] 커서 + 액션 오버레이 준비 완료');

  if (!existsSync(VIDEOS)) mkdirSync(VIDEOS, { recursive: true });
  const outputPath = join(VIDEOS, `${outName}.webm`);

  // ── 🎬 녹화 시작 ──
  await page.screencast.start({ path: outputPath, size: VIEWPORT });

  // 챕터: 오프닝
  await page.screencast.showChapter('동물도감 포켓볼 수집', { duration: 2500 });
  await page.waitForTimeout(2800);

  // Step 1: 동물 카드 클릭 (커서 이동 보임)
  const cardSelector = animalName
    ? `.animal-card:has(h3:text-is("${animalName}"))`
    : '.animal-card';
  await moveAndClick(page, cardSelector, { steps: 35, delay: 150, label: '카드 클릭' });
  await page.waitForTimeout(1500);

  // Step 2: 퀴즈 시작 버튼
  await moveAndClick(page, '[data-start-quiz]', { steps: 20, delay: 150, label: '퀴즈 시작' });
  await page.waitForTimeout(1000);

  // Step 3: 퀴즈 정답 + "다음 문제"/"결과 보기"
  for (let i = 0; i < 3; i++) {
    await moveAndClick(page, '.answer-button', { steps: 12, delay: 100, label: `퀴즈 ${i + 1}/3 정답` });
    await page.waitForTimeout(800);

    await moveAndClick(page, '.next-button', { steps: 10, delay: 100, label: i < 2 ? '다음 문제' : '결과 보기' });
    await page.waitForTimeout(800);
  }

  // 🖱️ 액션 오버레이 끄기 (포획 애니메이션은 깔끔하게)
  await page.screencast.hideActions();

  // 챕터: 포획 순간
  await page.screencast.showChapter('포획!', { duration: 2000 });

  // 포획 애니메이션 재생 완료 대기 (약 3.5초)
  console.log('[record] 포획 애니메이션 재생 중...');
  await page.waitForTimeout(4000);

  // 챕터: 도감 등록 완료
  await page.screencast.showChapter('도감 등록 완료!', { duration: 2500 });
  await page.waitForTimeout(3000);

  // 🖱️ 액션 오버레이 다시 켜기
  await page.screencast.showActions();

  // Step 4: 닫기 버튼 클릭
  await moveAndClick(page, '#closeDetail', { steps: 20, delay: 150, label: '닫기 버튼 클릭' });
  await page.waitForTimeout(1500);

  // 챕터: 마무리
  await page.screencast.showChapter('수집 완료!', { duration: 2000 });
  await page.waitForTimeout(2500);

  // 🎬 녹화 종료
  await page.screencast.stop();
  console.log(`[record] 완료: ${outputPath}`);

  await browser.close();
  server.close();
}

main().catch(e => { console.error('[record] 오류:', e); process.exit(1); });
