// Phaser UI 헬퍼 — Sprout Lands 나무 패널·버튼·하트·이모트
import Phaser from "phaser";

export const KOREAN_FONT = "Malgun Gothic, 'Segoe UI Emoji', Apple SD Gothic Neo, sans-serif";

// ZEP 퀴즈풍 크림 카드 팔레트 (포켓몬 다이얼로그 톤을 유지하면서 선명하게)
export const UI_PALETTE = {
  panelFill: 0xfffdf7,
  panelStroke: 0x46513f,
  accentFill: 0xe9f4dc,
  accentStroke: 0x4d7c50,
  textPrimary: "#39403a",
  textMuted: "#5a6355",
  teal: "#2f7f74",
  amber: "#9c6a14"
};

/**
 * 크림 카드 패널. 둥근 모서리와 얇은 그림자로 텍스트 박스가
 * 물리는 느낌 없이 깔끔하게 보이도록 합니다.
 * Sprout Lands 나무 텍스처가 필요하면 { skin: "wood" } 를 넘기세요.
 */
export function createWoodPanel(scene, x, y, width, height, {
  tint,
  alpha = 1,
  skin = "cream",
  fill = UI_PALETTE.panelFill,
  stroke = UI_PALETTE.panelStroke,
  radius = 10
} = {}) {
  if (skin === "wood" && scene.textures.exists("ui-dialog")) {
    const panel = scene.add.nineslice(x, y, "ui-dialog", 0, width, height, 14, 14, 14, 14);
    if (tint) panel.setTint(tint);
    panel.setAlpha(alpha);
    return panel;
  }

  // Graphics는 tint를 지원하지 않으므로 tint 요청은 fill 색상으로 처리
  if (tint) fill = tint;

  const g = scene.add.graphics();
  // 은은한 그림자 (카드가 배경 위에 떠 있는 느낌)
  g.fillStyle(0x2c3a26, 0.16 * alpha);
  g.fillRoundedRect(x - width / 2, y - height / 2 + 3, width, height, radius);
  g.fillStyle(fill, alpha);
  g.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
  if (stroke) {
    g.lineStyle(1.5, stroke, Math.min(1, alpha + 0.05));
    g.strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius);
  }
  g.size = (w, h) => {
    g.clear();
    g.fillStyle(0x2c3a26, 0.16 * alpha);
    g.fillRoundedRect(-w / 2, -h / 2 + 3, w, h, radius);
    g.fillStyle(fill, alpha);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, radius);
    if (stroke) {
      g.lineStyle(1.5, stroke, Math.min(1, alpha + 0.05));
      g.strokeRoundedRect(-w / 2, -h / 2, w, h, radius);
    }
  };
  g.setAlpha(alpha);
  return g;
}

/** 하위 호환용 별칭 */
export const createPanel = createWoodPanel;

/**
 * 크림 카드 버튼. 터치 친화(눌렀다 떼면 실행, 밖으로 나가면 취소).
 */
export function createWoodButton(scene, x, y, label, onClick, {
  width = 180,
  height = 40,
  fontSize = "15px",
  textColor = UI_PALETTE.textPrimary,
  tint = null,
  depth = 1001
} = {}) {
  const container = scene.add.container(x, y).setDepth(depth).setScrollFactor(0);
  const bg = createWoodPanel(scene, 0, 0, width, height, {
    fill: tint ?? UI_PALETTE.accentFill,
    stroke: UI_PALETTE.accentStroke,
    radius: Math.min(9, height / 2)
  });
  bg.setInteractive({ useHandCursor: true });

  const text = scene.add.text(0, -1, label, {
    fontFamily: KOREAN_FONT,
    fontSize,
    color: textColor,
    fontStyle: "bold",
    align: "center",
    wordWrap: { width: width - 20 }
  }).setOrigin(0.5);

  const setPressed = (value) => {
    if (!container.buttonEnabled) return;
    container.setScale(value ? 0.96 : 1);
    container.setAlpha(value ? 0.85 : 1);
  };

  bg.on("pointerdown", () => setPressed(true));
  bg.on("pointerout", () => setPressed(false));
  // 어린이 태블릿 배려: 누른 채 살짝 움직여도 버튼 위에서 떼면 실행
  bg.on("pointerup", () => {
    setPressed(false);
    if (typeof onClick === "function") onClick();
  });

  container.add([bg, text]);
  container.buttonBg = bg;
  container.buttonText = text;
  container.buttonEnabled = true;
  container.setButtonEnabled = (enabled) => {
    container.buttonEnabled = enabled;
    if (enabled) {
      bg.setInteractive({ useHandCursor: true });
      container.setAlpha(1);
    } else {
      bg.disableInteractive();
      container.setAlpha(0.55);
    }
  };
  return container;
}

/** (구버전 호환) 단색 텍스트 버튼 — 새 코드는 createWoodButton을 쓰세요 */
export const createTextButton = (scene, x, y, label, onClick, opts = {}) =>
  createWoodButton(scene, x, y, label, onClick, opts);

/**
 * 하트 게이지 줄. set(n)으로 남은 하트 수를 반영합니다.
 * Sprout Lands 하트 시트: frame 0 = 가득, 5 = 빈 하트.
 */
