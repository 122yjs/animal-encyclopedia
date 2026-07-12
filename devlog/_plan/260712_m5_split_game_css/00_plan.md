---
unit: 260712_m5_split_game_css
class: C3
archetype: structural-refactor
trigger: M5 CSS 전체 리팩토링 - 4915줄 styles.css와 215개 !important로 인한 변경 위험 축소
goal: 게임/게이미피케이션 스타일을 별도 CSS 파일로 분리하고, 새 !important를 추가하지 않으며 기존 화면 동작을 유지
non-goals:
  - CSS 규칙 의미 변경
  - 기존 !important 제거 또는 신규 우선순위 재설계
  - JS 동작/게임 로직 변경
  - graphify generated output 정리
verifier: 파일 분리 후 빌드, CSS 카운트, 브라우저 렌더 스모크로 기존 게임/지도/도감 화면 유지 확인
stop_condition: styles.css가 작아지고 game-styles.css가 빌드 산출물에 포함되며, 새 !important 증가 없이 렌더링 검증 통과
---

# M5 게임 CSS 분리 계획

## 기준 상태

- `styles.css`: 4915줄
- `styles.css` 내 `!important`: 215개
- 기준 검증: `node --check app.js && node --check app-config.js && git diff --check && npm run build:distribution`

## 변경 전략

1. `styles.css` 후반의 `부엉이 동물도감 탐험대 게이미피케이션 확장 스타일` 섹션을 `game-styles.css`로 그대로 이동한다.
2. `index.html`에서 `styles.css` 다음에 `game-styles.css`를 로드한다.
3. `scripts/build.js`의 정적 복사 목록에 `game-styles.css`를 추가한다.
4. `no-question.html`은 `scripts/generate-no-question.js`가 `index.html`에서 재생성하도록 한다.

## 리스크 제어

- 순서 보존: 새 링크는 `styles.css` 뒤에 둔다.
- 의미 보존: 이동 대상 CSS 내용은 텍스트 그대로 옮긴다.
- 제한: 새 `!important`는 추가하지 않는다.
- 회귀 검증: 빌드 후 `dist/game-styles.css` 생성 여부와 브라우저 화면을 확인한다.
