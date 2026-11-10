import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

type Paint = (c: CanvasRenderingContext2D, x: number) => void;

/** Props and tiles for Stages 1-4 (and reusable after). Integer rects only. */
export function registerStageTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("noah_shadow")) return; // idempotent
  const still = (key: string, w: number, h: number, paint: Paint) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx, 0);
    t.addCanvas(key, canvas);
  };
  const sheet = (key: string, w: number, h: number, frames: Paint[]) => {
    const { canvas, ctx } = makeCanvas(w * frames.length, h);
    frames.forEach((p, i) => p(ctx, i * w));
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };

  // ---- ground tiles
  still("noah_grass", 16, 16, (c) => { rect(c, 0, 0, 16, 16, PAL.G); rect(c, 2, 3, 2, 1, PAL.g); rect(c, 10, 9, 3, 1, PAL.g); rect(c, 6, 13, 2, 1, PAL.g); rect(c, 12, 2, 1, 2, PAL.g); });
  still("noah_dust", 16, 16, (c) => { rect(c, 0, 0, 16, 16, "#2e2a45"); rect(c, 3, 4, 3, 1, "#3b3560"); rect(c, 10, 10, 2, 1, "#3b3560"); rect(c, 7, 14, 4, 1, "#241f38"); rect(c, 13, 3, 1, 2, "#241f38"); });
  still("noah_path", 16, 16, (c) => { rect(c, 0, 0, 16, 16, PAL.j); rect(c, 3, 3, 2, 1, PAL.P); rect(c, 10, 9, 3, 1, PAL.P); rect(c, 6, 13, 2, 1, PAL.P); });
  // pale planks so the dark-brown cypress blocks stand out
  still("noah_deck", 16, 16, (c) => { rect(c, 0, 0, 16, 16, "#e8cf9f"); rect(c, 0, 7, 16, 1, "#c9a86c"); rect(c, 0, 15, 16, 1, "#c9a86c"); rect(c, 5, 0, 1, 7, "#c9a86c"); rect(c, 11, 8, 1, 7, "#c9a86c"); rect(c, 2, 3, 2, 1, "#f3e1b8"); rect(c, 8, 11, 3, 1, "#f3e1b8"); });
  still("noah_hull", 16, 16, (c) => { rect(c, 0, 0, 16, 16, PAL.O); rect(c, 0, 7, 16, 1, PAL.e); rect(c, 0, 15, 16, 1, PAL.e); rect(c, 4, 0, 1, 7, PAL.o); rect(c, 11, 8, 1, 7, PAL.o); });
  still("noah_fence", 16, 16, (c) => { rect(c, 0, 0, 16, 16, PAL.A); rect(c, 0, 0, 16, 4, PAL.a); rect(c, 0, 8, 16, 1, PAL.I); rect(c, 7, 0, 1, 8, PAL.I); rect(c, 3, 8, 1, 8, PAL.I); rect(c, 11, 8, 1, 8, PAL.I); });
  still("noah_gate", 16, 16, (c) => { rect(c, 0, 0, 16, 16, PAL.O); for (const x of [1, 5, 9, 13]) rect(c, x, 0, 2, 16, PAL.o); rect(c, 0, 4, 16, 2, PAL.u); rect(c, 0, 11, 16, 2, PAL.u); });

  // ---- stage 1
  sheet("noah_shadow", 16, 20, [0, 1].map((f): Paint => (c, x) => {
    rect(c, x + 2, 17, 12, 3, PAL.z);
    rect(c, x + 3, 4, 10, 12, PAL.Z); rect(c, x + 5, 1, 6, 4, PAL.Z); rect(c, x + 4, 14, 3 + f, 3, PAL.Z); rect(c, x + 9, 14, 3 - f, 3, PAL.Z);
    rect(c, x + 5, 5, 6, 4, PAL.K); rect(c, x + 6, 6, 1, 2, PAL.r); rect(c, x + 9, 6, 1, 2, PAL.r); // angry eyes
    rect(c, x + 2 - f, 8, 2, 5, PAL.V); rect(c, x + 12 + f, 8, 2, 5, PAL.V);
  }));
  sheet("noah_pedestal", 16, 24, [false, true].map((lit): Paint => (c, x) => {
    rect(c, x + 1, 22, 14, 2, PAL.z);
    rect(c, x + 2, 12, 12, 10, PAL.a); rect(c, x + 2, 19, 12, 3, PAL.A); rect(c, x + 1, 10, 14, 3, PAL.w); rect(c, x + 1, 12, 14, 1, PAL.W);
    rect(c, x + 7, 15, 2, 4, PAL.A);
    if (lit) { rect(c, x + 6, 3, 4, 7, PAL.f); rect(c, x + 7, 1, 2, 3, PAL.f); rect(c, x + 7, 5, 2, 5, PAL.y); rect(c, x + 7, 8, 2, 2, PAL.l); }
    else { rect(c, x + 6, 7, 4, 3, PAL.I); rect(c, x + 7, 6, 2, 1, PAL.i); }
  }));
  still("noah_wall", 16, 24, (c) => {
    rect(c, 0, 22, 16, 2, PAL.z);
    rect(c, 0, 2, 16, 20, PAL.a); rect(c, 0, 18, 16, 4, PAL.A); rect(c, 0, 0, 16, 3, PAL.w); rect(c, 0, 2, 16, 1, PAL.W);
    rect(c, 0, 9, 16, 1, PAL.A); rect(c, 7, 3, 1, 6, PAL.A); rect(c, 3, 10, 1, 8, PAL.A); rect(c, 11, 10, 1, 8, PAL.A);
    rect(c, 7, 12, 2, 6, PAL.y); rect(c, 5, 14, 6, 2, PAL.y); // small cross: Faith Wall
  });
  still("noah_cypress", 24, 40, (c) => {
    rect(c, 5, 37, 14, 3, PAL.z);
    rect(c, 11, 28, 3, 11, PAL.o);
    rect(c, 10, 2, 4, 6, PAL.H); rect(c, 7, 8, 10, 8, PAL.H); rect(c, 5, 16, 14, 8, PAL.G); rect(c, 3, 24, 18, 6, PAL.G);
    rect(c, 11, 4, 2, 4, PAL.G); rect(c, 9, 10, 3, 3, PAL.g); rect(c, 8, 18, 3, 3, PAL.g); rect(c, 13, 24, 4, 3, PAL.g);
  });

  // ---- stage 2
  still("noah_slot", 16, 16, (c) => { c.globalAlpha = 0.35; rect(c, 0, 0, 16, 16, PAL.y); c.globalAlpha = 1; rect(c, 0, 0, 16, 1, PAL.y); rect(c, 0, 15, 16, 1, PAL.y); rect(c, 0, 0, 1, 16, PAL.y); rect(c, 15, 0, 1, 16, PAL.y); });
  still("noah_joint", 16, 16, (c) => { c.globalAlpha = 0.5; rect(c, 2, 2, 12, 12, PAL.x); c.globalAlpha = 1; rect(c, 2, 2, 12, 1, PAL.k); rect(c, 7, 6, 2, 4, PAL.w); });
  still("noah_sealed", 16, 16, (c) => { rect(c, 2, 5, 12, 6, PAL.e); rect(c, 3, 6, 10, 1, PAL.I); });
  still("noah_pot", 16, 16, (c) => {
    rect(c, 1, 14, 14, 2, PAL.z);
    rect(c, 2, 7, 12, 8, PAL.I); rect(c, 12, 7, 2, 8, PAL.e); rect(c, 1, 6, 14, 2, PAL.i); rect(c, 3, 6, 10, 1, PAL.e);
    rect(c, 5, 1, 2, 4, PAL.f); rect(c, 9, 0, 2, 5, PAL.f); rect(c, 6, 3, 1, 2, PAL.y); rect(c, 10, 3, 1, 2, PAL.y); // hot flames
  });
  sheet("noah_lever", 16, 16, [0, 1].map((f): Paint => (c, x) => {
    rect(c, x + 2, 13, 12, 3, PAL.A); rect(c, x + 3, 12, 10, 1, PAL.a);
    for (let i = 0; i < 8; i++) rect(c, x + (f ? 7 + (i >> 1) : 8 - (i >> 1)), 11 - i, 2, 1, PAL.o); // handle leans left/right
    rect(c, x + (f ? 11 : 4), 2, 3, 3, PAL.r);
  }));

  // ---- stage 3
  sheet("noah_cabin", 32, 32, [PAL.G, PAL.Y, PAL.k].map((roof, i): Paint => (c, x) => {
    rect(c, x + 2, 29, 28, 3, PAL.z);
    rect(c, x + 2, 8, 28, 22, PAL.o); rect(c, x + 2, 24, 28, 6, PAL.O); rect(c, x, 4, 32, 5, roof); rect(c, x + 3, 2, 26, 3, roof);
    rect(c, x + 10, 12, 12, 18, PAL.O); rect(c, x + 11, 13, 10, 17, PAL.e);
    if (i === 0) { rect(c, x + 12, 16, 8, 5, PAL.w); rect(c, x + 18, 15, 3, 3, PAL.i); } // sheep sign: gentle
    if (i === 1) { rect(c, x + 12, 16, 8, 5, PAL.y); rect(c, x + 12, 15, 8, 2, PAL.Y); } // mane: big beasts
    if (i === 2) { rect(c, x + 13, 16, 6, 3, PAL.w); rect(c, x + 11, 15, 3, 2, PAL.W); rect(c, x + 18, 15, 3, 2, PAL.W); } // wings: birds
  }));
  still("noah_knot", 8, 8, (c) => { rect(c, 1, 1, 6, 6, PAL.y); rect(c, 2, 2, 4, 4, PAL.l); });
  still("noah_cry", 8, 12, (c) => { rect(c, 3, 0, 2, 7, PAL.r); rect(c, 3, 9, 2, 2, PAL.r); }); // "!" over a lost animal

  // ---- stage 4
  sheet("noah_leak", 16, 16, [0, 1].map((f): Paint => (c, x) => {
    rect(c, x, 0, 16, 16, PAL.O); rect(c, x + 5, 0, 6, 16, PAL.X); rect(c, x + 6, 0, 4, 16, PAL.x);
    rect(c, x + 7, 2 + f * 6, 2, 3, PAL.w); rect(c, x + 7, 9 - f * 4, 2, 3, PAL.w); rect(c, x + 2, 14, 12, 2, PAL.x);
  }));
  sheet("noah_wnd", 16, 16, [0, 1, 2].map((s): Paint => (c, x) => {
    rect(c, x, 0, 16, 16, PAL.O); rect(c, x + 2, 2, 12, 12, s === 2 ? PAL.l : PAL.I);
    if (s === 2) { rect(c, x + 2, 7, 12, 1, PAL.O); rect(c, x + 7, 2, 1, 12, PAL.O); rect(c, x + 3, 3, 2, 2, PAL.w); } // sealed: pin cross + warm light
    else { rect(c, x + (s ? 8 : 1), 2, 7, 12, PAL.W); rect(c, x + (s ? 8 : 1), 2, 7, 1, PAL.w); } // sash banging open, two frames
  }));
  still("noah_pin", 16, 16, (c) => { rect(c, 3, 13, 10, 2, PAL.z); rect(c, 7, 2, 3, 11, PAL.o); rect(c, 6, 1, 5, 2, PAL.u); rect(c, 7, 3, 1, 9, PAL.y); });
  still("noah_ladle", 16, 16, (c) => { rect(c, 3, 13, 10, 2, PAL.z); rect(c, 7, 1, 2, 8, PAL.o); rect(c, 4, 8, 8, 5, PAL.I); rect(c, 5, 8, 6, 2, PAL.e); rect(c, 6, 7, 1, 1, PAL.f); });
  still("noah_puddle", 20, 12, (c) => { rect(c, 3, 1, 14, 10, PAL.X); rect(c, 1, 3, 18, 6, PAL.X); rect(c, 4, 2, 12, 8, PAL.x); rect(c, 6, 4, 4, 1, PAL.w); rect(c, 12, 7, 3, 1, PAL.w); });
  still("noah_table", 48, 24, (c) => {
    rect(c, 2, 22, 44, 2, PAL.z);
    rect(c, 2, 4, 44, 6, PAL.o); rect(c, 2, 4, 44, 1, PAL.y); rect(c, 2, 10, 44, 2, PAL.O);
    rect(c, 4, 12, 4, 10, PAL.O); rect(c, 40, 12, 4, 10, PAL.O);
  });
  sheet("noah_maindoor", 32, 40, [0, 1].map((open): Paint => (c, x) => {
    rect(c, x, 0, 32, 40, PAL.O); rect(c, x + 3, 3, 26, 37, open ? PAL.y : PAL.o);
    if (!open) { rect(c, x + 15, 3, 2, 37, PAL.O); for (const y of [10, 22, 32]) rect(c, x + 3, y, 26, 2, PAL.u); rect(c, x + 11, 20, 3, 3, PAL.y); rect(c, x + 18, 20, 3, 3, PAL.y); }
    else { rect(c, x + 8, 8, 16, 32, PAL.l); rect(c, x + 12, 12, 8, 28, PAL.w); } // sealed by golden light
  }));
}
