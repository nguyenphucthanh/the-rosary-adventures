import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerStageTextures } from "@/modules/noahs-ark/game/utils/stageTextures";
import { registerVoyageTextures } from "@/modules/noahs-ark/game/utils/voyageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 240;
const H = 360;
const HOME: [number, number] = [120, 322]; // window of the ark
const SPEED = 85;
const DRAIN = 9; // stamina per second in leg 1
type P = [number, number];

// Landmarks (leg 1), warm rings (leg 1), olive hill (leg 2), fields (leg 3). Gusts patrol a lane: y, x range, px/s.
const LANDMARKS: P[] = [[50, 240], [190, 170], [80, 80]];
const RINGS: P[] = [[120, 275], [140, 205], [120, 125]];
const OLIVE: P = [196, 56];
const FIELDS: P[] = [[50, 255], [190, 225], [60, 140], [180, 85]];
const FOG: P[] = [[70, 210], [165, 285]]; // slow the dove in leg 2
const GUSTS = [
  [],
  [{ y: 250, min: 20, max: 220, sp: 55 }, { y: 180, min: 20, max: 220, sp: -45 }, { y: 110, min: 20, max: 220, sp: 60 }],
  [{ y: 200, min: 20, max: 220, sp: 38 }, { y: 120, min: 20, max: 220, sp: -34 }],
];
const LAND: [number, number, number, number, number][][] = [
  [],
  [[150, 20, 90, 70, 0x6aa84f], [0, 28, 40, 24, 0x6aa84f]],
  [[0, 0, W, 140, 0x6aa84f], [0, 140, 90, 60, 0x6aa84f], [150, 140, 90, 120, 0x6aa84f]],
];

interface Gust { s: Phaser.GameObjects.Sprite; x: number; y: number; min: number; max: number; sp: number }

/** Stage 7: three flights of the dove. Leg 1 scouts landmarks on stamina, leg 2 fetches an olive branch past whirlwinds, leg 3 clears the mist from four fields. */
export class Stage07OliveDoveScene extends BaseNoahScene {
  private dove?: Phaser.GameObjects.Sprite;
  private gusts: Gust[] = [];
  private props: Phaser.GameObjects.GameObject[] = [];
  private fogs: Phaser.GameObjects.Image[] = [];
  private oliveImg?: Phaser.GameObjects.Image;
  private ringImgs: (Phaser.GameObjects.Image | null)[] = [];
  private seen: boolean[] = [];
  private land?: Phaser.GameObjects.Graphics;
  private bar?: Phaser.GameObjects.Graphics;
  private label?: Phaser.GameObjects.Text;
  private leg = 0;
  private stamina = 100;
  private hasOlive = false;
  private running = false;

