// Phaser 게임 부트 — 수집형 턴제 RPG 수직 슬라이스
import Phaser from "phaser/dist/phaser-arcade-physics.min.js";
import BootScene from "./scenes/BootScene.js";
import TitleScene from "./scenes/TitleScene.js";
import WorldMapScene from "./scenes/WorldMapScene.js";
import OverworldScene from "./scenes/OverworldScene.js";
import QuizBattleScene from "./scenes/QuizBattleScene.js";
import DexScene from "./scenes/DexScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 640,
  height: 360,
  backgroundColor: "#5a9e3f",
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, WorldMapScene, OverworldScene, QuizBattleScene, DexScene]
};

// 디버그·스모크 테스트에서 씬 전환을 확인하기 위해 전역에 보관
const game = new Phaser.Game(config);
window.__ANIMAL_GAME__ = game;
