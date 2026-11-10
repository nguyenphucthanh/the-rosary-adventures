import { INTRO_H, INTRO_W, registerIntroIllustration } from "@/modules/the-garden-of-eden/game/utils/introIllustrations";
import { bookshelf } from "@/modules/the-garden-of-eden/game/utils/storyPartA";
import { Buf, bayer, cloud, dove, fbm, glow, lump, meadow, orb, ridge, ray, stars, tree, twinkle } from "@/modules/the-garden-of-eden/game/utils/pixelScenery";
import { bird, deer, drawSerpent, lamb, limb, person, serpentPath } from "@/modules/the-garden-of-eden/game/utils/pixelCreatures";

/** Days 9-12 + epilogue. 320x192, painted once. */
const newBuf = () => new Buf(INTRO_W, INTRO_H);
const GREENS = ["#7bd14e", "#4fae3f", "#2f8a3a", "#1d6a2e"];
const STONE = ["#cfd3e0", "#a4aabe", "#7b8298", "#565c78"];

// Day 9: Adam and Eve, hand in hand beneath the Tree of Life
registerIntroIllustration("eve", (ctx) => {
  const b = newBuf();
  b.sky(0, 120, ["#8fd8f4", "#cdeef6", "#fff1c8", "#ffe0b0"]);
  cloud(b, 20, 20, 80, 20, 121, ["#ffffff", "#fff6ec", "#ffdcc0", "#eeb0a0"]); cloud(b, 240, 34, 66, 16, 122, ["#ffffff", "#fff6ec", "#ffdcc0", "#eeb0a0"]);
  ridge(b, { base: 118, amp: 40, freq: 0.02, seed: 131, cols: ["#9ad0b4", "#74b698", "#559c80", "#3f7f68"] });
  meadow(b, 116, INTRO_H, ["#a4e866", "#6fc84a", "#44a23f"], 41, ["#ffffff", "#ff9ab8", "#ffe27a", "#c77dff"]);
  glow(b, 160, 70, 80, ["#fff7d6", "#ffe9a0", "#ffd870"], 0.4);
  tree(b, 160, 132, { h: 128, w: 150, cols: ["#9be05e", "#5fbf44", "#3a9a3c", "#237a30"], fruit: "#ffd84a", seed: 7, trunk: ["#b87a46", "#8a5428", "#5a3418"] });
  for (let i = 0; i < 30; i++) { const x = 100 + ((i * 37) % 120), y = 22 + ((i * 53) % 60); b.rect(x, y, 3, 3, "#ffffff"); b.set(x + 1, y + 1, "#ffe27a"); } // blossoms
  [[48, 168, 1], [276, 172, 0]].forEach(([x, y, m]) => deer(b, x, y, !!m)); lamb(b, 236, 186, true); lamb(b, 90, 188);
  person(b, 133, 176, { hair: "#5a3418", leaf: "#3f9a3a", armL: [-4, 14], armR: [20, 12] });
  person(b, 187, 176, { hair: "#c98a2e", leaf: "#3f9a3a", long: true, armL: [-20, 12], armR: [4, 14] });
  glow(b, 160, 164, 12, ["#ffffff", "#fff3b0", "#ffe27a"], 0.8);
  for (const [x, y] of [[148, 140], [172, 132], [160, 118]]) twinkle(b, x, y, 2, "#ffffff", "#ffe27a");
  bird(b, 60, 60, ["#ffffff", "#d3ddf0", "#a7b4d4"], true); bird(b, 262, 74, ["#ffffff", "#d3ddf0", "#a7b4d4"], false, true);
  b.flush(ctx);
}, 1, "#fff3b0");

