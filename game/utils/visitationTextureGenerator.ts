import * as Phaser from "phaser";
import { PAL, type PixelMap, drawMap, makeCanvas, rect } from "./pixelArt";
import { MARY } from "./npcTextureGenerator";

/** Pixel-art textures for stage 2 (Visitation, hill country of Judea). Integer rects + PixelMaps only. */

export const fromMap = (map: PixelMap) => {
  const { canvas, ctx } = makeCanvas(map[0].length, map.length);
  drawMap(ctx, map);
  return canvas;
};

/** Same chibi body as Mary, recoloured; rows 2-5 lose the halo. */
export const recolor = (map: PixelMap, sub: Record<string, string>, halo = false): PixelMap =>
  map.map((row, i) =>
    [...row].map((ch) => (!halo && i >= 2 && i <= 5 && ch === "y" ? "." : (sub[ch] ?? ch))).join("")
  );

const ELIZABETH = recolor(MARY, { b: "t", B: "T", n: "T", w: "p", W: "P", y: "Y", h: "W" });
const ZECHARIAH = recolor(MARY, { b: "o", B: "O", n: "O", w: "P", W: "u", y: "Y", h: "W" }).map((row, i) =>
  i === 15 ? row.replace("ssssss", "wwwwww") : row // white beard
);

const FLOWER_W: PixelMap = [".w.", "wyw", ".w.", ".G.", ".G."];
const FLOWER_P: PixelMap = [".q.", "qyq", ".q.", ".G.", ".G."];
const FLOWER_Y: PixelMap = [".y.", "yly", ".y.", ".G.", ".G."];

function grassTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#7ea550");
  for (const [x, y] of [[2, 3], [9, 1], [13, 7], [5, 11], [11, 13], [1, 14]]) rect(ctx, x, y, 1, 2, "#6c9244");
  for (const [x, y] of [[6, 5], [12, 3], [3, 8], [10, 10], [14, 14]]) rect(ctx, x, y, 1, 1, "#97bd62");
  return canvas;
}

function dirtTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#cfa86e");
  for (const [x, y] of [[3, 2], [10, 5], [6, 10], [13, 13]]) rect(ctx, x, y, 2, 1, "#b98f57");
  for (const [x, y] of [[8, 2], [2, 8], [12, 9]]) rect(ctx, x, y, 2, 1, "#e0c088");
  rect(ctx, 5, 13, 2, 2, "#a07a48");
  return canvas;
}

function waterTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#3b82c4");
  rect(ctx, 2, 4, 6, 1, "#8fd0f5");
  rect(ctx, 10, 11, 5, 1, "#8fd0f5");
  rect(ctx, 0, 9, 3, 1, "#2563a8");
  rect(ctx, 8, 14, 4, 1, "#2563a8");
  rect(ctx, 12, 2, 3, 1, "#2563a8");
  return canvas;
}

function boulder() {
  const { canvas, ctx } = makeCanvas(32, 24);
  rect(ctx, 2, 22, 28, 2, PAL.z);
  rect(ctx, 9, 1, 14, 2, "#8b8f98");
  rect(ctx, 6, 3, 20, 3, "#8b8f98");
  rect(ctx, 3, 6, 26, 5, "#8b8f98");
  rect(ctx, 1, 10, 30, 10, "#8b8f98");
  rect(ctx, 3, 20, 26, 2, "#8b8f98");
  rect(ctx, 8, 3, 8, 2, "#b4b8c0");
  rect(ctx, 5, 7, 6, 3, "#b4b8c0");
  rect(ctx, 3, 12, 3, 4, "#b4b8c0");
  rect(ctx, 24, 8, 6, 12, "#6b6f78");
  rect(ctx, 4, 19, 24, 3, "#6b6f78");
  rect(ctx, 14, 8, 1, 5, "#5b5f68");
  rect(ctx, 15, 12, 4, 1, "#5b5f68");
  return canvas;
}

