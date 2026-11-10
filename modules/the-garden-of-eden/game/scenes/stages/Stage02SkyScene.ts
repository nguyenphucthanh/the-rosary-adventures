import * as Phaser from "phaser";
import { BaseGenesisScene, DEPTH } from "@/modules/the-garden-of-eden/game/scenes/BaseGenesisScene";
import { registerStageTextures } from "@/modules/the-garden-of-eden/game/utils/stageTextures";
import { STAGE_TEXT } from "@/modules/the-garden-of-eden/data/stageText";
import { tr } from "@/modules/the-garden-of-eden/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 320;
const H = 240;
const COLUMNS: [number, number][] = [[30, 40], [290, 40], [30, 214], [290, 214]]; // Cột Gió Vòm Trời (foot positions)
const CLOUDS_1: [number, number][] = [[110, 95], [210, 95], [110, 150], [210, 150]];
const CLOUDS_2: [number, number][] = [[90, 70], [230, 70], [90, 170], [230, 170]];
const VORTEX: [number, number, number, number][] = [[60, 60, 46, 36], [260, 180, -42, 32], [160, 200, 38, -44]]; // x, y, vx, vy

interface Cloud { s: Phaser.GameObjects.Image; fx: number; fy: number; vx: number; vy: number; big: boolean; gone: boolean }
interface Vortex { s: Phaser.GameObjects.Sprite; fx: number; fy: number; vx: number; vy: number }
interface Wave { horiz: boolean; lane: number; t: number; pos: number; warn: Phaser.GameObjects.Rectangle; front?: Phaser.GameObjects.Rectangle }

/** Stage 2: blow heavy water-clouds into the four Wind Columns while dodging whirlpools and waves. 2 phases, 3 Drops of Peace each. */
export class Stage02SkyScene extends BaseGenesisScene {
  private phase: 1 | 2 = 1;
  private clouds: Cloud[] = [];
  private vortices: Vortex[] = [];
  private waves: Wave[] = [];
  private waveTimer = 2.5;
  private invuln = 0;
  private absorbed = 0;
  private over = false;

