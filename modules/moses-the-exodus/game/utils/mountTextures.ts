import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/**
 * Stage 3: Mount Horeb. Cliff and rocky-path tiles, glowing holy stones, the sandal pedestal,
 * sandals, the snake, the healed hand and the dry slab with three grooves. Integer rects only.
 */
export function registerMountTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("mt_cliff")) return;
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

  // Cliff face (16x16, violet dusk rock) and rocky path (16x16)
  still("mt_cliff", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.Z);
    for (const y of [0, 5, 10, 15]) rect(c, 0, y, 16, 1, PAL.L);
    for (const [x, y] of [[3, 1], [10, 6], [5, 11]]) rect(c, x, y, 1, 4, PAL.L);
    for (const [x, y] of [[8, 2], [2, 7], [12, 12]]) rect(c, x, y, 2, 1, PAL.v);
  });
  still("mt_ground", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.M);
    for (const [x, y, w] of [[2, 3, 3], [9, 1, 2], [11, 9, 3], [4, 12, 2]]) rect(c, x, y, w, 1, PAL.o);
    for (const [x, y] of [[7, 6], [13, 14], [1, 9]]) rect(c, x, y, 1, 1, PAL.j);
  });

  // Holy stone (16x12): dim, flaring (demo) and lit (stays lit once stepped on in order)
  const stone = (c: CanvasRenderingContext2D, ox: number, face: string, edge: string, glow?: string) => {
    if (glow) { rect(c, ox + 0, 4, 1, 4, glow); rect(c, ox + 15, 4, 1, 4, glow); rect(c, ox + 4, 0, 8, 1, glow); rect(c, ox + 4, 11, 8, 1, glow); }
    rect(c, ox + 3, 1, 10, 1, face); rect(c, ox + 1, 2, 14, 8, face); rect(c, ox + 3, 10, 10, 1, edge);
    rect(c, ox + 1, 8, 14, 2, edge); rect(c, ox + 4, 3, 3, 1, PAL.w);
  };
  sheet("mt_stone", 16, 12, [
    (c, ox) => stone(c, ox, PAL.a, PAL.A),
    (c, ox) => stone(c, ox, PAL.l, PAL.y, PAL.w),
    (c, ox) => stone(c, ox, PAL.y, PAL.Y, PAL.l),
  ]);

  // Humble pedestal (22x14) and sandals (12x6)
  still("mt_pedestal", 22, 14, (c) => {
    rect(c, 2, 13, 18, 1, PAL.z);
    rect(c, 3, 3, 16, 3, PAL.W); rect(c, 3, 3, 16, 1, PAL.w);
    rect(c, 5, 6, 12, 7, PAL.a); rect(c, 13, 6, 4, 7, PAL.A); rect(c, 5, 6, 12, 1, PAL.W);
  });
  still("mt_sandals", 12, 7, (c) => {
    rect(c, 1, 6, 10, 1, PAL.z);
    rect(c, 0, 2, 5, 4, PAL.u); rect(c, 7, 2, 5, 4, PAL.u); rect(c, 1, 1, 3, 1, PAL.o); rect(c, 8, 1, 3, 1, PAL.o);
    rect(c, 0, 5, 5, 1, PAL.O); rect(c, 7, 5, 5, 1, PAL.O);
  });

  // Snake (24x14, 2 wiggle frames, faces right) and Moses' staff already exists as exodus_staff
  const snake = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox + 2, 13, 20, 1, PAL.z);
    const dy = f ? 1 : 0;
    rect(c, ox + 1, 8 + dy, 3, 2, PAL.G); rect(c, ox + 3, 6 + dy, 4, 3, PAL.g); rect(c, ox + 7, 8 - dy, 4, 3, PAL.G);
    rect(c, ox + 11, 6 + dy, 4, 3, PAL.g); rect(c, ox + 15, 5, 4, 4, PAL.G); rect(c, ox + 18, 3, 5, 4, PAL.g);
    rect(c, ox + 21, 4, 1, 1, PAL.e); rect(c, ox + 23, 6, 1, 3, PAL.r); rect(c, ox + 5, 7 + dy, 2, 1, PAL.N);
  };
  sheet("mt_snake", 24, 14, [(c, ox) => snake(c, ox, 0), (c, ox) => snake(c, ox, 1)]);

  // Hand (16x16): frame 0 pale and sick, frame 1 rosy and healed
  const hand = (c: CanvasRenderingContext2D, ox: number, skin: string, shade: string, spot?: string) => {
    rect(c, ox + 3, 15, 10, 1, PAL.z);
    rect(c, ox + 4, 8, 8, 6, skin); rect(c, ox + 4, 12, 8, 2, shade);
    for (const x of [4, 7, 10]) { rect(c, ox + x, 2, 2, 6, skin); rect(c, ox + x, 6, 2, 2, shade); }
    rect(c, ox + 1, 8, 3, 2, skin); rect(c, ox + 2, 7, 2, 1, skin);
    if (spot) for (const [x, y] of [[5, 4], [8, 9], [10, 4], [6, 11]]) rect(c, ox + x, y, 1, 1, spot);
  };
  sheet("mt_hand", 16, 16, [(c, ox) => hand(c, ox, PAL.U, PAL.W, PAL.W), (c, ox) => hand(c, ox, PAL.s, PAL.S)]);

  // Dry slab with three grooves (66x16); water in a groove is a separate image
  still("mt_slab", 66, 16, (c) => {
    rect(c, 2, 15, 62, 1, PAL.z);
    rect(c, 1, 4, 64, 11, PAL.a); rect(c, 1, 12, 64, 3, PAL.A); rect(c, 1, 4, 64, 1, PAL.W);
    for (const x of [10, 32, 54]) { rect(c, x, 7, 4, 6, PAL.D); rect(c, x + 1, 8, 2, 4, PAL.e); }
  });
  still("mt_water", 4, 6, (c) => { rect(c, 0, 0, 4, 6, PAL.x); rect(c, 1, 1, 1, 2, PAL.w); rect(c, 0, 4, 4, 2, PAL.X); });
}
