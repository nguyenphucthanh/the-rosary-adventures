import { PAL, drawMap, rect } from "@/modules/shared/game/utils/pixelArt";
import { DOVE, INTRO_W, registerIntroIllustration } from "@/modules/the-garden-of-eden/game/utils/introIllustrations";

/** Storybook pictures for Stages 8-12 (160x96, 2 frames, integer rects only). Side-effect module: imported by BaseGenesisScene. */
type Ctx = CanvasRenderingContext2D;
const sky = (c: Ctx, cols: string[], h = 8) => cols.forEach((col, i) => rect(c, 0, i * h, INTRO_W, h, col));
const person = (c: Ctx, x: number, y: number, hair: string, robe: string, skin: string = PAL.s) => {
  rect(c, x + 2, y, 6, 3, hair); rect(c, x + 2, y + 3, 6, 5, skin); rect(c, x + 3, y + 5, 1, 1, PAL.e); rect(c, x + 6, y + 5, 1, 1, PAL.e);
  rect(c, x + 1, y + 8, 8, 9, robe); rect(c, x + 2, y + 17, 2, 3, skin); rect(c, x + 6, y + 17, 2, 3, skin);
};
const tree = (c: Ctx, x: number, y: number, a: string, b: string) => { rect(c, x + 8, y + 22, 6, 14, PAL.o); rect(c, x, y + 8, 22, 16, a); rect(c, x + 4, y, 14, 12, a); rect(c, x + 2, y + 18, 18, 4, b); };
const star = (c: Ctx, x: number, y: number, f: number, col: string = PAL.l) => { rect(c, x, y, 1, 1, col); if ((x + f) % 2) rect(c, x - 1, y, 3, 1, col); };

// Day 8: spring of life with four rivers flowing to the corners, Adam with a lamb and a bird
registerIntroIllustration("rivers", (c, f) => {
  rect(c, 0, 0, INTRO_W, 96, PAL.G); rect(c, 0, 0, INTRO_W, 28, PAL.k);
  for (let x = 0; x < INTRO_W; x += 22) { rect(c, x, 22, 22, 8, PAL.g); rect(c, x + 6, 16, 12, 8, PAL.g); }
  rect(c, 70, 30, 20, 66, PAL.x); rect(c, 0, 52, INTRO_W, 10, PAL.x); // rivers: N-S and W-E
  for (let i = 0; i < 6; i++) { rect(c, 72 + ((i * 3 + f * 2) % 14), 34 + i * 10, 5, 1, PAL.w); rect(c, (i * 28 + f * 6) % 150, 56, 6, 1, PAL.w); }
  rect(c, 68, 44, 24, 18, PAL.a); rect(c, 70, 46, 20, 14, PAL.x); rect(c, 78, 34, 4, 14, PAL.w); rect(c, 80 - f, 30, 2 + 2 * f, 4, PAL.l); // spring
  tree(c, 12, 22, PAL.g, PAL.G); tree(c, 122, 20, PAL.g, PAL.G);
  rect(c, 20, 68, 18, 5, PAL.a); person(c, 24, 54, PAL.h, PAL.G); rect(c, 42, 74, 12, 8, PAL.w); rect(c, 50, 72, 5, 5, PAL.W); // Adam on a stone, lamb
  rect(c, 30, 56 + f, 4, 3, PAL.q); // bird on his hand
  for (const [x, y] of [[110, 76], [134, 82], [96, 86]]) { rect(c, x, y, 3, 3, PAL.q); rect(c, x + 1, y + 1, 1, 1, PAL.y); }
}, 2, PAL.x);

