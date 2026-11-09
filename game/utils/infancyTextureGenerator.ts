import * as Phaser from "phaser";
import { PAL, type PixelMap, makeCanvas, rect } from "./pixelArt";
import { MARY } from "./npcTextureGenerator";
import { fromMap, recolor } from "./visitationTextureGenerator";
import { JESUS } from "./lightTextureGenerator";

/** Pixel-art textures for stages 3-5 (Nativity, Presentation, Finding in the Temple). Integer rects + PixelMaps only. */

const beard = (map: PixelMap) => map.map((row, i) => (i === 15 ? row.replace("ssssss", "wwwwww") : row));

// ---------- characters (same chibi body as Mary, recoloured) ----------

const JOSEPH = recolor(MARY, { b: "u", B: "O", n: "O", w: "g", W: "G", y: "Y" });
const SHEPHERD = recolor(MARY, { b: "P", B: "u", n: "u", w: "o", W: "O", y: "Y" });
const SIMEON = beard(recolor(MARY, { b: "W", B: "A", n: "A", w: "r", W: "T", y: "Y", h: "W" }));
const ANNA = recolor(MARY, { b: "v", B: "V", n: "V", w: "p", W: "P", y: "Y", h: "W" });
const SCRIBE = beard(recolor(MARY, { b: "n", B: "e", n: "e", w: "v", W: "V", y: "y" }));
const MERCHANT = recolor(MARY, { b: "r", B: "T", n: "T", w: "p", W: "P", y: "Y" });
const SWEEPER = recolor(MARY, { b: "g", B: "G", n: "G", w: "P", W: "u", y: "Y" });
/** Jesus at 12: adult Jesus without beard, white shawl instead of red sash, halo ring. */
const JESUS12 = recolor(JESUS, { r: "W", R: "W" }, true).map((row, i) =>
  i === 14 ? row.replace("chsmmshc", "cssmmssc") : i === 15 ? row.replace("hhhhhh", "ssssss") : i === 16 ? row.replace("whhhhw", "wwwwww") : row
);

// ---------- small items ----------

const BABY: PixelMap = [
  "..yyyyyyyy..",
  ".y........y.",
  ".y..hhhh..y.",
  ".y.hssssh.y.",
  ".y.sseess.y.",
  ".y.scssms.y.",
  "..wwssssww..",
  ".wwwwwwwwww.",
  ".wwWwwwwWww.",
  ".WwwwwwwwwW.",
  "..WWWWWWWW..",
];

const SHEEP: PixelMap = [
  "................",
  "....wwwwwwww....",
  "..wwwwwwwwwwww..",
  ".wwwwWwwwwwwWww.",
  ".wwwwwwwwwwwwAAA",
  ".wwWwwwwWwwwAAeA",
  "..wwwwwwwwwwwAA.",
  "...WWWWWWWWW....",
  "...A..A....A..A.",
  "...A..A....A..A.",
  "................",
  "..zzzzzzzzzzz...",
];

function star() {
  const { canvas, ctx } = makeCanvas(17, 17);
  rect(ctx, 7, 0, 3, 17, PAL.y);
  rect(ctx, 0, 7, 17, 3, PAL.y);
  rect(ctx, 5, 5, 7, 7, PAL.l);
  rect(ctx, 7, 7, 3, 3, PAL.w);
  for (const [x, y] of [[3, 3], [13, 3], [3, 13], [13, 13]]) rect(ctx, x, y, 1, 1, PAL.l);
  return canvas;
}

function firewood() {
  const { canvas, ctx } = makeCanvas(16, 12);
  rect(ctx, 1, 10, 14, 2, PAL.z);
  rect(ctx, 1, 6, 13, 2, PAL.u);
  rect(ctx, 3, 3, 12, 2, PAL.o);
  rect(ctx, 0, 8, 10, 2, PAL.O);
  rect(ctx, 13, 3, 2, 2, PAL.P);
  rect(ctx, 0, 8, 2, 2, PAL.P);
  return canvas;
}

function flint() {
  const { canvas, ctx } = makeCanvas(12, 12);
  rect(ctx, 1, 10, 10, 2, PAL.z);
  rect(ctx, 3, 3, 6, 1, PAL.a);
  rect(ctx, 1, 4, 10, 5, PAL.a);
  rect(ctx, 3, 9, 6, 1, PAL.A);
  rect(ctx, 6, 5, 5, 4, PAL.A);
  rect(ctx, 3, 5, 2, 1, PAL.w);
  rect(ctx, 8, 1, 1, 2, PAL.y);
  return canvas;
}