function thornBush() {
  const { canvas, ctx } = makeCanvas(40, 26);
  rect(ctx, 4, 24, 32, 2, PAL.z);
  rect(ctx, 14, 2, 12, 6, "#3d5a26");
  rect(ctx, 8, 6, 24, 8, "#3d5a26");
  rect(ctx, 4, 12, 32, 12, "#3d5a26");
  rect(ctx, 1, 16, 38, 7, "#3d5a26");
  for (const [x, y, w] of [[10, 8, 8], [5, 14, 10], [22, 12, 8], [28, 18, 7]]) rect(ctx, x, y, w, 2, "#587a36");
  for (const [x, y, w] of [[6, 18, 12], [20, 15, 10], [12, 11, 8]]) rect(ctx, x, y, w, 1, PAL.O);
  for (const [x, y] of [[3, 12], [0, 17], [36, 14], [39, 19], [8, 4], [30, 5], [19, 0], [24, 2], [14, 3], [2, 22], [37, 23]])
    rect(ctx, x, y, 1, 2, PAL.u);
  for (const [x, y] of [[12, 12], [26, 19], [18, 21]]) rect(ctx, x, y, 2, 2, PAL.r);
  return canvas;
}

function woodPlank() {
  const { canvas, ctx } = makeCanvas(32, 12);
  rect(ctx, 2, 10, 28, 2, PAL.z);
  rect(ctx, 0, 3, 32, 6, "#a0622d");
  rect(ctx, 0, 3, 32, 1, "#c98a4b");
  rect(ctx, 0, 8, 32, 1, "#6b3a17");
  rect(ctx, 4, 5, 8, 1, "#8a5224");
  rect(ctx, 18, 6, 10, 1, "#8a5224");
  rect(ctx, 2, 5, 1, 1, PAL.W);
  rect(ctx, 29, 5, 1, 1, PAL.W);
  return canvas;
}

function plankBridge() {
  const { canvas, ctx } = makeCanvas(40, 38);
  for (let i = 0; i < 6; i++) {
    rect(ctx, 3, i * 6 + 1, 34, 5, i % 2 ? "#a0622d" : "#8f5424");
    rect(ctx, 3, i * 6 + 1, 34, 1, "#c98a4b");
  }
  rect(ctx, 0, 0, 3, 38, PAL.O);
  rect(ctx, 37, 0, 3, 38, PAL.O);
  rect(ctx, 0, 0, 1, 38, PAL.o);
  rect(ctx, 37, 0, 1, 38, PAL.o);
  return canvas;
}

function hillTree() {
  const { canvas, ctx } = makeCanvas(40, 56);
  rect(ctx, 8, 52, 24, 3, PAL.z);
  rect(ctx, 17, 34, 6, 18, "#7c5a3a");
  rect(ctx, 21, 34, 2, 18, "#5f4229");
  rect(ctx, 15, 50, 10, 2, "#5f4229");
  const blobs: [number, number, number, number][] = [[12, 6, 16, 4], [6, 10, 28, 6], [2, 16, 36, 10], [4, 26, 32, 6], [10, 32, 20, 4]];
  for (const [x, y, w, h] of blobs) rect(ctx, x, y, w, h, "#5f8a3c");
  for (const [x, y, w, h] of [[24, 12, 10, 4], [22, 20, 16, 6], [20, 28, 14, 5], [22, 33, 8, 3]]) rect(ctx, x, y, w, h, "#476b2c");
  for (const [x, y, w, h] of [[14, 6, 8, 2], [8, 11, 10, 2], [4, 18, 10, 3], [7, 27, 8, 2]]) rect(ctx, x, y, w, h, "#86b04f");
  for (const [x, y] of [[10, 20], [26, 17], [18, 29], [30, 24], [14, 13]]) rect(ctx, x, y, 1, 1, "#2f2a4a");
  return canvas;
}

