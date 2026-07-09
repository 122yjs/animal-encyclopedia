// 도감 화면 — 수집/미수집 목록
import Phaser from "phaser";
import { aroundMission } from "../data/missions.js";
import { animalById } from "../data/animals.js";
import { readCollected, checkAroundClear } from "../systems/ProgressStore.js";
import { createTextButton } from "../ui/UiHelpers.js";

export default class DexScene extends Phaser.Scene {
  constructor() {
    super("DexScene");
  }

  init(data = {}) {
    this.from = data.from || "TitleScene";
    this.returnPos = data.returnPos || null;
    this.highlightId = data.highlightId || null;
  }

  create() {
    const { width, height } = this.cameras.main;
    const collected = new Set(readCollected());
    const status = checkAroundClear();

    this.add.rectangle(width / 2, height / 2, width, height, 0xf8f3df);

    this.add.text(width / 2, 28, "동물 도감 · 우리 주변", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "22px",
      color: "#0f6f68",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(width / 2, 56, `수집 ${status.count} / ${status.target}  (전체 저장 ${collected.size}마리)`, {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "13px",
      color: "#5d4a38"
    }).setOrigin(0.5);

    // 스폰 대상 4마리 + 미션 목록 나머지
    const ids = aroundMission.animalIds;
    const startY = 90;
    const rowH = 52;

    ids.forEach((id, index) => {
      const animal = animalById[id];
      if (!animal) return;
      const got = collected.has(id);
      const y = startY + index * rowH;
      const isSpawn = aroundMission.spawnAnimalIds.includes(id);

      const bg = this.add.rectangle(width / 2, y, width - 40, rowH - 8, got ? 0xe7f5ef : 0xe8e0d0)
        .setStrokeStyle(2, this.highlightId === id ? 0xe8a838 : 0x6b422633);

      // 실루엣/초상
      if (got && animal.image) {
        const key = `dex-${id}`;
        const drawThumb = () => {
          if (!this.textures.exists(key)) return;
          this.add.image(48, y, key).setDisplaySize(36, 36);
        };
        if (this.textures.exists(key)) {
          drawThumb();
        } else {
          this.load.image(key, animal.image);
          this.load.once(Phaser.Loader.Events.COMPLETE, drawThumb);
          this.load.start();
        }
      } else {
        this.add.circle(48, y, 16, 0x6b4226, got ? 0.2 : 0.55);
        this.add.text(48, y, "?", {
          fontSize: "16px",
          color: "#fff8e7"
        }).setOrigin(0.5);
      }

      const title = got ? animal.name : "???";
      const sub = got
        ? animal.habitat
        : (isSpawn ? "맵에서 만나 퀴즈로 등록하세요" : "이번 슬라이스 스폰 외 동물");

      this.add.text(78, y - 10, title, {
        fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
        fontSize: "15px",
        color: "#2d1b0e",
        fontStyle: "bold"
      });
      this.add.text(78, y + 8, sub, {
        fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
        fontSize: "11px",
        color: "#5d4a38"
      });

      if (got) {
        this.add.text(width - 52, y, "✓", {
          fontSize: "18px",
          color: "#0f6f68"
        }).setOrigin(0.5);
      }

      // bg는 레이아웃용
      void bg;
    });

    createTextButton(this, width / 2, height - 36, "돌아가기", () => {
      if (this.from === "OverworldScene") {
        this.scene.start("OverworldScene", { returnPos: this.returnPos });
      } else {
        this.scene.start("TitleScene");
      }
    }, { width: 160, height: 40, fontSize: "16px" });
  }
}
