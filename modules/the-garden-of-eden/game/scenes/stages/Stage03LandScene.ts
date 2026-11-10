import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import EventBus from "@/modules/shared/game/EventBus";
import audio from "@/modules/shared/game/audio/AudioManager";

const T = 16;
const COLS = 29;
const ROWS = 14;
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

/**
 * '.' soil  '#' rock  '~' water (slides you on)  'S' start (planted)  'T' seed (must be the last tile planted).
 * Each map was generated from a real solution path (see the sim in the Phase 4 notes), so all three are solvable.
 */
const ISLANDS = [
  { at: [2, 3], rows: ["S....", ".....", "..#..", ".....", "...##"] },
  { at: [10, 3], rows: ["....##", "...~##", "S...##", "......", "..~...", ".....~", "......"] },
  { at: [19, 3], rows: ["........", ".......T", "....~...", "S.......", "..~.####", "~...####", ".....~~.", "........"] },
];
// stone bridges: island k's east exit row -> island k+1's start (same global row)
const BRIDGES = [{ row: 5, cols: [7, 8, 9] }, { row: 6, cols: [16, 17, 18] }];

/** Stage 3: one-stroke terraforming. Every step plants; never step on a bloomed tile. */
export class Stage03LandScene extends BaseGenesisScene {
  private grid: string[][] = [];
  private island: number[][] = []; // island index per cell, -1 none
  private planted: boolean[][] = [];
  private grown = new Map<number, Phaser.GameObjects.Image>();
  private bridgeImgs: Phaser.GameObjects.Image[][] = [];
  private bridgeOpen = [false, false];
  private done = [false, false, false];
  private started = [false, false, false];
  private gx = 0;
  private gy = 0;
  private moving = false;
  private held = -1;
  private heldAt = 0;
  private repeating = false;
  private keys: Phaser.Input.Keyboard.Key[][] = [];
  private stick = { x: 0, y: 0 };
  private vdir = "idle";
  private finished = false;

  constructor() {
    super("Stage03LandScene");
    this.worldWidth = COLS * T;
    this.worldHeight = ROWS * T;
    this.stageKey = "stage_03_dat_lien_thao_moc";
    this.spawn = [ISLANDS[0].at[0] * T + 8, ISLANDS[0].at[1] * T - 1];
  }

