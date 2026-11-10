import { INTRO_H, INTRO_W, registerIntroIllustration } from "@/modules/the-garden-of-eden/game/utils/introIllustrations";
import { Buf, bayer, beam, cloud, dove, fbm, glow, meadow, mix, orb, ridge, stars, tree, twinkle, water } from "@/modules/the-garden-of-eden/game/utils/pixelScenery";

/** Prologue + Days 1-4. 320x192, painted once. */
const newBuf = () => new Buf(INTRO_W, INTRO_H);

/** Seam between two pre-painted halves: x < cx + dither wobble takes `a`, otherwise `b`. */
function seam(a: Buf, b: Buf, cx: number, wob = 44): Buf {
  const o = newBuf();
  for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++) o.set(x, y, (x < cx + (bayer(x, y) - 0.5) * wob ? a : b).get(x, y)!);
  return o;
}

// Day 1: light splits night (left) from day (right) above the dark deep
const NIGHT = ["#04050f", "#0a0c24", "#171646", "#2b1f6b", "#4a2f8f"];
const NCLOUD = ["#6f5cc0", "#4a3a94", "#2f2470", "#1c1448"];
const DCLOUD = ["#ffffff", "#ffeeb4", "#ffc65a", "#f08f2c"];
registerIntroIllustration("light", (ctx) => {
  const HZ = 118;
  const n = newBuf(), d = newBuf();
  // night half
  n.sky(0, HZ, NIGHT);
  stars(n, 90, 11, [0, 0, 190, 100], ["#e8e6ff", "#8d86d6"]);
  twinkle(n, 40, 30, 3, "#ffffff", "#9d95e8"); twinkle(n, 108, 14, 2, "#ffffff", "#9d95e8"); twinkle(n, 70, 70, 2, "#ffffff", "#9d95e8");
  cloud(n, 6, 52, 90, 30, 3, NCLOUD); cloud(n, 80, 28, 70, 22, 8, NCLOUD);
  water(n, HZ, INTRO_H, ["#10123a", "#0b0d2a", "#05061a"], ["#4a3f99", "#6d5fc7", "#8f82e6"], 5);
  // day half
  d.sky(0, HZ, ["#f7a21b", "#fcc34a", "#fde68a", "#fff8d6", "#ffffff"]);
  cloud(d, 200, 40, 100, 34, 21, DCLOUD); cloud(d, 150, 78, 80, 24, 4, DCLOUD); cloud(d, 262, 84, 70, 22, 9, DCLOUD);
  water(d, HZ, INTRO_H, ["#ffe27a", "#f5b73a", "#c9791a"], ["#ffffff", "#fff3b0", "#ffe27a"], 6);
  const b = seam(n, d, 160, 22);
  // horizon haze + the shaft of light
  for (let x = 0; x < b.w; x++) { b.set(x, HZ - 1, x < 160 ? "#4a2f8f" : "#fff3b0"); b.set(x, HZ, x < 160 ? "#2b1f6b" : "#ffe27a"); }
  glow(b, 160, 6, 64, ["#ffffff", "#fffbe0", "#fff1a8"], 0.55);
  beam(b, 160, 0, HZ, 26, 96, ["#ffe27a", "#fff1a8", "#fffbe0", "#ffffff"], 0.15);
  // reflection column on the water
  for (let y = HZ + 1; y < INTRO_H; y += 2) {
    const t = (y - HZ) / (INTRO_H - HZ), half = Math.round(10 + t * 30);
    for (let x = 160 - half; x <= 160 + half; x++) if (bayer(x, y) > 0.25 + t * 0.2 && ((x + y) & 3) !== 0) b.set(x, y, (x + y) % 5 === 0 ? "#fffbe0" : "#fff1a8");
  }
  dove(b, 160, 82);
  b.flush(ctx);
}, 1, "#fff1a8");

registerIntroIllustration("default", (ctx) => {
  const b = newBuf();
  b.sky(0, 120, NIGHT);
  stars(b, 90, 5, [0, 0, 320, 110], ["#e8e6ff", "#8d86d6"]);
  water(b, 120, INTRO_H, ["#10123a", "#0b0d2a", "#05061a"], ["#4a3f99", "#6d5fc7", "#8f82e6"], 5);
  beam(b, 160, 0, 120, 20, 60, ["#ffe27a", "#fff1a8", "#fffbe0"], 0.2);
  dove(b, 160, 70);
  b.flush(ctx);
});

