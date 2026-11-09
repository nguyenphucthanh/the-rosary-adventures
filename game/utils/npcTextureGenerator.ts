import * as Phaser from "phaser";
import { PAL, type PixelMap, drawMap, glowCanvas, makeCanvas, rect } from "./pixelArt";

/**
 * Pixel-art textures for NPCs & props.
 * Characters use the SAME 32x32 chibi grid as the player (playerTextureGenerator.ts):
 * hair rows 6-9, face rows 10-15 (x11-20), eyes rows 12-13, body rows 17-24, feet 25-27.
 */

// ---------- Characters ----------

export const MARY: PixelMap = [
  "................................",
  "................................",
  "............yyyyyyyy............",
  "..........yy........yy..........",
  ".........y..bbbbbbbb..y.........",
  ".........ybbbbbbbbbbbby.........",
  ".........BbbbbbbbbbbbbB.........",
  ".........BbbhhhhhhhhbbB.........",
  ".........BbbhsssssshbbB.........",
  ".........BbbssssssssbbB.........",
  ".........BbbssssssssbbB.........",
  ".........BbbssssssssbbB.........",
  ".........BbbseesseesbbB.........",
  ".........BbbssssssssbbB.........",
  ".........BbbcssmmsscbbB.........",
  ".........BbbbssssssbbbB.........",
  ".........BbbywwwwwwybbB.........",
  "........BbbbywwwwwwybbbB........",
  "........BbbbywwsswwybbbB........",
  "........BbbbywsssswybbbB........",
  "........BbbbywSssSwybbbB........",
  "........BbbbywwwWwwybbbB........",
  ".......BbbbbywwWwwwybbbbB.......",
  ".......BbbbbywwwWwwybbbbB.......",
  ".......BBbbbywwWwwwybbbBB.......",
  ".......BBBBBYWWWWWWYBBBBB.......",
  ".......nnnnnnnnnnnnnnnnnn.......",
  "........zzzzzzzzzzzzzzzz........",
  "..........zzzzzzzzzzzz..........",
  "................................",
  "................................",
  "................................",
];

const GABRIEL_BODY: PixelMap = [
  "................................",
  "................................",
  "............yyyyyyyy............",
  "..........yy........yy..........",
  "............yyyyyyyy............",
  "................................",
  "..........YYYyyyYYYYYY..........",
  "..........YYYYYYYYYYYY..........",
  ".........YYYYYYYYYYYYYY.........",
  ".........YYYYYYYYYYYYYY.........",
  ".........YYssssssssssYY.........",
  ".........YYssssssssssYY.........",
  "...........sseesseess...........",
  "...........sseesseess...........",
  "...........ccsssssscc...........",
  "...........ssssssssss...........",
  "..............ssss..............",
  ".........wwwYwwwwwwwwww.........",
  ".........wwwwYwwwwwwwww.........",
  ".........wwwwwYwwwwwwww.........",
  ".........wwwwwwYwwwwwww.........",
  ".........wwwwwwwYwwwwww.........",
  ".........sswwwwwwYwwwss.........",
  ".........sswwwwwwwYwwss.........",
  "...........wwwwwwwwYw...........",
  "..........WWwwwwwwwwWW..........",
  "..........yyyyyyyyyyyy..........",
  "............uuu..uuu............",
  "................................",
  "...........zzzzzzzzzz...........",
  "................................",
  "................................",
];

const LILY: PixelMap = [".w.", "wyw", ".w.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G."];

const WING: PixelMap = [
  "ll............",
  "wwww..........",
  ".wwwww........",
  ".Wwwwwww......",
  "..Wwwwwwwww...",
  "..WWwwwwwwwww.",
  "...WWwwwwwwwww",
  "....WWWwwwwwww",
  ".....WWWWwwwww",
  "......WWWWwwww",
  "........WWWWww",
  "..........WWWw",
];

const DOVE_UP: PixelMap = [
  "................",
  "................",
  "..w..........w..",
  "..ww........ww..",
  "..www......www..",
  "...www.ww.www...",
  "...Wwwwwwwwww...",
  "....Wwwwwwww....",
  "......wwww......",
  "......wwww......",
  ".......ww.......",
  "......w..w......",
  "................",
  "................",
  "................",
  "................",
];