// Day 9: Adam and Eve hand in hand under the Tree of Life
registerIntroIllustration("eve", (c, f) => {
  sky(c, [PAL.p, PAL.p, PAL.l, PAL.l, PAL.p, PAL.p], 10); rect(c, 0, 60, INTRO_W, 36, PAL.g); rect(c, 0, 60, INTRO_W, 2, PAL.G);
  rect(c, 76, 30, 8, 34, PAL.o); rect(c, 50, 4, 60, 34, PAL.G); rect(c, 44, 14, 72, 18, PAL.g); rect(c, 60, 0, 40, 10, PAL.g);
  for (const [x, y] of [[56, 14], [72, 8], [90, 16], [104, 24], [64, 28], [84, 26]]) rect(c, x, y, 3, 3, PAL.w); // white blossoms
  rect(c, 38, 36, 84, 1, PAL.y); rect(c, 34, 40, 92, 1, PAL.l); rect(c, 32, 44, 96, 1, PAL.y); // warm arc (stepped)
  person(c, 56, 52, PAL.h, PAL.G); person(c, 94, 52, PAL.y, PAL.q);
  rect(c, 66, 66, 28, 2, PAL.s); rect(c, 78 - f, 62, 4 + 2 * f, 4, PAL.l); // clasped hands glowing
  for (let i = 0; i < 5; i++) rect(c, (i * 31 + f * 9) % 156, (i * 17 + f * 6) % 60, 2, 2, PAL.w); // falling petals
  rect(c, 20 + f * 2, 20, 8, 2, PAL.w); rect(c, 22 + f * 2, 18, 4, 2, PAL.w); rect(c, 130 - f * 2, 26, 8, 2, PAL.w); rect(c, 132 - f * 2, 24, 4, 2, PAL.w); // two doves
}, 2, PAL.q);

// Day 10: the serpent coils round the Tree of Knowledge and whispers to Eve
registerIntroIllustration("serpent", (c, f) => {
  sky(c, [PAL.K, PAL.K, PAL.L, PAL.L, PAL.Z, PAL.Z], 8); rect(c, 0, 62, INTRO_W, 34, PAL.G); rect(c, 0, 62, INTRO_W, 2, PAL.V);
  rect(c, 70, 24, 22, 40, PAL.O); rect(c, 30, 0, 100, 30, PAL.V); rect(c, 22, 10, 116, 16, PAL.Z); rect(c, 50, 24, 60, 6, PAL.V);
  rect(c, 94 + f, 26, 6, 6, PAL.r); rect(c, 95 + f, 27, 2, 2, PAL.q); // forbidden fruit
  for (let i = 0; i < 3; i++) rect(c, 76 + i * 4 - (f * 3), 32 + i * 10, 14, 4, PAL.g); // coiling body
  rect(c, 66, 24, 10, 8, PAL.g); rect(c, 68, 26, 2, 2, PAL.y); rect(c, 62 - f * 2, 29, 4 + f * 2, 1, PAL.r); // head, tongue
  for (let i = 0; i < 6; i++) rect(c, 96 + ((i * 5 + f * 3) % 24), 20 + (i * 7) % 28, 3, 2, PAL.W); // doubt smoke
  person(c, 40, 50, PAL.y, PAL.q); person(c, 126, 54, PAL.h, PAL.G);
  rect(c, 150, 8, 4, 4, PAL.l); rect(c, 148, 10, 8, 1, PAL.l); // far-off warning light
}, 2, PAL.v);

// Day 11: dusk garden, two figures hiding behind trees, God's light seeking them
registerIntroIllustration("hiding", (c, f) => {
  sky(c, [PAL.Z, PAL.V, PAL.v, PAL.Z, PAL.L, PAL.L], 8); rect(c, 0, 56, INTRO_W, 40, PAL.G); rect(c, 0, 80, INTRO_W, 16, PAL.I);
  rect(c, 100, 8, 60, 44, PAL.y); rect(c, 112, 14, 40, 32, PAL.l); rect(c, 124, 20, 18, 20, PAL.w); // God's light between the trees
  rect(c, 150, 8 + f * 4, 10, 1, PAL.l);
  tree(c, 4, 22 + f, PAL.G, PAL.I); tree(c, 56, 28, PAL.I, PAL.K); tree(c, 86 - f, 24, PAL.G, PAL.I);
  person(c, 26, 60, PAL.h, PAL.g); person(c, 66, 64, PAL.y, PAL.g); // wearing fig leaves
  for (const [x, y] of [[8, 84], [46, 88], [92, 86], [130, 84]]) { rect(c, x, y, 2, 6, PAL.A); rect(c, x - 2, y + 2, 6, 1, PAL.A); } // thorns
  rect(c, 18, 52, 14, 5, PAL.e); rect(c, 20, 53, 2, 1, PAL.r); rect(c, 26, 53, 2, 1, PAL.r); // fear phantom
}, 2, PAL.l);

