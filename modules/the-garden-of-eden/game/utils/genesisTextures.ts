import * as Phaser from "phaser";
import { PAL, type PixelMap, drawMap, glowCanvas, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/**
 * Pixel textures for The Garden of Eden. Characters use the shared 32x32 chibi grid
 * (hair rows 6-9, face rows 10-15 x11-20, eyes rows 12-13, body 17-24, feet 25-26, shadow 27-29).
 * `C()` centres a row on the canvas so a map can never come out ragged.
 */
const C = (s: string, w = 32) => {
  const l = Math.floor((w - s.length) / 2);
  return ".".repeat(l) + s + ".".repeat(w - s.length - l);
};
const BLANK = C("");
const blanks = (n: number) => Array.from({ length: n }, () => BLANK);
const SHADOW: PixelMap = [C("zzzzzzzzzzzz"), C("zzzzzzzz"), BLANK];

// ---------- Characters (32x32) ----------

export const ADAM: PixelMap = [
  ...blanks(6),
  C("hhhhhhhhhh"), C("hhhhhhhhhhhh"), C("hhhhhhhhhhhh"), C("hhssssssssh"),
  C("ssssssssss"), C("ssssssssss"), C("sseesseess"), C("sseesseess"), C("scsssssscs"), C("sssmmmsss"),
  C("ss"),
  C("ssssssssss"), C("ssssSSssss"), C("ssssssssss"), C("ssGGGGGGss"),
  C("sGgGggGgGs"), C("GGgGGgGGgG"), C("..GGgGGG.."), C("..ss..ss.."),
  C("..ss..ss.."), C("..uu..uu.."),
  ...SHADOW,
];

export const EVE: PixelMap = [
  ...blanks(6),
  C("dddddddddd"), C("dddddddddddd"), C("dddddddddddd"), C("ddsssssssdd"),
  C("dssssssssssd"), C("dssssssssssd"), C("dsseesseessd"), C("dsseesseessd"), C("dscsssssscsd"), C("dsssmmmsssd"),
  C("dssssssssd"),
  C("dsssssssssd"), C("dsssSSsssd"), C("dsssssssssd"), C("dsGGGGGGsd"),
  C("dGgGggGgGd"), C("dGGgGGgGGd"), C("d.GGgGGG.d"), C("d..ss.ss..d"),
  C("...ss.ss..."), C("...uu.uu..."),
  ...SHADOW,
];

// ---------- Dove of the Holy Spirit (16x16, 2 frames) ----------
const DOVE_UP: PixelMap = [
  "................", "...W..........W.", "..WwW........WwW", "..WwwW......WwwW",
  "...WwwWwwwwWwwW.", "....WwwwwwwwwW..", ".....wwwwwwwww.y", ".....wwwwwwwwwyy",
  "......wwwwwwww..", ".......wwwwww...", "........WWWW....", ".........yy.....",
  "................", "................", "................", "................",
];
const DOVE_DOWN: PixelMap = [
  "................", "................", "................", "................",
  "......WwwwwwW...", "....WWwwwwwwwW..", "...WwwwwwwwwwwWy", "..WwwwwwwwwwwwWy",
  "..WwW.wwwwwwww..", "...W...wwwwww...", "........WWWW....", ".........yy.....",
  "................", "................", "................", "................",
];

// ---------- Serpent (32x32, 2 frames: tongue flick) ----------
const serpent = (tongue: boolean): PixelMap => [
  ...blanks(8),
  C("GGGGGG"), C("GggggggG"), C("GyegegyG"), C("GggggggG"),
  C(tongue ? "GGGGGGrr" : "GGGGGG"), C("GggggGG"), C("..GggG"), C("..GgvG"),
  C("..GvgG"), C("GGGgGGG.."), C("GgvgggG"), C("GGGGGGGG"), C("Gggvggg"), C("GGGGGGG"),
  ...blanks(2), C("zzzzzzzzzz"), C("zzzzzz"), BLANK, BLANK, BLANK,
];

export function registerGenesisTextures(scene: Phaser.Scene) {
  if (scene.textures.exists("gen_adam")) return; // idempotent
  const tex = scene.textures;

  const sheet = (key: string, frames: ((ctx: CanvasRenderingContext2D, ox: number) => void)[], w: number, h: number) => {
    const { canvas, ctx } = makeCanvas(w * frames.length, h);
    frames.forEach((paint, i) => paint(ctx, i * w));
    tex.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };
  const still = (key: string, w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    tex.addCanvas(key, canvas);
  };

  // People & spirits
  sheet("gen_adam", [(c, x) => drawMap(c, ADAM, x)], 32, 32);
  sheet("gen_eve", [(c, x) => drawMap(c, EVE, x)], 32, 32);
  sheet("gen_dove", [(c, x) => drawMap(c, DOVE_UP, x), (c, x) => drawMap(c, DOVE_DOWN, x)], 16, 16);
  sheet("gen_serpent", [(c, x) => drawMap(c, serpent(false), x), (c, x) => drawMap(c, serpent(true), x)], 32, 32);

  // Cherubim: 48x32, body on the 32 grid at x+8, wings mirrored, flaming sword
  const WING: PixelMap = [
    "............", "...........w", "..........ww", "........www.", "......wwwWW.", "....wwwwWW..",
    "...wwwwWW...", "...wwwWW....", "....wwWW....", ".....WW.....",
  ];
  still("gen_cherub", 48, 32, (c) => {
    drawMap(c, WING, 0, 12);
    drawMap(c, WING, 36, 12, true);
    rect(c, 8 + 11, 6, 10, 4, PAL.y); // golden hair
    rect(c, 8 + 11, 10, 10, 6, PAL.s); // face
    rect(c, 8 + 13, 12, 2, 2, PAL.e); rect(c, 8 + 17, 12, 2, 2, PAL.e);
    rect(c, 8 + 13, 14, 1, 1, PAL.c); rect(c, 8 + 18, 14, 1, 1, PAL.c);
    rect(c, 8 + 11, 26, 10, 2, PAL.z);
    rect(c, 8 + 11, 17, 10, 8, PAL.w); // white robe
    rect(c, 8 + 11, 17, 10, 1, PAL.y);
    rect(c, 8 + 11, 20, 10, 5, PAL.W);
    rect(c, 8 + 11, 5, 10, 1, PAL.y); // halo
    rect(c, 8 + 10, 4, 12, 1, PAL.y);
    rect(c, 42, 8, 2, 20, PAL.f); // flaming sword
    rect(c, 42, 6, 2, 2, PAL.y);
    rect(c, 40, 14, 6, 1, PAL.Y);
  });

  // Animals (2 frames: step), all face right. Legs alternate height per frame.
  const legs = (c: CanvasRenderingContext2D, xs: number[], top: number, bottom: number, w: number, f: number, col: string) =>
    xs.forEach((lx, k) => rect(c, lx, top, w, bottom - top - ((k + f) % 2), col));
  sheet("gen_sheep", [0, 1].map((f) => (c: CanvasRenderingContext2D, x: number) => {
    rect(c, x + 3, 18, 15, 2, PAL.z);
    legs(c, [x + 5, x + 8, x + 12, x + 15], 13, 19, 2, f, PAL.I);
    rect(c, x + 3, 6, 14, 8, PAL.w); rect(c, x + 5, 4, 5, 2, PAL.w); rect(c, x + 11, 3, 5, 3, PAL.w); rect(c, x + 3, 12, 14, 2, PAL.W);
    rect(c, x + 6, 8, 2, 2, PAL.W); rect(c, x + 12, 8, 2, 2, PAL.W);
    rect(c, x + 16, 6, 6, 7, PAL.i); rect(c, x + 16, 4, 4, 3, PAL.w); rect(c, x + 15, 8, 1, 3, PAL.I); rect(c, x + 21, 5, 2, 2, PAL.I);
    rect(c, x + 19, 8, 2, 2, PAL.w); rect(c, x + 20, 9, 1, 1, PAL.e); rect(c, x + 21, 11, 1, 1, PAL.e);
  }), 24, 20);
  sheet("gen_lion", [0, 1].map((f) => (c: CanvasRenderingContext2D, x: number) => {
    rect(c, x + 2, 20, 20, 2, PAL.z);
    legs(c, [x + 3, x + 7, x + 11, x + 14], 15, 21, 3, f, PAL.Y);
    rect(c, x + 2, 9, 14, 8, PAL.y); rect(c, x + 2, 15, 14, 2, PAL.Y);
    rect(c, x, 9, 2, 1, PAL.Y); rect(c, x, 6, 1, 4, PAL.Y); rect(c, x, 4, 3, 3, PAL.o);
    rect(c, x + 12, 3, 11, 13, PAL.o); rect(c, x + 14, 2, 7, 1, PAL.o); rect(c, x + 12, 13, 11, 3, PAL.O);
    rect(c, x + 14, 5, 7, 8, PAL.y); rect(c, x + 14, 3, 2, 2, PAL.y); rect(c, x + 19, 3, 2, 2, PAL.y);
    rect(c, x + 16, 7, 1, 2, PAL.e); rect(c, x + 19, 7, 1, 2, PAL.e);
    rect(c, x + 16, 10, 4, 3, PAL.j); rect(c, x + 17, 10, 2, 1, PAL.e); rect(c, x + 17, 12, 2, 1, PAL.m);
  }), 24, 22);
  sheet("gen_deer", [0, 1].map((f) => (c: CanvasRenderingContext2D, x: number) => {
    rect(c, x + 4, 24, 14, 2, PAL.z);
    legs(c, [x + 4, x + 7, x + 12, x + 15], 18, 25, 2, f, PAL.T);
    rect(c, x + 3, 12, 14, 7, PAL.t); rect(c, x + 3, 17, 14, 2, PAL.j);
    for (const [sx, sy] of [[6, 13], [9, 15], [12, 13], [14, 15]]) rect(c, x + sx, sy, 1, 1, PAL.w);
    rect(c, x + 1, 12, 2, 3, PAL.w);
    rect(c, x + 14, 7, 4, 7, PAL.t); rect(c, x + 16, 5, 6, 5, PAL.t); rect(c, x + 20, 7, 3, 3, PAL.j);
    rect(c, x + 22, 8, 1, 1, PAL.e); rect(c, x + 18, 6, 1, 1, PAL.e); rect(c, x + 15, 4, 2, 2, PAL.t);
    rect(c, x + 16, 0, 1, 5, PAL.O); rect(c, x + 14, 1, 2, 1, PAL.O); rect(c, x + 14, 0, 1, 1, PAL.O);
    rect(c, x + 19, 0, 1, 5, PAL.O); rect(c, x + 20, 1, 2, 1, PAL.O); rect(c, x + 21, 0, 1, 1, PAL.O);
  }), 24, 26);
  sheet("gen_elephant", [0, 1].map((f) => (c: CanvasRenderingContext2D, x: number) => {
    rect(c, x + 2, 28, 28, 2, PAL.z);
    legs(c, [x + 4, x + 9, x + 15, x + 20], 21, 29, 4, f, PAL.A);
    rect(c, x + 3, 8, 20, 14, PAL.a); rect(c, x + 3, 19, 20, 3, PAL.A);
    rect(c, x + 2, 10, 1, 7, PAL.A); rect(c, x + 1, 15, 3, 2, PAL.I);
    rect(c, x + 19, 5, 10, 12, PAL.a); rect(c, x + 14, 6, 6, 11, PAL.A); rect(c, x + 16, 8, 3, 7, PAL.c);
    rect(c, x + 25, 9, 2, 2, PAL.e);
    rect(c, x + 27, 14, 3, 8 + f, PAL.a); rect(c, x + 27, 16, 1, 5, PAL.A); rect(c, x + 28, 21 + f, 3, 2, PAL.a);
    rect(c, x + 24, 15, 2, 4, PAL.w); rect(c, x + 25, 18, 3, 1, PAL.w);
  }), 32, 30);
  sheet("gen_fish", [0, 1].map((f) => (c: CanvasRenderingContext2D, x: number) => {
    rect(c, x + 3, 3, 7, 6, PAL.f); rect(c, x + 4, 2, 5, 1, PAL.f); rect(c, x + 4, 9, 5, 1, PAL.f); rect(c, x + 10, 4, 1, 4, PAL.f);
    rect(c, x + 4, 7, 5, 2, PAL.y); rect(c, x + 6, 3, 1, 6, PAL.w); rect(c, x + 5, 1, 3, 1, PAL.Y);
    rect(c, x + 2, 5, 1, 2, PAL.f); rect(c, x + 1, 4, 1, 4, PAL.f); rect(c, x, 3 + f, 1, 5 - f, PAL.Y);
    rect(c, x + 8, 4, 2, 2, PAL.w); rect(c, x + 9, 5, 1, 1, PAL.e);
  }), 12, 12);
  sheet("gen_bird", [0, 1].map((f) => (c: CanvasRenderingContext2D, x: number) => {
    rect(c, x + 3, 5, 8, 5, PAL.r); rect(c, x + 4, 4, 6, 1, PAL.r); rect(c, x + 10, 2, 4, 5, PAL.r); rect(c, x + 9, 3, 1, 3, PAL.r);
    rect(c, x + 5, 8, 6, 2, PAL.j); rect(c, x, 6, 3, 2, PAL.R);
    rect(c, x + 14, 4, 2, 2, PAL.y); rect(c, x + 12, 3, 1, 1, PAL.e);
    if (f) rect(c, x + 5, 5, 4, 4, PAL.R); else { rect(c, x + 4, 1, 3, 4, PAL.R); rect(c, x + 5, 5, 4, 3, PAL.R); }
    rect(c, x + 6, 10, 1, 2, PAL.Y); rect(c, x + 8, 10, 1, 2, PAL.Y);
  }), 16, 12);

  // Trees (48x64): life = gold fruit & light canopy, knowledge = violet canopy & red fruit
  const tree = (canopy: [string, string], fruit: string, trunk: [string, string]) => (c: CanvasRenderingContext2D) => {
    rect(c, 14, 61, 20, 3, PAL.z);
    rect(c, 20, 34, 8, 28, trunk[0]); rect(c, 24, 34, 4, 28, trunk[1]); rect(c, 16, 58, 16, 4, trunk[0]);
    rect(c, 8, 22, 32, 18, canopy[1]); rect(c, 4, 28, 40, 10, canopy[1]);
    rect(c, 12, 8, 24, 30, canopy[0]); rect(c, 6, 18, 36, 16, canopy[0]); rect(c, 16, 2, 16, 8, canopy[0]);
    rect(c, 10, 30, 28, 4, canopy[1]);
    for (const [fx, fy] of [[14, 14], [28, 10], [22, 22], [10, 26], [34, 24], [18, 32], [30, 32]]) rect(c, fx, fy, 3, 3, fruit);
  };
  still("gen_tree_life", 48, 64, tree([PAL.g, PAL.G], PAL.y, [PAL.o, PAL.O]));
  still("gen_tree_knowledge", 48, 64, tree([PAL.V, PAL.Z], PAL.r, [PAL.O, PAL.K]));

  // Sparkle + glows (shared look with Rosary: integer glow discs, 4-pt sparkle)
  if (!tex.exists("sparkle")) still("sparkle", 7, 7, (c) => { rect(c, 3, 0, 1, 7, PAL.l); rect(c, 0, 3, 7, 1, PAL.l); rect(c, 2, 2, 3, 3, PAL.w); });
  tex.addCanvas("gen_glow_gold", glowCanvas(16, PAL.y));
  tex.addCanvas("gen_glow_violet", glowCanvas(16, PAL.v));
  still("gen_floor", 16, 16, (c) => { rect(c, 0, 0, 16, 16, PAL.G); rect(c, 2, 3, 2, 1, PAL.g); rect(c, 10, 9, 3, 1, PAL.g); rect(c, 6, 13, 2, 1, PAL.g); rect(c, 12, 2, 1, 2, PAL.g); });
}
