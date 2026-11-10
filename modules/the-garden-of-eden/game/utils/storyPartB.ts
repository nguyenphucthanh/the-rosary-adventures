import { INTRO_H, INTRO_W, registerIntroIllustration } from "@/modules/the-garden-of-eden/game/utils/introIllustrations";
import { Buf, beam, ray, cloud, dove, glow, lump, meadow, mix, orb, ridge, river, stars, tree, twinkle, water } from "@/modules/the-garden-of-eden/game/utils/pixelScenery";
import { bird, deer, elephant, fish, limb, lamb, lion, person, whale } from "@/modules/the-garden-of-eden/game/utils/pixelCreatures";

/** Days 5-8. 320x192, painted once. */
const newBuf = () => new Buf(INTRO_W, INTRO_H);
const GREENS = ["#7bd14e", "#4fae3f", "#2f8a3a", "#1d6a2e"];

// Day 5: birds over the waves, fish and a great whale beneath
registerIntroIllustration("seabirds", (ctx) => {
  const b = newBuf(), SURF = 84;
  b.sky(0, SURF, ["#4aa6ee", "#86ccf6", "#cdeefc", "#ffe8c0"]);
  glow(b, 262, 70, 44, ["#fff7d6", "#ffe9a0"], 0.5); orb(b, 262, 72, 10, ["#ffffff", "#ffe27a", "#ffc24a"]);
  cloud(b, 20, 14, 90, 26, 51, ["#ffffff", "#f6faff", "#d3e6f8", "#a9c6e6"]); cloud(b, 170, 26, 70, 18, 52, ["#ffffff", "#f6faff", "#d3e6f8", "#a9c6e6"]);
  ridge(b, { base: 80, amp: 34, freq: 0.03, seed: 61, cols: ["#c4c9d6", "#9aa1b4", "#767e96", "#555c76"], x0: 0, x1: 96, bottom: SURF + 2, sharp: 0.9 });
  ridge(b, { base: 82, amp: 24, freq: 0.04, seed: 62, cols: ["#c4c9d6", "#9aa1b4", "#767e96", "#555c76"], x0: 250, x1: 320, bottom: SURF + 2 });
  tree(b, 24, 70, { h: 34, w: 30, cols: GREENS, seed: 5 });
  // underwater
  b.sky(SURF, INTRO_H, ["#3fb6ee", "#2288d4", "#1457ae", "#0b2f72", "#081e52"]);
  for (let x = 0; x < b.w; x++) { b.set(x, SURF, "#ffffff"); b.set(x, SURF + 1, x % 7 < 3 ? "#bfe6ff" : "#8fd0f7"); b.set(x, SURF - 1 - ((x >> 3) % 2), x % 5 < 2 ? "#e4f4ff" : "#8fd0f7"); }
  for (const [x, w] of [[40, 22], [104, 28], [170, 20], [236, 30], [292, 22]]) ray(b, x, SURF + 2, x - 40, 176, 10, w + 10, ["#5cc0f2", "#8fd8fa", "#b8ecff"], 0.55);
  // sea floor
  ridge(b, { base: 172, amp: 14, freq: 0.03, seed: 71, cols: ["#f3dca0", "#e0bf78", "#c4a05a", "#9a7a3a"], bottom: INTRO_H });
  const coral = (x: number, y: number, h: number, c: string[], seed: number) => {
    const br: [number, number][] = [[-h * 0.3, -h * 0.65], [h * 0.3, -h * 0.7], [0, -h]];
    br.forEach(([dx, dy], i) => lump(b, limb(x, y, 2.4, x + dx, y + dy, 1.6 + (i === 2 ? 0.5 : 0)), c, { r: 1, tex: 0.2, seed: seed + i }));
    for (const [dx, dy] of br) lump(b, [[x + dx, y + dy, 3, 3]], c, { r: 1, tex: 0.1 });
  };
  const COR = [["#ffb0c8", "#ff7aa6", "#d04a80"], ["#ffc66a", "#ff9a3a", "#cc6a20"], ["#d9a8ff", "#a870e8", "#7a44b8"]];
  [[20, 186, 26], [60, 182, 20], [118, 188, 30], [150, 180, 18], [246, 186, 28], [286, 182, 22]].forEach(([x, y, h], i) => coral(x, y, h, COR[i % 3], 80 + i));
  for (const x of [8, 90, 214, 268, 308]) for (let k = 0; k < 20; k++) b.set(x + Math.round(Math.sin(k / 3) * 2), 184 - k, k % 3 ? "#2fae5a" : "#1c8a44");
  // creatures
  whale(b, 200, 124);
  [[40, 108, ["#ffd66a", "#f2a93b", "#c27a1c"]], [62, 122, ["#ffd66a", "#f2a93b", "#c27a1c"]], [30, 134, ["#ffb0c8", "#ff7aa6", "#d04a80"]], [74, 100, ["#ffd66a", "#f2a93b", "#c27a1c"]], [52, 144, ["#9fe0ff", "#4fb0ee", "#2a78c0"]], [96, 130, ["#ffd66a", "#f2a93b", "#c27a1c"]], [110, 112, ["#ffb0c8", "#ff7aa6", "#d04a80"]]].forEach(([x, y, c]) => fish(b, x as number, y as number, c as string[]));
  fish(b, 300, 150, ["#9fe0ff", "#4fb0ee", "#2a78c0"], true); fish(b, 284, 160, ["#ffd66a", "#f2a93b", "#c27a1c"], true);
  for (const [x, y] of [[262, 104], [266, 98], [259, 92], [120, 150], [124, 143], [84, 158]]) { b.rect(x, y, 2, 2, "#e4f6ff"); b.set(x, y, "#ffffff"); }
  // flock above the waves
  const P = [["#ffffff", "#d3ddf0", "#a7b4d4"], ["#ffb0c8", "#ff7aa6", "#d04a80"], ["#ffe27a", "#f2a93b", "#c27a1c"], ["#9fe0ff", "#4fb0ee", "#2a78c0"]];
  [[128, 30], [150, 44], [176, 22], [200, 50], [226, 34], [112, 56], [244, 62], [170, 68], [140, 72]].forEach(([x, y], i) => bird(b, x, y, P[i % 4], i % 2 === 0, i % 3 === 0));
  dove(b, 164, 46);
  b.flush(ctx);
}, 1, "#e4f6ff");

