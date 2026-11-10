import { PAL, drawMap, rect } from "@/modules/shared/game/utils/pixelArt";
import { DOVE, INTRO_W, registerIntroIllustration } from "@/modules/the-garden-of-eden/game/utils/introIllustrations";

/** Storybook pictures for Stages 1-7 (160x96, 2 frames, integer rects only). Side-effect module: imported by BaseGenesisScene. */
type Ctx = CanvasRenderingContext2D;
const bands = (c: Ctx, x: number, y: number, w: number, h: number, cols: string[]) => cols.forEach((col, i) => rect(c, x, y + i * h, w, h, col));
const disc = (c: Ctx, cx: number, cy: number, r: number, col: string) => {
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.5) rect(c, cx + x, cy + y, 1, 1, col);
};
const dove = (c: Ctx, x: number, y: number) => drawMap(c, DOVE.map((r) => r.padEnd(13, ".")), x, y);
const twinkle = (c: Ctx, f: number, pts: number[][]) =>
  pts.forEach(([x, y]) => {
    rect(c, x, y, 1, 1, PAL.w);
    if ((x + f) % 2 === 0) rect(c, x - 1, y, 3, 1, PAL.W);
  });

// Day 1: a shaft of light splits night (left) from day (right) over dark water
registerIntroIllustration("light", (c, f) => {
  bands(c, 0, 0, 80, 8, [PAL.K, PAL.K, PAL.L, PAL.L, PAL.Z, PAL.Z]);
  bands(c, 80, 0, 80, 8, [PAL.Y, PAL.Y, PAL.y, PAL.y, PAL.l, PAL.l]);
  rect(c, 0, 52, 80, 44, PAL.n); rect(c, 80, 52, 80, 44, PAL.Y);
  for (let i = 0; i < 8; i++) {
    rect(c, (i * 11 + f * 5) % 70, 60 + (i % 4) * 9, 8, 1, PAL.b);
    rect(c, 80 + ((i * 13 + f * 5) % 68), 60 + (i % 4) * 9, 8, 1, PAL.l);
  }
  twinkle(c, f, [[10, 8], [30, 20], [52, 6], [60, 30], [20, 40], [44, 36]]);
  rect(c, 66 - f, 0, 28 + 2 * f, 56, PAL.Y); rect(c, 70 - f, 0, 20 + 2 * f, 56, PAL.y); rect(c, 74, 0, 12, 56, PAL.l); rect(c, 78, 0, 4, 56, PAL.w);
  rect(c, 70, 56, 20, 2, PAL.l); rect(c, 66, 60, 28, 1, PAL.y);
  dove(c, 74, 30 + f * 2);
});

// Day 2: sea below, white cloud-waters lifted above, clear blue vault between
registerIntroIllustration("sky", (c, f) => {
  rect(c, 0, 0, INTRO_W, 96, PAL.k);
  rect(c, 0, 26, INTRO_W, 30, PAL.x);
  for (let x = 0; x < INTRO_W; x += 20) {
    rect(c, x, 4 - f, 24, 12, PAL.w); rect(c, x + 6, 0 - f, 14, 8, PAL.W); rect(c, x, 14 - f, 24, 3, PAL.W);
  }
  rect(c, 0, 56, INTRO_W, 40, PAL.X); rect(c, 0, 56, INTRO_W, 2, PAL.w);
  for (let i = 0; i < 12; i++) {
    rect(c, (i * 14 + f * 6) % 150, 62 + (i % 5) * 7, 10, 2, PAL.x);
    rect(c, (i * 14 + 4 + f * 6) % 150, 61 + (i % 5) * 7, 6, 1, PAL.w);
  }
  for (const [x, y] of [[30, 34], [100, 28], [128, 44]]) { rect(c, x, y, 18, 1, PAL.w); rect(c, x + 4, y + 3, 12, 1, PAL.w); rect(c, x + 8, y + 6, 6, 1, PAL.w); } // wind swirls
  dove(c, 74, 36 + f * 2);
});

