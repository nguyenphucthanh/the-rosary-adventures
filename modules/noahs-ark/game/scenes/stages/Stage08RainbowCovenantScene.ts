import * as Phaser from "phaser";
import { BaseNoahScene, DEPTH } from "@/modules/noahs-ark/game/scenes/BaseNoahScene";
import { registerStageTextures } from "@/modules/noahs-ark/game/utils/stageTextures";
import { registerVoyageTextures, SPECTRUM } from "@/modules/noahs-ark/game/utils/voyageTextures";
import { NOAH_TEXT } from "@/modules/noahs-ark/data/stageText";
import { tr } from "@/modules/noahs-ark/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 240;
const H = 360;
type P = [number, number];
const ALTAR: P = [120, 326];
const BEAM_START: P = [120, 308];
const ARCH_Y = 100; // arch base; the finished beam ends here
const STREAMS = [146, 231]; // centre y of the two streams; each has a 24px gap at x=120 to bridge
const STONES: P[] = [[30, 285], [200, 285], [70, 255], [170, 310], [30, 175], [205, 175], [80, 205], [165, 205], [30, 115], [75, 70], [165, 70], [212, 118]];
const PLANKS: P[] = [[150, 285], [130, 175]]; // plank 1 bridges the south stream, plank 2 the north one
const TREES: P[] = [[16, 40], [224, 40], [16, 340], [224, 340]];
// Crystal pillars in rainbow order. The beam goes altar -> 1 -> 2 ... -> 7 -> arch; each pillar's facing says where it sends the beam.
const CR: P[] = [[120, 260], [40, 260], [40, 190], [120, 190], [200, 190], [200, 120], [120, 120]];
// Solution facings: 3,0,1,1,0,3,0 (0 up, 1 right, 2 down, 3 left). Start scrambled; pillar 1 starts facing up at decoy pillar 4.
const START_FACE = [0, 2, 3, 2, 2, 2, 1];
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

interface Seg { x1: number; y1: number; x2: number; y2: number; col: number }

/** Stage 8: gather 12 stones for the altar (bridging two streams), then turn seven crystal pillars so the ray runs Red -> Violet. */
export class Stage08RainbowCovenantScene extends BaseNoahScene {
  private stoneImgs: (Phaser.GameObjects.Image | null)[] = [];
  private plankImgs: (Phaser.GameObjects.Image | null)[] = [];
  private bridges: ReturnType<BaseNoahScene["door"]>[] = [];
  private bridgeDone = [false, false];
  private got = 0;
  private plank = false;
  private heldImg?: Phaser.GameObjects.Image;
  private phase = 1;
  private face = [...START_FACE];
  private crystals: Phaser.GameObjects.Sprite[] = [];
  private glows: Phaser.GameObjects.Image[] = [];
  private arrows: Phaser.GameObjects.Sprite[] = [];
  private beam?: Phaser.GameObjects.Graphics;
  private arch?: Phaser.GameObjects.Image;
  private label?: Phaser.GameObjects.Text;
  private lit = 0;
  private busy = false;

