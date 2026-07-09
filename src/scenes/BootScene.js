// 에셋 로드 → 타이틀로 이동
// Sprout Lands 타일·오브젝트를 16px/48px 프레임으로 잘라 씁니다.
import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.text(w / 2, h / 2 - 20, "동물도감 탐험대 준비 중...", {
      fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
      fontSize: "20px",
      color: "#fff8e7"
    }).setOrigin(0.5);

    const bar = this.add.rectangle(w / 2 - 118, h / 2 + 24, 4, 12, 0xf0d9a0).setOrigin(0, 0.5);
    this.add.rectangle(w / 2, h / 2 + 24, 240, 16, 0x2d1b0e, 0.4);
    this.load.on("progress", (value) => {
      bar.width = Math.max(4, 236 * value);
    });

    const base = "assets/sprout-lands";

    // 타일셋 (16×16)
    this.load.spritesheet("tiles-grass", `${base}/sprites/Tilesets/Grass.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("tiles-water", `${base}/sprites/Tilesets/Water.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("tiles-hills", `${base}/sprites/Tilesets/Hills.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("tiles-fence", `${base}/sprites/Tilesets/Fences.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("tiles-path", `${base}/sprites/Objects/Paths.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("tiles-dirt", `${base}/sprites/Tilesets/Tilled Dirt.png`, {
      frameWidth: 16,
      frameHeight: 16
    });

    // 장식 오브젝트
    this.load.spritesheet("obj-plants", `${base}/sprites/Objects/Basic Plants.png`, {
      frameWidth: 16,
      frameHeight: 32
    });
    this.load.spritesheet("obj-biom", `${base}/sprites/Objects/Basic Grass Biom things 1.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("obj-chest", `${base}/sprites/Objects/Chest.png`, {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.image("obj-house", `${base}/sprites/Tilesets/Wooden House.png`);
    this.load.image("obj-bridge", `${base}/sprites/Objects/Wood Bridge.png`);

    // UI
    this.load.image("ui-play", `${base}/ui/Sprite sheets/UI Big Play Button.png`);
    this.load.image("ui-dialog", `${base}/ui/Sprite sheets/Dialouge UI/dialog box.png`);
    this.load.image("ui-dialog-big", `${base}/ui/Sprite sheets/Dialouge UI/dialog box big.png`);
    this.load.image("ui-icons", `${base}/ui/Sprite sheets/Icons/All Icons.png`);

    // 플레이어 (48×48, 4×4)
    this.load.spritesheet(
      "player",
      `${base}/sprites/Characters/Basic Charakter Spritesheet.png`,
      { frameWidth: 48, frameHeight: 48 }
    );
  }

  create() {
    // 걷기: 각 방향 행의 1~3열 (0열은 idle)
    if (!this.anims.exists("walk-down")) {
      this.anims.create({
        key: "walk-down",
        frames: this.anims.generateFrameNumbers("player", { frames: [1, 2, 3, 2] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: "walk-up",
        frames: this.anims.generateFrameNumbers("player", { frames: [5, 6, 7, 6] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: "walk-left",
        frames: this.anims.generateFrameNumbers("player", { frames: [9, 10, 11, 10] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: "walk-right",
        frames: this.anims.generateFrameNumbers("player", { frames: [13, 14, 15, 14] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: "idle-down",
        frames: [{ key: "player", frame: 0 }],
        frameRate: 1
      });
      this.anims.create({
        key: "idle-up",
        frames: [{ key: "player", frame: 4 }],
        frameRate: 1
      });
      this.anims.create({
        key: "idle-left",
        frames: [{ key: "player", frame: 8 }],
        frameRate: 1
      });
      this.anims.create({
        key: "idle-right",
        frames: [{ key: "player", frame: 12 }],
        frameRate: 1
      });
    }

    // 물 타일 살짝 깜빡이는 연출용
    if (!this.anims.exists("water-shine") && this.textures.exists("tiles-water")) {
      const waterCount = this.textures.get("tiles-water").frameTotal;
      if (waterCount > 1) {
        this.anims.create({
          key: "water-shine",
          frames: this.anims.generateFrameNumbers("tiles-water", {
            start: 0,
            end: Math.min(3, waterCount - 1)
          }),
          frameRate: 4,
          repeat: -1
        });
      }
    }

    this.scene.start("TitleScene");
  }
}
