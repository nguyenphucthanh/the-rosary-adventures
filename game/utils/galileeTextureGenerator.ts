import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "./pixelArt";
import { MARY } from "./npcTextureGenerator";
import { fromMap, recolor } from "./visitationTextureGenerator";

/** Pixel-art textures for stages 8-10 (Beatitudes hill, Tabor, Upper Room). Integer rects + PixelMaps only. */

const beard = (rows: string[]) => rows.map((row, i) => (i === 15 ? row.replace("ssssss", "wwwwww") : row));

/** Young John: short chestnut hair (no veil, no halo), grey robe over a brown tunic. Key must not be "john" (the Baptist). */
function apostleJohn() {
  return MARY.map((row, i) =>
    [...row]
      .map((ch) => {
        if (i < 4) return ".";
        if (i <= 9) return ch === "b" || ch === "B" ? "d" : ch === "y" ? "." : ch;
        if (i <= 15) return ch === "b" || ch === "B" ? "." : ch;
        return ({ b: "a", B: "A", n: "A", w: "P", W: "u", y: "O" } as Record<string, string>)[ch] ?? ch;
      })
      .join("")
  );
}

const PEOPLE = {
  mourner: recolor(MARY, { b: "n", B: "e", n: "e", w: "W", W: "A", y: "Y" }),
  hungry: recolor(MARY, { b: "u", B: "O", n: "O", w: "P", W: "u", y: "Y" }),
  prisoner: recolor(MARY, { b: "a", B: "A", n: "A", w: "W", W: "A", y: "Y" }),
  peter: beard(recolor(MARY, { b: "Y", B: "T", n: "T", w: "P", W: "u", y: "Y", h: "W" })),
  andrew: recolor(MARY, { b: "g", B: "G", n: "G", w: "P", W: "u", y: "Y" }),
  james: recolor(MARY, { b: "i", B: "I", n: "I", w: "P", W: "u", y: "Y" }),
  john_apostle: apostleJohn(),
  moses: beard(recolor(MARY, { b: "P", B: "u", n: "u", w: "p", W: "P", y: "y", h: "W" }, true)),
  elijah: beard(recolor(MARY, { b: "r", B: "R", n: "R", w: "f", W: "Y", y: "f", h: "W" }, true)),
  apostle_a: recolor(MARY, { b: "t", B: "T", n: "T", w: "w", W: "W", y: "Y" }),
  apostle_b: recolor(MARY, { b: "v", B: "V", n: "V", w: "w", W: "W", y: "Y" }),
  apostle_c: recolor(MARY, { b: "G", B: "G", n: "n", w: "w", W: "W", y: "Y" }),
};

/** 14x14 icon with soft ground shadow. */
function icon(draw: (ctx: CanvasRenderingContext2D) => void, w = 14, h = 14) {
  const { canvas, ctx } = makeCanvas(w, h);
  draw(ctx);
  return canvas;
}

const heart = () =>
  icon((c) => {
    rect(c, 1, 3, 5, 3, PAL.r); rect(c, 8, 3, 5, 3, PAL.r); rect(c, 1, 5, 12, 3, PAL.r);
    rect(c, 2, 8, 10, 2, PAL.r); rect(c, 4, 10, 6, 2, PAL.R); rect(c, 6, 12, 2, 1, PAL.R);
    rect(c, 2, 4, 2, 1, PAL.w);
  });
const bread = () =>
  icon((c) => {
    rect(c, 2, 5, 10, 7, PAL.Y); rect(c, 1, 7, 12, 4, PAL.Y); rect(c, 3, 4, 8, 1, PAL.y);
    rect(c, 2, 5, 10, 2, PAL.y); rect(c, 4, 7, 1, 3, PAL.P); rect(c, 7, 7, 1, 3, PAL.P); rect(c, 10, 7, 1, 3, PAL.P);
    rect(c, 2, 12, 10, 1, PAL.u);
  });
const peaceDove = () =>
  icon((c) => {
    rect(c, 3, 6, 8, 5, PAL.w); rect(c, 9, 3, 4, 4, PAL.w); rect(c, 13, 5, 1, 1, PAL.y);
    rect(c, 4, 3, 5, 4, PAL.W); rect(c, 1, 8, 3, 2, PAL.W); rect(c, 11, 4, 1, 1, PAL.e); rect(c, 4, 11, 6, 1, PAL.W);
    rect(c, 5, 1, 3, 2, PAL.g); rect(c, 8, 1, 1, 2, PAL.G);
  });
const tablet = () =>
  icon((c) => {
    rect(c, 4, 0, 6, 1, PAL.a); rect(c, 3, 1, 8, 12, PAL.a); rect(c, 9, 1, 2, 12, PAL.A);
    for (const y of [4, 6, 8, 10]) rect(c, 5, y, 4, 1, PAL.A);
  });