// Day 3: land rises from the sea; grass, flowers and fruit trees
registerIntroIllustration("land", (c, f) => {
  rect(c, 0, 0, INTRO_W, 70, PAL.k);
  rect(c, 118, 6, 8, 8, PAL.y); rect(c, 120, 8, 4, 4, PAL.l);
  rect(c, 0, 70, INTRO_W, 26, PAL.X); rect(c, 0, 76 + f, 40, 1, PAL.x); rect(c, 110, 84 - f, 40, 1, PAL.x);
  for (let i = 0; i < 6; i++) rect(c, 10 + i * 4, 36 + i * 4, 90 - i * 8, 4, i < 2 ? PAL.A : PAL.a); // mountain steps
  rect(c, 30, 28, 20, 8, PAL.a); rect(c, 36, 24, 8, 4, PAL.w);
  rect(c, 8, 60, 144, 12, PAL.t); rect(c, 12, 52, 136, 10, PAL.G); rect(c, 16, 56, 128, 8, PAL.g);
  for (const x of [26, 60, 96, 130]) {
    rect(c, x + 4, 38, 4, 16, PAL.o); rect(c, x - 2, 26, 16, 14, PAL.G); rect(c, x, 24, 12, 8, PAL.g); rect(c, x + 1, 30, 3, 3, PAL.r); rect(c, x + 8, 28, 3, 3, PAL.r);
  }
  for (let i = 0; i < 14; i++) {
    const h = f && i % 2 ? 4 : 2; // sprouts grow a step
    rect(c, 20 + i * 9, 66 - h, 2, h, PAL.G); rect(c, 19 + i * 9, 64 - h, 4, 2, [PAL.q, PAL.y, PAL.r, PAL.w][i % 4]);
  }
});

// Day 4: sun and crescent moon, stars, and four seasons below
registerIntroIllustration("stars", (c, f) => {
  bands(c, 0, 0, INTRO_W, 8, [PAL.K, PAL.K, PAL.L, PAL.L, PAL.Z, PAL.Z]);
  disc(c, 32, 30, 16 + f, PAL.Y); disc(c, 32, 30, 13 + f, PAL.y); disc(c, 32, 30, 8, PAL.l);
  for (let a = 0; a < 8; a++) rect(c, 32 + Math.round(Math.cos(a * 0.785) * 24) - 1, 30 + Math.round(Math.sin(a * 0.785) * 24) - 1, 3, 3, PAL.l);
  disc(c, 124, 28, 11, PAL.w); disc(c, 128, 26, 10, PAL.L); rect(c, 116, 26, 2, 4, PAL.W);
  twinkle(c, f, [[70, 8], [88, 20], [100, 6], [140, 12], [60, 36], [80, 40], [110, 40], [148, 44], [8, 10], [52, 12], [96, 30]]);
  [PAL.g, PAL.y, PAL.f, PAL.w].forEach((col, i) => {
    rect(c, i * 40, 58, 40, 38, col);
    rect(c, 14 + i * 40, 66, 12, 14, PAL.o);
    rect(c, 8 + i * 40, 54, 24, 14, [PAL.G, PAL.Y, PAL.R, PAL.W][i]);
  });
});

// Day 5: waterline cut: birds over cliffs above, whale and fish among coral below
registerIntroIllustration("seabirds", (c, f) => {
  rect(c, 0, 0, INTRO_W, 46, PAL.k); rect(c, 0, 40, INTRO_W, 6, PAL.w);
  rect(c, 0, 24, 36, 22, PAL.a); rect(c, 0, 20, 24, 6, PAL.A); rect(c, 130, 28, 30, 18, PAL.a);
  for (const [x, y] of [[50, 10], [74, 20], [96, 8], [112, 22], [62, 30]]) { // birds: wings flap
    rect(c, x, y + f, 6, 2, PAL.w); rect(c, x + 6, y - f + 1, 6, 2, PAL.w); rect(c, x + 5, y + 1, 2, 3, PAL.W);
  }
  rect(c, 0, 46, INTRO_W, 50, PAL.x); rect(c, 0, 66, INTRO_W, 30, PAL.X); rect(c, 0, 46, INTRO_W, 2, PAL.w);
  rect(c, 60, 62, 52, 14, PAL.b); rect(c, 52, 66, 12, 8, PAL.b); rect(c, 100, 68, 14, 4, PAL.B); rect(c, 66, 70, 36, 6, PAL.w); rect(c, 96, 64, 2, 2, PAL.e); rect(c, 112, 56 + f, 4, 6, PAL.b);
  for (const [x, y, col] of [[14, 60, PAL.f], [30, 74, PAL.y], [120, 80, PAL.q], [140, 64, PAL.r]] as [number, number, string][]) {
    rect(c, x, y, 8, 4, col); rect(c, x - 3, y + f, 3, 2, col);
  }
  for (let x = 4; x < INTRO_W; x += 22) { rect(c, x, 84, 8, 12, PAL.q); rect(c, x + 2, 78, 3, 8, PAL.f); rect(c, x + 6, 80, 3, 6, PAL.q); }
  for (let i = 0; i < 6; i++) rect(c, 20 + i * 24, 56 + ((i * 9 + 30 - f * 6) % 30), 2, 2, PAL.w); // bubbles
});

