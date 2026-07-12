---
unit: 260712_h5_status_text_contrast
class: C2
archetype: readability-polish
trigger: H5 초록/빨강 상태 글씨를 더 진하게 하거나 어두운 상자 배경으로 보강
goal: 퀴즈와 분류 게임의 성공/실패 상태 문구와 카드가 색상만으로 의미를 전달하지 않고, 어두운 배경판과 밝은 글씨로 선명하게 읽힘
non-goals:
  - 게임 흐름, 점수 계산, 배지 지급 로직 변경 없음
  - 전역 색상 변수 변경 없음
  - H4 갈색/금색 탐험 테마 재설계 없음
verifier: 정적 검사와 브라우저 스크린샷으로 성공/실패 상태 텍스트 대비와 카드 상태 표시를 확인
stop_condition: 상태 문구와 정답/오답 카드가 데스크톱 화면에서 겹침 없이 읽히고 빌드가 통과함
---

# H5 상태 텍스트 대비 개선 계획

## 변경 방향

- 전역 `--leaf`, `--coral` 색상은 그대로 둔다.
- 퀴즈 피드백 `.feedback.good`, `.feedback.retry`에 어두운 배경 상자와 밝은 글씨를 적용한다.
- 분류 게임의 `.game-token.correct-token`, `.game-token.wrong-token`도 테두리만이 아니라 배경과 글씨 색을 함께 바꿔 상태를 명확히 보이게 한다.
- 혹시 사용될 수 있는 `.answer-button.wrong` 상태에도 같은 대비 원칙을 적용한다.

## 검증

1. `node --check app.js && node --check app-config.js && git diff --check`
2. `npm run build:distribution`
3. 브라우저에서 퀴즈 정답 피드백과 분류 게임 체크 후 상태 스크린샷 확인