function campfireSheet() {
  const { canvas, ctx } = makeCanvas(32, 20);
  for (let f = 0; f < 2; f++) {
    const x = f * 16;
    rect(ctx, x + 1, 16, 14, 3, PAL.O);
    rect(ctx, x + 3, 14, 10, 3, PAL.o);
    for (const sx of [0, 4, 8, 12]) rect(ctx, x + sx, 17, 3, 3, PAL.a);
    rect(ctx, x + 4, 11, 8, 4, PAL.f);
    rect(ctx, x + 5, 8, 6, 4, PAL.f);
    rect(ctx, x + (f ? 7 : 6), f ? 3 : 4, 4, 8, PAL.y);
    rect(ctx, x + 7, 9, 2, 5, PAL.l);
  }
  return canvas;
}

function templeFlameSheet() {
  const { canvas, ctx } = makeCanvas(24, 14);
  for (let f = 0; f < 2; f++) {
    const x = f * 12;
    rect(ctx, x + 2, 8, 8, 6, PAL.f);
    rect(ctx, x + 3, 5, 6, 4, PAL.f);
    rect(ctx, x + (f ? 5 : 4), f ? 0 : 1, 3, 9, PAL.y);
    rect(ctx, x + 5, 6, 2, 6, PAL.l);
  }
  return canvas;
}

function manger() {
  const { canvas, ctx } = makeCanvas(44, 28);
  rect(ctx, 2, 26, 40, 2, PAL.z);
  rect(ctx, 5, 16, 4, 10, PAL.O);
  rect(ctx, 35, 16, 4, 10, PAL.O);
  rect(ctx, 2, 10, 40, 10, PAL.o);
  rect(ctx, 2, 10, 40, 1, PAL.u);
  rect(ctx, 2, 19, 40, 1, PAL.O);
  rect(ctx, 5, 6, 34, 6, "#e5c15d");
  for (const [x, y, w] of [[7, 5, 8], [18, 7, 10], [30, 5, 7], [12, 9, 6], [26, 10, 8]]) rect(ctx, x, y, w, 1, "#c79b32");
  return canvas;
}

function hayBale() {
  const { canvas, ctx } = makeCanvas(28, 22);
  rect(ctx, 2, 20, 24, 2, PAL.z);
  rect(ctx, 1, 4, 26, 16, "#e5c15d");
  rect(ctx, 1, 4, 26, 2, "#f1d98a");
  rect(ctx, 1, 18, 26, 2, "#c79b32");
  rect(ctx, 6, 4, 2, 16, PAL.u);
  rect(ctx, 19, 4, 2, 16, PAL.u);
  for (const [x, y] of [[10, 9], [14, 13], [3, 12], [22, 10]]) rect(ctx, x, y, 3, 1, "#c79b32");
  return canvas;
}

function stableCave() {
  const D = "#1f1b2d";
  const { canvas, ctx } = makeCanvas(240, 136);
  rect(ctx, 72, 0, 96, 6, PAL.a);
  rect(ctx, 36, 6, 168, 6, PAL.a);
  rect(ctx, 12, 12, 216, 10, PAL.a);
  rect(ctx, 0, 22, 240, 114, PAL.a);
  // shade on the right, highlights on the left
  rect(ctx, 196, 22, 44, 114, PAL.A);
  rect(ctx, 168, 6, 36, 6, PAL.A);
  rect(ctx, 204, 12, 24, 10, PAL.A);
  for (const [x, y, w, h] of [[80, 2, 30, 3], [44, 8, 26, 3], [16, 14, 28, 4], [4, 26, 28, 6], [6, 70, 22, 6], [150, 12, 20, 3], [10, 100, 18, 5]])
    rect(ctx, x, y, w, h, "#b4b8c0");
  for (const [x, y, w] of [[90, 16, 24], [20, 52, 14], [204, 60, 12], [14, 120, 18], [208, 110, 16]]) rect(ctx, x, y, w, 2, PAL.A);
  // wide mouth: back wall, then a lighter earth floor band to walk on
  rect(ctx, 80, 32, 80, 6, D);
  rect(ctx, 60, 38, 120, 6, D);
  rect(ctx, 40, 44, 160, 92, D);
  for (const [x, y, w] of [[70, 54, 14], [150, 60, 18], [100, 76, 10], [52, 84, 12]]) rect(ctx, x, y, w, 1, "#2e2638");
  rect(ctx, 40, 92, 160, 2, "#2e2638");
  rect(ctx, 40, 94, 160, 42, "#4a3f35");
  for (const [x, y, w] of [[50, 100, 10], [90, 118, 8], [130, 104, 12], [170, 124, 10], [64, 128, 8]]) rect(ctx, x, y, w, 1, "#6b5a49");
  for (const [x, y] of [[110, 98], [184, 112], [58, 114]]) rect(ctx, x, y, 2, 2, "#35291f");
  return canvas;
}

