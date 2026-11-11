import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerRephidimTextures } from "@/modules/moses-the-exodus/game/utils/rephidimTextures";
import { registerTabernacleTextures } from "@/modules/moses-the-exodus/game/utils/tabernacleTextures";
import { STAGE13, tr, type L } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

// Tall map (top -> bottom): Holy of Holies, Holy Place, courtyard. Looking "up" is looking west, so NORTH is on the right.
// Interactive things sit y >= 100 and y <= 510 (the bottom 90px hide behind the mobile controls).
const W = 352;
const H = 600;
const HOH_Y0 = 70, PART_Y = 176, HP_Y1 = 326, COURT_Y1 = 540;
const START: [number, number] = [176, 486];
const MOSES_P: [number, number] = [176, 352];

type Step = 0 | 1 | 2 | 3;
interface Item { id: string; tex: string; x: number; y: number; img: Phaser.GameObjects.Image; here: boolean; hint: L; placed: boolean }
interface Slot { item: string; x: number; y: number; step: Step; tex: string; frame: number; w: number; obj?: Phaser.GameObjects.Sprite; glow: Phaser.GameObjects.Image; placed: boolean }

const LAMP_ORDER = [3, 4, 2, 5, 1, 6, 0]; // middle lamp first, then outward: right, left, right, left...

/** Stage 13: raise the courtyard, place the holy things by compass, light the 7 lamps, rest the Ark, hang the gate curtain, then the Glory descends. */
export class Stage13TabernacleGloryScene extends BaseExodusScene {
  private step: Step = 0;
  private busy = true;
  private items: Item[] = [];
  private slots: Slot[] = [];
  private carry: Item | null = null;
  private carryImg?: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;
  private pulleys: { spr: Phaser.GameObjects.Sprite; panels: Phaser.GameObjects.TileSprite[]; done: boolean }[] = [];
  private laverFull = false;
  private washed = false;
  private lamps: Phaser.GameObjects.Sprite[] = [];
  private lampStep = 0;
  private lampOn: boolean[] = [];
  private lampsDone = false;
  private menorahSpr?: Phaser.GameObjects.Sprite;
  private incenseBurnt = false;
  private arkState = 0;
  private arkSpr?: Phaser.GameObjects.Sprite;
  private veilHung = false;
  private gateHung = false;
  private doors: Partial<Record<"court" | "holy", { set: (v: boolean) => void }>> = {};

