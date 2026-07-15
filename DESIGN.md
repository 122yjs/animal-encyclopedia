# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-07-12
- Primary product surfaces: 모험 지도, 지역별 동물 도감, 관찰·퀴즈 상세창, 분류 연습, 교사용 설정
- Evidence reviewed: `README.md`, `docs/ROADMAP.md`, `docs/QA_CHECKLIST.md`, `index.html`, `styles.css`, `app.js`, `assets/sprites/`, `graphify-out/GRAPH_REPORT.md`, `graphify-out/wiki/index.md`

## Brand
- Personality: 초등학교 3학년이 혼자서도 이해할 수 있는 친근한 탐험 놀이
- Trust signals: 현재 단계와 다음 행동을 글로 명시하고, 수집·배지 상태를 실제 저장 데이터와 일치시킨다.
- Avoid: 색상만으로 상태를 구분하기, 완료하지 않은 보상을 획득한 것처럼 보이게 하기, 과도한 캐릭터·게임 용어로 학습 내용을 가리기

## Product goals
- Goals: 동물의 생김새·움직임·사는 곳을 관찰하고, 지역별 수집과 분류 도전을 순서대로 완수하게 한다.
- Non-goals: 경쟁형 점수판, 결제·재화 시스템, 별도 계정 또는 서버 의존 진행도
- Success signals: 학생이 현재 지역, 남은 동물 수, 배지 도전 조건, 다음 이동을 도움 없이 설명할 수 있다.

## Personas and jobs
- Primary personas: 초등학교 3학년 학생, 수업을 준비하고 공유 링크를 만드는 교사
- User jobs: 학생은 동물을 관찰·등록하고 지역 배지를 모은다. 교사는 지역 범위와 선택적 질문방을 설정한다.
- Key contexts of use: 태블릿, 전자칠판, 공용 교실 기기, 정적 GitHub Pages 배포

## Information architecture
- Primary navigation: 모험 지도, 도감 탐험, 분류 연습의 세 모드와 지역 사이드바
- Core routes/screens: `index.html`, 자동 생성되는 `no-question.html`, 동물 상세·퀴즈·보상 모달
- Content hierarchy: 지금 할 일 → 지역 진행도 → 관찰 설명 → 관찰 확인 → 퀴즈 → 배지 도전 → 다음 지역

## Design principles
- 상태는 데이터와 일치해야 한다: 지역 그림의 채색은 방문이 아니라 배지 획득을 뜻한다.
- 다음 행동은 한눈에 보여야 한다: 현재 위치는 테두리·광택·문구로 나타내고 완료 색상과 구분한다.
- 작은 화면에서도 핵심 목표가 잘리지 않아야 한다: 지도 첫 노드, 현재 플레이어, 마지막 마스터 노드를 컨테이너 안전 영역 안에 둔다.
- 진행 순서를 벗어나는 이동은 상태를 바꾸기 전에 학생에게 대상 지역을 명시하고 확인받는다.
- Tradeoffs: 장식보다 진행 상태의 명확성과 44px 이상 터치 영역을 우선한다.

## Visual language
- Color: 갈색·금색은 탐험 프레임, 초록은 완료, 산호색은 도전, 회색은 미획득·잠김 상태에 사용한다.
- Typography: 시스템 한글 글꼴을 사용하고, 짧고 직접적인 초등학생용 문구를 유지한다.
- Spacing/layout rhythm: 8px 계열 간격과 넉넉한 카드 패딩을 사용하며 지도 가장자리에는 노드 높이만큼 안전 여백을 둔다.
- Shape/radius/elevation: 둥근 카드, 원형 배지, 얕은 그림자와 선택적 금색 광택을 재사용한다.
- Motion: 현재 위치는 노드에서 가볍게 움직이고, 배지 획득 또는 확인된 지역 이동 때 경로 이동을 한 번 보여 준 뒤 도착 지역 도감으로 자동 전환한다. `prefers-reduced-motion`을 존중한다.
- Imagery/iconography: 추출된 부엉이·지역·보상 스프라이트를 우선 재사용하고 이모지는 보조 신호로 사용한다.

