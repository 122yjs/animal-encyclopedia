# 동물도감 탐험대 (Phaser RPG)

초등학교 3학년 과학 「동물의 생활」 수업용 **수집형 턴제 RPG**입니다.
다섯 서식지를 잇는 오버월드를 걸어 동물을 만나고, 관찰 → 턴제 퀴즈 배틀 → 도감볼 포획으로
40마리를 도감에 등록하는 모험입니다.

## 실행 방법

프로젝트 폴더에서:

```bash
npm install
npm run dev
```

브라우저 주소창에 **정확히** 아래를 엽니다.

- http://127.0.0.1:5173/

> HTML 파일을 더블클릭해서 열면 Phaser/Vite 게임이 동작하지 않습니다.
> `npm run dev`로 띄운 주소로만 접속하세요.
> "모험 시작"이 안 눌리면 **Enter** 키로도 시작할 수 있습니다.

배포용 빌드:

```bash
npm run build
npm run preview
```

## 플레이 방법

1. **모험 시작**을 누르고 **방향키/WASD**(모바일은 왼쪽 가상 패드)로 맵을 걷습니다.
2. 맵 위의 픽셀 동물에게 다가가면 **턴제 퀴즈 배틀**이 시작됩니다.
   - 먼저 생김새·움직임·사는 곳 **3가지 관찰 체크**를 마치면 배틀 시작!
   - **내 턴**: 관찰 퀴즈 정답 = 공격 성공 (동물 기력 -1)
   - **동물의 턴**: 오답이면 헷갈리기 공격 (내 하트 -1) → 관찰 단서를 다시 읽고 같은 문제 재도전
   - 하트 3개가 다 닳으면 잠시 후퇴 — 불이익 없이 다시 도전할 수 있어요.
3. 기력을 모두 빼면 **🎯 도감볼 던지기!** — 딸깍딸깍 3번 흔들리면 포획 성공, 도감 등록!
4. 지역 동물 8마리를 모두 등록하면 **지역 배지**와 함께 다음 지역 문이 열립니다.
   - 여정: 우리 주변 마을 → 땅 위 숲 → 강과 호수 → 바닷가 → 사막·빙하
5. 다섯 배지 + 40마리를 모두 모으면 **도감 마스터**!

진행은 브라우저 `localStorage`에 저장됩니다 (구버전 도감의 수집 기록과 호환).

## 기술 스택

- Vite + Phaser 3 (씬: Boot / Title / Overworld / QuizBattle / Dex)
- 지형: Sprout Lands 타일을 RenderTexture 한 장에 굽는 방식 (120×34 타일 월드)
- 동물 데이터·퀴즈 로직: 기존 `app.js`에서 `src/data`, `src/systems`로 이식
- 진행 저장 키: `animal-encyclopedia-collected-v1`(수집), `animal-encyclopedia-region-clear-v1`(배지)

## 에셋 크레딧

**Assets from Sprout Lands by Cup Nooble**

- Sprout Lands Sprites Basic pack / UI Pack Basic pack
- 비상업(학교) 용도로 사용하며, 에셋 팩 자체의 재배포는 하지 않습니다.
- 자세한 라이선스: `public/assets/sprout-lands/sprites/read_me.txt`, `public/assets/sprout-lands/ui/read_me.txt`

**오버월드 미니 동물 스프라이트(40종)와 도감볼**은 이 프로젝트에서 자체 제작한
픽셀 아트입니다 (`src/world/AnimalSprites.js`, 코드로 생성).

동물 사진: 위키미디어 커먼즈 등 — [credits.html](./credits.html) 참고

## 폴더 안내

| 경로 | 설명 |
|------|------|
| `src/scenes/` | Phaser 씬 (타이틀·오버월드·배틀·도감) |
| `src/world/` | 지형 빌더(WorldMap), 자체 픽셀 스프라이트(AnimalSprites) |
| `src/data/` | 동물 51종 데이터, 지역·스폰 정의 |
| `src/systems/` | 퀴즈 생성, 관찰 문구, 진행 저장 |
| `public/assets/sprout-lands/` | Sprout Lands 타일·캐릭터·UI |
| `legacy/` | 이전 HTML/JS 도감 (교사 QR 등) — 이번 브랜치 범위 밖 |

## 이번 브랜치에서 하지 않는 것

- 교사 질문방 설정 / QR / `no-question` 공유 링크 (legacy에 보존)
- GitHub Pages 배포 파이프라인 전면 교체
