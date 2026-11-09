import * as Phaser from "phaser";
import { PAL, type PixelMap, makeCanvas, rect } from "./pixelArt";
import { MARY } from "./npcTextureGenerator";
import { JESUS } from "./lightTextureGenerator";
import { fromMap, recolor, registerVisitationTextures } from "./visitationTextureGenerator";
import { registerAnnunciationTextures } from "./npcTextureGenerator";
import { registerInfancyTextures } from "./infancyTextureGenerator";
import { registerLightTextures } from "./lightTextureGenerator";
import { registerCanaTextures } from "./canaTextureGenerator";
import { registerGalileeTextures } from "./galileeTextureGenerator";
import { registerPassionTextures } from "./passionTextureGenerator";

/** Pixel-art textures for stages 16-20 (empty tomb, Olivet, Upper Room fire, Mary's tomb, heaven). Integer rects + PixelMaps only. */

const beard = (rows: string[]) => rows.map((row, i) => (i === 15 ? row.replace("ssssss", "wwwwww") : row));

const PEOPLE = {
  // risen Lord: same body as Jesus, gold sash instead of red, halo kept
  jesus_risen: recolor(JESUS, { r: "y", R: "Y" }, true),
  magdalene: recolor(MARY, { b: "v", B: "V", n: "V", w: "p", W: "P", y: "Y" }),
  mary_glory: recolor(MARY, { b: "w", B: "W", n: "y", w: "w", W: "W" }, true),
  god_father: beard(recolor(MARY, { b: "y", B: "Y", n: "Y", w: "w", W: "W", h: "W" }, true)),
  apostle_d: recolor(MARY, { b: "f", B: "R", n: "R", w: "P", W: "u", y: "Y" }),
  apostle_e: recolor(MARY, { b: "k", B: "b", n: "b", w: "p", W: "P", y: "Y" }),
  apostle_f: recolor(MARY, { b: "q", B: "v", n: "V", w: "w", W: "W", y: "Y" }),
};

/** 14x14 compass icons for the Ascension mission. */
const icon = (draw: (c: CanvasRenderingContext2D) => void) => {
  const { canvas, ctx } = makeCanvas(14, 14);
  draw(ctx);
  return canvas;
};
const sun = () =>
  icon((c) => {
    rect(c, 4, 4, 6, 6, PAL.y); rect(c, 3, 5, 8, 4, PAL.y); rect(c, 5, 3, 4, 8, PAL.y); rect(c, 6, 6, 2, 2, PAL.l);
    for (const [x, y] of [[6, 0], [6, 12], [0, 6], [12, 6], [2, 2], [10, 2], [2, 10], [10, 10]]) rect(c, x, y, 2, 2, PAL.Y);
  });
const moon = () =>
  icon((c) => {
    rect(c, 4, 1, 6, 12, "#c7d2fe"); rect(c, 2, 3, 10, 8, "#c7d2fe"); rect(c, 6, 1, 6, 12, PAL.e); rect(c, 8, 3, 5, 8, PAL.e);
    rect(c, 4, 3, 2, 2, PAL.w);
  });
const flowerSouth = () =>
  icon((c) => {
    rect(c, 6, 7, 2, 6, PAL.G); rect(c, 3, 10, 3, 2, PAL.g); rect(c, 8, 9, 3, 2, PAL.g);
    rect(c, 5, 1, 4, 6, PAL.q); rect(c, 3, 3, 8, 2, PAL.q); rect(c, 6, 3, 2, 2, PAL.y);
  });
const starNorth = () =>
  icon((c) => {
    rect(c, 6, 0, 2, 14, PAL.l); rect(c, 0, 6, 14, 2, PAL.l); rect(c, 3, 3, 8, 8, PAL.y); rect(c, 5, 5, 4, 4, PAL.w);
  });

