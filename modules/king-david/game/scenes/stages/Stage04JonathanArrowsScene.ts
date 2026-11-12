import * as Phaser from "phaser";
import { BaseDavidScene, DEPTH } from "@/modules/king-david/game/scenes/BaseDavidScene";
import { STAGE4, tr } from "@/modules/king-david/data/dialogues";
import audio from "@/modules/shared/game/audio/AudioManager";
import { t as tx } from "@/modules/shared/i18n";

const W = 640;
const H = 240;
const TOP = 72;
const BOTTOM = 180;
const GATE_X = 268;
const START: [number, number][] = [[44, 128], [300, 128]];
const JONATHAN_PALACE: [number, number] = [84, 106];
const JONATHAN_EZEL: [number, number] = [584, 128];
const EZEL_ROCK: [number, number] = [556, 132];
const HEDGE_XS = [364, 438, 512];
const LANE_YS = [94, 128, 162];
const SAFE_LANES = [0, 2, 1]; // Top, Bottom, Middle

interface GuardPatrol {
  spr: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Rectangle;
  x: number;
  y: number;
  y1: number;
  y2: number;
  dir: 1 | -1;
  speed: number;
}

/** Stage 4 (1 Sm 18, 1-4; 20, 1-42): Receive Jonathan's robe & bow, slip past palace guards, and follow the 3 signal arrows across the field of Ezel. */
export class Stage04JonathanArrowsScene extends BaseDavidScene {
  private phase = 0; // 0 = Palace stealth, 1 = Signal arrows at Ezel
  private running = false;
  private finished = false;
  private hasCovenantGift = false;
  private arrowsCleared = 0;
  private gate?: { set: (v: boolean) => void };
  private david!: Phaser.GameObjects.Image;
  private jonathanPalace!: Phaser.GameObjects.Image;
  private jonathanEzel!: Phaser.GameObjects.Image;
  private guards: GuardPatrol[] = [];
  private arrowSprites: Phaser.GameObjects.Image[] = [];
  private arrowGlows: Phaser.GameObjects.Image[] = [];
  private label?: Phaser.GameObjects.Text;

  constructor() {
    super("Stage04JonathanArrowsScene");
    this.worldWidth = W;
    this.worldHeight = H;
    this.stageKey = "stage_04_giao_uoc_gionathan_mui_ten";
    this.spawn = START[0];
  }

  create() {
    this.phase = 0;
    this.running = this.finished = this.hasCovenantGift = false;
    this.arrowsCleared = 0;
    this.guards = [];
    this.arrowSprites = [];
    this.arrowGlows = [];
    this.intro = { illustration: "4", speaker: STAGE4.speaker, lines: STAGE4.intro.map(tr) };
    super.create();
  }

  protected buildWorld() {
    // Dawn sky on the right, stone palace wall on the left
    [[0x1e1b4b, 0, 12], [0x3b82f6, 12, 10], [0xfde68a, 22, 12]].forEach(([c, y, h]) =>
      this.add.rectangle(0, y, W, h, c).setOrigin(0).setDepth(DEPTH.FLOOR)
    );
    this.add.tileSprite(0, 0, GATE_X, TOP - 4, "david_wall").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X, 34, W - GATE_X, TOP - 38, "david_cliff").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Floors: Palace stone (left) & Ezel dawn meadow grass (right)
    this.add.tileSprite(0, TOP - 4, GATE_X, H - TOP + 4, "david_stone").setOrigin(0).setDepth(DEPTH.FLOOR);
    this.add.tileSprite(GATE_X, TOP - 4, W - GATE_X, H - TOP + 4, "david_grass").setOrigin(0).setDepth(DEPTH.FLOOR);

    // Royal corridor runner rug & meadow dirt path
    this.add.rectangle(24, 114, GATE_X - 32, 28, 0x991b1b).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(24, 116, GATE_X - 32, 24, 0xdc2626).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(GATE_X + 8, 116, W - GATE_X - 24, 24, "david_sand").setOrigin(0).setDepth(DEPTH.RUG);

