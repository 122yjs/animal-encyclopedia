// 오버월드 — Sprout Lands 타일로 만든 "우리 주변" 탐험 맵
// 중요: 타일마다 Image를 만들면(660개+) 브라우저가 멈춥니다.
// 땅은 RenderTexture 한 장에 그리고, 장식·조우·플레이어만 개별 오브젝트로 둡니다.
import Phaser from "phaser";
import { spawnPoints } from "../data/missions.js";
import { animalById } from "../data/animals.js";
import { isCollected, checkAroundClear, markRegionCleared } from "../systems/ProgressStore.js";
import { createTextButton, createVirtualPad, createDialogPanel } from "../ui/UiHelpers.js";

const TILE = 32;
const MAP_W = 30;
const MAP_H = 22;
const PLAYER_SPEED = 130;

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super("OverworldScene");
  }

  init(data = {}) {
    this.returnPos = data.returnPos || null;
    this.justCollected = data.justCollected || null;
  }

  create() {
    this.encounterLocked = false;
    this.blockedTiles = new Set();

    try {
      this.buildMap();
      this.createPlayer();
      this.createEncounters();
      this.createHud();
      this.setupInput();
      this.time.delayedCall(400, () => this.maybeCelebrateClear());
    } catch (error) {
      console.error("오버월드 생성 실패:", error);
      this.showFatalError(error);
    }
  }

  showFatalError(error) {
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x2d1b0e, 0.92).setScrollFactor(0).setDepth(9000);
    this.add.text(width / 2, height / 2 - 20, "맵을 불러오지 못했어요", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "18px",
      color: "#fff8e7"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
    this.add.text(width / 2, height / 2 + 20, String(error?.message || error), {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "12px",
      color: "#f0d9a0",
      wordWrap: { width: width - 40 },
      align: "center"
    }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
  }

  // ─── 맵 생성 ───────────────────────────────────────────

  buildMap() {
    const worldW = MAP_W * TILE;
    const worldH = MAP_H * TILE;
    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBackgroundColor(0x5a9e3e);

    // 땅 전체를 한 장의 텍스처에 그림 (성능 핵심)
    this.ground = this.add.renderTexture(0, 0, worldW, worldH).setOrigin(0, 0).setDepth(0);

    this.paintGrassBase();
    this.paintHills(1, 1, 7, 5);
    this.paintPond(20, 2, 7, 5);
    this.paintDirtPatch(4, 3, 5, 4);
    this.paintVillageYard(4, 14, 8, 5);
    this.paintCrossPaths();
    this.paintBorderFences();
    this.paintFenceRect(3, 2, 7, 6, false);
    this.paintFenceSegment(18, 14, 8, "h");

    // 장식은 소수만 개별 스프라이트로
    this.placeDecorations();
    this.placeHouse(5, 15);
    this.placeChest(15, 11);
    this.placeBridge(19, 4);
    this.placeZoneSigns();
  }

  tileCenter(tx, ty) {
    return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 };
  }

  block(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return;
    this.blockedTiles.add(`${tx},${ty}`);
  }

  isBlocked(px, py) {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
    return this.blockedTiles.has(`${tx},${ty}`);
  }

  /** 타일을 RenderTexture에 한 장씩 찍습니다 (씬 children에 쌓지 않음) */
  stampTile(tx, ty, key, frame = 0) {
    if (!this.textures.exists(key)) return;
    const { x, y } = this.tileCenter(tx, ty);
    // drawFrame은 원본 픽셀 크기라 display 스케일을 맞추기 위해 temporary image 사용
    const temp = this.make.image({ x: 0, y: 0, key, frame, add: false });
    temp.setDisplaySize(TILE, TILE);
    this.ground.draw(temp, x - TILE / 2, y - TILE / 2);
    temp.destroy();
  }

  paintGrassBase() {
    const grassFrames = [0, 1, 2, 11, 12];
    for (let ty = 0; ty < MAP_H; ty += 1) {
      for (let tx = 0; tx < MAP_W; tx += 1) {
        const frame = grassFrames[(tx * 3 + ty * 5) % grassFrames.length];
        this.stampTile(tx, ty, "tiles-grass", frame);
      }
    }
  }

  paintHills(tx0, ty0, w, h) {
    for (let ty = ty0; ty < ty0 + h; ty += 1) {
      for (let tx = tx0; tx < tx0 + w; tx += 1) {
        const edge = tx === tx0 || ty === ty0 || tx === tx0 + w - 1 || ty === ty0 + h - 1;
        this.stampTile(tx, ty, "tiles-hills", edge ? 1 : 12);
        this.block(tx, ty);
      }
    }
  }

  paintPond(tx0, ty0, w, h) {
    for (let ty = ty0; ty < ty0 + h; ty += 1) {
      for (let tx = tx0; tx < tx0 + w; tx += 1) {
        this.stampTile(tx, ty, "tiles-water", (tx + ty) % 4);
        this.block(tx, ty);
      }
    }
  }

  paintDirtPatch(tx0, ty0, w, h) {
    for (let ty = ty0; ty < ty0 + h; ty += 1) {
      for (let tx = tx0; tx < tx0 + w; tx += 1) {
        this.stampTile(tx, ty, "tiles-dirt", (tx + ty) % 4);
      }
    }
  }

  paintVillageYard(tx0, ty0, w, h) {
    for (let ty = ty0; ty < ty0 + h; ty += 1) {
      for (let tx = tx0; tx < tx0 + w; tx += 1) {
        this.stampTile(tx, ty, "tiles-path", (tx + ty) % 3);
      }
    }
  }

  paintPathCell(tx, ty) {
    if (tx < 1 || ty < 1 || tx >= MAP_W - 1 || ty >= MAP_H - 1) return;
    if (this.blockedTiles.has(`${tx},${ty}`)) return;
    this.stampTile(tx, ty, "tiles-path", (tx + ty) % 4);
  }

  paintCrossPaths() {
    for (let tx = 5; tx <= 22; tx += 1) {
      this.paintPathCell(tx, 11);
      this.paintPathCell(tx, 12);
    }
    for (let ty = 5; ty <= 17; ty += 1) {
      this.paintPathCell(14, ty);
      this.paintPathCell(15, ty);
    }
    for (let ty = 5; ty <= 11; ty += 1) this.paintPathCell(6, ty);
    for (let tx = 15; tx <= 22; tx += 1) this.paintPathCell(tx, 7);
    for (let tx = 8; tx <= 14; tx += 1) this.paintPathCell(tx, 16);
    for (let tx = 15; tx <= 22; tx += 1) this.paintPathCell(tx, 17);
  }

  paintBorderFences() {
    for (let tx = 0; tx < MAP_W; tx += 1) {
      this.putFence(tx, 0);
      this.putFence(tx, MAP_H - 1);
    }
    for (let ty = 0; ty < MAP_H; ty += 1) {
      this.putFence(0, ty);
      this.putFence(MAP_W - 1, ty);
    }
  }

  putFence(tx, ty) {
    this.stampTile(tx, ty, "tiles-fence", (tx + ty) % 8);
    this.block(tx, ty);
  }

  paintFenceRect(tx0, ty0, w, h, closed) {
    for (let tx = tx0; tx < tx0 + w; tx += 1) {
      this.putFence(tx, ty0);
      if (closed || tx !== tx0 + Math.floor(w / 2)) {
        this.putFence(tx, ty0 + h - 1);
      }
    }
    for (let ty = ty0; ty < ty0 + h; ty += 1) {
      this.putFence(tx0, ty);
      this.putFence(tx0 + w - 1, ty);
    }
    if (!closed) {
      const gateX = tx0 + Math.floor(w / 2);
      this.blockedTiles.delete(`${gateX},${ty0 + h - 1}`);
      this.paintPathCell(gateX, ty0 + h - 1);
    }
  }

  paintFenceSegment(tx0, ty, len, dir) {
    for (let i = 0; i < len; i += 1) {
      const tx = dir === "h" ? tx0 + i : tx0;
      const ty2 = dir === "v" ? ty + i : ty;
      this.putFence(tx, ty2);
    }
  }

  placePlant(tx, ty, frame = 0) {
    if (tx < 1 || ty < 1 || tx >= MAP_W - 1 || ty >= MAP_H - 1) return;
    if (this.blockedTiles.has(`${tx},${ty}`)) return;
    if (!this.textures.exists("obj-plants")) return;
    const { x, y } = this.tileCenter(tx, ty);
    this.add.image(x, y - 8, "obj-plants", frame % 6)
      .setDisplaySize(28, 40)
      .setDepth(6);
  }

  placeBiom(tx, ty, frame = 0, block = false) {
    if (tx < 1 || ty < 1 || tx >= MAP_W - 1 || ty >= MAP_H - 1) return;
    if (!this.textures.exists("obj-biom")) return;
    const { x, y } = this.tileCenter(tx, ty);
    this.add.image(x, y, "obj-biom", frame % 40)
      .setDisplaySize(TILE, TILE)
      .setDepth(5);
    if (block) this.block(tx, ty);
  }

  placeDecorations() {
    [[4, 4], [5, 3], [7, 4], [8, 5], [5, 6], [7, 6]].forEach(([tx, ty], i) => {
      this.placePlant(tx, ty, i);
    });
    [[19, 2], [27, 3], [19, 7], [27, 7], [18, 5]].forEach(([tx, ty], i) => {
      this.placeBiom(tx, ty, 8 + i, true);
    });
    [[4, 14], [11, 14], [4, 18], [11, 18]].forEach(([tx, ty], i) => {
      this.placeBiom(tx, ty, 2 + i, false);
    });
    [[20, 15], [24, 16], [21, 19], [25, 18]].forEach(([tx, ty], i) => {
      this.placeBiom(tx, ty, 16 + i, true);
    });
    [[10, 10], [12, 13], [17, 10], [16, 14]].forEach(([tx, ty], i) => {
      this.placePlant(tx, ty, i % 3);
    });
  }

  placeHouse(tx, ty) {
    const { x, y } = this.tileCenter(tx + 1, ty + 1);
    if (this.textures.exists("obj-house")) {
      this.add.image(x, y, "obj-house")
        .setDisplaySize(TILE * 3.2, TILE * 2.4)
        .setDepth(7);
    }
    for (let dy = 0; dy < 3; dy += 1) {
      for (let dx = 0; dx < 3; dx += 1) {
        this.block(tx + dx, ty + dy);
      }
    }
  }

  placeChest(tx, ty) {
    if (!this.textures.exists("obj-chest")) return;
    const { x, y } = this.tileCenter(tx, ty);
    this.chest = this.add.image(x, y, "obj-chest", 0)
      .setDisplaySize(40, 40)
      .setDepth(8);
  }

  placeBridge(tx, ty) {
    const { x, y } = this.tileCenter(tx, ty);
    if (this.textures.exists("obj-bridge")) {
      this.add.image(x, y, "obj-bridge")
        .setDisplaySize(TILE * 2, TILE)
        .setDepth(4)
        .setAlpha(0.95);
    }
    this.blockedTiles.delete(`${tx},${ty}`);
    this.blockedTiles.delete(`${tx},${ty + 1}`);
    this.paintPathCell(tx, ty);
    this.paintPathCell(tx, ty + 1);
  }

  placeZoneSigns() {
    const signs = [
      { tx: 6, ty: 8, label: "꽃밭" },
      { tx: 22, ty: 10, label: "연못" },
      { tx: 9, ty: 14, label: "마을" },
      { tx: 21, ty: 15, label: "울타리" }
    ];
    signs.forEach(({ tx, ty, label }) => {
      const { x, y } = this.tileCenter(tx, ty);
      this.add.text(x, y, label, {
        fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
        fontSize: "11px",
        color: "#fff8e7",
        backgroundColor: "#6b4226aa",
        padding: { x: 5, y: 2 }
      }).setOrigin(0.5).setDepth(9);
    });
  }

  // ─── 플레이어 ───────────────────────────────────────────

  createPlayer() {
    const startX = this.returnPos?.x ?? 15 * TILE;
    const startY = this.returnPos?.y ?? 12 * TILE;

    if (!this.textures.exists("player")) {
      throw new Error("플레이어 스프라이트를 찾지 못했어요. BootScene 에셋 경로를 확인하세요.");
    }

    this.player = this.physics.add.sprite(startX, startY, "player", 0);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(20);
    this.player.setScale(1.15);
    this.player.body.setSize(16, 12);
    this.player.body.setOffset(16, 28);

    this.cameras.main.startFollow(this.player, true, 0.14, 0.14);
    this.cameras.main.setZoom(1);
    this.lastDir = "down";
    if (this.anims.exists("idle-down")) {
      this.player.anims.play("idle-down");
    }
  }

  // ─── 동물 조우 ───────────────────────────────────────────

  createEncounters() {
    spawnPoints.forEach((spawn) => {
      const animal = animalById[spawn.animalId];
      if (!animal) return;

      // 스폰 칸은 반드시 걸을 수 있게
      this.blockedTiles.delete(`${spawn.tileX},${spawn.tileY}`);

      const collected = isCollected(animal.id);
      const { x, y } = this.tileCenter(spawn.tileX, spawn.tileY);

      this.add.circle(x, y + 10, 18, collected ? 0x88aa66 : 0xe8a838, 0.35).setDepth(8);

      if (!collected) {
        const ring = this.add.circle(x, y, 14, 0xe8a838, 0)
          .setStrokeStyle(2, 0xe8a838)
          .setDepth(8);
        this.tweens.add({
          targets: ring,
          scale: 1.6,
          alpha: 0,
          duration: 1400,
          repeat: -1,
          ease: "Sine.easeOut",
          onRepeat: () => {
            ring.setScale(1);
            ring.setAlpha(1);
          }
        });
      }

      this.add.circle(x, y, 11, collected ? 0x88aa66 : 0xfff8e7, 0.95)
        .setStrokeStyle(2, collected ? 0x3d5c34 : 0x6b4226)
        .setDepth(10);

      this.add.text(x, y, collected ? "✓" : "?", {
        fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
        fontSize: "12px",
        color: collected ? "#2d4a28" : "#6b4226",
        fontStyle: "bold"
      }).setOrigin(0.5).setDepth(11);

      this.add.text(x, y - 26, collected ? animal.name : `${spawn.zone}`, {
        fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
        fontSize: "11px",
        color: "#2d1b0e",
        backgroundColor: "#fff8e7dd",
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5).setDepth(11);

      if (!collected && spawn.tip) {
        this.add.text(x, y + 28, spawn.tip, {
          fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
          fontSize: "10px",
          color: "#5d4a38",
          backgroundColor: "#fff8e7aa",
          padding: { x: 3, y: 1 }
        }).setOrigin(0.5).setDepth(11);
      }

      const zone = this.add.zone(x, y, 44, 44);
      this.physics.add.existing(zone, true);
      zone.setData("animalId", animal.id);
      zone.setData("collected", collected);

      this.physics.add.overlap(this.player, zone, (_player, hitZone) => {
        this.tryEncounter(hitZone);
      });
    });
  }

  tryEncounter(zone) {
    if (this.encounterLocked) return;
    if (zone.getData("collected")) return;

    const animalId = zone.getData("animalId");
    this.encounterLocked = true;
    this.player.setVelocity(0, 0);

    this.scene.start("QuizBattleScene", {
      animalId,
      returnPos: { x: this.player.x, y: this.player.y }
    });
  }

  // ─── HUD / 입력 ───────────────────────────────────────────

  createHud() {
    this.hudText = this.add.text(12, 10, "", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "13px",
      color: "#fff8e7",
      backgroundColor: "#2d1b0ecc",
      padding: { x: 8, y: 6 }
    }).setScrollFactor(0).setDepth(500);

    this.refreshHud();

    createTextButton(
      this,
      this.scale.width - 56,
      28,
      "도감",
      () => {
        this.scene.start("DexScene", {
          from: "OverworldScene",
          returnPos: { x: this.player.x, y: this.player.y }
        });
      },
      { width: 72, height: 32, fontSize: "14px" }
    );
  }

  refreshHud() {
    const status = checkAroundClear();
    this.hudText.setText(
      `우리 주변 수집 ${status.count} / ${status.target}\n방향키·WASD · 표지판 구역의 동물을 찾아보세요`
    );
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.pad = createVirtualPad(this);
  }

  update() {
    if (!this.player || this.encounterLocked) return;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx -= 1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx += 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy -= 1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy += 1;

    const pad = this.pad?.getVector?.() || { x: 0, y: 0 };
    vx += pad.x;
    vy += pad.y;

    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy) || 1;
      vx = (vx / len) * PLAYER_SPEED;
      vy = (vy / len) * PLAYER_SPEED;
    }

    const footY = this.player.y + 10;
    const nextX = this.player.x + vx * (1 / 60);
    const nextY = this.player.y + vy * (1 / 60);
    if (this.isBlocked(nextX, footY)) vx = 0;
    if (this.isBlocked(this.player.x, nextY + 10)) vy = 0;

    this.player.setVelocity(vx, vy);

    if (vx === 0 && vy === 0) {
      if (this.anims.exists(`idle-${this.lastDir}`)) {
        this.player.anims.play(`idle-${this.lastDir}`, true);
      }
      return;
    }

    if (Math.abs(vx) > Math.abs(vy)) {
      this.lastDir = vx < 0 ? "left" : "right";
    } else {
      this.lastDir = vy < 0 ? "up" : "down";
    }
    if (this.anims.exists(`walk-${this.lastDir}`)) {
      this.player.anims.play(`walk-${this.lastDir}`, true);
    }
  }

  maybeCelebrateClear() {
    const status = checkAroundClear();
    if (!status.shouldCelebrate) return;

    markRegionCleared("around");
    this.encounterLocked = true;
    this.player.setVelocity(0, 0);

    const dialog = createDialogPanel(this, {
      text: "우리 주변 지역 클리어!\n꽃밭·연못·마을·울타리의 동물을 모두 도감에 등록했어요!",
      width: 540,
      height: 100
    });

    if (this.chest) {
      this.tweens.add({
        targets: this.chest,
        scale: 1.4,
        duration: 400,
        yoyo: true,
        repeat: 3
      });
    }

    this.time.delayedCall(3000, () => {
      dialog.destroy();
      this.encounterLocked = false;
      this.refreshHud();
    });
  }
}