// Day 6: Adam breathes his first breath in a clearing full of gentle animals
registerIntroIllustration("adam", (ctx) => {
  const b = newBuf();
  b.sky(0, 100, ["#6fcff0", "#b4e8f4", "#fff0b8", "#ffe19a"]);
  glow(b, 60, 8, 60, ["#fff7d6", "#ffe9a0", "#ffd870"], 0.6);
  ridge(b, { base: 104, amp: 36, freq: 0.025, seed: 81, cols: ["#7fbf9a", "#5fa57e", "#4a8a68", "#386f52"] });
  const DT = ["#4fae3f", "#2f8a3a", "#1d6a2e", "#124d22"];
  [[14, 108, 58], [80, 104, 44], [248, 106, 50], [300, 110, 62], [214, 100, 36]].forEach(([x, y, h], i) => tree(b, x, y, { h, w: h * 0.9, cols: DT, seed: 90 + i }));
  meadow(b, 106, INTRO_H, ["#9be05e", "#64bd44", "#3f9840"], 17, ["#ff7a9a", "#ffe27a", "#ffffff", "#c77dff", "#ff9a3a"]);
  for (const x of [10, 56, 100, 130]) ray(b, x, 0, x + 90, 160, 10, 34, ["#fff3b0", "#ffe9a0", "#fff7d6"], 0.55);
  // the breath of life + clay
  beam(b, 160, 0, 150, 18, 46, ["#fff7d6", "#ffffff"], 0.2); glow(b, 160, 110, 34, ["#ffffff", "#fff3b0", "#ffe27a"], 0.5);
  lump(b, [[160, 158, 34, 7], [140, 156, 16, 6], [182, 156, 14, 6]], ["#e08a5a", "#c2683a", "#8f4524", "#6a3016"], { r: 2, tex: 0.5 });
  elephant(b, 270, 142, true); deer(b, 36, 146);
  lion(b, 94, 168); lamb(b, 226, 172, true);
  person(b, 160, 160, { hair: "#5a3418", leaf: "#3f9a3a", armL: [-9, 3], armR: [9, 3] });
  for (let i = 0; i < 9; i++) { const y = 20 + i * 12, x = 160 + Math.round(Math.sin(i * 1.1) * 9); b.rect(x, y, 2, 2, "#ffffff"); b.rect(x - 1, y, 4, 1, "#fff3b0"); } // spiralling breath
  dove(b, 160, 36);
  [[116, 30], [208, 24], [240, 54], [90, 58]].forEach(([x, y], i) => bird(b, x, y, i % 2 ? ["#ff7aa6", "#d04a80", "#a02860"] : ["#ffe27a", "#f2a93b", "#c27a1c"], i % 2 === 0));
  for (const [x, y] of [[132, 180], [200, 184], [40, 184], [288, 176]]) { b.rect(x, y, 4, 3, "#ffffff"); b.rect(x + 1, y - 2, 2, 2, "#ffffff"); b.rect(x + 3, y - 1, 2, 1, "#e9e9f2"); b.set(x + 3, y - 3, "#ffffff"); b.set(x + 1, y - 3, "#ffffff"); } // rabbits
  b.flush(ctx);
}, 1, "#fff3b0");

