# 동물도감 탐험대 (Phaser RPG)

초등학교 3학년 과학 「동물의 생활」 수업용 **수집형 턴제 RPG**입니다.  
맵을 걸어 동물을 만나고, 퀴즈 배틀로 도감에 등록하는 수직 슬라이스(우리 주변 지역)입니다.

## 실행 방법

프로젝트 폴더에서 (반드시 `animal-encyclopedia` git 루트):

```bash
npm install
npm run dev
```

브라우저 주소창에 **정확히** 아래를 엽니다.

- http://127.0.0.1:5173/

> HTML 파일을 더블클릭해서 열면 Phaser/Vite 게임이 동작하지 않습니다.  
> `npm run dev`로 띄운 주소로만 접속하세요.  
> “모험 시작”이 안 눌리면 **Enter** 키로도 시작할 수 있습니다.

배포용 빌드:

```bash
npm run build
npm run preview
```

## 플레이 방법

1. **모험 시작**을 누릅니다.
2. **방향키** 또는 **WASD**(모바일은 왼쪽 가상 패드)로 맵을 걷습니다.
3. `?` 표시가 있는 동물에게 다가가면 **퀴즈 배틀**이 시작됩니다.
4. 퀴즈 3문항을 맞히면 도감에 등록됩니다. (브라우저 `localStorage`에 저장)
5. 스폰된 4마리를 모두 모으면 **우리 주변 지역 클리어** 연출이 나옵니다.

## 기술 스택

- Vite + Phaser 3
- 동물 데이터·퀴즈 로직: 기존 `app.js`에서 `src/data`, `src/systems`로 이식
- 진행 저장 키: `animal-encyclopedia-collected-v1` (구버전과 호환)

## 에셋 크레딧

**Assets from Sprout Lands by Cup Nooble**

- Sprout Lands Sprites Basic pack
- Sprout Lands UI Pack Basic pack
- 비상업(학교) 용도로 사용하며, 에셋 팩 자체의 재배포는 하지 않습니다.
- 자세한 라이선스: `public/assets/sprout-lands/sprites/read_me.txt`, `public/assets/sprout-lands/ui/read_me.txt`

동물 사진: 위키미디어 커먼즈 등 — [credits.html](./credits.html) 참고

## 폴더 안내

| 경로 | 설명 |
|------|------|
| `src/` | Phaser 게임 소스 |
| `public/assets/sprout-lands/` | Sprout Lands 타일·캐릭터·UI |
| `legacy/` | 이전 HTML/JS 도감 (교사 QR 등) — 이번 브랜치 범위 밖 |
| `scripts/extract-legacy-data.mjs` | 레거시에서 동물/퀴즈 데이터 추출 |

## 이번 브랜치에서 하지 않는 것

- 교사 질문방 설정 / QR / `no-question` 공유 링크
- 5지역 전체 맵, 분류 미션 게임
- GitHub Pages 배포 파이프라인 전면 교체
