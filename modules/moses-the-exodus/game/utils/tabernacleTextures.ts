import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/**
 * Stage 13: the Tabernacle. Linen fence, gold-board wall, rug tiles, burnt-offering altar, bronze basin,
 * table of bread, lampstand (dark / lit), oil lamps, incense altar, ark chest, mercy seat, veil, gate curtain, pulley.
 * Integer rects only.
 */
export function registerTabernacleTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("tb_altar")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };
  const sheet = (key: string, w: number, h: number, paints: ((c: CanvasRenderingContext2D, ox: number) => void)[]) => {
    const { canvas, ctx } = makeCanvas(w * paints.length, h);
    paints.forEach((p, i) => p(ctx, i * w));
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };

  // Tiles (16x16)
  still("tb_fence", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.w);
    for (const x of [4, 10]) rect(c, x, 0, 1, 16, PAL.W);
    rect(c, 0, 0, 16, 2, PAL.W); rect(c, 0, 14, 16, 2, PAL.W);
    rect(c, 0, 0, 2, 16, PAL.Y); rect(c, 14, 0, 2, 16, PAL.Y); rect(c, 0, 7, 16, 1, PAL.P);
  });
  still("tb_wall", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.y);
    for (const x of [0, 8]) { rect(c, x + 7, 0, 1, 16, PAL.Y); rect(c, x + 1, 0, 1, 16, PAL.l); }
    for (const y of [3, 12]) { rect(c, 2, y, 4, 1, PAL.Y); rect(c, 10, y, 4, 1, PAL.Y); }
  });
  still("tb_rug", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.Z);
    rect(c, 0, 0, 16, 2, PAL.r); rect(c, 0, 14, 16, 2, PAL.r); rect(c, 0, 2, 16, 1, PAL.y); rect(c, 0, 13, 16, 1, PAL.y);
    rect(c, 7, 5, 2, 6, PAL.b); rect(c, 5, 7, 6, 2, PAL.b); rect(c, 7, 7, 2, 2, PAL.y);
  });
  still("tb_gold_floor", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.l);
    rect(c, 0, 7, 16, 1, PAL.y); rect(c, 0, 15, 16, 1, PAL.y); rect(c, 7, 0, 1, 7, PAL.y); rect(c, 3, 8, 1, 7, PAL.y); rect(c, 11, 8, 1, 7, PAL.y);
  });

  // Altar of burnt offering (32x28): frame 0 cold, frame 1 burning
  const altar = (fire: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 2, 27, 28, 1, PAL.z);
    rect(c, ox + 2, 12, 28, 14, PAL.Y); rect(c, ox + 2, 12, 28, 2, PAL.y); rect(c, ox + 24, 14, 6, 12, PAL.O); rect(c, ox + 2, 24, 28, 2, PAL.O);
    for (const x of [0, 28]) rect(c, ox + x, 8, 4, 6, PAL.y); // four horns (two shown)
    rect(c, ox + 6, 14, 18, 8, PAL.o); rect(c, ox + 6, 14, 18, 1, PAL.O);
    if (fire) { rect(c, ox + 8, 8, 14, 6, PAL.f); rect(c, ox + 11, 4, 8, 6, PAL.f); rect(c, ox + 13, 1, 4, 5, PAL.y); rect(c, ox + 13, 8, 4, 4, PAL.l); }
    else { rect(c, ox + 9, 11, 12, 3, PAL.D); rect(c, ox + 12, 10, 3, 1, PAL.a); }
  };
  sheet("tb_altar", 32, 28, [altar(false), altar(true)]);

  // Bronze basin (22x20): frame 0 dry, frame 1 full of water
  const laver = (full: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 3, 19, 16, 1, PAL.z);
    rect(c, ox + 7, 14, 8, 5, PAL.M); rect(c, ox + 5, 18, 12, 2, PAL.Y); rect(c, ox + 13, 14, 2, 5, PAL.u);
    rect(c, ox + 2, 6, 18, 9, PAL.M); rect(c, ox + 4, 5, 14, 1, PAL.y); rect(c, ox + 2, 13, 18, 2, PAL.u); rect(c, ox + 16, 7, 4, 6, PAL.u);
    rect(c, ox + 4, 6, 14, 4, full ? PAL.x : PAL.O);
    if (full) { rect(c, ox + 6, 7, 4, 1, PAL.w); rect(c, ox + 12, 8, 4, 1, PAL.X); }
  };
  sheet("tb_laver", 22, 20, [laver(false), laver(true)]);

  // Spring pool (28x16) for drawing water
  still("tb_spring", 28, 16, (c) => {
    rect(c, 2, 15, 24, 1, PAL.z);
    rect(c, 4, 2, 20, 2, PAL.a); rect(c, 1, 4, 26, 10, PAL.a); rect(c, 3, 13, 22, 2, PAL.A);
    rect(c, 4, 5, 20, 7, PAL.x); rect(c, 6, 6, 5, 1, PAL.w); rect(c, 14, 8, 6, 1, PAL.X); rect(c, 9, 10, 4, 1, PAL.w);
  });

  // Table of showbread (32x20): gold table, 12 loaves in two stacks of six
  still("tb_table", 32, 20, (c) => {
    rect(c, 3, 19, 26, 1, PAL.z);
    rect(c, 1, 9, 30, 4, PAL.y); rect(c, 1, 9, 30, 1, PAL.l); rect(c, 1, 12, 30, 1, PAL.Y);
    for (const x of [3, 25]) rect(c, x, 13, 3, 6, PAL.Y);
    for (const [x0, y0] of [[4, 2], [18, 2]]) for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) { rect(c, x0 + k * 4, y0 + r * 4, 4, 4, PAL.j); rect(c, x0 + k * 4, y0 + r * 4 + 3, 4, 1, PAL.Y); }
  });

  // Golden lampstand (24x30): dark, then two flicker frames
  const menorah = (lit: number) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 4, 28, 16, 2, PAL.z);
    rect(c, ox + 8, 27, 8, 2, PAL.y); rect(c, ox + 10, 25, 4, 2, PAL.Y); rect(c, ox + 11, 8, 2, 17, PAL.y); rect(c, ox + 12, 8, 1, 17, PAL.Y);
    for (const [xa, xb, y] of [[2, 20, 20], [5, 17, 16], [8, 14, 12]]) {
      rect(c, ox + xa, y, xb - xa + 2, 1, PAL.y);
      for (const x of [xa, xb]) rect(c, ox + x, 8, 1, y - 8 + 1, PAL.y);
    }
    for (const x of [2, 5, 8, 11, 14, 17, 20]) {
      rect(c, ox + x - 1, 7, 3, 2, PAL.Y);
      if (lit) { rect(c, ox + x, 4 - (lit === 2 ? 1 : 0), 1, 3, PAL.f); rect(c, ox + x, 5, 1, 1, PAL.l); }
    }
  };
  sheet("tb_menorah", 24, 30, [menorah(0), menorah(1), menorah(2)]);

  // Oil lamp stand (10x14): unlit / lit
  const lamp = (on: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 1, 13, 8, 1, PAL.z);
    rect(c, ox + 4, 8, 2, 5, PAL.y); rect(c, ox + 2, 12, 6, 2, PAL.Y); rect(c, ox + 1, 6, 8, 3, PAL.y); rect(c, ox + 2, 8, 6, 1, PAL.Y);
    if (on) { rect(c, ox + 4, 2, 2, 4, PAL.f); rect(c, ox + 4, 3, 2, 2, PAL.l); } else rect(c, ox + 4, 4, 2, 2, PAL.D);
  };
  sheet("tb_lamp", 10, 14, [lamp(false), lamp(true)]);

  // Altar of incense (18x26): gold altar, frame 1 with smoke
  const incense = (smoke: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 2, 25, 14, 1, PAL.z);
    rect(c, ox + 2, 11, 14, 14, PAL.y); rect(c, ox + 2, 11, 14, 2, PAL.l); rect(c, ox + 12, 13, 4, 12, PAL.Y); rect(c, ox + 2, 23, 14, 2, PAL.Y);
    for (const x of [1, 15]) rect(c, ox + x, 9, 2, 4, PAL.l);
    rect(c, ox + 5, 15, 8, 5, PAL.Y); rect(c, ox + 7, 16, 4, 3, PAL.l);
    if (smoke) { rect(c, ox + 8, 6, 2, 3, PAL.U); rect(c, ox + 6, 3, 3, 3, PAL.W); rect(c, ox + 9, 0, 3, 3, PAL.U); }
    else rect(c, ox + 8, 8, 2, 1, PAL.a);
  };
  sheet("tb_incense", 18, 26, [incense(false), incense(true)]);

  // Ark chest without its lid (34x22) and Mercy Seat with two cherubim (34x20)
  still("tb_ark_base", 34, 22, (c) => {
    rect(c, 3, 21, 28, 1, PAL.z);
    rect(c, 3, 6, 28, 14, PAL.y); rect(c, 3, 6, 28, 2, PAL.l); rect(c, 3, 17, 28, 3, PAL.Y); rect(c, 25, 8, 6, 9, PAL.Y);
    rect(c, 8, 9, 18, 5, PAL.Y); rect(c, 9, 10, 16, 3, PAL.l);
    rect(c, 0, 14, 34, 2, PAL.o); rect(c, 3, 13, 2, 4, PAL.Y); rect(c, 29, 13, 2, 4, PAL.Y);
  });
  still("tb_mercy", 34, 20, (c) => {
    rect(c, 3, 19, 28, 1, PAL.z);
    rect(c, 3, 14, 28, 4, PAL.l); rect(c, 3, 14, 28, 1, PAL.w); rect(c, 3, 17, 28, 1, PAL.Y);
    for (const mirror of [false, true]) {
      const px = (x: number, w: number) => (mirror ? 34 - x - w : x);
      rect(c, px(6, 7), 6, 7, 8, PAL.y); rect(c, px(8, 4), 2, 4, 4, PAL.s); rect(c, px(9, 1), 3, 1, 1, PAL.e);
      rect(c, px(3, 4), 3, 4, 9, PAL.l); rect(c, px(2, 2), 5, 2, 6, PAL.l); rect(c, px(7, 2), 5, 2, 8, PAL.Y);
    }
  });

  // Veil (48x44): purple, blue and scarlet with cherubim, hung from gold hooks
  still("tb_veil", 48, 44, (c) => {
    rect(c, 0, 0, 48, 3, PAL.y); for (const x of [2, 12, 22, 32, 42]) rect(c, x, 3, 4, 2, PAL.Y);
    for (let i = 0; i < 6; i++) rect(c, 2 + i * 7, 5, 7, 38, [PAL.v, PAL.b, PAL.r, PAL.v, PAL.b, PAL.r][i]);
    for (let i = 0; i < 6; i++) rect(c, 2 + i * 7 + 5, 5, 2, 38, [PAL.V, PAL.B, PAL.R, PAL.V, PAL.B, PAL.R][i]);
    rect(c, 20, 18, 8, 10, PAL.y); rect(c, 22, 14, 4, 4, PAL.l); rect(c, 14, 20, 6, 6, PAL.l); rect(c, 28, 20, 6, 6, PAL.l);
    rect(c, 2, 41, 44, 3, PAL.y);
  });

  // Courtyard gate curtain (64x28): blue, purple, scarlet, linen stripes
  still("tb_gate", 64, 28, (c) => {
    rect(c, 0, 0, 64, 3, PAL.y);
    for (let i = 0; i < 8; i++) {
      const col = [PAL.b, PAL.v, PAL.r, PAL.w][i % 4];
      const sh = [PAL.B, PAL.V, PAL.R, PAL.W][i % 4];
      rect(c, i * 8, 3, 8, 24, col); rect(c, i * 8 + 6, 3, 2, 24, sh);
    }
    for (const x of [4, 20, 36, 52]) rect(c, x, 3, 2, 2, PAL.l);
    rect(c, 0, 26, 64, 2, PAL.y);
  });

  // Pulley post (14x30): frame 0 rope slack, frame 1 pulled taut
  const pulley = (up: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 2, 29, 10, 1, PAL.z);
    rect(c, ox + 6, 4, 3, 25, PAL.o); rect(c, ox + 8, 4, 1, 25, PAL.O); rect(c, ox + 3, 27, 9, 2, PAL.O);
    rect(c, ox + 3, 1, 9, 5, PAL.O); rect(c, ox + 5, 2, 5, 3, PAL.y); rect(c, ox + 7, 3, 1, 1, PAL.Y);
    rect(c, ox + 4, 6, 1, up ? 6 : 16, PAL.p); rect(c, ox + 3, up ? 12 : 22, 3, 2, PAL.Y);
  };
  sheet("tb_pulley", 14, 30, [pulley(false), pulley(true)]);
}
