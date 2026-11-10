import * as Phaser from "phaser";
import { PAL, type PixelMap, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
import { MARY } from "@/modules/the-rosary-adventures/game/utils/npcTextureGenerator";
import { JESUS } from "@/modules/the-rosary-adventures/game/utils/lightTextureGenerator";
import { fromMap, recolor } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";

/** Pixel-art textures for stages 11-15 (Gethsemane, Praetorium, barracks, Via Dolorosa, Calvary). Integer rects + PixelMaps only. */

/** Rewrite a map cell by cell: fn(ch, row, col) returns the new char. */
const edit = (map: PixelMap, fn: (ch: string, y: number, x: number) => string): PixelMap =>
  map.map((row, y) => [...row].map((ch, x) => fn(ch, y, x)).join(""));

const setCells = (map: PixelMap, cells: [number, number, string][]) =>
  edit(map, (ch, y, x) => cells.find(([cy, cx]) => cy === y && cx === x)?.[2] ?? ch);

/** Gethsemane: kneeling in prayer, drops of sweat like blood, robe pooled on the ground. */
const JESUS_KNEEL = edit(setCells(JESUS, [[9, 13, "r"], [10, 18, "r"], [11, 13, "r"]]), (ch, y) => (y === 26 ? (ch === "u" ? "W" : ch) : ch));

/** At the pillar: bare shoulders, rope at the waist, a few red marks. Stays gentle: no blood pools. */
const JESUS_BOUND = setCells(
  edit(JESUS, (ch, y) => {
    if (y < 17 || y > 21) return ch;
    return ({ w: "s", W: "S", r: "s", R: "s" } as Record<string, string>)[ch] ?? ch;
  }),
  [[18, 15, "R"], [19, 17, "R"], [20, 16, "R"], [21, 12, "u"], [21, 13, "u"], [21, 14, "u"], [21, 15, "u"], [21, 16, "u"], [21, 17, "u"], [21, 18, "u"], [21, 19, "u"], [21, 20, "u"], [21, 21, "u"]]
);

/** Crown of thorns over the chestnut hair. */
const crown = (map: PixelMap) =>
  setCells(map, [
    [4, 12, "G"], [4, 15, "G"], [4, 18, "G"],
    [5, 11, "G"], [5, 12, "h"], [5, 13, "G"], [5, 14, "h"], [5, 15, "G"], [5, 16, "h"], [5, 17, "G"], [5, 18, "h"], [5, 19, "G"], [5, 20, "h"],
    [6, 12, "r"], [7, 19, "r"],
  ]);

/** Mocked as king: scarlet cloak, thorns, a reed for a sceptre. */
const JESUS_THORNS = setCells(
  crown(
    edit(JESUS, (ch, y) => (y >= 16 ? ({ w: "r", W: "R", r: "Y", R: "Y" } as Record<string, string>)[ch] ?? ch : ch))
  ),
  [[7, 25, "g"], [8, 25, "g"], ...Array.from({ length: 19 }, (_, i): [number, number, string] => [9 + i, 25, "o"])]
);

/** Carrying the cross on the way up Calvary: crown, dusty robe, beam over the shoulder. */
const JESUS_CARRY = setCells(
  edit(crown(JESUS), (ch, y) => (y >= 16 && ch === "w" ? "P" : ch)),
  [
    ...Array.from({ length: 26 }, (_, i): [number, number, string][] => [[3 + i, 27, "o"], [3 + i, 28, "O"]]).flat(),
    ...[9, 10].flatMap((y): [number, number, string][] => Array.from({ length: 8 }, (_, i) => [y, 24 + i, y === 9 ? "o" : "O"])),
  ]
);

/** Roman soldier: iron helmet, crest, grey armour, red skirt, spear on the right. Crest colour tells ranks apart. */
const soldier = (crestColor: string): PixelMap =>
  edit(MARY, (ch, y, x) => {
    if (x === 28) return y >= 5 && y <= 27 ? (y < 8 ? "W" : "o") : ".";
    if (y === 2) return x === 15 || x === 16 ? crestColor : ".";
    if (y === 3) return x >= 13 && x <= 18 ? crestColor : ".";
    if (y <= 15) return ({ b: "a", B: "A", y: "." } as Record<string, string>)[ch] ?? ch;
    return ({ b: "r", B: "R", n: "R", w: "a", W: "A", y: "Y" } as Record<string, string>)[ch] ?? ch;
  });

const PEOPLE: Record<string, PixelMap> = {
  jesus_kneel: JESUS_KNEEL,
  jesus_bound: JESUS_BOUND,
  jesus_thorns: JESUS_THORNS,
  jesus_carry: JESUS_CARRY,
  soldier: soldier("r"),
  centurion: soldier("y"),
  mary_sorrow: recolor(MARY, { b: "i", B: "I", n: "I" }, true),
  veronica: recolor(MARY, { b: "W", B: "A", n: "A", w: "p", W: "P", y: "Y" }),
  simon: recolor(MARY, { b: "o", B: "O", n: "O", w: "P", W: "u", y: "Y" }),
};

// ---------- props ----------

function olive() {
  const { canvas, ctx } = makeCanvas(56, 64);
  rect(ctx, 8, 60, 40, 4, PAL.z);
  rect(ctx, 22, 28, 12, 32, "#6b4a2e");
  rect(ctx, 18, 44, 6, 16, "#6b4a2e");
  rect(ctx, 32, 40, 6, 20, "#6b4a2e");
  rect(ctx, 30, 28, 4, 32, "#4d3420");
  rect(ctx, 24, 36, 2, 10, "#4d3420");
  for (const [x, y, w, h] of [[14, 4, 28, 6], [6, 10, 44, 8], [0, 18, 56, 10], [4, 28, 48, 6], [12, 34, 30, 4]]) rect(ctx, x, y, w, h, "#4f6b57");
  for (const [x, y, w, h] of [[30, 10, 18, 6], [34, 20, 20, 6], [30, 28, 16, 4]]) rect(ctx, x, y, w, h, "#3b5443");
  for (const [x, y, w] of [[18, 6, 12], [8, 12, 14], [4, 20, 16], [10, 29, 12]]) rect(ctx, x, y, w, 2, "#86a58d");
  for (const [x, y] of [[20, 14], [40, 22], [12, 24], [34, 8]]) rect(ctx, x, y, 2, 2, "#1f2a24");
  return canvas;
}

function prayerRock() {
  const { canvas, ctx } = makeCanvas(48, 26);
  rect(ctx, 2, 24, 44, 2, PAL.z);
  rect(ctx, 8, 2, 32, 4, "#9a9ea8");
  rect(ctx, 3, 6, 42, 10, PAL.a);
  rect(ctx, 2, 16, 44, 8, PAL.A);
  rect(ctx, 8, 2, 32, 1, "#b4b8c0");
  rect(ctx, 34, 6, 11, 10, PAL.A);
  for (const [x, y, w] of [[10, 9, 8], [24, 12, 7], [8, 19, 10]]) rect(ctx, x, y, w, 1, "#5a5e66");
  return canvas;
}

function bell() {
  const { canvas, ctx } = makeCanvas(12, 14);
  rect(ctx, 5, 0, 2, 2, PAL.Y);
  rect(ctx, 3, 2, 6, 2, PAL.y);
  rect(ctx, 2, 4, 8, 4, PAL.y);
  rect(ctx, 1, 8, 10, 2, PAL.y);
  rect(ctx, 8, 3, 2, 6, PAL.Y);
  rect(ctx, 3, 3, 1, 4, PAL.l);
  rect(ctx, 0, 10, 12, 1, PAL.Y);
  rect(ctx, 5, 11, 2, 2, PAL.u);
  return canvas;
}

function moon() {
  const { canvas, ctx } = makeCanvas(18, 18);
  for (const [x, y, w, h] of [[6, 0, 6, 18], [4, 2, 10, 14], [2, 4, 14, 10]]) rect(ctx, x, y, w, h, "#f8f4d0");
  ctx.clearRect(8, 2, 10, 14); // bite out of the disc = crescent
  return canvas;
}

function slabTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#8d919a");
  rect(ctx, 0, 0, 16, 1, "#a3a7b0");
  rect(ctx, 0, 15, 16, 1, "#70747d");
  rect(ctx, 15, 0, 1, 16, "#70747d");
  rect(ctx, 0, 0, 1, 15, "#a3a7b0");
  for (const [x, y] of [[4, 5], [10, 9], [6, 12]]) rect(ctx, x, y, 2, 1, "#7a7e87");
  return canvas;
}

