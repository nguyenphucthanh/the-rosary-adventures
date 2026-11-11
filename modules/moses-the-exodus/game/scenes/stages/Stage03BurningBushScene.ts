import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH, type Interactable } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerMountTextures } from "@/modules/moses-the-exodus/game/utils/mountTextures";
import { STAGE3, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72; // top wall (collider) ends here
const BOTTOM = 180; // bottom collider starts here: the walkable band is y 72..180
const START: [number, number][] = [[130, 118], [276, 118], [410, 118]]; // retry position of each phase
const GATE_X = 258; // pasture gate, closed until the sheep are home
const RING_X = 384; // holy-ground fence, closed until the sandals are off
const PEN = { x1: 98, y1: 100, y2: 154 }; // a sheep walking in past x < x1 between y1..y2 is home
const SLOTS: [number, number][] = [[46, 116], [76, 116], [46, 144], [76, 144]];
const LOST: [number, number][] = [[150, 98], [206, 136], [132, 162], [236, 104]]; // sheep foot positions
const PEDESTAL: [number, number] = [314, 136];
const STONE_X = [440, 470, 500];
const STONE_Y = [100, 128, 156]; // stone centres
const SEQ = [0, 4, 8, 5]; // the order the fire shows, as row * 3 + col
const DWELL = 300; // ms the child must stand on a stone for it to count
const BUSH: [number, number] = [590, 118];
const MOSES_AT: [number, number] = [545, 130];
const SIGN_AT: [number, number] = [520, 148]; // where the snake / hand appear
const POT: [number, number] = [530, 86]; // Nile water, at the top, far from the grooves
const SLAB: [number, number] = [574, 176];
const GROOVES = [553, 575, 597];
const BAR_W = 96;

interface Sheep { spr: Phaser.GameObjects.Image; glow: Phaser.GameObjects.Image; x: number; y: number; state: "lost" | "follow" | "pen"; slot: number }

/** Stage 3: gather the flock, take off sandals and walk the holy stones in order, then perform the three signs. */
export class Stage03BurningBushScene extends BaseExodusScene {
  private phase = 0;
  private running = false;
  private finished = false;
  private token = 0; // bumped on every phase (re)start so stale timers die
  private sheep: Sheep[] = [];
  private sandalsOff = false;
  private stoneState: "off" | "demo" | "play" | "done" = "off";
  private stonePos = 0;
  private dwell = { i: -1, t: 0 };
  private signStep = 0; // 0 snake, 1 hand, 2 water, 3 done
  private carrying = false;
  private nextGroove = 0;
  private timing?: { x: number; dir: 1 | -1; zs: number; zw: number; speed: number; hits: number; need: number; onDone: () => void };
  private fence0?: { set: (v: boolean) => void };
  private ring?: { set: (v: boolean) => void };
  private stones: Phaser.GameObjects.Sprite[] = [];
  private waters: Phaser.GameObjects.Image[] = [];
  private moses!: Phaser.GameObjects.Image;
  private carry!: Phaser.GameObjects.Image;
  private sandals!: Phaser.GameObjects.Image;
  private snake!: Phaser.GameObjects.Sprite;
  private hand!: Phaser.GameObjects.Sprite;
  private staffItem!: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;
  private barText?: Phaser.GameObjects.Text;
  private bar!: { bg: Phaser.GameObjects.Rectangle; track: Phaser.GameObjects.Rectangle; zone: Phaser.GameObjects.Rectangle; cur: Phaser.GameObjects.Rectangle };

  constructor() {
    super("Stage03BurningBushScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_03_bui_cay_boc_chay";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.token = 0;
    this.running = this.finished = this.sandalsOff = this.carrying = false;
    this.stoneState = "off";
    this.stonePos = 0;
    this.dwell = { i: -1, t: 0 };
    this.signStep = 0;
    this.nextGroove = 0;
    this.timing = undefined;
    this.sheep = [];
    this.stones = [];
    this.waters = [];
    this.intro = { illustration: "3", speaker: STAGE3.speaker, lines: STAGE3.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerSiteTextures(this);
    registerMountTextures(this);
    if (!this.anims.exists("mt_bush")) this.anims.create({ key: "mt_bush", frames: this.anims.generateFrameNumbers("exodus_bush", { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    if (!this.anims.exists("mt_snake")) this.anims.create({ key: "mt_snake", frames: this.anims.generateFrameNumbers("mt_snake", { start: 0, end: 1 }), frameRate: 6, repeat: -1 });

    // dusk sky in stepped bands, cliff face, pasture grass, rocky mountain ground, lighter holy ground
    [[0x1e1b4b, 0, 10], [0x4c1d95, 10, 10], [0x9d174d, 20, 8], [0xf97316, 28, 6]].forEach(([c, y, h]) => this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    this.add.tileSprite(0, 34, W, TOP - 34 - 4, "mt_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, TOP - 4, GATE_X + 4, H - TOP + 4, "site_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X + 4, TOP - 4, W - GATE_X - 4, H - TOP + 4, "mt_ground").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(RING_X + 8, TOP - 4, W - RING_X - 8, H - TOP + 4, "exodus_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X + 4, 112, RING_X - GATE_X - 4, 32, "exodus_stone").setOrigin(0).setDepth(DEPTH.RUG); // path to the holy ground
    this.add.rectangle(RING_X + 8, TOP - 4, 2, H - TOP + 4, 0xfbbf24, 0.8).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    // below the walkable band: a dark cliff drop with a lit lip, so it reads as "cannot walk here"
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "mt_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.55).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x1e1b4b).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 1, 0xfbbf24, 0.6).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, 0, GATE_X + 4, H, 0xf97316, 0.1).setOrigin(0).setDepth(DEPTH.LIGHT); // sunset on the pasture
    this.add.rectangle(GATE_X + 4, 0, W - GATE_X - 4, H, 0x4c1d95, 0.18).setOrigin(0).setDepth(DEPTH.LIGHT); // dusk on the mountain

    // colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.fence0 = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "site_fence", true);
    this.ring = this.door(RING_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "site_fence", true);

    // sheep pen: three rails, open on the right
    for (const [x, y, w, h] of [[60, 94, 72, 6], [60, 158, 72, 6], [25, 126, 6, 70]]) {
      this.add.tileSprite(x, y, w, h, "site_fence").setDepth(y + h / 2);
      this.block(x, y, w, h);
    }

    // decor: rocks, dry shrubs, torn-up grass
    for (const [x, y] of [[120, 84], [250, 84], [182, 176], [30, 178], [300, 82], [352, 84], [336, 176], [368, 174], [440, 82], [620, 84]]) this.add.image(x, y, "site_rock").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[60, 84], [196, 84], [226, 172], [96, 176], [282, 174], [404, 84], [610, 176], [560, 84], [468, 176]]) this.add.image(x, y, "site_shrub").setOrigin(0.5, 1).setDepth(y);

    // the burning bush: flame glow + animated bush
    const fire = this.add.image(BUSH[0], BUSH[1] - 14, "exodus_glow_fire").setDepth(BUSH[1] - 1).setAlpha(0.55);
    this.tweens.add({ targets: fire, alpha: 0.9, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.add.image(BUSH[0], BUSH[1] - 14, "exodus_glow_gold").setDepth(BUSH[1] - 1).setAlpha(0.35);
    this.add.sprite(BUSH[0], BUSH[1], "exodus_bush").setOrigin(0.5, 1).setDepth(BUSH[1]).play("mt_bush");
    this.block(BUSH[0], BUSH[1] - 8, 20, 10);

    // lost sheep, each with a gold glow
    LOST.forEach(([x, y], i) => {
      const glow = this.add.image(x, y - 6, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.5);
      this.tweens.add({ targets: glow, alpha: 0.85, duration: 800 + i * 90, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      const spr = this.add.image(x, y, "exodus_lamb").setOrigin(0.5, 1).setDepth(y).setFlipX(i % 2 === 1);
      this.sheep.push({ spr, glow, x, y, state: "lost", slot: -1 });
    });

    // the Humble Stone, sandals, the nine holy stones
    this.prop(PEDESTAL[0], PEDESTAL[1], "mt_pedestal", 18, 8);
    this.sandals = this.add.image(PEDESTAL[0], PEDESTAL[1] - 9, "mt_sandals").setOrigin(0.5, 1).setDepth(PEDESTAL[1] + 1).setVisible(false);
    const pg = this.add.image(PEDESTAL[0], PEDESTAL[1] - 14, "exodus_glow_gold").setDepth(PEDESTAL[1] - 1).setAlpha(0.45);
    this.tweens.add({ targets: pg, alpha: 0.8, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    for (let i = 0; i < 9; i++) {
      const cx = STONE_X[i % 3], cy = STONE_Y[Math.floor(i / 3)];
      this.stones.push(this.add.sprite(cx, cy + 6, "mt_stone", 0).setOrigin(0.5, 1).setDepth(DEPTH.RUG + 1));
    }

    // Nile water pot, the dry slab with three numbered grooves
    this.add.image(POT[0], POT[1], "site_pot").setOrigin(0.5, 1).setDepth(POT[1]);
    this.block(POT[0], POT[1] - 6, 16, 8);
    this.add.image(SLAB[0], SLAB[1], "mt_slab").setOrigin(0.5, 1).setDepth(SLAB[1]);
    this.block(SLAB[0], SLAB[1] - 5, 66, 8);
    GROOVES.forEach((x, i) => this.add.text(x, SLAB[1] - 18, String(i + 1), { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5, 1).setDepth(SLAB[1]));

    // sign props (hidden until their sign): snake, healed hand, the staff
    this.snake = this.add.sprite(SIGN_AT[0], SIGN_AT[1], "mt_snake").setOrigin(0.5, 1).setDepth(SIGN_AT[1]).setVisible(false);
    this.hand = this.add.sprite(SIGN_AT[0], SIGN_AT[1], "mt_hand", 0).setOrigin(0.5, 1).setDepth(SIGN_AT[1]).setVisible(false);
    this.staffItem = this.add.image(SIGN_AT[0], SIGN_AT[1], "exodus_staff").setOrigin(0.5, 1).setDepth(SIGN_AT[1]).setVisible(false);

    // interactables
    const sheepIts: Interactable[] = this.sheep.map((s) => ({
      get x() { return s.x; }, get y() { return s.y - 8; }, r: 28, label: tr(STAGE3.sheepHint),
      active: () => this.phase === 0 && this.running && s.state === "lost", act: () => this.callSheep(s),
    }));
    this.interactables.push(
      ...sheepIts,
      { x: PEDESTAL[0], y: PEDESTAL[1] - 8, r: 30, label: tr(STAGE3.sandalHint), active: () => this.phase === 1 && this.running && !this.sandalsOff, act: () => this.takeOffSandals() },
      { x: 418, y: 128, r: 20, label: tr(STAGE3.replayHint), active: () => this.phase === 1 && this.stoneState === "play", act: () => this.demo() },
      { x: MOSES_AT[0], y: MOSES_AT[1] - 14, r: 28, label: () => tr(this.signStep === 0 ? STAGE3.moses1 : this.signStep === 1 ? STAGE3.moses2 : STAGE3.moses3),
        active: () => this.phase === 2 && this.running && !this.timing && this.signStep < 3, act: () => this.startSign() },
      { x: POT[0], y: POT[1] - 14, r: 26, label: tr(STAGE3.waterHint), active: () => this.phase === 2 && this.signStep === 2 && !this.carrying && !this.timing, act: () => this.takeWater() },
      ...GROOVES.map((x, i) => ({ x, y: SLAB[1] - 18, r: 14, label: () => `${tr(STAGE3.grooveHint)} ${i + 1}`, active: () => this.phase === 2 && this.signStep === 2 && this.carrying, act: () => this.pour(i) })),
    );

    // Moses follows the child; the carried jar sits at chest height
    this.moses = this.add.image(START[0][0] - 20, START[0][1] + 16, "exodus_moses_shepherd").setOrigin(0.5, 1);
    this.carry = this.add.image(0, 0, "site_jar").setOrigin(0.5, 1).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
    this.barText = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#ffffff", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI).setVisible(false);
    this.bar = {
      bg: this.add.rectangle(0, 0, BAR_W + 4, 12, 0xfde68a).setOrigin(0).setDepth(DEPTH.UI),
      track: this.add.rectangle(0, 0, BAR_W, 8, 0x1e293b).setOrigin(0).setDepth(DEPTH.UI + 1),
      zone: this.add.rectangle(0, 0, 20, 8, 0x4ade80).setOrigin(0).setDepth(DEPTH.UI + 2),
      cur: this.add.rectangle(0, 0, 3, 12, 0xffffff).setOrigin(0).setDepth(DEPTH.UI + 3),
    };
    Object.values(this.bar).forEach((o) => o.setVisible(false));
  }

  protected onStageStart() {
    this.talk(STAGE3.speaker, STAGE3.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  /** A on [A]-less moments: while the timing bar runs, A is the beat. */
  protected handleActionTrigger() {
    if (this.timing) return this.beat();
    super.handleActionTrigger();
  }

  // ---------------------------------------------------------------- phases

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = false;
    this.token++;
    this.carrying = false;
    this.timing = undefined;
    this.hideBar();
    this.dwell = { i: -1, t: 0 };
    this.nextGroove = 0;
    this.player.setMovementLock(false);
    this.fence0?.set(n === 0);
    this.ring?.set(n < 2);
    this.sandalsOff = n >= 2;
    this.sandals.setVisible(n >= 2);
    this.snake.setVisible(false);
    this.hand.setVisible(false).setFrame(0);
    this.staffItem.setVisible(false);
    this.waters.forEach((w) => w.destroy());
    this.waters = [];
    this.stones.forEach((s, i) => s.setFrame(n >= 2 && SEQ.includes(i) ? 2 : 0));
    this.stoneState = n >= 2 ? "done" : "off";
    this.stonePos = 0;
    this.signStep = 0;

    this.sheep.forEach((s, i) => {
      if (n === 0) {
        s.state = "lost"; s.x = LOST[i][0]; s.y = LOST[i][1];
        s.glow.setVisible(true);
      } else {
        s.state = "pen"; s.slot = i; s.x = SLOTS[i][0]; s.y = SLOTS[i][1];
        s.glow.setVisible(false);
      }
      s.spr.setPosition(s.x, s.y).setDepth(s.y);
    });

    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, intro && n > 0 ? this.player.x : sx, intro && n > 0 ? this.player.y : sy);
    if (!intro || n === 0) {
      this.player.setVelocity(0, 0);
      this.player.setPosition(sx, sy);
    }
    this.moses.setTexture("exodus_moses_shepherd");
    if (n === 2) this.moses.setPosition(MOSES_AT[0], MOSES_AT[1]);
    else this.moses.setPosition(this.player.x - 20, this.player.y + 16);

    const go = () => { this.running = true; };
    if (!intro) this.time.delayedCall(400, go);
    else if (n === 1) this.talk(STAGE3.speaker, STAGE3.voice.map(tr), go);
    else go();
  }

  // ---------------------------------------------------------------- phase 1: the flock

  private callSheep(s: Sheep) {
    s.state = "follow";
    audio.sfx("pickup");
    this.sparkleBurst(s.x, s.y - 8, 4);
  }

  private penned() {
    return this.sheep.filter((s) => s.state === "pen").length;
  }

  private updateSheep(dt: number, time: number) {
    const p = this.player;
    const gx = p.x, gy = p.y + 9; // child's ground point
    const followers = this.sheep.filter((s) => s.state === "follow");
    this.sheep.forEach((s) => {
      if (s.state === "lost") {
        s.spr.setPosition(Math.round(s.x), Math.round(s.y) - (Math.floor(time / 450) % 2)).setDepth(s.y);
        s.glow.setPosition(Math.round(s.x), Math.round(s.y) - 6).setDepth(s.y - 1);
      } else if (s.state === "follow") {
        const i = followers.indexOf(s);
        const tx = gx + 18 + i * 12, ty = gy + (i % 2 ? 6 : -6);
        const dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy);
        if (d > 10) { const m = Math.min(95 * dt, d); s.x += (dx / d) * m; s.y += (dy / d) * m; }
        s.spr.setPosition(Math.round(s.x), Math.round(s.y)).setDepth(s.y).setFlipX(dx < 0);
        s.glow.setPosition(Math.round(s.x), Math.round(s.y) - 6).setDepth(s.y - 1);
        if (s.x < PEN.x1 && s.y > PEN.y1 && s.y < PEN.y2) this.penSheep(s);
      }
    });
  }

  private penSheep(s: Sheep) {
    s.state = "pen";
    s.slot = this.sheep.filter((o) => o.state === "pen").length - 1;
    const [x, y] = SLOTS[s.slot];
    s.glow.setVisible(false);
    this.tweens.add({ targets: s, x, y, duration: 500, ease: "Sine.easeInOut", onUpdate: () => s.spr.setPosition(Math.round(s.x), Math.round(s.y)).setDepth(s.y) });
    audio.sfx("chime");
    this.sparkleBurst(x, y - 8, 6);
    if (this.penned() === this.sheep.length) {
      this.running = false;
      this.fence0?.set(false);
      this.time.delayedCall(700, () => this.talk(STAGE3.speaker, STAGE3.sheepDone.map(tr), () => this.startPhase(1)));
    }
  }

  // ---------------------------------------------------------------- phase 2: holy ground

  private takeOffSandals() {
    this.sandalsOff = true;
    this.sandals.setVisible(true);
    this.ring?.set(false);
    audio.sfx("bless");
    this.sparkleBurst(PEDESTAL[0], PEDESTAL[1] - 14, 8);
    this.talk(STAGE3.speaker, STAGE3.sandals.map(tr));
  }

  private demo() {
    const id = this.token;
    this.stoneState = "demo";
    this.stones.forEach((s) => s.setFrame(0));
    this.player.setVelocity(0, 0);
    this.player.setMovementLock(true);
    SEQ.forEach((si, k) =>
      this.time.delayedCall(500 + k * 850, () => {
        if (id !== this.token) return;
        this.stones[si].setFrame(1);
        audio.sfx("chime");
        this.sparkleBurst(STONE_X[si % 3], STONE_Y[Math.floor(si / 3)], 4);
        this.time.delayedCall(600, () => id === this.token && this.stones[si].setFrame(0));
      })
    );
    this.time.delayedCall(500 + SEQ.length * 850 + 300, () => {
      if (id !== this.token) return;
      this.player.setMovementLock(false);
      this.stonePos = 0;
      this.dwell = { i: -1, t: 0 };
      this.stoneState = "play";
    });
  }

  private checkStones(delta: number) {
    const p = this.player;
    const gy = p.y + 9;
    const on = this.stones.findIndex((_, i) => Math.abs(p.x - STONE_X[i % 3]) < 8 && Math.abs(gy - STONE_Y[Math.floor(i / 3)]) < 8);
    if (on !== this.dwell.i) { this.dwell = { i: on, t: 0 }; return; }
    if (on < 0) return;
    this.dwell.t += delta;
    if (this.dwell.t < DWELL || SEQ.slice(0, this.stonePos).includes(on)) return; // already lit
    if (on === SEQ[this.stonePos]) {
      this.stones[on].setFrame(2);
      this.stonePos++;
      audio.sfx("chime");
      this.sparkleBurst(STONE_X[on % 3], STONE_Y[Math.floor(on / 3)], 6);
      if (this.stonePos === SEQ.length) this.stonesSolved();
    } else {
      this.stoneState = "off";
      this.running = false;
      audio.sfx("wrong");
      this.cameras.main.flash(200, 255, 244, 200);
      this.talk(STAGE3.speaker, STAGE3.stonesWrong.map(tr), () => { this.running = true; this.demo(); });
    }
  }

  private stonesSolved() {
    this.stoneState = "done";
    this.running = false;
    this.time.delayedCall(600, () => {
      audio.sfx("bless");
      this.talk(STAGE3.speaker, STAGE3.stonesDone.map(tr), () => {
        this.startPhase(2);
        this.running = true;
      });
    });
  }

  // ---------------------------------------------------------------- phase 3: the three signs

  private startSign() {
    if (this.signStep === 0) {
      this.talk(STAGE3.speaker, STAGE3.sign1.map(tr), () => {
        this.snake.setVisible(true).play("mt_snake");
        this.startTiming(1, 24, 90, () => {
          this.snake.setVisible(false).stop();
          this.staffItem.setVisible(true);
          this.sparkleBurst(SIGN_AT[0], SIGN_AT[1] - 8, 10);
          audio.sfx("bless");
          this.talk(STAGE3.speaker, STAGE3.sign1Done.map(tr), () => { this.staffItem.setVisible(false); this.signStep = 1; });
        });
      });
    } else if (this.signStep === 1) {
      this.talk(STAGE3.speaker, STAGE3.sign2.map(tr), () => {
        this.hand.setFrame(0).setVisible(true);
        this.startTiming(2, 18, 120, () => {
          this.hand.setFrame(1);
          this.sparkleBurst(SIGN_AT[0], SIGN_AT[1] - 8, 10);
          audio.sfx("bless");
          this.talk(STAGE3.speaker, STAGE3.sign2Done.map(tr), () => {
            this.hand.setVisible(false);
            this.signStep = 2;
            this.talk(STAGE3.speaker, STAGE3.sign3.map(tr));
          });
        });
      });
    }
  }

  private takeWater() {
    this.carrying = true;
    audio.sfx("pickup");
    this.sparkleBurst(POT[0], POT[1] - 14, 6);
  }

  private pour(i: number) {
    this.carrying = false;
    if (i !== this.nextGroove) {
      this.waters.forEach((w) => w.destroy());
      this.waters = [];
      this.nextGroove = 0;
      audio.sfx("wrong");
      this.talk(STAGE3.speaker, STAGE3.grooveWrong.map(tr));
      return;
    }
    this.nextGroove++;
    audio.sfx("chime");
    this.waters.push(this.add.image(GROOVES[i], SLAB[1] - 3, "mt_water").setOrigin(0.5, 1).setDepth(SLAB[1] + 1));
    this.sparkleBurst(GROOVES[i], SLAB[1] - 6, 6);
    if (this.nextGroove === GROOVES.length) {
      this.signStep = 3;
      this.waters.forEach((w) => w.setTint(0xdc2626)); // the water turns to blood
      this.time.delayedCall(700, () => this.won());
    }
  }

  private won() {
    this.finished = true;
    this.running = false;
    audio.sfx("complete");
    this.completeStage();
    this.talk(tx("Thiên Chúa", "God"), STAGE3.name.map(tr), () =>
      this.talk(tx("Ấn Dấu thứ 3", "Seal 3"), STAGE3.outro.map(tr), () =>
        this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE3.lesson)], () =>
          this.talk(tx("Trên Đường Trở Về Ai Cập", "On the Road Back to Egypt"), STAGE3.cutscene.map(tr), () => this.goToNextStage()))));
  }

  // ---------------------------------------------------------------- timing bar (signs 1 and 2)

  private startTiming(need: number, zw: number, speed: number, onDone: () => void) {
    this.timing = { x: 0, dir: 1, zs: 0, zw, speed, hits: 0, need, onDone };
    this.newZone();
    Object.values(this.bar).forEach((o) => o.setVisible(true));
    this.barText?.setVisible(true).setText(tr(STAGE3.timingHint));
  }

  private newZone() {
    const t = this.timing;
    if (t) t.zs = Phaser.Math.Between(12, BAR_W - t.zw - 6);
  }

  private hideBar() {
    Object.values(this.bar ?? {}).forEach((o) => o.setVisible(false));
    this.barText?.setVisible(false);
  }

  private beat() {
    const t = this.timing;
    if (!t) return;
    if (t.x + 3 > t.zs && t.x < t.zs + t.zw) {
      t.hits++;
      audio.sfx("chime");
      this.sparkleBurst(SIGN_AT[0], SIGN_AT[1] - 8, 6);
      if (t.hits >= t.need) {
        this.timing = undefined;
        this.hideBar();
        t.onDone();
        return;
      }
      t.speed *= 1.15;
      this.newZone();
    } else {
      audio.sfx("wrong");
      this.bar.cur.setFillStyle(0xdc2626);
      this.time.delayedCall(200, () => this.bar.cur.setFillStyle(0xffffff));
    }
  }

  // ---------------------------------------------------------------- frame update

  private labelText(): string {
    if (this.finished) return "";
    if (this.phase === 0) return `${tr(STAGE3.phase[0])} (${this.penned()}/${this.sheep.length})`;
    if (this.phase === 1) {
      if (this.stoneState === "demo") return tr(STAGE3.stonesWatch);
      if (this.stoneState === "play") return `${tr(STAGE3.stonesLabel)} (${this.stonePos}/${SEQ.length})`;
      return tr(STAGE3.phase[1]);
    }
    if (this.timing) return `${tr(this.signStep === 0 ? STAGE3.phase[2] : STAGE3.handLabel)} (${this.timing.hits}/${this.timing.need})`;
    if (this.signStep === 2) return `${tr(STAGE3.grooveLabel)} (${this.nextGroove}/${GROOVES.length})`;
    return `${tr(STAGE3.phase[2])} (${Math.min(this.signStep + 1, 3)}/3)`;
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const dt = Math.min(delta, 50) / 1000;
    const p = this.player;
    const view = this.cameras.main.worldView;
    const top = Math.round(view.y + this.safeInsetTop() + 4);
    this.label?.setPosition(Math.round(view.centerX), top).setText(this.labelText());

    // timing bar pinned to the camera, under the label
    if (this.timing) {
      const t = this.timing;
      if (!this.dialogueOpen && !this.introActive) {
        t.x += t.dir * t.speed * dt;
        if (t.x > BAR_W - 3) { t.x = BAR_W - 3; t.dir = -1; } else if (t.x < 0) { t.x = 0; t.dir = 1; }
      }
      const left = Math.round(view.centerX - BAR_W / 2), by = top + 20;
      this.bar.bg.setPosition(left - 2, by - 2);
      this.bar.track.setPosition(left, by);
      this.bar.zone.setPosition(left + t.zs, by).setSize(t.zw, 8);
      this.bar.cur.setPosition(left + Math.round(t.x), by - 2);
      this.barText?.setPosition(Math.round(view.centerX), by + 14);
    }

    // carried jar at chest height, on the side the child faces
    const dir = p.getDirection();
    const hx = dir === "left" ? -9 : dir === "right" ? 9 : 0;
    const hy = dir === "up" ? 6 : 12;
    this.carry.setVisible(this.carrying).setPosition(Math.round(p.x + hx), Math.round(p.y + hy)).setDepth(p.y + (dir === "up" ? 15 : 17));

    // Moses follows a few steps behind, until he stands by the bush
    if (this.phase < 2) {
      const dx = p.x - this.moses.x;
      const dy = p.y + 16 - this.moses.y;
      const d = Math.hypot(dx, dy);
      if (d > 30) {
        const s = Math.min(150 * dt, d - 30);
        this.moses.x += (dx / d) * s;
        this.moses.y += (dy / d) * s;
      }
    }
    this.moses.setPosition(Math.round(this.moses.x), Math.round(this.moses.y)).setDepth(this.moses.y);

    if (this.introActive || this.dialogueOpen) return;
    if (this.phase === 0) this.updateSheep(dt, time ?? 0);
    if (!this.running) return;
    if (this.phase === 1) {
      if (this.sandalsOff && this.stoneState === "off" && p.x > STONE_X[0] - 16) {
        this.stoneState = "demo";
        this.running = false;
        this.talk(STAGE3.speaker, STAGE3.stonesIntro.map(tr), () => { this.running = true; this.demo(); });
      } else if (this.stoneState === "play") this.checkStones(delta);
    }
  }
}
