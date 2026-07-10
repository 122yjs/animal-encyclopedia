// 타이틀 화면 — Sprout Lands 들판 위에서 모험 시작
import Phaser from "phaser";
import { KOREAN_FONT, createWoodButton, createWoodPanel } from "../ui/UiHelpers.js";
import { masterStatus, badgeCount } from "../systems/ProgressStore.js";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    // 들판 배경 (타일을 직접 깔아 배경 제작)
    const FLAT = [55, 56, 66, 67, 57, 68];
    const tile = 32;
    for (let ty = 0; ty <= Math.ceil(height / tile); ty += 1) {
      for (let tx = 0; tx <= Math.ceil(width / tile); tx += 1) {
        const frame = (tx * 7 + ty * 13) % 37 === 0 ? 60 : FLAT[(tx * 3 + ty * 5) % FLAT.length];
        this.add.image(tx * tile, ty * tile, "tiles-grass", frame)
          .setOrigin(0)
          .setDisplaySize(tile, tile);
      }
    }
    this.add.rectangle(width / 2, height / 2, width, height, 0x2d1b0e, 0.16);

    // 나무 장식
    const putTree = (x, y, scale = 1) => {
      this.add.image(x, y, "obj-biom", 1).setDisplaySize(32 * scale, 32 * scale);
      this.add.image(x + 32 * scale, y, "obj-biom", 2).setDisplaySize(32 * scale, 32 * scale);
      this.add.image(x, y + 32 * scale, "obj-biom", 10).setDisplaySize(32 * scale, 32 * scale);
      this.add.image(x + 32 * scale, y + 32 * scale, "obj-biom", 11).setDisplaySize(32 * scale, 32 * scale);
    };
    putTree(52, 48);
    putTree(width - 110, 64);
    putTree(width - 170, height - 120, 0.9);

    // 동물 친구들
    if (this.textures.exists("npc-chicken")) {
      const chick = this.add.sprite(width * 0.24, height * 0.76, "npc-chicken").setDisplaySize(40, 40);
      chick.play("chicken-idle");
    }
    if (this.textures.exists("npc-cow")) {
      const cow = this.add.sprite(width * 0.78, height * 0.74, "npc-cow").setDisplaySize(64, 64);
      cow.play("cow-idle");
    }
    const hero = this.add.sprite(width / 2, height * 0.78, "player", 0).setScale(2.4);
    hero.play("idle-down");

    // 타이틀 패널
    createWoodPanel(this, width / 2, height * 0.20, 400, 84);
    this.add.text(width / 2, height * 0.155, "동물도감 탐험대", {
      fontFamily: KOREAN_FONT,
      fontSize: "34px",
      color: "#3d2410",
      fontStyle: "bold"
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.245, "🐾 수집형 턴제 RPG · 다섯 서식지 대모험", {
      fontFamily: KOREAN_FONT,
      fontSize: "13px",
      color: "#6b4226"
    }).setOrigin(0.5);

    const master = masterStatus();
    const hasSave = master.count > 0;
    const startLabel = hasSave
      ? `▶ 이어서 모험 (도감 ${master.count}/${master.target} · 배지 ${badgeCount()})`
      : "▶ 모험 시작!";

    createWoodButton(this, width / 2, height * 0.44, startLabel, () => this.startGame(), {
      width: 300,
      height: 46,
      fontSize: "17px",
      tint: 0xffe08a
    });

    createWoodButton(this, width / 2, height * 0.57, "📖 도감 보기", () => {
      this.scene.start("DexScene", { from: "TitleScene" });
    }, { width: 190, height: 38, fontSize: "14px" });

    this.add.text(width / 2, height * 0.655, "걸어서 동물을 만나면 관찰 퀴즈 배틀이 시작돼요!\n방향키·WASD 또는 화면 패드로 움직여요 · Enter로 시작", {
      fontFamily: KOREAN_FONT,
      fontSize: "11px",
      color: "#fff8e7",
      align: "center",
      lineSpacing: 4,
      stroke: "#3d2410",
      strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 14, "Assets: Sprout Lands by Cup Nooble (비상업 교육용)", {
      fontFamily: KOREAN_FONT,
      fontSize: "10px",
      color: "#fff8e7",
      stroke: "#3d2410",
      strokeThickness: 2
    }).setOrigin(0.5);

    this.input.keyboard?.once("keydown-ENTER", () => this.startGame());
    this.input.keyboard?.once("keydown-SPACE", () => this.startGame());
  }

  startGame() {
    if (this._starting) return;
    this._starting = true;
    this.cameras.main.fadeOut(260, 24, 16, 8);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start("OverworldScene");
    });
  }
}
