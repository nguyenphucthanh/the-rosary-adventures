import * as Phaser from "phaser";
import EventBus from "../EventBus";
import { PAL, PixelMap, makeCanvas, rect, drawMap } from "../utils/pixelArt";
import { registerAnnunciationTextures } from "../utils/npcTextureGenerator";
import { loadGame } from "@/utils/saveManager";
import { resumeMysteryKey } from "@/data/stages";

/**
 * Entrance screen. Drawn in a 320x180 virtual canvas centred on (CX, CY);
 * the camera zoom is an integer so every pixel stays square.
 */
const CX = 160;
const CY = 100;
const RING_Y = 108;
const RING_R = 36;
const BEADS = 20; // one per mystery
const HORIZON = 126;

const MOON: PixelMap = [
  "..lllll..",
  ".lllllll.",
  "lllllllll",
  "lllllllyy",
  "llllllyyy",
  "lllllllyy",
  "lllllllll",
  ".lllllll.",
  "..lllll..",
];

const CROSS: PixelMap = [
  "...y...",
  "...y...",
  "yyyyyyy",
  "...y...",
  "...y...",
  "...y...",
  "...y...",
  "...Y...",
  "...Y...",
];

function hills(): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas(640, 80);
  // far ridge
  for (let x = 0; x < 640; x += 2) {
    const top = 14 + Math.round(6 * Math.sin(x / 41) + 3 * Math.sin(x / 15));
    rect(ctx, x, top, 2, 80 - top, "#2b2a63");
  }
  // near meadow
  for (let x = 0; x < 640; x += 2) {
    const top = 26 + Math.round(2 * Math.sin(x / 33) + Math.sin(x / 9));
    rect(ctx, x, top, 2, 80 - top, "#14301f");
    rect(ctx, x, top, 2, 1, "#1f4d2e"); // lit rim
  }
  return canvas;
}

function bead(lit: boolean): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas(3, 3);
  rect(ctx, 0, 0, 3, 3, lit ? PAL.l : PAL.y);
  rect(ctx, 0, 2, 3, 1, PAL.Y);
  rect(ctx, 0, 0, 1, 1, PAL.w);
  return canvas;
}

export class TitleScene extends Phaser.Scene {
  private starting = false;

  constructor() {
    super({ key: "TitleScene" });
  }

