import * as Phaser from "phaser";
import { PAL, drawMap, glowCanvas, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
// ponytail: reuse King David's chibi `person()` builder + dove frames; move them to modules/shared if a 3rd game needs them.
import { DOVE_DOWN, DOVE_UP, person } from "@/modules/king-david/game/utils/davidTextures";

/**
 * Pixel textures for Joseph – The Coat of the Sun. People use the shared 32x32 chibi grid via `person()`
 * so they stand next to the player sprite. Joseph has three outfits (script: Sun Coat -> slave tunic -> governor).
 */

// ---------- People (32x32), registered as `joseph_<key>` ----------
export const PEOPLE = {
  sun: person({ hair: "h", robe: "y", shade: "f", short: true }), // Chiếc Áo Mặt Trời (St 37-38)
  slave: person({ hair: "h", robe: "M", shade: "o", short: true }), // áo nô lệ / tù nhân (St 39-40)
  governor: person({ hair: "h", robe: "w", shade: "W", cap: "E", stripe: "y", flaps: true }), // tể tướng (St 41+)
  jacob: person({ hair: "w", robe: "p", shade: "P", beard: "W" }),
  brother: person({ hair: "h", robe: "t", shade: "T", short: true }),
  brother_b: person({ hair: "d", robe: "i", shade: "I", short: true, beard: "h" }),
  brother_c: person({ hair: "h", robe: "G", shade: "H", short: true }),
  benjamin: person({ hair: "d", robe: "b", shade: "B", short: true }),
  stranger: person({ hair: "w", robe: "U", shade: "W", beard: "W", cap: "M" }),
  trader: person({ hair: "h", robe: "i", shade: "I", short: true, cap: "M", flaps: true }),
  potiphar: person({ hair: "h", robe: "U", shade: "W", cap: "h" }),
  pharaoh: person({ hair: "h", robe: "w", shade: "W", cap: "b", stripe: "y", flaps: true }),
  cupbearer: person({ hair: "h", robe: "C", shade: "E", short: true }),
  baker: person({ hair: "h", robe: "T", shade: "o", short: true }),
  freed: person({ hair: "h", robe: "w", shade: "W", short: true }), // áo lanh trắng khi vừa ra ngục (St 41)
  shadow: person({ hair: "Z", robe: "Z", shade: "L", short: true, cap: "L" }), // bóng đen của lời mời xấu (Stage 6)
  egyptian: person({ hair: "h", robe: "U", shade: "W", short: true, cap: "h" }),
} as const;

type Paint = (ctx: CanvasRenderingContext2D, ox: number) => void;

export function registerJosephTextures(scene: Phaser.Scene) {
  if (scene.textures.exists("joseph_sun")) return; // idempotent
  const tex = scene.textures;
  const sheet = (key: string, frames: Paint[], w: number, h: number) => {
    const { canvas, ctx } = makeCanvas(w * frames.length, h);
    frames.forEach((paint, i) => paint(ctx, i * w));
    tex.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };
  const still = (key: string, w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    tex.addCanvas(key, canvas);
  };

  for (const [key, map] of Object.entries(PEOPLE)) sheet(`joseph_${key}`, [(c, x) => drawMap(c, map, x)], 32, 32);
  sheet("joseph_dove", [(c, x) => drawMap(c, DOVE_UP, x), (c, x) => drawMap(c, DOVE_DOWN, x)], 16, 16);

  // The Sun Coat as an item (20x20): golden long-sleeved coat with sunray stripes
  still("joseph_coat", 20, 20, (c) => {
    rect(c, 3, 18, 14, 2, PAL.z);
    rect(c, 1, 5, 4, 10, PAL.y); rect(c, 15, 5, 4, 10, PAL.y); // sleeves
    rect(c, 5, 3, 10, 14, PAL.y); rect(c, 8, 2, 4, 2, PAL.Y); // body + neck
    for (const x of [6, 8, 10, 12, 14]) rect(c, x, 5, 1, 11, PAL.f); // rays
    rect(c, 1, 13, 4, 2, PAL.f); rect(c, 15, 13, 4, 2, PAL.f); // cuffs
    rect(c, 5, 15, 10, 2, PAL.Y);
  });
  // Torn / stained coat (Stage 3): same shape, dull with a dark-red stain
  still("joseph_coat_torn", 20, 20, (c) => {
    rect(c, 3, 18, 14, 2, PAL.z);
    rect(c, 1, 5, 4, 10, PAL.Y); rect(c, 15, 5, 4, 10, PAL.Y);
    rect(c, 5, 3, 10, 14, PAL.Y); rect(c, 8, 2, 4, 2, PAL.o);
    rect(c, 7, 7, 5, 6, PAL.R); rect(c, 9, 12, 3, 3, PAL.R);
    rect(c, 5, 15, 3, 2, PAL.z); rect(c, 12, 16, 3, 1, PAL.z); // frayed hem
  });

  // Wheat sheaf (14x20)
  still("joseph_sheaf", 14, 20, (c) => {
    rect(c, 2, 18, 10, 2, PAL.z);
    rect(c, 6, 8, 2, 10, PAL.Y);
    for (const [x, y] of [[2, 3], [5, 1], [8, 2], [11, 4], [3, 7], [10, 8]]) { rect(c, x, y, 2, 6, PAL.y); rect(c, x, y, 2, 2, PAL.l); }
    rect(c, 3, 12, 8, 2, PAL.o); // binding
  });
  // Silver cup (10x12)
  still("joseph_cup", 10, 12, (c) => {
    rect(c, 1, 10, 8, 2, PAL.z);
    rect(c, 2, 2, 6, 5, PAL.W); rect(c, 3, 3, 4, 3, PAL.w); rect(c, 4, 7, 2, 2, PAL.W); rect(c, 2, 9, 6, 1, PAL.W);
  });
  // Grain sack (14x16)
  still("joseph_sack", 14, 16, (c) => { // grain sack: wide belly, tied neck, golden grain peeking out
    rect(c, 1, 14, 12, 2, PAL.z);
    rect(c, 2, 6, 10, 8, PAL.Q); rect(c, 1, 8, 12, 5, PAL.Q); rect(c, 2, 12, 10, 2, PAL.J); rect(c, 10, 7, 2, 6, PAL.J);
    rect(c, 4, 4, 6, 3, PAL.Q); rect(c, 4, 6, 6, 1, PAL.M); rect(c, 5, 1, 4, 3, PAL.y); rect(c, 6, 0, 2, 1, PAL.l);
    rect(c, 5, 9, 4, 1, PAL.M); rect(c, 5, 11, 4, 1, PAL.M);
  });
  // Dry well, angled top view (32x28)
  still("joseph_well", 32, 28, (c) => {
    rect(c, 3, 26, 26, 2, PAL.z);
    rect(c, 4, 8, 24, 16, PAL.a); rect(c, 4, 20, 24, 4, PAL.A); // stone ring
    rect(c, 8, 6, 16, 4, PAL.a);
    rect(c, 8, 9, 16, 9, PAL.D); rect(c, 11, 11, 10, 5, PAL.e); // dark shaft
    for (const x of [4, 12, 20]) rect(c, x, 22, 8, 1, PAL.D);
  });
  // Camel (48x32, faces right), 2-frame walk
  const camel = (step: number): Paint => (c, x) => {
    rect(c, x + 6, 29, 32, 3, PAL.z);
    rect(c, x + 8, 12, 24, 10, PAL.M); rect(c, x + 10, 6, 6, 6, PAL.M); rect(c, x + 20, 6, 6, 6, PAL.M); // body + 2 humps
    rect(c, x + 8, 19, 24, 3, PAL.o);
    rect(c, x + 31, 8, 4, 8, PAL.M); rect(c, x + 33, 4, 8, 6, PAL.M); rect(c, x + 38, 6, 4, 4, PAL.j); rect(c, x + 36, 5, 1, 1, PAL.e); // neck + head
    rect(c, x + 6, 13, 3, 5, PAL.M);
    rect(c, x + 12, 8, 8, 3, PAL.r); rect(c, x + 12, 11, 8, 1, PAL.y); // saddle blanket
    for (const [lx, d] of [[10, 0], [15, 1], [26, 1], [30, 0]] as const) rect(c, x + lx, 22, 3, d === step ? 7 : 6, PAL.o);
  };
  sheet("joseph_camel", [camel(0), camel(1)], 48, 32);

  // Ground tiles (16x16)
  still("joseph_grass", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.g);
    for (const [x, y] of [[2, 3], [9, 2], [13, 7], [5, 11], [11, 13]]) rect(c, x, y, 2, 1, PAL.G);
    rect(c, 7, 6, 1, 1, PAL.N);
  });
  still("joseph_wheat", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.j);
    for (const [x, y] of [[1, 2], [6, 0], [11, 3], [3, 8], [9, 9], [14, 12], [5, 13]]) { rect(c, x, y, 1, 4, PAL.y); rect(c, x, y, 1, 1, PAL.l); }
  });
  still("joseph_sand", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.Q);
    for (const [x, y, w] of [[2, 3, 3], [9, 1, 2], [12, 8, 3], [4, 11, 2], [10, 14, 3]]) rect(c, x, y, w, 1, PAL.J);
    rect(c, 7, 6, 1, 1, PAL.Y);
  });
  still("joseph_stone", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.a);
    rect(c, 0, 7, 16, 1, PAL.A); rect(c, 0, 15, 16, 1, PAL.A); rect(c, 5, 0, 1, 7, PAL.A); rect(c, 11, 8, 1, 7, PAL.A);
    rect(c, 2, 3, 2, 1, PAL.W); rect(c, 8, 11, 3, 1, PAL.W);
  });
  still("joseph_brick", 16, 16, (c) => { // Egyptian mud-brick wall / granary
    rect(c, 0, 0, 16, 16, PAL.j);
    for (const y of [0, 5, 10, 15]) rect(c, 0, y, 16, 1, PAL.M);
    for (const [x, y] of [[4, 1], [11, 6], [4, 11]]) rect(c, x, y, 1, 4, PAL.M);
  });

  still("joseph_cliff", 16, 16, (c) => { // impassable rock wall tile
    rect(c, 0, 0, 16, 16, PAL.A);
    for (const y of [3, 9, 14]) rect(c, 0, y, 16, 2, PAL.D);
    for (const [x, y] of [[2, 1], [9, 5], [5, 11]]) rect(c, x, y, 4, 2, PAL.a);
  });
  still("joseph_pool", 16, 16, (c) => { // oasis water
    rect(c, 0, 0, 16, 16, PAL.x);
    for (const [x, y] of [[2, 3], [9, 8], [4, 12]]) rect(c, x, y, 4, 1, PAL.w);
    rect(c, 0, 0, 16, 1, PAL.X);
  });

  // Props
  still("joseph_rock", 20, 14, (c) => {
    rect(c, 2, 13, 16, 1, PAL.z);
    rect(c, 6, 2, 8, 2, PAL.a); rect(c, 3, 4, 14, 4, PAL.a); rect(c, 1, 8, 18, 5, PAL.a); rect(c, 12, 5, 6, 8, PAL.A); rect(c, 1, 12, 18, 1, PAL.A); rect(c, 6, 3, 3, 1, PAL.W);
  });
  still("joseph_thorn", 16, 14, (c) => { // dry thorn bush
    rect(c, 2, 13, 12, 1, PAL.z);
    rect(c, 7, 6, 2, 7, PAL.o); rect(c, 3, 4, 10, 4, PAL.o); rect(c, 5, 2, 6, 3, PAL.u);
    for (const [x, y] of [[2, 3], [6, 0], [12, 3], [1, 7], [13, 7]]) rect(c, x, y, 1, 2, PAL.Y);
  });
  still("joseph_palm", 26, 40, (c) => {
    rect(c, 5, 37, 16, 3, PAL.z);
    rect(c, 12, 12, 3, 26, PAL.o); rect(c, 13, 12, 1, 26, PAL.O);
    for (const [x, y, w] of [[2, 6, 10], [14, 6, 10], [5, 3, 16], [8, 1, 10]]) rect(c, x, y, w, 3, PAL.g);
    rect(c, 4, 9, 8, 2, PAL.G); rect(c, 14, 9, 8, 2, PAL.G); rect(c, 11, 10, 4, 3, PAL.Y); // fronds + dates
  });
  still("joseph_cairn", 14, 16, (c) => {
    rect(c, 2, 15, 10, 1, PAL.z);
    rect(c, 2, 10, 10, 5, PAL.a); rect(c, 3, 6, 8, 5, PAL.A); rect(c, 5, 3, 4, 4, PAL.a); rect(c, 3, 11, 3, 1, PAL.W); rect(c, 6, 7, 2, 1, PAL.W);
  });
  still("joseph_sign", 14, 24, (c) => {
    rect(c, 3, 23, 8, 1, PAL.z);
    rect(c, 6, 6, 2, 17, PAL.o); rect(c, 1, 3, 12, 6, PAL.o); rect(c, 2, 4, 10, 4, PAL.p); rect(c, 4, 5, 6, 2, PAL.Y);
  });
  still("joseph_jar", 14, 18, (c) => { // water jar (pickup)
    rect(c, 2, 16, 10, 2, PAL.z);
    rect(c, 5, 2, 4, 3, PAL.t); rect(c, 3, 5, 8, 10, PAL.t); rect(c, 3, 12, 8, 3, PAL.T); rect(c, 4, 7, 2, 4, PAL.x); rect(c, 10, 6, 2, 5, PAL.T);
  });
  still("joseph_rope", 12, 14, (c) => { // coil of rope (pickup)
    rect(c, 2, 12, 8, 2, PAL.z);
    rect(c, 2, 4, 8, 8, PAL.Q); rect(c, 4, 6, 4, 4, PAL.e); rect(c, 3, 5, 6, 1, PAL.M); rect(c, 3, 10, 6, 1, PAL.M); rect(c, 2, 7, 1, 2, PAL.M); rect(c, 9, 7, 1, 2, PAL.M);
  });
  still("joseph_slot", 18, 10, (c) => { // dream-sheaf placement ring
    rect(c, 3, 0, 12, 1, PAL.l); rect(c, 1, 1, 16, 1, PAL.l); rect(c, 0, 2, 18, 6, PAL.l);
    rect(c, 1, 8, 16, 1, PAL.l); rect(c, 3, 9, 12, 1, PAL.l);
    rect(c, 3, 2, 12, 6, PAL.Y); rect(c, 4, 3, 10, 4, PAL.o);
  });
  still("joseph_tent", 44, 32, (c) => {
    rect(c, 3, 30, 38, 2, PAL.z);
    rect(c, 21, 2, 2, 4, PAL.o);
    for (const [x, y, w] of [[18, 5, 8], [14, 8, 16], [9, 11, 26], [5, 14, 34]]) rect(c, x, y, w, 3, PAL.t);
    rect(c, 4, 17, 36, 13, PAL.M); rect(c, 4, 26, 36, 4, PAL.o);
    for (const x of [9, 19, 29]) rect(c, x, 17, 4, 13, PAL.Y);
    rect(c, 18, 19, 8, 11, PAL.D);
  });

  // ---- Egypt props (Stages 5-8)
  still("joseph_table", 40, 26, (c) => {
    rect(c, 3, 24, 34, 2, PAL.z);
    rect(c, 2, 8, 36, 6, PAL.o); rect(c, 2, 8, 36, 2, PAL.Y); rect(c, 4, 14, 3, 10, PAL.O); rect(c, 33, 14, 3, 10, PAL.O);
    rect(c, 8, 4, 6, 4, PAL.j); rect(c, 22, 5, 5, 3, PAL.t); // bread + bowl
  });
  still("joseph_oven", 28, 26, (c) => {
    rect(c, 2, 24, 24, 2, PAL.z);
    rect(c, 2, 8, 24, 16, PAL.t); rect(c, 2, 20, 24, 4, PAL.T); rect(c, 8, 2, 12, 7, PAL.T);
    rect(c, 9, 14, 10, 8, PAL.D); rect(c, 11, 17, 6, 4, PAL.f); rect(c, 12, 19, 4, 2, PAL.y);
  });
  still("joseph_pillar", 16, 44, (c) => { // lotus-capital pillar
    rect(c, 2, 42, 12, 2, PAL.z);
    rect(c, 4, 8, 8, 34, PAL.j); rect(c, 4, 8, 2, 34, PAL.W); rect(c, 10, 8, 2, 34, PAL.M); rect(c, 2, 40, 12, 2, PAL.M);
    rect(c, 2, 2, 12, 6, PAL.E); rect(c, 4, 0, 8, 3, PAL.g); rect(c, 4, 12, 8, 2, PAL.y); rect(c, 4, 20, 8, 2, PAL.r);
  });
  still("joseph_throne", 32, 36, (c) => {
    rect(c, 3, 34, 26, 2, PAL.z);
    rect(c, 6, 4, 20, 28, PAL.Y); rect(c, 8, 6, 16, 22, PAL.b);
    rect(c, 4, 22, 24, 10, PAL.y); rect(c, 4, 29, 24, 3, PAL.Y); rect(c, 12, 2, 8, 3, PAL.y); rect(c, 15, 3, 2, 2, PAL.E);
  });
  still("joseph_granary", 36, 44, (c) => {
    rect(c, 3, 42, 30, 2, PAL.z);
    rect(c, 4, 12, 28, 30, PAL.j); rect(c, 4, 38, 28, 4, PAL.M);
    for (const y of [18, 26, 34]) rect(c, 4, y, 28, 1, PAL.M);
    rect(c, 8, 4, 20, 9, PAL.M); rect(c, 12, 1, 12, 4, PAL.M); rect(c, 14, 28, 8, 14, PAL.O);
  });
  still("joseph_cow_fat", 24, 16, (c) => {
    rect(c, 2, 14, 20, 2, PAL.z);
    rect(c, 3, 4, 17, 8, PAL.t); rect(c, 3, 9, 17, 3, PAL.T); rect(c, 17, 2, 5, 8, PAL.t); rect(c, 20, 3, 3, 4, PAL.j);
    for (const x of [5, 9, 14, 18]) rect(c, x, 12, 2, 3, PAL.O);
    rect(c, 20, 4, 1, 1, PAL.e); rect(c, 17, 1, 2, 2, PAL.O); rect(c, 7, 6, 4, 3, PAL.w);
  });
  still("joseph_cow_thin", 24, 16, (c) => {
    rect(c, 2, 14, 20, 2, PAL.z);
    rect(c, 4, 6, 15, 5, PAL.a); rect(c, 4, 9, 15, 2, PAL.A); rect(c, 17, 3, 4, 7, PAL.a); rect(c, 20, 4, 3, 3, PAL.W);
    for (const x of [5, 9, 14, 18]) rect(c, x, 11, 1, 4, PAL.D);
    rect(c, 19, 5, 1, 1, PAL.e); rect(c, 16, 2, 2, 2, PAL.D); for (const x of [6, 9, 12]) rect(c, x, 7, 1, 3, PAL.D);
  });
  still("joseph_vine", 14, 18, (c) => {
    rect(c, 2, 16, 10, 2, PAL.z);
    rect(c, 6, 2, 2, 12, PAL.o); rect(c, 3, 3, 4, 3, PAL.g); rect(c, 8, 7, 4, 3, PAL.G);
    for (const [x, y] of [[4, 10], [7, 11], [5, 13], [8, 14]]) rect(c, x, y, 2, 2, PAL.v);
  });
  still("joseph_basket", 16, 14, (c) => {
    rect(c, 2, 12, 12, 2, PAL.z);
    rect(c, 2, 7, 12, 5, PAL.M); rect(c, 3, 10, 10, 2, PAL.o); rect(c, 3, 4, 5, 4, PAL.j); rect(c, 8, 4, 5, 4, PAL.y);
  });
  still("joseph_bird", 14, 12, (c) => {
    rect(c, 2, 10, 10, 2, PAL.z);
    rect(c, 3, 4, 8, 4, PAL.i); rect(c, 9, 2, 3, 3, PAL.i); rect(c, 12, 3, 2, 1, PAL.y); rect(c, 0, 4, 3, 2, PAL.I); rect(c, 10, 3, 1, 1, PAL.w); rect(c, 5, 8, 1, 2, PAL.y); rect(c, 8, 8, 1, 2, PAL.y);
  });
  const door = (key: string, glow: string, frame: string) => still(key, 18, 30, (c) => {
    rect(c, 0, 0, 18, 30, PAL.O); rect(c, 2, 3, 14, 27, frame); rect(c, 3, 4, 12, 26, glow);
    rect(c, 4, 6, 10, 22, PAL.w === glow ? PAL.l : glow); rect(c, 13, 18, 2, 2, PAL.y);
  });
  door("joseph_door_white", PAL.w, PAL.y);
  door("joseph_door_red", PAL.R, PAL.o);

  still("joseph_wagon", 44, 30, (c) => { // Egyptian wagon, loaded with gifts
    rect(c, 4, 28, 36, 2, PAL.z);
    rect(c, 4, 12, 34, 10, PAL.o); rect(c, 4, 18, 34, 4, PAL.O); rect(c, 6, 6, 8, 7, PAL.j); rect(c, 16, 4, 8, 9, PAL.y); rect(c, 26, 7, 9, 6, PAL.t);
    for (const x of [8, 28]) { rect(c, x, 20, 8, 8, PAL.O); rect(c, x + 2, 22, 4, 4, PAL.Q); }
    rect(c, 38, 15, 6, 2, PAL.o);
  });

  still("joseph_pad", 24, 16, (c) => { // glowing relic pad
    rect(c, 2, 2, 20, 12, PAL.Y); rect(c, 4, 4, 16, 8, PAL.y); rect(c, 8, 5, 8, 6, PAL.l);
  });

  // Sparkle + glows
  if (!tex.exists("sparkle")) still("sparkle", 7, 7, (c) => { rect(c, 3, 0, 1, 7, PAL.l); rect(c, 0, 3, 7, 1, PAL.l); rect(c, 2, 2, 3, 3, PAL.w); });
  tex.addCanvas("joseph_glow_gold", glowCanvas(16, PAL.y));
  tex.addCanvas("joseph_glow_red", glowCanvas(16, PAL.r));
  tex.addCanvas("joseph_glow_sky", glowCanvas(16, PAL.x));
}