function tombFace() {
  const { canvas, ctx } = makeCanvas(80, 64);
  rect(ctx, 0, 62, 80, 2, PAL.z);
  rect(ctx, 4, 6, 72, 56, "#9a948a"); // rock mound
  rect(ctx, 10, 0, 60, 8, "#9a948a");
  rect(ctx, 4, 6, 72, 3, "#b8b2a6");
  rect(ctx, 4, 58, 72, 4, "#77726a");
  for (const [x, y, w] of [[10, 18, 14], [52, 14, 12], [58, 40, 14], [8, 46, 12]]) rect(ctx, x, y, w, 2, "#77726a");
  rect(ctx, 22, 24, 36, 38, PAL.e); // dark doorway
  rect(ctx, 24, 22, 32, 2, PAL.e);
  rect(ctx, 20, 22, 2, 40, "#77726a");
  rect(ctx, 58, 22, 2, 40, "#77726a");
  rect(ctx, 28, 30, 24, 32, "#1e293b"); // bright glow inside: the tomb is empty
  rect(ctx, 34, 36, 12, 26, "#334155");
  return canvas;
}

function rolledStone() {
  const { canvas, ctx } = makeCanvas(28, 34);
  rect(ctx, 2, 32, 24, 2, PAL.z);
  rect(ctx, 8, 0, 12, 2, "#a8a29a");
  rect(ctx, 4, 2, 20, 2, "#a8a29a"); rect(ctx, 2, 4, 24, 24, "#a8a29a"); rect(ctx, 4, 28, 20, 2, "#8a847c");
  rect(ctx, 8, 30, 12, 2, "#8a847c");
  rect(ctx, 4, 4, 6, 3, "#c9c3b8");
  rect(ctx, 16, 20, 8, 8, "#8a847c");
  rect(ctx, 10, 12, 1, 6, "#77726a");
  return canvas;
}

function tombFloor() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#5b5650");
  rect(ctx, 0, 7, 16, 1, "#47433e"); rect(ctx, 7, 0, 1, 8, "#47433e"); rect(ctx, 11, 8, 1, 8, "#47433e");
  rect(ctx, 2, 2, 3, 1, "#6b665f");
  return canvas;
}

function linen(folded: boolean) {
  const { canvas, ctx } = makeCanvas(18, 10);
  if (folded) {
    rect(ctx, 2, 3, 14, 6, PAL.W); rect(ctx, 2, 3, 14, 4, PAL.w); rect(ctx, 5, 4, 8, 1, PAL.W); rect(ctx, 5, 6, 8, 1, PAL.W);
  } else {
    rect(ctx, 1, 2, 16, 4, PAL.w); rect(ctx, 3, 6, 12, 2, PAL.W); rect(ctx, 5, 2, 1, 4, PAL.W); rect(ctx, 11, 2, 1, 4, PAL.W);
  }
  return canvas;
}

function stoneBench() {
  const { canvas, ctx } = makeCanvas(44, 22);
  rect(ctx, 2, 18, 40, 3, PAL.z);
  rect(ctx, 0, 4, 44, 14, "#8a847c"); rect(ctx, 0, 4, 44, 3, "#b8b2a6"); rect(ctx, 0, 15, 44, 3, "#6b665f");
  rect(ctx, 12, 10, 20, 1, "#77726a");
  return canvas;
}

function banner() {
  const { canvas, ctx } = makeCanvas(14, 36);
  rect(ctx, 1, 0, 2, 36, PAL.O);
  rect(ctx, 3, 2, 10, 14, PAL.w); rect(ctx, 3, 14, 10, 2, PAL.W);
  rect(ctx, 7, 4, 2, 10, PAL.r); rect(ctx, 5, 7, 6, 2, PAL.r);
  return canvas;
}

function jerusalem() {
  const { canvas, ctx } = makeCanvas(240, 44);
  rect(ctx, 0, 36, 240, 8, "#b99a6a");
  const towers: [number, number, number][] = [[6, 20, 18], [30, 14, 26], [64, 24, 14], [90, 8, 32], [130, 18, 22], [166, 12, 28], [204, 22, 16]];
  for (const [x, top, w] of towers) {
    rect(ctx, x, top, w, 40 - top, "#d9c39b");
    rect(ctx, x, top, w, 2, "#efe0bd");
    rect(ctx, x + w - 3, top + 2, 3, 40 - top, "#b99a6a");
    rect(ctx, x + 4, top + 8, 3, 5, PAL.u);
  }
  rect(ctx, 96, 0, 20, 8, PAL.y); rect(ctx, 100, 0, 12, 2, PAL.l); // gilded dome
  return canvas;
}

