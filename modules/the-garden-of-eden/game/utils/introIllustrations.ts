import * as Phaser from "phaser";
import { PAL, drawMap, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Every storybook illustration is INTRO_W x INTRO_H logical pixels, N animation frames (2-4), integer rects only. */
export const INTRO_W = 160;
export const INTRO_H = 96;

export type IntroPainter = (ctx: CanvasRenderingContext2D, frame: number) => void;
interface IntroIllustration {
  frames: number;
  paint: IntroPainter;
  sparkle: string; // particle colour
}

const registry = new Map<string, IntroIllustration>();

/** Stage files call this once (idempotent) with their painter; `introIllustration(id)` is then valid. */
export function registerIntroIllustration(id: string, paint: IntroPainter, frames = 2, sparkle: string = PAL.l) {
  registry.set(id, { paint, frames, sparkle });
}

export const DOVE = [
  "..W.......W..", ".WwW.....WwW.", ".WwwWwwwWwwW.", "..WwwwwwwwwW.", "....wwwwwwwwy", ".....wwwwww..",
];

// Default art: starry vault over dark waters with the dove — also the fallback for stages without art yet.
registerIntroIllustration(
  "default",
  (c, f) => {
    const bands = [PAL.K, PAL.K, PAL.L, PAL.L, PAL.Z, PAL.Z];
    bands.forEach((col, i) => rect(c, 0, i * 8, INTRO_W, 8, col));
    for (const [x, y] of [[12, 6], [40, 22], [76, 10], [120, 18], [144, 8], [100, 34], [28, 40]]) {
      rect(c, x, y, 1, 1, PAL.w);
      if ((x + f) % 2 === 0) rect(c, x - 1, y, 3, 1, PAL.W); // twinkle
    }
    rect(c, 0, 52, INTRO_W, 44, PAL.n);
    for (let i = 0; i < 10; i++) rect(c, (i * 18 + f * 6) % 150, 60 + (i % 4) * 8, 10, 1, PAL.b); // water glints
    rect(c, 70, 0, 20, 56, PAL.Y); rect(c, 74, 0, 12, 56, PAL.y); rect(c, 78, 0, 4, 56, PAL.l); // light shaft
    drawMap(c, DOVE.map((r) => r.padEnd(13, ".")), 74, 30 + f * 2);
  },
  2,
);

// Prologue: child's hands open the first page of Genesis; a galaxy and the dove rise from it.
registerIntroIllustration(
  "prologue",
  (c, f) => {
    rect(c, 0, 0, INTRO_W, 64, PAL.p); rect(c, 0, 56, INTRO_W, 8, PAL.P); // morning wall
    // sunny window, left
    rect(c, 6, 6, 32, 38, PAL.o); rect(c, 9, 9, 26, 32, PAL.k); rect(c, 20, 9, 3, 32, PAL.o); rect(c, 9, 23, 26, 3, PAL.o);
    rect(c, 26, 12, 6, 6, PAL.y); rect(c, 27, 13, 4, 4, PAL.l);
    // table
    rect(c, 0, 64, INTRO_W, 32, PAL.o); rect(c, 0, 64, INTRO_W, 2, PAL.u);
    for (let y = 72; y < 96; y += 8) rect(c, 0, y, INTRO_W, 1, PAL.O);
    // galaxy column widening upward (stepped)
    const tone = [PAL.L, PAL.Z, PAL.v, PAL.n];
    for (let y = 0; y < 56; y += 2) {
      const w = 22 + Math.floor((56 - y) * 0.9);
      rect(c, 80 - Math.floor(w / 2), y, w, 2, tone[(Math.floor(y / 2) + f) % 4]);
    }
    for (const [x, y] of [[58, 6], [66, 20], [96, 14], [104, 30], [112, 8], [74, 40], [90, 46], [52, 34]]) {
      rect(c, x, y, 2, 2, PAL.w);
      if ((x + f) % 2) rect(c, x - 1, y, 4, 1, PAL.l);
    }
    rect(c, 76, 40, 8, 16, PAL.y); rect(c, 78, 40, 4, 16, PAL.l); // light from the page
    // dove
    drawMap(c, DOVE.map((r) => r.padEnd(13, ".")), 74, 6 + f * 2);
    rect(c, 71, 4 + f * 2, 19, 1, PAL.l); // halo
    // open book
    rect(c, 40, 54, 80, 22, PAL.R); rect(c, 42, 52, 76, 22, PAL.y);
    rect(c, 44, 54, 34, 18, PAL.p); rect(c, 82, 54, 34, 18, PAL.p); rect(c, 78, 54, 4, 18, PAL.P);
    rect(c, 44, 70, 34, 2, PAL.P); rect(c, 82, 70, 34, 2, PAL.P);
    for (let y = 58; y < 68; y += 3) rect(c, 48, y, 26, 1, PAL.P);
    for (let i = 0; i < 7; i++) rect(c, 88 + i * 3, 57, 2, 3, PAL.Y); // "GENESIS"
    rect(c, 88, 63, 22, 1, PAL.P); rect(c, 88, 66, 18, 1, PAL.P);
    rect(c, 100, 52 + f, 14, 2, PAL.w); // fluttering page edge
    // hands + sleeves
    rect(c, 22, 66, 14, 8, PAL.b); rect(c, 34, 62, 10, 10, PAL.s); rect(c, 40, 60, 5, 3, PAL.s); rect(c, 34, 70, 10, 2, PAL.S);
    rect(c, 124, 66, 14, 8, PAL.b); rect(c, 116, 62, 10, 10, PAL.s); rect(c, 115, 60, 5, 3, PAL.s); rect(c, 116, 70, 10, 2, PAL.S);
  },
  2,
  PAL.l,
);

export function introIllustration(id: string) {
  return registry.get(id) ?? registry.get("default")!;
}

/** Idempotent: builds the sheet + looping animation; returns the texture key. */
export function ensureIntroTexture(scene: Phaser.Scene, id: string) {
  const art = introIllustration(id);
  const key = `intro_${registry.has(id) ? id : "default"}`;
  if (!scene.textures.exists(key)) {
    const { canvas, ctx } = makeCanvas(INTRO_W * art.frames, INTRO_H);
    for (let f = 0; f < art.frames; f++) {
      ctx.save();
      ctx.translate(f * INTRO_W, 0);
      ctx.beginPath();
      ctx.rect(0, 0, INTRO_W, INTRO_H);
      ctx.clip();
      art.paint(ctx, f);
      ctx.restore();
    }
    scene.textures.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: INTRO_W, frameHeight: INTRO_H });
  }
  if (!scene.anims.exists(key)) {
    scene.anims.create({ key, frames: scene.anims.generateFrameNumbers(key, { start: 0, end: art.frames - 1 }), frameRate: 2, repeat: -1 });
  }
  return { key, sparkle: art.sparkle };
}
