import * as Phaser from "phaser";
import { BaseExodusScene, DEPTH } from "@/modules/moses-the-exodus/game/scenes/BaseExodusScene";
import { registerSiteTextures } from "@/modules/moses-the-exodus/game/utils/siteTextures";
import { registerMountTextures } from "@/modules/moses-the-exodus/game/utils/mountTextures";
import { registerRephidimTextures } from "@/modules/moses-the-exodus/game/utils/rephidimTextures";
import { registerSinaiTextures } from "@/modules/moses-the-exodus/game/utils/sinaiTextures";
import { registerCalfTextures } from "@/modules/moses-the-exodus/game/utils/calfTextures";
import { STAGE12, tr } from "@/modules/moses-the-exodus/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

// Tall map (top -> bottom): rock cleft summit, whirlwind path, stonecutters' shelter, gate, calf camp.
// Everything interactive sits y >= 100 and y <= 500 (the bottom 100px hide behind the mobile controls).
const W = 352;
const H = 600;
const SUMMIT_Y0 = 76, SUMMIT_Y1 = 200;
const PATH_X0 = 126, PATH_X1 = 226;
const SHELTER_Y0 = 290, SHELTER_Y1 = 380;
const CAMP_Y0 = 380, CAMP_Y1 = 540;
const START: [number, number] = [176, 500];
const CARVE_START: [number, number] = [176, 368];
const CLIMB_START: [number, number] = [176, 284];
const CALF: [number, number] = [176, 452];
const FORGES: [number, number][] = [[64, 408], [288, 408], [64, 496], [288, 496]];
const NICHE: [number, number] = [176, 152];

// Carving grid: 4x4 cells of 16px. 'X' = part of the tablet, '.' = extra stone to chip away.
const GRID_X = 80, GRID_Y = 300, CELL = 16;
const MODELS: string[][] = [
  [".XX.", "XXXX", "XXXX", "XXXX"],
  [".XX.", "XXXX", "XXXX", ".XX."],
];
const MODEL_X = 232, MODEL_Y = 312, MCELL = 8;

// Whirlwind zones across the climbing corridor
const GUSTS = [{ y: 212, calm: 2400, wind: 1800, off: 0 }, { y: 252, calm: 2200, wind: 2000, off: 1300 }];
const GUST_H = 30;
const RING_SPEED = 34, RING_EVERY = 3400, RING_MAX = 150, RING_GAP = 14, RING_THICK = 4;

type Phase = "wait" | "purge" | "carve" | "climb" | "summit" | "done";

/** Stage 12: topple 4 gold furnaces between delusion rings, smash the calf, carve 2 tablets from a model, carry them through whirlwinds, intercede. */
export class Stage12GoldenCalfMercyScene extends BaseExodusScene {
  private phase: Phase = "wait";
  private forges: { img: Phaser.GameObjects.Sprite; out: boolean; smoke: Phaser.GameObjects.Image[] }[] = [];
  private calf?: Phaser.GameObjects.Sprite;
  private calfBroken = false;
  private gate?: { set: (v: boolean) => void; isClosed: () => boolean };
  private rings: number[] = [];
  private ringT = 0;
  private ringG?: Phaser.GameObjects.Graphics;
  private immune = 0;
  private stone = 0;
  private cells: { present: boolean; rect: Phaser.GameObjects.Rectangle; hi: Phaser.GameObjects.Rectangle }[] = [];
  private modelRects: Phaser.GameObjects.Rectangle[] = [];
  private gustT: number[] = [];
  private gustFx: Phaser.GameObjects.TileSprite[] = [];
  private gustOn: boolean[] = [];
  private carryImg?: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;
  private moses?: Phaser.GameObjects.Image;
  private halo?: Phaser.GameObjects.Image;