function house() {
  const { canvas, ctx } = makeCanvas(112, 84);
  rect(ctx, 0, 0, 112, 8, "#c9b48a");
  rect(ctx, 0, 8, 112, 2, "#a68f66");
  rect(ctx, 4, 10, 104, 64, "#ecdcb8");
  rect(ctx, 100, 10, 8, 64, "#d7c298");
  for (const y of [22, 34, 46, 58]) rect(ctx, 4, y, 104, 1, "#d9c79f");
  rect(ctx, 4, 74, 104, 6, "#9c8660");
  rect(ctx, 4, 80, 104, 4, PAL.z);
  // door
  rect(ctx, 44, 34, 24, 2, "#cdb896");
  rect(ctx, 44, 36, 2, 38, "#cdb896");
  rect(ctx, 66, 36, 2, 38, "#cdb896");
  rect(ctx, 46, 38, 20, 36, PAL.O);
  rect(ctx, 48, 40, 16, 34, PAL.o);
  rect(ctx, 55, 40, 2, 34, PAL.O);
  rect(ctx, 60, 58, 2, 2, PAL.y);
  // windows + terracotta shutters
  for (const x of [14, 82]) {
    rect(ctx, x, 26, 16, 18, PAL.O);
    rect(ctx, x + 2, 28, 12, 14, "#2b2a4a");
    rect(ctx, x + 7, 28, 2, 14, PAL.O);
    rect(ctx, x + 2, 34, 12, 2, PAL.O);
    rect(ctx, x - 3, 26, 3, 18, PAL.t);
    rect(ctx, x + 16, 26, 3, 18, PAL.t);
  }
  // hanging vine on the left corner
  for (const [x, y, h] of [[6, 10, 20], [8, 10, 12], [10, 10, 26]]) rect(ctx, x, y, 2, h, PAL.G);
  for (const [x, y] of [[6, 28], [10, 34], [8, 20]]) rect(ctx, x, y, 2, 2, PAL.g);
  return canvas;
}

function springPool() {
  const { canvas, ctx } = makeCanvas(44, 26);
  rect(ctx, 2, 22, 40, 3, PAL.z);
  rect(ctx, 6, 4, 32, 18, "#8b8f98");
  rect(ctx, 2, 8, 40, 11, "#8b8f98");
  rect(ctx, 5, 9, 34, 8, "#3b82c4");
  rect(ctx, 8, 7, 28, 3, "#3b82c4");
  rect(ctx, 8, 16, 28, 3, "#3b82c4");
  rect(ctx, 12, 11, 8, 1, "#8fd0f5");
  rect(ctx, 26, 14, 6, 1, "#8fd0f5");
  rect(ctx, 8, 4, 12, 2, "#b4b8c0");
  rect(ctx, 2, 8, 3, 4, "#b4b8c0");
  rect(ctx, 30, 18, 8, 3, "#6b6f78");
  return canvas;
}

function waterJar() {
  const { canvas, ctx } = makeCanvas(14, 20);
  rect(ctx, 1, 18, 12, 2, PAL.z);
  rect(ctx, 3, 2, 8, 1, PAL.T);
  rect(ctx, 4, 3, 6, 3, "#7dd3fc");
  rect(ctx, 2, 6, 10, 12, PAL.t);
  rect(ctx, 1, 8, 12, 8, PAL.t);
  rect(ctx, 10, 6, 2, 12, PAL.T);
  rect(ctx, 12, 8, 1, 8, PAL.T);
  rect(ctx, 3, 7, 1, 6, "#e08a55");
  rect(ctx, 2, 11, 10, 1, PAL.T);
  return canvas;
}

/** Register every texture the Visitation scene needs (idempotent). */
export function registerVisitationTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  add("grass_tile", grassTile);
  add("dirt_tile", dirtTile);
  add("water_tile", waterTile);
  add("boulder", boulder);
  add("thorn_bush", thornBush);
  add("wood_plank", woodPlank);
  add("plank_bridge", plankBridge);
  add("hill_tree", hillTree);
  add("elizabeth_house", house);
  add("spring_pool", springPool);
  add("water_jar", waterJar);
  add("flower_w", () => fromMap(FLOWER_W));
  add("flower_p", () => fromMap(FLOWER_P));
  add("flower_y", () => fromMap(FLOWER_Y));
  add("elizabeth", () => fromMap(ELIZABETH));
  add("zechariah", () => fromMap(ZECHARIAH));
}
