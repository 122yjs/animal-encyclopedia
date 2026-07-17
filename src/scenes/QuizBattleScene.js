// 턴제 퀴즈 배틀 — 포켓몬식 전투에 관찰 학습을 결합했습니다.
//   내 턴: 관찰 퀴즈에 답해 공격 (정답 = 동물 기력 -1)
//   동물 턴: 오답이면 "헷갈리기 공격" (내 하트 -1) → 관찰 단서를 다시 읽고 같은 문제 재도전
//   기력을 모두 빼면 친구가 되어 도감에 등록! 하트가 다 닳으면 잠시 후퇴(불이익 없음).
import Phaser from "phaser";
import { animalById } from "../data/animals.js";
import { animalEmoji } from "../data/regions.js";
import { buildQuestions } from "../systems/QuizBuilder.js";
import {
  buildObservationDetails,
  buildQuickFacts,
  getHintSection,
  getQuestionTypeLabel,
  withParticle
} from "../systems/ObservationBuilder.js";
import { collectAnimal, isCollected, regionStatus } from "../systems/ProgressStore.js";
import { ensureAnimalTexture, ensureBallTexture } from "../world/AnimalSprites.js";
import {
  KOREAN_FONT,
  UI_PALETTE,
  createWoodButton,
  createWoodPanel,
  createHeartRow,
  playEmote
} from "../ui/UiHelpers.js";

const MAX_HEARTS = 3;
const HINT_LOCK_MS = 2500;

export default class QuizBattleScene extends Phaser.Scene {
  constructor() {
    super("QuizBattleScene");
  }

  init(data) {
    this.animalId = data.animalId;
    this.regionId = data.regionId || null;
    this.returnPos = data.returnPos || null;
    this.animal = animalById[this.animalId];
    this.uiNodes = [];
    this.optionButtons = [];
    this.observePage = 0;
    this.observeChecks = { appearance: false, lifestyle: false, habitat: false };
    this.phase = "intro";
    this.busy = false;
  }

  create() {
    this.cameras.main.fadeIn(240, 24, 16, 8);
    const { width, height } = this.cameras.main;

    if (!this.animal) {
      this.add.text(width / 2, height / 2, "동물을 찾을 수 없어요", {
        fontFamily: KOREAN_FONT, fontSize: "18px", color: "#fff"
      }).setOrigin(0.5);
      this.time.delayedCall(1200, () => this.returnToOverworld());
      return;
    }

    if (isCollected(this.animal.id)) {
      this.add.rectangle(width / 2, height / 2, width, height, 0x3f7a32);
      this.add.text(width / 2, height / 2, `${this.animal.name}은(는) 이미 도감 친구예요!`, {
        fontFamily: KOREAN_FONT, fontSize: "16px", color: "#fff8e7"
      }).setOrigin(0.5);
      this.time.delayedCall(1300, () => this.returnToOverworld());
      return;
    }

    this.observation = buildObservationDetails(this.animal);
    this.quickFacts = buildQuickFacts(this.animal);
    this.questions = buildQuestions(this.animal);
    this.qIndex = 0;
    this.playerHearts = MAX_HEARTS;
    this.enemyGauge = this.questions.length;

    this.buildStage();
    this.showIntro();
  }

  // ─── 전투 무대 ──────────────────────────────────────────

