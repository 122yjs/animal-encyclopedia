// 도감 — 지역 탭 + 카드 그리드 (수집: 사진, 미수집: 실루엣 ?)
import Phaser from "phaser";
import { regions, regionById, animalEmoji } from "../data/regions.js";
import { animalById } from "../data/animals.js";
import { readCollected, regionStatus, masterStatus, hasBadge } from "../systems/ProgressStore.js";
import { ensureAnimalTexture } from "../world/AnimalSprites.js";
import { KOREAN_FONT, createWoodButton, createWoodPanel } from "../ui/UiHelpers.js";

export default class DexScene extends Phaser.Scene {
  constructor() {
    super("DexScene");
  }

  init(data = {}) {
    this.from = data.from || "TitleScene";
    this.returnPos = data.returnPos || null;
    this.highlightId = data.highlightId || null;
    this.regionId = data.regionId || this.findRegionOf(this.highlightId) || "around";
  }

  findRegionOf(animalId) {
    if (!animalId) return null;
    const region = regions.find((r) => r.spawns.some((s) => s.id === animalId));
    return region?.id || null;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0xf3ebd2);
    this.add.rectangle(width / 2, 26, width, 52, 0x8fc47a, 0.4);

    const master = masterStatus();
    this.add.text(16, 14, "📖 동물 도감", {
      fontFamily: KOREAN_FONT, fontSize: "20px", color: "#0f6f68", fontStyle: "bold"
    });
    this.add.text(16, 38, `전체 ${master.count} / ${master.target}${master.complete ? " · 🏆 도감 마스터!" : ""}`, {
      fontFamily: KOREAN_FONT, fontSize: "12px", color: "#5d4a38"
    });

    createWoodButton(this, width - 60, 26, "← 돌아가기", () => {
      if (this.from === "OverworldScene") {
        this.scene.start("OverworldScene", { returnPos: this.returnPos });
      } else {
        this.scene.start("TitleScene");
      }
    }, { width: 104, height: 32, fontSize: "13px" });

    this.buildTabs();
    this.cardNodes = [];
    this.renderRegion();
  }

  buildTabs() {
    const { width } = this.cameras.main;
    const tabW = (width - 24) / regions.length;
    this.tabButtons = regions.map((region, i) => {
      const status = regionStatus(region.id);
      const badge = hasBadge(region.id) ? "🎖" : "";
      const label = `${region.emoji} ${region.short} ${status.count}/${status.target}${badge}`;
      const btn = createWoodButton(
        this,
        12 + tabW / 2 + i * tabW,
        72,
        label,
        () => {
          this.regionId = region.id;
          this.refreshTabs();
          this.renderRegion();
        },
        { width: tabW - 6, height: 30, fontSize: "11px" }
      );
      btn.regionId = region.id;
      return btn;
    });
    this.refreshTabs();
  }

  refreshTabs() {
    this.tabButtons.forEach((btn) => {
      const active = btn.regionId === this.regionId;
      btn.buttonBg.setTint?.(active ? 0xffe08a : 0xd9c8a8);
      btn.setAlpha(active ? 1 : 0.85);
    });
  }

  renderRegion() {
    this.cardNodes.forEach((n) => n.destroy(true));
    this.cardNodes = [];

    const { width } = this.cameras.main;
    const region = regionById[this.regionId];
    const collected = new Set(readCollected());

    const intro = this.add.text(width / 2, 96, `${region.emoji} ${region.name} — ${region.intro}`, {
      fontFamily: KOREAN_FONT, fontSize: "11px", color: "#5d4a38"
    }).setOrigin(0.5);
    this.cardNodes.push(intro);

    const cols = 4;
    const cardW = 148;
    const cardH = 116;
    const startX = width / 2 - ((cols - 1) * cardW) / 2;
    const startY = 168;

    region.spawns.forEach((spawn, index) => {
      const animal = animalById[spawn.id];
      if (!animal) return;
      const got = collected.has(spawn.id);
      const cx = startX + (index % cols) * cardW;
      const cy = startY + Math.floor(index / cols) * cardH;

      const root = this.add.container(cx, cy);
      this.cardNodes.push(root);

      const panel = createWoodPanel(this, 0, 2, cardW - 10, cardH - 2, {
        tint: got ? null : 0xcfc4ae
      });
      if (this.highlightId === spawn.id) {
        const glow = this.add.rectangle(0, 0, cardW - 4, cardH - 2, 0xffd84d, 0.25);
        root.add(glow);
      }
      root.add(panel);

      // 사진 or 실루엣
      if (got && animal.image) {
        const key = `dex-${spawn.id}`;
        const holder = this.add.container(0, -14);
        root.add(holder);
        const drawThumb = () => {
          if (!this.textures.exists(key) || !this.scene.isActive()) return;
          holder.add(this.add.image(0, 0, key).setDisplaySize(58, 58));
        };
        if (this.textures.exists(key)) {
          drawThumb();
        } else {
          this.load.image(key, animal.image);
          this.load.once(Phaser.Loader.Events.COMPLETE, drawThumb);
          this.load.start();
        }
      } else {
        // 미수집: 자체 제작 픽셀 실루엣 (모양 힌트) — 없으면 ? 표시
        const miniKey = ensureAnimalTexture(this, spawn.id);
        if (miniKey) {
          const silhouette = this.add.image(0, -14, miniKey).setScale(4);
          if (!got) {
            silhouette.setTintFill(0x6b5844);
            silhouette.setAlpha(0.85);
          }
          root.add(silhouette);
          if (!got) {
            root.add(this.add.text(16, -28, "?", {
              fontSize: "15px", fontFamily: KOREAN_FONT, color: "#8a6a4a", fontStyle: "bold"
            }).setOrigin(0.5));
          }
        } else {
          const circle = this.add.circle(0, -14, 26, 0x6b5844, got ? 0.25 : 0.75);
          const mark = this.add.text(0, -14, "?", {
            fontSize: "22px", fontFamily: KOREAN_FONT, color: "#fff8e7"
          }).setOrigin(0.5);
          root.add([circle, mark]);
        }
      }

      const title = got ? `${animalEmoji[spawn.id] || ""} ${animal.name}` : "???";
      root.add(this.add.text(0, 20, title, {
        fontFamily: KOREAN_FONT, fontSize: "13px", color: "#3d2410", fontStyle: "bold"
      }).setOrigin(0.5));
      root.add(this.add.text(0, 38, got ? animal.habitat : `${spawn.zone}에서 만나요`, {
        fontFamily: KOREAN_FONT, fontSize: "9px", color: "#6b5a44",
        align: "center", wordWrap: { width: cardW - 30 }
      }).setOrigin(0.5));
    });
  }
}