  constructor() {
    super("Stage13TabernacleGloryScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_13_nha_tam_giao_uoc";
    this.spawn = START;
  }

  create() {
    this.step = 0; this.busy = true;
    this.items = []; this.slots = []; this.pulleys = []; this.lamps = []; this.lampOn = [];
    this.carry = null;
    this.laverFull = this.washed = this.lampsDone = this.incenseBurnt = this.veilHung = this.gateHung = false;
    this.lampStep = 0; this.arkState = 0;
    this.doors = {};
    this.intro = { illustration: "13", speaker: STAGE13.speaker, lines: STAGE13.intro.map(tr) };
    super.create();
  }

  // ---------------------------------------------------------------- world

  protected buildWorld() {
    registerSiteTextures(this);
    registerRephidimTextures(this);
    registerTabernacleTextures(this);
    const D = DEPTH.RUG;

    // outside the sanctuary (dark night sky of the camp), then the floors
    this.add.rectangle(0, 0, W, H, 0x0b1020).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(80, HOH_Y0, 192, PART_Y - HOH_Y0, "tb_gold_floor").setOrigin(0).setDepth(D);
    this.add.tileSprite(64, PART_Y, 224, HP_Y1 - PART_Y, "tb_rug").setOrigin(0).setDepth(D);
    this.add.tileSprite(32, HP_Y1, W - 64, COURT_Y1 - HP_Y1, "exodus_sand").setOrigin(0).setDepth(D);
    this.add.rectangle(144, HP_Y1 + 6, 64, COURT_Y1 - HP_Y1 - 6, 0xfef3c7, 0.22).setOrigin(0).setDepth(D + 1); // processional path
    // gold-board walls
    const wall = (x: number, y: number, w: number, h: number) => this.add.tileSprite(x, y, w, h, "tb_wall").setOrigin(0).setDepth(D + 2);
    wall(64, 40, 224, 30); wall(64, 56, 16, PART_Y - 56); wall(272, 56, 16, PART_Y - 56);
    wall(48, PART_Y, 16, HP_Y1 - PART_Y + 6); wall(288, PART_Y, 16, HP_Y1 - PART_Y + 6);
    wall(64, PART_Y - 6, 80, 12); wall(208, PART_Y - 6, 80, 12);
    wall(48, HP_Y1, 96, 12); wall(208, HP_Y1, 96, 12);
    this.add.rectangle(80, HOH_Y0, 192, PART_Y - HOH_Y0, 0xfef3c7, 0.12).setOrigin(0).setDepth(D + 1); // light from above

    // colliders
    this.block(W / 2, 35, W, 70);
    this.block(40, 88, 80, 176); this.block(W - 40, 88, 80, 176);
    this.block(32, 254, 64, 156); this.block(W - 32, 254, 64, 156);
    this.block(104, PART_Y, 80, 12); this.block(248, PART_Y, 80, 12);
    this.block(72, HP_Y1 + 6, 144, 12); this.block(280, HP_Y1 + 6, 144, 12);
    this.block(16, (HP_Y1 + H) / 2, 32, H - HP_Y1); this.block(W - 16, (HP_Y1 + H) / 2, 32, H - HP_Y1);
    this.block(W / 2, (COURT_Y1 + H) / 2, W, H - COURT_Y1);
    this.doors.holy = this.door(W / 2, PART_Y, 64, 12, "tb_rug", true);
    this.doors.court = this.door(W / 2, HP_Y1 + 6, 64, 12, "tb_fence", true);

    // light sources + dressing: sanctuary torches (flames), compass, Bezalel and Oholiab, the people
    let flick = 0;
    const torches = [[64, 200], [288, 200], [64, 300], [288, 300], [90, 100], [262, 100]].map(([x, y]) => this.add.sprite(x, y, "rp_flame", 0).setOrigin(0.5, 1).setDepth(y + 1));
    this.time.addEvent({ delay: 250, loop: true, callback: () => { flick ^= 1; torches.forEach((s) => s.setFrame(flick)); } });
    const lab = (x: number, y: number, t: string) => this.add.text(x, y, t, { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5).setDepth(D + 3);
    lab(268, 214, tr(STAGE13.compassN)); lab(84, 214, tr(STAGE13.compassS));
    this.add.image(120, 372, "exodus_hur").setOrigin(0.5, 1).setDepth(372);
    this.add.image(232, 372, "exodus_slave").setOrigin(0.5, 1).setDepth(372);
    for (const [x, y, k] of [[60, 470, "exodus_girl1"], [300, 470, "exodus_girl3"], [52, 506, "exodus_girl5"], [304, 504, "exodus_girl2"], [50, 430, "exodus_girl4"]] as [number, number, string][]) this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y);
    this.add.image(MOSES_P[0], MOSES_P[1], "exodus_moses_leader").setOrigin(0.5, 1).setDepth(MOSES_P[1]);
    this.add.image(MOSES_P[0] + 36, MOSES_P[1] - 4, "exodus_aaron").setOrigin(0.5, 1).setDepth(MOSES_P[1] - 4);

    // --- courtyard: pulleys raise three linen fences
    const panel = (x: number, y: number, w: number, h: number) => this.add.tileSprite(x, y, w, h, "tb_fence").setOrigin(0).setDepth(D + 2).setAlpha(0);
    const defs: [number, number, Phaser.GameObjects.TileSprite[]][] = [
      [62, 392, [panel(32, HP_Y1 + 12, 16, 184)]],
      [292, 424, [panel(W - 48, HP_Y1 + 12, 16, 184)]],
      [100, 508, [panel(48, COURT_Y1 - 16, 96, 16), panel(208, COURT_Y1 - 16, 96, 16)]],
    ];
    defs.forEach(([x, y, panels], i) => {
      const spr = this.add.sprite(x, y, "tb_pulley", 0).setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 4, 10, 8);
      this.pulleys.push({ spr, panels, done: false });
      this.interactables.push({ x, y: y - 6, r: 22, label: () => tr(STAGE13.pulley), active: () => this.step === 0 && !this.busy && !this.carry && !this.pulleys[i].done, act: () => this.pull(i) });
    });

    // --- courtyard: items, slots, spring
    this.makeItem("altar", "tb_altar", 84, 452, STAGE13.courtHints.altar);
    this.makeItem("laver", "tb_laver", 244, 466, STAGE13.courtHints.laver);
    this.makeSlot("altar", 176, 442, 0, "tb_altar", 0, 28);
    this.makeSlot("laver", 176, 392, 0, "tb_laver", 0, 20);
    this.add.image(280, 372, "tb_spring").setOrigin(0.5, 1).setDepth(372);
    this.block(280, 366, 26, 10);
    this.interactables.push({ x: 280, y: 380, r: 24, label: () => tr(STAGE13.springHint), active: () => this.step === 0 && !this.busy && !this.carry && !this.laverFull, act: () => this.draw() });
    const laver = this.slots[1];
    this.interactables.push({ x: laver.x, y: laver.y - 6, r: 24, label: () => tr(STAGE13.pourHint), active: () => this.step === 0 && !this.busy && this.carry?.id === "bucket" && laver.placed && !this.laverFull, act: () => this.pour() });
    this.interactables.push({ x: laver.x, y: laver.y - 6, r: 24, label: () => tr(STAGE13.washHint), active: () => this.step === 0 && !this.busy && !this.carry && this.courtReady() && !this.washed, act: () => this.wash() });

    // --- holy place: items, slots, 7 lamps
    this.makeItem("table", "tb_table", 96, 306, STAGE13.tableHint);
    this.makeItem("menorah", "tb_menorah", 176, 306, STAGE13.lampHint);
    this.makeItem("incense", "tb_incense", 256, 306, STAGE13.incenseHint);
    this.makeSlot("table", 236, 250, 1, "tb_table", 0, 20);
    this.makeSlot("menorah", 116, 250, 1, "tb_menorah", 0, 30);
    this.makeSlot("incense", 176, 218, 1, "tb_incense", 0, 26);
    for (let i = 0; i < 7; i++) {
      const x = 128 + i * 16, y = 288;
      this.lamps.push(this.add.sprite(x, y, "tb_lamp", 0).setOrigin(0.5, 1).setDepth(y).setVisible(false));
      this.interactables.push({ x, y: y - 6, r: 9, label: () => tr(STAGE13.lamp), active: () => this.step === 1 && !this.busy && !this.carry && this.slots[3].placed && !this.lampsDone && !this.lampOn[i], act: () => this.lightLamp(i) });
    }
    const inc = this.slots[4];
    this.interactables.push({ x: inc.x, y: inc.y - 6, r: 24, label: () => tr(STAGE13.incense), active: () => this.step === 1 && !this.busy && !this.carry && inc.placed && !this.incenseBurnt, act: () => this.burn() });

    // --- holy of holies: ark chest, tablets, mercy seat, veil
    this.arkSpr = this.add.sprite(176, 140, "tb_ark_base").setOrigin(0.5, 1).setDepth(140);
    this.block(176, 134, 30, 10);
    this.makeItem("tablets", "exodus_tablets", 112, 158, STAGE13.holiesIntro[0]);
    this.makeItem("seat", "tb_mercy", 240, 158, STAGE13.holiesIntro[0]);
    this.interactables.push({ x: 176, y: 148, r: 30, label: () => tr(STAGE13.ark), active: () => this.step === 2 && !this.busy && !!this.carry, act: () => this.arkPlace() });
    this.interactables.push({ x: 176, y: 90, r: 26, label: () => tr(STAGE13.veil), active: () => this.step === 2 && !this.busy && !this.carry && !this.veilHung, act: () => this.hangVeil() });
    this.interactables.push({ x: 176, y: 508, r: 28, label: () => tr(STAGE13.gate), active: () => this.step === 3 && !this.busy && !this.gateHung, act: () => this.hangGate() });
    this.interactables.push({ x: MOSES_P[0], y: MOSES_P[1] - 4, r: 24, label: tx("[A] Môi-sê", "[A] Moses"), active: () => !this.busy && !this.carry, act: () => this.remind() });

    this.carryImg = this.add.image(0, 0, "tb_altar").setDepth(DEPTH.FX).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, align: "center", resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
    this.time.addEvent({ delay: 220, loop: true, callback: () => { if (this.lampsDone) this.menorahSpr?.setFrame(1 + (Math.floor(this.time.now / 220) % 2)); } });
  }