  constructor() {
    super("Stage02SkyScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_02_vom_troi";
    this.spawn = [160, 120];
  }

  create() {
    this.clouds = [];
    this.vortices = [];
    this.waves = [];
    this.phase = 1;
    this.over = false;
    this.intro = { illustration: "sky", speaker: STAGE_TEXT.s2.speaker, lines: STAGE_TEXT.s2.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    registerStageTextures(this);
    this.add.tileSprite(0, 0, W, H, "gen_water").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(16, 16, W - 32, H - 32, "gen_sky_floor").setOrigin(0).setDepth(DEPTH.FLOOR + 0.1);
    this.add.rectangle(16, 16, W - 32, H - 32).setOrigin(0).setStrokeStyle(2, 0xf8fafc).setDepth(DEPTH.RUG);
    // the road of wind is the only dry place: the water rim is out of bounds
    this.block(W / 2, 8, W, 16); this.block(W / 2, H - 8, W, 16); this.block(8, H / 2, 16, H); this.block(W - 8, H / 2, 16, H);

    if (!this.anims.exists("gen_windcol")) this.anims.create({ key: "gen_windcol", frames: this.anims.generateFrameNumbers("gen_windcol", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    if (!this.anims.exists("gen_vortex")) this.anims.create({ key: "gen_vortex", frames: this.anims.generateFrameNumbers("gen_vortex", { start: 0, end: 1 }), frameRate: 5, repeat: -1 });
    COLUMNS.forEach(([x, y]) => {
      this.add.sprite(x, y, "gen_windcol").setOrigin(0.5, 1).setDepth(y).play("gen_windcol");
      this.add.image(x, y - 12, "gen_glow_gold").setAlpha(0.25).setDepth(y - 1);
      this.block(x, y - 4, 12, 8);
    });
    this.spawnDove(160, 34);
  }

  protected onStageStart() {
    this.startPhase(1);
  }

  protected onCheckpointRestore(id: string) {
    this.startPhase(id === "phase2" ? 2 : 1);
  }

  private startPhase(n: 1 | 2) {
    this.phase = n;
    this.absorbed = 0;
    this.clouds.forEach((c) => c.s.destroy());
    this.vortices.forEach((v) => v.s.destroy());
    this.waves.forEach((w) => { w.warn.destroy(); w.front?.destroy(); });
    this.clouds = [];
    this.vortices = [];
    this.waves = [];
    this.interactables = [];
    this.waveTimer = 2.5;
    this.invuln = 0;
    this.player.setAlpha(1);

    (n === 1 ? CLOUDS_1 : CLOUDS_2).forEach(([x, y]) => {
      const c: Cloud = { s: this.add.image(x, y, n === 1 ? "gen_cloud_s" : "gen_cloud_l").setDepth(y), fx: x, fy: y, vx: 0, vy: 0, big: n === 2, gone: false };
      this.clouds.push(c);
      this.interactables.push({ get x() { return c.fx; }, get y() { return c.fy; }, r: 34, label: "[A] Thổi gió", active: () => !c.gone, act: () => this.blow(c) });
    });
    VORTEX.slice(0, n === 1 ? 2 : 3).forEach(([x, y, vx, vy]) => {
      const k = n === 2 ? 1.25 : 1;
      this.vortices.push({ s: this.add.sprite(x, y, "gen_vortex").setDepth(DEPTH.FX - 1).play("gen_vortex"), fx: x, fy: y, vx: vx * k, vy: vy * k });
    });
    this.initGrace(3);
    this.saveCheckpoint(`phase${n}`, null, 160, 120);
  }

  /** A: puff of wind pushes a cloud away from the child. */
  private blow(c: Cloud) {
    const a = Math.atan2(c.fy - (this.player.y + 9), c.fx - this.player.x);
    const sp = c.big ? 105 : 150;
    c.vx = Math.cos(a) * sp;
    c.vy = Math.sin(a) * sp;
    audio.sfx("whoosh");
    this.sparkleBurst(Math.round(this.player.x), Math.round(this.player.y), 4);
  }

  /** Returns true when the hit emptied the Drops and the phase restarted. */
  private hurt(fromX: number, fromY: number): boolean {
    if (this.time.now < this.invuln) return false;
    this.invuln = this.time.now + 1300;
    const dx = this.player.x - fromX, dy = this.player.y + 9 - fromY, len = Math.hypot(dx, dy) || 1;
    this.player.setPosition(this.player.x + (dx / len) * 22, this.player.y + (dy / len) * 22);
    if (this.loseGrace()) return true;
    this.tweens.add({ targets: this.player, alpha: { from: 0.35, to: 1 }, duration: 1300, ease: "Stepped", easeParams: [8] });
    return false;
  }

  private spawnWave() {
    const horiz = Math.random() < 0.5;
    const lane = horiz ? Phaser.Math.Between(48, 192) : Phaser.Math.Between(48, 272);
    const warn = horiz ? this.add.rectangle(W / 2, lane, W - 32, 36, 0xffffff, 0.3) : this.add.rectangle(lane, H / 2, 36, H - 32, 0xffffff, 0.3);
    this.waves.push({ horiz, lane, t: 0, pos: 8, warn: warn.setDepth(DEPTH.FX - 2) });
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);
    if (this.introActive || this.over || this.dialogueOpen) return;
    const dt = Math.min(delta, 50) / 1000;
    const px = this.player.x, py = this.player.y + 9;

    for (const c of this.clouds) {
      if (c.gone) continue;
      if (this.phase === 2) c.fx -= 7 * dt; // the backwards-flowing current
      c.fx += c.vx * dt;
      c.fy += c.vy * dt;
      if (c.fx < 26 || c.fx > W - 26) { c.vx *= -1; c.fx = Phaser.Math.Clamp(c.fx, 26, W - 26); }
      if (c.fy < 26 || c.fy > H - 26) { c.vy *= -1; c.fy = Phaser.Math.Clamp(c.fy, 26, H - 26); }
      const f = Math.pow(0.5, dt / 0.9);
      c.vx *= f;
      c.vy *= f;
      c.s.setPosition(Math.round(c.fx), Math.round(c.fy)).setDepth(c.fy);
      const col = COLUMNS.find(([x, y]) => Math.hypot(c.fx - x, c.fy - (y - 12)) < 16);
      if (col) this.absorb(c, col);
    }

    for (const v of this.vortices) {
      v.fx += v.vx * dt;
      v.fy += v.vy * dt;
      if (v.fx < 30 || v.fx > W - 30) { v.vx *= -1; v.fx = Phaser.Math.Clamp(v.fx, 30, W - 30); }
      if (v.fy < 30 || v.fy > H - 30) { v.vy *= -1; v.fy = Phaser.Math.Clamp(v.fy, 30, H - 30); }
      v.s.setPosition(Math.round(v.fx), Math.round(v.fy));
      if (Math.hypot(px - v.fx, py - v.fy) < 13 && this.hurt(v.fx, v.fy)) return;
    }

    this.waveTimer -= dt;
    if (this.waveTimer <= 0) {
      this.spawnWave();
      this.waveTimer = this.phase === 1 ? 3.4 : 2.6;
    }
    for (const w of [...this.waves]) {
      w.t += dt;
      if (w.t < 1.5) { // foam warning, blinks
        w.warn.setAlpha(Math.floor(w.t * 6) % 2 ? 0.38 : 0.14);
        continue;
      }
      if (!w.front) {
        w.warn.setVisible(false);
        w.front = (w.horiz ? this.add.rectangle(0, w.lane, 24, 36, 0xe0f2fe, 0.9) : this.add.rectangle(w.lane, 0, 36, 24, 0xe0f2fe, 0.9)).setStrokeStyle(2, 0x38bdf8).setDepth(DEPTH.FX - 1);
      }
      w.pos += (this.phase === 1 ? 170 : 200) * dt;
      if (w.horiz) w.front.setPosition(Math.round(w.pos), w.lane);
      else w.front.setPosition(w.lane, Math.round(w.pos));
      const hit = w.horiz ? Math.abs(px - w.pos) < 19 && Math.abs(py - w.lane) < 24 : Math.abs(px - w.lane) < 24 && Math.abs(py - w.pos) < 19;
      if (hit && this.hurt(w.horiz ? w.pos : px, w.horiz ? py : w.pos)) return;
      if (w.pos > (w.horiz ? W : H) + 24) {
        w.warn.destroy();
        w.front.destroy();
        this.waves.splice(this.waves.indexOf(w), 1);
      }
    }
  }

  private absorb(c: Cloud, col: [number, number]) {
    c.gone = true;
    this.absorbed++;
    audio.sfx("chime");
    this.sparkleBurst(col[0], col[1] - 12, 8);
    this.tweens.add({ targets: c.s, y: c.s.y - 14, alpha: 0, duration: 600, ease: "Stepped", easeParams: [6], onComplete: () => c.s.destroy() });
    if (this.absorbed < 4) return;
    if (this.phase === 1) {
      this.waves.forEach((w) => { w.warn.destroy(); w.front?.destroy(); });
      this.waves = [];
      this.vortices.forEach((v) => (v.vx = v.vy = 0));
      this.time.delayedCall(600, () => this.talk("Chúa Thánh Thần", STAGE_TEXT.s2.phase2.map(tr), () => this.startPhase(2)));
    } else {
      this.over = true;
      this.waves.forEach((w) => { w.warn.destroy(); w.front?.destroy(); });
      this.vortices.forEach((v) => v.s.destroy());
      COLUMNS.forEach(([x, y]) => this.sparkleBurst(x, y - 12, 10));
      this.time.delayedCall(1000, () => this.finishStage(STAGE_TEXT.s2));
    }
  }
}
