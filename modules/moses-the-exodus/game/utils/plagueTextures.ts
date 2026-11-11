import * as Phaser from "phaser";
import { PAL, makeCanvas, rect, drawMap } from "@/modules/shared/game/utils/pixelArt";
import { person } from "@/modules/moses-the-exodus/game/utils/exodusTextures";

/**
 * Stage 4: Pharaoh's courtyard. Throne, shield rings, magician, smoke ring, sign altars,
 * water column, frog, hail-free beam base. Integer rects only.
 */
export function registerPlagueTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("pl_ring")) return;
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

  // Magician (32x32 chibi): green robe, tall violet cap
  const magician = person({ hair: "h", robe: "g", shade: "G", cap: "v", stripe: "Y", flaps: true });
  sheet("pl_magician", 32, 32, [(c, ox) => drawMap(c, magician, ox)]);

  // Smoke ring (16x16, 2 frames): a stepped purple ring that drifts
  const ring = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    const col = f ? PAL.v : PAL.L;
    rect(c, ox + 5, 1, 6, 2, col); rect(c, ox + 3, 3, 2, 2, col); rect(c, ox + 11, 3, 2, 2, col);
    rect(c, ox + 1, 5, 2, 6, col); rect(c, ox + 13, 5, 2, 6, col);
    rect(c, ox + 3, 11, 2, 2, col); rect(c, ox + 11, 11, 2, 2, col); rect(c, ox + 5, 13, 6, 2, col);
    rect(c, ox + 3, 5, 1, 6, PAL.Z); rect(c, ox + 12, 5, 1, 6, PAL.Z);
    rect(c, ox + (f ? 7 : 6), 6, 2, 1, PAL.w);
  };
  sheet("pl_ring", 16, 16, [(c, ox) => ring(c, ox, 0), (c, ox) => ring(c, ox, 1)]);

  // Throne (40x44): stepped dais and a tall gold chair
  still("pl_throne", 40, 44, (c) => {
    rect(c, 2, 43, 36, 1, PAL.z);
    rect(c, 0, 36, 40, 7, PAL.a); rect(c, 0, 36, 40, 1, PAL.W); rect(c, 0, 41, 40, 2, PAL.A);
    rect(c, 6, 30, 28, 6, PAL.W); rect(c, 6, 30, 28, 1, PAL.w);
    rect(c, 10, 6, 20, 24, PAL.y); rect(c, 10, 6, 20, 2, PAL.l); rect(c, 26, 8, 4, 22, PAL.Y);
    rect(c, 8, 22, 4, 10, PAL.Y); rect(c, 28, 22, 4, 10, PAL.Y); rect(c, 13, 24, 14, 6, PAL.r);
    rect(c, 16, 10, 8, 4, PAL.r); rect(c, 18, 11, 4, 2, PAL.l);
    rect(c, 8, 4, 4, 3, PAL.y); rect(c, 28, 4, 4, 3, PAL.y);
  });

  // Shield (stepped octagon outline, 3 sizes): the Shield of a Hard Heart
  const shield = (n: number, col: string, lite: string) => (c: CanvasRenderingContext2D) => {
    const e = 4; // corner cut
    rect(c, e, 0, n - 2 * e, 2, col); rect(c, e, n - 2, n - 2 * e, 2, col);
    rect(c, 0, e, 2, n - 2 * e, col); rect(c, n - 2, e, 2, n - 2 * e, col);
    for (let i = 0; i < e; i += 2) {
      rect(c, e - i - 2, i, 2, 2, col); rect(c, n - e + i, i, 2, 2, col);
      rect(c, e - i - 2, n - i - 2, 2, 2, col); rect(c, n - e + i, n - i - 2, 2, 2, col);
    }
    rect(c, e + 2, 2, 6, 1, lite);
  };
  still("pl_shield0", 64, 64, shield(64, PAL.D, PAL.R));
  still("pl_shield1", 52, 52, shield(52, PAL.r, PAL.f));
  still("pl_shield2", 40, 40, shield(40, PAL.f, PAL.l));

  // Sign altar (16x22, 2 frames): dormant stone pillar / lit with a gold flame
  const altar = (c: CanvasRenderingContext2D, ox: number, lit: boolean) => {
    rect(c, ox + 2, 21, 12, 1, PAL.z);
    rect(c, ox + 1, 17, 14, 4, PAL.A); rect(c, ox + 3, 7, 10, 10, PAL.a); rect(c, ox + 11, 7, 2, 10, PAL.A);
    rect(c, ox + 2, 5, 12, 3, PAL.W); rect(c, ox + 2, 5, 12, 1, PAL.w);
    if (lit) { rect(c, ox + 6, 0, 4, 4, PAL.f); rect(c, ox + 7, 1, 2, 2, PAL.l); rect(c, ox + 5, 9, 6, 1, PAL.y); rect(c, ox + 7, 8, 2, 4, PAL.y); }
    else { rect(c, ox + 7, 9, 2, 1, PAL.D); rect(c, ox + 6, 10, 4, 1, PAL.D); }
  };
  sheet("pl_altar", 16, 22, [(c, ox) => altar(c, ox, false), (c, ox) => altar(c, ox, true)]);

  // Water column (14x24, 2 frames): blue stream / red blood
  const column = (c: CanvasRenderingContext2D, ox: number, main: string, dark: string, hi: string) => {
    rect(c, ox + 1, 23, 12, 1, PAL.z);
    rect(c, ox + 0, 18, 14, 5, PAL.a); rect(c, ox + 0, 18, 14, 1, PAL.W);
    rect(c, ox + 3, 3, 8, 15, main); rect(c, ox + 8, 3, 3, 15, dark); rect(c, ox + 4, 5, 1, 6, hi);
    rect(c, ox + 1, 14, 2, 4, main); rect(c, ox + 11, 14, 2, 4, dark); rect(c, ox + 4, 0, 6, 3, main); rect(c, ox + 5, 1, 2, 1, hi);
  };
  sheet("pl_column", 14, 24, [(c, ox) => column(c, ox, PAL.x, PAL.X, PAL.w), (c, ox) => column(c, ox, PAL.r, PAL.D, PAL.f)]);

  // Fence post (8x20) for the Goshen line, frog (10x8), cattle (reuse lamb) and a cattle shelter (36x26)
  still("pl_post", 8, 20, (c) => {
    rect(c, 1, 19, 6, 1, PAL.z);
    rect(c, 2, 2, 4, 17, PAL.o); rect(c, 5, 2, 1, 17, PAL.O); rect(c, 1, 0, 6, 3, PAL.Y); rect(c, 2, 0, 4, 1, PAL.l);
  });
  sheet("pl_frog", 10, 8, [
    (c, ox) => { rect(c, ox + 1, 3, 8, 4, PAL.g); rect(c, ox + 2, 1, 2, 2, PAL.G); rect(c, ox + 6, 1, 2, 2, PAL.G); rect(c, ox + 2, 1, 1, 1, PAL.w); rect(c, ox + 7, 1, 1, 1, PAL.w); rect(c, ox + 1, 6, 2, 2, PAL.G); rect(c, ox + 7, 6, 2, 2, PAL.G); },
    (c, ox) => { rect(c, ox + 1, 2, 8, 4, PAL.g); rect(c, ox + 2, 0, 2, 2, PAL.G); rect(c, ox + 6, 0, 2, 2, PAL.G); rect(c, ox + 2, 0, 1, 1, PAL.w); rect(c, ox + 7, 0, 1, 1, PAL.w); rect(c, ox + 0, 5, 3, 3, PAL.G); rect(c, ox + 7, 5, 3, 3, PAL.G); },
  ]);
  still("pl_shelter", 40, 30, (c) => {
    rect(c, 2, 29, 36, 1, PAL.z);
    rect(c, 3, 12, 4, 17, PAL.o); rect(c, 33, 12, 4, 17, PAL.o); rect(c, 3, 12, 1, 17, PAL.O);
    rect(c, 0, 6, 40, 7, PAL.M); rect(c, 0, 11, 40, 2, PAL.o); rect(c, 4, 2, 32, 5, PAL.Y); rect(c, 4, 2, 32, 1, PAL.l);
    rect(c, 8, 16, 24, 12, PAL.j);
  });
}