function arrowDown() {
  const { canvas, ctx } = makeCanvas(11, 10);
  rect(ctx, 3, 0, 5, 5, PAL.y);
  rect(ctx, 0, 5, 11, 1, PAL.y);
  rect(ctx, 1, 6, 9, 1, PAL.y);
  rect(ctx, 2, 7, 7, 1, PAL.y);
  rect(ctx, 3, 8, 5, 1, PAL.y);
  rect(ctx, 4, 9, 3, 1, PAL.y);
  rect(ctx, 4, 1, 3, 3, PAL.l);
  return canvas;
}

function nightGrass() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#2f4a3a");
  for (const [x, y] of [[2, 3], [9, 1], [13, 7], [5, 11], [11, 13], [1, 14]]) rect(ctx, x, y, 1, 2, "#26402f");
  for (const [x, y] of [[6, 5], [12, 3], [3, 8], [10, 10], [14, 14]]) rect(ctx, x, y, 1, 1, "#3d5c48");
  return canvas;
}

// ---------- temple ----------

function pillar() {
  const { canvas, ctx } = makeCanvas(26, 84);
  rect(ctx, 2, 82, 22, 2, PAL.z);
  rect(ctx, 1, 0, 24, 4, "#f3e9cf");
  rect(ctx, 3, 4, 20, 3, PAL.P);
  rect(ctx, 5, 7, 16, 66, "#e8dcc0");
  rect(ctx, 15, 7, 6, 66, "#cdb896");
  for (const x of [8, 12, 17]) rect(ctx, x, 9, 1, 62, "#d9c79f");
  rect(ctx, 3, 73, 20, 3, PAL.P);
  rect(ctx, 1, 76, 24, 6, "#f3e9cf");
  rect(ctx, 1, 80, 24, 2, PAL.P);
  return canvas;
}

function templeAltar() {
  const { canvas, ctx } = makeCanvas(64, 40);
  rect(ctx, 4, 38, 56, 2, PAL.z);
  rect(ctx, 6, 12, 52, 26, PAL.a);
  rect(ctx, 44, 12, 14, 26, PAL.A);
  rect(ctx, 2, 8, 60, 6, "#b4b8c0");
  rect(ctx, 2, 13, 60, 1, PAL.A);
  for (const x of [2, 56]) {
    rect(ctx, x, 2, 6, 7, PAL.y);
    rect(ctx, x, 2, 6, 1, PAL.l);
  }
  rect(ctx, 14, 18, 36, 2, PAL.Y);
  rect(ctx, 14, 30, 36, 2, PAL.Y);
  rect(ctx, 28, 21, 8, 8, PAL.y);
  rect(ctx, 30, 23, 4, 4, PAL.Y);
  return canvas;
}

function menorah() {
  const { canvas, ctx } = makeCanvas(30, 44);
  rect(ctx, 6, 42, 18, 2, PAL.z);
  const arms = [3, 7, 11, 14, 17, 21, 25];
  rect(ctx, 14, 12, 2, 28, PAL.y);
  rect(ctx, 3, 24, 24, 2, PAL.y);
  rect(ctx, 3, 12, 2, 13, PAL.y);
  rect(ctx, 25, 12, 2, 13, PAL.y);
  rect(ctx, 7, 12, 2, 13, PAL.y);
  rect(ctx, 21, 12, 2, 13, PAL.y);
  rect(ctx, 11, 12, 2, 13, PAL.y);
  rect(ctx, 17, 12, 2, 13, PAL.y);
  for (const x of arms) {
    rect(ctx, x - 1, 10, 4, 2, PAL.Y);
    rect(ctx, x, 6, 2, 4, PAL.f);
    rect(ctx, x, 7, 2, 2, PAL.l);
  }
  rect(ctx, 10, 38, 10, 2, PAL.Y);
  rect(ctx, 7, 40, 16, 2, PAL.Y);
  return canvas;
}

