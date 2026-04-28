# Draft: 분류게임 모바일 UX 및 카드 되돌리기

## Requirements (confirmed)
- 분류게임을 모바일에서 열었을 때 상하 스크롤이 길어 학생들이 끌어당기기 어려움 → 가로/세로 모두 한눈에 보여야 함
- 이미 옮겨진 카드를 다른 선택지로 수정하거나 기존 더미로 바꿀 수 있어야 함

## Technical Decisions (confirmed with user)
- **모바일 레이아웃**: 2단 축소 레이아웃 — 상단에 '카드 더미'를 가로 스크롤 줄로 배치, 하단에 yes/no 2-column 나란히
- **카드 되돌리기**: 카드 더미(gamePool)에도 drop-zone 이벤트 추가 (터치: 카드 탭 → 대상 칸 탭)

## Technical Findings

### Root Cause 1: Excessive Scrolling
- `.game-board` uses 3-column grid on desktop, collapses to `1fr` on ≤1080px
- `.game-source` and `.drop-zone` have `min-height: 430px` (desktop) / `260px` (≤680px)
- 3 zones × 260px = 780px+ vertical content in mobile
- No viewport units used anywhere; all px-based

### Root Cause 2: Tokens Locked After Placement
- `moveGameToken(animalId, answer)` accepts "pool" as valid answer (line 929)
- BUT `gamePool` has NO `data-answer="pool"`, NO drop event handlers, NO click handler
- Only `.drop-zone` elements (yes/no) have dragover/dragleave/drop/click handlers (lines 262-277)
- Tokens can move yes↔no but NOT back to pool
- HTML5 drag-and-drop doesn't work on mobile touch by default

### Key Code References
- Game state: app.js lines 130-136 (`state.game`)
- Drop-zone handlers: app.js lines 262-277
- `moveGameToken()`: app.js lines 927-934
- `createGameToken()`: app.js lines 900-925
- `renderGameBoard()`: app.js lines 877-898
- Game board CSS: styles.css lines 918-1016
- Mobile breakpoints: styles.css lines 1051-1118 (1080px), 1120-1210 (680px)
- Game HTML: index.html lines 79-118, no-question.html lines 76-115

## Scope Boundaries
- INCLUDE: 분류게임 모바일 레이아웃, 카드 되돌리기/수정 기능, touch UX
- EXCLUDE: 도감 보기 모드, 퀴즈 모달, 설정 모달, 새로운 동물 추가, no-question.html 구조 변경