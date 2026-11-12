import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE3, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const GATE_X = 312;
const START: [number, number][] = [[48, 132], [352, 132]];
const ELIAB_AT: [number, number] = [92, 104];
const SAUL_AT: [number, number] = [176, 104];
const PEBBLES_AT: [number, number][] = [
  [234, 92],
  [266, 108],
  [242, 128],
  [272, 148],
  [246, 168],
];
const ROUGH_AT: [number, number][] = [
  [268, 88],
  [236, 148],
  [270, 168],
];
const GOLIATH_AT: [number, number] = [566, 136];
const LANES = [94, 118, 142, 164];
const BAR_W = 96;

interface Shockwave {
  spr: Phaser.GameObjects.Image;
  x: number;
  y: number;
}

/** Stage 3 (1 Sm 17, 1-51): Deliver bread to brothers, decline Saul's heavy armour, pick 5 smooth pebbles in the brook, and defeat Giant Goliath with the sling. */
export class Stage03ValleyOfElahGoliathScene extends BaseDavidScene {
  private phase = 0; // 0 = Camp & Brook, 1 = Goliath Boss Battle
  private running = false;
  private finished = false;
  private eliabDone = false;
  private saulDone = false;
  private pebblesGot = [false, false, false, false, false];
  private pebbleSprites: (Phaser.GameObjects.Image | null)[] = [];
  private gate?: { set: (v: boolean) => void };
  private david!: Phaser.GameObjects.Image;
  private goliath!: Phaser.GameObjects.Image;
  private vulnGlow!: Phaser.GameObjects.Image;
  private bossHits = 0;
  private bossState: "attack" | "vulnerable" | "aiming" = "attack";
  private bossTimer = 1500;
  private wavesClearedInCycle = 0;
  private immune = 0;
  private shockwaves: Shockwave[] = [];
  private timing?: { x: number; dir: 1 | -1; zs: number; zw: number; speed: number };
  private label?: Phaser.GameObjects.Text;
  private barText?: Phaser.GameObjects.Text;
  private bar!: {
    bg: Phaser.GameObjects.Rectangle;
    track: Phaser.GameObjects.Rectangle;
    zone: Phaser.GameObjects.Rectangle;
    cur: Phaser.GameObjects.Rectangle;
  };

