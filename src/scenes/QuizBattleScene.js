// 퀴즈 배틀 — 관찰 → 3문항(사는 곳/움직임/특징) → 도감 등록
// 레거시: 관찰 문단을 읽고, 오답 시 해당 단서를 다시 본 뒤 재도전합니다.
// 해상도 640×360에 맞춰 단계형 UI로 구성합니다.
import Phaser from "phaser";
import { animalById } from "../data/animals.js";
import { buildQuestions } from "../systems/QuizBuilder.js";
import {
  buildObservationDetails,
  buildQuickFacts,
  getHintSection,
  getQuestionTypeLabel
} from "../systems/ObservationBuilder.js";
import { collectAnimal, isCollected } from "../systems/ProgressStore.js";
import { createTextButton } from "../ui/UiHelpers.js";

const RETRY_LOCK_MS = 2500;

export default class QuizBattleScene extends Phaser.Scene {
  constructor() {
    super("QuizBattleScene");
  }

  init(data) {
    this.animalId = data.animalId;
    this.returnPos = data.returnPos || null;
    this.animal = animalById[this.animalId];
    this.phase = "observe";
    this.uiNodes = [];
    this.optionButtons = [];
    this.observePage = 0; // 0=intro, 1=appearance, 2=lifestyle, 3=habitat
    this.observeChecks = { appearance: false, lifestyle: false, habitat: false };
  }

  create() {
    const { width, height } = this.cameras.main;

    if (!this.animal) {
      this.add.text(width / 2, height / 2, "동물을 찾을 수 없어요", {
        fontSize: "18px",
        color: "#fff"
      }).setOrigin(0.5);
      this.time.delayedCall(1200, () => this.returnToOverworld(false));
      return;
    }

    if (isCollected(this.animal.id)) {
      this.add.rectangle(width / 2, height / 2, width, height, 0x3f7a32);
      this.add.text(width / 2, height / 2, `${this.animal.name}은(는) 이미 도감에 있어요!`, {
        fontSize: "16px",
        color: "#fff8e7"
      }).setOrigin(0.5);
      this.time.delayedCall(1400, () => this.returnToOverworld(false));
      return;
    }

    this.observation = buildObservationDetails(this.animal);
    this.quickFacts = buildQuickFacts(this.animal);
    this.questions = buildQuestions(this.animal);
    this.qIndex = 0;
    this.busy = false;

    this.drawStaticFrame();
    this.showObservationPhase();
  }

  drawStaticFrame() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(width / 2, height / 2, width, height, 0x4a7c3f);

    // 상단 초상화 영역
    this.add.rectangle(70, 52, 88, 88, 0xfff8e7).setStrokeStyle(3, 0x6b4226);

    if (this.animal.image) {
      const key = `animal-${this.animal.id}`;
      const place = () => {
        if (!this.textures.exists(key) || !this.scene.isActive()) return;
        this.add.image(70, 52, key).setDisplaySize(78, 78).setDepth(2);
      };
      if (this.textures.exists(key)) {
        place();
      } else {
        this.load.image(key, this.animal.image);
        this.load.once(Phaser.Loader.Events.COMPLETE, place);
        this.load.start();
      }
    }

