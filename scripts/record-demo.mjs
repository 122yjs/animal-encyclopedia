#!/usr/bin/env node
/**
 * 동물도감 포켓볼 수집 애니메이션 데모 녹화
 *
 * 사용법:
 *   npm run record:demo
 *   npm run record:demo -- --animal 고양이
 *   npm run record:demo -- --out my-demo --duration 20000
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
const durIdx = args.indexOf('--duration');
const animalName = animalIdx >= 0 ? args[animalIdx + 1] : null;
const outName = outIdx >= 0 ? args[outIdx + 1] : 'pokeball-catch';
const duration = durIdx >= 0 ? parseInt(args[durIdx + 1]) : 16000;

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

// 🎯 동물도감 전용 자동플레이
function autoplayScript(target) {
  return `
    (function() {
      var target = ${target ? `"${target}"` : 'null'};

      // 셔플 고정: 퀴즈 정답이 항상 첫 번째
      if (typeof window.shuffle === 'function') {
        window.shuffle = function(arr) { return arr; };
      }

      // 카드 클릭
      setTimeout(function() {
        var cards = document.querySelectorAll('.animal-card');
        var found = false;
        for (var i = 0; i < cards.length; i++) {
          var h = cards[i].querySelector('h3');
          if (!target || (h && h.textContent === target)) {
            cards[i].click(); found = true; break;
          }
        }
        if (!found && cards.length) cards[0].click();
      }, 1000);

      // 퀴즈 시작
      setTimeout(function() {
        var btn = document.querySelector('[data-start-quiz]');
        if (btn) btn.click();
      }, 2500);

      // 퀴즈 정답 반복
      function answer(retry) {
        if (retry > 12) return;
        setTimeout(function() {
          var btn = document.querySelector('.answer-button');
          if (btn) {
            btn.click();
            setTimeout(function() {
              var next = document.querySelector('.next-button');
              if (next) { next.click(); answer(retry + 1); }
            }, 700);
          } else { answer(retry + 1); }
        }, 700);
      }
      setTimeout(function() { answer(0); }, 3500);
    })();
  `;
}

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

  await page.evaluate(autoplayScript(animalName));
  console.log('[record] 자동플레이 주입 완료');

  if (!existsSync(VIDEOS)) mkdirSync(VIDEOS, { recursive: true });
  const outputPath = join(VIDEOS, `${outName}.webm`);

  await page.screencast.start({ path: outputPath, size: VIEWPORT });
  console.log(`[record] 녹화 중 (${duration}ms) → ${outputPath}`);

  await page.waitForTimeout(duration);

  await page.screencast.stop();
  console.log(`[record] 완료: ${outputPath}`);

  await browser.close();
  server.close();
}

main().catch(e => { console.error('[record] 오류:', e); process.exit(1); });
