import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const T = 16;
const W = 400; // 25 tiles
const HILL_H = 240; // top half: Đỉnh Đồi Gió
const BAY_Y = 240; // bottom half: Vịnh San Hô Xanh
const BAY_ROWS = 15;
const BAY_COLS = 25;

// ---- bay: a serpentine reef. Walls on rows 0, 3, 6, 9 and 12+, with gaps that alternate right/left.
const GAPS: [number, number, number][] = [[3, 22, 23], [6, 1, 2], [9, 22, 23]]; // row, from col, to col
const THORNS: [number, number][] = [[9, 1], [15, 2], [19, 1], [6, 5], [12, 4], [17, 5], [8, 7], [14, 8], [19, 7], [18, 10], [13, 11]];
const CURRENTS: [number, number, "l" | "r"][] = [[12, 1, "l"], [12, 2, "l"], [13, 1, "l"], [13, 2, "l"], [8, 4, "r"], [9, 4, "r"], [10, 4, "r"], [8, 5, "r"], [9, 5, "r"], [10, 5, "r"], [11, 7, "l"], [12, 7, "l"], [11, 8, "l"], [12, 8, "l"], [14, 10, "r"], [15, 10, "r"], [14, 11, "r"], [15, 11, "r"]];
const GOAL = new Phaser.Geom.Rectangle(T, BAY_Y + 10 * T, 8 * T, 2 * T); // Biển Rộng
const FISH = 6;
const LAG = 6; // trail samples between fish

// ---- hill: five Wind Fans to switch on in order 1..5
const FANS: [number, number][] = [[56, 196], [136, 150], [232, 190], [330, 122], [208, 58]];
const NEST: [number, number] = [28, 214];
const CLIFFS: [number, number, number, number][] = [[96, 196, 48, 16], [176, 112, 64, 16], [272, 144, 16, 64], [108, 76, 48, 16], [16, 112, 16, 64], [300, 40, 64, 16]]; // x, y, w, h
const WIND_MS = 6000;

interface Fish { s: Phaser.GameObjects.Sprite; lost: boolean; immune: number }

