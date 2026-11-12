import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE2, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";

const W = 560;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const START: [number, number] = [56, 128];
const THRONE: [number, number] = [508, 136];
const PADS: [number, number][] = [
  [168, 106],
  [284, 152],
  [396, 114],
];
const TORCH_X = [96, 176, 256, 336, 416, 476];
const LANES = [96, 118, 140, 162];
const SMOKE_SPEED = [46, 56, 66];
const SMOKE_EVERY = [1900, 1600, 1350];
const BAR_W = 96;

interface Smoke {
  spr: Phaser.GameObjects.Sprite;
  x: number;
  y: number;
}

/** Stage 2 (1 Sm 16, 14-23): Dodge sorrow clouds and play 3 Harp Melodies on the Resonance Pads to dispel King Saul's gloom. */
export class Stage02RoyalHarpSoothingScene extends BaseDavidScene {
  private phase = 0; // 0..2 = Melody 1..3
  private running = false;
  private finished = false;
  private immune = 0;
  private spawnIn = 0;
  private lastLane = -1;
  private smokes: Smoke[] = [];
  private pads: Phaser.GameObjects.Sprite[] = [];
  private padGlows: Phaser.GameObjects.Image[] = [];
  private torches: Phaser.GameObjects.Sprite[] = [];
  private torchGlows: Phaser.GameObjects.Image[] = [];
  private throneClouds: Phaser.GameObjects.Sprite[][] = [];
  private roomShade!: Phaser.GameObjects.Rectangle;
  private david!: Phaser.GameObjects.Image;
  private timing?: { x: number; dir: 1 | -1; zs: number; zw: number; speed: number; hits: number; need: number };
  private label?: Phaser.GameObjects.Text;
  private barText?: Phaser.GameObjects.Text;
  private bar!: {
    bg: Phaser.GameObjects.Rectangle;
    track: Phaser.GameObjects.Rectangle;
    zone: Phaser.GameObjects.Rectangle;
    cur: Phaser.GameObjects.Rectangle;
  };

