import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerMountTextures } from "@/modules/moses-the-exodus/game/utils/mountTextures";
import { registerRephidimTextures } from "@/modules/moses-the-exodus/game/utils/rephidimTextures";
import { registerSinaiTextures } from "@/modules/moses-the-exodus/game/utils/sinaiTextures";
import { STAGE11, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

// Tall map: summit (top) -> 3 cloud tiers on a narrow stair -> holy boundary at the foot (bottom).
// Everything interactive sits y <= 490 (bottom 100px is hidden behind the mobile controls) and y >= 96.
const W = 352;
const H = 600;
const SUMMIT_Y0 = 76, SUMMIT_Y1 = 214; // summit floor
const PATH_X0 = 126, PATH_X1 = 226; // climbing corridor
const FOOT_Y0 = 420, FOOT_Y1 = 500; // holy ground at the mountain foot
const START: [number, number] = [176, 468];
const SUMMIT_START: [number, number] = [176, 206];

// Phase 1a: boundary markers
const SITES: [number, number][] = [[56, 450], [116, 488], [236, 488], [296, 450]];

// Phase 1b: three cloud strips (top-left y, closed ms, open ms, offset ms). Nearest to the foot first.
const TIERS: { y: number; closed: number; open: number; off: number }[] = [
  { y: 386, closed: 1700, open: 1800, off: 0 },
  { y: 306, closed: 1800, open: 1600, off: 1100 },
  { y: 226, closed: 1900, open: 1500, off: 2200 },
];
const STRIP_H = 14;
const JOSHUA_P: [number, number] = [146, 350];

// Phase 2: ten light tablets, two big stones
const BIA: [number, number][] = [[100, 132], [252, 132]];
const BIA_TOP = 132 - 64;
const SPOTS: [number, number][] = [[48, 182], [92, 204], [140, 178], [184, 204], [226, 178], [270, 204], [306, 182], [124, 150], [228, 150], [176, 164]];

type Phase = "wait" | "markers" | "climb" | "summit" | "done";
interface Spot { x: number; y: number; tab: number; img: Phaser.GameObjects.Image; glow: Phaser.GameObjects.Image }
interface Tier { cfg: (typeof TIERS)[number]; t: number; closed: boolean; passed: boolean; strip: Phaser.GameObjects.TileSprite; edges: Phaser.GameObjects.TileSprite[] }

/** Stage 11: plant 4 boundary markers, climb past 3 shofar-timed storm-cloud strips, then engrave the 10 commandments in order on 2 stones. */
export class Stage11SinaiCommandmentsScene extends BaseExodusScene {
  private phase: Phase = "wait";
  private markers: { img: Phaser.GameObjects.Sprite; glow: Phaser.GameObjects.Image; done: boolean }[] = [];
  private tiers: Tier[] = [];
  private joshuaTold = false;
  private flash?: Phaser.GameObjects.Rectangle;
  private flashT = 0;
  private spots: Spot[] = [];
  private rows: Phaser.GameObjects.Rectangle[] = [];
  private biaGlow: Phaser.GameObjects.Rectangle[] = [];
  private carry = -1; // tablet index held, -1 = none
  private carryFrom = -1;
  private carryImg?: Phaser.GameObjects.Image;
  private placed = 0;
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage11SinaiCommandmentsScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_11_muoi_dieu_ran_xinai";
    this.spawn = START;
  }

  create() {
    this.phase = "wait";
    this.markers = []; this.tiers = []; this.spots = []; this.rows = []; this.biaGlow = [];
    this.joshuaTold = false;
    this.flashT = 3000;
    this.carry = -1; this.carryFrom = -1;
    this.placed = 0;
    this.intro = { illustration: "11", speaker: STAGE11.speaker, lines: STAGE11.intro.map(tr) };
    super.create();
  }

  // ---------------------------------------------------------------- world

  protected buildWorld() {
    registerSiteTextures(this);
    registerMountTextures(this);
    registerRephidimTextures(this);
    registerSinaiTextures(this);

    // floor + cliffs (the cliff tiles fill every blocked area), stair, summit rug, holy ground
    this.add.tileSprite(0, 0, W, H, "mt_ground").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 0, W, SUMMIT_Y0, "mt_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(0, SUMMIT_Y0, 32, SUMMIT_Y1 - SUMMIT_Y0, "mt_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(W - 32, SUMMIT_Y0, 32, SUMMIT_Y1 - SUMMIT_Y0, "mt_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(0, SUMMIT_Y1, PATH_X0, FOOT_Y0 - SUMMIT_Y1, "mt_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(PATH_X1, SUMMIT_Y1, W - PATH_X1, FOOT_Y0 - SUMMIT_Y1, "mt_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(0, FOOT_Y0, 32, FOOT_Y1 - FOOT_Y0, "mt_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(W - 32, FOOT_Y0, 32, FOOT_Y1 - FOOT_Y0, "mt_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(PATH_X0, SUMMIT_Y1, PATH_X1 - PATH_X0, FOOT_Y0 - SUMMIT_Y1, "sn_step").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(PATH_X0, SUMMIT_Y1, 2, FOOT_Y0 - SUMMIT_Y1, 0x000000, 0.35).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.add.rectangle(PATH_X1 - 2, SUMMIT_Y1, 2, FOOT_Y0 - SUMMIT_Y1, 0x000000, 0.35).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.add.rectangle(40, 100, W - 80, SUMMIT_Y1 - 100, 0xfde68a, 0.22).setOrigin(0).setDepth(DEPTH.RUG + 1); // golden summit rug
    this.add.rectangle(36, FOOT_Y0 + 6, W - 72, FOOT_Y1 - FOOT_Y0 - 6, 0xfef3c7, 0.18).setOrigin(0).setDepth(DEPTH.RUG + 1); // holy ground
    this.add.rectangle(W / 2, SUMMIT_Y0 - 4, W, 4, 0x000000, 0.3).setDepth(DEPTH.RUG + 1);

    // sky: stepped white cloud banks along the top, golden beam, lightning flash overlay
    for (const [x, y, w] of [[10, 18, 70], [118, 8, 90], [250, 22, 86], [40, 48, 60], [200, 44, 70], [290, 54, 50]] as [number, number, number][]) {
      this.add.rectangle(x + 6, y, w - 12, 8, 0xe2e8f0).setOrigin(0).setDepth(DEPTH.RUG + 2);
      this.add.rectangle(x, y + 4, w, 8, 0xcbd5e1).setOrigin(0).setDepth(DEPTH.RUG + 2);
      this.add.rectangle(x + 14, y - 4, w - 36, 6, 0xf8fafc).setOrigin(0).setDepth(DEPTH.RUG + 2);
    }
    this.add.rectangle(W / 2 - 22, 0, 44, SUMMIT_Y1, 0xfde68a, 0.1).setOrigin(0).setDepth(DEPTH.LIGHT);
    this.flash = this.add.rectangle(0, 0, W, H, 0xffffff, 0).setOrigin(0).setDepth(DEPTH.FX - 90);

    // colliders
    this.block(W / 2, SUMMIT_Y0 / 2, W, SUMMIT_Y0);
    this.block(16, (SUMMIT_Y0 + SUMMIT_Y1) / 2, 32, SUMMIT_Y1 - SUMMIT_Y0);
    this.block(W - 16, (SUMMIT_Y0 + SUMMIT_Y1) / 2, 32, SUMMIT_Y1 - SUMMIT_Y0);
    this.block(PATH_X0 / 2, (SUMMIT_Y1 + FOOT_Y0) / 2, PATH_X0, FOOT_Y0 - SUMMIT_Y1);
    this.block((PATH_X1 + W) / 2, (SUMMIT_Y1 + FOOT_Y0) / 2, W - PATH_X1, FOOT_Y0 - SUMMIT_Y1);
    this.block(16, (FOOT_Y0 + FOOT_Y1) / 2, 32, FOOT_Y1 - FOOT_Y0);
    this.block(W - 16, (FOOT_Y0 + FOOT_Y1) / 2, 32, FOOT_Y1 - FOOT_Y0);
    this.block(W / 2, (FOOT_Y1 + H) / 2, W, H - FOOT_Y1);

    // static decor: holy torches along the stair, rocks/shrubs, the camp of the people below (under the controls)
    let flick = 0;
    const torches: Phaser.GameObjects.Sprite[] = [];
    for (let y = 244; y <= 404; y += 40) for (const x of [PATH_X0 - 8, PATH_X1 + 8]) torches.push(this.add.sprite(x, y, "rp_flame", 0).setOrigin(0.5, 1).setDepth(y));
    for (const x of [44, 308]) torches.push(this.add.sprite(x, 120, "rp_flame", 0).setOrigin(0.5, 1).setDepth(120));
    this.time.addEvent({ delay: 240, loop: true, callback: () => { flick ^= 1; torches.forEach((s) => s.setFrame(flick)); } });
    for (const [x, y, k] of [[50, 420 + 4, "site_rock"], [300, 424, "site_rock"], [52, 340, "site_shrub"], [292, 280, "site_shrub"], [70, 260, "site_rock"], [284, 360, "site_rock"], [44, 206, "site_shrub"], [308, 208, "site_shrub"]] as [number, number, string][]) this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y);
    for (const x of [44, 124, 224, 308]) this.add.image(x, 566, "site_tent").setOrigin(0.5, 1).setDepth(566);
    for (const x of [78, 168, 190, 268]) this.add.image(x, 580, x % 2 ? "exodus_slave" : "exodus_bully").setOrigin(0.5, 1).setDepth(580);

    // boundary marker sites (glowing ring until planted)
    SITES.forEach(([x, y]) => {
      const glow = this.add.image(x, y - 6, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.6);
      const img = this.add.sprite(x, y, "sn_marker", 0).setOrigin(0.5, 1).setDepth(y);
      this.tweens.add({ targets: glow, alpha: 0.95, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.tweens.add({ targets: img, y: y - 2, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
      this.markers.push({ img, glow, done: false });
    });

    // cloud tiers: a closed strip across the stair, or (open) two small puffs at its edges
    TIERS.forEach((cfg) => {
      const strip = this.add.tileSprite(PATH_X0, cfg.y, PATH_X1 - PATH_X0, STRIP_H, "sn_cloud", 0).setOrigin(0).setDepth(DEPTH.FX - 100).setVisible(false);
      const edges = [PATH_X0, PATH_X1 - 20].map((x) => this.add.tileSprite(x, cfg.y, 20, STRIP_H, "sn_cloud", 0).setOrigin(0).setDepth(DEPTH.FX - 100).setVisible(false));
      this.tiers.push({ cfg, t: cfg.off, closed: true, passed: false, strip, edges });
    });
    this.add.image(JOSHUA_P[0], JOSHUA_P[1], "exodus_joshua").setOrigin(0.5, 1).setDepth(JOSHUA_P[1]);

    // summit: two covenant stones + engraving rows (3 and 7) + glow pulse when done
    BIA.forEach(([x, y], b) => {
      this.prop(x, y, "sn_bia", 36, 10);
      this.biaGlow.push(this.add.rectangle(x, y - 32, 52, 72, 0xfde68a, 1).setDepth(y - 1).setAlpha(0));
      this.add.text(x, BIA_TOP - 4, tr(b === 0 ? STAGE11.bia1Name : STAGE11.bia2Name), { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5, 1).setDepth(y + 1);
    });
    for (let r = 0; r < 3; r++) this.rows.push(this.add.rectangle(BIA[0][0], BIA_TOP + 18 + r * 14, 20, 6, 0x4b5563).setDepth(BIA[0][1] + 1));
    for (let r = 0; r < 7; r++) this.rows.push(this.add.rectangle(BIA[1][0], BIA_TOP + 12 + r * 7, 20, 3, 0x4b5563).setDepth(BIA[1][1] + 1));

    // tablets: 10 glowing light slabs (hidden until the summit begins)
    SPOTS.forEach(([x, y]) => {
      const glow = this.add.image(x, y - 8, "exodus_glow_gold").setDepth(y - 1).setAlpha(0.6).setVisible(false);
      const img = this.add.image(x, y, "sn_slab").setOrigin(0.5, 1).setDepth(y).setVisible(false);
      this.tweens.add({ targets: glow, alpha: 0.95, duration: 800, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
      this.tweens.add({ targets: img, y: y - 2, duration: 650, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
      this.spots.push({ x, y, tab: -1, img, glow });
    });

    // interactables
    const cx = (x: number, y: number, r: number, label: () => string, active: () => boolean, act: () => void) => this.interactables.push({ x, y, r, label, active, act });
    SITES.forEach(([x, y], i) => cx(x, y, 24, () => tr(STAGE11.site), () => this.phase === "markers" && !this.markers[i].done, () => this.plant(i)));
    SPOTS.forEach(([x, y], i) => cx(x, y, 18, () => `[A] ${tr(STAGE11.tablets[this.spots[i].tab]?.text ?? STAGE11.slab)}`, () => this.phase === "summit" && this.carry < 0 && this.spots[i].tab >= 0, () => this.pick(i)));
    BIA.forEach(([x, y], b) => cx(x, y + 14, 34, () => tr(b === 0 ? STAGE11.bia1 : STAGE11.bia2), () => this.phase === "summit" && this.carry >= 0, () => this.place(b as 0 | 1)));

    this.carryImg = this.add.image(0, 0, "sn_slab").setDepth(DEPTH.FX).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, align: "center", resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  // ---------------------------------------------------------------- flow

  protected onStageStart() {
    this.phase = "wait";
    this.talk(STAGE11.speaker, STAGE11.start.map(tr), () => this.startMarkers());
  }

  protected onCheckpointRestore(id: string) {
    if (id === "summit") this.startSummit();
    else if (id.startsWith("tier")) this.startClimb(Number(id.slice(4)) + 1);
    else if (id === "climb") this.startClimb(0);
    else this.startMarkers();
  }

  private startMarkers() {
    this.markers.forEach((m) => { m.done = false; m.img.setFrame(0); m.glow.setVisible(true); });
    this.player.setPosition(START[0], START[1]);
    this.phase = "markers";
    this.saveCheckpoint("markers", null, START[0], START[1]);
  }

  private plant(i: number) {
    const m = this.markers[i];
    m.done = true;
    m.img.setFrame(1);
    m.glow.setVisible(false);
    this.tweens.killTweensOf(m.img);
    m.img.setY(SITES[i][1]);
    audio.sfx("pickup");
    this.sparkleBurst(SITES[i][0], SITES[i][1] - 12, 8);
    if (this.markers.every((x) => x.done)) {
      this.phase = "wait";
      audio.sfx("bless");
      this.time.delayedCall(700, () => this.talk(STAGE11.speaker, STAGE11.climbIntro.map(tr), () => this.startClimb(0)));
    }
  }

  /** passedCount tiers already behind the child (0 = at the foot). */
  private startClimb(passedCount: number) {
    this.tiers.forEach((tr_, i) => { tr_.passed = i < passedCount; tr_.t = tr_.cfg.off; });
    const cp: [number, number] = passedCount === 0 ? [176, START[1] - 24] : [176, TIERS[passedCount - 1].y - 22];
    this.player.setPosition(cp[0], cp[1]);
    this.saveCheckpoint(passedCount === 0 ? "climb" : `tier${passedCount - 1}`, null, cp[0], cp[1]);
    this.phase = "climb";
  }

  private startSummit() {
    this.player.setPosition(SUMMIT_START[0], SUMMIT_START[1]);
    this.phase = "wait";
    this.placed = 0; this.carry = -1; this.carryFrom = -1;
    this.rows.forEach((r) => r.setFillStyle(0x4b5563));
    const order = Phaser.Utils.Array.Shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    this.spots.forEach((s, i) => { s.tab = order[i]; s.img.setVisible(true); s.glow.setVisible(true); });
    this.saveCheckpoint("summit", null, SUMMIT_START[0], SUMMIT_START[1]);
    this.talk(STAGE11.speaker, STAGE11.summit.map(tr), () => { this.phase = "summit"; });
  }

  private pick(i: number) {
    const s = this.spots[i];
    if (s.tab < 0) return;
    this.carry = s.tab; this.carryFrom = i;
    s.tab = -1;
    s.img.setVisible(false);
    s.glow.setVisible(false);
    audio.sfx("pickup");
  }

  private place(b: 0 | 1) {
    if (this.carry < 0) { this.toast(BIA[b][0], BIA[b][1] - 70, tr(STAGE11.needSlab)); return; }
    const tab = STAGE11.tablets[this.carry];
    if (this.carry === this.placed && tab.bia === b) {
      this.rows[this.carry].setFillStyle(0xfbbf24);
      this.placed++;
      this.carry = -1;
      audio.sfx("chime");
      this.sparkleBurst(BIA[b][0], BIA_TOP + 24, 8);
      this.toast(BIA[b][0], BIA_TOP - 16, `${tr(STAGE11.right)} ${tr(tab.text)}`, "#bbf7d0");
      if (this.placed >= 10) this.allEngraved();
      return;
    }
    // wrong stone or wrong order: tablet flies back, with a Scripture hint
    audio.sfx("wrong");
    this.phase = "wait";
    const from = this.spots[this.carryFrom];
    const idx = this.carry;
    this.carry = -1;
    from.tab = idx;
    from.img.setVisible(true);
    from.glow.setVisible(true);
    this.toast(BIA[b][0], BIA[b][1] - 70, `${tr(STAGE11.wrong)} ${tr(STAGE11.flyBack)}`);
    this.talk(STAGE11.speaker, [tr(tab.hint)], () => { this.phase = "summit"; });
  }

  private toast(x: number, y: number, msg: string, color = "#fecaca") {
    const t = this.add.text(Math.round(x), Math.round(y), msg, { fontFamily: "Dearpix, monospace", fontSize: "10px", color, backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.UI);
    this.tweens.add({ targets: t, y: t.y - 6, alpha: 0, duration: 1700, delay: 400, onComplete: () => t.destroy() });
  }

  private allEngraved() {
    this.phase = "done";
    audio.sfx("bless");
    this.biaGlow.forEach((g) => this.tweens.add({ targets: g, alpha: 0.35, duration: 700, yoyo: true, repeat: 3, ease: "Stepped", easeParams: [4] }));
    this.cameras.main.flash(500, 255, 244, 200);
    this.time.delayedCall(1200, () => this.talk(STAGE11.speaker, STAGE11.allDone.map(tr), () => this.won()));
  }

  private won() {
    audio.sfx("complete");
    this.completeStage();
    this.talk("Ấn Dấu thứ 11", STAGE11.outro.map(tr), () =>
      this.talk("Suy niệm", [tr(STAGE11.lesson)], () =>
        this.talk("Xi-nai", STAGE11.cutscene.map(tr), () => this.goToNextStage())));
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const view = this.cameras.main.worldView;
    const p = this.player;
    let hud = "";
    if (this.phase === "markers") hud = `${tr(STAGE11.markers)} ${this.markers.filter((m) => m.done).length}/4`;
    else if (this.phase === "climb") hud = `${tr(STAGE11.climbHud)} ${this.tiers.filter((t) => t.passed).length}/3`;
    else if (this.phase === "summit" || this.phase === "done") {
      hud = `${tr(STAGE11.hud)} ${this.placed}/10`;
      if (this.carry >= 0) hud += `\n${tr(STAGE11.tablets[this.carry].text)}`;
    }
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(hud);
    this.carryImg?.setVisible(this.carry >= 0).setPosition(Math.round(p.x), Math.round(p.y - 30)).setDepth(p.y + 17);

    // distant lightning
    this.flashT -= delta;
    if (this.flashT <= 0) {
      this.flashT = Phaser.Math.Between(3500, 7000);
      this.flash?.setAlpha(0.22);
      this.time.delayedCall(90, () => this.flash?.setAlpha(0));
      this.time.delayedCall(220, () => this.flash?.setAlpha(0.12));
      this.time.delayedCall(300, () => this.flash?.setAlpha(0));
    }

    p.speedScale = 1;
    if (this.introActive || this.dialogueOpen) return;
    if (this.phase === "climb") this.updateClimb(delta);
  }

  private updateClimb(delta: number) {
    const p = this.player;
    const feet = p.y + 9;
    this.tiers.forEach((tier, i) => {
      const { cfg } = tier;
      const cycle = cfg.closed + cfg.open;
      tier.t += delta;
      const m = tier.t % cycle;
      const closed = m < cfg.closed;
      if (!closed && tier.closed && Math.abs(p.y - cfg.y) < 120) audio.sfx("shofar"); // the horn opens the way
      tier.closed = closed;
      const warn = !closed && m > cycle - 500;
      const bolt = Math.floor(tier.t / 160) % 2;
      tier.strip.setVisible(closed).setFrame(bolt);
      tier.edges.forEach((e) => e.setVisible(!closed && (!warn || Math.floor(tier.t / 100) % 2 === 0)).setFrame(warn ? 1 : 0));
      if (closed && feet >= cfg.y - 2 && feet <= cfg.y + STRIP_H + 2) {
        p.setPosition(p.x, cfg.y + STRIP_H + 24);
        p.setVelocity(0, 0);
        audio.sfx("wrong");
        this.cameras.main.shake(160, 0.004);
        this.toast(p.x, cfg.y + STRIP_H + 4, tr(STAGE11.zapped));
      }
      if (!tier.passed && feet < cfg.y - 6) {
        tier.passed = true;
        audio.sfx("chime");
        this.saveCheckpoint(`tier${i}`, null, 176, cfg.y - 22);
        this.toast(p.x, cfg.y - 16, tr(STAGE11.tier[i]), "#bbf7d0");
        if (i === 0 && !this.joshuaTold) {
          this.joshuaTold = true;
          this.talk("Giu-suê", STAGE11.joshua.map(tr));
        }
        if (i === TIERS.length - 1) {
          this.phase = "wait";
          this.time.delayedCall(600, () => this.startSummit());
        }
      }
    });
    // a gentle nudge when the child waits at a closed strip
    const next = this.tiers.find((t) => !t.passed);
    if (next && next.closed && feet > next.cfg.y + STRIP_H && feet < next.cfg.y + STRIP_H + 26 && Math.floor(next.t / 2200) !== Math.floor((next.t - delta) / 2200)) this.toast(p.x, p.y - 26, tr(STAGE11.waitHorn), "#fde68a");
  }
}
