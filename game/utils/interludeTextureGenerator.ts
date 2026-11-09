import * as Phaser from "phaser";
import { PAL, type PixelMap, makeCanvas, rect } from "./pixelArt";
import { MARY } from "./npcTextureGenerator";
import { fromMap, recolor } from "./visitationTextureGenerator";

/**
 * Pixel-art textures for the 6 Action Interlude & Season Bridge stages (Option A + Option B).
 * Strictly integer rect() calls and 32x32 chibi PixelMaps on the shared PAL grid.
 */

const crownKing = (map: PixelMap, robe: string, robeShade: string): PixelMap =>
  recolor(MARY, { b: robe, B: robeShade, n: robeShade, w: "y", W: "Y", y: "Y" }).map((row, y) => {
    if (y === 4) return "..........y.y.y.y.y.y...........";
    if (y === 5) return "..........yyyyyyyyyyy...........";
    if (y === 15) return row.replace("ssssss", "hhhhhh");
    return row;
  });

const MAGI_GOLD = crownKing(MARY, "r", "R");
const MAGI_INCENSE = crownKing(MARY, "v", "V");
const MAGI_MYRRH = crownKing(MARY, "g", "G");

/** Sleeping camel on the desert path (36x24). */
function camelSleeping() {
  const { canvas, ctx } = makeCanvas(36, 24);
  rect(ctx, 2, 21, 32, 2, PAL.z);
  rect(ctx, 8, 8, 22, 12, "#c99352"); // body + hump
  rect(ctx, 13, 4, 12, 6, "#c99352"); // hump top
  rect(ctx, 16, 4, 8, 4, PAL.r); // saddle blanket
  rect(ctx, 16, 8, 8, 1, PAL.y);
  rect(ctx, 3, 10, 6, 8, "#c99352"); // neck + head
  rect(ctx, 1, 11, 4, 4, "#b37d3e"); // snout
  rect(ctx, 4, 12, 2, 1, PAL.e); // sleeping eye
  rect(ctx, 6, 17, 24, 4, "#a36e30"); // folded legs
  return canvas;
}

/** Desert palm tree (36x52). */
function desertPalm() {
  const { canvas, ctx } = makeCanvas(36, 52);
  rect(ctx, 8, 49, 20, 2, PAL.z);
  for (let y = 16; y < 49; y += 3) {
    rect(ctx, 15, y, 6, 3, y % 6 === 0 ? PAL.o : PAL.u);
  }
  // Fronds
  for (const [x, y, w, h] of [
    [4, 8, 12, 4],
    [2, 12, 8, 3],
    [20, 8, 12, 4],
    [26, 12, 8, 3],
    [10, 4, 16, 5],
    [8, 13, 20, 4],
  ]) {
    rect(ctx, x, y, w, h, PAL.G);
  }
  for (const [x, y, w] of [[6, 8, 8], [12, 4, 12], [22, 8, 8]]) {
    rect(ctx, x, y, w, 2, PAL.g);
  }
  rect(ctx, 14, 13, 3, 3, PAL.Y); // dates
  rect(ctx, 19, 13, 3, 3, PAL.Y);
  return canvas;
}

/** Gift box for Gold / Frankincense / Myrrh (16x16). */
function magiGift(boxColor: string, ribbonColor: string) {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 2, 14, 12, 2, PAL.z);
  rect(ctx, 2, 5, 12, 9, boxColor);
  rect(ctx, 1, 3, 14, 3, boxColor);
  rect(ctx, 7, 3, 2, 11, ribbonColor);
  rect(ctx, 2, 8, 12, 2, ribbonColor);
  rect(ctx, 5, 1, 2, 2, ribbonColor);
  rect(ctx, 9, 1, 2, 2, ribbonColor);
  return canvas;
}

