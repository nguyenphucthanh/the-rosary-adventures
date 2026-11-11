import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerRephidimTextures } from "@/modules/moses-the-exodus/game/utils/rephidimTextures";
import { STAGE10, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 352;
const H = 300;
const X0 = 24, X1 = 328, Y0 = 72, Y1 = 268;
const START: [number, number] = [150, 220];

// Phase 1: rock
const ROCK: [number, number] = [88, 138];
const VEIN_X = [76, 88, 100];
const VEIN_SEQ = [0, 1, 2, 1];
const VEIN_MS = 750;
const HITS_NEEDED = 3;

// Phase 2: hill
const MOUND: [number, number] = [240, 206];
const AARON_P: [number, number] = [212, 200];
const HUR_P: [number, number] = [268, 200];
const MOSES_P: [number, number] = [240, 190];
const HILL_SECONDS = 60;
const ARM_DRAIN = 2.4; // % per second per arm
const FLAME_GAIN = 40;
const GUST_EVERY = [5000, 7500];
const STONE_EVERY = 20000;
const STONE_GRACE = 12000; // ms Moses can sit without his stone before he slips
const SPOTS: [number, number][] = [[52, 238], [100, 252], [148, 236], [60, 204], [120, 204], [196, 244], [300, 238], [310, 212], [160, 190]];

type Phase = "wait" | "rock" | "hill" | "done";
type Item = "flame" | "stone" | null;
interface Spot { x: number; y: number; item: Item; img: Phaser.GameObjects.Sprite; glow: Phaser.GameObjects.Image }

/** Stage 10: strike the Horeb rock on the centre vein 3 times in a row, then hold up Moses' hands (two arm bars) until sunset. */
export class Stage10RephidimHandsScene extends BaseExodusScene {
  private phase: Phase = "wait";
  private hits = 0;
  private veinT = 0;
  private veinIdx = 0;
  private veins: Phaser.GameObjects.Rectangle[] = [];
  private pips: Phaser.GameObjects.Rectangle[] = [];
  private rockImg?: Phaser.GameObjects.Sprite;
  private pond: Phaser.GameObjects.Rectangle[] = [];
  private spots: Spot[] = [];
  private carry: Item = null;
  private carryImg?: Phaser.GameObjects.Image;
  private arms = [100, 100];
  private pressure = 40;
  private elapsed = 0;
  private gustT = 0;
  private stoneT = 0;
  private gustSide = -1;
  private gustLeft = 0;
  private stoneOk = true;
  private stoneGone = 0;
  private moses?: Phaser.GameObjects.Image;
  private aaron?: Phaser.GameObjects.Image;
  private hur?: Phaser.GameObjects.Image;
  private seatStone?: Phaser.GameObjects.Image;
  private hands: Phaser.GameObjects.Image[] = [];
  private barBg: Phaser.GameObjects.Rectangle[] = [];
  private barFill: Phaser.GameObjects.Rectangle[] = [];
  private barTick: Phaser.GameObjects.Rectangle[] = [];
  private joshua?: Phaser.GameObjects.Image;
  private foes: Phaser.GameObjects.Image[] = [];
  private sun?: Phaser.GameObjects.Rectangle;
  private dusk?: Phaser.GameObjects.Rectangle;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage10RephidimHandsScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_10_dap_da_va_doi_tay";
    this.spawn = START;
  }

  create() {
    this.phase = "wait";
    this.hits = 0;
    this.veinT = 0;
    this.veinIdx = 0;
    this.veins = []; this.pips = []; this.pond = []; this.spots = [];
    this.hands = []; this.barBg = []; this.barFill = []; this.barTick = []; this.foes = [];
    this.carry = null;
    this.arms = [100, 100];
    this.pressure = 40;
    this.elapsed = 0;
    this.gustT = 0; this.stoneT = 0; this.gustSide = -1; this.gustLeft = 0;
    this.stoneOk = true;
    this.intro = { illustration: "10", speaker: STAGE10.speaker, lines: STAGE10.intro.map(tr) };
    super.create();
  }

  // ---------------------------------------------------------------- world

  protected buildWorld() {
    registerSiteTextures(this);
    registerRephidimTextures(this);

    // sand floor, sky + valley strip + sun, dusk overlay
    this.add.tileSprite(0, 0, W, H, "exodus_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 44, 0x7dd3fc).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.sun = this.add.rectangle(300, 14, 14, 14, 0xfef08a).setDepth(DEPTH.FLOOR + 1);
    this.add.tileSprite(0, 44, W, 28, "site_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, Y0 - 4, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfff1c9, 0.06).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.dusk = this.add.rectangle(0, 0, W, H, 0xf97316, 0).setOrigin(0).setDepth(DEPTH.FX - 80);
    this.block(W / 2, Y0 / 2, W, Y0);
    this.block(W / 2, (Y1 + H) / 2, W, H - Y1);
    this.block(X0 / 2, H / 2, X0, H);
    this.block((X1 + W) / 2, H / 2, W - X1, H);

    // dust path from the rock to the hill + decor
    this.add.rectangle(X0 + 8, 168, X1 - X0 - 16, 8, 0xd6b98c, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    for (const [x, y, k] of [[40, 262, "site_rock"], [326, 262, "site_shrub"], [40, 100, "site_shrub"], [150, 112, "site_jar"], [180, 126, "site_pot"], [320, 124, "site_rock"], [200, 262, "site_shrub"]] as [number, number, string][]) this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y);

    // Horeb rock + three veins + hit pips + pond
    this.rockImg = this.add.sprite(ROCK[0], ROCK[1], "rp_rock", 0).setOrigin(0.5, 1).setDepth(ROCK[1]);
    this.block(ROCK[0], ROCK[1] - 6, 44, 12);
    VEIN_X.forEach((x) => this.veins.push(this.add.rectangle(x, 112, 6, 14, 0x475569).setDepth(ROCK[1] + 1)));
    this.add.rectangle(88, 104, 12, 2, 0xffffff).setDepth(ROCK[1] + 2);
    this.add.rectangle(88, 120, 12, 2, 0xffffff).setDepth(ROCK[1] + 2);
    this.add.rectangle(82, 112, 2, 18, 0xffffff).setDepth(ROCK[1] + 2);
    this.add.rectangle(94, 112, 2, 18, 0xffffff).setDepth(ROCK[1] + 2);
    for (let i = 0; i < HITS_NEEDED; i++) this.pips.push(this.add.rectangle(76 + i * 12, 92, 8, 4, 0x475569).setDepth(DEPTH.FX - 60));
    for (let i = 0; i < 3; i++) this.pond.push(this.add.rectangle(88, 142 + i * 6, 40 + i * 20, 6, i % 2 ? 0x0369a1 : 0x38bdf8).setOrigin(0.5, 0).setDepth(DEPTH.RUG + 1).setVisible(false));
    for (const x of [48, 128]) this.add.image(x, 190, x < 90 ? "exodus_slave" : "exodus_bully").setOrigin(0.5, 1).setDepth(190);

    // Moses, Aaron, Hur on the hill; mound; seat stone
    this.add.image(MOUND[0], MOUND[1], "rp_mound").setOrigin(0.5, 1).setDepth(MOUND[1] - 20);
    this.block(MOUND[0], MOUND[1] - 4, 92, 10);
    this.seatStone = this.add.image(MOSES_P[0], MOSES_P[1] + 2, "exodus_stone").setOrigin(0.5, 1).setDepth(MOSES_P[1] - 1);
    this.moses = this.add.image(130, 160, "exodus_moses_leader").setOrigin(0.5, 1).setDepth(160);
    this.aaron = this.add.image(AARON_P[0], AARON_P[1], "exodus_aaron").setOrigin(0.5, 1).setDepth(AARON_P[1]).setVisible(false);
    this.hur = this.add.image(HUR_P[0], HUR_P[1], "exodus_hur").setOrigin(0.5, 1).setDepth(HUR_P[1]).setVisible(false);
    this.seatStone.setVisible(false);
    for (const dx of [-13, 13]) this.hands.push(this.add.image(MOSES_P[0] + dx, MOSES_P[1] - 4, "rp_hand").setDepth(MOSES_P[1] + 3).setVisible(false));
    [AARON_P[0], HUR_P[0]].forEach((x) => {
      this.barBg.push(this.add.rectangle(x, 160, 26, 6, 0x0f172a, 0.85).setDepth(DEPTH.UI - 5).setVisible(false));
      this.barFill.push(this.add.rectangle(x - 12, 160, 24, 4, 0x22c55e).setOrigin(0, 0.5).setDepth(DEPTH.UI - 4).setVisible(false));
      this.barTick.push(this.add.rectangle(x, 160, 1, 6, 0xffffff).setDepth(DEPTH.UI - 3).setVisible(false));
    });

    // valley battle (top strip): Joshua vs Amalek
    this.joshua = this.add.image(150, 70, "exodus_joshua").setOrigin(0.5, 1).setDepth(70).setVisible(false);
    for (const dx of [0, 14]) this.foes.push(this.add.image(180 + dx, 70 - dx / 7, "exodus_guard").setOrigin(0.5, 1).setDepth(70).setVisible(false));

    // prayer flame / stone spots
    SPOTS.forEach(([x, y]) => {
      const glow = this.add.image(x, y - 6, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.6).setVisible(false);
      const img = this.add.sprite(x, y, "rp_flame", 0).setOrigin(0.5, 1).setDepth(y).setVisible(false);
      this.tweens.add({ targets: glow, alpha: 0.95, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.spots.push({ x, y, item: null, img, glow });
    });
    let flick = 0;
    this.time.addEvent({ delay: 220, loop: true, callback: () => { flick ^= 1; this.spots.forEach((s) => s.item === "flame" && s.img.setFrame(flick)); } });

    // interactables
    const cx = (x: number, y: number, r: number, label: () => string, active: () => boolean, act: () => void) => this.interactables.push({ x, y, r, label, active, act });
    cx(ROCK[0], ROCK[1] + 6, 40, () => tr(STAGE10.rock), () => this.phase === "rock", () => this.strike());
    cx(AARON_P[0], AARON_P[1] + 8, 24, () => tr(STAGE10.aaron), () => this.phase === "hill", () => this.giveArm(0));
    cx(HUR_P[0], HUR_P[1] + 8, 24, () => tr(STAGE10.hur), () => this.phase === "hill", () => this.giveArm(1));
    cx(MOSES_P[0], MOSES_P[1] + 16, 20, () => tr(STAGE10.mosesSeat), () => this.phase === "hill" && this.carry === "stone", () => this.setStone());
    SPOTS.forEach((_, i) => cx(SPOTS[i][0], SPOTS[i][1], 20, () => tr(this.spots[i]?.item === "stone" ? STAGE10.stone : STAGE10.flame), () => this.phase === "hill" && !!this.spots[i]?.item, () => this.pick(i)));

    this.carryImg = this.add.image(0, 0, "rp_flame", 0).setDepth(DEPTH.FX).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  // ---------------------------------------------------------------- phase 1: rock

  protected onStageStart() {
    this.phase = "wait";
    this.talk(STAGE10.speaker, STAGE10.start.map(tr), () => this.startRock());
  }

  protected onCheckpointRestore(id: string) {
    if (id === "hill") this.startHill(false);
    else this.startRock();
  }

  private startRock() {
    this.hits = 0;
    this.veinT = 0;
    this.veinIdx = 0;
    this.phase = "rock";
    this.saveCheckpoint("rock", null, START[0], START[1]);
    this.player.setPosition(START[0], START[1]);
    this.rockImg?.setFrame(0);
    this.moses?.setPosition(130, 160).setDepth(160);
    this.refreshPips();
  }

  private refreshPips() {
    this.pips.forEach((p, i) => p.setFillStyle(i < this.hits ? 0xfde68a : 0x475569));
  }

  private strike() {
    this.swingStaff();
    if (VEIN_SEQ[this.veinIdx] === 1) {
      this.hits++;
      audio.sfx("pickup");
      this.refreshPips();
      this.toast(ROCK[0], 86, tr(STAGE10.hit), "#bbf7d0");
      this.sparkleBurst(ROCK[0], 112, 6);
      if (this.hits >= HITS_NEEDED) this.crack();
    } else {
      this.hits = 0;
      audio.sfx("wrong");
      this.refreshPips();
      this.toast(ROCK[0], 86, tr(STAGE10.miss));
    }
  }

  private crack() {
    this.phase = "wait";
    this.veins.forEach((v) => v.setFillStyle(0x38bdf8));
    this.rockImg?.setFrame(1);
    this.cameras.main.shake(200, 0.004);
    audio.sfx("bless");
    this.pond.forEach((p, i) => this.time.delayedCall(300 + i * 350, () => p.setVisible(true)));
    this.time.delayedCall(1700, () => this.talk(STAGE10.speaker, [tr(STAGE10.springOk), ...STAGE10.hillIntro.map(tr)], () => this.startHill(true)));
  }

  // ---------------------------------------------------------------- phase 2: hands

  private startHill(first: boolean) {
    void first;
    this.arms = [100, 100];
    this.pressure = 40;
    this.elapsed = 0;
    this.gustT = 3000;
    this.stoneT = 0;
    this.gustLeft = 0;
    this.stoneOk = true;
    this.stoneGone = 0;
    this.carry = null;
    this.spots.forEach((s) => this.setSpot(s, null));
    this.player.setPosition(START[0], START[1]);
    this.saveCheckpoint("hill", null, START[0], START[1]);
    this.moses?.setPosition(MOSES_P[0], MOSES_P[1]).setDepth(MOSES_P[1]);
    [this.aaron, this.hur, this.seatStone, ...this.hands, this.joshua, ...this.foes, ...this.barBg, ...this.barFill, ...this.barTick].forEach((o) => o?.setVisible(true));
    this.dusk?.setAlpha(0);
    this.sun?.setY(14);
    this.phase = "hill";
    this.spawnItem("flame"); this.spawnItem("flame");
  }

  private setSpot(s: Spot, item: Item) {
    s.item = item;
    s.img.setVisible(!!item);
    s.glow.setVisible(!!item);
    if (item === "flame") s.img.setTexture("rp_flame", 0).setOrigin(0.5, 1);
    if (item === "stone") s.img.setTexture("exodus_stone").setOrigin(0.5, 1);
  }

  private spawnItem(kind: Exclude<Item, null>) {
    const free = this.spots.filter((s) => !s.item);
    if (!free.length) return;
    this.setSpot(Phaser.Utils.Array.GetRandom(free), kind);
  }

  private pick(i: number) {
    const s = this.spots[i];
    if (!s?.item) return;
    const held = this.carry; // swap: put what we hold down on this spot, take what lies here
    this.carry = s.item;
    this.setSpot(s, held);
    audio.sfx("pickup");
  }

  private giveArm(side: 0 | 1) {
    const p = side === 0 ? AARON_P : HUR_P;
    if (this.carry !== "flame") {
      audio.sfx("wrong");
      this.toast(p[0], p[1] - 40, tr(STAGE10.needFlame));
      return;
    }
    this.carry = null;
    this.arms[side] = Math.min(100, this.arms[side] + FLAME_GAIN);
    audio.sfx("chime");
    this.sparkleBurst(p[0], p[1] - 16, 8);
  }

  private setStone() {
    this.carry = null;
    this.stoneOk = true;
    this.seatStone?.setVisible(true);
    audio.sfx("bless");
    this.sparkleBurst(MOSES_P[0], MOSES_P[1] - 6, 8);
  }

  private toast(x: number, y: number, msg: string, color = "#fecaca") {
    const t = this.add.text(Math.round(x), Math.round(y), msg, { fontFamily: "Dearpix, monospace", fontSize: "10px", color, backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.UI);
    this.tweens.add({ targets: t, y: t.y - 6, alpha: 0, duration: 1500, delay: 300, onComplete: () => t.destroy() });
  }

  private windStreak(side: number) {
    const y = 150 + Math.floor(Math.random() * 3) * 30;
    for (let i = 0; i < 3; i++) {
      const s = this.add.rectangle(side === 0 ? 150 : 330, y + i * 6, 18, 2, 0xffffff, 0.7).setDepth(DEPTH.FX);
      this.tweens.add({ targets: s, x: side === 0 ? 250 : 230, alpha: 0, duration: 900, delay: i * 120, ease: "Stepped", easeParams: [6], onComplete: () => s.destroy() });
    }
  }

  private fail() {
    this.phase = "wait";
    audio.sfx("wrong");
    this.talk(STAGE10.speaker, [tr(STAGE10.failHill)], () => this.startHill(false));
  }

  private failStone() {
    this.phase = "wait";
    audio.sfx("wrong");
    this.talk(STAGE10.speaker, [tr(STAGE10.failStone)], () => this.startHill(false));
  }

  private won() {
    this.phase = "done";
    audio.sfx("complete");
    this.cameras.main.flash(500, 255, 244, 200);
    this.completeStage();
    this.time.delayedCall(900, () =>
      this.talk("Ấn Dấu thứ 10", STAGE10.outro.map(tr), () =>
        this.talk("Suy niệm", [tr(STAGE10.lesson)], () =>
          this.talk("Rê-phi-đim", STAGE10.cutscene.map(tr), () => this.goToNextStage()))));
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const view = this.cameras.main.worldView;
    const p = this.player;
    let hud = "";
    if (this.phase === "rock") hud = `${tr(STAGE10.hit)} ${this.hits}/${HITS_NEEDED}`;
    else if (this.phase === "hill") hud = `${tr(STAGE10.time)}: ${Math.max(0, Math.ceil(HILL_SECONDS - this.elapsed / 1000))}s  ·  ${tr(STAGE10.left)} ${Math.round(this.arms[0])}%  ·  ${tr(STAGE10.right)} ${Math.round(this.arms[1])}%`;
    if (this.phase === "hill" && !this.stoneOk) hud += `  ·  ${tr(STAGE10.stoneWarn)} ${Math.max(0, Math.ceil((STONE_GRACE - this.stoneGone) / 1000))}s`;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(hud);
    this.carryImg?.setVisible(!!this.carry).setPosition(Math.round(p.x), Math.round(p.y - 30)).setDepth(p.y + 17);
    if (this.carry) this.carryImg?.setTexture(this.carry === "flame" ? "rp_flame" : "exodus_stone", this.carry === "flame" ? 0 : undefined);

    p.speedScale = 1;
    if (this.introActive || this.dialogueOpen) return;
    if (this.phase === "rock") this.updateRock(delta);
    else if (this.phase === "hill") this.updateHill(delta);
  }

  private updateRock(delta: number) {
    this.veinT += delta;
    if (this.veinT >= VEIN_MS) { this.veinT = 0; this.veinIdx = (this.veinIdx + 1) % VEIN_SEQ.length; }
    const lit = VEIN_SEQ[this.veinIdx];
    this.veins.forEach((v, i) => v.setFillStyle(i === lit ? 0xfde68a : 0x475569));
  }

  private updateHill(delta: number) {
    const dt = delta / 1000;
    this.elapsed += delta;
    this.gustT -= delta;
    this.stoneT += delta;
    if (this.gustT <= 0) {
      this.gustT = Phaser.Math.Between(GUST_EVERY[0], GUST_EVERY[1]);
      this.gustSide = Math.random() < 0.5 ? 0 : 1;
      this.gustLeft = 1200;
      this.windStreak(this.gustSide);
      this.toast(this.gustSide === 0 ? AARON_P[0] : HUR_P[0], 150, tr(STAGE10.gust), "#e0f2fe");
    }
    if (this.stoneOk && this.stoneT >= STONE_EVERY) {
      this.stoneT = 0;
      this.stoneOk = false;
      this.stoneGone = 0;
      this.seatStone?.setVisible(false);
      this.toast(MOSES_P[0], 150, tr(STAGE10.stoneLost), "#fecaca");
      this.spawnItem("stone");
    }
    if (!this.stoneOk) {
      this.stoneGone += delta;
      if (this.stoneGone >= STONE_GRACE) { this.failStone(); return; }
    }
    const mult = this.stoneOk ? 1 : 1.8;
    for (let i = 0; i < 2; i++) {
      let d = ARM_DRAIN * mult;
      if (this.gustLeft > 0 && this.gustSide === i) d += 10;
      this.arms[i] = Math.max(0, this.arms[i] - d * dt);
    }
    if (this.gustLeft > 0) this.gustLeft -= delta;
    // a prayer flame every ~4.5s while fewer than 3 are lit
    if (Math.floor(this.elapsed / 4500) > Math.floor((this.elapsed - delta) / 4500) && this.spots.filter((s) => s.item === "flame").length < 3) this.spawnItem("flame");

    // hands, bars
    this.hands.forEach((h, i) => h.setY(Math.round(MOSES_P[1] - 4 - (this.arms[i] / 100) * 26)));
    this.barFill.forEach((b, i) => {
      const a = this.arms[i];
      b.setSize(Math.max(1, Math.round((a / 100) * 24)), 4).setFillStyle(a >= 50 ? 0x22c55e : a >= 25 ? 0xfacc15 : 0xef4444);
    });
    this.barTick.forEach((t, i) => t.setX(i === 0 ? AARON_P[0] : HUR_P[0]));

    // Joshua's line: pushed back when either arm is under 50%, advances otherwise
    const weak = Math.min(this.arms[0], this.arms[1]);
    this.pressure = Phaser.Math.Clamp(this.pressure + (weak >= 50 ? 3 : -((50 - weak) / 50) * 14 - 2) * dt, 0, 100);
    const lineX = Math.round(70 + (this.pressure / 100) * 190);
    this.joshua?.setX(lineX - 14);
    this.foes.forEach((f, i) => f.setX(lineX + 8 + i * 14));
    if (this.pressure <= 0) { this.fail(); return; }

    // sunset
    const k = Math.min(1, this.elapsed / (HILL_SECONDS * 1000));
    this.sun?.setY(Math.round(14 + k * 30));
    this.dusk?.setAlpha(k * 0.3);
    if (this.elapsed >= HILL_SECONDS * 1000) this.won();
  }
}