function veil() {
  const { canvas, ctx } = makeCanvas(56, 76);
  rect(ctx, 0, 0, 56, 5, PAL.Y);
  rect(ctx, 0, 0, 56, 1, PAL.y);
  for (let i = 0; i < 7; i++) rect(ctx, i * 8, 5, 8, 66, i % 2 ? PAL.V : PAL.v);
  for (const x of [0, 16, 32, 48]) rect(ctx, x + 6, 5, 2, 66, "#4c1d95");
  rect(ctx, 24, 28, 8, 12, PAL.y);
  rect(ctx, 20, 32, 16, 4, PAL.y);
  rect(ctx, 27, 31, 2, 6, PAL.l);
  rect(ctx, 0, 71, 56, 5, PAL.y);
  for (let x = 1; x < 56; x += 4) rect(ctx, x, 73, 2, 3, PAL.Y);
  return canvas;
}

function birdCage() {
  const { canvas, ctx } = makeCanvas(20, 26);
  rect(ctx, 2, 24, 16, 2, PAL.z);
  rect(ctx, 8, 0, 4, 2, PAL.Y);
  rect(ctx, 4, 2, 12, 2, PAL.Y);
  for (const x of [3, 7, 11, 15]) rect(ctx, x, 4, 1, 16, PAL.y);
  rect(ctx, 2, 20, 16, 4, PAL.o);
  rect(ctx, 2, 20, 16, 1, PAL.u);
  return canvas;
}

function rugTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#9d2a4a");
  rect(ctx, 6, 6, 4, 4, PAL.y);
  rect(ctx, 7, 7, 2, 2, "#9d2a4a");
  for (const [x, y] of [[0, 0], [14, 0], [0, 14], [14, 14]]) rect(ctx, x, y, 2, 2, "#7f1d3a");
  return canvas;
}

// ---------- Jerusalem street ----------

function cobbleTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#b9ad98");
  for (const [x, y, w, h] of [[0, 0, 7, 7], [8, 0, 8, 7], [0, 8, 5, 8], [6, 8, 10, 8]]) {
    rect(ctx, x, y, w, h, "#cfc4ae");
    rect(ctx, x, y + h - 1, w, 1, "#a39781");
  }
  for (const [x, y] of [[2, 2], [11, 3], [8, 11]]) rect(ctx, x, y, 1, 1, "#e3dac6");
  return canvas;
}

function stoneWall() {
  const { canvas, ctx } = makeCanvas(32, 48);
  rect(ctx, 0, 0, 32, 48, "#e0cfa8");
  rect(ctx, 0, 0, 32, 4, "#f1e4c4");
  rect(ctx, 0, 4, 32, 1, "#bfae86");
  for (const y of [14, 24, 34]) rect(ctx, 0, y, 32, 1, "#c9b98f");
  for (const [x, y] of [[8, 5], [24, 15], [4, 25], [20, 35]]) rect(ctx, x, y, 1, 9, "#c9b98f");
  rect(ctx, 0, 44, 32, 4, "#a68f66");
  return canvas;
}

function marketStall() {
  const { canvas, ctx } = makeCanvas(64, 56);
  rect(ctx, 4, 54, 56, 2, PAL.z);
  rect(ctx, 6, 14, 3, 40, PAL.O);
  rect(ctx, 55, 14, 3, 40, PAL.O);
  for (let i = 0; i < 8; i++) rect(ctx, i * 8, 0, 8, 14, i % 2 ? PAL.w : PAL.r);
  rect(ctx, 0, 14, 64, 2, PAL.T);
  for (let i = 0; i < 8; i++) rect(ctx, i * 8, 16, 8, 3, i % 2 ? PAL.W : PAL.T);
  rect(ctx, 4, 34, 56, 6, PAL.o);
  rect(ctx, 4, 34, 56, 1, PAL.u);
  rect(ctx, 6, 40, 52, 14, PAL.O);
  // goods: fruit, bread, jar
  for (const [x, c] of [[10, PAL.r], [16, PAL.y], [22, PAL.r], [28, PAL.g]] as [number, string][]) rect(ctx, x, 29, 5, 5, c);
  rect(ctx, 38, 30, 10, 4, PAL.P);
  rect(ctx, 52, 26, 5, 8, PAL.t);
  return canvas;
}