export function createHeartRow(scene, x, y, max, {
  size = 26,
  gap = 4,
  tint = null,
  depth = 1002
} = {}) {
  const container = scene.add.container(x, y).setDepth(depth).setScrollFactor(0);
  const hearts = [];
  const hasSheet = scene.textures.exists("ui-hearts");

  for (let i = 0; i < max; i += 1) {
    const hx = i * (size + gap);
    let heart;
    if (hasSheet) {
      heart = scene.add.image(hx, 0, "ui-hearts", 0).setDisplaySize(size, size);
      if (tint) heart.setTint(tint);
    } else {
      heart = scene.add.text(hx, 0, "❤", { fontSize: `${size}px` }).setOrigin(0.5);
    }
    hearts.push(heart);
    container.add(heart);
  }

  let current = max;
  return {
    container,
    get value() {
      return current;
    },
    set(n, { animate = true } = {}) {
      const next = Phaser.Math.Clamp(n, 0, max);
      hearts.forEach((heart, i) => {
        const full = i < next;
        if (hasSheet) heart.setFrame(full ? 0 : 5);
        else heart.setText(full ? "❤" : "🖤");
        if (animate && !full && i === next && current > next) {
          scene.tweens.add({
            targets: heart,
            scale: { from: heart.scale * 1.6, to: heart.scale },
            duration: 260,
            ease: "Back.easeOut"
          });
        }
      });
      current = next;
    },
    destroy() {
      container.destroy(true);
    }
  };
}

/** 이모트 종류 → Teemo 이모트 시트 프레임 */
const EMOTE_FRAMES = {
  surprise: { frames: [10, 11, 12, 13, 14], rate: 12, repeat: 0 },
  happy: { frames: [35, 36], rate: 6, repeat: 2 },
  sad: { frames: [55, 56], rate: 5, repeat: 2 },
  love: { frames: [20, 21], rate: 6, repeat: 2 },
  angry: { frames: [45, 46], rate: 6, repeat: 2 },
  zzz: { frames: [65, 66, 67], rate: 4, repeat: 1 }
};

/** 머리 위 말풍선 이모트 — 잠깐 보여주고 사라집니다 */
export function playEmote(scene, x, y, kind = "surprise", { depth = 900, scale = 1, scrollFactor } = {}) {
  if (!scene.textures.exists("ui-emotes")) return null;
  const spec = EMOTE_FRAMES[kind] || EMOTE_FRAMES.surprise;
  const animKey = `emote-${kind}`;

  if (!scene.anims.exists(animKey)) {
    scene.anims.create({
      key: animKey,
      frames: spec.frames.map((frame) => ({ key: "ui-emotes", frame })),
      frameRate: spec.rate,
      repeat: spec.repeat
    });
  }

  const emote = scene.add.sprite(x, y, "ui-emotes", spec.frames[0])
    .setDepth(depth)
    .setScale(scale);
  if (scrollFactor !== undefined) emote.setScrollFactor(scrollFactor);

  emote.play(animKey);
  emote.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    scene.tweens.add({
      targets: emote,
      alpha: 0,
      y: emote.y - 6,
      duration: 180,
      onComplete: () => emote.destroy()
    });
  });
  return emote;
}

/**
 * 화면 하단 내레이션 대화창 (Sprout Lands premade 다이얼로그).
 */
export function createDialogPanel(scene, {
  text = "",
  width = 560,
  height = 110,
  y,
  depth = 1000
} = {}) {
  const cam = scene.cameras.main;
  const panelY = y ?? cam.height - height / 2 - 12;
  const container = scene.add.container(cam.width / 2, panelY).setDepth(depth).setScrollFactor(0);

  const bg = createWoodPanel(scene, 0, 0, width, height);
  const label = scene.add.text(0, 0, text, {
    fontFamily: KOREAN_FONT,
    fontSize: "15px",
    color: "#3d2410",
    align: "center",
    lineSpacing: 4,
    wordWrap: { width: width - 40 }
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
 * 모바일용 가상 방향 패드 (왼쪽 하단)
 */
export function createVirtualPad(scene) {
  const cam = scene.cameras.main;
  const baseX = 84;
  const baseY = cam.height - 84;
  const keys = { up: false, down: false, left: false, right: false };

  const root = scene.add.container(baseX, baseY).setDepth(2000).setScrollFactor(0).setAlpha(0.82);

  const makeDir = (dx, dy, label, ox, oy) => {
    const btn = scene.add.circle(ox, oy, 21, 0x3d2410, 0.72)
      .setStrokeStyle(2, 0xf0d9a0)
      .setInteractive({ useHandCursor: true });
    const t = scene.add.text(ox, oy, label, {
      fontSize: "13px",
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

  makeDir(0, -1, "▲", 0, -38);
  makeDir(0, 1, "▼", 0, 38);
  makeDir(-1, 0, "◀", -38, 0);
  makeDir(1, 0, "▶", 38, 0);

  return {
    getVector() {
      // 안전장치: 눌린 포인터가 하나도 없으면 고착된 패드 상태를 해제
      const anyPointerDown = scene.input.manager.pointers.some((p) => p.isDown);
      if (!anyPointerDown && (keys.left || keys.right || keys.up || keys.down)) {
        keys.left = keys.right = keys.up = keys.down = false;
      }
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
