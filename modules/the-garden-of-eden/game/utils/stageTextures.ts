import * as Phaser from "phaser";
import { PAL, type PixelMap, drawMap, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Textures for Stages 1-7 (Phase 4). Idempotent; integer rects and PixelMap grids only. */
/** Pixel disc (integer rects, no arcs). */
const disc = (c: CanvasRenderingContext2D, cx: number, cy: number, r: number, col: string) => {
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.5) rect(c, cx + x, cy + y, 1, 1, col);
};
/** Dotted pixel circle outline. */
const ring = (c: CanvasRenderingContext2D, cx: number, cy: number, r: number, col: string) => {
  const n = r * 8;
  for (let i = 0; i < n; i += 2) {
    const a = (i / n) * Math.PI * 2;
    rect(c, Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 1, 1, col);
  }
};

const CRYSTAL: PixelMap = [
  "....XX....", "...XkkX...", "..XkwkkX..", ".XkwkkkxX.", "XkwkkkkxxX",
  "XkkkkkkxxX", ".XkkkkxxX.", "..XxkxxX..", "...XxxX...", "....XX....",
];
const HEART: PixelMap = [
  "..rr...rr..", ".rrrr.rrrr.", "rrwrrrrrrrr", "rrrrrrrrrrr", ".rrrrrrrrr.", "..rrrrrrr..", "...rrrrr...", "....rrr....",
];

