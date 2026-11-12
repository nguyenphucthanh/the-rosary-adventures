import * as Phaser from "phaser";
import { PAL, type PixelMap, drawMap, glowCanvas, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/**
 * Pixel textures for King David – Shepherd & King. People use the shared 32x32 chibi grid
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
  stripe?: string; // alternating stripe colour on the headcloth
  flaps?: boolean; // headcloth hangs past the cheeks
  crown?: boolean; // golden royal crown rising above the head
}

export const person = ({ hair, robe: r, shade: d, beard: b, long, short, cap, stripe, flaps, crown }: Look): PixelMap => {
  const h = cap ?? hair;
  const side = flaps ? h : long ? hair : "s";
  const top: PixelMap = crown
    ? [BLANK, BLANK, BLANK, C("y..yy..y"), C("yyyyyyyy"), C("yYryyrYy")]
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

/** Small wooden/golden harp held in the right hand. */
const MINI_HARP: PixelMap = [
  "yyyyy.",
  "y.l.y.",
  "y.l.y.",
  "y.l.y.",
  "yYYY..",
  ".ooo..",
];
const withHarp = (map: PixelMap) => stamp(stamp(map, 21, 14, MINI_HARP), 20, 18, ["ss"]);

/** Curved anointing horn held in the right hand. */
const MINI_HORN: PixelMap = [
  "...yy",
  "..yy.",
  ".yY..",
  "yY...",
  "y....",
];
const withHorn = (map: PixelMap) => stamp(stamp(map, 21, 15, MINI_HORN), 21, 18, ["ss"]);

export const DAVID_SHEPHERD = withStaff(person({ hair: "d", robe: "p", shade: "P", short: true }));
export const DAVID_HARPIST = withHarp(person({ hair: "d", robe: "p", shade: "P", short: true }));
export const DAVID_WARRIOR = person({ hair: "d", robe: "M", shade: "o", short: true });
export const DAVID_KING = withHarp(person({ hair: "d", robe: "b", shade: "B", beard: "d", crown: true }));
export const DAVID_EPHOD = withHarp(person({ hair: "d", robe: "w", shade: "W", beard: "d", crown: true }));
export const SAMUEL = withHorn(person({ hair: "w", robe: "w", shade: "W", beard: "W", cap: "b" }));
export const JESSE = person({ hair: "W", robe: "M", shade: "o", beard: "W" });
export const ELIAB = person({ hair: "h", robe: "t", shade: "T", short: true });
export const SAUL = person({ hair: "h", robe: "v", shade: "V", beard: "h", crown: true });
export const JONATHAN = person({ hair: "h", robe: "b", shade: "B", short: true, cap: "y" });
export const AHIMELECH = person({ hair: "w", robe: "w", shade: "W", beard: "w", cap: "y" });
export const ABIGAIL = person({ hair: "h", robe: "b", shade: "B", long: true });
export const ABISHAI = person({ hair: "h", robe: "r", shade: "R", short: true, cap: "a" });
export const JOAB = person({ hair: "h", robe: "i", shade: "I", short: true, cap: "y" });
export const NATHAN = person({ hair: "h", robe: "G", shade: "H", beard: "h", cap: "p" });
export const GUARD = person({ hair: "h", robe: "r", shade: "R", cap: "a", stripe: "y", flaps: true, short: true });

// ---------- Birds (16x16, 2 frames: wings up / down) — the Holy Spirit's dove ----------
export const DOVE_UP: PixelMap = [
  "................", "...W..........W.", "..WwW........WwW", "..WwwW......WwwW",
  "...WwwWwwwwWwwW.", "....WwwwwwwwwW..", ".....wwwwwwwww.y", ".....wwwwwwwwwyy",
  "......wwwwwwww..", ".......wwwwww...", "........WWWW....", ".........yy.....",
  "................", "................", "................", "................",
];
export const DOVE_DOWN: PixelMap = [
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

const campfire = (flicker: number): Paint => (c, x) => {
  rect(c, x + 2, 17, 16, 2, PAL.z);
  rect(c, x + 3, 14, 14, 3, PAL.o);
  rect(c, x + 5, 13, 10, 2, PAL.O);
  for (const sx of [2, 6, 11, 15]) rect(c, x + sx, 16, 3, 2, PAL.A); // ring stones
  tongue(c, x + 7, 14, 4 + flicker);
  tongue(c, x + 10, 14, 6 - flicker);
  tongue(c, x + 13, 14, 4 + (1 - flicker));
};

export function registerDavidTextures(scene: Phaser.Scene) {
  if (scene.textures.exists("david_shepherd")) return; // idempotent
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

  // People (32x32) & Holy Spirit dove
  for (const [key, map] of [
    ["david_shepherd", DAVID_SHEPHERD],
    ["david_harpist", DAVID_HARPIST],
    ["david_warrior", DAVID_WARRIOR],
    ["david_king", DAVID_KING],
    ["david_ephod", DAVID_EPHOD],
    ["david_samuel", SAMUEL],
    ["david_jesse", JESSE],
    ["david_eliab", ELIAB],
    ["david_saul", SAUL],
    ["david_jonathan", JONATHAN],
    ["david_ahimelech", AHIMELECH],
    ["david_abigail", ABIGAIL],
    ["david_abishai", ABISHAI],
    ["david_joab", JOAB],
    ["david_nathan", NATHAN],
    ["david_guard", GUARD],
  ] as const) {
    sheet(key, [(c, x) => drawMap(c, map, x)], 32, 32);
  }
  sheet("david_dove", [(c, x) => drawMap(c, DOVE_UP, x), (c, x) => drawMap(c, DOVE_DOWN, x)], 16, 16);

  // Giant Goliath (48x40): towering bronze-armoured champion with spear and shield
  still("david_goliath", 48, 40, (c) => {
    rect(c, 10, 36, 28, 3, PAL.z); // shadow
    // helmet + plume
    rect(c, 20, 1, 8, 3, PAL.r); rect(c, 18, 4, 12, 4, PAL.Y); rect(c, 17, 7, 14, 3, PAL.y);
    // face + beard
    rect(c, 18, 10, 12, 6, PAL.s); rect(c, 17, 10, 2, 6, PAL.Y); rect(c, 29, 10, 2, 6, PAL.Y);
    rect(c, 20, 11, 2, 2, PAL.e); rect(c, 26, 11, 2, 2, PAL.e);
    rect(c, 18, 14, 12, 4, PAL.h);
    // bronze scale armour torso (rows 18-30)
    rect(c, 13, 18, 22, 12, PAL.Y); rect(c, 15, 19, 18, 10, PAL.y);
    for (const ry of [20, 23, 26]) for (const rx of [16, 20, 24, 28]) rect(c, rx, ry, 3, 2, PAL.o);
    // arms + bronze greaves
    rect(c, 10, 19, 3, 8, PAL.s); rect(c, 35, 19, 3, 8, PAL.s);
    rect(c, 17, 30, 5, 6, PAL.Y); rect(c, 26, 30, 5, 6, PAL.Y);
    rect(c, 17, 35, 5, 2, PAL.u); rect(c, 26, 35, 5, 2, PAL.u);
    // massive bronze shield on left arm (x 4..14)
    rect(c, 4, 17, 10, 14, PAL.Y); rect(c, 5, 18, 8, 12, PAL.y); rect(c, 7, 22, 4, 4, PAL.r);
    // weaver-beam spear in right hand (x 38..42)
    rect(c, 39, 6, 3, 30, PAL.o); rect(c, 38, 1, 5, 5, PAL.a); rect(c, 39, 0, 3, 2, PAL.w);
  });

  // Bethlehem sheep (16x14, faces right)
  still("david_sheep", 16, 14, (c) => {
    rect(c, 2, 12, 12, 2, PAL.z);
    for (const x of [3, 6, 9, 12]) rect(c, x, 9, 2, 4, PAL.I);
    rect(c, 1, 4, 11, 6, PAL.w); rect(c, 3, 2, 6, 2, PAL.w); rect(c, 1, 8, 11, 2, PAL.W);
    rect(c, 10, 3, 5, 6, PAL.i); rect(c, 11, 1, 3, 3, PAL.w);
    rect(c, 13, 5, 1, 1, PAL.w); rect(c, 14, 8, 1, 1, PAL.e);
  });

  // Lion predator (24x18, faces left)
  still("david_lion", 24, 18, (c) => {
    rect(c, 2, 16, 20, 2, PAL.z);
    rect(c, 7, 7, 13, 6, PAL.y); rect(c, 7, 11, 13, 2, PAL.Y); // body
    rect(c, 2, 3, 9, 9, PAL.o); rect(c, 3, 5, 6, 6, PAL.y); // mane + face
    rect(c, 4, 7, 1, 1, PAL.e); rect(c, 2, 8, 2, 2, PAL.Y); // eye + snout
    for (const lx of [7, 11, 15, 18]) rect(c, lx, 13, 2, 4, PAL.Y); // legs
    rect(c, 20, 6, 3, 2, PAL.Y); rect(c, 22, 4, 2, 2, PAL.o); // tail
  });

  // Bear predator (24x18, faces left)
  still("david_bear", 24, 18, (c) => {
    rect(c, 2, 16, 20, 2, PAL.z);
    rect(c, 6, 5, 15, 8, PAL.O); rect(c, 7, 4, 12, 2, PAL.o); // bulky body
    rect(c, 2, 5, 6, 6, PAL.O); rect(c, 4, 3, 2, 2, PAL.o); // head + ear
    rect(c, 3, 7, 1, 1, PAL.e); rect(c, 1, 8, 2, 2, PAL.s); // eye + snout
    for (const lx of [7, 11, 15, 18]) rect(c, lx, 13, 3, 4, PAL.O);
  });

  // Abigail's gift donkey (24x18, faces left)
  still("david_donkey", 24, 18, (c) => {
    rect(c, 2, 16, 20, 2, PAL.z);
    rect(c, 7, 7, 13, 6, PAL.a); rect(c, 7, 11, 13, 2, PAL.A); // body
    rect(c, 10, 4, 8, 4, PAL.y); rect(c, 11, 3, 6, 2, PAL.r); // saddlebags of bread & figs
    rect(c, 3, 4, 5, 6, PAL.a); rect(c, 4, 1, 2, 3, PAL.A); rect(c, 6, 1, 2, 3, PAL.A); // head + long ears
    rect(c, 4, 6, 1, 1, PAL.e); rect(c, 2, 7, 2, 2, PAL.W);
    for (const lx of [8, 11, 15, 18]) rect(c, lx, 13, 2, 4, PAL.A);
  });

  // Golden Shepherd's Harp (16x16)
  still("david_harp", 16, 16, (c) => {
    rect(c, 2, 14, 12, 2, PAL.z);
    rect(c, 3, 2, 2, 12, PAL.y); rect(c, 11, 4, 2, 10, PAL.y);
    rect(c, 3, 12, 10, 2, PAL.o); rect(c, 3, 2, 10, 2, PAL.Y);
    for (const x of [6, 8, 10]) rect(c, x, 4, 1, 8, PAL.l); // glowing strings
  });

  // Shepherd's Sling (16x16)
  still("david_sling", 16, 16, (c) => {
    rect(c, 3, 14, 10, 2, PAL.z);
    rect(c, 5, 9, 6, 4, PAL.u); rect(c, 6, 8, 4, 4, PAL.w); // leather pouch + smooth pebble
    for (let i = 0; i < 6; i++) {
      rect(c, 4 - Math.floor(i / 2), 9 - i, 1, 1, PAL.o);
      rect(c, 11 + Math.floor(i / 2), 9 - i, 1, 1, PAL.o);
    }
  });

  // Shepherd's Staff (16x16)
  still("david_staff", 16, 16, (c) => {
    for (let i = 0; i < 12; i++) { rect(c, 2 + i, 14 - i, 2, 1, PAL.o); rect(c, 2 + i, 15 - i, 2, 1, PAL.O); }
    rect(c, 12, 1, 3, 1, PAL.o); rect(c, 14, 2, 1, 3, PAL.o); rect(c, 12, 2, 1, 1, PAL.Y);
  });

  // Smooth river pebble (12x12)
  still("david_pebble", 12, 12, (c) => {
    rect(c, 2, 10, 8, 2, PAL.z);
    rect(c, 3, 3, 6, 6, PAL.w); rect(c, 2, 4, 8, 4, PAL.W); rect(c, 4, 4, 2, 2, PAL.l);
  });

  // Ram's horn of oil / shofar (16x16)
  still("david_horn", 16, 16, (c) => {
    rect(c, 2, 14, 12, 2, PAL.z);
    rect(c, 2, 10, 5, 3, PAL.p); rect(c, 6, 8, 4, 3, PAL.P); rect(c, 9, 5, 4, 4, PAL.y); rect(c, 11, 2, 3, 4, PAL.Y);
  });

  // Golden Royal Crown of David (16x14)
  still("david_crown", 16, 14, (c) => {
    rect(c, 2, 12, 12, 2, PAL.z);
    rect(c, 2, 6, 12, 5, PAL.y); rect(c, 2, 9, 12, 2, PAL.Y);
    for (const x of [2, 7, 12]) rect(c, x, 3, 2, 3, PAL.y);
    rect(c, 4, 7, 2, 2, PAL.r); rect(c, 7, 7, 2, 2, PAL.b); rect(c, 10, 7, 2, 2, PAL.g);
  });

  // Cut corner of Saul's crimson robe (14x14)
  still("david_robe_piece", 14, 14, (c) => {
    rect(c, 2, 12, 10, 2, PAL.z);
    rect(c, 2, 3, 10, 8, PAL.r); rect(c, 3, 9, 8, 2, PAL.y); // crimson cloth with gold hem
    rect(c, 2, 3, 3, 2, PAL.R);
  });

  // Saul's Royal Spear (10x24)
  still("david_spear", 10, 24, (c) => {
    rect(c, 2, 22, 6, 2, PAL.z);
    rect(c, 4, 6, 2, 16, PAL.o);
    rect(c, 3, 2, 4, 4, PAL.y); rect(c, 4, 0, 2, 2, PAL.l);
  });

  // Saul's Clay Water Jug (14x16)
  still("david_jug", 14, 16, (c) => {
    rect(c, 2, 14, 10, 2, PAL.z);
    rect(c, 5, 2, 4, 3, PAL.t); rect(c, 3, 5, 8, 8, PAL.t); rect(c, 3, 11, 8, 2, PAL.T);
    rect(c, 9, 4, 2, 5, PAL.T); // handle
  });

  // Sacred Bread / Gift Basket (16x14)
  still("david_bread", 16, 14, (c) => {
    rect(c, 2, 12, 12, 2, PAL.z);
    rect(c, 2, 7, 12, 5, PAL.M); rect(c, 3, 10, 10, 2, PAL.o); // basket
    rect(c, 3, 4, 5, 4, PAL.y); rect(c, 8, 4, 5, 4, PAL.Y); // loaves
  });

  // Jonathan's Signal Arrow (16x10)
  still("david_arrow", 16, 10, (c) => {
    rect(c, 2, 4, 10, 2, PAL.o);
    rect(c, 12, 3, 3, 4, PAL.y); rect(c, 15, 4, 1, 2, PAL.l); // arrowhead
    rect(c, 1, 3, 3, 1, PAL.w); rect(c, 1, 6, 3, 1, PAL.w); // feathers
  });

  // Tribal Banner (16x28)
  still("david_banner", 16, 28, (c) => {
    rect(c, 3, 26, 10, 2, PAL.z);
    rect(c, 7, 2, 2, 24, PAL.o); rect(c, 3, 3, 10, 2, PAL.y);
    rect(c, 4, 5, 8, 12, PAL.b); rect(c, 6, 8, 4, 4, PAL.y);
  });

  // Ark of the Covenant (32x26): gold chest, carrying poles, two cherubim
  still("david_ark", 32, 26, (c) => {
    rect(c, 2, 24, 28, 2, PAL.z);
    rect(c, 3, 13, 26, 10, PAL.y); rect(c, 3, 20, 26, 3, PAL.Y); rect(c, 3, 11, 26, 2, PAL.l); rect(c, 3, 13, 26, 1, PAL.Y);
    rect(c, 8, 15, 16, 4, PAL.Y); rect(c, 9, 16, 14, 2, PAL.l);
    rect(c, 0, 19, 32, 2, PAL.o); rect(c, 2, 18, 2, 4, PAL.Y); rect(c, 28, 18, 2, 4, PAL.Y);
    for (const mirror of [false, true]) {
      const px = (x: number, w: number) => (mirror ? 32 - x - w : x);
      rect(c, px(7, 6), 4, 6, 7, PAL.y); rect(c, px(8, 4), 1, 4, 4, PAL.s); rect(c, px(9, 1), 2, 1, 1, PAL.e);
      rect(c, px(4, 4), 2, 4, 8, PAL.l); rect(c, px(3, 2), 4, 2, 5, PAL.l); rect(c, px(6, 2), 4, 2, 6, PAL.Y);
    }
  });

  sheet("david_campfire", [campfire(0), campfire(1)], 20, 20);

  // Environment props & tiles for Act 1-3
  still("david_fence", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.O);
    for (const x of [0, 6, 12]) { rect(c, x, 0, 4, 16, PAL.o); rect(c, x + 3, 0, 1, 16, PAL.O); rect(c, x + 1, 3, 1, 1, PAL.Y); rect(c, x + 1, 12, 1, 1, PAL.Y); }
  });
  still("david_wall", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.t);
    for (const y of [0, 5, 10, 15]) rect(c, 0, y, 16, 1, PAL.T);
    for (const [x, y] of [[4, 1], [11, 6], [4, 11]]) rect(c, x, y, 1, 4, PAL.T);
    for (const [x, y] of [[1, 2], [8, 7], [13, 12]]) rect(c, x, y, 2, 1, PAL.Y);
  });
  still("david_cliff", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.A);
    for (const y of [3, 9, 14]) rect(c, 0, y, 16, 2, PAL.D);
    for (const [x, y] of [[2, 1], [9, 5], [5, 11]]) rect(c, x, y, 4, 2, PAL.a);
  });
  still("david_rock", 20, 14, (c) => {
    rect(c, 2, 13, 16, 1, PAL.z);
    rect(c, 6, 2, 8, 2, PAL.a); rect(c, 3, 4, 14, 4, PAL.a); rect(c, 1, 8, 18, 5, PAL.a); rect(c, 12, 5, 6, 8, PAL.A); rect(c, 1, 12, 18, 1, PAL.A); rect(c, 6, 3, 3, 1, PAL.W);
  });
  still("david_rough_rock", 12, 12, (c) => {
    rect(c, 2, 10, 8, 2, PAL.z);
    rect(c, 2, 4, 8, 6, PAL.A); rect(c, 4, 2, 5, 3, PAL.a); rect(c, 7, 5, 3, 4, PAL.D);
  });
  still("david_shrub", 14, 12, (c) => {
    rect(c, 2, 11, 10, 1, PAL.z);
    rect(c, 6, 5, 2, 6, PAL.o);
    rect(c, 2, 3, 10, 6, PAL.G); rect(c, 4, 1, 6, 3, PAL.g); rect(c, 5, 2, 2, 1, PAL.N);
  });
  still("david_olive_tree", 28, 34, (c) => {
    rect(c, 4, 31, 20, 3, PAL.z);
    rect(c, 12, 18, 4, 14, PAL.o); rect(c, 14, 18, 2, 14, PAL.O);
    rect(c, 3, 6, 22, 14, PAL.G); rect(c, 6, 3, 16, 5, PAL.g); rect(c, 3, 16, 22, 4, PAL.H);
    for (const [lx, ly] of [[7, 7], [15, 6], [9, 12], [18, 11]]) rect(c, lx, ly, 3, 2, PAL.N);
  });
  still("david_house", 56, 42, (c) => {
    rect(c, 2, 40, 52, 2, PAL.z);
    rect(c, 4, 10, 48, 30, PAL.p); rect(c, 4, 35, 48, 5, PAL.P);
    rect(c, 2, 6, 52, 5, PAL.t); rect(c, 2, 9, 52, 2, PAL.T); // roof beam
    for (const x of [10, 40]) { rect(c, x, 16, 6, 8, PAL.O); rect(c, x + 1, 17, 4, 6, PAL.y); } // lit windows
    rect(c, 23, 22, 10, 18, PAL.o); rect(c, 24, 23, 8, 17, PAL.O); // doorway
  });
  still("david_tent", 44, 32, (c) => {
    rect(c, 3, 30, 38, 2, PAL.z);
    rect(c, 21, 2, 2, 4, PAL.o);
    for (const [x, y, w] of [[18, 5, 8], [14, 8, 16], [9, 11, 26], [5, 14, 34]]) rect(c, x, y, w, 3, PAL.p);
    rect(c, 4, 17, 36, 13, PAL.M); rect(c, 4, 26, 36, 4, PAL.o);
    for (const x of [9, 19, 29]) rect(c, x, 17, 4, 13, PAL.b);
    rect(c, 18, 19, 8, 11, PAL.D);
  });
  still("david_throne", 32, 36, (c) => {
    rect(c, 3, 34, 26, 2, PAL.z);
    rect(c, 6, 4, 20, 28, PAL.Y); rect(c, 8, 6, 16, 22, PAL.v); // royal purple back
    rect(c, 4, 22, 24, 10, PAL.y); rect(c, 4, 29, 24, 3, PAL.Y); // seat + steps
    rect(c, 12, 2, 8, 3, PAL.y); rect(c, 15, 3, 2, 2, PAL.r); // crown crest
  });
  sheet("david_torch", [
    (c, ox) => { rect(c, ox + 4, 8, 2, 10, PAL.o); rect(c, ox + 3, 7, 4, 2, PAL.A); },
    (c, ox) => { rect(c, ox + 4, 8, 2, 10, PAL.o); rect(c, ox + 3, 7, 4, 2, PAL.Y); tongue(c, ox + 5, 7, 4); },
    (c, ox) => { rect(c, ox + 4, 8, 2, 10, PAL.o); rect(c, ox + 3, 7, 4, 2, PAL.Y); tongue(c, ox + 5, 7, 5); },
  ], 10, 18);
  sheet("david_pad", [
    (c, ox) => { rect(c, ox + 2, 2, 20, 12, PAL.A); rect(c, ox + 4, 4, 16, 8, PAL.a); rect(c, ox + 9, 6, 6, 4, PAL.I); },
    (c, ox) => { rect(c, ox + 2, 2, 20, 12, PAL.Y); rect(c, ox + 4, 4, 16, 8, PAL.y); rect(c, ox + 8, 5, 8, 6, PAL.l); },
  ], 24, 16);
  sheet("david_shadow_cloud", [
    (c, ox) => { rect(c, ox + 4, 3, 12, 10, PAL.L); rect(c, ox + 2, 5, 16, 7, PAL.Z); rect(c, ox + 6, 7, 3, 2, PAL.v); rect(c, ox + 12, 7, 3, 2, PAL.v); },
    (c, ox) => { rect(c, ox + 3, 4, 14, 9, PAL.L); rect(c, ox + 1, 6, 18, 6, PAL.Z); rect(c, ox + 5, 6, 3, 2, PAL.v); rect(c, ox + 13, 6, 3, 2, PAL.v); },
  ], 20, 16);
  still("david_shockwave", 18, 12, (c) => {
    rect(c, 2, 4, 14, 6, PAL.r); rect(c, 4, 2, 10, 4, PAL.f); rect(c, 6, 4, 6, 3, PAL.y);
  });

  // Ground tiles (16x16)
  still("david_grass", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.g);
    for (const [x, y] of [[2, 3], [9, 2], [13, 7], [5, 11], [11, 13]]) rect(c, x, y, 2, 1, PAL.G);
    rect(c, 7, 6, 1, 1, PAL.N);
  });
  still("david_sand", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.Q);
    for (const [x, y, w] of [[2, 3, 3], [9, 1, 2], [12, 8, 3], [4, 11, 2], [10, 14, 3]]) rect(c, x, y, w, 1, PAL.J);
    rect(c, 7, 6, 1, 1, PAL.Y);
  });
  still("david_stone", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.a);
    rect(c, 0, 7, 16, 1, PAL.A); rect(c, 0, 15, 16, 1, PAL.A); rect(c, 5, 0, 1, 7, PAL.A); rect(c, 11, 8, 1, 7, PAL.A);
    rect(c, 2, 3, 2, 1, PAL.W); rect(c, 8, 11, 3, 1, PAL.W);
  });

  // Sparkle + glows
  if (!tex.exists("sparkle")) still("sparkle", 7, 7, (c) => { rect(c, 3, 0, 1, 7, PAL.l); rect(c, 0, 3, 7, 1, PAL.l); rect(c, 2, 2, 3, 3, PAL.w); });
  tex.addCanvas("david_glow_gold", glowCanvas(16, PAL.y));
  tex.addCanvas("david_glow_sky", glowCanvas(16, PAL.x));
  tex.addCanvas("david_glow_fire", glowCanvas(16, PAL.f));
}