/** Carpenter workbench for Nazareth workshop (144x32). */
function carpenterBench() {
  const { canvas, ctx } = makeCanvas(144, 32);
  rect(ctx, 2, 29, 140, 3, PAL.z);
  for (const lx of [8, 36, 104, 132]) rect(ctx, lx, 16, 5, 14, PAL.O);
  rect(ctx, 4, 22, 136, 3, PAL.u); // lower crossbeam
  rect(ctx, 0, 6, 144, 12, PAL.o); // tabletop
  rect(ctx, 0, 6, 144, 2, "#c98a4b"); // top highlight
  rect(ctx, 0, 16, 144, 2, PAL.O);
  // Glowing golden strike zone in the center (x = 64..80)
  rect(ctx, 64, 6, 16, 12, PAL.y);
  rect(ctx, 66, 8, 12, 8, PAL.l);
  return canvas;
}

/** Finished wooden craft item (chair/cradle/yoke icon, 16x16). */
function woodCraftItem() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 2, 14, 12, 2, PAL.z);
  rect(ctx, 3, 2, 2, 12, PAL.o);
  rect(ctx, 11, 6, 2, 8, PAL.o);
  rect(ctx, 3, 7, 10, 3, "#c98a4b");
  rect(ctx, 3, 4, 6, 2, PAL.u);
  return canvas;
}

/** Peter's fishing boat deck (160x56). */
function fishingBoat() {
  const { canvas, ctx } = makeCanvas(160, 56);
  rect(ctx, 8, 50, 144, 4, "rgba(0,0,0,0.3)");
  // Hull
  rect(ctx, 12, 6, 136, 44, PAL.O);
  rect(ctx, 4, 14, 152, 28, PAL.O);
  rect(ctx, 0, 20, 160, 16, PAL.O);
  // Deck planks
  rect(ctx, 16, 10, 128, 36, PAL.o);
  rect(ctx, 8, 16, 144, 24, PAL.o);
  for (let y = 14; y < 44; y += 6) rect(ctx, 14, y, 132, 1, PAL.u);
  // Rim highlight
  rect(ctx, 16, 6, 128, 3, "#c98a4b");
  rect(ctx, 16, 47, 128, 3, "#c98a4b");
  return canvas;
}

/** Swimming Galilee fish (16x10). */
function fishSprite(gold: boolean) {
  const { canvas, ctx } = makeCanvas(16, 10);
  const body = gold ? PAL.y : "#7dd3fc";
  const shade = gold ? PAL.Y : "#0284c7";
  rect(ctx, 4, 2, 9, 6, body);
  rect(ctx, 2, 3, 11, 4, body);
  rect(ctx, 13, 1, 3, 3, shade); // tail top
  rect(ctx, 13, 6, 3, 3, shade); // tail bottom
  rect(ctx, 4, 6, 9, 2, shade);
  rect(ctx, 4, 3, 2, 2, PAL.e); // eye
  rect(ctx, 7, 1, 4, 1, shade); // fin
  return canvas;
}

/** Cast fishing net ring (28x28). */
function fishingNet() {
  const { canvas, ctx } = makeCanvas(28, 28);
  rect(ctx, 4, 2, 20, 24, "rgba(254, 243, 199, 0.25)");
  rect(ctx, 2, 4, 24, 20, "rgba(254, 243, 199, 0.25)");
  for (let i = 4; i <= 24; i += 4) {
    rect(ctx, i, 2, 1, 24, PAL.p);
    rect(ctx, 2, i, 24, 1, PAL.p);
  }
  rect(ctx, 4, 2, 20, 2, PAL.Y);
  rect(ctx, 4, 24, 20, 2, PAL.Y);
  rect(ctx, 2, 4, 2, 20, PAL.Y);
  rect(ctx, 24, 4, 2, 20, PAL.Y);
  return canvas;
}

/** Faith anchor / peace star pickup for Storm on the Lake (16x18). */
function faithAnchor() {
  const { canvas, ctx } = makeCanvas(16, 18);
  rect(ctx, 6, 1, 4, 3, PAL.l);
  rect(ctx, 7, 4, 2, 11, PAL.y);
  rect(ctx, 4, 6, 8, 2, PAL.y);
  rect(ctx, 2, 11, 3, 3, PAL.y);
  rect(ctx, 11, 11, 3, 3, PAL.y);
  rect(ctx, 3, 13, 10, 3, PAL.Y);
  rect(ctx, 6, 15, 4, 2, PAL.l);
  return canvas;
}