  constructor() {
    super("Stage12GoldenCalfMercyScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_12_be_vang_chuyen_cau";
    this.spawn = START;
  }

  create() {
    this.phase = "wait";
    this.forges = []; this.cells = []; this.modelRects = []; this.gustFx = []; this.rings = [];
    this.calfBroken = false;
    this.ringT = 0; this.immune = 0; this.stone = 0;
    this.gustT = GUSTS.map((g) => g.off);
    this.gustOn = GUSTS.map(() => false);
    this.intro = { illustration: "12", speaker: STAGE12.speaker, lines: STAGE12.intro.map(tr) };
    super.create();
  }

  // ---------------------------------------------------------------- world

  protected buildWorld() {
    registerSiteTextures(this);
    registerMountTextures(this);
    registerRephidimTextures(this);
    registerSinaiTextures(this);
    registerCalfTextures(this);

    // dawn sky bands (stepped), cliff everywhere that is not walkable, then the floors
    [0x1e1b4b, 0x4c1d95, 0x9d174d, 0xf97316, 0xfde68a].forEach((c, i) => this.add.rectangle(0, i * 15, W, 15, c).setOrigin(0).setDepth(DEPTH.FLOOR));
    this.add.rectangle(W / 2 - 14, 52, 28, 8, 0xfef08a).setOrigin(0).setDepth(DEPTH.FLOOR + 1); // rising sun
    this.add.tileSprite(0, 60, W, H - 60, "mt_cliff").setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    this.add.tileSprite(32, SUMMIT_Y0, W - 64, SUMMIT_Y1 - SUMMIT_Y0, "mt_ground").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(PATH_X0, SUMMIT_Y1, PATH_X1 - PATH_X0, SHELTER_Y0 - SUMMIT_Y1, "sn_step").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(32, SHELTER_Y0, W - 64, SHELTER_Y1 - SHELTER_Y0, "mt_ground").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(32, CAMP_Y0, W - 64, CAMP_Y1 - CAMP_Y0, "exodus_sand").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(40, 100, W - 80, SUMMIT_Y1 - 100, 0xfde68a, 0.2).setOrigin(0).setDepth(DEPTH.RUG + 1); // golden summit rug
    this.add.rectangle(PATH_X0, SUMMIT_Y1, 2, SHELTER_Y0 - SUMMIT_Y1, 0x000000, 0.35).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.add.rectangle(PATH_X1 - 2, SUMMIT_Y1, 2, SHELTER_Y0 - SUMMIT_Y1, 0x000000, 0.35).setOrigin(0).setDepth(DEPTH.RUG + 1);
    this.add.rectangle(W / 2 - 24, 60, 48, SUMMIT_Y1 - 60, 0xfde68a, 0.1).setOrigin(0).setDepth(DEPTH.LIGHT); // dawn beam

    // colliders (cliffs)
    this.block(W / 2, SUMMIT_Y0 / 2, W, SUMMIT_Y0);
    this.block(16, (SUMMIT_Y0 + SUMMIT_Y1) / 2, 32, SUMMIT_Y1 - SUMMIT_Y0);
    this.block(W - 16, (SUMMIT_Y0 + SUMMIT_Y1) / 2, 32, SUMMIT_Y1 - SUMMIT_Y0);
    this.block(32 + (PATH_X0 - 32) / 2, (SUMMIT_Y1 + SHELTER_Y0) / 2, PATH_X0 - 32, SHELTER_Y0 - SUMMIT_Y1);
    this.block(PATH_X1 + (W - 32 - PATH_X1) / 2, (SUMMIT_Y1 + SHELTER_Y0) / 2, W - 32 - PATH_X1, SHELTER_Y0 - SUMMIT_Y1);
    this.block(16, (SUMMIT_Y1 + CAMP_Y1) / 2, 32, CAMP_Y1 - SUMMIT_Y1);
    this.block(W - 16, (SUMMIT_Y1 + CAMP_Y1) / 2, 32, CAMP_Y1 - SUMMIT_Y1);
    this.block(W / 2, (CAMP_Y1 + H) / 2, W, H - CAMP_Y1);
    this.block(88, SHELTER_Y1 + 6, 112, 12); // wall between shelter and camp, left of the gate
    this.block(264, SHELTER_Y1 + 6, 112, 12); // ...and right of it
    this.gate = this.door(W / 2, SHELTER_Y1 + 6, 64, 12, "site_fence", true);
    this.add.tileSprite(32, SHELTER_Y1, 112, 12, "mt_cliff").setOrigin(0).setDepth(SHELTER_Y1 + 12);
    this.add.tileSprite(W / 2 + 32, SHELTER_Y1, 112, 12, "mt_cliff").setOrigin(0).setDepth(SHELTER_Y1 + 12);

    // camp decor: smoky tents, the people (dazed) and the faithful Levites; torches at the summit
    for (const x of [48, 304]) this.add.image(x, 462, "site_tent").setOrigin(0.5, 1).setDepth(462);
    for (const [x, y, k] of [[112, 430, "exodus_slave"], [240, 436, "exodus_girl0"], [100, 480, "exodus_girl2"], [250, 482, "exodus_bully"]] as [number, number, string][]) this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y);
    this.add.image(132, 396, "exodus_joshua").setOrigin(0.5, 1).setDepth(396);
    this.add.image(222, 396, "exodus_aaron").setOrigin(0.5, 1).setDepth(396);
    for (const [x, y, k] of [[52, 330, "site_rock"], [300, 336, "site_rock"], [44, 188, "site_shrub"], [308, 190, "site_shrub"], [60, 130, "site_rock"], [296, 126, "site_rock"]] as [number, number, string][]) this.add.image(x, y, k).setOrigin(0.5, 1).setDepth(y);
    let flick = 0;
    const torches = [[96, 130], [256, 130]].map(([x, y]) => this.add.sprite(x, y, "rp_flame", 0).setOrigin(0.5, 1).setDepth(y));
    this.time.addEvent({ delay: 260, loop: true, callback: () => { flick ^= 1; torches.forEach((s) => s.setFrame(flick)); } });

    // forges (smoke puffs bob above them until knocked over)
    FORGES.forEach(([x, y], i) => {
      const img = this.add.sprite(x, y, "gc_forge", 0).setOrigin(0.5, 1).setDepth(y);
      const smoke = [0, 1].map((k) => this.add.image(x - 2 + k * 6, y - 34 - k * 6, "exodus_glow_fire").setDepth(y + 1).setAlpha(0.25));
      smoke.forEach((s, k) => this.tweens.add({ targets: s, y: s.y - 6, alpha: 0.05, duration: 1400 + k * 300, repeat: -1, ease: "Stepped", easeParams: [4] }));
      this.forges.push({ img, out: false, smoke });
      this.block(x, y - 6, 20, 10);
      this.interactables.push({ x, y: y - 6, r: 24, label: () => tr(STAGE12.forge), active: () => this.phase === "purge" && !this.forges[i].out, act: () => this.topple(i) });
    });
    this.calf = this.add.sprite(CALF[0], CALF[1], "gc_calf", 0).setOrigin(0.5, 1).setDepth(CALF[1]);
    this.block(CALF[0], CALF[1] - 6, 26, 12);
    this.interactables.push({ x: CALF[0], y: CALF[1] + 4, r: 28, label: () => tr(this.forges.every((f) => f.out) ? STAGE12.calf : STAGE12.calfLocked), active: () => this.phase === "purge" && !this.calfBroken, act: () => this.smash() });
    this.ringG = this.add.graphics().setDepth(DEPTH.FX - 100);

    // shelter: workbench, model tablet, 16 carving cells
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const x = GRID_X + c * CELL, y = GRID_Y + r * CELL;
      const rect = this.add.rectangle(x, y, CELL - 1, CELL - 1, 0x8b8f98).setOrigin(0).setDepth(DEPTH.RUG + 2).setVisible(false);
      const hi = this.add.rectangle(x, y, CELL - 1, 3, 0xcbd5e1).setOrigin(0).setDepth(DEPTH.RUG + 3).setVisible(false);
      this.cells.push({ present: false, rect, hi });
      this.interactables.push({ x: x + CELL / 2, y: y + CELL / 2, r: 9, label: () => tr(STAGE12.chip), active: () => this.phase === "carve" && this.cells[r * 4 + c].present, act: () => this.chip(r * 4 + c) });
    }
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) this.modelRects.push(this.add.rectangle(MODEL_X + c * MCELL, MODEL_Y + r * MCELL, MCELL - 1, MCELL - 1, 0xfde68a).setOrigin(0).setDepth(DEPTH.RUG + 2).setVisible(false));
    this.add.text(MODEL_X + 16, MODEL_Y - 6, tr(STAGE12.model), { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.UI);
    this.add.image(MODEL_X + 52, SHELTER_Y1 - 6, "gc_bench").setOrigin(0.5, 1).setDepth(SHELTER_Y1 - 6);

    // whirlwind strips over the corridor
    GUSTS.forEach((g) => this.gustFx.push(this.add.tileSprite(PATH_X0, g.y, PATH_X1 - PATH_X0, GUST_H, "gc_gust", 0).setOrigin(0).setDepth(DEPTH.FX - 100).setAlpha(0).setVisible(false)));

    // summit: the rock cleft, Moses waiting, a halo for later
    this.add.image(NICHE[0], NICHE[1], "gc_niche").setOrigin(0.5, 1).setDepth(NICHE[1]);
    this.block(NICHE[0], NICHE[1] - 10, 40, 16);
    this.halo = this.add.image(NICHE[0] - 34, NICHE[1] - 24, "exodus_glow_gold").setDepth(NICHE[1] - 1).setAlpha(0);
    this.moses = this.add.image(NICHE[0] - 34, NICHE[1], "exodus_moses_leader").setOrigin(0.5, 1).setDepth(NICHE[1]).setVisible(false);
    this.interactables.push({ x: NICHE[0], y: NICHE[1] + 8, r: 34, label: () => tr(STAGE12.niche), active: () => this.phase === "summit", act: () => this.pray() });

    this.carryImg = this.add.image(0, 0, "exodus_tablets").setDepth(DEPTH.FX).setVisible(false);
    this.label = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, align: "center", resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  // ---------------------------------------------------------------- flow

  protected onStageStart() {
    this.phase = "wait";
    this.talk(STAGE12.speaker, STAGE12.start.map(tr), () => this.startPurge());
  }

  protected onCheckpointRestore(id: string, state: unknown) {
    this.immune = 1500;
    if (id === "carve") this.startCarve((state as { stone: number } | null)?.stone ?? 0, false);
    else if (id === "climb") this.startClimb(false);
  }

  private startPurge() {
    this.phase = "purge";
    this.initGrace(5);
    this.saveCheckpoint("purge", null, START[0], START[1]);
  }

  private topple(i: number) {
    const f = this.forges[i];
    f.out = true;
    f.img.setFrame(1);
    f.smoke.forEach((s) => { this.tweens.killTweensOf(s); s.destroy(); });
    audio.sfx("staff");
    this.sparkleBurst(FORGES[i][0], FORGES[i][1] - 12, 8);
    this.cameras.main.shake(100, 0.003);
    if (this.forges.every((x) => x.out)) this.time.delayedCall(500, () => this.talk(STAGE12.speaker, STAGE12.forgesDone.map(tr)));
  }

  private smash() {
    if (!this.forges.every((f) => f.out)) { audio.sfx("wrong"); return; }
    this.calfBroken = true;
    this.calf?.setFrame(1);
    this.rings = [];
    this.ringG?.clear();
    this.initGrace(0);
    audio.sfx("bless");
    this.cameras.main.flash(400, 255, 244, 200);
    this.sparkleBurst(CALF[0], CALF[1] - 20, 12);
    this.phase = "wait";
    this.time.delayedCall(800, () => this.talk(STAGE12.speaker, STAGE12.smashed.map(tr), () => { this.gate?.set(false); this.startCarve(0, true); }));
  }

  private startCarve(stone: number, intro: boolean) {
    this.stone = stone;
    this.phase = "wait";
    this.moses?.setVisible(false);
    this.layoutGrid();
    this.saveCheckpoint("carve", { stone }, CARVE_START[0], CARVE_START[1]);
    this.player.setPosition(CARVE_START[0], CARVE_START[1]);
    const go = () => { this.phase = "carve"; };
    if (intro) this.talk(STAGE12.speaker, STAGE12.carveIntro.map(tr), go); else go();
  }

  private layoutGrid() {
    const model = MODELS[this.stone];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const i = r * 4 + c;
      this.cells[i].present = true;
      this.cells[i].rect.setVisible(true); this.cells[i].hi.setVisible(true);
      this.modelRects[i].setVisible(model[r][c] === "X");
    }
  }

  private isCore(i: number) { return MODELS[this.stone][Math.floor(i / 4)][i % 4] === "X"; }

  private chip(i: number) {
    const cell = this.cells[i];
    const x = GRID_X + (i % 4) * CELL + CELL / 2, y = GRID_Y + Math.floor(i / 4) * CELL + CELL / 2;
    if (this.isCore(i)) {
      audio.sfx("wrong");
      this.cameras.main.shake(140, 0.004);
      this.phase = "wait";
      this.layoutGrid();
      this.talk(STAGE12.speaker, STAGE12.cracked.map(tr), () => { this.phase = "carve"; });
      return;
    }
    cell.present = false;
    cell.rect.setVisible(false); cell.hi.setVisible(false);
    audio.sfx("staff");
    this.sparkleBurst(x, y, 5);
    this.toast(x, y - 8, tr(STAGE12.chipOk), "#bbf7d0");
    const left = this.cells.filter((c, k) => c.present && !this.isCore(k)).length;
    if (left === 0) this.stoneDone();
  }

  private stoneDone() {
    this.phase = "wait";
    audio.sfx("chime");
    this.cameras.main.flash(300, 255, 244, 200);
    const s = this.stone;
    this.time.delayedCall(500, () => this.talk(STAGE12.speaker, [tr(STAGE12.stoneDone[s])], () => {
      if (s === 0) this.startCarve(1, false);
      else this.startClimb(true);
    }));
  }

  private startClimb(intro: boolean) {
    this.cells.forEach((c) => { c.present = false; c.rect.setVisible(false); c.hi.setVisible(false); });
    this.modelRects.forEach((m) => m.setVisible(false));
    this.player.setPosition(CLIMB_START[0], CLIMB_START[1]);
    this.saveCheckpoint("climb", null, CLIMB_START[0], CLIMB_START[1]);
    this.phase = "wait";
    this.gustFx.forEach((g) => g.setVisible(true));
    const go = () => { this.phase = "climb"; };
    if (intro) this.talk(STAGE12.speaker, STAGE12.carryUp.map(tr), go); else go();
  }

  private pray() {
    this.moses?.setVisible(true);
    this.carryImg?.setVisible(false);
    this.phase = "wait";
    this.talk(STAGE12.speaker, STAGE12.atNiche.map(tr), () => { this.phase = "summit"; this.askPrayer(); });
  }

  private askPrayer() {
    this.phase = "wait";
    this.talk("Lời cầu bầu", [tr(STAGE12.atNiche[1])], undefined, STAGE12.prayer.map((o) => ({
      label: tr(o.label),
      onSelect: () => {
        if (o.right) { audio.sfx("chime"); this.mercy(); return; }
        audio.sfx("wrong");
        this.talk(STAGE12.speaker, STAGE12.prayerWrong.map(tr), () => { this.phase = "summit"; });
      },
    })));
  }

  private mercy() {
    this.phase = "done";
    audio.sfx("bless");
    this.cameras.main.flash(600, 255, 244, 200);
    this.halo?.setAlpha(0.8);
    if (this.halo) this.tweens.add({ targets: this.halo, alpha: 0.4, duration: 900, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [4] });
    this.sparkleBurst(NICHE[0], NICHE[1] - 30, 14);
    this.time.delayedCall(900, () => this.talk("Đức Chúa", STAGE12.mercy.map(tr), () => this.won()));
  }

  private won() {
    audio.sfx("complete");
    this.completeStage();
    this.talk("Ấn Dấu thứ 12", STAGE12.outro.map(tr), () =>
      this.talk("Suy niệm", [tr(STAGE12.lesson)], () =>
        this.talk("Trại Ít-ra-en", STAGE12.cutscene.map(tr), () => this.goToNextStage())));
  }

  private toast(x: number, y: number, msg: string, color = "#fecaca") {
    const t = this.add.text(Math.round(x), Math.round(y), msg, { fontFamily: "Dearpix, monospace", fontSize: "10px", color, backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.UI);
    const v = this.cameras.main.worldView;
    t.setX(Math.round(Phaser.Math.Clamp(x, v.x + t.width / 2 + 4, v.right - t.width / 2 - 4)));
    this.tweens.add({ targets: t, y: t.y - 6, alpha: 0, duration: 1400, delay: 300, onComplete: () => t.destroy() });
  }

  // ---------------------------------------------------------------- frame update

  update(time?: number, delta = 16) {
    super.update(time, delta);
    const view = this.cameras.main.worldView;
    const p = this.player;
    let hud = "";
    if (this.phase === "purge") hud = `${tr(STAGE12.forgeHud)} ${this.forges.filter((f) => f.out).length}/4`;
    else if (this.phase === "carve") hud = `${tr(STAGE12.carveHud)} ${this.stone}/2`;
    else if (this.phase === "climb") hud = tr(STAGE12.climbHud);
    this.label?.setPosition(Math.round(view.centerX), Math.round(view.y + this.safeInsetTop() + 4)).setText(hud).setVisible(!!hud);
    const carrying = this.phase === "climb" || (this.phase === "wait" && this.gustFx[0]?.visible);
    this.carryImg?.setVisible(!!carrying && this.phase !== "done").setPosition(Math.round(p.x), Math.round(p.y - 30)).setDepth(p.y + 17);

    p.speedScale = 1;
    if (this.introActive || this.dialogueOpen) return;
    this.immune = Math.max(0, this.immune - delta);
    if (this.phase === "purge") this.updateRings(delta);
    if (this.phase === "climb") this.updateGusts(delta);
  }

  private updateRings(delta: number) {
    this.ringT -= delta;
    if (this.ringT <= 0) { this.ringT = RING_EVERY; this.rings.push(RING_GAP); }
    this.rings = this.rings.map((r) => r + (RING_SPEED * delta) / 1000).filter((r) => r < RING_MAX);
    const g = this.ringG;
    g?.clear();
    const [cx, cy] = CALF;
    const clip = (x0: number, y0: number, x1: number, y1: number) => {
      const ax = Math.max(32, Math.min(x0, x1)), bx = Math.min(W - 32, Math.max(x0, x1));
      const ay = Math.max(CAMP_Y0, Math.min(y0, y1)), by = Math.min(CAMP_Y1, Math.max(y0, y1));
      if (bx > ax && by > ay) g?.fillRect(Math.round(ax), Math.round(ay), Math.round(bx - ax), Math.round(by - ay));
    };
    for (const r0 of this.rings) {
      const r = Math.round(r0);
      g?.fillStyle(0x7c3aed, 0.55);
      for (const dir of [-1, 1]) {
        // horizontal sides (top / bottom), split by the gap in the middle
        const y = cy + dir * r;
        clip(cx - r, y, cx - RING_GAP, y + RING_THICK); clip(cx + RING_GAP, y, cx + r, y + RING_THICK);
        // vertical sides (left / right)
        const x = cx + dir * r;
        clip(x, cy - r, x + RING_THICK, cy - RING_GAP); clip(x, cy + RING_GAP, x + RING_THICK, cy + r);
      }
    }
    // contact: stepping on a ring's band outside its gaps costs one pip
    const p = this.player;
    const dx = Math.abs(p.x - cx), dy = Math.abs(p.y - cy);
    const d = Math.max(dx, dy);
    if (this.immune > 0) return;
    for (const r of this.rings) {
      if (Math.abs(d - r) > RING_THICK) continue;
      const inGap = dy >= dx ? dx < RING_GAP : dy < RING_GAP;
      if (inGap) continue;
      this.immune = 1500;
      this.toast(p.x, p.y - 26, tr(STAGE12.ringHit));
      this.loseGrace();
      break;
    }
  }

  private updateGusts(delta: number) {
    const p = this.player;
    GUSTS.forEach((g, i) => {
      this.gustT[i] += delta;
      const cycle = g.calm + g.wind;
      const m = this.gustT[i] % cycle;
      const on = m >= g.calm;
      const warn = !on && m > g.calm - 500;
      this.gustOn[i] = on;
      const fx = this.gustFx[i];
      fx.setAlpha(on ? 0.8 : warn ? 0.35 : 0).setFrame(Math.floor(this.gustT[i] / 140) % 2);
      fx.tilePositionX += on ? 3 : 0;
      if (on && p.y > g.y - 6 && p.y < g.y + GUST_H + 14) {
        p.speedScale = 0.12;
        p.y += 0.45; // the whirlwind pushes back
        if (Math.floor(this.gustT[i] / 1500) !== Math.floor((this.gustT[i] - delta) / 1500)) this.toast(p.x, p.y - 26, tr(STAGE12.gust), "#fde68a");
      }
    });
    if (p.y < SUMMIT_Y1 + 4) {
      this.phase = "wait";
      audio.sfx("chime");
      this.gustFx.forEach((g) => g.setVisible(false));
      this.time.delayedCall(300, () => { this.phase = "summit"; this.moses?.setVisible(true); });
    }
  }
}