  constructor() {
    super("Stage07OliveDoveScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_07_nhanh_la_oliu";
    this.spawn = [...HOME];
  }

  create() {
    this.gusts = [];
    this.props = [];
    this.fogs = [];
    this.ringImgs = [];
    this.seen = [];
    this.leg = 0;
    this.running = false;
    this.intro = { illustration: "stage7", speaker: NOAH_TEXT.s7.speaker, lines: NOAH_TEXT.s7.intro.map(tr) };
    super.create();
    this.player.setAlpha(0); // the dove is the player here; this hidden body only anchors the camera
  }

  protected buildWorld() {
    registerStageTextures(this);
    registerVoyageTextures(this);
    this.add.tileSprite(0, 0, W, H, "noah_water").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.land = this.add.graphics().setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfde68a, 0.08).setOrigin(0).setDepth(DEPTH.LIGHT); // dawn tint
    // the ark's top window with Noah
    this.add.image(HOME[0], HOME[1] + 24, "noah_window").setOrigin(0.5, 1).setDepth(HOME[1] + 24);
    this.add.sprite(HOME[0] + 30, HOME[1] + 30, "noah_noah").setOrigin(0.5, 1).setDepth(HOME[1] + 30);
    this.add.tileSprite(0, H - 20, W, 20, "noah_hull").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.dove = this.add.sprite(HOME[0], HOME[1], "noah_dove", 0).setOrigin(0.5, 0.5).setDepth(5000);
    this.bar = this.add.graphics().setDepth(DEPTH.UI);
    this.label = this.add.text(W / 2, 4, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  protected onStageStart() {
    const raven = this.add.sprite(HOME[0], HOME[1] - 6, "noah_raven", 0).setDepth(4000);
    this.tweens.add({ targets: raven, x: 20, y: -10, duration: 3500, ease: "Sine.easeIn", onUpdate: () => raven.setFrame(((this.time.now / 150) | 0) % 2), onComplete: () => raven.destroy() });
    this.talk("Ông Nô-ê", NOAH_TEXT.s7.raven.map(tr), () => this.startLeg(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startLeg(state as number, true);
  }

  private clear() {
    this.props.forEach((o) => o.destroy());
    this.props = [];
    this.gusts = [];
    this.fogs = [];
    this.ringImgs = [];
    this.oliveImg = undefined;
  }

  private startLeg(n: number, quiet = false) {
    this.clear();
    this.leg = n;
    this.stamina = 100;
    this.hasOlive = false;
    this.seen = [];
    this.running = false;
    this.dove?.setPosition(HOME[0], HOME[1]);
    this.land?.clear();
    for (const [x, y, w, h, col] of LAND[n]) this.land?.fillStyle(col, 1).fillRect(x, y, w, h);
    const add = <T extends Phaser.GameObjects.GameObject>(o: T) => (this.props.push(o), o);
    if (n === 0) {
      LANDMARKS.forEach(([x, y]) => add(this.add.image(x, y + 8, "noah_rock").setOrigin(0.5, 1).setDepth(y)));
      this.ringImgs = RINGS.map(([x, y]) => add(this.add.image(x, y, "noah_ring").setDepth(DEPTH.RUG)));
      this.seen = LANDMARKS.map(() => false);
    }
    if (n === 1) {
      this.oliveImg = add(this.add.image(OLIVE[0], OLIVE[1] + 14, "noah_olivetree").setOrigin(0.5, 1).setDepth(OLIVE[1])) as Phaser.GameObjects.Image;
      add(this.add.image(OLIVE[0], OLIVE[1] - 14, "noah_glow_gold").setDepth(OLIVE[1] + 1).setAlpha(0.6));
      FOG.forEach(([x, y]) => add(this.add.image(x, y, "noah_fog").setDepth(DEPTH.FX - 5).setAlpha(0.85)));
    }
    if (n === 2) {
      this.fogs = FIELDS.map(([x, y]) => {
        add(this.add.image(x, y, "noah_field").setDepth(DEPTH.RUG));
        return add(this.add.image(x, y - 2, "noah_mist").setDepth(DEPTH.FX - 5).setAlpha(0.8)) as Phaser.GameObjects.Image;
      });
      this.seen = FIELDS.map(() => false);
    }
    // random lane offset, speed (x0.7-1.4) and direction/start x each attempt
    for (const b of GUSTS[n]) {
      const y = b.y + Phaser.Math.Between(-18, 18);
      const sp = Math.abs(b.sp) * Phaser.Math.FloatBetween(0.7, 1.4) * (Math.random() < 0.5 ? -1 : 1);
      const g = { ...b, y, sp };
      const x = Phaser.Math.Between(g.min, g.max);
      this.gusts.push({ x, s: add(this.add.sprite(x, y, "noah_gust", 0).setDepth(4000)) as Phaser.GameObjects.Sprite, ...g });
    }
    this.saveCheckpoint(`leg${n}`, n, HOME[0], HOME[1]);
    if (quiet) this.running = true; // retry: skip the briefing
    else this.talk("Ông Nô-ê", NOAH_TEXT.s7.legs[n].map(tr), () => (this.running = true));
  }

  private fail() {
    this.running = false;
    audio.sfx("wrong");
    this.cameras.main.shake(150, 0.004);
    this.talk("Chú chim", NOAH_TEXT.s7.back.map(tr), () => this.resetToCheckpoint());
  }

  private home() {
    this.running = false;
    audio.sfx("bless");
    this.sparkleBurst(HOME[0], HOME[1], 8);
    if (this.leg === 2) return this.finishStage(NOAH_TEXT.s7);
    this.time.delayedCall(400, () => this.startLeg(this.leg + 1));
  }

  update(time?: number, delta = 16) {
    void time;
    const dove = this.dove;
    if (!dove) return;
    this.player.setPosition(dove.x, dove.y).setVelocity(0, 0); // camera anchor
    dove.setFrame(((this.time.now / 180) | 0) % 2);
    this.draw();
    if (!this.running || this.introActive || this.dialogueOpen) return;
    const dt = Math.min(delta, 50) / 1000;
    const st = this.readSteer();
    const slow = this.leg === 1 && FOG.some(([x, y]) => Math.abs(dove.x - x) < 24 && Math.abs(dove.y - y) < 14) ? 0.5 : 1;
    dove.x = Phaser.Math.Clamp(dove.x + st.x * SPEED * slow * dt, 8, W - 8);
    dove.y = Phaser.Math.Clamp(dove.y + st.y * SPEED * slow * dt, 8, H - 24);
    if (st.x) dove.setFlipX(st.x < 0);
    dove.setPosition(Math.round(dove.x), Math.round(dove.y));

    for (const g of this.gusts) {
      g.x += g.sp * dt; // float x kept apart: the sprite is rounded, slow gusts would round back and freeze
      if (g.x > g.max || g.x < g.min) { g.sp *= -1; g.x = Phaser.Math.Clamp(g.x, g.min, g.max); }
      g.s.setPosition(Math.round(g.x), g.y).setFrame(((this.time.now / 160) | 0) % 2);
      if (Math.abs(dove.x - g.x) < 12 && Math.abs(dove.y - g.y) < 12) return this.fail();
    }
    const near = (p: P, d = 16) => Math.abs(dove.x - p[0]) < d && Math.abs(dove.y - p[1]) < d;

    if (this.leg === 0) {
      this.stamina -= DRAIN * dt;
      RINGS.forEach((p, i) => {
        const ring = this.ringImgs[i];
        if (ring && near(p, 18)) { this.stamina = 100; audio.sfx("chime"); this.sparkleBurst(p[0], p[1], 6); ring.destroy(); this.ringImgs[i] = null; }
      });
      LANDMARKS.forEach((p, i) => { if (!this.seen[i] && near(p, 20)) { this.seen[i] = true; audio.sfx("pickup"); this.sparkleBurst(p[0], p[1], 6); } });
      if (this.stamina <= 0) return this.fail();
      if (this.seen.every(Boolean) && near(HOME, 20)) this.home();
    }
    if (this.leg === 1) {
      if (!this.hasOlive && near(OLIVE, 24)) {
        this.hasOlive = true;
        audio.sfx("pickup");
        this.sparkleBurst(OLIVE[0], OLIVE[1], 8);
        this.talk("Chú chim", NOAH_TEXT.s7.olive.map(tr));
      }
      if (this.hasOlive && near(HOME, 20)) this.home();
    }
    if (this.leg === 2) {
      FIELDS.forEach((p, i) => {
        if (this.seen[i] || !near(p, 24)) return;
        this.seen[i] = true;
        audio.sfx("chime");
        this.sparkleBurst(p[0], p[1], 6);
        this.tweens.add({ targets: this.fogs[i], alpha: 0, y: p[1] - 12, duration: 600, ease: "Stepped", easeParams: [4] });
      });
      if (this.seen.every(Boolean) && near(HOME, 20)) this.home();
    }
  }

  private draw() {
    const g = this.bar?.clear();
    if (!g) return;
    // pin HUD to the camera's safe area (below the top buttons), not to the map
    const v = this.cameras.main.worldView, top = Math.round(v.y) + this.safeInsetTop();
    g.setPosition(0, top);
    this.label?.setPosition(Math.round(v.centerX), top + 14);
    if (this.leg === 0 && this.running) {
      const w = 80, x = Math.round(this.cameras.main.worldView.centerX - 40), y = 6;
      g.fillStyle(0x0f172a, 1).fillRect(x - 2, y - 2, w + 4, 8);
      g.fillStyle(this.stamina > 40 ? 0xfbbf24 : 0xdc2626, 1).fillRect(x, y, Math.round((w * Math.max(0, this.stamina)) / 100), 4);
    }
    const goal = ["Điểm mốc", "Nhành ô-liu", "Cánh đồng"][this.leg];
    const n = this.leg === 1 ? (this.hasOlive ? 1 : 0) : this.seen.filter(Boolean).length;
    const total = this.leg === 1 ? 1 : this.seen.length || 1;
    this.label?.setText(this.running ? `Lần thả ${this.leg + 1}/3 – ${goal} ${n}/${total}${n === total ? " – Về cửa sổ!" : ""}` : "");
  }
}
