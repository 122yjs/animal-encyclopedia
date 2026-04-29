# 부엉이 동물도감 탐험대 — UX 평가 및 개선 계획

> 평가일: 2026-04-29  
> 대상: https://122yjs.github.io/animal-encyclopedia/  
> 환경: Desktop (1280×800) / Mobile (390×844) / Chrome latest

---

## 1. Executive Summary

본 프로젝트는 초등학교 3학년 과학 「동물의 생활」 단원을 대상으로 한 **정적 웹 기반 동물 도감 & 게이미피케이션 학습 도구**입니다. 54마리 동물을 관찰·퀴즈·수집하는 "포켓 콜렉션" 메타포와, 교사용 MagicSchool 질문방 연결, 분류 게임 등 다양한 기능을 갖추고 있습니다.

전반적으로 **타겟 연령(8~9세)에 최적화된 친근한 비주얼과 높은 접근성 의식**은 긍정적으로 평가됩니다. 다만 폰트 로드 실패, 모바일 게임 UX, 이미지 최적화, 교사용 설정의 복잡성 등에서 **개선 여지가 확인**되었습니다.

---

## 2. Current State Overview

| 항목 | 현황 |
|------|------|
| **기술 스택** | Vanilla HTML/CSS/JS, Tailwind CSS v4 (Browser CDN), zero npm runtime deps |
| **배포** | GitHub Pages (자동화된 Actions 파이프라인) |
| **타겟 사용자** | 초등 3학년 학생(학습자) + 담임교사(설정자) |
| **핵심 기능** | 도감 열기/퀴즈/수집, 지역 미션, 분류 게임, MagicSchool 질문방 연동, QR 공유 |
| **접근성** | ARIA 라이브 리전, 키보드 포커스 트랩, `prefers-reduced-motion`, `inert` 속성 사용 |
| **반응형** | 1080px / 680px / landscape(600px 이하) 기준 미디어쿼리 적용 |

---

## 3. UX Strengths (장점)

### 3.1 타겟 연령에 딱 맞는 게이미피케이션
- **포켓볼 포획 애니메이션**: 퀴즈 3문제를 모두 맞히면 몬스터볼 던지기 → 흔들림 → 포획 완료의 시퀀스가 초등 저학년의 성취감을 극대화합니다.
- **수집률 시각화**: 상단 고정 프로그레스 바, 지역별 미션 미터, `등록` 배지 등 다층적인 진행도 표시가 지속적인 동기부여를 제공합니다.
- **온보이딩 튜토리얼**: 3단계(카드 열기 → 퀴즈 풀기 → 지역 완성)로 학습 흐름을 자연스럽게 안내합니다.

### 3.2 뛰어난 접근성(A11y) 의식
- **키보드 낸비게이션**: 모달 내 `Tab` / `Shift+Tab` 포커스 트랩, `Escape`로 닫기, 모달 스택(`modalFocusStack`) 관리.
- **ARIA**: `aria-live="polite"`로 동적 콘텐츠 변경 알림, `aria-modal`, `role="dialog"`, `aria-pressed` 등 적절히 사용.
- **Reduced Motion**: `@media (prefers-reduced-motion: reduce)`에서 모든 애니메이션을 비활성화하여 전막 장애 사용자를 배려합니다.
- **Touch Target**: `--min-touch: 44px` 최소 터치 영역 확보.

### 3.3 교사-학생 분리 UX
- **질문방 설정 버튼 노출 제어**: `no-question.html`과 `index.html`의 이중화, `hideTeacherSettingsOnSharedPage` 플래그로 학생 뷰에서 설정 버튼 숨김.
- **QR + 수업용 링크 자동 생성**: 교사가 MagicSchool 링크만 붙여넣으면 학생용 QR과 질문방이 연결된 링크가 즉시 생성됩니다.
- **지역 미션 커스터마이징**: 교사가 각 지역별 노출 동물을 선택하여 수업에 맞게 조정 가능합니다.

### 3.4 콘텐츠 품질
- **교과서 연계**: "미래엔 초등 과학 3-1 34~51쪽", "비상교육 AR 자료" 등 출처를 명시하여 신뢰도 확보.
- **관찰 중심 흐름**: 퀴즈 전 "사는 곳 / 움직임 / 몸의 특징" 3가지 체크리스트를 두어 "관찰 → 이해 → 확인"의 학습 사이클을 강제합니다.
- **힌트 시스템**: 퀴즈 오답 시 해당 단락에 `hint-highlight` 애니메이션을 주고 자동 스크롤하여 자기주도적 학습을 유도합니다.