// Day 2: the vault of heaven - cloud-waters above, clear blue between, the sea below
registerIntroIllustration("sky", (ctx) => {
  const b = newBuf(), HZ = 128;
  b.sky(0, HZ, ["#2c6fd6", "#4a95ec", "#7bbcf5", "#b4dcfa", "#e4f4ff"]);
  const C = ["#ffffff", "#f6faff", "#cfe2f6", "#a4c2e6"];
  [[-20, 2, 120, 44, 1], [80, -8, 130, 52, 2], [190, 0, 140, 46, 3], [260, 6, 90, 40, 4], [20, 30, 90, 30, 5], [230, 40, 100, 30, 6]].forEach(([x, y, w, h, sd]) => cloud(b, x, y, w, h, sd + 40, C));
  [[24, 76, 56, 16, 7], [236, 84, 62, 17, 8], [150, 62, 40, 11, 9]].forEach(([x, y, w, h, sd]) => cloud(b, x, y, w, h, sd + 60, C));
  beam(b, 164, 30, HZ, 8, 120, ["#cfeaff", "#e9f6ff"], 0.75);
  glow(b, 164, 40, 36, ["#ffffff", "#e9f6ff"], 0.35);
  water(b, HZ, INTRO_H, ["#8fd0f7", "#3a9be0", "#1f6fc0", "#164f96"], ["#ffffff", "#bfe6ff", "#6fb8ee"], 12);
  for (let x = 0; x < b.w; x++) { b.set(x, HZ, "#ffffff"); b.set(x, HZ + 1, "#bfe6ff"); }
  // gentle wind swirls
  const swirl = (x: number, y: number, w: number, c: string) => { for (let i = 0; i < w; i++) b.set(x + i, y - Math.floor(Math.sin(i / 5) * 2), c); for (let i = 0; i < w / 3; i++) b.set(x + w - 1 + i, y - 2 + (i > 2 ? 1 : 0) - Math.floor(i / 2), c); };
  swirl(40, 108, 48, "#ffffff"); swirl(210, 100, 56, "#ffffff"); swirl(96, 118, 30, "#e4f4ff");
  dove(b, 164, 94);
  b.flush(ctx);
}, 1, "#ffffff");

// Day 3: dry land appears - dawn over hills, a lake, fruit trees and flowers
registerIntroIllustration("land", (ctx) => {
  const b = newBuf();
  b.sky(0, 92, ["#6ec0f0", "#a6dcf6", "#ffe9c4", "#ffd2a0", "#ffb878"]);
  glow(b, 236, 78, 52, ["#fff7d6", "#ffe9a0", "#ffd28a"], 0.6);
  orb(b, 236, 78, 13, ["#fffbe0", "#ffe27a", "#ffc24a"]);
  cloud(b, 28, 22, 82, 22, 31, ["#ffffff", "#ffeede", "#ffcfae", "#e7a79a"]); cloud(b, 150, 40, 60, 14, 32, ["#ffffff", "#ffeede", "#ffcfae", "#e7a79a"]);
  ridge(b, { base: 96, amp: 70, freq: 0.012, seed: 4, cols: ["#c7b6d6", "#a897c4", "#8a79b0", "#7767a0"], snow: ["#ffffff", "#f1e9f7", "#d8cbe8"], sharp: 1.4 });
  ridge(b, { base: 112, amp: 42, freq: 0.02, seed: 9, cols: ["#7fae8a", "#5f9a74", "#4a845f", "#3a6e50"], });
  // lake with mirrored sky
  water(b, 108, 132, ["#ffd9b0", "#8fd0ea", "#5fb2dd", "#3f93c4"], ["#ffffff", "#ffe9c4", "#bfe6ff"], 15, 0, 320);
  ridge(b, { base: 124, amp: 18, freq: 0.03, seed: 21, cols: ["#6fbf5a", "#4ea84a", "#3b8f40", "#2d7436"], bottom: 134 });
  meadow(b, 128, INTRO_H, ["#8fd65a", "#5fb83f", "#3a9440"], 7, ["#ff7a9a", "#ffe27a", "#ffffff", "#c77dff"]);
  const T = ["#7bd14e", "#4fae3f", "#2f8a3a", "#1d6a2e"], T2 = ["#a8dc5a", "#78b83e", "#4f9234", "#336f2a"];
  tree(b, 52, 176, { h: 78, w: 70, cols: T, fruit: "#ff4d4d", seed: 3 });
  tree(b, 268, 172, { h: 70, w: 64, cols: T2, fruit: "#ffb02e", seed: 8 });
  tree(b, 166, 150, { h: 40, w: 36, cols: T, fruit: "#ff4d4d", seed: 12 });
  tree(b, 120, 140, { h: 30, w: 28, cols: T2, seed: 5 }); tree(b, 218, 142, { h: 28, w: 26, cols: T, seed: 6 });
  // sprouting seedlings in the foreground
  for (const [x, y] of [[96, 182], [150, 186], [204, 183], [232, 188], [20, 188]]) { b.rect(x, y - 6, 1, 6, "#3a9440"); b.rect(x - 3, y - 8, 3, 2, "#6fd05a"); b.rect(x + 1, y - 9, 3, 2, "#8fe66a"); b.rect(x - 3, y - 7, 2, 1, "#3a9440"); }
  b.flush(ctx);
}, 1, "#ffe27a");