    // Bottom wall / cliff border
    this.add.tileSprite(0, BOTTOM + 4, GATE_X, H - BOTTOM - 4, "david_wall").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.tileSprite(GATE_X, BOTTOM + 4, W - GATE_X, H - BOTTOM - 4, "david_cliff").setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM + 4, W, H - BOTTOM - 4, 0x0f172a, 0.5).setOrigin(0).setDepth(DEPTH.RUG);
    this.add.rectangle(0, BOTTOM, W, 4, 0x78350f).setOrigin(0).setDepth(DEPTH.RUG);

    // Palace torches & banners
    for (const x of [52, 132, 212]) {
      this.add.image(x, 46, "david_glow_fire").setDepth(DEPTH.RUG).setAlpha(0.75);
      this.add.image(x, 52, "david_torch").setOrigin(0.5, 1).setDepth(52);
    }
    this.add.image(92, 68, "david_banner").setOrigin(0.5, 1).setDepth(68);
    this.add.image(176, 68, "david_banner").setOrigin(0.5, 1).setDepth(68);

    // Colliders
    this.block(W / 2, TOP / 2, W, TOP);
    this.block(W / 2, (BOTTOM + H) / 2, W, H - BOTTOM);
    this.block(8, H / 2, 16, H);
    this.block(W - 8, H / 2, 16, H);
    this.gate = this.door(GATE_X, (TOP + BOTTOM) / 2, 12, BOTTOM - TOP, "david_fence", true);

    // 2 Patrolling Palace Guards in Phase 1
    const guardConfigs: [number, number, number, 1 | -1, number][] = [
      [148, 86, 168, 1, 46],
      [216, 168, 86, -1, 52],
    ];
    for (const [gx, y1, y2, dir, speed] of guardConfigs) {
      const startY = dir === 1 ? y1 : y2;
      const zone = this.add.rectangle(gx, startY, 30, 34, 0xef4444, 0.28).setDepth(DEPTH.RUG + 1);
      const spr = this.add.image(gx, startY, "david_guard").setOrigin(0.5, 1).setDepth(startY);
      this.guards.push({ spr, zone, x: gx, y: startY, y1: Math.min(y1, y2), y2: Math.max(y1, y2), dir, speed });
    }

    // 3 Hedgerows on the Field of Ezel (each with 3 lanes: Top y=94, Middle y=128, Bottom y=162)
    HEDGE_XS.forEach((hx, idx) => {
      // Shrubs dividing the lanes
      for (const sy of [78, 111, 145, 176]) {
        this.add.image(hx, sy, "david_shrub").setOrigin(0.5, 1).setDepth(sy);
      }
      const safeLane = SAFE_LANES[idx];
      LANE_YS.forEach((ly, laneIdx) => {
        if (laneIdx === safeLane) {
          const glow = this.add.image(hx, ly - 4, "david_glow_gold").setDepth(DEPTH.RUG + 1).setAlpha(0.85);
          const arr = this.add.image(hx, ly, "david_arrow").setOrigin(0.5, 1).setDepth(ly);
          const sp = this.add.image(hx, ly - 12, "sparkle").setDepth(ly + 1);
          this.tweens.add({ targets: sp, alpha: { from: 0.3, to: 1 }, duration: 500, yoyo: true, repeat: -1, ease: "Stepped", easeParams: [2] });
          this.arrowGlows.push(glow);
          this.arrowSprites.push(arr);
        } else {
          // Ambush marker in wrong lanes
          this.add.rectangle(hx, ly - 4, 20, 18, 0xef4444, 0.22).setDepth(DEPTH.RUG + 1);
          this.add.image(hx, ly, "david_rough_rock").setOrigin(0.5, 1).setDepth(ly).setAlpha(0.75);
        }
      });
    });

    // Stone Ezel & Jonathan at the eastern end of the field
    this.prop(EZEL_ROCK[0], EZEL_ROCK[1], "david_rock", 16, 10);
    this.add.image(EZEL_ROCK[0], EZEL_ROCK[1] - 16, "david_glow_gold").setDepth(EZEL_ROCK[1] - 1).setAlpha(0.7);
    this.jonathanPalace = this.prop(JONATHAN_PALACE[0], JONATHAN_PALACE[1], "david_jonathan", 16, 8);
    this.litGlow(JONATHAN_PALACE[0], JONATHAN_PALACE[1], 16, "david_glow_gold");
    this.jonathanEzel = this.prop(JONATHAN_EZEL[0], JONATHAN_EZEL[1], "david_jonathan", 16, 8);
    this.litGlow(JONATHAN_EZEL[0], JONATHAN_EZEL[1], 16, "david_glow_gold");

    this.david = this.add.image(START[0][0] - 14, START[0][1] + 10, "david_harpist").setOrigin(0.5, 1);

    this.interactables.push(
      {
        x: JONATHAN_PALACE[0],
        y: JONATHAN_PALACE[1] - 8,
        r: 28,
        label: tr(STAGE4.covenantHint),
        active: () => this.phase === 0 && this.running && !this.hasCovenantGift,
        act: () => {
          this.hasCovenantGift = true;
          audio.sfx("bless");
          this.sparkleBurst(JONATHAN_PALACE[0], JONATHAN_PALACE[1] - 12, 10);
          this.david.setTexture("david_warrior");
          this.talk(STAGE4.speaker, STAGE4.covenantTalk.map(tr));
        },
      },
      {
        x: JONATHAN_EZEL[0],
        y: JONATHAN_EZEL[1] - 8,
        r: 32,
        label: tr(STAGE4.ezelHint),
        active: () => this.phase === 1 && this.running && !this.finished && this.arrowsCleared >= 3,
        act: () => this.finishEzelStage(),
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
  }

  protected onStageStart() {
    this.talk(tx("Đa-vít", "David"), STAGE4.start.map(tr), () => this.startPhase(0));
  }

  protected onCheckpointRestore(_id: string, state: unknown) {
    this.startPhase(state as number, false);
  }

  private startPhase(n: number, intro = true) {
    this.phase = n;
    this.running = false;
    this.gate?.set(n === 0);
    if (n === 1) {
      this.hasCovenantGift = true;
      this.david.setTexture("david_warrior");
      this.arrowsCleared = 0;
    }

    const [sx, sy] = START[n];
    this.saveCheckpoint(`phase${n}`, n, sx, sy);
    this.player.setVelocity(0, 0);
    this.player.setPosition(sx, sy);
    this.david.setPosition(sx - 14, sy + 10);

    if (n === 1 && intro) {
      audio.sfx("chime");
      this.cameras.main.flash(260, 255, 244, 180);
      this.talk(STAGE4.speaker, STAGE4.fieldIntro.map(tr), () => {
        this.running = true;
      });
    } else {
      this.running = true;
    }
  }

  private finishEzelStage() {
    this.finished = true;
    this.running = false;
    audio.sfx("bless");
    this.sparkleBurst(JONATHAN_EZEL[0], JONATHAN_EZEL[1] - 12, 12);
    this.talk(STAGE4.speaker, STAGE4.farewell.map(tr), () => this.finishStage(STAGE4));
  }

  update(time?: number, delta = 16) {
    super.update(time, delta);

    // David follows player
    const txD = this.player.x - 14;
    const tyD = this.player.y + 10;
    const dd = Phaser.Math.Distance.Between(this.david.x, this.david.y, txD, tyD);
    if (dd > 3) {
      const step = Math.min(dd, (110 * delta) / 1000);
      const a = Math.atan2(tyD - this.david.y, txD - this.david.x);
      this.david.setPosition(Math.round(this.david.x + Math.cos(a) * step), Math.round(this.david.y + Math.sin(a) * step));
    }
    this.david.setDepth(this.david.y);

    const v = this.cameras.main.worldView;
    if (this.label) {
      const txt =
        this.phase === 0
          ? tr(STAGE4.phase[0])
          : tr(STAGE4.phase[1]).replace("{a}", String(this.arrowsCleared));
      this.label.setText(txt).setPosition(Math.round(v.centerX), Math.round(v.top + this.safeInsetTop() + 4));
    }

    if (!this.running || this.finished || this.dialogueOpen) return;

    if (this.phase === 0) {
      // Update patrolling guards
      for (const g of this.guards) {
        g.y += (g.dir * g.speed * delta) / 1000;
        if (g.y >= g.y2) {
          g.y = g.y2;
          g.dir = -1;
        } else if (g.y <= g.y1) {
          g.y = g.y1;
          g.dir = 1;
        }
        const ry = Math.round(g.y);
        g.spr.setPosition(g.x, ry).setDepth(ry);
        g.zone.setPosition(g.x, ry - 6);

        if (Math.abs(this.player.x - g.x) < 16 && Math.abs(this.player.y - (ry - 6)) < 17) {
          audio.sfx("wrong");
          this.cameras.main.shake(110, 0.004);
          this.player.setVelocity(0, 0);
          this.player.setPosition(START[0][0], START[0][1]);
          this.david.setPosition(START[0][0] - 14, START[0][1] + 10);
          this.talk(STAGE4.speaker, STAGE4.spotted.map(tr));
          return;
        }
      }

      // Transition to Phase 2 when player reaches the palace gate after receiving Jonathan's gift
      if (this.hasCovenantGift && this.player.x >= GATE_X - 18) {
        this.startPhase(1, true);
      }
    } else if (this.phase === 1) {
      // Check crossing each hedgerow in order
      if (this.arrowsCleared < HEDGE_XS.length) {
        const hx = HEDGE_XS[this.arrowsCleared];
        if (Math.abs(this.player.x - hx) < 14) {
          const safeY = LANE_YS[SAFE_LANES[this.arrowsCleared]];
          if (Math.abs(this.player.y - safeY) <= 18) {
            audio.sfx("chime");
            this.sparkleBurst(hx, safeY - 8, 8);
            this.arrowsCleared++;
          } else {
            audio.sfx("wrong");
            this.cameras.main.shake(110, 0.004);
            const resetX = this.arrowsCleared === 0 ? START[1][0] : HEDGE_XS[this.arrowsCleared - 1] + 24;
            this.player.setVelocity(0, 0);
            this.player.setPosition(resetX, 128);
            this.david.setPosition(resetX - 14, 138);
            this.talk(STAGE4.speaker, STAGE4.wrongLane.map(tr));
          }
        }
      }
    }
  }
}