function crate() {
  const { canvas, ctx } = makeCanvas(20, 20);
  rect(ctx, 1, 18, 18, 2, PAL.z);
  rect(ctx, 1, 2, 18, 16, PAL.o);
  rect(ctx, 1, 2, 18, 2, PAL.u);
  rect(ctx, 1, 16, 18, 2, PAL.O);
  rect(ctx, 2, 9, 16, 2, PAL.O);
  rect(ctx, 3, 3, 2, 14, PAL.O);
  rect(ctx, 15, 3, 2, 14, PAL.O);
  return canvas;
}

function templeSteps() {
  const { canvas, ctx } = makeCanvas(112, 24);
  for (let i = 0; i < 3; i++) {
    rect(ctx, i * 4, i * 8, 112 - i * 8, 8, i % 2 ? "#e8dcc0" : "#f3e9cf");
    rect(ctx, i * 4, i * 8 + 7, 112 - i * 8, 1, PAL.P);
  }
  return canvas;
}

function templeGate() {
  const { canvas, ctx } = makeCanvas(72, 88);
  rect(ctx, 0, 0, 72, 10, "#f3e9cf");
  rect(ctx, 0, 10, 72, 2, PAL.P);
  rect(ctx, 0, 12, 10, 76, "#e8dcc0");
  rect(ctx, 62, 12, 10, 76, "#cdb896");
  rect(ctx, 10, 12, 52, 76, PAL.O);
  rect(ctx, 12, 14, 24, 74, PAL.o);
  rect(ctx, 36, 14, 24, 74, PAL.o);
  rect(ctx, 34, 12, 4, 76, PAL.O);
  for (const y of [24, 46, 68]) {
    rect(ctx, 12, y, 24, 2, PAL.Y);
    rect(ctx, 36, y, 24, 2, PAL.Y);
  }
  rect(ctx, 28, 50, 4, 6, PAL.y);
  rect(ctx, 40, 50, 4, 6, PAL.y);
  rect(ctx, 0, 86, 72, 2, PAL.z);
  return canvas;
}

function parapet() {
  const { canvas, ctx } = makeCanvas(16, 24);
  rect(ctx, 0, 0, 16, 24, "#d9c79f");
  rect(ctx, 0, 0, 16, 4, "#f3e9cf");
  rect(ctx, 0, 4, 16, 1, "#a68f66");
  rect(ctx, 0, 12, 16, 1, "#c4b186");
  rect(ctx, 8, 5, 1, 7, "#c4b186");
  rect(ctx, 0, 20, 16, 4, "#a68f66");
  return canvas;
}

/** Register every texture stages 3-5 need (idempotent). */
export function registerInfancyTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  const sheet = (key: string, make: () => HTMLCanvasElement, fw: number, fh: number) => {
    if (!tex.exists(key)) tex.addSpriteSheet(key, make() as unknown as HTMLImageElement, { frameWidth: fw, frameHeight: fh });
  };
  for (const [k, m] of Object.entries({
    joseph: JOSEPH, shepherd: SHEPHERD, simeon: SIMEON, anna: ANNA, scribe: SCRIBE,
    merchant: MERCHANT, sweeper: SWEEPER, jesus12: JESUS12, baby: BABY, sheep: SHEEP,
  }))
    add(k, () => fromMap(m));
  add("star_big", star);
  add("firewood", firewood);
  add("flint", flint);
  sheet("campfire", campfireSheet, 16, 20);
  sheet("temple_flame", templeFlameSheet, 12, 14);
  add("manger", manger);
  add("hay_bale", hayBale);
  add("stable_cave", stableCave);
  add("arrow_down", arrowDown);
  add("night_grass", nightGrass);
  add("temple_pillar", pillar);
  add("temple_altar", templeAltar);
  add("menorah", menorah);
  add("temple_veil", veil);
  add("bird_cage", birdCage);
  add("rug_tile", rugTile);
  add("cobble_tile", cobbleTile);
  add("stone_wall", stoneWall);
  add("market_stall", marketStall);
  add("crate", crate);
  add("temple_steps", templeSteps);
  add("temple_gate", templeGate);
  add("parapet", parapet);
}