## Components
- Existing components to reuse: `.map-quest-card`, `.badge-case`, `.map-node`, `.filter-button`, `.mission-board`, 공통 버튼과 모달
- New/changed components: 별도 컴포넌트를 추가하지 않고 지도 노드의 좌표·상태 변형과 기존 확인 팝업의 지역 이동 문맥을 보강한다.
- Variants and states: `current`, `next`, `locked`, `challenge`, `complete`; 채색된 지역 스프라이트는 `complete`에만 허용한다.
- Token/component ownership: 색상·그림자·반경은 `styles.css`의 기존 CSS 변수와 상태 클래스를 사용한다.

## Accessibility
- Target standard: WCAG 2.1 AA에 준하는 대비와 키보드·터치 사용성
- Keyboard/focus behavior: 모든 지도 노드는 실제 `button`이며 명확한 `:focus-visible` 표시를 유지한다.
- Contrast/readability: 상태는 색상뿐 아니라 `진행 중`, `예고`, `배지 도전`, `배지 획득` 문구와 아이콘으로 함께 표시한다.
- Screen-reader semantics: 지도 노드의 `aria-label`에 지역명, 상태, 수집 진행도를 포함한다.
- Reduced motion and sensory considerations: 모션 감소 환경에서 플레이어·도전 애니메이션을 끈다.

## Responsive behavior
- Supported breakpoints/devices: 데스크톱, 1080px 이하 태블릿, 680px 이하 세로 화면
- Layout adaptations: 지도 노드와 배지 크기를 줄이되 첫·마지막 노드 전체가 지도 안에 남도록 한다. 모바일 지도에서는 현재 미션 카드를 스크롤 상단에 고정해 지역 행동을 계속 찾을 수 있게 한다.
- Touch/hover differences: 터치에 의존하지 않는 상태 문구를 제공하고, hover는 보조 효과로만 사용한다.

## Interaction states
- Loading: 정적 UI를 먼저 표시하고 원격 동물 이미지는 폴백을 제공한다.
- Empty: 미수집 상태는 `0 / 전체` 진행도와 다음 행동을 함께 보여 준다.
- Error: 이미지·저장소 실패는 앱 흐름을 막지 않는 기존 폴백을 유지한다.
- Success: 퀴즈 등록, 지역 수집 완료, 배지 획득, 도감 마스터를 서로 다른 단계로 표현하고, 이동 안내는 고정 진행바·효과음 컨트롤과 겹치지 않는 안전 영역에 표시한다.
- Disabled: 잠긴 지도 노드는 회색 처리와 `예고` 문구를 함께 사용한다.
- Preview/navigation: 지역 미리보기의 주 행동은 전체 지도로 돌아가 탐험 순서를 확인한다. 미완료 지역을 순서보다 앞서 선택하면 이동 확인 팝업을 표시하고, 확인 뒤 지도에서 플레이어 이동을 한 번 보여 준 뒤 해당 지역 도감으로 자동 전환한다. 지도에 남는 `탐험 계속하기`는 이동 없이 현재 미션을 열 때의 보조 진입점이다.
- Offline/slow network, if applicable: 핵심 UI와 로컬 스프라이트는 동작하며 원격 동물 사진은 대체 표시를 사용한다.

## Content voice
- Tone: 짧고 격려하는 존댓말 없는 학생 안내체
- Terminology: `도감 등록`, `관찰`, `분류 배지 도전`, `배지 획득`, `도감 마스터`
- Microcopy rules: 한 화면에서 현재 단계와 다음 행동을 각각 한 문장으로 설명한다.

## Implementation constraints
- Framework/styling system: 번들러 없는 바닐라 HTML/CSS/JavaScript
- Design-token constraints: 기존 `styles.css` 변수와 상태 클래스를 확장하고 새 디자인 시스템을 만들지 않는다.
- Performance constraints: 새 런타임 의존성이나 대형 이미지 자산을 추가하지 않는다.
- Compatibility constraints: `no-question.html`은 `index.html`에서 생성하고, `dist/`는 직접 수정하지 않는다.
- Test/screenshot expectations: `node --check app.js`, 계약 테스트, 배포 빌드, 898×939 브라우저에서 지도 경계와 상태 색상을 확인한다.

## Open questions
- [ ] Galaxy Tab A8과 전자칠판 실기기에서 지도 안전 여백을 최종 확인한다. / 교사·QA / 수업 화면 잘림 위험
