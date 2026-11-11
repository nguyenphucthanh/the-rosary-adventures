import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerPassoverTextures } from "@/modules/moses-the-exodus/game/utils/passoverTextures";
import { STAGE6, tr } from "@/modules/moses-the-exodus/data/dialogues";
import { PAL } from "@/modules/shared/game/utils/pixelArt";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 352;
const H = 300;
const START: [number, number] = [176, 178];
// walkable village rect
const X0 = 24, X1 = 328, Y0 = 72, Y1 = 268;
const TOP_FOOT = 116, BOT_FOOT = 252; // house foot y
const HOUSE_X = [52, 112, 172, 232, 292];
const HOME = 7; // bottom row, middle house: the child's own home
const TIME_MS = 85000;
const TURNS = 3, KNEADS = 5, KNEAD_WINDOW = 8000, CHARGES = 2;
const BOWL: [number, number] = [176, 206];
const RED = Phaser.Display.Color.HexStringToColor(PAL.r).color;

type Phase = "wait" | "prep" | "mark" | "done";
interface House { x: number; foot: number; marked: boolean; parts: Phaser.GameObjects.Rectangle[] }

/** Stage 6: prepare the Passover meal, then mark ten doors with the lamb's blood before midnight. */
export class Stage06PassoverNightScene extends BaseExodusScene {
  private phase: Phase = "wait";
  private houses: House[] = [];
  private turns = 0;
  private kneads = 0;
  private kneadStart = 0;
  private herbs = false;
  private gear = [false, false, false];
  private blood = 0;
  private timeLeft = TIME_MS;
  private gusts: { rect: Phaser.GameObjects.Rectangle; off: number }[] = [];
  private gustToldAt = 0;
  private table?: Phaser.GameObjects.Image;
  private roast?: Phaser.GameObjects.Sprite;
  private dough?: Phaser.GameObjects.Sprite;
  private herbsImg?: Phaser.GameObjects.Image;
  private hyssop?: Phaser.GameObjects.Image;
  private moon?: Phaser.GameObjects.Rectangle[];
  private glows: Record<string, Phaser.GameObjects.Image> = {};
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage06PassoverNightScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_06_dem_le_vuot_qua";
    this.spawn = START;
  }

  create() {
    this.phase = "wait";
    this.houses = [];
    this.gusts = [];
    this.glows = {};
    this.turns = this.kneads = this.kneadStart = this.blood = this.gustToldAt = 0;
    this.herbs = false;
    this.gear = [false, false, false];
    this.timeLeft = TIME_MS;
    this.intro = { illustration: "6", speaker: STAGE6.speaker, lines: STAGE6.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerSiteTextures(this);
    registerPassoverTextures(this);

    // ground, night sky with a moon, wall, dirt lanes
    this.add.tileSprite(0, 0, W, H, "exodus_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 44, 0x0b1020).setOrigin(0).setDepth(DEPTH.FLOOR);
    for (let i = 0; i < 16; i++) this.add.image(10 + ((i * 47) % (W - 20)), 5 + ((i * 13) % 30), "sparkle").setDepth(DEPTH.FLOOR + 1).setAlpha(0.5);
    this.moon = [
      this.add.rectangle(0, 0, 10, 10, 0xfef3c7).setDepth(DEPTH.FLOOR + 2),
      this.add.rectangle(0, 0, 14, 6, 0xfef3c7).setDepth(DEPTH.FLOOR + 2),
      this.add.rectangle(0, 0, 6, 14, 0xfef3c7).setDepth(DEPTH.FLOOR + 2),
    ];
    this.placeMoon(0);
    this.add.tileSprite(0, 44, W, Y0 - 44, "site_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, Y0 - 4, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.tileSprite(X0, TOP_FOOT + 2, X1 - X0, 28, "site_dirt").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(X0, BOT_FOOT + 2, X1 - X0, 14, "site_dirt").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(104, 130, 144, 6, "site_dirt").setOrigin(0).setDepth(DEPTH.RUG); // kitchen yard, a lighter patch
    this.add.rectangle(0, 0, W, H, 0x0b1020, 0.25).setOrigin(0).setDepth(DEPTH.LIGHT); // night

    // village edges
    this.block(W / 2, Y0 / 2, W, Y0);
    this.block(W / 2, (Y1 + H) / 2, W, H - Y1);
    this.block(X0 / 2, H / 2, X0, H);
    this.block((X1 + W) / 2, H / 2, W - X1, H);

    // ten houses: top row 0-4, bottom row 5-9
    HOUSE_X.forEach((x, i) => this.addHouse(x, TOP_FOOT, i));
    HOUSE_X.forEach((x, i) => this.addHouse(x, BOT_FOOT, 5 + i));

    // kitchen
    this.roast = this.add.sprite(88, 166, "pv_roast", 0).setOrigin(0.5, 1).setDepth(166);
    this.block(88, 162, 24, 8);
    if (!this.anims.exists("pv_roast")) this.anims.create({ key: "pv_roast", frames: this.anims.generateFrameNumbers("pv_roast", { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    this.roast.play("pv_roast");
    this.dough = this.add.sprite(264, 166, "pv_dough", 0).setOrigin(0.5, 1).setDepth(166);
    this.block(264, 162, 24, 8);
    this.herbsImg = this.add.image(96, 214, "pv_herbs").setOrigin(0.5, 1).setDepth(214);
    this.table = this.add.image(176, 160, "pv_table", 0).setOrigin(0.5, 1).setDepth(160);
    this.block(176, 154, 46, 10);
    this.add.image(BOWL[0], BOWL[1], "pv_bowl").setOrigin(0.5, 1).setDepth(BOWL[1]);
    this.block(BOWL[0], BOWL[1] - 3, 16, 6);
    this.add.image(40, 190, "site_torch", 0).setOrigin(0.5, 1).setDepth(190); // a lit torch on each side
    this.add.image(312, 190, "site_torch", 0).setOrigin(0.5, 1).setDepth(190);
    for (const [x, y] of [[44, 224], [308, 224], [36, 140], [316, 140]]) this.add.image(x, y, "site_pot").setOrigin(0.5, 1).setDepth(y);
    this.add.image(250, 220, "exodus_lamb").setOrigin(0.5, 1).setDepth(220);
    this.add.image(262, 226, "exodus_lamb").setOrigin(0.5, 1).setDepth(226);
    this.add.image(122, 174, "exodus_moses_leader").setOrigin(0.5, 1).setDepth(174);

    // the family: father, mother, child (gear reminders)
    const fam: [number, number, string][] = [[52, 186, "exodus_slave"], [300, 186, "exodus_girl0"], [142, 134, "exodus_girl3"]];
    fam.forEach(([x, y, key], i) => {
      this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 3, 10, 6);
      this.glows[`g${i}`] = this.makeGlow(x, y - 14);
    });
    this.glows.roast = this.makeGlow(88, 150);
    this.glows.dough = this.makeGlow(264, 152);
    this.glows.herbs = this.makeGlow(96, 204);
    this.glows.bowl = this.makeGlow(BOWL[0], BOWL[1] - 8);
    Object.values(this.glows).forEach((g) => g.setVisible(false));

    // cold night gusts sweeping across the lanes
    for (const off of [0, 150]) {
      const rect = this.add.rectangle(X0, 126, 22, 140, 0xbfdbfe, 0.16).setOrigin(0).setDepth(DEPTH.FX - 60).setVisible(false);
      this.gusts.push({ rect, off });
    }

    // interactables
    const cx = (x: number, y: number, r: number, label: () => string, active: () => boolean, act: () => void) => this.interactables.push({ x, y, r, label, active, act });
    const prep = () => this.phase === "prep";
    cx(88, 152, 24, () => tr(this.turns >= TURNS ? STAGE6.roastDone : STAGE6.roast), () => prep() && this.turns < TURNS, () => this.turnLamb());
    cx(264, 152, 24, () => tr(this.kneads >= KNEADS ? STAGE6.kneadDone : STAGE6.knead), () => prep() && this.kneads < KNEADS, () => this.kneadDough());
    cx(96, 204, 22, () => tr(this.herbs ? STAGE6.herbsDone : STAGE6.herbs), () => prep() && !this.herbs, () => this.pickHerbs());
    fam.forEach(([x, y], i) => cx(x, y - 10, 22, () => tr([STAGE6.belt, STAGE6.sandals, STAGE6.staff][i]), () => prep() && !this.gear[i], () => this.remind(i)));
    cx(BOWL[0], BOWL[1] - 8, 24, () => tr(this.blood >= CHARGES ? STAGE6.bowlFull : STAGE6.bowl), () => this.phase === "mark" && this.blood < CHARGES, () => this.dip());
    this.houses.forEach((h, i) => cx(h.x, h.foot + 6, 20, () => tr(i === HOME && this.allMarked() ? STAGE6.home : this.blood > 0 ? STAGE6.door : STAGE6.doorNoBlood), () => this.phase === "mark" && (!h.marked || (i === HOME && this.allMarked())), () => this.useDoor(i)));

    this.hyssop = this.add.image(0, 0, "pv_hyssop").setDepth(DEPTH.FX).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  private addHouse(x: number, foot: number, i: number) {
    this.add.image(x, foot, "pv_house").setOrigin(0.5, 1).setDepth(foot);
    this.block(x, foot - 8, 40, 16);
    const l = x - 22, t = foot - 42;
    const mk = (px: number, py: number, w: number, h: number) => this.add.rectangle(l + px, t + py, w, h, RED).setOrigin(0).setDepth(foot + 1).setVisible(false);
    const parts = [mk(15, 25, 2, 16), mk(27, 25, 2, 16), mk(15, 23, 14, 2)];
    this.houses[i] = { x, foot, marked: false, parts };
  }

  private makeGlow(x: number, y: number) {
    const g = this.add.image(x, y, "exodus_glow_gold").setDepth(DEPTH.FX - 70).setAlpha(0.5);
    this.tweens.add({ targets: g, alpha: 0.9, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    return g;
  }

  private placeMoon(p: number) {
    const x = Math.round(30 + p * (W - 70)), y = Math.round(26 - Math.sin(p * Math.PI) * 14);
    const [a, b, c] = this.moon ?? [];
    a?.setPosition(x - 5, y - 5); b?.setPosition(x - 7, y - 3); c?.setPosition(x - 3, y - 7);
  }

  // ---------------------------------------------------------------- phases

  protected onStageStart() {
    this.phase = "wait";
    this.saveCheckpoint("prep", null, START[0], START[1]);
    this.talk(STAGE6.speaker, STAGE6.start.map(tr), () => this.startPrep());
  }

  private startPrep() {
    this.phase = "prep";
    this.paintPrep();
  }

  protected onCheckpointRestore(id: string) {
    if (id === "mark") this.startMark(false);
    else {
      this.turns = this.kneads = this.blood = 0;
      this.herbs = false;
      this.gear = [false, false, false];
      this.houses.forEach((h) => { h.marked = false; h.parts.forEach((p) => p.setVisible(false)); });
      this.paintPrep();
      this.phase = "prep";
    }
  }

  private paintPrep() {
    const food = (this.turns >= TURNS ? 1 : 0) + (this.kneads >= KNEADS ? 1 : 0) + (this.herbs ? 1 : 0);
    const n = Math.min(3, food);
    this.table?.setFrame(n);
    this.glows.roast.setVisible(this.phase === "prep" && this.turns < TURNS);
    this.glows.dough.setVisible(this.phase === "prep" && this.kneads < KNEADS);
    this.glows.herbs.setVisible(this.phase === "prep" && !this.herbs);
    this.gear.forEach((g, i) => this.glows[`g${i}`].setVisible(this.phase === "prep" && !g));
    this.dough?.setFrame(0);
    this.glows.bowl.setVisible(this.phase === "mark" && this.blood < CHARGES);
  }

  private prepCount() {
    return (this.turns >= TURNS ? 1 : 0) + (this.kneads >= KNEADS ? 1 : 0) + (this.herbs ? 1 : 0) + this.gear.filter(Boolean).length;
  }

  private checkPrep() {
    this.paintPrep();
    if (this.prepCount() < 6) return;
    this.phase = "wait";
    audio.sfx("bless");
    this.time.delayedCall(500, () => this.talk(STAGE6.speaker, STAGE6.prepDone.map(tr), () => this.startMark(true)));
  }

  private startMark(first: boolean) {
    this.phase = "mark";
    this.blood = 0;
    this.timeLeft = TIME_MS;
    this.houses.forEach((h) => { h.marked = false; h.parts.forEach((p) => p.setVisible(false)); });
    this.placeMoon(0);
    if (first) this.saveCheckpoint("mark", null, BOWL[0], BOWL[1] + 14);
    this.paintPrep();
  }

  private allMarked() {
    return this.houses.every((h) => h.marked);
  }

  // ---------------------------------------------------------------- actions

  private turnLamb() {
    this.turns++;
    audio.sfx("pickup");
    this.sparkleBurst(88, 148, 4);
    this.checkPrep();
  }

  private kneadDough() {
    const now = this.time.now;
    if (this.kneads === 0 || now - this.kneadStart > KNEAD_WINDOW) {
      if (this.kneads > 0) { audio.sfx("wrong"); this.dough?.setFrame(1); this.talk(STAGE6.speaker, [tr(STAGE6.kneadFail)]); this.time.delayedCall(600, () => this.dough?.setFrame(0)); }
      this.kneads = 0;
      this.kneadStart = now;
    }
    this.kneads++;
    audio.sfx("pickup");
    this.sparkleBurst(264, 150, 3);
    this.checkPrep();
  }

  private pickHerbs() {
    this.herbs = true;
    this.herbsImg?.setAlpha(0.45);
    audio.sfx("pickup");
    this.sparkleBurst(96, 202, 5);
    this.checkPrep();
  }

  private remind(i: number) {
    this.gear[i] = true;
    audio.sfx("chime");
    const g = this.glows[`g${i}`];
    this.sparkleBurst(g.x, g.y, 6);
    this.checkPrep();
  }

  private dip() {
    this.blood = CHARGES;
    audio.sfx("pickup");
    this.sparkleBurst(BOWL[0], BOWL[1] - 8, 5);
    this.paintPrep();
  }

  private useDoor(i: number) {
    const h = this.houses[i];
    if (h.marked) { if (i === HOME && this.allMarked()) this.won(); return; }
    if (this.blood <= 0) { audio.sfx("wrong"); return; }
    this.blood--;
    h.marked = true;
    audio.sfx("chime");
    h.parts.forEach((p, k) => this.time.delayedCall(k * 140, () => p.setVisible(true)));
    this.sparkleBurst(h.x, h.foot - 16, 6);
    this.paintPrep();
    if (this.allMarked()) { audio.sfx("bless"); this.glows.bowl.setVisible(false); }
  }

  private won() {
    this.phase = "done";
    this.hyssop?.setVisible(false);
    this.gusts.forEach((g) => g.rect.setVisible(false));
    this.player.speedScale = 1;
    audio.sfx("complete");
    this.cameras.main.flash(500, 255, 244, 200);
    this.completeStage();
    // the messenger passes over each marked door, one by one
    this.houses.forEach((h, k) => this.time.delayedCall(300 + k * 160, () => this.sparkleBurst(h.x, h.foot - 20, 6)));
    this.time.delayedCall(2200, () =>
      this.talk("Ấn Dấu thứ 6", STAGE6.outro.map(tr), () =>
        this.talk("Suy niệm", [tr(STAGE6.lesson)], () =>
          this.talk("Rời Ai Cập", STAGE6.cutscene.map(tr), () => this.goToNextStage()))));
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const p = this.player;
    const view = this.cameras.main.worldView;
    const marked = this.houses.filter((h) => h.marked).length;
    const secs = Math.max(0, Math.ceil(this.timeLeft / 1000));
    const hud = this.phase === "prep"
      ? `${tr(STAGE6.progress1)}: ${this.prepCount()}/6`
      : this.phase === "mark"
        ? `${tr(STAGE6.progress2)}: ${marked}/10  ·  ${tr(STAGE6.blood)}: ${this.blood}  ·  ${tr(STAGE6.midnight)}: ${secs}s`
        : "";
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(hud);
    this.hyssop?.setVisible(this.phase === "mark" && this.blood > 0).setPosition(Math.round(p.x + 9), Math.round(p.y - 4)).setDepth(p.y + 17);

    p.speedScale = 1;
    if (this.introActive || this.dialogueOpen) return;

    // gusts only blow in the marking phase
    const blowing = this.phase === "mark";
    for (const g of this.gusts) {
      g.rect.setVisible(blowing);
      if (!blowing) continue;
      const span = X1 - X0 - 22;
      const ph = (this.time.now * 0.04 + g.off) % (span * 2);
      g.rect.x = Math.round(X0 + (ph > span ? span * 2 - ph : ph));
      const hit = p.x > g.rect.x && p.x < g.rect.x + g.rect.width && p.y > g.rect.y && p.y < g.rect.y + g.rect.height;
      if (hit) p.speedScale = 0.5;
      if (hit && this.time.now - this.gustToldAt > 12000) { this.gustToldAt = this.time.now; this.talk(STAGE6.speaker, [tr(STAGE6.gust)]); }
    }

    if (this.phase === "prep" && this.kneads > 0 && this.kneads < KNEADS && this.time.now - this.kneadStart > KNEAD_WINDOW) {
      this.kneads = 0; // the dough puffed up: knead again from the start
      this.dough?.setFrame(1);
      this.time.delayedCall(600, () => this.dough?.setFrame(0));
      audio.sfx("wrong");
    }

    if (this.phase === "mark") {
      this.timeLeft -= delta;
      this.placeMoon(1 - Math.max(0, this.timeLeft) / TIME_MS);
      if (this.timeLeft <= 0) {
        this.phase = "wait";
        this.talk(STAGE6.speaker, STAGE6.late.map(tr), () => this.resetToCheckpoint());
      }
    }
  }
}
