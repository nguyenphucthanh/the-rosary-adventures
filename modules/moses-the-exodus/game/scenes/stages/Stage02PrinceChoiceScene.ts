import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { STAGE2, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 760;
const H = 240;
const TOP = 72; // top wall (collider) ends here
const BOTTOM = 180; // bottom collider starts here: the walkable band is y 72..180, about 100px tall
const START: [number, number][] = [[44, 118], [272, 118], [536, 118]]; // player start of each phase
const FENCE_X = 256; // site fence, closed until the rescue is done
const GATES = [330, 400, 470]; // city-gate walls (16px wide, opening at y 96..144)
const OPEN_Y: [number, number] = [96, 144];
const OASIS_X = 516; // walking past here ends the escape
const POT: [number, number] = [24, 134]; // clay pot (foot position)
const SLAVES: [number, number][] = [[62, 106], [136, 150], [198, 104]]; // old ones who need water (foot positions)
const OVERSEER: [number, number] = [226, 150];
const VICTIM: [number, number] = [226, 122];
const MOUND: [number, number] = [204, 168];
const WELL: [number, number] = [640, 120];
const TROUGHS = [596, 636, 676, 716];
const TROUGH_Y = 156;
const WAVES: [number, number][][] = [[[528, 100], [528, 140]], [[528, 92], [528, 120], [528, 148]]]; // shepherd spawn points
const REACH = 17; // half width of a guard's red zone; its half height is 15

interface Sentry { spr: Phaser.GameObjects.Image; zone: Phaser.GameObjects.Rectangle; x: number; y: number; y0: number; y1: number; v: number; dir: 1 | -1 }
interface Bully { spr: Phaser.GameObjects.Image; x: number; y: number; v: number; state: "come" | "flee" }

/** Stage 2: carry water past the guards, escape three city gates, then drive the shepherds off and fill the troughs at the well of Midian. */
export class Stage02PrinceChoiceScene extends BaseExodusScene {
  private phase = 0;
  private step = 0; // phase 0: 0 = bring water, 1 = overseer, 2 = bury
  private running = false;
  private finished = false;
  private carrying = false;
  private immune = 0;
  private served = [false, false, false];
  private filled = [false, false, false, false];
  private watering = false;
  private wave = 0;
  private waveId = 0;
  private waveLeft = 0;
  private sentries: Sentry[] = [];
  private bullies: Bully[] = [];
  private moses!: Phaser.GameObjects.Image;
  private carry!: Phaser.GameObjects.Image;
  private overseer!: Phaser.GameObjects.Image;
  private victim!: Phaser.GameObjects.Image;
  private mound!: Phaser.GameObjects.Image;
  private fence?: { set: (v: boolean) => void };
  private troughs: Phaser.GameObjects.Sprite[] = [];
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage02PrinceChoiceScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_02_hoang_tu_va_gieng_nuoc_madian";
    this.spawn = START[0];
  }

  create() {
    this.phase = this.step = this.wave = this.waveId = this.waveLeft = 0;
    this.running = this.finished = this.carrying = this.watering = false;
    this.immune = 0;
    this.served = [false, false, false];
    this.filled = [false, false, false, false];
    this.sentries = [];
    this.bullies = [];
    this.troughs = [];
    this.intro = { illustration: "2", speaker: STAGE2.speaker, lines: STAGE2.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerSiteTextures(this);
    if (!this.anims.exists("site_torch")) this.anims.create({ key: "site_torch", frames: this.anims.generateFrameNumbers("site_torch", { start: 0, end: 1 }), frameRate: 5, repeat: -1 });

    // floors: brick yard, night paving of the city, desert sand + oasis grass
    this.add.tileSprite(0, TOP - 4, 262, H - TOP + 4, "site_dirt").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(262, TOP - 4, 238, H - TOP + 4, "exodus_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(500, TOP - 4, W - 500, H - TOP + 4, "exodus_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(588, 76, W - 588, 112, "site_grass").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(0, 0, 500, TOP - 4, "site_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(500, 0, W - 500, TOP - 4, "exodus_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, 262, H, 0xdc2626, 0.07).setOrigin(0).setDepth(DEPTH.LIGHT); // red Egyptian sunset over the site
    this.add.rectangle(262, 0, 238, H, 0x0f172a, 0.4).setOrigin(0).setDepth(DEPTH.LIGHT); // night over the city gates

    // colliders: top wall, bottom edge, side edges
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.fence = this.door(FENCE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "site_fence", true);

    // torches along the top wall of the site and gates
    for (const x of [30, 120, 210, 300, 390, 480]) this.torch(x, 66);
    for (const x of [100, 220]) this.add.image(x, 76, "site_tower").setOrigin(0.5, 1).setDepth(76);

    // brick site dressing: clay pot, brick piles, workers on the lower edge
    this.add.image(POT[0], POT[1], "site_pot").setOrigin(0.5, 1).setDepth(POT[1]);
    this.glow(POT[0], POT[1] - 10);
    for (const [x, y] of [[40, 200], [150, 210], [230, 200]]) this.add.image(x, y, "site_bricks").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[84, 204], [196, 208]]) this.add.image(x, y, "exodus_slave").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[18, 96], [244, 168]]) this.add.image(x, y, "site_bricks").setOrigin(0.5, 1).setDepth(y);

    // the three who need water
    SLAVES.forEach(([x, y]) => { this.add.image(x, y, "exodus_slave").setOrigin(0.5, 1).setDepth(y); this.glow(x, y - 12); });
    this.victim = this.add.image(VICTIM[0], VICTIM[1], "exodus_slave").setOrigin(0.5, 1).setDepth(VICTIM[1]).setVisible(false);
    this.overseer = this.add.image(OVERSEER[0], OVERSEER[1], "exodus_overseer").setOrigin(0.5, 1).setDepth(OVERSEER[1]).setVisible(false);
    this.mound = this.add.image(MOUND[0], MOUND[1], "site_mound").setOrigin(0.5, 1).setDepth(MOUND[1]).setVisible(false);

    // city gates: wall columns with a lit opening, parked chariots, banners of Egypt
    for (const gx of GATES) {
      this.add.tileSprite(gx, (TOP - 4 + OPEN_Y[0]) / 2, 16, OPEN_Y[0] - (TOP - 4), "site_wall").setDepth(OPEN_Y[0]);
      this.add.tileSprite(gx, (OPEN_Y[1] + H) / 2, 16, H - OPEN_Y[1], "site_wall").setDepth(H);
      this.block(gx, OPEN_Y[0] / 2, 16, OPEN_Y[0]);
      this.block(gx, (OPEN_Y[1] + H) / 2, 16, H - OPEN_Y[1]);
      this.torch(gx - 12, OPEN_Y[0] + 2);
      this.torch(gx - 12, OPEN_Y[1] + 14);
    }
    this.add.image(300, 214, "exodus_chariot").setOrigin(0.5, 1).setDepth(214);
    this.add.image(440, 216, "exodus_chariot").setOrigin(0.5, 1).setDepth(216).setFlipX(true);

    // oasis: well, troughs with thirsty lambs, Jethro's daughters, tent, rocks
    this.add.image(WELL[0], WELL[1], "site_well").setOrigin(0.5, 1).setDepth(WELL[1]);
    this.block(WELL[0], WELL[1] - 6, 22, 10);
    this.glow(WELL[0], WELL[1] - 16);
    TROUGHS.forEach((x, i) => {
      this.troughs.push(this.add.sprite(x, TROUGH_Y, "site_trough", 0).setOrigin(0.5, 1).setDepth(TROUGH_Y));
      this.add.image(x, 178, "exodus_lamb").setOrigin(0.5, 1).setDepth(178).setFlipX(i % 2 === 1);
    });
    for (let i = 0; i < 7; i++) {
      const x = i < 4 ? 676 + i * 20 : 686 + (i - 4) * 20;
      const y = i < 4 ? 88 : 102;
      this.add.image(x, y, `exodus_girl${i}`).setOrigin(0.5, 1).setDepth(y);
    }
    this.add.image(738, 80, "site_tent").setOrigin(0.5, 1).setDepth(80);
    for (const [x, y] of [[546, 82], [580, 176], [520, 176], [610, 84]]) this.add.image(x, y, "site_rock").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[560, 150], [598, 88], [750, 170], [532, 94]]) this.add.image(x, y, "site_shrub").setOrigin(0.5, 1).setDepth(y);

    // interactables
    this.interactables.push(
      { x: POT[0], y: POT[1] - 16, r: 30, label: tr(STAGE2.potHint), active: () => this.phase === 0 && this.step === 0 && !this.carrying && this.served.includes(false), act: () => this.takeJar() },
      ...SLAVES.map(([x, y], i) => ({ x, y: y - 16, r: 30, label: tr(STAGE2.slaveHint), active: () => this.phase === 0 && this.step === 0 && this.carrying && !this.served[i], act: () => this.serve(i) })),
      { x: OVERSEER[0], y: OVERSEER[1] - 16, r: 32, label: tr(STAGE2.strikeHint), active: () => this.phase === 0 && this.step === 1, act: () => this.strike() },
      { x: MOUND[0], y: MOUND[1] - 16, r: 30, label: tr(STAGE2.buryHint), active: () => this.phase === 0 && this.step === 2, act: () => this.bury() },
      { x: WELL[0], y: WELL[1] - 16, r: 32, label: tr(STAGE2.wellHint), active: () => this.phase === 2 && this.watering && !this.carrying && this.filled.includes(false), act: () => this.drawWater() },
      ...TROUGHS.map((x, i) => ({ x, y: TROUGH_Y - 16, r: 30, label: tr(STAGE2.troughHint), active: () => this.phase === 2 && this.watering && this.carrying && !this.filled[i], act: () => this.fillTrough(i) })),
    );

    // Moses follows the child; the carried jar / bucket floats above the head
    this.moses = this.add.image(START[0][0] - 20, START[0][1] + 16, "exodus_moses_prince").setOrigin(0.5, 1);
    this.carry = this.add.image(0, 0, "site_jar").setOrigin(0.5, 1).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  private torch(x: number, y: number) {
    this.add.image(x, y - 8, "exodus_glow_fire").setDepth(y - 1).setAlpha(0.5);
    this.add.sprite(x, y, "site_torch").setOrigin(0.5, 1).setDepth(y).play("site_torch");
  }

  private glow(x: number, y: number) {
    const g = this.add.image(x, y, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.45);
    this.tweens.add({ targets: g, alpha: 0.8, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
  }

  protected onStageStart() {
    this.talk(STAGE2.speaker, STAGE2.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  // ---------------------------------------------------------------- phases

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = false;
    this.immune = 0;
    this.initGrace(3);
    this.carrying = false;
    this.waveId++;
    this.wave = 0;
    this.watering = false;
    this.clearSentries();
    this.clearBullies();
    this.fence?.set(n === 0);
    if (n === 0) {
      this.served = [false, false, false];
      this.step = 0;
      this.overseer.setVisible(false);
      this.victim.setVisible(false);
      this.mound.setVisible(false);
      this.makeSentry(100, 88, 172, 42, 90, 1);
      this.makeSentry(170, 88, 172, 36, 170, -1);
    } else if (n === 1) {
      GATES.forEach((gx, i) => this.makeSentry(gx - 26, 88, 172, 46, i % 2 ? 172 : 88, i % 2 ? -1 : 1));
    } else {
      this.filled = [false, false, false, false];
      this.troughs.forEach((t) => t.setFrame(0));
    }
    this.moses.setTexture(n === 2 ? "exodus_moses_shepherd" : "exodus_moses_prince");
    this.saveCheckpoint(`phase${n}`, n, START[n][0], START[n][1]);
    this.player.setVelocity(0, 0);
    this.player.setPosition(START[n][0], START[n][1]);
    this.moses.setPosition(START[n][0] - 20, START[n][1] + 16);
    if (intro && n > 0) this.cameras.main.flash(300, 15, 23, 42);

    const go = () => { this.running = true; if (n === 2) this.spawnWave(0); };
    if (!intro) this.time.delayedCall(500, go);
    else if (n === 1) this.talk(STAGE2.speaker, STAGE2.betray.map(tr), go);
    else if (n === 2) this.talk(STAGE2.speaker, STAGE2.oasis.map(tr), go);
    else go();
  }

  // ---------------------------------------------------------------- phase 1: water and the rescue

  private takeJar() {
    this.carrying = true;
    this.carry.setTexture("site_jar");
    audio.sfx("pickup");
  }

  private serve(i: number) {
    this.served[i] = true;
    this.carrying = false;
    audio.sfx("chime");
    this.sparkleBurst(SLAVES[i][0], SLAVES[i][1] - 16, 6);
    const thanks = () => this.talk("Anh em Híp-ri", [tr(STAGE2.thanks[i])], this.served.every(Boolean) ? () => this.talk(STAGE2.speaker, STAGE2.rescue.map(tr), () => this.beginRescue()) : undefined);
    thanks();
  }

  private beginRescue() {
    this.clearSentries(); // the guards look away while the overseer shouts
    this.overseer.setVisible(true);
    this.victim.setVisible(true);
    this.step = 1;
    this.sparkleBurst(OVERSEER[0], OVERSEER[1] - 16, 6);
  }

  private strike() {
    this.step = 2;
    audio.sfx("wrong");
    this.cameras.main.shake(150, 0.004);
    this.overseer.setVisible(false);
    this.victim.setVisible(false);
    this.mound.setVisible(true);
    this.talk(STAGE2.speaker, STAGE2.strike.map(tr));
  }

  private bury() {
    this.step = 3;
    audio.sfx("chime");
    this.talk(STAGE2.speaker, STAGE2.bury.map(tr), () => {
      audio.sfx("bless");
      this.startPhase(1);
    });
  }

  // ---------------------------------------------------------------- guards (phases 1 and 2)

  private makeSentry(x: number, y0: number, y1: number, v: number, y: number, dir: 1 | -1) {
    const spr = this.add.image(x, y, "exodus_guard").setOrigin(0.5, 1).setDepth(y);
    const zone = this.add.rectangle(x, y - 16, REACH * 2, 30, 0xdc2626, 0.22).setDepth(DEPTH.LIGHT);
    this.sentries.push({ spr, zone, x, y, y0, y1, v, dir });
  }

  private clearSentries() {
    this.sentries.forEach((s) => { s.spr.destroy(); s.zone.destroy(); });
    this.sentries = [];
  }

  private seen() {
    const p = this.player;
    return this.sentries.some((s) => Math.abs(p.x - s.x) < REACH && Math.abs(p.y - (s.y - 16)) < 15);
  }

  private caught() {
    this.running = false;
    const dropAt: [number, number] = this.phase === 0
      ? START[0]
      : [GATES.filter((gx) => this.player.x > gx + 16).length ? GATES.filter((gx) => this.player.x > gx + 16).slice(-1)[0] + 18 : START[1][0], START[1][1]];
    if (this.loseGrace()) return; // out of pips: the base scene already soft-reset to the phase start
    this.carrying = false;
    this.talk("Lính canh", (this.phase === 0 ? STAGE2.caught : STAGE2.gateCaught).map(tr), () => {
      this.player.setVelocity(0, 0);
      this.player.setPosition(dropAt[0], dropAt[1]);
      this.immune = 1500;
      this.running = true;
    });
  }

  // ---------------------------------------------------------------- phase 3: the well of Midian

  private spawnWave(w: number) {
    this.wave = w;
    const id = this.waveId;
    this.waveLeft = WAVES[w].length;
    WAVES[w].forEach(([x, y], i) =>
      this.time.delayedCall(900 + i * 1100, () => {
        if (id !== this.waveId) return;
        const spr = this.add.image(x, y, "exodus_bully").setOrigin(0.5, 1).setDepth(y);
        this.bullies.push({ spr, x, y, v: 28 + w * 8, state: "come" });
      })
    );
  }

  private clearBullies() {
    this.bullies.forEach((b) => b.spr.destroy());
    this.bullies = [];
  }

  private repel(b: Bully) {
    b.state = "flee";
    this.waveLeft--;
    audio.sfx("pickup");
    this.sparkleBurst(b.x, b.y - 16, 5);
    if (this.waveLeft > 0) return;
    if (this.wave + 1 < WAVES.length) {
      this.running = false;
      this.talk(STAGE2.speaker, STAGE2.wave2.map(tr), () => { this.running = true; this.spawnWave(this.wave + 1); });
    } else {
      this.watering = true;
      this.talk(STAGE2.speaker, STAGE2.waterStart.map(tr));
    }
  }

  protected useStaff(): boolean {
    if (this.phase !== 2 || !this.running) return false;
    const p = this.player;
    const near = this.bullies.find((b) => b.state === "come" && Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y - 16) < 36);
    if (near) this.repel(near);
    return true;
  }

  private drawWater() {
    this.carrying = true;
    this.carry.setTexture("site_bucket");
    audio.sfx("pickup");
    this.sparkleBurst(WELL[0], WELL[1] - 16, 6);
  }

  private fillTrough(i: number) {
    this.filled[i] = true;
    this.carrying = false;
    this.troughs[i].setFrame(1);
    audio.sfx("chime");
    this.sparkleBurst(TROUGHS[i], TROUGH_Y - 8, 8);
    if (this.filled.every(Boolean)) this.won();
  }

  private won() {
    this.finished = true;
    this.running = false;
    audio.sfx("complete");
    this.completeStage();
    this.talk("Giê-trô", STAGE2.done.map(tr), () =>
      this.talk("Ấn Dấu thứ 2", STAGE2.outro.map(tr), () =>
        this.talk("Suy niệm", [tr(STAGE2.lesson)], () =>
          this.talk("Bốn Mươi Năm Trong Thung Lũng Khiêm Nhường", STAGE2.cutscene.map(tr), () => this.goToNextStage()))));
  }

  // ---------------------------------------------------------------- frame update

  private labelText(): string {
    if (this.finished) return "";
    if (this.phase === 0) return `${tr(STAGE2.phase[0])} ${this.step === 0 ? `(${this.served.filter(Boolean).length}/3)` : ""}`;
    if (this.phase === 1) return `${tr(STAGE2.phase[1])} (${GATES.filter((gx) => this.player.x > gx + 16).length}/3)`;
    if (!this.watering) return `${tr(STAGE2.waveLabel)} ${Math.min(this.wave + 1, WAVES.length)}/${WAVES.length}: [A] vung gậy`;
    return tr(STAGE2.waterLabel).replace("{n}", String(this.filled.filter(Boolean).length));
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const dt = Math.min(delta, 50) / 1000;
    const p = this.player;
    const view = this.cameras.main.worldView;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(this.labelText());

    // carried jar / bucket
    // held in the hands at chest height, on the side the child faces (behind the body when walking up)
    const dir = p.getDirection();
    const hx = dir === "left" ? -9 : dir === "right" ? 9 : 0;
    const hy = dir === "up" ? 6 : 12;
    this.carry.setVisible(this.carrying).setPosition(Math.round(p.x + hx), Math.round(p.y + hy)).setDepth(p.y + (dir === "up" ? 15 : 17));
    // Moses follows a few steps behind
    const dx = p.x - this.moses.x;
    const dy = p.y + 16 - this.moses.y;
    const d = Math.hypot(dx, dy);
    if (d > 30) {
      const s = Math.min(150 * dt, d - 30);
      this.moses.x += (dx / d) * s;
      this.moses.y += (dy / d) * s;
    }
    this.moses.setPosition(Math.round(this.moses.x), Math.round(this.moses.y)).setDepth(this.moses.y);

    if (!this.running || this.introActive || this.dialogueOpen) return;
    this.immune = Math.max(0, this.immune - delta);

    for (const s of this.sentries) {
      s.y += s.dir * s.v * dt;
      if (s.y > s.y1) { s.y = s.y1; s.dir = -1; } else if (s.y < s.y0) { s.y = s.y0; s.dir = 1; }
      s.spr.setPosition(s.x, Math.round(s.y)).setDepth(s.y);
      s.zone.setPosition(s.x, Math.round(s.y - 16)).setAlpha(this.immune > 0 ? 0.08 : 0.22);
    }
    if (this.immune <= 0 && this.seen()) return this.caught();

    if (this.phase === 1 && p.x >= OASIS_X) {
      audio.sfx("bless");
      this.startPhase(2);
      return;
    }

    if (this.phase === 2) {
      const gen = this.waveId;
      for (const b of [...this.bullies]) {
        if (b.state === "flee") {
          b.x -= 110 * dt;
          b.spr.setPosition(Math.round(b.x), b.y).setAlpha(Math.max(0, (b.x - 500) / 40));
          if (b.x < 500) { b.spr.destroy(); this.bullies = this.bullies.filter((o) => o !== b); }
          continue;
        }
        const tx = WELL[0] - b.x;
        const ty = WELL[1] - b.y;
        const dist = Math.hypot(tx, ty);
        if (dist < 22) {
          this.repel(b); // reached the well: the girls are scared and the shepherd runs off
          if (this.loseGrace() || gen !== this.waveId) return;
          audio.sfx("wrong");
          continue;
        }
        b.x += (tx / dist) * b.v * dt;
        b.y += (ty / dist) * b.v * dt;
        b.spr.setPosition(Math.round(b.x), Math.round(b.y)).setDepth(b.y);
      }
    }
  }
}