  buildStage() {
    const { width, height } = this.cameras.main;
    const emoji = animalEmoji[this.animal.id] || "❓";

    // 배경 (들판 느낌)
    this.add.rectangle(width / 2, height * 0.32, width, height * 0.64, 0x9ccf7e);
    this.add.rectangle(width / 2, height * 0.82, width, height * 0.36, 0x77b45f);
    this.add.rectangle(width / 2, 10, width, 20, 0xbfe3a0, 0.5);

    // 발판
    this.add.ellipse(486, 176, 168, 42, 0x639b4d, 0.85);
    this.add.ellipse(150, 314, 176, 46, 0x639b4d, 0.85);

    // ── 적(동물) 카드 ──
    this.enemyRoot = this.add.container(486, 100);
    const card = createWoodPanel(this, 0, 0, 126, 126);
    this.enemyPhotoHolder = this.add.container(0, 0);
    // 사진이 오기 전까지는 자체 제작 미니 스프라이트(없으면 이모지)로 표시
    const miniKey = ensureAnimalTexture(this, this.animal.id);
    this.enemyEmojiText = miniKey
      ? this.add.image(0, -2, miniKey).setScale(8)
      : this.add.text(0, -4, emoji, {
        fontSize: "52px", fontFamily: KOREAN_FONT
      }).setOrigin(0.5);
    this.enemyPhotoHolder.add(this.enemyEmojiText);
    const plate = createWoodPanel(this, 0, 76, 168, 30, {
      fill: UI_PALETTE.accentFill, stroke: UI_PALETTE.accentStroke, radius: 8
    });
    const nameText = this.add.text(0, 75, `${emoji} ${this.animal.name}`, {
      fontFamily: KOREAN_FONT, fontSize: "14px", color: UI_PALETTE.textPrimary, fontStyle: "bold"
    }).setOrigin(0.5);
    this.enemyRoot.add([card, this.enemyPhotoHolder, plate, nameText]);

    // 동물 기력(집중력) 게이지 — 카드 바로 아래 칩에 묶어 본문과 겹치지 않게 배치
    const gaugeChip = this.add.container(486, 196);
    gaugeChip.add(createWoodPanel(this, 0, 0, 148, 28, {
      fill: 0xffffff, stroke: UI_PALETTE.accentStroke, radius: 14, alpha: 0.94
    }));
    const gaugeLabel = this.add.text(-58, 0, "기력", {
      fontFamily: KOREAN_FONT, fontSize: "11px", color: UI_PALETTE.teal, fontStyle: "bold"
    }).setOrigin(0, 0.5).setDepth(1002);
    gaugeChip.add(gaugeLabel);
    this.enemyHearts = createHeartRow(this, -30, 0, this.enemyGauge, { size: 20, gap: 3 });
    this.enemyHearts.container.setDepth(1003);
    this.enemyHearts.container.setScrollFactor(0);
    gaugeChip.add(this.enemyHearts.container);
    gaugeChip.setDepth(1002);

    this.loadEnemyPhoto();

    // ── 플레이어 ──
    this.playerSprite = this.add.sprite(150, 272, "player", 4).setScale(3).setDepth(5);
    this.playerSprite.play("idle-up");
    const playerChip = this.add.container(128, 206).setDepth(1002);
    playerChip.add(createWoodPanel(this, 0, 0, 124, 28, {
      fill: 0xffffff, stroke: UI_PALETTE.accentStroke, radius: 14, alpha: 0.94
    }));
    const playerLabel = this.add.text(-48, 0, "나", {
      fontFamily: KOREAN_FONT, fontSize: "11px", color: UI_PALETTE.teal, fontStyle: "bold"
    }).setOrigin(0, 0.5).setDepth(1002);
    playerChip.add(playerLabel);
    this.playerHeartRow = createHeartRow(this, -22, 0, MAX_HEARTS, { size: 20, gap: 4 });
    this.playerHeartRow.container.setDepth(1003);
    this.playerHeartRow.container.setScrollFactor(0);
    playerChip.add(this.playerHeartRow.container);

    // ── 턴 리본 ──
    this.turnPanel = createWoodPanel(this, width / 2, 20, 260, 32).setDepth(1001);
    this.turnText = this.add.text(width / 2, 19, "", {
      fontFamily: KOREAN_FONT, fontSize: "13px", color: UI_PALETTE.textPrimary, fontStyle: "bold"
    }).setOrigin(0.5).setDepth(1002);

    // 도망 버튼 (승리 후에는 숨김)
    this.fleeButton = createWoodButton(this, width - 44, 20, "🏃 도망", () => {
      if (this.phase === "victory") return;
      this.returnToOverworld();
    }, { width: 76, height: 28, fontSize: "12px" });

    // 적 카드 둥실둥실
    this.tweens.add({
      targets: this.enemyRoot,
      y: "+=5",
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  loadEnemyPhoto() {
    if (!this.animal.image) return;
    const key = `animal-${this.animal.id}`;
    const place = () => {
      if (!this.textures.exists(key) || !this.scene.isActive()) return;
      this.enemyEmojiText.setVisible(false);
      const photo = this.add.image(0, 0, key).setDisplaySize(114, 114);
      this.enemyPhotoHolder.add(photo);
    };
    if (this.textures.exists(key)) {
      place();
    } else {
      this.load.image(key, this.animal.image);
      this.load.once(Phaser.Loader.Events.COMPLETE, place);
      this.load.start();
    }
  }

  setTurnLabel(text) {
    this.turnText.setText(text);
  }

  clearDynamicUi() {
    this.uiNodes.forEach((node) => node?.destroy?.(true));
    this.uiNodes = [];
    this.optionButtons.forEach((b) => b.destroy(true));
    this.optionButtons = [];
  }

  track(node) {
    this.uiNodes.push(node);
    return node;
  }

  narrate(text, { height = 96 } = {}) {
    const { width } = this.cameras.main;
    const cam = this.cameras.main;
    const panel = this.track(createWoodPanel(this, width / 2, cam.height - height / 2 - 10, width - 20, height).setDepth(1000));
    const label = this.track(this.add.text(width / 2, cam.height - height / 2 - 10, text, {
      fontFamily: KOREAN_FONT,
      fontSize: "14px",
      color: UI_PALETTE.textPrimary,
      align: "center",
      lineSpacing: 4,
      wordWrap: { width: width - 70 }
    }).setOrigin(0.5).setDepth(1001));
    return { panel, label };
  }

  // ─── 인트로 → 관찰 ──────────────────────────────────────

  showIntro() {
    this.phase = "intro";
    this.setTurnLabel("야생 동물 등장!");
    playEmote(this, 486, 24, "surprise", { depth: 1100 });
    this.narrate(`앗! 야생의 ${this.animal.name}이(가) 나타났어요!\n먼저 차분히 관찰해서 특징을 알아내요.`);

    this.time.delayedCall(1600, () => {
      if (this.phase === "intro") this.showObservation();
    });
  }

  showObservation() {
    this.phase = "observe";
    this.clearDynamicUi();
    const { width, height } = this.cameras.main;
    const obs = this.observation;

    this.setTurnLabel(`관찰하기 · ${this.animal.name}`);

    const pages = [
      { key: "appearance", title: "① 생김새", body: obs.appearance, check: "몸의 특징을 봤어요" },
      { key: "lifestyle", title: "② 움직임", body: obs.lifestyle, check: "움직임을 봤어요" },
      { key: "habitat", title: "③ 사는 곳", body: obs.habitatLife, check: "사는 곳을 봤어요" }
    ];
    if (this.observePage < 0) this.observePage = 0;
    if (this.observePage > pages.length - 1) this.observePage = pages.length - 1;
    const page = pages[this.observePage];
    const checked = this.observeChecks[page.key];

    // 큰 크림 카드 안에 제목 → 본문 → 체크 버튼 → 하단 액션을 순서대로 배치
    this.track(createWoodPanel(this, width / 2, height * 0.62, width - 40, 216).setDepth(999));

    const dots = pages.map((p, i) => (this.observeChecks[p.key] ? "●" : (i === this.observePage ? "◎" : "○"))).join(" ");
    this.track(this.add.text(width / 2, height * 0.40, `${page.title}  (${this.observePage + 1}/3)   ${dots}`, {
      fontFamily: KOREAN_FONT, fontSize: "16px", color: UI_PALETTE.teal, fontStyle: "bold"
    }).setOrigin(0.5).setDepth(1001));

    this.track(this.add.text(width / 2, height * 0.55, page.body, {
      fontFamily: KOREAN_FONT,
      fontSize: "15px",
      color: UI_PALETTE.textPrimary,
      align: "center",
      lineSpacing: 8,
      wordWrap: { width: width - 120 }
    }).setOrigin(0.5).setDepth(1001));

    this.track(createWoodButton(
      this,
      width / 2,
      height * 0.70,
      checked ? `✅ ${page.check}` : `⬜ ${page.check}`,
      () => {
        this.observeChecks[page.key] = true;
        playEmote(this, width / 2 + 130, height * 0.66, "happy", { depth: 1100, scrollFactor: 0 });
        this.showObservation();
      },
      { width: 300, height: 36, fontSize: "14px", tint: checked ? 0xd8f0c0 : null }
    ));

    if (this.observePage > 0) {
      this.track(createWoodButton(this, 76, height * 0.86, "← 이전", () => {
        this.observePage -= 1;
        this.showObservation();
      }, { width: 96, height: 34, fontSize: "13px" }));
    }

    const ready = Object.values(this.observeChecks).every(Boolean);
    if (this.observePage < pages.length - 1) {
      this.track(createWoodButton(this, width - 76, height * 0.86, "다음 →", () => {
        this.observePage += 1;
        this.showObservation();
      }, { width: 96, height: 34, fontSize: "13px" }));
    }
    this.track(createWoodButton(
      this,
      width / 2,
      height * 0.86,
      ready ? "⚔️ 퀴즈 배틀 시작!" : "관찰 체크 3개를 모두 하면 배틀!",
      () => {
        if (!ready) return;
        this.startBattle();
      },
      { width: 284, height: 38, fontSize: "15px", tint: ready ? 0xffe08a : 0xe4e4e0 }
    ));
  }

  // ─── 전투 루프 ──────────────────────────────────────────

  startBattle() {
    this.phase = "battle";
    this.qIndex = 0;
    this.busy = false;
    this.showQuestion();
  }

  /** 현재 문제의 정답이 새지 않는 관찰 요약을 만듭니다 */
  buildSafeFacts(hintKey) {
    const facts = this.quickFacts;
    const parts = [];
    if (hintKey !== "habitat") parts.push(`사는 곳: ${facts.habitat}`);
    if (hintKey !== "lifestyle") parts.push(`움직임: ${facts.movement}`);
    if (hintKey !== "appearance" && hintKey !== "adaptation") parts.push(`특징: ${facts.feature}`);
    return parts.join("  ·  ");
  }

  showQuestion() {
    this.phase = "battle";
    this.busy = false;
    this.clearDynamicUi();

    const { width, height } = this.cameras.main;
    const q = this.questions[this.qIndex];
    const typeLabel = getQuestionTypeLabel(q, this.qIndex);

    this.setTurnLabel(`내 턴 · 문제 ${this.qIndex + 1}/${this.questions.length} (${typeLabel})`);

    this.track(this.add.text(width / 2, 208, `📝 ${this.buildSafeFacts(q.hintKey)}`, {
      fontFamily: KOREAN_FONT, fontSize: "11px", color: UI_PALETTE.textMuted,
      backgroundColor: "#fff8e7cc", padding: { x: 6, y: 3 },
      align: "center", wordWrap: { width: width - 60 }
    }).setOrigin(0.5).setDepth(1001));

    this.track(createWoodPanel(this, width / 2, 238, width - 16, 42).setDepth(1000));
    this.track(this.add.text(width / 2, 237, q.text, {
      fontFamily: KOREAN_FONT, fontSize: "14px", color: UI_PALETTE.textPrimary, fontStyle: "bold",
      align: "center", wordWrap: { width: width - 60 }
    }).setOrigin(0.5).setDepth(1001));

    q.options.forEach((option, index) => {
      const btn = createWoodButton(
        this,
        width / 2,
        272 + index * 31,
        option,
        () => this.onAnswer(option),
        { width: width - 24, height: 28, fontSize: "13px" }
      );
      this.optionButtons.push(btn);
    });
  }

  lockOptions() {
    this.optionButtons.forEach((b) => b.setButtonEnabled(false));
  }

  onAnswer(option) {
    if (this.busy || this.phase !== "battle") return;
    this.busy = true;
    this.lockOptions();

    const q = this.questions[this.qIndex];
    if (option === q.correct) {
      this.playerAttack();
    } else {
      this.enemyAttack(q);
    }
  }

  playerAttack() {
    const typeLabel = getQuestionTypeLabel(this.questions[this.qIndex], this.qIndex);
    this.clearDynamicUi();
    this.setTurnLabel("공격 성공!");
    this.narrate(`정확한 관찰이에요! ${typeLabel} 공략 성공! ⚡`, { height: 62 });
    playEmote(this, this.playerSprite.x, this.playerSprite.y - 78, "happy", { depth: 1100 });

    // 돌진 → 적 번쩍 + 흔들림 + 기력 감소
    this.tweens.add({
      targets: this.playerSprite,
      x: "+=42",
      duration: 170,
      yoyo: true,
      ease: "Cubic.easeOut"
    });
    this.time.delayedCall(190, () => {
      this.cameras.main.shake(110, 0.0035);
      this.flashEnemy();
      this.enemyGauge -= 1;
      this.enemyHearts.set(this.enemyGauge);
    });

    this.time.delayedCall(1150, () => {
      this.qIndex += 1;
      if (this.enemyGauge <= 0 || this.qIndex >= this.questions.length) {
        this.onVictory();
      } else {
        this.showQuestion();
      }
    });
  }

  flashEnemy() {
    const targets = [];
    this.enemyRoot.iterate((child) => {
      if (child.setTintFill) targets.push(child);
    });
    targets.forEach((t) => t.setTintFill(0xffffff));
    this.tweens.add({
      targets: this.enemyRoot,
      x: "+=7",
      duration: 55,
      yoyo: true,
      repeat: 3
    });
    this.time.delayedCall(150, () => {
      targets.forEach((t) => {
        t.clearTint();
      });
    });
  }

  enemyAttack(question) {
    this.clearDynamicUi();
    this.setTurnLabel(`${this.animal.name}의 턴!`);
    this.narrate(`앗, 빗나갔어요! ${this.animal.name}의 헷갈리기 공격! 💫`, { height: 62 });

    this.tweens.add({
      targets: this.enemyRoot,
      x: "-=46",
      y: "+=26",
      duration: 200,
      yoyo: true,
      ease: "Cubic.easeOut"
    });
    this.time.delayedCall(230, () => {
      this.cameras.main.shake(150, 0.006);
      this.playerSprite.setTintFill(0xff8080);
      this.time.delayedCall(140, () => this.playerSprite.clearTint());
      this.playerHearts -= 1;
      this.playerHeartRow.set(this.playerHearts);
      playEmote(this, this.playerSprite.x, this.playerSprite.y - 78, "sad", { depth: 1100 });
    });

    this.time.delayedCall(1250, () => {
      if (this.playerHearts <= 0) {
        this.onRetreat();
      } else {
        this.showHint(question.hintKey);
      }
    });
  }

  showHint(hintKey) {
    this.phase = "hint";
    this.clearDynamicUi();
    const { width, height } = this.cameras.main;
    const section = getHintSection(this.animal, hintKey);

    this.setTurnLabel("단서 다시 보기");

    this.track(createWoodPanel(this, width / 2, height * 0.66, width - 40, 176, {
      fill: 0xfff6da, stroke: 0xc79a3a
    }).setDepth(999));
    this.track(this.add.text(width / 2, height * 0.50, `🔍 ${section.title}`, {
      fontFamily: KOREAN_FONT, fontSize: "15px", color: UI_PALETTE.amber, fontStyle: "bold"
    }).setOrigin(0.5).setDepth(1001));
    this.track(this.add.text(width / 2, height * 0.63, section.body, {
      fontFamily: KOREAN_FONT, fontSize: "14px", color: UI_PALETTE.textPrimary,
      align: "center", lineSpacing: 6, wordWrap: { width: width - 100 }
    }).setOrigin(0.5).setDepth(1001));

    const waitBtn = this.track(createWoodButton(
      this,
      width / 2,
      height * 0.86,
      "단서를 읽는 중이에요…",
      () => {},
      { width: 260, height: 32, fontSize: "13px" }
    ));
    waitBtn.setButtonEnabled(false);

    this.time.delayedCall(HINT_LOCK_MS, () => {
      if (this.phase !== "hint" || !this.scene.isActive()) return;
      waitBtn.destroy(true);
      const idx = this.uiNodes.indexOf(waitBtn);
      if (idx >= 0) this.uiNodes.splice(idx, 1);
      this.track(createWoodButton(
        this,
        width / 2,
        height * 0.86,
        "💪 같은 문제 다시 도전!",
        () => this.showQuestion(),
        { width: 260, height: 32, fontSize: "13px", tint: 0xffe08a }
      ));
    });
  }

  // ─── 승리 · 후퇴 ────────────────────────────────────────

  // ─── 포획: 도감볼 던지기 ─────────────────────────────────

  onVictory() {
    this.phase = "victory";
    this.clearDynamicUi();
    this.setTurnLabel("지금이 기회!");
    this.fleeButton?.setVisible(false);

    playEmote(this, this.enemyRoot.x, this.enemyRoot.y - 76, "surprise", { depth: 1100 });
    this.tweens.add({
      targets: this.enemyRoot,
      angle: { from: -3, to: 3 },
      duration: 140,
      yoyo: true,
      repeat: 2
    });

    const { width, height } = this.cameras.main;
    this.narrate(`${this.animal.name}의 기력이 다 빠졌어요!\n도감볼을 던져 친구로 맞이해요!`, { height: 74 });
    this.track(createWoodButton(this, width / 2, height * 0.32, "🎯 도감볼 던지기!", () => this.throwBall(), {
      width: 250,
      height: 46,
      fontSize: "17px",
      tint: 0xffe08a
    }));
  }

  throwBall() {
    if (this.phase !== "victory" || this.ballThrown) return;
    this.ballThrown = true;
    this.clearDynamicUi();
    this.setTurnLabel("도감볼 던지기!");
    this.narrate("도감볼을 힘껏 던졌다…!", { height: 56 });

    ensureBallTexture(this);
    const startX = this.playerSprite.x + 26;
    const startY = this.playerSprite.y - 52;
    const targetX = this.enemyRoot.x;
    const targetY = this.enemyRoot.y;
    const ball = this.add.image(startX, startY, "dex-ball").setScale(0).setDepth(1200);

    // 던지는 모션: 플레이어가 살짝 앞으로
    this.tweens.add({
      targets: this.playerSprite,
      x: "+=18",
      duration: 150,
      yoyo: true,
      ease: "Cubic.easeOut"
    });
    this.tweens.add({ targets: ball, scale: 2.4, duration: 140, ease: "Back.easeOut" });

    // 포물선 비행 (2차 베지어) + 회전
    const peakX = (startX + targetX) / 2;
    const peakY = Math.min(startY, targetY) - 120;
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 640,
      delay: 140,
      ease: "Sine.easeIn",
      onUpdate: (tw) => {
        const u = tw.getValue();
        const inv = 1 - u;
        ball.x = inv * inv * startX + 2 * inv * u * peakX + u * u * targetX;
        ball.y = inv * inv * startY + 2 * inv * u * peakY + u * u * targetY;
        ball.rotation = u * 9;
      },
      onComplete: () => this.absorbIntoBall(ball, targetX, targetY)
    });
  }

  absorbIntoBall(ball, x, y) {
    this.cameras.main.flash(150, 255, 240, 190);
    this.flashEnemy();
    this.enemyHearts.container.setVisible(false);
    this.enemyGaugeLabel?.setVisible(false);

    // 동물이 볼 속으로 쏙 빨려 들어감
    this.tweens.add({
      targets: this.enemyRoot,
      scale: 0,
      x,
      y: y - 4,
      angle: 24,
      duration: 330,
      ease: "Cubic.easeIn",
      onComplete: () => {
        this.enemyRoot.setVisible(false);
        // 볼이 발판으로 톡 떨어짐
        this.tweens.add({
          targets: ball,
          y: 172,
          scale: 2.7,
          duration: 300,
          ease: "Bounce.easeOut",
          onComplete: () => this.wobbleBall(ball, 0)
        });
      }
    });
  }

  wobbleBall(ball, count) {
    if (count >= 3) {
      this.catchSuccess(ball);
      return;
    }
    const tick = this.add.text(ball.x, ball.y - 34, "딸깍…", {
      fontFamily: KOREAN_FONT,
      fontSize: "12px",
      color: "#fffdf7",
      stroke: "#46513f",
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(1201);
    this.tweens.add({
      targets: tick,
      y: tick.y - 9,
      alpha: 0,
      duration: 540,
      onComplete: () => tick.destroy()
    });
    this.tweens.add({
      targets: ball,
      angle: { from: -16, to: 16 },
      duration: 130,
      yoyo: true,
      repeat: 1,
      ease: "Sine.easeInOut",
      onComplete: () => {
        ball.setAngle(0);
        this.time.delayedCall(200, () => this.wobbleBall(ball, count + 1));
      }
    });
  }

  catchSuccess(ball) {
    collectAnimal(this.animal.id);
    this.cameras.main.flash(240, 255, 236, 160);
    playEmote(this, ball.x, ball.y - 46, "love", { depth: 1300 });
    playEmote(this, ball.x - 36, ball.y - 22, "happy", { depth: 1300 });
    this.tweens.add({ targets: ball, scale: 3.1, duration: 150, yoyo: true, repeat: 1 });

    const flashText = this.add.text(ball.x, ball.y - 66, "찰칵! ✨", {
      fontFamily: KOREAN_FONT,
      fontSize: "17px",
      color: "#ffd84d",
      fontStyle: "bold",
      stroke: "#46513f",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(1301);

    this.time.delayedCall(800, () => {
      flashText.destroy();
      this.showCatchResult();
    });
  }

  showCatchResult() {
    this.clearDynamicUi();
    this.setTurnLabel("배틀 승리!");

    const { width, height } = this.cameras.main;
    const emoji = animalEmoji[this.animal.id] || "";
    const name = this.animal.name;
    const status = this.regionId ? regionStatus(this.regionId) : null;
    const extra = status && status.complete
      ? "\n🎖 이 지역 동물을 모두 만났어요! 맵으로 돌아가면 배지를 받아요!"
      : "";

    this.narrate(
      `${emoji} ${name}${withParticle(name)} 친구가 되었어요! 도감에 등록!\n${this.observation.habitatLink}${extra}`,
      { height: 108 }
    );
    this.track(createWoodButton(this, width / 2 - 92, height * 0.30, "📖 도감 보기", () => {
      this.scene.start("DexScene", {
        from: "OverworldScene",
        returnPos: this.returnPos,
        highlightId: this.animal.id,
        regionId: this.regionId
      });
    }, { width: 150, height: 36, fontSize: "14px" }));
    this.track(createWoodButton(this, width / 2 + 92, height * 0.30, "🗺️ 모험 계속!", () => {
      this.returnToOverworld();
    }, { width: 150, height: 36, fontSize: "14px", tint: 0xffe08a }));
  }

  onRetreat() {
    this.phase = "retreat";
    this.clearDynamicUi();
    this.setTurnLabel("잠시 후퇴…");
    playEmote(this, this.playerSprite.x, this.playerSprite.y - 78, "zzz", { depth: 1100 });
    this.narrate(`기운이 다 빠졌어요… 괜찮아요!\n${this.animal.name}은(는) 그 자리에서 기다려요. 단서를 떠올리고 다시 도전!`, { height: 84 });

    this.time.delayedCall(2200, () => this.returnToOverworld());
  }

  returnToOverworld() {
    this.scene.start("OverworldScene", { returnPos: this.returnPos });
  }
}