function scourgePost() {
  const { canvas, ctx } = makeCanvas(24, 56);
  rect(ctx, 2, 54, 20, 2, PAL.z);
  rect(ctx, 3, 0, 18, 4, "#b4b8c0");
  rect(ctx, 5, 4, 14, 44, PAL.a);
  rect(ctx, 14, 4, 5, 44, PAL.A);
  rect(ctx, 2, 46, 20, 8, "#b4b8c0");
  rect(ctx, 2, 52, 20, 2, PAL.A);
  rect(ctx, 9, 10, 6, 2, PAL.u);
  rect(ctx, 11, 12, 2, 4, PAL.u);
  return canvas;
}

function cloth() {
  const { canvas, ctx } = makeCanvas(16, 12);
  rect(ctx, 1, 1, 14, 10, PAL.w);
  rect(ctx, 1, 9, 14, 2, PAL.W);
  rect(ctx, 2, 3, 3, 1, PAL.W);
  rect(ctx, 0, 2, 1, 7, PAL.W);
  return canvas;
}

function thorn() {
  const { canvas, ctx } = makeCanvas(14, 12);
  rect(ctx, 1, 10, 12, 2, PAL.z);
  rect(ctx, 1, 6, 12, 2, PAL.u);
  rect(ctx, 3, 4, 8, 2, PAL.o);
  for (const x of [2, 5, 8, 11]) rect(ctx, x, 2, 1, 4, PAL.O);
  for (const x of [3, 7, 10]) rect(ctx, x, 8, 1, 2, PAL.O);
  rect(ctx, 6, 3, 2, 2, PAL.G);
  return canvas;
}