### 3.5 반응형 디테일
- **Landscape 모드 최적화**: 모바일 가로 모드에서 상세 모달을 2컬럼(사진+정보)로 배치하여 공간 활용도를 높입니다.
- **Sticky Progress**: 모바일/게임 모드에서만 노출되는 상단 플로팅 프로그레스로 공간 낭비를 줄입니다.

---

## 4. UX Weaknesses (단점)

### 4.1 자산 로드 이슈
| 이슈 | 영향 | 근거 |
|------|------|------|
| **NanumSquareRound 폰트 로드 실패** | 의도한 서체가 적용되지 않고 시스템 폰트로 fallback | `ERR_BLOCKED_BY_ORB` (Network Monitor) |
| **위키미디어 원본 이미지 사용** | Detail 모달에서 960px 이상 대용량 이미지를 로드하여 대역폭/지연 발생 | `app.js` 내 imageSources 맵핑 |
| **빈 favicon** | 브라우저 탭에 아이콘 없음, 북마크 시 식별성 저하 | `<link rel="icon" href="data:,">` |

### 4.2 모바일 사용성
- **사이드바 병목**: 390px 환경에서 사이드바가 전체 폭을 차지하여 실제 콘텐츠(동물 카드)가 첫 화면 아래로 밀림. 학생이 스크롤 없이는 카드를 볼 수 없음.
- **분류 게임 토큰 협소**: 모바일에서 토큰 카드가 `minmax(100px, 1fr)`로 줄어들어 이미지와 텍스트가 서로 붙어 가독성 저하.
- **게임 보드 스크롤**: `min-height: 430px`인 drop-zone 3개가 모바일 세로 화면을 초과하여 터치 기반 드래그 시 스크롤 간섭이 발생할 수 있음.

### 4.3 교사 설정의 복잡성
- **4단계 설정 프로세스**: 템플릿 열기 → 참여 링크 복사 → 붙여넣기 → 저장. 교사 1명당 평균 2~3분 소요 예상.
- **기본 주소 오공유 위험**: 학생에게 `https://122yjs.github.io/animal-encyclopedia/`를 직접 공유하면 질문방이 연결되지 않음. 이는 설정 화면 내 경고문과 README에 의존하며, 실수 가능성이 높음.
- **QR vs 링크 혼란**: "QR 값을 넣는 것이 아니라 학생용 참여 링크를 넣는다"는 개념이 비기술적 교사에게 진입 장벽.