// Day 4: sun, moon and stars set in the vault; four seasons on the hill
registerIntroIllustration("stars", (ctx) => {
  const b = newBuf(), HZ = 120;
  b.sky(0, HZ, ["#0c0b2e", "#1d1a5c", "#4a2a86", "#a14a8a", "#f27a5a", "#ffb35a"]);
  // milky band
  for (let y = 0; y < 100; y++) for (let x = 0; x < b.w; x++) {
    const d = Math.abs(y - (60 - x * 0.18)), v = fbm(x * 0.06, y * 0.09, 7, 3);
    if (d < 20 && v > 0.52 && bayer(x, y) > d / 24) b.set(x, y, v > 0.62 ? "#b79cf0" : "#7b62c8");
  }
  stars(b, 150, 22, [0, 0, 320, 105], ["#ffffff", "#c9c3ff"]);
  twinkle(b, 200, 22, 4, "#ffffff", "#c9c3ff"); twinkle(b, 262, 58, 3, "#ffffff", "#c9c3ff"); twinkle(b, 120, 40, 3, "#ffffff", "#c9c3ff");
  // sun going down, left
  glow(b, 70, 112, 70, ["#fff7d6", "#ffe27a", "#ffb35a", "#f27a5a"], 0.7);
  orb(b, 70, 108, 24, ["#fffbe0", "#ffe27a", "#ffbf3a", "#f28a1a"]);
  // crescent moon, right
  orb(b, 252, 40, 17, ["#ffffff", "#eef0ff", "#c9c9ee", "#9fa0cf"]);
  for (let y = 20; y < 62; y++) for (let x = 236; x < 276; x++) if ((x - 260) ** 2 + (y - 35) ** 2 <= 15 * 15) { const c = b.get(x, y); if (c) b.set(x, y, ((y + x) & 1) && bayer(x, y) > 0.5 ? "#1d1a5c" : "#2a2470"); }
  glow(b, 244, 44, 30, ["#c9c9ee", "#8d8fd0"], 0.22);
  // sea reflecting both lights
  water(b, HZ, 150, ["#c4503a", "#6a2f7a", "#2a2470", "#14124a"], ["#ffe27a", "#ffbf3a", "#9d7be0"], 4);
  beam(b, 70, HZ, 150, 30, 60, ["#ffe27a", "#fff3b0"], 0.55);
  // seasons: spring, summer, autumn, winter on the grassy hill
  ridge(b, { base: 152, amp: 14, freq: 0.02, seed: 31, cols: ["#4a8a5a", "#2f6a48", "#1f4a3a", "#14332c"], bottom: 192 });
  meadow(b, 160, INTRO_H, ["#3b7d4a", "#27593e", "#183c30"], 33);
  const S = [
    ["#ffc0d8", "#f08fb6", "#c9608f", "#8f3a6a"], ["#7bd14e", "#4fae3f", "#2f8a3a", "#1d6a2e"],
    ["#ffc24a", "#f2841a", "#c75a14", "#8f3a10"], ["#ffffff", "#e6eefb", "#bccbe6", "#8ea0c6"],
  ];
  S.forEach((cols, i) => tree(b, 46 + i * 76, 182 - (i % 2) * 4, { h: 56, w: 50, cols, seed: 40 + i, fruit: i === 1 ? "#ff4d4d" : undefined }));
  b.flush(ctx);
}, 1, "#c9c3ff");

