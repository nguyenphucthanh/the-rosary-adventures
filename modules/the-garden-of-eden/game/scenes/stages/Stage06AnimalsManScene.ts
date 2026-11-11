import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 320;
const H = 240;
const ALTAR: [number, number] = [160, 132]; // Bệ Đất Thánh (foot)
// the four Red Earth Essences, in the order the Holy Spirit shows them (clockwise from the hill)
const ESS: { x: number; y: number; name: string }[] = [
  { x: 50, y: 34, name: tx("Trí Khôn", "Wisdom") },
  { x: 270, y: 34, name: tx("Trái Tim Yêu Thương", "A Loving Heart") },
  { x: 270, y: 206, name: tx("Đôi Tay Lao Động", "Working Hands") },
  { x: 50, y: 206, name: tx("Ý Chí Tự Do", "Free Will") },
];
// patrolling animals: moving along one axis between min and max
const PATROLS = [
  { tex: "gen_elephant", axis: "x" as const, at: 70, min: 30, max: 290, speed: 42 },
  { tex: "gen_lion", axis: "x" as const, at: 172, min: 30, max: 290, speed: 60 },
  { tex: "gen_deer", axis: "y" as const, at: 100, min: 22, max: 218, speed: 92 },
  { tex: "gen_deer", axis: "y" as const, at: 220, min: 22, max: 218, speed: 78 },
];
const BREATHS = 3;
type Mode = "idle" | "memory" | "gather" | "breath" | "done";

interface Animal { s: Phaser.GameObjects.Sprite; axis: "x" | "y"; min: number; max: number; speed: number; dir: 1 | -1; pos: number; at: number }