const DOVE_DOWN: PixelMap = [
  "................",
  "................",
  "................",
  "................",
  "................",
  ".......ww.......",
  "....wwwwwwww....",
  "..wwwwwwwwwwww..",
  ".wwW..wwww..Www.",
  ".w....wwww....w.",
  ".......ww.......",
  "......w..w......",
  "................",
  "................",
  "................",
  "................",
];

const SCROLL: PixelMap = [
  "................",
  "................",
  "................",
  "..y..........y..",
  ".ooo........ooo.",
  "..oppppppppppo..",
  "..opuuuuuuuupo..",
  "..opppprrppppo..",
  "..opuuurruuupo..",
  "..oppppppppppo..",
  "..oPPPPPPPPPPo..",
  ".ooo........ooo.",
  "..y..........y..",
  "................",
  "................",
  "................",
];

const SPARKLE: PixelMap = [
  "...y...",
  "...l...",
  "...l...",
  "yllwlly",
  "...l...",
  "...l...",
  "...y...",
];

function fromMap(map: PixelMap) {
  const { canvas, ctx } = makeCanvas(map[0].length, map.length);
  drawMap(ctx, map);
  return canvas;
}

function gabrielSheet() {
  // 2 frames of 48x32: wings up / wings down
  const { canvas, ctx } = makeCanvas(96, 32);
  [0, 3].forEach((wingDrop, frame) => {
    const ox = frame * 48;
    drawMap(ctx, WING, ox + 4, 10 + wingDrop);
    drawMap(ctx, WING, ox + 30, 10 + wingDrop, true);
    drawMap(ctx, GABRIEL_BODY, ox + 8, 0);
    drawMap(ctx, LILY, ox + 8 + 22, 11);
  });
  return canvas;
}

function doveSheet() {
  const { canvas, ctx } = makeCanvas(32, 16);
  drawMap(ctx, DOVE_UP, 0, 0);
  drawMap(ctx, DOVE_DOWN, 16, 0);
  return canvas;
}

// ---------- Props ----------

function altar() {
  const { canvas, ctx } = makeCanvas(48, 40);
  rect(ctx, 4, 36, 40, 2, PAL.z); // shadow
  rect(ctx, 6, 24, 4, 12, PAL.O); // legs
  rect(ctx, 38, 24, 4, 12, PAL.O);
  rect(ctx, 3, 14, 42, 10, PAL.o); // tabletop + apron
  rect(ctx, 3, 14, 42, 1, "#b45309");
  rect(ctx, 3, 23, 42, 1, PAL.O);
  rect(ctx, 6, 12, 36, 8, PAL.w); // linen
  rect(ctx, 6, 19, 36, 1, PAL.W);
  rect(ctx, 14, 20, 20, 8, PAL.w); // front drape
  rect(ctx, 14, 27, 20, 1, PAL.W);
  rect(ctx, 14, 28, 20, 1, PAL.y);
  rect(ctx, 23, 21, 2, 6, PAL.y); // cross on drape
  rect(ctx, 21, 23, 6, 2, PAL.y);
  rect(ctx, 21, 4, 6, 9, PAL.p); // candle
  rect(ctx, 25, 4, 2, 9, PAL.P);
  rect(ctx, 20, 12, 8, 2, PAL.Y); // candle dish
  rect(ctx, 23, 1, 2, 3, PAL.y); // flame
  rect(ctx, 23, 0, 1, 1, PAL.l);
  rect(ctx, 23, 2, 1, 1, PAL.l);
  rect(ctx, 34, 9, 6, 5, PAL.t); // lily vase
  rect(ctx, 38, 9, 2, 5, PAL.T);
  rect(ctx, 36, 4, 1, 5, PAL.G);
  rect(ctx, 34, 1, 5, 3, PAL.w);
  rect(ctx, 36, 2, 1, 1, PAL.y);
  return canvas;
}

function floorTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#d6b48a");
  rect(ctx, 0, 0, 15, 1, "#e6c79f");
  rect(ctx, 8, 8, 8, 1, "#e6c79f");
  rect(ctx, 0, 8, 7, 1, "#e6c79f");
  rect(ctx, 0, 7, 16, 1, "#bf9466");
  rect(ctx, 0, 15, 16, 1, "#bf9466");
  rect(ctx, 15, 0, 1, 7, "#bf9466");
  rect(ctx, 7, 8, 1, 7, "#bf9466");
  for (const [x, y] of [[4, 3], [11, 4], [2, 11], [12, 12]]) rect(ctx, x, y, 1, 1, "#c49a6c");
  return canvas;
}

function wallFace() {
  const { canvas, ctx } = makeCanvas(16, 48);
  rect(ctx, 0, 0, 16, 3, PAL.O); // ceiling beam
  rect(ctx, 0, 3, 16, 1, PAL.o);
  rect(ctx, 0, 4, 16, 34, "#efe3c8"); // plaster
  const mortar = "#dccdab";
  for (const y of [12, 21, 30]) rect(ctx, 0, y, 16, 1, mortar);
  rect(ctx, 7, 4, 1, 8, mortar);
  rect(ctx, 15, 13, 1, 8, mortar);
  rect(ctx, 7, 22, 1, 8, mortar);
  rect(ctx, 15, 31, 1, 7, mortar);
  rect(ctx, 0, 38, 16, 6, "#b9a383"); // stone dado
  rect(ctx, 0, 38, 16, 1, "#8f7a5c");
  rect(ctx, 0, 39, 16, 1, "#cdb896");
  rect(ctx, 0, 44, 16, 4, "#6e5a40"); // baseboard
  return canvas;
}

function wallCap() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#7c5f42");
  rect(ctx, 0, 0, 16, 1, "#93734f");
  rect(ctx, 0, 8, 16, 1, "#6a5038");
  rect(ctx, 8, 0, 1, 8, "#6a5038");
  rect(ctx, 0, 9, 1, 7, "#6a5038");
  return canvas;
}

function windowArch() {
  const { canvas, ctx } = makeCanvas(24, 30);
  // stepped arch frame
  rect(ctx, 8, 0, 8, 1, PAL.O);
  rect(ctx, 5, 1, 14, 1, PAL.O);
  rect(ctx, 3, 2, 18, 1, PAL.O);
  rect(ctx, 2, 3, 20, 1, PAL.O);
  rect(ctx, 1, 4, 22, 21, PAL.O);
  // sky
  rect(ctx, 9, 2, 6, 1, PAL.k);
  rect(ctx, 6, 3, 12, 1, PAL.k);
  rect(ctx, 4, 4, 16, 1, PAL.k);
  rect(ctx, 3, 5, 18, 20, PAL.k);
  rect(ctx, 3, 17, 18, 8, "#bae6fd");
  rect(ctx, 5, 7, 4, 1, PAL.w); // cloud
  rect(ctx, 4, 8, 6, 1, PAL.w);
  rect(ctx, 15, 6, 3, 3, PAL.l); // sun
  rect(ctx, 11, 2, 2, 23, PAL.O); // mullions
  rect(ctx, 3, 13, 18, 2, PAL.O);
  rect(ctx, 0, 25, 24, 4, "#cdb896"); // sill
  rect(ctx, 0, 29, 24, 1, "#8f7a5c");
  return canvas;
}

function shelf() {
  const { canvas, ctx } = makeCanvas(40, 20);
  rect(ctx, 0, 12, 40, 3, PAL.o);
  rect(ctx, 0, 15, 40, 1, PAL.O);
  rect(ctx, 4, 16, 2, 4, PAL.O);
  rect(ctx, 34, 16, 2, 4, PAL.O);
  rect(ctx, 3, 8, 8, 4, PAL.t); // bowl
  rect(ctx, 3, 8, 8, 1, "#e08a55");
  rect(ctx, 4, 11, 6, 1, PAL.T);
  rect(ctx, 16, 3, 6, 9, PAL.t); // jar
  rect(ctx, 17, 1, 4, 2, PAL.T);
  rect(ctx, 20, 3, 2, 9, PAL.T);
  rect(ctx, 26, 9, 8, 3, PAL.P); // bread
  rect(ctx, 27, 8, 6, 1, PAL.P);
  rect(ctx, 26, 11, 8, 1, PAL.Y);
  return canvas;
}