function fireTongue() {
  const { canvas, ctx } = makeCanvas(10, 14);
  rect(ctx, 4, 0, 2, 3, PAL.l); rect(ctx, 3, 3, 4, 4, PAL.y); rect(ctx, 2, 6, 6, 5, PAL.f); rect(ctx, 3, 11, 4, 2, PAL.Y);
  rect(ctx, 4, 5, 2, 4, PAL.l);
  return canvas;
}

function star(size: 7 | 11) {
  const { canvas, ctx } = makeCanvas(size, size);
  const c = (size - 1) / 2;
  rect(ctx, c, 0, 1, size, PAL.y); rect(ctx, 0, c, size, 1, PAL.y);
  rect(ctx, c - 1, c - 1, 3, 3, PAL.l);
  if (size === 11) for (const [x, y] of [[2, 2], [8, 2], [2, 8], [8, 8]]) rect(ctx, x, y, 1, 1, PAL.Y);
  return canvas;
}

function bead(color: string, shade: string) {
  const { canvas, ctx } = makeCanvas(8, 8);
  rect(ctx, 2, 0, 4, 8, color); rect(ctx, 0, 2, 8, 4, color); rect(ctx, 1, 1, 6, 6, color);
  rect(ctx, 2, 6, 5, 1, shade); rect(ctx, 6, 3, 1, 3, shade); rect(ctx, 2, 2, 2, 2, PAL.w);
  return canvas;
}

/** Wreath ring: gold band, pixel-stepped (no antialiasing), 12 star studs are added in the scene. */
function crownRing() {
  const S = 64;
  const { canvas, ctx } = makeCanvas(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const d = Math.hypot(x + 0.5 - S / 2, y + 0.5 - S / 2);
      if (d >= 25 && d < 29) rect(ctx, x, y, 1, 1, y > S / 2 + 6 ? PAL.Y : PAL.y);
      else if (d >= 24 && d < 25) rect(ctx, x, y, 1, 1, PAL.l);
    }
  return canvas;
}

/** Small gold royal crown held over Mary's head: 3 points on a band. */
function crownSmall() {
  const { canvas, ctx } = makeCanvas(14, 8);
  rect(ctx, 1, 4, 12, 4, PAL.y); rect(ctx, 1, 7, 12, 1, PAL.Y);
  for (const x of [1, 6, 11]) rect(ctx, x, 1, 2, 3, PAL.y);
  for (const x of [1, 6, 11]) rect(ctx, x, 0, 2, 1, PAL.l);
  rect(ctx, 6, 5, 2, 2, PAL.w);
  return canvas;
}

function pedestal() {
  const { canvas, ctx } = makeCanvas(40, 30);
  rect(ctx, 2, 26, 36, 3, PAL.z);
  rect(ctx, 0, 4, 40, 4, PAL.l); rect(ctx, 0, 8, 40, 6, PAL.w); rect(ctx, 4, 14, 32, 12, PAL.W); rect(ctx, 0, 24, 40, 3, PAL.y);
  rect(ctx, 6, 14, 2, 10, PAL.w); rect(ctx, 32, 14, 2, 10, PAL.w);
  return canvas;
}

function emptyTomb() {
  const w = 104; // wide enough for a row of seven lilies
  const { canvas, ctx } = makeCanvas(w, 40);
  rect(ctx, 2, 36, w - 4, 3, PAL.z);
  rect(ctx, 0, 6, w, 30, "#b8b2a6"); rect(ctx, 0, 6, w, 3, "#d6d0c4"); rect(ctx, 0, 32, w, 4, "#8a847c");
  rect(ctx, 6, 12, w - 12, 18, "#1e293b"); rect(ctx, 8, 14, w - 16, 14, "#475569");
  rect(ctx, w / 2 - 4, 0, 8, 8, "#b8b2a6");
  return canvas;
}

function cloudTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#e0f2fe");
  rect(ctx, 0, 0, 7, 3, "#ffffff"); rect(ctx, 9, 8, 7, 3, "#ffffff"); rect(ctx, 3, 12, 5, 2, "#bae6fd");
  rect(ctx, 12, 2, 3, 2, "#bae6fd");
  return canvas;
}

function goldTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#fde68a");
  rect(ctx, 0, 0, 16, 1, PAL.l); rect(ctx, 0, 0, 1, 16, PAL.l); rect(ctx, 0, 15, 16, 1, PAL.y); rect(ctx, 15, 0, 1, 16, PAL.y);
  rect(ctx, 7, 7, 2, 2, PAL.y);
  return canvas;
}

function roseBush() {
  const { canvas, ctx } = makeCanvas(18, 20);
  rect(ctx, 1, 18, 16, 2, PAL.z);
  rect(ctx, 2, 8, 14, 10, PAL.G); rect(ctx, 4, 6, 10, 4, PAL.g);
  for (const [x, y] of [[4, 6], [10, 5], [7, 10], [12, 11], [3, 12]]) { rect(ctx, x, y, 3, 3, PAL.w); rect(ctx, x + 1, y + 1, 1, 1, PAL.W); }
  return canvas;
}

function lily() {
  const { canvas, ctx } = makeCanvas(12, 20);
  rect(ctx, 5, 9, 2, 11, PAL.G); rect(ctx, 2, 14, 3, 2, PAL.g); rect(ctx, 7, 12, 3, 2, PAL.g);
  rect(ctx, 3, 2, 6, 7, PAL.w); rect(ctx, 1, 3, 10, 3, PAL.w); rect(ctx, 5, 0, 2, 3, PAL.w);
  rect(ctx, 3, 7, 6, 2, PAL.W); rect(ctx, 5, 3, 2, 4, PAL.y);
  return canvas;
}

function windGust() {
  const { canvas, ctx } = makeCanvas(32, 8);
  rect(ctx, 0, 1, 20, 1, "#e0f2fe"); rect(ctx, 20, 0, 8, 1, "#e0f2fe"); rect(ctx, 28, 1, 3, 2, "#e0f2fe");
  rect(ctx, 6, 5, 18, 1, "#bae6fd"); rect(ctx, 24, 4, 6, 1, "#bae6fd");
  return canvas;
}

/** Register every texture stages 16-20 need (idempotent). */
export function registerGloryTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  for (const [k, m] of Object.entries(PEOPLE)) add(k, () => fromMap(m as PixelMap));
  add("icon_east", sun);
  add("icon_west", moon);
  add("icon_south", flowerSouth);
  add("icon_north", starNorth);
  add("tomb_face", tombFace);
  add("rolled_stone", rolledStone);
  add("tomb_floor", tombFloor);
  add("linen", () => linen(false));
  add("linen_folded", () => linen(true));
  add("stone_bench", stoneBench);
  add("banner", banner);
  add("jerusalem", jerusalem);
  add("fire_tongue", fireTongue);
  add("star_s", () => star(7));
  add("star_m", () => star(11));
  add("bead_gold", () => bead(PAL.y, PAL.Y));
  add("bead_white", () => bead(PAL.w, PAL.W));
  add("crown_ring", crownRing);
  add("crown_small", crownSmall);
  add("pedestal", pedestal);
  add("empty_tomb", emptyTomb);
  add("cloud_tile", cloudTile);
  add("gold_tile", goldTile);
  add("rose_bush", roseBush);
  add("wind_gust", windGust);
  add("lily_big", lily);
}

/** Everything the Glorious scenes can use: all earlier sets + glory + the angel / dove flap animations. */
export function registerAllForGlory(scene: Phaser.Scene) {
  registerAnnunciationTextures(scene);
  registerVisitationTextures(scene);
  registerInfancyTextures(scene);
  registerLightTextures(scene);
  registerCanaTextures(scene);
  registerGalileeTextures(scene);
  registerPassionTextures(scene);
  registerGloryTextures(scene);
  const anim = (key: string, tex: string) => {
    if (!scene.anims.exists(key)) scene.anims.create({ key, frames: scene.anims.generateFrameNumbers(tex, { frames: [0, 1] }), frameRate: 3, repeat: -1 });
  };
  anim("angel_flap", "archangel_gabriel");
  anim("spirit_flap", "holy_spirit_dove");
  anim("candle_burn", "candle_flame");
}
