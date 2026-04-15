# 동물도감 배포 안내

이 도감은 정적 웹앱입니다. `dist` 폴더만 공유하면 학생용 화면을 열 수 있습니다.

## 내부용 빌드

내 수업에서 사용할 MagicSchool 질문 링크를 포함합니다.

```bash
npm run build:internal
```

내부용 링크는 `config/internal.local.json`에 저장됩니다. 이 파일은 개인 수업용 설정이므로 다른 교사에게 프로젝트 전체를 공유할 때 함께 보내지 않는 것이 좋습니다.

## 교사용 배포 빌드

다른 교사가 그대로 사용할 수 있는 배포본을 만듭니다. 기본값으로는 질문 버튼에 외부 링크가 연결되지 않습니다.

```bash
npm run build:distribution
```

교사가 자기 MagicSchool 링크를 넣고 싶다면 아래처럼 빌드합니다.

```bash
npm run build:distribution -- --questionUrl="https://student.magicschool.ai/s/join?joinCode=교사별코드"
```

빌드가 끝나면 `dist` 폴더 안의 파일을 배포하면 됩니다.

## GitHub Pages 자동 배포

`main` 브랜치에 푸시하면 GitHub Actions가 `build:distribution`을 실행한 뒤 `dist`를 GitHub Pages로 배포합니다.

### 선택 설정

- GitHub 저장소 `Settings > Secrets and variables > Actions`에서 `QUESTION_URL` 시크릿을 넣으면, 배포판 질문 버튼에 교사 링크를 자동 주입할 수 있습니다.
- `QUESTION_URL`이 없으면 배포판은 질문 링크 없이 안내 문구만 표시됩니다.