// Day 12: out of Eden - flaming sword at the gate, hope's star and cross ahead
registerIntroIllustration("exodus", (c, f) => {
  sky(c, [PAL.K, PAL.K, PAL.L, PAL.L, PAL.n, PAL.n], 8); rect(c, 0, 66, INTRO_W, 30, PAL.u); rect(c, 0, 66, INTRO_W, 2, PAL.o);
  for (const [x, y] of [[96, 6], [110, 20], [130, 10], [148, 28], [84, 30]]) star(c, x, y, f, PAL.w);
  rect(c, 116, 14, 2, 14, PAL.l); rect(c, 112, 18, 10, 2, PAL.l); rect(c, 115, 17, 4, 4, PAL.w); // cross of light
  rect(c, 134, 4, 4, 4, PAL.y); rect(c, 132, 6, 8, 1, PAL.y); rect(c, 135, 3, 2, 6, PAL.y); // morning star
  rect(c, 0, 20, 40, 46, PAL.G); rect(c, 4, 14, 32, 8, PAL.g); rect(c, 12, 30, 16, 36, PAL.O); // Eden gate
  rect(c, 38, 24, 14, 22, PAL.w); rect(c, 36, 30, 4, 12, PAL.W); rect(c, 50, 30, 4, 12, PAL.W); rect(c, 44, 18, 2, 6, PAL.y); // cherub
  rect(c, 54, 20 + f * 2, 3, 26, PAL.f); rect(c, 55, 18 + f * 2, 1, 4, PAL.l); rect(c, 52, 34, 7, 1, PAL.y); // flaming sword
  person(c, 74, 52, PAL.h, PAL.u); person(c, 90, 52, PAL.y, PAL.u); rect(c, 84, 62, 6, 2, PAL.s); // skin garments, hand in hand
  rect(c, 66, 56, 2, 8, PAL.o); rect(c, 65, 52 - f, 4, 5, PAL.f); rect(c, 66, 50 - f, 2, 3, PAL.l); // child's torch
}, 2, PAL.l);

// Epilogue: sunny little room - open Genesis beside the Rosary, white flower on the sill, the dove watching over
registerIntroIllustration("epilogue", (c, f) => {
  rect(c, 0, 0, INTRO_W, 64, PAL.p); rect(c, 0, 56, INTRO_W, 8, PAL.P); // noon wall
  rect(c, 8, 6, 44, 40, PAL.o); rect(c, 11, 9, 38, 34, PAL.k); rect(c, 28, 9, 3, 34, PAL.o); rect(c, 11, 24, 38, 3, PAL.o); // window
  rect(c, 36, 12, 8, 8, PAL.y); rect(c, 38, 14, 4, 4, PAL.l); // noon sun
  star(c, 16, 14, f, PAL.w); star(c, 20, 32, f, PAL.w);
  rect(c, 4, 46, 52, 4, PAL.O); rect(c, 4, 49, 52, 3, PAL.z); // sill
  rect(c, 14, 38, 12, 8, PAL.t); rect(c, 13, 36, 14, 3, PAL.T); // pot
  rect(c, 19, 26 + (f ? 1 : 0), 2, 11, PAL.g); rect(c, 15, 31, 4, 2, PAL.g); rect(c, 21, 29, 4, 2, PAL.g); // stem + leaves
  rect(c, 17, 22 + (f ? 1 : 0), 6, 6, PAL.W); rect(c, 19, 24 + (f ? 1 : 0), 2, 2, PAL.y); // white flower
  drawMap(c, DOVE.map((r) => r.padEnd(13, ".")), 34, 28 + f); // dove on the frame
  rect(c, 0, 64, INTRO_W, 32, PAL.o); rect(c, 0, 64, INTRO_W, 2, PAL.u);
  for (let y = 72; y < 96; y += 8) rect(c, 0, y, INTRO_W, 1, PAL.O);
  rect(c, 70, 56, 60, 20, PAL.R); rect(c, 72, 54, 56, 20, PAL.y); // open Bible
  rect(c, 74, 56, 24, 16, PAL.p); rect(c, 102, 56, 24, 16, PAL.p); rect(c, 98, 56, 4, 16, PAL.P);
  for (let y = 59; y < 69; y += 3) { rect(c, 77, y, 18, 1, PAL.P); rect(c, 105, y, 18, 1, PAL.P); }
  for (let i = 0; i < 10; i++) rect(c, 134 + i * 2, 70 + (i % 2) * 2, 2, 2, i % 5 === 4 ? PAL.Y : PAL.R); // rosary beads
  rect(c, 150, 76, 2, 6, PAL.Y); rect(c, 148, 78, 6, 2, PAL.Y); // crucifix
  for (const [x, y] of [[76, 46], [112, 40], [140, 56], [100, 30]]) if ((x + f) % 2) rect(c, x, y - f * 3, 2, 2, PAL.l); // light motes
}, 2, PAL.l);
