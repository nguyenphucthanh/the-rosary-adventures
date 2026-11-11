import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerSeaTextures } from "@/modules/moses-the-exodus/game/utils/seaTextures";
import { registerMaraTextures } from "@/modules/moses-the-exodus/game/utils/maraTextures";
import { STAGE8, tr } from "@/modules/moses-the-exodus/data/dialogues";
import { PAL } from "@/modules/shared/game/utils/pixelArt";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 352;
const H = 300;
const X0 = 24, X1 = 328, Y0 = 72, Y1 = 268;
const SONG_START: [number, number] = [176, 248];
const MARAH_START: [number, number] = [176, 228];
// rhythm: three verses, each faster
const VERSES = [
  { notes: 8, gap: 1000, speed: 60 },
  { notes: 10, gap: 850, speed: 80 },
  { notes: 12, gap: 720, speed: 100 },
];
const TRACK_LEN = 140, HIT_WINDOW = 14, NEED = 0.6;
// Marah: three pools, each fed by a mud channel with a dam stone
const POOL_X = [64, 168, 272];
const POOL_FOOT = 150, STONE_Y = 120, CHANNEL_TOP = 72;
const LOG_X = [84, 176, 268], LOG_Y = 252;
const GATE: [number, number] = [322, 152];
const MUD_Y = 198, MUD_SPEED = 46;
const POLLUTE_MS = 4500;
const BROWN = Phaser.Display.Color.HexStringToColor(PAL.u).color;

type Phase = "wait" | "song" | "marah" | "done";
interface Note { t0: number; resolved: boolean; img: Phaser.GameObjects.Sprite }
interface Pool { x: number; closed: boolean; sweet: boolean; stable: boolean; polluteAt: number; img: Phaser.GameObjects.Image; stone: Phaser.GameObjects.Sprite; mud: Phaser.GameObjects.TileSprite; glow: Phaser.GameObjects.Image }
interface Log { x: number; taken: boolean; used: boolean; img: Phaser.GameObjects.Image; glow: Phaser.GameObjects.Image }