// Prologue: a child's hands open Genesis in the morning room; galaxy and dove rise from the page
registerIntroIllustration("prologue", (ctx) => {
  const b = newBuf();
  // wall + warm light
  b.sky(0, 120, ["#f6dfb4", "#f2d3a0", "#e9c08a"]);
  for (let x = 0; x < b.w; x += 20) for (let y = 0; y < 120; y += 1) if ((x + 10) % 20 === 0 && y % 2 === 0) b.set(x, y, "#e7c28e"); // wallpaper stripes
  b.rect(0, 112, b.w, 8, "#b9773e"); b.rect(0, 112, b.w, 2, "#d9975a"); // skirting
  // window (left) with morning sun and a bar of light across the room
  b.rect(10, 12, 78, 88, "#8a5226"); b.rect(14, 16, 70, 80, "#a8683a");
  b.sky(18, 94, ["#7cc7f2", "#b8e2f8", "#ffe9b0"], 18, 80);
  cloud(b, 22, 40, 40, 14, 71, ["#ffffff", "#fff3e0", "#ffd7a8", "#e6aa88"]);
  orb(b, 64, 34, 7, ["#ffffff", "#ffe27a", "#ffc24a"]); glow(b, 64, 34, 18, ["#fff7d6", "#ffe9a0"], 0.4);
  b.rect(47, 16, 4, 80, "#8a5226"); b.rect(14, 54, 70, 4, "#8a5226"); b.rect(14, 56, 70, 1, "#6a3a18"); b.rect(6, 98, 86, 6, "#c98a4a"); b.rect(6, 98, 86, 2, "#e6ad6a"); b.rect(6, 104, 86, 2, "#8a5226");
  bookshelf(b, 256, 20, 58);
  // table
  b.rect(0, 118, b.w, 74, "#9a5a2a"); b.rect(0, 118, b.w, 3, "#d9975a"); b.rect(0, 121, b.w, 1, "#6e3a18");
  for (let y = 126; y < 192; y += 9) for (let x = ((y / 9) % 2) * 17; x < b.w; x += 41) { b.rect(x, y, 22 + ((x * 3 + y) % 9), 1, "#84491f"); b.rect(x + 6, y + 3, 12, 1, "#b06e38"); }
  // galaxy rising from the book: stepped cone of nebula + stars
  const GX = 160;
  for (let y = 0; y < 128; y++) for (let x = 60; x < 260; x++) {
    const t = 1 - y / 128, half = 14 + Math.pow(t, 0.8) * 84, dx = Math.abs(x - GX);
    if (dx > half) continue;
    const e = dx / half, v = fbm(x * 0.045, y * 0.05, 5, 4) * 0.8 + (1 - e) * 0.55 + (1 - t) * 0.3;
    if (v > 0.36 + e * e * 0.55 + (bayer(x, y) - 0.5) * 0.1) b.set(x, y, v > 1.05 ? "#fff1b8" : v > 0.9 ? "#c9a8ff" : v > 0.78 ? "#7b62d8" : v > 0.66 ? "#3f3aa8" : "#26217a");
  }
  stars(b, 70, 3, [90, 0, 230, 80], ["#ffffff", "#ffe9a8"]);
  twinkle(b, 118, 20, 3, "#ffffff", "#ffe9a8"); twinkle(b, 210, 40, 2, "#ffffff", "#ffe9a8"); twinkle(b, 150, 8, 2, "#ffffff", "#ffe9a8");
  glow(b, 160, 110, 40, ["#fff7d6", "#ffe9a0", "#ffd25a"], 0.7); beam(b, 160, 40, 125, 6, 36, ["#ffe27a", "#fff3b0"], 0.2);
  dove(b, 160, 60); glow(b, 160, 60, 28, ["#fff7d6", "#ffe9a0"], 0.25);
  // open Genesis book
  b.rect(80, 126, 160, 40, "#7a1f1f"); b.rect(82, 124, 156, 38, "#e0a82a");
  b.rect(84, 126, 70, 34, "#fff3d0"); b.rect(166, 126, 70, 34, "#fff3d0"); b.rect(154, 126, 12, 34, "#e9d19a");
  for (let i = 0; i < 6; i++) { b.rect(84, 126 + i, 70, 1, i % 2 ? "#fff3d0" : "#f4e3b2"); }
  b.rect(84, 158, 70, 2, "#d9bf86"); b.rect(166, 158, 70, 2, "#d9bf86");
  for (let y = 132; y < 156; y += 4) { b.rect(90, y, 56, 1, "#c9a76a"); b.rect(174, y, 54 - (y % 8), 1, "#c9a76a"); }
  b.rect(170, 128, 46, 3, "#b8892a"); for (let i = 0; i < 7; i++) b.rect(172 + i * 6, 128, 4, 3, "#7a1f1f"); // GENESIS title
  b.rect(84, 128, 3, 30, "#d9bf86");
  // child's hands + sleeves resting on the pages
  const hand = (x: number, dir: 1 | -1) => {
    const X = (dx: number, w: number) => (dir === 1 ? x + dx : x - dx - w);
    for (let i = 0; i < 20; i++) { const c = i < 6 ? "#6e9cea" : i < 14 ? "#4f7fd2" : "#3a62b0"; b.rect(X(0, 56), 150 + i, 56, 1, c); }
    for (let i = 0; i < 20; i++) b.rect(X(50, 8), 150 + i, 8, 1, i < 3 ? "#ffffff" : "#e6eefb"); // cuff
    b.rect(X(8, 40), 152, 40, 1, "#8fb4f2"); b.rect(X(10, 30), 158, 30, 1, "#3a62b0");
    for (let i = 0; i < 11; i++) b.rect(X(58, 24), 152 + i, 24, 1, i < 3 ? "#fbe3c4" : i < 8 ? "#f2c597" : "#d9a47c"); // hand
    for (const i of [3, 6, 9]) b.rect(X(66, 16), 152 + i, 16, 1, "#d9a47c"); // fingers
    b.rect(X(78, 6), 153, 6, 3, "#fbe3c4");
  };
  hand(-4, 1); hand(324, -1);
  b.flush(ctx);
}, 1, "#ffe9a8");