  // ---------------------------------------------------------------- item + slot helpers

  private makeItem(id: string, tex: string, x: number, y: number, hint: L) {
    const img = this.pickup(x, y, tex);
    const it: Item = { id, tex, x, y, img, here: true, hint, placed: false };
    this.items.push(it);
    const zone: Step = ["altar", "laver"].includes(id) ? 0 : ["table", "menorah", "incense"].includes(id) ? 1 : 2;
    this.interactables.push({ x, y: y - 6, r: 22, label: () => tr(STAGE13.pickItem), active: () => this.step === zone && !this.busy && !this.carry && it.here, act: () => this.take(it) });
  }

  private showItem(it: Item, v: boolean) {
    it.img.setVisible(v);
    (it.img.getData("glow") as Phaser.GameObjects.Image)?.setVisible(v);
    it.here = v;
  }

  private makeSlot(item: string, x: number, y: number, step: Step, tex: string, frame: number, w: number) {
    const glow = this.add.image(x, y - 4, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.35);
    this.tweens.add({ targets: glow, alpha: 0.6, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    const slot: Slot = { item, x, y, step, tex, frame, w, glow, placed: false };
    this.slots.push(slot);
    this.interactables.push({ x, y: y - 4, r: 24, label: () => tr(STAGE13.slotHere), active: () => this.step === slot.step && !this.busy && !!this.carry && this.carry.id !== "tablets" && this.carry.id !== "seat" && !slot.placed, act: () => this.place(slot) });
  }

  private take(it: Item) {
    this.carry = it;
    this.showItem(it, false);
    this.carryImg?.setTexture(it.tex, 0);
    audio.sfx("pickup");
  }

  private dropCarry() {
    if (this.carry && this.carry.id !== "bucket") this.showItem(this.carry, true);
    this.carry = null;
  }

  private place(slot: Slot) {
    const it = this.carry;
    if (!it) return;
    if (it.id !== slot.item) {
      audio.sfx("wrong");
      const hint = it.hint;
      this.dropCarry();
      this.busy = true;
      this.talk(STAGE13.speaker, [...STAGE13.wrongSpot.map(tr), tr(hint)], () => { this.busy = false; });
      return;
    }
    slot.placed = true; it.placed = true;
    this.carry = null;
    slot.glow.setVisible(false);
    slot.obj = this.add.sprite(slot.x, slot.y, slot.tex, slot.frame).setOrigin(0.5, 1).setDepth(slot.y);
    this.block(slot.x, slot.y - 5, slot.w, 10);
    if (slot.item === "altar") slot.obj.setFrame(1);
    if (slot.item === "menorah") { this.menorahSpr = slot.obj; this.lamps.forEach((l) => l.setVisible(true)); }
    audio.sfx("chime");
    this.sparkleBurst(slot.x, slot.y - 14, 8);
    if (slot.item === "menorah") { this.busy = true; this.time.delayedCall(500, () => this.talk(STAGE13.speaker, STAGE13.lampsIntro.map(tr), () => { this.busy = false; })); }
    this.checkProgress();
  }

  private toast(x: number, y: number, msg: string, color = "#fecaca") {
    const t = this.add.text(Math.round(x), Math.round(y), msg, { fontFamily: "Dearpix, monospace", fontSize: "10px", color, backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.UI);
    const v = this.cameras.main.worldView;
    t.setX(Math.round(Phaser.Math.Clamp(x, v.x + t.width / 2 + 4, v.right - t.width / 2 - 4)));
    this.tweens.add({ targets: t, y: t.y - 6, alpha: 0, duration: 1500, delay: 300, onComplete: () => t.destroy() });
  }

  // ---------------------------------------------------------------- flow

  protected onStageStart() {
    this.talk(STAGE13.speaker, STAGE13.start.map(tr), () => {
      this.busy = false;
      this.saveCheckpoint("court", null, START[0], START[1]);
    });
  }

  protected onCheckpointRestore() {
    this.dropCarry(); // the held item goes back to where it lay
    this.busy = false;
  }

  private remind() {
    const lines: L[] = this.step === 0 ? STAGE13.start : this.step === 1 ? [STAGE13.holyIntro[0], ...(this.slots[3].placed && !this.lampsDone ? STAGE13.lampsIntro : [])] : this.step === 2 ? STAGE13.holiesIntro : STAGE13.holiesDone;
    this.busy = true;
    this.talk(STAGE13.speaker, lines.map(tr), () => { this.busy = false; });
  }

  private checkProgress() {
    if (this.step === 0 && this.slots[0].placed && this.slots[1].placed) { /* wait for water + fences, shown by HUD */ }
    if (this.step === 1 && this.slots.slice(2, 5).every((s) => s.placed) && this.lampsDone && this.incenseBurnt) this.finishHoly();
  }

  // courtyard
  private pull(i: number) {
    const p = this.pulleys[i];
    p.done = true;
    p.spr.setFrame(1);
    audio.sfx("pickup");
    p.panels.forEach((pn) => {
      pn.setAlpha(0).setY(pn.y + 10);
      this.tweens.add({ targets: pn, alpha: 1, y: pn.y - 10, duration: 700, ease: "Stepped", easeParams: [5] });
    });
    this.sparkleBurst(p.spr.x, p.spr.y - 20, 6);
  }

  private draw() {
    if (!this.slots[1].placed) { this.toast(280, 354, tr(STAGE13.laverFirst), "#fde68a"); audio.sfx("wrong"); return; }
    this.carry = { id: "bucket", tex: "site_bucket", x: 0, y: 0, img: undefined as unknown as Phaser.GameObjects.Image, here: false, hint: STAGE13.courtHints.laver, placed: false };
    this.carryImg?.setTexture("site_bucket");
    audio.sfx("pickup");
  }

  private pour() {
    this.carry = null;
    this.laverFull = true;
    this.slots[1].obj?.setFrame(1);
    audio.sfx("bless");
    this.sparkleBurst(this.slots[1].x, this.slots[1].y - 12, 8);
  }

  private courtReady() {
    return this.pulleys.every((p) => p.done) && this.slots[0].placed && this.slots[1].placed && this.laverFull;
  }

  private wash() {
    this.washed = true;
    audio.sfx("splash");
    this.cameras.main.flash(300, 200, 240, 255);
    this.busy = true;
    this.doors.court?.set(false);
    this.talk(STAGE13.speaker, STAGE13.courtDone.map(tr), () => {
      this.step = 1;
      this.busy = true;
      this.saveCheckpoint("holy", null, W / 2, 346);
      this.talk(STAGE13.speaker, STAGE13.holyIntro.map(tr), () => { this.busy = false; });
    });
  }

  // holy place
  private lightLamp(i: number) {
    if (i === LAMP_ORDER[this.lampStep]) {
      this.lamps[i].setFrame(1);
      this.lampOn[i] = true;
      this.lampStep++;
      audio.sfx("pickup");
      if (this.lampStep >= 7) {
        this.lampsDone = true;
        audio.sfx("bless");
        this.cameras.main.flash(400, 255, 244, 200);
        this.lamps.forEach((l) => l.setVisible(false));
        this.menorahSpr?.setFrame(1);
        this.checkProgress();
      }
      return;
    }
    this.lampStep = 0;
    this.lampOn = [];
    this.lamps.forEach((l) => l.setFrame(0));
    audio.sfx("wrong");
    this.toast(this.lamps[i].x, this.lamps[i].y - 18, tr(STAGE13.lampWrong), "#fecaca");
  }

  private burn() {
    if (!this.lampsDone) { audio.sfx("wrong"); this.toast(176, 200, tr(STAGE13.incenseFirst), "#fde68a"); return; }
    this.incenseBurnt = true;
    this.slots[4].obj?.setFrame(1);
    audio.sfx("bless");
    this.checkProgress();
  }

  private finishHoly() {
    this.busy = true;
    this.time.delayedCall(500, () => this.talk(STAGE13.speaker, STAGE13.holyDone.map(tr), () => {
      this.doors.holy?.set(false);
      this.step = 2;
      this.saveCheckpoint("holies", null, W / 2, PART_Y + 22);
      this.talk(STAGE13.speaker, STAGE13.holiesIntro.map(tr), () => { this.busy = false; });
    }));
  }

  // holy of holies
  private arkPlace() {
    const it = this.carry;
    if (!it) return;
    if (it.id === "tablets" && this.arkState === 0) {
      this.arkState = 1;
      this.carry = null;
      it.placed = true;
      audio.sfx("chime");
      this.sparkleBurst(176, 126, 10);
      return;
    }
    if (it.id === "seat" && this.arkState === 1) {
      this.arkState = 2;
      this.carry = null;
      it.placed = true;
      this.arkSpr?.setTexture("exodus_ark");
      audio.sfx("bless");
      this.cameras.main.flash(400, 255, 244, 200);
      this.sparkleBurst(176, 124, 12);
      return;
    }
    audio.sfx("wrong");
    this.dropCarry();
    this.busy = true;
    this.talk(STAGE13.speaker, [tr(STAGE13.arkFirst)], () => { this.busy = false; });
  }

  private hangVeil() {
    if (this.arkState < 2) { audio.sfx("wrong"); this.toast(176, 78, tr(STAGE13.veilFirst), "#fde68a"); return; }
    this.veilHung = true;
    this.add.image(176, 72, "tb_veil").setOrigin(0.5, 1).setDepth(DEPTH.WALL - 1);
    audio.sfx("chime");
    this.busy = true;
    this.time.delayedCall(400, () => this.talk(STAGE13.speaker, STAGE13.holiesDone.map(tr), () => {
      this.step = 3;
      this.saveCheckpoint("gate", null, W / 2, 478);
      this.busy = false;
    }));
  }

  // gate + glory
  private hangGate() {
    this.gateHung = true;
    this.busy = true;
    this.add.image(176, COURT_Y1, "tb_gate").setOrigin(0.5, 1).setDepth(COURT_Y1 + 1);
    audio.sfx("shofar");
    this.glory();
  }

  private glory() {
    // the cloud: stepped white banks drop from the sky over the tent; golden light floods the Tabernacle
    const cam = this.cameras.main;
    cam.stopFollow();
    cam.pan(176, 190, 1400, "Sine.easeInOut");
    const banks: Phaser.GameObjects.Rectangle[] = [];
    const BANKS: [number, number, number, number, number, number][] = [
      [40, 4, 272, 20, 0xffffff, 0.9], [48, 20, 256, 30, 0xf8fafc, 0.9], [56, 40, 240, 28, 0xe2e8f0, 0.9], [64, 62, 224, 24, 0xcbd5e1, 0.9],
      [56, 100, 240, 30, 0xf8fafc, 0.55], [64, 150, 224, 30, 0xe2e8f0, 0.5], [72, 206, 208, 26, 0xf8fafc, 0.45], [56, 262, 240, 28, 0xe2e8f0, 0.4],
    ];
    for (const [x, y, w, h, c] of BANKS) banks.push(this.add.rectangle(x, y - 90, w, h, c).setOrigin(0).setDepth(DEPTH.FX - 50).setAlpha(0));
    const light = this.add.rectangle(48, 40, 256, 300, 0xfde68a).setOrigin(0).setDepth(DEPTH.FX - 60).setAlpha(0);
    banks.forEach((b, i) => this.tweens.add({ targets: b, y: b.y + 90, alpha: BANKS[i][5], duration: 2400, delay: i * 200, ease: "Stepped", easeParams: [8] }));
    this.tweens.add({ targets: light, alpha: 0.45, duration: 2400, ease: "Stepped", easeParams: [6] });
    this.time.delayedCall(1600, () => { audio.sfx("bless"); this.cameras.main.flash(900, 255, 244, 200); this.sparkleBurst(176, 130, 16); this.sparkleBurst(176, 240, 16); });
    this.time.delayedCall(3200, () => this.talk(tx("Vinh Quang Chúa", "The Glory of the Lord"), STAGE13.glory.map(tr), () => this.won()));
  }

  private won() {
    audio.sfx("complete");
    this.completeStage();
    this.talk(tx("Ấn Dấu thứ 13", "Seal 13"), STAGE13.outro.map(tr), () =>
      this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE13.lesson)], () => this.bridge(0)));
  }

