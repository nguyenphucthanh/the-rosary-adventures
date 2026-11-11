import * as Phaser from "phaser";
import { PAL, type PixelMap, drawMap, glowCanvas, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/**
 * Pixel textures for Moses – The Exodus. People use the shared 32x32 chibi grid
 * (hair rows 6-9, face rows 10-15 x10-21, eyes rows 12-13, body 17-24, feet 25-26, shadow 27-29),
 * so they stand next to the player sprite. `C()` centres a row on the canvas so a map can never come out ragged.
 */
const C = (s: string, w = 32) => {
  const l = Math.floor((w - s.length) / 2);
  return ".".repeat(l) + s + ".".repeat(w - s.length - l);
};
const BLANK = C("");
const blanks = (n: number) => Array.from({ length: n }, () => BLANK);
const SHADOW: PixelMap = [C("zzzzzzzzzzzz"), C("zzzzzzzz"), BLANK];

// ---------- People (32x32) ----------

export interface Look {
  hair: string;
  robe: string; // palette key
  shade: string; // robe shade key
  beard?: string; // palette key
  long?: boolean; // long hair framing the face
  short?: boolean; // knee tunic instead of a full robe
  cap?: string; // headcloth / helmet colour replacing the hair rows
  stripe?: string; // alternating stripe colour on the headcloth (nemes)
  flaps?: boolean; // headcloth hangs past the cheeks
  crown?: boolean; // Pharaoh's double crown rising above the head
}

export const person = ({ hair, robe: r, shade: d, beard: b, long, short, cap, stripe, flaps, crown }: Look): PixelMap => {
  const h = cap ?? hair;
  const side = flaps ? h : long ? hair : "s";
  const top: PixelMap = crown
    ? [BLANK, BLANK, C("yy"), C("yyyy"), C("yrrrry"), C("yyyyyyyy")]
    : blanks(6);
  const stripeRow = stripe ? Array.from({ length: 12 }, (_, i) => (i % 2 ? stripe : h)).join("") : h.repeat(12);
  return [
    ...top,
    C(h.repeat(10)), C(stripeRow), C(h.repeat(12)), C(`${h}${h}ssssssss${h}${h}`),
    C(`${side}ssssssssss${side}`), C(`${side}ssssssssss${side}`), C(`${side}sseesseess${side}`), C(`${side}sseesseess${side}`),
    C(b ? `${b}scsssscs${b}` : `${side}scsssscs${side}`), C(b ? `${b}${b}${b}mm${b}${b}${b}` : `${side}sssmmsss${side}`),
    C(b ? `${b}${b}${b}${b}${b}${b}` : flaps ? `${h}${h}ss${h}${h}` : "ss"),
    C(r.repeat(10)), C(`s${r.repeat(8)}s`), C(`s${r.repeat(8)}s`), C(`s${r}${r}yyyy${r}${r}s`),
    C(`${r}${r}${r}${d.repeat(4)}${r}${r}${r}`), C(short ? `..${r.repeat(6)}..` : r.repeat(10)),
    ...(short ? [C("..ss..ss.."), C("..ss..ss..")] : [C(r.repeat(10)), C(`${r.repeat(2)}${d.repeat(6)}${r.repeat(2)}`)]),
    ...(short ? [C("..ss..ss.."), C("..uu..uu..")] : [C(r.repeat(10)), C("..uu..uu..")]),
    ...SHADOW,
  ];
};

/** Overlay `rows` on `map` at (x, y); "." keeps what is underneath. */
const stamp = (map: PixelMap, x: number, y: number, rows: PixelMap): PixelMap =>
  map.map((line, ry) => {
    const row = rows[ry - y];
    if (!row) return line;
    let out = line;
    for (let i = 0; i < row.length; i++) if (row[i] !== ".") out = out.slice(0, x + i) + row[i] + out.slice(x + i + 1);
    return out;
  });

/** The shepherd's staff (crook on top) held in the right hand. */
const STAFF: PixelMap = [
  "ooo.", "..o.", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..", "oO..",
];
const withStaff = (map: PixelMap) => stamp(stamp(map, 22, 7, STAFF), 21, 19, ["ss", "ss"]);

const TAMBOURINE: PixelMap = [".yyyy.", "yYYYYy", "yY..Yy", "yY..Yy", "yYYYYy", ".yyyy."];
const withTambourine = (map: PixelMap) => stamp(stamp(map, 22, 14, TAMBOURINE), 21, 18, ["s", "s"]);

export const MOSES_PRINCE = person({ hair: "h", robe: "w", shade: "W", cap: "w", stripe: "b", flaps: true });
export const MOSES_SHEPHERD = person({ hair: "h", robe: "M", shade: "o", cap: "M", beard: "W", flaps: false });
export const MOSES_LEADER = withStaff(person({ hair: "w", robe: "b", shade: "B", beard: "w" }));
export const MIRIAM = withTambourine(person({ hair: "h", robe: "E", shade: "C", long: true }));
export const AARON = person({ hair: "w", robe: "w", shade: "W", beard: "W", cap: "b" });
export const HUR = person({ hair: "W", robe: "G", shade: "H", beard: "W", cap: "y" });
export const JOSHUA = person({ hair: "h", robe: "t", shade: "T", short: true, cap: "a" });
export const PRINCESS = person({ hair: "h", robe: "w", shade: "E", long: true });
export const GUARD = person({ hair: "h", robe: "r", shade: "R", cap: "y", stripe: "b", flaps: true, short: true });
export const PHARAOH = person({ hair: "h", robe: "y", shade: "Y", cap: "b", stripe: "y", flaps: true, crown: true });

// ---------- Birds (16x16, 2 frames: wings up / down) — the Holy Spirit's dove ----------
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

// ---------- Painters for props ----------
type Paint = (ctx: CanvasRenderingContext2D, ox: number) => void;

/** A stepped flame tongue: outer orange, inner yellow, light core. Integer rects only. */
function tongue(c: CanvasRenderingContext2D, cx: number, baseY: number, h: number) {
  const widths = [6, 6, 4, 4, 2, 2];
  for (let k = 0; k < h && k < widths.length; k++) {
    const y = baseY - k - 1;
    rect(c, cx - widths[k] / 2, y, widths[k], 1, PAL.f);
    if (widths[k] > 2) rect(c, cx - widths[k] / 2 + 1, y, widths[k] - 2, 1, PAL.y);
    if (widths[k] > 4) rect(c, cx - 1, y, 2, 1, PAL.l);
  }
}

const bush = (flicker: number): Paint => (c, x) => {
  rect(c, x + 3, 28, 26, 3, PAL.z);
  rect(c, x + 14, 22, 4, 7, PAL.o); rect(c, x + 16, 22, 2, 7, PAL.O); // trunk
  rect(c, x + 3, 14, 26, 11, PAL.G); rect(c, x + 6, 11, 20, 4, PAL.G); rect(c, x + 3, 22, 26, 3, PAL.H);
  for (const [lx, ly] of [[6, 14], [11, 12], [17, 16], [22, 13], [8, 20], [24, 19], [14, 20]]) rect(c, x + lx, ly, 3, 2, PAL.g); // leaf clumps
  tongue(c, x + 9, 13, 4 + flicker); tongue(c, x + 16, 12, 6 - flicker); tongue(c, x + 23, 13, 4 + (1 - flicker)); // the bush burns but is not consumed
  rect(c, x + 12 - flicker * 4, 4, 1, 1, PAL.l); rect(c, x + 21 + flicker * 3, 2, 1, 1, PAL.y); // embers
};

const PILLAR_ROWS = [6, 8, 10, 12, 12, 14, 14, 12, 14, 14, 12, 12];
const pillar = (outer: string, mid: string, core: string, flicker: number): Paint => (c, x) => {
  PILLAR_ROWS.forEach((w0, i) => {
    const w = Math.min(16, w0 + (i % 2 === flicker ? 2 : 0));
    const y = i * 4;
    rect(c, x + (16 - w) / 2, y, w, 4, outer);
    rect(c, x + (16 - w) / 2 + 2, y, w - 4, 4, mid);
    rect(c, x + (16 - w) / 2 + 4, y, Math.max(2, w - 8), 4, core);
  });
};

const wheel = (c: CanvasRenderingContext2D, x: number, y: number) => {
  rect(c, x + 2, y, 8, 12, PAL.O); rect(c, x, y + 2, 12, 8, PAL.O); // round rim from rects
  rect(c, x + 3, y + 2, 6, 8, PAL.o); rect(c, x + 2, y + 3, 8, 6, PAL.o);
  rect(c, x + 5, y + 1, 2, 10, PAL.y); rect(c, x + 1, y + 5, 10, 2, PAL.y); rect(c, x + 5, y + 5, 2, 2, PAL.Y); // spokes + hub
};

export function registerExodusTextures(scene: Phaser.Scene) {
  if (scene.textures.exists("exodus_moses_leader")) return; // idempotent
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

  // People & bird
  for (const [key, map] of [
    ["exodus_moses_prince", MOSES_PRINCE], ["exodus_moses_shepherd", MOSES_SHEPHERD], ["exodus_moses_leader", MOSES_LEADER],
    ["exodus_miriam", MIRIAM], ["exodus_aaron", AARON], ["exodus_joshua", JOSHUA], ["exodus_hur", HUR], ["exodus_princess", PRINCESS], ["exodus_pharaoh", PHARAOH], ["exodus_guard", GUARD],
  ] as const) {
    sheet(key, [(c, x) => drawMap(c, map, x)], 32, 32);
  }
  sheet("exodus_dove", [(c, x) => drawMap(c, DOVE_UP, x), (c, x) => drawMap(c, DOVE_DOWN, x)], 16, 16);

  // Baby Moses in the reed basket (20x16)
  still("exodus_basket", 20, 16, (c) => {
    rect(c, 1, 14, 18, 2, PAL.z);
    rect(c, 6, 1, 8, 6, PAL.s); rect(c, 6, 1, 8, 2, PAL.h); rect(c, 8, 4, 1, 1, PAL.e); rect(c, 11, 4, 1, 1, PAL.e); rect(c, 7, 5, 1, 1, PAL.c); rect(c, 12, 5, 1, 1, PAL.c); // head
    rect(c, 3, 6, 14, 3, PAL.w); rect(c, 3, 8, 14, 1, PAL.W); // blanket
    rect(c, 1, 8, 18, 6, PAL.M); rect(c, 2, 13, 16, 1, PAL.o); rect(c, 0, 7, 20, 2, PAL.Y); // woven basket + rim
    for (const x of [3, 7, 11, 15]) rect(c, x, 9, 1, 4, PAL.Y);
    for (const y of [10, 12]) rect(c, 1, y, 18, 1, PAL.o);
  });

  // Staff item (16x16): diagonal shaft + crook
  still("exodus_staff", 16, 16, (c) => {
    for (let i = 0; i < 12; i++) { rect(c, 2 + i, 14 - i, 2, 1, PAL.o); rect(c, 2 + i, 15 - i, 2, 1, PAL.O); }
    rect(c, 12, 1, 3, 1, PAL.o); rect(c, 14, 2, 1, 3, PAL.o); rect(c, 12, 2, 1, 1, PAL.Y);
  });

  // Passover lamb (16x14, faces right)
  still("exodus_lamb", 16, 14, (c) => {
    rect(c, 2, 12, 12, 2, PAL.z);
    for (const x of [3, 6, 9, 12]) rect(c, x, 9, 2, 4, PAL.I);
    rect(c, 1, 4, 11, 6, PAL.w); rect(c, 3, 2, 6, 2, PAL.w); rect(c, 1, 8, 11, 2, PAL.W); rect(c, 4, 5, 2, 2, PAL.W); rect(c, 8, 5, 2, 2, PAL.W);
    rect(c, 10, 3, 5, 6, PAL.i); rect(c, 11, 1, 3, 3, PAL.w); rect(c, 9, 4, 1, 3, PAL.I); rect(c, 14, 2, 1, 2, PAL.I);
    rect(c, 13, 5, 1, 1, PAL.w); rect(c, 14, 8, 1, 1, PAL.e);
  });

  // Manna: pile of white flakes (16x16)
  still("exodus_manna", 16, 16, (c) => {
    rect(c, 2, 14, 12, 2, PAL.z);
    rect(c, 6, 7, 4, 1, PAL.w); rect(c, 4, 8, 8, 1, PAL.w); rect(c, 3, 9, 10, 1, PAL.w); rect(c, 2, 10, 12, 2, PAL.w); rect(c, 2, 12, 12, 2, PAL.W);
    for (const [x, y] of [[5, 9], [8, 8], [10, 10], [4, 11], [7, 11]]) rect(c, x, y, 1, 1, PAL.l);
  });

  // The two tablets (20x20)
  still("exodus_tablets", 20, 20, (c) => {
    rect(c, 1, 18, 18, 2, PAL.z);
    for (const x of [1, 11]) {
      rect(c, x + 2, 1, 5, 1, PAL.a); rect(c, x + 1, 2, 7, 1, PAL.a); rect(c, x, 3, 9, 14, PAL.a); rect(c, x + 7, 3, 2, 14, PAL.A); rect(c, x, 16, 9, 1, PAL.A);
      for (const y of [5, 8, 11, 14]) rect(c, x + 2, y, 5, 1, PAL.y);
    }
  });

  // Ark of the Covenant (32x26): gold chest, carrying poles, two cherubim
  still("exodus_ark", 32, 26, (c) => {
    rect(c, 2, 24, 28, 2, PAL.z);
    rect(c, 3, 13, 26, 10, PAL.y); rect(c, 3, 20, 26, 3, PAL.Y); rect(c, 3, 11, 26, 2, PAL.l); rect(c, 3, 13, 26, 1, PAL.Y);
    rect(c, 8, 15, 16, 4, PAL.Y); rect(c, 9, 16, 14, 2, PAL.l); // panel
    rect(c, 0, 19, 32, 2, PAL.o); rect(c, 2, 18, 2, 4, PAL.Y); rect(c, 28, 18, 2, 4, PAL.Y); // poles + rings
    for (const mirror of [false, true]) { // cherubim face the mercy seat
      const px = (x: number, w: number) => (mirror ? 32 - x - w : x);
      rect(c, px(7, 6), 4, 6, 7, PAL.y); rect(c, px(8, 4), 1, 4, 4, PAL.s); rect(c, px(9, 1), 2, 1, 1, PAL.e);
      rect(c, px(4, 4), 2, 4, 8, PAL.l); rect(c, px(3, 2), 4, 2, 5, PAL.l); rect(c, px(6, 2), 4, 2, 6, PAL.Y);
    }
  });

  // Seven-branch lampstand (22x28)
  still("exodus_menorah", 22, 28, (c) => {
    rect(c, 3, 26, 16, 2, PAL.z);
    rect(c, 7, 25, 8, 2, PAL.y); rect(c, 9, 23, 4, 2, PAL.Y); rect(c, 10, 7, 2, 18, PAL.y); rect(c, 11, 7, 1, 18, PAL.Y); // base + stem
    for (const [xa, xb, y] of [[1, 19, 19], [4, 16, 15], [7, 13, 11]]) {
      rect(c, xa, y, xb - xa + 2, 1, PAL.y); // arm bar
      for (const x of [xa, xb]) rect(c, x, 7, 1, y - 7 + 1, PAL.y);
    }
    for (const x of [1, 4, 7, 10, 13, 16, 19]) { rect(c, x - 1, 6, 3, 2, PAL.Y); rect(c, x, 3, 1, 3, PAL.f); rect(c, x, 4, 1, 1, PAL.l); } // 7 lamps
  });

  // Pillars: cloud by day, fire by night (16x48)
  still("exodus_pillar_cloud", 16, 48, (c) => pillar(PAL.W, PAL.U, PAL.w, 0)(c, 0));
  sheet("exodus_pillar_fire", [pillar(PAL.f, PAL.y, PAL.l, 0), pillar(PAL.f, PAL.y, PAL.l, 1)], 16, 48);

  sheet("exodus_bush", [bush(0), bush(1)], 32, 32);

  // Egyptian chariot (48x28, faces right): two wheels, gold cart, horse
  still("exodus_chariot", 48, 28, (c) => {
    rect(c, 2, 26, 44, 2, PAL.z);
    wheel(c, 3, 14); wheel(c, 17, 14);
    rect(c, 2, 5, 22, 10, PAL.y); rect(c, 2, 12, 22, 3, PAL.Y); rect(c, 2, 8, 22, 2, PAL.r); rect(c, 2, 3, 2, 3, PAL.Y); // cart + trim
    rect(c, 24, 11, 10, 2, PAL.o); // yoke pole
    rect(c, 31, 8, 13, 8, PAL.O); rect(c, 31, 14, 13, 2, PAL.e); rect(c, 28, 8, 3, 4, PAL.O); // horse body + tail
    rect(c, 40, 3, 6, 8, PAL.O); rect(c, 44, 5, 3, 5, PAL.o); rect(c, 41, 2, 2, 2, PAL.O); rect(c, 42, 5, 1, 1, PAL.w); rect(c, 38, 3, 2, 8, PAL.e); // head, snout, ear, eye, mane
    for (const x of [33, 41]) rect(c, x, 16, 2, 8, PAL.O); // legs
  });

  // Ground tiles
  still("exodus_sand", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.Q);
    for (const [x, y, w] of [[2, 3, 3], [9, 1, 2], [12, 8, 3], [4, 11, 2], [10, 14, 3]]) rect(c, x, y, w, 1, PAL.J);
    rect(c, 7, 6, 1, 1, PAL.Y);
  });
  still("exodus_stone", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.a);
    rect(c, 0, 7, 16, 1, PAL.A); rect(c, 0, 15, 16, 1, PAL.A); rect(c, 5, 0, 1, 7, PAL.A); rect(c, 11, 8, 1, 7, PAL.A);
    rect(c, 2, 3, 2, 1, PAL.W); rect(c, 8, 11, 3, 1, PAL.W);
  });

  // Sparkle + glows (same look as the other games: integer glow discs, 4-pt sparkle)
  if (!tex.exists("sparkle")) still("sparkle", 7, 7, (c) => { rect(c, 3, 0, 1, 7, PAL.l); rect(c, 0, 3, 7, 1, PAL.l); rect(c, 2, 2, 3, 3, PAL.w); });
  tex.addCanvas("exodus_glow_gold", glowCanvas(16, PAL.y));
  tex.addCanvas("exodus_glow_sky", glowCanvas(16, PAL.x));
  tex.addCanvas("exodus_glow_fire", glowCanvas(16, PAL.f));
}