// Day 10: the serpent coils about the Tree of Knowledge and whispers to Eve
registerIntroIllustration("serpent", (ctx) => {
  const b = newBuf();
  b.sky(0, 120, ["#1a1240", "#3a1f66", "#6a2f78", "#a2486a"]);
  stars(b, 40, 9, [0, 0, 320, 70], ["#d8c8ff", "#9a86d8"]);
  orb(b, 270, 30, 10, ["#ffe9d0", "#f2b890", "#c88470"]); glow(b, 270, 30, 28, ["#f2b890", "#a2486a"], 0.25);
  ridge(b, { base: 120, amp: 36, freq: 0.022, seed: 141, cols: ["#4a3a78", "#3a2c64", "#2c2150", "#1f1840"] });
  meadow(b, 118, INTRO_H, ["#2f7a48", "#1f5a3a", "#143e2c"], 51, ["#c77dff", "#ff7a9a"]);
  const pts = serpentPath(-0.6, 5.2 * Math.PI, 118, 176, 114, 15, 190);
  const SC = ["#c8e86a", "#7fbf3a", "#4a8a2a", "#2a5a1c"];
  drawSerpent(b, pts.filter((p) => !p.front), SC);
  tree(b, 118, 182, { h: 150, w: 150, cols: ["#3f9a52", "#2a7a42", "#1b5a34", "#0f3d26"], seed: 13, fruit: "#ff4d4d", trunk: ["#8a6a58", "#5e4438", "#3a2822"], shadow: "#102a22" });
  drawSerpent(b, pts.filter((p) => p.front), SC);
  // serpent head reaching toward Eve + forked tongue
  const neck = [...limb(128, 112, 3.4, 150, 100, 3.8), ...limb(150, 100, 3.8, 172, 100, 4.6)];
  lump(b, neck, SC, { r: 2, tex: 0.1 }); lump(b, [[180, 99, 7.5, 5.4], [187, 101, 4.4, 3.2]], SC, { r: 2, tex: 0.1 });
  b.rect(178, 96, 3, 3, "#ff3a3a"); b.set(178, 96, "#ffffff"); b.rect(183, 99, 1, 1, "#2a5a1c");
  for (const [x, y] of [[192, 102], [194, 101], [196, 100], [194, 103], [196, 104]]) b.set(x, y, "#ff3a3a");
  glow(b, 204, 118, 16, ["#ff7a7a", "#c03a4a"], 0.35);
  lump(b, [[204, 118, 5, 5]], ["#ff9a9a", "#ff4d4d", "#c02a2a", "#8a1a1a"], { r: 1, tex: 0 }); b.rect(204, 111, 1, 4, "#3a9a3a"); b.rect(205, 111, 3, 1, "#3a9a3a"); // the forbidden fruit
  person(b, 228, 178, { hair: "#c98a2e", leaf: "#3f9a3a", long: true, armL: [-17, -24], armR: [4, 12] });
  for (let i = 0; i < 70; i++) { const x = 150 + ((i * 17) % 110), y = 40 + ((i * 29) % 70); if (fbm(x * 0.07, y * 0.09, 3, 3) > 0.52 && bayer(x, y) > 0.45) b.set(x, y, "#6a3f9a"); } // whispered doubt
  b.flush(ctx);
}, 1, "#c77dff");

