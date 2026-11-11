import * as Phaser from "phaser";
import { PAL, drawMap, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
import { person } from "@/modules/moses-the-exodus/game/utils/exodusTextures";

/**
 * Stage 2: the brick site, the city gates and the well of Midian.
 * Tiles, a watchtower, water jars, a pulley well, troughs, a tent, and the extra people
 * (slave, overseer, shepherd bully, Jethro's seven daughters). Integer rects only.
 */
const GIRL_ROBES: [string, string][] = [["v", "V"], ["t", "T"], ["E", "C"], ["q", "c"], ["M", "o"], ["k", "x"], ["g", "G"]];

export function registerSiteTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("site_wall")) return;
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

  // People (32x32 chibi grid)
  const people: [string, ReturnType<typeof person>][] = [
    ["exodus_slave", person({ hair: "h", robe: "M", shade: "o", short: true })],
    ["exodus_overseer", person({ hair: "h", robe: "r", shade: "R", cap: "D", beard: "h" })],
    ["exodus_bully", person({ hair: "h", robe: "I", shade: "i", beard: "h", short: true })],
    ...GIRL_ROBES.map(([r, s], i): [string, ReturnType<typeof person>] => [`exodus_girl${i}`, person({ hair: "h", robe: r, shade: s, long: true })]),
  ];
  for (const [key, map] of people) {
    const { canvas, ctx } = makeCanvas(32, 32);
    drawMap(ctx, map, 0);
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: 32, frameHeight: 32 });
  }

  // Ground and wall tiles (16x16)
  still("site_dirt", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.J);
    for (const [x, y] of [[2, 3], [10, 2], [6, 9], [13, 12], [3, 13]]) { rect(c, x, y, 2, 1, PAL.t); rect(c, x + 1, y + 1, 1, 1, PAL.Q); }
  });
  still("site_wall", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.t);
    for (const y of [0, 5, 10, 15]) rect(c, 0, y, 16, 1, PAL.T);
    for (const [x, y] of [[4, 1], [11, 6], [4, 11]]) rect(c, x, y, 1, 4, PAL.T);
    for (const [x, y] of [[1, 2], [8, 7], [13, 12]]) rect(c, x, y, 2, 1, PAL.Y);
  });
  still("site_fence", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.O);
    for (const x of [0, 6, 12]) { rect(c, x, 0, 4, 16, PAL.o); rect(c, x + 3, 0, 1, 16, PAL.O); rect(c, x + 1, 3, 1, 1, PAL.Y); rect(c, x + 1, 12, 1, 1, PAL.Y); }
  });
  still("site_grass", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.g);
    for (const [x, y] of [[2, 2], [9, 5], [5, 10], [13, 12], [1, 14]]) { rect(c, x, y, 2, 2, PAL.G); rect(c, x, y - 1, 1, 1, PAL.G); }
  });

  // Torch (10x18, 2 frames)
  const torch = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox + 4, 8, 2, 10, PAL.o); rect(c, ox + 3, 7, 4, 2, PAL.Y);
    rect(c, ox + 3, 4 - f, 4, 3 + f, PAL.f); rect(c, ox + 4, 2 - f, 2, 3, PAL.f); rect(c, ox + 4, 4 - f, 2, 3, PAL.y); rect(c, ox + 4, 5, 2, 1, PAL.l);
  };
  sheet("site_torch", 10, 18, [(c, ox) => torch(c, ox, 0), (c, ox) => torch(c, ox, 1)]);

  // Water jar (12x14, carried) and the big clay pot (18x20, water source)
  still("site_jar", 12, 14, (c) => {
    rect(c, 2, 13, 8, 1, PAL.z);
    rect(c, 3, 2, 6, 2, PAL.T); rect(c, 4, 1, 4, 1, PAL.x); rect(c, 2, 4, 8, 8, PAL.t); rect(c, 3, 12, 6, 1, PAL.t); rect(c, 8, 4, 2, 8, PAL.T); rect(c, 3, 6, 1, 3, PAL.Y);
  });
  still("site_pot", 18, 20, (c) => {
    rect(c, 2, 19, 14, 1, PAL.z);
    rect(c, 4, 2, 10, 3, PAL.T); rect(c, 5, 3, 8, 1, PAL.x); rect(c, 6, 3, 2, 1, PAL.w);
    rect(c, 2, 5, 14, 12, PAL.t); rect(c, 4, 17, 10, 2, PAL.t); rect(c, 13, 5, 3, 12, PAL.T); rect(c, 2, 9, 14, 1, PAL.Y); rect(c, 4, 10, 2, 2, PAL.Y);
  });

  // Brick pile (26x14) and watchtower (24x44)
  still("site_bricks", 26, 14, (c) => {
    rect(c, 1, 13, 24, 1, PAL.z);
    for (const [x, y, w] of [[1, 9, 24], [3, 5, 20], [6, 1, 14]]) {
      rect(c, x, y, w, 4, PAL.t); rect(c, x, y + 3, w, 1, PAL.T);
      for (let b = x + 5; b < x + w; b += 6) rect(c, b, y, 1, 4, PAL.T);
    }
  });
  still("site_tower", 24, 44, (c) => {
    rect(c, 2, 43, 20, 1, PAL.z);
    rect(c, 4, 12, 16, 31, PAL.t); rect(c, 16, 12, 4, 31, PAL.T);
    for (const y of [17, 23, 29, 35]) rect(c, 4, y, 16, 1, PAL.T);
    rect(c, 2, 8, 20, 4, PAL.a); rect(c, 2, 11, 20, 1, PAL.A);
    for (const x of [2, 8, 14, 20]) rect(c, x, 5, 2, 3, PAL.a);
    rect(c, 9, 20, 6, 8, PAL.e); rect(c, 9, 19, 6, 1, PAL.T);
    rect(c, 10, 0, 1, 5, PAL.o); rect(c, 11, 0, 5, 3, PAL.r); // banner
  });

  // Sand mound (20x8)
  still("site_mound", 20, 8, (c) => {
    rect(c, 6, 1, 8, 1, PAL.Q); rect(c, 3, 2, 14, 2, PAL.Q); rect(c, 1, 4, 18, 3, PAL.Q); rect(c, 1, 6, 18, 2, PAL.J);
    for (const [x, y] of [[5, 3], [11, 5], [14, 3]]) rect(c, x, y, 2, 1, PAL.J);
  });

  // Well (30x30): stone ring, two posts, a beam and the rope + bucket
  still("site_well", 30, 30, (c) => {
    rect(c, 3, 29, 24, 1, PAL.z);
    rect(c, 6, 18, 18, 11, PAL.a); rect(c, 6, 18, 18, 2, PAL.W); rect(c, 18, 20, 6, 9, PAL.A);
    for (const y of [23, 27]) rect(c, 6, y, 18, 1, PAL.A);
    rect(c, 8, 19, 14, 2, PAL.X); // water inside
    rect(c, 6, 4, 2, 15, PAL.o); rect(c, 22, 4, 2, 15, PAL.o); rect(c, 4, 2, 22, 3, PAL.O); rect(c, 4, 2, 22, 1, PAL.o);
    rect(c, 14, 5, 1, 11, PAL.p); rect(c, 12, 15, 5, 4, PAL.o); rect(c, 12, 15, 5, 1, PAL.O); // rope + bucket
  });

  // Drinking trough (26x12): frame 0 dry, frame 1 filled
  const trough = (c: CanvasRenderingContext2D, ox: number, full: boolean) => {
    rect(c, ox + 1, 11, 24, 1, PAL.z);
    rect(c, ox + 1, 3, 24, 8, PAL.o); rect(c, ox + 1, 9, 24, 2, PAL.O); rect(c, ox + 1, 3, 24, 1, PAL.Y);
    rect(c, ox + 3, 4, 20, 4, full ? PAL.x : PAL.O);
    if (full) { rect(c, ox + 6, 5, 4, 1, PAL.w); rect(c, ox + 14, 6, 5, 1, PAL.X); }
  };
  sheet("site_trough", 26, 12, [(c, ox) => trough(c, ox, false), (c, ox) => trough(c, ox, true)]);

  // Carried bucket (10x12), rock (20x14), dry shrub (14x12), Jethro's tent (46x34)
  still("site_bucket", 10, 12, (c) => {
    rect(c, 1, 11, 8, 1, PAL.z);
    rect(c, 3, 0, 4, 1, PAL.p); rect(c, 2, 1, 1, 3, PAL.p); rect(c, 7, 1, 1, 3, PAL.p);
    rect(c, 1, 4, 8, 7, PAL.o); rect(c, 1, 4, 8, 2, PAL.x); rect(c, 7, 6, 2, 5, PAL.O); rect(c, 1, 8, 8, 1, PAL.Y);
  });
  still("site_rock", 20, 14, (c) => {
    rect(c, 2, 13, 16, 1, PAL.z);
    rect(c, 6, 2, 8, 2, PAL.a); rect(c, 3, 4, 14, 4, PAL.a); rect(c, 1, 8, 18, 5, PAL.a); rect(c, 12, 5, 6, 8, PAL.A); rect(c, 1, 12, 18, 1, PAL.A); rect(c, 6, 3, 3, 1, PAL.W);
  });
  still("site_shrub", 14, 12, (c) => {
    rect(c, 2, 11, 10, 1, PAL.z);
    rect(c, 6, 4, 2, 7, PAL.o); rect(c, 3, 6, 1, 4, PAL.o); rect(c, 10, 5, 1, 5, PAL.o);
    rect(c, 2, 3, 3, 3, PAL.M); rect(c, 9, 2, 3, 3, PAL.M); rect(c, 5, 0, 4, 4, PAL.M); rect(c, 6, 1, 2, 1, PAL.j);
  });
  still("site_tent", 46, 34, (c) => {
    rect(c, 3, 33, 40, 1, PAL.z);
    rect(c, 22, 2, 2, 3, PAL.o); rect(c, 20, 5, 6, 3, PAL.U); rect(c, 16, 8, 14, 3, PAL.U); rect(c, 11, 11, 24, 3, PAL.U); rect(c, 6, 14, 34, 3, PAL.U); rect(c, 3, 17, 40, 3, PAL.U);
    for (const [x, y, w] of [[20, 5, 6], [16, 8, 14], [11, 11, 24], [6, 14, 34], [3, 17, 40]]) { rect(c, x, y + 2, w, 1, PAL.W); }
    rect(c, 3, 20, 40, 13, PAL.M); rect(c, 3, 29, 40, 4, PAL.o);
    for (const x of [8, 17, 26, 35]) rect(c, x, 20, 4, 13, PAL.Y);
    rect(c, 18, 21, 10, 12, PAL.e); rect(c, 19, 22, 8, 11, PAL.O); // door flap
  });
}
