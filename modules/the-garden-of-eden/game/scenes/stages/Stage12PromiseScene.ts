import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerGenesisTextures } from "@/modules/the-garden-of-eden/game/utils/genesisTextures";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { registerEdenTextures } from "@/modules/the-garden-of-eden/game/utils/edenTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 960;
const H = 240;
const PILLARS = [170, 350, 530, 710, 890];
const OILS: [number, number][] = [[260, 70], [440, 180], [620, 60], [800, 170]];
const SNAKES = [250, 330, 430, 520, 620, 700, 800, 860].map((x, i) => ({ x, speed: 46 + (i % 3) * 12, start: 24 + ((i * 53) % 190) }));
const LEASH = 110; // Adam and Eve only follow while the child is this close
const COLORS = [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x38bdf8, 0x6366f1, 0xa855f7];
interface Snake { s: Phaser.GameObjects.Sprite; x: number; y: number; dir: 1 | -1; speed: number }

/** Stage 12: torch-bearer escort. Keep the flame alive with Grace Oil, lead Adam and Eve past the black serpents, light 5 Pillars of the Promise. */
export class Stage12PromiseScene extends BaseGenesisScene {
  private torch = 1;
  private mode: "walk" | "lock" | "talk" | "done" = "walk";
  private lit = [false, false, false, false, false];
  private pillars: Phaser.GameObjects.Sprite[] = [];
  private oils: (Phaser.GameObjects.Image | undefined)[] = [];
  private snakes: Snake[] = [];
  private adamS?: Phaser.GameObjects.Sprite;
  private eveS?: Phaser.GameObjects.Sprite;
  private dark?: Phaser.GameObjects.RenderTexture;
  private tag?: Phaser.GameObjects.Text;
  private ring?: Phaser.GameObjects.Graphics;
  private ringT = 0;
  private cur = -1;
  private invuln = 0;
  private gustT = 0;