// Day 11: dusk - Adam and Eve hide among the trees while God's light searches the garden
registerIntroIllustration("hiding", (ctx) => {
  const b = newBuf();
  b.sky(0, 110, ["#2a1a58", "#6a2f78", "#d2587a", "#ff9a5a", "#ffd88a"]);
  glow(b, 320, 70, 80, ["#fff7d6", "#ffe9a0", "#ffc24a"], 0.55);
  ray(b, 320, 40, 90, 190, 20, 70, ["#ffc24a", "#ffe9a0", "#fff7d6"], 0.55);
  ray(b, 320, 60, 150, 190, 12, 44, ["#ffc24a", "#ffe9a0"], 0.5);
  ridge(b, { base: 112, amp: 30, freq: 0.025, seed: 151, cols: ["#6a4a8a", "#533a74", "#3f2c5e", "#2c1e46"] });
  meadow(b, 112, INTRO_H, ["#6a9a3a", "#3f7a34", "#244f2a"], 61);
  // thorns and thistles
  for (const x of [20, 76, 134, 200, 264, 300]) for (let k = 0; k < 9; k++) { b.rect(x + k * 2, 176 - k - (k % 3), 1, 5 + (k % 4), "#2a1a22"); b.set(x + k * 2 - 1, 174 - k, "#6a3a3a"); b.set(x + k * 2 + 1, 173 - k, "#6a3a3a"); }
  // long shadows cast away from the light (to the left)
  for (const [x, y] of [[126, 176], [186, 172]]) for (let yy = y - 2; yy < y + 3; yy++) for (let xx = x - 60; xx < x; xx++) if (bayer(xx, yy) < 0.7) b.set(xx, yy, "#1a3a22");
  person(b, 130, 176, { hair: "#5a3418", leaf: "#7ab03a", armL: [-2, 4], armR: [3, -14], face: "down" });
  person(b, 190, 172, { hair: "#c98a2e", leaf: "#7ab03a", long: true, armL: [-3, -12], armR: [3, 6], face: "down" });
  const dk = ["#3f9a52", "#2a7a42", "#1b5a34", "#0f3d26"];
  tree(b, 104, 184, { h: 120, w: 70, cols: dk, seed: 21, shadow: "#102a22", trunk: ["#8a6a58", "#5e4438", "#3a2822"] });
  tree(b, 214, 178, { h: 108, w: 66, cols: dk, seed: 22, shadow: "#102a22", trunk: ["#8a6a58", "#5e4438", "#3a2822"] });
  tree(b, 24, 190, { h: 140, w: 90, cols: dk, seed: 23, shadow: "#102a22", trunk: ["#8a6a58", "#5e4438", "#3a2822"] });
  tree(b, 290, 160, { h: 70, w: 50, cols: ["#9a7a3a", "#7a5a2a", "#5a3e1e", "#3a2814"], seed: 24, bare: false });
  for (const [x, y] of [[250, 120], [262, 130], [236, 108]]) b.rect(x, y, 2, 2, "#fff7d6");
  b.flush(ctx);
}, 1, "#ffe9a0");

