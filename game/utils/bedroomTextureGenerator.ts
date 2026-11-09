import * as Phaser from "phaser";
import { PAL, type PixelMap, makeCanvas, rect } from "./pixelArt";
import { fromMap } from "./visitationTextureGenerator";

/** Pixel-art textures for the child's bedroom (Prologue + Epilogue). Integer rects + PixelMaps only. */

const ROSARY: PixelMap = [
  "....wwww....",
  "..ww....ww..",
  ".w........w.",
  ".w........w.",
  "w..........w",
  "w..........w",
  ".w........w.",
  "..w......w..",
  "...w....w...",
  "....w..w....",
  ".....yy.....",
  ".....yy.....",
  "....yyyy....",
  ".....yy.....",
];

const CARD: PixelMap = [
  "PPPPPPPPPPPP",
  "PppppppppppP",
  "PpprrpprrppP",
  "PprrrrrrrrpP",
  "PprrrrrrrrpP",
  "PpprrrrrrppP",
  "PppprrrrpppP",
  "PpppprrppppP",
  "PppppppppppP",
  "PPPPPPPPPPPP",
];

function floorWood() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, PAL.o);
  rect(ctx, 0, 0, 16, 1, PAL.O);
  rect(ctx, 0, 8, 16, 1, PAL.O);
  rect(ctx, 5, 1, 1, 7, PAL.O);
  rect(ctx, 12, 9, 1, 7, PAL.O);
  rect(ctx, 2, 3, 2, 1, PAL.u);
  rect(ctx, 9, 12, 2, 1, PAL.u);
  return canvas;
}

function wallPaper() {
  const { canvas, ctx } = makeCanvas(16, 48);
  rect(ctx, 0, 0, 16, 48, PAL.I);
  for (const x of [0, 8]) rect(ctx, x, 0, 1, 40, PAL.i);
  rect(ctx, 3, 12, 2, 2, PAL.y); // tiny gold stars
  rect(ctx, 11, 26, 2, 2, PAL.y);
  rect(ctx, 0, 0, 16, 3, PAL.O); // ceiling beam
  rect(ctx, 0, 40, 16, 8, PAL.o); // skirting
  rect(ctx, 0, 40, 16, 1, PAL.u);
  return canvas;
}

function nightWindow() {
  const { canvas, ctx } = makeCanvas(32, 36);
  rect(ctx, 0, 0, 32, 36, PAL.O);
  rect(ctx, 2, 2, 28, 28, PAL.n);
  rect(ctx, 2, 2, 28, 8, "#0f1b4d");
  rect(ctx, 15, 2, 2, 28, PAL.O); // mullions
  rect(ctx, 2, 15, 28, 2, PAL.O);
  for (const [x, y] of [[5, 5], [10, 20], [22, 7], [25, 21], [7, 12]]) rect(ctx, x, y, 1, 1, PAL.w);
  rect(ctx, 19, 4, 5, 5, PAL.l); // moon
  rect(ctx, 21, 4, 3, 5, PAL.n);
  rect(ctx, 21, 5, 2, 3, PAL.l);
  rect(ctx, 0, 30, 32, 4, PAL.o); // sill
  rect(ctx, 0, 30, 32, 1, PAL.u);
  return canvas;
}

function bookshelf() {
  const { canvas, ctx } = makeCanvas(32, 40);
  rect(ctx, 0, 0, 32, 40, PAL.O);
  rect(ctx, 2, 2, 28, 34, PAL.o);
  const rows = [
    [5, ["r", "b", "g", "y", "v", "b"]],
    [15, ["k", "r", "y", "g", "b", "r"]],
    [25, ["v", "y", "b", "r", "g", "y"]],
  ] as const;
  for (const [y, books] of rows) {
    rect(ctx, 2, y + 9, 28, 2, PAL.O);
    books.forEach((c, i) => {
      rect(ctx, 4 + i * 4, y + (i % 2), 3, 9 - (i % 2), PAL[c]);
      rect(ctx, 4 + i * 4, y + (i % 2), 1, 9 - (i % 2), PAL.w);
    });
  }
  rect(ctx, 2, 36, 4, 4, PAL.O);
  rect(ctx, 26, 36, 4, 4, PAL.O);
  return canvas;
}

function desk() {
  const { canvas, ctx } = makeCanvas(44, 28);
  rect(ctx, 0, 8, 44, 5, PAL.o);
  rect(ctx, 0, 8, 44, 1, PAL.u);
  rect(ctx, 0, 12, 44, 1, PAL.O);
  rect(ctx, 2, 13, 5, 15, PAL.O); // legs
  rect(ctx, 37, 13, 5, 15, PAL.O);
  rect(ctx, 9, 13, 14, 10, PAL.o); // drawer
  rect(ctx, 9, 13, 14, 1, PAL.O);
  rect(ctx, 14, 17, 4, 2, PAL.y);
  // desk lamp
  rect(ctx, 33, 6, 6, 2, PAL.i);
  rect(ctx, 35, 1, 2, 5, PAL.i);
  rect(ctx, 31, 0, 8, 3, PAL.y);
  rect(ctx, 31, 2, 8, 1, PAL.Y);
  return canvas;
}