/** Stage 5: lead six fish through the reef, then switch on five Wind Fans in order to lift the young birds. */
export class Stage05SeaBirdsScene extends BaseGenesisScene {
  private part: 1 | 2 | 3 = 1;
  private fish: Fish[] = [];
  private trail: { x: number; y: number }[] = [];
  private bay: string[][] = [];
  private toldLost = false;
  // hill
  private fans: Phaser.GameObjects.Sprite[] = [];
  private nextFan = 0;
  private windLeft = 0;
  private birds: Phaser.GameObjects.Sprite[] = [];
  private flock = { x: NEST[0], y: NEST[1] };
  private bar?: Phaser.GameObjects.Graphics;
  private status?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage05SeaBirdsScene");
    this.worldWidth = W;
    this.worldHeight = HILL_H + BAY_ROWS * T;
    this.stageKey = "stage_05_ca_bien_chim_troi";
    this.spawn = [2 * T + 8, BAY_Y + T + 8 - 9];
  }

  create() {
    this.part = 1;
    this.fish = [];
    this.fans = [];
    this.birds = [];
    this.nextFan = 0;
    this.toldLost = false;
    this.windLeft = 0;
    this.flock = { x: NEST[0], y: NEST[1] };
    this.intro = { illustration: "seabirds", speaker: STAGE_TEXT.s5.speaker, lines: STAGE_TEXT.s5.intro.map(tr) };
    super.create();
  }

  private label(x: number, y: number, s: string) {
    return this.add.text(x, y, s, { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 2, y: 1 }, resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);
  }

  protected buildWorld() {
    registerStageTextures(this);
    if (!this.anims.exists("gen_fish")) this.anims.create({ key: "gen_fish", frames: this.anims.generateFrameNumbers("gen_fish", { start: 0, end: 1 }), frameRate: 6, repeat: -1 });
    if (!this.anims.exists("gen_bird")) this.anims.create({ key: "gen_bird", frames: this.anims.generateFrameNumbers("gen_bird", { start: 0, end: 1 }), frameRate: 5, repeat: -1 });
    if (!this.anims.exists("gen_fan")) this.anims.create({ key: "gen_fan", frames: this.anims.generateFrameNumbers("gen_fan", { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    this.buildBay();
    this.buildHill();
  }

  private buildBay() {
    this.add.tileSprite(0, BAY_Y, W, BAY_ROWS * T, "gen_deep").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.bay = Array.from({ length: BAY_ROWS }, (_, r) => Array.from({ length: BAY_COLS }, (_, c) => (r === 0 || c === 0 || c === BAY_COLS - 1 || r >= 12 || [3, 6, 9].includes(r) ? "#" : ".")));
    GAPS.forEach(([r, a, b]) => { for (let c = a; c <= b; c++) this.bay[r][c] = "."; });
    THORNS.forEach(([c, r]) => (this.bay[r][c] = "^"));
    CURRENTS.forEach(([c, r, d]) => (this.bay[r][c] = d));

    this.add.rectangle(GOAL.x, GOAL.y, GOAL.width, GOAL.height, 0xfde68a, 0.22).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.text(GOAL.centerX, GOAL.y - 6, "BIỂN RỘNG", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);

    for (let r = 0; r < BAY_ROWS; r++) {
      for (let c = 0; c < BAY_COLS; c++) {
        const ch = this.bay[r][c], x = c * T + 8, y = BAY_Y + r * T + 8;
        if (ch === "#") this.add.image(x, y, "gen_coral").setDepth(DEPTH.RUG);
        else if (ch === "^") this.add.image(x, y, "gen_thorn").setDepth(DEPTH.RUG);
        else if (ch === "l" || ch === "r") this.add.image(x, y, "gen_current").setAngle(ch === "l" ? 180 : 0).setAlpha(0.55).setDepth(DEPTH.RUG);
      }
      // merge wall runs into single colliders
      for (let c = 0; c < BAY_COLS; ) {
        if (this.bay[r][c] !== "#") { c++; continue; }
        const a = c;
        while (c < BAY_COLS && this.bay[r][c] === "#") c++;
        this.block(((a + c) / 2) * T, BAY_Y + r * T + 8, (c - a) * T, T);
      }
    }
  }

  private buildHill() {
    this.add.tileSprite(0, 0, W, HILL_H, "gen_floor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 10, 0xf8fafc, 0.55).setOrigin(0).setDepth(DEPTH.RUG); // cloud edge to the north
    CLIFFS.forEach(([x, y, w, h]) => {
      this.add.tileSprite(x, y, w, h, "gen_cliff").setOrigin(0).setDepth(y + h);
      this.block(x + w / 2, y + h / 2, w, h);
    });
    FANS.forEach(([x, y], i) => {
      this.fans.push(this.add.sprite(x, y, "gen_fan", 0).setOrigin(0.5, 1).setDepth(y));
      this.add.image(x, y - 8, "gen_glow_gold").setAlpha(0.3).setDepth(y - 1);
      this.block(x, y - 4, 10, 8);
      this.label(x, y - 20, String(i + 1));
    });
    this.birds = Array.from({ length: 5 }, (_, i) => this.add.sprite(NEST[0], NEST[1], "gen_bird").setDepth(DEPTH.FX - 1).play("gen_bird").setData("i", i));
    this.bar = this.add.graphics().setDepth(DEPTH.FX);
    this.status = this.label(NEST[0], NEST[1] - 30, "").setVisible(false);
    this.interactables = FANS.map(([x, y], i) => ({ x, y: y - 6, r: 26, label: `[A] Quạt Gió ${i + 1}`, active: () => this.part === 2, act: () => this.switchFan(i) }));
    this.add.image(NEST[0], NEST[1] + 6, "gen_tree_s").setOrigin(0.5, 1).setDepth(NEST[1] + 6); // the nest tree
  }

  protected onStageStart() {
    this.part = 1;
    this.initFish();
    this.saveCheckpoint("bay", null, this.player.x, this.player.y);
  }

  protected onCheckpointRestore(id: string) {
    if (id === "bay") {
      this.fish.forEach((f) => f.s.destroy());
      this.initFish();
    } else {
      this.resetWind("");
    }
  }

  // ---------------------------------------------------------------- part 1: fish

  private initFish() {
    this.fish = [];
    this.trail = Array.from({ length: FISH * LAG + 8 }, () => ({ x: this.player.x, y: this.player.y + 9 }));
    for (let i = 0; i < FISH; i++) {
      this.fish.push({ s: this.add.sprite(this.player.x, this.player.y + 9, "gen_fish").setDepth(DEPTH.FX - 2).play("gen_fish"), lost: false, immune: 0 });
    }
  }

  private updateFish() {
    const px = this.player.x, py = this.player.y + 9;
    const last = this.trail[this.trail.length - 1];
    if (Math.hypot(px - last.x, py - last.y) >= 3) {
      this.trail.push({ x: px, y: py });
      if (this.trail.length > 600) this.trail.shift();
    }
    const near = (p: { x: number; y: number }, x: number, y: number, d: number) => Math.hypot(p.x - x, p.y - y) < d;
    let slot = 0;
    for (const f of this.fish) {
      if (f.lost) {
        if (near(f.s, px, py, 16)) { // the child fetches a lost fish
          f.lost = false;
          f.immune = this.time.now + 1500;
          f.s.clearTint();
          audio.sfx("pickup");
        }
        continue;
      }
      slot++;
      const p = this.trail[Math.max(0, this.trail.length - 1 - slot * LAG)];
      f.s.setFlipX(p.x < f.s.x).setPosition(Math.round(p.x), Math.round(p.y));
      if (this.time.now > f.immune && THORNS.some(([c, r]) => near(p, c * T + 8, BAY_Y + r * T + 8, 10))) {
        f.lost = true;
        f.s.setTint(0xff7777);
        audio.sfx("wrong");
        if (!this.toldLost) {
          this.toldLost = true;
          this.time.delayedCall(300, () => this.talk("Chúa Thánh Thần", ["Một chú cá chạm gai và bị lạc rồi! Hãy quay lại đón bạn nhỏ nhé, rồi tránh xa rặng gai hơn."]));
        }
      }
    }
    // currents push the child back along the arrows
    const c = Math.floor(this.player.x / T), r = Math.floor((py - BAY_Y) / T);
    const ch = this.bay[r]?.[c];
    if (ch === "l" || ch === "r") (this.player.body as Phaser.Physics.Arcade.Body).velocity.x += ch === "l" ? -70 : 70;
    // home: everyone in the Open Sea
    if (this.fish.every((f) => !f.lost && GOAL.contains(f.s.x, f.s.y)) && GOAL.contains(px, py)) this.toHill();
  }

  private toHill() {
    this.part = 2;
    audio.sfx("bless");
    this.fish.forEach((f) => this.tweens.add({ targets: f.s, y: f.s.y - 10, alpha: 0, duration: 800, ease: "Stepped", easeParams: [6], onComplete: () => f.s.destroy() }));
    this.fish = [];
    this.time.delayedCall(900, () =>
      this.talk("Chúa Thánh Thần", STAGE_TEXT.s5.hill.map(tr), () => {
        const cam = this.cameras.main;
        cam.fadeOut(500, 0, 0, 0);
        cam.once("camerafadeoutcomplete", () => {
          this.player.setPosition(NEST[0] + 18, NEST[1] - 9);
          this.saveCheckpoint("hill", null, NEST[0] + 18, NEST[1] - 9);
          cam.fadeIn(500, 0, 0, 0);
        });
      })
    );
  }

  // ---------------------------------------------------------------- part 2: wind fans

  private switchFan(i: number) {
    if (i < this.nextFan) return;
    if (i > this.nextFan) {
      this.resetWind("Chưa đến lượt! Gió đổi chiều rồi, hãy bắt đầu lại từ quạt số 1 nhé.");
      return;
    }
    this.fans[i].play("gen_fan");
    audio.sfx("whoosh");
    this.sparkleBurst(FANS[i][0], FANS[i][1] - 10, 6);
    this.nextFan++;
    this.tweens.add({ targets: this.flock, x: FANS[i][0], y: FANS[i][1] - 34, duration: 1300, ease: "Sine.easeInOut" });
    if (this.nextFan === FANS.length) {
      this.part = 3;
      this.bar?.clear();
      this.time.delayedCall(1500, () => {
        audio.sfx("bless");
        this.tweens.add({ targets: this.flock, x: 200, y: -30, duration: 2200, ease: "Sine.easeIn", onComplete: () => this.finishStage(STAGE_TEXT.s5) });
      });
      return;
    }
    this.windLeft = WIND_MS;
  }

  private resetWind(msg: string) {
    this.nextFan = 0;
    this.windLeft = 0;
    this.fans.forEach((f) => f.stop().setFrame(0));
    this.tweens.killTweensOf(this.flock);
    this.tweens.add({ targets: this.flock, x: NEST[0], y: NEST[1], duration: 900, ease: "Sine.easeInOut" });
    this.bar?.clear();
    audio.sfx("wrong");
    if (msg) this.talk("Chúa Thánh Thần", [msg]);
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.dialogueOpen) return;
    if (this.part === 1 && this.fish.length) this.updateFish();
    if (this.part >= 2) {
      this.birds.forEach((b, i) => b.setPosition(Math.round(this.flock.x + ((i % 3) - 1) * 12 + (i > 2 ? 6 : 0)), Math.round(this.flock.y + (i % 2) * 8 + Math.sin(((time ?? 0) + i * 200) / 250) * 2)));
    }
    if (this.part === 2 && this.windLeft > 0) {
      this.windLeft -= delta;
      const w = Math.max(0, Math.round((this.windLeft / WIND_MS) * 32));
      this.bar?.clear().fillStyle(0x0f172a, 0.8).fillRect(Math.round(this.flock.x) - 17, Math.round(this.flock.y) - 22, 34, 5).fillStyle(0xfde68a, 1).fillRect(Math.round(this.flock.x) - 16, Math.round(this.flock.y) - 21, w, 3);
      if (this.windLeft <= 0) this.resetWind("Gió đã đổi chiều, đàn chim bay về tổ. Hãy bật quạt nhanh hơn nhé!");
    }
  }
}