// Day 12: leaving Eden - the cherub and flaming sword guard the gate, hope's star and cross ahead
registerIntroIllustration("exodus", (ctx) => {
  const b = newBuf();
  b.sky(0, 130, ["#1a1a4a", "#3a2a78", "#8a4a8a", "#e2709a", "#ffa66a", "#ffe08a"]);
  stars(b, 50, 12, [140, 0, 320, 70], ["#ffffff", "#ffe9a8"]);
  glow(b, 252, 40, 26, ["#fff7d6", "#ffe9a0"], 0.4); twinkle(b, 252, 40, 7, "#ffffff", "#ffe27a"); // morning star
  glow(b, 268, 112, 40, ["#fff7d6", "#ffe9a0", "#ffc24a"], 0.55);
  b.rect(267, 90, 3, 24, "#fff7d6"); b.rect(259, 97, 19, 3, "#fff7d6"); b.rect(268, 90, 1, 24, "#ffffff"); b.rect(259, 98, 19, 1, "#ffffff"); // cross of light
  cloud(b, 150, 66, 86, 24, 161, ["#ffe9d8", "#ffc9b4", "#e8909a", "#b25f86"]); cloud(b, 270, 74, 50, 16, 162, ["#ffe9d8", "#ffc9b4", "#e8909a", "#b25f86"]);
  ridge(b, { base: 128, amp: 22, freq: 0.03, seed: 171, cols: ["#8a6a8a", "#6e5276", "#553e62", "#402e4e"] });
  // dusty road
  b.sky(126, INTRO_H, ["#e6b27a", "#c98f56", "#9a6a3a", "#6e4624"]);
  for (let i = 0; i < 110; i++) { const x = (i * 41) % 320, y = 134 + ((i * 23) % 54); b.rect(x, y, 2 + (i % 3), 1, i % 2 ? "#f2c690" : "#7a5030"); }
  [[300, 150], [232, 160], [150, 176]].forEach(([x, y], i) => lump(b, [[x, y, 6 + i * 2, 4 + i]], STONE, { r: 2, tex: 0.3 }));
  // Eden behind the gate: lush garden glowing with light
  b.sky(60, 134, ["#fff7d6", "#ffe9a0", "#ffd870"], 12, 108);
  tree(b, 24, 134, { h: 76, w: 52, cols: GREENS, fruit: "#ff4d4d", seed: 31 }); tree(b, 88, 132, { h: 64, w: 48, cols: GREENS, fruit: "#ffb02e", seed: 32 }); tree(b, 58, 130, { h: 50, w: 40, cols: ["#a8dc5a", "#78b83e", "#4f9234", "#336f2a"], seed: 33 });
  meadow(b, 132, 150, ["#9be05e", "#64bd44", "#3f9840"], 71, ["#ff7a9a", "#ffe27a"], 0, 108);
  glow(b, 58, 100, 44, ["#fff7d6", "#ffe9a0"], 0.35);
  // gate: two pillars and a vine-wrapped stone arch around the glowing garden
  const arch = (x: number, y: number) => y <= 84 && ((x - 58) / 54) ** 2 + ((y - 84) / 32) ** 2 <= 1 && ((x - 58) / 43) ** 2 + ((y - 84) / 22) ** 2 > 1;
  b.shade(arch, [0, 40, 120, 90], STONE, { r: 3, tex: 0.3, seed: 5 });
  for (const x of [4, 100]) { lump(b, [[x + 7, 120, 7, 34]], STONE, { r: 2, tex: 0.3 }); b.rect(x - 1, 84, 16, 4, STONE[0]); b.rect(x - 1, 87, 16, 1, STONE[2]); }
  for (let i = 0; i < 50; i++) { const x = 8 + ((i * 13) % 100), y = 48 + ((i * 7) % 40); if (arch(x, y) || x < 18 || x > 98) { b.set(x, y, GREENS[i % 3]); b.set(x + 1, y + 1, GREENS[1]); } }
  // cherub with flaming sword, guarding the way
  const WG = ["#ffffff", "#fff0c8", "#d9b870", "#a88438"];
  lump(b, [...limb(132, 140, 5, 112, 108, 3), ...limb(128, 142, 5, 110, 122, 3.4), ...limb(136, 140, 5, 150, 110, 3), ...limb(140, 142, 5, 152, 124, 3.4)], WG, { r: 2, tex: 0.1 });
  person(b, 134, 178, { hair: "#c98a2e", robe: "#f4f0ff", armL: [-4, 10], armR: [14, -8] });
  lump(b, limb(150, 150, 2, 150, 96, 1.4), ["#fffbe0", "#ffd84a", "#ff9a2a", "#e0561a"], { r: 1, tex: 0 }); // flaming sword
  for (let i = 0; i < 20; i++) { const y = 96 + i * 3; b.set(146 + (i % 2) * 3, y, "#ff9a2a"); b.set(154 - (i % 3), y + 1, "#ffd84a"); b.set(150, y - 2 + (i % 2), "#ff5a1a"); }
  glow(b, 150, 120, 20, ["#ffd84a", "#ff9a2a"], 0.3);
  // the first family sets out in skin garments, hand in hand, walking toward the light
  person(b, 214, 180, { hair: "#4a2a12", robe: "#7a4a26", tunic: true, armL: [-2, 14], armR: [12, 10], face: "hidden" });
  person(b, 240, 180, { hair: "#b8761e", robe: "#8f5a30", tunic: true, long: true, armL: [-14, 10], armR: [3, 14], face: "hidden" });
  glow(b, 227, 168, 10, ["#ffffff", "#fff3b0"], 0.45);
  b.flush(ctx);
}, 1, "#ffe9a0");

