import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Stage 7: water wall tile, foam edges (top/bottom), east-wind swirl (2 frames), coral, seaweed, fish, shell. Integer rects only. */
export function registerSeaTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("sea_wall")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };
  const sheet = (key: string, w: number, h: number, paints: ((c: CanvasRenderingContext2D, ox: number) => void)[]) => {
    const { canvas, ctx } = makeCanvas(w * paints.length, h);
    paints.forEach((p, i) => p(ctx, i * w));
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };

  // Water wall tile (16x16): deep blue with lighter ripple bands, tiles seamlessly
  still("sea_wall", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.X);
    rect(c, 0, 5, 16, 1, PAL.x); rect(c, 0, 13, 16, 1, PAL.x);
    rect(c, 2, 2, 5, 1, PAL.x); rect(c, 10, 9, 4, 1, PAL.x);
    rect(c, 4, 6, 2, 1, PAL.k); rect(c, 11, 14, 2, 1, PAL.k); rect(c, 13, 2, 1, 1, PAL.k);
  });

  // Foam edge (16x8), facing the sea floor: b = wall above (foam at the bottom), t = wall below (foam at the top)
  const foam = (flip: boolean) => (c: CanvasRenderingContext2D) => {
    const y = (v: number) => (flip ? 7 - v : v);
    const r = (x: number, v: number, w: number, color: string) => rect(c, x, y(v), w, 1, color);
    r(0, 0, 16, PAL.x); r(0, 1, 16, PAL.k);
    r(0, 2, 16, PAL.w);
    r(1, 3, 5, PAL.w); r(9, 3, 6, PAL.w); r(0, 4, 3, PAL.W); r(11, 4, 4, PAL.W);
    r(5, 5, 4, PAL.k); r(12, 6, 3, PAL.k);
  };
  still("sea_edge_b", 16, 8, foam(false));
  still("sea_edge_t", 16, 8, foam(true));

  // East wind swirl (16x16), 2 frames: lines slide 2px
  const wind = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox + 1 + f * 2, 3, 10, 2, PAL.w); rect(c, ox + 11 + f * 2, 4, 2, 2, PAL.W);
    rect(c, ox + 3 - f * 2, 7, 11, 2, PAL.k); rect(c, ox + 2 - f * 2, 8, 2, 2, PAL.x);
    rect(c, ox + 1 + f * 2, 11, 9, 2, PAL.w); rect(c, ox + 9 + f * 2, 12, 2, 2, PAL.W);
  };
  sheet("sea_wind", 16, 16, [0, 1].map((f) => (c: CanvasRenderingContext2D, ox: number) => wind(c, ox, f)));

  // Coral (14x14) on the sea floor
  still("sea_coral", 14, 14, (c) => {
    rect(c, 1, 13, 12, 1, PAL.z);
    rect(c, 6, 4, 3, 9, PAL.t); rect(c, 2, 6, 3, 7, PAL.T); rect(c, 10, 7, 3, 6, PAL.t);
    rect(c, 5, 2, 5, 3, PAL.q); rect(c, 1, 4, 5, 3, PAL.q); rect(c, 9, 5, 5, 3, PAL.q);
    rect(c, 6, 3, 1, 1, PAL.w);
  });

  // Seaweed (8x16)
  still("sea_weed", 8, 16, (c) => {
    rect(c, 1, 15, 6, 1, PAL.z);
    rect(c, 3, 6, 2, 9, PAL.G); rect(c, 2, 3, 2, 5, PAL.g); rect(c, 5, 1, 2, 6, PAL.g); rect(c, 4, 10, 2, 5, PAL.H);
  });

  // Fish swimming in the water wall (10x6)
  still("sea_fish", 10, 6, (c) => {
    rect(c, 2, 1, 6, 4, PAL.f); rect(c, 3, 1, 4, 1, PAL.y); rect(c, 0, 0, 2, 6, PAL.Y); rect(c, 6, 2, 1, 1, PAL.e);
  });

  // Shell (6x4)
  still("sea_shell", 6, 4, (c) => {
    rect(c, 1, 0, 4, 3, PAL.p); rect(c, 0, 2, 6, 2, PAL.P); rect(c, 2, 0, 1, 2, PAL.q);
  });
}