const flame = () =>
  icon((c) => {
    rect(c, 6, 0, 2, 3, PAL.f); rect(c, 4, 3, 6, 4, PAL.f); rect(c, 3, 6, 8, 4, PAL.f);
    rect(c, 5, 4, 4, 5, PAL.y); rect(c, 6, 6, 2, 3, PAL.l); rect(c, 4, 10, 6, 3, PAL.o);
  });
const goldCross = () =>
  icon((c) => {
    rect(c, 6, 0, 2, 13, PAL.y); rect(c, 2, 3, 10, 2, PAL.y); rect(c, 7, 0, 1, 13, PAL.Y); rect(c, 8, 3, 4, 2, PAL.Y);
  });

function preachRock() {
  const { canvas, ctx } = makeCanvas(64, 44);
  rect(ctx, 2, 42, 60, 2, PAL.z);
  rect(ctx, 12, 0, 40, 4, "#b4b8c0");
  rect(ctx, 6, 4, 52, 8, PAL.a);
  rect(ctx, 2, 12, 60, 14, PAL.a);
  rect(ctx, 4, 26, 56, 14, PAL.A);
  rect(ctx, 12, 0, 40, 2, "#d0d4da");
  rect(ctx, 44, 4, 14, 22, PAL.A);
  for (const [x, y, w] of [[12, 14, 10], [30, 20, 8], [10, 30, 12], [36, 34, 10]]) rect(ctx, x, y, w, 1, "#5a5e66");
  return canvas;
}

function torchUnlit() {
  const { canvas, ctx } = makeCanvas(12, 28);
  rect(ctx, 1, 26, 10, 2, PAL.z);
  rect(ctx, 5, 8, 2, 18, PAL.o);
  rect(ctx, 3, 4, 6, 5, PAL.O);
  rect(ctx, 2, 3, 8, 2, PAL.u);
  return canvas;
}

function torchLitSheet() {
  const { canvas, ctx } = makeCanvas(32, 30);
  for (let f = 0; f < 2; f++) {
    const x = f * 16;
    rect(ctx, x + 7, 10, 2, 18, PAL.o);
    rect(ctx, x + 5, 6, 6, 5, PAL.O);
    rect(ctx, x + 4, 5, 8, 2, PAL.u);
    rect(ctx, x + 5, f ? 0 : 1, 6, 5, PAL.f);
    rect(ctx, x + 6, f ? 1 : 2, 4, 4, PAL.y);
    rect(ctx, x + 7, f ? 2 : 3, 2, 2, PAL.l);
  }
  return canvas;
}

function tentSite() {
  const { canvas, ctx } = makeCanvas(36, 22);
  rect(ctx, 0, 0, 36, 22, "#9a8c70");
  rect(ctx, 2, 2, 32, 18, "#c8b891");
  for (const [x, y] of [[0, 0], [34, 0], [0, 20], [34, 20]]) rect(ctx, x, y, 2, 2, "#6f6350");
  rect(ctx, 16, 8, 4, 6, "#9a8c70");
  return canvas;
}

function tent() {
  const { canvas, ctx } = makeCanvas(40, 34);
  rect(ctx, 4, 32, 32, 2, PAL.z);
  for (let i = 0; i < 14; i++) rect(ctx, 20 - i - 1, 4 + i * 2, (i + 1) * 2 + 2, 2, i % 2 ? PAL.P : PAL.p);
  rect(ctx, 5, 30, 30, 2, PAL.P);
  rect(ctx, 17, 14, 6, 18, PAL.O);
  rect(ctx, 19, 0, 2, 5, PAL.o);
  return canvas;
}

function basin() {
  const { canvas, ctx } = makeCanvas(18, 12);
  rect(ctx, 1, 10, 16, 2, PAL.z);
  rect(ctx, 0, 3, 18, 2, PAL.y);
  rect(ctx, 1, 5, 16, 4, PAL.Y);
  rect(ctx, 3, 9, 12, 1, PAL.Y);
  rect(ctx, 2, 3, 14, 1, "#7dd3fc");
  rect(ctx, 3, 6, 2, 2, PAL.l);
  return canvas;
}

function towel() {
  const { canvas, ctx } = makeCanvas(16, 10);
  rect(ctx, 1, 1, 14, 8, PAL.w);
  rect(ctx, 1, 7, 14, 2, PAL.W);
  rect(ctx, 1, 3, 14, 1, PAL.b);
  rect(ctx, 1, 5, 14, 1, PAL.b);
  rect(ctx, 0, 2, 1, 6, PAL.W);
  return canvas;
}

function wheat() {
  const { canvas, ctx } = makeCanvas(14, 20);
  rect(ctx, 6, 7, 2, 12, PAL.G);
  for (const y of [1, 4, 7]) {
    rect(ctx, 3, y, 3, 2, PAL.y); rect(ctx, 8, y, 3, 2, PAL.y); rect(ctx, 3, y + 1, 1, 1, PAL.Y); rect(ctx, 10, y + 1, 1, 1, PAL.Y);
  }
  rect(ctx, 6, 0, 2, 3, PAL.y);
  rect(ctx, 3, 14, 3, 1, PAL.g); rect(ctx, 8, 12, 3, 1, PAL.g);
  return canvas;
}