/** Rolling white wave hazard (32x14). */
function stormWave() {
  const { canvas, ctx } = makeCanvas(32, 14);
  rect(ctx, 2, 6, 28, 8, "#1d4ed8");
  rect(ctx, 4, 3, 24, 5, "#60a5fa");
  rect(ctx, 6, 1, 18, 3, PAL.w);
  for (const x of [6, 12, 18, 24]) rect(ctx, x, 0, 3, 2, PAL.w);
  return canvas;
}

/** Handheld oil lantern for Kidron Valley (12x16). */
function kidronLantern() {
  const { canvas, ctx } = makeCanvas(12, 16);
  rect(ctx, 4, 0, 4, 2, PAL.Y);
  rect(ctx, 3, 2, 6, 3, PAL.O);
  rect(ctx, 2, 5, 8, 7, PAL.y);
  rect(ctx, 4, 6, 4, 5, PAL.l);
  rect(ctx, 2, 12, 8, 3, PAL.O);
  return canvas;
}

/** Glowing firefly / oil drop for Kidron Valley (10x10). */
function fireflyDrop() {
  const { canvas, ctx } = makeCanvas(10, 10);
  rect(ctx, 3, 1, 4, 8, PAL.y);
  rect(ctx, 1, 3, 8, 4, PAL.y);
  rect(ctx, 3, 3, 4, 4, PAL.l);
  rect(ctx, 4, 4, 2, 2, PAL.w);
  return canvas;
}

/** Dawn light ray crystal for Resurrection Dawn bridge (14x18). */
function dawnRay() {
  const { canvas, ctx } = makeCanvas(14, 18);
  rect(ctx, 6, 0, 2, 18, PAL.y);
  rect(ctx, 4, 3, 6, 12, PAL.y);
  rect(ctx, 2, 6, 10, 6, PAL.l);
  rect(ctx, 5, 5, 4, 8, PAL.w);
  return canvas;
}

/** Small wooden cross for the child to carry alongside Jesus in Sorrowful B4 (14x18). */
function smallCross() {
  const { canvas, ctx } = makeCanvas(14, 18);
  rect(ctx, 4, 16, 6, 2, PAL.z);
  rect(ctx, 5, 1, 4, 16, PAL.o);
  rect(ctx, 5, 1, 1, 16, "#c98a4b");
  rect(ctx, 8, 1, 1, 16, PAL.O);
  rect(ctx, 1, 5, 12, 4, PAL.o);
  rect(ctx, 1, 5, 12, 1, "#c98a4b");
  rect(ctx, 1, 8, 12, 1, PAL.O);
  rect(ctx, 5, 5, 4, 4, PAL.y); // golden heart-intersection
  rect(ctx, 6, 6, 2, 2, PAL.l);
  return canvas;
}

/** Glowing golden footprints on the Via Dolorosa in Sorrowful B4 (16x10). */
function goldenFootstep() {
  const { canvas, ctx } = makeCanvas(16, 10);
  // Left footprint
  rect(ctx, 2, 1, 4, 5, PAL.y);
  rect(ctx, 3, 2, 2, 3, PAL.l);
  rect(ctx, 2, 7, 4, 2, PAL.Y);
  // Right footprint (slightly ahead)
  rect(ctx, 10, 0, 4, 5, PAL.y);
  rect(ctx, 11, 1, 2, 3, PAL.l);
  rect(ctx, 10, 6, 4, 2, PAL.Y);
  return canvas;
}

/** Burning Heart with Word of God flame for Emmaus B5 (16x16). */
function burningHeart() {
  const { canvas, ctx } = makeCanvas(16, 16);
  // Top flame
  rect(ctx, 7, 0, 2, 3, PAL.f);
  rect(ctx, 6, 2, 4, 3, PAL.y);
  rect(ctx, 7, 3, 2, 2, PAL.l);
  // Heart body
  rect(ctx, 2, 5, 5, 4, PAL.r);
  rect(ctx, 9, 5, 5, 4, PAL.r);
  rect(ctx, 2, 7, 12, 4, PAL.r);
  rect(ctx, 4, 11, 8, 2, PAL.R);
  rect(ctx, 6, 13, 4, 2, PAL.R);
  rect(ctx, 7, 15, 2, 1, PAL.R);
  rect(ctx, 3, 6, 2, 1, PAL.w); // highlight
  return canvas;
}