/** Stage 6: memorise the 4 hidden essences (5 s), gather them in order past running animals, then time the Breath of Life. */
export class Stage06AnimalsManScene extends BaseGenesisScene {
  private mode: Mode = "idle";
  private animals: Animal[] = [];
  private collected = 0;
  private markers: Phaser.GameObjects.GameObject[] = [];
  private altarIcons: Phaser.GameObjects.Image[] = [];
  private countdown?: Phaser.GameObjects.Text;
  private invuln = 0;
  // breath mini-game
  private ringGfx?: Phaser.GameObjects.Graphics;
  private heart?: Phaser.GameObjects.Image;
  private breathT = 0;
  private breaths = 0;
  private breathText?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage06AnimalsManScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_06_muon_thu_con_nguoi";
    this.spawn = [160, 150];
  }

  create() {
    this.mode = "idle";
    this.animals = [];
    this.collected = 0;
    this.markers = [];
    this.altarIcons = [];
    this.breaths = 0;
    this.breathT = 0;
    this.invuln = 0;
    this.intro = { illustration: "adam", speaker: STAGE_TEXT.s6.speaker, lines: STAGE_TEXT.s6.intro.map(tr) };
    super.create();
  }

  private text(x: number, y: number, s: string, color = "#fde68a") {
    return this.add.text(x, y, s, { fontFamily: "Dearpix, monospace", fontSize: "10px", color, backgroundColor: "#0f172acc", padding: { x: 2, y: 1 }, resolution: 4 }).setOrigin(0.5).setDepth(DEPTH.FX);
  }

  protected buildWorld() {
    registerStageTextures(this);
    // four regions: Đồi Đá, Rừng Cây, Đồng Cỏ, Bờ Suối
    this.add.tileSprite(0, 0, 160, 120, "gen_rockfloor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(160, 0, 160, 120, "gen_forestfloor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(0, 120, 160, 120, "gen_floor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(160, 120, 160, 120, "gen_brookfloor").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0x15803d).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    for (const [x, y] of [[296, 96], [248, 22], [200, 60]]) this.prop(x, y, "gen_tree_s", 8, 6);
    this.add.image(ALTAR[0], ALTAR[1], "gen_clay_altar").setOrigin(0.5, 1).setDepth(ALTAR[1]);
    this.block(ALTAR[0], ALTAR[1] - 6, 28, 10);
    this.add.sprite(130, 214, "gen_sheep", 0).setOrigin(0.5, 1).setDepth(214); // a peaceful lamb

    PATROLS.forEach((p) => {
      const key = `${p.tex}_walk`;
      if (!this.anims.exists(key)) this.anims.create({ key, frames: this.anims.generateFrameNumbers(p.tex, { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
      this.animals.push({ s: this.add.sprite(0, 0, p.tex).play(key), axis: p.axis, min: p.min, max: p.max, speed: p.speed, dir: this.animals.length % 2 ? -1 : 1, pos: (p.min + p.max) / 2, at: p.at });
    });

    this.interactables = ESS.map((e, i) => ({
      x: e.x, y: e.y, r: 18, label: tx("[A] Tìm Tinh Hoa", "[A] Find the Essence"), active: () => this.mode === "gather" && i >= this.collected, act: () => this.gather(i),
    }));
  }

  protected onStageStart() {
    this.memoryFlash(5);
  }

  /** The Holy Spirit lights the four places and their order for a few seconds. */
  private memoryFlash(secs: number) {
    this.mode = "memory";
    this.markers.forEach((m) => m.destroy());
    this.markers = [];
    ESS.forEach((e, i) => {
      const glow = this.add.image(e.x, e.y, "gen_glow_gold").setDepth(DEPTH.FX - 3).setAlpha(0.8);
      const img = this.add.image(e.x, e.y, `gen_essence_${i}`).setDepth(DEPTH.FX - 2);
      const num = this.text(e.x, e.y - 14, `${i + 1}. ${e.name}`);
      this.markers.push(glow, img, num);
    });
    this.countdown = this.text(W / 2, 12, tx(`Ghi nhớ! ${secs}`, `Remember! ${secs}`));
    this.markers.push(this.countdown);
    let left = secs;
    this.time.addEvent({
      delay: 1000, repeat: secs - 1,
      callback: () => {
        left--;
        if (left > 0) return this.countdown?.setText(tx(`Ghi nhớ! ${left}`, `Remember! ${left}`));
        this.markers.forEach((m) => this.tweens.add({ targets: m, alpha: 0, duration: 500, ease: "Stepped", easeParams: [4], onComplete: () => m.destroy() }));
        this.markers = [];
        this.mode = "gather";
      },
    });
  }

  private gather(i: number) {
    if (i !== this.collected) { // wrong place in the order: gentle restart of the sequence
      audio.sfx("wrong");
      this.mode = "idle";
      this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), STAGE_TEXT.s6.wrong.map(tr), () => {
        this.collected = 0;
        this.altarIcons.forEach((a) => a.destroy());
        this.altarIcons = [];
        this.memoryFlash(3);
      });
      return;
    }
    audio.sfx("pickup");
    this.sparkleBurst(ESS[i].x, ESS[i].y, 8);
    this.altarIcons.push(this.add.image(ALTAR[0] - 18 + i * 12, ALTAR[1] - 24, `gen_essence_${i}`).setDepth(ALTAR[1] + 1));
    this.collected++;
    if (this.collected === ESS.length) {
      this.mode = "idle";
      this.time.delayedCall(500, () => this.talk(tx("Chúa Thánh Thần", "Holy Spirit"), STAGE_TEXT.s6.breath.map(tr), () => this.startBreath()));
    }
  }

  // ---------------------------------------------------------------- breath of life

  private startBreath() {
    this.mode = "breath";
    this.breaths = 0;
    this.breathT = 0;
    this.heart = this.add.image(ALTAR[0], ALTAR[1] - 46, "gen_heart").setDepth(DEPTH.FX);
    this.ringGfx = this.add.graphics().setDepth(DEPTH.FX);
    this.breathText = this.text(ALTAR[0], ALTAR[1] - 76, tx(`Nhịp thở 0/${BREATHS}`, `Breaths 0/${BREATHS}`));
  }

  private ringSize() {
    return 8 + Math.round(40 * (1 - (this.breathT % 1800) / 1800)); // shrinks 48 -> 8 px, then repeats
  }

  protected handleActionTrigger() {
    if (this.mode !== "breath") return super.handleActionTrigger();
    const hit = Math.abs(this.ringSize() - 14) <= 5; // ring snug around the heart
    if (!hit) {
      audio.sfx("wrong");
      this.cameras.main.shake(100, 0.004);
      return;
    }
    this.breaths++;
    audio.sfx("chime");
    this.sparkleBurst(ALTAR[0], ALTAR[1] - 46, 6);
    this.breathText?.setText(tx(`Nhịp thở ${this.breaths}/${BREATHS}`, `Breaths ${this.breaths}/${BREATHS}`));
    if (this.breaths >= BREATHS) this.lifeBreathed();
  }

  private lifeBreathed() {
    this.mode = "done";
    this.ringGfx?.destroy();
    this.breathText?.destroy();
    this.cameras.main.flash(600, 255, 244, 180);
    audio.sfx("bless");
    this.add.sprite(ALTAR[0], ALTAR[1] - 6, "gen_adam", 0).setOrigin(0.5, 1).setDepth(ALTAR[1] + 2);
    this.sparkleBurst(ALTAR[0], ALTAR[1] - 22, 14);
    this.animals.forEach((a) => (a.speed = 0));
    this.time.delayedCall(1600, () => this.finishStage(STAGE_TEXT.s6));
  }

  // ---------------------------------------------------------------- frame

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.dialogueOpen) return;
    const dt = Math.min(delta, 50) / 1000;
    const px = this.player.x, py = this.player.y + 9;

    for (const a of this.animals) {
      a.pos += a.dir * a.speed * dt;
      if (a.pos > a.max || a.pos < a.min) {
        a.dir = (a.dir * -1) as 1 | -1;
        a.pos = Phaser.Math.Clamp(a.pos, a.min, a.max);
      }
      const x = a.axis === "x" ? a.pos : a.at, y = a.axis === "x" ? a.at : a.pos;
      a.s.setPosition(Math.round(x), Math.round(y)).setDepth(y + 8).setFlipX(a.axis === "x" ? a.dir < 0 : false);
      if ((this.mode === "gather" || this.mode === "memory") && this.time.now > this.invuln && Math.hypot(px - x, py - y) < 15) {
        this.invuln = this.time.now + 1300; // knocked back to the Holy Clay Altar
        audio.sfx("wrong");
        this.cameras.main.flash(200, 255, 255, 255);
        this.player.setPosition(ALTAR[0], ALTAR[1] + 14);
      }
    }

    if (this.mode === "breath" && this.ringGfx) {
      this.breathT += delta;
      const s = this.ringSize(), good = Math.abs(s - 14) <= 5;
      this.ringGfx.clear().lineStyle(2, good ? 0xfde68a : 0xf8fafc, 1).strokeRect(Math.round(ALTAR[0] - s / 2), Math.round(ALTAR[1] - 46 - s / 2), s, s);
    }
  }
}