  constructor() {
    super("Stage12PromiseScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_12_loi_hua_cuu_do";
    this.spawn = [60, 120];
  }

  create() {
    this.torch = 1;
    this.mode = "walk";
    this.lit = [false, false, false, false, false];
    this.pillars = [];
    this.oils = [];
    this.snakes = [];
    this.invuln = 0;
    this.gustT = 6000;
    this.cur = -1;
    this.intro = { illustration: "exodus", speaker: STAGE_TEXT.s12.speaker, lines: STAGE_TEXT.s12.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerGenesisTextures(this);
    registerStageTextures(this);
    registerEdenTextures(this);
    this.add.tileSprite(0, 0, W, H, "gen_rockfloor").setOrigin(0).setDepth(DEPTH.FLOOR);
    for (let i = 0; i < 60; i++) this.add.image(Phaser.Math.Between(20, W - 20), Phaser.Math.Between(20, H - 20), "gen_thorn").setOrigin(0.5, 1).setDepth(DEPTH.RUG).setAlpha(0.8);
    this.add.rectangle(0, 0, W, H).setOrigin(0).setStrokeStyle(4, 0x5b2a0c).setDepth(DEPTH.RUG);
    this.block(W / 2, 4, W, 8); this.block(W / 2, H - 4, W, 8); this.block(4, H / 2, 8, H); this.block(W - 4, H / 2, 8, H);
    this.add.image(24, 120, "gen_cherub").setOrigin(0.5, 1).setDepth(130); // the cherub guards the gate behind
    this.block(24, 112, 20, 20);
    PILLARS.forEach((x, i) => {
      this.pillars.push(this.add.sprite(x, 132, "gen_pillar", 0).setOrigin(0.5, 1).setDepth(132));
      this.block(x, 126, 10, 8);
      this.interactables.push({ x, y: 124, r: 26, label: "[A] Thắp Cột Mốc", active: () => this.mode === "walk" && !this.lit[i], act: () => this.startLock(i) });
    });
    this.oils = OILS.map(([x, y]) => this.pickup(x, y, "gen_oil"));
    SNAKES.forEach((sn) => {
      const s = this.add.sprite(sn.x, sn.start, "gen_serpent", 0).setOrigin(0.5, 1).setTint(0x1c1033);
      if (!this.anims.exists("gen_serpent_a")) this.anims.create({ key: "gen_serpent_a", frames: this.anims.generateFrameNumbers("gen_serpent", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
      s.play("gen_serpent_a");
      this.snakes.push({ s, x: sn.x, y: sn.start, dir: 1, speed: sn.speed });
    });
    this.adamS = this.add.sprite(60, 140, "gen_adam", 0).setOrigin(0.5, 1);
    this.eveS = this.add.sprite(44, 150, "gen_eve", 0).setOrigin(0.5, 1);
    this.dark = this.add.renderTexture(0, 0, W, H).setOrigin(0).setDepth(DEPTH.FX - 2);
    this.tag = this.add.text(0, 0, "", { fontFamily: "Dearpix, monospace", fontSize: "10px", color: "#fde68a", resolution: 4 }).setOrigin(0.5, 1).setDepth(DEPTH.FX);
    this.ring = this.add.graphics().setDepth(DEPTH.FX);
  }

  protected onStageStart() {
    this.saveCheckpoint("start", null, 60, 120);
  }

  protected onCheckpointRestore(_id: string, _s: unknown) {
    void _id; void _s;
    this.torch = 1;
    this.mode = "walk";
    this.ring?.clear();
    const { x, y } = this.player;
    this.adamS?.setPosition(x - 22, y + 14);
    this.eveS?.setPosition(x - 40, y + 20);
    this.invuln = this.time.now + 1200;
  }

  // ---- pillar timing lock: press A when the shrinking ring fits the pillar
  private startLock(i: number) {
    this.mode = "lock";
    this.cur = i;
    this.ringT = 0;
  }

  private size() {
    return 8 + Math.round(40 * (1 - (this.ringT % 1500) / 1500));
  }

  protected handleActionTrigger() {
    if (this.mode !== "lock") return super.handleActionTrigger();
    if (Math.abs(this.size() - 16) <= 6) return this.lightPillar(this.cur);
    audio.sfx("wrong");
    this.torch = Math.max(0, this.torch - 0.08);
    this.cameras.main.shake(100, 0.004);
  }

  private lightPillar(i: number) {
    this.lit[i] = true;
    this.mode = "talk";
    this.ring?.clear();
    this.pillars[i].setFrame(1);
    audio.sfx("bless");
    this.sparkleBurst(PILLARS[i], 110, 12);
    this.torch = 1;
    this.snakes.forEach((sn) => { if (Math.abs(sn.x - PILLARS[i]) < 130) { this.tweens.add({ targets: sn.s, alpha: 0, duration: 500, ease: "Stepped", easeParams: [4] }); sn.speed = 0; sn.y = -100; } }); // light drives them back
    this.talk(`Cột Mốc ${i + 1}/5`, [tr(STAGE_TEXT.s12.pillars[i])], () => {
      if (this.lit.every(Boolean)) return this.finale();
      this.saveCheckpoint(`p${i}`, null, PILLARS[i] - 24, 150);
      this.mode = "walk";
    });
  }

  private finale() {
    this.mode = "done";
    this.cameras.main.flash(900, 255, 244, 180);
    this.tweens.add({ targets: this.dark, alpha: 0, duration: 2000, ease: "Stepped", easeParams: [6] });
    COLORS.forEach((c, i) => {
      const band = this.add.rectangle(W / 2, 20 + i * 5, 600, 5, c, 0).setDepth(DEPTH.FX + 1);
      this.tweens.add({ targets: band, alpha: 0.85, duration: 600, delay: 600 + i * 150, ease: "Stepped", easeParams: [4] });
    });
    this.time.delayedCall(3200, () => this.finishStage(STAGE_TEXT.s12));
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.dialogueOpen || !this.adamS || !this.eveS || !this.dark) return;
    const dt = Math.min(delta, 50) / 1000;
    const px = this.player.x, py = this.player.y + 9;

    // darkness with a stepped torch-light hole (shrinks as the flame weakens)
    const k = this.torch > 0.75 ? 3 : this.torch > 0.5 ? 2 : this.torch > 0.25 ? 1 : 0;
    const r = [28, 40, 52, 64][k];
    if (this.mode !== "done") {
      this.dark.clear().fill(0x05060d, 0.8).erase(`gen_lightmask_${k}`, Math.round(px - r), Math.round(py - 8 - r));
      this.lit.forEach((on, i) => on && this.dark?.erase("gen_lightmask_1", PILLARS[i] - 40, 100 - 40));
    }
    this.tag?.setText(this.mode === "done" ? "" : `Đuốc ${Math.round(this.torch * 100)}%`).setPosition(Math.round(px), Math.round(this.player.y - 14));

    if (this.mode === "lock") {
      this.ringT += delta;
      const s = this.size(), good = Math.abs(s - 16) <= 6, x = PILLARS[this.cur], y = 110;
      this.ring?.clear().lineStyle(2, good ? 0xfde68a : 0xf8fafc, 1).strokeRect(Math.round(x - s / 2), Math.round(y - s / 2), s, s);
      if (Math.abs(px - x) > 46) { this.mode = "walk"; this.ring?.clear(); }
    }
    if (this.mode !== "walk" && this.mode !== "lock") return;

    // the flame fades and night gusts blow it weaker
    this.torch -= 0.02 * dt;
    this.gustT -= delta;
    if (this.gustT <= 0) { this.gustT = Phaser.Math.Between(6000, 10000); this.torch -= 0.1; audio.sfx("whoosh"); }
    if (this.torch <= 0) { audio.sfx("wrong"); return this.resetToCheckpoint(); }

    // Grace Oil
    OILS.forEach(([x, y], i) => {
      const o = this.oils[i];
      if (o && Math.hypot(px - x, py - y) < 16) { this.removePickup(o); this.oils[i] = undefined; this.torch = Math.min(1, this.torch + 0.4); audio.sfx("pickup"); }
    });

    // Adam leads Eve; both only follow while the child is near
    const follow = (s: Phaser.GameObjects.Sprite, tx: number, ty: number, gap: number) => {
      const d = Math.hypot(tx - s.x, ty - s.y);
      if (d > gap) { s.x += ((tx - s.x) / d) * 105 * dt; s.y += ((ty - s.y) / d) * 105 * dt; }
      s.setPosition(Math.round(s.x), Math.round(s.y)).setDepth(s.y);
    };
    if (Math.hypot(px - this.adamS.x, py - this.adamS.y) < LEASH) {
      follow(this.adamS, px, py + 4, 22);
      follow(this.eveS, this.adamS.x, this.adamS.y, 20);
    }

    for (const sn of this.snakes) {
      if (sn.speed) {
        sn.y += sn.dir * sn.speed * dt;
        if (sn.y > 220 || sn.y < 30) sn.dir = (sn.dir * -1) as 1 | -1;
      }
      sn.s.setPosition(sn.x, Math.round(sn.y)).setDepth(sn.y);
      if (this.time.now < this.invuln || !sn.speed) continue;
      for (const c of [this.adamS, this.eveS]) {
        if (Math.hypot(c.x - sn.x, c.y - sn.y) < 13) { audio.sfx("wrong"); return this.resetToCheckpoint(); }
      }
      if (Math.hypot(px - sn.x, py - sn.y) < 13) { this.invuln = this.time.now + 1200; this.torch = Math.max(0, this.torch - 0.2); audio.sfx("wrong"); this.cameras.main.shake(100, 0.004); }
    }
  }
}