  constructor() {
    super("Stage02RoyalHarpSoothingScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_02_tieng_dan_cung_dien_saun";
    this.spawn = START;
  }

  create() {
    this.phase = 0;
    this.running = this.finished = false;
    this.immune = this.spawnIn = 0;
    this.lastLane = -1;
    this.smokes = [];
    this.pads = [];
    this.padGlows = [];
    this.torches = [];
    this.torchGlows = [];
    this.throneClouds = [];
    this.timing = undefined;
    this.intro = { illustration: "2", speaker: STAGE2.speaker, lines: STAGE2.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    if (!this.anims.exists("david_torch_lit")) {
      this.anims.create({
        key: "david_torch_lit",
        frames: this.anims.generateFrameNumbers("david_torch", { start: 1, end: 2 }),
        frameRate: 5,
        repeat: -1,
      });
    }
    if (!this.anims.exists("david_cloud_anim")) {
      this.anims.create({
        key: "david_cloud_anim",
        frames: this.anims.generateFrameNumbers("david_shadow_cloud", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1,
      });
    }

    // Palace background: night sky seen through high colonnade + carved stone wall + paved stone floor
    [[0x0f172a, 0, 14], [0x1e1b4b, 14, 14]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(0, 28, W, TOP - 32, "david_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    for (let x = 24; x < W - 20; x += 64) {
      this.add.rectangle(x, 22, 10, TOP - 26, 0x8b8f98).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
      this.add.rectangle(x + 7, 22, 3, TOP - 26, 0x6b6f78).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
      this.add.rectangle(x - 2, 20, 14, 3, 0xfbbf24).setOrigin(0).setDepth(DEPTH.FLOOR + 1);
    }

    this.add.tileSprite(0, TOP - 4, W, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    // Royal purple & gold carpet leading to Saul's throne
    this.add.rectangle(20, 112, 472, 28, 0x5b21b6).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(20, 112, 472, 2, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(20, 138, 472, 2, 0xfbbf24).setOrigin(0).setDepth(DEPTH.RUG);

    // Lower wall border
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_wall").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.55).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x4c1d95).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);

    // Room gloom overlay (fades down as each melody is completed)
    this.roomShade = this.add.rectangle(0, 0, W, H, 0x1e1b4b, 0.36).setOrigin(0).setDepth(DEPTH.LIGHT);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);

    // 6 wall torches along the top wall (2 light up per melody)
    TORCH_X.forEach((x) => {
      const g = this.add.image(x, 60, "david_glow_fire").setDepth(68).setAlpha(0);
      const t = this.add.sprite(x, 68, "david_torch", 0).setOrigin(0.5, 1).setDepth(69);
      this.torchGlows.push(g);
      this.torches.push(t);
    });

    // Guards standing by the entrance and throne
    this.add.image(40, 84, "david_guard").setOrigin(0.5, 1).setDepth(84);
    this.add.image(40, 174, "david_guard").setOrigin(0.5, 1).setDepth(174);

    // King Saul on his throne + 3 layers of swirling dark sorrow clouds around him
    this.add.image(THRONE[0], THRONE[1], "david_throne").setOrigin(0.5, 1).setDepth(THRONE[1]);
    this.add.image(THRONE[0], THRONE[1] - 8, "david_saul").setOrigin(0.5, 1).setDepth(THRONE[1] + 1);
    this.block(THRONE[0], THRONE[1] - 8, 34, 14);

    const cloudOffsets: [number, number][][] = [
      [[-32, -16], [-32, 8]],
      [[-18, -28], [-18, 18]],
      [[14, -22], [14, 12]],
    ];
    cloudOffsets.forEach((pair) => {
      const grp = pair.map(([dx, dy]) =>
        this.add
          .sprite(THRONE[0] + dx, THRONE[1] + dy, "david_shadow_cloud")
          .setOrigin(0.5, 1)
          .setDepth(THRONE[1] + 4)
          .play("david_cloud_anim")
      );
      this.throneClouds.push(grp);
    });

    // 3 Resonance Pads on the floor
    PADS.forEach(([x, y], i) => {
      const g = this.add.image(x, y - 6, "david_glow_gold").setDepth(DEPTH.RUG + 1).setAlpha(0);
      this.tweens.add({ targets: g, scale: 1.1, duration: 700, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
      const p = this.add.sprite(x, y, "david_pad", 0).setOrigin(0.5, 1).setDepth(DEPTH.RUG + 2);
      this.pads.push(p);
      this.padGlows.push(g);

      this.interactables.push({
        x,
        y: y - 6,
        r: 26,
        label: tr(STAGE2.padHint),
        active: () => this.phase === i && this.running && !this.timing,
        act: () => this.startMelody(),
      });
    });

    this.david = this.add.image(START[0] - 16, START[1] + 12, "david_harpist").setOrigin(0.5, 1);

    this.label = this.add
      .text(0, 0, "", {
        fontFamily: "Dearpix, monospace",
        fontSize: "10px",
        color: "#fde68a",
        backgroundColor: "#0f172acc",
        padding: { x: 3, y: 1 },
        resolution: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(DEPTH.UI);

    this.barText = this.add
      .text(0, 0, "", {
        fontFamily: "Dearpix, monospace",
        fontSize: "10px",
        color: "#ffffff",
        backgroundColor: "#0f172acc",
        padding: { x: 3, y: 1 },
        resolution: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(DEPTH.UI)
      .setVisible(false);

    this.bar = {
      bg: this.add.rectangle(0, 0, BAR_W + 4, 12, 0xfde68a).setOrigin(0).setDepth(DEPTH.UI),
      track: this.add.rectangle(0, 0, BAR_W, 8, 0x1e293b).setOrigin(0).setDepth(DEPTH.UI + 1),
      zone: this.add.rectangle(0, 0, 24, 8, 0x4ade80).setOrigin(0).setDepth(DEPTH.UI + 2),
      cur: this.add.rectangle(0, 0, 3, 12, 0xffffff).setOrigin(0).setDepth(DEPTH.UI + 3),
    };
    Object.values(this.bar).forEach((o) => o.setVisible(false));
  }

  protected onStageStart() {
    this.talk(STAGE2.speaker, STAGE2.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  protected handleActionTrigger() {
    if (this.timing) {
      this.hitNote();
      return;
    }
    super.handleActionTrigger();
  }

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = true;
    this.timing = undefined;
    this.hideBar();
    this.immune = 0;
    this.spawnIn = 1400;
    this.clearSmokes();
    this.initGrace(3);
    this.player.setMovementLock(false);
    this.player.setAlpha(1);

    // Update pads, torches, throne clouds, and room shade
    this.pads.forEach((p, i) => p.setFrame(i <= n ? 1 : 0));
    this.padGlows.forEach((g, i) => g.setAlpha(i === n ? 0.85 : 0));
    this.torches.forEach((t, i) => {
      if (i < n * 2) t.play("david_torch_lit");
      else {
        t.anims.stop();
        t.setFrame(0);
      }
    });
    this.torchGlows.forEach((g, i) => g.setAlpha(i < n * 2 ? 0.65 : 0));
    this.throneClouds.forEach((grp, i) => grp.forEach((c) => c.setVisible(i >= n)));
    this.roomShade.setAlpha(Math.max(0.05, 0.36 - n * 0.12));

    const [sx, sy] = n === 0 ? START : PADS[n - 1];
    this.saveCheckpoint(`melody${n}`, n, sx, sy);
    if (!intro || n === 0) {
      this.player.setVelocity(0, 0);
      this.player.setPosition(sx, sy);
      this.david.setPosition(sx - 16, sy + 12);
    }
  }

  private startMelody() {
    this.clearSmokes();
    this.player.setVelocity(0, 0);
    this.player.setMovementLock(true);
    const zw = 26 - this.phase * 2;
    const zs = Math.floor((BAR_W - zw) / 2);
    this.timing = {
      x: 0,
      dir: 1,
      zs,
      zw,
      speed: 75 + this.phase * 14,
      hits: 0,
      need: 3,
    };
    this.bar.zone.width = zw;
    Object.values(this.bar).forEach((o) => o.setVisible(true));
    this.barText?.setVisible(true);
    this.playHarp();
  }

  private hitNote() {
    const t = this.timing;
    if (!t) return;
    if (t.x >= t.zs - 3 && t.x <= t.zs + t.zw + 3) {
      t.hits++;
      this.playHarp();
      this.sparkleBurst(THRONE[0] - 20, THRONE[1] - 12, 8);
      if (t.hits >= t.need) {
        this.completeMelody();
      }
    } else {
      audio.sfx("wrong");
      this.cameras.main.shake(90, 0.003);
    }
  }

  private completeMelody() {
    this.timing = undefined;
    this.hideBar();
    this.player.setMovementLock(false);
    audio.sfx("bless");
    this.cameras.main.flash(300, 255, 244, 180);

    const clearedIdx = this.phase;
    this.throneClouds[clearedIdx]?.forEach((c) => c.setVisible(false));
    for (let i = clearedIdx * 2; i < (clearedIdx + 1) * 2; i++) {
      this.torches[i]?.play("david_torch_lit");
      this.torchGlows[i]?.setAlpha(0.65);
      this.sparkleBurst(TORCH_X[i], 58, 8);
    }

    this.running = false;
    this.talk(STAGE2.speaker, [tr(STAGE2.songCleared[clearedIdx])], () => {
      if (clearedIdx + 1 < 3) {
        this.startPhase(clearedIdx + 1, true);
      } else {
        this.roomShade.setAlpha(0);
        this.finished = true;
        this.finishStage(STAGE2);
      }
    });
  }

  private hideBar() {
    Object.values(this.bar).forEach((o) => o.setVisible(false));
    this.barText?.setVisible(false);
  }

  private clearSmokes() {
    this.smokes.forEach((s) => s.spr.destroy());
    this.smokes = [];
  }

  private spawnSmoke() {
    const options = LANES.map((_, i) => i).filter((i) => i !== this.lastLane);
    const laneIdx = options[Math.floor(Math.random() * options.length)];
    this.lastLane = laneIdx;
    const y = LANES[laneIdx];
    const x = THRONE[0] - 30;
    const spr = this.add.sprite(x, y, "david_shadow_cloud").setOrigin(0.5, 1).setDepth(y).play("david_cloud_anim");
    this.smokes.push({ spr, x, y });
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);

    // David follows player
    const txDavid = this.player.x - 16;
    const tyDavid = this.player.y + 12;
    const dd = Phaser.Math.Distance.Between(this.david.x, this.david.y, txDavid, tyDavid);
    if (dd > 3) {
      const step = Math.min(dd, (110 * delta) / 1000);
      const a = Math.atan2(tyDavid - this.david.y, txDavid - this.david.x);
      this.david.setPosition(Math.round(this.david.x + Math.cos(a) * step), Math.round(this.david.y + Math.sin(a) * step));
    }
    this.david.setDepth(this.david.y);

    if (this.immune > 0) {
      this.immune = Math.max(0, this.immune - delta);
      this.player.setAlpha(Math.floor(this.immune / 100) % 2 === 0 ? 0.5 : 1);
    }

    const v = this.cameras.main.worldView;
    const topY = Math.round(v.top + this.safeInsetTop() + 4);

    if (this.label) {
      this.label
        .setText(tr(STAGE2.songLabel).replace("{n}", String(this.phase + 1)))
        .setPosition(Math.round(v.centerX), topY);
    }

    // Update active rhythm timing bar
    if (this.timing && !this.dialogueOpen) {
      const t = this.timing;
      t.x += (t.dir * t.speed * delta) / 1000;
      if (t.x >= BAR_W - 3) {
        t.x = BAR_W - 3;
        t.dir = -1;
      } else if (t.x <= 0) {
        t.x = 0;
        t.dir = 1;
      }
      const bx = Math.round(v.centerX - BAR_W / 2);
      const by = topY + 18;
      this.bar.bg.setPosition(bx - 2, by - 2);
      this.bar.track.setPosition(bx, by);
      this.bar.zone.setPosition(bx + t.zs, by);
      this.bar.cur.setPosition(Math.round(bx + t.x), by - 2);
      this.barText
        ?.setText(tr(STAGE2.barHint).replace("{h}", String(t.hits)).replace("{need}", String(t.need)))
        .setPosition(Math.round(v.centerX), by + 13);
      return;
    }

    // Spawn and move sorrow smoke clouds while navigating to the pad
    if (this.running && !this.finished && !this.dialogueOpen) {
      this.spawnIn -= delta;
      if (this.spawnIn <= 0) {
        this.spawnIn = SMOKE_EVERY[this.phase];
        this.spawnSmoke();
      }
      const spd = SMOKE_SPEED[this.phase];
      for (let i = this.smokes.length - 1; i >= 0; i--) {
        const s = this.smokes[i];
        s.x -= (spd * delta) / 1000;
        s.spr.setPosition(Math.round(s.x), s.y).setDepth(s.y);
        if (s.x < 20) {
          s.spr.destroy();
          this.smokes.splice(i, 1);
          continue;
        }
        if (this.immune <= 0 && Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y - 4) < 15) {
          s.spr.destroy();
          this.smokes.splice(i, 1);
          this.immune = 1200;
          if (this.loseGrace()) {
            this.talk(STAGE2.speaker, STAGE2.hitSmoke.map(tr));
            return;
          }
        }
      }
    }
  }
}
