// 타이틀 화면 — Sprout Lands UI로 시작
import Phaser from "phaser";
import { createTextButton } from "../ui/UiHelpers.js";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    // 배경 톤 (풀밭 그라데이션 느낌)
    this.add.rectangle(width / 2, height / 2, width, height, 0x5a9e3f);
    this.add.rectangle(width / 2, height / 2 + 40, width, height * 0.55, 0x3f7a32, 0.35);

    // 장식용 풀 타일 미리보기 (스프라이트시트 프레임 0)
    if (this.textures.exists("tiles-grass")) {
      this.add.image(width / 2, height * 0.38, "tiles-grass", 0)
        .setDisplaySize(96, 96)
        .setAlpha(0.55);
    }

    this.add.text(width / 2, height * 0.22, "부엉이 동물도감", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "36px",
      color: "#fff8e7",
      fontStyle: "bold",
      stroke: "#2d1b0e",
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.30, "탐험대 · 우리 주변", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "20px",
      color: "#f0d9a0"
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.42, "맵을 걸어 동물을 만나고\n퀴즈 배틀로 도감에 등록해요!", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "16px",
      color: "#fff8e7",
      align: "center",
      lineSpacing: 6
    }).setOrigin(0.5);

    // Sprout Lands 플레이 버튼 시트(상태 여러 장)는 장식으로만 살짝 표시
    if (this.textures.exists("ui-play")) {
      this.add.image(width / 2, height * 0.58, "ui-play")
        .setScale(1.1)
        .setAlpha(0.35);
    }

    createTextButton(this, width / 2, height * 0.68, "모험 시작", () => this.startGame(), {
      width: 200,
      height: 48,
      fontSize: "20px"
    });

    createTextButton(this, width / 2, height * 0.80, "도감 보기", () => {
      this.scene.start("DexScene", { from: "TitleScene" });
    }, {
      width: 160,
      height: 40,
      fontSize: "16px",
      fill: 0xd4e8c2
    });

    this.add.text(width / 2, height * 0.90, "Enter 키로도 시작할 수 있어요", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "12px",
      color: "#e8f5d8"
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 28, "Assets from Sprout Lands by Cup Nooble", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "11px",
      color: "#dce8c8"
    }).setOrigin(0.5);

    // 클릭이 안 잡히는 환경 대비: Enter / Space 로도 시작
    this.input.keyboard?.once("keydown-ENTER", () => this.startGame());
    this.input.keyboard?.once("keydown-SPACE", () => this.startGame());
  }

  startGame() {
    if (this._starting) return;
    this._starting = true;
    this.scene.start("OverworldScene");
  }
}