  constructor() {
    super("Stage08RainbowCovenantScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_08_cau_vong_giao_uoc";
    this.spawn = [120, 292];
  }

  create() {
    this.stoneImgs = [];
    this.plankImgs = [];
    this.bridges = [];
    this.bridgeDone = [false, false];
    this.crystals = [];
    this.glows = [];
    this.arrows = [];
    this.got = 0;
    this.plank = false;
    this.phase = 1;
    this.lit = 0;
    this.busy = false;
    this.face = [...START_FACE];
    this.intro = { illustration: "stage8", speaker: NOAH_TEXT.s8.speaker, lines: NOAH_TEXT.s8.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerStageTextures(this);
    registerVoyageTextures(this);
    this.add.tileSprite(0, 0, W, H, "noah_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H, 0xfde68a, 0.07).setOrigin(0).setDepth(DEPTH.LIGHT); // clean morning light
    for (let i = 0; i < 26; i++) this.add.image((i * 53 + 17) % 232 + 4, (i * 89 + 31) % 340 + 8, "noah_flower").setOrigin(0.5, 1).setDepth(DEPTH.RUG - 0.5);
    this.add.image(40, 56, "noah_mount").setOrigin(0.5, 1).setDepth(DEPTH.RUG).setAlpha(0.7);
    this.arch = this.add.image(120, ARCH_Y, "noah_rainbow_big").setOrigin(0.5, 1).setDepth(DEPTH.RUG + 1).setAlpha(0);
    for (const [x, y] of TREES) this.prop(x, y, "noah_olivetree", 14, 8);
    this.block(W / 2, 2, W, 4); this.block(2, H / 2, 4, H); this.block(W - 2, H / 2, 4, H); this.block(W / 2, H - 2, W, 4);

    // streams, each with a gap that needs a plank
    STREAMS.forEach((y, i) => {
      this.add.tileSprite(0, y - 6, W, 12, "noah_water").setOrigin(0).setDepth(DEPTH.RUG);
      this.block(54, y, 108, 12); this.block(186, y, 108, 12);
      this.bridges.push(this.door(120, y, 24, 12, "noah_water", true));
      this.interactables.push({ x: 120, y: y + (i ? 4 : 0), r: 24, label: "[A] Bắc ván qua suối", active: () => this.plank && !this.bridgeDone[i], act: () => this.bridge(i) });
    });
    PLANKS.forEach(([x, y], i) => {
      this.plankImgs.push(this.pickup(x, y, "noah_wood"));
      this.interactables.push({ x, y: y - 4, r: 18, label: "[A] Nhặt ván gỗ", active: () => !!this.plankImgs[i] && !this.plank, act: () => this.takePlank(i) });
    });
    // stones
    STONES.forEach(([x, y], i) => {
      this.stoneImgs.push(this.pickup(x, y, "noah_stone"));
      this.interactables.push({ x, y: y - 4, r: 18, label: "[A] Nhặt Viên Đá Tinh Tuyền", active: () => !!this.stoneImgs[i], act: () => this.collect(i) });
    });
    // gentle animals on the hill (idle, two-frame step)
    const pets: [string, number, number][] = [["noah_sheep", 60, 305], ["noah_zebra", 190, 252], ["noah_deer", 52, 168]];
    const petS = pets.map(([k, x, y]) => this.add.sprite(x, y, k, 0).setOrigin(0.5, 1).setDepth(y));
    this.time.addEvent({ delay: 600, loop: true, callback: () => petS.forEach((s) => s.setFrame(((this.time.now / 600) | 0) % 2)) });
    // the family kneels by the altar site
    this.add.sprite(88, 328, "noah_noah").setOrigin(0.5, 1).setDepth(328);
    this.add.sprite(152, 328, "noah_wife").setOrigin(0.5, 1).setDepth(328);
    this.add.sprite(70, 340, "noah_shem").setOrigin(0.5, 1).setDepth(340);
    this.add.sprite(170, 340, "noah_ham").setOrigin(0.5, 1).setDepth(340);

    this.beam = this.add.graphics().setDepth(DEPTH.FX - 4);
    this.heldImg = this.add.image(0, 0, "noah_wood").setDepth(DEPTH.FX).setVisible(false);
    this.label = this.add.text(W / 2, 4, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", backgroundColor: "#0f172acc", padding: { x: 3, y: 1 }, resolution: 4 }).setOrigin(0.5, 0).setDepth(DEPTH.UI);
  }

  protected onStageStart() {
    this.saveCheckpoint("start", null, 120, 292);
  }

  // ---------------------------------------------------------------- phase 1: the altar

  private takePlank(i: number) {
    const img = this.plankImgs[i];
    if (!img) return;
    this.removePickup(img);
    this.plankImgs[i] = null;
    this.plank = true;
    audio.sfx("pickup");
    this.heldImg?.setVisible(true);
  }

  private bridge(i: number) {
    this.bridgeDone[i] = true;
    this.plank = false;
    this.heldImg?.setVisible(false);
    this.bridges[i].set(false);
    this.add.tileSprite(108, STREAMS[i] - 6, 24, 12, "noah_bridge").setOrigin(0).setDepth(DEPTH.RUG + 1);
    audio.sfx("door");
    this.sparkleBurst(120, STREAMS[i], 6);
    this.talk("Em", NOAH_TEXT.s8.plank.map(tr));
  }

  private collect(i: number) {
    const img = this.stoneImgs[i];
    if (!img) return;
    this.removePickup(img);
    this.stoneImgs[i] = null;
    audio.sfx("pickup");
    // the stone joins the pile in front of the altar site
    this.add.image(48 + this.got * 12, 352, "noah_stone").setOrigin(0.5, 1).setDepth(352);
    if (++this.got === STONES.length) this.buildAltar();
  }

  private buildAltar() {
    this.busy = true;
    audio.sfx("bless");
    this.add.image(ALTAR[0], ALTAR[1], "noah_altar").setOrigin(0.5, 1).setDepth(ALTAR[1]);
    this.block(ALTAR[0], ALTAR[1] - 8, 44, 14);
    const fire = this.add.image(ALTAR[0], ALTAR[1] - 30, "noah_glow_gold").setDepth(ALTAR[1] + 1).setAlpha(0.6);
    this.tweens.add({ targets: fire, alpha: 0.9, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [3] });
    this.cameras.main.flash(500, 255, 244, 180);
    this.talk("Ông Nô-ê", NOAH_TEXT.s8.stones.map(tr), () => this.startPhase2());
  }

  // ---------------------------------------------------------------- phase 2: the seven colours

  private startPhase2() {
    this.phase = 2;
    this.busy = false;
    CR.forEach(([x, y], i) => {
      this.glows.push(this.add.image(x, y - 10, "noah_glow_gold").setDepth(y - 1).setAlpha(0));
      this.crystals.push(this.add.sprite(x, y, "noah_crystal", i).setOrigin(0.5, 1).setDepth(y));
      this.arrows.push(this.add.sprite(x, y - 26, "noah_arrow", this.face[i]).setDepth(DEPTH.FX - 2));
      this.block(x, y - 4, 12, 8);
      this.sparkleBurst(x, y - 10, 6);
      this.interactables.push({ x, y: y - 4, r: 20, label: "[A] Xoay Trụ Tinh Thể", active: () => this.phase === 2 && !this.busy, act: () => this.turn(i) });
    });
    this.saveCheckpoint("phase2", null, this.player.x, this.player.y);
    this.talk("Chúa Thánh Thần", NOAH_TEXT.s8.phase2.map(tr), () => this.trace());
    this.spawnDove(120, 296);
  }

  private turn(i: number) {
    this.face[i] = (this.face[i] + 1) % 4;
    this.arrows[i].setFrame(this.face[i]);
    audio.sfx("pickup");
    this.trace();
  }

  /** Follow the ray from the altar: it must reach crystal 0, 1, 2... in order; a wrong crystal (or empty air) breaks it there. */
  private trace() {
    const segs: Seg[] = [];
    let lit = 0, cx = BEAM_START[0], cy = BEAM_START[1], dir = 0, col = 0xffffff;
    for (;;) {
      let best = -1, bd = Infinity;
      CR.forEach(([x, y], k) => {
        if (k < lit) return;
        const dx = x - cx, dy = y - cy;
        const along = dx * DX[dir] + dy * DY[dir];
        const off = dir % 2 === 0 ? Math.abs(dx) : Math.abs(dy);
        if (along > 4 && off < 6 && along < bd) { best = k; bd = along; }
      });
      let tx: number, ty: number;
      if (best >= 0) [tx, ty] = CR[best];
      else if (dir === 0 && lit === CR.length) [tx, ty] = [cx, ARCH_Y];
      else [tx, ty] = [dir === 1 ? W : dir === 3 ? 0 : cx, dir === 2 ? H : dir === 0 ? 0 : cy];
      segs.push({ x1: cx, y1: cy - (lit ? 8 : 0), x2: tx, y2: ty - (best >= 0 ? 8 : 0), col });
      if (best !== lit) break; // empty air or the wrong colour
      lit++;
      [cx, cy, dir, col] = [tx, ty, this.face[best], Phaser.Display.Color.HexStringToColor(SPECTRUM[best]).color];
    }
    const g = this.beam?.clear();
    for (const s of segs) {
      g?.fillStyle(s.col, 0.9);
      const [x, y] = [Math.min(s.x1, s.x2), Math.min(s.y1, s.y2)];
      g?.fillRect(x - 1, y - 1, Math.abs(s.x2 - s.x1) + 3, Math.abs(s.y2 - s.y1) + 3);
    }
    this.glows.forEach((gl, i) => gl.setAlpha(i < lit ? 0.85 : 0));
    if (lit > this.lit) { audio.sfx("chime"); this.sparkleBurst(CR[lit - 1][0], CR[lit - 1][1] - 10, 6); }
    this.lit = lit;
    if (lit === CR.length && this.face[CR.length - 1] === 0) this.rainbow();
  }

  private rainbow() {
    this.busy = true;
    audio.sfx("bless");
    this.cameras.main.flash(700, 255, 244, 180);
    this.tweens.add({ targets: this.arch, alpha: 1, duration: 1200, ease: "Stepped", easeParams: [6] });
    this.time.delayedCall(1800, () => this.finishStage(NOAH_TEXT.s8));
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    this.heldImg?.setPosition(Math.round(this.player.x), Math.round(this.player.y - 18));
    this.label?.setText(
      this.phase === 1 ? `Đá tinh tuyền ${this.got}/${STONES.length}${this.plank ? " – đang cầm ván gỗ" : ""}` : this.lit ? `Tia sáng: ${NOAH_TEXT.s8.colours[this.lit - 1]}` : "Hãy xoay các Trụ Tinh Thể"
    );
  }
}