// Day 7: the Sabbath - the glory of the Trinity over a holy hill where all creation rests
registerIntroIllustration("sabbath", (ctx) => {
  const b = newBuf();
  b.sky(0, 120, ["#3a2a8a", "#8a4aa0", "#e2709a", "#ffa66a", "#ffe08a"]);
  stars(b, 40, 4, [0, 0, 320, 50], ["#ffffff", "#ffe9a8"]);
  // glory: three beams, rings of light, dove
  for (const dx of [-60, 0, 60]) ray(b, 160, 20, 160 + dx * 2, 118, 6, 60, ["#ffd870", "#ffe9a0", "#fff7d6"], 0.6);
  for (let r = 60; r >= 12; r -= 12) glow(b, 160, 40, r, [r > 40 ? "#ffd870" : "#ffe9a0", "#fff3b0"], 0.5);
  orb(b, 160, 40, 11, ["#ffffff", "#fffbe0", "#ffe9a0"]); dove(b, 160, 44);
  for (const [x, y] of [[100, 22], [226, 26], [70, 60], [250, 60]]) twinkle(b, x, y, 3, "#ffffff", "#ffe9a8");
  cloud(b, 12, 70, 90, 26, 91, ["#ffe9d8", "#ffc9b4", "#e8909a", "#b25f86"]); cloud(b, 230, 60, 84, 24, 92, ["#ffe9d8", "#ffc9b4", "#e8909a", "#b25f86"]);
  ridge(b, { base: 116, amp: 24, freq: 0.025, seed: 94, cols: ["#b79cc8", "#9a7cb4", "#7e62a0", "#654a88"] });
  water(b, 114, 128, ["#ffd9b0", "#f09aa0", "#9a6aa8"], ["#ffffff", "#ffe9c4", "#ffd9b0"], 33);
  // holy hill
  lump(b, [[160, 190, 190, 78], [60, 160, 70, 24], [260, 160, 70, 24]], ["#a4e46a", "#6fc84a", "#44a23f", "#2f7e36"], { r: 4, tex: 0.3, lx: -0.6, ly: -1 });
  meadow(b, 150, INTRO_H, ["#9be05e", "#64bd44", "#3f9840"], 12, ["#ff7a9a", "#ffe27a", "#ffffff", "#c77dff"], 70, 250);
  const T = ["#7bd14e", "#4fae3f", "#2f8a3a", "#1d6a2e"];
  tree(b, 30, 150, { h: 50, w: 46, cols: T, fruit: "#ff4d4d", seed: 3 }); tree(b, 294, 152, { h: 52, w: 48, cols: T, fruit: "#ffb02e", seed: 6 });
  elephant(b, 52, 172, false); lion(b, 270, 176, true); deer(b, 100, 160); lamb(b, 224, 164);
  person(b, 142, 172, { hair: "#5a3418", leaf: "#3f9a3a", armL: [6, 3], armR: [12, 0] });
  person(b, 178, 172, { hair: "#c98a2e", leaf: "#3f9a3a", long: true, armL: [-12, 0], armR: [-3, 4] });
  [[40, 130, "#ffe27a"], [260, 124, "#ffffff"], [210, 100, "#ffe27a"], [110, 96, "#ffffff"]].forEach(([x, y, c], i) => bird(b, x as number, y as number, [c as string, mix(c as string, "#8a5a2a", 0.3), mix(c as string, "#5a3a1a", 0.5)], i % 2 === 0));
  for (const [x, y] of [[84, 118], [120, 100], [196, 108], [236, 128], [150, 80], [180, 70]]) { b.rect(x, y, 3, 2, "#fff3b0"); b.rect(x + 2, y - 5, 1, 6, "#fff3b0"); b.rect(x + 3, y - 5, 3, 1, "#fff3b0"); } // rising notes
  b.flush(ctx);
}, 1, "#fff3b0");