// Epilogue: the little room at noon - Genesis open beside the Rosary, a white flower on the sill, the dove at the window
registerIntroIllustration("epilogue", (ctx) => {
  const b = newBuf();
  b.sky(0, 120, ["#fbe8c0", "#f6dfb4", "#eecf9c"]);
  for (let x = 10; x < b.w; x += 20) for (let y = 0; y < 120; y += 2) b.set(x, y, "#ecc896");
  b.rect(0, 112, b.w, 8, "#b9773e"); b.rect(0, 112, b.w, 2, "#d9975a");
  // big window, left: noon sky, sun, clouds, dove outside
  b.rect(10, 8, 120, 98, "#8a5226"); b.rect(14, 12, 112, 90, "#a8683a");
  b.sky(16, 98, ["#58b4f0", "#9ad4f6", "#d8f0fc"], 18, 122);
  cloud(b, 24, 54, 54, 18, 181, ["#ffffff", "#f6faff", "#d3e6f8", "#a9c6e6"]); cloud(b, 78, 34, 36, 12, 182, ["#ffffff", "#f6faff", "#d3e6f8", "#a9c6e6"]);
  orb(b, 100, 30, 9, ["#ffffff", "#ffe27a", "#ffc24a"]); glow(b, 100, 30, 24, ["#fff7d6", "#ffe9a0"], 0.4);
  b.rect(68, 12, 4, 90, "#8a5226"); b.rect(14, 54, 112, 4, "#8a5226"); b.rect(14, 56, 112, 1, "#6a3a18");
  dove(b, 98, 76);
  b.rect(4, 102, 134, 6, "#c98a4a"); b.rect(4, 102, 134, 2, "#e6ad6a"); b.rect(4, 108, 134, 3, "#8a5226");
  // flower pot on the sill
  lump(b, [[34, 96, 9, 6]], ["#e08a5a", "#c2683a", "#8f4524"], { r: 2, tex: 0.2 }); b.rect(25, 88, 18, 4, "#c2683a"); b.rect(25, 88, 18, 1, "#e08a5a");
  b.rect(33, 70, 2, 18, "#3a9a3a"); lump(b, [[28, 78, 5, 2.4], [40, 76, 5, 2.4]], GREENS, { r: 1, tex: 0 });
  lump(b, [[34, 64, 8, 8]], ["#ffffff", "#fff6ec", "#e3dcee", "#bfb4d4"], { r: 2, tex: 0.1 }); lump(b, [[34, 64, 3, 3]], ["#fff3b0", "#ffd84a", "#e0a82a"], { r: 1, tex: 0 });
  ray(b, 100, 40, 190, 190, 30, 90, ["#fff3b0", "#ffe9a0"], 0.35);
  bookshelf(b, 232, 20, 72);
  // table
  b.rect(0, 118, b.w, 74, "#9a5a2a"); b.rect(0, 118, b.w, 3, "#d9975a"); b.rect(0, 121, b.w, 1, "#6e3a18");
  for (let y = 126; y < 192; y += 9) for (let x = ((y / 9) % 2) * 17; x < b.w; x += 41) { b.rect(x, y, 22 + ((x * 3 + y) % 9), 1, "#84491f"); b.rect(x + 6, y + 3, 12, 1, "#b06e38"); }
  // open Bible
  b.rect(120, 138, 132, 44, "#7a1f1f"); b.rect(122, 136, 128, 42, "#e0a82a");
  b.rect(124, 138, 58, 36, "#fff3d0"); b.rect(190, 138, 58, 36, "#fff3d0"); b.rect(182, 138, 8, 36, "#e9d19a");
  for (let y = 144; y < 172; y += 4) { b.rect(128, y, 48, 1, "#c9a76a"); b.rect(194, y, 46 - (y % 8), 1, "#c9a76a"); }
  b.rect(128, 140, 22, 3, "#b8892a");
  // rosary: a ring of beads on the table with its tail and crucifix
  const bead = (x: number, y: number, gold: boolean) => lump(b, [[x, y, 2.4, 2.4]], gold ? ["#fff3b0", "#ffd84a", "#c27a1c"] : ["#ff8a8a", "#d83a3a", "#8a1a1a"], { r: 1, tex: 0 });
  for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2; bead(Math.round(284 + Math.cos(a) * 26), Math.round(156 + Math.sin(a) * 13), i % 6 === 0); }
  for (let i = 0; i < 5; i++) bead(284, 170 + i * 4 - (i > 0 ? 0 : 0), i === 0);
  b.rect(282, 186, 5, 2, "#ffd84a"); b.rect(283, 182, 3, 9, "#ffd84a"); b.rect(283, 182, 1, 9, "#fff3b0");
  for (const [x, y] of [[150, 100], [200, 120], [96, 128], [230, 100], [176, 60]]) twinkle(b, x, y, 2, "#ffffff", "#fff3b0");
  b.flush(ctx);
}, 1, "#fff3b0");