function cloak(folded: boolean) {
  const { canvas, ctx } = makeCanvas(24, 14);
  if (folded) {
    rect(ctx, 5, 2, 14, 10, PAL.v);
    rect(ctx, 5, 9, 14, 3, PAL.V);
    rect(ctx, 5, 2, 14, 1, "#a78bfa");
    rect(ctx, 11, 4, 2, 4, PAL.y);
    return canvas;
  }
  rect(ctx, 2, 2, 20, 9, PAL.v);
  rect(ctx, 0, 4, 24, 7, PAL.v);
  rect(ctx, 4, 8, 16, 4, PAL.V);
  rect(ctx, 0, 11, 8, 2, PAL.V);
  rect(ctx, 3, 3, 8, 1, "#a78bfa");
  rect(ctx, 18, 5, 3, 3, PAL.y);
  return canvas;
}

function throne() {
  const { canvas, ctx } = makeCanvas(32, 40);
  rect(ctx, 2, 38, 28, 2, PAL.z);
  rect(ctx, 4, 0, 24, 4, PAL.o);
  rect(ctx, 6, 4, 20, 18, PAL.u);
  rect(ctx, 6, 4, 20, 2, PAL.o);
  rect(ctx, 2, 18, 28, 6, PAL.o);
  rect(ctx, 2, 24, 28, 2, PAL.O);
  for (const x of [3, 25]) rect(ctx, x, 26, 4, 12, PAL.O);
  for (const x of [10, 15, 20]) rect(ctx, x, 6, 2, 14, PAL.O);
  return canvas;
}

function houseFront() {
  const { canvas, ctx } = makeCanvas(72, 72);
  rect(ctx, 4, 68, 64, 4, PAL.z);
  rect(ctx, 0, 6, 72, 62, "#d9c79f");
  rect(ctx, 0, 0, 72, 8, "#f3e9cf");
  rect(ctx, 0, 8, 72, 2, "#a68f66");
  rect(ctx, 44, 10, 28, 58, "#c4b186");
  for (const y of [22, 34, 46, 58]) rect(ctx, 0, y, 72, 1, "#c4b186");
  rect(ctx, 14, 36, 22, 32, "#5b3b22");
  rect(ctx, 16, 32, 18, 4, "#5b3b22");
  rect(ctx, 18, 28, 14, 4, "#5b3b22");
  rect(ctx, 21, 40, 8, 28, "#3a2514");
  rect(ctx, 46, 22, 14, 14, "#3a2514");
  rect(ctx, 46, 22, 14, 2, "#a68f66");
  rect(ctx, 0, 62, 72, 6, "#a68f66");
  return canvas;
}

/** Plain wooden cross. */
function crossBeam() {
  const { canvas, ctx } = makeCanvas(48, 20);
  rect(ctx, 2, 18, 44, 2, PAL.z);
  rect(ctx, 0, 4, 48, 8, PAL.o);
  rect(ctx, 0, 4, 48, 2, PAL.u);
  rect(ctx, 0, 10, 48, 2, PAL.O);
  return canvas;
}