// Day 8: the spring of Eden and four rivers flowing out to water the garden
registerIntroIllustration("rivers", (ctx) => {
  const b = newBuf();
  b.sky(0, 100, ["#5fc4f0", "#a8e0f6", "#e8f8e0"]);
  cloud(b, 30, 16, 80, 20, 111, ["#ffffff", "#f6faff", "#d3e6f8", "#a9c6e6"]); cloud(b, 230, 24, 60, 16, 112, ["#ffffff", "#f6faff", "#d3e6f8", "#a9c6e6"]);
  ridge(b, { base: 80, amp: 60, freq: 0.02, seed: 101, cols: ["#9ad0b4", "#74b698", "#559c80", "#3f7f68"], sharp: 1.3 });
  meadow(b, 78, INTRO_H, ["#9be05e", "#64bd44", "#3f9840"], 23, ["#ff7a9a", "#ffe27a", "#ffffff", "#c77dff"]);
  // four rivers from the pool: back-left, back-right, front-left, front-right
  const P = ["#a8e6ff", "#4fb6f0", "#2478c8"];
  river(b, 98, 192, (y) => 160 - (y - 98) * 1.5 + Math.sin(y / 9) * 5, (y) => 4 + (y - 98) * 0.1, P, 1);
  river(b, 98, 192, (y) => 160 + (y - 98) * 1.5 + Math.sin(y / 9 + 2) * 5, (y) => 4 + (y - 98) * 0.1, P, 2);
  river(b, 98, 150, (y) => 160 - (y - 98) * 2.4 + Math.sin(y / 7) * 3, (y) => 3 + (y - 98) * 0.05, P, 3);
  river(b, 98, 150, (y) => 160 + (y - 98) * 2.4 + Math.sin(y / 7 + 1) * 3, (y) => 3 + (y - 98) * 0.05, P, 4);
  // rock spring + waterfall into the pool
  lump(b, [[160, 90, 26, 14], [146, 84, 12, 10], [176, 86, 14, 10], [160, 78, 14, 8]], ["#cfd3e0", "#a4aabe", "#7b8298", "#565c78"], { r: 3, tex: 0.3 });
  for (let y = 60; y < 104; y++) for (let x = 152; x < 169; x++) { const wob = Math.sin(y / 3 + x) > 0.3; b.set(x, y, wob ? "#ffffff" : x % 3 === 0 ? "#a8e6ff" : "#7bd0f7"); }
  glow(b, 160, 60, 12, ["#ffffff", "#e4f6ff"], 0.5);
  lump(b, [[160, 108, 34, 8]], ["#a8e6ff", "#4fb6f0", "#2478c8"], { r: 2, tex: 0.1, ly: -1 }); for (let i = 0; i < 12; i++) b.rect(130 + i * 5, 104 + (i % 3) * 3, 4, 1, "#ffffff");
  for (const [x, y] of [[154, 56], [166, 52], [160, 46], [150, 66]]) { b.set(x, y, "#ffffff"); b.set(x + 1, y, "#ffffff"); }
  const T = ["#7bd14e", "#4fae3f", "#2f8a3a", "#1d6a2e"];
  tree(b, 30, 130, { h: 56, w: 50, cols: T, fruit: "#ff4d4d", seed: 1 }); tree(b, 290, 126, { h: 52, w: 46, cols: T, fruit: "#ffb02e", seed: 2 });
  tree(b, 70, 96, { h: 30, w: 28, cols: T, seed: 3 }); tree(b, 252, 98, { h: 30, w: 28, cols: T, seed: 4 });
  tree(b, 20, 190, { h: 66, w: 60, cols: ["#a8dc5a", "#78b83e", "#4f9234", "#336f2a"], fruit: "#ff4d4d", seed: 9 });
  lump(b, [[240, 178, 26, 8], [252, 174, 12, 8]], ["#cfd3e0", "#a4aabe", "#7b8298", "#565c78"], { r: 2, tex: 0.3 });
  person(b, 244, 168, { hair: "#5a3418", leaf: "#3f9a3a", armL: [-8, 6], armR: [10, 2] });
  lamb(b, 214, 184); bird(b, 276, 120, ["#ffe27a", "#f2a93b", "#c27a1c"], true, true);
  dove(b, 120, 40);
  b.flush(ctx);
}, 1, "#e4f6ff");
