import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerPlagueTextures } from "@/modules/moses-the-exodus/game/utils/plagueTextures";
import { STAGE4, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 640;
const H = 240;
const TOP = 72; // top wall (collider) ends here
const BOTTOM = 180; // bottom collider starts here: the walkable band is y 72..180
const START: [number, number] = [40, 126]; // every round restarts at the left end of the courtyard
const THRONE: [number, number] = [596, 146];
const SHIELD_C: [number, number] = [596, 118];
const MAGICIANS: [number, number][] = [[548, 98], [548, 166]];
const LANES = [100, 118, 136, 154]; // smoke-ring lane centres
const RING_X = 524; // rings are born here, in front of the magicians
const GOSHEN_X = 452; // the border line round 2 draws
const SPEED = [52, 64, 76];
const EVERY = [1900, 1500, 1200]; // ms between smoke rings
const IMMUNE = 1500;
// round targets (foot positions): water columns, fence posts, light altars
const TARGETS: [number, number][][] = [
  [[170, 104], [262, 158], [354, 106]],
  [[190, 158], [282, 104], [374, 156]],
  [[386, 104], [440, 158], [492, 108]],
];
const POST_SEG: [number, number][] = [[GOSHEN_X, 92], [GOSHEN_X, 126], [GOSHEN_X, 160]]; // where the raised fence appears
const HERD: [number, number] = [292, 152];
const SHELTER: [number, number] = [232, 100];
const RIVER = [0x38bdf8, 0x9d5a86, 0xdc2626];

interface Ring { spr: Phaser.GameObjects.Sprite; x: number; y: number }
interface Target { spr: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image; x: number; y: number; done: boolean }

/** Stage 4: three rounds. Dodge the magicians' smoke rings and use God's staff on the sign altars to break Pharaoh's three shields. */
export class Stage04PharaohPlaguesScene extends BaseExodusScene {
  private phase = 0;
  private running = false;
  private finished = false;
  private immune = 0;
  private spawnIn = 0;
  private lastLane = -1;
  private hitShown = false;
  private herdDone = false;
  private rings: Ring[] = [];
  private targets: Target[][] = [];
  private shields: Phaser.GameObjects.Image[] = [];
  private river!: Phaser.GameObjects.Rectangle;
  private fenceSegs: Phaser.GameObjects.TileSprite[] = [];
  private beams: Phaser.GameObjects.Rectangle[] = [];
  private frogs: Phaser.GameObjects.Sprite[] = [];
  private magicians: Phaser.GameObjects.Sprite[] = [];
  private herdsman!: Phaser.GameObjects.Image;
  private cattle: Phaser.GameObjects.Image[] = [];
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage04PharaohPlaguesScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_04_doi_dien_pharao";
    this.spawn = START;
  }

  create() {
    this.phase = 0;
    this.running = this.finished = this.herdDone = this.hitShown = false;
    this.immune = this.spawnIn = 0;
    this.lastLane = -1;
    this.rings = [];
    this.targets = [];
    this.shields = [];
    this.fenceSegs = [];
    this.beams = [];
    this.frogs = [];
    this.magicians = [];
    this.cattle = [];
    this.intro = { illustration: "4", speaker: STAGE4.speaker, lines: STAGE4.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerSiteTextures(this);
    registerPlagueTextures(this);
    if (!this.anims.exists("site_torch")) this.anims.create({ key: "site_torch", frames: this.anims.generateFrameNumbers("site_torch", { start: 0, end: 1 }), frameRate: 5, repeat: -1 });
    if (!this.anims.exists("pl_ring")) this.anims.create({ key: "pl_ring", frames: this.anims.generateFrameNumbers("pl_ring", { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    if (!this.anims.exists("pl_frog")) this.anims.create({ key: "pl_frog", frames: this.anims.generateFrameNumbers("pl_frog", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });

    // palace courtyard: sky + Nile seen through a colonnade, sandstone wall, paved floor, red carpet to the throne
    [[0x7c2d12, 0, 12], [0xea580c, 12, 8], [0xfbbf24, 20, 8]].forEach(([c, y, h]) => this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    this.river = this.add.rectangle(0, 28, W, 18, RIVER[0]).setOrigin(0).setDepth(DEPTH.FLOOR);
    for (let x = 4; x < W; x += 20) this.add.rectangle(x, 32 + ((x / 20) % 2) * 6, 8, 1, 0xffffff, 0.4).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 46, W, TOP - 46 - 4, "site_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    for (let x = 12; x < W; x += 52) { // colonnade
      this.add.rectangle(x, 24, 10, TOP - 28, 0xd6b97b).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
      this.add.rectangle(x + 7, 24, 3, TOP - 28, 0x92704a).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
      this.add.rectangle(x - 2, 22, 14, 3, 0xfbbf24).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    }
    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "exodus_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(16, 110, 534, 32, 0xb91c1c).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(16, 110, 534, 2, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(16, 140, 534, 2, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG);
    for (let x = 28; x < 550; x += 24) this.add.rectangle(x, 124, 6, 2, 0xfde68a).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);
    // below the band: the palace's low wall, dark so it reads as "cannot walk here"
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "site_wall").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, 0, W, H, 0xea580c, 0.07).setOrigin(0).setDepth(DEPTH.LIGHT); // hot Egyptian light
    this.add.rectangle(W - 110, TOP - 4, 110, H - TOP + 4, 0xfbbf24, 0.1).setOrigin(0).setDepth(DEPTH.LIGHT); // glow around the throne

    // colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);

    // dressing: torches, banners/towers on the top edge, pots, parked chariots below
    for (const x of [30, 150, 270, 390, 510]) this.torch(x, 70);
    for (const x of [90, 330, 450]) this.add.image(x, 76, "site_tower").setOrigin(0.5, 1).setDepth(76);
    for (const [x, y] of [[26, 176], [610, 176]]) this.add.image(x, y, "site_pot").setOrigin(0.5, 1).setDepth(y);
    this.add.image(180, 218, "exodus_chariot").setOrigin(0.5, 1).setDepth(218);
    this.add.image(420, 220, "exodus_chariot").setOrigin(0.5, 1).setDepth(220).setFlipX(true);

    // Pharaoh on his throne behind three shields; two magicians; Moses and Aaron at the top and bottom edge
    this.add.image(THRONE[0], THRONE[1], "pl_throne").setOrigin(0.5, 1).setDepth(THRONE[1]);
    this.add.image(THRONE[0], THRONE[1] - 10, "exodus_pharaoh").setOrigin(0.5, 1).setDepth(THRONE[1] + 1);
    this.block(THRONE[0], THRONE[1] - 6, 36, 12);
    for (const [x, y] of MAGICIANS) this.magicians.push(this.add.sprite(x, y, "pl_magician").setOrigin(0.5, 1).setDepth(y));
    this.add.image(480, 90, "exodus_moses_leader").setOrigin(0.5, 1).setDepth(90);
    this.add.image(480, 172, "exodus_aaron").setOrigin(0.5, 1).setDepth(172);
    [0, 1, 2].forEach((i) => {
      const s = this.add.image(SHIELD_C[0], SHIELD_C[1], `pl_shield${i}`).setDepth(DEPTH.FX - 5 + i).setAlpha(0.9);
      this.tweens.add({ targets: s, alpha: 0.55, duration: 700 + i * 120, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.shields.push(s);
    });

    // round 1 columns, round 2 posts (+ the fence they raise), round 3 altars (+ beams)
    TARGETS.forEach((round, r) => {
      const key = r === 0 ? "pl_column" : r === 1 ? "pl_post" : "pl_altar";
      this.targets.push(round.map(([x, y]) => {
        const spr = r === 1 ? this.add.image(x, y, key) : this.add.sprite(x, y, key, 0);
        spr.setOrigin(0.5, 1).setDepth(y);
        const g = this.add.image(x, y - 12, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.5);
        this.tweens.add({ targets: g, alpha: 0.9, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
        spr.setData("glow", g);
        return { spr, x, y, done: false };
      }));
    });
    POST_SEG.forEach(([x, y]) => this.fenceSegs.push(this.add.tileSprite(x, y, 10, 30, "site_fence").setDepth(y).setVisible(false)));
    TARGETS[2].forEach(([x, y]) => this.beams.push(this.add.rectangle(x, 0, 6, y - 16, 0xfde68a, 0.4).setOrigin(0.5, 0).setDepth(DEPTH.FX - 8).setVisible(false)));

    // round 1 frogs; round 3 herdsman, cattle and shelter
    for (let i = 0; i < 4; i++) {
      const f = this.add.sprite(400 + i * 36, 150 - (i % 2) * 38, "pl_frog").setOrigin(0.5, 1).setDepth(150).setVisible(false);
      this.frogs.push(f);
    }
    this.add.image(SHELTER[0], SHELTER[1], "pl_shelter").setOrigin(0.5, 1).setDepth(SHELTER[1]);
    this.herdsman = this.add.image(HERD[0], HERD[1], "exodus_slave").setOrigin(0.5, 1).setDepth(HERD[1]).setVisible(false);
    for (const [x, y] of [[HERD[0] + 18, HERD[1] + 6], [HERD[0] - 18, HERD[1] + 8]]) this.cattle.push(this.add.image(x, y, "exodus_lamb").setOrigin(0.5, 1).setDepth(y).setVisible(false));

    // interactables
    TARGETS.forEach((round, r) => round.forEach(([x, y], i) => {
      const hint = r === 0 ? STAGE4.columnHint : r === 1 ? STAGE4.postHint : STAGE4.beamHint;
      this.interactables.push({
        x, y: y - 12, r: 26, label: tr(hint),
        active: () => this.phase === r && this.running && !this.targets[r][i].done && (r < 2 || this.herdDone),
        act: () => this.touch(r, i),
      });
    }));
    this.interactables.push({
      x: HERD[0], y: HERD[1] - 14, r: 30, label: tr(STAGE4.herdHint),
      active: () => this.phase === 2 && this.running && !this.herdDone, act: () => this.shelterCattle(),
    });

    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  private torch(x: number, y: number) {
    this.add.image(x, y - 8, "exodus_glow_fire").setDepth(y - 1).setAlpha(0.5);
    this.add.sprite(x, y, "site_torch").setOrigin(0.5, 1).setDepth(y).play("site_torch");
  }

  protected onStageStart() {
    this.talk(STAGE4.speaker, STAGE4.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  // ---------------------------------------------------------------- rounds

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = false;
    this.immune = 0;
    this.spawnIn = 1800;
    this.lastLane = -1;
    this.herdDone = false;
    this.initGrace(3);
    this.clearRings();
    this.player.setAlpha(1);

    this.targets.forEach((round, r) => round.forEach((t) => {
      t.done = false;
      if (t.spr instanceof Phaser.GameObjects.Sprite) t.spr.setFrame(0);
      t.spr.setVisible(r === n);
      (t.spr.getData("glow") as Phaser.GameObjects.Image).setVisible(r === n);
    }));
    this.shields.forEach((s, i) => s.setVisible(i >= n));
    this.river.setFillStyle(RIVER[n === 0 ? 0 : 2]);
    this.frogs.forEach((f) => f.setVisible(n >= 1).play("pl_frog"));
    this.fenceSegs.forEach((f) => f.setVisible(n >= 2));
    this.beams.forEach((b) => b.setVisible(false));
    this.herdsman.setVisible(n === 2);
    this.cattle.forEach((c, i) => c.setVisible(n === 2).setPosition(HERD[0] + (i ? -18 : 18), HERD[1] + (i ? 8 : 6)).setDepth(HERD[1] + 6));
    this.magicians.forEach((m, i) => m.setPosition(MAGICIANS[i][0], MAGICIANS[i][1]));

    this.saveCheckpoint(`round${n}`, n, START[0], START[1]);
    this.player.setVelocity(0, 0);
    this.player.setPosition(START[0], START[1]);
    if (intro && n > 0) this.cameras.main.flash(300, 15, 23, 42);

    const go = () => { this.running = true; };
    if (!intro) this.time.delayedCall(500, go);
    else this.talk(STAGE4.speaker, (n === 0 ? STAGE4.round1 : n === 1 ? STAGE4.round2 : STAGE4.round3).map(tr), go);
  }

  private touch(r: number, i: number) {
    const t = this.targets[r][i];
    t.done = true;
    audio.sfx("chime");
    this.sparkleBurst(t.x, t.y - 12, 8);
    if (t.spr instanceof Phaser.GameObjects.Sprite) t.spr.setFrame(1);
    (t.spr.getData("glow") as Phaser.GameObjects.Image).setAlpha(0.2);
    const n = this.targets[r].filter((o) => o.done).length;
    if (r === 0) this.river.setFillStyle(RIVER[Math.min(2, n)]);
    if (r === 1) {
      this.fenceSegs[i].setVisible(true);
      this.sparkleBurst(POST_SEG[i][0], POST_SEG[i][1] - 14, 6);
    }
    if (r === 2) this.beams[i].setVisible(true);
    if (n === this.targets[r].length) this.breakShield(r);
  }

  private shelterCattle() {
    this.herdDone = true;
    audio.sfx("pickup");
    this.cattle.forEach((c, i) => this.tweens.add({ targets: c, x: SHELTER[0] - 8 + i * 16, y: SHELTER[1] - 2 + i * 2, duration: 1400, ease: "Sine.easeInOut", onUpdate: () => c.setDepth(c.y) }));
    this.tweens.add({ targets: this.herdsman, x: SHELTER[0] + 26, y: SHELTER[1] + 6, duration: 1400, ease: "Sine.easeInOut", onUpdate: () => this.herdsman.setDepth(this.herdsman.y) });
    this.talk(STAGE4.speaker, STAGE4.herdDone.map(tr));
  }

  private breakShield(r: number) {
    this.running = false;
    this.clearRings();
    audio.sfx("bless");
    this.cameras.main.flash(250, 255, 244, 200);
    const s = this.shields[r];
    this.tweens.killTweensOf(s);
    this.tweens.add({ targets: s, alpha: 0, duration: 500, ease: "Stepped", easeParams: [4], onComplete: () => s.setVisible(false) });
    this.sparkleBurst(SHIELD_C[0], SHIELD_C[1], 12);
    this.magicians.forEach((m, i) => this.tweens.add({ targets: m, x: m.x + 10, duration: 300, yoyo: true, ease: "Stepped", easeParams: [2], delay: i * 80 }));
    const lines = r === 0 ? STAGE4.round1Done : r === 1 ? STAGE4.round2Done : STAGE4.pharaoh;
    this.time.delayedCall(700, () => this.talk(r === 0 ? "Thuật sĩ" : STAGE4.speaker, lines.map(tr), () => (r < 2 ? this.startPhase(r + 1) : this.won())));
  }

  private won() {
    this.finished = true;
    this.running = false;
    audio.sfx("complete");
    this.completeStage();
    this.talk("Ấn Dấu thứ 4", STAGE4.outro.map(tr), () =>
      this.talk("Suy niệm", [tr(STAGE4.lesson)], () =>
        this.talk("Trước Đêm Tối Dày Đặc", STAGE4.cutscene.map(tr), () => this.goToNextStage())));
  }

  // ---------------------------------------------------------------- smoke rings

  private spawnRing() {
    let lane = Phaser.Math.Between(0, LANES.length - 1);
    if (lane === this.lastLane) lane = (lane + 1 + Phaser.Math.Between(0, LANES.length - 2)) % LANES.length;
    this.lastLane = lane;
    const y = LANES[lane];
    const spr = this.add.sprite(RING_X, y, "pl_ring").setDepth(y + 20).play("pl_ring");
    this.rings.push({ spr, x: RING_X, y });
    this.sparkleBurst(RING_X, y, 3);
  }

  private clearRings() {
    this.rings.forEach((r) => r.spr.destroy());
    this.rings = [];
  }

  private hit(ring: Ring) {
    this.rings = this.rings.filter((o) => o !== ring);
    ring.spr.destroy();
    this.sparkleBurst(ring.x, ring.y, 5);
    if (this.loseGrace()) return; // out of pips: the base scene soft-reset the round
    this.immune = IMMUNE;
    if (!this.hitShown) {
      this.hitShown = true;
      this.talk(STAGE4.speaker, STAGE4.hit.map(tr));
    }
  }

  // ---------------------------------------------------------------- frame update

  private labelText(): string {
    if (this.finished) return "";
    const done = this.phase < 2 ? this.targets[this.phase].filter((t) => t.done).length : this.targets[2].filter((t) => t.done).length + (this.herdDone ? 1 : 0);
    const total = this.phase < 2 ? 3 : 4;
    return `${tr(STAGE4.phase[this.phase])} (${done}/${total})`;
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const dt = Math.min(delta, 50) / 1000;
    const p = this.player;
    const view = this.cameras.main.worldView;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(this.labelText());

    // frogs hop on the spot
    const t = time ?? 0;
    this.frogs.forEach((f, i) => { if (f.visible) f.setY(150 - (i % 2) * 38 - (Math.floor(t / 400 + i) % 3 === 0 ? 3 : 0)); });

    if (!this.running || this.introActive || this.dialogueOpen) return;
    this.immune = Math.max(0, this.immune - delta);
    p.setAlpha(this.immune > 0 && Math.floor(t / 100) % 2 ? 0.4 : 1);

    this.spawnIn -= delta;
    if (this.spawnIn <= 0) {
      this.spawnIn = EVERY[this.phase];
      this.spawnRing();
    }
    for (const r of [...this.rings]) {
      r.x -= SPEED[this.phase] * dt;
      if (r.x < 20) { r.spr.destroy(); this.rings = this.rings.filter((o) => o !== r); continue; }
      r.spr.setPosition(Math.round(r.x), r.y);
      if (this.immune <= 0 && Math.abs(p.x - r.x) < 9 && Math.abs(p.y + 2 - r.y) < 10) {
        this.hit(r);
        if (!this.running) return;
      }
    }
  }
}