// Day 6: Adam receives the breath of life among peaceful animals
registerIntroIllustration("adam", (c, f) => {
  rect(c, 0, 0, INTRO_W, 56, PAL.k);
  rect(c, 0, 56, INTRO_W, 40, PAL.g); rect(c, 0, 76, INTRO_W, 20, PAL.G);
  rect(c, 70, 0, 20, 62, PAL.l); rect(c, 74, 0, 12, 62, PAL.w); // breath of life
  for (let y = 4; y < 60; y += 8) rect(c, 70 + (((y / 8) + f) % 2) * 10, y, 6, 2, PAL.y); // spiral glints
  rect(c, 56, 66, 48, 10, PAL.T); rect(c, 58, 64, 44, 4, PAL.t); // clay bed
  rect(c, 62, 56, 36, 10, PAL.t); rect(c, 66, 58, 6, 6, PAL.s); rect(c, 64, 54, 10, 4, PAL.h); rect(c, 72, 60, 24, 6, PAL.s); rect(c, 72, 64 - f, 24, 2, PAL.S); // Adam
  rect(c, 14, 62, 20, 12, PAL.j); rect(c, 8, 60, 10, 10, PAL.Y); rect(c, 10, 63, 2, 2, PAL.e); rect(c, 30, 74, 3, 4, PAL.Y); // lion
  rect(c, 120, 64, 16, 10, PAL.w); rect(c, 134, 62, 8, 7, PAL.w); rect(c, 138, 64, 1, 1, PAL.e); // lamb
  rect(c, 138, 40, 14, 12, PAL.a); rect(c, 132, 36, 10, 10, PAL.a); rect(c, 128, 44, 3, 12, PAL.A); // elephant
  rect(c, 36, 44, 10, 12, PAL.t); rect(c, 40, 30, 4, 16, PAL.t); rect(c, 38, 28, 8, 4, PAL.t); // deer
});

// Day 7: all creation gathers on the holy hill under the glory of the Trinity; notes rise
registerIntroIllustration("sabbath", (c, f) => {
  bands(c, 0, 0, INTRO_W, 8, [PAL.v, PAL.v, PAL.q, PAL.q, PAL.l, PAL.l]);
  for (let i = 0; i < 3; i++) disc(c, 80 + (i - 1) * 14, i === 1 ? 14 : 22, 8 + f, i === 1 ? PAL.w : PAL.l);
  rect(c, 60, 34, 40, 1, PAL.y); rect(c, 66, 37, 28, 1, PAL.y); rect(c, 72, 40, 16, 1, PAL.y);
  rect(c, 0, 62, INTRO_W, 34, PAL.g); rect(c, 20, 54, 120, 10, PAL.g); rect(c, 44, 48, 72, 8, PAL.G); rect(c, 52, 46, 56, 4, PAL.g);
  for (let i = 0; i < 12; i++) rect(c, 6 + i * 13, 70 + (i % 3) * 8, 3, 3, [PAL.q, PAL.y, PAL.w][i % 3]);
  [PAL.b, PAL.w, PAL.r].forEach((robe, i) => { rect(c, 66 + i * 14, 44, 6, 6, PAL.s); rect(c, 65 + i * 14, 50, 8, 8, robe); });
  rect(c, 30, 58, 12, 8, PAL.j); rect(c, 120, 60, 12, 8, PAL.w); rect(c, 12, 52, 10, 6, PAL.A);
  for (let i = 0; i < 6; i++) {
    const y = 54 - ((i * 11 + f * 6) % 40);
    rect(c, 36 + i * 16, y, 3, 5, PAL.Y); rect(c, 38 + i * 16, y - 3, 3, 1, PAL.Y);
  }
  dove(c, 74, 20 - f);
});