/** Fallen under the weight of the cross: lying figure with the beam across him. */
function jesusFallen() {
  const { canvas, ctx } = makeCanvas(48, 26);
  rect(ctx, 2, 24, 44, 2, PAL.z);
  rect(ctx, 6, 8, 34, 12, PAL.P);
  rect(ctx, 6, 16, 34, 4, PAL.W);
  rect(ctx, 38, 12, 8, 6, PAL.W);
  rect(ctx, 40, 18, 6, 3, PAL.u);
  rect(ctx, 0, 6, 12, 12, PAL.d);
  rect(ctx, 2, 8, 8, 8, PAL.s);
  rect(ctx, 2, 8, 8, 2, PAL.d);
  rect(ctx, 3, 12, 1, 1, PAL.e);
  rect(ctx, 7, 12, 1, 1, PAL.e);
  rect(ctx, 5, 14, 2, 1, PAL.m);
  for (const x of [0, 4, 8]) rect(ctx, x + 1, 6, 2, 1, PAL.G);
  for (const [x, y, w] of [[0, 0, 8], [0, 1, 1], [7, 1, 1]]) rect(ctx, x + 2, y + 2, w, 1, PAL.y); // halo
  rect(ctx, 0, 14, 48, 4, PAL.o);
  rect(ctx, 0, 14, 48, 1, PAL.u);
  rect(ctx, 0, 17, 48, 1, PAL.O);
  return canvas;
}

/** Cross with a chibi-scale figure (head ≈10px, body ≈22px tall). hero = Jesus (halo, white cloth, INRI board); otherwise a thief. */
function crucifix(hero: boolean) {
  const { canvas, ctx } = makeCanvas(48, 54);
  rect(ctx, 14, 52, 20, 2, PAL.z);
  rect(ctx, 22, 4, 4, 48, PAL.o);
  rect(ctx, 22, 4, 1, 48, PAL.u);
  rect(ctx, 25, 4, 1, 48, PAL.O);
  rect(ctx, 2, 19, 44, 4, PAL.o);
  rect(ctx, 2, 19, 44, 1, PAL.u);
  rect(ctx, 2, 22, 44, 1, PAL.O);
  if (hero) {
    rect(ctx, 18, 0, 12, 4, PAL.p);
    rect(ctx, 18, 3, 12, 1, PAL.P);
    for (const x of [20, 24, 28]) rect(ctx, x, 1, 2, 1, PAL.O);
  }
  const hair = hero ? PAL.d : PAL.h;
  rect(ctx, 8, 20, 32, 2, PAL.s); // arms along the beam
  rect(ctx, 20, 19, 8, 9, PAL.s); // torso
  rect(ctx, 20, 19, 2, 9, PAL.S);
  rect(ctx, 19, 9, 10, 10, hair); // head
  rect(ctx, 20, 12, 8, 6, PAL.s);
  rect(ctx, 21, 14, 2, 2, PAL.e);
  rect(ctx, 25, 14, 2, 2, PAL.e);
  rect(ctx, 21, 16, 1, 1, PAL.c);
  rect(ctx, 26, 16, 1, 1, PAL.c);
  rect(ctx, 23, 17, 2, 1, PAL.m);
  rect(ctx, 19, 9, 10, 1, hero ? PAL.G : hair);
  rect(ctx, 20, 25, 8, 4, hero ? PAL.w : PAL.P);
  rect(ctx, 20, 28, 8, 1, hero ? PAL.W : PAL.u);
  rect(ctx, 21, 29, 6, 5, PAL.s);
  rect(ctx, 21, 29, 2, 5, PAL.S);
  rect(ctx, 21, 34, 6, 2, PAL.S);
  if (hero) {
    for (const x of [6, 41]) rect(ctx, x, 20, 2, 2, PAL.r);
    rect(ctx, 23, 35, 2, 1, PAL.r);
    rect(ctx, 23, 22, 2, 2, PAL.r);
    for (const [x, y, w, h] of [[20, 6, 8, 1], [18, 7, 2, 1], [28, 7, 2, 1], [17, 8, 1, 10], [30, 8, 1, 10]]) rect(ctx, x, y, w, h, PAL.l); // halo ring
  }
  return canvas;
}

function eclipse() {
  const { canvas, ctx } = makeCanvas(40, 40);
  for (const [x, y, w, h] of [[14, 0, 12, 2], [8, 2, 24, 2], [4, 4, 32, 4], [2, 8, 36, 24], [4, 32, 32, 4], [8, 36, 24, 2], [14, 38, 12, 2]]) rect(ctx, x, y, w, h, "#fbbf24");
  for (const [x, y, w, h] of [[16, 4, 8, 2], [10, 6, 20, 2], [6, 8, 28, 24], [10, 32, 20, 2], [16, 34, 8, 2]]) rect(ctx, x, y, w, h, "#0b0b12");
  return canvas;
}

function candle(lit: boolean) {
  const { canvas, ctx } = makeCanvas(10, 18);
  rect(ctx, 2, 16, 6, 2, PAL.z);
  rect(ctx, 3, 6, 4, 10, PAL.w);
  rect(ctx, 6, 6, 1, 10, PAL.W);
  rect(ctx, 4, 4, 2, 2, PAL.e);
  if (lit) {
    rect(ctx, 4, 1, 2, 3, PAL.f);
    rect(ctx, 4, 2, 2, 2, PAL.y);
  }
  return canvas;
}

