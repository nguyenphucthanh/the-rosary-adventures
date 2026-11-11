import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerSeaTextures } from "@/modules/moses-the-exodus/game/utils/seaTextures";
import { STAGE7, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 352;
const H = 300;
const START: [number, number] = [176, 160];
// walkable seabed rect (feet): top wall above Y0, bottom wall below Y1
const X0 = 32, Y0 = 84, Y1 = 244;
const SHORE_X = 288; // east bank starts here; the closing sea stops at this edge
const LANES = [112, 160, 208];
const PILLAR_X = 56;
const GX0 = 96; // where each group starts walking
const STOP_X = [301, 313, 325]; // where each group settles on the shore, clear of the sea edge
const SPEED = 16; // group walking speed, px/s
const WIND: [number, number][] = [[200, 96], [236, 224], [206, 96]]; // east-wind spot per group
const HALT_BEFORE = 28; // group stops this far before its wind spot's wall
const CHARIOT_SPEED = 130; // px/s
const WARN_MS = 2200;
const GAP_MS = [5600, 5000, 4400]; // between chariots, per group
const MOSES: [number, number] = [326, 134];
const KEYS = [["exodus_slave", "exodus_girl0", "exodus_girl3"], ["exodus_girl3", "exodus_slave", "exodus_girl0"], ["exodus_girl0", "exodus_girl3", "exodus_slave"]];

type Phase = "wait" | "cross" | "between" | "final" | "done";
interface Chariot { lane: number; state: "warn" | "run" | "bog"; x: number; t: number; img: Phaser.GameObjects.Image }

/** Stage 7: escort three groups across the dry seabed, steady the water walls, and park the Pillar of Fire in front of the chariots. */
export class Stage07RedSeaCrossingScene extends BaseExodusScene {
  private phase: Phase = "wait";
  private g = 0; // current group
  private gx = GX0;
  private halted = false;
  private steady = false;
  private arrived = 0;
  private lane = 1; // pillar lane
  private chariots: Chariot[] = [];
  private spawnIn = 0;
  private lastLane = -1;
  private hitToldAt = 0;
  private bogToldAt = 0;
  private groupImgs: Phaser.GameObjects.Image[][] = [];
  private pillar?: Phaser.GameObjects.Sprite;
  private pillarGlow?: Phaser.GameObjects.Image;
  private winds: Phaser.GameObjects.Sprite[] = [];
  private windGlows: Phaser.GameObjects.Image[] = [];
  private threat?: Phaser.GameObjects.Rectangle;
  private wallTiles: Phaser.GameObjects.TileSprite[] = [];
  private radar: { box: Phaser.GameObjects.Rectangle; fill: Phaser.GameObjects.Rectangle }[] = [];
  private seaTop?: Phaser.GameObjects.Rectangle;
  private seaBot?: Phaser.GameObjects.Rectangle;
  private mosesGlow?: Phaser.GameObjects.Image;
  private dawn?: Phaser.GameObjects.Rectangle;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage07RedSeaCrossingScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_07_re_nuoc_bien_do";
    this.spawn = START;
  }

  create() {
    this.phase = "wait";
    this.g = 0;
    this.gx = GX0;
    this.halted = this.steady = false;
    this.arrived = 0;
    this.lane = 1;
    this.chariots = [];
    this.groupImgs = [];
    this.winds = [];
    this.windGlows = [];
    this.wallTiles = [];
    this.radar = [];
    this.spawnIn = this.lastLane = this.hitToldAt = this.bogToldAt = 0;
    this.intro = { illustration: "7", speaker: STAGE7.speaker, lines: STAGE7.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerSiteTextures(this);
    registerSeaTextures(this);

    // wet seabed, banks, water walls with foam
    this.add.tileSprite(0, 0, W, H, "exodus_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, Y0 - 8, W, Y1 - Y0 + 20, 0x1e3a5f, 0.22).setOrigin(0).setDepth(DEPTH.FLOOR + 1); // damp sand
    this.add.tileSprite(0, Y0 - 8, X0, Y1 - Y0 + 20, "site_dirt").setOrigin(0).setDepth(DEPTH.RUG); // west bank
    this.add.tileSprite(SHORE_X, Y0 - 8, W - SHORE_X, Y1 - Y0 + 20, "site_grass").setOrigin(0).setDepth(DEPTH.RUG); // east bank: freedom
    for (const y of LANES) this.add.rectangle(X0, y - 2, SHORE_X - X0, 4, 0x000000, 0.08).setOrigin(0).setDepth(DEPTH.RUG); // faint cart-lane tracks
    this.wallTiles.push(
      this.add.tileSprite(0, 0, W, 72, "sea_wall").setOrigin(0).setDepth(DEPTH.WALL - 2),
      this.add.tileSprite(0, 256, W, H - 256, "sea_wall").setOrigin(0).setDepth(DEPTH.WALL - 2),
    );
    this.add.tileSprite(0, 72, W, 8, "sea_edge_b").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.tileSprite(0, 248, W, 8, "sea_edge_t").setOrigin(0).setDepth(DEPTH.WALL - 1);
    this.add.rectangle(0, 80, W, 6, 0x000000, 0.18).setOrigin(0).setDepth(DEPTH.RUG + 1); // wall shadow on the sand
    this.add.rectangle(0, 242, W, 6, 0x000000, 0.18).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.dawn = this.add.rectangle(0, 0, W, H, 0x0b1020, 0.22).setOrigin(0).setDepth(DEPTH.LIGHT); // night; warms at the end

    // fish drifting in the walls
    for (const [x, y, to, ms] of [[40, 22, 300, 9000], [260, 50, 60, 11000], [120, 272, 330, 10000], [300, 286, 90, 12000]]) {
      const f = this.add.image(x, y, "sea_fish").setDepth(DEPTH.WALL - 1).setFlipX(to < x).setAlpha(0.9);
      this.tweens.add({ targets: f, x: to, duration: ms, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [40], onYoyo: () => f.setFlipX(!f.flipX), onRepeat: () => f.setFlipX(!f.flipX) });
    }

    // edges
    this.block(W / 2, 40, W, 80);
    this.block(W / 2, (248 + H) / 2, W, H - 248);
    this.block(15, H / 2, 30, H);
    this.block(W - 6, H / 2, 12, H);

    // seabed dressing (non-blocking, clear of the wind spots)
    for (const x of [64, 124, 156, 268, 290]) this.add.image(x, 90, "sea_coral").setOrigin(0.5, 1).setDepth(90);
    for (const x of [84, 142, 182, 270]) this.add.image(x, 246, "sea_coral").setOrigin(0.5, 1).setDepth(246);
    for (const [x, y] of [[44, 100], [150, 94], [286, 240], [110, 240]]) this.add.image(x, y, "sea_weed").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[80, 132], [150, 186], [228, 136], [260, 190], [120, 230], [190, 128]]) this.add.image(x, y, "sea_shell").setDepth(DEPTH.RUG + 1);

    // west bank: torches, Egyptian side
    this.add.image(20, 120, "site_torch", 0).setOrigin(0.5, 1).setDepth(120);
    this.add.image(20, 200, "site_torch", 0).setOrigin(0.5, 1).setDepth(200);
    this.add.image(16, 160, "exodus_glow_fire").setDepth(DEPTH.FX - 70).setAlpha(0.45);

    // east bank: Moses on a rock, shrubs, lamp
    this.add.image(MOSES[0] + 2, MOSES[1] + 6, "site_rock").setOrigin(0.5, 1).setDepth(MOSES[1] - 1);
    this.add.image(MOSES[0], MOSES[1], "exodus_moses_leader").setOrigin(0.5, 1).setDepth(MOSES[1]);
    this.block(MOSES[0], MOSES[1] - 3, 14, 6);
    this.mosesGlow = this.add.image(MOSES[0], MOSES[1] - 14, "exodus_glow_gold").setDepth(DEPTH.FX - 70).setAlpha(0.5).setVisible(false);
    this.tweens.add({ targets: this.mosesGlow, alpha: 0.9, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    for (const [x, y] of [[308, 100], [340, 100], [338, 232], [306, 236]]) this.add.image(x, y, "site_shrub").setOrigin(0.5, 1).setDepth(y);
    this.add.image(310, 88, "site_torch", 0).setOrigin(0.5, 1).setDepth(88);

    // Pillar of Fire + its ground glow
    this.pillarGlow = this.add.image(PILLAR_X, LANES[1] - 10, "exodus_glow_fire").setDepth(DEPTH.FX - 70).setAlpha(0.7);
    this.tweens.add({ targets: this.pillarGlow, alpha: 0.4, duration: 500, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    if (!this.anims.exists("sea_pillar")) this.anims.create({ key: "sea_pillar", frames: this.anims.generateFrameNumbers("exodus_pillar_fire", { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    this.pillar = this.add.sprite(PILLAR_X, LANES[1] + 8, "exodus_pillar_fire", 0).setOrigin(0.5, 1).setDepth(LANES[1] + 8).play("sea_pillar");

    // east-wind spots (one per group; only the current group's is shown)
    if (!this.anims.exists("sea_wind")) this.anims.create({ key: "sea_wind", frames: this.anims.generateFrameNumbers("sea_wind", { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    WIND.forEach(([x, y]) => {
      const gl = this.add.image(x, y - 6, "exodus_glow_gold").setDepth(DEPTH.FX - 70).setAlpha(0.6).setVisible(false);
      this.tweens.add({ targets: gl, alpha: 0.9, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      const s = this.add.sprite(x, y, "sea_wind", 0).setOrigin(0.5, 1).setDepth(y).setVisible(false).play("sea_wind");
      this.tweens.add({ targets: s, y: y - 3, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.windGlows.push(gl);
      this.winds.push(s);
    });
    this.threat = this.add.rectangle(0, 0, 44, 10, 0xe0f2fe, 0.7).setDepth(DEPTH.FX - 60).setVisible(false);
    this.tweens.add({ targets: this.threat, height: 18, duration: 350, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });

    // the three groups (one person per lane)
    KEYS.forEach((keys, gi) => {
      this.groupImgs[gi] = LANES.map((y, i) => this.add.image(GX0, y, keys[i]).setOrigin(0.5, 1).setDepth(y).setVisible(gi === 0));
    });

    // lane radar: pinned to the camera's left edge
    LANES.forEach(() => {
      const box = this.add.rectangle(0, 0, 12, 12, 0x0f172a, 0.8).setStrokeStyle(1, 0xfde68a).setDepth(DEPTH.UI);
      const fill = this.add.rectangle(0, 0, 8, 8, 0x475569).setDepth(DEPTH.UI + 1);
      this.radar.push({ box, fill });
    });
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);

    // the sea closing at the end: starts empty
    this.seaTop = this.add.rectangle(X0, Y0 - 8, SHORE_X - X0, 0, 0x0369a1, 0.9).setOrigin(0).setDepth(DEPTH.FX - 50);
    this.seaBot = this.add.rectangle(X0, Y1 + 4, SHORE_X - X0, 0, 0x0369a1, 0.9).setOrigin(0).setDepth(DEPTH.FX - 50); // origin 0: the tween moves y and grows height together

    // interactables
    const cx = (x: number, y: number, r: number, label: () => string, active: () => boolean, act: () => void) => this.interactables.push({ x, y, r, label, active, act });
    cx(84, LANES[1], 62, () => tr(STAGE7.pillar), () => this.phase === "cross" || this.phase === "between", () => this.movePillar());
    WIND.forEach(([x, y], i) => cx(x, y, 26, () => tr(STAGE7.wind), () => this.phase === "cross" && this.g === i && !this.steady, () => this.callWind()));
    cx(MOSES[0] - 8, MOSES[1] + 6, 26, () => tr(STAGE7.moses), () => this.phase === "final", () => this.closeSea());
  }

  // ---------------------------------------------------------------- phases

  protected onStageStart() {
    this.phase = "wait";
    this.initGrace(3);
    this.talk(STAGE7.speaker, STAGE7.start.map(tr), () => this.startGroup(0));
  }

  protected onCheckpointRestore(id: string) {
    if (id === "final") this.enterFinal();
    else this.startGroup(Number(id.slice(1)));
  }

  private clearChariots() {
    this.chariots.forEach((c) => c.img.destroy());
    this.chariots = [];
  }

  private startGroup(n: number) {
    this.clearChariots();
    this.g = n;
    this.gx = GX0;
    this.halted = this.steady = false;
    this.phase = "cross";
    this.spawnIn = 3200;
    this.lastLane = -1;
    this.setLane(1, true);
    this.arrived = n;
    this.groupImgs.forEach((arr, gi) => arr.forEach((im, i) => {
      im.setVisible(gi <= n);
      if (gi < n) im.setPosition(STOP_X[gi], LANES[i]); // earlier groups wait on the shore
      else if (gi === n) im.setPosition(GX0, LANES[i]);
    }));
    this.winds.forEach((s, i) => { s.setVisible(i === n); this.windGlows[i].setVisible(i === n); });
    this.threat?.setVisible(false);
    this.saveCheckpoint(`g${n}`, null, START[0], START[1]);
    this.mosesGlow?.setVisible(false);
  }

  private enterFinal() {
    this.clearChariots();
    this.phase = "final";
    this.arrived = 3;
    this.winds.forEach((s, i) => { s.setVisible(false); this.windGlows[i].setVisible(false); });
    this.threat?.setVisible(false);
    this.groupImgs.forEach((arr, gi) => arr.forEach((im, i) => im.setVisible(true).setPosition(STOP_X[gi], LANES[i])));
    this.mosesGlow?.setVisible(true);
    this.saveCheckpoint("final", null, START[0], START[1]);
  }

  private arrive() {
    this.arrived = this.g + 1;
    this.halted = false;
    this.groupImgs[this.g].forEach((im, i) => im.setPosition(STOP_X[this.g], LANES[i]));
    this.windGlows[this.g]?.setVisible(false);
    this.winds[this.g]?.setVisible(false);
    this.threat?.setVisible(false);
    this.chariots.forEach((c) => { if (c.state !== "bog") this.bog(c); });
    audio.sfx("bless");
    this.sparkleBurst(STOP_X[this.g], LANES[1] - 12, 10);
    const done = this.g;
    this.phase = "between";
    this.time.delayedCall(700, () => this.talk(STAGE7.speaker, STAGE7.groupDone[done].map(tr), () => {
      if (done < 2) this.startGroup(done + 1);
      else this.enterFinal();
    }));
  }

  // ---------------------------------------------------------------- actions

  private setLane(l: number, instant = false) {
    this.lane = l;
    const y = LANES[l] + 8;
    if (!this.pillar || !this.pillarGlow) return;
    this.tweens.killTweensOf(this.pillar);
    if (instant) this.pillar.y = y;
    else this.tweens.add({ targets: this.pillar, y, duration: 220, ease: "Stepped", easeParams: [4] });
    this.pillar.setDepth(y);
    this.pillarGlow.y = LANES[l] - 10;
  }

  private movePillar() {
    let best = 0;
    LANES.forEach((y, i) => { if (Math.abs(y - this.player.y) < Math.abs(LANES[best] - this.player.y)) best = i; });
    if (best === this.lane) return;
    this.setLane(best);
    audio.sfx("chime");
    this.sparkleBurst(PILLAR_X, LANES[best] - 10, 6);
  }

  private callWind() {
    this.steady = true;
    this.halted = false;
    audio.sfx("bless");
    const [x, y] = WIND[this.g];
    this.sparkleBurst(x, y - 6, 10);
    this.threat?.setVisible(false);
    this.windGlows[this.g].setVisible(false);
    this.winds[this.g].setVisible(false);
  }

  private bog(c: Chariot) {
    c.state = "bog";
    c.t = 900;
    audio.sfx("pickup");
    this.sparkleBurst(c.x + 10, LANES[c.lane] - 4, 8);
    if (this.time.now - this.bogToldAt > 25000) { this.bogToldAt = this.time.now; this.talk(STAGE7.speaker, [tr(STAGE7.bog)]); }
  }

  private spawnChariot() {
    const open = [0, 1, 2].filter((l) => l !== this.lastLane);
    const lane = open[Math.floor(Math.random() * open.length)];
    this.lastLane = lane;
    const img = this.add.image(-30, LANES[lane], "exodus_chariot").setOrigin(0.5, 1).setDepth(LANES[lane]).setVisible(false);
    this.chariots.push({ lane, state: "warn", x: -30, t: WARN_MS, img });
  }

  private hit(c: Chariot) {
    c.img.destroy();
    this.chariots = this.chariots.filter((o) => o !== c);
    this.sparkleBurst(this.gx, LANES[c.lane] - 10, 8);
    if (this.loseGrace()) { this.talk(STAGE7.speaker, STAGE7.lost.map(tr)); return; }
    if (this.time.now - this.hitToldAt > 15000) { this.hitToldAt = this.time.now; this.talk(STAGE7.speaker, [tr(STAGE7.hit)]); }
  }

  private closeSea() {
    this.phase = "done";
    this.mosesGlow?.setVisible(false);
    this.player.setVelocity(0, 0);
    audio.sfx("complete");
    // three chariots caught mid-sea, then the walls fall in
    const caught = [[110, LANES[0]], [150, LANES[1]], [190, LANES[2]]].map(([x, y]) => this.add.image(x, y, "exodus_chariot").setOrigin(0.5, 1).setDepth(y));
    this.sparkleBurst(MOSES[0], MOSES[1] - 18, 12);
    this.cameras.main.flash(400, 255, 244, 200);
    const mid = (Y0 + Y1) / 2;
    const stepped = { ease: "Stepped", easeParams: [8] };
    this.tweens.add({ targets: this.seaTop, height: mid - (Y0 - 8), duration: 1800, ...stepped });
    this.tweens.add({ targets: this.seaBot, y: mid, height: Y1 + 4 - mid, duration: 1800, ...stepped });
    this.tweens.add({ targets: caught, alpha: 0, y: "+=8", delay: 1500, duration: 600, ease: "Stepped", easeParams: [4] });
    this.time.delayedCall(2000, () => {
      this.tweens.add({ targets: this.dawn, alpha: 0.05, duration: 1200, ease: "Stepped", easeParams: [6] });
      this.dawn?.setFillStyle(0xfde68a, 0.2);
      this.completeStage();
      this.time.delayedCall(900, () =>
        this.talk(tx("Ấn Dấu thứ 7", "Seal 7"), STAGE7.outro.map(tr), () =>
          this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE7.lesson)], () =>
            this.talk(tx("Bờ bên kia", "The Far Shore"), STAGE7.cutscene.map(tr), () => this.goToNextStage()))));
    });
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const now = this.time.now;
    const view = this.cameras.main.worldView;

    // water walls slowly flow (whole px only)
    const sc = Math.floor(now / 140) % 16;
    this.wallTiles[0].tilePositionX = sc;
    this.wallTiles[1].tilePositionX = 16 - sc;

    // HUD pinned to the camera
    const secs = this.phase === "cross" ? `${tr(STAGE7.wall)}: ${this.halted ? tr(STAGE7.wallBad) : tr(STAGE7.wallOk)}` : "";
    const hud = this.phase === "final" ? tr(STAGE7.moses).replace("[A] ", "") : `${tr(STAGE7.progress)}: ${this.arrived}/3${secs ? `  ·  ${secs}` : ""}`;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(this.phase === "done" || this.phase === "wait" ? "" : hud);
    const rx = Math.round(view.x + 10);
    this.radar.forEach((r, i) => {
      const incoming = this.chariots.some((c) => c.lane === i && c.state !== "bog");
      const pill = this.lane === i;
      const show = this.phase === "cross" || this.phase === "between";
      const blink = Math.floor(now / 220) % 2 === 0;
      const color = incoming ? (pill ? 0x22c55e : blink ? 0xdc2626 : 0x7f1d1d) : pill ? 0xfbbf24 : 0x475569;
      r.box.setPosition(rx, LANES[i] - 6).setVisible(show);
      r.fill.setPosition(rx, LANES[i] - 6).setFillStyle(color).setVisible(show);
    });

    if (this.introActive || this.dialogueOpen) return;
    const dt = delta;

    if (this.phase === "cross") {
      // group walks east, pausing before a wall that is about to fall
      const [wx, wy] = WIND[this.g];
      const haltX = wx - HALT_BEFORE;
      if (!this.halted) {
        if (!this.steady && this.gx >= haltX) {
          this.halted = true;
          audio.sfx("wrong");
          this.threat?.setPosition(wx, wy < 160 ? 82 : 246).setVisible(true);
          this.talk(STAGE7.speaker, [tr(STAGE7.halt)]);
        } else {
          this.gx += (SPEED * dt) / 1000;
          if (this.gx >= STOP_X[this.g]) { this.gx = STOP_X[this.g]; this.arrive(); }
        }
      }
      if (this.phase === "cross") {
        const bob = Math.round(Math.sin(now / 120)) * (this.halted ? 0 : 1);
        this.groupImgs[this.g].forEach((im, i) => im.setPosition(Math.round(this.gx), LANES[i] + bob));
      }
    }

    // chariots
    if (this.phase === "cross") {
      this.spawnIn -= dt;
      if (this.spawnIn <= 0 && this.chariots.filter((c) => c.state !== "bog").length < 2) {
        this.spawnChariot();
        this.spawnIn = GAP_MS[this.g] + Math.random() * 1200;
      }
    }
    for (const c of [...this.chariots]) {
      if (c.state === "warn") {
        c.t -= dt;
        if (c.t <= 0) { c.state = "run"; c.img.setVisible(true); audio.sfx("wrong"); }
      } else if (c.state === "run") {
        c.x += (CHARIOT_SPEED * dt) / 1000;
        c.img.setPosition(Math.round(c.x), LANES[c.lane]);
        if (Math.floor(now / 90) !== Math.floor((now - dt) / 90)) {
          const d = this.add.image(Math.round(c.x - 22), LANES[c.lane] - 2, "sparkle").setDepth(LANES[c.lane] + 1).setAlpha(0.7);
          this.tweens.add({ targets: d, alpha: 0, duration: 400, onComplete: () => d.destroy() });
        }
        if (c.lane === this.lane && c.x >= PILLAR_X - 26) this.bog(c);
        else if (this.phase === "cross" && c.x + 22 >= this.gx - 8) this.hit(c);
        else if (c.x > W + 40) { c.img.destroy(); this.chariots = this.chariots.filter((o) => o !== c); }
      } else {
        c.t -= dt;
        c.img.setPosition(Math.round(c.x) + (Math.floor(now / 60) % 2 ? 1 : -1), LANES[c.lane] + Math.round((1 - Math.max(0, c.t) / 900) * 8)).setAlpha(Math.max(0, c.t / 900));
        if (c.t <= 0) { c.img.destroy(); this.chariots = this.chariots.filter((o) => o !== c); }
      }
    }
  }
}
