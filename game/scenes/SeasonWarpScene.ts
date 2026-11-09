import * as Phaser from "phaser";
import { MYSTERIES_DATA, SEASONS } from "@/data/mysteries";
import { DEFAULT_CHARACTER } from "@/types/game";
import { loadGame } from "@/utils/saveManager";
import { Player } from "../entities/Player";
import { registerAnnunciationTextures } from "../utils/npcTextureGenerator";
import { registerLightTextures } from "../utils/lightTextureGenerator";

const CX = 160;
const CY = 100;
const DURATION = 3600;
const STREAKS = 56;

interface Streak { x: number; y: number; speed: number; color: number }

/**
 * Between two groups of five mysteries: the Holy Spirit (a dove) grabs the player and flies them
 * through a tunnel of light, a time jump. Pixel streaks + square "time gates" drawn with integer rects only.
 */
export class SeasonWarpScene extends Phaser.Scene {
  private toKey = "";
  private t = 0;
  private leaving = false;
  private g!: Phaser.GameObjects.Graphics;
  private streaks: Streak[] = [];
  private gates: number[] = [];
  private nextGate = 0;
  private color = 0xffffff;
  private rider!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "SeasonWarpScene" });
  }

  init(data: { toKey?: string }) {
    this.toKey = data.toKey ?? "";
  }

  create() {
    this.t = 0;
    this.leaving = false;
    this.gates = [];
    this.nextGate = 400;
    registerAnnunciationTextures(this);
    registerLightTextures(this);

    const info = MYSTERIES_DATA.find((m) => m.key === this.toKey);
    this.color = Phaser.Display.Color.HexStringToColor(info ? SEASONS[info.season].color : "#fde68a").color;

    this.add.rectangle(-200, -200, 720, 580, 0x050816).setOrigin(0);
    this.g = this.add.graphics();
    const palette = [0xf8fafc, 0xbae6fd, 0xfef08a, this.color];
    this.streaks = Array.from({ length: STREAKS }, (_, i) => ({
      x: Phaser.Math.Between(-80, 400),
      y: Phaser.Math.Between(-30, 230),
      speed: Phaser.Math.Between(60, 140),
      color: palette[i % palette.length],
    }));

    // dove with the player dangling underneath
    const custom = loadGame()?.player?.customization ?? DEFAULT_CHARACTER;
    const key = Player.ensureTexture(this, custom);
    if (!this.anims.exists("dove_big_flap"))
      this.anims.create({ key: "dove_big_flap", frames: this.anims.generateFrameNumbers("dove_big", { frames: [0, 1] }), frameRate: 8, repeat: -1 });
    const dove = this.add.sprite(0, -22, "dove_big").play("dove_big_flap");
    const kid = this.add.sprite(-2, 6, key, 8);
    const glow = this.add.image(0, -4, "glow_gold").setAlpha(0.7);
    this.rider = this.add.container(CX - 60, CY, [glow, kid, dove]).setDepth(10);
    this.tweens.add({ targets: this.rider, x: CX, duration: 700, ease: "Stepped", easeParams: [6] });
    this.tweens.add({ targets: this.rider, y: CY - 3, duration: 380, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });

    const cam = this.cameras.main;
    const apply = () => {
      const { width, height } = this.scale.gameSize;
      cam.setZoom(Math.max(2, Math.min(Math.floor(width / 300), Math.floor(height / 190)) || 2));
      cam.centerOn(CX, CY);
    };
    apply();
    this.scale.on("resize", apply);
    this.events.once("shutdown", () => this.scale.off("resize", apply));
    cam.fadeIn(300, 255, 255, 255);

    this.input.on("pointerdown", () => this.t > 900 && this.leave());
    this.input.keyboard?.on("keydown-SPACE", () => this.t > 900 && this.leave());
  }

  update(_: number, delta: number) {
    this.t += delta;
    const k = Math.min(1, this.t / DURATION);
    const boost = 1 + k * k * 14; // everything accelerates
    const g = this.g.clear();

    for (const s of this.streaks) {
      s.x -= (s.speed * boost * delta) / 1000;
      const len = Math.round(3 + s.speed * boost * 0.05);
      if (s.x + len < -90) {
        s.x = 410;
        s.y = Phaser.Math.Between(-30, 230);
      }
      g.fillStyle(s.color, 0.85).fillRect(Math.round(s.x), Math.round(s.y), len, 1);
    }

    // square time gates rushing past the camera
    while (this.t > this.nextGate && this.t < DURATION - 500) {
      this.gates.push(this.t);
      this.nextGate += 360 - k * 160;
    }
    this.gates = this.gates.filter((born) => this.t - born < 1100);
    for (const born of this.gates) {
      const age = (this.t - born) / 1100;
      const half = Math.round(6 + age * age * 240) & ~1;
      g.lineStyle(2, this.color, 1 - age).strokeRect(CX - half * 1.6, CY - half, half * 3.2, half * 2);
    }

    this.rider.y = Math.round(this.rider.y);
    if (this.t >= DURATION) this.leave();
  }

  private leave() {
    if (this.leaving) return;
    this.leaving = true;
    const cam = this.cameras.main;
    cam.flash(500, 255, 255, 255);
    cam.fadeOut(450, 255, 255, 255);
    cam.once("camerafadeoutcomplete", () => this.scene.start("StageTransitionScene", { toKey: this.toKey, warped: true }));
  }
}