  create() {
    this.starting = false;
    registerAnnunciationTextures(this);
    if (!this.textures.exists("title_hills")) this.textures.addCanvas("title_hills", hills());
    if (!this.textures.exists("title_bead")) this.textures.addCanvas("title_bead", bead(false));
    if (!this.textures.exists("title_moon")) {
      const { canvas, ctx } = makeCanvas(9, 9);
      drawMap(ctx, MOON);
      this.textures.addCanvas("title_moon", canvas);
    }
    if (!this.textures.exists("title_cross")) {
      const { canvas, ctx } = makeCanvas(7, 9);
      drawMap(ctx, CROSS);
      this.textures.addCanvas("title_cross", canvas);
    }
    if (!this.anims.exists("gabriel_flap")) {
      this.anims.create({
        key: "gabriel_flap",
        frames: this.anims.generateFrameNumbers("archangel_gabriel", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1,
      });
    }

    this.buildSky();
    this.buildGround();
    this.buildRing();
    this.buildFigures();
    this.buildTexts();
    this.setupCamera();
    this.setupInput();

    this.cameras.main.fadeIn(600, 0, 0, 0);
    EventBus.emit("scene-ready", { sceneKey: "TitleScene" });
  }

  private buildSky() {
    // stepped bands, flat colours only
    const bands: [number, number, number][] = [
      [-400, 40, 0x0b1030],
      [40, 70, 0x151a4a],
      [70, 95, 0x25276a],
      [95, 110, 0x43357f],
      [110, 120, 0x6d4690],
      [120, HORIZON + 2, 0xb3607f],
    ];
    for (const [y0, y1, color] of bands) {
      this.add.rectangle(-600, y0, 1520, y1 - y0, color).setOrigin(0).setDepth(0);
    }

    // stars: 1px dots + a few twinkling sparkles
    for (let i = 0; i < 70; i++) {
      const x = Phaser.Math.Between(-100, 420);
      const y = Phaser.Math.Between(-80, 105);
      const c = Math.random() < 0.3 ? 0xfef08a : 0xf8fafc;
      this.add.rectangle(x, y, 1, 1, c, Math.random() < 0.5 ? 0.9 : 0.5).setOrigin(0).setDepth(1);
    }
    for (let i = 0; i < 9; i++) {
      const sp = this.add
        .image(Phaser.Math.Between(40, 280), Phaser.Math.Between(4, 90), "sparkle")
        .setDepth(2);
      this.tweens.add({
        targets: sp,
        alpha: 0,
        duration: 700 + i * 90,
        yoyo: true,
        repeat: -1,
        delay: i * 230,
      });
    }

    this.add.image(CX + 78, 52, "title_moon").setDepth(2);
    this.add.image(CX + 78, 52, "glow_small").setDepth(1).setAlpha(0.8);
  }

  private buildGround() {
    this.add.image(CX - 320, HORIZON - 26, "title_hills").setOrigin(0).setDepth(3);
    this.add.rectangle(-600, HORIZON + 54, 1520, 700, 0x14301f).setOrigin(0).setDepth(3);
    // a few flowers on the meadow
    for (let i = 0; i < 26; i++) {
      const x = Phaser.Math.Between(50, 270);
      const y = Phaser.Math.Between(HORIZON + 4, HORIZON + 48);
      const c = [0xf8fafc, 0xfef08a, 0xfbcfe8][i % 3];
      this.add.rectangle(x, y, 1, 1, c).setOrigin(0).setDepth(4);
    }
  }

  private buildRing() {
    const beads: Phaser.GameObjects.Image[] = [];
    const place = (x: number, y: number) =>
      this.add.image(Math.round(x), Math.round(y), "title_bead").setDepth(6).setAlpha(0.4);

    for (let i = 0; i < BEADS; i++) {
      const a = (i / BEADS) * Math.PI * 2;
      beads.push(place(CX + Math.sin(a) * RING_R, RING_Y - Math.cos(a) * RING_R));
    }
    // pendant chain + cross
    const tail = [place(CX, RING_Y + RING_R + 4), place(CX, RING_Y + RING_R + 8)];
    this.add.image(CX, RING_Y + RING_R + 13, "title_cross").setDepth(6);
    tail.forEach((b) => b.setAlpha(0.8));

    // chasing light round the ring, in steps (no tween easing)
    let head = 0;
    const tick = () => {
      beads.forEach((b, i) => {
        const behind = (head - i + BEADS) % BEADS;
        b.setAlpha(behind === 0 ? 1 : behind < 4 ? 0.85 : behind < 8 ? 0.6 : 0.4);
      });
      head = (head + 1) % BEADS;
    };
    tick();
    this.time.addEvent({ delay: 140, loop: true, callback: tick });
  }

  private buildFigures() {
    const glow = this.add.image(CX, 90, "glow_gold").setDepth(5).setAlpha(0.6);
    this.tweens.add({ targets: glow, alpha: 0.9, duration: 1400, yoyo: true, repeat: -1 });

    const gabriel = this.add
      .sprite(CX, 106, "archangel_gabriel")
      .setOrigin(0.5, 1)
      .setDepth(7)
      .play("gabriel_flap");
    this.tweens.add({ targets: gabriel, y: 102, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    this.add.image(CX, 134, "mary_praying").setOrigin(0.5, 1).setDepth(7);
  }

  private buildTexts() {
    const style = (size: number, color: string): Phaser.Types.GameObjects.Text.TextStyle => ({
      fontFamily: "'Dearpix', monospace",
      fontSize: `${size}px`,
      color,
      align: "center",
      resolution: 4,
    });
    const shadowed = (x: number, y: number, text: string, size: number, color: string, shade: string) => {
      this.add.text(x + 1, y + 1, text, style(size, shade)).setOrigin(0.5).setDepth(9);
      return this.add.text(x, y, text, style(size, color)).setOrigin(0.5).setDepth(10);
    };

    const t1 = shadowed(CX, 22, "THE ROSARY", 16, "#fde68a", "#78350f");
    const t2 = shadowed(CX, 38, "ADVENTURES", 16, "#fbbf24", "#78350f");
    shadowed(CX, 53, "20 Mầu Nhiệm Mân Côi", 8, "#e0e7ff", "#1e1b4b");

    // title drops in by whole pixels
    [t1, t2].forEach((t, i) => {
      t.y -= 8;
      this.tweens.add({ targets: t, y: t.y + 8, duration: 400, delay: 300 + i * 150, ease: "Stepped" });
    });

    const prompt = this.add
      .text(CX, 176, "CHẠM HOẶC NHẤN SPACE ĐỂ BẮT ĐẦU", style(8, "#fef08a"))
      .setOrigin(0.5)
      .setDepth(10);
    this.time.addEvent({ delay: 600, loop: true, callback: () => prompt.setVisible(!prompt.visible) });
  }

  private setupCamera() {
    const cam = this.cameras.main;
    const apply = () => {
      const { width, height } = this.scale.gameSize;
      // 320x180 target on landscape, ~180 wide on phones; integer zoom only
      cam.setZoom(Math.max(2, Math.min(Math.floor(width / 300), Math.floor(height / 190)) || 2));
      cam.centerOn(CX, CY);
    };
    apply();
    this.scale.on("resize", apply);
    this.events.once("shutdown", () => this.scale.off("resize", apply));
  }

  private setupInput() {
    const go = () => this.start();
    this.input.once("pointerdown", go);
    this.input.keyboard?.once("keydown-SPACE", go);
    this.input.keyboard?.once("keydown-ENTER", go);
    EventBus.on("input-action", go);
    this.events.once("shutdown", () => EventBus.off("input-action", go));
  }

  private start() {
    if (this.starting) return;
    this.starting = true;
    const cam = this.cameras.main;
    cam.fadeOut(400, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => this.scene.start("StageTransitionScene", { toKey: resumeMysteryKey(loadGame()?.currentMysteryKey) }));
  }
}
