import * as Phaser from "phaser";
import { PAL, makeCanvas } from "@/modules/shared/game/utils/pixelArt";

/** Every storybook illustration is INTRO_W x INTRO_H logical pixels, shaded pixel-art picture painted once (frames = 1). */
export const INTRO_W = 320;
export const INTRO_H = 192;

export type IntroPainter = (ctx: CanvasRenderingContext2D, frame: number) => void;
interface IntroIllustration {
  frames: number;
  paint: IntroPainter;
  sparkle: string; // particle colour
}

const registry = new Map<string, IntroIllustration>();

/** Stage files call this once (idempotent) with their painter; `introIllustration(id)` is then valid. */
export function registerIntroIllustration(id: string, paint: IntroPainter, frames = 1, sparkle: string = PAL.l) {
  registry.set(id, { paint, frames, sparkle });
}

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