  /** Narrative bridge to the Promised Land: a tinted full-map card with the people of the scene, one dialogue each. */
  private bridge(i: number) {
    if (i >= STAGE13.bridge.length) { this.goToNextStage(); return; }
    const b = STAGE13.bridge[i];
    const cam = this.cameras.main;
    const v = cam.worldView;
    const tints = [0x7c2d12, 0x365314, 0xfde68a, 0x0369a1];
    const cards: Phaser.GameObjects.GameObject[] = [];
    cards.push(this.add.rectangle(0, 0, W, H, tints[i] ?? 0x0f172a, 0.82).setOrigin(0).setDepth(DEPTH.FX + 10));
    const cx = Math.round(v.centerX), cy = Math.round(v.y + v.height * 0.36);
    const spr = (k: string, dx: number, dy = 0) => cards.push(this.add.image(cx + dx, cy + dy, k).setOrigin(0.5, 1).setDepth(DEPTH.FX + 11));
    if (i === 0) { spr("exodus_pillar_cloud", -40, 8); spr("exodus_pillar_fire", 40, 8); spr("exodus_ark", 0, 0); }
    else if (i === 1) { spr("exodus_moses_leader", 0, 0); }
    else if (i === 2) { spr("exodus_moses_leader", -16, 0); spr("exodus_joshua", 16, 0); spr("exodus_staff", 0, -12); }
    else { spr("exodus_joshua", -30, 0); spr("exodus_ark", 8, 0); spr("exodus_aaron", 44, 0); }
    this.talk(b.speaker, b.lines.map(tr), () => {
      cards.forEach((o) => o.destroy());
      this.bridge(i + 1);
    });
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const view = this.cameras.main.worldView;
    const p = this.player;
    let hud = "";
    if (this.step === 0) hud = `${tr(STAGE13.stepHud[0])} ${this.pulleys.filter((q) => q.done).length + (this.slots[0].placed ? 1 : 0) + (this.slots[1].placed ? 1 : 0) + (this.laverFull ? 1 : 0)}/6`;
    else if (this.step === 1) hud = `${tr(STAGE13.stepHud[1])} ${this.slots.slice(2, 5).filter((s) => s.placed).length + (this.lampsDone ? 1 : 0) + (this.incenseBurnt ? 1 : 0)}/5`;
    else if (this.step === 2) hud = `${tr(STAGE13.stepHud[2])} ${(this.arkState > 0 ? 1 : 0) + (this.arkState > 1 ? 1 : 0) + (this.veilHung ? 1 : 0)}/3`;
    else hud = `${tr(STAGE13.stepHud[3])} ${this.gateHung ? 1 : 0}/1`;
    if (this.step === 1 && this.slots[3].placed && !this.lampsDone) hud += `\n${tr(STAGE13.lampsHud)} ${this.lampStep}/7`;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(this.gateHung ? "" : hud).setVisible(!this.gateHung);
    this.carryImg?.setVisible(!!this.carry).setPosition(Math.round(p.x), Math.round(p.y - (this.carry?.id === "bucket" ? 26 : 32))).setDepth(p.y + 17);
  }
}
