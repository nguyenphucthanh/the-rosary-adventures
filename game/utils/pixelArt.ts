/**
 * Tiny pixel-art toolkit. Every in-world texture is built from either:
 *  - a PixelMap (array of equal-length strings, 1 char = 1 pixel, "." = transparent), or
 *  - integer `rect()` calls (for big props / tiles).
 * No gradients, arcs, curves or fractional coordinates — they break the 8-bit look.
 */

export type PixelMap = string[];

/** Shared game palette. Characters/props should pick from here before inventing colors. */
export const PAL: Record<string, string> = {
  z: "rgba(0,0,0,0.25)", // drop shadow
  e: "#0f172a", // eyes / ink
  s: "#f5d0a9", // skin
  S: "#d9a87e", // skin shade
  c: "#eea29a", // cheek blush
  m: "#e4766f", // mouth
  h: "#3d2314", // dark brown hair
  d: "#7a4a22", // chestnut hair (Jesus)
  R: "#991b1b", // red shade
  b: "#2563eb", // Marian blue
  B: "#1d4ed8", // blue shade
  n: "#1e3a8a", // navy
  w: "#f8fafc", // white
  W: "#cbd5e1", // white shade
  l: "#fef08a", // light / glow yellow
  y: "#fbbf24", // gold
  Y: "#d97706", // amber / gold shade
  o: "#92400e", // wood
  O: "#5b2a0c", // dark wood
  u: "#78350f", // sandal / leather
  p: "#fef3c7", // parchment
  P: "#e9cf8f", // parchment shade
  r: "#dc2626", // red
  g: "#22c55e", // leaf
  G: "#15803d", // leaf shade
  k: "#7dd3fc", // sky
  t: "#c2703d", // terracotta
  T: "#9a4a24", // terracotta shade
  q: "#f9a8d4", // pink petal
  v: "#7c3aed", // violet
  V: "#5b21b6", // violet shade
  a: "#8b8f98", // stone
  A: "#6b6f78", // stone shade
  f: "#f97316", // flame orange
  i: "#475569", // dark greyish blue
  I: "#334155", // dark greyish blue shade
};

export function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

export function rect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/** Paint a PixelMap at (x, y). `mirror` flips horizontally (wings, symmetric props). */
export function drawMap(
  ctx: CanvasRenderingContext2D,
  map: PixelMap,
  x = 0,
  y = 0,
  mirror = false
) {
  const width = map[0].length;
  map.forEach((row, ry) => {
    if (row.length !== width) {
      throw new Error(`PixelMap row ${ry} is ${row.length}px, expected ${width}px: "${row}"`);
    }
    for (let rx = 0; rx < width; rx++) {
      const ch = row[rx];
      if (ch === ".") continue;
      const color = PAL[ch];
      if (!color) throw new Error(`PixelMap uses unknown palette key "${ch}"`);
      rect(ctx, x + (mirror ? width - 1 - rx : rx), y, 1, 1, color);
    }
    y++;
  });
}

/** Stepped (banded) glow disc — the 8-bit replacement for radial gradients. */
export function glowCanvas(radius: number, color: string) {
  const size = radius * 2;
  const { canvas, ctx } = makeCanvas(size, size);
  const bands = [0.45, 0.28, 0.14];
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const d = Math.hypot(px + 0.5 - radius, py + 0.5 - radius) / radius;
      if (d >= 1) continue;
      ctx.globalAlpha = bands[Math.min(2, Math.floor(d * 3))];
      rect(ctx, px, py, 1, 1, color);
    }
  }
  ctx.globalAlpha = 1;
  return canvas;
}
