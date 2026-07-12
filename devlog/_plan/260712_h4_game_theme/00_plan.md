---
unit: 260712_h4_game_theme
class: C2
archetype: spec-satisfaction
trigger: H4 게임 화면 색상을 탐험 테마(갈색·금색)로 통일하고 네온 효과를 정답 시에만 짧게 제한
goal: 게임 화면(.game-view)의 모든 요소가 탐험/탐색 테마(브라운·브론즈 골드)로 일관되게 보이며, 네온/글로우 효과는 사용자가 정답을 맞힌 짧은 순간에만 나타남
non-goals:
  - 도감 화면(.animal-card.collected)의 수집 완료 테두리는 변경하지 않음
  - 보상 모달(reward modal)의 별 burst 애니메이션은 변경하지 않음
  - 게임 외 설정/온볼딩 등의 테마는 변경하지 않음
verifier: 브라우저 스크린샷으로 .game-view 내 퀴즈 박스, 버튼, 토큰, 드롭존, 헤더가 브라운·골드 팔레트인지 확인 + 정답 체크 시에만 짧은 글로우/ bounce 발생 확인
stop_condition: 스크린샷 검증에서 탐험 색상 일관성과 네온 제한이 확인될 때
memory_artifact: devlog/_plan/260712_h4_game_theme/00_plan.md
expected_terminal_states: DONE
escalation: 사용자가 "도감 화멏도 바꿔야 한다"거나 "보상 모달도 변경" 등 범위 확대 요청 시 P 단계로 돌아가 scope amend
---

# H4 게임 화면 탐험 색 통일 계획

## Part 1. 무엇을 바꾸나요?

게임 화면(분류 미션/퀴즈)이 이미 갈색·금색 테마이지만, 퀴즈 박스 테두리와 정답 버튼, 토큰 bounce 등 일부 요소에 “네온 골드”가 항상 켜져 있거나 너무 강합니다. 이를 탐험 색(브라운·브론즈 골드)으로 고르게 맞추고, 밝은 글로우는 사용자가 정답을 맞힌 짧은 순간에만 나타나도록 제한합니다.

## Part 2. 정확한 변경 내용

### 브랜치 전략
- 기준 브랜치: `main`
- 새 브랜치: `feat/h4-game-adventure-theme`
- main에 uncommitted changes(`no-question.html`, `styles.css`)가 있으므로, 브랜치 분기 시 함께 가져간 뒤 H4 작업을 추가로 진행
- 커밋은 작업 완료 및 검증 후 사용자 승인 시 진행

### 수정 파일

#### 1. `styles.css`

**A. 변수 주석 정리** (line 3564-3567)
- `--game-primary: #b48934; /* 네온 핑크 */` → `/* 브론즈 골드 */`
- `--game-secondary: #f5bc44; /* 네온 사이언 */` → `/* 선셋 골드 */`
- `--game-neon-gold` 변수명은 그대로 두되 주석을 `/* 밝은 골드 */`로 유지
- 실제 색상값은 변경하지 않음

**B. `.quiz-box`** (line 3972-3979)
변경 전:
```css
.quiz-box {
  background: linear-gradient(135deg, #3a2415, #3f2a0e) !important;
  border: 3px solid var(--game-neon-gold) !important;
  box-shadow: 0 12px 30px rgba(63, 42, 14, 0.28), inset 0 0 20px rgba(255, 195, 0, 0.1) !important;
  border-radius: 16px;
  color: #fffbee;
  padding: 24px;
}
```
변경 후:
```css
.quiz-box {
  background: linear-gradient(135deg, #3a2415, #3f2a0e) !important;
  border: 3px solid #b48934 !important;
  box-shadow: 0 12px 30px rgba(63, 42, 14, 0.28), inset 0 0 20px rgba(180, 137, 52, 0.08) !important;
  border-radius: 16px;
  color: #fffbee;
  padding: 24px;
}
```

**C. `.answer-button.correct`** (line 4006-4011)
변경 전:
```css
.answer-button.correct {
  background: var(--game-neon-gold) !important;
  color: #3f2a0e !important;
  border-color: #ffffff !important;
  box-shadow: var(--gold-glow) !important;
}
```
변경 후:
```css
.answer-button.correct {
  background: var(--game-neon-gold) !important;
  color: #3f2a0e !important;
  border-color: #3f2a0e !important;
  box-shadow: var(--gold-glow) !important;
}
```

**D. `.game-token.bounce-success`** (line 3948-3952)
변경 전:
```css
.game-token.bounce-success {
  animation: token-bounce 0.6s ease infinite alternate;
  border-color: #ffc300 !important;
  box-shadow: var(--gold-glow), 0 0 16px rgba(255, 195, 0, 0.5) !important;
}
```
변경 후:
```css
.game-token.bounce-success {
  animation: token-bounce 0.45s ease 2 alternate;
  border-color: #b48934 !important;
  box-shadow: var(--gold-glow), 0 0 12px rgba(180, 137, 52, 0.35) !important;
}
```

**E. `.back-to-catalog:hover`** (line 4233-4238)
변경 전:
```css
.back-to-catalog:hover {
  background: #b48934 !important;
  color: #3f2a0e !important;
  border-color: #fff4ca !important;
  box-shadow: 0 0 15px rgba(180, 137, 52, 0.6) !important;
  transform: translateY(-2px) !important;
}
```
변경 후:
```css
.back-to-catalog:hover {
  background: #b48934 !important;
  color: #3f2a0e !important;
  border-color: #fff4ca !important;
  transform: translateY(-2px) !important;
}
```

**F. 카테고리 헤더 text-shadow 제거** (line 3911)
변경 전:
```css
.game-source h3,
.drop-zone h3 {
  ...
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
```
변경 후:
```css
.game-source h3,
.drop-zone h3 {
  ...
  text-shadow: none;
}
```

**G. 주석 정리**
- `.game-header .section-kicker` line 4210 주석 `/* 화사한 네온 연볼라 */` → `/* 골드 악센트 */`
- `.back-to-catalog` line 4226 주석 `/* 어두운 다크 퍼플 네이비 */` → `/* 다크 브라운 */`
- `.game-score` line 4245 주석 `/* 골드 네온 */` → `/* 다크 브라운 */`

#### 2. `app.js`
변경 없음. `checkGame()`에서 `.bounce-success`/`.correct-zone`은 이미 정답 판정 시에만 추가되고 1초 후 제거됨. `.answer-button.correct`는 `renderQuiz()`에서 정답 상태일 때만 부여됨. 단, `renderQuiz()` 낸부에서 correct 클래스가 지속적으로 유지되는지 B 단계에서 최종 확인.

### 검증 계획
1. `node --check app.js`로 구문 검사
2. `cli-jaw browser`로 게임 화면 이동 후 스크린샷
3. 정답 체크/퀴즈 정답 클릭 시 짧은 glow/bounce 확인
4. `git diff`로 변경 범위 확인

## 변경 맵

```mermaid
flowchart TD
    A[main 브랜치] -->|git checkout -b| B[feat/h4-game-adventure-theme]
    B --> C[styles.css 수정]
    C --> C1[변수 주석 정리]
    C --> C2[.quiz-box border: neon gold → bronze gold]
    C --> C3[.answer-button.correct border: white → dark brown]
    C --> C4[.game-token.bounce-success: infinite → 2회]
    C --> C5[.back-to-catalog:hover glow 제거]
    C --> C6[header text-shadow 제거]
    B --> D[renderQuiz() correct 상태 확인]
    D --> E[브라우저 스크린샷 검증]
    E --> F[사용자 승인 후 커밋]
```