/** Stage 8: beat Miriam's tambourine in three verses, then sweeten the three bitter pools of Marah with dam stones and healing logs. */
export class Stage08MiriamMaraScene extends BaseExodusScene {
  private phase: Phase = "wait";
  private shoreObjs: (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible)[] = [];
  private marahObjs: (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible)[] = [];
  private marahBodies: Phaser.GameObjects.Rectangle[] = [];
  private shoreBodies: Phaser.GameObjects.Rectangle[] = [];
  // rhythm
  private verse = 0;
  private verseOn = false;
  private spawned = 0;
  private nextSpawn = 0;
  private hits = 0;
  private notes: Note[] = [];
  private miriam?: Phaser.GameObjects.Image;
  private track?: Phaser.GameObjects.Rectangle;
  private ring?: Phaser.GameObjects.Image;
  // marah
  private pools: Pool[] = [];
  private logs: Log[] = [];
  private carrying = -1;
  private carryImg?: Phaser.GameObjects.Image;
  private mudBlobs: Phaser.GameObjects.Rectangle[] = [];
  private mudToldAt = 0;
  private pollToldAt = 0;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage08MiriamMaraScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_08_khuc_ca_nuoc_mara";
    this.spawn = SONG_START;
  }

  create() {
    this.phase = "wait";
    this.shoreObjs = [];
    this.marahObjs = [];
    this.marahBodies = [];
    this.shoreBodies = [];
    this.notes = [];
    this.pools = [];
    this.logs = [];
    this.mudBlobs = [];
    this.verse = this.spawned = this.hits = 0;
    this.verseOn = false;
    this.carrying = -1;
    this.mudToldAt = this.pollToldAt = 0;
    this.intro = { illustration: "8", speaker: STAGE8.speaker, lines: STAGE8.intro.map(tr) };
    super.create();
  }

  // ---------------------------------------------------------------- world

  private shore<T extends Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible>(o: T): T { this.shoreObjs.push(o); return o; }
  private marah<T extends Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible>(o: T): T { this.marahObjs.push(o); return o; }
  private bodyRect(x: number, y: number, w: number, h: number, list: Phaser.GameObjects.Rectangle[]) {
    const r = this.add.rectangle(x, y, w, h);
    this.obstacles.add(r);
    list.push(r);
  }

  protected buildWorld() {
    registerSiteTextures(this);
    registerSeaTextures(this);
    registerMaraTextures(this);

    // shared: sand ground, sky, sun, warm light
    this.add.tileSprite(0, 0, W, H, "exodus_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 44, 0x7dd3fc).setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(290, 14, 14, 14, 0xfef08a).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(290, 14, 20, 8, 0xfef08a, 0.5).setDepth(DEPTH.FLOOR + 1);
    this.add.rectangle(0, 0, W, H, 0xfff1c9, 0.06).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.block(W / 2, Y0 / 2, W, Y0);
    this.block(W / 2, (Y1 + H) / 2, W, H - Y1);
    this.block(X0 / 2, H / 2, X0, H);
    this.block((X1 + W) / 2, H / 2, W - X1, H);

    // ---- shore (phase 1): sea band with foam, rocks, singing crowd
    this.shore(this.add.tileSprite(0, 44, W, 20, "sea_wall").setOrigin(0).setDepth(DEPTH.FLOOR));
    this.shore(this.add.tileSprite(0, 64, W, 8, "sea_edge_b").setOrigin(0).setDepth(DEPTH.FLOOR + 1));
    for (const [x, y] of [[40, 60], [120, 56], [230, 58], [330, 56]]) this.shore(this.add.image(x, y, "sea_fish").setDepth(DEPTH.FLOOR + 1).setAlpha(0.8));
    for (const [x, y, k] of [[44, 100, "site_rock"], [306, 96, "site_rock"], [52, 150, "site_shrub"], [300, 146, "site_shrub"], [90, 90, "sea_shell"], [260, 112, "sea_shell"]] as [number, number, string][]) this.shore(this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y));
    this.shoreBodies.length = 0;
    this.miriam = this.shore(this.add.image(176, 206, "exodus_miriam").setOrigin(0.5, 1).setDepth(206));
    this.shore(this.add.image(190, 198, "mr_tambourine").setOrigin(0.5, 1).setDepth(207));
    this.bodyRect(176, 202, 12, 6, this.shoreBodies);
    const crowd: [number, number, string][] = [[120, 214, "exodus_girl0"], [232, 214, "exodus_girl3"], [92, 190, "exodus_girl3"], [260, 190, "exodus_girl0"], [150, 232, "exodus_slave"], [206, 232, "exodus_aaron"], [296, 214, "exodus_moses_leader"], [56, 214, "exodus_slave"]];
    crowd.forEach(([x, y, k], i) => {
      const img = this.shore(this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y));
      this.tweens.add({ targets: img, y: y - 2, duration: 420 + (i % 3) * 60, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2], delay: i * 90 });
    });
    this.ring = this.shore(this.add.image(0, 0, "mr_ring").setDepth(DEPTH.UI - 1));
    this.track = this.shore(this.add.rectangle(0, 0, TRACK_LEN + 40, 4, 0x0f172a, 0.6).setDepth(DEPTH.UI - 2));

    // ---- Marah (phase 2): cliff wall, bitter pools, mud channels, dam stones, logs, mud patrol, Elim gate
    this.marah(this.add.tileSprite(0, 44, W, 28, "site_wall").setOrigin(0).setDepth(DEPTH.FLOOR)).setVisible(false);
    this.marah(this.add.rectangle(0, Y0 - 4, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1)).setVisible(false);
    POOL_X.forEach((x, i) => {
      const mud = this.marah(this.add.tileSprite(x - 6, CHANNEL_TOP, 12, STONE_Y - CHANNEL_TOP, "mr_mud").setOrigin(0).setDepth(DEPTH.RUG));
      const img = this.marah(this.add.image(x, POOL_FOOT, "mr_pool_bitter").setOrigin(0.5, 1).setDepth(POOL_FOOT));
      const stone = this.marah(this.add.sprite(x, STONE_Y + 2, "mr_stone", 0).setOrigin(0.5, 1).setDepth(STONE_Y + 2));
      const glow = this.marah(this.add.image(x, STONE_Y - 8, "exodus_glow_gold").setDepth(DEPTH.FX - 70).setAlpha(0.5));
      this.tweens.add({ targets: glow, alpha: 0.9, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.bodyRect(x, POOL_FOOT - 6, 44, 10, this.marahBodies);
      this.bodyRect(x, STONE_Y - 2, 12, 6, this.marahBodies);
      this.pools[i] = { x, closed: false, sweet: false, stable: false, polluteAt: 0, img, stone, mud, glow };
      [mud, img, stone, glow].forEach((o) => o.setVisible(false));
    });
    LOG_X.forEach((x, i) => {
      this.marah(this.add.image(x, LOG_Y + 4, "site_rock").setOrigin(0.5, 1).setDepth(LOG_Y + 4)).setVisible(false);
      const glow = this.marah(this.add.image(x, LOG_Y - 6, "exodus_glow_gold").setDepth(DEPTH.FX - 70).setAlpha(0.6)).setVisible(false);
      this.tweens.add({ targets: glow, alpha: 1, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      const img = this.marah(this.add.image(x, LOG_Y - 4, "mr_log").setOrigin(0.5, 1).setDepth(LOG_Y)).setVisible(false);
      this.tweens.add({ targets: img, y: LOG_Y - 6, duration: 600, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2], delay: i * 150 });
      this.logs[i] = { x, taken: false, used: false, img, glow };
    });
    for (const [x, y, k] of [[44, 196, "site_rock"], [300, 232, "site_shrub"], [44, 250, "site_shrub"], [108, 214, "site_jar"]] as [number, number, string][]) this.marah(this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y)).setVisible(false);
    // mud patrol: slippery brown streams cross the middle lane
    for (const off of [0, 1]) {
      const r = this.marah(this.add.rectangle(X0, MUD_Y, 18, 8, BROWN, 0.9).setOrigin(0.5).setDepth(DEPTH.FX - 60)).setVisible(false);
      r.setData("off", off * 140);
      this.mudBlobs.push(r);
    }
    // Elim gate and palms
    this.marah(this.add.image(GATE[0], GATE[1], "mr_gate").setOrigin(0.5, 1).setDepth(GATE[1])).setVisible(false);
    this.bodyRect(GATE[0] - 9, GATE[1] - 8, 6, 16, this.marahBodies);
    this.bodyRect(GATE[0] + 9, GATE[1] - 8, 6, 16, this.marahBodies);
    this.marah(this.add.image(306, 104, "mr_palm").setOrigin(0.5, 1).setDepth(104)).setVisible(false);
    this.bodyRect(306, 100, 8, 6, this.marahBodies);
    this.marahBodies.forEach((b) => ((b.body as Phaser.Physics.Arcade.StaticBody).enable = false));

    // interactables
    const cx = (x: number, y: number, r: number, label: () => string, active: () => boolean, act: () => void) => this.interactables.push({ x, y, r, label, active, act });
    const live = () => this.phase === "marah";
    this.pools.forEach((p, i) => {
      cx(p.x, STONE_Y - 4, 22, () => tr(STAGE8.stone), () => live() && !this.stoneClosed(i), () => this.turnStone(i));
      cx(p.x, POOL_FOOT + 10, 26, () => tr(this.carrying >= 0 ? STAGE8.pool : STAGE8.poolNoLog), () => live() && !p.sweet, () => this.dropLog(i));
    });
    this.logs.forEach((l, i) => cx(l.x, LOG_Y, 20, () => tr(STAGE8.log), () => live() && this.carrying < 0 && !l.taken && !l.used, () => this.takeLog(i)));
    cx(GATE[0], GATE[1] + 6, 26, () => tr(this.allPure() ? STAGE8.gate : STAGE8.gateLocked), () => live(), () => { if (this.allPure()) this.won(); else audio.sfx("wrong"); });

    this.carryImg = this.add.image(0, 0, "mr_log").setDepth(DEPTH.FX).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);

    this.showPhase(true);
  }

  private showPhase(shore: boolean) {
    this.shoreObjs.forEach((o) => o.setVisible(shore));
    this.marahObjs.forEach((o) => o.setVisible(!shore));
    this.shoreBodies.forEach((b) => ((b.body as Phaser.Physics.Arcade.StaticBody).enable = shore));
    this.marahBodies.forEach((b) => ((b.body as Phaser.Physics.Arcade.StaticBody).enable = !shore));
    if (shore) this.notes.forEach((n) => n.img.setVisible(false));
  }

  // ---------------------------------------------------------------- phase 1: tambourine

  protected onStageStart() {
    this.phase = "wait";
    this.saveCheckpoint("song", null, SONG_START[0], SONG_START[1]);
    this.talk(STAGE8.speaker, STAGE8.start.map(tr), () => this.startVerse(0));
  }

  private startVerse(v: number) {
    this.phase = "song";
    this.verse = v;
    this.spawned = 0;
    this.hits = 0;
    this.notes.forEach((n) => n.img.destroy());
    this.notes = [];
    this.nextSpawn = this.time.now + 1400;
    this.verseOn = true;
  }

  private need() {
    return Math.ceil(VERSES[this.verse].notes * NEED);
  }

  protected handleActionTrigger() {
    if (this.phase === "song" && this.verseOn) { this.beat(); return; }
    super.handleActionTrigger();
  }

  private beat() {
    const cfg = VERSES[this.verse];
    const now = this.time.now;
    let best: Note | undefined;
    let bd = Infinity;
    for (const n of this.notes) {
      if (n.resolved) continue;
      const d = Math.abs(((now - n.t0) / 1000) * cfg.speed - TRACK_LEN);
      if (d < bd) { bd = d; best = n; }
    }
    if (this.miriam) this.tweens.add({ targets: this.miriam, y: this.miriam.y - 3, duration: 70, yoyo: true });
    if (best && bd <= HIT_WINDOW) {
      const hit = best;
      hit.resolved = true;
      hit.img.setFrame(1);
      this.hits++;
      audio.sfx("pickup");
      this.time.delayedCall(140, () => hit.img.setVisible(false));
    } else audio.sfx("wrong");
  }

  private updateSong(view: Phaser.Geom.Rectangle) {
    const cfg = VERSES[this.verse];
    const now = this.time.now;
    const ringX = Math.round(view.centerX + 80), y = Math.round(view.y + this.safeInsetTop() + 30);
    this.ring?.setPosition(ringX, y).setVisible(this.verseOn);
    this.track?.setPosition(Math.round(ringX - TRACK_LEN / 2 - 6), y).setVisible(this.verseOn);
    if (!this.verseOn) return;
    if (this.spawned < cfg.notes && now >= this.nextSpawn) {
      const img = this.add.sprite(0, 0, "mr_note", 0).setDepth(DEPTH.UI);
      this.notes.push({ t0: now, resolved: false, img });
      this.spawned++;
      this.nextSpawn += cfg.gap;
    }
    for (const n of this.notes) {
      const prog = ((now - n.t0) / 1000) * cfg.speed;
      n.img.setPosition(Math.round(ringX - TRACK_LEN + prog), y);
      if (!n.resolved && prog > TRACK_LEN + HIT_WINDOW) { n.resolved = true; n.img.setVisible(false); }
    }
    if (this.spawned >= cfg.notes && this.notes.every((n) => n.resolved)) this.endVerse();
  }

  private endVerse() {
    this.verseOn = false;
    this.phase = "wait";
    if (this.hits < this.need()) {
      audio.sfx("wrong");
      this.talk(STAGE8.speaker, [tr(STAGE8.verseFail)], () => this.startVerse(this.verse));
      return;
    }
    audio.sfx("bless");
    this.sparkleBurst(176, 190, 10);
    if (this.verse < VERSES.length - 1) {
      this.talk(STAGE8.speaker, [tr(STAGE8.verseOk)], () => this.startVerse(this.verse + 1));
    } else {
      this.talk(STAGE8.speaker, STAGE8.songDone.map(tr), () => this.toMarah());
    }
  }

  // ---------------------------------------------------------------- phase 2: Marah

  private toMarah() {
    const cam = this.cameras.main;
    cam.fadeOut(500, 255, 255, 255);
    cam.once("camerafadeoutcomplete", () => {
      this.showPhase(false);
      this.setupMarah();
      this.player.setPosition(MARAH_START[0], MARAH_START[1]);
      this.saveCheckpoint("marah", null, MARAH_START[0], MARAH_START[1]);
      cam.fadeIn(500, 255, 255, 255);
      this.time.delayedCall(550, () => this.talk(STAGE8.speaker, STAGE8.marahIntro.map(tr), () => { this.phase = "marah"; }));
    });
  }

  private setupMarah() {
    this.carrying = -1;
    this.pools.forEach((p) => {
      p.sweet = p.stable = p.closed = false;
      p.img.setTexture("mr_pool_bitter");
      p.stone.setFrame(0);
      p.mud.setAlpha(1);
      p.glow.setVisible(true);
    });
    this.logs.forEach((l) => { l.taken = l.used = false; l.img.setVisible(true); l.glow.setVisible(true); });
  }

  protected onCheckpointRestore(id: string) {
    if (id === "marah") {
      this.setupMarah();
      this.phase = "marah";
    } else {
      this.showPhase(true);
      this.startVerse(0);
    }
  }

  private stoneClosed(i: number) {
    return this.pools[i].closed;
  }

  private allPure() {
    return this.pools.every((p) => p.sweet && p.stable);
  }

  private turnStone(i: number) {
    const p = this.pools[i];
    p.closed = true;
    p.stone.setFrame(1);
    p.mud.setAlpha(0.18);
    p.glow.setVisible(false);
    audio.sfx("chime");
    this.sparkleBurst(p.x, STONE_Y - 8, 6);
    if (p.sweet) p.stable = true; // stopped in time: the sweet water stays
  }

  private takeLog(i: number) {
    this.carrying = i;
    this.logs[i].taken = true;
    this.logs[i].img.setVisible(false);
    this.logs[i].glow.setVisible(false);
    audio.sfx("pickup");
  }

  private returnLog(i: number) {
    const l = this.logs[i];
    l.taken = l.used = false;
    l.img.setVisible(true);
    l.glow.setVisible(true);
    if (this.carrying === i) this.carrying = -1;
  }

  private dropLog(i: number) {
    if (this.carrying < 0) { audio.sfx("wrong"); return; }
    const p = this.pools[i];
    this.logs[this.carrying].used = true;
    p.sweet = true;
    p.stable = this.stoneClosed(i);
    p.polluteAt = this.time.now + POLLUTE_MS;
    p.img.setTexture("mr_pool_sweet");
    this.carrying = -1;
    audio.sfx("bless");
    this.sparkleBurst(p.x, POOL_FOOT - 10, 10);
    if (this.allPure()) { audio.sfx("chime"); this.sparkleBurst(GATE[0], GATE[1] - 16, 12); }
  }

  private polluted(i: number) {
    const p = this.pools[i];
    p.sweet = false;
    p.img.setTexture("mr_pool_bitter");
    const j = this.logs.findIndex((l) => l.used && !l.img.visible);
    if (j >= 0) this.returnLog(j);
    audio.sfx("wrong");
    if (this.time.now - this.pollToldAt > 10000) { this.pollToldAt = this.time.now; this.talk(STAGE8.speaker, [tr(STAGE8.mudBack)]); }
  }

  private won() {
    this.phase = "done";
    audio.sfx("complete");
    this.cameras.main.flash(500, 255, 244, 200);
    this.carryImg?.setVisible(false);
    this.completeStage();
    this.time.delayedCall(900, () =>
      this.talk("Ấn Dấu thứ 8", STAGE8.outro.map(tr), () =>
        this.talk("Suy niệm", [tr(STAGE8.lesson)], () =>
          this.talk("Hoang địa Xin", STAGE8.cutscene.map(tr), () => this.goToNextStage()))));
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const view = this.cameras.main.worldView;
    const p = this.player;
    let hud = "";
    if (this.phase === "song" || (this.phase === "wait" && this.verseOn)) hud = `${tr(STAGE8.verse[this.verse])}  ·  ${tr(STAGE8.progress1)}: ${this.hits}/${this.need()}`;
    else if (this.phase === "marah") hud = `${tr(STAGE8.progress2)}: ${this.pools.filter((q) => q.sweet && q.stable).length}/3`;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(hud);
    this.carryImg?.setVisible(this.carrying >= 0 && this.phase === "marah").setPosition(Math.round(p.x), Math.round(p.y - 30)).setDepth(p.y + 17);

    p.speedScale = 1;
    if (this.introActive) return;
    if (this.phase === "song") {
      p.speedScale = 0; // the child stands and keeps the beat
      this.updateSong(view);
      return;
    }
    if (this.phase !== "marah" || this.dialogueOpen) return;

    // mud channels flow while their stone is open
    this.pools.forEach((q, i) => {
      if (!this.stoneClosed(i)) q.mud.tilePositionY = Math.floor(this.time.now * 0.03) % 16;
      if (q.sweet && !q.stable && this.time.now > q.polluteAt && !this.stoneClosed(i)) this.polluted(i);
    });

    // mud patrol: slippery streams knock a carried log back to its rock
    const span = X1 - X0 - 18;
    for (const b of this.mudBlobs) {
      const ph = (this.time.now * (MUD_SPEED / 1000) + (b.getData("off") as number)) % (span * 2);
      b.x = Math.round(X0 + 9 + (ph > span ? span * 2 - ph : ph));
      if (this.carrying >= 0 && Math.abs(p.x - b.x) < 14 && Math.abs(p.y - b.y) < 8) {
        this.returnLog(this.carrying);
        audio.sfx("wrong");
        if (this.time.now - this.mudToldAt > 10000) { this.mudToldAt = this.time.now; this.talk(STAGE8.speaker, [tr(STAGE8.mudHit)]); }
      }
    }
  }
}