function bed() {
  const { canvas, ctx } = makeCanvas(48, 40);
  rect(ctx, 0, 0, 48, 10, PAL.O); // headboard
  rect(ctx, 2, 2, 44, 6, PAL.o);
  rect(ctx, 2, 10, 44, 26, PAL.W); // mattress
  rect(ctx, 6, 12, 16, 8, PAL.w); // pillow
  rect(ctx, 6, 18, 16, 2, PAL.W);
  rect(ctx, 2, 21, 44, 15, PAL.b); // blanket
  rect(ctx, 2, 21, 44, 2, PAL.w);
  rect(ctx, 2, 34, 44, 2, PAL.B);
  for (const x of [10, 22, 34]) rect(ctx, x, 27, 4, 4, PAL.B); // quilt dots
  rect(ctx, 0, 36, 48, 4, PAL.O);
  return canvas;
}

function homeAltar() {
  const { canvas, ctx } = makeCanvas(36, 48);
  // wall crucifix
  rect(ctx, 16, 0, 4, 16, PAL.Y);
  rect(ctx, 11, 4, 14, 4, PAL.Y);
  rect(ctx, 17, 1, 2, 14, PAL.y);
  rect(ctx, 12, 5, 12, 2, PAL.y);
  // Mary statue (blue + white veil) on the right, small Jesus statue on the left
  rect(ctx, 26, 20, 6, 4, PAL.w);
  rect(ctx, 25, 24, 8, 8, PAL.b);
  rect(ctx, 25, 30, 8, 2, PAL.B);
  rect(ctx, 28, 21, 2, 2, PAL.s);
  rect(ctx, 5, 20, 6, 4, PAL.s);
  rect(ctx, 4, 24, 8, 8, PAL.w);
  rect(ctx, 4, 30, 8, 2, PAL.W);
  // table with cloth
  rect(ctx, 0, 32, 36, 4, PAL.o);
  rect(ctx, 0, 32, 36, 1, PAL.u);
  rect(ctx, 1, 36, 34, 12, PAL.p);
  rect(ctx, 1, 36, 34, 2, PAL.P);
  rect(ctx, 1, 46, 34, 2, PAL.P);
  rect(ctx, 14, 40, 8, 1, PAL.y);
  return canvas;
}

function schoolbag() {
  const { canvas, ctx } = makeCanvas(18, 18);
  rect(ctx, 2, 16, 14, 2, PAL.z);
  rect(ctx, 3, 3, 12, 13, PAL.r);
  rect(ctx, 3, 3, 12, 5, PAL.R);
  rect(ctx, 5, 10, 8, 4, PAL.R);
  rect(ctx, 8, 7, 2, 2, PAL.y);
  rect(ctx, 6, 0, 6, 3, PAL.R); // handle
  rect(ctx, 7, 1, 4, 1, PAL.z);
  return canvas;
}

function bookOpen() {
  const { canvas, ctx } = makeCanvas(16, 8);
  rect(ctx, 0, 1, 16, 7, PAL.o);
  rect(ctx, 1, 0, 14, 7, PAL.p);
  rect(ctx, 7, 0, 2, 7, PAL.P);
  for (const y of [2, 4]) {
    rect(ctx, 2, y, 4, 1, PAL.i);
    rect(ctx, 10, y, 4, 1, PAL.i);
  }
  return canvas;
}

function bookClosed() {
  const { canvas, ctx } = makeCanvas(16, 8);
  rect(ctx, 1, 2, 14, 6, PAL.b);
  rect(ctx, 1, 2, 14, 1, PAL.w);
  rect(ctx, 1, 7, 14, 1, PAL.B);
  rect(ctx, 7, 4, 2, 2, PAL.y); // little gold cross
  return canvas;
}

function portal() {
  const { canvas, ctx } = makeCanvas(40, 24);
  const rows = [[8, 24], [4, 32], [2, 36], [0, 40], [0, 40], [2, 36], [4, 32], [8, 24]];
  rows.forEach(([x, w], i) => {
    rect(ctx, x, i * 3, w, 3, PAL.y);
    if (i >= 1 && i <= 6) rect(ctx, x + 3, i * 3, w - 6, 3, PAL.l);
    if (i >= 2 && i <= 5) rect(ctx, x + 7, i * 3, w - 14, 3, PAL.w);
  });
  return canvas;
}

/** Register every texture the bedroom scenes need (idempotent). */
export function registerBedroomTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!t.exists(key)) t.addCanvas(key, make());
  };
  add("floor_wood", floorWood);
  add("wall_paper", wallPaper);
  add("night_window", nightWindow);
  add("bookshelf", bookshelf);
  add("desk", desk);
  add("bed", bed);
  add("home_altar", homeAltar);
  add("schoolbag", schoolbag);
  add("book_open", bookOpen);
  add("book_closed", bookClosed);
  add("portal_ring", portal);
  add("rosary_item", () => fromMap(ROSARY));
  add("rosary_lit", () => fromMap(ROSARY.map((r) => r.replace(/w/g, "y"))));
  add("card_gift", () => fromMap(CARD));
}
