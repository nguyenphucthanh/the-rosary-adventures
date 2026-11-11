import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerGoshenTextures } from "@/modules/moses-the-exodus/game/utils/goshenTextures";
import { STAGE5, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 352;
const H = 288;
const START: [number, number] = [176, 186];
const OIL: [number, number] = [176, 152];
const FADE_MS = 15000;
const WARN_MS = 5000;
// walkable village rect; the ring of lamps runs along x 56..296, y 88..208
const X0 = 24, X1 = 328, Y0 = 72, Y1 = 232;
const RING = { l: 56, r: 296, t: 88, b: 208 };

// lamps, clockwise from the top side
const LAMPS: [number, number][] = [[136, 88], [216, 88], [296, 128], [296, 168], [216, 208], [136, 208], [56, 168], [56, 128]];
// mirrors at the corners (TR, BR, BL, TL); `ok` is the frame (0 UL, 1 UR, 2 DR, 3 DL) that faces into the village
const MIRRORS: { x: number; y: number; ok: number }[] = [
  { x: RING.r, y: RING.t, ok: 3 }, { x: RING.r, y: RING.b, ok: 0 }, { x: RING.l, y: RING.b, ok: 1 }, { x: RING.l, y: RING.t, ok: 2 },
];
// the 8 links of the ring: two lamps, optionally joined through a corner mirror
const LINKS: { a: number; b: number; m?: number }[] = [
  { a: 0, b: 1 }, { a: 1, b: 2, m: 0 }, { a: 2, b: 3 }, { a: 3, b: 4, m: 1 }, { a: 4, b: 5 }, { a: 5, b: 6, m: 2 }, { a: 6, b: 7 }, { a: 7, b: 0, m: 3 },
];

interface Lamp { x: number; y: number; spr: Phaser.GameObjects.Sprite; glow: Phaser.GameObjects.Image; lit: boolean; secured: boolean; ttl: number }
interface Link { done: boolean; rects: Phaser.GameObjects.Rectangle[] }

/** Stage 5: carry oil to eight Goshen lamps and turn the bronze mirrors so beams join them into one closed ring of light. */
export class Stage05GoshenLightScene extends BaseExodusScene {
  private lamps: Lamp[] = [];
  private mirrors: { spr: Phaser.GameObjects.Sprite; f: number }[] = [];
  private links: Link[] = [];
  private dark: { rect: Phaser.GameObjects.Rectangle; links: number[] }[] = [];
  private hasOil = false;
  private running = false;
  private finished = false;
  private firstLinkShown = false;
  private lostCooldown = 0;
  private flame?: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage05GoshenLightScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_05_anh_sang_dat_gosen";
    this.spawn = START;
  }

  create() {
    this.lamps = [];
    this.mirrors = [];
    this.links = [];
    this.dark = [];
    this.hasOil = this.running = this.finished = this.firstLinkShown = false;
    this.lostCooldown = 0;
    this.intro = { illustration: "5", speaker: STAGE5.speaker, lines: STAGE5.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerSiteTextures(this);
    registerGoshenTextures(this);

    // ground, alley paths along the ring, wall + night sky above
    this.add.tileSprite(0, 0, W, H, "exodus_sand").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, 44, 0x0b1020).setOrigin(0).setDepth(DEPTH.FLOOR);
    for (let i = 0; i < 14; i++) this.add.image(10 + ((i * 53) % (W - 20)), 6 + ((i * 17) % 28), "sparkle").setDepth(DEPTH.FLOOR + 1).setAlpha(0.5);
    this.add.tileSprite(0, 44, W, Y0 - 44, "site_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, Y0 - 4, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    const path = (x: number, y: number, w: number, h: number) => this.add.tileSprite(x, y, w, h, "site_dirt").setOrigin(0).setDepth(DEPTH.RUG);
    path(RING.l - 8, RING.t - 8, RING.r - RING.l + 16, 16);
    path(RING.l - 8, RING.b - 8, RING.r - RING.l + 16, 16);
    path(RING.l - 8, RING.t - 8, 16, RING.b - RING.t + 16);
    path(RING.r - 8, RING.t - 8, 16, RING.b - RING.t + 16);
    this.add.rectangle(0, 0, W, H, 0x0b1020, 0.28).setOrigin(0).setDepth(DEPTH.LIGHT); // night

    // colliders: village edges
    this.block(W / 2, Y0 / 2, W, Y0);
    this.block(W / 2, (Y1 + H) / 2, W, H - Y1);
    this.block(X0 / 2, H / 2, X0, H);
    this.block((X1 + W) / 2, H / 2, W - X1, H);

    // village dressing inside and around the ring
    for (const [x, y] of [[112, 150], [240, 150]]) this.prop(x, y, "site_tent", 38, 12);
    this.prop(OIL[0], OIL[1], "gs_oil", 14, 8);
    this.add.image(OIL[0], OIL[1] - 8, "exodus_glow_gold").setDepth(OIL[1] - 1).setAlpha(0.45);
    this.add.image(OIL[0] + 16, OIL[1] + 2, "site_jar").setOrigin(0.5, 1).setDepth(OIL[1] + 2);
    this.add.image(OIL[0], 114, "exodus_moses_leader").setOrigin(0.5, 1).setDepth(114);
    this.add.image(88, 176, "exodus_slave").setOrigin(0.5, 1).setDepth(176);
    this.add.image(264, 124, "exodus_miriam").setOrigin(0.5, 1).setDepth(124);
    this.add.image(250, 182, "exodus_lamb").setOrigin(0.5, 1).setDepth(182);
    this.add.image(268, 188, "exodus_lamb").setOrigin(0.5, 1).setDepth(188);
    for (const [x, y] of [[40, 220], [316, 220], [30, 100], [322, 100]]) this.add.image(x, y, "site_pot").setOrigin(0.5, 1).setDepth(y);
    for (const [x, y] of [[96, 224], [256, 224]]) this.add.image(x, y, "site_shrub").setOrigin(0.5, 1).setDepth(y);
    for (const x of [40, 120, 200, 280]) this.add.image(x, Y0 - 2, "site_tower").setOrigin(0.5, 1).setDepth(Y0 - 2);

    // eight lamps
    LAMPS.forEach(([x, y]) => {
      const glow = this.add.image(x, y - 12, "exodus_glow_gold").setDepth(DEPTH.FX - 30).setAlpha(0).setVisible(false);
      const spr = this.add.sprite(x, y, "gs_lamp", 0).setOrigin(0.5, 1).setDepth(y);
      this.block(x, y - 3, 10, 6);
      this.lamps.push({ x, y, spr, glow, lit: false, secured: false, ttl: 0 });
    });
    // four mirrors, each starting turned the wrong way
    MIRRORS.forEach((m, i) => {
      const f = (m.ok + 1 + (i % 3)) % 4;
      const spr = this.add.sprite(m.x, m.y, "gs_mirror", f).setOrigin(0.5, 1).setDepth(m.y);
      this.block(m.x, m.y - 3, 10, 6);
      this.mirrors.push({ spr, f });
    });
    // beams (flat low-alpha fills along the ring), hidden until a link is joined
    LINKS.forEach((l) => {
      const rects: Phaser.GameObjects.Rectangle[] = [];
      const seg = (ax: number, ay: number, bx: number, by: number) => {
        const x = Math.min(ax, bx), y = Math.min(ay, by), w = Math.abs(ax - bx), h = Math.abs(ay - by);
        rects.push(this.add.rectangle(w ? x : x - 2, h ? y : y - 2, w || 4, h || 4, 0xfde68a, 0.6).setOrigin(0).setDepth(DEPTH.FX - 40).setVisible(false));
      };
      const A = LAMPS[l.a], B = LAMPS[l.b];
      if (l.m === undefined) seg(A[0], A[1] - 6, B[0], B[1] - 6);
      else { const M = MIRRORS[l.m]; seg(A[0], A[1] - 6, M.x, M.y - 6); seg(M.x, M.y - 6, B[0], B[1] - 6); }
      this.links.push({ done: false, rects });
    });
    // encroaching darkness outside the ring, one strip per side, tied to that side's two links
    const strip = (x: number, y: number, w: number, h: number, links: number[]) =>
      this.dark.push({ rect: this.add.rectangle(x, y, w, h, 0x02030a, 0.62).setOrigin(0).setDepth(DEPTH.FX - 50), links });
    strip(0, 44, W, Y0 + 8 - 44, [0, 7]);
    strip(X1 - 12, Y0 + 8, W - X1 + 12, H - Y0 - 8, [1, 2]);
    strip(0, Y1 - 12, X1 - 12, H - Y1 + 12, [3, 4]);
    strip(0, Y0 + 8, X0 + 12, Y1 - 12 - Y0 - 8, [5, 6]);

    // interactables
    this.interactables.push({
      x: OIL[0], y: OIL[1] - 10, r: 26, label: () => tr(this.hasOil ? STAGE5.oilFull : STAGE5.oilHint),
      active: () => this.running, act: () => this.takeOil(),
    });
    this.lamps.forEach((l, i) => this.interactables.push({
      x: l.x, y: l.y - 10, r: 22, label: () => tr(l.lit ? STAGE5.lampOn : this.hasOil ? STAGE5.lampHint : STAGE5.lampNoOil),
      active: () => this.running && !l.secured, act: () => this.lightLamp(i),
    }));
    this.mirrors.forEach((m, i) => this.interactables.push({
      x: MIRRORS[i].x, y: MIRRORS[i].y - 10, r: 22, label: tr(STAGE5.mirrorHint),
      active: () => this.running && !this.mirrorLocked(i), act: () => this.turnMirror(i),
    }));

    this.flame = this.add.image(0, 0, "gs_flame").setDepth(DEPTH.FX).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  protected onStageStart() {
    this.saveCheckpoint("run", null, START[0], START[1]);
    this.talk(STAGE5.speaker, STAGE5.start.map(tr), () => { this.running = true; });
  }

  protected onCheckpointRestore() {
    this.hasOil = false;
    this.lamps.forEach((l) => { l.lit = l.secured = false; l.ttl = 0; this.paintLamp(l); });
    this.mirrors.forEach((m, i) => { m.f = (MIRRORS[i].ok + 1 + (i % 3)) % 4; m.spr.setFrame(m.f); });
    this.links.forEach((k) => { k.done = false; k.rects.forEach((r) => r.setVisible(false)); });
    this.dark.forEach((d) => d.rect.setAlpha(0.62));
    this.running = true;
  }

  // ---------------------------------------------------------------- actions

  private takeOil() {
    if (this.hasOil) return;
    this.hasOil = true;
    audio.sfx("pickup");
    this.sparkleBurst(OIL[0], OIL[1] - 12, 6);
  }

  private lightLamp(i: number) {
    const l = this.lamps[i];
    if (l.lit) return;
    if (!this.hasOil) { audio.sfx("wrong"); return; }
    this.hasOil = false;
    l.lit = true;
    l.ttl = FADE_MS;
    audio.sfx("chime");
    this.sparkleBurst(l.x, l.y - 12, 6);
    this.paintLamp(l);
  }

  private mirrorLocked(i: number) {
    return LINKS.some((k, n) => k.m === i && this.links[n].done);
  }

  private turnMirror(i: number) {
    const m = this.mirrors[i];
    m.f = (m.f + 1) % 4;
    m.spr.setFrame(m.f);
    audio.sfx("chime");
  }

  private paintLamp(l: Lamp) {
    l.spr.setFrame(!l.lit ? 0 : l.secured || l.ttl > WARN_MS ? 1 : Math.floor(this.time.now / 160) % 2 ? 2 : 1);
    l.glow.setVisible(l.lit).setAlpha(l.lit ? (l.secured ? 0.8 : 0.55) : 0);
  }

  private join(n: number) {
    const k = this.links[n];
    k.done = true;
    const { a, b } = LINKS[n];
    for (const i of [a, b]) this.lamps[i].secured = true;
    k.rects.forEach((r) => { r.setVisible(true); this.tweens.add({ targets: r, alpha: 0.35, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] }); });
    audio.sfx("bless");
    this.sparkleBurst((this.lamps[a].x + this.lamps[b].x) / 2, (this.lamps[a].y + this.lamps[b].y) / 2 - 8, 8);
    this.dark.forEach((d) => {
      const left = d.links.filter((li) => !this.links[li].done).length;
      this.tweens.add({ targets: d.rect, alpha: 0.62 * (left / d.links.length), duration: 700, ease: "Stepped", easeParams: [5] });
    });
    if (!this.firstLinkShown) {
      this.firstLinkShown = true;
      this.talk(STAGE5.speaker, STAGE5.firstLink.map(tr));
    }
    if (this.links.every((o) => o.done)) this.won();
  }

  private won() {
    this.finished = true;
    this.running = false;
    this.flame?.setVisible(false);
    audio.sfx("complete");
    this.cameras.main.flash(500, 255, 244, 200);
    this.completeStage();
    this.time.delayedCall(900, () =>
      this.talk("Ấn Dấu thứ 5", STAGE5.outro.map(tr), () =>
        this.talk("Suy niệm", [tr(STAGE5.lesson)], () =>
          this.talk("Trước Đêm Vượt Qua", STAGE5.cutscene.map(tr), () => this.goToNextStage()))));
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const p = this.player;
    const view = this.cameras.main.worldView;
    const done = this.links.filter((k) => k.done).length;
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4))
      .setText(this.finished ? "" : `${tr(STAGE5.progress)}: ${done}/8  ·  ${tr(this.hasOil ? STAGE5.oilOn : STAGE5.oilOff)}`);
    this.flame?.setVisible(this.hasOil && !this.finished).setPosition(Math.round(p.x + 8), Math.round(p.y - 6)).setDepth(p.y + 17);

    if (!this.running || this.introActive || this.dialogueOpen) return;

    // lamps: unsecured flames fade; lamp + lamp (+ right mirror) joins a link for good
    for (const l of this.lamps) {
      if (l.lit && !l.secured) {
        l.ttl -= delta;
        if (l.ttl <= 0) { l.lit = false; audio.sfx("wrong"); }
      }
      this.paintLamp(l);
    }
    LINKS.forEach((k, n) => {
      if (this.links[n].done) return;
      const A = this.lamps[k.a], B = this.lamps[k.b];
      if (!A.lit || !B.lit) return;
      if (k.m !== undefined && this.mirrors[k.m].f !== MIRRORS[k.m].ok) return;
      this.join(n);
    });

    // empty torch outside the ring while the darkness still holds: lose the way, return to the nearest lit lamp
    this.lostCooldown = Math.max(0, this.lostCooldown - delta);
    const outside = p.x < RING.l - 12 || p.x > RING.r + 12 || p.y < RING.t - 10 || p.y > RING.b + 14;
    const sideDark = this.dark.some((d) => d.rect.alpha > 0.05 && Phaser.Geom.Rectangle.Contains(d.rect.getBounds(), p.x, p.y));
    if (outside && sideDark && !this.hasOil && this.lostCooldown <= 0 && !this.finished) {
      this.lostCooldown = 2000;
      const lit = this.lamps.filter((l) => l.lit);
      const to = lit.sort((a, b) => Phaser.Math.Distance.Between(p.x, p.y, a.x, a.y) - Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y))[0];
      const [tx, ty] = to ? [to.x + (to.x < W / 2 ? 14 : to.x > W / 2 ? -14 : 0), to.y + (to.y < H / 2 ? 16 : -16)] : START;
      this.cameras.main.flash(250, 15, 23, 42);
      p.setVelocity(0, 0);
      p.setPosition(tx, ty);
      audio.sfx("wrong");
      this.talk(STAGE5.speaker, STAGE5.lost.map(tr));
    }
  }
}