    this.titleText = this.add.text(130, 28, `관찰하기 · ${this.animal.name}`, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "16px",
      color: "#fff8e7",
      fontStyle: "bold",
      stroke: "#2d1b0e",
      strokeThickness: 3
    });

    this.subtitleText = this.add.text(130, 52, this.observation.intro, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "11px",
      color: "#fff8e7",
      wordWrap: { width: width - 200 }
    });

    createTextButton(this, width - 48, 24, "도망", () => this.returnToOverworld(false), {
      width: 72,
      height: 28,
      fontSize: "12px",
      fill: 0xe8c8a0
    });
  }

  clearDynamicUi() {
    this.uiNodes.forEach((node) => {
      if (node && node.destroy) node.destroy(true);
    });
    this.uiNodes = [];
    this.optionButtons.forEach((b) => b.destroy(true));
    this.optionButtons = [];
  }

  track(node) {
    this.uiNodes.push(node);
    return node;
  }

  /**
   * 관찰 단계 — 한 화면씩 넘기며 3개 체크
   * (레거시 관찰 체크 게이트와 같은 역할)
   */
  showObservationPhase() {
    this.phase = "observe";
    this.clearDynamicUi();
    const { width, height } = this.cameras.main;
    const obs = this.observation;

    this.titleText.setText(`관찰하기 · ${this.animal.name}`);
    this.subtitleText.setText(obs.intro);

    this.track(this.add.rectangle(width / 2, height * 0.68, width - 16, height * 0.52, 0xfff8e7, 0.97)
      .setStrokeStyle(3, 0x6b4226));

    const pages = [
      {
        key: "appearance",
        title: "① 생김새와 움직임",
        body: obs.appearance,
        check: "몸의 특징을 봤어요"
      },
      {
        key: "lifestyle",
        title: "② 움직임과 생활",
        body: obs.lifestyle,
        check: "움직임을 봤어요"
      },
      {
        key: "habitat",
        title: "③ 사는 곳과 생활",
        body: obs.habitatLife,
        check: "사는 곳을 봤어요"
      }
    ];

    // 페이지 클램프
    if (this.observePage < 0) this.observePage = 0;
    if (this.observePage > pages.length - 1) this.observePage = pages.length - 1;
    const page = pages[this.observePage];
    const checked = this.observeChecks[page.key];

    this.track(this.add.text(width / 2, height * 0.48, `${page.title}  (${this.observePage + 1}/3)`, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "14px",
      color: "#0f6f68",
      fontStyle: "bold"
    }).setOrigin(0.5));

    this.track(this.add.text(width / 2, height * 0.58, page.body, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "13px",
      color: "#2d1b0e",
      align: "center",
      wordWrap: { width: width - 48 }
    }).setOrigin(0.5));

    // 체크 버튼
    this.track(createTextButton(
      this,
      width / 2,
      height * 0.76,
      checked ? `✓ ${page.check}` : `□ ${page.check}`,
      () => {
        this.observeChecks[page.key] = true;
        this.showObservationPhase();
      },
      {
        width: Math.min(width - 40, 360),
        height: 30,
        fontSize: "13px",
        fill: checked ? 0xd4e8c2 : 0xf5e6c8
      }
    ));

    // 이전 / 다음
    if (this.observePage > 0) {
      this.track(createTextButton(this, 70, height * 0.88, "← 이전", () => {
        this.observePage -= 1;
        this.showObservationPhase();
      }, { width: 90, height: 30, fontSize: "12px", fill: 0xe8c8a0 }));
    }

    const ready = Object.values(this.observeChecks).every(Boolean);
    if (this.observePage < pages.length - 1) {
      this.track(createTextButton(this, width - 70, height * 0.88, "다음 →", () => {
        this.observePage += 1;
        this.showObservationPhase();
      }, { width: 90, height: 30, fontSize: "12px", fill: 0xe8c8a0 }));
    } else {
      this.track(createTextButton(
        this,
        width / 2,
        height * 0.88,
        ready ? "퀴즈 배틀 시작!" : "관찰 체크 3개를 먼저 해요",
        () => {
          if (!ready) return;
          this.startBattlePhase();
        },
        {
          width: 260,
          height: 34,
          fontSize: "14px",
          fill: ready ? 0xf0d9a0 : 0xc8b8a0
        }
      ));
    }

    // 진행 점
    const dots = pages.map((p, i) => (this.observeChecks[p.key] ? "●" : (i === this.observePage ? "◎" : "○"))).join(" ");
    this.track(this.add.text(width / 2, height * 0.42, dots, {
      fontSize: "14px",
      color: "#6b4226"
    }).setOrigin(0.5));
  }

  startBattlePhase() {
    this.phase = "battle";
    this.qIndex = 0;
    this.busy = false;
    this.showQuestion();
  }

  showQuestion() {
    this.phase = "battle";
    this.busy = false;
    this.clearDynamicUi();

    const { width, height } = this.cameras.main;
    const q = this.questions[this.qIndex];
    const typeLabel = getQuestionTypeLabel(q, this.qIndex);
    const facts = this.quickFacts;

    this.titleText.setText(`퀴즈 배틀 · ${this.animal.name}`);
    this.subtitleText.setText(`문제 ${this.qIndex + 1}/${this.questions.length} · ${typeLabel}  |  도감 내용을 떠올리며 골라 봐요.`);

    this.track(this.add.rectangle(width / 2, height * 0.68, width - 16, height * 0.52, 0xfff8e7, 0.97)
      .setStrokeStyle(3, 0x6b4226));

    // 관찰 요약 (정답 누설 없이 quickFacts만)
    this.track(this.add.text(width / 2, height * 0.46, `관찰 요약  사는 곳: ${facts.habitat}  ·  특징: ${facts.feature}`, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "11px",
      color: "#5d4a38",
      align: "center",
      wordWrap: { width: width - 40 }
    }).setOrigin(0.5));

    this.track(this.add.text(width / 2, height * 0.53, q.text, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "14px",
      color: "#2d1b0e",
      align: "center",
      wordWrap: { width: width - 48 },
      fontStyle: "bold"
    }).setOrigin(0.5));

    this.feedbackText = this.track(this.add.text(width / 2, height * 0.95, "", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "12px",
      color: "#0f6f68"
    }).setOrigin(0.5));

    const startY = height * 0.64;
    q.options.forEach((option, index) => {
      const btn = createTextButton(
        this,
        width / 2,
        startY + index * 36,
        option,
        () => this.onAnswer(option),
        {
          width: Math.min(width - 32, 560),
          height: 30,
          fontSize: "12px",
          fill: 0xf5e6c8
        }
      );
      this.optionButtons.push(btn);
    });
  }

  onAnswer(option) {
    if (this.busy || this.phase !== "battle") return;
    this.busy = true;

    const q = this.questions[this.qIndex];
    if (option === q.correct) {
      this.feedbackText.setText("맞았어요! 관찰을 정말 잘했네요. (공격 성공!)");
      this.feedbackText.setColor("#0f6f68");
      this.time.delayedCall(800, () => {
        this.qIndex += 1;
        if (this.qIndex >= this.questions.length) {
          this.onVictory();
        } else {
          this.showQuestion();
        }
      });
      return;
    }

    // 오답: 정답 직접 공개 없이 관찰 단서로 이동 (레거시와 동일)
    this.showHintPhase(q.hintKey);
  }

  showHintPhase(hintKey) {
    this.phase = "hint";
    this.clearDynamicUi();
    const { width, height } = this.cameras.main;
    const section = getHintSection(this.animal, hintKey);
    const typeLabel = getQuestionTypeLabel(this.questions[this.qIndex], this.qIndex);

    this.titleText.setText(`단서 확인 · ${typeLabel}`);
    this.subtitleText.setText("괜찮아요. 노란 단서를 다시 읽고 같은 문제에 다시 도전해 보세요.");

    this.track(this.add.rectangle(width / 2, height * 0.68, width - 16, height * 0.52, 0xfff8e7, 0.97)
      .setStrokeStyle(3, 0xe8a838));

    this.track(this.add.text(width / 2, height * 0.48, `문제 ${this.qIndex + 1} / ${this.questions.length}`, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "12px",
      color: "#6b4226"
    }).setOrigin(0.5));

    this.track(this.add.rectangle(width / 2, height * 0.66, width - 40, 100, 0xfff3c4)
      .setStrokeStyle(3, 0xe8a838));

    this.track(this.add.text(width / 2, height * 0.58, section.title, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "14px",
      color: "#6b4226",
      fontStyle: "bold"
    }).setOrigin(0.5));

    this.track(this.add.text(width / 2, height * 0.68, section.body, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "13px",
      color: "#2d1b0e",
      align: "center",
      wordWrap: { width: width - 64 }
    }).setOrigin(0.5));

    const retryBtn = createTextButton(
      this,
      width / 2,
      height * 0.88,
      "잠시만… 단서 읽는 중",
      () => {},
      { width: 260, height: 34, fontSize: "13px", fill: 0xc8b8a0 }
    );
    this.track(retryBtn);
    retryBtn.list[0].disableInteractive();

    this.time.delayedCall(RETRY_LOCK_MS, () => {
      if (!this.scene.isActive() || this.phase !== "hint") return;
      retryBtn.destroy(true);
      this.track(createTextButton(
        this,
        width / 2,
        height * 0.88,
        "단서 확인하고 다시 풀기",
        () => this.showQuestion(),
        { width: 260, height: 34, fontSize: "13px", fill: 0xf0d9a0 }
      ));
    });
  }

  onVictory() {
    this.phase = "victory";
    collectAnimal(this.animal.id);
    this.clearDynamicUi();

    const { width, height } = this.cameras.main;
    this.titleText.setText("배틀 승리!");
    this.subtitleText.setText("사는 곳 · 움직임 · 특징을 모두 확인했습니다.");

    this.track(this.add.rectangle(width / 2, height * 0.68, width - 16, height * 0.48, 0xfff8e7, 0.97)
      .setStrokeStyle(3, 0x0f6f68));

    this.track(this.add.text(width / 2, height * 0.55, `${this.animal.name}을(를) 도감에 등록했어요!`, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "16px",
      color: "#2d1b0e",
      fontStyle: "bold"
    }).setOrigin(0.5));

    this.track(this.add.text(width / 2, height * 0.68, this.observation.habitatLink, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "12px",
      color: "#5d4a38",
      align: "center",
      wordWrap: { width: width - 56 }
    }).setOrigin(0.5));

    this.track(createTextButton(this, width / 2 - 90, height * 0.88, "도감 보기", () => {
      this.scene.start("DexScene", {
        from: "OverworldScene",
        returnPos: this.returnPos,
        highlightId: this.animal.id
      });
    }, { width: 140, height: 36, fontSize: "14px" }));

    this.track(createTextButton(this, width / 2 + 90, height * 0.88, "맵으로", () => {
      this.returnToOverworld(true);
    }, { width: 140, height: 36, fontSize: "14px", fill: 0xd4e8c2 }));
  }

  returnToOverworld(won) {
    this.scene.start("OverworldScene", {
      returnPos: this.returnPos,
      justCollected: won ? this.animalId : null
    });
  }
}