function candleHolder() {
  const { canvas, ctx } = makeCanvas(20, 12);
  rect(ctx, 1, 10, 18, 2, PAL.z);
  rect(ctx, 1, 4, 18, 6, PAL.A);
  rect(ctx, 3, 2, 14, 3, PAL.a);
  rect(ctx, 5, 3, 10, 1, PAL.A);
  rect(ctx, 1, 4, 18, 1, "#b4b8c0");
  return canvas;
}

function holyFace() {
  const { canvas, ctx } = makeCanvas(32, 42);
  rect(ctx, 0, 0, 32, 42, PAL.w);
  rect(ctx, 0, 36, 32, 6, PAL.W);
  rect(ctx, 0, 0, 32, 2, PAL.P);
  rect(ctx, 6, 6, 20, 24, "#c9a27a");
  rect(ctx, 8, 4, 16, 4, "#8a6a4a");
  rect(ctx, 6, 8, 4, 22, "#8a6a4a");
  rect(ctx, 22, 8, 4, 22, "#8a6a4a");
  rect(ctx, 10, 12, 12, 12, "#e5c9a8");
  rect(ctx, 12, 16, 2, 2, "#3a2a1a");
  rect(ctx, 18, 16, 2, 2, "#3a2a1a");
  rect(ctx, 14, 22, 4, 1, "#8a4a3a");
  rect(ctx, 10, 24, 12, 6, "#8a6a4a");
  rect(ctx, 14, 25, 4, 1, "#8a4a3a");
  return canvas;
}

function candleFlameSheet() {
  const { canvas, ctx } = makeCanvas(20, 18);
  for (let f = 0; f < 2; f++) {
    const x = f * 10;
    rect(ctx, x + 3, 6, 4, 10, PAL.w);
    rect(ctx, x + 6, 6, 1, 10, PAL.W);
    rect(ctx, x + 4, 4, 2, 2, PAL.e);
    rect(ctx, x + 4, f ? 0 : 1, 2, 4, PAL.f);
    rect(ctx, x + 4, f ? 1 : 2, 2, 2, PAL.y);
  }
  return canvas;
}

function calvaryTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#6e6358");
  for (const [x, y, w, h] of [[1, 1, 6, 4], [9, 6, 6, 5], [2, 10, 5, 4]]) {
    rect(ctx, x, y, w, h, "#7b6f63");
    rect(ctx, x, y + h - 1, w, 1, "#574d44");
  }
  for (const [x, y] of [[12, 2], [7, 7], [13, 14]]) rect(ctx, x, y, 1, 1, "#8a7d70");
  return canvas;
}

function darkTile() {
  const { canvas, ctx } = makeCanvas(16, 16);
  rect(ctx, 0, 0, 16, 16, "#3e4a3b");
  for (const [x, y] of [[2, 3], [9, 1], [13, 7], [5, 11], [11, 13], [1, 14]]) rect(ctx, x, y, 1, 2, "#344030");
  for (const [x, y] of [[6, 5], [12, 3], [3, 8], [10, 10], [14, 14]]) rect(ctx, x, y, 1, 1, "#4d5b49");
  return canvas;
}

/** Register every texture stages 11-15 need (idempotent). */
export function registerPassionTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  for (const [k, m] of Object.entries(PEOPLE)) add(k, () => fromMap(m));
  add("olive", olive);
  add("prayer_rock", prayerRock);
  add("bell", bell);
  add("moon", moon);
  add("slab_tile", slabTile);
  add("scourge_post", scourgePost);
  add("cloth", cloth);
  add("thorn", thorn);
  add("cloak", () => cloak(false));
  add("cloak_folded", () => cloak(true));
  add("throne", throne);
  add("house_front", houseFront);
  add("cross_beam", crossBeam);
  add("jesus_fallen", jesusFallen);
  add("crucifix_jesus", () => crucifix(true));
  add("crucifix_thief", () => crucifix(false));
  add("eclipse", eclipse);
  add("candle", () => candle(false));
  add("candle_lit", () => candle(true));
  add("candle_holder", candleHolder);
  add("holy_face", holyFace);
  add("calvary_tile", calvaryTile);
  add("dark_grass", darkTile);
  if (!tex.exists("candle_flame"))
    tex.addSpriteSheet("candle_flame", candleFlameSheet() as unknown as HTMLImageElement, { frameWidth: 10, frameHeight: 18 });
}