  constructor() {
    super("Stage03ValleyOfElahGoliathScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_03_thung_lung_ela_goliat";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = this.eliabDone = this.saulDone = false;
    this.pebblesGot = [false, false, false, false, false];
    this.pebbleSprites = [];
    this.bossHits = 0;
    this.bossState = "attack";
    this.bossTimer = 1500;
    this.wavesClearedInCycle = 0;
    this.immune = 0;
    this.shockwaves = [];
    this.timing = undefined;
    this.intro = { illustration: "3", speaker: STAGE3.speaker, lines: STAGE3.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Dramatic sky over the Valley of Elah
    [[0x1d4ed8, 0, 12], [0x38bdf8, 12, 10], [0xfde68a, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(0, 34, W, TOP - 38, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);

    // West: Israelite camp grass; Brook of Elah (x 222..286); East: sandy Valley of Elah arena
    this.add.tileSprite(0, TOP - 4, 224, H - TOP + 4, "david_grass").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(224, TOP - 4, W - 224, H - TOP + 4, "david_sand").setOrigin(0).setDepth(DEPTH.FLOOR);

    // The Brook of Elah (shallow sparkling water, walkable to pick smooth stones)
    this.add.rectangle(224, TOP - 4, 60, BOTTOM - TOP + 4, 0x0284c7).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(228, TOP - 4, 52, BOTTOM - TOP + 4, 0x38bdf8).setOrigin(0).setDepth(DEPTH.RUG);
    for (let y = 80; y < BOTTOM - 6; y += 16) {
      this.add.rectangle(236 + ((y / 16) % 2) * 18, y, 10, 2, 0xffffff, 0.65).setOrigin(0).setDepth(DEPTH.RUG + 1);
    }

    // Bottom cliff border
    this.add.tileSprite(0, BOTTOM + 4, W, H - BOTTOM - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, TOP - 8, W, 4, 0x000000, 0.25).setOrigin(0).setDepth(DEPTH.FLOOR);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.gate = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true);

    // Israelite camp tents, banners, rocks, shrubs
    this.add.image(64, 76, "david_tent").setOrigin(0.5, 1).setDepth(76);
    this.add.image(164, 76, "david_tent").setOrigin(0.5, 1).setDepth(76);
    this.add.image(118, 76, "david_banner").setOrigin(0.5, 1).setDepth(76);
    this.add.image(208, 76, "david_banner").setOrigin(0.5, 1).setDepth(76);
    for (const [x, y] of [[36, 174], [140, 174], [344, 80], [456, 80], [520, 176], [404, 176]]) {
      this.add.image(x, y, "david_rock").setOrigin(0.5, 1).setDepth(y);
    }
    for (const [x, y] of [[88, 174], [198, 174], [380, 82], [492, 82]]) {
      this.add.image(x, y, "david_shrub").setOrigin(0.5, 1).setDepth(y);
    }

    // Brother Eliab & King Saul in the camp
    this.prop(ELIAB_AT[0], ELIAB_AT[1], "david_eliab", 16, 8);
    this.prop(SAUL_AT[0], SAUL_AT[1], "david_saul", 16, 8);

    // 5 Smooth Pebbles + 3 Rough Decoy Stones in the Brook of Elah
    PEBBLES_AT.forEach(([x, y]) => {
      this.pebbleSprites.push(this.pickup(x, y, "david_pebble"));
    });
    ROUGH_AT.forEach(([x, y]) => {
      this.add.image(x, y, "david_rough_rock").setOrigin(0.5, 1).setDepth(y);
      this.interactables.push({
        x,
        y: y - 4,
        r: 20,
        label: tr(STAGE3.roughHint),
        active: () => this.phase === 0 && this.running,
        act: () => {
          audio.sfx("wrong");
          this.talk(STAGE3.speaker, [tr(STAGE3.roughMsg)]);
        },
      });
    });

    // Giant Goliath on the eastern side of the Valley of Elah
    this.vulnGlow = this.add.image(GOLIATH_AT[0], GOLIATH_AT[1] - 28, "david_glow_gold").setDepth(GOLIATH_AT[1] + 2).setVisible(false);
    this.tweens.add({ targets: this.vulnGlow, scale: 1.25, duration: 500, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
    this.goliath = this.add.image(GOLIATH_AT[0], GOLIATH_AT[1], "david_goliath").setOrigin(0.5, 1).setDepth(GOLIATH_AT[1]);
    this.block(GOLIATH_AT[0], GOLIATH_AT[1] - 12, 32, 20);

    this.david = this.add.image(START[0][0] - 16, START[0][1] + 12, "david_shepherd").setOrigin(0.5, 1);

    // Interactables for Phase 1 & Phase 2
    this.interactables.push(
      {
        x: ELIAB_AT[0],
        y: ELIAB_AT[1] - 8,
        r: 28,
        label: tr(STAGE3.eliabHint),
        active: () => this.phase === 0 && this.running && !this.eliabDone,
        act: () => {
          this.eliabDone = true;
          audio.sfx("pickup");
          this.sparkleBurst(ELIAB_AT[0], ELIAB_AT[1] - 10, 8);
          this.talk(tx("Anh cả Ê-li-áp", "Brother Eliab"), STAGE3.eliabTalk.map(tr), () => this.checkPhase1Done());
        },
      },
      {
        x: SAUL_AT[0],
        y: SAUL_AT[1] - 8,
        r: 28,
        label: tr(STAGE3.saulHint),
        active: () => this.phase === 0 && this.running && !this.saulDone,
        act: () => {
          this.saulDone = true;
          audio.sfx("chime");
          this.sparkleBurst(SAUL_AT[0], SAUL_AT[1] - 10, 8);
          this.talk(tx("Vua Sa-un", "King Saul"), STAGE3.saulTalk.map(tr), () => this.checkPhase1Done());
        },
      },
      ...PEBBLES_AT.map(([x, y], i) => ({
        x,
        y: y - 4,
        r: 22,
        label: tr(STAGE3.pebbleHint),
        active: () => this.phase === 0 && this.running && !this.pebblesGot[i],
        act: () => this.pickPebble(i),
      })),
      {
        get x() { return 460; },
        get y() { return 128; },
        r: 180,
        label: tr(STAGE3.slingHint),
        active: () => this.phase === 1 && this.running && this.bossState === "vulnerable" && !this.timing,
        act: () => this.openSlingBar(),
      }
    );

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
    this.talk(tx("Đa-vít", "David"), STAGE3.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  protected handleActionTrigger() {
    if (this.timing) {
      this.fireSling();
      return;
    }
    super.handleActionTrigger();
  }

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = false;
    this.timing = undefined;
    this.hideBar();
    this.clearShockwaves();
    this.immune = 0;
    this.player.setMovementLock(false);
    this.player.setAlpha(1);
    this.gate?.set(n === 0);

    if (n === 0) {
      this.initGrace(0);
      this.vulnGlow.setVisible(false);
    } else {
      this.initGrace(3);
      this.bossHits = 0;
      this.bossState = "attack";
      this.wavesClearedInCycle = 0;
      this.bossTimer = 1400;
      this.vulnGlow.setVisible(false);
      this.goliath.setAlpha(1).setPosition(GOLIATH_AT[0], GOLIATH_AT[1]);
    }

    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, sx, sy);
    this.player.setVelocity(0, 0);
    this.player.setPosition(sx, sy);
    this.david.setPosition(sx - 16, sy + 12);

    if (n === 1 && intro) {
      audio.sfx("bless");
      this.cameras.main.flash(300, 255, 244, 180);
      this.talk(STAGE3.speaker, STAGE3.pebblesReady.map(tr), () => {
        this.running = true;
      });
    } else {
      this.running = true;
    }
  }

  private pickPebble(i: number) {
    this.pebblesGot[i] = true;
    audio.sfx("pickup");
    const spr = this.pebbleSprites[i];
    if (spr) {
      this.sparkleBurst(spr.x, spr.y - 4, 6);
      this.removePickup(spr);
      this.pebbleSprites[i] = null;
    }
    this.checkPhase1Done();
  }

  private checkPhase1Done() {
    const count = this.pebblesGot.filter(Boolean).length;
    if (this.eliabDone && this.saulDone && count >= 5 && this.phase === 0) {
      this.startPhase(1, true);
    }
  }

  private spawnShockwaveVolley() {
    audio.sfx("staff");
    this.cameras.main.shake(100, 0.003);
    // Leave 1 lane open so the player can dodge cleanly
    const safeLane = Math.floor(Math.random() * LANES.length);
    LANES.forEach((y, idx) => {
      if (idx === safeLane) return;
      const spr = this.add.image(GOLIATH_AT[0] - 26, y, "david_shockwave").setOrigin(0.5, 1).setDepth(y);
      this.shockwaves.push({ spr, x: GOLIATH_AT[0] - 26, y });
    });
  }

  private openSlingBar() {
    this.bossState = "aiming";
    this.clearShockwaves();
    this.player.setVelocity(0, 0);
    this.player.setMovementLock(true);
    this.swingSlingOrStaff("david_sling");
    const zw = 26 - this.bossHits * 3;
    const zs = Math.floor((BAR_W - zw) / 2);
    this.timing = {
      x: 0,
      dir: 1,
      zs,
      zw,
      speed: 86 + this.bossHits * 16,
    };
    this.bar.zone.width = zw;
    Object.values(this.bar).forEach((o) => o.setVisible(true));
    this.barText?.setVisible(true);
  }

  private fireSling() {
    const t = this.timing;
    if (!t) return;
    this.timing = undefined;
    this.hideBar();
    this.player.setMovementLock(false);

    if (t.x >= t.zs - 3 && t.x <= t.zs + t.zw + 3) {
      // Launch flying smooth pebble to Goliath's forehead!
      audio.sfx("whoosh");
      const stone = this.add.image(this.david.x + 8, this.david.y - 12, "david_pebble").setDepth(DEPTH.FX);
      const hitIdx = this.bossHits;
      this.bossHits++;
      this.vulnGlow.setVisible(false);
      this.running = false;

      this.tweens.add({
        targets: stone,
        x: GOLIATH_AT[0] - 6,
        y: GOLIATH_AT[1] - 26,
        duration: 280,
        ease: "Stepped",
        easeParams: [5],
        onComplete: () => {
          stone.destroy();
          audio.sfx("chime");
          this.cameras.main.shake(180, 0.006);
          this.sparkleBurst(GOLIATH_AT[0] - 6, GOLIATH_AT[1] - 26, 12);
          if (this.bossHits >= 3) {
            this.defeatGoliath();
          } else {
            this.talk(tx("Đa-vít", "David"), [tr(STAGE3.goliathHit[hitIdx])], () => {
              this.bossState = "attack";
              this.wavesClearedInCycle = 0;
              this.bossTimer = 1100;
              this.running = true;
            });
          }
        },
      });
    } else {
      audio.sfx("wrong");
      this.vulnGlow.setVisible(false);
      this.bossState = "attack";
      this.wavesClearedInCycle = 0;
      this.bossTimer = 1200;
    }
  }

  private defeatGoliath() {
    this.finished = true;
    audio.sfx("shofar");
    this.cameras.main.flash(500, 255, 244, 180);
    // Goliath topples down in stepped motion
    this.tweens.add({
      targets: this.goliath,
      y: GOLIATH_AT[1] + 10,
      alpha: 0.35,
      duration: 600,
      ease: "Stepped",
      easeParams: [4],
      onComplete: () => {
        this.talk(STAGE3.speaker, [tr(STAGE3.goliathHit[2])], () => {
          this.completeStage();
          audio.sfx("complete");
          this.talk(tx("Ấn Thánh Vịnh thứ 3", "Psalm Seal 3"), STAGE3.outro.map(tr), () =>
            this.talk(tx("Suy niệm", "Reflection"), [tr(STAGE3.lesson)], () =>
              this.talk(tx("Khúc Ca Chiến Thắng", "Song of Victory"), STAGE3.cutscene.map(tr), () => this.goToNextStage())
            )
          );
        });
      },
    });
  }

  private hideBar() {
    Object.values(this.bar).forEach((o) => o.setVisible(false));
    this.barText?.setVisible(false);
  }

  private clearShockwaves() {
    this.shockwaves.forEach((w) => w.spr.destroy());
    this.shockwaves = [];
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
      const pebblesCount = this.pebblesGot.filter(Boolean).length;
      const txt =
        this.phase === 0
          ? tr(STAGE3.phase[0]).replace("{s}", String(pebblesCount))
          : tr(STAGE3.phase[1]).replace("{h}", String(this.bossHits));
      this.label.setText(txt).setPosition(Math.round(v.centerX), topY);
    }

    // Update sling timing bar if aiming
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
      this.barText?.setText(tr(STAGE3.slingBarHint)).setPosition(Math.round(v.centerX), by + 13);
      return;
    }

    // Phase 2 Boss Loop
    if (this.phase === 1 && this.running && !this.finished && !this.dialogueOpen) {
      if (this.bossState === "attack") {
        this.bossTimer -= delta;
        if (this.bossTimer <= 0) {
          if (this.wavesClearedInCycle < 2) {
            this.spawnShockwaveVolley();
            this.wavesClearedInCycle++;
            this.bossTimer = 1500 - this.bossHits * 150;
          } else {
            // Goliath lowers his shield to recover!
            this.bossState = "vulnerable";
            this.bossTimer = 4200;
            this.vulnGlow.setVisible(true);
            audio.sfx("chime");
          }
        }
      } else if (this.bossState === "vulnerable") {
        this.bossTimer -= delta;
        if (this.bossTimer <= 0) {
          this.vulnGlow.setVisible(false);
          this.bossState = "attack";
          this.wavesClearedInCycle = 0;
          this.bossTimer = 1100;
        }
      }

      // Move active shockwaves across the arena
      const spd = 88 + this.bossHits * 12;
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const w = this.shockwaves[i];
        w.x -= (spd * delta) / 1000;
        w.spr.setPosition(Math.round(w.x), w.y).setDepth(w.y);
        if (w.x < GATE_X + 14) {
          w.spr.destroy();
          this.shockwaves.splice(i, 1);
          continue;
        }
        if (this.immune <= 0 && Phaser.Math.Distance.Between(this.player.x, this.player.y, w.x, w.y) < 15) {
          w.spr.destroy();
          this.shockwaves.splice(i, 1);
          this.immune = 1200;
          if (this.loseGrace()) {
            this.talk(STAGE3.speaker, STAGE3.bossRetry.map(tr));
            return;
          }
        }
      }
    }
  }
}