  create() {
    this.grown = new Map();
    this.bridgeImgs = [];
    this.bridgeOpen = [false, false];
    this.done = [false, false, false];
    this.started = [false, false, false];
    this.moving = false;
    this.held = -1;
    this.finished = false;
    this.intro = { illustration: "land", speaker: STAGE_TEXT.s3.speaker, lines: STAGE_TEXT.s3.intro.map(tr) };
    super.create();
    (this.player.body as Phaser.Physics.Arcade.Body).enable = false; // grid movement: this stage moves the child by hand
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, "gen_sea").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(" "));
    this.island = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
    this.planted = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    ISLANDS.forEach((isl, k) =>
      isl.rows.forEach((row, ry) =>
        [...row].forEach((ch, rx) => {
          const c = isl.at[0] + rx, r = isl.at[1] + ry;
          this.grid[r][c] = ch;
          this.island[r][c] = k;
          const x = c * T + 8, y = r * T + 8;
          const tex = ch === "#" ? "gen_rock" : ch === "~" ? "gen_slide" : ch === "T" ? "gen_seed" : "gen_soil";
          this.add.image(x, y, tex).setDepth(DEPTH.FLOOR + 0.1);
        })
      )
    );
    BRIDGES.forEach((b, k) => {
      this.bridgeImgs[k] = b.cols.map((c) => {
        this.grid[b.row][c] = "b";
        return this.add.image(c * T + 8, b.row * T + 8, "gen_bridge").setDepth(DEPTH.FLOOR + 0.1).setAlpha(0);
      });
    });

    // keyboard: arrows + WASD; touch: stick / d-pad via the EventBus
    const kb = this.input.keyboard;
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = kb ? [[K.UP, K.W], [K.RIGHT, K.D], [K.DOWN, K.S], [K.LEFT, K.A]].map((codes) => codes.map((k) => kb.addKey(k))) : [];
    const onMove = (d: { x: number; y: number }) => (this.stick = d);
    const onDir = (d: { direction: string }) => (this.vdir = d.direction);
    EventBus.on("input-move", onMove);
    EventBus.on("input-direction", onDir);
    this.events.once("shutdown", () => {
      EventBus.off("input-move", onMove);
      EventBus.off("input-direction", onDir);
    });
  }

  protected onStageStart() {
    const [sc, sr] = this.startOf(0);
    this.gx = sc;
    this.gy = sr;
    this.enterStart(0);
    this.plant(sc, sr, false);
  }

  private startOf(k: number): [number, number] {
    const isl = ISLANDS[k];
    const ry = isl.rows.findIndex((r) => r.includes("S"));
    return [isl.at[0] + isl.rows[ry].indexOf("S"), isl.at[1] + ry];
  }
  private px = (c: number) => c * T + 8;
  private py = (r: number) => r * T - 1;

  private enterStart(k: number) {
    if (this.started[k]) return;
    this.started[k] = true;
    const [c, r] = this.startOf(k);
    this.saveCheckpoint(`isl${k}`, k, this.px(c), this.py(r));
  }

  private kindAt(c: number, r: number) {
    if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return " ";
    const ch = this.grid[r][c];
    if (ch !== "b") return ch;
    const k = BRIDGES.findIndex((b) => b.row === r && b.cols.includes(c));
    return this.bridgeOpen[k] ? "b" : " ";
  }

  private soilOf(k: number) {
    return ISLANDS[k].rows.join("").replace(/[#~]/g, "").length;
  }
  private plantedIn(k: number) {
    let n = 0;
    this.planted.forEach((row, r) => row.forEach((p, c) => p && this.island[r][c] === k && n++));
    return n;
  }

  private plant(c: number, r: number, sound = true) {
    this.planted[r][c] = true;
    const img = this.add.image(c * T + 8, r * T + 8, "gen_grown").setDepth(DEPTH.FLOOR + 0.2).setAlpha(0);
    this.grown.set(r * COLS + c, img);
    this.tweens.add({ targets: img, alpha: 1, duration: 220, ease: "Stepped", easeParams: [3] });
    if (sound) audio.sfx("pickup");
  }

  /** Gentle soft reset of one island (crush or RETRY): all plants gone, child back on the start tile. */
  protected onCheckpointRestore(_id: string, state: unknown) {
    const k = state as number;
    this.tweens.killTweensOf(this.player);
    this.moving = false;
    if (this.done[k]) { // already green: just keep the grid position in step with where the base moved the child
      [this.gx, this.gy] = this.startOf(k);
      return;
    }
    this.planted.forEach((row, r) => row.forEach((p, c) => p && this.island[r][c] === k && (row[c] = false)));
    this.grown.forEach((img, key) => {
      if (this.island[Math.floor(key / COLS)][key % COLS] === k) {
        img.destroy();
        this.grown.delete(key);
      }
    });
    const [sc, sr] = this.startOf(k);
    this.gx = sc;
    this.gy = sr;
    this.player.setPosition(this.px(sc), this.py(sr));
    this.plant(sc, sr, false);
  }

  private readDir() {
    const down = (i: number) => this.keys[i]?.some((k) => k.isDown);
    const names = ["up", "right", "down", "left"];
    for (let i = 0; i < 4; i++) if (down(i) || this.vdir === names[i]) return i;
    if (Math.hypot(this.stick.x, this.stick.y) > 0.55) {
      return Math.abs(this.stick.x) > Math.abs(this.stick.y) ? (this.stick.x > 0 ? 1 : 3) : this.stick.y > 0 ? 2 : 0;
    }
    return -1;
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.dialogueOpen || this.moving || this.finished) return;
    const now = time ?? 0;
    const d = this.readDir();
    if (d < 0) {
      this.held = -1;
      this.repeating = false;
      return;
    }
    // a tap = exactly one tile; holding repeats after a pause
    if (d !== this.held) {
      this.held = d;
      this.repeating = false;
      this.heldAt = now;
      this.step(d);
    } else if (now - this.heldAt > (this.repeating ? 190 : 320)) {
      this.repeating = true;
      this.heldAt = now;
      this.step(d);
    }
  }

  private step(d: number) {
    const route: [number, number][] = [];
    let cx = this.gx, cy = this.gy, crush = false, notReady = false;
    for (;;) {
      const nx = cx + DX[d], ny = cy + DY[d];
      const k = this.kindAt(nx, ny);
      if (k === " " || k === "#") break;
      if (k === "~") { // water: keep sliding
        cx = nx; cy = ny;
        route.push([cx, cy]);
        continue;
      }
      if (k === "b") { // bridge: plain walkable, plants nothing
        cx = nx; cy = ny;
        route.push([cx, cy]);
        break;
      }
      const isl = this.island[ny][nx];
      if (this.planted[ny][nx]) {
        if (!this.done[isl]) { crush = true; route.push([nx, ny]); }
        else { cx = nx; cy = ny; route.push([cx, cy]); }
        break;
      }
      if (k === "T" && this.plantedIn(isl) < this.soilOf(isl) - 1) { notReady = true; break; }
      cx = nx; cy = ny;
      route.push([cx, cy]);
      break;
    }
    if (!route.length) {
      if (notReady) this.talk("Hạt Giống Đại Thụ", ["Hạt giống chưa đến lúc nảy mầm. Hãy phủ xanh mọi ô khác trước, ô này đi cuối cùng nhé!"]);
      return;
    }
    this.moving = true;
    this.walk(route, 0, crush);
  }

  private walk(route: [number, number][], i: number, crush: boolean) {
    if (i >= route.length) {
      this.moving = false;
      this.arrived(crush);
      return;
    }
    const [c, r] = route[i];
    if (crush && i === route.length - 1) { // the bloomed tile: the sapling gets trampled
      this.cameras.main.shake(140, 0.005);
      audio.sfx("wrong");
    }
    this.tweens.add({
      targets: this.player, x: this.px(c), y: this.py(r), duration: 95,
      onComplete: () => {
        this.gx = c;
        this.gy = r;
        const k = this.kindAt(c, r);
        if (!crush && (k === "." || k === "S" || k === "T") && !this.planted[r][c]) this.plant(c, r);
        this.walk(route, i + 1, crush);
      },
    });
  }

  private arrived(crush: boolean) {
    const k = this.island[this.gy][this.gx];
    if (crush) {
      this.talk("Cây non bị dập", ["Ôi, cây non bị dập mất rồi! Hãy gieo lại đảo này, lần này đi cẩn thận hơn nhé."], () => this.resetToCheckpoint());
      return;
    }
    if (k < 0) return; // on a bridge
    if (this.grid[this.gy][this.gx] === "S") this.enterStart(k);
    if (!this.done[k] && this.plantedIn(k) === this.soilOf(k)) this.islandDone(k);
  }

  private islandDone(k: number) {
    this.done[k] = true;
    audio.sfx("bless");
    this.sparkleBurst(this.px(this.gx), this.py(this.gy), 12);
    if (k === 2) {
      const [tc, tr2] = [ISLANDS[2].at[0] + 7, ISLANDS[2].at[1] + 1];
      this.add.image(this.px(tc), (tr2 + 1) * T, "gen_tree_life").setOrigin(0.5, 1).setDepth((tr2 + 1) * T);
      this.finished = true;
      this.time.delayedCall(1400, () => this.finishStage(STAGE_TEXT.s3));
      return;
    }
    this.bridgeOpen[k] = true;
    this.bridgeImgs[k].forEach((img, i) => this.tweens.add({ targets: img, alpha: 1, duration: 300, delay: i * 250 }));
    this.talk("Cuộn Sách Sáng Thế", ["Hòn đảo đã phủ xanh! Một cây cầu đá hiện ra, hãy sang đảo kế tiếp nhé."]);
  }
}