export function bookshelf(b: Buf, x: number, y: number, w: number) {
  b.rect(x, y, w, 94, "#6e3a18"); b.rect(x + 2, y + 2, w - 4, 90, "#8a4e24");
  const bc = ["#c0392b", "#2d6cdf", "#3aa655", "#e0a82a", "#8e44ad", "#d96b2b", "#2a9d9d"];
  [0, 30, 60].forEach((o, si) => {
    const sy = y + 2 + o; b.rect(x + 2, sy + 26, w - 4, 4, "#6e3a18"); b.rect(x + 2, sy + 28, w - 4, 2, "#4d2a10");
    let bx = x + 5;
    for (let i = 0; bx < x + w - 8; i++) { const bw = 3 + ((i * 7 + si * 3) % 4), bh = 16 + ((i * 5 + si) % 8), c = bc[(i + si * 2) % 7]; b.rect(bx, sy + 26 - bh, bw, bh, c); b.rect(bx, sy + 26 - bh, 1, bh, mix(c, "#ffffff", 0.3)); b.rect(bx + bw - 1, sy + 26 - bh, 1, bh, mix(c, "#000000", 0.3)); b.rect(bx + 1, sy + 26 - bh + 3, Math.max(1, bw - 2), 1, "#f6e3a8"); bx += bw + 1; }
  });
}