function olivePot() {
  const { canvas, ctx } = makeCanvas(20, 28);
  rect(ctx, 4, 26, 12, 2, PAL.z);
  rect(ctx, 9, 14, 2, 4, PAL.o); // trunk
  rect(ctx, 7, 2, 6, 2, PAL.G); // foliage
  rect(ctx, 4, 4, 12, 4, PAL.G);
  rect(ctx, 2, 7, 16, 5, PAL.G);
  rect(ctx, 4, 12, 12, 3, PAL.G);
  for (const [x, y, w] of [[6, 4, 4], [3, 8, 5], [10, 6, 5], [12, 10, 4], [6, 12, 4]])
    rect(ctx, x, y, w, 2, PAL.g);
  for (const [x, y] of [[5, 9], [14, 7], [9, 13]]) rect(ctx, x, y, 1, 1, "#4c1d95");
  rect(ctx, 4, 17, 12, 2, PAL.T); // pot rim
  rect(ctx, 5, 19, 10, 7, PAL.t);
  rect(ctx, 13, 19, 2, 7, PAL.T);
  rect(ctx, 6, 20, 1, 4, "#e08a55");
  return canvas;
}

function clayJar() {
  const { canvas, ctx } = makeCanvas(14, 20);
  rect(ctx, 1, 18, 12, 2, PAL.z);
  rect(ctx, 3, 2, 8, 1, PAL.T); // rim
  rect(ctx, 4, 3, 6, 3, PAL.t); // neck
  rect(ctx, 2, 6, 10, 12, PAL.t);
  rect(ctx, 1, 8, 12, 8, PAL.t);
  rect(ctx, 10, 6, 2, 12, PAL.T);
  rect(ctx, 12, 8, 1, 8, PAL.T);
  rect(ctx, 3, 7, 1, 6, "#e08a55");
  rect(ctx, 2, 11, 10, 1, PAL.T); // band
  return canvas;
}

function sleepingMat() {
  const { canvas, ctx } = makeCanvas(40, 24);
  rect(ctx, 2, 22, 36, 2, PAL.z);
  rect(ctx, 2, 6, 36, 16, "#d4b26a");
  for (let y = 8; y < 22; y += 4) rect(ctx, 2, y, 36, 1, "#b8954f");
  rect(ctx, 14, 8, 24, 14, "#a3412b"); // blanket
  rect(ctx, 14, 8, 24, 1, "#c45a3f");
  rect(ctx, 14, 14, 24, 1, PAL.y);
  rect(ctx, 4, 8, 9, 7, PAL.w); // pillow
  rect(ctx, 4, 14, 9, 1, PAL.W);
  return canvas;
}

/** Register every texture the Nazareth scene needs (idempotent). */
export function registerAnnunciationTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  const addSheet = (key: string, make: () => HTMLCanvasElement, fw: number, fh: number) => {
    if (!tex.exists(key))
      tex.addSpriteSheet(key, make() as unknown as HTMLImageElement, { frameWidth: fw, frameHeight: fh });
  };

  add("mary_praying", () => fromMap(MARY));
  addSheet("archangel_gabriel", gabrielSheet, 48, 32);
  addSheet("holy_spirit_dove", doveSheet, 16, 16);
  add("scripture_scroll", () => fromMap(SCROLL));
  add("sparkle", () => fromMap(SPARKLE));
  add("nazareth_altar", altar);
  add("floor_stone", floorTile);
  add("wall_face", wallFace);
  add("wall_cap", wallCap);
  add("window_arch", windowArch);
  add("wall_shelf", shelf);
  add("olive_pot", olivePot);
  add("clay_jar", clayJar);
  add("sleeping_mat", sleepingMat);
  add("glow_gold", () => glowCanvas(24, PAL.l));
  add("glow_small", () => glowCanvas(12, PAL.y));
}