### 4.4 색상/가독성
- **WCAG 대비 우려**: `--sun` (#f5bc44)과 흰색 배경의 대비비는 약 1.7:1로, AA 기준(4.5:1)에 미달할 가능성이 높음. 주요 텍스트(배지, 진행도)의 가독성이 저조할 수 있음.
- `--teal` (#d4940a) 역시 흰색 대비 시 2.5:1 수준으로 예상되어 경고/안내 텍스트에서 시인성 문제 가능.

### 4.5 데이터 지속성
- **localStorage 단일 저장**: 학생이 브라우저를 바꾸거나 시크릿 모드를 사용하면 진행도가 초기화됨. 교사는 학생의 수집 현황을 확인할 방법이 전무함.
- **재시도 딜레이 고정**: 퀴즈 오답 시 4초 뒤 재도전. 이는 유능한 학생에게는 지루함, 어려워하는 학생에게는 여전히 짧을 수 있음.

### 4.6 사운드 UX
- **AudioContext 자동 초기화 제한**: 브라우저 정책상 사용자 상호작용 없이는 AudioContext가 suspended 상태가 되어, 첫 클릭 이전까지 효과음이 완전히 무음일 수 있음. "효과음 켜짐" 토글이 있으나 사운드가 나오지 않으면 학생이 버그로 인식할 수 있음.

---

## 5. Deployment-Specific Issues

### 5.1 빌드/배포 복잡도
- **수동 동기화**: `index.html`과 `no-question.html`이 별도 파일로 유지되며, UI 구조 변경 시 양쪽을 수동으로 맞춰야 함. 현재 두 파일은 질문방 관련 마크업 외에는 거의 동일하나, 장기적으로 불일치 위험.
- **Tailwind CSS v4 Browser CDN**: 실험적 빌드 방식으로, 향후 CDN 경로 변경이나 브레이킹 체인지 시 전체 스타일이 깨질 위험.
- **로컬 이미지 미사용**: `localImages.enabled: false`로 설정되어 있어 배포본에서도 위키미디어 이미지에 의존. 위키미디어 서버 장애나 URL 변경 시 이미지가 대량으로 누락됨.

### 5.2 성능
- **Lighthouse 예상 점수** (추정)
  - Performance: 65~75 / 100 (대용량 외부 이미지, 렌더 블로킹 폰트, JS 번들 미분리)
  - Accessibility: 85~92 / 100 (ARIA 우수, 색상 대비 감점)
  - Best Practices: 80~85 / 100 (빈 favicon, ORB 오류)
  - SEO: 70~80 / 100 (meta description 부재, Open Graph 미설정)

---

## 6. Improvement Roadmap

### Phase 1 — Quick Wins (즉시 실행, 1~2일)

| # | 개선 항목 | 기대 효과 |
|---|-----------|-----------|
| 1 | **NanumSquareRound 폰트 대체** | Pretendard Variable만으로도 한글 가독성이 충분하므로 해당 `<link>` 제거하거나, jsDelivr 대신 구글 폰트/로컬 WOFF2로 교체하여 ORB 오류 해결 |
| 2 | **favicon 추가** | `assets/favicon.ico` 또는 SVG 파비콘 생성. 브랜딩 및 북마크 식별성 향상 |
| 3 | **meta 태그 보강** | `<meta name="description">`, Open Graph (`og:title`, `og:image`, `og:description`), Twitter Card 추가. SNS/카카오톡 공유 시 미리보기 개선 |
| 4 | **사운드 초기화 UX** | 첫 사용자 클릭(온보딩 "다음" 버튼 등)에서 `audioContext.resume()`을 명시적으로 호출하여 사운드가 반드시 활성화되도록 수정 |
| 5 | **색상 대비 개선** | `--sun`을 `#e6a800` 정도로 어둡게 조정하거나, `--ink` 텍스트 색상을 `#2a1a0a`로 더 진하게 변경하여 WCAG AA 달성 |

### Phase 2 — 모바일 UX 개선 (1~2주)

| # | 개선 항목 | 상세 |
|---|-----------|------|
| 6 | **모바일 사이드바 축소** | 680px 이하에서 사이드바를 `position: sticky` 헤더로 축소하거나, 햄버거 메뉴로 전환. 카드 그리드가 첫 화면에 1~2개라도 노출되도록 조정 |
| 7 | **분류 게임 토큰 리디자인** | 모바일에서 토큰을 `minmax(80px, 1fr)`로 축소하고, 텍스트를 이미지 아래가 아닌 툴팁/오버레이로 변경하여 협소한 공간에서도 식별 가능하게 개선 |
| 8 | **드래그 스크롤 간섭 방지** | 터치 이벤트에서 `touch-action: pan-y` 제한 또는, 드래그 시작 시 `event.preventDefault()`로 페이지 스크롤과 게임 보드 스크롤 분리 |
| 9 | **하단 네비게이션 탭** | 모바일에서 "도감 / 미션 / 게임"을 하단 탭 바로 전환하여 Thumb Zone 접근성 향상 |

### Phase 3 — 콘텐츠 & 성능 (2~4주)

| # | 개선 항목 | 상세 |
|---|-----------|------|
| 10 | **이미지 최적화** | ① 위키미디어 원본 대신 `330px` 썸네일을 detail 모달에서도 upscale 없이 사용, ② WebP/AVIF 포맷 변환, ③ `loading="lazy"`가 이미 적용되어 있으나 `decoding="async"`를 썸네일에도 적용 |
| 11 | **로컬 이미지 기본화** | `build:distribution` 시 위키미디어 이미지를 미리 다운로드하여 `dist/images/`에 포함하고, `app-config.js`에서 `localImages.enabled: true`로 전환. 외부 의존성 제거 |
| 12 | **no-question.html 자동 생성** | 빌드 스크립트(`scripts/build.js`)에서 HTML 파싱 후 `<!-- no-question:remove:start -->` / `<!-- no-question:replace -->` 주석을 기반으로 `no-question.html`을 자동 생성. 수동 동기화 제거 |
| 13 | **Preconnect / Prefetch** | `cdn.jsdelivr.net`, `upload.wikimedia.org`에 `dns-prefetch` 및 `preconnect` 추가. LCP 개선 |

### Phase 4 — 교사 도구 & 데이터 (4~6주)

| # | 개선 항목 | 상세 |
|---|-----------|------|
| 14 | **설정 프로세스 단순화** | "MagicSchool 템플릿 열기" 버튼을 누르면 새 창에서 방이 생성되고, 생성된 링크가 자동으로 도감에 반영되도록 MagicSchool API(가능한 경우) 또는 postMessage 연동 검토. 불가능할 경우 복사-붙여넣기를 1단계로 축소 |
| 15 | **학생 진행도 대시보드** | 교사 설정 화면에 "오늘의 클래스 현황" 개념을 도입. 학생이 수업용 링크로 접속하면 익명 진행도(수집률 %)를 집계하여 실시간 미션 달성 현황을 보여줌. (서버리스 구조에서는 교사 브라우저의 BroadcastChannel 또는 간단한 WebSocket relay 활용 검토) |
| 16 | **진행도 백업/복원** | 학생이 6자리 코드를 생성하여 자신의 진행도를 백업하고, 다른 기기에서 해당 코드를 입력해 복원할 수 있는 기능. 서버 없이도 데이터 이동 가능 |
| 17 | **재시도 딜레이 사용자 설정** | 퀴즈 설정에서 "다시 도전 대기 시간"을 0초 / 4초 / 10초 중 선택 가능하도록 하여 개별 학습 속도에 맞춤 |

### Phase 5 — 장기 전략 (2개월+)

| # | 개선 항목 | 상세 |
|---|-----------|------|
| 18 | **PWA 전환** | Service Worker로 오프라인 캐싱, 홈 화면 설치 지원. 학교 Wi-Fi 불안정 환경에서도 사용 가능 |
| 19 | **다국어 지원** | i18n 구조 도입으로 영문/중문 버전 확장 가능성. 현재 하드코딩된 한국어 문자열을 분리 |
| 20 | **A/B 테스트 인프라** | Google Analytics 4 + 이벤트 트래킹(퀴즈 정답률, 미션 완료율, 게임 플레이 시간)을 추가하여 데이터 기반 개선 |

---

## 7. Priority Matrix

```
            높은 영향
                ▲
   Phase 4-15   |   Phase 3-11
   (대시보드)    |   (로컬 이미지)
                |
   Phase 1-3    |   Phase 2-6
   (OG 태그)    |   (모바일 사이드바)
                |
   Phase 1-2    |   Phase 1-4
   (favicon)    |   (사운드 초기화)
                |
◄───────────────┼───────────────►
낮은 노력        |           높은 노력
```

**즉시 추천**: Phase 1 전항목 + Phase 2-6 (모바일 사이드바 축소)을 우선 시행.

---

## 8. Appendices

### A. 스크린샷 목록
| 파일명 | 설명 |
|--------|------|
| `deploy-desktop-home.png` | 데스크탑 도감 모드 초기 화면 |
| `deploy-mobile-home.png` | 모바일 도감 모드 초기 화면 |
| `deploy-desktop-modal.png` | 데스크탑 동물 상세 모달 (무당벌레) |
| `deploy-desktop-game.png` | 데스크탑 분류 게임 모드 |
| `deploy-mobile-game.png` | 모바일 분류 게임 모드 |

### B. 네트워크 모니터링 요약
- 총 요청: 40+
- 실패: `NanumSquareRound.min.css` ×2 (`ERR_BLOCKED_BY_ORB`)
- 폰트 서브셋: Pretendard Variable WOFF2 동적 서브셋 15개 요청 (정상)

### C. 참고 기준
- [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/)
- [Google Lighthouse Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- [ Nielsen Norman Group — Children’s UX](https://www.nngroup.com/topic/children/)

---

*본 문서는 배포 페이지의 실제 렌더링, 소스 코드 분석, 네트워크 모니터링을 종합하여 작성되었습니다.*