/** Warm Emmaus bread loaf for Emmaus B5 (16x12). */
function emmausLoaf() {
  const { canvas, ctx } = makeCanvas(16, 12);
  rect(ctx, 2, 10, 12, 2, PAL.z);
  rect(ctx, 2, 4, 12, 6, PAL.Y);
  rect(ctx, 1, 6, 14, 3, PAL.Y);
  rect(ctx, 3, 3, 10, 2, PAL.y);
  rect(ctx, 5, 4, 1, 3, PAL.O);
  rect(ctx, 8, 4, 1, 3, PAL.O);
  rect(ctx, 11, 4, 1, 3, PAL.O);
  rect(ctx, 2, 9, 12, 1, PAL.u);
  return canvas;
}

/** Drifting dark-grey doubt cloud for Emmaus B5 (28x14). */
function doubtCloud() {
  const { canvas, ctx } = makeCanvas(28, 14);
  rect(ctx, 6, 2, 16, 4, PAL.A);
  rect(ctx, 2, 5, 24, 6, PAL.A);
  rect(ctx, 4, 11, 20, 2, "#334155");
  rect(ctx, 8, 3, 10, 2, PAL.a);
  return canvas;
}

/** Wooden supper table for the Emmaus inn in Glorious B5 (64x28). */
function emmausTable() {
  const { canvas, ctx } = makeCanvas(64, 28);
  rect(ctx, 4, 25, 56, 3, PAL.z); // ground shadow
  rect(ctx, 8, 14, 4, 12, PAL.O); // left leg
  rect(ctx, 52, 14, 4, 12, PAL.O); // right leg
  rect(ctx, 12, 20, 40, 2, PAL.u); // crossbeam
  rect(ctx, 2, 4, 60, 12, PAL.o); // tabletop
  rect(ctx, 2, 4, 60, 2, "#c98a4b"); // top highlight
  rect(ctx, 2, 14, 60, 2, PAL.O);
  rect(ctx, 14, 4, 36, 12, PAL.w); // white linen cloth in center
  rect(ctx, 14, 14, 36, 2, PAL.W);
  rect(ctx, 14, 16, 36, 3, PAL.y); // gold trim
  return canvas;
}

/** Register all textures needed by the 9 Action Interlude & Bridge scenes (idempotent). */
export function registerInterludeTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  add("magi_gold", () => fromMap(MAGI_GOLD));
  add("magi_incense", () => fromMap(MAGI_INCENSE));
  add("magi_myrrh", () => fromMap(MAGI_MYRRH));
  add("camel_sleep", camelSleeping);
  add("desert_palm", desertPalm);
  add("gift_gold", () => magiGift(PAL.y, PAL.r));
  add("gift_incense", () => magiGift(PAL.v, PAL.y));
  add("gift_myrrh", () => magiGift(PAL.g, PAL.y));
  add("carpenter_bench", carpenterBench);
  add("wood_craft", woodCraftItem);
  add("fishing_boat", fishingBoat);
  add("fish_silver", () => fishSprite(false));
  add("fish_gold", () => fishSprite(true));
  add("fishing_net", fishingNet);
  add("faith_anchor", faithAnchor);
  add("storm_wave", stormWave);
  add("kidron_lantern", kidronLantern);
  add("firefly_drop", fireflyDrop);
  add("dawn_ray", dawnRay);
  add("small_cross", smallCross);
  add("golden_footstep", goldenFootstep);
  add("burning_heart", burningHeart);
  add("emmaus_loaf", emmausLoaf);
  add("doubt_cloud", doubtCloud);
  add("emmaus_table", emmausTable);
}
