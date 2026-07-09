// Phaser UI 헬퍼 — 다이얼로그·버튼·텍스트 패널
import Phaser from "phaser";

/**
 * 화면 하단에 대화창 스타일 패널을 그립니다.
 * @returns {{ panel: Phaser.GameObjects.Container, setText: Function, destroy: Function }}
 */
export function createDialogPanel(scene, {
  text = "",
  width = 560,
  height = 110,
  y
} = {}) {
  const cam = scene.cameras.main;
  const panelY = y ?? cam.height - height / 2 - 16;
  const container = scene.add.container(cam.width / 2, panelY).setDepth(1000).setScrollFactor(0);

  const bg = scene.add.rectangle(0, 0, width, height, 0xfff8e7, 0.96)
    .setStrokeStyle(3, 0x6b4226);
  const label = scene.add.text(0, 0, text, {
    fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
    fontSize: "16px",
    color: "#2d1b0e",
    align: "center",
    wordWrap: { width: width - 32 }
  }).setOrigin(0.5);

  container.add([bg, label]);

  return {
    panel: container,
    setText(next) {
      label.setText(next);
    },
    destroy() {
      container.destroy(true);
    }
  };
}

/**
 * 클릭 가능한 텍스트 버튼을 만듭니다.
 */
export function createTextButton(scene, x, y, label, onClick, {
  width = 180,
  height = 44,
  fontSize = "18px",
  fill = 0xf0d9a0,
  stroke = 0x6b4226
} = {}) {
  const container = scene.add.container(x, y).setDepth(1001).setScrollFactor(0);
  const bg = scene.add.rectangle(0, 0, width, height, fill)
    .setStrokeStyle(3, stroke)
    .setInteractive({ useHandCursor: true });
  const text = scene.add.text(0, 0, label, {
    fontFamily: "Malgun Gothic, Apple SD Gothic Neo, sans-serif",
    fontSize,
    color: "#2d1b0e",
    fontStyle: "bold"
  }).setOrigin(0.5);

  bg.on("pointerover", () => bg.setFillStyle(0xffe8b8));
  bg.on("pointerout", () => bg.setFillStyle(fill));
  bg.on("pointerdown", () => {
    if (typeof onClick === "function") onClick();
  });

  container.add([bg, text]);
  return container;
}

/**
 * 모바일용 가상 방향 패드 (왼쪽 하단)
 * @returns {{ getVector: () => {x:number,y:number}, destroy: Function }}
 */
export function createVirtualPad(scene) {
  const cam = scene.cameras.main;
  const baseX = 90;
  const baseY = cam.height - 90;
  const keys = { up: false, down: false, left: false, right: false };

  const root = scene.add.container(baseX, baseY).setDepth(2000).setScrollFactor(0).setAlpha(0.85);

  const makeDir = (dx, dy, label, ox, oy) => {
    const btn = scene.add.circle(ox, oy, 22, 0x3d5c34, 0.75)
      .setStrokeStyle(2, 0xfff8e7)
      .setInteractive({ useHandCursor: true });
    const t = scene.add.text(ox, oy, label, {
      fontSize: "14px",
      color: "#fff8e7"
    }).setOrigin(0.5);
    const press = (v) => {
      if (dx < 0) keys.left = v;
      if (dx > 0) keys.right = v;
      if (dy < 0) keys.up = v;
      if (dy > 0) keys.down = v;
    };
    btn.on("pointerdown", () => press(true));
    btn.on("pointerup", () => press(false));
    btn.on("pointerout", () => press(false));
    root.add([btn, t]);
  };

  makeDir(0, -1, "▲", 0, -40);
  makeDir(0, 1, "▼", 0, 40);
  makeDir(-1, 0, "◀", -40, 0);
  makeDir(1, 0, "▶", 40, 0);

  return {
    getVector() {
      let x = 0;
      let y = 0;
      if (keys.left) x -= 1;
      if (keys.right) x += 1;
      if (keys.up) y -= 1;
      if (keys.down) y += 1;
      return { x, y };
    },
    destroy() {
      root.destroy(true);
    }
  };
}
