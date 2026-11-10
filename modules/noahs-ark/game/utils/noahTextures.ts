import * as Phaser from "phaser";
import { PAL, type PixelMap, drawMap, glowCanvas, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/**
 * Pixel textures for Noah's Ark. People use the shared 32x32 chibi grid
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

// ---------- People (32x32) ----------

interface Look {
  hair: string;
  robe: string; // palette key
  shade: string; // robe shade key
  beard?: string; // palette key: white beard for the patriarch
  long?: boolean; // long hair framing the face (Noah's wife)
  short?: boolean; // knee tunic instead of a full robe (the sons)
}

const person = ({ hair: h, robe: r, shade: d, beard: b, long, short }: Look): PixelMap => {
  const side = long ? h : "s"; // long hair falls past the cheeks
  return [
    ...blanks(6),
    C(h.repeat(10)), C(h.repeat(12)), C(h.repeat(12)), C(`${h}${h}ssssssss${h}`),
    C(`${side}ssssssssss${side}`), C(`${side}ssssssssss${side}`), C(`${side}sseesseess${side}`), C(`${side}sseesseess${side}`),
    C(b ? `${b}scsssscs${b}` : `${side}scsssscs${side}`), C(b ? `${b}${b}${b}mm${b}${b}${b}` : `${side}sssmmsss${side}`),
    C(b ? `${b}${b}${b}${b}${b}${b}` : "ss"),
    C(r.repeat(10)), C(`s${r.repeat(8)}s`), C(`s${r.repeat(8)}s`), C(`s${r}${r}yyyy${r}${r}s`),
    C(`${r}${r}${r}${d.repeat(4)}${r}${r}${r}`), C(short ? `..${r.repeat(6)}..` : r.repeat(10)),
    ...(short ? [C("..ss..ss.."), C("..ss..ss..")] : [C(r.repeat(10)), C(`${r.repeat(2)}${d.repeat(6)}${r.repeat(2)}`)]),
    ...(short ? [C("..ss..ss.."), C("..uu..uu..")] : [C(r.repeat(10)), C("..uu..uu..")]),
    ...SHADOW,
  ];
};

export const NOAH = person({ hair: "w", robe: "o", shade: "O", beard: "w" });
export const NOAH_WIFE = person({ hair: "d", robe: "b", shade: "B", long: true });
export const SHEM = person({ hair: "h", robe: "r", shade: "R", short: true });
export const HAM = person({ hair: "d", robe: "t", shade: "T", short: true });
export const JAPHETH = person({ hair: "h", robe: "v", shade: "V", short: true });

// ---------- Birds (16x16, 2 frames: wings up / down) ----------
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
const raven = (m: PixelMap): PixelMap => m.map((row) => row.replace(/w/g, "I").replace(/W/g, "e").replace(/y/g, "Y"));

// ---------- Items (16x16) ----------
const WOOD: PixelMap = [
  ...Array.from({ length: 4 }, () => "................"),
  "oooooooooooooooo", "oyooooooooooyooo", "OOOOOOOOOOOOOOOO",
  "oooooooooooooooo", "ooooyooooooooyoo", "OOOOOOOOOOOOOOOO",
  "oooooooooooooooo", "oyooooooooooyooo", "OOOOOOOOOOOOOOOO",
  ".zzzzzzzzzzzzzz.", "................", "................",
];
const LANTERN: PixelMap = [
  "................", "......YYYY......", ".....Y....Y.....", ".....Y....Y.....", "....YYYYYYYY....",
  "....YllllllY....", "....YllffllY....", "....YlfyyflY....", "....YllffllY....", "....YllllllY....",
  "....YYYYYYYY....", ".....YyyyyY.....", "......YYYY......", "................", "................", "................",
];
const OLIVE: PixelMap = [
  "................", "..........GG....", ".........GggG...", "....GG...GggG...", "...GggG...GG....",
  "....GG..o.GG....", ".......oo.GggG..", "...GG.oo..GggG..", "..GggGo....GG...", "..GggGo.........",
  "...GGoo.........", ".....oo.........", "....oo..........", "...oo...........", "...o............", "................",
];

/** Banded rainbow (red→violet), integer pixels only. (cx, cy) = arc centre, `outer` = outer radius, `band` = band thickness. */
export function paintRainbow(ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, band: number, alpha = 1) {
  const cols = [PAL.r, PAL.f, PAL.y, PAL.g, PAL.x, PAL.n, PAL.v];
  ctx.globalAlpha = alpha;
  for (let y = cy - outer; y < cy; y++) {
    for (let x = cx - outer; x < cx + outer; x++) {
      const i = Math.floor((outer - Math.hypot(x + 0.5 - cx, y + 0.5 - cy)) / band);
      if (i >= 0 && i < 7) rect(ctx, x, y, 1, 1, cols[i]);
    }
  }
  ctx.globalAlpha = 1;
}

export function registerNoahTextures(scene: Phaser.Scene) {
  if (scene.textures.exists("noah_noah")) return; // idempotent
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

  // People & birds
  for (const [key, map] of [["noah_noah", NOAH], ["noah_wife", NOAH_WIFE], ["noah_shem", SHEM], ["noah_ham", HAM], ["noah_japheth", JAPHETH]] as const) {
    sheet(key, [(c, x) => drawMap(c, map, x)], 32, 32);
  }
  sheet("noah_dove", [(c, x) => drawMap(c, DOVE_UP, x), (c, x) => drawMap(c, DOVE_DOWN, x)], 16, 16);
  sheet("noah_raven", [(c, x) => drawMap(c, raven(DOVE_UP), x), (c, x) => drawMap(c, raven(DOVE_DOWN), x)], 16, 16);

  // Items
  still("noah_wood", 16, 16, (c) => drawMap(c, WOOD));
  still("noah_lantern", 16, 16, (c) => drawMap(c, LANTERN));
  still("noah_olive", 16, 16, (c) => drawMap(c, OLIVE));
  still("noah_pitch", 14, 20, (c) => {
    rect(c, 1, 18, 12, 2, PAL.z);
    rect(c, 1, 3, 12, 15, PAL.o); rect(c, 9, 3, 4, 15, PAL.O); rect(c, 2, 4, 1, 13, PAL.u);
    rect(c, 0, 6, 14, 2, PAL.Y); rect(c, 0, 13, 14, 2, PAL.Y);
    rect(c, 1, 1, 12, 3, PAL.O); rect(c, 3, 2, 8, 1, PAL.e); rect(c, 4, 2, 2, 1, PAL.I); // black pitch inside the rim
  });
  still("noah_altar", 48, 32, (c) => {
    rect(c, 2, 29, 44, 3, PAL.z);
    rect(c, 4, 22, 40, 8, PAL.a); rect(c, 4, 27, 40, 3, PAL.A);
    rect(c, 8, 14, 32, 9, PAL.a); rect(c, 8, 20, 32, 3, PAL.A);
    for (const x of [12, 24, 34]) rect(c, x, 15, 1, 7, PAL.A); // stone seams
    rect(c, 6, 12, 36, 3, PAL.w); rect(c, 6, 14, 36, 1, PAL.W);
    rect(c, 20, 4, 8, 8, PAL.f); rect(c, 22, 2, 4, 4, PAL.f); rect(c, 22, 6, 4, 6, PAL.y); rect(c, 23, 9, 2, 3, PAL.l); // offering fire
  });
  still("noah_rainbow", 96, 48, (c) => paintRainbow(c, 48, 48, 48, 3));
  still("noah_floor", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.o);
    rect(c, 0, 7, 16, 1, PAL.O); rect(c, 0, 15, 16, 1, PAL.O);
    rect(c, 5, 0, 1, 7, PAL.O); rect(c, 11, 8, 1, 7, PAL.O);
    rect(c, 2, 3, 2, 1, PAL.u); rect(c, 8, 11, 3, 1, PAL.u);
  });

  // Animals (2 frames: step), all face right. Legs alternate height per frame.
  const legs = (c: CanvasRenderingContext2D, xs: number[], top: number, bottom: number, w: number, f: number, col: string) =>
    xs.forEach((lx, k) => rect(c, lx, top, w, bottom - top - ((k + f) % 2), col));
  const animal = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D, x: number, f: number) => void) =>
    sheet(key, [0, 1].map((f) => (c: CanvasRenderingContext2D, x: number) => paint(c, x, f)), w, h);

  animal("noah_sheep", 24, 20, (c, x, f) => {
    rect(c, x + 3, 18, 15, 2, PAL.z);
    legs(c, [x + 5, x + 8, x + 12, x + 15], 13, 19, 2, f, PAL.I);
    rect(c, x + 3, 6, 14, 8, PAL.w); rect(c, x + 5, 4, 5, 2, PAL.w); rect(c, x + 11, 3, 5, 3, PAL.w); rect(c, x + 3, 12, 14, 2, PAL.W);
    rect(c, x + 6, 8, 2, 2, PAL.W); rect(c, x + 12, 8, 2, 2, PAL.W);
    rect(c, x + 16, 6, 6, 7, PAL.i); rect(c, x + 16, 4, 4, 3, PAL.w); rect(c, x + 15, 8, 1, 3, PAL.I); rect(c, x + 21, 5, 2, 2, PAL.I);
    rect(c, x + 19, 8, 2, 2, PAL.w); rect(c, x + 20, 9, 1, 1, PAL.e); rect(c, x + 21, 11, 1, 1, PAL.e);
  });
  animal("noah_lion", 24, 22, (c, x, f) => {
    rect(c, x + 2, 20, 20, 2, PAL.z);
    legs(c, [x + 3, x + 7, x + 11, x + 14], 15, 21, 3, f, PAL.Y);
    rect(c, x + 2, 9, 14, 8, PAL.y); rect(c, x + 2, 15, 14, 2, PAL.Y);
    rect(c, x, 9, 2, 1, PAL.Y); rect(c, x, 6, 1, 4, PAL.Y); rect(c, x, 4, 3, 3, PAL.o);
    rect(c, x + 12, 3, 11, 13, PAL.o); rect(c, x + 14, 2, 7, 1, PAL.o); rect(c, x + 12, 13, 11, 3, PAL.O);
    rect(c, x + 14, 5, 7, 8, PAL.y); rect(c, x + 14, 3, 2, 2, PAL.y); rect(c, x + 19, 3, 2, 2, PAL.y);
    rect(c, x + 16, 7, 1, 2, PAL.e); rect(c, x + 19, 7, 1, 2, PAL.e);
    rect(c, x + 16, 10, 4, 3, PAL.j); rect(c, x + 17, 10, 2, 1, PAL.e); rect(c, x + 17, 12, 2, 1, PAL.m);
  });
  // Lioness: paler fur, no mane, round ears and a pink bow
  animal("noah_lioness", 24, 22, (c, x, f) => {
    rect(c, x + 2, 20, 20, 2, PAL.z);
    legs(c, [x + 3, x + 7, x + 11, x + 14], 15, 21, 3, f, PAL.y);
    rect(c, x + 2, 9, 14, 8, PAL.j); rect(c, x + 2, 15, 14, 2, PAL.y);
    rect(c, x, 9, 2, 1, PAL.y); rect(c, x, 6, 1, 4, PAL.y); rect(c, x, 4, 3, 3, PAL.y);
    rect(c, x + 13, 5, 9, 10, PAL.j); rect(c, x + 13, 13, 9, 2, PAL.y);
    rect(c, x + 13, 3, 3, 3, PAL.j); rect(c, x + 19, 3, 3, 3, PAL.j); rect(c, x + 14, 4, 1, 1, PAL.c); rect(c, x + 20, 4, 1, 1, PAL.c);
    rect(c, x + 16, 3, 3, 2, PAL.c); rect(c, x + 17, 4, 1, 1, PAL.r); // bow
    rect(c, x + 16, 7, 1, 2, PAL.e); rect(c, x + 19, 7, 1, 2, PAL.e);
    rect(c, x + 16, 10, 4, 3, PAL.p); rect(c, x + 17, 10, 2, 1, PAL.e); rect(c, x + 17, 12, 2, 1, PAL.m);
  });
  animal("noah_deer", 24, 26, (c, x, f) => {
    rect(c, x + 4, 24, 14, 2, PAL.z);
    legs(c, [x + 4, x + 7, x + 12, x + 15], 18, 25, 2, f, PAL.T);
    rect(c, x + 3, 12, 14, 7, PAL.t); rect(c, x + 3, 17, 14, 2, PAL.j);
    for (const [sx, sy] of [[6, 13], [9, 15], [12, 13], [14, 15]]) rect(c, x + sx, sy, 1, 1, PAL.w);
    rect(c, x + 1, 12, 2, 3, PAL.w);
    rect(c, x + 14, 7, 4, 7, PAL.t); rect(c, x + 16, 5, 6, 5, PAL.t); rect(c, x + 20, 7, 3, 3, PAL.j);
    rect(c, x + 22, 8, 1, 1, PAL.e); rect(c, x + 18, 6, 1, 1, PAL.e); rect(c, x + 15, 4, 2, 2, PAL.t);
    rect(c, x + 16, 0, 1, 5, PAL.O); rect(c, x + 14, 1, 2, 1, PAL.O); rect(c, x + 14, 0, 1, 1, PAL.O);
    rect(c, x + 19, 0, 1, 5, PAL.O); rect(c, x + 20, 1, 2, 1, PAL.O); rect(c, x + 21, 0, 1, 1, PAL.O);
  });
  animal("noah_elephant", 32, 30, (c, x, f) => {
    rect(c, x + 2, 28, 28, 2, PAL.z);
    legs(c, [x + 4, x + 9, x + 15, x + 20], 21, 29, 4, f, PAL.A);
    rect(c, x + 3, 8, 20, 14, PAL.a); rect(c, x + 3, 19, 20, 3, PAL.A);
    rect(c, x + 2, 10, 1, 7, PAL.A); rect(c, x + 1, 15, 3, 2, PAL.I);
    rect(c, x + 19, 5, 10, 12, PAL.a); rect(c, x + 14, 6, 6, 11, PAL.A); rect(c, x + 16, 8, 3, 7, PAL.c);
    rect(c, x + 25, 9, 2, 2, PAL.e);
    rect(c, x + 27, 14, 3, 8 + f, PAL.a); rect(c, x + 27, 16, 1, 5, PAL.A); rect(c, x + 28, 21 + f, 3, 2, PAL.a);
    rect(c, x + 24, 15, 2, 4, PAL.w); rect(c, x + 25, 18, 3, 1, PAL.w);
  });
  animal("noah_zebra", 24, 24, (c, x, f) => {
    rect(c, x + 3, 22, 16, 2, PAL.z);
    legs(c, [x + 4, x + 7, x + 12, x + 15], 16, 23, 2, f, PAL.W);
    rect(c, x + 3, 10, 14, 8, PAL.w); rect(c, x + 3, 16, 14, 2, PAL.W);
    for (const sx of [5, 8, 11, 14]) rect(c, x + sx, 10, 1, 8, PAL.e);
    rect(c, x + 1, 11, 2, 5, PAL.e); // tail
    rect(c, x + 14, 5, 4, 7, PAL.w); rect(c, x + 16, 4, 6, 5, PAL.w); rect(c, x + 20, 6, 3, 3, PAL.W);
    rect(c, x + 22, 7, 1, 1, PAL.e); rect(c, x + 18, 5, 1, 1, PAL.e); rect(c, x + 14, 2, 2, 3, PAL.e); // ear
    rect(c, x + 13, 5, 1, 7, PAL.e); rect(c, x + 16, 6, 1, 2, PAL.e); // mane + face stripe
  });
  animal("noah_rabbit", 14, 14, (c, x, f) => {
    rect(c, x + 2, 12, 10, 2, PAL.z);
    rect(c, x + 2, 6, 8, 6, PAL.w); rect(c, x + 2, 10, 8, 2, PAL.W); rect(c, x, 8, 2, 2, PAL.w); // tail
    rect(c, x + 8, 4, 5, 5, PAL.w); rect(c, x + 9, 0, 1, 5, PAL.w); rect(c, x + 11, 0, 1, 5, PAL.w); rect(c, x + 10, 1, 1, 3, PAL.q);
    rect(c, x + 11, 5, 1, 1, PAL.e); rect(c, x + 12, 7, 1, 1, PAL.q);
    rect(c, x + 3, 11 + f, 3, 1, PAL.W); rect(c, x + 8, 11 + f, 3, 1, PAL.W);
  });
  animal("noah_turtle", 16, 12, (c, x, f) => {
    rect(c, x + 1, 10, 14, 2, PAL.z);
    rect(c, x + 3, 3, 9, 6, PAL.G); rect(c, x + 4, 2, 7, 1, PAL.G); rect(c, x + 5, 3, 5, 1, PAL.g);
    rect(c, x + 5, 5, 2, 2, PAL.o); rect(c, x + 8, 5, 2, 2, PAL.o); rect(c, x + 3, 8, 9, 1, PAL.H);
    rect(c, x + 12, 4, 3, 3, PAL.g); rect(c, x + 14, 5, 1, 1, PAL.e); // head
    rect(c, x + 3, 9, 2, 1 + f, PAL.g); rect(c, x + 10, 9, 2, 2 - f, PAL.g); rect(c, x + 1, 6, 2, 1, PAL.g); // legs + tail
  });

  // Sparkle + glows (same look as the other games: integer glow discs, 4-pt sparkle)
  if (!tex.exists("sparkle")) still("sparkle", 7, 7, (c) => { rect(c, 3, 0, 1, 7, PAL.l); rect(c, 0, 3, 7, 1, PAL.l); rect(c, 2, 2, 3, 3, PAL.w); });
  tex.addCanvas("noah_glow_gold", glowCanvas(16, PAL.y));
  tex.addCanvas("noah_glow_sky", glowCanvas(16, PAL.x));
}
