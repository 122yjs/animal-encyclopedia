# 동물도감 배포 안내

이 프로젝트는 정적 웹앱입니다. GitHub Pages 기본 주소를 교사에게 공유하면, 각 교사가 자기 MagicSchool 질문방을 연결해서 학생용 수업 링크와 QR을 만들 수 있습니다.

기본 공유 주소: https://122yjs.github.io/animal-encyclopedia/  
질문방 기능을 뺀 버전: https://122yjs.github.io/animal-encyclopedia/no-question.html

중요: 설정창에는 QR 값을 넣는 것이 아니라, MagicSchool에서 복사한 학생용 참여 링크를 붙여 넣습니다.

또한 학생에게는 기본 GitHub Pages 주소를 그대로 QR로 공유하면 안 됩니다. `질문방 설정`에서 생성된 수업용 도감 링크 또는 QR을 공유해야 해당 교사의 질문방이 함께 열립니다.

학생용 공유 링크로 접속한 페이지에서는 `질문방 설정` 버튼이 보이지 않도록 구성되어 있습니다.

## 내부용 빌드

개인 수업에서 사용하는 MagicSchool 질문 링크를 포함합니다.

```bash
npm run build:internal
```

내부용 링크는 `config/internal.local.json`에 저장합니다. 이 파일은 개인 수업용 설정이므로 공개 배포에 포함하지 않습니다.

## 교사용 배포 빌드

다른 교사가 그대로 사용할 수 있는 배포본을 만듭니다. 기본값으로는 질문방 링크가 연결되어 있지 않습니다.

```bash
npm run build:distribution
```

특정 질문 링크를 빌드 시점에 넣고 싶다면 아래처럼 실행할 수 있습니다.

```bash
npm run build:distribution -- --questionUrl="https://student.magicschool.ai/s/join?joinCode=교사별코드"
```

빌드가 끝나면 `dist` 폴더의 파일을 배포하면 됩니다.

## GitHub Pages 자동 배포

`main` 브랜치에 푸시하면 GitHub Actions가 `build:distribution`을 실행하고 `dist`를 GitHub Pages로 배포합니다.

## 교사별 MagicSchool 질문방 연결

1. 기본 도감 페이지를 엽니다.
2. `질문방 설정`을 누릅니다.
3. `MagicSchool 방 템플릿 열기`로 질문방을 만듭니다.
4. MagicSchool에서 학생용 참여 링크를 복사합니다.
5. 도감 설정창에 그 링크를 붙여 넣고 저장합니다.
6. 생성된 `학생에게 보낼 수업용 도감 링크` 또는 QR을 학생에게 공유합니다.
7. 학생은 그 링크 또는 QR로 접속하면 동물 상세창에서 `더 궁금한 점 물어보기` 버튼을 사용할 수 있습니다.

## 질문방 없는 버전 사용

질문방 기능을 아예 빼고 배포하려면 아래 주소를 그대로 사용하면 됩니다.

https://122yjs.github.io/animal-encyclopedia/no-question.html

이 버전에서는 질문방 설정 버튼도 보이지 않고, 동물 상세창의 질문 버튼도 나타나지 않습니다.

## 선택 설정

- GitHub 저장소 `Settings > Secrets and variables > Actions`에서 `QUESTION_URL` 시크릿을 넣으면 배포 시 질문 링크를 기본값으로 주입할 수 있습니다.
- `QUESTION_URL`이 없으면 배포본은 링크 없는 기본 상태로 배포됩니다.