function grapes() {
  const { canvas, ctx } = makeCanvas(14, 18);
  rect(ctx, 6, 0, 2, 3, PAL.G); rect(ctx, 8, 1, 4, 2, PAL.g);
  for (const [x, y] of [[2, 3], [5, 3], [8, 3], [3, 6], [6, 6], [9, 6], [4, 9], [7, 9], [5, 12]]) rect(ctx, x, y, 3, 3, PAL.v);
  for (const [x, y] of [[2, 3], [3, 6], [4, 9], [5, 12]]) rect(ctx, x, y, 1, 1, "#a78bfa");
  for (const [x, y] of [[8, 4], [9, 7], [7, 10]]) rect(ctx, x + 1, y + 1, 1, 1, PAL.V);
  return canvas;
}

/** Plate for the bread (empty or with a loaf). */
function plate(withBread: boolean) {
  const { canvas, ctx } = makeCanvas(24, 10);
  rect(ctx, 1, 4, 22, 5, PAL.W);
  rect(ctx, 3, 3, 18, 1, PAL.w);
  rect(ctx, 3, 8, 18, 1, PAL.a);
  if (withBread) {
    rect(ctx, 6, 0, 12, 5, PAL.Y);
    rect(ctx, 5, 2, 14, 2, PAL.Y);
    rect(ctx, 6, 0, 12, 1, PAL.y);
    rect(ctx, 10, 1, 1, 3, PAL.P);
    rect(ctx, 14, 1, 1, 3, PAL.P);
  }
  return canvas;
}

function chalice(withWine: boolean) {
  const { canvas, ctx } = makeCanvas(14, 18);
  rect(ctx, 1, 0, 12, 7, PAL.y);
  rect(ctx, 2, 7, 10, 2, PAL.y);
  rect(ctx, 10, 0, 3, 8, PAL.Y);
  rect(ctx, 2, 0, 10, 2, withWine ? "#9f1239" : "#3f3d38");
  rect(ctx, 6, 9, 2, 5, PAL.Y);
  rect(ctx, 3, 14, 8, 2, PAL.Y);
  rect(ctx, 3, 16, 8, 1, PAL.z);
  rect(ctx, 3, 2, 1, 4, PAL.l);
  return canvas;
}

function supperTable() {
  const { canvas, ctx } = makeCanvas(192, 48);
  rect(ctx, 4, 46, 184, 2, PAL.z);
  for (const x of [6, 20, 164, 178]) rect(ctx, x, 30, 4, 16, PAL.O);
  rect(ctx, 0, 14, 192, 14, PAL.o);
  rect(ctx, 0, 14, 192, 2, PAL.u);
  rect(ctx, 4, 16, 184, 10, PAL.w);
  rect(ctx, 4, 24, 184, 4, PAL.W);
  for (let x = 6; x < 188; x += 6) rect(ctx, x, 28, 3, 3, PAL.W);
  for (const x of [16, 40, 62, 128, 150, 172]) { rect(ctx, x, 10, 4, 5, PAL.y); rect(ctx, x, 14, 4, 1, PAL.Y); }
  for (const x of [28, 52, 140, 162]) rect(ctx, x, 12, 8, 3, PAL.P);
  return canvas;
}

function cloud() {
  const { canvas, ctx } = makeCanvas(96, 40);
  for (const [x, y, w, h] of [[16, 0, 64, 8], [4, 8, 88, 12], [0, 20, 96, 12], [12, 32, 72, 8]]) rect(ctx, x, y, w, h, "#ffffff");
  for (const [x, y, w, h] of [[8, 24, 40, 8], [24, 12, 30, 4]]) rect(ctx, x, y, w, h, "#e2e8f0");
  return canvas;
}

/** Register every texture stages 8-10 need (idempotent). */
export function registerGalileeTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  for (const [k, m] of Object.entries(PEOPLE)) add(k, () => fromMap(m));
  add("icon_hope", heart);
  add("icon_bread", bread);
  add("icon_peace", peaceDove);
  add("icon_tablet", tablet);
  add("icon_flame", flame);
  add("icon_cross", goldCross);
  add("preach_rock", preachRock);
  add("torch_unlit", torchUnlit);
  add("tent_site", tentSite);
  add("tent", tent);
  add("basin", basin);
  add("towel", towel);
  add("wheat", wheat);
  add("grapes", grapes);
  add("plate_empty", () => plate(false));
  add("plate_bread", () => plate(true));
  add("chalice_empty", () => chalice(false));
  add("chalice_wine", () => chalice(true));
  add("supper_table", supperTable);
  add("cloud_big", cloud);
  if (!tex.exists("torch_lit"))
    tex.addSpriteSheet("torch_lit", torchLitSheet() as unknown as HTMLImageElement, { frameWidth: 16, frameHeight: 30 });
}