export function registerStageTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("gen_prism")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };
  const sheet = (key: string, w: number, h: number, n: number, paint: (c: CanvasRenderingContext2D, ox: number, i: number) => void) => {
    const { canvas, ctx } = makeCanvas(w * n, h);
    for (let i = 0; i < n; i++) paint(ctx, i * w, i);
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };
  const tile = (key: string, base: string, bits: [number, number, number, number, string][]) =>
    still(key, 16, 16, (c) => {
      rect(c, 0, 0, 16, 16, base);
      bits.forEach(([x, y, w, h, col]) => rect(c, x, y, w, h, col));
    });

  // ---------------- Stage 1: light ----------------
  tile("gen_stone", PAL.I, [[0, 0, 16, 1, PAL.i], [0, 8, 16, 1, PAL.i], [8, 0, 1, 8, PAL.i], [3, 9, 1, 7, PAL.i], [12, 11, 2, 1, PAL.L]]);
  tile("gen_wall", PAL.i, [[0, 0, 16, 2, PAL.a], [0, 7, 16, 1, PAL.I], [0, 15, 16, 1, PAL.I], [7, 0, 1, 7, PAL.I], [3, 8, 1, 7, PAL.I]]);
  const ARROWS = [
    [[7, 0, 2, 1], [6, 1, 4, 1], [5, 2, 6, 1]], // N
    [[15, 7, 1, 2], [14, 6, 1, 4], [13, 5, 1, 6]], // E
    [[7, 15, 2, 1], [6, 14, 4, 1], [5, 13, 6, 1]], // S
    [[0, 7, 1, 2], [1, 6, 1, 4], [2, 5, 1, 6]], // W
  ];
  sheet("gen_prism", 16, 16, 4, (c, x, i) => {
    drawMap(c, CRYSTAL, x + 3, 3);
    ARROWS[i].forEach(([ax, ay, w, h]) => rect(c, x + ax, ay, w, h, PAL.y));
  });
  sheet("gen_sun_altar", 16, 16, 2, (c, x, i) => {
    rect(c, x + 2, 13, 12, 3, PAL.a); rect(c, x + 3, 12, 10, 1, PAL.A); rect(c, x + 5, 9, 6, 4, PAL.a); rect(c, x + 4, 8, 8, 2, PAL.A);
    if (i) { rect(c, x + 5, 1, 6, 7, PAL.y); rect(c, x + 4, 3, 8, 4, PAL.l); rect(c, x + 6, 0, 4, 2, PAL.l); rect(c, x + 7, 2, 2, 5, PAL.w); }
    else rect(c, x + 6, 6, 4, 3, PAL.I);
  });
  still("gen_light_src", 16, 16, (c) => {
    rect(c, 3, 12, 10, 4, PAL.A); rect(c, 5, 4, 6, 8, PAL.y); rect(c, 4, 5, 8, 6, PAL.y); rect(c, 6, 6, 4, 4, PAL.w);
    rect(c, 7, 0, 2, 4, PAL.l); rect(c, 1, 7, 3, 2, PAL.l); rect(c, 12, 7, 3, 2, PAL.l);
  });
  still("gen_fog", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.L);
    for (let y = 0; y < 16; y += 2) for (let x = (y / 2 % 2) * 2; x < 16; x += 4) rect(c, x, y, 2, 2, PAL.Z);
    rect(c, 5, 5, 3, 3, PAL.K); rect(c, 10, 10, 3, 3, PAL.K);
  });
  still("gen_gate", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.A); rect(c, 1, 1, 14, 14, PAL.a); rect(c, 7, 1, 2, 14, PAL.A); rect(c, 1, 7, 14, 2, PAL.A);
    rect(c, 6, 6, 4, 4, PAL.y); rect(c, 7, 7, 2, 2, PAL.Y);
  });

  // ---------------- Stage 2: sky and waters ----------------
  tile("gen_water", PAL.X, [[2, 4, 6, 1, PAL.x], [10, 10, 5, 1, PAL.x], [1, 12, 4, 1, PAL.x], [11, 2, 3, 1, PAL.w]]);
  tile("gen_sky_floor", PAL.k, [[2, 3, 5, 1, PAL.w], [3, 2, 3, 1, PAL.w], [10, 10, 5, 1, PAL.w], [11, 9, 3, 1, PAL.w], [6, 13, 3, 1, PAL.x]]);
  sheet("gen_vortex", 20, 20, 2, (c, x, i) => {
    disc(c, x + 10, 10, 9, PAL.X); disc(c, x + 10, 10, 7, PAL.x);
    (i ? [[12, 3, 2, 4], [13, 12, 4, 2], [6, 13, 2, 4], [3, 6, 4, 2]] : [[6, 3, 2, 4], [13, 6, 4, 2], [12, 13, 2, 4], [3, 12, 4, 2]]).forEach(([a, b, w, h]) => rect(c, x + a, b, w, h, PAL.w));
    disc(c, x + 10, 10, 2, PAL.X);
  });
  sheet("gen_windcol", 16, 24, 2, (c, x, i) => {
    rect(c, x + 4, 0, 8, 24, PAL.W); rect(c, x + 6, 0, 4, 24, PAL.w);
    for (let y = 2 + i * 3; y < 22; y += 6) { rect(c, x + 2, y, 12, 1, PAL.k); rect(c, x + 4, y + 1, 8, 1, PAL.w); }
    rect(c, x + 3, 22, 10, 2, PAL.A);
  });
  still("gen_cloud_s", 16, 12, (c) => {
    rect(c, 3, 3, 10, 6, PAL.W); rect(c, 1, 5, 14, 4, PAL.W); rect(c, 5, 1, 6, 3, PAL.w); rect(c, 2, 7, 12, 3, PAL.i); rect(c, 3, 9, 10, 1, PAL.I);
    rect(c, 4, 10, 1, 2, PAL.x); rect(c, 9, 10, 1, 2, PAL.x);
  });
  still("gen_cloud_l", 24, 16, (c) => {
    rect(c, 4, 4, 16, 8, PAL.W); rect(c, 1, 7, 22, 5, PAL.W); rect(c, 7, 1, 10, 4, PAL.w); rect(c, 14, 3, 6, 3, PAL.w);
    rect(c, 2, 10, 20, 4, PAL.i); rect(c, 4, 13, 16, 1, PAL.I);
    rect(c, 5, 14, 1, 2, PAL.x); rect(c, 11, 14, 1, 2, PAL.x); rect(c, 17, 14, 1, 2, PAL.x);
  });

  // ---------------- Stage 3: land and plants ----------------
  tile("gen_soil", PAL.t, [[2, 3, 2, 1, PAL.T], [10, 7, 3, 1, PAL.T], [5, 12, 2, 1, PAL.T], [12, 2, 1, 2, PAL.T]]);
  tile("gen_grown", PAL.G, [[2, 2, 4, 2, PAL.g], [9, 8, 5, 2, PAL.g], [3, 11, 3, 2, PAL.g], [3, 4, 2, 2, PAL.q], [11, 3, 2, 2, PAL.y], [7, 12, 2, 2, PAL.r], [12, 11, 2, 2, PAL.q], [4, 5, 1, 1, PAL.y]]);
  still("gen_rock", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.t); rect(c, 2, 4, 12, 10, PAL.A); rect(c, 3, 3, 10, 2, PAL.a); rect(c, 3, 5, 8, 6, PAL.a); rect(c, 3, 12, 11, 2, PAL.i); rect(c, 5, 6, 2, 2, PAL.w);
  });
  tile("gen_slide", PAL.x, [[1, 3, 6, 1, PAL.w], [9, 8, 6, 1, PAL.w], [2, 12, 5, 1, PAL.X], [10, 1, 4, 1, PAL.X], [0, 0, 16, 1, PAL.X], [0, 15, 16, 1, PAL.X]]);
  tile("gen_sea", PAL.n, [[2, 4, 5, 1, PAL.X], [9, 10, 6, 1, PAL.X], [4, 13, 3, 1, PAL.X]]);
  tile("gen_bridge", PAL.o, [[0, 0, 16, 1, PAL.O], [0, 5, 16, 1, PAL.O], [0, 10, 16, 1, PAL.O], [0, 15, 16, 1, PAL.O], [3, 2, 1, 1, PAL.u], [11, 12, 1, 1, PAL.u]]);
  still("gen_seed", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.t); disc(c, 8, 10, 4, PAL.y); rect(c, 6, 8, 3, 2, PAL.l); rect(c, 7, 1, 2, 5, PAL.G); rect(c, 4, 2, 3, 2, PAL.g); rect(c, 9, 3, 3, 2, PAL.g);
  });

  // ---------------- Stage 4: stars and orbits ----------------
  tile("gen_obs_floor", PAL.L, [[0, 0, 16, 1, PAL.Z], [0, 8, 16, 1, PAL.Z], [8, 0, 1, 8, PAL.Z], [3, 8, 1, 8, PAL.Z], [4, 3, 1, 1, PAL.w], [12, 12, 1, 1, PAL.l], [11, 5, 1, 1, PAL.k]]);
  [PAL.y, PAL.q, PAL.k].forEach((col, i) =>
    still(`gen_star_${i}`, 12, 12, (c) => {
      rect(c, 5, 0, 2, 12, col); rect(c, 0, 5, 12, 2, col); rect(c, 3, 3, 6, 6, col); rect(c, 5, 5, 2, 2, PAL.w);
    })
  );
  [PAL.g, PAL.y, PAL.f, PAL.k].forEach((col, i) =>
    still(`gen_ped_${i}`, 16, 16, (c) => {
      rect(c, 1, 6, 14, 10, PAL.A); rect(c, 2, 4, 12, 4, PAL.a); rect(c, 4, 5, 8, 2, col); rect(c, 3, 12, 10, 2, PAL.i);
      rect(c, 6, 0, 4, 4, col); rect(c, 7, 1, 2, 2, PAL.w);
    })
  );
  ([[24, PAL.y], [40, PAL.w], [56, PAL.k]] as [number, string][]).forEach(([r, col]) =>
    still(`gen_ring_${r}`, r * 2 + 2, r * 2 + 2, (c) => ring(c, r + 1, r + 1, r, col))
  );
  still("gen_sun", 14, 14, (c) => {
    disc(c, 7, 7, 5, PAL.Y); disc(c, 7, 7, 4, PAL.y); disc(c, 7, 7, 2, PAL.l);
    rect(c, 6, 0, 2, 2, PAL.l); rect(c, 6, 12, 2, 2, PAL.l); rect(c, 0, 6, 2, 2, PAL.l); rect(c, 12, 6, 2, 2, PAL.l);
  });
  still("gen_moon", 12, 12, (c) => {
    disc(c, 6, 6, 5, PAL.w);
    for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) if ((x - 2) ** 2 + y * y <= 15) c.clearRect(6 + x, 6 + y, 1, 1);
    rect(c, 2, 5, 1, 2, PAL.W);
  });
  still("gen_starbody", 9, 9, (c) => {
    rect(c, 4, 0, 1, 9, PAL.k); rect(c, 0, 4, 9, 1, PAL.k); rect(c, 3, 3, 3, 3, PAL.w);
  });

  // ---------------- Stage 5: sea and wind ----------------
  tile("gen_deep", PAL.X, [[3, 5, 5, 1, PAL.x], [10, 11, 4, 1, PAL.x], [1, 13, 3, 1, PAL.n]]);
  still("gen_coral", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.X); rect(c, 1, 8, 14, 8, PAL.q); rect(c, 3, 4, 3, 5, PAL.q); rect(c, 9, 2, 3, 7, PAL.q);
    rect(c, 5, 8, 6, 8, PAL.f); rect(c, 1, 13, 14, 3, PAL.R); rect(c, 4, 6, 1, 1, PAL.w); rect(c, 10, 4, 1, 1, PAL.w);
  });
  still("gen_thorn", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.X); rect(c, 2, 12, 12, 4, PAL.R);
    for (const x of [2, 6, 10, 13]) { rect(c, x, 4, 2, 9, PAL.r); rect(c, x, 2, 1, 2, PAL.f); }
  });
  still("gen_current", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.x); rect(c, 0, 7, 12, 2, PAL.w); rect(c, 9, 4, 2, 8, PAL.w); rect(c, 11, 5, 2, 6, PAL.w); rect(c, 13, 6, 2, 4, PAL.w);
    rect(c, 1, 2, 4, 1, PAL.X); rect(c, 3, 13, 5, 1, PAL.X);
  });
  sheet("gen_fan", 16, 16, 2, (c, x, i) => {
    rect(c, x + 6, 10, 4, 6, PAL.A); rect(c, x + 3, 14, 10, 2, PAL.i); disc(c, x + 8, 7, 2, PAL.y);
    if (i) { rect(c, x + 7, 0, 2, 6, PAL.w); rect(c, x + 7, 9, 2, 6, PAL.w); rect(c, x + 1, 6, 6, 2, PAL.W); rect(c, x + 9, 6, 6, 2, PAL.W); }
    else { rect(c, x + 2, 1, 5, 3, PAL.w); rect(c, x + 9, 4, 5, 3, PAL.w); rect(c, x + 2, 9, 5, 3, PAL.W); rect(c, x + 9, 9, 5, 3, PAL.W); }
  });
  still("gen_cliff", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.a); rect(c, 0, 0, 16, 3, PAL.w); rect(c, 0, 3, 16, 2, PAL.W); rect(c, 0, 11, 16, 5, PAL.A);
    rect(c, 3, 6, 2, 4, PAL.A); rect(c, 10, 7, 3, 3, PAL.A); rect(c, 7, 13, 5, 1, PAL.i);
  });

  // ---------------- Stage 6: clay and breath ----------------
  tile("gen_rockfloor", PAL.A, [[1, 2, 5, 1, PAL.a], [9, 9, 5, 1, PAL.a], [3, 12, 3, 1, PAL.i], [11, 3, 2, 2, PAL.a]]);
  tile("gen_forestfloor", PAL.G, [[2, 3, 3, 2, PAL.g], [10, 9, 3, 2, PAL.g], [5, 12, 1, 3, PAL.o], [12, 2, 2, 1, PAL.N]]);
  tile("gen_brookfloor", PAL.j, [[0, 5, 16, 3, PAL.x], [0, 6, 16, 1, PAL.w], [4, 12, 2, 1, PAL.Y], [11, 11, 3, 1, PAL.Y]]);
  [PAL.k, PAL.r, PAL.t, PAL.y].forEach((col, i) =>
    still(`gen_essence_${i}`, 12, 12, (c) => {
      rect(c, 3, 1, 6, 10, col); rect(c, 1, 3, 10, 6, col); rect(c, 4, 2, 2, 2, PAL.w); rect(c, 2, 9, 8, 2, PAL.z);
      rect(c, 3, 9, 6, 1, PAL.O);
    })
  );
  still("gen_clay_altar", 32, 20, (c) => {
    rect(c, 2, 16, 28, 4, PAL.z); rect(c, 0, 8, 32, 9, PAL.T); rect(c, 2, 4, 28, 6, PAL.t); rect(c, 6, 2, 20, 3, PAL.y);
    rect(c, 8, 3, 16, 1, PAL.l); rect(c, 3, 12, 26, 1, PAL.O); rect(c, 14, 10, 4, 4, PAL.y);
  });
  still("gen_heart", 11, 8, (c) => drawMap(c, HEART, 0, 0));
  still("gen_tree_s", 16, 28, (c) => {
    rect(c, 6, 16, 4, 12, PAL.o); rect(c, 7, 16, 2, 12, PAL.O); rect(c, 3, 24, 10, 3, PAL.z);
    rect(c, 2, 5, 12, 12, PAL.G); rect(c, 4, 1, 8, 6, PAL.g); rect(c, 1, 9, 14, 6, PAL.g); rect(c, 3, 12, 10, 3, PAL.G); rect(c, 5, 4, 2, 2, PAL.r);
  });

  // ---------------- Stage 7: nature's instruments ----------------
  tile("gen_flower_floor", PAL.g, [[2, 3, 2, 2, PAL.q], [11, 8, 2, 2, PAL.y], [6, 12, 2, 2, PAL.w], [13, 2, 2, 2, PAL.q], [4, 9, 3, 1, PAL.G]]);
  [PAL.r, PAL.f, PAL.y, PAL.g, PAL.x, PAL.v].forEach((col, i) =>
    sheet(`gen_pad_${i}`, 20, 20, 2, (c, x, f) => {
      rect(c, x + 1, 4, 18, 14, PAL.A); rect(c, x + 2, 3, 16, 3, PAL.a); rect(c, x + 3, 6, 14, 10, f ? col : PAL.i);
      rect(c, x + 5, 8, 10, 6, f ? PAL.w : col); rect(c, x + 2, 17, 16, 2, PAL.z);
      if (f) { rect(c, x + 8, 0, 4, 3, PAL.l); rect(c, x + 0, 8, 2, 4, PAL.l); rect(c, x + 18, 8, 2, 4, PAL.l); }
    })
  );
}
